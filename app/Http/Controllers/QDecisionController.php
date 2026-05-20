<?php

namespace App\Http\Controllers;

use App\Support\DecisionDashboards;
use Illuminate\Http\Request;

class QDecisionController extends Controller
{
    /**
     * The six decision dashboards, keyed by URL slug.
     * Each maps to a DecisionDashboards data key + a sections() id + sidebar metadata.
     * Titles are stored as translation keys; resolve via __($meta['title_key']) or self::dashboardTitle($slug).
     */
    public const DASHBOARDS = [
        'service-tasks' => [
            'data' => 'serviceTasks',
            'title_key' => 'messages.dashboard_service_tasks',
            'accent' => '#1B8354',
            'icon' => 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
        ],
        'complaints' => [
            'data' => 'complaints',
            'title_key' => 'messages.dashboard_complaints',
            'accent' => '#7C3AED',
            'icon' => 'M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z',
        ],
        'service-evaluations' => [
            'data' => 'serviceEvaluations',
            'title_key' => 'messages.dashboard_service_evaluations',
            'accent' => '#0891B2',
            'icon' => 'M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11',
        ],
        'reviews' => [
            'data' => 'reviews',
            'title_key' => 'messages.dashboard_reviews',
            'accent' => '#D97706',
            'icon' => 'M11.05 3.69l2.36 4.78 5.27.77a1 1 0 01.56 1.7l-3.82 3.72.9 5.25a1 1 0 01-1.45 1.06L9.99 18.5l-4.72 2.48a1 1 0 01-1.45-1.06l.9-5.25-3.82-3.72a1 1 0 01.56-1.7l5.27-.77 2.36-4.78a1 1 0 011.79 0z',
        ],
        'clarity' => [
            'data' => 'clarity',
            'title_key' => 'messages.dashboard_clarity',
            'accent' => '#1B8354',
            'icon' => 'M3 13h2l2 5 4-13 3 8 2-4h5',
        ],
        'feedback' => [
            'data' => 'feedback',
            'title_key' => 'messages.dashboard_feedback',
            'accent' => '#1B8354',
            'icon' => 'M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z',
        ],
    ];

    /** Locale-aware string picker for embedded Arabic/English demo data. */
    private static function t(string $ar, string $en): string
    {
        return app()->getLocale() === 'en' ? $en : $ar;
    }

    /**
     * Ordered catalogue for the sidebar "Dashboards" group (recommendations first).
     * Each item ships a resolved url + active flag so the Blade partial needs no logic.
     */
    public static function dashboardCatalog(): array
    {
        $currentSlug = request()->route('dashboard');

        $catalog = [[
            'url' => route('q-decision.recommendations'),
            'title' => __('messages.dashboard_ai_recommendations'),
            'icon' => 'M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.5 4.5L19 9l-4.5 1.5L13 15l-1.5-4.5L7 9l4.5-1.5L13 3z',
            'active' => request()->routeIs('q-decision.recommendations'),
        ]];

        foreach (self::DASHBOARDS as $slug => $meta) {
            $catalog[] = [
                'url' => route('q-decision.dashboard', ['dashboard' => $slug]),
                'title' => __($meta['title_key']),
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
        $meta['title'] = __($meta['title_key']);
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
            'urgent'    => ['label' => self::t('عاجل', 'Urgent'),           'color' => '#B42318', 'bg' => '#FEE4E2', 'description' => self::t('يتطلب إجراءً خلال هذا الأسبوع', 'Requires action within this week')],
            'proactive' => ['label' => self::t('استباقي', 'Proactive'),     'color' => '#B54708', 'bg' => '#FEF0C7', 'description' => self::t('تحسين متوسط الأمد لمنع المشكلة قبل تكرارها', 'Medium-term improvement to prevent recurrence')],
            'strategic' => ['label' => self::t('استراتيجي', 'Strategic'),   'color' => '#027A48', 'bg' => '#D1FADF', 'description' => self::t('توجه طويل المدى أو فرصة نضج تشغيلي', 'Long-term direction or operational maturity opportunity')],
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
            ['id' => 'service-tasks', 'dashboard' => __('messages.dashboard_service_tasks'), 'accent' => '#1B8354',
             'subtitle' => self::t('مشتق من بيانات ServiceNow — الأولوية، SLA، توزيع الفرق، ساعات الذروة', 'Derived from ServiceNow data — priority, SLA, team distribution, peak hours'),
             'recommendations' => $this->recsServiceTasks()],
            ['id' => 'complaints', 'dashboard' => __('messages.dashboard_complaints'), 'accent' => '#7C3AED',
             'subtitle' => self::t('مشتق من تصنيف الطلبات، حالة الرد الإداري، وحجم الاستفسارات مقابل الشكاوى', 'Derived from request categorisation, administrative response status, and inquiries vs. complaints volume'),
             'recommendations' => $this->recsComplaints()],
            ['id' => 'service-evaluations', 'dashboard' => __('messages.dashboard_service_evaluations'), 'accent' => '#0891B2',
             'subtitle' => self::t('مشتق من توزيع التقييمات، أدنى الخدمات أداءً، وحجم الملاحظات النصية', 'Derived from evaluation distribution, lowest-performing services, and volume of written feedback'),
             'recommendations' => $this->recsServiceEvaluations()],
            ['id' => 'reviews', 'dashboard' => __('messages.dashboard_reviews'), 'accent' => '#D97706',
             'subtitle' => self::t('مشتق من Google Maps، App Store، Google Play، ووسائل التواصل الاجتماعي', 'Derived from Google Maps, App Store, Google Play, and social media'),
             'recommendations' => $this->recsReviews()],
            ['id' => 'clarity', 'dashboard' => __('messages.dashboard_clarity'), 'accent' => '#1B8354',
             'subtitle' => self::t('مشتق من جلسات وتفاعلات Microsoft Clarity على faculty.qu.edu.sa، myqu.qu.edu.sa، www.qu.edu.sa', 'Derived from Microsoft Clarity sessions and interactions on faculty.qu.edu.sa, myqu.qu.edu.sa, www.qu.edu.sa'),
             'recommendations' => $this->recsClarity()],
            ['id' => 'feedback', 'dashboard' => __('messages.dashboard_feedback'), 'accent' => '#1B8354',
             'subtitle' => self::t('مشتق من بوابة MyQU للآراء — التصنيف الإداري، التفاعلات، البلاغات', 'Derived from the MyQU feedback portal — administrative classification, reactions, reports'),
             'recommendations' => $this->recsFeedback()],
        ];
    }

    private function recsServiceTasks(): array
    {
        return [
            ['priority' => 'urgent', 'metric' => self::t('23% تأخير', '23% delays'),
             'title'       => self::t('تجاوز SLA على أولوية عالية (مهام تشغيلية)', 'SLA breaches on high-priority (operational) tasks'),
             'observation' => self::t('سُجِّلت 47 مهمة متجاوزة لحد الـ SLA من أصل 204 مهمة بأولوية عالية خلال آخر 30 يوماً (23% تأخير). متوسط التأخر: 6.4 ساعات بعد الحد.', '47 tasks breached the SLA out of 204 high-priority tasks in the last 30 days (23% delays). Average overrun: 6.4 hours past the limit.'),
             'action'      => self::t('إعادة توزيع طلبات الفترة المسائية على فريق ثانٍ وتفعيل تنبيه مبكر عند بلوغ 70% من حد الـ SLA، مع مراجعة سببين تشغيليين متكررين (مزود الخدمة، نقص توثيق).', 'Re-distribute evening requests to a secondary team and enable an early alert at 70% of the SLA limit, while reviewing two recurring operational causes (service provider, missing documentation).'),
             'impact'      => self::t('تخفيض نسبة التجاوز إلى أقل من 5% خلال أسبوعين، واستعادة ثقة الفرق المعتمدة على هذه الخدمات في توقيت الإنجاز.', 'Reduce the breach rate to under 5% within two weeks and rebuild trust in delivery times among teams depending on these services.')],
            ['priority' => 'proactive', 'metric' => self::t('94.6% التزام', '94.6% compliance'),
             'title'       => self::t('هامش تحسين بسيط في فئة "متوسطة (دعم فني)"', 'Small improvement margin in the "Medium (Tech Support)" category'),
             'observation' => self::t('نسبة الالتزام الإجمالية 94.6% (18 متأخرة من 334 مهمة). الفئة الأعلى في نسبة التأخير: "متوسطة (دعم فني)" بنسبة 7.8%.', 'Overall compliance is 94.6% (18 late out of 334 tasks). The highest-delay category is "Medium (Tech Support)" at 7.8%.'),
             'action'      => self::t('مراجعة الفئة الأعلى في نسبة التأخير وتحديد سببين تشغيليين متكررين لإغلاقهما خلال الربع.', 'Review the highest-delay category and identify two recurring operational causes to close out this quarter.'),
             'impact'      => self::t('دفع نسبة الالتزام لتلامس 99% بشكل ثابت، وتقليل التأخر المتبقي إلى حالات استثنائية يمكن شرحها.', 'Push compliance to a steady 99% and reduce remaining delays to explainable exceptions.')],
            ['priority' => 'strategic', 'metric' => self::t('+18% حجم', '+18% volume'),
             'title'       => self::t('ساعة الذروة 10ص — 12ظ تستحوذ على 34% من المهام', 'Peak hour 10am – 12pm accounts for 34% of tasks'),
             'observation' => self::t('تحليل التوزيع الساعي يُظهر أن نافذة 10ص — 12ظ تستوعب 34% من إجمالي المهام مقابل متوسط 17% لباقي الفترات.', 'Hourly distribution analysis shows the 10am – 12pm window absorbs 34% of total tasks vs. an average of 17% for other periods.'),
             'action'      => self::t('جدولة وردية مساعدة من 9:30ص حتى 12:30ظ خلال أيام الأحد والاثنين والثلاثاء فقط، بدلاً من توسيع التوظيف اليومي.', 'Schedule an assist shift from 9:30am to 12:30pm on Sunday, Monday, Tuesday only, instead of expanding daily staffing.'),
             'impact'      => self::t('استيعاب الذروة دون زيادة في كلفة التوظيف، ورفع الإنتاجية في النافذة الأهم بحوالي 20%.', 'Absorb the peak without raising staffing costs and lift productivity in the most critical window by about 20%.')],
        ];
    }

    private function recsComplaints(): array
    {
        return [
            ['priority' => 'urgent', 'metric' => self::t('38 شكوى', '38 complaints'),
             'title'       => self::t('ارتفاع شكاوى البطاقة الجامعية خلال آخر أسبوعين', 'Surge in university ID-card complaints over the last two weeks'),
             'observation' => self::t('استقبلت بوابة الشكاوى 38 شكوى مرتبطة بإصدار البطاقة الجامعية خلال آخر 14 يوم، مقابل متوسط 9 شكاوى لنفس الفترة في الفصول السابقة.', 'The complaints portal received 38 complaints related to university ID-card issuance in the last 14 days, versus an average of 9 for the same period in previous terms.'),
             'action'      => self::t('تشكيل فريق مشترك (عمادة شؤون الطلاب + الأمن + الجودة) لإغلاق دورة الإصدار خلال 5 أيام، ونشر دليل خطوات مرئي لـ Top-3 المشكلات الشائعة.', 'Form a joint task force (Student Affairs + Security + Quality) to close the issuance cycle within 5 days, and publish a visual step-by-step guide for the Top-3 common issues.'),
             'impact'      => self::t('تقليل الشكاوى بنسبة 60% خلال أسبوعين، وتحرير 2-3 موظفين من الرد المتكرر على نفس الاستفسار.', 'Cut complaints by 60% within two weeks and free 2-3 staff from repeatedly answering the same inquiry.'),
             'quote'       => ['body' => self::t('سجّلت طلب إصدار بطاقة من 12 يوم ولا في أي تحديث. اتصلت 3 مرات وكل مرة يقولوا لي نرجع نكلمك. الخدمة تحتاج تتطور.', 'I submitted a card-issuance request 12 days ago with no update. I called 3 times and each time was told they would call me back. This service needs improvement.'), 'author' => self::t('طالبة · كلية التربية', 'Student · College of Education'), 'date' => '2026-05-05', 'reactions' => 142]],
            ['priority' => 'proactive', 'metric' => self::t('47% غير مصنف', '47% uncategorised'),
             'title'       => self::t('نسبة الطلبات "غير المصنفة" مرتفعة', 'High share of "uncategorised" requests'),
             'observation' => self::t('47% من البلاغات الواردة في آخر شهرين لم يتم تصنيفها إلى فئة (شكوى/استفسار/مقترح) قبل التوجيه، مما يطيل زمن أول رد بمعدل 1.8 يوم.', '47% of submissions in the last two months were not categorised (complaint/inquiry/suggestion) before routing, extending first-response time by an average of 1.8 days.'),
             'action'      => self::t('تفعيل تصنيف تلقائي بكلمات مفتاحية + توجيه إلزامي للحقل قبل إرسال البلاغ، مع لوحة متابعة أسبوعية للجهات الأعلى في "غير مصنف".', 'Enable keyword-based auto-categorisation plus a mandatory field before submission, with a weekly tracking dashboard for departments topping the "uncategorised" list.'),
             'impact'      => self::t('خفض زمن أول رد بنسبة 30%، وتمكين تقارير دقيقة لاتجاهات الشكاوى الفعلية.', 'Lower first-response time by 30% and enable accurate reporting on real complaint trends.')],
            ['priority' => 'strategic', 'metric' => self::t('3:1 استفسار:شكوى', '3:1 inquiry:complaint'),
             'title'       => self::t('فرصة بناء قاعدة معرفية ذاتية الخدمة', 'Opportunity to build a self-service knowledge base'),
             'observation' => self::t('نسبة الاستفسارات إلى الشكاوى الفعلية 3:1، أي أن ثلاثة أرباع الطلبات الواردة هي أسئلة قابلة للإجابة عبر مقالات معرفية.', 'The inquiries-to-actual-complaints ratio is 3:1, meaning three quarters of submissions are questions answerable through knowledge articles.'),
             'action'      => self::t('إطلاق قاعدة معرفية ذاتية الخدمة مرتبطة ببوابة MyQU، تغطي أعلى 20 استفساراً متكرراً، مع إعادة تقييم كل 90 يوم.', 'Launch a self-service knowledge base linked to the MyQU portal covering the top 20 recurring inquiries, with re-assessment every 90 days.'),
             'impact'      => self::t('تقليل حجم الطلبات الواردة بنسبة 40% خلال ستة أشهر، وتوجيه طاقة الفريق نحو الشكاوى الفعلية.', 'Reduce incoming volume by 40% within six months and redirect the team\'s capacity toward actual complaints.')],
        ];
    }

    private function recsServiceEvaluations(): array
    {
        return [
            ['priority' => 'urgent', 'metric' => '⭐ 2.4 / 5',
             'title'       => self::t('خدمة الإيواء الطلابي بأدنى تقييم — 2.4 نجوم', 'Student housing service has the lowest rating — 2.4 stars'),
             'observation' => self::t('متوسط تقييم خدمة الإيواء الطلابي 2.4/5 على آخر 312 تقييم، مقارنة بمتوسط جامعي عام 4.1/5. أبرز الملاحظات النصية: "بطء الصيانة"، "صعوبة التواصل".', 'Average rating for student housing is 2.4/5 on the last 312 reviews vs. a university-wide 4.1/5. Top textual feedback: "slow maintenance", "hard to reach support".'),
             'action'      => self::t('تخصيص مدير علاقات للخدمة وإنشاء قناة بلاغ مباشر، مع تقرير أسبوعي للإدارة العليا لمدة 8 أسابيع.', 'Assign a dedicated relationship manager and open a direct reporting channel, with a weekly executive report for 8 weeks.'),
             'impact'      => self::t('رفع متوسط التقييم إلى 3.6/5 على الأقل خلال الفصل، وإعادة بناء الثقة في خدمة طلابية أساسية.', 'Lift the average rating to at least 3.6/5 within the term and rebuild trust in a core student service.')],
            ['priority' => 'proactive', 'metric' => self::t('67% بلا تعليق', '67% no comment'),
             'title'       => self::t('انخفاض معدل التعليق المكتوب على التقييمات', 'Low rate of written comments on evaluations'),
             'observation' => self::t('67% من المقيِّمين لم يتركوا أي تعليق نصي، مما يُضعف قدرة التحليل النوعي على فهم الأسباب الجذرية.', '67% of respondents left no written comment, weakening qualitative analysis of root causes.'),
             'action'      => self::t('إضافة سؤال مفتوح اختياري "ما الذي يمكن تحسينه؟" مع 3 خيارات سريعة قابلة للنقر تظهر بعد التقييم مباشرة.', 'Add an optional open question "What could be improved?" with 3 clickable quick options shown right after the rating.'),
             'impact'      => self::t('مضاعفة حجم الملاحظات النصية، وإطلاق قراءات نوعية شهرية للفرق المعنية.', 'Double the volume of written feedback and launch monthly qualitative readouts for the relevant teams.')],
            ['priority' => 'strategic', 'metric' => self::t('+12% رضا', '+12% satisfaction'),
             'title'       => self::t('الخدمات الإلكترونية تتفوق على الحضورية', 'E-services outperform in-person services'),
             'observation' => self::t('متوسط رضا الخدمات الإلكترونية 4.3/5 مقابل 3.7/5 للحضورية، مع نية متابعة الخدمة عبر القناة الإلكترونية لدى 78% من الطلاب.', 'Average e-service satisfaction is 4.3/5 vs. 3.7/5 in-person, with 78% of students intending to use the electronic channel.'),
             'action'      => self::t('استثمار إضافي في رقمنة 5 خدمات حضورية ذات حجم مرتفع وتقييم متوسط (التحويل، الاعتذار، التأجيل، الفرص، البدلاء).', 'Invest in digitising 5 high-volume, mid-rated in-person services (transfer, withdrawal, postponement, electives, substitutes).'),
             'impact'      => self::t('رفع رضا الطلاب الكلي بنحو 12 نقطة، وتقليل الزحام والازدحام داخل العمادات.', 'Raise overall student satisfaction by about 12 points and reduce crowding inside the deanships.')],
        ];
    }

    private function recsReviews(): array
    {
        return [
            ['priority' => 'urgent', 'metric' => 'Google ⭐ 3.4',
             'title'       => self::t('هبوط متوسط Google Maps إلى 3.4 خلال آخر 14 يوماً', 'Google Maps average dropped to 3.4 in the last 14 days'),
             'observation' => self::t('سجلت صفحة الجامعة على Google Maps متوسطاً جديداً 3.4 (من 4.2 الشهر السابق) بسبب 28 تعليقاً سلبياً مرتبطاً بدوامات القبول.', 'The university Google Maps page recorded a new 3.4 average (down from 4.2 last month) driven by 28 negative comments tied to admissions hours.'),
             'action'      => self::t('الرد العلني على التعليقات السلبية خلال 48 ساعة، وإطلاق صفحة "حالة الخدمة" لتوضيح أوقات الذروة في القبول.', 'Publicly reply to negative reviews within 48 hours and launch a "Service Status" page clarifying admissions peak times.'),
             'impact'      => self::t('استعادة متوسط 4.0+ خلال شهر، وتقليل دورة الانتشار السلبي على وسائل التواصل المرتبطة بنفس الموضوع.', 'Recover a 4.0+ average within a month and dampen the negative social-media chatter on the same topic.'),
             'quote'       => ['body' => self::t('تجربة القبول كانت محبطة جداً، الموقع يطلب نفس البيانات في كل خطوة وما في رقم واضح للاستفسار. سبق وراسلت عبر تويتر وما رد عليّ أحد.', 'The admissions experience was very frustrating — the site asks for the same data at every step and there is no clear contact number. I previously messaged on Twitter and no one replied.'), 'author' => self::t('مراجعة Google Maps', 'Google Maps review'), 'date' => '2026-05-09', 'reactions' => 87]],
            ['priority' => 'proactive', 'metric' => 'App ⭐ 3.9',
             'title'       => self::t('تطبيق MyQU — شكاوى إشعارات متكررة', 'MyQU app — recurring notification complaints'),
             'observation' => self::t('14% من مراجعات Google Play خلال 60 يوم تذكر "إشعارات متأخرة" أو "إشعارات مكررة". متوسط التطبيق 3.9/5.', '14% of Google Play reviews over 60 days mention "late notifications" or "duplicate notifications". App average is 3.9/5.'),
             'action'      => self::t('مراجعة جدولة الإشعارات (Push) وإضافة منع التكرار خلال نافذة 30 دقيقة، مع لوحة Health للإشعارات.', 'Review push-notification scheduling and add de-duplication within a 30-minute window, plus a notifications health dashboard.'),
             'impact'      => self::t('رفع تقييم App إلى 4.3+، وتقليل إلغاء التنزيل بنسبة 18%.', 'Lift the app rating to 4.3+ and reduce uninstalls by 18%.')],
            ['priority' => 'strategic', 'metric' => '+22 NPS',
             'title'       => self::t('فرصة بناء برنامج "صوت المراجعين الإيجابيين"', 'Opportunity to build a "Voice of Positive Reviewers" programme'),
             'observation' => self::t('34% من المراجعات الإيجابية تذكر "أعضاء هيئة تدريس متعاونين" — قصة نجاح غير موظفة في الإعلام الجامعي.', '34% of positive reviews mention "helpful faculty members" — a success story not yet leveraged in university communications.'),
             'action'      => self::t('إطلاق سلسلة "وجوه القصيم" — لقاءات قصيرة مع أعضاء هيئة تدريس برزوا في تقييم الطلاب، تُنشر شهرياً.', 'Launch a "Faces of Qassim" series — short interviews with faculty members highlighted in student feedback, published monthly.'),
             'impact'      => self::t('رفع مؤشر NPS بنحو 22 نقطة وتعزيز السمعة الإلكترونية للجامعة.', 'Raise NPS by about 22 points and strengthen the university\'s digital reputation.')],
        ];
    }

    private function recsClarity(): array
    {
        return [
            ['priority' => 'urgent', 'metric' => '41% Rage Click',
             'title'       => self::t('صفحة "خدماتي" — Rage Click مرتفع على زر "تقديم طلب"', '"My Services" page — high Rage Click on the "Submit Request" button'),
             'observation' => self::t('سجلت Microsoft Clarity 41% من الجلسات تحتوي Rage Click على زر "تقديم طلب" في صفحة "خدماتي"، أي 1,243 جلسة خلال 30 يوم.', 'Microsoft Clarity recorded 41% of sessions with Rage Clicks on the "Submit Request" button in "My Services" — 1,243 sessions over 30 days.'),
             'action'      => self::t('مراجعة سرعة الاستجابة للزر وإظهار حالة Loading فورية بعد النقر، مع تخفيف الـ Form Validation قبل الإرسال.', 'Review button response time and show an immediate loading state after click, while easing form validation before submission.'),
             'impact'      => self::t('تخفيض Rage Click إلى أقل من 10%، ورفع نسبة إكمال الطلبات الإلكترونية بحوالي 18%.', 'Cut Rage Clicks to under 10% and lift online request completion by about 18%.')],
            ['priority' => 'proactive', 'metric' => self::t('23ث متوسط', '23s average'),
             'title'       => self::t('بطء تحميل لوحة faculty.qu.edu.sa', 'Slow loading on the faculty.qu.edu.sa portal'),
             'observation' => self::t('متوسط زمن أول رسم (LCP) لـ faculty.qu.edu.sa = 23 ثانية على شبكة 4G المحلية، أعلى من الحد الموصى به (2.5ث) بفارق كبير.', 'Largest Contentful Paint (LCP) for faculty.qu.edu.sa averages 23 seconds on local 4G, far above the recommended 2.5s threshold.'),
             'action'      => self::t('تحويل الصور الثقيلة إلى WebP، تفعيل CDN على الأصول، وتأجيل تحميل المكونات غير الحرجة.', 'Convert heavy images to WebP, enable a CDN for assets, and defer non-critical components.'),
             'impact'      => self::t('تخفيض LCP إلى أقل من 3 ثوانٍ، وتحسين الفهرسة ومعدل الارتداد بنسبة 25%.', 'Reduce LCP to under 3 seconds and improve indexing and bounce rate by 25%.')],
            ['priority' => 'strategic', 'metric' => self::t('8 خطوات', '8 steps'),
             'title'       => self::t('إعادة هندسة مسار "التسجيل" — 8 خطوات حالياً', 'Re-engineer the "registration" funnel — currently 8 steps'),
             'observation' => self::t('مسار التسجيل في www.qu.edu.sa يتطلب 8 خطوات متتابعة، 23% من الزوار يغادرون عند الخطوة 4 (تأكيد البريد).', 'The registration funnel on www.qu.edu.sa requires 8 sequential steps; 23% of visitors drop off at step 4 (email confirmation).'),
             'action'      => self::t('إعادة هندسة المسار إلى 4 خطوات قصوى، مع حفظ تلقائي للتقدم لتمكين الإكمال لاحقاً.', 'Re-engineer the funnel to a maximum of 4 steps with auto-saved progress to enable later completion.'),
             'impact'      => self::t('رفع نسبة إكمال التسجيل من 51% إلى ما يقارب 75%، أي ~3,400 طالب جديد سنوياً.', 'Lift registration completion from 51% to about 75% — roughly 3,400 additional students per year.')],
        ];
    }

    private function recsFeedback(): array
    {
        return [
            ['priority' => 'urgent', 'metric' => self::t('🔥 312 تصويت', '🔥 312 votes'),
             'title'       => self::t('مقترح "تمديد ساعات المكتبة المركزية" يتصدر التصويت', '"Extend central library hours" proposal leads the vote'),
             'observation' => self::t('فكرة مقدمة عبر بوابة MyQU للآراء حصدت 312 تصويتاً إيجابياً و 47 تعليق دعم خلال 9 أيام، مع تقاطع واضح بين فترة الاختبارات والطلب.', 'An idea submitted through the MyQU ideas portal collected 312 upvotes and 47 supportive comments in 9 days, with a clear overlap between exam season and demand.'),
             'action'      => self::t('تجربة تمديد ساعات المكتبة لـ 11م خلال أسبوعين من الاختبارات النهائية فقط، مع قياس الإقبال والكلفة.', 'Pilot extending library hours to 11pm for two weeks during finals only, while measuring attendance and cost.'),
             'impact'      => self::t('اختبار سريع منخفض الكلفة، يتحول إلى سياسة ثابتة إذا تجاوز الإقبال 60 طالباً في الساعة المسائية.', 'A fast, low-cost test that becomes a permanent policy if attendance exceeds 60 students per evening hour.'),
             'quote'       => ['body' => self::t('كل فصل نطالب بنفس الطلب: المكتبة تقفل الساعة 7 ونحن في الاختبارات. ليش ما يكون فيه فرع 24/7 على الأقل ليلة الاختبار؟', 'Every term we make the same request: the library closes at 7 while we are in exams. Why not have at least one 24/7 branch on exam nights?'), 'author' => self::t('طالب · كلية الهندسة', 'Student · College of Engineering'), 'date' => '2026-05-06', 'reactions' => 312]],
            ['priority' => 'proactive', 'metric' => self::t('24% بلا تصنيف', '24% uncategorised'),
             'title'       => self::t('أفكار "بلا تصنيف إداري" تتراكم', 'Ideas with "no administrative category" are piling up'),
             'observation' => self::t('24% من الأفكار المقدمة عبر MyQU لا تحمل تصنيفاً إدارياً، مما يحجبها عن لوحات متابعة العمادات.', '24% of ideas submitted via MyQU lack an administrative category, hiding them from deanship tracking boards.'),
             'action'      => self::t('مراجعة أسبوعية مركزية لتصنيف الأفكار الجديدة وتوجيهها للجهة المختصة خلال 72 ساعة.', 'Run a central weekly review to categorise new ideas and route them to the relevant department within 72 hours.'),
             'impact'      => self::t('تفعيل عشرات الأفكار العالقة، وتحويل البوابة إلى قناة فعّالة لاتخاذ القرار.', 'Unblock dozens of pending ideas and turn the portal into an effective decision-making channel.')],
            ['priority' => 'strategic', 'metric' => self::t('76% طلاب', '76% students'),
             'title'       => self::t('هيمنة صوت الطلاب — صوت الموظفين ضعيف', 'Student voice dominates — staff voice is weak'),
             'observation' => self::t('76% من البلاغات والأفكار يأتي من الطلاب، مقابل 11% فقط من الموظفين/الإداريين، رغم أن لديهم مشاهدات تشغيلية أقرب.', '76% of submissions and ideas come from students vs. only 11% from staff/administrators, despite the latter having closer operational visibility.'),
             'action'      => self::t('إطلاق نسخة "بوابة الأفكار للموظفين" داخل خدمات منسوبي الجامعة، مع برنامج تكريم ربع سنوي لأفضل 3 أفكار منفذة.', 'Launch a "Staff Ideas Portal" inside university employee services, with a quarterly recognition programme for the top 3 implemented ideas.'),
             'impact'      => self::t('تنويع مصادر الأفكار، وتسريع تحسين الخدمات الداخلية التي لا يطالها صوت الطلاب.', 'Diversify idea sources and accelerate improvement of internal services beyond the reach of student voice.')],
        ];
    }

    private function demoAgents(): array
    {
        return [
            ['name' => self::t('مساعد عضو هيئة التدريس', 'Faculty Assistant'),     'role' => self::t('الإجابة على استفسارات أعضاء هيئة التدريس بشأن اللوائح والسياسات', 'Answers faculty inquiries on regulations and policies'),       'strategy' => 'rag',         'language' => 'ar', 'files' => 12, 'created_at' => '2026-04-22'],
            ['name' => self::t('مساعد القبول والتسجيل', 'Admissions & Registration Assistant'),  'role' => self::t('مساعد للقبول والتسجيل يجيب من اللوائح المعتمدة فقط', 'Admissions and registration assistant answering only from approved regulations'),             'strategy' => 'rag',         'language' => 'ar', 'files' => 8,  'created_at' => '2026-04-30'],
            ['name' => self::t('مستشار سياسات الجامعة', 'University Policy Advisor'), 'role' => self::t('مستشار سياسات يحلل ويجيب من وثائق السياسات الرسمية', 'Policy advisor that analyses and answers from official policy documents'),              'strategy' => 'fine_tuning', 'language' => 'ar', 'files' => 21, 'created_at' => '2026-05-08'],
        ];
    }
}
