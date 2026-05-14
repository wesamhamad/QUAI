import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import { StatCard } from '../../../components/ui/Card';
import {
  UsersIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import type { Department } from '../types';

interface Props {
  departments: Department[];
}

type SortKey = 'totalStudents' | 'avgGPA' | 'retentionRate' | 'atRiskCount' | 'dfwRate';

export default function DepartmentView({ departments }: Props) {
  const { t } = useLanguage();
  const [sortBy, setSortBy] = useState<SortKey>('totalStudents');
  const [sortAsc, setSortAsc] = useState(false);

  const totals = {
    students: departments.reduce((s, d) => s + d.totalStudents, 0),
    avgGPA: Number((departments.reduce((s, d) => s + d.avgGPA * d.totalStudents, 0) / departments.reduce((s, d) => s + d.totalStudents, 0)).toFixed(2)),
    atRisk: departments.reduce((s, d) => s + d.atRiskCount, 0),
    avgRetention: Number((departments.reduce((s, d) => s + d.retentionRate, 0) / departments.length).toFixed(1)),
  };

  const sorted = [...departments].sort((a, b) => {
    const diff = a[sortBy] - b[sortBy];
    return sortAsc ? diff : -diff;
  });

  const handleSort = (key: SortKey) => {
    if (sortBy === key) setSortAsc(!sortAsc);
    else { setSortBy(key); setSortAsc(false); }
  };

  const sortIcon = (key: SortKey) => sortBy === key ? (sortAsc ? ' ↑' : ' ↓') : '';

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title={t('إجمالي الطلاب', 'Total Students')}
          value={totals.students.toLocaleString()}
          icon={<UsersIcon className="w-5 h-5" />}
        />
        <StatCard
          title={t('المعدل العام', 'Overall GPA')}
          value={totals.avgGPA.toFixed(2)}
          icon={<AcademicCapIcon className="w-5 h-5" />}
        />
        <StatCard
          title={t('معدل الاستبقاء', 'Retention Rate')}
          value={`${totals.avgRetention}%`}
          icon={<ArrowTrendingUpIcon className="w-5 h-5" />}
          trend={{ value: '+1.2%', positive: true }}
        />
        <StatCard
          title={t('طلاب معرضون للخطر', 'At-Risk Students')}
          value={totals.atRisk.toLocaleString()}
          icon={<ExclamationTriangleIcon className="w-5 h-5" />}
          trend={{ value: '-3.5%', positive: true }}
        />
      </div>

      {/* Sortable Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                  {t('القسم', 'Department')}
                </th>
                {([
                  ['totalStudents', 'الطلاب', 'Students'],
                  ['avgGPA', 'المعدل', 'GPA'],
                  ['retentionRate', 'الاستبقاء', 'Retention'],
                  ['atRiskCount', 'معرضون للخطر', 'At-Risk'],
                  ['dfwRate', 'نسبة DFW', 'DFW Rate'],
                ] as [SortKey, string, string][]).map(([key, ar, en]) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-4 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:text-gray-900 dark:hover:text-white"
                  >
                    {t(ar, en)}{sortIcon(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sorted.map(dept => (
                <tr key={dept.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {t(dept.nameAr, dept.nameEn)}
                  </td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{dept.totalStudents.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${dept.avgGPA >= 2.5 ? 'text-sa-600' : 'text-error-500'}`}>
                      {dept.avgGPA.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${dept.retentionRate >= 85 ? 'bg-sa-500' : 'bg-yellow-500'}`}
                          style={{ width: `${dept.retentionRate}%` }}
                        />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300">{dept.retentionRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      dept.atRiskCount > 50
                        ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    }`}>
                      {dept.atRiskCount}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={dept.dfwRate > 20 ? 'text-error-500 font-medium' : 'text-gray-600 dark:text-gray-300'}>
                      {dept.dfwRate}%
                    </span>
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
