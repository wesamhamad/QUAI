<?php

use App\Services\Advising\Detectors\AbsenceDetector;
use App\Services\Advising\Detectors\AcademicWarningDetector;
use App\Services\Advising\Detectors\FailedCoursesDetector;
use App\Services\Advising\Detectors\GpaDropDetector;
use App\Services\Advising\Detectors\GraduationCandidateDetector;
use App\Services\Advising\Detectors\LowSemesterGpaDetector;
use App\Services\Advising\Detectors\NotRegisteredDetector;
use App\Services\Advising\Detectors\PlanDeviationDetector;
use App\Services\Advising\Detectors\QuizWeaknessDetector;
use App\Services\Advising\Detectors\RepeatedCourseFailureDetector;
use App\Services\Advising\Detectors\ReturningAfterBreakDetector;
use App\Services\Advising\Detectors\RiskPredictionDetector;

/*
|--------------------------------------------------------------------------
| الإرشاد الأكاديمي الاستباقي
|--------------------------------------------------------------------------
|
| The service books an advising meeting before the student asks for one:
| a signal is detected, the student's timetable is compared with the
| advisor's, and the first shared gap inside working hours becomes a
| booking. Everything that decides *when* that happens lives here rather
| than in code, because thresholds are regulation and regulation changes
| without a release.
|
| Three groups matter most:
|
|   window    ← the advising day. Deliberately NOT config/urban.php's
|               06:00–19:00, which is the campus day (when gates are busy),
|               not the hours anyone may be booked into a meeting.
|   triggers  ← the eleven proactive steps, each with the threshold that
|               fires it and the lead time it must be met within.
|   dispatch  ← the one switch that separates "scheduled" from "sent". The
|               engine computes the whole appointment either way; only the
|               outward act — a Teams invite, a notification — is gated.
|
*/

return [

    /*
    |--------------------------------------------------------------------------
    | نافذة الإرشاد
    |--------------------------------------------------------------------------
    |
    | The bookable week, in minutes from midnight on the 15-minute grid that
    | UrbanWeek already defines for teaching days 1..5 (الأحد..الخميس).
    |
    | ⚠ These hours are an engineering default, not a deanship decision. The
    | window sets the ceiling on how many students can be matched at all —
    | narrowing it by two hours removes a fifth of the grid and with it a
    | share of the matches — so confirm before the first real dispatch.
    |
    | `bucket` must stay a divisor of the span, and must match
    | config('urban.week.bucket'): both sides of a comparison have to land on
    | the same grid or a "free" quarter-hour on one side is half a lecture on
    | the other.
    |
    */

    'window' => [
        'day_start' => (int) env('ADVISING_DAY_START', 480),   // 08:00
        'day_end' => (int) env('ADVISING_DAY_END', 900),       // 15:00
        'bucket' => 15,
        'days' => [1, 2, 3, 4, 5],                             // الأحد → الخميس

        /*
         * Windows nobody may be booked into, as [from, to) in minutes.
         * Prayer is the reason this list exists; it is not a lunch break and
         * a meeting that straddles it will simply not be attended.
         */
        'blackouts' => [
            [720, 750],   // 12:00–12:30 — الظهر
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | الموعد نفسه
    |--------------------------------------------------------------------------
    */

    'meeting' => [
        'minutes' => (int) env('ADVISING_MEETING_MINUTES', 30),

        // Dead time either side of a meeting so a student is not asked to be
        // in two buildings in the same quarter-hour.
        'buffer_minutes' => (int) env('ADVISING_MEETING_BUFFER', 15),

        // A cap per advisor per day. Without it the scorer happily stacks
        // four meetings into one morning because each is individually optimal.
        'max_per_advisor_per_day' => (int) env('ADVISING_MAX_PER_DAY', 4),

        'default_mode' => env('ADVISING_DEFAULT_MODE', 'on_campus'), // on_campus|teams

        // How far ahead of now a booking may be placed. A meeting proposed for
        // tomorrow morning reaches nobody in time.
        'min_notice_hours' => (int) env('ADVISING_MIN_NOTICE_HOURS', 48),
    ],

    /*
    |--------------------------------------------------------------------------
    | الإرسال الخارجي
    |--------------------------------------------------------------------------
    |
    | The line between a computed appointment and a real one. With `enabled`
    | false the engine still detects, matches, scores and writes the booking
    | with its chosen time — `dispatched_at` simply stays null. Nothing
    | reaches a calendar or an inbox.
    |
    | This is what lets the whole engine run over several semesters of real data
    | and be judged on the quality of the times it picks, before a single
    | notification goes out to a real person.
    |
    */

    'dispatch' => [
        'enabled' => (bool) env('ADVISING_DISPATCH_ENABLED', false),

        // Restrict the first real run to one faculty. Empty = no restriction.
        'faculties' => array_filter(explode(',', (string) env('ADVISING_DISPATCH_FACULTIES', ''))),

        'create_teams_meeting' => (bool) env('ADVISING_DISPATCH_TEAMS', true),
        'notify_student' => (bool) env('ADVISING_NOTIFY_STUDENT', true),
        'notify_advisor' => (bool) env('ADVISING_NOTIFY_ADVISOR', true),
    ],

    /*
    |--------------------------------------------------------------------------
    | الفصول
    |--------------------------------------------------------------------------
    |
    | SIS semester keys are YYT — 481 is الفصل الأول of 1448. `current` is the
    | term the engine books into; `history` are complete terms it sweeps to
    | measure how large the need actually is.
    |
    */

    'semesters' => [
        'current' => env('ADVISING_SEMESTER', '481'),
        // The two most recent completed terms — one academic year of history.
        // Each historical term costs a full mask build plus a per-student grade
        // sweep, so the list is deliberately short; widen it only when the bulk
        // endpoints (v1/advising/*) make a term a single call.
        'history' => ['472', '471'],
    ],

    /*
    |--------------------------------------------------------------------------
    | مصادر البيانات
    |--------------------------------------------------------------------------
    */

    'sources' => [

        /*
         * The bulk timetable feeds. One download covers every semester, and
         * both the busy-grid builder and the registration triggers read them.
         * Auth, the campus filter and the 12-hour clock are all handled by
         * the existing urban importer — see config/urban.php feed block.
         */
        'sections_endpoint' => 'nelc/course-sections',
        'enrollments_endpoint' => 'nelc/enrollments',

        /*
         * qu-api v1, origin token. Student id goes IN THE PATH, so unlike the
         * v2 self-service routes these can be read for any student without
         * that student's own token — which is what makes T1..T4 possible at
         * all.
         *
         * ⚠ The origin token authenticates the *system*, not the person. The
         * upstream will answer for any student id it is given, so nothing but
         * our own caseload check stands between an advisor and a record that
         * is not theirs. See AdviseeDirectory and the scope test.
         */
        'academic' => [
            'courses' => 'students/{student}/courses',
            'records' => 'students/{student}/academic-records',
            // Every self-service section for a named student in ONE call
            // (qu-api-v2 StudentSnapshotController, `advising` grant). The
            // cohort sweep uses it first and falls back to minting a JWT per
            // student only where it is not deployed.
            'snapshot' => 'students/{student}/snapshot',
        ],
        'snapshot_timeout' => (int) env('ADVISING_SNAPSHOT_TIMEOUT', 120),

        /*
         * ⚠ Which of the two v1 origins serves `students/{id}/*`.
         *
         * qu-api v1 has two origins with two grants, and each answers
         * "Unauthorized, invalid token!" on the other's routes. Measured live
         * on 2026-08-17 against students/341102005/courses:
         *
         *   QU_API_V1_ORIGIN_TOKEN (academic-plan origin)  → 403 invalid token
         *   QU_API_KEY             (NELC / feed origin)     → 200, 50 courses
         *
         * So the per-student academic routes belong to the SAME origin as the
         * bulk NELC feeds, not to the academic-plan origin their name suggests.
         * SISService::callV1() reads the other one and has therefore been
         * failing closed on this install; the sweep here did the same for
         * 3,862 calls before anyone looked at the log.
         *
         * The message text is the diagnostic: "invalid token" = wrong origin;
         * "missing the required permission" = right origin, missing grant.
         */
        'academic_token' => env('ADVISING_ACADEMIC_TOKEN', env('QU_API_KEY', '')),

        /*
         * الإنذارات والغياب — read from the semester-wide feeds under
         * qu-api `v1/advising/*` (paged by person, one origin key, the
         * `advising` permission on that origin), NOT per student.
         *
         *   advising/warnings  → T10: probation count · halt · penalty, one
         *                        shape with a `type` column
         *   advising/absences  → T11: SIS's own absence % per registered course
         *
         * The v2 self-service routes (/warnings, /absences) cannot serve this:
         * they carry no student id and answer only for the caller's own token.
         * See UniversityApiClient::cachedGet().
         *
         * `enabled` is the switch. While false, T10 and T11 stay registered
         * and visible and report "معطّلة" rather than silently returning zero,
         * because a trigger that finds nothing looks identical to one that
         * was never asked. Once the origin has the `advising` grant, flip
         * ADVISING_RISK_ENDPOINT_ENABLED and run advising:detect.
         */
        'risk' => [
            'enabled' => (bool) env('ADVISING_RISK_ENDPOINT_ENABLED', false),
            /*
             * Where the feeds live and which origin reads them. Default to
             * the same v1 host and origin as everything else; overridable so
             * a qu-api build that has v1/advising/* (it is not on
             * api.qu.edu.sa yet) can be read from another host — a local
             * checkout on :8009, a staging box — without moving the
             * per-student academic routes with it.
             */
            'base_url' => env('ADVISING_FEED_BASE_URL', env('QU_API_V1_BASE_URL', 'https://api.qu.edu.sa/api/v1')),
            'token' => env('ADVISING_FEED_TOKEN', env('ADVISING_ACADEMIC_TOKEN', env('QU_API_KEY', ''))),
            // The one-request semester summary — headline counts for the
            // board, no paging. Same origin and grant as the feeds.
            'summary' => env('ADVISING_RISK_SUMMARY_PATH', 'advising/summary'),
            // Feed paths, env-overridable so a rename on qu-api is a .env
            // change, not a release.
            'warnings' => env('ADVISING_RISK_WARNINGS_PATH', 'advising/warnings'),
            'absences' => env('ADVISING_RISK_ABSENCES_PATH', 'advising/absences'),
            // Persons per page when pulling a feed. The feed's max is 2000;
            // 500 keeps each page under ~10s on the grades-shaped feeds.
            'page' => (int) env('ADVISING_FEED_PAGE', 500),
            // Seconds to wait for ONE page. The warnings feed runs a PL/SQL
            // function per academic record and a page can take a minute or
            // more on a slow box; a timeout here voids the whole semester.
            'timeout' => (int) env('ADVISING_FEED_TIMEOUT', 300),
        ],

        /*
         * Per-student v1 calls are one request each, not one file. A sweep is
         * therefore queued and rate-limited, never run from a page load.
         */
        'sweep' => [
            'chunk' => (int) env('ADVISING_SWEEP_CHUNK', 100),
            'requests_per_minute' => (int) env('ADVISING_SWEEP_RPM', 240),
            'cache_ttl' => (int) env('ADVISING_SWEEP_CACHE_TTL', 21600), // 6h
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | الخطوات الاستباقية
    |--------------------------------------------------------------------------
    |
    | The closed list. A step exists here only if a signal for it can actually
    | be read today or through a route that is specified — anything else is an
    | intention, not a proactive step.
    |
    | severity   critical|high|medium — orders the queue when one student
    |            trips several steps, and decides who gets the earliest slot.
    | tier       bulk    ← readable for every student today
    |            advisor ← needs an instructor JWT, per advisor
    | window     the lead time the meeting must fall inside, in days.
    | detects    «ما يرصده» — one Arabic line the board prints under the step,
    |            so a reader who never opened the detector knows what a count
    |            on that card is a count of.
    |
    */

    'triggers' => [

        'T1' => [
            'label' => 'رسوب في ٣ مقررات فأكثر في فصل واحد',
            'detects' => 'الطالب الذي رسب في ثلاثة مقررات فأكثر في الفصل المكتمل الأخير.',
            'severity' => 'critical',
            'tier' => 'bulk',
            'enabled' => true,
            'window_days' => 14,
            'threshold' => ['failed_courses' => 3],
        ],

        'T2' => [
            'label' => 'تكرار الرسوب في المقرر نفسه',
            'detects' => 'مقرر رسب فيه الطالب مرتين فأكثر عبر الفصول.',
            'severity' => 'critical',
            'tier' => 'bulk',
            'enabled' => true,
            'window_days' => 14,
            'threshold' => ['failures_same_course' => 2],
        ],

        'T3' => [
            'label' => 'معدل فصلي منخفض جداً — احتمال رسوب',
            'detects' => 'معدل فصلي دون الحدّ في آخر فصل مكتمل — رسوب محتمل إن استمر.',
            'severity' => 'high',
            'tier' => 'bulk',
            'enabled' => true,
            'window_days' => 21,
            // Out of 5. Confirm against لائحة الدراسة والاختبارات.
            'threshold' => ['semester_gpa_below' => 2.0],
        ],

        'T4' => [
            'label' => 'هبوط حاد في المعدل الفصلي',
            'detects' => 'هبوط في المعدل الفصلي بمقدار الحدّ فأكثر بين فصلين متتاليين.',
            'severity' => 'high',
            'tier' => 'bulk',
            'enabled' => true,
            'window_days' => 21,
            'threshold' => ['gpa_drop_at_least' => 0.5],
        ],

        'T5' => [
            'label' => 'لم يسجّل مقررات للفصل القادم',
            'detects' => 'طالب نشط لم يسجّل أي مقرر بعد أيام من فتح التسجيل.',
            'severity' => 'high',
            'tier' => 'bulk',
            'enabled' => true,
            'window_days' => 7,
            'threshold' => ['days_after_registration_opens' => 5],
        ],

        'T6' => [
            'label' => 'انقطاع فصل أو أكثر ثم عودة',
            'detects' => 'طالب انقطع فصلاً فأكثر ثم عاد إلى التسجيل هذا الفصل.',
            'severity' => 'high',
            'tier' => 'bulk',
            'enabled' => true,
            'window_days' => 14,
            'threshold' => ['missed_semesters' => 1],
        ],

        'T7' => [
            'label' => 'انحراف عن الخطة الدراسية',
            'detects' => 'مقررات مسجّلة خارج تسلسل الخطة الدراسية أو متطلبات مؤجَّلة.',
            'severity' => 'medium',
            'tier' => 'advisor',
            'enabled' => true,
            'window_days' => 21,
            'threshold' => [],
        ],

        'T8' => [
            'label' => 'مرشّح للتخرج',
            'detects' => 'طالب بقي له مقرران فأقل للتخرج — لقاء الإنهاء لا الإنقاذ.',
            'severity' => 'medium',
            'tier' => 'advisor',
            'enabled' => true,
            'window_days' => 21,
            'threshold' => ['remaining_courses_at_most' => 2],
        ],

        'T9' => [
            'label' => 'تنبؤ نموذج التعثّر',
            'detects' => 'احتمال تعثّر من نموذج التنبؤ يبلغ الحدّ فأكثر.',
            'severity' => 'medium',
            'tier' => 'advisor',
            'enabled' => true,
            'window_days' => 30,
            'threshold' => ['risk_probability_at_least' => 0.7],
        ],

        /*
         * T10 and T11 depend on sources.risk. They stay enabled here on
         * purpose: the detector reports them as awaiting their endpoint,
         * which is information. Flipping ADVISING_RISK_ENDPOINT_ENABLED is
         * then the whole activation.
         */
        'T10' => [
            'label' => 'إنذار أكاديمي · إيقاف قيد · عقوبة',
            'detects' => 'إنذار أكاديمي نشط أو إيقاف قيد أو عقوبة مسجّلة على الطالب.',
            'severity' => 'critical',
            'tier' => 'bulk',
            'enabled' => true,
            'requires' => 'sources.risk',
            'window_days' => 3,
            'threshold' => ['any_active' => true],
        ],

        'T11' => [
            'label' => 'غياب متراكم يقارب الحرمان',
            'detects' => 'نسبة غياب متراكمة تقترب من حدّ الحرمان في مقرر.',
            'severity' => 'high',
            'tier' => 'bulk',
            'enabled' => true,
            'requires' => 'sources.risk',
            'window_days' => 7,
            'threshold' => [
                'absence_warn_percent' => 15,
                'absence_bar_percent' => 25,
            ],
        ],

        /*
         * T12 reads the host's own quiz_question_outcomes, not qu-api: it is
         * the one step that can see a student struggling BEFORE the grade
         * sheet does — a fortnight of missed QSpark questions in a course is
         * evidence weeks ahead of a midterm.
         */
        'T12' => [
            'label' => 'تعثّر في اختبارات QSpark',
            'detects' => 'دقّة إجابات دون الحدّ في اختبارات منصة التعلم خلال النافذة — تعثّرٌ يظهر قبل أن يصل إلى كشف الدرجات.',
            'severity' => 'medium',
            'tier' => 'bulk',
            'enabled' => true,
            'window_days' => 14,
            'threshold' => ['accuracy_below' => 0.40, 'min_served' => 10],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | تنفيذ كل خطوة
    |--------------------------------------------------------------------------
    |
    | trigger code => the class that detects it. The registry resolves through
    | the container, so a detector may type-hint whatever client it needs.
    |
    | Listed here rather than discovered by scanning the directory: a step that
    | silently stops running because a file was renamed is the failure mode
    | this whole service is least able to notice.
    |
    */

    'detectors' => [
        'T1' => FailedCoursesDetector::class,
        'T2' => RepeatedCourseFailureDetector::class,
        'T3' => LowSemesterGpaDetector::class,
        'T4' => GpaDropDetector::class,
        'T5' => NotRegisteredDetector::class,
        'T6' => ReturningAfterBreakDetector::class,
        'T7' => PlanDeviationDetector::class,
        'T8' => GraduationCandidateDetector::class,
        'T9' => RiskPredictionDetector::class,
        'T10' => AcademicWarningDetector::class,
        'T11' => AbsenceDetector::class,
        'T12' => QuizWeaknessDetector::class,
    ],

    /*
    |--------------------------------------------------------------------------
    | ترجيح الفراغات
    |--------------------------------------------------------------------------
    |
    | "First free slot" is rarely the best one. Weights are relative; the
    | scorer sums them and the highest total wins, with the reason recorded on
    | the appointment so a chosen time can be explained rather than trusted.
    |
    */

    'scoring' => [
        'adjacent_to_lecture' => 40,   // no extra trip, no dead gap
        'same_building' => 25,   // location comes from the sections feed
        'avoids_day_edges' => 15,   // first/last quarter-hour: worst attendance
        'urgency' => 20,   // earlier inside a tight trigger window
        'advisor_load_balance' => 15,   // spread across the week
    ],

    /*
    |--------------------------------------------------------------------------
    | حلقة QSpark — من نتائج الأسئلة إلى قرارات
    |--------------------------------------------------------------------------
    |
    | The advisor reads which QSpark questions students missed or left
    | unanswered and decides: more questions in a bucket, a different
    | starting difficulty, more time, a question to reword, a student to
    | flag. Every threshold that turns a statistic into a decision lives
    | here. Rates are 0–1.
    |
    */

    'qspark' => [
        'enabled' => env('ADVISING_QSPARK_ENABLED', true),
        // How far back the engine reads outcomes. Two months covers a
        // half-semester of play without letting last year's cohort decide
        // this year's settings.
        'window_days' => 60,
        // Below this many serves a per-question rate is noise — three
        // students guessing is not a pattern.
        'min_served' => 5,
        // A question left to time out by a third of the class is a question
        // that cannot be read in time, not one that is hard.
        'reword_timeout_rate' => 0.35,
        // Wrong 70% of the time is the «hard» bucket by any definition.
        'too_hard_wrong_rate' => 0.70,
        // A «hard» question almost everybody gets right is mislabelled; the
        // 2×min_served floor on this one (in the engine) guards against a
        // lucky small sample.
        'too_easy_wrong_rate' => 0.10,
        // Bucket-level decisions move settings for a whole attachment, so
        // they need a bigger sample than a single question.
        'bucket_min_served' => 20,
        // Accuracy at or below this in a bucket means the class is not
        // ready for it: scaffold with more of the bucket below.
        'low_accuracy' => 0.45,
        // Accuracy at or above this means the bucket no longer teaches
        // anything: start higher / add harder questions.
        'high_accuracy' => 0.90,
        // How many questions a MORE_QUESTIONS decision adds, and the ceiling
        // — a bucket of 10 already fills a whole game.
        'question_step' => 2,
        'max_questions_per_difficulty' => 10,
        // How much a MORE_TIME decision adds, and the ceiling — past 25s the
        // game stops being a game.
        'time_limit_step' => 5,
        'max_time_limit' => 25,
        // Whether decisions marked auto are carried out on the nightly run
        // or only proposed for faculty to confirm.
        'auto_apply' => env('ADVISING_QSPARK_AUTO_APPLY', true),
        // A student at or below this accuracy over at least this many
        // questions is flagged for practice (QS_STUDENT_PRACTICE); T12 has
        // its own, tighter copy under triggers.
        'student_weak_accuracy' => 0.40,
        'student_min_served' => 10,
    ],
];
