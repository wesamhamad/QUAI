import { useState, useMemo } from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { CollegeMetrics, DepartmentMetrics } from '../types';

interface Props {
  colleges: CollegeMetrics[];
}

type SortKey = 'satisfaction' | 'avgGpa' | 'retentionRate' | 'researchOutput';

export default function DepartmentRankings({ colleges }: Props) {
  const { t } = useLanguage();
  const [filterCollege, setFilterCollege] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('satisfaction');
  const [sortAsc, setSortAsc] = useState(false);

  const allDepts = useMemo(() => {
    let deps: (DepartmentMetrics & { collegeNameAr: string; collegeNameEn: string })[] = [];
    for (const c of colleges) {
      for (const d of c.departments) {
        deps.push({ ...d, collegeNameAr: c.nameAr, collegeNameEn: c.nameEn });
      }
    }
    if (filterCollege !== 'all') {
      deps = deps.filter(d => d.collegeId === filterCollege);
    }
    deps.sort((a, b) => sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]);
    return deps;
  }, [colleges, filterCollege, sortKey, sortAsc]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return sortAsc
      ? <ChevronUpIcon className="w-3 h-3 inline ms-0.5" />
      : <ChevronDownIcon className="w-3 h-3 inline ms-0.5" />;
  };

  const cols: { key: SortKey; labelAr: string; labelEn: string }[] = [
    { key: 'satisfaction', labelAr: 'رضا الطلاب', labelEn: 'Satisfaction' },
    { key: 'avgGpa', labelAr: 'المعدل', labelEn: 'GPA' },
    { key: 'retentionRate', labelAr: 'الاستبقاء', labelEn: 'Retention' },
    { key: 'researchOutput', labelAr: 'الأبحاث', labelEn: 'Research' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {t('تصنيف الأقسام', 'Department Rankings')}
        </h2>
        <select
          value={filterCollege}
          onChange={e => setFilterCollege(e.target.value)}
          className="text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-1.5"
        >
          <option value="all">{t('جميع الكليات', 'All Colleges')}</option>
          {colleges.map(c => (
            <option key={c.id} value={c.id}>{t(c.nameAr, c.nameEn)}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">#</th>
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  {t('القسم', 'Department')}
                </th>
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                  {t('الكلية', 'College')}
                </th>
                {cols.map(col => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-white select-none"
                  >
                    {t(col.labelAr, col.labelEn)}
                    <SortIcon col={col.key} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allDepts.map((d, i) => (
                <tr key={d.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 text-gray-400 dark:text-gray-500 font-mono text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{t(d.nameAr, d.nameEn)}</td>
                  <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{t(d.collegeNameAr, d.collegeNameEn)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div className="h-full bg-sa-500 rounded-full" style={{ width: `${d.satisfaction}%` }} />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{d.satisfaction}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{d.avgGpa.toFixed(2)}</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{d.retentionRate}%</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{d.researchOutput}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
