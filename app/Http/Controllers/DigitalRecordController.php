<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\DemoData;
use Illuminate\Http\Request;

/**
 * Digital Record — demo build.
 *
 * Every external integration (skill.qu.edu.sa, api.qu.edu.sa, AI labor-
 * market analysis) has been replaced with {@see DemoData}. Faculty can pass
 * ?student_id=<id> to view any student's record; everyone else sees their own.
 */
class DigitalRecordController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $isFaculty = $user instanceof User
            && $user->hasAnyRole(['Faculty', 'Admin', 'Super Admin']);

        // Faculty/Admin can preview any student's record via ?student_id=...
        // Students always see their own. Fallback to the first demo student.
        $impersonate = $request->query('student_id');
        $hasImpersonation = is_string($impersonate) && $impersonate !== '';

        // Faculty land on a roster of all their students rather than a single
        // record — they pick a student to drill into their digital record.
        if ($isFaculty && !$hasImpersonation) {
            $needle   = trim((string) $request->query('q', ''));
            $students = DemoData::students();

            if ($needle !== '') {
                $needleLower = mb_strtolower($needle);
                $students = array_values(array_filter($students, fn ($s) =>
                    mb_strpos(mb_strtolower($s['name']), $needleLower) !== false
                    || mb_strpos((string) $s['student_id'], $needle) !== false
                    || mb_strpos(mb_strtolower($s['major']), $needleLower) !== false));
            }

            return view('digital-record.students', [
                'students' => $students,
                'query'    => $needle,
            ]);
        }

        if ($hasImpersonation && $isFaculty) {
            $studentId = $impersonate;
        } else {
            $studentId = (string) ($user->student_id ?: DemoData::students()[0]['student_id']);
        }

        $semesterId  = $request->query('semester');
        $student     = DemoData::findStudent($studentId) ?? DemoData::students()[0];
        $studentName = $student['name'];

        $skillsResult = DemoData::skills($studentId);
        $countsResult = DemoData::skillsCount($studentId);
        $analysis     = DemoData::marketAnalysis($studentId);
        $topCourses   = DemoData::topCourses($studentId);

        $profile = [
            'major'      => $student['major'],
            'major_en'   => $student['major'],
            'faculty'    => $student['faculty'],
            'faculty_en' => $student['faculty'],
            'gpa'        => $student['gpa'],
        ];

        $apiStatus = [
            'has_token'      => true,
            'profile_ok'     => true,
            'courses_ok'     => true,
            'reason'         => null,
            'profile_reason' => null,
            'courses_reason' => null,
        ];

        $grades = DemoData::grades($studentId);
        $charts = $this->buildCharts($analysis, $topCourses, $skillsResult, $grades);

        return view('digital-record.index', [
            'studentId'         => $studentId,
            'studentName'       => $studentName,
            'semesterId'        => $semesterId,
            'skills'            => $skillsResult,
            'counts'            => $countsResult,
            'isConfigured'      => true,
            'analysis'          => $analysis,
            'analysisAvailable' => true,
            'profile'           => $profile,
            'topCourses'        => $topCourses,
            'apiStatus'         => $apiStatus,
            'charts'            => $charts,
        ]);
    }

    /**
     * Build pre-shaped data for the dashboard charts on سجلك الرقمي.
     * The view passes these straight into Chart.js — no heavy logic in the blade.
     */
    private function buildCharts(?array $analysis, array $topCourses, ?array $skillsResult, array $grades = []): array
    {
        // 1) Market alignment — matched vs gap (count + percentage)
        $marketSkills = $analysis['market_skills'] ?? [];
        $matchedCount = count(array_filter($marketSkills, fn ($m) => !empty($m['matched'])));
        $totalMarket  = count($marketSkills);
        $alignmentPct = $totalMarket > 0 ? (int) round(($matchedCount / $totalMarket) * 100) : 0;

        // 2) Top courses by market relevance — bar chart input.
        $coursesBar = collect($topCourses)
            ->filter(fn ($c) => ($c['relevance'] ?? 0) > 0)
            ->take(6)
            ->map(fn ($c) => [
                'label'     => mb_substr((string) ($c['course_name'] ?? $c['course_code'] ?? '—'), 0, 32),
                'relevance' => (int) ($c['relevance'] ?? 0),
                'grade'     => (string) ($c['letter_grade'] ?? '—'),
            ])
            ->values()
            ->all();

        // 3) Training hours per semester — line chart input (from skill.qu.edu.sa).
        $semestersLine = collect(data_get($skillsResult, 'data.data.semesters', []))
            ->map(fn ($sem) => [
                'label' => (string) ($sem['semester_name'] ?? $sem['name'] ?? 'فصل'),
                'hours' => (float) array_sum(array_map(
                    fn ($s) => (float) (data_get($s, 'hours') ?? data_get($s, 'duration') ?? 0),
                    (array) ($sem['skills'] ?? [])
                )),
                'count' => (int) ($sem['skills_count'] ?? count((array) ($sem['skills'] ?? []))),
            ])
            ->values()
            ->all();

        // 4) Gap-skill weights (top 5) — small horizontal bar so users see priority.
        $topGaps = collect($analysis['gap_skills'] ?? [])
            ->take(5)
            ->map(fn ($g) => [
                'label'  => (string) ($g['skill'] ?? ''),
                'weight' => (int) ($g['weight'] ?? 0),
            ])
            ->values()
            ->all();

        // 5) Skills by category — doughnut. Aggregates category_name across all semesters.
        $categoryCounts = [];
        foreach (data_get($skillsResult, 'data.data.semesters', []) as $sem) {
            foreach ((array) ($sem['skills'] ?? []) as $s) {
                $cat = (string) ($s['category_name'] ?? 'أخرى');
                $categoryCounts[$cat] = ($categoryCounts[$cat] ?? 0) + 1;
            }
        }
        // Pad with a couple of additional categories so the chart is visually rich on the demo dataset.
        $categoryCounts['الأنشطة اللاصفية']   = ($categoryCounts['الأنشطة اللاصفية'] ?? 0) + 3;
        $categoryCounts['التدريب والتطوير']    = ($categoryCounts['التدريب والتطوير'] ?? 0) + 2;
        $categoryCounts['المشاركة المجتمعية']  = ($categoryCounts['المشاركة المجتمعية'] ?? 0) + 2;
        $categoryCounts['البحث العلمي']        = ($categoryCounts['البحث العلمي'] ?? 0) + 1;
        $skillsByCategory = [];
        foreach ($categoryCounts as $label => $count) {
            $skillsByCategory[] = ['label' => $label, 'count' => $count];
        }

        // 6) Course grades — per-course numeric score with its letter grade.
        //    Minus grades (A-, B-, …) are normalised away since the scale we use has none.
        $gradesDistribution = collect($grades)
            ->map(fn ($g) => [
                'label' => mb_substr((string) ($g['course_name'] ?? $g['course_code'] ?? '—'), 0, 32),
                'grade' => str_replace('-', '', (string) ($g['letter_grade'] ?? '—')),
                'score' => (int) ($g['numeric_grade'] ?? 0),
            ])
            ->values()
            ->all();

        return [
            'alignment'    => [
                'matched' => $matchedCount,
                'gap'     => max(0, $totalMarket - $matchedCount),
                'percent' => $alignmentPct,
            ],
            'coursesBar'         => $coursesBar,
            'semestersLine'      => $semestersLine,
            'topGaps'            => $topGaps,
            'skillsByCategory'   => $skillsByCategory,
            'gradesDistribution' => $gradesDistribution,
        ];
    }

}
