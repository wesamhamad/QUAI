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
     * Resolve which student to show data for. Faculty can pass ?as=<student_id>
     * to impersonate any student; everyone else sees their own (or the first
     * demo student if they're not a student themselves).
     */
    private function resolveStudentId(Request $request): string
    {
        $impersonate = $request->query('as');
        if (is_string($impersonate) && $impersonate !== '') {
            $user = Auth::user();
            if ($user instanceof User && ($user->hasAnyRole(['Faculty', 'Admin', 'Super Admin']))) {
                return $impersonate;
            }
        }

        $user = Auth::user();
        if ($user instanceof User && !empty($user->student_id)) {
            return $user->student_id;
        }

        return DemoData::students()[0]['student_id'];
    }

    private function ok(array $data): JsonResponse
    {
        // SPA's useApiWithFallback only trusts source === 'api'. In demo mode the
        // demo data IS the source of truth, so flag it as 'api' to make every
        // page render the same student profile/grades/plan instead of falling
        // back to per-page hard-coded mocks (which used different fake names).
        return response()->json(['data' => $data, 'source' => 'api']);
    }

    public function profile(Request $r): JsonResponse       { return $this->ok(DemoData::studentProfile($this->resolveStudentId($r))); }
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
        $a = DemoData::advisor($this->resolveStudentId($r));
        $name = $a['instructor_name'];
        $parts = explode(' ', trim($name));
        $initials = mb_substr($parts[0] ?? '', 0, 1) . mb_substr($parts[array_key_last($parts)] ?? '', 0, 1);
        return response()->json([
            'data' => [
                'nameAr' => $name, 'nameEn' => $name,
                'titleAr' => 'مرشد أكاديمي', 'titleEn' => 'Academic Advisor',
                'departmentAr' => '', 'departmentEn' => '',
                'officeAr' => $a['office'], 'officeEn' => $a['office'],
                'officeHoursAr' => $a['office_hours'], 'officeHoursEn' => $a['office_hours'],
                'email' => $a['work_email'],
                'initials' => $initials,
            ],
            'source' => 'demo',
        ]);
    }
}
