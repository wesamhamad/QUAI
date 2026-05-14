import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { RiskCategoryInfo, RiskIndicatorDef } from '../types';

interface Props {
  categories: RiskCategoryInfo[];
}

/* Green-only palette: light green = low risk, dark green = high risk */
function greenShade(score: number): string {
  if (score <= 20) return 'var(--color-sa-200)';
  if (score <= 35) return 'var(--color-sa-300)';
  if (score <= 50) return 'var(--color-sa-400)';
  if (score <= 65) return 'var(--color-sa-500)';
  if (score <= 80) return 'var(--color-sa-700)';
  return 'var(--color-sa-900)';
}

function greenBgClass(score: number): string {
  if (score <= 35) return 'bg-sa-50 dark:bg-sa-950/40';
  if (score <= 65) return 'bg-sa-100 dark:bg-sa-950/60';
  return 'bg-sa-200 dark:bg-sa-950/80';
}

function greenTextClass(score: number): string {
  if (score <= 35) return 'text-sa-500 dark:text-sa-400';
  if (score <= 65) return 'text-sa-600 dark:text-sa-300';
  return 'text-sa-800 dark:text-sa-200';
}

function severityLabel(score: number, t: (ar: string, en: string) => string): { label: string; cls: string } {
  if (score <= 25) return { label: t('منخفض', 'Low'), cls: 'bg-sa-50 text-sa-600 dark:bg-sa-950 dark:text-sa-400' };
  if (score <= 50) return { label: t('متوسط', 'Medium'), cls: 'bg-sa-100 text-sa-700 dark:bg-sa-900/50 dark:text-sa-300' };
  if (score <= 75) return { label: t('مرتفع', 'High'), cls: 'bg-sa-200 text-sa-800 dark:bg-sa-900/70 dark:text-sa-200' };
  return { label: t('حرج', 'Critical'), cls: 'bg-sa-700 text-white dark:bg-sa-800 dark:text-sa-100' };
}

function statusBadge(status: string, t: (ar: string, en: string) => string) {
  const map: Record<string, { cls: string; labelAr: string; labelEn: string }> = {
    low:      { cls: 'bg-sa-50 text-sa-600 dark:bg-sa-950 dark:text-sa-400', labelAr: 'منخفض', labelEn: 'Low' },
    medium:   { cls: 'bg-sa-100 text-sa-700 dark:bg-sa-900/50 dark:text-sa-300', labelAr: 'متوسط', labelEn: 'Medium' },
    high:     { cls: 'bg-sa-200 text-sa-800 dark:bg-sa-900/70 dark:text-sa-200', labelAr: 'مرتفع', labelEn: 'High' },
    critical: { cls: 'bg-sa-700 text-white dark:bg-sa-800 dark:text-sa-100', labelAr: 'حرج', labelEn: 'Critical' },
  };
  const s = map[status] || map.low;
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.cls}`}>
      {t(s.labelAr, s.labelEn)}
    </span>
  );
}

const trendLabels = {
  improving: { ar: 'تحسّن', en: 'Improving', icon: '↗', cls: 'text-sa-500 dark:text-sa-400' },
  stable:    { ar: 'مستقر', en: 'Stable', icon: '→', cls: 'text-sa-400 dark:text-sa-500' },
  declining: { ar: 'تراجع', en: 'Declining', icon: '↘', cls: 'text-sa-800 dark:text-sa-200' },
};

function IndicatorRow({ indicator, t, index }: { indicator: RiskIndicatorDef; t: (ar: string, en: string) => string; index: number }) {
  const pct = Math.min(100, (indicator.currentValue / indicator.threshold) * 100);
  return (
    <div className="flex items-center gap-4 py-3.5 px-5">
      {/* Row number */}
      <span className="text-xs font-mono text-sa-300 dark:text-sa-700 w-5 text-center shrink-0">
        {index + 1}
      </span>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {t(indicator.nameAr, indicator.nameEn)}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
          {t(indicator.descriptionAr, indicator.descriptionEn)}
        </p>
      </div>

      {/* Value + bar */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-28 flex items-center gap-2">
          <div className="flex-1 h-2 bg-sa-50 dark:bg-sa-950 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${pct}%`, backgroundColor: greenShade(pct / 2) }}
            />
          </div>
          <span className="text-xs font-bold w-8 text-end" style={{ color: greenShade(pct / 2) }}>
            {Math.round(indicator.currentValue)}
          </span>
        </div>
        {statusBadge(indicator.status, t)}
      </div>
    </div>
  );
}

function CategoryCard({ category, t }: { category: RiskCategoryInfo; t: (ar: string, en: string) => string }) {
  const [expanded, setExpanded] = useState(false);
  const trend = trendLabels[category.trend];
  const Icon = category.icon;
  const sev = severityLabel(category.riskScore, t);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-5 flex items-center gap-5 hover:bg-sa-25 dark:hover:bg-gray-750 transition-colors text-start"
      >
        {/* Icon with green tint */}
        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center ${greenBgClass(category.riskScore)}`}>
          <Icon className={`w-6 h-6 ${greenTextClass(category.riskScore)}`} strokeWidth={1.75} />
        </div>

        {/* Name + meta row */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              {t(category.nameAr, category.nameEn)}
            </h3>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${sev.cls}`}>
              {sev.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {category.indicators.length} {t('مؤشر', 'indicators')}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {category.studentCount.toLocaleString()} {t('طالب', 'students')}
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
            <span className={`text-xs font-semibold ${trend.cls}`}>
              {trend.icon} {t(trend.ar, trend.en)}
            </span>
          </div>
        </div>

        {/* Score gauge */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative w-14 h-14">
            {/* Ring background */}
            <svg viewBox="0 0 48 48" className="w-full h-full -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor"
                className="text-sa-50 dark:text-sa-950" strokeWidth="4" />
              <circle cx="24" cy="24" r="20" fill="none"
                stroke={greenShade(category.riskScore)}
                strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${(category.riskScore / 100) * 125.6} 125.6`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-extrabold" style={{ color: greenShade(category.riskScore) }}>
                {category.riskScore}
              </span>
            </div>
          </div>
          {expanded ? (
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded indicators list */}
      {expanded && (
        <div className="border-t border-sa-100 dark:border-gray-700">
          {/* Table header */}
          <div className="flex items-center gap-4 px-5 py-2.5 bg-sa-25 dark:bg-gray-800 text-xs font-semibold text-sa-600 dark:text-sa-400 uppercase tracking-wider">
            <span className="w-5 text-center shrink-0">#</span>
            <span className="flex-1">{t('المؤشر', 'Indicator')}</span>
            <span className="w-28 text-center shrink-0">{t('القيمة', 'Value')}</span>
            <span className="w-20 text-center shrink-0">{t('الحالة', 'Status')}</span>
          </div>
          <div className="divide-y divide-sa-50 dark:divide-gray-700/50">
            {category.indicators.map((ind, i) => (
              <IndicatorRow key={ind.id} indicator={ind} t={t} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoryBreakdown({ categories }: Props) {
  const { t } = useLanguage();

  const sorted = [...categories].sort((a, b) => b.riskScore - a.riskScore);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-h2 text-gray-900 dark:text-white">
          {t('تفصيل فئات المخاطر', 'Risk Category Breakdown')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t(
            `${categories.length} فئات تضم ${categories.reduce((sum, c) => sum + c.indicators.length, 0)} مؤشرًا — مرتبة حسب الخطورة`,
            `${categories.length} categories with ${categories.reduce((sum, c) => sum + c.indicators.length, 0)} indicators — sorted by severity`
          )}
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs">
        <span className="text-gray-400">{t('مستوى الخطورة:', 'Severity:')}</span>
        {[
          { cls: 'bg-sa-50 text-sa-600', label: t('منخفض', 'Low') },
          { cls: 'bg-sa-100 text-sa-700', label: t('متوسط', 'Medium') },
          { cls: 'bg-sa-200 text-sa-800', label: t('مرتفع', 'High') },
          { cls: 'bg-sa-700 text-white', label: t('حرج', 'Critical') },
        ].map(l => (
          <span key={l.label} className={`px-2 py-0.5 rounded-md font-semibold ${l.cls}`}>{l.label}</span>
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map(cat => (
          <CategoryCard key={cat.key} category={cat} t={t} />
        ))}
      </div>
    </div>
  );
}
