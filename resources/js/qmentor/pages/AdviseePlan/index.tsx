import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import Card, { StatCard } from '../../components/ui/Card';
import AnimatedTab from '../../components/shared/AnimatedTab';
import { SoonPanel } from '../../components/shared/SoonBadge';
import { useAdviseePlan, useAdvisees, useAdviseePredictions } from '../../hooks/useAdvisorData';
import type { AdviseePlanCourse, AdviseePlanLevel, AdviseePrediction } from '../../hooks/useAdvisorData';

type TabKey = 'remaining' | 'passed' | 'prediction';

/** A plan course carrying the level it sits in, since the table is flat. */
type FlatCourse = AdviseePlanCourse & { levelTitle: string };

const confidenceStyles: Record<string, string> = {
  high: 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400',
  medium: 'bg-sa-100 text-sa-700 dark:bg-sa-500/15 dark:text-sa-400',
  low: 'bg-gold-100 text-gold-700 dark:bg-gold-500/15 dark:text-gold-400',
};

function flatten(levels: AdviseePlanLevel[]): FlatCourse[] {
  return levels.flatMap(level =>
    (level.details ?? []).map(course => ({ ...course, levelTitle: level.title ?? '' })),
  );
}

function CourseTable({ courses }: { courses: FlatCourse[] }) {
  const { t } = useLanguage();

  if (courses.length === 0) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
        {t('لا توجد مقررات في هذه القائمة', 'No courses in this list')}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs font-bold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <th className="py-2.5 px-3 text-start">{t('رمز المقرر', 'Code')}</th>
            <th className="py-2.5 px-3 text-start">{t('اسم المقرر', 'Course')}</th>
            <th className="py-2.5 px-3 text-start">{t('المستوى', 'Level')}</th>
            <th className="py-2.5 px-3 text-start">{t('الساعات', 'Hours')}</th>
            <th className="py-2.5 px-3 text-start">{t('التصنيف', 'Category')}</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, i) => (
            <tr
              key={`${course.code ?? i}-${course.levelTitle}`}
              className="border-b border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/30"
            >
              <td className="py-2.5 px-3 font-mono text-xs text-gray-700 dark:text-gray-200">{course.code ?? '—'}</td>
              <td className="py-2.5 px-3 text-gray-900 dark:text-white">{course.title ?? '—'}</td>
              <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">{course.levelTitle}</td>
              <td className="py-2.5 px-3 tabular-nums text-gray-700 dark:text-gray-200">{course.hours ?? '—'}</td>
              <td className="py-2.5 px-3 text-gray-500 dark:text-gray-400">{course.category ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PredictionTable({ predictions }: { predictions: AdviseePrediction[] }) {
  const { t } = useLanguage();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs font-bold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <th className="py-2.5 px-3 text-start">{t('المقرر', 'Course')}</th>
            <th className="py-2.5 px-3 text-start">{t('التقدير المتوقع', 'Predicted')}</th>
            <th className="py-2.5 px-3 text-start">{t('متوسط المقرر', 'Course avg')}</th>
            <th className="py-2.5 px-3 text-start">{t('الثقة', 'Confidence')}</th>
            <th className="py-2.5 px-3 text-start">{t('يرتبط بأدائه في', 'Tracks results in')}</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map(prediction => (
            <tr
              key={prediction.course_no}
              className="border-b border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/30"
            >
              <td className="py-2.5 px-3 font-mono text-xs text-gray-700 dark:text-gray-200">
                {prediction.course_code || prediction.course_no}
              </td>
              <td className="py-2.5 px-3">
                <span className="font-bold text-gray-900 dark:text-white">{prediction.predicted_letter}</span>
                <span className="ms-1.5 text-xs text-gray-500 tabular-nums">
                  {prediction.predicted_points.toFixed(2)}
                </span>
              </td>
              <td className="py-2.5 px-3 tabular-nums text-gray-600 dark:text-gray-300">
                {prediction.course_mean.toFixed(2)}
                <span className="ms-1 text-xs text-gray-400">
                  ({prediction.samples.toLocaleString()})
                </span>
              </td>
              <td className="py-2.5 px-3">
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${confidenceStyles[prediction.confidence]}`}>
                  {prediction.confidence === 'high'
                    ? t('عالية', 'High')
                    : prediction.confidence === 'medium'
                      ? t('متوسطة', 'Medium')
                      : t('منخفضة', 'Low')}
                </span>
              </td>
              <td className="py-2.5 px-3 text-xs text-gray-500 dark:text-gray-400">
                {prediction.correlated_with.length === 0
                  ? '—'
                  : prediction.correlated_with
                      .slice(0, 3)
                      .map(pair => `${pair.course_code || pair.course_no} (${pair.r.toFixed(2)})`)
                      .join('، ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdviseePlan() {
  const { t } = useLanguage();
  const { studentId = '' } = useParams<{ studentId: string }>();
  const [activeTab, setActiveTab] = useState<TabKey>('remaining');

  const planResult = useAdviseePlan(studentId || null);
  const adviseesResult = useAdvisees();
  const predictionResult = useAdviseePredictions(studentId || null);

  const advisee = useMemo(
    () => (adviseesResult.data ?? []).find(a => String(a.student_id) === String(studentId)) ?? null,
    [adviseesResult.data, studentId],
  );

  const levels = planResult.data?.levels ?? [];
  const allCourses = useMemo(() => flatten(levels), [levels]);
  const passed = allCourses.filter(c => c.status === 'passed');
  const registered = allCourses.filter(c => c.status === 'student_schedule');
  const remaining = allCourses.filter(c => c.status === 'remaining' || c.status === 'N/A');

  const passedHours = passed.reduce((sum, c) => sum + (Number(c.hours) || 0), 0);
  const predictions = predictionResult.data?.predictions ?? [];

  const tabs: { key: TabKey; label: string; count?: number }[] = [
    { key: 'remaining', label: t('المواد المتبقية', 'Remaining'), count: remaining.length },
    { key: 'passed', label: t('المواد المجتازة', 'Passed'), count: passed.length },
    { key: 'prediction', label: t('التنبؤ الأكاديمي', 'Prediction'), count: predictions.length || undefined },
  ];

  return (
    <div>
      <PageHeader
        title={advisee?.student_name || t('خطة الطالب', "Student's Plan")}
        subtitle={
          advisee
            ? `${advisee.student_id} · ${advisee.major_name ?? ''}`
            : t('الخطة الدراسية للطالب المُسند إليك', 'The study plan of a student assigned to you')
        }
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('طلابي', 'My Advisees'), href: '/advisor-dashboard' },
          { label: advisee?.student_name || String(studentId) },
        ]}
        accentColor="bg-sa-500"
      />

      <Link
        to="/advisor-dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-sa-600 dark:text-sa-400 hover:underline mb-5"
      >
        <ArrowLeftIcon className="w-4 h-4 rtl:rotate-180" />
        {t('العودة إلى قائمة طلابي', 'Back to my advisees')}
      </Link>

      {planResult.isLoading && (
        <Card>
          <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
            {t('جارٍ تحميل الخطة…', 'Loading the plan…')}
          </p>
        </Card>
      )}

      {!planResult.isLoading && planResult.source !== 'api' && (
        <Card>
          <p className="text-sm text-gray-600 dark:text-gray-300 py-8 text-center">
            {planResult.source === 'unauthenticated'
              ? t(
                  'هذه الشاشة متاحة لأعضاء هيئة التدريس المسند إليهم طلاب.',
                  'This screen is available to faculty members with an advising caseload.',
                )
              : t(
                  'تعذّر جلب خطة هذا الطالب. قد لا يكون ضمن قائمة الطلاب المسندين إليك.',
                  'Could not load this plan. The student may not be on your advisory list.',
                )}
          </p>
        </Card>
      )}

      {!planResult.isLoading && planResult.source === 'api' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <StatCard
              title={t('المعدل التراكمي', 'GPA')}
              value={advisee?.last_recorded_gpa ? Number(advisee.last_recorded_gpa).toFixed(2) : '—'}
              icon={<AcademicCapIcon className="w-5 h-5" />}
            />
            <StatCard
              title={t('مواد مجتازة', 'Passed')}
              value={passed.length}
              icon={<CheckCircleIcon className="w-5 h-5" />}
            />
            <StatCard title={t('ساعات مجتازة', 'Passed Hours')} value={passedHours} />
            <StatCard
              title={t('مواد متبقية', 'Remaining')}
              value={remaining.length}
              icon={<ClockIcon className="w-5 h-5" />}
            />
          </div>

          {registered.length > 0 && (
            <Card className="mb-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                {t('مسجّلة هذا الفصل', 'Registered this term')} ({registered.length})
              </h3>
              <CourseTable courses={registered} />
            </Card>
          )}

          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex overflow-x-auto gap-6 scrollbar-hide">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  data-active={activeTab === tab.key}
                  className="tab-underline flex items-center gap-1.5 text-sm whitespace-nowrap pb-3"
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className="ms-1 text-xs text-gray-400 tabular-nums">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <AnimatedTab activeKey={activeTab}>
            {activeTab === 'remaining' && (
              <Card>
                <CourseTable courses={remaining} />
              </Card>
            )}

            {activeTab === 'passed' && (
              <Card>
                <CourseTable courses={passed} />
              </Card>
            )}

            {activeTab === 'prediction' && (
              <div className="space-y-4">
                {predictionResult.isLoading && (
                  <Card>
                    <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
                      {t('جارٍ حساب التوقعات…', 'Computing predictions…')}
                    </p>
                  </Card>
                )}

                {!predictionResult.isLoading && predictions.length > 0 && (
                  <Card>
                    <div className="mb-4">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        {t('التقدير المتوقع في المواد المتبقية', 'Predicted grades for remaining courses')}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                        {t(
                          'محسوبة من سجلات الجامعة: متوسط كل مقرر تاريخياً، مُزاحاً بمقدار ما اعتاد هذا الطالب أن يبتعد به عن المتوسط فيما درسه. المقررات قليلة الدارسين لا تُعرض بدل تخمينها.',
                          "Computed from the university's own transcripts: each course's historical mean, shifted by how far this student has tended to land from the mean. Thinly-attempted courses are omitted rather than guessed at.",
                        )}
                      </p>
                    </div>
                    <PredictionTable predictions={predictions} />
                  </Card>
                )}

                {!predictionResult.isLoading && predictions.length === 0 && (
                  <Card>
                    <p className="text-sm text-gray-600 dark:text-gray-300 py-8 text-center">
                      {predictionResult.source === 'api'
                        ? t(
                            'لا توجد مقررات متبقية لها سجل كافٍ لحساب توقع موثوق.',
                            'No remaining course has enough history for a reliable prediction.',
                          )
                        : t(
                            'تعذّر حساب التوقعات لهذا الطالب.',
                            'Could not compute predictions for this student.',
                          )}
                    </p>
                  </Card>
                )}

                <SoonPanel
                  title={t('إحصائيات الكلية والتخصصات والمقررات', 'College, major and course statistics')}
                  reason={t(
                    'اللوحات الأربع كانت تُحسب في خدمة stats2 التي أُرشفت. التنبؤ أعلاه بُني بديلاً لها من قاعدة بيانات الجامعة مباشرة، وهذه اللوحات لم تُنقل بعد.',
                    'The four boards came from the archived stats2 service. The prediction above was rebuilt directly from the university database; these boards have not been moved yet.',
                  )}
                />
              </div>
            )}
          </AnimatedTab>
        </>
      )}
    </div>
  );
}
