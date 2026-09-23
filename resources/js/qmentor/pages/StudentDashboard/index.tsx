import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import { useStudentProfile, useRiskMe } from '../../hooks/useStudentData';
import {
  ShieldAlert,
  AlertTriangle,
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
  category: string;
  value: number;
  unit: string;
  unitAr: string;
  threshold: number;
  severity: RiskLevel;
  icon: typeof Clock;
  /** What the engine read for this indicator, in its own words. */
  evidence: string;
}

interface WeekTrend {
  week: number;
  score: number;
}

interface StudentRisk {
  riskLevel: RiskLevel;
  riskScore: number;
  indicators: RiskIndicator[];
  /** How many indicators the engine could evaluate (the fired ones are `indicators`). */
  evaluated: number;
  trend: WeekTrend[];
  computedAt: string | null;
  modelVersion: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Server risk evaluation → the shape this page renders
// ---------------------------------------------------------------------------

interface EngineIndicator {
  id: string;
  label: string;
  category: string;
  available: boolean;
  level: number | null;
  value: number | boolean | null;
  evidence: string;
}

interface EngineRisk {
  scored: boolean;
  score: number;
  computed_at?: string | null;
  model_version?: string | null;
  level: { level: number; key: RiskLevel; ar: string };
  top_factors: { id: string; label: string; level: number; value: unknown; evidence: string }[];
  indicators: EngineIndicator[];
  history: { computed_at: string; score: number; level: number }[];
  thresholds: Record<string, { dir: 'up' | 'down'; bands: (number | string)[]; unit: string }>;
  available_count: number;
}

const LEVEL_KEYS: RiskLevel[] = ['low', 'medium', 'high', 'critical'];

const categoryIcon: Record<string, typeof Clock> = {
  A: Clock, G: TrendingDown, S: ClipboardList, AC: AlertTriangle, T: BookOpen, P: BookOpen, C: AlertTriangle, E: Clock, R: BookOpen,
};

function fromEngine(e: EngineRisk): StudentRisk {
  const measured = e.indicators
    .filter(i => i.available && i.level !== null)
    .sort((a, b) => (b.level ?? 0) - (a.level ?? 0));
  // Only the indicators that fired: the green «0» cards are noise. How many
  // were evaluated is shown as a count next to the heading instead.
  const shown = measured.filter(i => (i.level ?? 0) > 0);

  const indicators: RiskIndicator[] = shown.map(i => {
    const th = e.thresholds[i.id];
    const numeric = typeof i.value === 'number' ? i.value : typeof i.value === 'boolean' ? (i.value ? 1 : 0) : (i.level ?? 0);
    const bands = th?.bands ?? [];
    const threshold = typeof bands[th?.dir === 'down' ? 0 : 2] === 'number' ? (bands[th?.dir === 'down' ? 0 : 2] as number) : Math.max(1, numeric);
    return {
      id: i.id,
      nameAr: i.label,
      nameEn: i.label,
      category: i.category,
      value: Math.round(numeric * 100) / 100,
      unit: th?.unit ?? '',
      unitAr: th?.unit ?? '',
      threshold,
      severity: LEVEL_KEYS[i.level ?? 0],
      icon: categoryIcon[i.category] ?? Clock,
      evidence: i.evidence,
    };
  });

  const trend: WeekTrend[] = e.history.slice(-4).map((h, idx) => ({ week: idx + 1, score: h.score }));

  return {
    riskLevel: e.level.key,
    riskScore: e.score,
    indicators,
    evaluated: measured.length,
    trend: trend.length ? trend : [{ week: 1, score: e.score }],
    computedAt: e.computed_at ?? null,
    modelVersion: e.model_version ?? null,
  };
}

/** Gregorian day, as SIS prints its terms. */
function fmtDate(iso: string | null | undefined, lang: 'ar' | 'en'): string {
  if (!iso) return '';
  const d = new Date(iso.includes('T') ? iso : iso.replace(' ', 'T'));
  return Number.isNaN(d.getTime()) ? String(iso).slice(0, 10) : d.toLocaleDateString(lang === 'ar' ? 'ar-SA-u-ca-gregory' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

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

  const profileResult = useStudentProfile(null);

  // The server's nightly evaluation (31 indicators, SRS §5.B/§5.C). When it
  // exists it IS the risk picture; the client-side arithmetic below is only
  // the fallback for a student the engine has not scored yet.
  const riskResult = useRiskMe<EngineRisk | null>(null);
  const engine = riskResult.source === 'api' && riskResult.data?.scored ? riskResult.data : null;

  // The engine's evaluation is the only risk picture: no client-side scoring,
  // no sample student. Not evaluated yet → the page says so and stops.
  const riskData = useMemo<StudentRisk | null>(() => (engine ? fromEngine(engine) : null), [engine]);

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

  const header = (
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
      accentColor="bg-sa-500"
    />
  );

  if (!riskData) {
    return (
      <div>
        {header}
        <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 mb-6 text-center">
          {riskResult.isLoading ? (
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sa-500 mx-auto" />
          ) : (
            <>
              <ShieldAlert className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('لم يُقيَّم ملفك بعد', 'Your record has not been evaluated yet')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
                {t('يظهر التقدير بعد التقييم الليلي لمؤشراتك؛ ولا يُعرض قبل ذلك أي رقم.', 'The estimate appears after the nightly evaluation of your indicators; no figure is shown before that.')}
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  const meta = riskMeta[riskData.riskLevel];
  const trendDirection = riskData.trend.length >= 2
    ? riskData.trend[riskData.trend.length - 1].score - riskData.trend[riskData.trend.length - 2].score
    : 0;

  const sparklineColor =
    riskData.riskLevel === 'low' ? '#10b981'
    : riskData.riskLevel === 'medium' ? '#f59e0b'
    : riskData.riskLevel === 'high' ? '#f97316'
    : '#ef4444';

  return (
    <div>
      {header}

      {/* ---------- Risk Badge Card ---------- */}
      <div className={`rounded-2xl border-2 ${meta.border} ${meta.bg} p-6 sm:p-8 mb-6 transition-colors`}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Score circle */}
          <div className="relative flex-shrink-0">
            <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center ring-4 ${meta.ring} ${meta.bg}`}>
              <span className={`text-3xl sm:text-4xl font-bold ${meta.text}`}>{riskData.riskScore}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('من 100', 'of 100')}</span>
            </div>
            <div
              className={`absolute -bottom-1 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 px-3 py-0.5 rounded-full text-xs font-semibold text-white ${meta.badgeBg}`}
              title={riskData.riskLevel === 'critical' ? 'حرج = إحالة للمرشد النفسي: مؤشران مرتفعان فأكثر مع غياب بعذر طبي أو وفاة أو حادث' : undefined}
            >
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
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
              {t('تقدير احتمالي يُحدَّث مع كل مزامنة', 'A probabilistic estimate, refreshed with every sync')}{riskData.modelVersion ? t(` · إصدار النموذج ${riskData.modelVersion}`, ` · model version ${riskData.modelVersion}`) : ''}
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
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('ما رصده النظام في هذا الطالب', 'What the system observed for this student')}
        </h3>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {t(`قُيّم ${riskData.evaluated} مؤشراً، رُصد ${riskData.indicators.length}`, `${riskData.evaluated} indicators evaluated, ${riskData.indicators.length} observed`)}
        </span>
      </div>
      {riskData.indicators.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">{t('لا مؤشرات مرصودة حالياً', 'No indicators observed at present')}</p>
      )}
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
                      <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500">
                        {t('الرمز', 'Code')} {indicator.id}
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
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 leading-relaxed">
                      {t(`رُصد ${indicator.nameAr}: ${indicator.evidence || 'غير محدد'}`, `Observed ${indicator.nameEn}: ${indicator.evidence || 'not specified'}`)}
                      {riskData.computedAt ? t(` · آخر تحديث ${fmtDate(riskData.computedAt, 'ar')}`, ` · updated ${fmtDate(riskData.computedAt, 'en')}`) : ''}
                    </p>
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
                    <span className="font-medium">{t('ما رُصد', 'Observed')}:</span>{' '}
                    {indicator.evidence || t('غير محدد', 'Not specified')}
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
            titleAr: 'محادثة +QSpark',
            titleEn: 'Chat with QSpark+',
            descAr: 'اسأل مساعد +QSpark عن أي شيء',
            descEn: 'Ask the QSpark+ assistant anything',
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
