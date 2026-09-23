<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\Concerns\ResolvesDemoScope;
use App\Http\Controllers\Controller;
use App\Support\DemoCohort;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * درجات الخطر — demo build.
 *
 *   GET  /api/qmentor/risk/me                       the signed-in student's latest evaluation + history
 *   GET  /api/qmentor/risk/students/{id}            one student the caller may read
 *   GET  /api/qmentor/risk/caseload?ids=|all=1      latest verdict per student
 *   GET  /api/qmentor/risk/cohort[?faculty=]        university-wide aggregates (admin)
 *   GET  /api/qmentor/risk/backtest                 model evidence (admin)
 *   GET  /api/qmentor/risk/alerts                   the student's platform alerts
 *   POST /api/qmentor/risk/alerts/{id}/read
 *   POST /api/qmentor/risk/students/{id}/override   an advisor's manual level (task 14)
 *
 * Same envelopes as the live QMentorRiskApiController; the figures come from
 * the synthetic DemoCohort instead of qmentor_risk_scores.
 */
class QMentorRiskDemoController extends Controller
{
    use ResolvesDemoScope;

    public function me(Request $request): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        $studentId = $this->studentIdFor($request, $u);
        if ($studentId === null) {
            return response()->json(['source' => 'api', 'data' => null, 'reason' => 'not_a_student']);
        }

        return $this->forStudent($studentId, $u);
    }

    public function student(Request $request, string $studentId): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        if (! $this->mayRead($u, $studentId)) {
            return response()->json(['error' => 'الطالب خارج حافظتك الإرشادية ومقرراتك'], 403);
        }

        return $this->forStudent($studentId, $u);
    }

    public function caseload(Request $request): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        $ids = array_values(array_filter(array_map('trim', explode(',', (string) $request->query('ids', '')))));
        if ($this->isAdminViewer($u) && $request->boolean('all')) {
            $ids = DemoCohort::ids();
        } elseif (! $this->isAdminViewer($u)) {
            $ids = array_values(array_intersect($ids, $this->readableIds($u)));
        }
        if ($ids === []) {
            return response()->json(['source' => 'api', 'data' => ['students' => (object) [], 'scored' => 0]]);
        }
        $out = [];
        foreach ($ids as $id) {
            $s = DemoCohort::find($id);
            if (! $s) {
                continue;
            }
            $r = $this->applyOverride($s['risk'], $u, $id);
            $out[$id] = [
                'score' => $r['score'],
                'level' => ['level' => $r['level']] + DemoCohort::levelMeta($r['level']),
                'override' => $r['override'],
                'top_factors' => $r['top_factors'],
                'computed_at' => $r['computed_at'],
            ];
        }

        return response()->json(['source' => 'api', 'data' => ['students' => (object) $out, 'scored' => count($out), 'asked' => count($ids)]]);
    }

    public function cohort(Request $request): JsonResponse
    {
        $u = $this->viewer();
        if (! $u || ! $this->isAdminViewer($u)) {
            return response()->json(['source' => 'api', 'data' => null, 'error' => 'للمشرف العام فقط'], 403);
        }
        $faculty = (string) ($request->query('faculty') ?: '');

        return response()->json(['source' => 'api', 'data' => self::cohortPayload($faculty !== '' ? $faculty : null)]);
    }

    /** @return array<string, mixed> */
    public static function cohortPayload(?string $faculty): array
    {
        $rows = array_filter(DemoCohort::all(), fn ($s) => $faculty === null || $s['faculty_no'] === $faculty);
        $byLevel = [0 => 0, 1 => 0, 2 => 0, 3 => 0];
        $byFaculty = [];
        $byDept = [];
        $stats = [];
        $latest = null;
        foreach ($rows as $s) {
            $r = $s['risk'];
            $byLevel[$r['level']]++;
            $latest = max($latest ?? '', $r['computed_at']);
            $f = &$byFaculty[$s['faculty_no']];
            $f ??= ['faculty_no' => $s['faculty_no'], 'faculty_name' => $s['faculty_name'], 'levels' => ['L0' => 0, 'L1' => 0, 'L2' => 0, 'L3' => 0], 'total' => 0, 'gpa' => 0.0];
            $f['levels']['L'.$r['level']]++;
            $f['total']++;
            $f['gpa'] += $s['cumulative_gpa'];
            unset($f);
            $d = &$byDept[$s['faculty_no'].'-'.$s['dept_no']];
            $d ??= ['faculty_no' => $s['faculty_no'], 'dept_no' => $s['dept_no'], 'dept_name' => $s['dept_name'], 'levels' => ['L0' => 0, 'L1' => 0, 'L2' => 0, 'L3' => 0], 'total' => 0, 'gpa' => 0.0];
            $d['levels']['L'.$r['level']]++;
            $d['total']++;
            $d['gpa'] += $s['cumulative_gpa'];
            unset($d);
            foreach ($r['indicators'] as $i) {
                $st = &$stats[$i['id']];
                $st ??= ['id' => $i['id'], 'label' => $i['label'], 'category' => $i['category'], 'available' => 0, 'medium' => 0, 'high' => 0];
                if ($i['available']) {
                    $st['available']++;
                    if ($i['level'] >= 1) {
                        $st['medium']++;
                    }
                    if ($i['level'] >= 2) {
                        $st['high']++;
                    }
                }
                unset($st);
            }
        }
        uasort($stats, fn ($a, $b) => $b['high'] <=> $a['high']);
        $prevalence = collect($stats)->filter(fn ($s) => $s['high'] > 0)->mapWithKeys(fn ($s) => [$s['id'] => $s['high']])->all();
        $byCategory = collect($prevalence)->groupBy(fn ($n, $id) => explode('-', $id)[0])->map(fn ($g) => (int) $g->max())->all();

        // The last ten scoring days: the same cohort with a little drift towards today's picture.
        $trend = [];
        $n = max(1, count($rows));
        for ($d = 9; $d >= 0; $d--) {
            $shift = (int) round($d * 0.6);
            $trend[] = [
                'date' => now()->subDays($d)->toDateString(),
                'L0' => max(0, $byLevel[0] - $shift), 'L1' => $byLevel[1] + (int) floor($shift / 2), 'L2' => $byLevel[2] + (int) ceil($shift / 2), 'L3' => $byLevel[3],
            ];
        }

        return [
            'computed_at' => $latest,
            'students_scored' => count($rows),
            'students_in_cohort' => count($rows),
            'by_level' => collect([0, 1, 2, 3])->map(fn ($l) => ['level' => $l] + DemoCohort::levelMeta($l) + ['n' => $byLevel[$l]])->values()->all(),
            'by_faculty' => array_values(array_map(fn ($f) => ['faculty_no' => $f['faculty_no'], 'faculty_name' => $f['faculty_name'], 'levels' => $f['levels'], 'total' => $f['total'], 'avg_gpa' => round($f['gpa'] / max(1, $f['total']), 2), 'enrolled' => $f['total']], $byFaculty)),
            'by_department' => array_values(array_map(fn ($d) => ['faculty_no' => $d['faculty_no'], 'dept_no' => $d['dept_no'], 'dept_name' => $d['dept_name'], 'levels' => $d['levels'], 'total' => $d['total'], 'avg_gpa' => round($d['gpa'] / max(1, $d['total']), 2)], $byDept)),
            'avg_gpa' => round(array_sum(array_column($rows, 'cumulative_gpa')) / $n, 2),
            'indicator_prevalence' => $prevalence,
            'by_category' => $byCategory,
            'indicators' => collect($stats)->map(fn ($s) => $s + ['threshold' => config("qmentor_risk.thresholds.{$s['id']}")])->values()->all(),
            'trend' => $trend,
            'levels' => DemoCohort::levels(),
            'model_version' => DemoCohort::MODEL_VERSION,
        ];
    }

    public function backtest(): JsonResponse
    {
        $u = $this->viewer();
        if (! $u || ! $this->isAdminViewer($u)) {
            return response()->json(['source' => 'api', 'data' => null, 'error' => 'للمشرف العام فقط'], 403);
        }
        // A synthetic backtest: the engine run as-of the graded term against the next one's results.
        $tp = 41;
        $fp = 19;
        $tn = 148;
        $fn = 14;
        $n = $tp + $fp + $tn + $fn;
        $precision = $tp / ($tp + $fp);
        $recall = $tp / ($tp + $fn);
        $byLevel = [
            ['level' => 0, 'n' => 121, 'failed' => 6], ['level' => 1, 'n' => 46, 'failed' => 8],
            ['level' => 2, 'n' => 39, 'failed' => 24], ['level' => 3, 'n' => 16, 'failed' => 17],
        ];

        return response()->json(['source' => 'api', 'data' => [
            'generated_on' => '2026-09-13', 'as_of' => '464', 'outcome_semester' => '465',
            'students' => $n, 'tp' => $tp, 'fp' => $fp, 'tn' => $tn, 'fn' => $fn,
            'precision' => round($precision * 100, 1), 'recall' => round($recall * 100, 1),
            'f1' => round(2 * $precision * $recall / ($precision + $recall) * 100, 1),
            'accuracy' => round(($tp + $tn) / $n * 100, 1),
            'base_rate' => round(($tp + $fn) / $n * 100, 1),
            'by_level' => array_map(fn ($l) => $l + ['rate' => round($l['failed'] / max(1, $l['n']) * 100, 1), 'en' => ucfirst(DemoCohort::levelMeta($l['level'])['key'])] + DemoCohort::levelMeta($l['level']), $byLevel),
            'model_version' => DemoCohort::MODEL_VERSION,
            'definition' => ['positive' => 'رسب في مقرر أو معدل الفصل التالي تحت 2.00', 'predicted' => 'مستوى متوسط فأعلى عند التقييم'],
        ]]);
    }

    public function alerts(Request $request): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        $studentId = $this->studentIdFor($request, $u);
        if ($studentId === null) {
            return response()->json(['source' => 'api', 'data' => ['student_id' => null, 'unread' => 0, 'alerts' => []]]);
        }
        $read = $this->stateGet($u, 'alerts-read');
        $alerts = array_map(function ($a) use ($read) {
            if (isset($read[$a['id']])) {
                $a['read_at'] = $read[$a['id']]['at'];
                $a['response'] = $read[$a['id']]['response'] ?? $a['response'];
            }

            return $a;
        }, DemoCohort::alertsFor($studentId));
        usort($alerts, fn ($a, $b) => strcmp($b['created_at'], $a['created_at']));

        return response()->json(['source' => 'api', 'data' => [
            'student_id' => $studentId,
            'unread' => count(array_filter($alerts, fn ($a) => $a['read_at'] === null)),
            'alerts' => $alerts,
        ]]);
    }

    public function markRead(Request $request, int $id): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        $read = $this->stateGet($u, 'alerts-read');
        $read[$id] = ['at' => now()->toDateTimeString(), 'response' => $request->input('response')];
        $this->statePut($u, 'alerts-read', $read);

        return response()->json(['source' => 'api', 'data' => ['id' => $id, 'read_at' => $read[$id]['at']]]);
    }

    public function override(Request $request, string $studentId): JsonResponse
    {
        $u = $this->viewer();
        if (! $u) {
            return response()->json(['error' => 'unauthenticated'], 401);
        }
        if (! $this->mayRead($u, $studentId)) {
            return response()->json(['error' => 'الطالب خارج حافظتك الإرشادية'], 403);
        }
        $data = $request->validate(['level' => ['required', 'integer', 'min:0', 'max:3'], 'reason' => ['required', 'string', 'max:500']]);
        $overrides = $this->stateGet($u, 'overrides');
        $overrides[$studentId] = ['level' => (int) $data['level'], 'reason' => $data['reason'], 'at' => now()->toDateTimeString()];
        $this->statePut($u, 'overrides', $overrides);

        return response()->json(['source' => 'api', 'data' => ['id' => crc32($studentId) % 10000, 'applies_from' => 'التقييم الليلي التالي']], 201);
    }

    // ── helpers ───────────────────────────────────────────────────────────

    /** An advisor's manual adjustment (task 14) wins over every layer for 30 days. */
    private function applyOverride(array $risk, $u, string $studentId): array
    {
        $o = $this->stateGet($u, 'overrides')[$studentId] ?? null;
        if ($o !== null) {
            $risk['level'] = (int) $o['level'];
            $risk['override'] = 'advisor';
            $band = DemoCohort::levelMeta($risk['level']);
            $risk['score'] = max($band['min'], min($band['max'], $risk['score']));
        }

        return $risk;
    }

    private function forStudent(string $studentId, $u): JsonResponse
    {
        $s = DemoCohort::find($studentId);
        if (! $s) {
            return response()->json(['source' => 'api', 'data' => ['student_id' => $studentId, 'scored' => false, 'reason' => 'لم يُقيَّم بعد — يظهر بعد التقييم الليلي']]);
        }
        $r = $this->applyOverride($s['risk'], $u, $studentId);

        // Per-indicator trail over the last runs (one point per nightly run).
        $indicatorHistory = [];
        $days = count($r['history']);
        foreach ($r['indicators'] as $i) {
            if (! $i['available']) {
                continue;
            }
            foreach ($r['history'] as $k => $h) {
                $drift = ($k === $days - 1 || ! is_numeric($i['value'])) ? 0 : round(sin($k + crc32($i['id'])) * (abs((float) $i['value']) * 0.08 + 0.4), 1);
                $value = is_numeric($i['value']) ? round((float) $i['value'] + $drift, 1) : $i['value'];
                $indicatorHistory[$i['id']][] = ['at' => $h['computed_at'], 'value' => $value, 'level' => $i['level']];
            }
        }

        $rules = (array) config('qmentor_risk.actions', []);
        $actions = collect($r['indicators'])
            ->filter(fn ($i) => $i['available'] && ($i['level'] ?? 0) > 0 && isset($rules[$i['id']]))
            ->sortByDesc('level')
            ->map(fn ($i) => ['indicator' => $i['id'], 'level' => $i['level'], 'evidence' => $i['evidence']] + $rules[$i['id']])
            ->values()->all();

        // Term history for the indicators that only move when a term closes.
        $termHistory = [];
        foreach ($s['terms'] as $k => $t) {
            $prev = $s['terms'][$k - 1]['semester_gpa'] ?? null;
            $row = ['G-04' => ['value' => $t['cumulative_gpa'], 'level' => self::bandLevel('G-04', $t['cumulative_gpa'])]];
            if ($prev !== null) {
                $delta = round($t['semester_gpa'] - $prev, 2);
                $row['G-05'] = ['value' => $delta, 'level' => $delta > 0.2 ? 0 : ($delta >= -0.2 ? 1 : ($delta >= -0.5 ? 2 : 3))];
            }
            $termHistory[] = ['semester' => $t['semester'], 'indicators' => $row];
        }

        return response()->json(['source' => 'api', 'data' => [
            'student_id' => $studentId,
            'scored' => true,
            'computed_at' => $r['computed_at'],
            'score' => $r['score'],
            'level' => ['level' => $r['level']] + DemoCohort::levelMeta($r['level']),
            'override' => $r['override'],
            'top_factors' => $r['top_factors'],
            'categories' => $r['categories'],
            'indicators' => $r['indicators'],
            'available_count' => $r['available_count'],
            'history' => array_map(fn ($h) => ['computed_at' => $h['computed_at'], 'score' => $h['score'], 'level' => $h['level'], 'override' => $h['override']], $r['history']),
            'indicator_history' => $indicatorHistory,
            'term_history' => $termHistory,
            'actions' => $actions,
            'thresholds' => config('qmentor_risk.thresholds'),
            'model_version' => $r['model_version'],
        ]]);
    }

    private static function bandLevel(string $id, float $value): int
    {
        $t = config("qmentor_risk.thresholds.{$id}");
        if (! $t) {
            return 0;
        }
        [$m, $h, $c] = $t['bands'];

        return $t['dir'] === 'up'
            ? ($value >= $c ? 3 : ($value >= $h ? 2 : ($value >= $m ? 1 : 0)))
            : ($value <= $c ? 3 : ($value <= $h ? 2 : ($value < $m ? 1 : 0)));
    }
}
