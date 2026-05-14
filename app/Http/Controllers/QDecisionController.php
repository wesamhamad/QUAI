<?php

namespace App\Http\Controllers;

use App\Support\DecisionDashboards;
use Illuminate\Http\Request;

class QDecisionController extends Controller
{
    /**
     * The six decision dashboards, keyed by URL slug.
     * Each maps to a DecisionDashboards data key + a sections() id + sidebar metadata.
     */
    public const DASHBOARDS = [
        'service-tasks' => [
            'data' => 'serviceTasks',
            'title' => 'لوحة مهام تقنية المعلومات (نظام ساعد)',
            'accent' => '#1B8354',
            'icon' => 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
        ],
        'complaints' => [
            'data' => 'complaints',
            'title' => 'لوحة الشكاوى والمقترحات',
            'accent' => '#7C3AED',
            'icon' => 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
        ],
        'service-evaluations' => [
            'data' => 'serviceEvaluations',
            'title' => 'لوحة تقييم الخدمات',
            'accent' => '#0891B2',
            'icon' => 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11',
        ],
        'reviews' => [
            'data' => 'reviews',
            'title' => 'لوحة التقييمات الخارجية',
            'accent' => '#D97706',
            'icon' => 'M11.05 3.69l2.36 4.78 5.27.77a1 1 0 01.56 1.7l-3.82 3.72.9 5.25a1 1 0 01-1.45 1.06L9.99 18.5l-4.72 2.48a1 1 0 01-1.45-1.06l.9-5.25-3.82-3.72a1 1 0 01.56-1.7l5.27-.77 2.36-4.78a1 1 0 011.79 0z',
        ],
        'clarity' => [
            'data' => 'clarity',
            'title' => 'لوحة Microsoft Clarity',
            'accent' => '#1B8354',
            'icon' => 'M3 13h2l2 5 4-13 3 8 2-4h5',
        ],
        'feedback' => [
            'data' => 'feedback',
            'title' => 'لوحة الأفكار — تطبيق MyQU',
            'accent' => '#1B8354',
            'icon' => 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
        ],
    ];

    /**
     * Ordered catalogue for the sidebar "Dashboards" group (recommendations first).
     * Each item ships a resolved url + active flag so the Blade partial needs no logic.
     */
    public static function dashboardCatalog(): array
    {
        $currentSlug = request()->route('dashboard');

        $catalog = [[
            'url' => route('q-decision.recommendations'),
            'title' => 'توصيات الذكاء الاصطناعي',
            'icon' => 'M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.5 4.5L19 9l-4.5 1.5L13 15l-1.5-4.5L7 9l4.5-1.5L13 3z',
            'active' => request()->routeIs('q-decision.recommendations'),
        ]];

        foreach (self::DASHBOARDS as $slug => $meta) {
            $catalog[] = [
                'url' => route('q-decision.dashboard', ['dashboard' => $slug]),
                'title' => $meta['title'],
                'icon' => $meta['icon'],
                'active' => request()->routeIs('q-decision.dashboard') && $currentSlug === $slug,
            ];
        }

        return $catalog;
    }

    public function recommendations(Request $request)
    {
        $quarter = DecisionDashboards::normalizeQuarter($request->query('q'));

        return view('q-decision.recommendations', [
            'priorityMeta'  => self::priorityMeta(),
            'sections'      => $this->sections(),
            'quarters'      => DecisionDashboards::quarters(),
            'activeQuarter' => $quarter,
        ]);
    }

    public function dashboard(Request $request, string $dashboard)
    {
        abort_unless(isset(self::DASHBOARDS[$dashboard]), 404);

        $quarter = DecisionDashboards::normalizeQuarter($request->query('q'));
        $meta = self::DASHBOARDS[$dashboard];
        $data = DecisionDashboards::all($quarter)[$meta['data']];
        $section = collect($this->sections())->firstWhere('id', $dashboard);

        return view('q-decision.dashboard', [
            'priorityMeta'  => self::priorityMeta(),
            'dashboardSlug' => $dashboard,
            'meta'          => $meta,
            'data'          => $data,
            'section'       => $section,
            'quarters'      => DecisionDashboards::quarters(),
            'activeQuarter' => $quarter,
        ]);
    }

    public function digitalAdvisor(Request $request)
    {
        return view('q-decision.digital-advisor', [
            'providerName' => 'QU LLM Assistant',
            'demoAgents'   => $this->demoAgents(),
        ]);
    }

    public static function priorityMeta(): array
    {
        return [
            'urgent'    => ['label' => 'عاجل',      'color' => '#B42318', 'bg' => '#FEE4E2', 'description' => 'يتطلب إجراءً خلال هذا الأسبوع'],
            'proactive' => ['label' => 'استباقي',   'color' => '#B54708', 'bg' => '#FEF0C7', 'description' => 'تحسين متوسط الأمد لمنع المشكلة قبل تكرارها'],
            'strategic' => ['label' => 'استراتيجي', 'color' => '#027A48', 'bg' => '#D1FADF', 'description' => 'توجه طويل المدى أو فرصة نضج تشغيلي'],
        ];
    }

    /** Public accessor for the recommendation sections (used by the Filament dashboard pages). */
    public static function recommendationSections(): array
    {
        return (new self())->sections();
    }

    private function sections(): array
    {
        return [
            ['id' => 'service-tasks', 'dashboard' => 'لوحة مهام تقنية المعلومات (نظام ساعد)', 'accent' => '#1B8354',
             'subtitle' => 'مشتق من بيانات ServiceNow — الأولوية، SLA، توزيع الفرق، ساعات الذروة',
             'recommendations' => $this->recsServiceTasks()],
            ['id' => 'complaints', 'dashboard' => 'لوحة الشكاوى والمقترحات', 'accent' => '#7C3AED',
             'subtitle' => 'مشتق من تصنيف الطلبات، حالة الرد الإداري، وحجم الاستفسارات مقابل الشكاوى',
             'recommendations' => $this->recsComplaints()],
            ['id' => 'service-evaluations', 'dashboard' => 'لوحة تقييم الخدمات', 'accent' => '#0891B2',
             'subtitle' => 'مشتق من توزيع التقييمات، أدنى الخدمات أداءً، وحجم الملاحظات النصية',
             'recommendations' => $this->recsServiceEvaluations()],
            ['id' => 'reviews', 'dashboard' => 'لوحة التقييمات الخارجية', 'accent' => '#D97706',
             'subtitle' => 'مشتق من Google Maps، App Store، Google Play، ووسائل التواصل الاجتماعي',
             'recommendations' => $this->recsReviews()],
            ['id' => 'clarity', 'dashboard' => 'لوحة Microsoft Clarity', 'accent' => '#1B8354',
             'subtitle' => 'مشتق من جلسات وتفاعلات Microsoft Clarity على faculty.qu.edu.sa، myqu.qu.edu.sa، www.qu.edu.sa',
             'recommendations' => $this->recsClarity()],
            ['id' => 'feedback', 'dashboard' => 'لوحة الأفكار — تطبيق MyQU', 'accent' => '#1B8354',
             'subtitle' => 'مشتق من بوابة MyQU للآراء — التصنيف الإداري، التفاعلات، البلاغات',
             'recommendations' => $this->recsFeedback()],
        ];
    }

    private function recsServiceTasks(): array
    {
        return [
            ['priority' => 'urgent', 'metric' => '23% تأخير',
             'title'       => 'تجاوز SLA على أولوية عالية (مهام تشغيلية)',
             'observation' => 'سُجِّلت 47 مهمة متجاوزة لحد الـ SLA من أصل 204 مهمة بأولوية عالية خلال آخر 30 يوماً (23% تأخير). متوسط التأخر: 6.4 ساعات بعد الحد.',
             'action'      => 'إعادة توزيع طلبات الفترة المسائية على فريق ثانٍ وتفعيل تنبيه مبكر عند بلوغ 70% من حد الـ SLA، مع مراجعة سببين تشغيليين متكررين (مزود الخدمة، نقص توثيق).',
             'impact'      => 'تخفيض نسبة التجاوز إلى أقل من 5% خلال أسبوعين، واستعادة ثقة الفرق المعتمدة على هذه الخدمات في توقيت الإنجاز.'],
            ['priority' => 'proactive', 'metric' => '94.6% التزام',
             'title'       => 'هامش تحسين بسيط في فئة "متوسطة (دعم فني)"',
             'observation' => 'نسبة الالتزام الإجمالية 94.6% (18 متأخرة من 334 مهمة). الفئة الأعلى في نسبة التأخير: "متوسطة (دعم فني)" بنسبة 7.8%.',
             'action'      => 'مراجعة الفئة الأعلى في نسبة التأخير وتحديد سببين تشغيليين متكررين لإغلاقهما خلال الربع.',
             'impact'      => 'دفع نسبة الالتزام لتلامس 99% بشكل ثابت، وتقليل التأخر المتبقي إلى حالات استثنائية يمكن شرحها.'],
            ['priority' => 'strategic', 'metric' => '+18% حجم',
             'title'       => 'ساعة الذروة 10ص — 12ظ تستحوذ على 34% من المهام',
             'observation' => 'تحليل التوزيع الساعي يُظهر أن نافذة 10ص — 12ظ تستوعب 34% من إجمالي المهام مقابل متوسط 17% لباقي الفترات.',
             'action'      => 'جدولة وردية مساعدة من 9:30ص حتى 12:30ظ خلال أيام الأحد والاثنين والثلاثاء فقط، بدلاً من توسيع التوظيف اليومي.',
             'impact'      => 'استيعاب الذروة دون زيادة في كلفة التوظيف، ورفع الإنتاجية في النافذة الأهم بحوالي 20%.'],
        ];
    }

    private function recsComplaints(): array
    {
        return [
            ['priority' => 'urgent', 'metric' => '38 شكوى',
             'title'       => 'ارتفاع شكاوى البطاقة الجامعية خلال آخر أسبوعين',
             'observation' => 'استقبلت بوابة الشكاوى 38 شكوى مرتبطة بإصدار البطاقة الجامعية خلال آخر 14 يوم، مقابل متوسط 9 شكاوى لنفس الفترة في الفصول السابقة.',
             'action'      => 'تشكيل فريق مشترك (عمادة شؤون الطلاب + الأمن + الجودة) لإغلاق دورة الإصدار خلال 5 أيام، ونشر دليل خطوات مرئي لـ Top-3 المشكلات الشائعة.',
             'impact'      => 'تقليل الشكاوى بنسبة 60% خلال أسبوعين، وتحرير 2-3 موظفين من الرد المتكرر على نفس الاستفسار.',
             'quote'       => ['body' => 'سجّلت طلب إصدار بطاقة من 12 يوم ولا في أي تحديث. اتصلت 3 مرات وكل مرة يقولوا لي نرجع نكلمك. الخدمة تحتاج تتطور.', 'author' => 'طالبة · كلية التربية', 'date' => '2026-05-05', 'reactions' => 142]],
            ['priority' => 'proactive', 'metric' => '47% غير مصنف',
             'title'       => 'نسبة الطلبات "غير المصنفة" مرتفعة',
             'observation' => '47% من البلاغات الواردة في آخر شهرين لم يتم تصنيفها إلى فئة (شكوى/استفسار/مقترح) قبل التوجيه، مما يطيل زمن أول رد بمعدل 1.8 يوم.',
             'action'      => 'تفعيل تصنيف تلقائي بكلمات مفتاحية + توجيه إلزامي للحقل قبل إرسال البلاغ، مع لوحة متابعة أسبوعية للجهات الأعلى في "غير مصنف".',
             'impact'      => 'خفض زمن أول رد بنسبة 30%، وتمكين تقارير دقيقة لاتجاهات الشكاوى الفعلية.'],
            ['priority' => 'strategic', 'metric' => '3:1 استفسار:شكوى',
             'title'       => 'فرصة بناء قاعدة معرفية ذاتية الخدمة',
             'observation' => 'نسبة الاستفسارات إلى الشكاوى الفعلية 3:1، أي أن ثلاثة أرباع الطلبات الواردة هي أسئلة قابلة للإجابة عبر مقالات معرفية.',
             'action'      => 'إطلاق قاعدة معرفية ذاتية الخدمة مرتبطة ببوابة MyQU، تغطي أعلى 20 استفساراً متكرراً، مع إعادة تقييم كل 90 يوم.',
             'impact'      => 'تقليل حجم الطلبات الواردة بنسبة 40% خلال ستة أشهر، وتوجيه طاقة الفريق نحو الشكاوى الفعلية.'],
        ];
    }

    private function recsServiceEvaluations(): array
    {
        return [
            ['priority' => 'urgent', 'metric' => '⭐ 2.4 / 5',
             'title'       => 'خدمة الإيواء الطلابي بأدنى تقييم — 2.4 نجوم',
             'observation' => 'متوسط تقييم خدمة الإيواء الطلابي 2.4/5 على آخر 312 تقييم، مقارنة بمتوسط جامعي عام 4.1/5. أبرز الملاحظات النصية: "بطء الصيانة"، "صعوبة التواصل".',
             'action'      => 'تخصيص مدير علاقات للخدمة وإنشاء قناة بلاغ مباشر، مع تقرير أسبوعي للإدارة العليا لمدة 8 أسابيع.',
             'impact'      => 'رفع متوسط التقييم إلى 3.6/5 على الأقل خلال الفصل، وإعادة بناء الثقة في خدمة طلابية أساسية.'],
            ['priority' => 'proactive', 'metric' => '67% بلا تعليق',
             'title'       => 'انخفاض معدل التعليق المكتوب على التقييمات',
             'observation' => '67% من المقيِّمين لم يتركوا أي تعليق نصي، مما يُضعف قدرة التحليل النوعي على فهم الأسباب الجذرية.',
             'action'      => 'إضافة سؤال مفتوح اختياري "ما الذي يمكن تحسينه؟" مع 3 خيارات سريعة قابلة للنقر تظهر بعد التقييم مباشرة.',
             'impact'      => 'مضاعفة حجم الملاحظات النصية، وإطلاق قراءات نوعية شهرية للفرق المعنية.'],
            ['priority' => 'strategic', 'metric' => '+12% رضا',
             'title'       => 'الخدمات الإلكترونية تتفوق على الحضورية',
             'observation' => 'متوسط رضا الخدمات الإلكترونية 4.3/5 مقابل 3.7/5 للحضورية، مع نية متابعة الخدمة عبر القناة الإلكترونية لدى 78% من الطلاب.',
             'action'      => 'استثمار إضافي في رقمنة 5 خدمات حضورية ذات حجم مرتفع وتقييم متوسط (التحويل، الاعتذار، التأجيل، الفرص، البدلاء).',
             'impact'      => 'رفع رضا الطلاب الكلي بنحو 12 نقطة، وتقليل الزحام والازدحام داخل العمادات.'],
        ];
    }

    private function recsReviews(): array
    {
        return [
            ['priority' => 'urgent', 'metric' => 'Google ⭐ 3.4',
             'title'       => 'هبوط متوسط Google Maps إلى 3.4 خلال آخر 14 يوماً',
             'observation' => 'سجلت صفحة الجامعة على Google Maps متوسطاً جديداً 3.4 (من 4.2 الشهر السابق) بسبب 28 تعليقاً سلبياً مرتبطاً بدوامات القبول.',
             'action'      => 'الرد العلني على التعليقات السلبية خلال 48 ساعة، وإطلاق صفحة "حالة الخدمة" لتوضيح أوقات الذروة في القبول.',
             'impact'      => 'استعادة متوسط 4.0+ خلال شهر، وتقليل دورة الانتشار السلبي على وسائل التواصل المرتبطة بنفس الموضوع.',
             'quote'       => ['body' => 'تجربة القبول كانت محبطة جداً، الموقع يطلب نفس البيانات في كل خطوة وما في رقم واضح للاستفسار. سبق وراسلت عبر تويتر وما رد عليّ أحد.', 'author' => 'مراجعة Google Maps', 'date' => '2026-05-09', 'reactions' => 87]],
            ['priority' => 'proactive', 'metric' => 'App ⭐ 3.9',
             'title'       => 'تطبيق MyQU — شكاوى إشعارات متكررة',
             'observation' => '14% من مراجعات Google Play خلال 60 يوم تذكر "إشعارات متأخرة" أو "إشعارات مكررة". متوسط التطبيق 3.9/5.',
             'action'      => 'مراجعة جدولة الإشعارات (Push) وإضافة منع التكرار خلال نافذة 30 دقيقة، مع لوحة Health للإشعارات.',
             'impact'      => 'رفع تقييم App إلى 4.3+، وتقليل إلغاء التنزيل بنسبة 18%.'],
            ['priority' => 'strategic', 'metric' => '+22 NPS',
             'title'       => 'فرصة بناء برنامج "صوت المراجعين الإيجابيين"',
             'observation' => '34% من المراجعات الإيجابية تذكر "أعضاء هيئة تدريس متعاونين" — قصة نجاح غير موظفة في الإعلام الجامعي.',
             'action'      => 'إطلاق سلسلة "وجوه القصيم" — لقاءات قصيرة مع أعضاء هيئة تدريس برزوا في تقييم الطلاب، تُنشر شهرياً.',
             'impact'      => 'رفع مؤشر NPS بنحو 22 نقطة وتعزيز السمعة الإلكترونية للجامعة.'],
        ];
    }

    private function recsClarity(): array
    {
        return [
            ['priority' => 'urgent', 'metric' => '41% Rage Click',
             'title'       => 'صفحة "خدماتي" — Rage Click مرتفع على زر "تقديم طلب"',
             'observation' => 'سجلت Microsoft Clarity 41% من الجلسات تحتوي Rage Click على زر "تقديم طلب" في صفحة "خدماتي"، أي 1,243 جلسة خلال 30 يوم.',
             'action'      => 'مراجعة سرعة الاستجابة للزر وإظهار حالة Loading فورية بعد النقر، مع تخفيف الـ Form Validation قبل الإرسال.',
             'impact'      => 'تخفيض Rage Click إلى أقل من 10%، ورفع نسبة إكمال الطلبات الإلكترونية بحوالي 18%.'],
            ['priority' => 'proactive', 'metric' => '23ث متوسط',
             'title'       => 'بطء تحميل لوحة faculty.qu.edu.sa',
             'observation' => 'متوسط زمن أول رسم (LCP) لـ faculty.qu.edu.sa = 23 ثانية على شبكة 4G المحلية، أعلى من الحد الموصى به (2.5ث) بفارق كبير.',
             'action'      => 'تحويل الصور الثقيلة إلى WebP، تفعيل CDN على الأصول، وتأجيل تحميل المكونات غير الحرجة.',
             'impact'      => 'تخفيض LCP إلى أقل من 3 ثوانٍ، وتحسين الفهرسة ومعدل الارتداد بنسبة 25%.'],
            ['priority' => 'strategic', 'metric' => '8 خطوات',
             'title'       => 'إعادة هندسة مسار "التسجيل" — 8 خطوات حالياً',
             'observation' => 'مسار التسجيل في www.qu.edu.sa يتطلب 8 خطوات متتابعة، 23% من الزوار يغادرون عند الخطوة 4 (تأكيد البريد).',
             'action'      => 'إعادة هندسة المسار إلى 4 خطوات قصوى، مع حفظ تلقائي للتقدم لتمكين الإكمال لاحقاً.',
             'impact'      => 'رفع نسبة إكمال التسجيل من 51% إلى ما يقارب 75%، أي ~3,400 طالب جديد سنوياً.'],
        ];
    }

    private function recsFeedback(): array
    {
        return [
            ['priority' => 'urgent', 'metric' => '🔥 312 تصويت',
             'title'       => 'مقترح "تمديد ساعات المكتبة المركزية" يتصدر التصويت',
             'observation' => 'فكرة مقدمة عبر بوابة MyQU للآراء حصدت 312 تصويتاً إيجابياً و 47 تعليق دعم خلال 9 أيام، مع تقاطع واضح بين فترة الاختبارات والطلب.',
             'action'      => 'تجربة تمديد ساعات المكتبة لـ 11م خلال أسبوعين من الاختبارات النهائية فقط، مع قياس الإقبال والكلفة.',
             'impact'      => 'اختبار سريع منخفض الكلفة، يتحول إلى سياسة ثابتة إذا تجاوز الإقبال 60 طالباً في الساعة المسائية.',
             'quote'       => ['body' => 'كل فصل نطالب بنفس الطلب: المكتبة تقفل الساعة 7 ونحن في الاختبارات. ليش ما يكون فيه فرع 24/7 على الأقل ليلة الاختبار؟', 'author' => 'طالب · كلية الهندسة', 'date' => '2026-05-06', 'reactions' => 312]],
            ['priority' => 'proactive', 'metric' => '24% بلا تصنيف',
             'title'       => 'أفكار "بلا تصنيف إداري" تتراكم',
             'observation' => '24% من الأفكار المقدمة عبر MyQU لا تحمل تصنيفاً إدارياً، مما يحجبها عن لوحات متابعة العمادات.',
             'action'      => 'مراجعة أسبوعية مركزية لتصنيف الأفكار الجديدة وتوجيهها للجهة المختصة خلال 72 ساعة.',
             'impact'      => 'تفعيل عشرات الأفكار العالقة، وتحويل البوابة إلى قناة فعّالة لاتخاذ القرار.'],
            ['priority' => 'strategic', 'metric' => '76% طلاب',
             'title'       => 'هيمنة صوت الطلاب — صوت الموظفين ضعيف',
             'observation' => '76% من البلاغات والأفكار يأتي من الطلاب، مقابل 11% فقط من الموظفين/الإداريين، رغم أن لديهم مشاهدات تشغيلية أقرب.',
             'action'      => 'إطلاق نسخة "بوابة الأفكار للموظفين" داخل خدمات منسوبي الجامعة، مع برنامج تكريم ربع سنوي لأفضل 3 أفكار منفذة.',
             'impact'      => 'تنويع مصادر الأفكار، وتسريع تحسين الخدمات الداخلية التي لا يطالها صوت الطلاب.'],
        ];
    }

    private function demoAgents(): array
    {
        return [
            ['name' => 'مساعد عضو هيئة التدريس', 'role' => 'الإجابة على استفسارات أعضاء هيئة التدريس بشأن اللوائح والسياسات', 'strategy' => 'rag',         'language' => 'ar', 'files' => 12, 'created_at' => '2026-04-22'],
            ['name' => 'مساعد القبول والتسجيل',  'role' => 'مساعد للقبول والتسجيل يجيب من اللوائح المعتمدة فقط',             'strategy' => 'rag',         'language' => 'ar', 'files' => 8,  'created_at' => '2026-04-30'],
            ['name' => 'مستشار سياسات الجامعة', 'role' => 'مستشار سياسات يحلل ويجيب من وثائق السياسات الرسمية',              'strategy' => 'fine_tuning', 'language' => 'ar', 'files' => 21, 'created_at' => '2026-05-08'],
        ];
    }
}
