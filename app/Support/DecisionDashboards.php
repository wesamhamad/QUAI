<?php

namespace App\Support;

/**
 * Static demo data for the "التقرير الذاتي" decision dashboards.
 *
 * Mirrors the six Filament dashboards from the production QUAI panel
 * (نظام ساعد، الشكاوى، تقييم الخدمات، التقييمات الخارجية، Clarity، الأفكار)
 * as fully static visual dashboards. No live database — every number here
 * is demo data, generated per quarter so the quarter selector (Q1–Q4) shows
 * a distinct, plausible dataset for each period.
 */
class DecisionDashboards
{
    /** Pick the Arabic or English variant based on the active app locale. */
    private static function t(string $ar, string $en): string
    {
        return app()->getLocale() === 'en' ? $en : $ar;
    }

    /** Quarter keys → human labels (all demo year 2025). */
    public static function quarters(): array
    {
        return [
            'Q1' => ['label' => self::t('الربع الأول', 'Quarter 1'),  'range' => self::t('يناير – مارس 2025',     'Jan – Mar 2025')],
            'Q2' => ['label' => self::t('الربع الثاني', 'Quarter 2'), 'range' => self::t('أبريل – يونيو 2025',    'Apr – Jun 2025')],
            'Q3' => ['label' => self::t('الربع الثالث', 'Quarter 3'), 'range' => self::t('يوليو – سبتمبر 2025',   'Jul – Sep 2025')],
            'Q4' => ['label' => self::t('الربع الرابع', 'Quarter 4'), 'range' => self::t('أكتوبر – ديسمبر 2025',  'Oct – Dec 2025')],
        ];
    }

    public static function normalizeQuarter(?string $q): string
    {
        $q = strtoupper((string) $q);

        return in_array($q, ['Q1', 'Q2', 'Q3', 'Q4'], true) ? $q : 'Q1';
    }

    /** The three month names for a given quarter. */
    private static function months(string $quarter): array
    {
        return [
            'Q1' => [self::t('يناير', 'January'),  self::t('فبراير', 'February'), self::t('مارس', 'March')],
            'Q2' => [self::t('أبريل', 'April'),    self::t('مايو', 'May'),        self::t('يونيو', 'June')],
            'Q3' => [self::t('يوليو', 'July'),     self::t('أغسطس', 'August'),    self::t('سبتمبر', 'September')],
            'Q4' => [self::t('أكتوبر', 'October'), self::t('نوفمبر', 'November'), self::t('ديسمبر', 'December')],
        ][$quarter];
    }

    /** Per-quarter scaling factor — lets each dashboard breathe between quarters. */
    private static function factor(string $quarter, array $map): float
    {
        return $map[$quarter] ?? 1.0;
    }

    /** Multiply a list of numbers by a factor and round to int. */
    private static function scale(array $vals, float $f): array
    {
        return array_map(fn ($v) => (int) round($v * $f), $vals);
    }

    private static function sum(array $vals): int
    {
        return (int) array_sum($vals);
    }

    /** Convenience: pick a per-quarter value from a 4-tuple. */
    private static function pick(string $quarter, $q1, $q2, $q3, $q4)
    {
        return ['Q1' => $q1, 'Q2' => $q2, 'Q3' => $q3, 'Q4' => $q4][$quarter];
    }

    /** All six dashboards for the requested quarter. */
    public static function all(string $quarter): array
    {
        $quarter = self::normalizeQuarter($quarter);

        return [
            'serviceTasks'       => self::serviceTasks($quarter),
            'complaints'         => self::complaints($quarter),
            'serviceEvaluations' => self::serviceEvaluations($quarter),
            'reviews'            => self::reviews($quarter),
            'clarity'            => self::clarity($quarter),
            'feedback'           => self::feedback($quarter),
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // 1. لوحة مهام تقنية المعلومات (نظام ساعد)
    // ─────────────────────────────────────────────────────────────
    private static function serviceTasks(string $quarter): array
    {
        $f = self::factor($quarter, ['Q1' => 1.0, 'Q2' => 1.18, 'Q3' => 0.74, 'Q4' => 0.93]);
        $months = self::months($quarter);

        $priority = self::scale([220, 1180, 3160, 1190, 150], $f); // حرجة عالية متوسطة منخفضة تخطيط
        $types = self::scale([3360, 1450, 760, 320], $f);
        $closed = self::sum($priority);
        $security = (int) round(self::pick($quarter, 128, 154, 86, 109));
        $latePct = self::pick($quarter, 4.9, 6.3, 3.4, 4.1);
        $late = (int) round($closed * $latePct / 100);

        $catalogMonthly = self::scale([1180, 1240, 1340], $f);
        $incidentMonthly = self::scale([410, 470, 505], $f);

        // 13 weeks of volume
        $weeklyBase = [380, 420, 460, 510, 540, 490, 470, 520, 560, 590, 540, 500, 480];
        $weekly = self::scale($weeklyBase, $f);
        $weekLabels = array_map(fn ($i) => self::t('أسبوع ', 'Week ') . ($i + 1), range(0, 12));

        $priorityLabels = [self::t('حرجة', 'Critical'), self::t('عالية', 'High'), self::t('متوسطة', 'Medium'), self::t('منخفضة', 'Low'), self::t('تخطيط', 'Planning')];

        $groups = [
            ['name' => self::t('فريق الدعم الفني — المستوى الأول', 'Tech Support Team — Tier 1'), 'count' => (int) round(1240 * $f)],
            ['name' => self::t('إدارة الشبكات والاتصالات',          'Network & Communications'),   'count' => (int) round(880 * $f)],
            ['name' => self::t('فريق الأنظمة الأكاديمية',           'Academic Systems Team'),       'count' => (int) round(760 * $f)],
            ['name' => self::t('الأمن السيبراني',                   'Cybersecurity'),               'count' => (int) round(540 * $f)],
            ['name' => self::t('إدارة قواعد البيانات',              'Database Administration'),     'count' => (int) round(430 * $f)],
            ['name' => self::t('فريق البنية التحتية',               'Infrastructure Team'),         'count' => (int) round(390 * $f)],
            ['name' => self::t('الدعم الميداني — المباني',          'Field Support — Buildings'),   'count' => (int) round(320 * $f)],
            ['name' => self::t('فريق تطوير التطبيقات',              'Application Development Team'),'count' => (int) round(260 * $f)],
        ];

        return [
            'kpis' => [
                ['label' => self::t('المهام المغلقة', 'Closed tasks'),               'value' => number_format($closed),         'unit' => self::t('مهمة', 'task'),     'hint' => self::t('كتالوج ', 'Catalogue ') . number_format($types[0] + $types[3]) . ' · ' . self::t('حوادث ', 'incidents ') . number_format($types[1] + $types[2]), 'tone' => 'green'],
                ['label' => self::t('حوادث أمنية', 'Security incidents'),            'value' => number_format($security),       'unit' => self::t('حادثة', 'incident'), 'hint' => self::t('تم احتواؤها ضمن SLA الأمني', 'Contained within the security SLA'), 'tone' => 'red'],
                ['label' => self::t('متوسط وقت الاستجابة', 'Average response time'), 'value' => self::pick($quarter, self::t('4س 12د', '4h 12m'), self::t('5س 02د', '5h 02m'), self::t('3س 28د', '3h 28m'), self::t('3س 56د', '3h 56m')), 'unit' => '', 'hint' => self::t('من فتح المهمة حتى أول إجراء', 'From ticket open to first action'), 'tone' => 'blue'],
                ['label' => self::t('متأخرة عن SLA', 'Past SLA'),                   'value' => number_format($late),           'unit' => self::t('مهمة', 'task'),     'hint' => $latePct . '% ' . self::t('من إجمالي المهام', 'of total tasks'), 'tone' => 'amber'],
            ],
            'charts' => [
                ['id' => 'st-priority', 'type' => 'doughnut', 'title' => self::t('توزيع الأولويات', 'Priority distribution'), 'subtitle' => self::t('حسب تصنيف الأولوية في نظام ساعد', 'By priority class in the Saed system'),
                 'data' => ['labels' => $priorityLabels,
                            'datasets' => [['data' => $priority, 'backgroundColor' => ['#B42318', '#F79009', '#1B8354', '#6CE9A6', '#94A3B8']]]]],
                ['id' => 'st-types', 'type' => 'doughnut', 'title' => self::t('توزيع أنواع المهام', 'Task type distribution'), 'subtitle' => self::t('كتالوج مقابل حوادث', 'Catalogue vs. incidents'),
                 'data' => ['labels' => [self::t('مهمة كتالوج', 'Catalogue task'), self::t('مهمة حادث', 'Incident task'), self::t('حادث', 'Incident'), self::t('كتالوج', 'Catalogue')],
                            'datasets' => [['data' => $types, 'backgroundColor' => ['#1B8354', '#B42318', '#F04438', '#6CE9A6']]]]],
                ['id' => 'st-monthly', 'type' => 'line', 'title' => self::t('المهام حسب الشهر', 'Tasks by month'), 'subtitle' => self::t('مهام الكتالوج مقابل الحوادث', 'Catalogue tasks vs. incidents'), 'full' => true,
                 'data' => ['labels' => $months,
                            'datasets' => [
                                ['label' => self::t('مهام الكتالوج', 'Catalogue tasks'), 'data' => $catalogMonthly, 'borderColor' => '#1B8354', 'backgroundColor' => 'rgba(27,131,84,0.12)', 'fill' => true, 'tension' => 0.4],
                                ['label' => self::t('حوادث', 'Incidents'),               'data' => $incidentMonthly, 'borderColor' => '#B42318', 'backgroundColor' => 'rgba(180,35,24,0.10)', 'fill' => true, 'tension' => 0.4],
                            ]]],
                ['id' => 'st-weekly', 'type' => 'bar', 'title' => self::t('حجم المهام الأسبوعي', 'Weekly task volume'), 'subtitle' => self::t('إجمالي المهام المفتوحة كل أسبوع', 'Total tasks opened each week'), 'full' => true,
                 'data' => ['labels' => $weekLabels,
                            'datasets' => [['label' => self::t('مهام', 'Tasks'), 'data' => $weekly, 'backgroundColor' => '#1B8354']]]],
                ['id' => 'st-resolution', 'type' => 'bar', 'title' => self::t('متوسط وقت الحل مقابل هدف SLA', 'Average resolution time vs. SLA target'), 'subtitle' => self::t('بالساعات — حسب الأولوية', 'In hours — by priority'),
                 'data' => ['labels' => $priorityLabels,
                            'datasets' => [
                                ['label' => self::t('الفعلي', 'Actual'),  'data' => self::scale([3, 7, 18, 34, 60], self::pick($quarter, 1.0, 1.2, 0.85, 0.95)), 'backgroundColor' => '#F79009'],
                                ['label' => self::t('هدف SLA', 'SLA target'), 'data' => [4, 8, 24, 48, 72], 'backgroundColor' => '#CBD5E1'],
                            ]]],
                ['id' => 'st-groups', 'type' => 'horizontalBar', 'title' => self::t('المهام حسب مجموعة التعيين', 'Tasks by assignment group'), 'subtitle' => self::t('أعلى 8 فرق من حيث الحجم', 'Top 8 teams by volume'),
                 'data' => ['labels' => array_column($groups, 'name'),
                            'datasets' => [['label' => self::t('مهام', 'Tasks'), 'data' => array_column($groups, 'count'), 'backgroundColor' => '#0E7C5A']]]],
            ],
            'table' => [
                'title' => self::t('أحدث المهام', 'Latest tasks'),
                'columns' => [self::t('الرقم', '#'), self::t('مجموعة التعيين', 'Assignment group'), self::t('الأولوية', 'Priority'), self::t('الحالة', 'Status'), self::t('الوصف', 'Description'), self::t('وقت الاستجابة', 'Response time')],
                'rows' => [
                    ['#SR-' . self::pick($quarter, '10482', '20617', '30901', '41250'), self::t('الأمن السيبراني', 'Cybersecurity'),                            self::t('حرجة', 'Critical'), self::t('مغلقة', 'Closed'),                self::t('محاولة دخول غير مصرّح بها على بوابة الخدمات', 'Unauthorised login attempt on the services portal'), self::t('00س 18د', '00h 18m')],
                    ['#SR-' . self::pick($quarter, '10485', '20620', '30904', '41253'), self::t('فريق الدعم الفني — المستوى الأول', 'Tech Support Team — Tier 1'), self::t('متوسطة', 'Medium'), self::t('قيد العمل', 'In progress'),     self::t('تعذّر الوصول إلى البريد الجامعي', 'Unable to access university email'),                          self::t('02س 40د', '02h 40m')],
                    ['#SR-' . self::pick($quarter, '10490', '20625', '30909', '41258'), self::t('الأنظمة الأكاديمية', 'Academic Systems'),                     self::t('عالية', 'High'),    self::t('مغلقة', 'Closed'),                self::t('خطأ في عرض الجدول الدراسي', 'Error displaying the class schedule'),                              self::t('01س 12د', '01h 12m')],
                    ['#SR-' . self::pick($quarter, '10493', '20628', '30912', '41261'), self::t('إدارة الشبكات والاتصالات', 'Network & Communications'),       self::t('عالية', 'High'),    self::t('مغلقة', 'Closed'),                self::t('انقطاع شبكة في مبنى كلية الهندسة', 'Network outage in the College of Engineering building'),       self::t('00س 52د', '00h 52m')],
                    ['#SR-' . self::pick($quarter, '10498', '20633', '30917', '41266'), self::t('فريق البنية التحتية', 'Infrastructure Team'),                  self::t('منخفضة', 'Low'),    self::t('بانتظار المعالجة', 'Awaiting action'), self::t('طلب توسعة مساحة تخزين', 'Storage capacity expansion request'),                                   self::t('06س 30د', '06h 30m')],
                ],
            ],
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // 2. لوحة الشكاوى والمقترحات
    // ─────────────────────────────────────────────────────────────
    private static function complaints(string $quarter): array
    {
        $f = self::factor($quarter, ['Q1' => 1.0, 'Q2' => 1.22, 'Q3' => 0.68, 'Q4' => 0.88]);

        $types = self::scale([2840, 1160, 940], $f); // استفسار اقتراح شكوى
        $total = self::sum($types);
        $responseRate = self::pick($quarter, 78.4, 71.2, 84.6, 80.1);
        $responded = (int) round($total * $responseRate / 100);
        $pending = $total - $responded;

        $depts = [
            ['name' => self::t('عمادة القبول والتسجيل',   'Admissions & Registration'),       'count' => (int) round(980 * $f), 'rate' => self::pick($quarter, 74, 68, 82, 77)],
            ['name' => self::t('عمادة شؤون الطلاب',        'Student Affairs'),                  'count' => (int) round(760 * $f), 'rate' => self::pick($quarter, 81, 75, 88, 83)],
            ['name' => self::t('الإدارة العامة للخدمات',   'General Services Department'),      'count' => (int) round(640 * $f), 'rate' => self::pick($quarter, 69, 62, 79, 72)],
            ['name' => self::t('عمادة تقنية المعلومات',    'Information Technology'),           'count' => (int) round(560 * $f), 'rate' => self::pick($quarter, 88, 84, 92, 90)],
            ['name' => self::t('الشؤون المالية',           'Finance'),                          'count' => (int) round(470 * $f), 'rate' => self::pick($quarter, 72, 65, 80, 74)],
            ['name' => self::t('عمادة شؤون أعضاء التدريس', 'Faculty Affairs'),                  'count' => (int) round(380 * $f), 'rate' => self::pick($quarter, 85, 79, 90, 86)],
            ['name' => self::t('الإسكان الجامعي',          'University Housing'),               'count' => (int) round(310 * $f), 'rate' => self::pick($quarter, 58, 51, 67, 61)],
            ['name' => self::t('النقل والمواصلات',         'Transport'),                        'count' => (int) round(240 * $f), 'rate' => self::pick($quarter, 64, 57, 73, 67)],
        ];

        $reqTypeLabels = [self::t('استفسار', 'Inquiry'), self::t('اقتراح', 'Suggestion'), self::t('شكوى', 'Complaint')];

        return [
            'kpis' => [
                ['label' => self::t('إجمالي الطلبات', 'Total submissions'),         'value' => number_format($total),     'unit' => self::t('طلب', 'request'), 'hint' => self::t('استفسار ', 'Inquiry ') . number_format($types[0]) . ' · ' . self::t('اقتراح ', 'Suggestion ') . number_format($types[1]) . ' · ' . self::t('شكوى ', 'Complaint ') . number_format($types[2]), 'tone' => 'violet'],
                ['label' => self::t('تم الرد', 'Responded'),                       'value' => number_format($responded), 'unit' => self::t('طلب', 'request'), 'hint' => self::t('أُغلقت بردّ إداري معتمد', 'Closed with an approved administrative reply'), 'tone' => 'green'],
                ['label' => self::t('بانتظار الرد', 'Awaiting reply'),             'value' => number_format($pending),   'unit' => self::t('طلب', 'request'), 'hint' => self::t('مفتوحة تتجاوز 48 ساعة', 'Open beyond 48 hours'), 'tone' => 'amber'],
                ['label' => self::t('نسبة الرد', 'Response rate'),                 'value' => $responseRate . '%',       'unit' => '', 'hint' => number_format($responded) . ' ' . self::t('من', 'of') . ' ' . number_format($total), 'tone' => 'blue'],
                ['label' => self::t('متوسط وقت الاستجابة', 'Average response time'), 'value' => self::pick($quarter, self::t('2.4 يوم', '2.4 days'), self::t('3.1 يوم', '3.1 days'), self::t('1.8 يوم', '1.8 days'), self::t('2.2 يوم', '2.2 days')), 'unit' => '', 'hint' => self::t('من تسجيل الطلب حتى أول رد', 'From submission to first reply'), 'tone' => 'slate'],
            ],
            'charts' => [
                ['id' => 'cp-types', 'type' => 'pie', 'title' => self::t('توزيع أنواع الطلبات', 'Submission type distribution'), 'subtitle' => self::t('استفسار · اقتراح · شكوى', 'Inquiry · Suggestion · Complaint'),
                 'data' => ['labels' => $reqTypeLabels,
                            'datasets' => [['data' => $types, 'backgroundColor' => ['#1B8354', '#6CE9A6', '#B42318']]]]],
                ['id' => 'cp-response', 'type' => 'doughnut', 'title' => self::t('نسبة الرد على الطلبات', 'Response rate on submissions'), 'subtitle' => self::t('تم الرد مقابل بدون رد', 'Responded vs. unanswered'),
                 'data' => ['labels' => [self::t('تم الرد', 'Responded'), self::t('بدون رد', 'Unanswered')],
                            'datasets' => [['data' => [$responded, $pending], 'backgroundColor' => ['#1B8354', '#CBD5E1']]]]],
                ['id' => 'cp-depts', 'type' => 'horizontalBar', 'title' => self::t('التوزيع حسب الإدارة', 'Distribution by department'), 'subtitle' => self::t('أعلى 8 إدارات من حيث حجم الطلبات', 'Top 8 departments by submission volume'),
                 'data' => ['labels' => array_column($depts, 'name'),
                            'datasets' => [['label' => self::t('طلبات', 'Submissions'), 'data' => array_column($depts, 'count'), 'backgroundColor' => '#7C3AED']]]],
                ['id' => 'cp-deptrate', 'type' => 'horizontalBar', 'title' => self::t('نسبة الرد حسب الإدارة', 'Response rate by department'), 'subtitle' => self::t('النسبة المئوية للطلبات المُجاب عليها', 'Percentage of submissions responded to'),
                 'data' => ['labels' => array_column($depts, 'name'),
                            'datasets' => [['label' => self::t('نسبة الرد %', 'Response rate %'), 'data' => array_column($depts, 'rate'), 'backgroundColor' => '#0891B2']]]],
                ['id' => 'cp-typebydept', 'type' => 'stackedBar', 'title' => self::t('نوع الطلب حسب الإدارة', 'Submission type by department'), 'subtitle' => self::t('توزيع الاستفسار/الاقتراح/الشكوى', 'Distribution of Inquiry/Suggestion/Complaint'), 'full' => true,
                 'data' => ['labels' => array_column($depts, 'name'),
                            'datasets' => [
                                ['label' => self::t('استفسار', 'Inquiry'),    'data' => self::scale([520, 410, 330, 360, 240, 210, 150, 130], $f), 'backgroundColor' => '#1B8354'],
                                ['label' => self::t('اقتراح', 'Suggestion'),  'data' => self::scale([260, 210, 180, 120, 130, 110, 90, 60], $f), 'backgroundColor' => '#6CE9A6'],
                                ['label' => self::t('شكوى', 'Complaint'),     'data' => self::scale([200, 140, 130, 80, 100, 60, 70, 50], $f), 'backgroundColor' => '#B42318'],
                            ]]],
                ['id' => 'cp-keywords', 'type' => 'horizontalBar', 'title' => self::t('أكثر الكلمات تكراراً', 'Most frequent keywords'), 'subtitle' => self::t('مستخرجة من نص الطلبات', 'Extracted from submission text'),
                 'data' => ['labels' => [self::t('البطاقة', 'ID Card'), self::t('التسجيل', 'Registration'), self::t('الجدول', 'Schedule'), self::t('الرسوم', 'Fees'), self::t('الإسكان', 'Housing'), self::t('القبول', 'Admissions'), self::t('البريد', 'Email'), self::t('المنحة', 'Scholarship'), self::t('الحذف', 'Drop'), self::t('الإضافة', 'Add')],
                            'datasets' => [['label' => self::t('تكرار', 'Frequency'), 'data' => self::scale([420, 380, 310, 280, 240, 220, 190, 160, 140, 120], $f), 'backgroundColor' => '#9333EA']]]],
            ],
            'table' => [
                'title' => self::t('أحدث الشكاوى والمقترحات', 'Latest complaints and suggestions'),
                'columns' => [self::t('النوع', 'Type'), self::t('الإدارة', 'Department'), self::t('التصنيف الفرعي', 'Sub-category'), self::t('ملاحظة الموظف', 'Staff note'), self::t('الرد', 'Reply')],
                'rows' => [
                    [self::t('شكوى', 'Complaint'),    self::t('عمادة القبول والتسجيل', 'Admissions & Registration'), self::t('إصدار البطاقة الجامعية', 'University ID card issuance'),  self::t('تمت إحالة الطلب لقسم الإصدار', 'Referred to the issuance unit'),         self::t('تم الرد', 'Responded')],
                    [self::t('اقتراح', 'Suggestion'), self::t('عمادة شؤون الطلاب', 'Student Affairs'),                self::t('الأنشطة الطلابية', 'Student activities'),                  self::t('مقترح قيد الدراسة من اللجنة', 'Under committee review'),                  self::t('بدون رد', 'Unanswered')],
                    [self::t('استفسار', 'Inquiry'),   self::t('الشؤون المالية', 'Finance'),                            self::t('الرسوم الدراسية', 'Tuition fees'),                          self::t('تم توضيح آلية السداد للطالب', 'Payment process clarified to the student'), self::t('تم الرد', 'Responded')],
                    [self::t('شكوى', 'Complaint'),    self::t('الإسكان الجامعي', 'University Housing'),                self::t('صيانة الوحدات السكنية', 'Housing unit maintenance'),       self::t('تم فتح بلاغ صيانة عاجل', 'Urgent maintenance ticket opened'),              self::t('تم الرد', 'Responded')],
                    [self::t('اقتراح', 'Suggestion'), self::t('عمادة تقنية المعلومات', 'Information Technology'),      self::t('تطبيق MyQU', 'MyQU app'),                                   self::t('تمت إضافة المقترح لخارطة الطريق', 'Added to the roadmap'),                self::t('تم الرد', 'Responded')],
                ],
            ],
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // 3. لوحة تقييم الخدمات
    // ─────────────────────────────────────────────────────────────
    private static function serviceEvaluations(string $quarter): array
    {
        $f = self::factor($quarter, ['Q1' => 1.0, 'Q2' => 1.10, 'Q3' => 0.71, 'Q4' => 0.96]);

        $dist = self::scale([7400, 4200, 1850, 980], $f); // راضي جداً، راضي، محايد، غير راضي
        $total = self::sum($dist);
        $satisfaction = round(($dist[0] + $dist[1]) / $total * 100, 1);
        $perfect = self::pick($quarter, 11, 14, 8, 12);

        $months = self::months($quarter);

        $services = [
            ['name' => self::t('الخدمات الإلكترونية', 'E-services'),         'rate' => self::pick($quarter, 96, 97, 94, 95)],
            ['name' => self::t('المكتبة المركزية',    'Central Library'),     'rate' => self::pick($quarter, 92, 93, 90, 91)],
            ['name' => self::t('القبول والتسجيل',     'Admissions & Registration'), 'rate' => self::pick($quarter, 88, 90, 85, 87)],
            ['name' => self::t('الدعم الأكاديمي',     'Academic Support'),    'rate' => self::pick($quarter, 85, 87, 82, 84)],
            ['name' => self::t('المطاعم والتغذية',    'Dining'),              'rate' => self::pick($quarter, 79, 81, 74, 77)],
            ['name' => self::t('النقل والمواصلات',    'Transport'),           'rate' => self::pick($quarter, 71, 73, 66, 69)],
            ['name' => self::t('الإسكان الطلابي',     'Student Housing'),     'rate' => self::pick($quarter, 62, 65, 55, 60)],
            ['name' => self::t('مواقف السيارات',      'Parking'),             'rate' => self::pick($quarter, 54, 57, 48, 52)],
        ];

        $satLabels4 = [self::t('راضٍ جداً', 'Very satisfied'), self::t('راضٍ', 'Satisfied'), self::t('محايد', 'Neutral'), self::t('غير راضٍ', 'Dissatisfied')];

        return [
            'kpis' => [
                ['label' => self::t('إجمالي التقييمات', 'Total ratings'),     'value' => number_format($total),     'unit' => self::t('تقييم', 'rating'), 'hint' => self::t('موزّعة على 59 خدمة جامعية', 'Spread across 59 university services'), 'tone' => 'blue'],
                ['label' => self::t('نسبة الرضا الكلية', 'Overall satisfaction'), 'value' => $satisfaction . '%', 'unit' => '', 'hint' => self::t('راضٍ + راضٍ جداً', 'Satisfied + Very satisfied'), 'tone' => 'green'],
                ['label' => self::t('راضٍ جداً', 'Very satisfied'),           'value' => number_format($dist[0]),   'unit' => self::t('تقييم', 'rating'), 'hint' => round($dist[0] / $total * 100, 1) . '% ' . self::t('من الإجمالي', 'of total'), 'tone' => 'green'],
                ['label' => self::t('محايد + غير راضٍ', 'Neutral + Dissatisfied'), 'value' => number_format($dist[2] + $dist[3]), 'unit' => self::t('تقييم', 'rating'), 'hint' => self::t('محايد ', 'Neutral ') . number_format($dist[2]) . ' · ' . self::t('غير راضٍ ', 'Dissatisfied ') . number_format($dist[3]), 'tone' => 'amber'],
                ['label' => self::t('خدمات بنسبة 100%', 'Services at 100%'),  'value' => $perfect,                  'unit' => self::t('خدمة', 'service'), 'hint' => self::t('رضا تام دون أي ملاحظة سلبية', 'Perfect satisfaction with no negative feedback'), 'tone' => 'violet'],
            ],
            'charts' => [
                ['id' => 'se-dist', 'type' => 'doughnut', 'title' => self::t('التوزيع الكلي للتقييمات', 'Overall rating distribution'), 'subtitle' => self::t('أربعة مستويات رضا', 'Four satisfaction levels'),
                 'data' => ['labels' => $satLabels4,
                            'datasets' => [['data' => $dist, 'backgroundColor' => ['#054F31', '#1B8354', '#6CE9A6', '#FECDCA']]]]],
                ['id' => 'se-category', 'type' => 'pie', 'title' => self::t('توزيع الفئات', 'Category split'), 'subtitle' => self::t('مبسّط — راضٍ / محايد / غير راضٍ', 'Simplified — Satisfied / Neutral / Dissatisfied'),
                 'data' => ['labels' => [self::t('راضٍ', 'Satisfied'), self::t('محايد', 'Neutral'), self::t('غير راضٍ', 'Dissatisfied')],
                            'datasets' => [['data' => [$dist[0] + $dist[1], $dist[2], $dist[3]], 'backgroundColor' => ['#1B8354', '#6CE9A6', '#B42318']]]]],
                ['id' => 'se-byservice', 'type' => 'horizontalBar', 'title' => self::t('نسبة الرضا حسب الخدمة', 'Satisfaction rate by service'), 'subtitle' => self::t('أعلى وأدنى الخدمات أداءً', 'Highest and lowest performing services'),
                 'data' => ['labels' => array_column($services, 'name'),
                            'datasets' => [['label' => self::t('نسبة الرضا %', 'Satisfaction %'), 'data' => array_column($services, 'rate'), 'backgroundColor' => '#0891B2']]]],
                ['id' => 'se-topservices', 'type' => 'stackedBar', 'title' => self::t('أكثر الخدمات تقييماً', 'Most-rated services'), 'subtitle' => self::t('حجم الاستخدام موزّع على مستويات الرضا', 'Usage volume across satisfaction levels'), 'full' => true,
                 'data' => ['labels' => [self::t('الخدمات الإلكترونية', 'E-services'), self::t('المكتبة المركزية', 'Central Library'), self::t('القبول والتسجيل', 'Admissions & Registration'), self::t('الدعم الأكاديمي', 'Academic Support'), self::t('المطاعم والتغذية', 'Dining'), self::t('النقل والمواصلات', 'Transport')],
                            'datasets' => [
                                ['label' => self::t('راضٍ جداً', 'Very satisfied'), 'data' => self::scale([1340, 980, 870, 720, 540, 410], $f), 'backgroundColor' => '#054F31'],
                                ['label' => self::t('راضٍ', 'Satisfied'),           'data' => self::scale([620, 540, 480, 420, 360, 300], $f),   'backgroundColor' => '#1B8354'],
                                ['label' => self::t('محايد', 'Neutral'),            'data' => self::scale([180, 210, 240, 260, 320, 290], $f),   'backgroundColor' => '#6CE9A6'],
                                ['label' => self::t('غير راضٍ', 'Dissatisfied'),     'data' => self::scale([60, 90, 130, 160, 240, 280], $f),     'backgroundColor' => '#B42318'],
                            ]]],
                ['id' => 'se-trend', 'type' => 'line', 'title' => self::t('اتجاه نسبة الرضا', 'Satisfaction trend'), 'subtitle' => self::t('متوسط شهري خلال الربع', 'Monthly average across the quarter'), 'full' => true,
                 'data' => ['labels' => $months,
                            'datasets' => [['label' => self::t('نسبة الرضا %', 'Satisfaction %'), 'data' => self::pick($quarter, [83, 84, 86], [85, 87, 88], [78, 79, 81], [82, 83, 84]), 'borderColor' => '#0891B2', 'backgroundColor' => 'rgba(8,145,178,0.12)', 'fill' => true, 'tension' => 0.4]]]],
            ],
            'table' => [
                'title' => self::t('ترتيب الخدمات حسب نسبة الرضا', 'Services ranked by satisfaction'),
                'columns' => ['#', self::t('الخدمة', 'Service'), self::t('راضٍ جداً', 'Very satisfied'), self::t('راضٍ', 'Satisfied'), self::t('محايد', 'Neutral'), self::t('غير راضٍ', 'Dissatisfied'), self::t('نسبة الرضا', 'Satisfaction')],
                'rows' => array_map(function ($s, $i) use ($f) {
                    $vs = (int) round((220 - $i * 18) * $f);
                    $sa = (int) round((140 - $i * 10) * $f);
                    $ne = (int) round((20 + $i * 9) * $f);
                    $di = (int) round((6 + $i * 11) * $f);
                    return [$i + 1, $s['name'], number_format($vs), number_format($sa), number_format($ne), number_format($di), $s['rate'] . '%'];
                }, array_slice([
                    ['name' => self::t('الخدمات الإلكترونية', 'E-services'),                'rate' => 96],
                    ['name' => self::t('المكتبة المركزية',    'Central Library'),            'rate' => 92],
                    ['name' => self::t('القبول والتسجيل',     'Admissions & Registration'),  'rate' => 88],
                    ['name' => self::t('الدعم الأكاديمي',     'Academic Support'),           'rate' => 85],
                    ['name' => self::t('الإسكان الطلابي',     'Student Housing'),            'rate' => 62],
                ], 0, 5), [0, 1, 2, 3, 4]),
            ],
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // 4. لوحة التقييمات الخارجية
    // ─────────────────────────────────────────────────────────────
    private static function reviews(string $quarter): array
    {
        $f = self::factor($quarter, ['Q1' => 1.0, 'Q2' => 1.15, 'Q3' => 0.79, 'Q4' => 1.04]);

        $sentiment = self::scale([3120, 1180, 940], $f); // إيجابي سلبي محايد
        $total = self::sum($sentiment);
        $avgRating = self::pick($quarter, 4.1, 4.3, 3.8, 4.0);
        $satisfaction = round($sentiment[0] / $total * 100, 1);

        $platforms = self::scale([1840, 1320, 980, 740, 420, 310, 180], $f);
        $platformLabels = [self::t('وسائل التواصل', 'Social media'), self::t('خرائط قوقل', 'Google Maps'), self::t('آب ستور', 'App Store'), self::t('قوقل بلاي', 'Google Play'), 'Reddit', self::t('يوتيوب', 'YouTube'), self::t('أخبار', 'News')];

        // 30-day sentiment trend (compressed to 10 points)
        $days = array_map(fn ($i) => (($i * 3) + 1), range(0, 9));
        $dayLabels = array_map(fn ($d) => self::t('يوم ', 'Day ') . $d, $days);

        $sentLabels = [self::t('إيجابي', 'Positive'), self::t('سلبي', 'Negative'), self::t('محايد', 'Neutral')];
        $topPlatformLabels = [self::t('وسائل التواصل', 'Social media'), self::t('خرائط قوقل', 'Google Maps'), self::t('آب ستور', 'App Store'), self::t('قوقل بلاي', 'Google Play')];

        return [
            'kpis' => [
                ['label' => self::t('إجمالي التقييمات', 'Total reviews'),  'value' => number_format($total),  'unit' => self::t('تقييم', 'review'), 'hint' => self::t('تم تحليلها بالكامل آلياً', 'Fully analysed automatically'), 'tone' => 'amber'],
                ['label' => self::t('متوسط التقييم', 'Average rating'),    'value' => $avgRating . ' / 5',    'unit' => '', 'hint' => self::t('موزون عبر كل المنصات', 'Weighted across all platforms'), 'tone' => 'green'],
                ['label' => self::t('نسبة الرضا', 'Satisfaction'),         'value' => $satisfaction . '%',    'unit' => '', 'hint' => self::t('إيجابي ', 'Positive ') . number_format($sentiment[0]) . ' · ' . self::t('سلبي ', 'Negative ') . number_format($sentiment[1]), 'tone' => 'blue'],
                ['label' => self::t('المنصات النشطة', 'Active platforms'), 'value' => 7,                      'unit' => self::t('منصة', 'platform'), 'hint' => self::t('تواصل · خرائط · متاجر · أخبار', 'Social · Maps · Stores · News'), 'tone' => 'violet'],
            ],
            'charts' => [
                ['id' => 'rv-sentiment', 'type' => 'pie', 'title' => self::t('توزيع المشاعر', 'Sentiment distribution'), 'subtitle' => self::t('إيجابي · سلبي · محايد', 'Positive · Negative · Neutral'),
                 'data' => ['labels' => $sentLabels,
                            'datasets' => [['data' => $sentiment, 'backgroundColor' => ['#1B8354', '#B42318', '#94A3B8']]]]],
                ['id' => 'rv-language', 'type' => 'doughnut', 'title' => self::t('التقييمات حسب اللغة', 'Reviews by language'), 'subtitle' => self::t('العربية مقابل الإنجليزية', 'Arabic vs. English'),
                 'data' => ['labels' => [self::t('العربية', 'Arabic'), self::t('الإنجليزية', 'English'), self::t('أخرى', 'Other')],
                            'datasets' => [['data' => self::scale([3640, 1380, 220], $f), 'backgroundColor' => ['#D97706', '#FBBF24', '#FDE68A']]]]],
                ['id' => 'rv-platforms', 'type' => 'bar', 'title' => self::t('توزيع المنصات', 'Platform distribution'), 'subtitle' => self::t('حجم التقييمات لكل منصة', 'Review volume per platform'),
                 'data' => ['labels' => $platformLabels,
                            'datasets' => [['label' => self::t('تقييمات', 'Reviews'), 'data' => $platforms, 'backgroundColor' => '#D97706']]]],
                ['id' => 'rv-stars', 'type' => 'bar', 'title' => self::t('توزيع التقييمات بالنجوم', 'Star rating distribution'), 'subtitle' => self::t('حسب متاجر التطبيقات والخرائط', 'By app stores and maps'),
                 'data' => ['labels' => ['★', '★★', '★★★', '★★★★', '★★★★★'],
                            'datasets' => [
                                ['label' => self::t('خرائط قوقل', 'Google Maps'), 'data' => self::scale([90, 110, 180, 360, 580], $f), 'backgroundColor' => '#B42318'],
                                ['label' => self::t('آب ستور', 'App Store'),       'data' => self::scale([60, 80, 140, 300, 400], $f),  'backgroundColor' => '#F79009'],
                                ['label' => self::t('قوقل بلاي', 'Google Play'),   'data' => self::scale([70, 90, 130, 240, 210], $f),  'backgroundColor' => '#1B8354'],
                            ]]],
                ['id' => 'rv-trend', 'type' => 'line', 'title' => self::t('اتجاه المشاعر خلال الربع', 'Sentiment trend across the quarter'), 'subtitle' => self::t('إيجابي · محايد · سلبي', 'Positive · Neutral · Negative'), 'full' => true,
                 'data' => ['labels' => $dayLabels,
                            'datasets' => [
                                ['label' => self::t('إيجابي', 'Positive'), 'data' => self::scale([280, 300, 290, 320, 340, 330, 360, 350, 370, 380], $f), 'borderColor' => '#1B8354', 'backgroundColor' => 'rgba(27,131,84,0.10)', 'fill' => true, 'tension' => 0.4],
                                ['label' => self::t('محايد', 'Neutral'),    'data' => self::scale([90, 100, 95, 110, 105, 115, 100, 120, 110, 115], $f),    'borderColor' => '#94A3B8', 'backgroundColor' => 'rgba(148,163,184,0.10)', 'fill' => true, 'tension' => 0.4],
                                ['label' => self::t('سلبي', 'Negative'),    'data' => self::scale([120, 110, 130, 100, 115, 95, 105, 90, 100, 85], $f),     'borderColor' => '#B42318', 'backgroundColor' => 'rgba(180,35,24,0.10)', 'fill' => true, 'tension' => 0.4],
                            ]]],
                ['id' => 'rv-platsentiment', 'type' => 'stackedBar', 'title' => self::t('المشاعر حسب المنصة الرئيسية', 'Sentiment by main platform'), 'subtitle' => self::t('توزيع المشاعر داخل كل منصة', 'Sentiment split inside each platform'), 'full' => true,
                 'data' => ['labels' => $topPlatformLabels,
                            'datasets' => [
                                ['label' => self::t('إيجابي', 'Positive'), 'data' => self::scale([1100, 820, 640, 490], $f), 'backgroundColor' => '#1B8354'],
                                ['label' => self::t('محايد', 'Neutral'),    'data' => self::scale([380, 300, 180, 130], $f),  'backgroundColor' => '#94A3B8'],
                                ['label' => self::t('سلبي', 'Negative'),    'data' => self::scale([360, 200, 160, 120], $f),  'backgroundColor' => '#B42318'],
                            ]]],
                ['id' => 'rv-topics', 'type' => 'horizontalBar', 'title' => self::t('أكثر المواضيع ذكراً', 'Most mentioned topics'), 'subtitle' => self::t('مستخرجة من نص المراجعات', 'Extracted from review text'),
                 'data' => ['labels' => [self::t('القبول والتسجيل', 'Admissions & Registration'), self::t('تطبيق MyQU', 'MyQU app'), self::t('المرافق', 'Facilities'), self::t('أعضاء هيئة التدريس', 'Faculty'), self::t('المواقف', 'Parking'), self::t('الرسوم', 'Fees'), self::t('البريد الجامعي', 'University email'), self::t('الفعاليات', 'Events')],
                            'datasets' => [['label' => self::t('إشارة', 'Mention'), 'data' => self::scale([520, 460, 380, 340, 290, 240, 200, 160], $f), 'backgroundColor' => '#B45309']]]],
            ],
            'table' => [
                'title' => self::t('أحدث التقييمات السلبية', 'Latest negative reviews'),
                'columns' => [self::t('المنصة', 'Platform'), self::t('المحتوى', 'Content'), self::t('التقييم', 'Rating'), self::t('التاريخ', 'Date')],
                'rows' => [
                    [self::t('خرائط قوقل', 'Google Maps'),    self::t('تجربة القبول كانت محبطة، الموقع يطلب نفس البيانات في كل خطوة', 'The admissions experience was frustrating — the site asks for the same data at every step'), '★★', self::pick($quarter, '2025-02-18', '2025-05-09', '2025-08-21', '2025-11-12')],
                    [self::t('آب ستور', 'App Store'),          self::t('التطبيق يرسل إشعارات متكررة ومتأخرة عن موعدها', 'The app sends duplicate, late notifications'),                                  '★★', self::pick($quarter, '2025-03-04', '2025-04-27', '2025-09-03', '2025-12-01')],
                    [self::t('وسائل التواصل', 'Social media'), self::t('الرد على الاستفسارات في المنصات بطيء جداً', 'Replies to inquiries on social platforms are very slow'),                       '★',  self::pick($quarter, '2025-01-29', '2025-06-11', '2025-07-19', '2025-10-22')],
                    [self::t('قوقل بلاي', 'Google Play'),       self::t('صعوبة في تسجيل الدخول الموحّد بعد آخر تحديث', 'Trouble with single sign-on after the latest update'),                       '★★', self::pick($quarter, '2025-02-25', '2025-05-30', '2025-08-08', '2025-11-28')],
                ],
            ],
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // 5. لوحة Microsoft Clarity
    // ─────────────────────────────────────────────────────────────
    private static function clarity(string $quarter): array
    {
        $f = self::factor($quarter, ['Q1' => 1.0, 'Q2' => 1.20, 'Q3' => 0.83, 'Q4' => 1.06]);

        $sessions = (int) round(184000 * $f);
        $bots = (int) round($sessions * 0.14);
        $humans = $sessions - $bots;
        $uniqueUsers = (int) round(96000 * $f);
        $engagement = self::pick($quarter, 62.4, 65.1, 58.7, 61.2);
        $friction = self::pick($quarter, 38, 33, 44, 36);

        $projects = ['faculty.qu.edu.sa', 'myqu.qu.edu.sa', 'www.qu.edu.sa'];

        // 14-day sessions trend (compressed to 7 points) per project
        $dayLabels = array_map(fn ($i) => self::t('يوم ', 'Day ') . (($i * 2) + 1), range(0, 6));

        return [
            'kpis' => [
                ['label' => self::t('إجمالي الزيارات', 'Total sessions'),       'value' => number_format($sessions),    'unit' => self::t('جلسة', 'session'), 'hint' => self::t('بشري ', 'Human ') . number_format($humans) . ' · ' . self::t('بوت ', 'Bot ') . number_format($bots), 'tone' => 'green'],
                ['label' => self::t('المستخدمون الفريدون', 'Unique users'),     'value' => number_format($uniqueUsers), 'unit' => self::t('مستخدم', 'user'), 'hint' => self::t('موزّعون على 3 منصات', 'Spread across 3 platforms'), 'tone' => 'blue'],
                ['label' => self::t('متوسط التفاعل', 'Average engagement'),     'value' => $engagement . '%',           'unit' => '', 'hint' => self::t('متوسط 3.4 صفحة لكل جلسة', 'Average 3.4 pages per session'), 'tone' => 'violet'],
                ['label' => self::t('مؤشر الإحباط', 'Frustration index'),       'value' => $friction,                   'unit' => '/ 100', 'hint' => self::t('نقرات غاضبة · ميتة · عودة سريعة', 'Rage · Dead clicks · Quick back'), 'tone' => 'red'],
            ],
            'charts' => [
                ['id' => 'cl-trend', 'type' => 'line', 'title' => self::t('اتجاه الزيارات اليومية', 'Daily sessions trend'), 'subtitle' => self::t('آخر 14 يوم — حسب المنصة', 'Last 14 days — by platform'), 'full' => true,
                 'data' => ['labels' => $dayLabels,
                            'datasets' => [
                                ['label' => $projects[0], 'data' => self::scale([4200, 4400, 4100, 4600, 4800, 4700, 5000], $f), 'borderColor' => '#054F31', 'backgroundColor' => 'rgba(5,79,49,0.10)', 'fill' => true, 'tension' => 0.4],
                                ['label' => $projects[1], 'data' => self::scale([6800, 7100, 6900, 7400, 7600, 7300, 7800], $f), 'borderColor' => '#1B8354', 'backgroundColor' => 'rgba(27,131,84,0.10)', 'fill' => true, 'tension' => 0.4],
                                ['label' => $projects[2], 'data' => self::scale([3100, 3300, 3000, 3500, 3700, 3600, 3900], $f), 'borderColor' => '#6CE9A6', 'backgroundColor' => 'rgba(108,233,166,0.12)', 'fill' => true, 'tension' => 0.4],
                            ]]],
                ['id' => 'cl-comparison', 'type' => 'bar', 'title' => self::t('مقارنة الزيارات والمستخدمين', 'Sessions vs. users comparison'), 'subtitle' => self::t('بين المنصات الثلاث', 'Across the three platforms'),
                 'data' => ['labels' => $projects,
                            'datasets' => [
                                ['label' => self::t('إجمالي الزيارات', 'Total sessions'),      'data' => self::scale([58000, 92000, 34000], $f), 'backgroundColor' => '#1B8354'],
                                ['label' => self::t('جلسات بشرية', 'Human sessions'),         'data' => self::scale([50000, 79000, 29000], $f), 'backgroundColor' => '#6CE9A6'],
                                ['label' => self::t('المستخدمون الفريدون', 'Unique users'),   'data' => self::scale([31000, 48000, 17000], $f), 'backgroundColor' => '#94A3B8'],
                            ]]],
                ['id' => 'cl-friction', 'type' => 'radar', 'title' => self::t('مؤشرات الإحباط حسب المنصة', 'Frustration indicators by platform'), 'subtitle' => self::t('كلما اتسع الشكل زاد الاحتكاك', 'The wider the shape, the more friction'),
                 'data' => ['labels' => [self::t('نقرات ميتة', 'Dead clicks'), self::t('نقرات الغضب', 'Rage clicks'), self::t('عودة سريعة', 'Quick back'), self::t('تمرير زائد', 'Excessive scroll'), self::t('أخطاء سكربت', 'Script errors')],
                            'datasets' => [
                                ['label' => $projects[0], 'data' => self::scale([42, 38, 30, 26, 18], self::pick($quarter, 1.0, 0.9, 1.15, 0.97)), 'borderColor' => '#054F31', 'backgroundColor' => 'rgba(5,79,49,0.15)'],
                                ['label' => $projects[1], 'data' => self::scale([28, 24, 35, 40, 22], self::pick($quarter, 1.0, 0.9, 1.15, 0.97)), 'borderColor' => '#1B8354', 'backgroundColor' => 'rgba(27,131,84,0.15)'],
                                ['label' => $projects[2], 'data' => self::scale([20, 18, 26, 30, 14], self::pick($quarter, 1.0, 0.9, 1.15, 0.97)), 'borderColor' => '#6CE9A6', 'backgroundColor' => 'rgba(108,233,166,0.18)'],
                            ]]],
                ['id' => 'cl-engagement', 'type' => 'bar', 'title' => self::t('مؤشرات التفاعل والتصفح', 'Engagement & browsing indicators'), 'subtitle' => self::t('نسبة التفاعل وعمق التمرير لكل منصة', 'Engagement rate and scroll depth per platform'),
                 'data' => ['labels' => $projects,
                            'datasets' => [
                                ['label' => self::t('نسبة التفاعل %', 'Engagement %'), 'data' => self::pick($quarter, [58, 67, 54], [61, 70, 57], [52, 62, 49], [56, 65, 52]), 'backgroundColor' => '#1B8354'],
                                ['label' => self::t('عمق التمرير %', 'Scroll depth %'), 'data' => self::pick($quarter, [64, 72, 60], [67, 75, 63], [58, 68, 55], [62, 70, 58]), 'backgroundColor' => '#6CE9A6'],
                            ]]],
                ['id' => 'cl-botvshuman', 'type' => 'stackedBar', 'title' => self::t('الجلسات البشرية مقابل البوتات', 'Human vs. bot sessions'), 'subtitle' => self::t('لكل منصة', 'Per platform'),
                 'data' => ['labels' => $projects,
                            'datasets' => [
                                ['label' => self::t('بشري', 'Human'), 'data' => self::scale([50000, 79000, 29000], $f), 'backgroundColor' => '#1B8354'],
                                ['label' => self::t('بوتات', 'Bots'), 'data' => self::scale([8000, 13000, 5000], $f),   'backgroundColor' => '#CBD5E1'],
                            ]]],
                ['id' => 'cl-devices', 'type' => 'stackedBar', 'title' => self::t('توزيع الأجهزة حسب المنصة', 'Device distribution by platform'), 'subtitle' => self::t('حاسب · جوال · لوحي · أخرى', 'Desktop · Mobile · Tablet · Other'),
                 'data' => ['labels' => $projects,
                            'datasets' => [
                                ['label' => self::t('حاسب', 'Desktop'), 'data' => self::scale([34000, 28000, 12000], $f), 'backgroundColor' => '#054F31'],
                                ['label' => self::t('جوال', 'Mobile'),  'data' => self::scale([20000, 56000, 19000], $f), 'backgroundColor' => '#1B8354'],
                                ['label' => self::t('لوحي', 'Tablet'),  'data' => self::scale([3000, 6000, 2500], $f),    'backgroundColor' => '#6CE9A6'],
                                ['label' => self::t('أخرى', 'Other'),   'data' => self::scale([1000, 2000, 500], $f),     'backgroundColor' => '#CBD5E1'],
                            ]]],
            ],
            'table' => null,
        ];
    }

    // ─────────────────────────────────────────────────────────────
    // 6. لوحة الأفكار — تطبيق MyQU
    // ─────────────────────────────────────────────────────────────
    private static function feedback(string $quarter): array
    {
        $f = self::factor($quarter, ['Q1' => 1.0, 'Q2' => 1.28, 'Q3' => 0.72, 'Q4' => 0.91]);

        $tags = self::scale([180, 240, 320, 90, 410], $f); // done, in_progress, planned, wont_do, untagged
        $tagLabels = [
            self::t('منفّذة', 'Done'),
            self::t('قيد التنفيذ', 'In progress'),
            self::t('مخطّطة', 'Planned'),
            self::t('لن تُنفّذ', 'Won\'t do'),
            self::t('غير مصنّفة', 'Untagged'),
        ];
        $total = self::sum($tags);
        $published = (int) round($total * 0.86);
        $untagged = $tags[4];
        $reactions = (int) round(48200 * $f);
        $avgReactions = $total > 0 ? round($reactions / $total, 1) : 0;

        $months = self::months($quarter);

        $statusPublished = self::t('منشور للجميع', 'Published');
        $statusReview    = self::t('قيد المراجعة', 'Under review');
        $statusRejected  = self::t('مرفوض', 'Rejected');
        $tagPlanned     = self::t('مخطّطة', 'Planned');
        $tagInProgress  = self::t('قيد التنفيذ', 'In progress');
        $tagDone        = self::t('منفّذة', 'Done');

        return [
            'kpis' => [
                ['label' => self::t('إجمالي الأفكار', 'Total ideas'),       'value' => number_format($total),      'unit' => self::t('فكرة', 'idea'),     'hint' => self::t('مقدّمة عبر بوابة MyQU للآراء', 'Submitted via the MyQU feedback portal'), 'tone' => 'green'],
                ['label' => self::t('منشورة للجميع', 'Published'),          'value' => number_format($published),  'unit' => self::t('فكرة', 'idea'),     'hint' => round($published / $total * 100) . '% ' . self::t('من الإجمالي', 'of total'), 'tone' => 'blue'],
                ['label' => self::t('غير مصنّفة', 'Untagged'),              'value' => number_format($untagged),   'unit' => self::t('فكرة', 'idea'),     'hint' => self::t('بانتظار التصنيف الإداري', 'Awaiting administrative tagging'), 'tone' => 'amber'],
                ['label' => self::t('إجمالي التفاعلات', 'Total reactions'), 'value' => number_format($reactions),  'unit' => self::t('تفاعل', 'reaction'), 'hint' => self::t('متوسط ', 'Average ') . $avgReactions . ' ' . self::t('تفاعل لكل فكرة', 'reactions per idea'), 'tone' => 'violet'],
            ],
            'charts' => [
                ['id' => 'fb-tags', 'type' => 'doughnut', 'title' => self::t('توزيع التصنيفات الإدارية', 'Administrative tag distribution'), 'subtitle' => self::t('حالة كل فكرة في خارطة الطريق', 'Status of each idea on the roadmap'),
                 'data' => ['labels' => $tagLabels,
                            'datasets' => [['data' => $tags, 'backgroundColor' => ['#054F31', '#1B8354', '#6CE9A6', '#B42318', '#CBD5E1']]]]],
                ['id' => 'fb-status', 'type' => 'bar', 'title' => self::t('حالة المراجعة على المنصة', 'Platform review status'), 'subtitle' => self::t('منشور · قيد المراجعة · مرفوض', 'Published · Under review · Rejected'),
                 'data' => ['labels' => [$statusPublished, $statusReview, $statusRejected],
                            'datasets' => [['label' => self::t('عدد الآراء', 'Number of ideas'), 'data' => self::scale([1040, 160, 40], $f), 'backgroundColor' => ['#1B8354', '#F79009', '#B42318']]]]],
                ['id' => 'fb-tagreactions', 'type' => 'bar', 'title' => self::t('متوسط التفاعل لكل تصنيف', 'Average reactions per tag'), 'subtitle' => self::t('أي التصنيفات تستقطب أكثر', 'Which tags attract the most'),
                 'data' => ['labels' => $tagLabels,
                            'datasets' => [['label' => self::t('متوسط تفاعل/رأي', 'Average reactions/idea'), 'data' => self::pick($quarter, [62, 48, 71, 22, 38], [70, 54, 78, 25, 44], [55, 41, 63, 19, 33], [60, 46, 68, 21, 37]), 'backgroundColor' => '#7C3AED']]]],
                ['id' => 'fb-trend', 'type' => 'line', 'title' => self::t('اتجاه إرسال الأفكار', 'Idea submission trend'), 'subtitle' => self::t('عدد الأفكار المقدّمة شهرياً', 'Ideas submitted per month'), 'full' => true,
                 'data' => ['labels' => $months,
                            'datasets' => [['label' => self::t('أفكار مقدّمة', 'Submitted ideas'), 'data' => self::scale([380, 420, 440], $f), 'borderColor' => '#1B8354', 'backgroundColor' => 'rgba(27,131,84,0.12)', 'fill' => true, 'tension' => 0.4]]]],
                ['id' => 'fb-topics', 'type' => 'horizontalBar', 'title' => self::t('أكثر المواضيع ذكراً', 'Most mentioned topics'), 'subtitle' => self::t('مستخرجة من نص الأفكار', 'Extracted from idea text'),
                 'data' => ['labels' => [self::t('ساعات المكتبة', 'Library hours'), self::t('المواقف', 'Parking'), self::t('تطبيق MyQU', 'MyQU app'), self::t('المطاعم', 'Restaurants'), self::t('القاعات الدراسية', 'Classrooms'), self::t('الفعاليات', 'Events'), self::t('النقل', 'Transport'), self::t('الخدمات الإلكترونية', 'E-services')],
                            'datasets' => [['label' => self::t('تكرار', 'Frequency'), 'data' => self::scale([180, 150, 140, 120, 100, 90, 70, 60], $f), 'backgroundColor' => '#9333EA']]]],
            ],
            'table' => [
                'title' => self::t('أعلى الأفكار تفاعلاً', 'Top ideas by reactions'),
                'columns' => [self::t('الفكرة', 'Idea'), self::t('التصنيف', 'Tag'), self::t('التفاعلات', 'Reactions'), self::t('الحالة', 'Status')],
                'rows' => [
                    [self::t('تمديد ساعات المكتبة المركزية خلال الاختبارات', 'Extend central library hours during exams'),       $tagPlanned,    number_format((int) round(312 * $f)), $statusPublished],
                    [self::t('إضافة دفع رسوم المواقف عبر تطبيق MyQU', 'Add parking fee payment via the MyQU app'),                 $tagInProgress, number_format((int) round(254 * $f)), $statusPublished],
                    [self::t('تطبيق نظام حجز قاعات للمجموعات الدراسية', 'Roll out a room booking system for study groups'),       $tagPlanned,    number_format((int) round(208 * $f)), $statusPublished],
                    [self::t('تنويع خيارات المطاعم وإضافة وجبات صحية', 'Diversify restaurant options and add healthy meals'),     $tagDone,       number_format((int) round(186 * $f)), $statusPublished],
                    [self::t('إشعارات أذكى للمواعيد النهائية للتسجيل', 'Smarter notifications for registration deadlines'),       $tagInProgress, number_format((int) round(167 * $f)), $statusPublished],
                ],
            ],
        ];
    }
}
