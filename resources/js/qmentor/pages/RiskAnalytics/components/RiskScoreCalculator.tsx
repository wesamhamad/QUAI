import { useState, useMemo } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { RiskCategoryInfo, RiskLevel } from '../types';

interface RiskScoreCalculatorProps {
  categories: RiskCategoryInfo[];
}

const RISK_COLORS: Record<RiskLevel, string> = {
  low: '#25935F',
  medium: '#F5BD02',
  high: '#F04438',
  critical: '#D92D20',
};

function getScoreLevel(score: number): RiskLevel {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

export default function RiskScoreCalculator({ categories }: RiskScoreCalculatorProps) {
  const { t } = useLanguage();
  const [weights, setWeights] = useState<Record<string, number>>(() => {
    const w: Record<string, number> = {};
    categories.forEach(c => { w[c.key] = 1; });
    return w;
  });

  const compositeScore = useMemo(() => {
    let totalWeight = 0;
    let weightedSum = 0;
    categories.forEach(c => {
      const w = weights[c.key] ?? 1;
      weightedSum += c.riskScore * w;
      totalWeight += w;
    });
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }, [categories, weights]);

  const level = getScoreLevel(compositeScore);
  const color = RISK_COLORS[level];

  // SVG gauge parameters
  const radius = 80;
  const circumference = Math.PI * radius; // half-circle
  const strokeOffset = circumference - (compositeScore / 100) * circumference;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        {t('حاسبة درجة المخاطر المركبة', 'Composite Risk Score Calculator')}
      </h3>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Gauge */}
        <div className="flex flex-col items-center justify-center flex-shrink-0">
          <svg width="200" height="120" viewBox="0 0 200 120">
            {/* Background arc */}
            <path
              d="M 10 110 A 80 80 0 0 1 190 110"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="14"
              strokeLinecap="round"
              className="dark:stroke-gray-700"
            />
            {/* Score arc */}
            <path
              d="M 10 110 A 80 80 0 0 1 190 110"
              fill="none"
              stroke={color}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              strokeDashoffset={strokeOffset}
              style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s' }}
            />
            {/* Score text */}
            <text x="100" y="95" textAnchor="middle" className="text-3xl font-bold" fill={color}>
              {compositeScore}
            </text>
            <text x="100" y="112" textAnchor="middle" className="text-xs" fill="#9CA3AF">
              / 100
            </text>
          </svg>
          <span
            className="mt-1 px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {level === 'critical' ? t('حرج', 'Critical')
              : level === 'high' ? t('مرتفع', 'High')
              : level === 'medium' ? t('متوسط', 'Medium')
              : t('منخفض', 'Low')}
          </span>
        </div>

        {/* Weight sliders */}
        <div className="flex-1 space-y-2 max-h-72 overflow-y-auto">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            {t('اضبط أوزان الفئات لحساب الدرجة المركبة', 'Adjust category weights to compute composite score')}
          </p>
          {categories.map(c => (
            <div key={c.key} className="flex items-center gap-3">
              <span className="text-xs text-gray-700 dark:text-gray-300 w-28 truncate" title={t(c.nameAr, c.nameEn)}>
                {t(c.nameAr, c.nameEn)}
              </span>
              <input
                type="range"
                min={0}
                max={3}
                step={0.5}
                value={weights[c.key] ?? 1}
                onChange={e => setWeights(prev => ({ ...prev, [c.key]: parseFloat(e.target.value) }))}
                className="flex-1 h-1.5 accent-sa-500"
              />
              <span className="text-xs font-mono text-gray-500 dark:text-gray-400 w-6 text-end">
                {(weights[c.key] ?? 1).toFixed(1)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 w-8 text-end">{c.riskScore}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
