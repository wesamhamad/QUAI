import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { FacultyMember } from '../types';

interface Props {
  faculty: FacultyMember[];
}

export default function WorkloadAnalysis({ faculty }: Props) {
  const { t } = useLanguage();

  // Teaching load data: courses per faculty member
  const loadData = faculty.slice(0, 15).map(f => ({
    name: t(f.nameAr.replace(/^د\.\s*/, ''), f.nameEn.replace(/^Dr\.\s*/, '')),
    courses: f.coursesCount,
    students: f.totalStudents,
  }));

  // Office hours mock data
  const officeHoursData = [
    { day: t('الأحد', 'Sun'), scheduled: 4, actual: 3.5 },
    { day: t('الاثنين', 'Mon'), scheduled: 4, actual: 4.2 },
    { day: t('الثلاثاء', 'Tue'), scheduled: 4, actual: 3.0 },
    { day: t('الأربعاء', 'Wed'), scheduled: 4, actual: 3.8 },
    { day: t('الخميس', 'Thu'), scheduled: 2, actual: 1.5 },
  ];

  // Workload distribution by rank
  const rankDistribution = [
    { rank: t('أستاذ', 'Professor'), avgCourses: 2.1, avgStudents: 85, count: faculty.filter(f => f.rankEn === 'Professor').length },
    { rank: t('أستاذ مشارك', 'Associate Prof.'), avgCourses: 3.2, avgStudents: 120, count: faculty.filter(f => f.rankEn === 'Associate Professor').length },
    { rank: t('أستاذ مساعد', 'Assistant Prof.'), avgCourses: 3.8, avgStudents: 155, count: faculty.filter(f => f.rankEn === 'Assistant Professor').length },
    { rank: t('محاضر', 'Lecturer'), avgCourses: 4.5, avgStudents: 200, count: faculty.filter(f => f.rankEn === 'Lecturer').length },
  ];

  const avgCourses = (faculty.reduce((s, f) => s + f.coursesCount, 0) / faculty.length).toFixed(1);
  const avgStudents = Math.round(faculty.reduce((s, f) => s + f.totalStudents, 0) / faculty.length);
  const maxLoad = faculty.reduce((max, f) => Math.max(max, f.coursesCount), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('متوسط المقررات', 'Avg Courses')}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{avgCourses}</p>
          <p className="text-xs text-gray-400 mt-1">{t('لكل عضو', 'per faculty')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('متوسط الطلاب', 'Avg Students')}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{avgStudents}</p>
          <p className="text-xs text-gray-400 mt-1">{t('لكل عضو', 'per faculty')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('أقصى حمل', 'Max Load')}</p>
          <p className="text-2xl font-bold text-gold-600 mt-1">{maxLoad}</p>
          <p className="text-xs text-gray-400 mt-1">{t('مقررات', 'courses')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('إجمالي الأعضاء', 'Total Faculty')}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{faculty.length}</p>
          <p className="text-xs text-gray-400 mt-1">{t('عضو هيئة تدريس', 'members')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Teaching Load Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {t('حمل التدريس لكل عضو', 'Teaching Load per Faculty')}
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loadData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="courses" fill="#16a34a" name={t('المقررات', 'Courses')} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Office Hours Tracker */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {t('الساعات المكتبية (متوسط أسبوعي)', 'Office Hours (Weekly Average)')}
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={officeHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="scheduled" fill="#16a34a" name={t('مجدولة', 'Scheduled')} radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" fill="#eab308" name={t('فعلية', 'Actual')} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Workload by Rank */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t('توزيع الحمل حسب الرتبة', 'Workload Distribution by Rank')}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t('الرتبة', 'Rank')}</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t('العدد', 'Count')}</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t('متوسط المقررات', 'Avg Courses')}</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t('متوسط الطلاب', 'Avg Students')}</th>
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t('التوزيع', 'Distribution')}</th>
              </tr>
            </thead>
            <tbody>
              {rankDistribution.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{row.rank}</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{row.count}</td>
                  <td className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">{row.avgCourses}</td>
                  <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{row.avgStudents}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-sa-500 rounded-full"
                          style={{ width: `${(row.avgCourses / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{row.avgCourses}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
