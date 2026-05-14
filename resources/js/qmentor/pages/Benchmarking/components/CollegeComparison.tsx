import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { CollegeMetrics } from '../types';

interface Props {
  colleges: CollegeMetrics[];
}

const COLORS = ['#25935F', '#2E90FA', '#F5BD02', '#F04438', '#7A5AF8'];

export default function CollegeComparison({ colleges }: Props) {
  const { t } = useLanguage();

  const barData = colleges.map((c, i) => ({
    name: t(c.nameAr, c.nameEn),
    [t('المعدل', 'GPA')]: c.avgGpa,
    [t('الاستبقاء', 'Retention')]: c.retentionRate,
    [t('التخرج', 'Graduation')]: c.graduationRate,
  }));

  const radarData = [
    { metric: t('المعدل', 'GPA'), ...Object.fromEntries(colleges.map(c => [t(c.nameAr, c.nameEn), c.avgGpa * 25])) },
    { metric: t('الاستبقاء', 'Retention'), ...Object.fromEntries(colleges.map(c => [t(c.nameAr, c.nameEn), c.retentionRate])) },
    { metric: t('التخرج', 'Graduation'), ...Object.fromEntries(colleges.map(c => [t(c.nameAr, c.nameEn), c.graduationRate])) },
    { metric: t('الطلاب', 'Enrollment'), ...Object.fromEntries(colleges.map(c => [t(c.nameAr, c.nameEn), (c.enrollment / 60) ])) },
    { metric: t('100 - خطر', '100 - Risk'), ...Object.fromEntries(colleges.map(c => [t(c.nameAr, c.nameEn), 100 - c.atRiskPercent])) },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {t('مقارنة الكليات', 'College Comparison')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
            {t('المعدل والاستبقاء والتخرج', 'GPA, Retention & Graduation Rates')}
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey={t('المعدل', 'GPA')} fill="#25935F" radius={[4, 4, 0, 0]} />
                <Bar dataKey={t('الاستبقاء', 'Retention')} fill="#2E90FA" radius={[4, 4, 0, 0]} />
                <Bar dataKey={t('التخرج', 'Graduation')} fill="#F5BD02" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
            {t('مقارنة شاملة', 'Multi-Metric Comparison')}
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="60%">
                <PolarGrid className="opacity-30" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 9, fill: '#6C737F' }} />
                {colleges.map((c, i) => (
                  <Radar
                    key={c.id}
                    name={t(c.nameAr, c.nameEn)}
                    dataKey={t(c.nameAr, c.nameEn)}
                    stroke={COLORS[i]}
                    fill={COLORS[i]}
                    fillOpacity={0.08}
                    strokeWidth={2}
                  />
                ))}
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
