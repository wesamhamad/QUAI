<?php

namespace App\Services\Advising;

use App\Models\AdvisingAction;
use App\Support\DemoCohort;
use Carbon\CarbonImmutable;

/**
 * أرقام لوحة الإرشاد الاستباقي — demo build.
 *
 * Same public contract as the live AdvisingBoardData (the Filament page and
 * its Blade partials are ported unchanged), but every figure is derived from
 * the synthetic DemoCohort instead of the advising_* tables: the signals the
 * twelve steps would raise on those invented students, the meetings the
 * matcher would book in the first shared gap, the minutes and outcomes of the
 * ones already held. Deterministic — the same board on every reload.
 *
 * The scope argument keeps its three states: null = the whole university,
 * an advisor id = that caseload, '' = nobody.
 */
class AdvisingBoardData
{
    public const TTL = 300;

    public const PER_PAGE_OPTIONS = [12, 24, 48];

    public const DEFAULT_PER_PAGE = 24;

    private const DAY_LABELS = [1 => 'الأحد', 2 => 'الإثنين', 3 => 'الثلاثاء', 4 => 'الأربعاء', 5 => 'الخميس', 6 => 'الجمعة', 7 => 'السبت'];

    private const STATUS_LABELS = ['scheduled' => 'مجدول', 'dispatched' => 'أُرسل', 'held' => 'عُقد', 'no_show' => 'لم يحضر', 'cancelled' => 'ملغى', 'rescheduled' => 'أُعيدت جدولته'];

    private const MODE_LABELS = ['on_campus' => 'حضوري', 'teams' => 'عن بعد — Teams'];

    private const ORIGIN_LABELS = ['proactive' => 'استباقي — بادر به النظام', 'advisor' => 'بطلب المرشد', 'student' => 'بطلب الطالب', 'demo' => 'استباقي — بادر به النظام'];

    private const RANK = ['critical' => 3, 'high' => 2, 'medium' => 1];

    /** @var array<string, mixed>|null the generated world, built once per request */
    private static ?array $world = null;

    // ── الفصول ────────────────────────────────────────────────────────────

    public function semesters(): array
    {
        $current = (string) config('advising.semesters.current', DemoCohort::SEMESTER);
        $rows = [['code' => $current, 'current' => true, 'label' => 'الفصل '.$current]];
        foreach ((array) config('advising.semesters.history', []) as $code) {
            $rows[] = ['code' => (string) $code, 'current' => false, 'label' => 'الفصل '.$code];
        }

        return $rows;
    }

    /** @return array<int, string> */
    public function semesterCodes(): array
    {
        return array_column($this->semesters(), 'code');
    }

    // ── العالم التركيبي ───────────────────────────────────────────────────

    /**
     * Signals, appointments, actions and outcomes for every cohort student,
     * across the listed terms. Historical terms carry signals only (they were
     * swept to size the need); the current term carries the bookings.
     *
     * @return array{signals: array<int, array<string, mixed>>, appointments: array<int, array<string, mixed>>, actions: array<int, array<string, mixed>>, outcomes: array<int, array<string, mixed>>}
     */
    private function world(): array
    {
        if (self::$world !== null) {
            return self::$world;
        }
        $triggers = (array) config('advising.triggers', []);
        $current = (string) config('advising.semesters.current', DemoCohort::SEMESTER);
        $codes = $this->semesterCodes();
        $termStart = CarbonImmutable::parse(DemoCohort::TERM_STARTS);
        $now = CarbonImmutable::now();
        $weeks = max(1, (int) $termStart->diffInWeeks($now));

        $signals = [];
        $appointments = [];
        $actions = [];
        $outcomes = [];
        $sid = 0;
        $aid = 0;
        $seed = fn (string $k) => crc32($k) % 1000;

        foreach (DemoCohort::all() as $s) {
            $id = (string) $s['student_id'];
            $prevGpa = count($s['terms']) >= 2 ? $s['terms'][count($s['terms']) - 2]['semester_gpa'] : null;
            $lastGpa = $s['terms'][count($s['terms']) - 1]['semester_gpa'] ?? $s['cumulative_gpa'];
            $worstCourse = collect($s['courses'])->sortByDesc('absence_percent')->first();
            $fired = [];

            if ($s['failed_courses'] >= 3) {
                $fired['T1'] = ['failed_courses' => $s['failed_courses'], 'graded_courses' => 5, 'semester' => DemoCohort::GRADED_SEMESTER,
                    'courses' => array_map(fn ($c) => ['course_code' => $c['course_code'], 'course_name' => $c['course_name'], 'final_grade' => 30 + $seed($id.$c['course_code']) % 25, 'letter_grade' => 'F', 'semester' => DemoCohort::GRADED_SEMESTER], array_slice($s['courses'], 0, $s['failed_courses']))];
            }
            if ($s['failed_courses'] >= 2 && $s['cumulative_gpa'] < 2.6) {
                $c = $s['courses'][1];
                $fired['T2'] = ['courses' => [['course_code' => $c['course_code'], 'course_name' => $c['course_name'], 'failures' => 2, 'attempts' => [['semester' => '463', 'final_grade' => 41, 'letter_grade' => 'F'], ['semester' => DemoCohort::GRADED_SEMESTER, 'final_grade' => 48, 'letter_grade' => 'F']]]]];
            }
            if ($lastGpa < 2.0) {
                $fired['T3'] = ['semester_gpa' => $lastGpa, 'cumulative_gpa' => $s['cumulative_gpa'], 'semester' => DemoCohort::GRADED_SEMESTER, 'passed_hours' => max(0, 15 - $s['failed_courses'] * 3), 'attempted_hours' => 15, 'threshold' => 2.0];
            }
            if ($prevGpa !== null && ($prevGpa - $lastGpa) >= 0.5) {
                $fired['T4'] = ['previous_gpa' => $prevGpa, 'semester_gpa' => $lastGpa, 'previous_semester' => $s['terms'][count($s['terms']) - 2]['semester'], 'semester' => DemoCohort::GRADED_SEMESTER, 'drop' => round($prevGpa - $lastGpa, 2), 'threshold' => 0.5];
            }
            if ($seed('t6'.$id) % 37 === 0) {
                $fired['T6'] = ['semester' => $current, 'missed_semesters' => 1, 'absent' => ['465'], 'last_seen' => '464'];
            }
            if ($s['passed_hours'] < ($s['student_level'] - 1) * 15 - 6 && $s['student_level'] > 2) {
                $fired['T7'] = ['off_plan' => [$s['courses'][3]['course_code']], 'delayed_prerequisites' => [['course' => $s['courses'][0]['course_code'], 'prerequisite' => 'MATH101']], 'passed_courses' => (int) ($s['passed_hours'] / 3), 'plan_courses' => 45];
            }
            if ($s['remaining_hours'] <= 6) {
                $fired['T8'] = ['remaining' => (int) ceil($s['remaining_hours'] / 3), 'plan_total' => 45, 'remaining_courses' => array_slice(array_column($s['courses'], 'course_code'), 0, 2), 'passed_courses' => 43];
            }
            if ($s['risk']['level'] >= 2) {
                $fired['T9'] = ['probability' => round(0.62 + $s['risk']['score'] / 400, 2), 'course' => $worstCourse['course_code'], 'model' => 'QU-LLM v8', 'threshold' => 0.7];
            }
            if ($s['warnings'] > 0) {
                $items = [['kind_label' => 'إنذار أكاديمي', 'label' => 'المعدل التراكمي دون 2.00', 'semester' => '465', 'issued_at' => '2026-02-12']];
                if ($s['warnings'] > 1) {
                    $items[] = ['kind_label' => 'إنذار أكاديمي ثانٍ', 'label' => 'استمرار المعدل دون 2.00', 'semester' => DemoCohort::GRADED_SEMESTER, 'issued_at' => '2026-06-30'];
                }
                $fired['T10'] = ['items' => $items, 'active_items' => count($items)];
            }
            if ($worstCourse['absence_percent'] >= 15) {
                $fired['T11'] = ['courses' => array_values(array_map(fn ($c) => ['course_code' => $c['course_code'], 'course_name' => $c['course_name'], 'absence_percent' => $c['absence_percent'], 'absent_lectures' => count($c['absence_dates']), 'excused_lectures' => (int) round(count($c['absence_dates']) * 0.3)], array_filter($s['courses'], fn ($c) => $c['absence_percent'] >= 10))), 'max_absence_percent' => $worstCourse['absence_percent'], 'at_or_past_bar' => $worstCourse['absence_percent'] >= 25, 'bar_percent' => 25];
            }
            if ($seed('q'.$id) % 9 === 0) {
                $fired['T12'] = ['accuracy' => round(0.3 + ($seed('acc'.$id) % 25) / 100, 2), 'served' => 12 + $seed('srv'.$id) % 30, 'course_code' => $s['courses'][0]['course_code'], 'window_days' => 14, 'wrong' => 6 + $seed('w'.$id) % 10, 'timeout' => $seed('to'.$id) % 4];
            }

            // Historical terms: the same student, thinner — the need was smaller
            // and some of it was resolved by the term's end.
            foreach ($codes as $ti => $term) {
                foreach ($fired as $code => $payload) {
                    $isCurrent = $term === $current;
                    if (! $isCurrent && $seed($term.$code.$id) % 100 > 55 - $ti * 8) {
                        continue;
                    }
                    if ($isCurrent && $code === 'T5') {
                        continue;
                    }
                    $day = $seed('d'.$term.$code.$id) % max(7, min(7 * $weeks, 63));
                    $detected = $isCurrent ? $termStart->addDays($day)->setTime(2, 10 + $seed('m'.$id) % 40) : CarbonImmutable::parse('2026-0'.(2 + $ti).'-10')->addDays($day % 40);
                    $resolved = ! $isCurrent ? ($seed('r'.$term.$id) % 100 < 45) : ($seed('r'.$term.$id) % 100 < 12);
                    $signals[] = [
                        'id' => ++$sid, 'student_id' => $id, 'semester' => $term, 'trigger_code' => $code,
                        'severity' => (string) ($triggers[$code]['severity'] ?? 'medium'), 'detected_at' => $detected,
                        'resolved_at' => $resolved ? $detected->addDays(9 + $seed('rd'.$id) % 30) : null,
                        'resolution' => $resolved ? ['سجّل مقررات الفصل', 'تحسّن المعدل الفصلي', 'زال سبب الإشارة بعد اللقاء'][$seed('rs'.$id.$code) % 3] : null,
                        'payload' => $payload, 'demo' => false,
                    ];
                }
            }

            // A booking for most of this term's signalled students: the first
            // shared gap the matcher found. Three in five are in the past
            // (dispatched; half of those held), the rest lie ahead.
            $open = array_keys($fired);
            if ($open !== [] && $seed('book'.$id) % 100 < 68) {
                $worst = collect($open)->sortByDesc(fn ($c) => self::RANK[$triggers[$c]['severity'] ?? 'medium'] ?? 0)->first();
                $dayIndex = 1 + $seed('day'.$id) % 5;
                $bucket = 480 + 15 * ($seed('slot'.$id) % 26);
                if ($bucket >= 720 && $bucket < 750) {
                    $bucket = 750;
                }
                $weekOffset = ($seed('wk'.$id) % max(2, $weeks + 3)) - 1;
                $date = $termStart->addWeeks(max(0, $weekOffset))->addDays($dayIndex - 1)->setTime(intdiv($bucket, 60), $bucket % 60);
                $past = $date->lessThan($now);
                $held = $past && $seed('held'.$id) % 100 < 55;
                $noShow = $past && ! $held && $seed('ns'.$id) % 100 < 20;
                $mode = $seed('mode'.$id) % 3 === 0 ? 'teams' : 'on_campus';
                $sigId = null;
                foreach ($signals as $sg) {
                    if ($sg['student_id'] === $id && $sg['semester'] === $current && $sg['trigger_code'] === $worst) {
                        $sigId = $sg['id'];
                        break;
                    }
                }
                $advisorName = $s['advisor_name'];
                $reasons = [
                    "أول فراغ مشترك بعد الرصد داخل نافذة الإرشاد؛ للطالب محاضرة قبله بساعة وللمرشد ساعات مكتبية بعده.",
                    "الفراغ الوحيد المشترك في الأسبوع الأول بعد الرصد؛ البدائل تقع بعد أسبوعين.",
                    "فراغ مشترك في منتصف الأسبوع بعيداً عن أيام الاختبارات القصيرة للطالب.",
                ];
                $appointments[] = [
                    'id' => ++$aid, 'student_id' => $id, 'semester' => $current, 'advisor_employee_id' => $s['advisor_id'], 'advisor_name' => $advisorName,
                    'trigger_code' => $worst, 'advising_signal_id' => $sigId, 'origin' => 'proactive',
                    'status' => $held ? 'held' : ($noShow ? 'no_show' : ($past ? 'dispatched' : 'scheduled')),
                    'day_index' => $dayIndex, 'bucket' => $bucket, 'scheduled_at' => $date, 'ends_at' => $date->addMinutes(30),
                    'mode' => $mode, 'location' => $mode === 'teams' ? null : 'مبنى '.$s['faculty_no'].' · مكتب '.(200 + $seed('rm'.$s['advisor_id']) % 60),
                    'join_url' => $mode === 'teams' ? 'https://teams.microsoft.com/l/meetup-join/demo-'.substr(md5($id), 0, 10) : null,
                    'slot_reason' => $reasons[$seed('why'.$id) % 3], 'slot_score' => 62 + $seed('sc'.$id) % 36,
                    'dispatched_at' => $past || $seed('disp'.$id) % 100 < 70 ? $date->subDays(3)->setTime(6, 0) : null,
                    'held_at' => $held ? $date->addMinutes(28) : null,
                    'minutes' => $held ? $this->minutesFor($s, $worst, $triggers) : null,
                    'recommendations' => $held ? $this->recommendationsFor($worst) : [],
                    'note' => null,
                    'alternatives' => [
                        ['day' => 1 + ($dayIndex % 5), 'start' => $bucket + 60 > 885 ? 495 : $bucket + 60, 'score' => 55 + $seed('a1'.$id) % 20, 'reason' => 'فراغ مشترك لكنه ملاصق لمحاضرة الطالب'],
                        ['day' => 1 + (($dayIndex + 2) % 5), 'start' => 540 + 15 * ($seed('a2'.$id) % 8), 'score' => 40 + $seed('a3'.$id) % 20, 'reason' => 'في اليوم نفسه الذي للمرشد فيه أربعة لقاءات'],
                    ],
                ];
                $apt = end($appointments);
                $log = fn (string $type, string $channel, ?string $recipient, string $detail, CarbonImmutable $at, string $status = 'done') => $actions[] = ['appointment_id' => $apt['id'], 'student_id' => $id, 'semester' => $current, 'type' => $type, 'channel' => $channel, 'recipient' => $recipient, 'status' => $status, 'detail' => $detail, 'performed_at' => $at];
                $detectedAt = $date->subDays(4)->setTime(2, 30);
                $log(AdvisingAction::TYPE_SCHEDULED, AdvisingAction::CHANNEL_SYSTEM, null, 'حُسب الموعد من أول فراغ مشترك (ترجيح '.$apt['slot_score'].')', $detectedAt->addHours(1));
                if ($apt['dispatched_at'] !== null) {
                    if ($mode === 'teams') {
                        $log(AdvisingAction::TYPE_TEAMS_CREATED, AdvisingAction::CHANNEL_TEAMS, null, 'أُنشئ رابط الاجتماع وأُرفق بالدعوة', $apt['dispatched_at']);
                    }
                    $log(AdvisingAction::TYPE_EMAIL_STUDENT, AdvisingAction::CHANNEL_EMAIL, $id.'@example.edu', 'دعوة اللقاء الإرشادي مع سببه', $apt['dispatched_at']->addMinutes(1));
                    $log(AdvisingAction::TYPE_EMAIL_ADVISOR, AdvisingAction::CHANNEL_EMAIL, DemoCohort::advisor($s['advisor_id'])['email'] ?? null, 'ملخص إشارة الطالب والموعد المقترح', $apt['dispatched_at']->addMinutes(2), $seed('fail'.$id) % 23 === 0 ? 'failed' : 'done');
                    $log(AdvisingAction::TYPE_PLATFORM_NOTIFICATION, AdvisingAction::CHANNEL_PLATFORM, $id, 'تنبيه داخل +QSpark بالموعد', $apt['dispatched_at']->addMinutes(3));
                }
                if ($held) {
                    $log(AdvisingAction::TYPE_HELD, AdvisingAction::CHANNEL_SYSTEM, null, 'سجّل المرشد انعقاد اللقاء ودوّن المحضر', $apt['held_at']);
                    if ($seed('out'.$id) % 100 < 70) {
                        $before = $s['cumulative_gpa'];
                        $after = round(max(1.0, min(5.0, $before + (($seed('delta'.$id) % 100 < 72) ? 0.12 + ($seed('dv'.$id) % 40) / 100 : -0.05 - ($seed('dv'.$id) % 20) / 100))), 2);
                        $measuredAt = $apt['held_at']->addDays(21);
                        $outcomes[] = ['appointment_id' => $apt['id'], 'student_id' => $id, 'gpa_before' => $before, 'gpa_after' => $after, 'registered_after' => $seed('reg'.$id) % 100 < 80, 'signal_resolved' => $after > $before && $seed('res'.$id) % 100 < 75, 'note' => 'قِيس بعد ثلاثة أسابيع من اللقاء على آخر تحديث للمعدل', 'measured_at' => $measuredAt];
                        $log(AdvisingAction::TYPE_OUTCOME_MEASURED, AdvisingAction::CHANNEL_SYSTEM, null, 'أُعيد فحص الإشارة والمعدل بعد اللقاء', $measuredAt);
                    }
                } elseif ($noShow) {
                    $log(AdvisingAction::TYPE_NO_SHOW, AdvisingAction::CHANNEL_SYSTEM, null, 'لم يحضر الطالب؛ أُعيد الطلب إلى المطابقة', $date->addMinutes(20));
                }
            }
        }

        return self::$world = compact('signals', 'appointments', 'actions', 'outcomes');
    }

    private function minutesFor(array $s, string $trigger, array $triggers): string
    {
        $label = (string) ($triggers[$trigger]['label'] ?? $trigger);

        return "ناقش المرشد مع الطالب سبب الإشارة «{$label}». أوضح الطالب ظروف الفصل الماضي واتُّفق على خطة متابعة أسبوعية.\n"
            .'تمت مراجعة المقررات المسجّلة ('.implode('، ', array_slice(array_column($s['courses'], 'course_code'), 0, 3)).') وتحديد المقرر الأكثر تأثيراً على المعدل.'
            ."\nيلتزم الطالب بحضور الساعات المكتبية للمقرر مرتين أسبوعياً، ويُعاد اللقاء بعد ثلاثة أسابيع.";
    }

    /** @return array<int, string> */
    private function recommendationsFor(string $trigger): array
    {
        return match ($trigger) {
            'T1', 'T2' => ['إعادة تسجيل المقرر الراسب في أول فصل يُطرح فيه مع مدرّس مختلف', 'حضور ساعتين مكتبيتين أسبوعياً لمقرر التعثّر', 'الالتحاق ببرنامج التدريس بالأقران للمقرر'],
            'T3', 'T4' => ['خفض العبء إلى 12 ساعة في الفصل القادم', 'خطة مذاكرة أسبوعية موثّقة تُراجع في اللقاء التالي', 'إحالة لمركز الإرشاد الطلابي عند تكرار الهبوط'],
            'T11' => ['الالتزام بالحضور الكامل حتى نهاية الفصل — الحدّ 25%', 'تقديم أعذار الغياب المسجّلة للعمادة خلال أسبوع', 'مراجعة المرشد قبل موعد الحرمان بأسبوعين'],
            'T10' => ['رفع المعدل التراكمي فوق 2.00 هذا الفصل لإلغاء الإنذار', 'حصر المقررات على المتطلبات الأساسية', 'متابعة أسبوعية مع المرشد'],
            default => ['مراجعة الخطة الدراسية وتثبيت مقررات الفصل القادم', 'موعد متابعة بعد ثلاثة أسابيع', 'استخدام منصة QSpark للتدريب على مقرر التعثّر'],
        };
    }

    // ── النطاق ────────────────────────────────────────────────────────────

    /** @return array<int, string>|null ids in scope, or null for no narrowing */
    private function scopeIds(?string $advisor, ?string $faculty): ?array
    {
        if ($advisor === '') {
            return [];
        }
        if (($advisor === null) && ($faculty === null || $faculty === '')) {
            return null;
        }
        $ids = [];
        foreach (DemoCohort::all() as $s) {
            if ($advisor !== null && $s['advisor_id'] !== $advisor) {
                continue;
            }
            if ($faculty !== null && $faculty !== '' && $s['faculty_name'] !== $faculty) {
                continue;
            }
            $ids[] = (string) $s['student_id'];
        }

        return $ids;
    }

    /** @return array<int, array<string, mixed>> */
    private function signalsIn(?string $advisor, ?string $faculty, ?string $semester = null, ?string $trigger = null, bool $openOnly = false): array
    {
        $ids = $this->scopeIds($advisor, $faculty);
        $onTrigger = null;
        if ($trigger !== null && $trigger !== '') {
            $onTrigger = [];
            foreach ($this->world()['signals'] as $sg) {
                if ($sg['trigger_code'] === $trigger && $sg['resolved_at'] === null && ($semester === null || $sg['semester'] === $semester)) {
                    $onTrigger[$sg['student_id']] = true;
                }
            }
        }

        return array_values(array_filter($this->world()['signals'], fn ($sg) => ($ids === null || in_array($sg['student_id'], $ids, true))
            && ($semester === null || $sg['semester'] === $semester)
            && ($onTrigger === null || isset($onTrigger[$sg['student_id']]))
            && (! $openOnly || $sg['resolved_at'] === null)));
    }

    /** @return array<int, array<string, mixed>> */
    private function appointmentsIn(?string $advisor, ?string $faculty, string $semester, ?string $trigger = null): array
    {
        $ids = $this->scopeIds($advisor, $faculty);
        $onTrigger = $trigger ? array_flip(array_unique(array_column($this->signalsIn(null, null, $semester, $trigger, true), 'student_id'))) : null;

        return array_values(array_filter($this->world()['appointments'], fn ($a) => $a['semester'] === $semester
            && ($ids === null || in_array($a['student_id'], $ids, true))
            && ($onTrigger === null || isset($onTrigger[$a['student_id']]))));
    }

    private function isActive(array $a): bool
    {
        return ! in_array($a['status'], ['cancelled', 'rescheduled'], true);
    }

    // ── نظرة عامة ─────────────────────────────────────────────────────────

    public function semesterStrip(?string $advisor, ?string $faculty = null): array
    {
        return array_map(function (array $row) use ($advisor, $faculty) {
            $signals = $this->signalsIn($advisor, $faculty, $row['code']);
            $per = [];
            foreach ($signals as $sg) {
                $per[$sg['student_id']] = ($per[$sg['student_id']] ?? 0) + 1;
            }
            $bookings = array_filter($this->appointmentsIn($advisor, $faculty, $row['code']), fn ($a) => $this->isActive($a));
            $detected = count($per);
            $matched = count(array_unique(array_column($bookings, 'student_id')));

            return $row + [
                'students' => $detected, 'multi' => count(array_filter($per, fn ($n) => $n > 1)),
                'appointments' => count($bookings), 'scheduled_students' => $matched,
                'feasibility' => $detected > 0 ? round($matched / $detected * 100, 1) : null,
            ];
        }, $this->semesters());
    }

    public function kpis(?string $advisor, string $semester, ?string $faculty = null): array
    {
        $c = $this->counts($advisor, $semester, $faculty);

        return [
            $this->ratio('proactivity', 'نسبة الاستباقية', 'المواعيد الاستباقية ÷ كل المواعيد', $c['proactive'], $c['appointments'], 'كم من المواعيد بادر بها النظام دون أن يطلبها أحد.'),
            $this->ratio('coverage', 'تغطية المتعثرين', 'طلاب لهم موعد ÷ طلاب ظهرت لهم إشارة', $c['matched_students'], $c['signal_students'], 'الفجوة بين من رُصد ومن حُجز له لقاء — وهي المقياس الصادق للتغطية.'),
            $this->duration('response', 'زمن الاستجابة', 'وسيط (موعد اللقاء − لحظة الرصد)', $c['response_median_hours'], 'وسيط لا متوسط: موعدٌ واحد بعيد يرفع المتوسط ويترك النصف الآخر مخفياً.'),
            $this->ratio('feasibility', 'جدوى المطابقة', 'طلاب طوبقوا ÷ طلاب حاول النظام مطابقتهم', $c['matched_students'], $c['signal_students'], 'الطالب الذي لم يوجد له فراغ مشترك مع مرشده يبقى إشارةً بلا موعد.'),
            $this->ratio('attendance', 'نسبة الحضور', 'اللقاءات المنعقدة ÷ المواعيد المُرسلة', $c['held'], $c['dispatched'], 'تُقاس على المُرسل فقط: موعدٌ لم يُرسل لا يُحاسب عليه أحد بالغياب.'),
            $this->ratio('closure', 'انغلاق الإشارة', 'إشارات أُغلقت ÷ إشارات رُصدت', $c['resolved'], $c['raised'], 'الإشارة تُغلق حين يزول سببها — تسجيلٌ تمّ أو معدلٌ تعافى، لا حين يُعقد اللقاء.'),
        ];
    }

    public function counts(?string $advisor, string $semester, ?string $faculty = null, ?string $trigger = null): array
    {
        $trigger = $trigger === '' ? null : $trigger;
        $apts = $this->appointmentsIn($advisor, $faculty, $semester, $trigger);
        $signals = $this->signalsIn($advisor, $faculty, $semester, $trigger);
        $active = array_filter($apts, fn ($a) => $this->isActive($a));
        $hours = [];
        foreach ($apts as $a) {
            foreach ($this->world()['signals'] as $sg) {
                if ($sg['id'] === $a['advising_signal_id']) {
                    $hours[] = ($a['scheduled_at']->getTimestamp() - $sg['detected_at']->getTimestamp()) / 3600;
                    break;
                }
            }
        }
        sort($hours);
        $median = null;
        if ($hours !== []) {
            $m = intdiv(count($hours), 2);
            $median = round(count($hours) % 2 ? $hours[$m] : ($hours[$m - 1] + $hours[$m]) / 2, 1);
        }

        return [
            'appointments' => count($apts),
            'proactive' => count(array_filter($apts, fn ($a) => in_array($a['origin'], ['proactive', 'demo'], true))),
            'dispatched' => count(array_filter($apts, fn ($a) => $a['dispatched_at'] !== null)),
            'held' => count(array_filter($apts, fn ($a) => $a['status'] === 'held')),
            'matched_students' => count(array_unique(array_column($active, 'student_id'))),
            'raised' => count($signals),
            'signal_students' => count(array_unique(array_column($signals, 'student_id'))),
            'resolved' => count(array_filter($signals, fn ($sg) => $sg['resolved_at'] !== null)),
            'response_median_hours' => $median,
        ];
    }

    // ── الخطوات ───────────────────────────────────────────────────────────

    public function triggers(?string $advisor, ?string $faculty = null): array
    {
        $configured = (array) config('advising.triggers', []);
        $codes = $this->semesterCodes();
        $counts = [];
        foreach ($this->signalsIn($advisor, $faculty) as $sg) {
            $counts[$sg['trigger_code']][$sg['semester']][$sg['student_id']] = true;
        }
        $rows = [];
        foreach ($configured as $code => $trigger) {
            $available = $code !== 'T5';
            $per = array_map(fn (string $sem) => $available ? count($counts[$code][$sem] ?? []) : null, $codes);
            $rows[] = [
                'code' => (string) $code, 'label' => (string) ($trigger['label'] ?? $code),
                'severity' => (string) ($trigger['severity'] ?? 'medium'), 'severity_label' => $this->severityLabel((string) ($trigger['severity'] ?? 'medium')),
                'tier' => (string) ($trigger['tier'] ?? 'bulk'), 'tier_label' => ($trigger['tier'] ?? 'bulk') === 'advisor' ? 'لكل مرشد' : 'بالجملة',
                'detects' => (string) ($trigger['detects'] ?? ''), 'window_days' => (int) ($trigger['window_days'] ?? 0),
                'available' => $available, 'unavailable_reason' => $available ? null : 'معطّلة — لم يُفتح التسجيل للفصل القادم بعد',
                'semesters' => $per, 'total' => $available ? array_sum($per) : null,
            ];
        }

        return $rows;
    }

    public function triggerAvailable(array $trigger): bool
    {
        return (bool) ($trigger['enabled'] ?? true);
    }

    public function sisSummary(string $semester, ?string $faculty = null): array
    {
        $rows = array_values(array_filter(DemoCohort::all(), fn ($s) => $faculty === null || $faculty === '' || $s['faculty_name'] === $faculty));
        $n = count($rows);
        $count = fn (callable $f) => count(array_filter($rows, $f));
        $lowSem = $count(fn ($s) => ($s['terms'][count($s['terms']) - 1]['semester_gpa'] ?? 5) < 2.0);
        $lowCum = $count(fn ($s) => $s['cumulative_gpa'] < 2.0);
        $fails = $count(fn ($s) => $s['failed_courses'] >= 3);
        $warn = $count(fn ($s) => $s['warnings'] > 0);
        $halted = (int) round($n * 0.012);
        $pen = (int) round($n * 0.006);
        $near = $count(fn ($s) => max(array_column($s['courses'], 'absence_percent')) >= 15 && max(array_column($s['courses'], 'absence_percent')) < 25);
        $past = $count(fn ($s) => max(array_column($s['courses'], 'absence_percent')) >= 25);

        return [
            'ok' => true, 'reason' => null, 'as_of' => CarbonImmutable::now()->subHours(5)->format('Y-m-d\TH:i'),
            'students' => $n, 'thresholds' => ['gpa_below' => 2.0, 'fails_from' => 3, 'absence_from' => 15, 'absence_bar' => 25],
            'tiles' => [
                ['key' => 'registered_students', 'label' => 'طلاب مسجّلون', 'value' => $n, 'hint' => 'في شعبة واحدة على الأقل'],
                ['key' => 'low_semester_gpa', 'label' => 'معدل فصلي منخفض', 'value' => $lowSem, 'hint' => 'دون 2.00'],
                ['key' => 'low_cumulative_gpa', 'label' => 'معدل تراكمي منخفض', 'value' => $lowCum, 'hint' => 'دون 2.00'],
                ['key' => 'multiple_fails', 'label' => 'رسوب متعدد', 'value' => $fails, 'hint' => '3 مقررات فأكثر'],
                ['key' => 'warnings_issued', 'label' => 'إنذارات مسجّلة', 'value' => $warn, 'hint' => 'سجل الإنذارات'],
                ['key' => 'halted', 'label' => 'إيقاف قيد', 'value' => $halted, 'hint' => 'آخر ٣٦٥ يوماً'],
                ['key' => 'penalised', 'label' => 'عقوبات', 'value' => $pen, 'hint' => 'هذا الفصل'],
                ['key' => 'absence_approaching_bar', 'label' => 'يقتربون من الحرمان', 'value' => $near, 'hint' => 'غياب 15–25٪'],
                ['key' => 'absence_at_or_past_bar', 'label' => 'بلغوا حدّ الحرمان', 'value' => $past, 'hint' => 'غياب 25٪ فأكثر'],
            ],
            'by_trigger' => [
                'T1' => ['value' => $fails, 'caption' => 'رسوب في 3 مقررات فأكثر هذا الفصل'],
                'T3' => ['value' => $lowSem, 'caption' => 'معدل فصلي دون 2.00'],
                'T10' => ['value' => $warn + $halted + $pen, 'caption' => 'إنذار مسجّل أو إيقاف قيد أو عقوبة'],
                'T11' => ['value' => $near + $past, 'caption' => 'غياب 15٪ فأكثر في مقرر'],
            ],
        ];
    }

    // ── الطلاب ────────────────────────────────────────────────────────────

    public function students(?string $advisor, string $semester, ?string $faculty = null, int $limit = 60, ?string $trigger = null): array
    {
        return $this->studentsPage($advisor, $semester, $faculty, 1, $limit, $trigger)['items'];
    }

    public function studentsPage(?string $advisor, string $semester, ?string $faculty = null, int $page = 1, int $perPage = self::DEFAULT_PER_PAGE, ?string $trigger = null): array
    {
        $page = max(1, $page);
        $perPage = max(1, $perPage);
        $signals = $this->signalsIn($advisor, $faculty, $semester, $trigger === '' ? null : $trigger);
        $byStudent = [];
        foreach ($signals as $sg) {
            $byStudent[$sg['student_id']][] = $sg;
        }
        $ranked = [];
        foreach ($byStudent as $id => $rows) {
            $top = max(array_map(fn ($sg) => self::RANK[$sg['severity']] ?? 0, $rows));
            $ranked[] = ['id' => (string) $id, 'n' => count($rows), 'top' => $top];
        }
        usort($ranked, fn ($a, $b) => [$a['n'] > 1 ? 0 : 1, -$a['top'], -$a['n'], $a['id']] <=> [$b['n'] > 1 ? 0 : 1, -$b['top'], -$b['n'], $b['id']]);
        $total = count($ranked);
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = min($page, $lastPage);
        $slice = array_slice($ranked, ($page - 1) * $perPage, $perPage);
        $apts = $this->world()['appointments'];

        $items = [];
        foreach ($slice as $entry) {
            $s = DemoCohort::find($entry['id']);
            $rows = $byStudent[$entry['id']];
            usort($rows, fn ($a, $b) => [-(self::RANK[$a['severity']] ?? 0), $a['trigger_code']] <=> [-(self::RANK[$b['severity']] ?? 0), $b['trigger_code']]);
            $booking = null;
            foreach ($apts as $a) {
                if ($a['student_id'] === $entry['id'] && $a['semester'] === $semester && $this->isActive($a)) {
                    $booking = $a;
                    break;
                }
            }
            $items[] = [
                'student_id' => $entry['id'], 'name' => $s['name'] ?? null, 'faculty' => $s['faculty_name'] ?? null, 'department' => $s['dept_name'] ?? null, 'major' => $s['major_name'] ?? null,
                'advisor_employee_id' => $s['advisor_id'] ?? null, 'advisor_name' => $s['advisor_name'] ?? null, 'advisor_schedulable' => true,
                'signal_count' => $entry['n'], 'multi' => $entry['n'] > 1, 'top_rank' => $entry['top'],
                'severity' => $this->severityFromRank($entry['top']), 'severity_label' => $this->severityLabel($this->severityFromRank($entry['top'])),
                'signals' => array_map(fn ($sg) => $this->signalRow($sg), $rows),
                'appointment' => $booking === null ? null : [
                    'status' => $booking['status'], 'status_label' => self::STATUS_LABELS[$booking['status']] ?? $booking['status'],
                    'when' => $booking['scheduled_at']->format('Y-m-d H:i'), 'day_label' => self::DAY_LABELS[$booking['day_index']] ?? null,
                    'time' => $booking['scheduled_at']->format('H:i'), 'dispatched' => $booking['dispatched_at'] !== null,
                ],
            ];
        }

        return ['items' => $items, 'total' => $total, 'page' => $page, 'per_page' => $perPage, 'last_page' => $lastPage];
    }

    private function signalRow(array $sg): array
    {
        return [
            'code' => $sg['trigger_code'], 'label' => (string) config("advising.triggers.{$sg['trigger_code']}.label", $sg['trigger_code']),
            'severity' => $sg['severity'], 'severity_label' => $this->severityLabel($sg['severity']),
            'detected_at' => $sg['detected_at']->format('Y-m-d H:i'), 'resolved' => $sg['resolved_at'] !== null, 'resolution' => $sg['resolution'], 'demo' => false,
            'evidence' => $this->evidence($sg['payload']), 'summary' => $this->signalSummary($sg['trigger_code'], $sg['payload']),
        ];
    }

    public function evidence(?array $payload): array
    {
        return [];
    }

    /** One sentence, one number, Arabic-labelled rows — per step. */
    public function signalSummary(string $trigger, ?array $p): array
    {
        $p = is_array($p) ? $p : [];
        $gpa = fn ($v) => number_format((float) $v, 2, '.', '');
        $pct = fn ($v) => rtrim(rtrim(number_format((float) $v, 1, '.', ''), '0'), '.');
        $row = fn (?string $label, ?string $code, string $value) => ['label' => $label, 'code' => $code, 'value' => $value];

        return match ($trigger) {
            'T1' => ['headline' => "رسب في {$p['failed_courses']} من {$p['graded_courses']} مقررات في الفصل {$p['semester']}", 'stat' => ['value' => (string) $p['failed_courses'], 'label' => 'مقررات راسبة', 'tone' => 'bad'],
                'details' => array_map(fn ($c) => $row($c['course_name'], $c['course_code'], "{$c['final_grade']} ({$c['letter_grade']}) · الفصل {$c['semester']}"), $p['courses'])],
            'T2' => (function () use ($p, $row) {
                $c = $p['courses'][0];
                $att = implode(' · ', array_map(fn ($a) => "{$a['semester']}: {$a['final_grade']} ({$a['letter_grade']})", $c['attempts']));

                return ['headline' => "رسب مرتين في {$c['course_code']} بين {$c['attempts'][0]['semester']} و{$c['attempts'][1]['semester']}", 'stat' => ['value' => '1', 'label' => 'مقررات مكرّرة', 'tone' => 'bad'], 'details' => [$row($c['course_name'], $c['course_code'], "مرتين — {$att}")]];
            })(),
            'T3' => ['headline' => 'المعدل الفصلي '.$gpa($p['semester_gpa'])." في الفصل {$p['semester']} — نجح في {$p['passed_hours']} من {$p['attempted_hours']} ساعة", 'stat' => ['value' => $gpa($p['semester_gpa']), 'label' => 'المعدل الفصلي', 'tone' => 'bad'],
                'details' => [$row('المعدل الفصلي', null, $gpa($p['semester_gpa'])), $row('المعدل التراكمي', null, $gpa($p['cumulative_gpa'])), $row('الساعات المسجّلة', null, (string) $p['attempted_hours']), $row('الساعات المجتازة', null, (string) $p['passed_hours']), $row('حدّ الرصد', null, 'أقل من 2.00')]],
            'T4' => ['headline' => 'هبط المعدل من '.$gpa($p['previous_gpa']).' إلى '.$gpa($p['semester_gpa'])." بين {$p['previous_semester']} و{$p['semester']} (−".$gpa($p['drop']).')', 'stat' => ['value' => '−'.$gpa($p['drop']), 'label' => 'الهبوط', 'tone' => $p['drop'] >= 1 ? 'bad' : 'warn'],
                'details' => [$row("المعدل السابق ({$p['previous_semester']})", null, $gpa($p['previous_gpa'])), $row("المعدل الحالي ({$p['semester']})", null, $gpa($p['semester_gpa'])), $row('مقدار الهبوط', null, '−'.$gpa($p['drop'])), $row('حدّ الرصد', null, 'هبوط 0.50 فأكثر')]],
            'T6' => ['headline' => "عاد في {$p['semester']} بعد انقطاع فصل واحد — آخر ظهور {$p['last_seen']}", 'stat' => ['value' => '1', 'label' => 'فصول انقطاع', 'tone' => 'warn'],
                'details' => [$row('الفصول التي غاب عنها', null, implode('، ', $p['absent'])), $row('آخر فصل ظهر فيه', null, $p['last_seen'])]],
            'T7' => ['headline' => 'مقرر واحد خارج الخطة ومتطلب سابق مؤجّل', 'stat' => ['value' => '2', 'label' => 'انحرافات', 'tone' => 'warn'],
                'details' => [$row('خارج الخطة', null, implode('، ', $p['off_plan'])), $row('متطلب سابق مؤجّل', $p['delayed_prerequisites'][0]['course'], 'يتطلّب '.$p['delayed_prerequisites'][0]['prerequisite']), $row('المجتاز من الخطة', null, "{$p['passed_courses']} من {$p['plan_courses']}")]],
            'T8' => ['headline' => ($p['remaining'] === 1 ? 'بقي مقرر واحد' : ($p['remaining'] === 2 ? 'بقي مقررين' : "بقي {$p['remaining']} مقررات"))." للتخرج من أصل {$p['plan_total']}", 'stat' => ['value' => (string) $p['remaining'], 'label' => 'مقررات متبقية', 'tone' => 'ok'],
                'details' => [$row('المقررات المتبقية', null, implode('، ', $p['remaining_courses'])), $row('المقررات المجتازة', null, (string) $p['passed_courses'])]],
            'T9' => (function () use ($p, $row) {
                $pc = (int) round($p['probability'] * 100);

                return ['headline' => "احتمال التعثّر {$pc}٪ في {$p['course']}", 'stat' => ['value' => "{$pc}٪", 'label' => 'احتمال التعثّر', 'tone' => $pc >= 85 ? 'bad' : 'warn'], 'details' => [$row('احتمال التعثّر', null, "{$pc}٪"), $row('النموذج', null, $p['model']), $row('حدّ الرصد', null, '70٪ فأكثر')]];
            })(),
            'T10' => ['headline' => implode(' و', array_unique(array_column($p['items'], 'kind_label'))).' — '.($p['active_items'] === 1 ? 'عنصر واحد سارٍ' : 'عنصران ساريان'), 'stat' => ['value' => (string) $p['active_items'], 'label' => 'عناصر سارية', 'tone' => 'bad'],
                'details' => array_map(fn ($i) => $row($i['kind_label'], null, "{$i['label']} · الفصل {$i['semester']} · {$i['issued_at']}"), $p['items'])],
            'T11' => ['headline' => 'غياب '.$pct($p['max_absence_percent']).'٪ في '.$p['courses'][0]['course_code'].($p['at_or_past_bar'] ? ' — تجاوز حدّ الحرمان' : ' — يقارب حدّ الحرمان (25٪)'), 'stat' => ['value' => $pct($p['max_absence_percent']).'٪', 'label' => 'أعلى نسبة غياب', 'tone' => $p['at_or_past_bar'] ? 'bad' : 'warn'],
                'details' => array_map(fn ($c) => $row($c['course_name'], $c['course_code'], $pct($c['absence_percent']).'٪ ('.$c['absent_lectures'].' محاضرة بلا عذر'.($c['excused_lectures'] ? ' · '.$c['excused_lectures'].' بعذر' : '').')'), $p['courses'])],
            'T12' => (function () use ($p, $row) {
                $pc = (int) round($p['accuracy'] * 100);

                return ['headline' => "أجاب {$pc}٪ من {$p['served']} سؤالاً بشكل صحيح في {$p['course_code']} خلال {$p['window_days']} يوماً", 'stat' => ['value' => "{$pc}٪", 'label' => 'دقّة الإجابات', 'tone' => 'warn'], 'details' => [$row('إجابات خاطئة', null, (string) $p['wrong']), $row('أسئلة بلا إجابة', null, (string) $p['timeout'])]];
            })(),
            default => ['headline' => (string) config("advising.triggers.{$trigger}.label", $trigger), 'stat' => null, 'details' => []],
        };
    }

    // ── المواعيد ──────────────────────────────────────────────────────────

    public function appointments(?string $advisor, string $semester, ?string $faculty = null, int $limit = 80): array
    {
        return $this->appointmentsPage($advisor, $semester, $faculty, 1, $limit)['items'];
    }

    public function appointmentsPage(?string $advisor, string $semester, ?string $faculty = null, int $page = 1, int $perPage = self::DEFAULT_PER_PAGE): array
    {
        $page = max(1, $page);
        $perPage = max(1, $perPage);
        $rows = $this->appointmentsIn($advisor, $faculty, $semester);
        usort($rows, fn ($a, $b) => [$a['scheduled_at']->getTimestamp(), $a['id']] <=> [$b['scheduled_at']->getTimestamp(), $b['id']]);
        $total = count($rows);
        $lastPage = max(1, (int) ceil($total / $perPage));
        $page = min($page, $lastPage);
        $items = array_map(fn ($a) => $this->appointmentRow($a), array_slice($rows, ($page - 1) * $perPage, $perPage));

        return ['items' => $items, 'total' => $total, 'page' => $page, 'per_page' => $perPage, 'last_page' => $lastPage];
    }

    private function appointmentRow(array $a): array
    {
        $s = DemoCohort::find($a['student_id']);

        return [
            'id' => $a['id'], 'student_id' => $a['student_id'], 'student_name' => $s['name'] ?? null,
            'advisor_employee_id' => $a['advisor_employee_id'], 'advisor_name' => $a['advisor_name'],
            'trigger_code' => $a['trigger_code'], 'trigger_label' => (string) config("advising.triggers.{$a['trigger_code']}.label", $a['trigger_code']),
            'origin' => $a['origin'], 'origin_label' => self::ORIGIN_LABELS[$a['origin']] ?? $a['origin'],
            'status' => $a['status'], 'status_label' => self::STATUS_LABELS[$a['status']] ?? $a['status'],
            'day_label' => self::DAY_LABELS[$a['day_index']] ?? '—', 'date' => $a['scheduled_at']->format('Y-m-d'), 'time' => $a['scheduled_at']->format('H:i'), 'ends' => $a['ends_at']->format('H:i'),
            'mode' => $a['mode'], 'mode_label' => self::MODE_LABELS[$a['mode']] ?? $a['mode'], 'location' => $a['location'],
            'slot_reason' => $a['slot_reason'], 'slot_score' => $a['slot_score'],
            'dispatched' => $a['dispatched_at'] !== null, 'dispatched_at' => $a['dispatched_at']?->format('Y-m-d H:i'),
            'held' => $a['status'] === 'held', 'held_at' => $a['held_at']?->format('Y-m-d H:i'),
        ];
    }

    // ── الجدولة الذكية ────────────────────────────────────────────────────

    public function schedulablePairs(?string $advisor, string $semester, ?string $faculty = null, int $limit = 40): array
    {
        $rows = array_filter($this->appointmentsIn($advisor, $faculty, $semester), fn ($a) => $this->isActive($a));
        usort($rows, fn ($a, $b) => $a['scheduled_at'] <=> $b['scheduled_at']);
        $out = [];
        foreach (array_slice($rows, 0, $limit) as $a) {
            if (isset($out[$a['student_id']])) {
                continue;
            }
            $out[$a['student_id']] = ['student_id' => $a['student_id'], 'advisor_employee_id' => $a['advisor_employee_id'], 'label' => trim((DemoCohort::find($a['student_id'])['name'] ?? '').' · '.$a['student_id'], ' ·')];
        }

        return array_values($out);
    }

    public function schedule(?string $advisor, string $semester, ?string $studentId = null, ?string $faculty = null): array
    {
        $blank = ['available' => false, 'reason' => 'لا يوجد موعد محجوز في هذا النطاق بعد، فلا زوج طالب/مرشد تُرسم شبكته.', 'appointment' => null, 'days' => [], 'slots' => [], 'cells' => [], 'student_mask' => false, 'advisor_mask' => false, 'mask_error' => null, 'alternatives' => []];
        $rows = array_filter($this->appointmentsIn($advisor, $faculty, $semester), fn ($a) => $this->isActive($a) && ($studentId === null || $studentId === '' || $a['student_id'] === $studentId));
        usort($rows, fn ($a, $b) => $a['scheduled_at'] <=> $b['scheduled_at']);
        $a = $rows[0] ?? null;
        if ($a === null) {
            return $blank;
        }
        $window = (array) config('advising.window');
        $start = (int) ($window['day_start'] ?? 480);
        $end = (int) ($window['day_end'] ?? 900);
        $bucket = (int) ($window['bucket'] ?? 15);
        $meeting = (int) config('advising.meeting.minutes', 30);
        $blackouts = (array) ($window['blackouts'] ?? []);
        $slots = [];
        for ($m = $start; $m < $end; $m += $bucket) {
            $slots[] = ['minute' => $m, 'label' => sprintf('%02d:%02d', intdiv($m, 60), $m % 60)];
        }
        $days = array_map(fn (int $d) => ['index' => $d, 'label' => self::DAY_LABELS[$d]], (array) ($window['days'] ?? [1, 2, 3, 4, 5]));
        $student = DemoCohort::find($a['student_id']);
        // The student's classes: each course sits on two days at a fixed hour; the advisor teaches on three mornings.
        $busyStudent = [];
        foreach ($student['courses'] as $k => $c) {
            $h = 480 + 60 * (($k * 2 + crc32($c['course_code']) % 3) % 7);
            foreach ([1 + $k % 5, 1 + ($k + 2) % 5] as $d) {
                for ($m = $h; $m < $h + 50; $m += $bucket) {
                    $busyStudent[$d][$m] = true;
                }
            }
        }
        $busyAdvisor = [];
        foreach ([1, 3, 4] as $i => $d) {
            for ($m = 540 + $i * 60; $m < 540 + $i * 60 + 100; $m += $bucket) {
                $busyAdvisor[$d][$m] = true;
            }
            $busyAdvisor[$d][810] = $busyAdvisor[$d][825] = true;
        }
        $closed = fn (int $m) => collect($blackouts)->contains(fn ($b) => $m >= $b[0] && $m < $b[1]);
        $cells = [];
        foreach ($days as $day) {
            foreach ($slots as $slot) {
                $m = $slot['minute'];
                $chosen = $day['index'] === $a['day_index'] && $m >= $a['bucket'] && $m < $a['bucket'] + $meeting;
                $sb = isset($busyStudent[$day['index']][$m]);
                $ab = isset($busyAdvisor[$day['index']][$m]);
                $cells[$day['index']][$m] = [
                    'state' => match (true) { $chosen => 'chosen', $closed($m) => 'closed', $sb && $ab => 'both', $sb => 'student', $ab => 'advisor', default => 'free' },
                    'label' => match (true) { $chosen => 'الموعد المختار', $closed($m) => 'خارج نافذة الإرشاد', $sb && $ab => 'كلاهما مشغول', $sb => 'الطالب مشغول', $ab => 'المرشد مشغول', default => 'فراغ مشترك' },
                ];
            }
        }
        $row = $this->appointmentRow($a);

        return [
            'available' => true, 'reason' => null,
            'appointment' => ['student_id' => $a['student_id'], 'advisor_employee_id' => $a['advisor_employee_id'], 'trigger_label' => $row['trigger_label'], 'day_label' => $row['day_label'], 'date' => $row['date'], 'time' => $row['time'], 'ends' => $row['ends'], 'mode_label' => $row['mode_label'], 'location' => $a['location'], 'slot_reason' => $a['slot_reason'], 'slot_score' => (int) $a['slot_score'], 'status_label' => $row['status_label'], 'dispatched' => $row['dispatched']],
            'days' => $days, 'slots' => $slots, 'cells' => $cells, 'student_mask' => true, 'advisor_mask' => true, 'mask_error' => null,
            'alternatives' => array_map(fn ($alt) => ['day_label' => self::DAY_LABELS[$alt['day']] ?? '—', 'time' => sprintf('%02d:%02d', intdiv($alt['start'], 60), $alt['start'] % 60), 'score' => $alt['score'], 'reason' => $alt['reason']], $a['alternatives']),
            'window' => ['from' => sprintf('%02d:%02d', intdiv($start, 60), $start % 60), 'to' => sprintf('%02d:%02d', intdiv($end, 60), $end % 60), 'minutes' => $meeting],
        ];
    }

    // ── الأثر ─────────────────────────────────────────────────────────────

    public function impact(?string $advisor, string $semester, ?string $faculty = null): array
    {
        $apts = $this->appointmentsIn($advisor, $faculty, $semester);
        $ids = array_flip(array_column($apts, 'id'));
        $outs = array_values(array_filter($this->world()['outcomes'], fn ($o) => isset($ids[$o['appointment_id']])));
        if ($outs === []) {
            return ['available' => false, 'measured' => 0, 'resolved' => 0, 'resolved_rate' => null, 'registered_after' => 0, 'gpa_pairs' => 0, 'gpa_delta' => null, 'held' => 0, 'dispatched' => 0, 'rows' => []];
        }
        $resolved = count(array_filter($outs, fn ($o) => $o['signal_resolved']));
        $delta = array_sum(array_map(fn ($o) => $o['gpa_after'] - $o['gpa_before'], $outs)) / count($outs);
        usort($outs, fn ($a, $b) => abs($b['gpa_after'] - $b['gpa_before']) <=> abs($a['gpa_after'] - $a['gpa_before']));

        return [
            'available' => true, 'measured' => count($outs), 'resolved' => $resolved, 'resolved_rate' => round($resolved / count($outs) * 100, 1),
            'registered_after' => count(array_filter($outs, fn ($o) => $o['registered_after'])), 'gpa_pairs' => count($outs), 'gpa_delta' => round($delta, 2),
            'held' => count(array_filter($apts, fn ($a) => $a['status'] === 'held')), 'dispatched' => count(array_filter($apts, fn ($a) => $a['dispatched_at'] !== null)),
            'rows' => array_map(fn ($o) => ['student_id' => $o['student_id'], 'name' => DemoCohort::find($o['student_id'])['name'] ?? null, 'before' => round($o['gpa_before'], 2), 'after' => round($o['gpa_after'], 2), 'delta' => round($o['gpa_after'] - $o['gpa_before'], 2), 'resolved' => $o['signal_resolved']], array_slice($outs, 0, 10)),
        ];
    }

    // ── رسوم النظرة العامة ────────────────────────────────────────────────

    public function funnel(?string $advisor, string $semester, ?string $faculty = null): array
    {
        $c = $this->counts($advisor, $semester, $faculty);
        $active = array_filter($this->appointmentsIn($advisor, $faculty, $semester), fn ($a) => $this->isActive($a));
        $values = [
            ['key' => 'detected', 'label' => 'رُصدت إشارتهم', 'value' => $c['signal_students']],
            ['key' => 'scheduled', 'label' => 'جُدول لهم لقاء', 'value' => $c['matched_students']],
            ['key' => 'dispatched', 'label' => 'أُرسل إليهم', 'value' => count(array_unique(array_column(array_filter($active, fn ($a) => $a['dispatched_at'] !== null), 'student_id')))],
            ['key' => 'held', 'label' => 'انعقد لقاؤهم', 'value' => count(array_unique(array_column(array_filter($active, fn ($a) => $a['status'] === 'held'), 'student_id')))],
        ];
        $stages = [];
        $prev = null;
        foreach ($values as $st) {
            $st['conversion'] = $prev !== null && $prev > 0 ? round($st['value'] / $prev * 100, 1) : null;
            $prev = $st['value'];
            $stages[] = $st;
        }

        return ['available' => true, 'stages' => $stages];
    }

    public function severitySplit(?string $advisor, string $semester, ?string $faculty = null, ?string $trigger = null): array
    {
        $top = [];
        foreach ($this->signalsIn($advisor, $faculty, $semester, $trigger === '' ? null : $trigger) as $sg) {
            $top[$sg['student_id']] = max($top[$sg['student_id']] ?? 0, self::RANK[$sg['severity']] ?? 0);
        }
        $c = array_count_values(array_map('strval', $top));

        return ['available' => true, 'total' => count($top), 'critical' => (int) ($c['3'] ?? 0), 'high' => (int) ($c['2'] ?? 0), 'medium' => (int) (($c['1'] ?? 0) + ($c['0'] ?? 0))];
    }

    public function weeklyTrend(?string $advisor, string $semester, ?string $faculty = null): array
    {
        $signals = $this->signalsIn($advisor, $faculty, $semester);
        if ($signals === []) {
            return ['available' => false, 'total' => 0, 'points' => []];
        }
        $weeks = [];
        foreach ($signals as $sg) {
            $k = $sg['detected_at']->startOfWeek(CarbonImmutable::SUNDAY)->format('Y-m-d');
            $weeks[$k] = ($weeks[$k] ?? 0) + 1;
        }
        ksort($weeks);
        $points = [];
        for ($w = CarbonImmutable::parse(array_key_first($weeks)); $w->lessThanOrEqualTo(CarbonImmutable::parse(array_key_last($weeks))); $w = $w->addWeek()) {
            $points[] = ['label' => $w->format('d/m'), 'count' => (int) ($weeks[$w->format('Y-m-d')] ?? 0)];
        }

        return ['available' => true, 'total' => array_sum(array_column($points, 'count')), 'points' => $points];
    }

    // ── ملف الطالب ────────────────────────────────────────────────────────

    public function dossier(?string $advisor, string $semester, string $studentId, ?string $faculty = null): array
    {
        $refused = ['found' => false, 'reason' => 'لا يقع هذا الطالب داخل نطاقك، أو لا بيانات له في هذا الفصل.', 'student' => null, 'signals' => [], 'appointments' => [], 'actions' => [], 'actions_available' => true, 'outcome' => null, 'dispatch_enabled' => false];
        $ids = $this->scopeIds($advisor, $faculty);
        $s = DemoCohort::find(trim($studentId));
        if ($s === null || ($ids !== null && ! in_array($studentId, $ids, true))) {
            return $refused;
        }
        $signals = array_filter($this->world()['signals'], fn ($sg) => $sg['student_id'] === $studentId && $sg['semester'] === $semester);
        usort($signals, fn ($a, $b) => [$a['resolved_at'] === null ? 0 : 1, -(self::RANK[$a['severity']] ?? 0), $a['trigger_code']] <=> [$b['resolved_at'] === null ? 0 : 1, -(self::RANK[$b['severity']] ?? 0), $b['trigger_code']]);
        $apts = array_values(array_filter($this->world()['appointments'], fn ($a) => $a['student_id'] === $studentId && $a['semester'] === $semester));
        $aptIds = array_flip(array_column($apts, 'id'));
        $actions = array_values(array_filter($this->world()['actions'], fn ($x) => $x['student_id'] === $studentId && $x['semester'] === $semester));
        usort($actions, fn ($a, $b) => $a['performed_at'] <=> $b['performed_at']);
        $outcome = null;
        foreach ($this->world()['outcomes'] as $o) {
            if (isset($aptIds[$o['appointment_id']])) {
                $outcome = $o;
            }
        }

        return [
            'found' => true, 'reason' => null,
            'student' => ['id' => $studentId, 'name' => $s['name'], 'faculty' => $s['faculty_name'], 'major' => $s['major_name'], 'advisor_employee_id' => $s['advisor_id'], 'advisor_name' => $s['advisor_name'], 'advisor_schedulable' => true],
            'signals' => array_map(fn ($sg) => $this->signalRow($sg), $signals),
            'appointments' => array_map(fn ($a) => $this->appointmentRow($a), $apts),
            'actions' => array_map(fn ($x) => $this->actionRow($x, true), $actions),
            'actions_available' => true,
            'outcome' => $outcome === null ? null : ['gpa_before' => $outcome['gpa_before'], 'gpa_after' => $outcome['gpa_after'], 'delta' => round($outcome['gpa_after'] - $outcome['gpa_before'], 2), 'registered_after' => $outcome['registered_after'], 'signal_resolved' => $outcome['signal_resolved'], 'measured_at' => $outcome['measured_at']->format('Y-m-d')],
            'dispatch_enabled' => false,
        ];
    }

    private function actionRow(array $x, bool $human = false): array
    {
        $row = ['type' => $x['type'], 'label' => AdvisingAction::TYPE_LABELS[$x['type']] ?? $x['type'], 'channel' => $x['channel'], 'recipient' => $x['recipient'], 'status' => $x['status'], 'detail' => $x['detail'], 'performed_at' => $x['performed_at']->format('Y-m-d H:i')];
        if ($human) {
            $row['performed_human'] = $x['performed_at']->diffForHumans();
        }

        return $row;
    }

    public function appointment(?string $advisor, string $semester, int $id, ?string $faculty = null): array
    {
        $refused = ['found' => false, 'reason' => 'لا يقع هذا الموعد داخل نطاقك، أو لا وجود له في هذا الفصل.'];
        $a = null;
        foreach ($this->appointmentsIn($advisor, $faculty, $semester) as $row) {
            if ($row['id'] === $id) {
                $a = $row;
                break;
            }
        }
        if ($a === null) {
            return $refused;
        }
        $outcome = null;
        foreach ($this->world()['outcomes'] as $o) {
            if ($o['appointment_id'] === $id) {
                $outcome = $o;
            }
        }
        $actions = array_values(array_filter($this->world()['actions'], fn ($x) => $x['appointment_id'] === $id));

        return $this->appointmentRow($a) + [
            'found' => true, 'duration' => 30, 'join_url' => $a['join_url'], 'minutes' => $a['minutes'], 'recommendations' => $a['recommendations'], 'note' => $a['note'],
            'outcome' => $outcome === null ? null : ['gpa_before' => $outcome['gpa_before'], 'gpa_after' => $outcome['gpa_after'], 'delta' => round($outcome['gpa_after'] - $outcome['gpa_before'], 2), 'registered_after' => $outcome['registered_after'], 'signal_resolved' => $outcome['signal_resolved'], 'note' => $outcome['note'], 'measured_at' => $outcome['measured_at']->format('Y-m-d')],
            'actions' => array_map(fn ($x) => $this->actionRow($x), $actions), 'actions_available' => true,
        ];
    }

    // ── المرشّحات ─────────────────────────────────────────────────────────

    public function filterOptions(string $semester): array
    {
        $onBoard = array_flip(array_unique(array_column($this->signalsIn(null, null, $semester, null, true), 'student_id')));
        $advisors = [];
        $faculties = [];
        foreach (DemoCohort::all() as $s) {
            $id = (string) $s['student_id'];
            $faculties[$s['faculty_name']] = ($faculties[$s['faculty_name']] ?? 0) + 1;
            if (! isset($onBoard[$id])) {
                continue;
            }
            $advisors[$s['advisor_id']] ??= ['id' => $s['advisor_id'], 'name' => $s['advisor_name'], 'label' => $s['advisor_name'], 'students' => 0, 'schedulable' => true];
            $advisors[$s['advisor_id']]['students']++;
        }
        usort($advisors, fn ($a, $b) => $b['students'] <=> $a['students']);
        arsort($faculties);

        return ['advisors' => array_values($advisors), 'faculties' => array_map(fn ($name, $n) => ['name' => $name, 'students' => $n], array_keys($faculties), $faculties)];
    }

    public function caseloadSize(?string $advisor, string $semester, ?string $faculty = null): int
    {
        $ids = $this->scopeIds($advisor, $faculty);

        return $ids === null ? count(DemoCohort::all()) : count($ids);
    }

    public function schedulableGap(string $semester, ?string $advisor = null, ?string $faculty = null): array
    {
        if ($advisor === '') {
            return ['available' => false, 'advisors' => 0, 'schedulable_advisors' => 0, 'provisional_advisors' => 0, 'students' => 0, 'schedulable_students' => 0, 'provisional_students' => 0, 'share' => null];
        }
        $ids = $this->scopeIds($advisor, $faculty);
        $students = $ids === null ? count(DemoCohort::all()) : count($ids);
        $advisors = $advisor !== null ? 1 : count(DemoCohort::advisors());

        return ['available' => true, 'advisors' => $advisors, 'schedulable_advisors' => $advisors, 'provisional_advisors' => 0, 'students' => $students, 'schedulable_students' => $students, 'provisional_students' => 0, 'share' => $students > 0 ? 100.0 : null];
    }

    public function ready(): bool
    {
        return true;
    }

    public function outcomesReady(): bool
    {
        return true;
    }

    public function actionsReady(): bool
    {
        return true;
    }

    public function identityReady(): bool
    {
        return true;
    }

    public function forget(): void
    {
        self::$world = null;
    }

    private function ratio(string $key, string $label, string $formula, int $numerator, int $denominator, string $note): array
    {
        $value = $denominator > 0 ? round($numerator / $denominator * 100, 1) : null;

        return ['key' => $key, 'label' => $label, 'formula' => $formula, 'numerator' => $numerator, 'denominator' => $denominator, 'value' => $value, 'unit' => '٪', 'display' => $value === null ? 'لا تتوفر بيانات بعد' : rtrim(rtrim(number_format($value, 1), '0'), '.').'٪', 'available' => $value !== null, 'note' => $note];
    }

    private function duration(string $key, string $label, string $formula, ?float $hours, string $note): array
    {
        return ['key' => $key, 'label' => $label, 'formula' => $formula, 'numerator' => 0, 'denominator' => $hours === null ? 0 : 1, 'value' => $hours, 'unit' => 'ساعة', 'display' => $hours === null ? 'لا تتوفر بيانات بعد' : ($hours >= 48 ? number_format($hours / 24, 1).' يوم' : number_format($hours, 1).' ساعة'), 'available' => $hours !== null, 'note' => $note];
    }

    public function severityLabel(string $severity): string
    {
        return match ($severity) { 'critical' => 'حرجة', 'high' => 'مرتفعة', 'medium' => 'متوسطة', default => $severity };
    }

    private function severityFromRank(int $rank): string
    {
        return match ($rank) { 3 => 'critical', 2 => 'high', default => 'medium' };
    }
}
