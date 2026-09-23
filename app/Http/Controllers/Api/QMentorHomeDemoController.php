<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ResolvesDemoScope;
use App\Http\Controllers\Controller;
use App\Support\DemoCohort;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * الرئيسية — the per-seat summary behind the +QSpark home page (demo build).
 *
 *   GET /api/home/summary[?seat=advisor|instructor][&faculty=NN]
 *
 * The admin reads the whole cohort by college (`faculty` drills into one
 * college's majors); the faculty account reads its advisees or its taught
 * students; a student is sent to their own dashboard.
 */
class QMentorHomeDemoController extends Controller
{
    use ResolvesDemoScope;

    public function summary(Request $request): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['source' => 'unauthenticated', 'role' => null, 'levels' => [], 'data' => null], 401);
        }
        $levels = DemoCohort::levels();

        if ($this->isAdminViewer($u)) {
            $faculty = trim((string) $request->query('faculty', ''));

            return response()->json(['source' => 'api', 'role' => 'admin', 'levels' => $levels, 'data' => $this->cohort($faculty !== '' ? $faculty : null)]);
        }

        if ($this->isFacultyViewer($u)) {
            $seat = $request->query('seat') === 'instructor' ? 'instructor' : 'advisor';
            $ids = $seat === 'advisor' ? DemoCohort::adviseeIds(DemoCohort::DEMO_INSTRUCTOR_ID) : array_keys(DemoCohort::taughtSections(DemoCohort::DEMO_INSTRUCTOR_ID));

            return response()->json(['source' => 'api', 'role' => $seat, 'levels' => $levels, 'data' => $this->own($ids, $seat)]);
        }

        return response()->json(['source' => 'forbidden', 'role' => 'student', 'levels' => $levels, 'data' => null, 'redirect' => '/qspark-plus/student-dashboard'], 403);
    }

    /** @param array<int, array<string, mixed>> $rows */
    private function totals(array $rows): array
    {
        $byLevel = [0 => 0, 1 => 0, 2 => 0, 3 => 0];
        $absenceHigh = 0;
        $latest = null;
        foreach ($rows as $s) {
            $byLevel[$s['risk']['level']]++;
            $latest = max($latest ?? '', $s['risk']['computed_at']);
            if (max(array_column($s['courses'], 'absence_percent')) >= 15) {
                $absenceHigh++;
            }
        }

        return [
            'students' => count($rows), 'listed' => count($rows), 'scored' => count($rows),
            'by_level' => collect([0, 1, 2, 3])->map(fn ($l) => ['level' => $l] + DemoCohort::levelMeta($l) + ['n' => $byLevel[$l]])->values()->all(),
            'avg_gpa' => $rows ? round(array_sum(array_column($rows, 'cumulative_gpa')) / count($rows), 2) : null,
            'absence_high' => $absenceHigh, 'absence_threshold' => 15,
            'scored_at' => $latest,
        ];
    }

    /** @param array<int, array<string, mixed>> $rows */
    private function group(array $rows, string $by): array
    {
        $groups = [];
        foreach ($rows as $s) {
            $key = $by === 'faculty' ? $s['faculty_no'] : $s['major_no'];
            $g = &$groups[$key];
            $g ??= [
                'key' => $key, 'faculty_no' => $s['faculty_no'], 'faculty_name' => $s['faculty_name'],
                'major_no' => $by === 'major' ? $s['major_no'] : null, 'major_name' => $by === 'major' ? $s['major_name'] : null,
                'name' => $by === 'major' ? $s['major_name'] : $s['faculty_name'],
                'students' => 0, 'scored' => 0, 'levels' => ['L0' => 0, 'L1' => 0, 'L2' => 0, 'L3' => 0], 'high_critical' => 0, 'gpa' => 0.0, 'absence_high' => 0,
                'degree' => $by === 'major' ? 'bachelor' : null, 'degree_label' => $by === 'major' ? 'بكالوريوس' : null,
            ];
            $g['students']++;
            $g['scored']++;
            $g['levels']['L'.$s['risk']['level']]++;
            $g['high_critical'] += $s['risk']['level'] >= 2 ? 1 : 0;
            $g['gpa'] += $s['cumulative_gpa'];
            $g['absence_high'] += max(array_column($s['courses'], 'absence_percent')) >= 15 ? 1 : 0;
            unset($g);
        }
        $out = [];
        foreach ($groups as $g) {
            $n = max(1, $g['students']);
            $g['high_share'] = round($g['high_critical'] / $n * 100, 1);
            $g['avg_gpa'] = round($g['gpa'] / $n, 2);
            $g['absence_share'] = round($g['absence_high'] / $n * 100, 1);
            unset($g['gpa']);
            $out[] = $g;
        }
        usort($out, fn ($a, $b) => $b['high_share'] <=> $a['high_share']);

        return $out;
    }

    /** @param array<int, array<string, mixed>> $rows */
    private function riskyCourses(array $rows): array
    {
        $courses = [];
        foreach ($rows as $s) {
            foreach ($s['courses'] as $c) {
                $r = &$courses[$c['course_code']];
                $r ??= ['course_code' => $c['course_code'], 'course_name' => $c['course_name'], 'students' => 0, 'absent' => 0, 'failed' => 0];
                $r['students']++;
                $r['absent'] += $c['absence_percent'] >= 15 ? 1 : 0;
                $r['failed'] += $c['midterm'] < 50 ? 1 : 0;
                unset($r);
            }
        }
        $out = [];
        foreach ($courses as $c) {
            if ($c['students'] < 4) {
                continue;
            }
            $absence = round($c['absent'] / $c['students'] * 100, 1);
            $failure = round($c['failed'] / $c['students'] * 100, 1);
            $byAbsence = $absence >= $failure;
            $out[] = [
                'course_code' => $c['course_code'], 'course_name' => $c['course_name'],
                'indicator' => $byAbsence ? 'absence' : 'failure', 'indicator_label' => $byAbsence ? 'غياب ≥ 15%' : 'رسوب في الفصل المكتمل',
                'share' => $byAbsence ? $absence : $failure, 'students' => $c['students'], 'affected' => $byAbsence ? $c['absent'] : $c['failed'],
                'absence_share' => $absence, 'failure_share' => $failure, 'failure_semester' => DemoCohort::GRADED_SEMESTER, 'absence_threshold' => 15,
            ];
        }
        usort($out, fn ($a, $b) => $b['share'] <=> $a['share']);

        return array_slice($out, 0, 8);
    }

    /** @param array<int, array<string, mixed>> $rows */
    private function topStudents(array $rows, string $linkBase): array
    {
        usort($rows, fn ($a, $b) => [$b['risk']['level'], $b['risk']['score']] <=> [$a['risk']['level'], $a['risk']['score']]);

        return array_map(fn ($s) => [
            'id' => $s['student_id'], 'name' => $s['name'], 'major' => $s['major_name'], 'gpa' => $s['cumulative_gpa'],
            'level' => $s['risk']['level'], 'level_label' => DemoCohort::levelMeta($s['risk']['level'])['ar'], 'score' => $s['risk']['score'],
            'override' => $s['risk']['override'], 'top_factor' => $s['risk']['top_factors'][0]['label'] ?? null, 'top_factor_evidence' => $s['risk']['top_factors'][0]['evidence'] ?? null,
            'link' => $linkBase.$s['student_id'],
        ], array_slice($rows, 0, 10));
    }

    private function lastSync(): array
    {
        $runs = DemoCohort::syncRuns();
        $last = $runs[0];

        return ['stage' => $last['stage'], 'finished_at' => $last['finished_at'], 'succeeded' => $last['succeeded'], 'failed' => $last['failed']];
    }

    private function cohort(?string $faculty): array
    {
        $all = array_values(DemoCohort::all());
        $rows = $faculty ? array_values(array_filter($all, fn ($s) => $s['faculty_no'] === $faculty)) : $all;
        $byMajor = $this->group($rows, 'major');
        $approvals = DemoCohort::approvals();

        return [
            'scope' => 'cohort',
            'group_by' => $faculty ? 'major' : 'faculty',
            'faculty' => $faculty ? ['faculty_no' => $faculty, 'faculty_name' => DemoCohort::faculties()[$faculty]['name'] ?? null] : null,
            'totals' => $this->totals($rows),
            'groups' => $faculty ? $byMajor : $this->group($rows, 'faculty'),
            'top_majors' => array_slice($byMajor, 0, 8),
            'top_majors_by_degree' => ['bachelor' => array_slice($byMajor, 0, 8)],
            'degree_labels' => ['bachelor' => 'بكالوريوس', 'master' => 'ماجستير', 'doctorate' => 'دكتوراه', 'preparatory' => 'السنة التحضيرية'],
            'risky_courses' => $this->riskyCourses($rows),
            'top_students' => $this->topStudents($rows, '/digital-twin?student='),
            'alerts_7d' => (int) round(count($rows) * 0.31),
            'pending_approvals' => count(array_filter($approvals, fn ($a) => $a['status'] === 'pending')),
            'interventions_7d' => (int) round(count($rows) * 0.09),
            'last_sync' => $this->lastSync(),
            'generated_at' => now()->toDateTimeString(),
        ];
    }

    /** @param array<int, string> $ids */
    private function own(array $ids, string $seat): array
    {
        $rows = array_values(array_map(fn ($id) => DemoCohort::all()[$id], $ids));
        $courses = [];
        if ($seat === 'instructor') {
            foreach (DemoCohort::taughtSections(DemoCohort::DEMO_INSTRUCTOR_ID) as $id => $sec) {
                $s = DemoCohort::all()[$id];
                $key = $sec['course_code'].'-'.$sec['section'];
                $c = &$courses[$key];
                $c ??= ['key' => $key, 'course_code' => $sec['course_code'], 'course_name' => $sec['course_name'], 'section' => $sec['section'], 'students' => 0, 'scored' => 0, 'levels' => ['L0' => 0, 'L1' => 0, 'L2' => 0, 'L3' => 0], 'high_critical' => 0];
                $c['students']++;
                $c['scored']++;
                $c['levels']['L'.$s['risk']['level']]++;
                $c['high_critical'] += $s['risk']['level'] >= 2 ? 1 : 0;
                unset($c);
            }
        }
        $approvals = array_filter(DemoCohort::approvals(), fn ($a) => in_array($a['student_id'], $ids, true) && $a['status'] === 'pending');

        return [
            'scope' => 'own',
            'totals' => $this->totals($rows),
            'risky_courses' => $this->riskyCourses($rows),
            'top_students' => $this->topStudents($rows, $seat === 'advisor' ? '/advisee/' : '/digital-twin?student='),
            'courses' => array_values($courses),
            'alerts_7d' => count(array_filter($rows, fn ($s) => $s['risk']['level'] >= 1)),
            'pending_approvals' => count($approvals),
            'interventions_7d' => count(DemoCohort::interventions(DemoCohort::DEMO_INSTRUCTOR_ID)),
            'last_sync' => $this->lastSync(),
            'generated_at' => now()->toDateTimeString(),
        ];
    }
}
