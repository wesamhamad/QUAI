<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\DemoData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * QMentor API — demo build.
 *
 * Every endpoint used to proxy api.qu.edu.sa / Blackboard / Microsoft Graph.
 * In this demo all responses are served from {@see DemoData}, so the SPA
 * works without any sidecar services. Response shapes are kept compatible
 * with the live api.qu.edu.sa contracts the QMentor SPA's mappers expect.
 */
class QMentorApiController extends Controller
{
    /**
     * The three featured demo students surfaced by the SPA's student switcher.
     * Any signed-in user may view these via ?as=<id> so the demo can walk
     * through the healthy / follow-up / dismissal-risk cases side by side.
     */
    private const FEATURED_STUDENT_IDS = ['443211517', '443100021', '443100022'];

    /**
     * Resolve which student to show data for. Faculty can pass ?as=<student_id>
     * to impersonate any student; in this demo every signed-in user may also
     * pass ?as=<id> for one of the three featured students. Otherwise the
     * caller sees their own data (or the first demo student).
     */
    private function resolveStudentId(Request $request): string
    {
        $impersonate = $request->query('as');
        if (is_string($impersonate) && $impersonate !== '') {
            $user = Auth::user();
            $isPrivileged = $user instanceof User && $user->hasAnyRole(['Faculty', 'Admin', 'Super Admin']);
            if ($isPrivileged || \in_array($impersonate, self::FEATURED_STUDENT_IDS, true)) {
                return $impersonate;
            }
        }

        $user = Auth::user();
        if ($user instanceof User && !empty($user->student_id)) {
            return $user->student_id;
        }

        return DemoData::students()[0]['student_id'];
    }

    /**
     * Whether the request actually has a student to operate on — either a valid
     * ?as=<student_id> override, or the signed-in user is themselves a student.
     * Faculty/Admin browsing QMentor without impersonating anyone do NOT have a
     * student context, so {@see resolveStudentId} would fall back to the first
     * demo student for them — which is wrong for self-facing views like the
     * settings profile.
     */
    private function hasStudentContext(Request $request): bool
    {
        $impersonate = $request->query('as');
        $user = Auth::user();

        if (is_string($impersonate) && $impersonate !== '') {
            $isPrivileged = $user instanceof User && $user->hasAnyRole(['Faculty', 'Admin', 'Super Admin']);
            if ($isPrivileged || \in_array($impersonate, self::FEATURED_STUDENT_IDS, true)) {
                return true;
            }
        }

        return $user instanceof User && !empty($user->student_id);
    }

    /**
     * Profile payload for the signed-in user themselves (faculty/admin) when no
     * student is being impersonated. Mirrors the shape of
     * {@see DemoData::studentProfile} so the SPA settings page renders it the
     * same way — just without student-only fields.
     */
    private function ownProfile(): array
    {
        $user = Auth::user();
        $name = $user instanceof User ? (string) $user->name : '—';

        return [
            'profile' => [
                'student_id' => null,
                'name'       => $name,
                'name_en'    => $name,
                'email'      => $user instanceof User ? (string) $user->email : null,
                'major'      => null,
                'faculty'    => null,
                'status'     => 'active',
            ],
        ];
    }

    private function ok(array $data): JsonResponse
    {
        // SPA's useApiWithFallback only trusts source === 'api'. In demo mode the
        // demo data IS the source of truth, so flag it as 'api' to make every
        // page render the same student profile/grades/plan instead of falling
        // back to per-page hard-coded mocks (which used different fake names).
        return response()->json(['data' => $data, 'source' => 'api']);
    }

    public function profile(Request $r): JsonResponse
    {
        // Faculty/Admin browsing without impersonating a student have no student
        // record — return their own account so the settings page shows them,
        // not the first demo student.
        if (!$this->hasStudentContext($r)) {
            return $this->ok($this->ownProfile());
        }

        return $this->ok(DemoData::studentProfile($this->resolveStudentId($r)));
    }
    public function courses(Request $r): JsonResponse       { return $this->ok(DemoData::currentCourses($this->resolveStudentId($r))); }
    public function transactions(Request $r): JsonResponse  { return $this->ok(DemoData::transactions($this->resolveStudentId($r))); }
    public function timetable(Request $r): JsonResponse     { return $this->ok(DemoData::timetable($this->resolveStudentId($r))); }
    public function exams(Request $r): JsonResponse         { return $this->ok(DemoData::finalExams($this->resolveStudentId($r))); }
    public function absences(Request $r): JsonResponse      { return $this->ok(DemoData::absences($this->resolveStudentId($r))); }
    public function grades(Request $r): JsonResponse        { return $this->ok(DemoData::grades($this->resolveStudentId($r))); }
    public function advisor(Request $r): JsonResponse       { return $this->ok(DemoData::advisor($this->resolveStudentId($r))); }
    public function rewards(Request $r): JsonResponse       { return $this->ok(DemoData::rewards($this->resolveStudentId($r))); }
    public function skills(Request $r): JsonResponse        { return $this->ok(DemoData::skills($this->resolveStudentId($r))); }
    public function calendar(Request $r): JsonResponse      { return $this->ok(DemoData::academicCalendar()); }
    public function departments(Request $r): JsonResponse   { return $this->ok(DemoData::departments()); }

    /**
     * Per-student plan in the QU api v2-ish `{ levels: [{ id, title, details: [...] }] }`
     * shape that the SPA's mapApiToCourses expects.
     */
    public function plan(Request $r): JsonResponse
    {
        $id = $this->resolveStudentId($r);
        $data = DemoData::academicPlanLevels($id);
        return $this->ok([
            'summary' => DemoData::academicPlanSummary($id),
            'plan'    => $data,
            'levels'  => $data['levels'],
        ]);
    }

    /**
     * Per-student available-for-registration list in the shape the SPA's
     * mapApiToAvailableCourses understands.
     */
    public function availableCourses(Request $r): JsonResponse
    {
        return $this->ok(DemoData::availableCoursesForRegistration($this->resolveStudentId($r)));
    }

    public function announcements(Request $r): JsonResponse { return $this->ok(DemoData::announcements($this->resolveStudentId($r))); }
    public function courseContent(Request $r, string $courseId): JsonResponse { return $this->ok([]); }
    public function courseGrades(Request $r, string $courseId): JsonResponse  { return $this->ok([]); }
    public function searchStudents(Request $r, string $name): JsonResponse
    {
        $needle = mb_strtolower($name);
        $hits = array_values(array_filter(DemoData::students(),
            fn ($s) => mb_strpos(mb_strtolower($s['name']), $needle) !== false
                || mb_strpos((string) $s['student_id'], $needle) !== false));
        return $this->ok($hits);
    }
    public function quEvents(Request $r): JsonResponse
    {
        return $this->ok([
            ['id' => 1, 'title' => 'يوم القصيم العلمي', 'startDate' => '2026-05-20', 'location' => 'القاعة الكبرى'],
            ['id' => 2, 'title' => 'ملتقى المهن السنوي', 'startDate' => '2026-06-04', 'location' => 'كلية إدارة الأعمال'],
        ]);
    }

    public function warnings(Request $r): JsonResponse      { return $this->ok(DemoData::warnings($this->resolveStudentId($r))); }
    public function majorChanges(Request $r): JsonResponse  { return $this->ok([]); }
    public function haltReasons(Request $r): JsonResponse   { return $this->ok([]); }
    public function penalties(Request $r): JsonResponse     { return $this->ok([]); }

    /** Per-major plan resolved by major number (faculty browsing a colleague's plan). */
    public function academicPlanByMajor(Request $r, string $majorNo): JsonResponse
    {
        $studentId = $this->studentForMajor($majorNo) ?? $this->resolveStudentId($r);
        return $this->ok([
            'major_no'  => $majorNo,
            'edition'   => '1447-1448',
            'courses'   => DemoData::academicPlanCourses($studentId),
            'levels'    => DemoData::academicPlanLevels($studentId)['levels'],
        ]);
    }

    public function academicPlanSummary(Request $r, string $majorNo): JsonResponse
    {
        $studentId = $this->studentForMajor($majorNo) ?? $this->resolveStudentId($r);
        return $this->ok(DemoData::academicPlanSummary($studentId));
    }

    /** Look up the first student that matches a major_no in the demo roster. */
    private function studentForMajor(string $majorNo): ?string
    {
        foreach (DemoData::students() as $s) {
            if (($s['major_no'] ?? null) === $majorNo) {
                return $s['student_id'];
            }
        }
        return null;
    }

    public function majorsInFaculty(Request $r, ?string $facultyNo = null): JsonResponse
    {
        $facultyNo = $facultyNo ?? (function () use ($r) {
            $id = $this->resolveStudentId($r);
            $s = DemoData::findStudent($id);
            return $s['faculty_no'] ?? null;
        })();
        $rows = [];
        foreach (DemoData::students() as $s) {
            if ($facultyNo !== null && ($s['faculty_no'] ?? null) !== $facultyNo) continue;
            $rows[] = [
                'major_no'    => $s['major_no'],
                'major_name'  => $s['major'],
                'major_name_s'=> $s['major_en'],
                'faculty_no'  => $s['faculty_no'],
                'faculty_name'=> $s['faculty'],
            ];
        }
        return $this->ok($rows);
    }

    public function compareMajor(Request $r, string $targetMajorNo): JsonResponse
    {
        $current = $this->resolveStudentId($r);
        $target  = $this->studentForMajor($targetMajorNo) ?? $current;
        return $this->ok([
            'current' => [
                'major_no' => DemoData::findStudent($current)['major_no'] ?? null,
                'courses'  => DemoData::academicPlanCourses($current),
            ],
            'target' => [
                'major_no' => $targetMajorNo,
                'courses'  => DemoData::academicPlanCourses($target),
            ],
        ]);
    }

    /**
     * The SPA's StudyPlan page expects `{ summary, plan: { courses, levels } }`
     * — summary feeds the Plan Options banner, plan.courses feeds the electives
     * mapper, and plan.levels feeds the prerequisites tree.
     */
    public function academicPlanForMe(Request $r): JsonResponse
    {
        $id     = $this->resolveStudentId($r);
        $rows   = DemoData::academicPlanCourses($id);
        $levels = DemoData::academicPlanLevels($id);

        $earned = 0; $remaining = 0;
        foreach ($rows as $row) {
            $h = (int) ($row['crd_hrs'] ?? 0);
            if (($row['status'] ?? '') === 'passed') $earned += $h;
            elseif (($row['status'] ?? '') === 'remaining') $remaining += $h;
        }
        $summary = array_merge(DemoData::academicPlanSummary($id), [
            'completed_hours' => $earned,
            'remaining_hours' => $remaining,
            'gpa'             => DemoData::findStudent($id)['gpa'] ?? null,
        ]);

        return $this->ok([
            'summary' => $summary,
            'plan'    => [
                'major_no' => DemoData::findStudent($id)['major_no'] ?? null,
                'edition'  => '1447-1448',
                'courses'  => $rows,
                'levels'   => $levels['levels'],
            ],
        ]);
    }

    public function academicAdvisor(Request $r): JsonResponse
    {
        $studentId = $this->resolveStudentId($r);
        $a = DemoData::advisor($studentId);
        $s = DemoData::findStudent($studentId) ?? DemoData::students()[0];
        $name = trim($a['instructor_name']);
        $parts = explode(' ', $name);
        $initials = mb_substr($parts[0] ?? '', 0, 1) . mb_substr($parts[array_key_last($parts)] ?? '', 0, 1);

        // The advisor always belongs to the student's own department and college.
        $departmentAr = 'قسم ' . $s['major'] . ' — ' . $s['faculty'];
        $departmentEn = ($s['major_en'] ?? $s['major']) . ' Dept. — ' . ($s['faculty_en'] ?? $s['faculty']);

        return $this->ok([
            'nameAr' => $name, 'nameEn' => $name,
            'titleAr' => 'مرشد أكاديمي', 'titleEn' => 'Academic Advisor',
            'departmentAr' => $departmentAr, 'departmentEn' => $departmentEn,
            'officeAr' => $a['office'], 'officeEn' => $a['office'],
            'officeHoursAr' => $a['office_hours'], 'officeHoursEn' => $a['office_hours'],
            'email' => $a['work_email'],
            'initials' => $initials,
        ]);
    }
}
