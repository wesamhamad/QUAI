import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface CollegeRisk {
  nameAr: string;
  nameEn: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

interface RiskHeatmapProps {
  collegeData: CollegeRisk[];
}

type MetricKey = 'critical' | 'high' | 'medium' | 'total';

function getCellColor(value: number, max: number): string {
  if (max === 0) return 'bg-gray-100 dark:bg-gray-700';
  const ratio = value / max;
  if (ratio >= 0.75) return 'bg-error-500 text-white';
  if (ratio >= 0.5) return 'bg-error-300 dark:bg-error-700 text-error-900 dark:text-error-100';
  if (ratio >= 0.25) return 'bg-warning-200 dark:bg-warning-800 text-warning-800 dark:text-warning-200';
  if (ratio > 0) return 'bg-warning-100 dark:bg-warning-900 text-warning-700 dark:text-warning-300';
  return 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300';
}

const DEPARTMENTS_AR = ['علوم الحاسب', 'الهندسة', 'إدارة الأعمال', 'العلوم', 'الطب', 'الصيدلة'];
const DEPARTMENTS_EN = ['Computer Science', 'Engineering', 'Business', 'Sciences', 'Medicine', 'Pharmacy'];

export default function RiskHeatmap({ collegeData }: RiskHeatmapProps) {
  const { t } = useLanguage();
  const [metric, setMetric] = useState<MetricKey>('critical');

  const getValue = (c: CollegeRisk, m: MetricKey) => {
    if (m === 'total') return c.critical + c.high + c.medium;
    return c[m];
  };

  const maxValue = Math.max(...collegeData.map(c => getValue(c, metric)), 1);

  // Generate department-level heatmap data (simulated from college data)
  const heatmapData = collegeData.map(college => {
    const depts = DEPARTMENTS_AR.map((deptAr, i) => {
      // Distribute college risk proportionally across departments with some variance
      const seed = (college.nameAr.charCodeAt(0) + i * 7) % 10;
      const factor = 0.3 + (seed / 10) * 0.7;
      return {
        nameAr: deptAr,
        nameEn: DEPARTMENTS_EN[i],
        value: Math.round(getValue(college, metric) * factor / DEPARTMENTS_AR.length),
      };
    });
    return { college, depts };
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {t('خريطة حرارية للمخاطر حسب الكلية/القسم', 'Risk Heatmap by College/Department')}
        </h3>
        <select
          value={metric}
          onChange={e => setMetric(e.target.value as MetricKey)}
          className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        >
          <option value="critical">{t('حرج', 'Critical')}</option>
          <option value="high">{t('مرتفع', 'High')}</option>
          <option value="medium">{t('متوسط', 'Medium')}</option>
          <option value="total">{t('إجمالي المخاطر', 'Total At-Risk')}</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-start p-2 text-gray-500 dark:text-gray-400 font-medium">
                {t('الكلية', 'College')}
              </th>
              {DEPARTMENTS_AR.map((d, i) => (
                <th key={i} className="p-2 text-center text-gray-500 dark:text-gray-400 font-medium">
                  <span className="block truncate max-w-[70px]">{t(d, DEPARTMENTS_EN[i])}</span>
                </th>
              ))}
              <th className="p-2 text-center text-gray-500 dark:text-gray-400 font-medium">
                {t('الإجمالي', 'Total')}
              </th>
            </tr>
          </thead>
          <tbody>
            {heatmapData.map((row, ri) => (
              <tr key={ri}>
                <td className="p-2 text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">
                  {t(row.college.nameAr, row.college.nameEn)}
                </td>
                {row.depts.map((dept, di) => (
                  <td key={di} className="p-1 text-center">
                    <div className={`rounded-md px-2 py-1.5 font-bold ${getCellColor(dept.value, maxValue / DEPARTMENTS_AR.length)}`}>
                      {dept.value}
                    </div>
                  </td>
                ))}
                <td className="p-1 text-center">
                  <div className={`rounded-md px-2 py-1.5 font-bold ${getCellColor(getValue(row.college, metric), maxValue)}`}>
                    {getValue(row.college, metric)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Color legend */}
      <div className="flex items-center gap-3 mt-4 justify-center">
        <span className="text-[10px] text-gray-500 dark:text-gray-400">{t('منخفض', 'Low')}</span>
        <div className="flex gap-0.5">
          <div className="w-6 h-3 rounded-sm bg-success-50 dark:bg-success-900/30" />
          <div className="w-6 h-3 rounded-sm bg-warning-100 dark:bg-warning-900" />
          <div className="w-6 h-3 rounded-sm bg-warning-200 dark:bg-warning-800" />
          <div className="w-6 h-3 rounded-sm bg-error-300 dark:bg-error-700" />
          <div className="w-6 h-3 rounded-sm bg-error-500" />
        </div>
        <span className="text-[10px] text-gray-500 dark:text-gray-400">{t('مرتفع', 'High')}</span>
      </div>
    </div>
  );
}
