import {
  AcademicCapIcon,
  CalendarDaysIcon,
  ClockIcon,
  ChartBarIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card, { StatCard } from '../../../components/ui/Card';
import type { StudentPlanProfile, Course, GraduationMilestone } from '../types';

interface Props {
  profile: StudentPlanProfile;
  courses: Course[];
}

export default function PlanOverview({ profile, courses }: Props) {
  const { t } = useLanguage();

  const completedCount = courses.filter(c => c.status === 'completed').length;
  const inProgressCount = courses.filter(c => c.status === 'in-progress').length;
  const remainingCount = courses.filter(c => c.status === 'available' || c.status === 'locked').length;
  const completionPct = Math.round((profile.completedCredits / profile.requiredCredits) * 100);
  const semestersRemaining = 8 - profile.currentSemester;
  const inProgressCredits = courses.filter(c => c.status === 'in-progress').reduce((s, c) => s + c.creditHours, 0);

  // KSA 5-point GPA grade bands: 4.5+ ممتاز, 3.75–4.49 جيد جداً, 2.75–3.74 جيد,
  // 1.75–2.74 مقبول, <1.75 ضعيف. (Apply only when scale is 5; otherwise pass through.)
  const gpa = Number(profile.currentGPA) || 0;
  const gpaScale = Number(profile.gpaScale) || 5;
  const normalized = gpaScale === 4 ? gpa * (5 / 4) : gpa;
  const gpaBand: { ar: string; en: string; positive: boolean } =
    normalized >= 4.5  ? { ar: 'ممتاز',     en: 'Excellent',  positive: true  }
    : normalized >= 3.75 ? { ar: 'جيد جداً', en: 'Very Good',  positive: true  }
    : normalized >= 2.75 ? { ar: 'جيد',       en: 'Good',       positive: true  }
    : normalized >= 1.75 ? { ar: 'مقبول',     en: 'Fair',       positive: false }
    :                       { ar: 'ضعيف',     en: 'Poor',       positive: false };

  const pieData = [
    { name: t('مكتمل', 'Completed'), value: profile.completedCredits, color: '#10b981' },
    { name: t('حالي', 'Current'), value: inProgressCredits, color: '#6ee7b7' },
    { name: t('متبقي', 'Remaining'), value: profile.requiredCredits - profile.completedCredits - inProgressCredits, color: '#064e3b' },
  ];

  // Graduation milestones
  const milestones: GraduationMilestone[] = [
    { label: 'بداية الخطة', labelEn: 'Plan Start', credits: 0, completed: true, current: false },
    { label: 'المتطلبات الجامعية', labelEn: 'University Req.', credits: 25, completed: profile.completedCredits >= 25, current: profile.completedCredits >= 20 && profile.completedCredits < 25 },
    { label: 'متطلبات الكلية', labelEn: 'College Req.', credits: 50, completed: profile.completedCredits >= 50, current: profile.completedCredits >= 40 && profile.completedCredits < 50 },
    { label: 'منتصف التخصص', labelEn: 'Mid-Major', credits: 75, completed: profile.completedCredits >= 75, current: profile.completedCredits >= 65 && profile.completedCredits < 75 },
    { label: 'مشروع التخرج', labelEn: 'Senior Project', credits: 100, completed: profile.completedCredits >= 100, current: profile.completedCredits >= 90 && profile.completedCredits < 100 },
    { label: 'التدريب التعاوني', labelEn: 'Co-op Training', credits: 120, completed: profile.completedCredits >= 120, current: profile.completedCredits >= 110 && profile.completedCredits < 120 },
    { label: 'التخرج', labelEn: 'Graduation', credits: profile.requiredCredits, completed: profile.completedCredits >= profile.requiredCredits, current: false },
  ];


  return (
    <div className="space-y-4">
      {/* Progress Banner */}
      <Card>
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Graduation ring */}
          <div className="relative w-40 h-40 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">{completionPct}%</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('مكتمل', 'Complete')}</span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-start">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t(profile.name, profile.nameEn)}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t(profile.major, profile.majorEn)} — {t(profile.college, profile.collegeEn)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('رقم الطالب', 'Student ID')}: {profile.studentId}
            </p>

            {/* Credit progress bar */}
            <div className="mt-4 max-w-md">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>{t('الساعات المكتملة', 'Credits Completed')}</span>
                <span>{profile.completedCredits} / {profile.requiredCredits}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-sa-500 to-sa-600 h-3 rounded-full transition-all"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2 text-sm">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 dark:text-gray-300">
                  {item.name}: <span className="font-semibold">{item.value}</span> {t('ساعة', 'hrs')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('المعدل التراكمي', 'Cumulative GPA')}
          value={`${profile.currentGPA} / ${profile.gpaScale}`}
          icon={<ChartBarIcon className="w-5 h-5" />}
          trend={{ value: t(gpaBand.ar, gpaBand.en), positive: gpaBand.positive }}
          className="border-s-4 border-s-sa-500"
        />
        <StatCard
          title={t('التخرج المتوقع', 'Expected Graduation')}
          value={t(profile.expectedGraduation, profile.expectedGraduationEn)}
          icon={<AcademicCapIcon className="w-5 h-5" />}
          className="border-s-4 border-s-blue-500"
        />
        <StatCard
          title={t('الفصول المتبقية', 'Semesters Remaining')}
          value={semestersRemaining}
          icon={<CalendarDaysIcon className="w-5 h-5" />}
          className="border-s-4 border-s-yellow-500"
        />
        <StatCard
          title={t('المقررات', 'Courses')}
          value={`${completedCount} / ${completedCount + inProgressCount + remainingCount}`}
          icon={<ClockIcon className="w-5 h-5" />}
          trend={{ value: `${inProgressCount} ${t('حالياً', 'current')}`, positive: true }}
          className="border-s-4 border-s-emerald-500"
        />
      </div>

      {/* Graduation Progress Milestones */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {t('مسار التخرج', 'Graduation Progress')}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t(
                `${profile.completedCredits} ساعة من ${profile.requiredCredits} (${completionPct}٪)`,
                `${profile.completedCredits} of ${profile.requiredCredits} hours completed (${completionPct}%)`
              )}
            </p>
          </div>
          {(() => {
            const next = milestones.find(m => !m.completed);
            if (!next) return null;
            const remain = next.credits - profile.completedCredits;
            return (
              <div className="flex items-center gap-2 bg-sa-50 dark:bg-sa-900/20 border border-sa-200 dark:border-sa-800/40 rounded-lg px-3 py-2">
                <div className="w-2 h-2 rounded-full bg-sa-500 animate-pulse" />
                <div className="text-xs">
                  <span className="text-gray-500 dark:text-gray-400">{t('التالي:', 'Next:')}</span>{' '}
                  <span className="font-semibold text-sa-700 dark:text-sa-400">{t(next.label, next.labelEn)}</span>
                  <span className="ms-1 text-gray-400 dark:text-gray-500">
                    ({remain > 0 ? `${remain} ${t('ساعة', 'hrs')}` : t('قريب جداً', 'almost there')})
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Milestone steps – horizontal connected layout */}
        <div className="relative">
          {/* Connecting line behind dots */}
          <div className="absolute top-3 inset-x-0 h-0.5 bg-gray-200 dark:bg-gray-700" />
          <div
            className="absolute top-3 h-0.5 bg-gradient-to-r from-emerald-500 to-sa-500 transition-all duration-700 rounded-full"
            style={{ width: `${completionPct}%`, insetInlineStart: 0 }}
          />

          {/* Milestone dots row */}
          <div className="relative flex justify-between items-start">
            {milestones.map((m, i) => {
              const isCompleted = m.completed;
              const isCurrent = m.current;

              return (
                <div
                  key={i}
                  className="flex flex-col items-center group"
                  style={{ width: `${100 / milestones.length}%` }}
                >
                  {/* Dot */}
                  <div
                    className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 shadow-sm shadow-emerald-500/30'
                        : isCurrent
                          ? 'bg-sa-500 border-sa-500 shadow-sm shadow-sa-500/30 ring-4 ring-sa-500/20'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                    }`}
                    title={`${t(m.label, m.labelEn)} · ${m.credits} ${t('ساعة', 'hrs')}`}
                  >
                    {isCompleted && <CheckCircleIcon className="w-3.5 h-3.5 text-white" />}
                    {isCurrent && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  {/* Label */}
                  <div className="mt-2.5 text-center px-0.5">
                    <p className={`text-xs font-semibold leading-tight ${
                      isCompleted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isCurrent
                          ? 'text-sa-700 dark:text-sa-400'
                          : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {t(m.label, m.labelEn)}
                    </p>
                    <p className={`text-[11px] mt-0.5 ${
                      isCompleted
                        ? 'text-emerald-500/70 dark:text-emerald-500/50'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {m.credits} {t('س', 'hr')}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
