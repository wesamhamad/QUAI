import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, Legend,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import { allTasks } from '../data/agentTasks';
import { executionHistory, categoryPerformance, responseTimeTrend } from '../data/chartData';
import type { AutonomyMode } from '../types';

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #E5E7EB',
  borderRadius: '8px',
  color: '#374151',
  fontSize: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

const modeColors: Record<AutonomyMode, string> = {
  autonomous: '#25935F',
  agent_notify: '#2E90FA',
  human_approves: '#F79009',
  human_only: '#9DA4AE',
};

const modeLabels: Record<AutonomyMode, { ar: string; en: string }> = {
  autonomous: { ar: 'مستقل', en: 'Autonomous' },
  agent_notify: { ar: 'وكيل + إشعار', en: 'Agent + Notify' },
  human_approves: { ar: 'يعتمد بشري', en: 'Human Approves' },
  human_only: { ar: 'بشري فقط', en: 'Human Only' },
};

export default function PerformanceCharts() {
  const { lang, t } = useLanguage();

  const modeCounts: Record<AutonomyMode, number> = { autonomous: 0, agent_notify: 0, human_approves: 0, human_only: 0 };
  allTasks.forEach(task => modeCounts[task.mode]++);
  const total = allTasks.length;
  const donutData = (Object.keys(modeCounts) as AutonomyMode[]).map(mode => ({
    name: t(modeLabels[mode].ar, modeLabels[mode].en),
    value: modeCounts[mode],
    percentage: Math.round((modeCounts[mode] / total) * 100),
    color: modeColors[mode],
  }));

  const radarData = categoryPerformance.map(cp => ({
    subject: lang === 'ar' ? cp.categoryAr : cp.category,
    value: cp.successRate,
    fullMark: 100,
  }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">
          {t('مقاييس الأداء', 'Performance Metrics')}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        {/* Tasks Over Time (Area) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="p-5"
        >
          <p className="text-sm text-gray-500 mb-3 font-medium">{t('المهام المكتملة بمرور الوقت', 'Tasks Completed Over Time')}</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={executionHistory}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#25935F" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#25935F" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F79009" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#F79009" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="date" tick={{ fill: '#9DA4AE', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9DA4AE', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="completed" stroke="#25935F" strokeWidth={2} fill="url(#colorCompleted)" name={t('مكتمل', 'Completed')} />
                <Area type="monotone" dataKey="alerts" stroke="#F79009" strokeWidth={2} fill="url(#colorAlerts)" name={t('تنبيهات', 'Alerts')} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Autonomy Distribution (Donut) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="p-5"
        >
          <p className="text-sm text-gray-500 mb-3 font-medium">{t('توزيع الاستقلالية', 'Autonomy Distribution')}</p>
          <div className="flex items-center gap-4">
            <div className="w-40 h-40 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value" strokeWidth={0}>
                    {donutData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value} ${t('مهمة', 'tasks')}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2.5">
              {donutData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-gray-600 flex-1">{item.name}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${item.color}10`, color: item.color }}>
                    {item.value} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category Performance (Radar) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-5"
        >
          <p className="text-sm text-gray-500 mb-3 font-medium">{t('أداء الفئات', 'Category Performance')}</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6C737F', fontSize: 9 }} />
                <PolarRadiusAxis angle={30} domain={[80, 100]} tick={{ fill: '#9DA4AE', fontSize: 10 }} axisLine={false} />
                <Radar name={t('معدل النجاح', 'Success Rate')} dataKey="value" stroke="#25935F" fill="#25935F" fillOpacity={0.12} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Response Time Trend (Line) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="p-5"
        >
          <p className="text-sm text-gray-500 mb-3 font-medium">{t('اتجاه وقت الاستجابة', 'Response Time Trend')}</p>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="time" tick={{ fill: '#9DA4AE', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9DA4AE', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#6C737F' }} />
                <Line type="monotone" dataKey="avgMs" stroke="#2E90FA" strokeWidth={2} dot={false} name={t('متوسط (مللي ثانية)', 'Avg (ms)')} />
                <Line type="monotone" dataKey="p95Ms" stroke="#F04438" strokeWidth={2} dot={false} strokeDasharray="5 5" name="P95 (ms)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
