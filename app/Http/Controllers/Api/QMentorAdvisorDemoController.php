<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ResolvesDemoScope;
use App\Http\Controllers\Controller;
use App\Support\DemoCohort;
use App\Support\DemoData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * الإرشاد الأكاديمي — the advisor's caseload and the instructor's roster (demo build).
 *
 *   GET /api/advisor/me
 *   GET /api/advisor/advisees[?all=1&at_risk=1&q=&level=&faculty_name=]
 *   GET /api/advisor/students/{id}/{plan|profile|predictions|courses|transactions|absences|recommendations|timeline|finals|timetable|blackboard}
 *   GET /api/instructor/students     GET /api/instructor/courses
 *
 * The caller reads only the students the demo scope grants (ResolvesDemoScope).
 */
class QMentorAdvisorDemoController extends Controller
{
    use ResolvesDemoScope;

    public function me(): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['source' => 'unauthenticated', 'data' => null], 401);
        }
        $advisorId = $this->advisorIdFor($u);
        if ($advisorId === null) {
            return response()->json(['source' => 'api', 'data' => null, 'reason' => 'not_an_advisor']);
        }
        $a = DemoCohort::advisor($advisorId);
        $faculty = DemoCohort::faculties()[$a['faculty_no']];

        return response()->json(['source' => 'api', 'data' => [
            'instructor_id' => $a['id'],
            'instructor_name' => $this->isFacultyViewer($u) ? $u->displayName() : $a['name'],
            'faculty_no' => $a['faculty_no'], 'faculty_name' => $faculty['name'],
            'dept_no' => $a['dept_no'], 'dept_name' => $faculty['depts'][$a['dept_no']] ?? null,
            'email' => $this->isFacultyViewer($u) ? ($u->email ?? $a['email']) : $a['email'],
        ]]);
    }

    public function advisees(Request $request): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['source' => 'unauthenticated', 'data' => null], 401);
        }
        $advisorId = $this->advisorIdFor($u);
        if ($advisorId === null) {
            return response()->json(['source' => 'api', 'data' => []]);
        }
        // all=1 — the admin's whole cohort (capped at the riskiest 1,000 on the live build; the demo cohort is smaller).
        $ids = $this->isAdminViewer($u) && $request->boolean('all') ? DemoCohort::ids() : DemoCohort::adviseeIds($advisorId);
        $q = mb_strtolower(trim((string) $request->query('q', '')));
        $level = $request->query('level');
        $facultyName = trim((string) $request->query('faculty_name', ''));
        $atRisk = $request->boolean('at_risk');

        $rows = [];
        foreach ($ids as $id) {
            $s = DemoCohort::all()[$id];
            if ($atRisk && $s['risk']['level'] < 1) {
                continue;
            }
            if ($level !== null && $level !== '' && (int) $level !== $s['risk']['level']) {
                continue;
            }
            if ($facultyName !== '' && $s['faculty_name'] !== $facultyName) {
                continue;
            }
            if ($q !== '' && ! str_contains(mb_strtolower($s['name'].' '.$s['name_en'].' '.$id), $q)) {
                continue;
            }
            $rows[] = DemoCohort::adviseeRow($s);
        }
        usort($rows, fn ($a, $b) => [$b['risk_level'], $b['risk_score']] <=> [$a['risk_level'], $a['risk_score']]);

        return response()->json(['source' => 'api', 'data' => $rows, 'semester' => DemoCohort::SEMESTER]);
    }

    // ── One student's slices ───────────────────────────────────────────────

    public function studentPlan(string $studentId): JsonResponse
    {
        return $this->slice($studentId, function (array $s) use ($studentId) {
            $levels = DemoData::academicPlanLevels($studentId)['levels'];
            foreach ($levels as &$l) {
                $l['required_hours'] = array_sum(array_column($l['details'], 'hours'));
                foreach ($l['details'] as &$d) {
                    $d['status'] = match ($d['status']) { 'passed' => 'passed', 'registered', 'current', 'student_schedule' => 'student_schedule', default => 'remaining' };
                }
                unset($d);
            }
            unset($l);

            return ['levels' => $levels];
        });
    }

    public function studentProfile(string $studentId): JsonResponse
    {
        return $this->slice($studentId, fn (array $s) => DemoData::studentProfile($studentId) + [
            'advisor_name' => $s['advisor_name'], 'advisor_email' => $s['advisor_email'],
            'academic_status' => $s['academic_status'], 'warning_count' => $s['warnings'],
            'data_synced_at' => $s['synced_at'], 'risk_level' => $s['risk']['level'], 'risk_score' => $s['risk']['score'],
        ]);
    }

    public function studentPredictions(string $studentId): JsonResponse
    {
        return $this->slice($studentId, function (array $s) use ($studentId) {
            $letters = [[4.5, 'A'], [4.0, 'B+'], [3.5, 'B'], [3.0, 'C+'], [2.5, 'C'], [2.0, 'D+'], [1.0, 'D'], [0.0, 'F']];
            $remaining = collect(DemoData::academicPlanCourses($studentId))->where('status', 'remaining')->take(6)->values();
            $predictions = [];
            foreach ($remaining as $k => $c) {
                $points = max(0.0, min(5.0, round($s['cumulative_gpa'] + sin(crc32($c['course_code']) % 10) * 0.6 - ($s['risk']['level'] * 0.25), 2)));
                $letter = 'F';
                foreach ($letters as [$min, $l]) {
                    if ($points >= $min) {
                        $letter = $l;
                        break;
                    }
                }
                $predictions[] = [
                    'course_no' => $c['course_code'], 'course_code' => $c['course_code'],
                    'predicted_points' => $points, 'predicted_letter' => $letter,
                    'confidence' => $k < 2 ? 'high' : ($k < 4 ? 'medium' : 'low'),
                    'course_mean' => round(3.1 + (crc32($c['course_code']) % 12) / 10, 2), 'samples' => 60 + crc32($c['course_code']) % 140,
                    'correlated_with' => array_map(fn ($cc) => ['course_no' => $cc['course_code'], 'course_code' => $cc['course_code'], 'r' => round(0.45 + (crc32($cc['course_code'].$c['course_code']) % 40) / 100, 2), 'samples' => 40 + crc32($cc['course_code']) % 90], array_slice($s['courses'], 0, 2)),
                ];
            }

            return ['method' => 'grade-correlation (demo)', 'scale' => '5.0', 'predictions' => $predictions];
        });
    }

    public function studentCourses(string $studentId): JsonResponse
    {
        return $this->slice($studentId, fn (array $s) => array_map(fn ($c) => [
            'course_no' => $c['course_no'], 'course_code' => $c['course_code'], 'course_name' => $c['course_name'], 'course_name_s' => $c['course_name_en'],
            'section' => $c['section'], 'credit_hours' => $c['credit_hours'], 'instructor_name' => $s['advisor_name'],
            'absence_all_percent' => $c['absence_percent'], 'absence_excused_percent' => $c['excused_percent'],
        ], $s['courses']));
    }

    public function studentTransactions(string $studentId): JsonResponse
    {
        return $this->slice($studentId, fn (array $s) => DemoData::transactions($studentId));
    }

    public function studentAbsences(string $studentId): JsonResponse
    {
        return $this->slice($studentId, fn (array $s) => array_map(fn ($c) => [
            'course_code' => $c['course_code'], 'course_name' => $c['course_name'],
            'absence_count' => count($c['absence_dates']), 'allowed' => 24,
            'absence_all_percent' => $c['absence_percent'], 'absence_excused_percent' => $c['excused_percent'],
            'last_absence' => $c['absence_dates'][count($c['absence_dates']) - 1] ?? null,
            'absences' => array_map(fn ($d, $i) => ['absence_date' => $d, 'absence_excused' => $i === 0 ? 1 : 0], $c['absence_dates'], array_keys($c['absence_dates'])),
        ], $s['courses']));
    }

    public function studentRecommendations(string $studentId): JsonResponse
    {
        return $this->slice($studentId, fn (array $s) => self::recommendations($s));
    }

    public function studentTimeline(string $studentId): JsonResponse
    {
        return $this->slice($studentId, fn (array $s) => self::timeline($s));
    }

    public function studentFinals(string $studentId): JsonResponse
    {
        return $this->slice($studentId, fn (array $s) => DemoData::finalExams($studentId));
    }

    public function studentTimetable(string $studentId): JsonResponse
    {
        return $this->slice($studentId, fn (array $s) => DemoData::timetable($studentId));
    }

    public function studentBlackboard(string $studentId): JsonResponse
    {
        return $this->slice($studentId, fn (array $s) => self::blackboard($s));
    }

    // ── The instructor's roster ───────────────────────────────────────────

    public function instructorStudents(): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['source' => 'unauthenticated', 'data' => null], 401);
        }
        $advisorId = $this->advisorIdFor($u);
        if ($advisorId === null) {
            return response()->json(['source' => 'forbidden', 'data' => null], 403);
        }
        $rows = [];
        foreach (DemoCohort::taughtSections($advisorId) as $id => $section) {
            $s = DemoCohort::all()[$id];
            $rows[] = DemoCohort::adviseeRow($s) + [
                'risk_override' => $s['risk']['override'],
                'top_factors' => array_map(fn ($f) => ['id' => $f['id'], 'label' => $f['label'], 'evidence' => $f['evidence']], $s['risk']['top_factors']),
            ] + $section;
        }
        usort($rows, fn ($a, $b) => [$b['risk_level'], $b['risk_score']] <=> [$a['risk_level'], $a['risk_score']]);

        return response()->json(['source' => 'api', 'data' => $rows, 'semester' => DemoCohort::SEMESTER]);
    }

    public function instructorCourses(): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['source' => 'unauthenticated', 'data' => null], 401);
        }
        $advisorId = $this->advisorIdFor($u);
        if ($advisorId === null) {
            return response()->json(['source' => 'forbidden', 'data' => null], 403);
        }
        $courses = [];
        foreach (DemoCohort::taughtSections($advisorId) as $section) {
            $key = $section['course_code'].'-'.$section['section'];
            $courses[$key] ??= ['course_no' => $section['course_code'], 'course_code' => $section['course_code'], 'course_name' => $section['course_name'], 'section' => $section['section'], 'students_count' => 0, 'semester' => DemoCohort::SEMESTER];
            $courses[$key]['students_count']++;
        }

        return response()->json(['source' => 'api', 'data' => array_values($courses)]);
    }

    // ── shared builders (also used by the student's own endpoints) ────────

    /** @return array<int, array<string, mixed>> the stored AI recommendations, riskiest factor first. */
    public static function recommendations(array $s): array
    {
        $out = [];
        $priority = ['urgent', 'important', 'suggestion'];
        foreach ($s['risk']['top_factors'] as $k => $f) {
            $text = match (explode('-', $f['id'])[0]) {
                'A' => ['الحضور المنتظم في '.preg_replace('/^.*في /u', '', $f['evidence']).' — كل محاضرة تقرّبك من حدّ الحرمان أو تبعدك عنه.', 'Attend consistently — every session moves you toward or away from the denial line.'],
                'G' => ['راجع مصدر الخلل في الدرجات مع أستاذ المقرر واطلب ساعات مكتبية قبل الاختبار القادم.', 'Review where the marks slipped with the instructor and book office hours before the next exam.'],
                'S' => ['سلّم الواجبات المتأخرة هذا الأسبوع؛ الواجب بلا درجة يُحسب صفراً في المسار.', 'Submit the overdue assignments this week; an ungraded assignment counts as zero.'],
                'AC' => ['رفع المعدل التراكمي فوق 2.00 هذا الفصل يلغي الإنذار — تابع خطة المعالجة.', 'Raising the cumulative GPA above 2.00 this term clears the warning — follow the action plan.'],
                default => ['التزم بخطة المعالجة وراجع مرشدك الأكاديمي في موعد الأسبوع القادم.', 'Follow the action plan and meet your academic advisor next week.'],
            };
            $out[] = ['id' => 'rec-'.$f['id'], 'title' => $f['label'], 'title_en' => $f['id'], 'description' => $text[0], 'description_en' => $text[1],
                'category' => 'academic', 'priority' => $priority[min(2, $k)], 'indicator' => $f['id'], 'evidence' => $f['evidence'], 'generated_at' => $s['risk']['computed_at']];
        }
        $out[] = ['id' => 'rec-market', 'title' => 'مهارة مطلوبة في سوق العمل', 'title_en' => 'A skill the market asks for', 'description' => 'أضف دورة قصيرة في تحليل البيانات إلى سجلك المهاري — تظهر في 38% من إعلانات تخصصك.', 'description_en' => 'Add a short data-analysis course to your skills record — it appears in 38% of the postings for your major.', 'category' => 'career', 'priority' => 'suggestion', 'indicator' => null, 'evidence' => null, 'generated_at' => $s['risk']['computed_at']];

        return $out;
    }

    /** @return array<int, array<string, mixed>> the student's real events, newest first. */
    public static function timeline(array $s): array
    {
        $events = [];
        foreach ($s['terms'] as $t) {
            $events[] = ['id' => 'term-'.$t['semester'], 'type' => 'academic', 'title' => 'رصد نتائج الفصل '.$t['semester'], 'title_en' => 'Term '.$t['semester'].' results posted', 'description' => "المعدل الفصلي {$t['semester_gpa']} · التراكمي {$t['cumulative_gpa']}", 'description_en' => "Term GPA {$t['semester_gpa']} · cumulative {$t['cumulative_gpa']}", 'date' => '2026-0'.(1 + (int) substr($t['semester'], -1) % 8).'-15'];
        }
        foreach ($s['risk']['history'] as $h) {
            $events[] = ['id' => 'eval-'.$h['computed_at'], 'type' => 'risk', 'title' => 'تقييم الخطر الليلي', 'title_en' => 'Nightly risk evaluation', 'description' => "الدرجة {$h['score']} · المستوى ".DemoCohort::levelMeta($h['level'])['ar'], 'description_en' => "Score {$h['score']} · level ".DemoCohort::levelMeta($h['level'])['key'], 'date' => substr($h['computed_at'], 0, 10)];
        }
        foreach (DemoCohort::alertsFor($s['student_id']) as $a) {
            $events[] = ['id' => 'alert-'.$a['id'], 'type' => 'alert', 'title' => 'تنبيه: '.$a['kind'], 'title_en' => 'Alert: '.$a['kind'], 'description' => $a['top_factors'][0]['evidence'] ?? '', 'description_en' => $a['kind'], 'date' => substr($a['created_at'], 0, 10)];
        }
        if ($s['warnings'] > 0) {
            $events[] = ['id' => 'warn', 'type' => 'warning', 'title' => 'إنذار أكاديمي', 'title_en' => 'Academic warning', 'description' => "{$s['warnings']} إنذار على السجل", 'description_en' => "{$s['warnings']} warning(s) on record", 'date' => '2026-02-12'];
        }
        usort($events, fn ($a, $b) => strcmp($b['date'], $a['date']));

        return array_slice($events, 0, 24);
    }

    /** @return array{grades: array, activity: array, submissions: array} the Blackboard slice per course. */
    public static function blackboard(array $s): array
    {
        $grades = [];
        $submissions = [];
        $courses = [];
        $hours = 0.0;
        foreach ($s['courses'] as $c) {
            $cols = [['id' => 'mid', 'name' => 'Midterm Exam', 'score' => $c['midterm'], 'possible' => 100]];
            foreach ($c['quizzes'] as $i => $q) {
                $cols[] = ['id' => 'q'.($i + 1), 'name' => 'Quiz '.($i + 1), 'score' => $q, 'possible' => 100];
            }
            $subCols = [];
            foreach ($c['assignments'] as $i => $a) {
                $cols[] = ['id' => 'a'.($i + 1), 'name' => 'Assignment '.($i + 1), 'score' => $a > 0 ? $a : null, 'possible' => 100];
                $subCols[] = ['id' => 'a'.($i + 1), 'name' => 'Assignment '.($i + 1), 'due' => date('Y-m-d', strtotime(DemoCohort::TERM_STARTS) + (14 + $i * 14) * 86400), 'submitted' => $a > 0, 'status' => $a > 0 ? 'graded' : 'missing'];
            }
            $grades[$c['course_code']] = $cols;
            $submissions[$c['course_code']] = ['external_id' => 'bb-'.$c['section'], 'last_accessed' => now()->subDays(crc32($c['course_code']) % 5)->toDateTimeString(), 'gradable' => $c['gradable'], 'submitted' => $c['submitted'], 'columns' => $subCols];
            $h = round(max(0.5, 4.5 - $c['absence_percent'] / 8), 1);
            $hours += $h;
            $courses[$c['course_code']] = ['last_accessed' => now()->subDays(crc32($c['course_code']) % 5)->toDateTimeString(), 'hours_per_week' => $h, 'events' => 40 + crc32($c['course_code']) % 120];
        }

        return [
            'grades' => $grades,
            'activity' => ['last_login' => now()->subHours(3 + crc32($s['student_id']) % 60)->toDateTimeString(), 'window_days' => 28, 'logins_per_week' => round(max(1, 9 - $s['risk']['level'] * 2.2), 1), 'hours_per_week' => round($hours, 1), 'sessions' => 30 + crc32($s['student_id']) % 40, 'courses' => $courses, 'source' => 'demo'],
            'submissions' => $submissions,
        ];
    }

    private function slice(string $studentId, callable $build): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['source' => 'unauthenticated', 'data' => null], 401);
        }
        $s = DemoCohort::find($studentId);
        if (! $s || ! $this->mayRead($u, $studentId)) {
            return response()->json(['source' => 'api', 'data' => null, 'error' => 'الطالب خارج حافظتك الإرشادية'], 403);
        }

        return response()->json(['source' => 'api', 'data' => $build($s)]);
    }
}
