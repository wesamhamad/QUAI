import { useState } from 'react';
import {
  FileText, CheckCircle2, XCircle, Edit3, User, Calendar,
  TrendingUp, TrendingDown, AlertTriangle, Clock,
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ReportStatus = 'pending' | 'approved' | 'rejected';
type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
type ReportType = 'weekly' | 'monthly';

interface KeyChange {
  icon: 'up' | 'down' | 'warning';
  textAr: string;
  textEn: string;
}

interface StudentReport {
  id: string;
  studentName: string;
  studentNameAr: string;
  studentId: string;
  major: string;
  majorAr: string;
  riskLevel: RiskLevel;
  reportDate: string;
  reportType: ReportType;
  summaryAr: string;
  summaryEn: string;
  keyChanges: KeyChange[];
  recommendationAr: string;
  recommendationEn: string;
  status: ReportStatus;
}

type FilterTab = 'all' | 'pending' | 'approved' | 'rejected';

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const initialReports: StudentReport[] = [
  {
    id: 'rpt-001',
    studentName: 'Mohammed Mohammed Nasser',
    studentNameAr: 'محمد محمد ناصر',
    studentId: '441012345',
    major: 'Computer Science',
    majorAr: 'علوم الحاسب',
    riskLevel: 'high',
    reportDate: '2026-04-13',
    reportType: 'weekly',
    summaryAr: 'انخفض معدل الطالب التراكمي بمقدار 0.3 نقطة خلال الأسبوع الماضي بسبب أداء ضعيف في اختبارات منتصف الفصل. كما لوحظ غياب متكرر في مقرر هياكل البيانات.',
    summaryEn: 'Student\'s GPA dropped by 0.3 points over the past week due to poor midterm exam performance. Frequent absences were also noted in Data Structures course.',
    keyChanges: [
      { icon: 'down', textAr: 'انخفاض المعدل التراكمي بمقدار 0.3', textEn: 'GPA dropped by 0.3' },
      { icon: 'warning', textAr: 'غياب 4 محاضرات في هياكل البيانات', textEn: '4 absences in Data Structures' },
      { icon: 'down', textAr: 'درجة اختبار منتصف الفصل أقل من المتوقع', textEn: 'Midterm score below expectations' },
    ],
    recommendationAr: 'جدولة اجتماع عاجل مع الطالب لمناقشة خطة تحسين أكاديمي وإحالته إلى مركز الدعم الأكاديمي.',
    recommendationEn: 'Schedule an urgent meeting with the student to discuss an academic improvement plan and refer to the Academic Support Center.',
    status: 'pending',
  },
  {
    id: 'rpt-002',
    studentName: 'Sara Saad',
    studentNameAr: 'سارة سعد',
    studentId: '441023456',
    major: 'Information Systems',
    majorAr: 'نظم المعلومات',
    riskLevel: 'medium',
    reportDate: '2026-04-12',
    reportType: 'weekly',
    summaryAr: 'تحسن ملحوظ في حضور الطالبة خلال الأسبوعين الماضيين. ومع ذلك، لا تزال درجات الواجبات في مقرر قواعد البيانات متدنية.',
    summaryEn: 'Notable improvement in attendance over the past two weeks. However, assignment scores in Database Systems course remain low.',
    keyChanges: [
      { icon: 'up', textAr: 'تحسن الحضور بنسبة 20%', textEn: 'Attendance improved by 20%' },
      { icon: 'down', textAr: 'درجات الواجبات في قواعد البيانات متدنية', textEn: 'Low assignment scores in Database Systems' },
    ],
    recommendationAr: 'توجيه الطالبة للاستفادة من جلسات التدريس المساند في مقرر قواعد البيانات.',
    recommendationEn: 'Direct student to peer tutoring sessions for Database Systems course.',
    status: 'pending',
  },
  {
    id: 'rpt-003',
    studentName: 'Abdullah Qahtan',
    studentNameAr: 'عبدالله قحطان',
    studentId: '441034567',
    major: 'Software Engineering',
    majorAr: 'هندسة البرمجيات',
    riskLevel: 'critical',
    reportDate: '2026-04-10',
    reportType: 'monthly',
    summaryAr: 'الطالب في خطر أكاديمي حرج. المعدل التراكمي أقل من 2.0 للفصل الثاني على التوالي. لم يحضر أي محاضرة في الأسبوعين الماضيين.',
    summaryEn: 'Student is in critical academic danger. GPA below 2.0 for the second consecutive semester. Has not attended any lectures in the past two weeks.',
    keyChanges: [
      { icon: 'down', textAr: 'المعدل التراكمي أقل من 2.0', textEn: 'GPA below 2.0' },
      { icon: 'warning', textAr: 'غياب كامل لمدة أسبوعين', textEn: 'Complete absence for 2 weeks' },
      { icon: 'warning', textAr: 'فصل ثانٍ بإنذار أكاديمي', textEn: 'Second semester on academic probation' },
    ],
    recommendationAr: 'إحالة فورية لعمادة شؤون الطلاب والإرشاد النفسي. التواصل مع ولي الأمر.',
    recommendationEn: 'Immediate referral to Student Affairs and psychological counseling. Contact guardian.',
    status: 'pending',
  },
  {
    id: 'rpt-004',
    studentName: 'Noura Shammar',
    studentNameAr: 'نورة شمر',
    studentId: '441045678',
    major: 'Computer Science',
    majorAr: 'علوم الحاسب',
    riskLevel: 'low',
    reportDate: '2026-04-08',
    reportType: 'weekly',
    summaryAr: 'أداء الطالبة مستقر وممتاز. حققت أعلى درجة في اختبار منتصف فصل البرمجة الكائنية. ينصح بترشيحها لبرنامج التدريس المساند.',
    summaryEn: 'Student performance is stable and excellent. Achieved the highest midterm score in Object-Oriented Programming. Recommended for peer tutoring program nomination.',
    keyChanges: [
      { icon: 'up', textAr: 'أعلى درجة في اختبار البرمجة الكائنية', textEn: 'Top score in OOP midterm' },
      { icon: 'up', textAr: 'حضور كامل 100%', textEn: '100% attendance' },
    ],
    recommendationAr: 'ترشيح الطالبة لبرنامج التدريس المساند كمُعلمة أقران.',
    recommendationEn: 'Nominate student for peer tutoring program as a tutor.',
    status: 'approved',
  },
  {
    id: 'rpt-005',
    studentName: 'Fahad Dosar',
    studentNameAr: 'فهد دوسر',
    studentId: '441056789',
    major: 'Information Technology',
    majorAr: 'تقنية المعلومات',
    riskLevel: 'medium',
    reportDate: '2026-04-06',
    reportType: 'monthly',
    summaryAr: 'تحسن تدريجي في الأداء الأكاديمي بعد تطبيق خطة التحسين. المعدل ارتفع من 2.3 إلى 2.6 هذا الفصل.',
    summaryEn: 'Gradual improvement in academic performance after applying the improvement plan. GPA rose from 2.3 to 2.6 this semester.',
    keyChanges: [
      { icon: 'up', textAr: 'ارتفاع المعدل من 2.3 إلى 2.6', textEn: 'GPA increased from 2.3 to 2.6' },
      { icon: 'up', textAr: 'تحسن في درجات الواجبات', textEn: 'Improved assignment scores' },
      { icon: 'warning', textAr: 'لا يزال يحتاج متابعة في الرياضيات', textEn: 'Still needs follow-up in Mathematics' },
    ],
    recommendationAr: 'الاستمرار في خطة التحسين الحالية مع متابعة أسبوعية لمقرر الرياضيات.',
    recommendationEn: 'Continue current improvement plan with weekly follow-up for Mathematics course.',
    status: 'approved',
  },
  {
    id: 'rpt-006',
    studentName: 'Khalid Otaib',
    studentNameAr: 'خالد عتيب',
    studentId: '441067890',
    major: 'Software Engineering',
    majorAr: 'هندسة البرمجيات',
    riskLevel: 'low',
    reportDate: '2026-04-05',
    reportType: 'weekly',
    summaryAr: 'أداء الطالب جيد بشكل عام. التوصية السابقة بتغيير مسار التخصص تم رفضها لأن الطالب يرغب بالاستمرار في تخصصه الحالي.',
    summaryEn: 'Student performance is generally good. Previous recommendation to change major was rejected as the student wishes to continue in their current major.',
    keyChanges: [
      { icon: 'up', textAr: 'أداء مستقر في جميع المقررات', textEn: 'Stable performance across all courses' },
    ],
    recommendationAr: 'تغيير التخصص إلى علوم الحاسب بناءً على نتائج التحليل.',
    recommendationEn: 'Change major to Computer Science based on analysis results.',
    status: 'rejected',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const riskColors: Record<RiskLevel, string> = {
  critical: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
  high: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  medium: 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400',
  low: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
};

const statusColors: Record<ReportStatus, string> = {
  pending: 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400',
  approved: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
  rejected: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
};

const changeIcons = {
  up: TrendingUp,
  down: TrendingDown,
  warning: AlertTriangle,
};

const changeIconColors = {
  up: 'text-success-500',
  down: 'text-error-500',
  warning: 'text-warning-500',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function StudentReports() {
  const { t } = useLanguage();

  const [filter, setFilter] = useState<FilterTab>('all');
  const [reports, setReports] = useState<StudentReport[]>(initialReports);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  /* ---- filter logic ---- */
  const filteredReports = filter === 'all'
    ? reports
    : reports.filter(r => r.status === filter);

  const counts: Record<FilterTab, number> = {
    all: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    approved: reports.filter(r => r.status === 'approved').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
  };

  /* ---- actions ---- */
  const updateStatus = (id: string, status: ReportStatus, newRec?: string) => {
    setReports(prev => prev.map(r =>
      r.id === id
        ? {
            ...r,
            status,
            ...(newRec ? { recommendationAr: newRec, recommendationEn: newRec } : {}),
          }
        : r,
    ));
    setEditingId(null);
    setEditText('');
  };

  const startEdit = (report: StudentReport) => {
    setEditingId(report.id);
    setEditText(t(report.recommendationAr, report.recommendationEn));
  };

  /* ---- risk / status labels ---- */
  const riskLabel = (level: RiskLevel) => {
    const labels: Record<RiskLevel, string> = {
      critical: t('حرج', 'Critical'),
      high: t('مرتفع', 'High'),
      medium: t('متوسط', 'Medium'),
      low: t('منخفض', 'Low'),
    };
    return labels[level];
  };

  const statusLabel = (status: ReportStatus) => {
    const labels: Record<ReportStatus, string> = {
      pending: t('قيد المراجعة', 'Pending Review'),
      approved: t('تمت الموافقة', 'Approved'),
      rejected: t('مرفوض', 'Rejected'),
    };
    return labels[status];
  };

  const filterTabs: { key: FilterTab; labelAr: string; labelEn: string }[] = [
    { key: 'all', labelAr: 'الكل', labelEn: 'All' },
    { key: 'pending', labelAr: 'قيد المراجعة', labelEn: 'Pending Review' },
    { key: 'approved', labelAr: 'تمت الموافقة', labelEn: 'Approved' },
    { key: 'rejected', labelAr: 'مرفوض', labelEn: 'Rejected' },
  ];

  return (
    <div className="space-y-6">
      {/* ---- Header ---- */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-sa-100 dark:bg-sa-500/20">
          <FileText className="w-5 h-5 text-sa-600 dark:text-sa-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('تقارير الطلاب المُنشأة بالذكاء الاصطناعي', 'AI-Generated Student Reports')}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('مراجعة واعتماد التقارير الأسبوعية وشاهرة', 'Review and approve weekly & monthly reports')}
          </p>
        </div>
      </div>

      {/* ---- Filter Bar ---- */}
      <div className="flex flex-wrap gap-2">
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-sa-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {t(tab.labelAr, tab.labelEn)}
            <span className={`ms-1.5 text-xs ${
              filter === tab.key ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'
            }`}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* ---- Report Cards ---- */}
      {filteredReports.length === 0 ? (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500 text-sm">
          {t('لا توجد تقارير في هذه الفئة', 'No reports in this category')}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map(report => (
            <div
              key={report.id}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4"
            >
              {/* ---- Card header: student info + status ---- */}
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t(report.studentNameAr, report.studentName)}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {report.studentId}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">|</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {t(report.majorAr, report.major)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Risk badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${riskColors[report.riskLevel]}`}>
                    {riskLabel(report.riskLevel)}
                  </span>
                  {/* Status badge */}
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusColors[report.status]}`}>
                    {statusLabel(report.status)}
                  </span>
                </div>
              </div>

              {/* ---- Date & Type ---- */}
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {report.reportDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {report.reportType === 'weekly' ? t('أسبوعي', 'Weekly') : t('شهري', 'Monthly')}
                </span>
              </div>

              {/* ---- Narrative summary ---- */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3.5">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {t(report.summaryAr, report.summaryEn)}
                </p>
              </div>

              {/* ---- Key changes ---- */}
              <div>
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {t('التغييرات الرئيسية', 'Key Changes')}
                </h4>
                <ul className="space-y-1.5">
                  {report.keyChanges.map((change, idx) => {
                    const ChangeIcon = changeIcons[change.icon];
                    return (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                        <ChangeIcon className={`w-4 h-4 shrink-0 ${changeIconColors[change.icon]}`} />
                        {t(change.textAr, change.textEn)}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* ---- AI Recommendation ---- */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {t('توصية الذكاء الاصطناعي', 'AI Recommendation')}
                </h4>
                {editingId === report.id ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white px-3 py-2 focus:ring-2 focus:ring-sa-500 focus:border-sa-500 outline-none resize-none"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateStatus(report.id, 'approved', editText)}
                        className="px-3 py-1.5 rounded-lg bg-success-600 text-white text-xs font-medium hover:bg-success-700 transition-colors"
                      >
                        {t('حفظ واعتماد', 'Save & Approve')}
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditText(''); }}
                        className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-gray-200 text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                      >
                        {t('إلغاء', 'Cancel')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-sa-700 dark:text-sa-300 bg-sa-50 dark:bg-sa-500/10 rounded-lg px-3 py-2.5">
                    {t(report.recommendationAr, report.recommendationEn)}
                  </p>
                )}
              </div>

              {/* ---- Action buttons (only for pending) ---- */}
              {report.status === 'pending' && editingId !== report.id && (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => updateStatus(report.id, 'approved')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-success-600 text-white text-xs font-medium hover:bg-success-700 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {t('قبول التوصية', 'Accept')}
                  </button>
                  <button
                    onClick={() => startEdit(report)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-info-600 text-white text-xs font-medium hover:bg-info-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    {t('تعديل', 'Edit')}
                  </button>
                  <button
                    onClick={() => updateStatus(report.id, 'rejected')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-error-600 text-white text-xs font-medium hover:bg-error-700 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    {t('رفض', 'Reject')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
