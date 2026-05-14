import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, Clock, TrendingUp, CheckCircle2, Calendar, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import {
  useStudentProfile,
  useAbsences,
  useAdvisorInfo,
  useCurrentCourses,
  useWarnings,
  useHaltReasons,
  usePenalties,
} from '../../hooks/useStudentData';

interface ActionItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTimeAr: string;
  estimatedTimeEn: string;
  indicator: string;
}

// Mock fallback used when no real data is available
const mockActions: ActionItem[] = [
  {
    id: 'mock-1',
    titleAr: 'حضور جميع المحاضرات المتبقية',
    titleEn: 'Attend all remaining lectures',
    descriptionAr: 'احرص على حضور جميع المحاضرات المتبقية لتجنب الحرمان.',
    descriptionEn: 'Attend all remaining lectures to avoid being barred.',
    impact: 'high',
    difficulty: 'easy',
    estimatedTimeAr: 'مستمر',
    estimatedTimeEn: '~ongoing',
    indicator: 'A-01',
  },
  {
    id: 'mock-2',
    titleAr: 'مراجعة الواجبات المعلقة',
    titleEn: 'Review pending assignments',
    descriptionAr: 'سلّم الواجبات المعلقة في أقرب وقت لتحسين درجاتك.',
    descriptionEn: 'Submit pending assignments soon to improve your grades.',
    impact: 'high',
    difficulty: 'medium',
    estimatedTimeAr: '~ساعتان',
    estimatedTimeEn: '~2 hours',
    indicator: 'S-01',
  },
  {
    id: 'mock-3',
    titleAr: 'مقابلة المرشد الأكاديمي',
    titleEn: 'Meet with your academic advisor',
    descriptionAr: 'ناقش وضعك الأكاديمي للحصول على توجيه مخصص.',
    descriptionEn: 'Discuss your academic standing for personalized guidance.',
    impact: 'high',
    difficulty: 'easy',
    estimatedTimeAr: '~30 دقيقة',
    estimatedTimeEn: '~30 min',
    indicator: 'overall',
  },
];

const impactConfig = {
  high: {
    labelAr: 'عالي',
    labelEn: 'High',
    classes: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
  },
  medium: {
    labelAr: 'متوسط',
    labelEn: 'Medium',
    classes: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  },
  low: {
    labelAr: 'منخفض',
    labelEn: 'Low',
    classes: 'bg-sa-100 text-sa-700 dark:bg-sa-900/30 dark:text-sa-400',
  },
};

const difficultyConfig = {
  easy: {
    labelAr: 'سهل',
    labelEn: 'Easy',
    classes: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  medium: {
    labelAr: 'متوسط',
    labelEn: 'Medium',
    classes: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  hard: {
    labelAr: 'صعب',
    labelEn: 'Hard',
    classes: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
};

interface AbsenceCourse {
  cource_code?: string;
  cource_name?: string;
  course_code?: string;
  course_name?: string;
  absence_all_percent?: number | string;
}

interface CurrentCourse {
  course_code?: string;
  course_name?: string;
  employee_name?: string;
}

interface AdvisorInfo {
  instructor_name?: string;
  work_email?: string;
}

interface ProfileData {
  profile?: {
    academic?: {
      cumulative_gpa?: number | string;
      last_recorded_gpa?: number | string;
      academic_status?: string;
      remaining_hours_to_graduate?: number;
      expected_graduation_semester?: string;
    };
  };
  academic?: {
    cumulative_gpa?: number | string;
    last_recorded_gpa?: number | string;
    academic_status?: string;
  };
}

interface WarningsResponse {
  warning_count?: number;
}

interface HaltRecord {
  halted_reason?: string;
  entry_date?: string;
}

interface PenaltyRecord {
  penalty_desc?: string;
  semester?: string;
}

/** Derive concrete, ranked action items from the student's real data.
 *  Priority order: halt reasons → penalties → academic warnings → high-absence
 *  courses → low GPA → advisor follow-up → study habits.
 *  Returns null when there's not enough real data to build a meaningful plan. */
function buildActionsFromData(
  profile: ProfileData | null,
  absences: AbsenceCourse[] | null,
  advisor: AdvisorInfo | null,
  courses: CurrentCourse[] | null,
  warnings: WarningsResponse | null,
  halts: HaltRecord[] | null,
  penalties: PenaltyRecord[] | null,
): ActionItem[] | null {
  const actions: ActionItem[] = [];

  // 0a. Halt reasons → most urgent
  for (const h of (halts ?? []).slice(0, 2)) {
    const date = String(h.entry_date ?? '').slice(0, 10);
    actions.push({
      id: `halt-${date}`,
      titleAr: 'مراجعة عاجلة لسبب الإيقاف الأكاديمي',
      titleEn: 'Urgent: address academic halt reason',
      descriptionAr: `سبب الإيقاف: ${h.halted_reason || 'غير محدد'}${date ? ` (تاريخ ${date})` : ''}. تواصل مع شؤون الطلاب فوراً.`,
      descriptionEn: `Halt reason: ${h.halted_reason || 'unspecified'}${date ? ` (logged ${date})` : ''}. Contact student affairs immediately.`,
      impact: 'high',
      difficulty: 'medium',
      estimatedTimeAr: 'فوري',
      estimatedTimeEn: 'immediate',
      indicator: 'AC-01',
    });
  }

  // 0b. Penalties → very high priority
  for (const p of (penalties ?? []).slice(0, 2)) {
    actions.push({
      id: `penalty-${p.semester ?? p.penalty_desc}`,
      titleAr: 'استئناف العقوبة التأديبية',
      titleEn: 'Appeal disciplinary penalty',
      descriptionAr: `العقوبة: ${p.penalty_desc || 'غير محدد'}${p.semester ? ` (الفصل ${p.semester})` : ''}. راجع لجنة الانضباط الطلابي خلال أسبوع.`,
      descriptionEn: `Penalty: ${p.penalty_desc || 'unspecified'}${p.semester ? ` (semester ${p.semester})` : ''}. Engage the student conduct committee within a week.`,
      impact: 'high',
      difficulty: 'medium',
      estimatedTimeAr: '~أسبوع',
      estimatedTimeEn: '~1 week',
      indicator: 'AC-01',
    });
  }

  // Resolve GPA from either v3 nested shape or flat fallback
  const academic = profile?.profile?.academic ?? profile?.academic ?? null;
  const gpa = academic
    ? parseFloat(String(academic.last_recorded_gpa ?? academic.cumulative_gpa ?? '0'))
    : 0;
  const academicStatus = (academic?.academic_status ?? '').toString();
  const warningCount = Number(warnings?.warning_count ?? 0);

  // 0c. Academic warnings → escalating priority
  if (warningCount > 0) {
    actions.push({
      id: 'warnings',
      titleAr: `معالجة الإنذارات الأكاديمية (${warningCount})`,
      titleEn: `Address ${warningCount} academic warning${warningCount > 1 ? 's' : ''}`,
      descriptionAr: warningCount >= 2
        ? `لديك ${warningCount} إنذارات. الإنذار الثالث يستوجب الفصل النهائي — جلسة عاجلة مع المرشد ضرورية.`
        : `لديك إنذار أكاديمي. ارفع معدلك هذا الفصل لتجنب التراكم.`,
      descriptionEn: warningCount >= 2
        ? `You have ${warningCount} warnings. A third triggers final dismissal — an urgent advisor session is required.`
        : `You have one academic warning. Raise your semester GPA this term to prevent it from accumulating.`,
      impact: 'high',
      difficulty: 'medium',
      estimatedTimeAr: '~ساعة',
      estimatedTimeEn: '~1 hour',
      indicator: 'AC-01',
    });
  }

  // 1. High-absence courses → "attend lectures of X" actions (top 2)
  const highAbsenceCourses = (absences ?? [])
    .map(c => ({
      code: c.cource_code ?? c.course_code ?? '',
      name: c.cource_name ?? c.course_name ?? '',
      pct: parseFloat(String(c.absence_all_percent ?? '0')) || 0,
    }))
    .filter(c => c.pct >= 10)
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 2);

  for (const course of highAbsenceCourses) {
    actions.push({
      id: `absence-${course.code}`,
      titleAr: `حضور جميع محاضرات ${course.code} المتبقية`,
      titleEn: `Attend all remaining ${course.code} lectures`,
      descriptionAr: `نسبة غيابك في ${course.name || course.code} ${course.pct.toFixed(0)}٪. الحد الأقصى للحرمان عادة 25٪ — حضور المحاضرات المتبقية ضروري.`,
      descriptionEn: `Your absence rate in ${course.name || course.code} is ${course.pct.toFixed(0)}%. The barring threshold is typically 25% — attending remaining lectures is essential.`,
      impact: course.pct >= 20 ? 'high' : 'medium',
      difficulty: 'easy',
      estimatedTimeAr: 'مستمر',
      estimatedTimeEn: '~ongoing',
      indicator: 'A-01',
    });
  }

  // 2. Low GPA → review materials + advisor meeting
  if (gpa > 0 && gpa < 3.0) {
    actions.push({
      id: 'gpa-review',
      titleAr: 'مراجعة محتوى الأسبوع لجميع المقررات',
      titleEn: 'Review this week’s content across all courses',
      descriptionAr: `معدلك التراكمي ${gpa.toFixed(2)}. خصص ساعة لمراجعة محاضرات الأسبوع لكل مقرر — المراجعة الدورية ترفع المعدل بشكل ملموس.`,
      descriptionEn: `Your cumulative GPA is ${gpa.toFixed(2)}. Spend an hour per course reviewing this week's lectures — consistent review measurably improves your grade.`,
      impact: gpa < 2.0 ? 'high' : 'medium',
      difficulty: 'medium',
      estimatedTimeAr: `~${courses?.length || 3} ساعات`,
      estimatedTimeEn: `~${courses?.length || 3} hours`,
      indicator: 'G-04',
    });
  }

  // 3. Academic warning → urgent advisor meeting
  const isWarned = /warning|probation|إنذار|حرج/i.test(academicStatus);
  if (isWarned) {
    actions.push({
      id: 'academic-warning',
      titleAr: 'مقابلة عاجلة مع المرشد الأكاديمي',
      titleEn: 'Urgent meeting with academic advisor',
      descriptionAr: `وضعك الأكاديمي الحالي يستوجب جلسة إرشاد. ${advisor?.instructor_name ? `مرشدك: ${advisor.instructor_name}.` : 'احجز موعدك في أقرب وقت.'}`,
      descriptionEn: `Your current academic standing requires a counseling session. ${advisor?.instructor_name ? `Your advisor: ${advisor.instructor_name}.` : 'Book a meeting as soon as possible.'}`,
      impact: 'high',
      difficulty: 'easy',
      estimatedTimeAr: '~30 دقيقة',
      estimatedTimeEn: '~30 min',
      indicator: 'AC-01',
    });
  }

  // 4. Standard advisor meeting (always show if we know who the advisor is)
  if (advisor?.instructor_name) {
    actions.push({
      id: 'advisor-meeting',
      titleAr: `مقابلة المرشد الأكاديمي ${advisor.instructor_name}`,
      titleEn: `Meet with your academic advisor ${advisor.instructor_name}`,
      descriptionAr: `ناقش خطتك الدراسية والمواد المتبقية مع مرشدك. ${advisor.work_email ? `للتواصل: ${advisor.work_email}` : ''}`,
      descriptionEn: `Discuss your study plan and remaining courses. ${advisor.work_email ? `Contact: ${advisor.work_email}` : ''}`,
      impact: gpa > 0 && gpa < 3.0 ? 'high' : 'medium',
      difficulty: 'easy',
      estimatedTimeAr: '~30 دقيقة',
      estimatedTimeEn: '~30 min',
      indicator: 'overall',
    });
  }

  // 5. Engagement nudge — tied to first current course
  const firstCourse = (courses ?? [])[0];
  if (firstCourse?.course_code) {
    actions.push({
      id: `quiz-${firstCourse.course_code}`,
      titleAr: `إكمال اختبارات التدريب لمقرر ${firstCourse.course_code}`,
      titleEn: `Complete practice quizzes for ${firstCourse.course_code}`,
      descriptionAr: 'التدريب الذاتي على الاختبارات القصيرة يعزز الاحتفاظ بالمعلومة قبل النصفي.',
      descriptionEn: 'Self-paced quiz practice strengthens retention before midterms.',
      impact: 'medium',
      difficulty: 'easy',
      estimatedTimeAr: '~ساعة',
      estimatedTimeEn: '~1 hour',
      indicator: 'G-02',
    });
  }

  return actions.length > 0 ? actions : null;
}

export default function ActionPlan() {
  const { t } = useLanguage();
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const profileResult = useStudentProfile<ProfileData | null>(null);
  const absencesResult = useAbsences<AbsenceCourse[] | null>(null);
  const advisorResult = useAdvisorInfo<AdvisorInfo | null>(null);
  const coursesResult = useCurrentCourses<CurrentCourse[] | null>(null);
  const warningsResult = useWarnings<WarningsResponse | null>(null);
  const haltsResult = useHaltReasons<HaltRecord[] | null>(null);
  const penaltiesResult = usePenalties<PenaltyRecord[] | null>(null);

  const sources = [
    profileResult.source,
    absencesResult.source,
    advisorResult.source,
    coursesResult.source,
    warningsResult.source,
    haltsResult.source,
    penaltiesResult.source,
  ];
  const overallSource = sources.includes('api') ? ('api' as const) : ('mock' as const);

  const actions = useMemo<ActionItem[]>(() => {
    const derived = buildActionsFromData(
      profileResult.source === 'api' ? profileResult.data : null,
      absencesResult.source === 'api' ? absencesResult.data : null,
      advisorResult.source === 'api' ? advisorResult.data : null,
      coursesResult.source === 'api' ? coursesResult.data : null,
      warningsResult.source === 'api' ? warningsResult.data : null,
      haltsResult.source === 'api' ? haltsResult.data : null,
      penaltiesResult.source === 'api' ? penaltiesResult.data : null,
    );
    return derived ?? mockActions;
  }, [
    profileResult.source, profileResult.data,
    absencesResult.source, absencesResult.data,
    advisorResult.source, advisorResult.data,
    coursesResult.source, coursesResult.data,
    warningsResult.source, warningsResult.data,
    haltsResult.source, haltsResult.data,
    penaltiesResult.source, penaltiesResult.data,
  ]);

  // Risk badge derived from GPA when available
  const academic = profileResult.data?.profile?.academic ?? profileResult.data?.academic ?? null;
  const gpa = academic ? parseFloat(String(academic.last_recorded_gpa ?? academic.cumulative_gpa ?? '0')) : 0;
  const riskLevel: 'low' | 'medium' | 'high' =
    gpa === 0 ? 'medium'
    : gpa < 2.0 ? 'high'
    : gpa < 3.0 ? 'medium'
    : 'low';
  const riskBadgeClasses =
    riskLevel === 'high' ? 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400'
    : riskLevel === 'medium' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';

  const toggleAction = (id: string) => {
    setCompleted(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const completedCount = completed.size;
  const totalCount = actions.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div>
      <PageHeader
        title={t('خطة الأعمال الأكاديمية', 'Academic Action Plan')}
        subtitle={t(
          'بناءً على تحليل المخاطر، إليك أولويات العمل الخاصة بك',
          'Based on your risk analysis, here are your action priorities'
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('لوحة الطالب', 'Student Dashboard'), href: '/student' },
          { label: t('خطة الأعمال الأكاديمية', 'Academic Action Plan') },
        ]}
        accentColor="bg-sa-500"
        actions={<DataSourceBadge source={overallSource} />}
      />

      {/* Summary Card */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sa-100 dark:bg-sa-900/30 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-sa-600 dark:text-sa-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                {t(
                  'بناءً على تحليل المخاطر، إليك أولويات العمل',
                  'Based on your risk analysis, here are your priority actions'
                )}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t(
                  `أكملت ${completedCount} من ${totalCount} إجراءات`,
                  `Completed ${completedCount} of ${totalCount} actions`
                )}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 ${riskBadgeClasses}`}>
            <TrendingUp className="w-3.5 h-3.5" />
            {riskLevel === 'high' ? t('خطر مرتفع', 'High Risk')
              : riskLevel === 'medium' ? t('خطر متوسط', 'Medium Risk')
              : t('خطر منخفض', 'Low Risk')}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
            <span>{t('التقدم', 'Progress')}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-sa-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="space-y-4 mb-8">
        {actions.map((action, idx) => {
          const isDone = completed.has(action.id);
          const impact = impactConfig[action.impact];
          const difficulty = difficultyConfig[action.difficulty];

          return (
            <div
              key={action.id}
              className={`rounded-2xl border bg-white dark:bg-gray-800 p-5 transition-all duration-300 ${
                isDone
                  ? 'border-sa-300 dark:border-sa-700 opacity-75'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-colors duration-300 ${
                    isDone
                      ? 'bg-sa-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className={`text-sm font-semibold transition-all duration-300 ${
                        isDone
                          ? 'line-through text-gray-400 dark:text-gray-500'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {t(action.titleAr, action.titleEn)}
                    </h3>

                    <button
                      onClick={() => toggleAction(action.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                        isDone
                          ? 'bg-sa-500 border-sa-500 text-white'
                          : 'border-gray-300 dark:border-gray-600 hover:border-sa-400 dark:hover:border-sa-500'
                      }`}
                      aria-label={isDone ? t('إلغاء الإكمال', 'Mark incomplete') : t('تم الإكمال', 'Mark complete')}
                    >
                      {isDone && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                    {t(action.descriptionAr, action.descriptionEn)}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${impact.classes}`}>
                      <TrendingUp className="w-3 h-3" />
                      {t('التأثير:', 'Impact:')} {t(impact.labelAr, impact.labelEn)}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      <Clock className="w-3 h-3" />
                      {t(action.estimatedTimeAr, action.estimatedTimeEn)}
                    </span>

                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${difficulty.classes}`}>
                      {t('الصعوبة:', 'Difficulty:')} {t(difficulty.labelAr, difficulty.labelEn)}
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                      {action.indicator}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/contact-advisor"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-sa-600 hover:bg-sa-700 text-white font-semibold text-sm transition-colors duration-200 shadow-sm"
        >
          <Calendar className="w-4 h-4" />
          {t('حجز موعد مع المرشد الأكاديمي', 'Book Advisor Meeting')}
        </Link>
        <Link
          to="/chatbot"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 font-semibold text-sm transition-colors duration-200"
        >
          <MessageSquare className="w-4 h-4" />
          {t('محادثة مع QMentor', 'Chat with QMentor')}
        </Link>
      </div>
    </div>
  );
}
