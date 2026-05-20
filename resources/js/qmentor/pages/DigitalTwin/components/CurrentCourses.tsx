import { useState, useEffect } from 'react';
import { BookOpen, Clock, Calendar, User, Mail, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Course } from '../types';
import DataSourceBadge from '../../../components/shared/DataSourceBadge';
import EmptyState from './EmptyState';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ExamInfo {
  courseCode: string;
  date: string;
  location?: string;
  locationEn?: string;
}

interface Props {
  courses: Course[];
  exams?: ExamInfo[];
  source: 'api' | 'mock';
}

const mockExams: ExamInfo[] = [
  { courseCode: 'CS401', date: '2026-05-15T09:00:00', location: 'قاعة 3A', locationEn: 'Room 3A' },
  { courseCode: 'CS421', date: '2026-05-18T13:00:00', location: 'قاعة 5B', locationEn: 'Room 5B' },
  { courseCode: 'CS433', date: '2026-05-20T09:00:00', location: 'قاعة 2C', locationEn: 'Room 2C' },
  { courseCode: 'CS450', date: '2026-05-22T13:00:00', location: 'قاعة 7A', locationEn: 'Room 7A' },
  { courseCode: 'ARAB301', date: '2026-05-25T09:00:00', location: 'قاعة 1D', locationEn: 'Room 1D' },
];

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 60_000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function getTimeLeft(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, passed: true };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    passed: false,
  };
}

function ExamCountdown({ date }: { date: string }) {
  const { t } = useLanguage();
  const { days, hours, passed } = useCountdown(date);

  if (passed) {
    return <span className="text-xs text-gray-400 dark:text-gray-500">{t('انتهى', 'Ended')}</span>;
  }

  const isUrgent = days <= 3;
  const color = isUrgent ? 'text-error-500' : days <= 7 ? 'text-gold-600 dark:text-gold-400' : 'text-gray-600 dark:text-gray-400';

  return (
    <div className={`flex items-center gap-1 text-xs font-medium ${color}`}>
      <Clock className="w-3 h-3" />
      <span>{days} {t('يوم', 'd')} {hours} {t('ساعة', 'h')}</span>
    </div>
  );
}

function CourseCard({ course, exam, index }: { course: Course; exam?: ExamInfo; index: number }) {
  const { t, lang } = useLanguage();
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600/50 hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <span className="inline-block font-mono text-xs text-sa-600 dark:text-sa-400 bg-sa-50 dark:bg-sa-900/30 px-2 py-0.5 rounded font-medium">
              {course.code}
            </span>
            <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-1 truncate">{lang === 'ar' ? course.name : course.nameEn}</h4>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">{course.creditHours} {t('س', 'cr')}</span>
        </div>

        {/* Grades Row */}
        <div className="flex items-center gap-3 mb-2">
          {course.grade && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('التقدير:', 'Grade:')}</span>
              <span className="text-xs font-bold text-sa-600 dark:text-sa-400">{course.grade}</span>
            </div>
          )}
          {course.bbGrade && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">BB:</span>
              <span className="text-xs font-bold text-info-600 dark:text-blue-400">{course.bbGrade}</span>
            </div>
          )}
        </div>

        {/* Instructor */}
        {course.instructor && (
          <div className="flex items-center gap-1.5 mb-2 text-xs text-gray-500 dark:text-gray-400">
            <User className="w-3 h-3" />
            <span>{lang === 'ar' ? course.instructor : (course.instructorEn ?? course.instructor)}</span>
            {course.instructorEmail && (
              <a
                href={`mailto:${course.instructorEmail}`}
                className="text-sa-500 hover:text-sa-600 dark:text-sa-400 dark:hover:text-sa-300"
                title={course.instructorEmail}
              >
                <Mail className="w-3 h-3" />
              </a>
            )}
          </div>
        )}

        {/* Exam info */}
        {exam && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600/50 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{new Date(exam.date).toLocaleDateString(locale, { month: 'short', day: 'numeric', weekday: 'short' })}</span>
              {exam.location && (
                <>
                  <span className="mx-1">•</span>
                  <span>{lang === 'ar' ? exam.location : (exam.locationEn ?? exam.location)}</span>
                </>
              )}
            </div>
            <ExamCountdown date={exam.date} />
          </div>
        )}

        {/* Expand toggle for content preview */}
        {course.contentPreview && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 mt-2 text-[10px] text-sa-500 dark:text-sa-400 hover:text-sa-600 dark:hover:text-sa-300 font-medium"
          >
            <FileText className="w-3 h-3" />
            {t('محتوى المقرر', 'Course content')}
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        )}
      </div>

      <AnimatePresence>
        {expanded && course.contentPreview && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-3 pt-1 border-t border-gray-200 dark:border-gray-600/50">
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{lang === 'ar' ? course.contentPreview : (course.contentPreviewEn ?? course.contentPreview)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function CurrentCourses({ courses, exams, source }: Props) {
  const { t } = useLanguage();
  const examList = exams ?? mockExams;
  const examMap = new Map(examList.map(e => [e.courseCode, e]));

  if (courses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-sa-100 dark:bg-sa-900 flex items-center justify-center text-sa-600 dark:text-sa-400"><BookOpen className="w-4 h-4" /></span>
            {t('المقررات الحالية', 'Current Courses')}
          </h2>
          <DataSourceBadge source={source} />
        </div>
        <EmptyState title={t('لا توجد مقررات مسجلة', 'No registered courses')} description={t('لم يتم العثور على مقررات مسجلة للفصل الحالي', 'No registered courses were found for the current semester')} icon="courses" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-sa-100 dark:bg-sa-900 flex items-center justify-center text-sa-600 dark:text-sa-400"><BookOpen className="w-4 h-4" /></span>
          المقررات الحالية
          <span className="text-xs font-normal text-gray-400 dark:text-gray-500">({courses.length})</span>
        </h2>
        <DataSourceBadge source={source} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {courses.map((course, i) => (
          <CourseCard key={course.code} course={course} exam={examMap.get(course.code)} index={i} />
        ))}
      </div>

      {/* Total credit hours */}
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between text-sm">
        <span className="text-gray-500 dark:text-gray-400">{t('إجمالي الساعات المسجلة', 'Total registered hours')}</span>
        <span className="font-bold text-gray-900 dark:text-white">{courses.reduce((s, c) => s + c.creditHours, 0)} {t('ساعة', 'hrs')}</span>
      </div>
    </motion.div>
  );
}
