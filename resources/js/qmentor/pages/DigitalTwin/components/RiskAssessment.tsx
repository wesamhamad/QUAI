import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import type { RiskAssessmentData, RiskIndicator } from '../types';
import DataSourceBadge from '../../../components/shared/DataSourceBadge';
import { useLanguage } from '../../../contexts/LanguageContext';

interface Props {
  risk: RiskAssessmentData;
  source?: 'api' | 'mock';
}

function riskColor(score: number): string {
  if (score <= 25) return '#25935F';
  if (score <= 50) return '#F5BD02';
  if (score <= 75) return '#F04438';
  return '#D92D20';
}

function riskLabel(score: number, isAr: boolean): string {
  if (score <= 25) return isAr ? 'منخفض' : 'Low';
  if (score <= 50) return isAr ? 'متوسط' : 'Medium';
  if (score <= 75) return isAr ? 'مرتفع' : 'High';
  return isAr ? 'حرج' : 'Critical';
}

const trendIcons = { improving: '↗', stable: '→', declining: '↘' };
const trendColors = { improving: 'text-sa-600', stable: 'text-gray-500', declining: 'text-error-500' };

function RiskGauge({ score }: { score: number }) {
  const { lang } = useLanguage();
  const color = riskColor(score);
  const angle = (score / 100) * 180;
  const r = 60;
  const cx = 70;
  const cy = 70;

  // Arc path for background
  const describeArc = (startAngle: number, endAngle: number) => {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 180) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 140 85" className="w-40 h-auto">
        {/* Background arc */}
        <path d={describeArc(0, 180)} fill="none" stroke="#E5E7EB" strokeWidth="12" strokeLinecap="round" />
        {/* Score arc */}
        <motion.path
          d={describeArc(0, angle)}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        {/* Score text */}
        <text x={cx} y={cy - 8} textAnchor="middle" className="fill-current text-gray-900 dark:text-white" fontSize="24" fontWeight="bold">
          {score}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fontSize="10" fill="#6C737F">/ 100</text>
      </svg>
      <span className="text-sm font-bold mt-1" style={{ color }}>{riskLabel(score, lang === 'ar')}</span>
    </div>
  );
}

function TopFactors({ indicators }: { indicators: RiskIndicator[] }) {
  const { t, lang } = useLanguage();
  const top3 = [...indicators].sort((a, b) => b.score - a.score).slice(0, 3);
  const total = top3.reduce((s, i) => s + i.score, 0);

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">{t('أهم العوامل المؤثرة', 'Top Contributing Factors')}</h4>
      {top3.map((ind, i) => {
        const weight = total > 0 ? Math.round((ind.score / total) * 100) : 0;
        const color = riskColor(ind.score);
        return (
          <motion.div
            key={ind.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold" style={{ backgroundColor: color }}>
              {ind.score}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={(lang === 'ar' ? (ind.tooltip || ind.name) : (ind.tooltipEn || ind.nameEn))}>{lang === 'ar' ? ind.name : ind.nameEn}</p>
                <span className="text-xs font-bold mr-2" style={{ color }}>{weight}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${ind.score}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

function IndicatorCard({ indicator }: { indicator: RiskIndicator }) {
  const { lang } = useLanguage();
  const color = riskColor(indicator.score);
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 flex items-start gap-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold" style={{ backgroundColor: color }}>
        {indicator.score}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={(lang === 'ar' ? (indicator.tooltip || indicator.name) : (indicator.tooltipEn || indicator.nameEn))}>{lang === 'ar' ? indicator.name : indicator.nameEn}</p>
          <span className={`text-xs ${trendColors[indicator.trend]}`}>{trendIcons[indicator.trend]}</span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lang === 'ar' ? indicator.description : indicator.descriptionEn}</p>
      </div>
    </div>
  );
}

export default function RiskAssessment({ risk, source = 'mock' }: Props) {
  const { t, lang } = useLanguage();
  const radarData = risk.categoryScores.map(cs => ({
    category: lang === 'ar' ? cs.label : cs.labelEn,
    score: cs.score,
    fullMark: 100,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-error-100 dark:bg-red-900 flex items-center justify-center text-error-500 dark:text-red-400"><ShieldCheck className="w-4 h-4" /></span>
          {t('تقييم المخاطر', 'Risk Assessment')}
        </h2>
        <DataSourceBadge source={source} />
      </div>

      {/* Gauge + Top 3 Factors + Trend */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
        <RiskGauge score={risk.overallScore} />
        <TopFactors indicators={risk.indicators} />
        <div>
          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{t('اتجاه المخاطر', 'Risk Trend')}</h4>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={risk.history} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 9 }} hide />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} formatter={(v: number) => [`${v}`, t('الخطورة', 'Risk')]} />
                <Line type="monotone" dataKey="score" stroke={riskColor(risk.overallScore)} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className={`text-xs flex items-center gap-1 mt-1 ${trendColors[risk.trend]}`}>
            {trendIcons[risk.trend]} {risk.trend === 'improving' ? t('تحسن مستمر', 'Steady improvement') : risk.trend === 'stable' ? t('مستقر', 'Stable') : t('انخفاض', 'Declining')}
          </p>
        </div>
      </div>

      {/* Radar Chart */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{t('توزيع المخاطر حسب الفئة', 'Risk Distribution by Category')}</h3>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid className="opacity-30" />
              <PolarAngleAxis dataKey="category" tick={{ fontSize: 9, fill: '#6C737F' }} />
              <Radar name={t('الخطورة', 'Risk')} dataKey="score" stroke="#F04438" fill="#F04438" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Score Bars */}
      <div className="space-y-2">
        {risk.categoryScores.map((cs, i) => (
          <motion.div
            key={cs.category}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs text-gray-600 dark:text-gray-400 w-28 truncate">{lang === 'ar' ? cs.label : cs.labelEn}</span>
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cs.score}%` }}
                transition={{ duration: 0.6, delay: i * 0.03 }}
                className="h-full rounded-full"
                style={{ backgroundColor: riskColor(cs.score) }}
              />
            </div>
            <span className="text-xs font-bold w-8 text-left" style={{ color: riskColor(cs.score) }}>{cs.score}</span>
          </motion.div>
        ))}
      </div>

      {/* Risk Indicators */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{t('مؤشرات المخاطر الرئيسية', 'Key Risk Indicators')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {risk.indicators.map(ind => (
            <IndicatorCard key={ind.id} indicator={ind} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
