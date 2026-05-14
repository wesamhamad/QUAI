import { useState } from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { MetricKey, SemesterSnapshot } from '../types';
import { semesters, metricOptions } from '../data/mockBenchmarkData';

interface Props {
  snapshots: SemesterSnapshot[];
}

type OrgLevel = 'university' | 'college' | 'department';

export default function ReportBuilder({ snapshots }: Props) {
  const { t } = useLanguage();
  const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(['avgGpa', 'retentionRate']);
  const [startSem, setStartSem] = useState('s1');
  const [endSem, setEndSem] = useState('s5');
  const [orgLevel, setOrgLevel] = useState<OrgLevel>('university');
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'excel'>('csv');
  const [exported, setExported] = useState(false);

  function toggleMetric(key: MetricKey) {
    setSelectedMetrics(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }

  const startIdx = semesters.findIndex(s => s.id === startSem);
  const endIdx = semesters.findIndex(s => s.id === endSem);
  const validRange = startIdx <= endIdx;
  const rangeSnapshots = validRange ? snapshots.slice(startIdx, endIdx + 1) : [];

  function getMetricValue(snap: SemesterSnapshot, metric: MetricKey): string {
    const u = snap.university;
    switch (metric) {
      case 'avgGpa': return u.overallGpa.toFixed(2);
      case 'retentionRate': return `${u.retentionRate}%`;
      case 'graduationRate': return `${u.graduationRate}%`;
      case 'atRiskPercent': return `${u.atRiskPercent}%`;
      case 'enrollment': return u.totalEnrollment.toLocaleString();
      default: return '-';
    }
  }

  function handleExport() {
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {t('منشئ التقارير', 'Custom Report Builder')}
      </h2>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-5">
        {/* Metrics Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('اختر المقاييس', 'Select Metrics')}
          </label>
          <div className="flex flex-wrap gap-2">
            {metricOptions.filter(m => ['avgGpa', 'retentionRate', 'graduationRate', 'atRiskPercent', 'enrollment'].includes(m.key)).map(m => (
              <button
                key={m.key}
                onClick={() => toggleMetric(m.key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  selectedMetrics.includes(m.key)
                    ? 'bg-sa-500 text-white border-sa-500'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {t(m.labelAr, m.labelEn)}
              </button>
            ))}
          </div>
        </div>

        {/* Time Range */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('من الفصل', 'From Semester')}
            </label>
            <select
              value={startSem}
              onChange={e => setStartSem(e.target.value)}
              className="w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
            >
              {semesters.map(s => (
                <option key={s.id} value={s.id}>{t(s.labelAr, s.labelEn)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('إلى الفصل', 'To Semester')}
            </label>
            <select
              value={endSem}
              onChange={e => setEndSem(e.target.value)}
              className="w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2"
            >
              {semesters.map(s => (
                <option key={s.id} value={s.id}>{t(s.labelAr, s.labelEn)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Organization Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('المستوى التنظيمي', 'Organization Level')}
          </label>
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden w-fit">
            {([
              { key: 'university' as OrgLevel, labelAr: 'الجامعة', labelEn: 'University' },
              { key: 'college' as OrgLevel, labelAr: 'الكلية', labelEn: 'College' },
              { key: 'department' as OrgLevel, labelAr: 'القسم', labelEn: 'Department' },
            ]).map(lv => (
              <button
                key={lv.key}
                onClick={() => setOrgLevel(lv.key)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                  orgLevel === lv.key
                    ? 'bg-sa-500 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {t(lv.labelAr, lv.labelEn)}
              </button>
            ))}
          </div>
        </div>

        {/* Export Format & Button */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('صيغة التصدير', 'Export Format')}
          </label>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden w-fit">
              {([
                { key: 'csv' as const, label: 'CSV' },
                { key: 'pdf' as const, label: 'PDF' },
                { key: 'excel' as const, label: 'Excel' },
              ]).map(fmt => (
                <button
                  key={fmt.key}
                  onClick={() => setExportFormat(fmt.key)}
                  className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                    exportFormat === fmt.key
                      ? 'bg-sa-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleExport}
              disabled={selectedMetrics.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-sa-500 hover:bg-sa-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <DocumentArrowDownIcon className="w-4 h-4" />
              {exported ? t('تم التصدير!', 'Exported!') : t(`تصدير ${exportFormat.toUpperCase()}`, `Export ${exportFormat.toUpperCase()}`)}
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {t('(محاكاة)', '(Mock)')}
            </span>
          </div>
        </div>
      </div>

      {/* Preview Table */}
      {selectedMetrics.length > 0 && rangeSnapshots.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {t('معاينة التقرير', 'Report Preview')}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                    {t('الفصل', 'Semester')}
                  </th>
                  {selectedMetrics.map(key => {
                    const opt = metricOptions.find(m => m.key === key);
                    return (
                      <th key={key} className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">
                        {opt ? t(opt.labelAr, opt.labelEn) : key}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {rangeSnapshots.map((snap, si) => {
                  const sem = semesters.find(s => s.id === snap.semesterId);
                  return (
                    <tr key={snap.semesterId} className="border-b border-gray-100 dark:border-gray-700/50">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                        {sem ? t(sem.labelAr, sem.labelEn) : snap.semesterId}
                      </td>
                      {selectedMetrics.map(key => (
                        <td key={key} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                          {getMetricValue(snap, key)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
