import { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import type { College } from '../types';

interface Props {
  colleges: College[];
}

export default function CollegeView({ colleges }: Props) {
  const { t } = useLanguage();
  const [expandedCollege, setExpandedCollege] = useState<string | null>(null);

  const chartData = colleges.map(c => ({
    name: t(c.nameAr, c.nameEn),
    [t('المعدل', 'GPA')]: c.avgGPA,
    [t('الاستبقاء', 'Retention')]: c.retentionRate,
    [t('نسبة DFW', 'DFW')]: c.dfwRate,
  }));

  return (
    <div className="space-y-4">
      {/* Overview Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('مقارنة الكليات', 'College Comparison')}
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9CA3AF' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }} />
              <Legend />
              <Bar dataKey={t('المعدل', 'GPA')} fill="#25935F" radius={[4, 4, 0, 0]} />
              <Bar dataKey={t('نسبة DFW', 'DFW')} fill="#F04438" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* College Cards with Drill-down */}
      {colleges.map(college => {
        const isExpanded = expandedCollege === college.id;
        return (
          <Card key={college.id} padding={false}>
            <button
              onClick={() => setExpandedCollege(isExpanded ? null : college.id)}
              className="w-full p-5 flex items-center justify-between text-start"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t(college.nameAr, college.nameEn)}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>{t('الطلاب', 'Students')}: <strong className="text-gray-900 dark:text-white">{college.totalStudents.toLocaleString()}</strong></span>
                  <span>{t('المعدل', 'GPA')}: <strong className="text-gray-900 dark:text-white">{college.avgGPA.toFixed(2)}</strong></span>
                  <span>{t('الاستبقاء', 'Retention')}: <strong className="text-gray-900 dark:text-white">{college.retentionRate}%</strong></span>
                  <span>{t('معرضون للخطر', 'At-Risk')}: <strong className="text-error-500">{college.atRiskCount}</strong></span>
                </div>
              </div>
              {isExpanded
                ? <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                : <ChevronDownIcon className="w-5 h-5 text-gray-400" />
              }
            </button>

            {isExpanded && (
              <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm mt-4">
                  <thead>
                    <tr className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                      <th className="text-start pb-2">{t('القسم', 'Department')}</th>
                      <th className="text-start pb-2">{t('الطلاب', 'Students')}</th>
                      <th className="text-start pb-2">{t('المعدل', 'GPA')}</th>
                      <th className="text-start pb-2">{t('الاستبقاء', 'Retention')}</th>
                      <th className="text-start pb-2">{t('DFW', 'DFW')}</th>
                      <th className="text-start pb-2">{t('المقررات', 'Courses')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {college.departments.map(dept => (
                      <tr key={dept.id}>
                        <td className="py-2.5 font-medium text-gray-900 dark:text-white">{t(dept.nameAr, dept.nameEn)}</td>
                        <td className="py-2.5 text-gray-600 dark:text-gray-300">{dept.totalStudents}</td>
                        <td className="py-2.5">
                          <span className={dept.avgGPA >= 2.5 ? 'text-sa-600 font-medium' : 'text-error-500 font-medium'}>
                            {dept.avgGPA.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2.5 text-gray-600 dark:text-gray-300">{dept.retentionRate}%</td>
                        <td className="py-2.5">
                          <span className={dept.dfwRate > 20 ? 'text-error-500' : 'text-gray-600 dark:text-gray-300'}>{dept.dfwRate}%</span>
                        </td>
                        <td className="py-2.5 text-gray-600 dark:text-gray-300">{dept.courses.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
