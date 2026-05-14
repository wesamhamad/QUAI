import { useState } from 'react';
import {
  ShieldExclamationIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  FlagIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card, { StatCard } from '../../../components/ui/Card';
import type { RecoveryStudent, RecoveryCourse } from '../types';

interface Props {
  student: RecoveryStudent;
  courses: RecoveryCourse[];
}

interface RecoveryStep {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  priority: 'immediate' | 'short-term' | 'ongoing';
}

function generateRecoveryPlan(student: RecoveryStudent, courses: RecoveryCourse[]): RecoveryStep[] {
  const steps: RecoveryStep[] = [];
  const atRisk = courses.filter(c => c.isAtRisk);
  const gpaGap = student.targetGPA - student.currentGPA;

  // Immediate actions based on current state
  if (atRisk.length > 0) {
    steps.push({
      titleAr: 'التركيز على المواد المعرضة للخطر',
      titleEn: 'Focus on At-Risk Courses',
      descriptionAr: `لديك ${atRisk.length} مقرر(ات) معرضة للخطر: ${atRisk.map(c => c.code).join(', ')}. خصص وقتًا إضافيًا يوميًا لهذه المواد`,
      descriptionEn: `You have ${atRisk.length} at-risk course(s): ${atRisk.map(c => c.code).join(', ')}. Dedicate extra daily time to these subjects`,
      priority: 'immediate',
    });
  }

  if (gpaGap > 0.5) {
    steps.push({
      titleAr: 'حضور جلسات الدروس الخصوصية',
      titleEn: 'Attend Tutoring Sessions',
      descriptionAr: `الفجوة في المعدل ${gpaGap.toFixed(2)} نقطة كبيرة. سجل في مركز الدروس الخصوصية فورًا`,
      descriptionEn: `GPA gap of ${gpaGap.toFixed(2)} points is significant. Enroll in tutoring center immediately`,
      priority: 'immediate',
    });
  }

  steps.push({
    titleAr: 'الالتزام بالحضور ١٠٠٪',
    titleEn: 'Maintain 100% Attendance',
    descriptionAr: `لديك ${student.weeksRemaining} أسبوع متبقي. كل حضور مهم للتعويض`,
    descriptionEn: `${student.weeksRemaining} weeks remaining. Every class counts for recovery`,
    priority: 'immediate',
  });

  // Short-term goals
  const lowGradeCourses = courses.filter(c => c.currentPoints <= 2.0);
  if (lowGradeCourses.length > 0) {
    steps.push({
      titleAr: 'تحسين تقديرات المواد الضعيفة',
      titleEn: 'Improve Low Grade Courses',
      descriptionAr: `استهدف رفع تقدير ${lowGradeCourses.map(c => c.code).join(', ')} بدرجة واحدة على الأقل`,
      descriptionEn: `Target raising ${lowGradeCourses.map(c => c.code).join(', ')} grades by at least one letter`,
      priority: 'short-term',
    });
  }

  steps.push({
    titleAr: 'إكمال جميع الواجبات والمشاريع',
    titleEn: 'Complete All Assignments & Projects',
    descriptionAr: 'تسليم كل واجب ومشروع في موعده. الدرجات التراكمية تحدث فرقًا كبيرًا',
    descriptionEn: 'Submit every assignment and project on time. Cumulative grades make a big difference',
    priority: 'short-term',
  });

  // Ongoing strategies
  steps.push({
    titleAr: 'مقابلة المرشد الأكاديمي أسبوعيًا',
    titleEn: 'Weekly Advisor Meetings',
    descriptionAr: 'حافظ على اجتماع أسبوعي مع المرشد لمتابعة التقدم وتعديل الخطة',
    descriptionEn: 'Maintain weekly meetings with advisor to track progress and adjust plan',
    priority: 'ongoing',
  });

  steps.push({
    titleAr: 'تنظيم الوقت والدراسة الفعالة',
    titleEn: 'Time Management & Effective Study',
    descriptionAr: 'خصص ساعتين يوميًا لكل مادة معرضة للخطر. استخدم تقنية بومودورو',
    descriptionEn: 'Dedicate 2 hours daily per at-risk course. Use the Pomodoro technique',
    priority: 'ongoing',
  });

  return steps;
}

const priorityStyles = {
  immediate: { bg: 'bg-error-50 dark:bg-error-900/20', border: 'border-error-200 dark:border-error-800', dot: 'bg-error-500', label: { ar: 'فوري', en: 'Immediate' } },
  'short-term': { bg: 'bg-gold-50 dark:bg-gold-900/20', border: 'border-gold-200 dark:border-gold-800', dot: 'bg-gold-500', label: { ar: 'قصير المدى', en: 'Short-term' } },
  ongoing: { bg: 'bg-info-50 dark:bg-info-900/20', border: 'border-info-200 dark:border-info-800', dot: 'bg-info-500', label: { ar: 'مستمر', en: 'Ongoing' } },
};

export default function RecoveryDashboard({ student, courses }: Props) {
  const { t } = useLanguage();
  const [showPlan, setShowPlan] = useState(false);

  const completionPct = Math.round((student.milestonesCompleted / student.totalMilestones) * 100);
  const weeksProgress = Math.round(((student.totalWeeks - student.weeksRemaining) / student.totalWeeks) * 100);
  const gpaGap = student.targetGPA - student.currentGPA;
  const atRiskCourses = courses.filter(c => c.isAtRisk);
  const recoveryPlan = generateRecoveryPlan(student, courses);

  return (
    <div className="space-y-4">
      {/* GPA Status Banner */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400">
            <ShieldExclamationIcon className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200">
              {t('حالة الإنذار الأكاديمي', 'Academic Probation Status')}
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              {t(
                `المعدل الحالي ${student.currentGPA} من ${student.gpaScale} — تحتاج الوصول إلى ${student.targetGPA} للخروج من الإنذار`,
                `Current GPA ${student.currentGPA}/${student.gpaScale} — Need ${student.targetGPA} to exit probation`
              )}
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">{student.currentGPA}</div>
            <div className="text-xs text-amber-600 dark:text-amber-400">{t('المعدل الحالي', 'Current GPA')}</div>
          </div>
        </div>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title={t('الهدف المطلوب', 'Target GPA')}
          value={student.targetGPA.toFixed(2)}
          icon={<FlagIcon className="w-5 h-5" />}
          trend={{ value: `+${gpaGap.toFixed(2)} ${t('مطلوب', 'needed')}`, positive: false }}
        />
        <StatCard
          title={t('الأسابيع المتبقية', 'Weeks Remaining')}
          value={student.weeksRemaining}
          icon={<CalendarDaysIcon className="w-5 h-5" />}
          trend={{ value: `${weeksProgress}% ${t('منقضي', 'elapsed')}`, positive: true }}
        />
        <StatCard
          title={t('الإنجاز', 'Completion')}
          value={`${completionPct}%`}
          icon={<AcademicCapIcon className="w-5 h-5" />}
          trend={{ value: `${student.milestonesCompleted}/${student.totalMilestones} ${t('مراحل', 'milestones')}`, positive: true }}
        />
        <StatCard
          title={t('مواد معرضة للخطر', 'At-Risk Courses')}
          value={atRiskCourses.length}
          icon={<ShieldExclamationIcon className="w-5 h-5" />}
          trend={{ value: `${t('من', 'of')} ${courses.length}`, positive: atRiskCourses.length === 0 }}
        />
      </div>

      {/* Recovery Plan Generator */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-sa-500" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {t('خطة التعافي الشخصية', 'Personalized Recovery Plan')}
            </h3>
          </div>
          <button
            onClick={() => setShowPlan(!showPlan)}
            className="text-sm text-sa-600 dark:text-sa-400 hover:underline"
          >
            {showPlan ? t('إخفاء', 'Hide') : t('عرض الخطة', 'Show Plan')}
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {t(
            `خطة مخصصة بناءً على المعدل الحالي (${student.currentGPA}) وعدد المواد المعرضة للخطر (${atRiskCourses.length})`,
            `Custom plan based on current GPA (${student.currentGPA}) and at-risk courses (${atRiskCourses.length})`
          )}
        </p>

        {showPlan && (
          <div className="space-y-3">
            {recoveryPlan.map((step, idx) => {
              const style = priorityStyles[step.priority];
              return (
                <div key={idx} className={`rounded-xl border p-4 ${style.bg} ${style.border}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {t(style.label.ar, style.label.en)}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {t(step.titleAr, step.titleEn)}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t(step.descriptionAr, step.descriptionEn)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Courses Table */}
      <Card>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
          {t('المقررات الحالية', 'Current Courses')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                <th className="text-start pb-3 font-medium">{t('المقرر', 'Course')}</th>
                <th className="text-start pb-3 font-medium">{t('الرمز', 'Code')}</th>
                <th className="text-center pb-3 font-medium">{t('الساعات', 'Credits')}</th>
                <th className="text-center pb-3 font-medium">{t('التقدير', 'Grade')}</th>
                <th className="text-center pb-3 font-medium">{t('الحالة', 'Status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {courses.map(course => (
                <tr key={course.code} className="text-gray-700 dark:text-gray-300">
                  <td className="py-3">{t(course.nameAr, course.nameEn)}</td>
                  <td className="py-3 font-mono text-xs">{course.code}</td>
                  <td className="py-3 text-center">{course.creditHours}</td>
                  <td className="py-3 text-center font-semibold">{course.currentGrade}</td>
                  <td className="py-3 text-center">
                    {course.isAtRisk ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                        {t('خطر', 'At Risk')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sa-100 text-sa-700 dark:bg-sa-900/30 dark:text-sa-400">
                        {t('مستقر', 'Stable')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
