import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
  BarChart, Bar,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { UniversityRiskOverview, RiskCategoryInfo, RiskTrendPoint } from '../types';

interface Props {
  overview: UniversityRiskOverview;
  categories: RiskCategoryInfo[];
  trends: RiskTrendPoint[];
  collegeData: Array<{ nameAr: string; nameEn: string; low: number; medium: number; high: number; critical: number }>;
}

const RISK_COLORS = ['#25935F', '#F5BD02', '#F04438', '#D92D20'];

export default function PredictiveCharts({ overview, categories, trends, collegeData }: Props) {
  const { t, lang } = useLanguage();

  const distributionData = [
    { name: t('منخفض', 'Low'), value: overview.lowRisk },
    { name: t('متوسط', 'Medium'), value: overview.mediumRisk },
    { name: t('مرتفع', 'High'), value: overview.highRisk },
    { name: t('حرج', 'Critical'), value: overview.criticalRisk },
  ];

  const radarData = categories.map(c => ({
    category: t(c.nameAr, c.nameEn),
    score: c.riskScore,
    fullMark: 100,
  }));

  const trendData = trends.map(tp => ({
    week: t(tp.week, tp.weekEn),
    [t('منخفض', 'Low')]: tp.low,
    [t('متوسط', 'Medium')]: tp.medium,
    [t('مرتفع', 'High')]: tp.high,
    [t('حرج', 'Critical')]: tp.critical,
  }));

  const collegeChartData = collegeData.map(c => ({
    name: t(c.nameAr, c.nameEn),
    [t('مرتفع', 'High')]: c.high,
    [t('حرج', 'Critical')]: c.critical,
    [t('متوسط', 'Medium')]: c.medium,
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {t('التحليلات التنبؤية', 'Predictive Analytics')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Distribution Pie */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
            {t('توزيع مستويات المخاطر', 'Risk Level Distribution')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {distributionData.map((_, idx) => (
                    <Cell key={idx} fill={RISK_COLORS[idx]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  formatter={(value: number) => [value.toLocaleString(), t('طالب', 'students')]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {distributionData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS[i] }} />
                <span className="text-gray-600 dark:text-gray-400">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Radar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
            {t('رادار فئات المخاطر', 'Risk Category Radar')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                <PolarGrid className="opacity-30" />
                <PolarAngleAxis dataKey="category" tick={{ fontSize: 9, fill: '#6C737F' }} />
                <Radar name={t('المخاطر', 'Risk')} dataKey="score" stroke="#F04438" fill="#F04438" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Trend Line */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
            {t('اتجاه المخاطر (4 أسابيع)', 'Risk Trend (4 Weeks)')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey={t('حرج', 'Critical')} stroke="#D92D20" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey={t('مرتفع', 'High')} stroke="#F04438" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey={t('متوسط', 'Medium')} stroke="#F5BD02" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* College Heatmap / Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
            {t('المخاطر حسب الكلية', 'Risk by College')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={collegeChartData} layout="vertical" margin={{ top: 5, right: 20, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9 }} width={70} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey={t('حرج', 'Critical')} stackId="a" fill="#D92D20" />
                <Bar dataKey={t('مرتفع', 'High')} stackId="a" fill="#F04438" />
                <Bar dataKey={t('متوسط', 'Medium')} stackId="a" fill="#F5BD02" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
