import { useLanguage } from '../../../contexts/LanguageContext';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

// --- Mock Data ---

const COLORS = {
  low: '#25935F',      // sa-200 range (green)
  medium: '#F5BD02',   // gold-400
  high: '#F04438',     // error-400
  critical: '#D92D20', // error-600
};

const distributionData = [
  { name: 'Low', nameAr: 'منخفض', value: 45, color: COLORS.low },
  { name: 'Medium', nameAr: 'متوسط', value: 28, color: COLORS.medium },
  { name: 'High', nameAr: 'مرتفع', value: 15, color: COLORS.high },
  { name: 'Critical', nameAr: 'حرج', value: 7, color: COLORS.critical },
];

const totalStudents = distributionData.reduce((s, d) => s + d.value, 0);

const topIndicators = [
  { id: 'A-01', labelAr: 'A-01: نسبة الغياب', labelEn: 'A-01: Absence Rate', count: 32 },
  { id: 'G-04', labelAr: 'G-04: انخفاض المعدل', labelEn: 'G-04: GPA Decline', count: 28 },
  { id: 'S-01', labelAr: 'S-01: العزلة الاجتماعية', labelEn: 'S-01: Social Isolation', count: 22 },
  { id: 'G-07', labelAr: 'G-07: رسوب متكرر', labelEn: 'G-07: Repeated Failure', count: 18 },
  { id: 'AC-01', labelAr: 'AC-01: تأخر أكاديمي', labelEn: 'AC-01: Academic Delay', count: 12 },
];

const trendData = [
  { month: 'Nov', monthAr: 'نوف', low: 52, medium: 22, high: 10, critical: 4 },
  { month: 'Dec', monthAr: 'ديس', low: 50, medium: 24, high: 11, critical: 5 },
  { month: 'Jan', monthAr: 'يناير', low: 48, medium: 25, high: 13, critical: 5 },
  { month: 'Feb', monthAr: 'فبراير', low: 47, medium: 26, high: 14, critical: 6 },
  { month: 'Mar', monthAr: 'مارس', low: 46, medium: 27, high: 14, critical: 6 },
  { month: 'Apr', monthAr: 'أبريل', low: 45, medium: 28, high: 15, critical: 7 },
];

const needsAttention = [
  {
    id: '441012345',
    name: 'أحمد محمد عبدالله',
    nameEn: 'Ahmed Mohammed Abdullah',
    riskLevel: 'critical' as const,
    topIndicator: { ar: 'A-01: نسبة الغياب 28%', en: 'A-01: Absence Rate 28%' },
    daysSinceContact: 14,
  },
  {
    id: '441023456',
    name: 'محمد محمد عتيب',
    nameEn: 'Mohammed Mohammed Otaib',
    riskLevel: 'critical' as const,
    topIndicator: { ar: 'G-04: معدل 1.4', en: 'G-04: GPA 1.4' },
    daysSinceContact: 21,
  },
  {
    id: '441034567',
    name: 'سارة محمد قحطان',
    nameEn: 'Sarah Mohammed Qahtan',
    riskLevel: 'high' as const,
    topIndicator: { ar: 'S-01: غياب عن الأنشطة', en: 'S-01: Activity Absence' },
    daysSinceContact: 9,
  },
  {
    id: '441045678',
    name: 'فهد محمد شمر',
    nameEn: 'Fahad Mohammed Shammar',
    riskLevel: 'high' as const,
    topIndicator: { ar: 'G-07: رسوب 3 مقررات', en: 'G-07: Failed 3 Courses' },
    daysSinceContact: 12,
  },
  {
    id: '441056789',
    name: 'نورة محمد دوسر',
    nameEn: 'Noura Mohammed Dosar',
    riskLevel: 'high' as const,
    topIndicator: { ar: 'AC-01: تأخر فصلين', en: 'AC-01: 2 Semesters Behind' },
    daysSinceContact: 7,
  },
];

// --- Helpers ---

function riskBadge(level: 'critical' | 'high' | 'medium' | 'low', t: (ar: string, en: string) => string) {
  const map = {
    critical: { cls: 'bg-error-100 text-error-700 dark:bg-error-900/40 dark:text-error-400', ar: 'حرج', en: 'Critical' },
    high: { cls: 'bg-error-50 text-error-600 dark:bg-error-900/30 dark:text-error-400', ar: 'مرتفع', en: 'High' },
    medium: { cls: 'bg-warning-50 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400', ar: 'متوسط', en: 'Medium' },
    low: { cls: 'bg-sa-50 text-sa-700 dark:bg-sa-900/30 dark:text-sa-400', ar: 'منخفض', en: 'Low' },
  };
  const s = map[level];
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>
      {t(s.ar, s.en)}
    </span>
  );
}

const tooltipStyle = {
  backgroundColor: 'var(--color-gray-800, #1F2A37)',
  border: 'none',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '12px',
};

// --- Component ---

export default function CaseloadAnalytics() {
  const { t, lang } = useLanguage();

  const atRiskCount = distributionData.filter(d => d.name === 'High' || d.name === 'Critical').reduce((s, d) => s + d.value, 0);
  const atRiskPct = ((atRiskCount / totalStudents) * 100).toFixed(1);
  const avgRiskScore = 38.4;
  const momChange = +3.2;

  // Translate distribution for chart
  const pieData = distributionData.map(d => ({
    ...d,
    label: t(d.nameAr, d.name),
  }));

  // Translate indicators for chart
  const barData = topIndicators.map(ind => ({
    name: ind.id,
    label: t(ind.labelAr, ind.labelEn),
    count: ind.count,
  }));

  // Translate trend months
  const lineData = trendData.map(m => ({
    ...m,
    label: t(m.monthAr, m.month),
  }));

  const statCards = [
    {
      title: t('إجمالي الطلاب', 'Total Students'),
      value: totalStudents,
      icon: Users,
      color: 'text-sa-600 dark:text-sa-400',
      bg: 'bg-sa-50 dark:bg-sa-950',
    },
    {
      title: t('نسبة المعرضين للخطر', 'At-Risk %'),
      value: `${atRiskPct}%`,
      icon: AlertTriangle,
      color: 'text-error-500 dark:text-error-400',
      bg: 'bg-error-50 dark:bg-error-950',
    },
    {
      title: t('متوسط درجة الخطر', 'Avg Risk Score'),
      value: avgRiskScore,
      icon: BarChart3,
      color: 'text-warning-600 dark:text-warning-400',
      bg: 'bg-warning-50 dark:bg-warning-950',
    },
    {
      title: t('التغير محمد شاهر', 'Month-over-Month'),
      value: `${momChange > 0 ? '+' : ''}${momChange}%`,
      icon: momChange > 0 ? TrendingUp : TrendingDown,
      color: momChange > 0 ? 'text-error-500 dark:text-error-400' : 'text-sa-600 dark:text-sa-400',
      bg: momChange > 0 ? 'bg-error-50 dark:bg-error-950' : 'bg-sa-50 dark:bg-sa-950',
      sub: momChange > 0
        ? t('ارتفاع عن الشهر الماضي', 'Increase from last month')
        : t('انخفاض عن الشهر الماضي', 'Decrease from last month'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-h2 text-gray-900 dark:text-white">
          {t('تحليلات الحالات', 'Caseload Analytics')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {t(
            'أنماط واتجاهات المخاطر عبر الطلاب المسندين إليك',
            'Risk patterns and trends across your assigned students'
          )}
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-label text-gray-500 dark:text-gray-400">{card.title}</p>
                  <p className="mt-1.5 text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                  {card.sub && (
                    <p className={`mt-1 text-xs font-medium ${card.color}`}>{card.sub}</p>
                  )}
                </div>
                <div className={`p-2.5 rounded-xl ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two-Column: Pie + Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            {t('توزيع المخاطر', 'Risk Distribution')}
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                nameKey="label"
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          {/* Legend with counts and percentages */}
          <div className="mt-3 space-y-2">
            {pieData.map(item => {
              const pct = ((item.value / totalStudents) * 100).toFixed(1);
              return (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 dark:text-gray-500">{pct}%</span>
                    <span className="font-semibold text-gray-900 dark:text-white w-6 text-end">{item.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top 5 Triggered Indicators Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            {t('أكثر المؤشرات تفعيلاً', 'Top Triggered Indicators')}
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200, #E5E7EB)" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-gray-400, #9CA3AF)" />
              <YAxis
                type="category"
                dataKey="name"
                width={50}
                tick={{ fontSize: 11 }}
                stroke="var(--color-gray-400, #9CA3AF)"
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: number) => [value, t('عدد الطلاب', 'Students')]}
              />
              <Bar dataKey="count" fill="#25935F" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
          {/* Indicator list below chart */}
          <div className="mt-3 space-y-1.5">
            {barData.map((ind, i) => (
              <div key={ind.name} className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  {i + 1}. {ind.label}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">{ind.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Width: Month-over-Month Trend Line Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">
          {t('اتجاهات المخاطر شاهرة', 'Monthly Risk Trends')}
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          {t('آخر 6 أشهر — عدد الطلاب حسب مستوى الخطر', 'Last 6 months — student count by risk level')}
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-gray-200, #E5E7EB)" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--color-gray-400, #9CA3AF)" />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--color-gray-400, #9CA3AF)" />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="low" stroke={COLORS.low} strokeWidth={2} dot={{ r: 3 }} name={t('منخفض', 'Low')} />
            <Line type="monotone" dataKey="medium" stroke={COLORS.medium} strokeWidth={2} dot={{ r: 3 }} name={t('متوسط', 'Medium')} />
            <Line type="monotone" dataKey="high" stroke={COLORS.high} strokeWidth={2} dot={{ r: 3 }} name={t('مرتفع', 'High')} />
            <Line type="monotone" dataKey="critical" stroke={COLORS.critical} strokeWidth={2} dot={{ r: 3 }} name={t('حرج', 'Critical')} />
          </LineChart>
        </ResponsiveContainer>
        {/* Trend legend */}
        <div className="flex flex-wrap items-center gap-5 mt-3">
          {[
            { key: 'low', label: t('منخفض', 'Low'), color: COLORS.low },
            { key: 'medium', label: t('متوسط', 'Medium'), color: COLORS.medium },
            { key: 'high', label: t('مرتفع', 'High'), color: COLORS.high },
            { key: 'critical', label: t('حرج', 'Critical'), color: COLORS.critical },
          ].map(l => (
            <div key={l.key} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <div className="w-3 h-0.5 rounded" style={{ backgroundColor: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* Needs Attention List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-error-500" />
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {t('يحتاجون اهتمامًا عاجلاً', 'Needs Attention')}
            </h3>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {needsAttention.length} {t('طالب', 'students')}
          </span>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {needsAttention.map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              {/* Risk badge */}
              <div className="shrink-0">
                {riskBadge(student.riskLevel, t)}
              </div>

              {/* Student info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {t(student.name, student.nameEn)}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {t(student.topIndicator.ar, student.topIndicator.en)}
                </p>
              </div>

              {/* Days since contact */}
              <div className="shrink-0 text-end">
                <div className="flex items-center gap-1 text-xs">
                  {student.daysSinceContact >= 14 ? (
                    <ArrowUp className="w-3.5 h-3.5 text-error-500" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 text-warning-500" />
                  )}
                  <span className={`font-semibold ${student.daysSinceContact >= 14 ? 'text-error-500' : 'text-warning-600 dark:text-warning-400'}`}>
                    {student.daysSinceContact} {t('يوم', 'days')}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                  {t('منذ آخر تواصل', 'since last contact')}
                </p>
              </div>

              {/* View Profile link */}
              <button className="shrink-0 text-xs font-medium text-sa-600 dark:text-sa-400 hover:underline">
                {t('عرض الملف', 'View Profile')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
