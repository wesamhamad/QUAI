<?php

/*
|--------------------------------------------------------------------------
| QMentor — محرك الخطر (SRS v8 §5.B + §5.C)
|--------------------------------------------------------------------------
|
| Every number here is copied from the SRS tables, not invented: the 31
| indicator thresholds (§5.B), the category weights, the critical overrides,
| the auto-escalation clock and the four level bands (§5.C). Regulation
| changes without a release, so it lives in config.
|
| Levels are integers throughout the engine: 0 Low · 1 Medium · 2 High ·
| 3 Critical. An indicator that cannot be evaluated (no data for this
| student) returns null and is left out of the average — it never counts
| as Low.
|
*/
return [

    'model_version' => '2026-09-16.1', // .1: Critical = 2+ High indicators AND E-EX (counselling referral); every other rule stops at High

    // How long /risk/cohort's university-wide aggregate is served from cache.
    // The scoring command clears it when it finishes, so this is only the
    // ceiling for a cohort nobody re-scored.
    'cohort_cache_minutes' => (int) env('QMENTOR_COHORT_CACHE_MINUTES', 1440),

    'levels' => [
        0 => ['key' => 'low', 'ar' => 'منخفض', 'min' => 0, 'max' => 25, 'color' => 'green'],
        1 => ['key' => 'medium', 'ar' => 'متوسط', 'min' => 26, 'max' => 50, 'color' => 'yellow'],
        2 => ['key' => 'high', 'ar' => 'مرتفع', 'min' => 51, 'max' => 75, 'color' => 'orange'],
        3 => ['key' => 'critical', 'ar' => 'حرج', 'min' => 76, 'max' => 100, 'color' => 'red'],
    ],

    /*
     * §5.C Layer 1 — category weights. T (exams) and P (graduation path) have
     * no weight in the SRS table; they are folded into the nearest weighted
     * category (T → G, P → R) so their signal is not lost. ⚠ Engineering
     * assumption to confirm with the data team before the file is submitted.
     */
    'weights' => [
        'G' => 30,
        'A' => 25,
        'S' => 15,
        'AC' => 15,
        'E' => 10,
        'R' => 5,
    ],
    'fold' => ['T' => 'G', 'P' => 'R'],

    /* §5.C Layer 2 — a single indicator at this level forces a floor. */
    'overrides' => [
        'A-03' => ['at_level' => 3, 'minimum' => 2],   // ≤2% from barring → at least High
        'AC-01' => ['at_level' => 2, 'minimum' => 2],  // 2nd+ warning → at least High
        'C-01' => ['at_level' => 3, 'minimum' => 3],   // silent withdrawal → Critical
    ],

    /*
     * Composite overrides (Layer 2 as well): every named indicator must be
     * available and satisfy its condition; then the level is at least
     * `minimum`. Added 2026-09-14 because the single-indicator Critical rules
     * rest on assignments and LMS logins that the feeds do not carry: a
     * student absent ≥ 20% with a GPA under 2.00 is Critical on what we do have.
     */
    'composite_overrides' => [
        'A-01+G-04' => ['when' => ['A-01' => ['min' => 20], 'G-04' => ['max' => 1.999]], 'minimum' => 3],
    ],

    /* SRS 2.2 §7.B E-EX — excuse-request reason codes that route to counselling: 1 مراجعة طبية · 2 وفاة أحد الوالدين · 3 وفاة أخ/أخت · 6 حادث مرور. */
    'excuse_reason_codes' => ['1', '2', '3', '6'],
    /* What the twin says next to the absence indicators when E-EX made the student Critical. */
    'excuse_reason_labels' => ['1' => 'مراجعة طبية', '2' => 'وفاة أحد الوالدين', '3' => 'وفاة أخ/أخت', '6' => 'حادث مرور'],

    /*
     * حرج = إحالة للمرشد النفسي (decided 2026-09-16): at least this many
     * indicators at High AND E-EX (absence ≥ 18% in a course with an excuse
     * request coded above). Nothing else reaches Critical — the overrides,
     * the composite rule, SIS dismissal and escalation stop at High. The
     * excused-sessions proxy never counts: it carries no reason code.
     */
    'critical' => [
        'min_high_indicators' => 2,
    ],

    /* §5.C Layer 3 — no improvement for this many days lifts the level by one. */
    'escalation' => [
        1 => 14,   // Medium → High after 2 weeks
        2 => 7,    // High → Critical after 1 week
    ],

    /*
     * §5.B thresholds. Each entry is [medium, high, critical] on the
     * indicator's own scale, with `dir` saying which way is worse:
     * 'up' = larger is worse (absence %), 'down' = smaller is worse (GPA).
     */
    'thresholds' => [
        'A-01' => ['dir' => 'up', 'bands' => [11, 16, 20.01], 'unit' => '%'],       // 5–10 · 11–15 · 16–20 · >20
        'A-02' => ['dir' => 'up', 'bands' => [2, 3, 4], 'unit' => 'lectures'],
        'A-03' => ['dir' => 'down', 'bands' => [10, 5, 2], 'unit' => '% remaining'], // >10 · 5–10 · 2–5 · ≤2
        'A-04' => ['dir' => 'up', 'bands' => [2, 3, 'all'], 'unit' => 'courses'],
        'G-01' => ['dir' => 'down', 'bands' => [70, 50, 35], 'unit' => '%'],
        'G-02' => ['dir' => 'down', 'bands' => [70, 50, 35], 'unit' => '%'],
        'G-03' => ['dir' => 'down', 'bands' => [70, 50, 35], 'unit' => '%'],
        'G-04' => ['dir' => 'down', 'bands' => [3.0, 2.0, 1.5], 'unit' => 'gpa/5'],
        'G-05' => ['dir' => 'down', 'bands' => [-0.2, -0.5, -0.5001], 'unit' => 'Δgpa'], // improving · ±0.2 · −0.2…−0.5 · < −0.5
        'G-06' => ['dir' => 'down', 'bands' => [-1.0, -1.5, -2.0], 'unit' => 'σ'],
        'G-08' => ['dir' => 'up', 'bands' => [1, 3, 5], 'unit' => 'fails'],
        'S-01' => ['dir' => 'up', 'bands' => [11, 26, 50.01], 'unit' => '%'],
        'E-01' => ['dir' => 'down', 'bands' => [70, 40, 15], 'unit' => '%'],
        'E-02' => ['dir' => 'up', 'bands' => [3, 6, 11], 'unit' => 'days'],
        'AC-01' => ['dir' => 'up', 'bands' => [1, 2, 3], 'unit' => 'warnings'],
        'AC-02' => ['dir' => 'up', 'bands' => [1, 2, 3], 'unit' => 'prereqs'],
        'R-01' => ['dir' => 'up', 'bands' => [1, 2, 3], 'unit' => 'requests'],
        'T-01' => ['dir' => 'up', 'bands' => [1, 2, 3], 'unit' => 'finals'],
        'P-01' => ['dir' => 'up', 'bands' => [1, 2, 3], 'unit' => 'semesters'],
        'P-02' => ['dir' => 'up', 'bands' => [1, 2, 4], 'unit' => 'courses'],
        'P-03' => ['dir' => 'down', 'bands' => [4, 1, 0], 'unit' => 'semesters left'],
        'P-04' => ['dir' => 'up', 'bands' => [1, 3, 5], 'unit' => 'electives'],
        'P-05' => ['dir' => 'up', 'bands' => [1, 2, 3], 'unit' => 'courses'],
    ],

    /* Absence bar — SIS's own barring threshold, the reference for A-03. */
    'absence_bar' => 25.0,

    /* GPA scale — Qassim posts out of 5.00. */
    'gpa_scale' => 5.0,

    /*
     * Passing/failing letters, in the alphabets SIS actually returns. The
     * advising engine keeps the authoritative list (AdvisingApiClient); this
     * mirrors it for the letters that mark an incomplete/absent final (T-01).
     */
    'incomplete_letters' => ['IC', 'AB', 'غ', 'ل', 'W', 'DN'],

    /* §5.C college-specific overrides, keyed by faculty_no. */
    'college_overrides' => [
        // Medicine 38 / Pharmacy 37 / Dentistry 36: A-01 bands lowered by 5.
        '38' => ['A-01' => ['bands' => [6, 11, 15.01]]],
        '37' => ['A-01' => ['bands' => [6, 11, 15.01]]],
        '36' => ['A-01' => ['bands' => [6, 11, 15.01]]],
        // Engineering 48 / Computer 44: E-01 stricter.
        '48' => ['E-01' => ['bands' => [80, 50, 25]]],
        '44' => ['E-01' => ['bands' => [80, 50, 25]]],
        // Sharia 1 / Arabic 88: E-01 relaxed.
        '1' => ['E-01' => ['bands' => [50, 25, 10]]],
        '88' => ['E-01' => ['bands' => [50, 25, 10]]],
    ],

    /*
     * §5.B.10 / UC-STU-03 — the action a fired indicator recommends. Rule-based
     * (Handled By: System), so the same indicator always yields the same
     * plan; wording is what the student sees on /action-plan.
     * impact: high|medium|low · difficulty: easy|medium|hard
     */
    'actions' => [
        'A-01' => ['ar' => 'احضر كل المحاضرات المتبقية في المقرر الأعلى غياباً', 'en' => 'Attend every remaining lecture in your highest-absence course', 'desc_ar' => 'كل محاضرة تحضرها تُبعدك عن حدّ الحرمان (25%). راجع نسبة الغياب لكل مقرر أسبوعياً.', 'desc_en' => 'Each lecture attended moves you away from the 25% bar. Check per-course absence weekly.', 'impact' => 'high', 'difficulty' => 'easy', 'time_ar' => 'مستمر', 'time_en' => 'ongoing'],
        'A-02' => ['ar' => 'اقطع سلسلة الغياب المتتالي هذا الأسبوع', 'en' => 'Break the run of consecutive absences this week', 'desc_ar' => 'الغياب المتتالي يُقرأ كانسحاب. إن كان هناك سبب، سجّل عذراً عبر MyQU.', 'desc_en' => 'Consecutive absences read as withdrawal. If there is a reason, file an excuse via MyQU.', 'impact' => 'high', 'difficulty' => 'easy', 'time_ar' => 'هذا الأسبوع', 'time_en' => 'this week'],
        'A-03' => ['ar' => 'لا تغب محاضرة واحدة إضافية في المقرر المهدَّد', 'en' => 'Do not miss one more lecture in the at-risk course', 'desc_ar' => 'أنت على بعد محاضرات قليلة من الحرمان. تواصل مع أستاذ المقرر لتثبيت أي أعذار معلّقة.', 'desc_en' => 'You are a few lectures from being barred. Contact the instructor to confirm any pending excuses.', 'impact' => 'high', 'difficulty' => 'easy', 'time_ar' => 'فوري', 'time_en' => 'immediate'],
        'A-04' => ['ar' => 'راجع جدولك الأسبوعي مع مرشدك', 'en' => 'Review your weekly schedule with your advisor', 'desc_ar' => 'غياب في أكثر من مقرر يشير إلى تعارض في الجدول أو ظرف عام لا إلى مقرر بعينه.', 'desc_en' => 'Absence across several courses points to a schedule clash or a general circumstance, not one course.', 'impact' => 'medium', 'difficulty' => 'medium', 'time_ar' => '~ساعة', 'time_en' => '~1 hour'],
        'G-01' => ['ar' => 'خطة مراجعة مركّزة قبل الاختبار القادم', 'en' => 'A focused review plan before the next exam', 'desc_ar' => 'راجع محتوى المنتصف على بلاكبورد وحدّد الموضوعات التي خسرت فيها الدرجات.', 'desc_en' => 'Go through the midterm material on Blackboard and pin the topics where marks were lost.', 'impact' => 'high', 'difficulty' => 'medium', 'time_ar' => '~6 ساعات', 'time_en' => '~6 hours'],
        'G-02' => ['ar' => 'حلّ الكويزات السابقة مرة أخرى', 'en' => 'Re-do the past quizzes', 'desc_ar' => 'الكويز يقيس المحاضرة الأخيرة؛ راجع محتواها قبل كل موعد كويز.', 'desc_en' => 'Quizzes test the last lecture; review it before each quiz date.', 'impact' => 'medium', 'difficulty' => 'easy', 'time_ar' => '~ساعتان أسبوعياً', 'time_en' => '~2 hours/week'],
        'G-03' => ['ar' => 'اطلب تغذية راجعة على آخر واجب', 'en' => 'Ask for feedback on your last assignment', 'desc_ar' => 'متوسط الواجبات منخفض؛ التغذية الراجعة من الأستاذ تحدّد ما ينقص بدقة.', 'desc_en' => 'Assignment average is low; instructor feedback pins exactly what is missing.', 'impact' => 'medium', 'difficulty' => 'easy', 'time_ar' => '~30 دقيقة', 'time_en' => '~30 min'],
        'G-04' => ['ar' => 'احجز موعداً مع مرشدك لخطة رفع المعدل', 'en' => 'Book your advisor for a GPA recovery plan', 'desc_ar' => 'المعدل التراكمي تحت الحدّ الآمن. خطة الفصل القادم تحتاج اختيار المقررات بعناية.', 'desc_en' => 'Cumulative GPA is under the safe line. Next term needs careful course selection.', 'impact' => 'high', 'difficulty' => 'medium', 'time_ar' => '~ساعة', 'time_en' => '~1 hour'],
        'G-05' => ['ar' => 'حدّد سبب هبوط المعدل الفصلي الأخير', 'en' => 'Identify what pulled the last semester GPA down', 'desc_ar' => 'قارن مقررات الفصلين الأخيرين؛ الهبوط عادة مقرر أو اثنان لا الفصل كله.', 'desc_en' => 'Compare the last two terms; the drop is usually one or two courses, not the whole term.', 'impact' => 'medium', 'difficulty' => 'easy', 'time_ar' => '~30 دقيقة', 'time_en' => '~30 min'],
        'G-06' => ['ar' => 'انضم لمجموعة مذاكرة في المقرر الذي تتأخر فيه عن زملائك', 'en' => 'Join a study group in the course where you trail the section', 'desc_ar' => 'الفجوة عن متوسط الشعبة تعني أن المادة قابلة للفهم بوتيرة الزملاء.', 'desc_en' => 'A gap to the section mean means the material is learnable at your peers\' pace.', 'impact' => 'medium', 'difficulty' => 'medium', 'time_ar' => '~3 ساعات أسبوعياً', 'time_en' => '~3 hours/week'],
        'G-07' => ['ar' => 'أوقف الاتجاه الهابط قبل الاختبار القادم', 'en' => 'Stop the downward trend before the next exam', 'desc_ar' => 'الدرجات تهبط عبر الأعمدة الأخيرة؛ خصّص وقت مذاكرة ثابتاً يومياً.', 'desc_en' => 'Marks are sliding across the latest columns; set a fixed daily study slot.', 'impact' => 'high', 'difficulty' => 'medium', 'time_ar' => 'يومياً', 'time_en' => 'daily'],
        'G-08' => ['ar' => 'لا تسجّل مقرراً سبق رسوبك فيه مع عبء كامل', 'en' => 'Do not retake a failed course on a full load', 'desc_ar' => 'الرسوب المتكرر يُعالج بتخفيف العبء في فصل الإعادة.', 'desc_en' => 'Repeated failure is fixed by lightening the load in the retake term.', 'impact' => 'high', 'difficulty' => 'medium', 'time_ar' => 'عند التسجيل', 'time_en' => 'at registration'],
        'G-09' => ['ar' => 'ركّز على المقرر المتوقَّع رسوبه', 'en' => 'Focus on the course predicted to fail', 'desc_ar' => 'التنبؤ مبني على أدائك التاريخي وأداء الشعبة؛ التدخل المبكر يغيّره.', 'desc_en' => 'The prediction is built on your history and the section\'s; early action changes it.', 'impact' => 'high', 'difficulty' => 'medium', 'time_ar' => 'هذا الشهر', 'time_en' => 'this month'],
        'S-01' => ['ar' => 'سلّم الواجبات المعلّقة أولاً', 'en' => 'Submit the pending assignments first', 'desc_ar' => 'الواجب غير المسلَّم درجة صفر مضمونة؛ التسليم المتأخر أفضل من الغياب.', 'desc_en' => 'An unsubmitted assignment is a guaranteed zero; late beats missing.', 'impact' => 'high', 'difficulty' => 'medium', 'time_ar' => '~ساعتان', 'time_en' => '~2 hours'],
        'S-02' => ['ar' => 'ابدأ الواجب القادم قبل موعده بيومين', 'en' => 'Start the next assignment two days early', 'desc_ar' => 'درجات الواجبات تهبط؛ الوقت لا الفهم هو الفارق غالباً.', 'desc_en' => 'Assignment marks are falling; time, not understanding, is usually the gap.', 'impact' => 'medium', 'difficulty' => 'easy', 'time_ar' => 'كل واجب', 'time_en' => 'each assignment'],
        'AC-01' => ['ar' => 'اجتمع بمرشدك هذا الأسبوع بشأن الإنذار الأكاديمي', 'en' => 'Meet your advisor this week about the academic warning', 'desc_ar' => 'ثلاثة إنذارات تعني الفصل. الإنذار يُرفع برفع المعدل الفصلي فوق 2.0.', 'desc_en' => 'Three warnings mean dismissal. A warning lifts when the semester GPA clears 2.0.', 'impact' => 'high', 'difficulty' => 'medium', 'time_ar' => 'هذا الأسبوع', 'time_en' => 'this week'],
        'AC-02' => ['ar' => 'سجّل المتطلب السابق الراسب في أقرب فصل', 'en' => 'Register the failed prerequisite in the nearest term', 'desc_ar' => 'كل فصل يمرّ بلا هذا المقرر يؤخّر كل ما يعتمد عليه.', 'desc_en' => 'Every term without this course delays everything built on it.', 'impact' => 'high', 'difficulty' => 'medium', 'time_ar' => 'عند التسجيل', 'time_en' => 'at registration'],
        'T-01' => ['ar' => 'تأكد من إغلاق رمز "غير مكتمل" للفصل السابق', 'en' => 'Clear the incomplete/absent code from last term', 'desc_ar' => 'رمز الغياب عن النهائي يتحوّل رسوباً إن لم يُسوَّ خلال المدة النظامية.', 'desc_en' => 'An absent-final code becomes a fail if not settled within the regulation window.', 'impact' => 'high', 'difficulty' => 'easy', 'time_ar' => 'فوري', 'time_en' => 'immediate'],
        'C-02' => ['ar' => 'عالج الغياب والدرجات معاً: التزم بالحضور أسبوعين', 'en' => 'Fix absence and marks together: two weeks of full attendance', 'desc_ar' => 'الاقتران بين الغياب والتراجع يعني أن الحضور هو أسرع رافعة.', 'desc_en' => 'When absence and falling marks move together, attendance is the fastest lever.', 'impact' => 'high', 'difficulty' => 'easy', 'time_ar' => 'أسبوعان', 'time_en' => '2 weeks'],
        'C-03' => ['ar' => 'تحدّث مع مرشدك أو مركز الإرشاد عمّا تغيّر', 'en' => 'Talk to your advisor or the counselling centre about what changed', 'desc_ar' => 'هبوط بعد تفوّق نادراً ما يكون أكاديمياً. الدعم سرّي ولا يُشارك مع أحد.', 'desc_en' => 'A drop after strong performance is rarely academic. Support is confidential.', 'impact' => 'high', 'difficulty' => 'easy', 'time_ar' => 'هذا الأسبوع', 'time_en' => 'this week'],
        'C-04' => ['ar' => 'غيّر طريقة المذاكرة لا كمّيتها', 'en' => 'Change how you study, not how much', 'desc_ar' => 'حضورك منتظم ودرجاتك ضعيفة: اطلب من الأستاذ أمثلة محلولة وتدرّب عليها.', 'desc_en' => 'You attend but score low: ask for worked examples and practise them.', 'impact' => 'medium', 'difficulty' => 'medium', 'time_ar' => '~3 ساعات أسبوعياً', 'time_en' => '~3 hours/week'],
        'P-01' => ['ar' => 'اعتمد خطة تعويض مع مرشدك', 'en' => 'Agree a catch-up plan with your advisor', 'desc_ar' => 'أنت متأخر عن الخطة بفصل أو أكثر؛ الصيفي والعبء الأعلى خياران يُقرّان مع المرشد.', 'desc_en' => 'You are a term or more behind plan; summer and a heavier load are options to agree with your advisor.', 'impact' => 'medium', 'difficulty' => 'medium', 'time_ar' => '~ساعة', 'time_en' => '~1 hour'],
        'P-02' => ['ar' => 'قدّم المقررات الأساسية المتأخرة على الاختيارية', 'en' => 'Put delayed core courses before electives', 'desc_ar' => 'المقرر الأساسي المتأخر يقفل مقررات لاحقة؛ الاختياري لا.', 'desc_en' => 'A delayed core course blocks later ones; an elective does not.', 'impact' => 'high', 'difficulty' => 'easy', 'time_ar' => 'عند التسجيل', 'time_en' => 'at registration'],
        'P-04' => ['ar' => 'أغلق الاختيارية المطلوبة قبل مستواك الحالي', 'en' => 'Close the required electives below your level', 'desc_ar' => 'الاختيارية المتراكمة تُطيل مدة التخرج بلا داع.', 'desc_en' => 'Piled-up electives stretch graduation for no reason.', 'impact' => 'low', 'difficulty' => 'easy', 'time_ar' => 'عند التسجيل', 'time_en' => 'at registration'],
    ],

    /* Indicators whose alerts go to the student only — §5.B.10 psych routing, §7.F. */
    'confidential' => ['C-01', 'C-03', 'C-05'],

    /* Gradebook column name hints (G-01/02/03 filter by name). */
    'column_hints' => [
        'midterm' => ['midterm', 'mid-term', 'mid term', 'نصفي', 'منتصف', 'الفصلي الأول', 'اختبار أول', 'first exam'],
        'quiz' => ['quiz', 'كويز', 'اختبار قصير', 'quizz'],
        'assignment' => ['assignment', 'واجب', 'homework', 'تكليف', 'project', 'مشروع'],
    ],
];
