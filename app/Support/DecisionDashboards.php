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
    /** Quarter keys → human labels (all demo year 2025). */
    public static function quarters(): array
    {
        return [
            'Q1' => ['label' => 'الربع الأول', 'range' => 'يناير – مارس 2025'],
            'Q2' => ['label' => 'الربع الثاني', 'range' => 'أبريل – يونيو 2025'],
            'Q3' => ['label' => 'الربع الثالث', 'range' => 'يوليو – سبتمبر 2025'],
            'Q4' => ['label' => 'الربع الرابع', 'range' => 'أكتوبر – ديسمبر 2025'],
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
            'Q1' => ['يناير', 'فبراير', 'مارس'],
            'Q2' => ['أبريل', 'مايو', 'يونيو'],
            'Q3' => ['يوليو', 'أغسطس', 'سبتمبر'],
            'Q4' => ['أكتوبر', 'نوفمبر', 'ديسمبر'],
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
        $weekLabels = array_map(fn ($i) => 'أسبوع ' . ($i + 1), range(0, 12));

        $groups = [
            ['name' => 'فريق الدعم الفني — المستوى الأول', 'count' => (int) round(1240 * $f)],
            ['name' => 'إدارة الشبكات والاتصالات',          'count' => (int) round(880 * $f)],
            ['name' => 'فريق الأنظمة الأكاديمية',           'count' => (int) round(760 * $f)],
            ['name' => 'الأمن السيبراني',                   'count' => (int) round(540 * $f)],
            ['name' => 'إدارة قواعد البيانات',              'count' => (int) round(430 * $f)],
            ['name' => 'فريق البنية التحتية',               'count' => (int) round(390 * $f)],
            ['name' => 'الدعم الميداني — المباني',          'count' => (int) round(320 * $f)],
            ['name' => 'فريق تطوير التطبيقات',              'count' => (int) round(260 * $f)],
        ];

        return [
            'kpis' => [
                ['label' => 'المهام المغلقة',        'value' => number_format($closed),         'unit' => 'مهمة', 'hint' => 'كتالوج ' . number_format($types[0] + $types[3]) . ' · حوادث ' . number_format($types[1] + $types[2]), 'tone' => 'green'],
                ['label' => 'حوادث أمنية',           'value' => number_format($security),       'unit' => 'حادثة', 'hint' => 'تم احتواؤها ضمن SLA الأمني', 'tone' => 'red'],
                ['label' => 'متوسط وقت الاستجابة',   'value' => self::pick($quarter, '4س 12د', '5س 02د', '3س 28د', '3س 56د'), 'unit' => '', 'hint' => 'من فتح المهمة حتى أول إجراء', 'tone' => 'blue'],
                ['label' => 'متأخرة عن SLA',         'value' => number_format($late),           'unit' => 'مهمة', 'hint' => $latePct . '% من إجمالي المهام', 'tone' => 'amber'],
            ],
            'charts' => [
                ['id' => 'st-priority', 'type' => 'doughnut', 'title' => 'توزيع الأولويات', 'subtitle' => 'حسب تصنيف الأولوية في نظام ساعد',
                 'data' => ['labels' => ['حرجة', 'عالية', 'متوسطة', 'منخفضة', 'تخطيط'],
                            'datasets' => [['data' => $priority, 'backgroundColor' => ['#B42318', '#F79009', '#1B8354', '#6CE9A6', '#94A3B8']]]]],
                ['id' => 'st-types', 'type' => 'doughnut', 'title' => 'توزيع أنواع المهام', 'subtitle' => 'كتالوج مقابل حوادث',
                 'data' => ['labels' => ['مهمة كتالوج', 'مهمة حادث', 'حادث', 'كتالوج'],
                            'datasets' => [['data' => $types, 'backgroundColor' => ['#1B8354', '#B42318', '#F04438', '#6CE9A6']]]]],
                ['id' => 'st-monthly', 'type' => 'line', 'title' => 'المهام حسب الشهر', 'subtitle' => 'مهام الكتالوج مقابل الحوادث', 'full' => true,
                 'data' => ['labels' => $months,
                            'datasets' => [
                                ['label' => 'مهام الكتالوج', 'data' => $catalogMonthly, 'borderColor' => '#1B8354', 'backgroundColor' => 'rgba(27,131,84,0.12)', 'fill' => true, 'tension' => 0.4],
                                ['label' => 'حوادث', 'data' => $incidentMonthly, 'borderColor' => '#B42318', 'backgroundColor' => 'rgba(180,35,24,0.10)', 'fill' => true, 'tension' => 0.4],
                            ]]],
                ['id' => 'st-weekly', 'type' => 'bar', 'title' => 'حجم المهام الأسبوعي', 'subtitle' => 'إجمالي المهام المفتوحة كل أسبوع', 'full' => true,
                 'data' => ['labels' => $weekLabels,
                            'datasets' => [['label' => 'مهام', 'data' => $weekly, 'backgroundColor' => '#1B8354']]]],
                ['id' => 'st-resolution', 'type' => 'bar', 'title' => 'متوسط وقت الحل مقابل هدف SLA', 'subtitle' => 'بالساعات — حسب الأولوية',
                 'data' => ['labels' => ['حرجة', 'عالية', 'متوسطة', 'منخفضة', 'تخطيط'],
                            'datasets' => [
                                ['label' => 'الفعلي', 'data' => self::scale([3, 7, 18, 34, 60], self::pick($quarter, 1.0, 1.2, 0.85, 0.95)), 'backgroundColor' => '#F79009'],
                                ['label' => 'هدف SLA', 'data' => [4, 8, 24, 48, 72], 'backgroundColor' => '#CBD5E1'],
                            ]]],
                ['id' => 'st-groups', 'type' => 'horizontalBar', 'title' => 'المهام حسب مجموعة التعيين', 'subtitle' => 'أعلى 8 فرق من حيث الحجم',
                 'data' => ['labels' => array_column($groups, 'name'),
                            'datasets' => [['label' => 'مهام', 'data' => array_column($groups, 'count'), 'backgroundColor' => '#0E7C5A']]]],
            ],
            'table' => [
                'title' => 'أحدث المهام',
                'columns' => ['الرقم', 'مجموعة التعيين', 'الأولوية', 'الحالة', 'الوصف', 'وقت الاستجابة'],
                'rows' => [
                    ['#SR-' . self::pick($quarter, '10482', '20617', '30901', '41250'), 'الأمن السيبراني', 'حرجة', 'مغلقة', 'محاولة دخول غير مصرّح بها على بوابة الخدمات', '00س 18د'],
                    ['#SR-' . self::pick($quarter, '10485', '20620', '30904', '41253'), 'فريق الدعم الفني — المستوى الأول', 'متوسطة', 'قيد العمل', 'تعذّر الوصول إلى البريد الجامعي', '02س 40د'],
                    ['#SR-' . self::pick($quarter, '10490', '20625', '30909', '41258'), 'الأنظمة الأكاديمية', 'عالية', 'مغلقة', 'خطأ في عرض الجدول الدراسي', '01س 12د'],
                    ['#SR-' . self::pick($quarter, '10493', '20628', '30912', '41261'), 'إدارة الشبكات والاتصالات', 'عالية', 'مغلقة', 'انقطاع شبكة في مبنى كلية الهندسة', '00س 52د'],
                    ['#SR-' . self::pick($quarter, '10498', '20633', '30917', '41266'), 'فريق البنية التحتية', 'منخفضة', 'بانتظار المعالجة', 'طلب توسعة مساحة تخزين', '06س 30د'],
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
            ['name' => 'عمادة القبول والتسجيل',    'count' => (int) round(980 * $f), 'rate' => self::pick($quarter, 74, 68, 82, 77)],
            ['name' => 'عمادة شؤون الطلاب',         'count' => (int) round(760 * $f), 'rate' => self::pick($quarter, 81, 75, 88, 83)],
            ['name' => 'الإدارة العامة للخدمات',    'count' => (int) round(640 * $f), 'rate' => self::pick($quarter, 69, 62, 79, 72)],
            ['name' => 'عمادة تقنية المعلومات',     'count' => (int) round(560 * $f), 'rate' => self::pick($quarter, 88, 84, 92, 90)],
            ['name' => 'الشؤون المالية',            'count' => (int) round(470 * $f), 'rate' => self::pick($quarter, 72, 65, 80, 74)],
            ['name' => 'عمادة شؤون أعضاء التدريس',  'count' => (int) round(380 * $f), 'rate' => self::pick($quarter, 85, 79, 90, 86)],
            ['name' => 'الإسكان الجامعي',           'count' => (int) round(310 * $f), 'rate' => self::pick($quarter, 58, 51, 67, 61)],
            ['name' => 'النقل والمواصلات',          'count' => (int) round(240 * $f), 'rate' => self::pick($quarter, 64, 57, 73, 67)],
        ];

        return [
            'kpis' => [
                ['label' => 'إجمالي الطلبات',       'value' => number_format($total),       'unit' => 'طلب', 'hint' => 'استفسار ' . number_format($types[0]) . ' · اقتراح ' . number_format($types[1]) . ' · شكوى ' . number_format($types[2]), 'tone' => 'violet'],
                ['label' => 'تم الرد',              'value' => number_format($responded),   'unit' => 'طلب', 'hint' => 'أُغلقت بردّ إداري معتمد', 'tone' => 'green'],
                ['label' => 'بانتظار الرد',         'value' => number_format($pending),     'unit' => 'طلب', 'hint' => 'مفتوحة تتجاوز 48 ساعة', 'tone' => 'amber'],
                ['label' => 'نسبة الرد',            'value' => $responseRate . '%',         'unit' => '', 'hint' => number_format($responded) . ' من ' . number_format($total), 'tone' => 'blue'],
                ['label' => 'متوسط وقت الاستجابة',  'value' => self::pick($quarter, '2.4 يوم', '3.1 يوم', '1.8 يوم', '2.2 يوم'), 'unit' => '', 'hint' => 'من تسجيل الطلب حتى أول رد', 'tone' => 'slate'],
            ],
            'charts' => [
                ['id' => 'cp-types', 'type' => 'pie', 'title' => 'توزيع أنواع الطلبات', 'subtitle' => 'استفسار · اقتراح · شكوى',
                 'data' => ['labels' => ['استفسار', 'اقتراح', 'شكوى'],
                            'datasets' => [['data' => $types, 'backgroundColor' => ['#1B8354', '#6CE9A6', '#B42318']]]]],
                ['id' => 'cp-response', 'type' => 'doughnut', 'title' => 'نسبة الرد على الطلبات', 'subtitle' => 'تم الرد مقابل بدون رد',
                 'data' => ['labels' => ['تم الرد', 'بدون رد'],
                            'datasets' => [['data' => [$responded, $pending], 'backgroundColor' => ['#1B8354', '#CBD5E1']]]]],
                ['id' => 'cp-depts', 'type' => 'horizontalBar', 'title' => 'التوزيع حسب الإدارة', 'subtitle' => 'أعلى 8 إدارات من حيث حجم الطلبات',
                 'data' => ['labels' => array_column($depts, 'name'),
                            'datasets' => [['label' => 'طلبات', 'data' => array_column($depts, 'count'), 'backgroundColor' => '#7C3AED']]]],
                ['id' => 'cp-deptrate', 'type' => 'horizontalBar', 'title' => 'نسبة الرد حسب الإدارة', 'subtitle' => 'النسبة المئوية للطلبات المُجاب عليها',
                 'data' => ['labels' => array_column($depts, 'name'),
                            'datasets' => [['label' => 'نسبة الرد %', 'data' => array_column($depts, 'rate'), 'backgroundColor' => '#0891B2']]]],
                ['id' => 'cp-typebydept', 'type' => 'stackedBar', 'title' => 'نوع الطلب حسب الإدارة', 'subtitle' => 'توزيع الاستفسار/الاقتراح/الشكوى', 'full' => true,
                 'data' => ['labels' => array_column($depts, 'name'),
                            'datasets' => [
                                ['label' => 'استفسار', 'data' => self::scale([520, 410, 330, 360, 240, 210, 150, 130], $f), 'backgroundColor' => '#1B8354'],
                                ['label' => 'اقتراح', 'data' => self::scale([260, 210, 180, 120, 130, 110, 90, 60], $f), 'backgroundColor' => '#6CE9A6'],
                                ['label' => 'شكوى', 'data' => self::scale([200, 140, 130, 80, 100, 60, 70, 50], $f), 'backgroundColor' => '#B42318'],
                            ]]],
                ['id' => 'cp-keywords', 'type' => 'horizontalBar', 'title' => 'أكثر الكلمات تكراراً', 'subtitle' => 'مستخرجة من نص الطلبات',
                 'data' => ['labels' => ['البطاقة', 'التسجيل', 'الجدول', 'الرسوم', 'الإسكان', 'القبول', 'البريد', 'المنحة', 'الحذف', 'الإضافة'],
                            'datasets' => [['label' => 'تكرار', 'data' => self::scale([420, 380, 310, 280, 240, 220, 190, 160, 140, 120], $f), 'backgroundColor' => '#9333EA']]]],
            ],
            'table' => [
                'title' => 'أحدث الشكاوى والمقترحات',
                'columns' => ['النوع', 'الإدارة', 'التصنيف الفرعي', 'ملاحظة الموظف', 'الرد'],
                'rows' => [
                    ['شكوى', 'عمادة القبول والتسجيل', 'إصدار البطاقة الجامعية', 'تمت إحالة الطلب لقسم الإصدار', 'تم الرد'],
                    ['اقتراح', 'عمادة شؤون الطلاب', 'الأنشطة الطلابية', 'مقترح قيد الدراسة من اللجنة', 'بدون رد'],
                    ['استفسار', 'الشؤون المالية', 'الرسوم الدراسية', 'تم توضيح آلية السداد للطالب', 'تم الرد'],
                    ['شكوى', 'الإسكان الجامعي', 'صيانة الوحدات السكنية', 'تم فتح بلاغ صيانة عاجل', 'تم الرد'],
                    ['اقتراح', 'عمادة تقنية المعلومات', 'تطبيق MyQU', 'تمت إضافة المقترح لخارطة الطريق', 'تم الرد'],
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
            ['name' => 'الخدمات الإلكترونية',        'rate' => self::pick($quarter, 96, 97, 94, 95)],
            ['name' => 'المكتبة المركزية',           'rate' => self::pick($quarter, 92, 93, 90, 91)],
            ['name' => 'القبول والتسجيل',            'rate' => self::pick($quarter, 88, 90, 85, 87)],
            ['name' => 'الدعم الأكاديمي',            'rate' => self::pick($quarter, 85, 87, 82, 84)],
            ['name' => 'المطاعم والتغذية',           'rate' => self::pick($quarter, 79, 81, 74, 77)],
            ['name' => 'النقل والمواصلات',           'rate' => self::pick($quarter, 71, 73, 66, 69)],
            ['name' => 'الإسكان الطلابي',            'rate' => self::pick($quarter, 62, 65, 55, 60)],
            ['name' => 'مواقف السيارات',             'rate' => self::pick($quarter, 54, 57, 48, 52)],
        ];

        return [
            'kpis' => [
                ['label' => 'إجمالي التقييمات',     'value' => number_format($total),     'unit' => 'تقييم', 'hint' => 'موزّعة على 59 خدمة جامعية', 'tone' => 'blue'],
                ['label' => 'نسبة الرضا الكلية',    'value' => $satisfaction . '%',       'unit' => '', 'hint' => 'راضٍ + راضٍ جداً', 'tone' => 'green'],
                ['label' => 'راضٍ جداً',            'value' => number_format($dist[0]),   'unit' => 'تقييم', 'hint' => round($dist[0] / $total * 100, 1) . '% من الإجمالي', 'tone' => 'green'],
                ['label' => 'محايد + غير راضٍ',     'value' => number_format($dist[2] + $dist[3]), 'unit' => 'تقييم', 'hint' => 'محايد ' . number_format($dist[2]) . ' · غير راضٍ ' . number_format($dist[3]), 'tone' => 'amber'],
                ['label' => 'خدمات بنسبة 100%',     'value' => $perfect,                  'unit' => 'خدمة', 'hint' => 'رضا تام دون أي ملاحظة سلبية', 'tone' => 'violet'],
            ],
            'charts' => [
                ['id' => 'se-dist', 'type' => 'doughnut', 'title' => 'التوزيع الكلي للتقييمات', 'subtitle' => 'أربعة مستويات رضا',
                 'data' => ['labels' => ['راضٍ جداً', 'راضٍ', 'محايد', 'غير راضٍ'],
                            'datasets' => [['data' => $dist, 'backgroundColor' => ['#054F31', '#1B8354', '#6CE9A6', '#FECDCA']]]]],
                ['id' => 'se-category', 'type' => 'pie', 'title' => 'توزيع الفئات', 'subtitle' => 'مبسّط — راضٍ / محايد / غير راضٍ',
                 'data' => ['labels' => ['راضٍ', 'محايد', 'غير راضٍ'],
                            'datasets' => [['data' => [$dist[0] + $dist[1], $dist[2], $dist[3]], 'backgroundColor' => ['#1B8354', '#6CE9A6', '#B42318']]]]],
                ['id' => 'se-byservice', 'type' => 'horizontalBar', 'title' => 'نسبة الرضا حسب الخدمة', 'subtitle' => 'أعلى وأدنى الخدمات أداءً',
                 'data' => ['labels' => array_column($services, 'name'),
                            'datasets' => [['label' => 'نسبة الرضا %', 'data' => array_column($services, 'rate'), 'backgroundColor' => '#0891B2']]]],
                ['id' => 'se-topservices', 'type' => 'stackedBar', 'title' => 'أكثر الخدمات تقييماً', 'subtitle' => 'حجم الاستخدام موزّع على مستويات الرضا', 'full' => true,
                 'data' => ['labels' => ['الخدمات الإلكترونية', 'المكتبة المركزية', 'القبول والتسجيل', 'الدعم الأكاديمي', 'المطاعم والتغذية', 'النقل والمواصلات'],
                            'datasets' => [
                                ['label' => 'راضٍ جداً', 'data' => self::scale([1340, 980, 870, 720, 540, 410], $f), 'backgroundColor' => '#054F31'],
                                ['label' => 'راضٍ', 'data' => self::scale([620, 540, 480, 420, 360, 300], $f), 'backgroundColor' => '#1B8354'],
                                ['label' => 'محايد', 'data' => self::scale([180, 210, 240, 260, 320, 290], $f), 'backgroundColor' => '#6CE9A6'],
                                ['label' => 'غير راضٍ', 'data' => self::scale([60, 90, 130, 160, 240, 280], $f), 'backgroundColor' => '#B42318'],
                            ]]],
                ['id' => 'se-trend', 'type' => 'line', 'title' => 'اتجاه نسبة الرضا', 'subtitle' => 'متوسط شهري خلال الربع', 'full' => true,
                 'data' => ['labels' => $months,
                            'datasets' => [['label' => 'نسبة الرضا %', 'data' => self::pick($quarter, [83, 84, 86], [85, 87, 88], [78, 79, 81], [82, 83, 84]), 'borderColor' => '#0891B2', 'backgroundColor' => 'rgba(8,145,178,0.12)', 'fill' => true, 'tension' => 0.4]]]],
            ],
            'table' => [
                'title' => 'ترتيب الخدمات حسب نسبة الرضا',
                'columns' => ['#', 'الخدمة', 'راضٍ جداً', 'راضٍ', 'محايد', 'غير راضٍ', 'نسبة الرضا'],
                'rows' => array_map(function ($s, $i) use ($f) {
                    $vs = (int) round((220 - $i * 18) * $f);
                    $sa = (int) round((140 - $i * 10) * $f);
                    $ne = (int) round((20 + $i * 9) * $f);
                    $di = (int) round((6 + $i * 11) * $f);
                    return [$i + 1, $s['name'], number_format($vs), number_format($sa), number_format($ne), number_format($di), $s['rate'] . '%'];
                }, array_slice([
                    ['name' => 'الخدمات الإلكترونية', 'rate' => 96],
                    ['name' => 'المكتبة المركزية', 'rate' => 92],
                    ['name' => 'القبول والتسجيل', 'rate' => 88],
                    ['name' => 'الدعم الأكاديمي', 'rate' => 85],
                    ['name' => 'الإسكان الطلابي', 'rate' => 62],
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
        $platformLabels = ['وسائل التواصل', 'خرائط قوقل', 'آب ستور', 'قوقل بلاي', 'Reddit', 'يوتيوب', 'أخبار'];

        // 30-day sentiment trend (compressed to 10 points)
        $days = array_map(fn ($i) => (($i * 3) + 1), range(0, 9));
        $dayLabels = array_map(fn ($d) => 'يوم ' . $d, $days);

        return [
            'kpis' => [
                ['label' => 'إجمالي التقييمات',  'value' => number_format($total),  'unit' => 'تقييم', 'hint' => 'تم تحليلها بالكامل آلياً', 'tone' => 'amber'],
                ['label' => 'متوسط التقييم',     'value' => $avgRating . ' / 5',    'unit' => '', 'hint' => 'موزون عبر كل المنصات', 'tone' => 'green'],
                ['label' => 'نسبة الرضا',        'value' => $satisfaction . '%',    'unit' => '', 'hint' => 'إيجابي ' . number_format($sentiment[0]) . ' · سلبي ' . number_format($sentiment[1]), 'tone' => 'blue'],
                ['label' => 'المنصات النشطة',    'value' => 7,                      'unit' => 'منصة', 'hint' => 'تواصل · خرائط · متاجر · أخبار', 'tone' => 'violet'],
            ],
            'charts' => [
                ['id' => 'rv-sentiment', 'type' => 'pie', 'title' => 'توزيع المشاعر', 'subtitle' => 'إيجابي · سلبي · محايد',
                 'data' => ['labels' => ['إيجابي', 'سلبي', 'محايد'],
                            'datasets' => [['data' => $sentiment, 'backgroundColor' => ['#1B8354', '#B42318', '#94A3B8']]]]],
                ['id' => 'rv-language', 'type' => 'doughnut', 'title' => 'التقييمات حسب اللغة', 'subtitle' => 'العربية مقابل الإنجليزية',
                 'data' => ['labels' => ['العربية', 'الإنجليزية', 'أخرى'],
                            'datasets' => [['data' => self::scale([3640, 1380, 220], $f), 'backgroundColor' => ['#D97706', '#FBBF24', '#FDE68A']]]]],
                ['id' => 'rv-platforms', 'type' => 'bar', 'title' => 'توزيع المنصات', 'subtitle' => 'حجم التقييمات لكل منصة',
                 'data' => ['labels' => $platformLabels,
                            'datasets' => [['label' => 'تقييمات', 'data' => $platforms, 'backgroundColor' => '#D97706']]]],
                ['id' => 'rv-stars', 'type' => 'bar', 'title' => 'توزيع التقييمات بالنجوم', 'subtitle' => 'حسب متاجر التطبيقات والخرائط',
                 'data' => ['labels' => ['★', '★★', '★★★', '★★★★', '★★★★★'],
                            'datasets' => [
                                ['label' => 'خرائط قوقل', 'data' => self::scale([90, 110, 180, 360, 580], $f), 'backgroundColor' => '#B42318'],
                                ['label' => 'آب ستور', 'data' => self::scale([60, 80, 140, 300, 400], $f), 'backgroundColor' => '#F79009'],
                                ['label' => 'قوقل بلاي', 'data' => self::scale([70, 90, 130, 240, 210], $f), 'backgroundColor' => '#1B8354'],
                            ]]],
                ['id' => 'rv-trend', 'type' => 'line', 'title' => 'اتجاه المشاعر خلال الربع', 'subtitle' => 'إيجابي · محايد · سلبي', 'full' => true,
                 'data' => ['labels' => $dayLabels,
                            'datasets' => [
                                ['label' => 'إيجابي', 'data' => self::scale([280, 300, 290, 320, 340, 330, 360, 350, 370, 380], $f), 'borderColor' => '#1B8354', 'backgroundColor' => 'rgba(27,131,84,0.10)', 'fill' => true, 'tension' => 0.4],
                                ['label' => 'محايد', 'data' => self::scale([90, 100, 95, 110, 105, 115, 100, 120, 110, 115], $f), 'borderColor' => '#94A3B8', 'backgroundColor' => 'rgba(148,163,184,0.10)', 'fill' => true, 'tension' => 0.4],
                                ['label' => 'سلبي', 'data' => self::scale([120, 110, 130, 100, 115, 95, 105, 90, 100, 85], $f), 'borderColor' => '#B42318', 'backgroundColor' => 'rgba(180,35,24,0.10)', 'fill' => true, 'tension' => 0.4],
                            ]]],
                ['id' => 'rv-platsentiment', 'type' => 'stackedBar', 'title' => 'المشاعر حسب المنصة الرئيسية', 'subtitle' => 'توزيع المشاعر داخل كل منصة', 'full' => true,
                 'data' => ['labels' => ['وسائل التواصل', 'خرائط قوقل', 'آب ستور', 'قوقل بلاي'],
                            'datasets' => [
                                ['label' => 'إيجابي', 'data' => self::scale([1100, 820, 640, 490], $f), 'backgroundColor' => '#1B8354'],
                                ['label' => 'محايد', 'data' => self::scale([380, 300, 180, 130], $f), 'backgroundColor' => '#94A3B8'],
                                ['label' => 'سلبي', 'data' => self::scale([360, 200, 160, 120], $f), 'backgroundColor' => '#B42318'],
                            ]]],
                ['id' => 'rv-topics', 'type' => 'horizontalBar', 'title' => 'أكثر المواضيع ذكراً', 'subtitle' => 'مستخرجة من نص المراجعات',
                 'data' => ['labels' => ['القبول والتسجيل', 'تطبيق MyQU', 'المرافق', 'أعضاء هيئة التدريس', 'المواقف', 'الرسوم', 'البريد الجامعي', 'الفعاليات'],
                            'datasets' => [['label' => 'إشارة', 'data' => self::scale([520, 460, 380, 340, 290, 240, 200, 160], $f), 'backgroundColor' => '#B45309']]]],
            ],
            'table' => [
                'title' => 'أحدث التقييمات السلبية',
                'columns' => ['المنصة', 'المحتوى', 'التقييم', 'التاريخ'],
                'rows' => [
                    ['خرائط قوقل', 'تجربة القبول كانت محبطة، الموقع يطلب نفس البيانات في كل خطوة', '★★', self::pick($quarter, '2025-02-18', '2025-05-09', '2025-08-21', '2025-11-12')],
                    ['آب ستور', 'التطبيق يرسل إشعارات متكررة ومتأخرة عن موعدها', '★★', self::pick($quarter, '2025-03-04', '2025-04-27', '2025-09-03', '2025-12-01')],
                    ['وسائل التواصل', 'الرد على الاستفسارات في المنصات بطيء جداً', '★', self::pick($quarter, '2025-01-29', '2025-06-11', '2025-07-19', '2025-10-22')],
                    ['قوقل بلاي', 'صعوبة في تسجيل الدخول الموحّد بعد آخر تحديث', '★★', self::pick($quarter, '2025-02-25', '2025-05-30', '2025-08-08', '2025-11-28')],
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
        $dayLabels = array_map(fn ($i) => 'يوم ' . (($i * 2) + 1), range(0, 6));

        return [
            'kpis' => [
                ['label' => 'إجمالي الزيارات',     'value' => number_format($sessions),    'unit' => 'جلسة', 'hint' => 'بشري ' . number_format($humans) . ' · بوت ' . number_format($bots), 'tone' => 'green'],
                ['label' => 'المستخدمون الفريدون', 'value' => number_format($uniqueUsers), 'unit' => 'مستخدم', 'hint' => 'موزّعون على 3 منصات', 'tone' => 'blue'],
                ['label' => 'متوسط التفاعل',       'value' => $engagement . '%',           'unit' => '', 'hint' => 'متوسط 3.4 صفحة لكل جلسة', 'tone' => 'violet'],
                ['label' => 'مؤشر الإحباط',        'value' => $friction,                   'unit' => '/ 100', 'hint' => 'نقرات غاضبة · ميتة · عودة سريعة', 'tone' => 'red'],
            ],
            'charts' => [
                ['id' => 'cl-trend', 'type' => 'line', 'title' => 'اتجاه الزيارات اليومية', 'subtitle' => 'آخر 14 يوم — حسب المنصة', 'full' => true,
                 'data' => ['labels' => $dayLabels,
                            'datasets' => [
                                ['label' => $projects[0], 'data' => self::scale([4200, 4400, 4100, 4600, 4800, 4700, 5000], $f), 'borderColor' => '#054F31', 'backgroundColor' => 'rgba(5,79,49,0.10)', 'fill' => true, 'tension' => 0.4],
                                ['label' => $projects[1], 'data' => self::scale([6800, 7100, 6900, 7400, 7600, 7300, 7800], $f), 'borderColor' => '#1B8354', 'backgroundColor' => 'rgba(27,131,84,0.10)', 'fill' => true, 'tension' => 0.4],
                                ['label' => $projects[2], 'data' => self::scale([3100, 3300, 3000, 3500, 3700, 3600, 3900], $f), 'borderColor' => '#6CE9A6', 'backgroundColor' => 'rgba(108,233,166,0.12)', 'fill' => true, 'tension' => 0.4],
                            ]]],
                ['id' => 'cl-comparison', 'type' => 'bar', 'title' => 'مقارنة الزيارات والمستخدمين', 'subtitle' => 'بين المنصات الثلاث',
                 'data' => ['labels' => $projects,
                            'datasets' => [
                                ['label' => 'إجمالي الزيارات', 'data' => self::scale([58000, 92000, 34000], $f), 'backgroundColor' => '#1B8354'],
                                ['label' => 'جلسات بشرية', 'data' => self::scale([50000, 79000, 29000], $f), 'backgroundColor' => '#6CE9A6'],
                                ['label' => 'المستخدمون الفريدون', 'data' => self::scale([31000, 48000, 17000], $f), 'backgroundColor' => '#94A3B8'],
                            ]]],
                ['id' => 'cl-friction', 'type' => 'radar', 'title' => 'مؤشرات الإحباط حسب المنصة', 'subtitle' => 'كلما اتسع الشكل زاد الاحتكاك',
                 'data' => ['labels' => ['نقرات ميتة', 'نقرات الغضب', 'عودة سريعة', 'تمرير زائد', 'أخطاء سكربت'],
                            'datasets' => [
                                ['label' => $projects[0], 'data' => self::scale([42, 38, 30, 26, 18], self::pick($quarter, 1.0, 0.9, 1.15, 0.97)), 'borderColor' => '#054F31', 'backgroundColor' => 'rgba(5,79,49,0.15)'],
                                ['label' => $projects[1], 'data' => self::scale([28, 24, 35, 40, 22], self::pick($quarter, 1.0, 0.9, 1.15, 0.97)), 'borderColor' => '#1B8354', 'backgroundColor' => 'rgba(27,131,84,0.15)'],
                                ['label' => $projects[2], 'data' => self::scale([20, 18, 26, 30, 14], self::pick($quarter, 1.0, 0.9, 1.15, 0.97)), 'borderColor' => '#6CE9A6', 'backgroundColor' => 'rgba(108,233,166,0.18)'],
                            ]]],
                ['id' => 'cl-engagement', 'type' => 'bar', 'title' => 'مؤشرات التفاعل والتصفح', 'subtitle' => 'نسبة التفاعل وعمق التمرير لكل منصة',
                 'data' => ['labels' => $projects,
                            'datasets' => [
                                ['label' => 'نسبة التفاعل %', 'data' => self::pick($quarter, [58, 67, 54], [61, 70, 57], [52, 62, 49], [56, 65, 52]), 'backgroundColor' => '#1B8354'],
                                ['label' => 'عمق التمرير %', 'data' => self::pick($quarter, [64, 72, 60], [67, 75, 63], [58, 68, 55], [62, 70, 58]), 'backgroundColor' => '#6CE9A6'],
                            ]]],
                ['id' => 'cl-botvshuman', 'type' => 'stackedBar', 'title' => 'الجلسات البشرية مقابل البوتات', 'subtitle' => 'لكل منصة',
                 'data' => ['labels' => $projects,
                            'datasets' => [
                                ['label' => 'بشري', 'data' => self::scale([50000, 79000, 29000], $f), 'backgroundColor' => '#1B8354'],
                                ['label' => 'بوتات', 'data' => self::scale([8000, 13000, 5000], $f), 'backgroundColor' => '#CBD5E1'],
                            ]]],
                ['id' => 'cl-devices', 'type' => 'stackedBar', 'title' => 'توزيع الأجهزة حسب المنصة', 'subtitle' => 'حاسب · جوال · لوحي · أخرى',
                 'data' => ['labels' => $projects,
                            'datasets' => [
                                ['label' => 'حاسب', 'data' => self::scale([34000, 28000, 12000], $f), 'backgroundColor' => '#054F31'],
                                ['label' => 'جوال', 'data' => self::scale([20000, 56000, 19000], $f), 'backgroundColor' => '#1B8354'],
                                ['label' => 'لوحي', 'data' => self::scale([3000, 6000, 2500], $f), 'backgroundColor' => '#6CE9A6'],
                                ['label' => 'أخرى', 'data' => self::scale([1000, 2000, 500], $f), 'backgroundColor' => '#CBD5E1'],
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
        $tagLabels = ['منفّذة', 'قيد التنفيذ', 'مخطّطة', 'لن تُنفّذ', 'غير مصنّفة'];
        $total = self::sum($tags);
        $published = (int) round($total * 0.86);
        $untagged = $tags[4];
        $reactions = (int) round(48200 * $f);
        $avgReactions = $total > 0 ? round($reactions / $total, 1) : 0;

        $months = self::months($quarter);

        return [
            'kpis' => [
                ['label' => 'إجمالي الأفكار',      'value' => number_format($total),      'unit' => 'فكرة', 'hint' => 'مقدّمة عبر بوابة MyQU للآراء', 'tone' => 'green'],
                ['label' => 'منشورة للجميع',       'value' => number_format($published),  'unit' => 'فكرة', 'hint' => round($published / $total * 100) . '% من الإجمالي', 'tone' => 'blue'],
                ['label' => 'غير مصنّفة',          'value' => number_format($untagged),   'unit' => 'فكرة', 'hint' => 'بانتظار التصنيف الإداري', 'tone' => 'amber'],
                ['label' => 'إجمالي التفاعلات',    'value' => number_format($reactions),  'unit' => 'تفاعل', 'hint' => 'متوسط ' . $avgReactions . ' تفاعل لكل فكرة', 'tone' => 'violet'],
            ],
            'charts' => [
                ['id' => 'fb-tags', 'type' => 'doughnut', 'title' => 'توزيع التصنيفات الإدارية', 'subtitle' => 'حالة كل فكرة في خارطة الطريق',
                 'data' => ['labels' => $tagLabels,
                            'datasets' => [['data' => $tags, 'backgroundColor' => ['#054F31', '#1B8354', '#6CE9A6', '#B42318', '#CBD5E1']]]]],
                ['id' => 'fb-status', 'type' => 'bar', 'title' => 'حالة المراجعة على المنصة', 'subtitle' => 'منشور · قيد المراجعة · مرفوض',
                 'data' => ['labels' => ['منشور للجميع', 'قيد المراجعة', 'مرفوض'],
                            'datasets' => [['label' => 'عدد الآراء', 'data' => self::scale([1040, 160, 40], $f), 'backgroundColor' => ['#1B8354', '#F79009', '#B42318']]]]],
                ['id' => 'fb-tagreactions', 'type' => 'bar', 'title' => 'متوسط التفاعل لكل تصنيف', 'subtitle' => 'أي التصنيفات تستقطب أكثر',
                 'data' => ['labels' => $tagLabels,
                            'datasets' => [['label' => 'متوسط تفاعل/رأي', 'data' => self::pick($quarter, [62, 48, 71, 22, 38], [70, 54, 78, 25, 44], [55, 41, 63, 19, 33], [60, 46, 68, 21, 37]), 'backgroundColor' => '#7C3AED']]]],
                ['id' => 'fb-trend', 'type' => 'line', 'title' => 'اتجاه إرسال الأفكار', 'subtitle' => 'عدد الأفكار المقدّمة شهرياً', 'full' => true,
                 'data' => ['labels' => $months,
                            'datasets' => [['label' => 'أفكار مقدّمة', 'data' => self::scale([380, 420, 440], $f), 'borderColor' => '#1B8354', 'backgroundColor' => 'rgba(27,131,84,0.12)', 'fill' => true, 'tension' => 0.4]]]],
                ['id' => 'fb-topics', 'type' => 'horizontalBar', 'title' => 'أكثر المواضيع ذكراً', 'subtitle' => 'مستخرجة من نص الأفكار',
                 'data' => ['labels' => ['ساعات المكتبة', 'المواقف', 'تطبيق MyQU', 'المطاعم', 'القاعات الدراسية', 'الفعاليات', 'النقل', 'الخدمات الإلكترونية'],
                            'datasets' => [['label' => 'تكرار', 'data' => self::scale([180, 150, 140, 120, 100, 90, 70, 60], $f), 'backgroundColor' => '#9333EA']]]],
            ],
            'table' => [
                'title' => 'أعلى الأفكار تفاعلاً',
                'columns' => ['الفكرة', 'التصنيف', 'التفاعلات', 'الحالة'],
                'rows' => [
                    ['تمديد ساعات المكتبة المركزية خلال الاختبارات', 'مخطّطة', number_format((int) round(312 * $f)), 'منشور للجميع'],
                    ['إضافة دفع رسوم المواقف عبر تطبيق MyQU', 'قيد التنفيذ', number_format((int) round(254 * $f)), 'منشور للجميع'],
                    ['تطبيق نظام حجز قاعات للمجموعات الدراسية', 'مخطّطة', number_format((int) round(208 * $f)), 'منشور للجميع'],
                    ['تنويع خيارات المطاعم وإضافة وجبات صحية', 'منفّذة', number_format((int) round(186 * $f)), 'منشور للجميع'],
                    ['إشعارات أذكى للمواعيد النهائية للتسجيل', 'قيد التنفيذ', number_format((int) round(167 * $f)), 'منشور للجميع'],
                ],
            ],
        ];
    }
}
