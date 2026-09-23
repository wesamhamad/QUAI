<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ResolvesDemoScope;
use App\Http\Controllers\Controller;
use App\Support\DemoCohort;
use App\Support\DemoData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * The agent's operations, for the demo build:
 *
 *   approvals / autonomy / interventions      (§8 matrix — ApprovalGate on the live build)
 *   cohort progress / coverage / stream / runs (the nightly chain — CohortSync + queue)
 *   faculty overview                           (FAC-01…04 aggregates)
 *   admin usage                                (لوحة النظام)
 *   agent-core                                 (المرشد الذكي — sources, triggers, counts)
 *   graph events / meeting / email             (Microsoft Graph — not configured here)
 *   student blackboard / recommendations / timeline
 *
 * Reads come from DemoCohort; the few writes (a decision, a logged
 * intervention, a run request) are kept per user in the cache so the demo
 * reacts without a database behind it.
 */
class QMentorOpsDemoController extends Controller
{
    use ResolvesDemoScope;

    // ── Approvals & autonomy ──────────────────────────────────────────────

    public function approvals(): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        $advisorId = $this->advisorIdFor($u);
        if ($advisorId === null) {
            return response()->json(['source' => 'api', 'data' => null, 'error' => 'للمرشدين والمشرف العام فقط'], 403);
        }
        $rows = $this->approvalRows($u);
        if (! $this->isAdminViewer($u)) {
            $rows = array_values(array_filter($rows, fn ($r) => $r['assigned_to'] === $advisorId));
        }
        $rows = array_map(function ($r) {
            unset($r['assigned_to']);

            return $r;
        }, $rows);

        return response()->json(['source' => 'api', 'data' => ['pending' => count(array_filter($rows, fn ($r) => $r['status'] === 'pending')), 'approvals' => $rows]]);
    }

    public function decide(Request $request, int $id): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        $data = $request->validate(['decision' => ['required', 'in:approve,reject'], 'note' => ['nullable', 'string', 'max:500']]);
        $decisions = $this->stateGet($u, 'approvals');
        $status = $data['decision'] === 'approve' ? 'executed' : 'rejected';
        $decisions[$id] = ['status' => $status, 'note' => $data['note'] ?? null, 'at' => now()->toDateTimeString(), 'by' => $u->displayName()];
        $this->statePut($u, 'approvals', $decisions);
        $execution = $status === 'executed' ? ['executed' => true, 'detail' => 'نُفِّذ الإجراء (عرض توضيحي — لا رسالة خارجية)'] : null;

        return response()->json(['source' => 'api', 'data' => ['id' => $id, 'status' => $status, 'execution' => $execution]]);
    }

    public function autonomy(): JsonResponse
    {
        $u = $this->viewer();
        if (! $u || $this->advisorIdFor($u) === null) {
            return response()->json(['source' => 'api', 'data' => null, 'error' => 'للمرشدين والمشرف العام فقط'], 403);
        }
        $tasks = collect(config('qmentor_autonomy.tasks'))->map(fn ($t, $no) => ['no' => $no] + $t)->values();
        $counts = collect($this->approvalRows($u))->countBy('status');

        return response()->json(['source' => 'api', 'data' => [
            'enabled' => (bool) config('qmentor_autonomy.enabled', true),
            'counseling' => config('qmentor_autonomy.counseling'),
            'levels' => config('qmentor_autonomy.levels'),
            'tasks' => $tasks,
            'by_mode' => $tasks->groupBy('mode')->map->count(),
            'approvals' => ['pending' => (int) ($counts['pending'] ?? 0), 'escalated' => (int) ($counts['escalated'] ?? 0),
                'approved' => (int) (($counts['approved'] ?? 0) + ($counts['executed'] ?? 0)), 'rejected' => (int) ($counts['rejected'] ?? 0)],
            'escalation_configured' => true,
            'outward_dispatch' => false,
        ]]);
    }

    /** @return array<int, array<string, mixed>> the approvals with this viewer's decisions applied. */
    private function approvalRows($u): array
    {
        $decisions = $this->stateGet($u, 'approvals');

        return array_map(function ($r) use ($decisions) {
            if (isset($decisions[$r['id']])) {
                $d = $decisions[$r['id']];
                $r['status'] = $d['status'];
                $r['decided_by'] = $d['by'];
                $r['decided_at'] = $d['at'];
                $r['decision_note'] = $d['note'];
                $r['execution'] = $d['status'] === 'executed' ? ['executed' => true, 'detail' => 'نُفِّذ الإجراء (عرض توضيحي)'] : null;
            }

            return $r;
        }, DemoCohort::approvals());
    }

    // ── Interventions ─────────────────────────────────────────────────────

    public function myInterventions(): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        $advisorId = $this->advisorIdFor($u);
        if ($advisorId === null) {
            return response()->json(['source' => 'api', 'data' => ['interventions' => []]]);
        }
        $rows = array_merge($this->stateGet($u, 'interventions'), DemoCohort::interventions($advisorId));
        usort($rows, fn ($a, $b) => strcmp($b['performed_at'], $a['performed_at']));

        return response()->json(['source' => 'api', 'data' => ['interventions' => $rows]]);
    }

    public function interventionsFor(string $studentId): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        if (! $this->mayRead($u, $studentId)) {
            return response()->json(['error' => 'الطالب خارج حافظتك الإرشادية'], 403);
        }
        $rows = array_filter(array_merge($this->stateGet($u, 'interventions'), DemoCohort::interventions(DemoCohort::DEMO_INSTRUCTOR_ID)), fn ($r) => $r['student_id'] === $studentId);

        return response()->json(['source' => 'api', 'data' => ['interventions' => array_values($rows)]]);
    }

    public function storeIntervention(Request $request): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        $data = $request->validate([
            'student_id' => ['required', 'string', 'max:40'], 'type' => ['required', 'string', 'max:40'],
            'note' => ['required', 'string', 'max:2000'], 'outcome' => ['nullable', 'string', 'max:500'], 'follow_up' => ['nullable', 'string', 'max:40'],
        ]);
        if (! $this->mayRead($u, $data['student_id'])) {
            return response()->json(['error' => 'الطالب خارج حافظتك الإرشادية'], 403);
        }
        $labels = ['meeting' => 'لقاء إرشادي', 'call' => 'اتصال هاتفي', 'email' => 'رسالة بريد', 'referral' => 'إحالة', 'plan' => 'خطة معالجة', 'counseling' => 'إحالة للإرشاد النفسي'];
        $rows = $this->stateGet($u, 'interventions');
        $row = [
            'id' => 5000 + count($rows) + 1, 'student_id' => $data['student_id'], 'student_name' => DemoCohort::find($data['student_id'])['name'] ?? $data['student_id'],
            'type' => $data['type'], 'label' => $labels[$data['type']] ?? $data['type'], 'note' => $data['note'],
            'outcome' => $data['outcome'] ?? null, 'follow_up' => $data['follow_up'] ?? null, 'performed_at' => now()->toDateTimeString(),
        ];
        array_unshift($rows, $row);
        $this->statePut($u, 'interventions', $rows);

        return response()->json(['source' => 'api', 'data' => $row], 201);
    }

    // ── The nightly chain ─────────────────────────────────────────────────

    /** @return array<string, mixed> the progress snapshot the agent-activity page draws. */
    private function snapshot($u): array
    {
        $cohort = count(DemoCohort::all());
        $run = $this->stateGet($u, 'cohort-run');
        $running = null;
        $queued = 0;
        $elapsed = $run && isset($run['started']) ? max(0, now()->timestamp - strtotime($run['started'])) : null;
        if ($elapsed !== null && $elapsed < 90) {
            $stages = $run['stages'];
            $idx = min(count($stages) - 1, intdiv((int) $elapsed, 12));
            $running = ['stage' => $stages[$idx], 'since' => $run['started'], 'pending' => max(0, $cohort - (int) ($cohort * (($elapsed % 12) / 12))), 'streams' => $run['streams'] ?? 4];
            $queued = max(0, count($stages) - $idx - 1);
        }
        $colleges = [];
        foreach (DemoCohort::faculties() as $no => $f) {
            $n = count(array_filter(DemoCohort::all(), fn ($s) => $s['faculty_no'] === $no));
            $colleges[] = ['faculty_no' => $no, 'name' => $f['name'], 'expected' => $n, 'total' => $n, 'academic' => $n, 'profile' => $n, 'blackboard' => $n - ($no === '03' ? 1 : 0),
                'errors' => ['academic' => 0, 'profile' => 0, 'blackboard' => $no === '03' ? 1 : 0], 'scored' => $n, 'users' => $n, 'analyzed' => $n, 'last_profile' => '2026-09-23 02:40:00'];
        }
        $stage = fn (int $done, int $errors = 0) => ['total' => $cohort, 'done' => $done, 'errors' => $errors, 'pct' => round($done / max(1, $cohort) * 100, 1)];

        return [
            'at' => now()->toDateTimeString(), 'enabled' => (bool) config('qmentor_autonomy.enabled', true), 'cohort' => $cohort,
            'roster' => ['done' => true, 'last' => '2026-09-23 01:04:00', 'note' => 'ثماني كليات · '.$cohort.' طالباً'],
            'stages' => ['academic' => $stage($cohort), 'profile' => $stage($cohort), 'blackboard' => $stage($cohort - 1, 1)],
            'workers' => 4,
            'scope' => ['expected' => $cohort, 'faculties' => array_map(fn ($c) => ['faculty_no' => $c['faculty_no'], 'name' => $c['name'], 'expected' => $c['expected'], 'total' => $c['total'], 'academic' => $c['academic'], 'profile' => $c['profile'], 'blackboard' => $c['blackboard'], 'scored' => $c['scored']], $colleges)],
            'users' => ['students' => $cohort, 'instructors' => count(DemoCohort::advisors()), 'cohort' => $cohort, 'faculty' => count(DemoCohort::advisors())],
            'analyze' => ['done' => $cohort, 'total' => $cohort, 'last' => '2026-09-23 03:12:00', 'tokens' => 1842000],
            'score' => ['done' => $cohort, 'total' => $cohort, 'pct' => 100.0, 'last' => '2026-09-23 02:52:00', 'note' => 'النموذج '.DemoCohort::MODEL_VERSION],
            'alerts' => ['last' => '2026-09-23 02:54:00', 'note' => '14 تنبيهاً · 3 إحالات', 'created' => 14],
            'evidence' => ['last' => '2026-09-13 18:20:00'],
            'queued' => $queued, 'reserved' => $running ? 1 : 0, 'running' => $running,
            'recent_runs' => array_slice(DemoCohort::syncRuns(), 0, 16),
            'colleges' => $colleges,
            'college_run' => $run ? ['token' => (string) ($run['token'] ?? 'demo'), 'faculty' => (string) ($run['faculty'] ?? 'all'), 'stages' => $run['stages'], 'streams' => $run['streams'] ?? 4, 'at' => $run['started'], 'by' => $run['by'] ?? '', 'current' => $running !== null] : null,
        ];
    }

    public function progress(): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }

        return response()->json(['source' => 'api', 'data' => $this->snapshot($u)]);
    }

    public function coverage(): JsonResponse
    {
        $u = $this->viewer();
        if (! $u || ! $this->isAdminViewer($u)) {
            return response()->json(['source' => 'api', 'data' => null, 'error' => 'للمشرف العام فقط'], 403);
        }
        $rows = [];
        $inFeed = 0;
        $inCohort = 0;
        foreach (DemoCohort::faculties() as $no => $f) {
            $n = count(array_filter(DemoCohort::all(), fn ($s) => $s['faculty_no'] === $no));
            $missing = (int) round($n * 0.06);
            $rows[] = ['faculty_no' => $no, 'faculty_name' => $f['name'], 'in_feed' => $n + $missing, 'in_cohort' => $n, 'missing' => $missing, 'reason' => 'طلاب بلا مقررات مسجّلة هذا الفصل (منقطعون أو مؤجّلون)'];
            $inFeed += $n + $missing;
            $inCohort += $n;
        }

        return response()->json(['source' => 'api', 'data' => ['measured' => true, 'in_scope' => $inCohort, 'semester' => DemoCohort::SEMESTER, 'measured_at' => '2026-09-23 01:04:00', 'in_feed' => $inFeed, 'missing' => $inFeed - $inCohort, 'rows' => $rows]]);
    }

    public function preview(Request $request): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        $streams = max(1, min(8, (int) $request->query('streams', 4)));
        $faculties = [];
        foreach (DemoCohort::faculties() as $no => $f) {
            $faculties[] = ['name' => $f['name'], 'expected' => count(array_filter(DemoCohort::all(), fn ($s) => $s['faculty_no'] === $no)), 'fresh_today' => in_array($no, ['01', '02'], true)];
        }

        return response()->json(['source' => 'api', 'data' => [
            'expected_students' => count(DemoCohort::all()), 'estimated_label' => (int) ceil(6 / $streams).' دقائق',
            'faculties' => $faculties, 'stages' => ['roster', 'academic', 'profile', 'blackboard', 'score', 'alerts', 'users', 'analyze'],
        ]]);
    }

    public function stream(): StreamedResponse
    {
        $u = $this->viewer();

        return response()->stream(function () use ($u) {
            // A short-lived feed: a few snapshots, then `end` so the page reopens it.
            for ($i = 0; $i < 6; $i++) {
                echo "event: progress\ndata: ".json_encode($this->snapshot($u), JSON_UNESCAPED_UNICODE)."\n\n";
                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();
                if (connection_aborted()) {
                    return;
                }
                sleep(5);
            }
            echo "event: end\ndata: {}\n\n";
            flush();
        }, 200, ['Content-Type' => 'text/event-stream', 'Cache-Control' => 'no-cache', 'X-Accel-Buffering' => 'no']);
    }

    public function start(Request $request): JsonResponse
    {
        return $this->enqueue($request, 'all', ['roster', 'academic', 'profile', 'blackboard', 'score', 'alerts', 'users']);
    }

    public function startScope(Request $request): JsonResponse
    {
        $r = $this->enqueue($request, 'all', ['roster', 'academic', 'profile', 'blackboard', 'score', 'alerts', 'users', 'analyze']);
        $data = $r->getData(true);
        if (isset($data['data'])) {
            $data['data'] += ['faculties' => array_keys(DemoCohort::faculties()), 'skipped_fresh' => $request->boolean('refresh_fresh') ? 0 : 2, 'estimated_label' => '6 دقائق'];
        }

        return response()->json($data, $r->getStatusCode());
    }

    public function startFaculty(Request $request): JsonResponse
    {
        $faculty = (string) $request->input('faculty', 'all');
        $stage = (string) $request->input('stage', 'all');
        $until = (string) $request->input('until', 'analyze');
        $all = ['roster', 'academic', 'profile', 'blackboard', 'score', 'alerts', 'users', 'analyze'];
        $from = $stage === 'all' || $stage === 'auto' ? 0 : max(0, array_search($stage, $all, true));
        $to = array_search($until, $all, true);
        $stages = array_slice($all, $from, ($to === false ? count($all) : $to + 1) - $from);

        return $this->enqueue($request, $faculty, $stages ?: $all);
    }

    public function stop(): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        $run = $this->stateGet($u, 'cohort-run');
        $this->statePut($u, 'cohort-run', []);

        return response()->json(['source' => 'api', 'data' => ['removed' => $run ? count($run['stages'] ?? []) : 0, 'note' => 'أُوقفت السلسلة التوضيحية.']]);
    }

    /** @param array<int, string> $stages */
    private function enqueue(Request $request, string $faculty, array $stages): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        if (! $this->isAdminViewer($u)) {
            return response()->json(['error' => 'للمشرف العام فقط'], 403);
        }
        $existing = $this->stateGet($u, 'cohort-run');
        if ($existing && isset($existing['started']) && max(0, now()->timestamp - strtotime($existing['started'])) < 90) {
            return response()->json(['error' => 'سلسلة قيد التنفيذ — انتظر انتهاءها أو أوقفها أولاً'], 409);
        }
        $stage = (string) $request->input('stage', 'all');
        if ($stage !== 'all' && $stage !== 'auto' && in_array($stage, $stages, true)) {
            $stages = array_slice($stages, array_search($stage, $stages, true));
        }
        $this->statePut($u, 'cohort-run', ['started' => now()->toDateTimeString(), 'stages' => $stages, 'streams' => (int) $request->input('streams', 4), 'faculty' => $faculty, 'by' => $u->displayName(), 'token' => substr(md5((string) microtime(true)), 0, 8)]);

        return response()->json(['source' => 'api', 'data' => ['queued' => true, 'stage' => $stage, 'reset' => $request->boolean('reset_stamp') ? count(DemoCohort::all()) : null, 'stages' => $stages, 'note' => 'عرض توضيحي: تُحاكى المراحل خلال دقيقة ونصف']]);
    }

    // ── لوحة هيئة التدريس ─────────────────────────────────────────────────

    public function facultyOverview(Request $request): JsonResponse
    {
        $u = $this->viewer();
        if (! $u || $this->advisorIdFor($u) === null) {
            return response()->json(['source' => 'api', 'data' => null], 403);
        }
        $only = trim((string) $request->query('faculty', ''));
        $all = array_values(DemoCohort::all());
        $colleges = [];
        $courses = [];
        $heatmap = [];
        foreach (DemoCohort::faculties() as $no => $f) {
            if ($only !== '' && $only !== $no) {
                continue;
            }
            $rows = array_values(array_filter($all, fn ($s) => $s['faculty_no'] === $no));
            $depts = [];
            foreach ($rows as $s) {
                $d = &$depts[$s['dept_no']];
                $d ??= ['id' => $no.'-'.$s['dept_no'], 'dept_no' => $s['dept_no'], 'name' => $s['dept_name'], 'students' => 0, 'gpa' => 0.0, 'at_risk' => 0, 'scored' => 0, 'dfw' => 0];
                $d['students']++;
                $d['scored']++;
                $d['gpa'] += $s['cumulative_gpa'];
                $d['at_risk'] += $s['risk']['level'] >= 2 ? 1 : 0;
                $d['dfw'] += $s['failed_courses'] > 0 ? 1 : 0;
                unset($d);
                foreach ($s['courses'] as $c) {
                    $cc = &$courses[$c['course_code']];
                    $cc ??= ['id' => $c['course_code'], 'code' => $c['course_code'], 'name' => $c['course_name'], 'faculty_no' => $no, 'dept_id' => $no.'-'.$s['dept_no'], 'dept_name' => $s['dept_name'], 'enrollment' => 0, 'graded' => 0, 'sum' => 0.0, 'pass' => 0, 'dfw' => 0, 'dist' => ['aPlus' => 0, 'a' => 0, 'bPlus' => 0, 'b' => 0, 'cPlus' => 0, 'c' => 0, 'dPlus' => 0, 'd' => 0, 'f' => 0]];
                    $grade = ($c['midterm'] + array_sum($c['quizzes']) / 4 + array_sum($c['assignments']) / 5) / 3;
                    $cc['enrollment']++;
                    $cc['graded']++;
                    $cc['sum'] += $grade;
                    $cc['pass'] += $grade >= 60 ? 1 : 0;
                    $cc['dfw'] += $grade < 65 ? 1 : 0;
                    $bucket = $grade >= 95 ? 'aPlus' : ($grade >= 90 ? 'a' : ($grade >= 85 ? 'bPlus' : ($grade >= 80 ? 'b' : ($grade >= 75 ? 'cPlus' : ($grade >= 70 ? 'c' : ($grade >= 65 ? 'dPlus' : ($grade >= 60 ? 'd' : 'f')))))));
                    $cc['dist'][$bucket]++;
                    unset($cc);
                }
            }
            $n = max(1, count($rows));
            $colleges[] = [
                'id' => $no, 'name' => $f['name'], 'students' => count($rows), 'avg_gpa' => round(array_sum(array_column($rows, 'cumulative_gpa')) / $n, 2),
                'at_risk' => count(array_filter($rows, fn ($s) => $s['risk']['level'] >= 2)), 'scored' => count($rows),
                'dfw_rate' => round(count(array_filter($rows, fn ($s) => $s['failed_courses'] > 0)) / $n * 100, 1),
                'departments' => array_values(array_map(fn ($d) => ['id' => $d['id'], 'dept_no' => $d['dept_no'], 'name' => $d['name'], 'students' => $d['students'], 'avg_gpa' => round($d['gpa'] / max(1, $d['students']), 2), 'at_risk' => $d['at_risk'], 'scored' => $d['scored'], 'dfw_rate' => round($d['dfw'] / max(1, $d['students']) * 100, 1)], $depts)),
            ];
        }
        $courseRows = [];
        foreach ($courses as $c) {
            $avg = round($c['sum'] / max(1, $c['graded']), 1);
            $pass = round($c['pass'] / max(1, $c['graded']) * 100, 1);
            $courseRows[] = ['id' => $c['id'], 'code' => $c['code'], 'name' => $c['name'], 'faculty_no' => $c['faculty_no'], 'enrollment' => $c['enrollment'], 'graded' => $c['graded'], 'avg_grade' => $avg, 'pass_rate' => $pass, 'dfw_rate' => round($c['dfw'] / max(1, $c['graded']) * 100, 1), 'distribution' => $c['dist']];
            $heatmap[] = ['course_code' => $c['code'], 'faculty_no' => $c['faculty_no'], 'dept_id' => $c['dept_id'], 'dept_name' => $c['dept_name'], 'graded' => $c['graded'], 'pass_rate' => $pass, 'avg_grade' => $avg];
        }
        $trends = [];
        foreach (['461', '462', '463', '464', '465'] as $k => $sem) {
            $trends[] = ['semester' => $sem, 'students' => count($all) - (4 - $k) * 9, 'avg_gpa' => round(3.28 + $k * 0.03, 2), 'dfw_rate' => round(14.8 - $k * 0.6, 1), 'at_risk' => (int) round(count($all) * (0.24 - $k * 0.012))];
        }

        return response()->json(['source' => 'api', 'data' => [
            'roster_semester' => DemoCohort::SEMESTER, 'graded_semester' => DemoCohort::GRADED_SEMESTER, 'generated_at' => now()->toDateTimeString(),
            'note' => 'بيانات توضيحية — دفعة تركيبية من '.count($all).' طالباً في ثماني كليات',
            'colleges' => $colleges, 'courses' => $courseRows, 'heatmap' => $heatmap, 'trends' => $trends,
        ]]);
    }

    // ── لوحة النظام ───────────────────────────────────────────────────────

    public function adminUsage(Request $request): JsonResponse
    {
        $u = $this->viewer();
        if (! $u || ! $this->isAdminViewer($u)) {
            return response()->json(['source' => 'api', 'data' => null, 'error' => 'للمشرف العام فقط'], 403);
        }

        return response()->json(['source' => 'api', 'data' => $this->usage($request)]);
    }

    public function adminUsageExport(Request $request)
    {
        $u = $this->viewer();
        if (! $u || ! $this->isAdminViewer($u)) {
            return response()->json(['error' => 'للمشرف العام فقط'], 403);
        }
        $usage = $this->usage($request);
        $lines = ["\xEF\xBB\xBFday,requests,users,avg_ms,errors"];
        foreach ($usage['daily'] as $d) {
            $lines[] = implode(',', [$d['d'], $d['requests'], $d['users'], $d['avg_ms'], $d['errors']]);
        }

        return response(implode("\n", $lines), 200, ['Content-Type' => 'text/csv; charset=UTF-8', 'Content-Disposition' => 'attachment; filename="qmentor-usage.csv"']);
    }

    private function usage(Request $request): array
    {
        $period = (string) $request->query('period', '');
        $days = (int) $request->query('days', 30);
        $days = $period !== '' ? 90 : max(7, min(365, $days));
        $cohort = count(DemoCohort::all());
        $daily = [];
        $hourly = array_fill(0, 24, 0);
        for ($d = $days - 1; $d >= 0; $d--) {
            $date = now()->subDays($d);
            $weekend = in_array($date->dayOfWeek, [5, 6], true);
            $req = (int) round(($weekend ? 320 : 1450) + sin($d / 3) * 180 + ($d % 7) * 25);
            $daily[] = ['d' => $date->toDateString(), 'requests' => $req, 'users' => (int) round($req / 11), 'avg_ms' => 180 + ($d % 9) * 7, 'errors' => $d % 6 === 0 ? 3 : 1];
        }
        foreach (range(0, 23) as $h) {
            $hourly[$h] = (int) round(($h >= 8 && $h <= 15 ? 260 : ($h >= 16 && $h <= 22 ? 140 : 18)) + sin($h) * 20);
        }
        $requests = array_sum(array_column($daily, 'requests'));
        $errors = array_sum(array_column($daily, 'errors'));
        $org = ['faculties' => [], 'departments' => [], 'majors' => [], 'active_students' => (int) round($cohort * 0.71)];
        foreach (DemoCohort::faculties() as $no => $f) {
            $rows = array_filter(DemoCohort::all(), fn ($s) => $s['faculty_no'] === $no);
            $n = count($rows);
            $org['faculties'][] = ['faculty_no' => $no, 'faculty_name' => $f['name'], 'students' => $n, 'accounts' => $n, 'active' => (int) round($n * 0.7), 'departments' => count($f['depts']), 'majors' => count($f['majors'])];
            foreach ($f['majors'] as $mno => [$mname]) {
                $m = count(array_filter($rows, fn ($s) => $s['major_no'] === $mno));
                $org['departments'][] = ['faculty_no' => $no, 'faculty_name' => $f['name'], 'dept_no' => $mno, 'dept_name' => $f['depts'][$mno] ?? $mname, 'students' => $m, 'majors' => 1, 'active' => (int) round($m * 0.7)];
                $org['majors'][] = ['faculty_no' => $no, 'faculty_name' => $f['name'], 'major_no' => $mno, 'major_name' => $mname, 'students' => $m];
            }
        }
        $levels = ['L0' => 0, 'L1' => 0, 'L2' => 0, 'L3' => 0];
        foreach (DemoCohort::all() as $s) {
            $levels['L'.$s['risk']['level']]++;
        }
        $approvals = collect(DemoCohort::approvals())->countBy('status');
        $features = [
            ['feature' => 'digital-twin', 'requests' => (int) ($requests * 0.22), 'users' => 96, 'avg_ms' => 240, 'max_ms' => 1820, 'errors' => 4, 'last_at' => now()->subMinutes(4)->toDateTimeString()],
            ['feature' => 'student-dashboard', 'requests' => (int) ($requests * 0.19), 'users' => 141, 'avg_ms' => 190, 'max_ms' => 1310, 'errors' => 2, 'last_at' => now()->subMinutes(2)->toDateTimeString()],
            ['feature' => 'advisor-dashboard', 'requests' => (int) ($requests * 0.14), 'users' => 23, 'avg_ms' => 310, 'max_ms' => 2400, 'errors' => 3, 'last_at' => now()->subMinutes(9)->toDateTimeString()],
            ['feature' => 'chatbot', 'requests' => (int) ($requests * 0.12), 'users' => 88, 'avg_ms' => 920, 'max_ms' => 6100, 'errors' => 5, 'last_at' => now()->subMinutes(1)->toDateTimeString()],
            ['feature' => 'alerts', 'requests' => (int) ($requests * 0.11), 'users' => 132, 'avg_ms' => 120, 'max_ms' => 800, 'errors' => 0, 'last_at' => now()->subMinutes(6)->toDateTimeString()],
            ['feature' => 'digital-record', 'requests' => (int) ($requests * 0.09), 'users' => 74, 'avg_ms' => 410, 'max_ms' => 3900, 'errors' => 2, 'last_at' => now()->subMinutes(12)->toDateTimeString()],
            ['feature' => 'agent-activity', 'requests' => (int) ($requests * 0.07), 'users' => 6, 'avg_ms' => 160, 'max_ms' => 720, 'errors' => 0, 'last_at' => now()->subMinutes(3)->toDateTimeString()],
            ['feature' => 'study-plan', 'requests' => (int) ($requests * 0.06), 'users' => 67, 'avg_ms' => 210, 'max_ms' => 1500, 'errors' => 1, 'last_at' => now()->subMinutes(20)->toDateTimeString()],
        ];

        return [
            'generated_at' => now()->toDateTimeString(),
            'window' => ['from' => now()->subDays($days)->toDateString(), 'to' => now()->toDateString(), 'label' => $period !== '' ? "الفصل {$period}" : "آخر {$days} يوماً"],
            'header' => ['environment' => 'demo', 'scope' => 'دفعة توضيحية — ثماني كليات · '.$cohort.' طالباً', 'period' => $period !== '' ? $period : "{$days}d", 'last_sync' => '2026-09-23 02:52:00', 'model_version' => DemoCohort::MODEL_VERSION],
            'platform' => ['p95_ms' => 640, 'requests' => $requests, 'avg_ms' => 205, 'errors' => $errors],
            'components' => [
                ['key' => 'qmentor', 'ar' => 'QMentor / +QSpark', 'requests' => (int) ($requests * 0.58), 'users' => 212, 'faculties' => 8, 'avg_ms' => 210, 'errors' => (int) ($errors * 0.5)],
                ['key' => 'qspark', 'ar' => 'QSpark — منصة التعلم', 'requests' => (int) ($requests * 0.27), 'users' => 168, 'faculties' => 8, 'avg_ms' => 180, 'errors' => (int) ($errors * 0.3)],
                ['key' => 'digital_record', 'ar' => 'السجل الرقمي', 'requests' => (int) ($requests * 0.15), 'users' => 74, 'faculties' => 6, 'avg_ms' => 410, 'errors' => (int) ($errors * 0.2)],
            ],
            'org' => $org,
            'outcomes' => ['scored' => $cohort, 'scored_in_window' => $cohort, 'levels' => $levels, 'interventions' => 31, 'agent_actions' => 118, 'approved_plans' => (int) (($approvals['approved'] ?? 0) + ($approvals['executed'] ?? 0)), 'pending_approvals' => (int) ($approvals['pending'] ?? 0), 'counseling_referrals' => 3, 'closed_measured' => 12, 'closed_resolved' => 9, 'alerts' => 214, 'alerts_by_channel' => ['platform' => 171, 'email' => 43], 'analyses' => $cohort],
            'users' => ['total' => $cohort + 11, 'students' => $cohort, 'instructors' => 8, 'staff' => 3, 'active_7d' => (int) round($cohort * 0.46), 'active_30d' => (int) round($cohort * 0.71), 'new_30d' => 12, 'enabled' => $cohort + 11],
            'totals' => ['p95_ms' => 640, 'requests' => $requests, 'users' => (int) round($cohort * 0.71), 'anonymous' => 96, 'days_seen' => $days, 'avg_ms' => 205.0, 'errors' => $errors, 'rejected' => 7, 'requests_today' => $daily[count($daily) - 1]['requests'], 'users_today' => $daily[count($daily) - 1]['users']],
            'sessions' => ['live_now' => 17, 'sessions' => (int) round($requests / 38), 'avg_minutes' => 11.4, 'avg_requests' => 38.0],
            'daily' => $daily,
            'hourly' => $hourly,
            'features' => $features,
            'slowest' => [['path' => '/api/qmentor/risk/cohort', 'n' => 412, 'avg_ms' => 980, 'max_ms' => 4200], ['path' => '/api/advisor/advisees', 'n' => 1230, 'avg_ms' => 460, 'max_ms' => 2900], ['path' => '/api/qmentor/student/plan', 'n' => 2210, 'avg_ms' => 330, 'max_ms' => 1900], ['path' => '/api/home/summary', 'n' => 760, 'avg_ms' => 290, 'max_ms' => 1600]],
            'by_type' => [['user_type' => 'student', 'requests' => (int) ($requests * 0.71), 'users' => (int) round($cohort * 0.7)], ['user_type' => 'faculty', 'requests' => (int) ($requests * 0.24), 'users' => 8], ['user_type' => 'admin', 'requests' => (int) ($requests * 0.05), 'users' => 3]],
        ];
    }

    // ── المرشد الذكي ──────────────────────────────────────────────────────

    public function agentCore(Request $request): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['data' => null, 'source' => 'unauthenticated']);
        }
        $caseload = $this->isFacultyViewer($u);
        $ids = $caseload ? $this->readableIds($u) : DemoCohort::ids();
        $rows = array_map(fn ($id) => DemoCohort::all()[$id], $ids);
        $n = fn (callable $f) => count(array_filter($rows, $f));
        $term = DemoCohort::term();

        $triggerDefs = [
            ['T1', 'رسوب في ٣ مقررات فأكثر في فصل واحد', 'critical', 'bulk', 'الطالب الذي رسب في ثلاثة مقررات فأكثر في الفصل المكتمل الأخير.', 14, fn ($s) => $s['failed_courses'] >= 3],
            ['T2', 'تكرار الرسوب في المقرر نفسه', 'critical', 'bulk', 'مقرر رسب فيه الطالب مرتين فأكثر عبر الفصول.', 14, fn ($s) => $s['failed_courses'] >= 2 && $s['cumulative_gpa'] < 2.6],
            ['T3', 'معدل فصلي منخفض جداً — احتمال رسوب', 'high', 'bulk', 'معدل فصلي دون الحدّ في آخر فصل مكتمل — رسوب محتمل إن استمر.', 21, fn ($s) => $s['semester_gpa'] < 2.0],
            ['T4', 'هبوط حاد في المعدل الفصلي', 'high', 'bulk', 'هبوط في المعدل الفصلي بمقدار الحدّ فأكثر بين فصلين متتاليين.', 21, fn ($s) => count($s['terms']) >= 2 && ($s['terms'][count($s['terms']) - 2]['semester_gpa'] - $s['terms'][count($s['terms']) - 1]['semester_gpa']) >= 0.5],
            ['T5', 'لم يسجّل مقررات للفصل القادم', 'high', 'bulk', 'طالب نشط لم يسجّل أي مقرر بعد أيام من فتح التسجيل.', 7, fn ($s) => false],
            ['T6', 'انقطاع فصل أو أكثر ثم عودة', 'high', 'bulk', 'طالب انقطع فصلاً فأكثر ثم عاد إلى التسجيل هذا الفصل.', 14, fn ($s) => crc32($s['student_id']) % 37 === 0],
            ['T7', 'انحراف عن الخطة الدراسية', 'medium', 'advisor', 'مقررات مسجّلة خارج تسلسل الخطة الدراسية أو متطلبات مؤجَّلة.', 21, fn ($s) => $s['passed_hours'] < ($s['student_level'] - 1) * 15 - 6],
            ['T8', 'مرشّح للتخرج', 'medium', 'advisor', 'طالب بقي له مقرران فأقل للتخرج — لقاء الإنهاء لا الإنقاذ.', 21, fn ($s) => $s['remaining_hours'] <= 6],
            ['T9', 'تنبؤ نموذج التعثّر', 'medium', 'advisor', 'احتمال تعثّر من نموذج التنبؤ يبلغ الحدّ فأكثر.', 30, fn ($s) => $s['risk']['level'] >= 2],
            ['T10', 'إنذار أكاديمي · إيقاف قيد · عقوبة', 'critical', 'bulk', 'إنذار أكاديمي نشط أو إيقاف قيد أو عقوبة مسجّلة على الطالب.', 3, fn ($s) => $s['warnings'] > 0],
            ['T11', 'غياب متراكم يقارب الحرمان', 'high', 'bulk', 'نسبة غياب متراكمة تقترب من حدّ الحرمان في مقرر.', 7, fn ($s) => max(array_column($s['courses'], 'absence_percent')) >= 15],
            ['T12', 'أسئلة يتعثّر فيها الطلاب على QSpark', 'medium', 'advisor', 'سؤال أُخطئ فيه أو تُرك بلا إجابة بنسبة تتجاوز الحدّ في منصة التعلم.', 14, fn ($s) => crc32('q'.$s['student_id']) % 9 === 0],
        ];
        $severity = ['critical' => 'حرجة', 'high' => 'مرتفعة', 'medium' => 'متوسطة'];
        $tiers = ['bulk' => 'كشف جماعي', 'advisor' => 'مراجعة المرشد'];
        $triggers = [];
        $matched = 0;
        foreach ($triggerDefs as [$code, $label, $sev, $tier, $detects, $window, $pred]) {
            $now = $n($pred);
            $matched += $now;
            $available = $code !== 'T5';
            $triggers[] = [
                'code' => $code, 'label' => $label, 'severity' => $sev, 'severity_label' => $severity[$sev], 'tier' => $tier, 'tier_label' => $tiers[$tier],
                'detects' => $detects, 'window_days' => $window, 'available' => $available,
                'unavailable_reason' => $available ? null : 'لم يُفتح التسجيل للفصل القادم بعد',
                'semesters' => $available ? [$now, max(0, (int) round($now * 1.15)), max(0, (int) round($now * 0.9))] : [null, null, null],
                'total' => $available ? $now : null, 'demo_students' => $now,
            ];
        }
        $availableByCode = collect($triggers)->mapWithKeys(fn ($t) => [$t['code'] => $t['available']])->all();
        $sources = $this->agentSources($availableByCode, $this->isAdminViewer($u) || $u->isStudent());
        $counts = ['appointments' => (int) round($matched * 0.34), 'proactive' => (int) round($matched * 0.29), 'dispatched' => (int) round($matched * 0.22), 'held' => (int) round($matched * 0.12), 'matched_students' => (int) round(count($rows) * 0.41), 'raised' => $matched, 'signal_students' => $n(fn ($s) => $s['risk']['level'] >= 1), 'resolved' => (int) round($matched * 0.38), 'response_median_hours' => 19.5];

        return response()->json(['source' => 'api', 'data' => [
            'semester' => DemoCohort::SEMESTER,
            'semesters' => [['code' => '466', 'current' => true, 'label' => 'الفصل الأول 1448'], ['code' => '465', 'current' => false, 'label' => 'الفصل الصيفي 1447'], ['code' => '464', 'current' => false, 'label' => 'الفصل الثاني 1447']],
            'term' => ['code' => $term['code'], 'starts_on' => $term['starts_on'], 'ends_on' => $term['ends_on'], 'started' => true, 'days_to_start' => null],
            'scope' => $caseload ? 'caseload' : 'university',
            'engine_ready' => true,
            'sources' => $sources,
            'triggers' => $triggers,
            'counts' => $counts,
            'qspark' => $this->qsparkSummary($u, $request, $ids),
            'digital_record' => ($this->isAdminViewer($u) || $u->isStudent()) ? $this->recordDecisions($request, $u) : null,
        ]]);
    }

    /** @param array<string, bool> $availableByCode */
    private function agentSources(array $availableByCode, bool $withRecord): array
    {
        $cohort = QMentorRiskDemoController::cohortPayload(null);
        $catalogue = [
            ['id' => 'sis', 'label' => 'نظام معلومات الطلاب', 'label_en' => 'Student Information System', 'system' => 'SIS · qu-api', 'reads' => ['المعدل التراكمي والفصلي', 'المقررات المسجّلة ونتائجها', 'السجل الأكاديمي عبر الفصول', 'حالة القيد والتسجيل'], 'reads_en' => ['Cumulative & term GPA', 'Registered courses and results', 'Academic record across terms', 'Enrolment status'], 'feeds' => ['T1', 'T2', 'T3', 'T4', 'T5', 'T6']],
            ['id' => 'plan', 'label' => 'الخطة الدراسية', 'label_en' => 'Academic Plan', 'system' => 'SIS · v1 academic-plan', 'reads' => ['تسلسل مقررات الخطة', 'المتطلبات السابقة والمؤجَّلة', 'المتبقّي للتخرج'], 'reads_en' => ['Plan course sequence', 'Prerequisites and deferred requirements', 'Remaining to graduation'], 'feeds' => ['T7', 'T8']],
            ['id' => 'standing', 'label' => 'الإنذارات وإيقاف القيد', 'label_en' => 'Warnings & Holds', 'system' => 'SIS · advising/warnings', 'reads' => ['الإنذارات الأكاديمية النشطة', 'إيقاف القيد وأسبابه', 'العقوبات المسجّلة'], 'reads_en' => ['Active academic warnings', 'Enrolment holds and reasons', 'Recorded penalties'], 'feeds' => ['T10']],
            ['id' => 'absences', 'label' => 'الحضور والغياب', 'label_en' => 'Attendance', 'system' => 'SIS · advising/absences', 'reads' => ['نسبة الغياب المتراكمة لكل مقرر', 'المسافة من حدّ الحرمان'], 'reads_en' => ['Cumulative absence per course', 'Distance from the denial threshold'], 'feeds' => ['T11']],
            ['id' => 'prediction', 'label' => 'Qmentor — التنبؤ بالتعثّر والإرشاد الاستباقي', 'label_en' => 'Qmentor — Risk Prediction & Proactive Advising', 'system' => '+QSpark · QU-LLM', 'reads' => ['احتمال التعثّر لكل طالب', 'العوامل المساهمة في التنبؤ'], 'reads_en' => ['Per-student risk probability', 'Contributing factors'], 'feeds' => ['T9']],
            ['id' => 'timetable', 'label' => 'الجدول والاختبارات', 'label_en' => 'Timetable & Exams', 'system' => 'SIS · timetable · final-exams', 'reads' => ['الجدول الأسبوعي للطالب والمرشد', 'مواعيد الاختبارات النهائية', 'الفراغات المشتركة لحجز اللقاء'], 'reads_en' => ['Student and advisor weekly timetable', 'Final exam dates', 'Shared free slots for booking'], 'feeds' => [], 'informs' => 'مطابقة المواعيد الاستباقية', 'informs_en' => 'Proactive appointment matching'],
            ['id' => 'digital_record', 'label' => 'سجلك الرقمي', 'label_en' => 'Digital Record', 'system' => 'QSpark+ · سجل المهارات', 'reads' => ['المهارات والأنشطة المعتمدة وساعاتها', 'وتيرة اكتساب الساعات عبر الفصول', 'التقدّم في الخطة والتخصص'], 'reads_en' => ['Accepted skills/activities and their hours', 'Pace of earning hours across terms', 'Plan progress and major'], 'feeds' => [], 'informs' => 'أين الخلل في المهارات، ومتى تُؤخذ كل شهادة: الآن أو بعد شهرين أو سنة أو بعد التخرج', 'informs_en' => 'Where the skill gap is, and when each certificate is due: now, in two months, a year, or after graduation'],
            ['id' => 'qspark', 'label' => 'منصة التعلم QSpark', 'label_en' => 'QSpark Learning Platform', 'system' => 'QSpark+ · التعلم', 'reads' => ['الأسئلة التي أُخطئ فيها أو تُركت بلا إجابة', 'دقّة كل طالب وزمن إجابته', 'حجم بنك الأسئلة لكل مستوى'], 'reads_en' => ['Questions answered wrong or left unanswered', 'Each student\'s accuracy and answer time', 'Question-bank size per level'], 'feeds' => ['T12'], 'informs' => 'إعادة تصنيف الصعوبة، وعدد الأسئلة، ووقت الإجابة، واقتراح إعادة الصياغة', 'informs_en' => 'Difficulty reclassification, question count, answer time, rewording proposals'],
            ['id' => 'capacity', 'label' => 'سعة المقررات وحِملها', 'label_en' => 'Course Capacity', 'system' => 'QSpark+ · مستشارك الأكاديمي', 'reads' => ['سعة الشعب ومن سجّل فيها', 'ما تجاوز المسموح', 'الخريجون المتوقّعون'], 'reads_en' => ['Section capacity and enrolment', 'Over-capacity sections', 'Expected graduates'], 'feeds' => [], 'informs' => 'توصيات التسجيل وفتح الشعب', 'informs_en' => 'Registration and section-opening advice'],
        ];
        if (! $withRecord) {
            $catalogue = array_values(array_filter($catalogue, fn ($s) => $s['id'] !== 'digital_record'));
        }
        foreach ($catalogue as &$source) {
            $source['available'] = $source['feeds'] === [] ? true : collect($source['feeds'])->contains(fn ($c) => $availableByCode[$c] ?? false);
            if ($source['id'] === 'prediction') {
                $levels = collect($cohort['by_level'])->map(fn ($l) => ['level' => $l['level'], 'key' => $l['key'], 'label' => $l['ar'], 'n' => $l['n']]);
                $source['model'] = ['students_scored' => $cohort['students_scored'], 'students_in_cohort' => $cohort['students_in_cohort'], 'levels' => $levels->values()->all(), 'flagged' => (int) $levels->where('level', '>=', 2)->sum('n'), 'computed_at' => $cohort['computed_at'], 'model_version' => $cohort['model_version']];
                $source['available'] = true;
            }
        }
        unset($source);

        return $catalogue;
    }

    /** @param array<int, string> $ids */
    private function qsparkSummary($u, Request $request, array $ids): array
    {
        $requested = trim((string) $request->query('qspark_student', ''));
        $roster = [];
        foreach (array_slice($ids, 0, 40) as $id) {
            $s = DemoCohort::all()[$id];
            $served = 20 + crc32('s'.$id) % 90;
            $roster[] = ['student_id' => $id, 'label' => $s['name'], 'served' => $served, 'courses' => 3, 'accuracy' => round(max(35, min(96, 88 - $s['risk']['level'] * 11 + (crc32($id) % 9))), 1), 'course_codes' => array_slice(array_column($s['courses'], 'course_code'), 0, 3), 'program' => $s['major_name'], 'program_key' => $s['major_no']];
        }
        $student = null;
        $scopeDenied = false;
        if ($requested !== '') {
            $s = DemoCohort::find($requested);
            if (! $s || ! in_array($requested, $ids, true)) {
                $scopeDenied = true;
            } else {
                $courses = [];
                foreach ($s['courses'] as $k => $c) {
                    $acc = round(max(30, min(98, 90 - $s['risk']['level'] * 12 - $k * 3 + (crc32($c['course_code']) % 7))), 1);
                    $courses[] = ['course_code' => $c['course_code'], 'course_name' => $c['course_name'], 'in_plan' => true, 'served' => 8 + crc32($c['course_code'].$requested) % 30, 'accuracy' => $acc, 'wrong_rate' => round(100 - $acc - 4, 1), 'timeout_rate' => 4.0, 'last_played_at' => now()->subDays($k + 1)->toDateTimeString()];
                }
                $student = ['student_id' => $requested, 'label' => $s['name'], 'courses' => $courses, 'program' => ['key' => $s['major_no'], 'name' => $s['major_name'], 'code' => $s['major_no'], 'matched' => count($courses), 'total' => count($courses), 'unmatched' => []]];
            }
        }
        $weak = [];
        foreach (array_slice(DemoData::students(), 0, 3) as $k => $fs) {
            $c = DemoCohort::all()[$fs['student_id']]['courses'][$k];
            $weak[] = ['question_id' => 1200 + $k, 'course_code' => $c['course_code'], 'attachment_key' => 'ch'.($k + 2), 'difficulty' => ['hard', 'medium', 'medium'][$k], 'question' => ['ما الفرق بين الاستحقاق والأساس النقدي في إثبات الإيراد؟', 'أي الخوارزميات التالية يضمن الوصول لأقصر مسار في رسم موزون؟', 'ما تأثير زيادة التردد على المفاعلة الحثية؟'][$k], 'served' => 140 - $k * 20, 'wrong_rate' => 0.62 - $k * 0.08, 'timeout_rate' => 0.11, 'decision' => ['code' => 'Q-RECLASS', 'title' => 'إعادة تصنيف الصعوبة إلى «صعب»', 'status' => $k === 0 ? 'applied' : 'proposed', 'auto' => $k === 0]];
        }
        $recent = [];
        foreach ($weak as $k => $w) {
            $recent[] = ['id' => 300 + $k, 'code' => $w['decision']['code'], 'subject_type' => 'question', 'subject_key' => (string) $w['question_id'], 'course_code' => $w['course_code'], 'student_id' => null, 'title' => $w['decision']['title'], 'detail' => 'نسبة الخطأ '.round($w['wrong_rate'] * 100).'% على '.$w['served'].' عرضاً', 'status' => $w['decision']['status'], 'auto' => $w['decision']['auto'], 'decided_at' => now()->subHours(5 + $k * 9)->toDateTimeString(), 'applied_at' => $w['decision']['status'] === 'applied' ? now()->subHours(5)->toDateTimeString() : null, 'evidence' => ['served' => $w['served'], 'wrong_rate' => $w['wrong_rate']], 'action' => ['difficulty' => 'hard']];
        }

        return [
            'enabled' => true, 'last_run_at' => now()->subHours(3)->toDateTimeString(),
            'sessions' => 1284, 'students' => count($roster), 'questions_served' => 19640, 'accuracy' => 71.4, 'timeout_rate' => 6.2, 'courses' => 18, 'attachments' => 54,
            'decisions' => ['applied' => 9, 'proposed' => 6, 'dismissed' => 2],
            'weak_questions' => $weak,
            'settings' => [['course_code' => 'ACCT401', 'attachment_key' => 'ch3', 'questions_per_difficulty' => ['easy' => 4, 'medium' => 5, 'hard' => 3], 'starting_difficulty' => 'medium', 'question_time_limit' => 75, 'decided_by' => 'agent', 'reason' => 'ارتفاع نسبة انتهاء الوقت على الأسئلة الصعبة', 'applied_at' => now()->subDays(2)->toDateTimeString()]],
            'recent' => $recent,
            'by_code' => ['Q-RECLASS' => ['applied' => 5, 'proposed' => 3], 'Q-TIME' => ['applied' => 3, 'proposed' => 2], 'Q-REWORD' => ['applied' => 1, 'proposed' => 1]],
            'roster' => $roster, 'student' => $student, 'scoped_student_id' => $requested !== '' ? $requested : null,
            'scope_empty' => false, 'scope_denied' => $scopeDenied,
        ];
    }

    private function recordDecisions(Request $request, $u): ?array
    {
        $studentId = $this->ownStudentId($u) ?: (string) config('quai.qmentor.demo_student_id', DemoData::students()[0]['student_id']);
        $requested = trim((string) $request->query('student', ''));
        if ($requested !== '' && $this->isAdminViewer($u) && DemoCohort::find($requested)) {
            $studentId = $requested;
        }
        $s = DemoCohort::find($studentId);
        if (! $s) {
            return null;
        }
        $skills = DemoData::skills($studentId);
        $skillRows = is_array($skills) ? (array_is_list($skills) ? $skills : ($skills['skills'] ?? $skills['data'] ?? [])) : [];
        $hours = 0;
        foreach ($skillRows as $row) {
            $hours += (int) ($row['hours'] ?? $row['credit_hours'] ?? 0);
        }
        $hours = $hours ?: 48;
        $progressRatio = round($s['passed_hours'] / max(1, $s['plan_hours']), 2);
        $gaps = [
            ['skill' => 'تحليل البيانات', 'skill_en' => 'Data analysis', 'demand' => 38, 'needed_by' => ['محلل مالي', 'محلل أعمال'], 'next_course' => ['code' => 'STAT302', 'name' => 'إحصاء تطبيقي', 'level' => $s['student_level'] + 1, 'terms_away' => 1, 'in_progress' => false, 'eta_months' => 4, 'when' => 'الفصل القادم'], 'suggest' => 'دورة قصيرة في Excel/Power BI قبل الفصل القادم'],
            ['skill' => 'التواصل المهني', 'skill_en' => 'Professional communication', 'demand' => 27, 'needed_by' => ['كل الوظائف'], 'next_course' => null, 'suggest' => 'نادي العرض والإلقاء — 12 ساعة معتمدة'],
        ];
        $certs = [
            ['code' => 'CERT-01', 'title' => 'شهادة أساسيات تحليل البيانات', 'title_en' => 'Data Analysis Fundamentals', 'provider' => 'Microsoft', 'stage' => 'foundation', 'stage_label' => 'تأسيسية', 'link' => null, 'coverage_pct' => 62, 'matched' => [['skill' => 'جداول البيانات', 'evidence' => ['BUSN320'], 'hours' => 12]], 'missing' => [['skill' => 'تصوّر البيانات', 'skill_en' => 'Data visualisation', 'weight' => 0.4, 'next_course' => $gaps[0]['next_course']]], 'remaining_hours' => 18, 'eta_months' => 2, 'verdict' => 'two_months', 'verdict_label' => 'بعد شهرين', 'when_label' => 'قبل نهاية الفصل', 'reason' => 'تغطية 62% والمتبقي 18 ساعة بوتيرتك الحالية'],
            ['code' => 'CERT-02', 'title' => 'شهادة مهنية في التخصص', 'title_en' => 'Professional certificate in the major', 'provider' => 'هيئة مهنية', 'stage' => 'professional', 'stage_label' => 'مهنية', 'link' => null, 'coverage_pct' => 31, 'matched' => [], 'missing' => [['skill' => 'مقررات المستوى السابع', 'skill_en' => 'Level-7 courses', 'weight' => 0.7, 'next_course' => null]], 'remaining_hours' => 60, 'eta_months' => 14, 'verdict' => 'after_graduation', 'verdict_label' => 'بعد التخرج', 'when_label' => 'بعد إكمال الخطة', 'reason' => 'تتطلب مقررات لم تُدرس بعد'],
        ];

        return [
            'student_id' => $studentId, 'student_label' => $s['name'], 'source' => 'demo',
            'profile' => ['major' => $s['major_name'], 'major_en' => $s['major_name_en'], 'faculty' => $s['faculty_name'], 'faculty_en' => $s['faculty_name_en'], 'gpa' => $s['cumulative_gpa']],
            'total_skills' => count($skillRows) ?: 9, 'accepted_hours' => $hours,
            'assessment' => [
                'family' => ['key' => $s['major_no'], 'label' => $s['major_name']],
                'progress' => ['ratio' => $progressRatio, 'passed_hours' => $s['passed_hours'], 'plan_hours' => $s['plan_hours'], 'semesters_completed' => count($s['terms']), 'estimated' => false, 'basis' => 'ساعات الخطة المجتازة'],
                'pace' => ['hours_per_month' => round($hours / max(1, count($s['terms']) * 4), 1), 'basis' => 'الساعات المعتمدة على الفصول المكتملة', 'accepted_hours' => $hours, 'months_spanned' => count($s['terms']) * 4],
                'strengths' => [['skill' => 'العمل الجماعي', 'skill_en' => 'Teamwork', 'evidence' => ['نادي الطلاب', 'مشروع مقرر'], 'hours' => 16], ['skill' => 'أساسيات التخصص', 'skill_en' => 'Core of the major', 'evidence' => array_slice(array_column($s['courses'], 'course_code'), 0, 2), 'hours' => 24]],
                'gaps' => $gaps, 'certificates' => $certs,
                'plan' => ['name' => 'خطة '.$s['major_name'], 'url' => '/qspark-plus/study-plan', 'level' => $s['student_level'], 'levels' => 8, 'passed_count' => (int) ($s['passed_hours'] / 3), 'total_count' => (int) ($s['plan_hours'] / 3), 'remaining_hours' => $s['remaining_hours'], 'current' => array_map(fn ($c) => ['code' => $c['course_code'], 'name' => $c['course_name'], 'level' => $s['student_level']], $s['courses']), 'deferred' => [], 'next' => [['code' => 'STAT302', 'name' => 'إحصاء تطبيقي', 'level' => $s['student_level'] + 1, 'hours' => 3]]],
                'headline' => 'الفجوة الأوضح في تحليل البيانات؛ الشهادة التأسيسية في متناولك خلال شهرين.',
                'generated_at' => now()->toDateTimeString(),
            ],
        ];
    }

    // ── Microsoft Graph (not configured on the demo) ──────────────────────

    public function graphEvents(): JsonResponse
    {
        return response()->json(['configured' => false, 'events' => []]);
    }

    public function graphMeeting(): JsonResponse
    {
        return response()->json(['success' => false, 'error' => 'Microsoft Graph غير مفعّل في هذا العرض التوضيحي — لا تُرسل دعوات حقيقية.']);
    }

    public function graphEmail(): JsonResponse
    {
        return response()->json(['success' => false, 'error' => 'البريد غير مفعّل في هذا العرض التوضيحي.']);
    }

    // ── The signed-in student's own extras ────────────────────────────────

    public function studentBlackboard(Request $request): JsonResponse
    {
        return $this->ownSlice($request, fn ($s) => QMentorAdvisorDemoController::blackboard($s));
    }

    public function studentRecommendations(Request $request): JsonResponse
    {
        return $this->ownSlice($request, fn ($s) => QMentorAdvisorDemoController::recommendations($s));
    }

    public function studentTimeline(Request $request): JsonResponse
    {
        return $this->ownSlice($request, fn ($s) => QMentorAdvisorDemoController::timeline($s));
    }

    private function ownSlice(Request $request, callable $build): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        $id = $this->studentIdFor($request, $u);
        $s = DemoCohort::find($id ?? '');
        if (! $s) {
            return response()->json(['source' => 'unavailable', 'data' => null]);
        }

        return response()->json(['source' => 'api', 'data' => $build($s)]);
    }
}
