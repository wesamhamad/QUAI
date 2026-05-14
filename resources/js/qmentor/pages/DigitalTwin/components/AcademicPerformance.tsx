import React from 'react';
import { BarChart3, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';
import type { SemesterGPA, Course } from '../types';
import DataSourceBadge from '../../../components/shared/DataSourceBadge';
import EmptyState from './EmptyState';

interface Props {
  semesterGPAs: SemesterGPA[];
  currentCourses: Course[];
  creditHoursCompleted: number;
  creditHoursRequired: number;
  academicStanding: string;
  currentSemesterHasGrades?: boolean;
  lastGradedSemesterCourses?: Course[];
  lastGradedSemesterName?: string;
  source?: 'api' | 'mock';
  gpa?: number;
}

const gradeColors: Record<string, string> = {
  'A+': '#25935F', 'A': '#25935F', 'A-': '#54C08A', 'B+': '#88D8AD', 'B': '#F5BD02',
  'B-': '#F7D54D', 'C+': '#F79009', 'C': '#DC6803', 'D+': '#F04438', 'D': '#F04438', 'F': '#D92D20',
};

function GPAComparisonGauge({ studentGPA, collegeAvg, universityAvg }: { studentGPA: number; collegeAvg: number; universityAvg: number }) {
  const maxGPA = 5.0;
  const gaugeWidth = 100;

  const markers = [
    { value: universityAvg, label: 'الجامعة', color: '#6C737F' },
    { value: collegeAvg, label: 'الكلية', color: '#80519F' },
    { value: studentGPA, label: 'الطالب', color: '#25935F' },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">مقارنة المعدل</h4>
      <div className="space-y-3">
        {markers.map(m => (
          <div key={m.label} className="flex items-center gap-3">
            <span className="text-xs text-gray-500 dark:text-gray-400 w-14 shrink-0">{m.label}</span>
            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(m.value / maxGPA) * gaugeWidth}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ backgroundColor: m.color }}
              />
            </div>
            <span className="text-xs font-bold w-8 text-left" style={{ color: m.color }}>{m.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AcademicPerformance({
  semesterGPAs, currentCourses, creditHoursCompleted, creditHoursRequired,
  academicStanding, currentSemesterHasGrades = true,
  lastGradedSemesterCourses, lastGradedSemesterName, source = 'mock', gpa = 0,
}: Props) {
  const creditPercent = Math.round((creditHoursCompleted / creditHoursRequired) * 100);

  const showGradesFallback = !currentSemesterHasGrades && lastGradedSemesterCourses && lastGradedSemesterCourses.length > 0;
  const gradedCourses = showGradesFallback ? lastGradedSemesterCourses : currentCourses;

  const gradeDistribution = gradedCourses.map(c => ({
    name: c.code,
    grade: c.gradePoints ?? 0,
    letterGrade: c.grade ?? '-',
  }));

  const latestGPA = semesterGPAs.length > 0 ? semesterGPAs[semesterGPAs.length - 1].gpa : gpa;
  // Mock comparison values — in production these would come from API
  const collegeAvg = 3.2;
  const universityAvg = 2.95;

  if (semesterGPAs.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-sa-100 dark:bg-sa-900 flex items-center justify-center text-sa-600 dark:text-sa-400"><BarChart3 className="w-4 h-4" /></span>
            الأداء الأكاديمي
          </h2>
          <DataSourceBadge source={source} />
        </div>
        <EmptyState title="لا توجد بيانات أكاديمية" description="لم يتم العثور على سجل أكاديمي للطالب" icon="chart" />
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
          <span className="w-8 h-8 rounded-lg bg-sa-100 dark:bg-sa-900 flex items-center justify-center text-sa-600 dark:text-sa-400"><BarChart3 className="w-4 h-4" /></span>
          الأداء الأكاديمي
        </h2>
        <DataSourceBadge source={source} />
      </div>

      {/* Grades not available banner */}
      {showGradesFallback && (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gold-100 dark:bg-gold-900/30 border border-gold-200 dark:border-gold-800" dir="rtl">
          <Clock className="w-5 h-5 text-gold-700 dark:text-gold-400 shrink-0" />
          <p className="text-sm text-gold-700 dark:text-gold-400">
            درجات الفصل الحالي غير متاحة بعد — يتم عرض درجات آخر فصل متاح
            {lastGradedSemesterName && <span className="font-bold"> ({lastGradedSemesterName})</span>}
          </p>
        </div>
      )}

      {/* GPA Comparison Gauge */}
      <GPAComparisonGauge studentGPA={latestGPA || gpa} collegeAvg={collegeAvg} universityAvg={universityAvg} />

      {/* GPA Trend Chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">اتجاه المعدل التراكمي</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={semesterGPAs} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--tooltip-bg, #fff)', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: number) => [`${value.toFixed(2)}`, 'المعدل']}
              />
              <Line type="monotone" dataKey="gpa" stroke="#25935F" strokeWidth={2.5} dot={{ fill: '#25935F', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Semester Bar Chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">المعدل الفصلي</h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={semesterGPAs} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="semester" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                formatter={(value: number) => [`${value.toFixed(2)}`, 'المعدل']}
              />
              <Bar dataKey="gpa" radius={[6, 6, 0, 0]}>
                {semesterGPAs.map((entry, idx) => (
                  <Cell key={idx} fill={entry.gpa >= 4.0 ? '#25935F' : entry.gpa >= 3.0 ? '#F5BD02' : '#F04438'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Grades Table */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
          {showGradesFallback ? `درجات الفصل ${lastGradedSemesterName ?? 'السابق'}` : 'درجات المقررات'}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">الرمز</th>
                <th className="text-right py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">المقرر</th>
                <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">الساعات</th>
                <th className="text-center py-2 px-3 text-gray-500 dark:text-gray-400 font-medium">التقدير</th>
              </tr>
            </thead>
            <tbody>
              {gradedCourses.map((course, i) => (
                <motion.tr
                  key={course.code}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-gray-100 dark:border-gray-700/50"
                >
                  <td className="py-2 px-3 font-mono text-gray-700 dark:text-gray-300">{course.code}</td>
                  <td className="py-2 px-3 text-gray-900 dark:text-white">{course.name}</td>
                  <td className="py-2 px-3 text-center text-gray-600 dark:text-gray-400">{course.creditHours}</td>
                  <td className="py-2 px-3 text-center">
                    {course.grade ? (
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold text-white"
                        style={{ backgroundColor: gradeColors[course.grade] ?? '#6C737F' }}
                      >
                        {course.grade}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-600 dark:bg-gold-900/30 dark:text-gold-400">
                        غير متاح بعد
                      </span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Credit Hours Progress */}
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600 dark:text-gray-400">الساعات المعتمدة</span>
          <span className="font-bold text-gray-900 dark:text-white">{creditHoursCompleted} / {creditHoursRequired}</span>
        </div>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${creditPercent}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-l from-sa-500 to-sa-600 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{creditPercent}% مكتمل</p>
      </div>
    </motion.div>
  );
}
