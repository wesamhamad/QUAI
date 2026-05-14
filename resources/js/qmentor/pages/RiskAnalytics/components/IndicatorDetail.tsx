import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { RiskIndicatorDef, RiskCategoryKey } from '../types';
import { categoryMeta } from '../data/riskIndicators';

interface Props {
  indicators: RiskIndicatorDef[];
}

function riskColor(status: string): string {
  const map: Record<string, string> = {
    low: '#25935F',
    medium: '#F5BD02',
    high: '#F04438',
    critical: '#D92D20',
  };
  return map[status] || map.low;
}

function statusLabel(status: string, t: (ar: string, en: string) => string) {
  const map: Record<string, { ar: string; en: string }> = {
    low: { ar: 'منخفض', en: 'Low' },
    medium: { ar: 'متوسط', en: 'Medium' },
    high: { ar: 'مرتفع', en: 'High' },
    critical: { ar: 'حرج', en: 'Critical' },
  };
  const s = map[status] || map.low;
  return t(s.ar, s.en);
}

export default function IndicatorDetail({ indicators }: Props) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<RiskCategoryKey | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = indicators.filter(ind => {
    if (filterCategory !== 'all' && ind.category !== filterCategory) return false;
    if (filterStatus !== 'all' && ind.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return ind.nameAr.includes(q) || ind.nameEn.toLowerCase().includes(q) || ind.id.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {t('تفاصيل المؤشرات', 'Indicator Details')} ({indicators.length})
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="w-4 h-4 absolute top-2.5 start-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('بحث في المؤشرات...', 'Search indicators...')}
            className="w-full ps-9 pe-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sa-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value as RiskCategoryKey | 'all')}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500"
        >
          <option value="all">{t('جميع الفئات', 'All Categories')}</option>
          {Object.entries(categoryMeta).map(([key, meta]) => (
            <option key={key} value={key}>{t(meta.nameAr, meta.nameEn)}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500"
        >
          <option value="all">{t('جميع المستويات', 'All Levels')}</option>
          <option value="low">{t('منخفض', 'Low')}</option>
          <option value="medium">{t('متوسط', 'Medium')}</option>
          <option value="high">{t('مرتفع', 'High')}</option>
          <option value="critical">{t('حرج', 'Critical')}</option>
        </select>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        {t(`عرض ${filtered.length} من ${indicators.length} مؤشر`, `Showing ${filtered.length} of ${indicators.length} indicators`)}
      </p>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-start py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t('المعرف', 'ID')}</th>
              <th className="text-start py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t('المؤشر', 'Indicator')}</th>
              <th className="text-start py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t('الفئة', 'Category')}</th>
              <th className="text-start py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t('الحد', 'Threshold')}</th>
              <th className="text-start py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t('القيمة الحالية', 'Current')}</th>
              <th className="text-start py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t('الحالة', 'Status')}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ind => (
              <tr key={ind.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="py-2 px-3 text-xs font-mono text-gray-500">{ind.id}</td>
                <td className="py-2 px-3">
                  <p className="font-medium text-gray-900 dark:text-white">{t(ind.nameAr, ind.nameEn)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{t(ind.descriptionAr, ind.descriptionEn)}</p>
                </td>
                <td className="py-2 px-3 text-xs text-gray-600 dark:text-gray-400">
                  {categoryMeta[ind.category] && t(categoryMeta[ind.category].nameAr, categoryMeta[ind.category].nameEn)}
                </td>
                <td className="py-2 px-3 text-xs font-mono text-gray-600 dark:text-gray-400">{ind.threshold}</td>
                <td className="py-2 px-3">
                  <span className="text-sm font-bold" style={{ color: riskColor(ind.status) }}>
                    {ind.currentValue}
                  </span>
                </td>
                <td className="py-2 px-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: riskColor(ind.status) }}
                  >
                    {statusLabel(ind.status, t)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
