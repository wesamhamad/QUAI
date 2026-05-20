import React from 'react';
import { ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StudyPlanNode, Course } from '../types';
import DataSourceBadge from '../../../components/shared/DataSourceBadge';
import EmptyState from './EmptyState';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Props {
  studyPlan: StudyPlanNode[];
  currentCourses: Course[];
  source?: 'api' | 'mock';
}

const statusStyles = {
  completed: { bg: 'bg-sa-100 dark:bg-sa-900/50', border: 'border-sa-300 dark:border-sa-700', text: 'text-sa-700 dark:text-sa-300', label: 'مكتمل', labelEn: 'Completed' },
  'in-progress': { bg: 'bg-gold-100 dark:bg-gold-900/50', border: 'border-gold-300 dark:border-gold-700', text: 'text-gold-700 dark:text-gold-300', label: 'حالياً', labelEn: 'In Progress' },
  remaining: { bg: 'bg-gray-100 dark:bg-gray-700/50', border: 'border-gray-300 dark:border-gray-600', text: 'text-gray-500 dark:text-gray-400', label: 'متبقي', labelEn: 'Remaining' },
  failed: { bg: 'bg-error-100 dark:bg-red-900/50', border: 'border-red-300 dark:border-red-700', text: 'text-error-500 dark:text-red-300', label: 'راسب', labelEn: 'Failed' },
};

const categoryLabels: Record<string, string> = {
  major: 'تخصص',
  college: 'كلية',
  university: 'جامعة',
  elective: 'اختياري',
};

const categoryLabelsEn: Record<string, string> = {
  major: 'Major',
  college: 'College',
  university: 'University',
  elective: 'Elective',
};

function ProgressRing({ percent, size = 100 }: { percent: number; size?: number }) {
  const { t } = useLanguage();
  const r = (size - 12) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg className="-rotate-90" width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="currentColor" strokeWidth="8"
          className="text-gray-200 dark:text-gray-700"
        />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#25935F" strokeWidth="8"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-2xl font-bold text-sa-600 dark:text-sa-400" style={{ marginTop: -(size / 2 + 10) }}>
        {percent}%
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400 mt-5">{t('مكتمل', 'Completed')}</span>
    </div>
  );
}

export default function StudyPlanOverview({ studyPlan, currentCourses, source = 'mock' }: Props) {
  const { t, lang } = useLanguage();
  const completed = studyPlan.filter(c => c.status === 'completed').length;
  const inProgress = studyPlan.filter(c => c.status === 'in-progress').length;
  const remaining = studyPlan.filter(c => c.status === 'remaining').length;
  const total = studyPlan.length;
  const progressPercent = Math.round((completed / total) * 100);

  const categories = ['major', 'college', 'university', 'elective'] as const;

  const completedCodes = new Set(studyPlan.filter(c => c.status === 'completed').map(c => c.code));
  const inProgressCodes = new Set(studyPlan.filter(c => c.status === 'in-progress').map(c => c.code));
  const suggested = studyPlan.filter(c =>
    c.status === 'remaining' &&
    c.prerequisites.every(p => completedCodes.has(p) || inProgressCodes.has(p))
  );

  if (studyPlan.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-lavender-100 dark:bg-lavender-900 flex items-center justify-center text-lavender-600 dark:text-lavender-400"><ClipboardList className="w-4 h-4" /></span>
            {t('الخطة الدراسية', 'Study Plan')}
          </h2>
          <DataSourceBadge source={source} />
        </div>
        <EmptyState title={t('لا توجد خطة دراسية', 'No study plan')} description={t('لم يتم العثور على خطة دراسية للطالب', 'No study plan was found for this student')} icon="book" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-lavender-100 dark:bg-lavender-900 flex items-center justify-center text-lavender-600 dark:text-lavender-400"><ClipboardList className="w-4 h-4" /></span>
          الخطة الدراسية
        </h2>
        <DataSourceBadge source={source} />
      </div>

      {/* Progress Ring + Summary */}
      <div className="flex items-center gap-6">
        <ProgressRing percent={progressPercent} />
        <div className="flex-1 grid grid-cols-3 gap-3 text-center">
          <div className="bg-sa-50 dark:bg-sa-900/30 rounded-xl p-3">
            <p className="text-2xl font-bold text-sa-600 dark:text-sa-400">{completed}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('مكتمل', 'Completed')}</p>
          </div>
          <div className="bg-gold-50 dark:bg-gold-900/30 rounded-xl p-3">
            <p className="text-2xl font-bold text-gold-600 dark:text-gold-400">{inProgress}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('حالياً', 'In Progress')}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3">
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{remaining}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t('متبقي', 'Remaining')}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-600 dark:text-gray-400">{t('تقدم الخطة', 'Plan Progress')}</span>
          <span className="font-bold text-gray-900 dark:text-white">{progressPercent}%</span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completed / total) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-sa-500"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(inProgress / total) * 100}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full bg-gold-500"
          />
        </div>
      </div>

      {/* Prerequisite Tree */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{t('شجرة المتطلبات', 'Prerequisite Tree')}</h3>
        <div className="space-y-2">
          {categories.map(cat => {
            const courses = studyPlan.filter(c => c.category === cat);
            if (courses.length === 0) return null;
            return (
              <div key={cat}>
                <p className="text-xs font-medium text-gray-400 dark:text-gray-500 mb-1.5">{lang === 'ar' ? categoryLabels[cat] : categoryLabelsEn[cat]}</p>
                <div className="flex flex-wrap gap-2">
                  {courses.map((course, i) => {
                    const style = statusStyles[course.status];
                    return (
                      <motion.div
                        key={course.code}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className={`${style.bg} ${style.border} border rounded-lg px-3 py-2 text-center min-w-[80px] transition-all hover:scale-105`}
                        title={`${lang === 'ar' ? course.name : course.nameEn} (${course.prerequisites.length > 0 ? t('يتطلب: ', 'Requires: ') + course.prerequisites.join(', ') : t('لا متطلبات', 'No prerequisites')})`}
                      >
                        <p className={`text-xs font-bold ${style.text}`}>{course.code}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[90px]">{lang === 'ar' ? course.name : course.nameEn}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Next Semester */}
      {suggested.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{t('مقررات مقترحة للفصل القادم', 'Suggested Courses for Next Semester')}</h3>
          <div className="space-y-2">
            {suggested.map((course, i) => (
              <motion.div
                key={course.code}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center justify-between bg-sa-50 dark:bg-sa-900/20 rounded-lg px-4 py-2.5"
              >
                <div>
                  <span className="font-mono text-sm text-sa-700 dark:text-sa-300 font-medium">{course.code}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">{lang === 'ar' ? course.name : course.nameEn}</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{course.creditHours} {t('ساعات', 'hrs')}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
