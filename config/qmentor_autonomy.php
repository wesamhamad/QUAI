<?php

/*
|--------------------------------------------------------------------------
| QMentor — حدود استقلالية الوكيل (SRS v8 §8 مصفوفة المهام + §10 المستويات)
|--------------------------------------------------------------------------
|
| Every automated act the platform performs is listed here with the SRS task
| number, its autonomy level and who decides. The engine consults this table
| through ApprovalGate: an L3 act is written as a pending approval instead of
| being executed, an L4 act is never executed by code at all. The table is
| also what /agent-core shows, so the screen and the file quote one source.
|
|   L0 informational   — the agent acts, nobody is asked, nothing outward
|   L1 advisory        — the agent recommends; a person acts on it or not
|   L2 supervised auto — the agent acts and a person is told
|   L3 conditional     — the agent prepares; a named person must approve first
|   L4 human only      — code never performs it (kill switch, sanctions, SIS writes)
|
*/
return [

    /* #55 — the kill switch. Off = no scoring, no alerts, no approvals created. */
    'enabled' => (bool) env('QMENTOR_AUTOMATION_ENABLED', true),

    // Parallel workers on the `cohort` queue (routes/console.php schedules this many
    // queue:work processes); the chain's stages and the AI analyses split into as many streams.
    // The scheduled per-student refreshes (grades nightly, profile every 6 h,
    // Blackboard every 4 h). Off while colleges are loaded from the page.
    'scheduled_sync' => (bool) env('QMENTOR_SCHEDULED_SYNC', false),

    'queue_workers' => (int) env('QMENTOR_QUEUE_WORKERS', 8),

    // The colleges the cohort covers (NELC faculty codes). 2026-09-14: the nine
    // largest (48,817 in 481); 2026-09-17: every active college — `all`
    // (17 colleges, 56,081 in 481). QMENTOR_FACULTIES="48,44" narrows it.
    'faculties' => array_values(array_filter(array_map('trim', explode(',', (string) env('QMENTOR_FACULTIES', 'all'))))),

    /*
     * Mailboxes that receive an escalation the advisor did not act on within
     * the SLA (dept head / dean). The default is the product owner's mailbox,
     * fixed here because the production .env is not reachable from CI today;
     * an env value, when one exists, replaces it.
     */
    'escalation_emails' => array_values(array_filter(array_map('trim', explode(',', (string) env('QMENTOR_ESCALATION_EMAILS', 'w.aljuraysh@qu.edu.sa'))))),

    /*
     * مركز الإرشاد النفسي — where the counselling referral (task 38) points. The
     * agent never contacts the centre; it stores the referral on the student's
     * record with this destination and shows the student the link.
     */
    'counseling' => [
        'name' => env('QMENTOR_COUNSELING_NAME', 'مركز الإرشاد الطلابي — عمادة شؤون الطلاب'),
        'email' => env('QMENTOR_COUNSELING_EMAIL', ''),
        'url' => env('QMENTOR_COUNSELING_URL', 'https://www.qu.edu.sa/'),
        'phone' => env('QMENTOR_COUNSELING_PHONE', ''),
    ],

    'levels' => [
        'L0' => ['ar' => 'معلوماتي', 'en' => 'Informational', 'approval' => false],
        'L1' => ['ar' => 'استشاري', 'en' => 'Advisory', 'approval' => false],
        'L2' => ['ar' => 'آلي بإشراف', 'en' => 'Supervised auto', 'approval' => false],
        'L3' => ['ar' => 'آلي مشروط', 'en' => 'Conditional auto', 'approval' => true],
        'L4' => ['ar' => 'بشري فقط', 'en' => 'Human only', 'approval' => null],
    ],

    /*
     * The §8 matrix. `mode` = SRS column (agent · agent_notify · human_approves · human_only).
     * `impl` = where it lives in this codebase; `ui` = where a person sees it.
     * `sla_hours` = how long an approval may sit before the sweep escalates it.
     */
    'tasks' => [
        1 => ['ar' => 'سحب الغياب', 'en' => 'Pull attendance', 'mode' => 'agent', 'level' => 'L0', 'actor' => 'QMentor', 'impl' => 'qmentor:cohort-sync --stage=profile', 'ui' => '/agent-activity'],
        2 => ['ar' => 'سحب الدرجات', 'en' => 'Pull grades', 'mode' => 'agent', 'level' => 'L0', 'actor' => 'QMentor', 'impl' => 'qmentor:cohort-sync --stage=academic', 'ui' => '/agent-activity'],
        3 => ['ar' => 'سحب الواجبات', 'en' => 'Pull assignments', 'mode' => 'agent', 'level' => 'L0', 'actor' => 'QMentor', 'impl' => 'qmentor:cohort-sync --stage=blackboard', 'ui' => '/agent-activity'],
        4 => ['ar' => 'سحب التسجيل والحالة', 'en' => 'Pull registration/standing', 'mode' => 'agent', 'level' => 'L0', 'actor' => 'QMentor', 'impl' => 'qmentor:cohort-sync --stage=roster', 'ui' => '/agent-activity'],
        6 => ['ar' => 'كشف الشذوذ', 'en' => 'Detect anomalies', 'mode' => 'agent', 'level' => 'L0', 'actor' => 'QMentor', 'impl' => 'RiskEngine (فرق التقييمين)', 'ui' => '/risk-analytics'],
        7 => ['ar' => 'بناء التوأم الرقمي', 'en' => 'Build digital twin', 'mode' => 'agent', 'level' => 'L0', 'actor' => 'QMentor', 'impl' => 'qmentor_* tables', 'ui' => '/digital-twin'],
        8 => ['ar' => 'حساب درجة الخطر (31 مؤشراً)', 'en' => 'Calculate risk score', 'mode' => 'agent', 'level' => 'L0', 'actor' => 'QMentor', 'impl' => 'qmentor:score', 'ui' => '/student-dashboard'],
        9 => ['ar' => 'تصنيف مستوى الخطر', 'en' => 'Classify risk level', 'mode' => 'agent', 'level' => 'L0', 'actor' => 'QMentor', 'impl' => 'RiskEngine §5.C', 'ui' => '/student-dashboard'],
        13 => ['ar' => 'توليد تفسير الخطر', 'en' => 'Generate risk explanation', 'mode' => 'agent', 'level' => 'L0', 'actor' => 'QMentor', 'impl' => 'Indicators::evidence', 'ui' => '/indicator-detail'],
        14 => ['ar' => 'تعديل مستوى الخطر يدوياً', 'en' => 'Manually adjust risk level', 'mode' => 'human_only', 'level' => 'L4', 'actor' => 'المرشد', 'impl' => 'POST /risk/students/{id}/override → يُسجَّل ويُطبَّق في التقييم التالي', 'ui' => '/advisor-dashboard'],
        15 => ['ar' => 'تنبيه داخل المنصة', 'en' => 'In-app nudge', 'mode' => 'agent', 'level' => 'L0', 'actor' => 'QMentor', 'impl' => 'AlertDispatcher::platform', 'ui' => '/alerts'],
        18 => ['ar' => 'تحذير اقتراب الحرمان', 'en' => 'Attendance warning (near limit)', 'mode' => 'agent_notify', 'level' => 'L2', 'actor' => 'QMentor + إشعار المرشد', 'impl' => 'A-03 override → advisor channel', 'ui' => '/alerts · /advisor-dashboard'],
        21 => ['ar' => 'تقرير التوأم للمرشد', 'en' => 'Digital twin report to advisor', 'mode' => 'agent', 'level' => 'L0', 'actor' => 'QMentor', 'impl' => 'GET /risk/students/{id}', 'ui' => '/advisee/:id'],
        22 => ['ar' => 'توليد خطة تدخّل', 'en' => 'Generate intervention plan', 'mode' => 'agent', 'level' => 'L1', 'actor' => 'QMentor (توصية)', 'impl' => 'config qmentor_risk.actions', 'ui' => '/action-plan'],
        23 => ['ar' => 'المرشد يراجع/يعتمد الخطة', 'en' => 'Advisor reviews/approves plan', 'mode' => 'human_approves', 'level' => 'L3', 'actor' => 'المرشد', 'impl' => 'approval: approve_intervention_plan', 'ui' => '/advisor-dashboard ← الوكيل والاجتماعات', 'sla_hours' => 72],
        24 => ['ar' => 'إرسال رسالة تدخّل (مرتفع/حرج)', 'en' => 'Send intervention message', 'mode' => 'human_approves', 'level' => 'L3', 'actor' => 'الوكيل بعد الموافقة', 'impl' => 'approval: send_intervention_message → email', 'ui' => '/advisor-dashboard ← الوكيل والاجتماعات', 'sla_hours' => 48],
        25 => ['ar' => 'توليد خطة تعافٍ طارئة', 'en' => 'Generate emergency recovery plan', 'mode' => 'agent', 'level' => 'L1', 'actor' => 'QMentor (توصية)', 'impl' => 'WP6', 'ui' => '/recovery'],
        26 => ['ar' => 'المرشد يراجع خطة التعافي', 'en' => 'Advisor reviews recovery plan', 'mode' => 'human_approves', 'level' => 'L3', 'actor' => 'المرشد', 'impl' => 'approval: approve_recovery_plan', 'ui' => '/advisor-dashboard', 'sla_hours' => 72],
        27 => ['ar' => 'التصعيد لرئيس القسم', 'en' => 'Escalate to department head', 'mode' => 'human_approves', 'level' => 'L3', 'actor' => 'المرشد يوافق', 'impl' => 'approval: escalate_dept_head (SLA 48 س ثم إحالة للعميد)', 'ui' => '/advisor-dashboard', 'sla_hours' => 48],
        28 => ['ar' => 'التصعيد للعميد', 'en' => 'Escalate to dean', 'mode' => 'human_only', 'level' => 'L4', 'actor' => 'رئيس القسم يبدأه', 'impl' => 'لا ينفّذه الكود؛ يُسجَّل فقط', 'ui' => '—'],
        29 => ['ar' => 'التوصية بالفصل/الإنذار', 'en' => 'Recommend probation/dismissal', 'mode' => 'human_only', 'level' => 'L4', 'actor' => 'لجنة الجامعة', 'impl' => 'لا ينفّذه الكود', 'ui' => '—'],
        30 => ['ar' => 'إصدار إنذار أكاديمي رسمي', 'en' => 'Issue formal academic warning', 'mode' => 'human_only', 'level' => 'L4', 'actor' => 'عمادة القبول والتسجيل', 'impl' => 'لا ينفّذه الكود', 'ui' => '—'],
        31 => ['ar' => 'الإجابة عن أسئلة الأنظمة', 'en' => 'Answer policy questions', 'mode' => 'agent', 'level' => 'L0', 'actor' => 'المحادثة', 'impl' => 'SmartAdvisorService', 'ui' => '/chatbot'],
        33 => ['ar' => 'جدولة اجتماع Teams', 'en' => 'Schedule Teams meeting', 'mode' => 'agent', 'level' => 'L2', 'actor' => 'Graph API', 'impl' => 'AppointmentDispatcher (ADVISING_DISPATCH_ENABLED)', 'ui' => '/advisor-dashboard'],
        35 => ['ar' => 'اقتراح حذف مقرر وأثره', 'en' => 'Suggest drop + impact', 'mode' => 'agent', 'level' => 'L1', 'actor' => 'توصية فقط', 'impl' => 'WhatIfSimulator', 'ui' => '/study-plan'],
        36 => ['ar' => 'حذف مقرر فعلياً في SIS', 'en' => 'Actually drop a course in SIS', 'mode' => 'human_only', 'level' => 'L4', 'actor' => 'الطالب عبر SIS — أبداً من المنصة', 'impl' => 'لا يوجد أي مسار كتابة إلى SIS', 'ui' => '—'],
        37 => ['ar' => 'كشف ضيق نفسي', 'en' => 'Detect emotional distress', 'mode' => 'agent', 'level' => 'L2', 'actor' => 'يُوسم تلقائياً — سرّي', 'impl' => 'C-01/C-03/C-05 confidential', 'ui' => '/alerts (الطالب فقط)'],
        38 => ['ar' => 'الإرشاد النفسي', 'en' => 'Mental health counselling', 'mode' => 'human_only', 'level' => 'L4', 'actor' => 'مركز الإرشاد — أبداً من الوكيل', 'impl' => 'رابط تحويل فقط', 'ui' => '/contact-advisor'],
        39 => ['ar' => 'تصعيد سؤال معقّد', 'en' => 'Escalate complex question', 'mode' => 'agent', 'level' => 'L2', 'actor' => 'يُصعَّد تلقائياً', 'impl' => 'AdvisorInquiry', 'ui' => '/chatbot'],
        46 => ['ar' => 'اعتماد التسجيل الفعلي', 'en' => 'Approve course registration', 'mode' => 'human_only', 'level' => 'L4', 'actor' => 'المرشد في SIS', 'impl' => 'لا ينفّذه الكود', 'ui' => '—'],
        47 => ['ar' => 'اعتماد تغيير التخصص', 'en' => 'Approve major change', 'mode' => 'human_only', 'level' => 'L4', 'actor' => 'القسم + العميد', 'impl' => 'لا ينفّذه الكود', 'ui' => '—'],
        54 => ['ar' => 'ضبط عتبات الكلية', 'en' => 'Configure college thresholds', 'mode' => 'human_only', 'level' => 'L4', 'actor' => 'رئيس القسم + المسؤول', 'impl' => 'config qmentor_risk.college_overrides (تغيير بالكود والمراجعة)', 'ui' => '—'],
        55 => ['ar' => 'مفتاح الإيقاف', 'en' => 'Kill switch', 'mode' => 'human_only', 'level' => 'L4', 'actor' => 'مسؤول النظام', 'impl' => 'QMENTOR_AUTOMATION_ENABLED=false — يوقف التقييم والتنبيهات والموافقات خلال دقيقة', 'ui' => '/agent-core'],
        56 => ['ar' => 'إعادة تدريب النماذج', 'en' => 'Retrain models', 'mode' => 'human_approves', 'level' => 'L3', 'actor' => 'فريق الذكاء الاصطناعي', 'impl' => 'model_version في config', 'ui' => '—', 'sla_hours' => 0],
        57 => ['ar' => 'اعتماد تغيير عتبات الكلية', 'en' => 'Approve threshold changes', 'mode' => 'human_only', 'level' => 'L4', 'actor' => 'رئيس القسم + الحوكمة', 'impl' => 'مراجعة الكود', 'ui' => '—'],
    ],
];
