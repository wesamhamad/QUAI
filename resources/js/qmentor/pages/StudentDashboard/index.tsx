import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import { useStudentProfile, useAbsences, useAllCourseGrades } from '../../hooks/useStudentData';
import {
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Clock,
  BookOpen,
  ClipboardList,
  ArrowRight,
  ArrowLeft,
  CalendarDays,
  MessageSquare,
  UserCheck,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

interface RiskIndicator {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'A' | 'G' | 'S';
  value: number;
  unit: string;
  unitAr: string;
  threshold: number;
  severity: RiskLevel;
  icon: typeof Clock;
}

interface WeekTrend {
  week: number;
  score: number;
}

interface MockStudentRisk {
  riskLevel: RiskLevel;
  riskScore: number;
  indicators: RiskIndicator[];
  trend: WeekTrend[];
}

// ---------------------------------------------------------------------------
// Mock data (fallback)
// ---------------------------------------------------------------------------

const mockStudentRisk: MockStudentRisk = {
  riskLevel: 'medium',
  riskScore: 62,
  indicators: [
    {
      id: 'A-01',
      nameAr: 'نسبة الغياب',
      nameEn: 'Attendance Rate',
      category: 'A',
      value: 18,
      unit: '%',
      unitAr: '٪',
      threshold: 25,
      severity: 'high',
      icon: Clock,
    },
    {
      id: 'G-02',
      nameAr: 'متوسط الاختبارات القصيرة',
      nameEn: 'Quiz Average',
      category: 'G',
      value: 55,
      unit: '%',
      unitAr: '٪',
      threshold: 60,
      severity: 'medium',
      icon: BookOpen,
    },
    {
      id: 'S-01',
      nameAr: 'الواجبات المفقودة',
      nameEn: 'Missing Assignments',
      category: 'S',
      value: 30,
      unit: '%',
      unitAr: '٪',
      threshold: 20,
      severity: 'high',
      icon: ClipboardList,
    },
  ],
  trend: [
    { week: 1, score: 45 },
    { week: 2, score: 52 },
    { week: 3, score: 58 },
    { week: 4, score: 62 },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const riskMeta: Record<RiskLevel, { labelAr: string; labelEn: string; bg: string; text: string; border: string; ring: string; badgeBg: string }> = {
  low: {
    labelAr: 'منخفض',
    labelEn: 'Low',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    border: 'border-emerald-200 dark:border-emerald-800',
    ring: 'ring-emerald-500',
    badgeBg: 'bg-emerald-500',
  },
  medium: {
    labelAr: 'متوسط',
    labelEn: 'Medium',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
    ring: 'ring-amber-500',
    badgeBg: 'bg-amber-500',
  },
  high: {
    labelAr: 'مرتفع',
    labelEn: 'High',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
    ring: 'ring-orange-500',
    badgeBg: 'bg-orange-500',
  },
  critical: {
    labelAr: 'حرج',
    labelEn: 'Critical',
    bg: 'bg-red-50 dark:bg-red-950/40',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    ring: 'ring-red-500',
    badgeBg: 'bg-red-500',
  },
};

function computeRiskLevel(score: number): RiskLevel {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// Sparkline component (pure SVG, no library)
// ---------------------------------------------------------------------------

function Sparkline({ data, color }: { data: WeekTrend[]; color: string }) {
  const w = 160;
  const h = 48;
  const pad = 4;
  const scores = data.map(d => d.score);
  const min = Math.min(...scores) - 5;
  const max = Math.max(...scores) + 5;
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.score - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });

  const gradientId = `spark-grad-${color.replace('#', '')}`;

  // Area path
  const firstX = pad;
  const lastX = pad + ((data.length - 1) / (data.length - 1)) * (w - pad * 2);
  const areaPath = `M${points[0]} ${points.slice(1).map(p => `L${p}`).join(' ')} L${lastX},${h - pad} L${firstX},${h - pad} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
      {points.length > 0 && (
        <circle
          cx={parseFloat(points[points.length - 1].split(',')[0])}
          cy={parseFloat(points[points.length - 1].split(',')[1])}
          r={3}
          fill={color}
        />
      )}
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Threshold bar component
// ---------------------------------------------------------------------------

function ThresholdBar({ value, threshold, severity }: { value: number; threshold: number; severity: RiskLevel }) {
  const maxVal = Math.max(value, threshold) * 1.3;
  const valuePct = Math.min((value / maxVal) * 100, 100);
  const thresholdPct = Math.min((threshold / maxVal) * 100, 100);

  const barColor = severity === 'low'
    ? 'bg-emerald-500'
    : severity === 'medium'
      ? 'bg-amber-500'
      : severity === 'high'
        ? 'bg-orange-500'
        : 'bg-red-500';

  return (
    <div className="relative w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-visible mt-2">
      {/* Value bar */}
      <div
        className={`absolute inset-y-0 start-0 rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${valuePct}%` }}
      />
      {/* Threshold marker */}
      <div
        className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-gray-500 dark:bg-gray-400 rounded-full"
        style={{ insetInlineStart: `${thresholdPct}%` }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function StudentDashboard() {
  const { t, dir } = useLanguage();
  const [expandedIndicator, setExpandedIndicator] = useState<string | null>(null);

  const isRtl = dir === 'rtl';
  const ArrowForward = isRtl ? ArrowLeft : ArrowRight;

  // Data hooks with mock fallback
  const profileResult = useStudentProfile(null);
  const absencesResult = useAbsences(null);
  const gradesResult = useAllCourseGrades(null);

  const sources = [profileResult.source, absencesResult.source, gradesResult.source];
  const overallSource = sources.includes('api') ? ('api' as const) : ('mock' as const);

  // Compute risk from real data or fall back to mock
  const riskData = useMemo<MockStudentRisk>(() => {
    if (profileResult.source !== 'api' || !profileResult.data) return mockStudentRisk;

    const raw = profileResult.data as Record<string, unknown>;
    const profile = (raw.profile ?? raw) as Record<string, unknown>;
    const academic = (profile.academic ?? {}) as Record<string, unknown>;
    const gpa = parseFloat(String(academic.last_recorded_gpa ?? academic.cumulative_gpa ?? '0'));

    const indicators: RiskIndicator[] = [...mockStudentRisk.indicators];

    // Override attendance indicator with real data
    if (absencesResult.source === 'api' && Array.isArray(absencesResult.data)) {
      const courses = absencesResult.data as Record<string, unknown>[];
      const avgAbsence =
        courses.length > 0
          ? courses.reduce((sum, c) => sum + (parseFloat(String(c.absence_all_percent ?? '0')) || 0), 0) / courses.length
          : 0;
      if (avgAbsence > 0) {
        const idx = indicators.findIndex(ind => ind.id === 'A-01');
        if (idx >= 0) {
          indicators[idx] = {
            ...indicators[idx],
            value: Math.round(avgAbsence),
            severity: avgAbsence >= 20 ? 'critical' : avgAbsence >= 15 ? 'high' : avgAbsence >= 10 ? 'medium' : 'low',
          };
        }
      }
    }

    // Compute a rough risk score from GPA and indicators
    let score = mockStudentRisk.riskScore;
    if (gpa > 0) {
      // GPA-based scoring: lower GPA = higher risk
      score = Math.round(Math.max(0, Math.min(100, (5 - gpa) * 20)));
    }

    return {
      riskLevel: computeRiskLevel(score),
      riskScore: score,
      indicators,
      trend: mockStudentRisk.trend.map((pt, i, arr) => ({
        ...pt,
        score: i === arr.length - 1 ? score : pt.score,
      })),
    };
  }, [profileResult.source, profileResult.data, absencesResult.source, absencesResult.data]);

  const meta = riskMeta[riskData.riskLevel];
  const trendDirection = riskData.trend.length >= 2
    ? riskData.trend[riskData.trend.length - 1].score - riskData.trend[riskData.trend.length - 2].score
    : 0;

  const sparklineColor =
    riskData.riskLevel === 'low' ? '#10b981'
    : riskData.riskLevel === 'medium' ? '#f59e0b'
    : riskData.riskLevel === 'high' ? '#f97316'
    : '#ef4444';

  // Student name from profile
  const studentName = useMemo(() => {
    if (profileResult.source !== 'api' || !profileResult.data) return null;
    const raw = profileResult.data as Record<string, unknown>;
    const profile = (raw.profile ?? raw) as Record<string, unknown>;
    return {
      ar: String(profile.name ?? ''),
      en: String(profile.name_en ?? ''),
    };
  }, [profileResult.source, profileResult.data]);

  return (
    <div>
      <PageHeader
        title={t('لوحة الطالب', 'Student Dashboard')}
        subtitle={
          studentName
            ? t(`مرحبا ${studentName.ar} — إليك ملخص حالتك الأكاديمية`, `Welcome ${studentName.en} — here is your academic status summary`)
            : t('ملخص حالتك الأكاديمية ومستوى المخاطر', 'Your academic status and risk level summary')
        }
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('لوحة الطالب', 'Student Dashboard') },
        ]}
        actions={<DataSourceBadge source={overallSource} />}
        accentColor="bg-sa-500"
      />

      {/* ---------- Risk Badge Card ---------- */}
      <div className={`rounded-2xl border-2 ${meta.border} ${meta.bg} p-6 sm:p-8 mb-6 transition-colors`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Score circle */}
          <div className="relative flex-shrink-0">
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center ring-4 ${meta.ring} ${meta.bg}`}>
              <span className={`text-3xl sm:text-4xl font-bold ${meta.text}`}>{riskData.riskScore}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">/ 100</span>
            </div>
            <div className={`absolute -bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold text-white ${meta.badgeBg}`}>
              {t(meta.labelAr, meta.labelEn)}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-start">
            <h2 className={`text-xl sm:text-2xl font-bold ${meta.text}`}>
              {t('مستوى المخاطر', 'Risk Level')}: {t(meta.labelAr, meta.labelEn)}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-md">
              {riskData.riskLevel === 'low' && t('أداؤك ممتاز، استمر في التميز!', 'You are doing great, keep it up!')}
              {riskData.riskLevel === 'medium' && t('هناك بعض المؤشرات التي تحتاج انتباهك.', 'Some indicators need your attention.')}
              {riskData.riskLevel === 'high' && t('عدة مؤشرات تحتاج تدخل سريع لتحسين وضعك.', 'Several indicators require prompt action to improve your status.')}
              {riskData.riskLevel === 'critical' && t('وضعك يحتاج تدخل فوري — تواصل مع مرشدك الأكاديمي الآن.', 'Your status needs immediate attention — contact your advisor now.')}
            </p>

            {/* Trend sparkline inline */}
            <div className="flex items-center gap-3 mt-3">
              <Sparkline data={riskData.trend} color={sparklineColor} />
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                {trendDirection > 0 ? (
                  <><TrendingUp className="w-3.5 h-3.5 text-red-500" /><span>{t('في ارتفاع', 'Trending up')}</span></>
                ) : trendDirection < 0 ? (
                  <><TrendingDown className="w-3.5 h-3.5 text-emerald-500" /><span>{t('في تحسن', 'Improving')}</span></>
                ) : (
                  <span>{t('مستقر', 'Stable')}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- CTA Button ---------- */}
      <Link
        to="/action-plan"
        className="flex items-center justify-center gap-2 w-full sm:w-auto sm:inline-flex px-6 py-3 rounded-xl bg-sa-600 hover:bg-sa-700 text-white font-semibold text-sm transition-colors shadow-sm mb-8"
      >
        <Lightbulb className="w-4 h-4" />
        {t('ماذا يجب أن أفعل؟', 'What should I do?')}
        <ArrowForward className="w-4 h-4" />
      </Link>

      {/* ---------- Top 3 Indicator Cards ---------- */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('أهم المؤشرات المؤثرة', 'Top Contributing Indicators')}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {riskData.indicators.map(indicator => {
          const indMeta = riskMeta[indicator.severity];
          const Icon = indicator.icon;
          const isExpanded = expandedIndicator === indicator.id;

          return (
            <div
              key={indicator.id}
              className={`rounded-xl border ${indMeta.border} bg-white dark:bg-gray-800 overflow-hidden transition-shadow hover:shadow-md`}
            >
              {/* Card header — clickable for detail */}
              <Link
                to={`/indicator-detail?id=${indicator.id}`}
                className="block p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${indMeta.bg}`}>
                    <Icon className={`w-5 h-5 ${indMeta.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {t(indicator.nameAr, indicator.nameEn)}
                      </span>
                      <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${indMeta.bg} ${indMeta.text}`}>
                        {indicator.id}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className={`text-2xl font-bold ${indMeta.text}`}>{indicator.value}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{t(indicator.unitAr, indicator.unit)}</span>
                    </div>
                    <ThresholdBar value={indicator.value} threshold={indicator.threshold} severity={indicator.severity} />
                    <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                      <span>0</span>
                      <span>{t('الحد', 'Threshold')}: {indicator.threshold}{t(indicator.unitAr, indicator.unit)}</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Expand toggle for quick detail */}
              <button
                onClick={() => setExpandedIndicator(isExpanded ? null : indicator.id)}
                className="flex items-center justify-center gap-1 w-full py-2 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {t('التفاصيل', 'Details')}
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3 space-y-1">
                  <p>
                    <span className="font-medium">{t('الفئة', 'Category')}:</span>{' '}
                    {indicator.category === 'A' ? t('الحضور والانخراط', 'Attendance & Engagement')
                      : indicator.category === 'G' ? t('الأداء الأكاديمي', 'Academic Performance')
                      : t('السلوك الأكاديمي', 'Academic Behavior')}
                  </p>
                  <p>
                    <span className="font-medium">{t('المستوى', 'Severity')}:</span>{' '}
                    <span className={indMeta.text}>{t(indMeta.labelAr, indMeta.labelEn)}</span>
                  </p>
                  <p>
                    <span className="font-medium">{t('التوصية', 'Recommendation')}:</span>{' '}
                    {indicator.id === 'A-01' && t('حافظ على الحضور المنتظم وتجنب الغياب غير المبرر.', 'Maintain regular attendance and avoid unexcused absences.')}
                    {indicator.id === 'G-02' && t('راجع مواد الاختبارات القصيرة واطلب مساعدة من زملائك.', 'Review quiz material and seek peer tutoring support.')}
                    {indicator.id === 'S-01' && t('أكمل الواجبات المتأخرة وحدد جدول زمني للتسليم.', 'Complete overdue assignments and set a submission schedule.')}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ---------- 4-Week Trend Section ---------- */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 mb-8">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {t('اتجاه المخاطر — آخر 4 أسابيع', 'Risk Trend — Last 4 Weeks')}
        </h3>
        <div className="flex items-end gap-4">
          <Sparkline data={riskData.trend} color={sparklineColor} />
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
            {riskData.trend.map(pt => (
              <div key={pt.week} className="text-center">
                <div className="font-medium text-gray-700 dark:text-gray-300">{pt.score}</div>
                <div>{t(`أسبوع ${pt.week}`, `Week ${pt.week}`)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Quick Links ---------- */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('روابط سريعة', 'Quick Links')}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: CalendarDays,
            titleAr: 'عرض الجدول',
            titleEn: 'View Schedule',
            descAr: 'اطلع على جدولك الدراسي والاختبارات',
            descEn: 'Check your class schedule and exams',
            to: '/study-plan',
            iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
          },
          {
            icon: MessageSquare,
            titleAr: 'محادثة QMentor',
            titleEn: 'Chat with QMentor',
            descAr: 'اسأل المرشد الذكي عن أي شيء',
            descEn: 'Ask the AI advisor anything',
            to: '/chatbot',
            iconBg: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400',
          },
          {
            icon: UserCheck,
            titleAr: 'تواصل مع المرشد',
            titleEn: 'Contact Advisor',
            descAr: 'تواصل مع مرشدك الأكاديمي مباشرة',
            descEn: 'Reach out to your academic advisor',
            to: '/advisor-dashboard',
            iconBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
          },
        ].map(link => {
          const LinkIcon = link.icon;
          return (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-sa-300 dark:hover:border-sa-600 transition-all group"
            >
              <div className={`p-2 rounded-lg ${link.iconBg}`}>
                <LinkIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-sa-600 dark:group-hover:text-sa-400 transition-colors">
                  {t(link.titleAr, link.titleEn)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t(link.descAr, link.descEn)}
                </div>
              </div>
              <ArrowForward className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-sa-500 transition-colors mt-1 shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
