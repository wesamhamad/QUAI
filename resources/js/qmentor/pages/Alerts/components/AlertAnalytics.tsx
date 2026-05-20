import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { AlertAnalyticsData } from '../types';

interface AlertAnalyticsProps {
  data: AlertAnalyticsData;
}

const SEVERITY_COLORS = {
  info: '#0ea5e9',
  warning: '#eab308',
  urgent: '#f97316',
  critical: '#ef4444',
};

const RESPONSE_COLORS = ['#16a34a', '#22c55e', '#eab308', '#f97316', '#ef4444'];

export default function AlertAnalytics({ data }: AlertAnalyticsProps) {
  const { t, lang } = useLanguage();
  const isRtl = lang === 'ar';

  return (
    <div className="space-y-6">
      {/* Top row: Alerts by Type + Severity Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts by Type */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {t('التنبيهات حسب النوع', 'Alerts by Type')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.byType} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <YAxis
                  type="category"
                  dataKey={isRtl ? 'type' : 'typeEn'}
                  width={120}
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
                />
                <Bar dataKey="count" fill="#16a34a" radius={[0, 4, 4, 0]} name={t('العدد', 'Count')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Over Time */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {t('الخطورة عبر الزمن', 'Severity Over Time')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.severityOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                <XAxis dataKey={isRtl ? 'month' : 'monthEn'} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="info" stroke={SEVERITY_COLORS.info} strokeWidth={2} name={t('معلومة', 'Info')} dot={false} />
                <Line type="monotone" dataKey="warning" stroke={SEVERITY_COLORS.warning} strokeWidth={2} name={t('تحذير', 'Warning')} dot={false} />
                <Line type="monotone" dataKey="urgent" stroke={SEVERITY_COLORS.urgent} strokeWidth={2} name={t('عاجل', 'Urgent')} dot={false} />
                <Line type="monotone" dataKey="critical" stroke={SEVERITY_COLORS.critical} strokeWidth={2} name={t('حرج', 'Critical')} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom row: Response Time + Top Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {t('توزيع وقت الاستجابة', 'Response Time Distribution')}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.responseTime}
                  dataKey="count"
                  nameKey={isRtl ? 'range' : 'rangeEn'}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={10}
                >
                  {data.responseTime.map((_, idx) => (
                    <Cell key={idx} fill={RESPONSE_COLORS[idx % RESPONSE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Triggered Indicators */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            {t('أكثر المؤشرات تفعيلاً', 'Top Triggered Indicators')}
          </h3>
          <div className="space-y-3">
            {data.topIndicators.map((ind, idx) => {
              const max = data.topIndicators[0].count;
              const pct = (ind.count / max) * 100;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">
                      {t(ind.indicator, ind.indicatorEn)}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{ind.count}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sa-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resolution Rates */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t('معدلات الحل والتصعيد', 'Resolution & Escalation Rates')}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.resolutionRates}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
              <XAxis dataKey={isRtl ? 'month' : 'monthEn'} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="resolved" stackId="a" fill="#16a34a" name={t('محلول', 'Resolved')} radius={[0, 0, 0, 0]} />
              <Bar dataKey="pending" stackId="a" fill="#eab308" name={t('معلق', 'Pending')} radius={[0, 0, 0, 0]} />
              <Bar dataKey="escalated" stackId="a" fill="#ef4444" name={t('مُصعّد', 'Escalated')} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
