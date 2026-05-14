import { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { Course } from '../types';

interface Props {
  courses: Course[];
}

/* Green gradient shades — from darkest (A+) to lightest (F) */
const GRADE_COLORS: Record<string, string> = {
  aPlus: '#0F5C3A', a: '#166A45', bPlus: '#1B8354', b: '#25935F',
  cPlus: '#3BAF78', c: '#54C08A', dPlus: '#7DD4A6', d: '#A8E4C2', f: '#C8F0DD',
};

export default function CourseStatistics({ courses }: Props) {
  const { t } = useLanguage();
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);

  const gradeData = selectedCourse ? [
    { grade: 'A+', count: selectedCourse.gradeDistribution.aPlus },
    { grade: 'A', count: selectedCourse.gradeDistribution.a },
    { grade: 'B+', count: selectedCourse.gradeDistribution.bPlus },
    { grade: 'B', count: selectedCourse.gradeDistribution.b },
    { grade: 'C+', count: selectedCourse.gradeDistribution.cPlus },
    { grade: 'C', count: selectedCourse.gradeDistribution.c },
    { grade: 'D+', count: selectedCourse.gradeDistribution.dPlus },
    { grade: 'D', count: selectedCourse.gradeDistribution.d },
    { grade: 'F', count: selectedCourse.gradeDistribution.f },
  ] : [];

  return (
    <div className="space-y-4">
      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {courses.slice(0, 12).map(course => (
          <div
            key={course.id}
            onClick={() => setSelectedCourse(course)}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              selectedCourse?.id === course.id
                ? 'border-sa-500 bg-sa-50 dark:bg-sa-950 shadow-sm'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-sa-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                {course.code}
              </span>
              <span className={`text-xs font-bold ${course.avgGPA >= course.universityAvgGPA ? 'text-sa-600' : 'text-error-500'}`}>
                {course.avgGPA >= course.universityAvgGPA ? '↑' : '↓'} {t('مقارنة', 'vs avg')}
              </span>
            </div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 line-clamp-1">
              {t(course.nameAr, course.nameEn)}
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t('المسجلون', 'Enrolled')}</span>
                <p className="font-bold text-gray-900 dark:text-white">{course.enrollment}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t('المعدل', 'GPA')}</span>
                <p className="font-bold text-gray-900 dark:text-white">{course.avgGPA.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t('نسبة DFW', 'DFW Rate')}</span>
                <p className={`font-bold ${course.dfwRate > 20 ? 'text-error-500' : 'text-sa-600'}`}>{course.dfwRate}%</p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">{t('النجاح', 'Pass Rate')}</span>
                <p className="font-bold text-sa-600">{course.passRate.toFixed(1)}%</p>
              </div>
            </div>
            {/* Mini comparison bar */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-sa-500 rounded-full"
                  style={{ width: `${(course.avgGPA / 4) * 100}%` }}
                />
              </div>
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-400 dark:bg-gray-500 rounded-full"
                  style={{ width: `${(course.universityAvgGPA / 4) * 100}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>{t('المقرر', 'Course')}</span>
              <span>{t('الجامعة', 'University')}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grade Distribution Chart */}
      {selectedCourse && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {t('توزيع الدرجات', 'Grade Distribution')} — {selectedCourse.code}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {t(selectedCourse.nameAr, selectedCourse.nameEn)}
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="grade" tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }}
                />
                <Bar dataKey="count" name={t('عدد الطلاب', 'Students')} radius={[4, 4, 0, 0]}>
                  {gradeData.map((_entry, idx) => {
                    const keys = ['aPlus', 'a', 'bPlus', 'b', 'cPlus', 'c', 'dPlus', 'd', 'f'];
                    return <Cell key={idx} fill={GRADE_COLORS[keys[idx]]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}
    </div>
  );
}
