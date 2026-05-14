import type { Alert, AlertPreference, AlertAnalyticsData, AlertType, AlertSeverity, AlertStatus, AlertRole } from '../types';

const alertTypes: { type: AlertType; titleAr: string; titleEn: string; descAr: string; descEn: string }[] = [
  { type: 'gpa_drop', titleAr: 'انخفاض المعدل التراكمي', titleEn: 'GPA Drop Detected', descAr: 'انخفض المعدل التراكمي بأكثر من 0.5 نقطة', descEn: 'GPA dropped by more than 0.5 points' },
  { type: 'attendance', titleAr: 'تراجع الحضور', titleEn: 'Attendance Flag', descAr: 'نسبة الحضور أقل من الحد المسموح', descEn: 'Attendance rate below threshold' },
  { type: 'deadline', titleAr: 'تذكير بموعد نهائي', titleEn: 'Deadline Reminder', descAr: 'اقتراب الموعد النهائي للتسجيل', descEn: 'Registration deadline approaching' },
  { type: 'academic_warning', titleAr: 'إنذار أكاديمي', titleEn: 'Academic Warning', descAr: 'الطالب تحت الإنذار الأكاديمي', descEn: 'Student under academic probation' },
  { type: 'registration', titleAr: 'مشكلة تسجيل', titleEn: 'Registration Issue', descAr: 'تعارض في الجدول أو مقرر محذوف', descEn: 'Schedule conflict or dropped course' },
  { type: 'financial', titleAr: 'تنبيه مالي', titleEn: 'Financial Alert', descAr: 'رسوم دراسية غير مسددة', descEn: 'Unpaid tuition fees detected' },
];

const severities: AlertSeverity[] = ['info', 'warning', 'urgent', 'critical'];
const statuses: AlertStatus[] = ['active', 'acknowledged', 'dismissed', 'escalated', 'resolved'];

const arabicNames = [
  'أحمد محمد عبدالله', 'فهد عبدالله قحطان', 'نورة سعد عتيب', 'سارة خالد شمر',
  'محمد علي دوسر', 'عبدالرحمن يوسف سعد', 'هند فيصل ناصر', 'ريم سلطان عنز',
  'خالد إبراهيم زاهر', 'لمى عمر محمد', 'ياسر حسن شاهر', 'دانة ماجد فهد',
  'عمر سامي رشيد', 'مها طارق جهاد', 'سلطان ناصر عمر', 'أمل بدر ثقيف',
  'بندر صالح أحمد', 'وفاء حمد قرن', 'تركي مشعل حازم', 'نوف عادل سالم',
];

const englishNames = [
  'Ahmed Mohammed Abdullah', 'Fahad Mohammed Qahtan', 'Noura Mohammed Otaib', 'Sarah Mohammed Shammar',
  'Mohammed Mohammed Dosar', 'Abdulrahman Mohammed Saad', 'Hind Mohammed Nasser', 'Reem Mohammed Anaz',
  'Khalid Mohammed Zaher', 'Lama Mohammede', 'Yasser Mohammed Shaher', 'Dana Mohammed Fahd',
  'Omar Mohammed Rasheed', 'Maha Mohammed Jihad', 'Sultan Mohammed Omar', 'Amal Mohammed Thaqif',
  'Bandar Mohammed Ahmad', 'Wafa Mohammed Qarn', 'Turki Mohammed Hazem', 'Nouf Mohammed Salem',
];

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return d.toISOString();
}

function generateEscalation(alertId: string, severity: AlertSeverity) {
  if (severity !== 'critical' && Math.random() > 0.3) return undefined;
  const base = new Date(randomDate(14));
  const stages: Alert['escalation'] = [
    {
      id: `${alertId}-e1`,
      stage: 'triggered',
      stageAr: 'تم التفعيل',
      stageEn: 'Triggered',
      timestamp: base.toISOString(),
      actor: 'النظام',
      actorEn: 'System',
      note: 'تم اكتشاف التنبيه تلقائيًا',
      noteEn: 'Alert detected automatically',
    },
    {
      id: `${alertId}-e2`,
      stage: 'advisor_notified',
      stageAr: 'إشعار المرشد',
      stageEn: 'Advisor Notified',
      timestamp: new Date(base.getTime() + 3600000).toISOString(),
      actor: 'د. عبدالله المحمد',
      actorEn: 'Dr. Abdullah Al-Mohammed',
      note: 'تم إرسال إشعار للمرشد الأكاديمي',
      noteEn: 'Academic advisor notified via email',
    },
  ];
  if (severity === 'critical' || severity === 'urgent') {
    stages.push({
      id: `${alertId}-e3`,
      stage: 'dean_notified',
      stageAr: 'إشعار العميد',
      stageEn: 'Dean Notified',
      timestamp: new Date(base.getTime() + 43200000).toISOString(),
      actor: 'د. سعد راشد',
      actorEn: 'Dr. Saad Rashed',
      note: 'تم تصعيد الحالة إلى عميد الكلية',
      noteEn: 'Case escalated to college dean',
    });
  }
  if (severity === 'critical' && Math.random() > 0.5) {
    stages.push({
      id: `${alertId}-e4`,
      stage: 'vp_notified',
      stageAr: 'إشعار وكيل الجامعة',
      stageEn: 'VP Notified',
      timestamp: new Date(base.getTime() + 64800000).toISOString(),
      actor: 'أ.د. فهد عمر',
      actorEn: 'Prof. Fahad Omar',
      note: 'تم إبلاغ وكيل الجامعة للشؤون الأكاديمية',
      noteEn: 'VP of Academic Affairs notified',
    });
  }
  if (Math.random() > 0.4) {
    stages.push({
      id: `${alertId}-e5`,
      stage: 'action_taken',
      stageAr: 'إجراء متخذ',
      stageEn: 'Action Taken',
      timestamp: new Date(base.getTime() + 86400000).toISOString(),
      actor: 'د. عبدالله المحمد',
      actorEn: 'Dr. Abdullah Al-Mohammed',
      note: 'تم التواصل مع الطالب وتحديد موعد',
      noteEn: 'Student contacted and meeting scheduled',
    });
  }
  if (Math.random() > 0.5) {
    stages.push({
      id: `${alertId}-e6`,
      stage: 'resolved',
      stageAr: 'تم الحل',
      stageEn: 'Resolved',
      timestamp: new Date(base.getTime() + 172800000).toISOString(),
      actor: 'د. عبدالله المحمد',
      actorEn: 'Dr. Abdullah Al-Mohammed',
      note: 'تم حل المشكلة ومتابعة الطالب',
      noteEn: 'Issue resolved and student follow-up scheduled',
    });
  }
  return stages;
}

export const mockAlerts: Alert[] = Array.from({ length: 55 }, (_, i) => {
  const template = alertTypes[i % alertTypes.length];
  const nameIdx = i % arabicNames.length;
  const severity = severities[i % 4];
  const status = statuses[i % statuses.length];
  const id = `ALT-${String(i + 1).padStart(4, '0')}`;
  return {
    id,
    type: template.type,
    severity,
    status,
    title: template.titleAr,
    titleEn: template.titleEn,
    description: template.descAr,
    descriptionEn: template.descEn,
    studentId: `STU-${String(1000 + i).padStart(6, '0')}`,
    studentName: arabicNames[nameIdx],
    studentNameEn: englishNames[nameIdx],
    timestamp: randomDate(30),
    escalation: generateEscalation(id, severity),
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

/* ─── Role-specific alerts ──────────────────────────────────────────── */

const now = new Date();
function daysAgo(d: number) { const t = new Date(now); t.setDate(t.getDate() - d); t.setHours(9, 30); return t.toISOString(); }
function hoursAgo(h: number) { return new Date(now.getTime() - h * 3600000).toISOString(); }

export const roleAlerts: Alert[] = [
  // ── Student alerts ──
  { id: 'RA-S01', type: 'attendance', severity: 'warning', status: 'active', targetRole: 'student',
    title: 'نسبة غيابك في مادة هياكل البيانات وصلت 15%', titleEn: 'Your absence in Data Structures reached 15%',
    description: 'تبقى لك 10% فقط قبل الحرمان. يرجى الانتظام بالحضور.', descriptionEn: 'Only 10% remaining before deprivation. Please attend regularly.',
    studentId: '443211517', studentName: 'ليان حمد الجريش', studentNameEn: 'Layan Al-Juraysh', timestamp: hoursAgo(2) },
  { id: 'RA-S02', type: 'deadline', severity: 'info', status: 'active', targetRole: 'student',
    title: 'موعد الحذف والإضافة ينتهي بعد 3 أيام', titleEn: 'Add/Drop deadline ends in 3 days',
    description: 'الموعد النهائي للحذف والإضافة هو ٢٢ أبريل ٢٠٢٦.', descriptionEn: 'Add/Drop deadline is April 22, 2026.',
    studentId: '443211517', studentName: 'ليان حمد الجريش', studentNameEn: 'Layan Al-Juraysh', timestamp: hoursAgo(5) },
  { id: 'RA-S03', type: 'gpa_drop', severity: 'urgent', status: 'active', targetRole: 'student',
    title: 'انخفاض المعدل التراكمي من 3.2 إلى 2.7', titleEn: 'GPA dropped from 3.2 to 2.7',
    description: 'انخفض معدلك بمقدار 0.5 نقطة. ننصحك بمراجعة مرشدك الأكاديمي.', descriptionEn: 'Your GPA dropped by 0.5 points. We recommend consulting your advisor.',
    studentId: '443211517', studentName: 'ليان حمد الجريش', studentNameEn: 'Layan Al-Juraysh', timestamp: daysAgo(1) },
  { id: 'RA-S04', type: 'financial', severity: 'warning', status: 'active', targetRole: 'student',
    title: 'رسوم الفصل الدراسي غير مسددة', titleEn: 'Semester tuition fees unpaid',
    description: 'يوجد مبلغ مستحق. يرجى السداد قبل نهاية فترة السماح.', descriptionEn: 'Outstanding balance detected. Please pay before the grace period ends.',
    studentId: '443211517', studentName: 'ليان حمد الجريش', studentNameEn: 'Layan Al-Juraysh', timestamp: daysAgo(2) },
  { id: 'RA-S05', type: 'registration', severity: 'info', status: 'acknowledged', targetRole: 'student',
    title: 'تم تسجيلك تلقائياً في مادة قواعد البيانات', titleEn: 'Auto-registered in Database Systems',
    description: 'تمت الجدولة بواسطة QMentor Agent بناءً على خطتك الدراسية.', descriptionEn: 'Scheduled by QMentor Agent based on your study plan.',
    studentId: '443211517', studentName: 'ليان حمد الجريش', studentNameEn: 'Layan Al-Juraysh', timestamp: daysAgo(3) },

  // ── Advisor alerts ──
  { id: 'RA-A01', type: 'attendance', severity: 'critical', status: 'active', targetRole: 'advisor',
    title: 'طالب وصل نسبة غياب 23% — خطر حرمان', titleEn: 'Student at 23% absence — deprivation risk',
    description: 'الطالب أحمد عبدالله في مقرر البرمجة المتقدمة وصل 23% غياب.', descriptionEn: 'Ahmed Abdullah in Advanced Programming reached 23% absence.',
    studentId: 'STU-001', studentName: 'أحمد محمد عبدالله', studentNameEn: 'Ahmed Mohammed Abdullah', timestamp: hoursAgo(1) },
  { id: 'RA-A02', type: 'academic_warning', severity: 'urgent', status: 'active', targetRole: 'advisor',
    title: '3 طلاب تحت الإنذار الأكاديمي الثاني', titleEn: '3 students under second academic warning',
    description: 'يحتاجون لمقابلة عاجلة قبل نهاية الأسبوع.', descriptionEn: 'They need an urgent meeting before end of week.',
    studentId: 'STU-002', studentName: 'فهد عبدالله قحطان', studentNameEn: 'Fahad Mohammed Qahtan', timestamp: hoursAgo(3) },
  { id: 'RA-A03', type: 'caseload', severity: 'warning', status: 'active', targetRole: 'advisor',
    title: 'لديك 12 حالة مفتوحة تحتاج متابعة', titleEn: 'You have 12 open cases needing follow-up',
    description: '5 حالات لم تتم مراجعتها منذ أكثر من أسبوع.', descriptionEn: '5 cases not reviewed for over a week.',
    studentId: '', studentName: '', studentNameEn: '', timestamp: hoursAgo(6) },
  { id: 'RA-A04', type: 'intervention', severity: 'info', status: 'acknowledged', targetRole: 'advisor',
    title: 'جلسة إرشاد مجدولة غداً مع نورة عتيب', titleEn: 'Advising session scheduled tomorrow with Noura Otaib',
    description: 'تم جدولتها تلقائياً بواسطة QMentor Agent بناءً على تحليل المخاطر.', descriptionEn: 'Auto-scheduled by QMentor Agent based on risk analysis.',
    studentId: 'STU-003', studentName: 'نورة سعد عتيب', studentNameEn: 'Noura Otaib', timestamp: daysAgo(1) },
  { id: 'RA-A05', type: 'gpa_drop', severity: 'warning', status: 'active', targetRole: 'advisor',
    title: 'انخفاض جماعي في معدلات طلاب مقرر CS301', titleEn: 'Collective GPA drop in CS301 students',
    description: '8 طلاب انخفض معدلهم بعد اختبار منتصف الفصل.', descriptionEn: '8 students GPA dropped after midterm exam.',
    studentId: '', studentName: '', studentNameEn: '', timestamp: daysAgo(2) },

  // ── Agent (AI) alerts ──
  { id: 'RA-G01', type: 'agent_action', severity: 'info', status: 'active', targetRole: 'agent',
    title: 'تم إرسال 15 تنبيه غياب تلقائي اليوم', titleEn: '15 absence alerts auto-sent today',
    description: 'جميع التنبيهات تم توجيهها للمرشدين الأكاديميين المعنيين.', descriptionEn: 'All alerts routed to relevant academic advisors.',
    studentId: '', studentName: '', studentNameEn: '', timestamp: hoursAgo(1) },
  { id: 'RA-G02', type: 'agent_action', severity: 'warning', status: 'active', targetRole: 'agent',
    title: 'فشل جدولة اجتماع Teams لـ 3 طلاب', titleEn: 'Failed to schedule Teams meeting for 3 students',
    description: 'تعذر الوصول إلى Microsoft Graph API. سيتم إعادة المحاولة.', descriptionEn: 'Microsoft Graph API unreachable. Will retry automatically.',
    studentId: '', studentName: '', studentNameEn: '', timestamp: hoursAgo(2) },
  { id: 'RA-G03', type: 'system', severity: 'info', status: 'acknowledged', targetRole: 'agent',
    title: 'تحليل المخاطر الأسبوعي مكتمل', titleEn: 'Weekly risk analysis complete',
    description: 'تم تحليل 1,247 طالب. 43 طالب في فئة خطر مرتفع.', descriptionEn: 'Analyzed 1,247 students. 43 students in high-risk category.',
    studentId: '', studentName: '', studentNameEn: '', timestamp: daysAgo(1) },
  { id: 'RA-G04', type: 'agent_action', severity: 'urgent', status: 'active', targetRole: 'agent',
    title: 'تصعيد تلقائي: 5 حالات لم يستجب لها المرشد', titleEn: 'Auto-escalation: 5 cases with no advisor response',
    description: 'مضى أكثر من 48 ساعة بدون استجابة. تم تصعيدها لرئيس القسم.', descriptionEn: 'Over 48 hours without response. Escalated to department head.',
    studentId: '', studentName: '', studentNameEn: '', timestamp: hoursAgo(4) },
  { id: 'RA-G05', type: 'system', severity: 'info', status: 'resolved', targetRole: 'agent',
    title: 'تم مزامنة بيانات 23 طالب من نظام القبول', titleEn: 'Synced data for 23 students from admission system',
    description: 'تحديث الملفات الأكاديمية بنجاح بدون تعارضات.', descriptionEn: 'Academic profiles updated successfully with no conflicts.',
    studentId: '', studentName: '', studentNameEn: '', timestamp: daysAgo(2) },

  // ── Admin alerts ──
  { id: 'RA-D01', type: 'system', severity: 'critical', status: 'active', targetRole: 'admin',
    title: 'ارتفاع معدل الطلاب المعرضين للحرمان بنسبة 18%', titleEn: 'Deprivation-risk students increased by 18%',
    description: 'مقارنة بالفصل الماضي، ارتفع عدد الطلاب المعرضين للحرمان في 4 كليات.', descriptionEn: 'Compared to last semester, at-risk students increased in 4 colleges.',
    studentId: '', studentName: '', studentNameEn: '', timestamp: hoursAgo(3) },
  { id: 'RA-D02', type: 'system', severity: 'warning', status: 'active', targetRole: 'admin',
    title: 'كلية الهندسة: أعلى معدل انسحاب هذا الفصل', titleEn: 'Engineering College: highest withdrawal rate this semester',
    description: '47 طالب سحبوا مقررات — 12% أعلى من المعتاد.', descriptionEn: '47 students withdrew from courses — 12% higher than usual.',
    studentId: '', studentName: '', studentNameEn: '', timestamp: daysAgo(1) },
  { id: 'RA-D03', type: 'system', severity: 'urgent', status: 'active', targetRole: 'admin',
    title: '8 مرشدين لم يسجلوا دخول منذ أسبوع', titleEn: '8 advisors inactive for over a week',
    description: 'مرشدون في كليات العلوم والآداب لم يتفاعلوا مع حالات الطلاب.', descriptionEn: 'Advisors in Science and Arts colleges not engaging with student cases.',
    studentId: '', studentName: '', studentNameEn: '', timestamp: hoursAgo(8) },
  { id: 'RA-D04', type: 'system', severity: 'info', status: 'acknowledged', targetRole: 'admin',
    title: 'تقرير الأداء شاهر جاهز للمراجعة', titleEn: 'Monthly performance report ready for review',
    description: 'يشمل معدلات الاستجابة ونسب التصعيد ومؤشرات الفعالية.', descriptionEn: 'Includes response rates, escalation ratios, and effectiveness indicators.',
    studentId: '', studentName: '', studentNameEn: '', timestamp: daysAgo(2) },
  { id: 'RA-D05', type: 'intervention', severity: 'info', status: 'resolved', targetRole: 'admin',
    title: 'حملة التوعية بالغياب حققت انخفاض 8% في الغياب', titleEn: 'Absence awareness campaign reduced absences by 8%',
    description: 'الحملة التي أطلقها النظام الأسبوع الماضي أثرت إيجابياً على 320 طالب.', descriptionEn: 'Campaign launched last week positively impacted 320 students.',
    studentId: '', studentName: '', studentNameEn: '', timestamp: daysAgo(4) },
];

export const defaultPreferences: AlertPreference[] = [
  { type: 'gpa_drop', labelAr: 'انخفاض المعدل', labelEn: 'GPA Drop', enabled: true, channels: { in_app: true, email: true, sms: false, push: true }, threshold: 0.5 },
  { type: 'attendance', labelAr: 'الحضور', labelEn: 'Attendance', enabled: true, channels: { in_app: true, email: true, sms: true, push: true }, threshold: 75 },
  { type: 'deadline', labelAr: 'المواعيد النهائية', labelEn: 'Deadlines', enabled: true, channels: { in_app: true, email: false, sms: false, push: true } },
  { type: 'academic_warning', labelAr: 'الإنذارات الأكاديمية', labelEn: 'Academic Warnings', enabled: true, channels: { in_app: true, email: true, sms: true, push: true }, threshold: 2.0 },
  { type: 'registration', labelAr: 'التسجيل', labelEn: 'Registration', enabled: true, channels: { in_app: true, email: false, sms: false, push: false } },
  { type: 'financial', labelAr: 'المالية', labelEn: 'Financial', enabled: false, channels: { in_app: true, email: true, sms: false, push: false } },
];

export const analyticsData: AlertAnalyticsData = {
  byType: [
    { type: 'انخفاض المعدل', typeEn: 'GPA Drop', count: 145 },
    { type: 'الحضور', typeEn: 'Attendance', count: 203 },
    { type: 'المواعيد', typeEn: 'Deadlines', count: 89 },
    { type: 'إنذار أكاديمي', typeEn: 'Academic Warning', count: 67 },
    { type: 'التسجيل', typeEn: 'Registration', count: 112 },
    { type: 'المالية', typeEn: 'Financial', count: 34 },
  ],
  severityOverTime: [
    { month: 'سبتمبر', info: 45, warning: 23, urgent: 10, critical: 8 },
    { month: 'أكتوبر', info: 52, warning: 31, urgent: 14, critical: 12 },
    { month: 'نوفمبر', info: 38, warning: 28, urgent: 11, critical: 15 },
    { month: 'ديسمبر', info: 61, warning: 35, urgent: 16, critical: 9 },
    { month: 'يناير', info: 49, warning: 42, urgent: 19, critical: 18 },
    { month: 'فبراير', info: 55, warning: 38, urgent: 13, critical: 11 },
    { month: 'مارس', info: 43, warning: 29, urgent: 9, critical: 7 },
  ],
  responseTime: [
    { range: 'أقل من ساعة', rangeEn: '< 1 hour', count: 120 },
    { range: '١-٤ ساعات', rangeEn: '1-4 hours', count: 85 },
    { range: '٤-٢٤ ساعة', rangeEn: '4-24 hours', count: 62 },
    { range: '١-٣ أيام', rangeEn: '1-3 days', count: 38 },
    { range: 'أكثر من ٣ أيام', rangeEn: '> 3 days', count: 15 },
  ],
  topIndicators: [
    { indicator: 'غياب متكرر', indicatorEn: 'Frequent Absences', count: 156 },
    { indicator: 'انخفاض المعدل', indicatorEn: 'GPA Decline', count: 134 },
    { indicator: 'تأخر التسجيل', indicatorEn: 'Late Registration', count: 98 },
    { indicator: 'رسوب مادة', indicatorEn: 'Course Failure', count: 87 },
    { indicator: 'سحب مادة', indicatorEn: 'Course Withdrawal', count: 72 },
    { indicator: 'إنذار أول', indicatorEn: 'First Warning', count: 65 },
    { indicator: 'مشكلة مالية', indicatorEn: 'Financial Issue', count: 43 },
    { indicator: 'تعارض جدول', indicatorEn: 'Schedule Conflict', count: 31 },
  ],
  resolutionRates: [
    { month: 'سبتمبر', resolved: 62, pending: 28, escalated: 10 },
    { month: 'أكتوبر', resolved: 58, pending: 32, escalated: 14 },
    { month: 'نوفمبر', resolved: 71, pending: 22, escalated: 11 },
    { month: 'ديسمبر', resolved: 65, pending: 25, escalated: 13 },
    { month: 'يناير', resolved: 54, pending: 35, escalated: 19 },
    { month: 'فبراير', resolved: 69, pending: 24, escalated: 12 },
    { month: 'مارس', resolved: 74, pending: 20, escalated: 8 },
  ],
};
