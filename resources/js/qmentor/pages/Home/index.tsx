import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
} from 'recharts';
import {
  Users, ShieldAlert, Bell, ClipboardCheck, RefreshCw, GraduationCap, CalendarX, ArrowUpRight, ChevronRight, Loader2, AlertTriangle, BookOpen, UserMinus, X,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useHomeSummary } from '../../hooks/useHomeData';
import { useCoverage } from '../../hooks/useCoverage';
import type { HomeGroup, HomeRole, HomeCourse, LevelBuckets, LevelMeta, Degree, RiskyCourse } from '../../hooks/useHomeData';

/**
 * الرئيسية — one summary per seat, from /api/home/summary.
 *
 *   admin      the cohort by college, one click into a college's majors
 *   advisor    the caller's advisees: levels, the ten riskiest, what waits
 *   instructor the taught students, per section
 *
 * The four risk levels are an ordered severity, so they are drawn as one
 * ramp (light → dark) with a legend and direct labels: identity never rides
 * on colour alone.
 */

const LEVEL_KEYS: (keyof LevelBuckets)[] = ['L0', 'L1', 'L2', 'L3'];
// Low risk carries the light end of the brand green (sa-400, sa-300 in the
// dark). Most of this cohort is low, so most of every bar is this colour,
// and at sa-500 a healthy board read as a heavy one.
const LEVEL_FILL: Record<keyof LevelBuckets, string> = { L0: '#54C08A', L1: '#FBBF24', L2: '#F97316', L3: '#B91C1C' };
const LEVEL_FILL_DARK: Record<keyof LevelBuckets, string> = { L0: '#88D8AD', L1: '#FBBF24', L2: '#F97316', L3: '#EF4444' };
const LEVEL_BADGE: Record<number, string> = {
  0: 'bg-sa-100 text-sa-700 dark:bg-sa-900 dark:text-sa-300',
  1: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  2: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300',
  3: 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300',
};

function isDark(): boolean {
  return typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
}

/** Gregorian, Arabic digits off — «16/09/2026 14:05». */
function fmtDate(iso: string | null | undefined, withTime = true): string {
  if (!iso) return '—';
  const d = new Date(iso.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return iso;
  const opts: Intl.DateTimeFormatOptions = { calendar: 'gregory', numberingSystem: 'latn', day: '2-digit', month: '2-digit', year: 'numeric' };
  if (withTime) Object.assign(opts, { hour: '2-digit', minute: '2-digit', hour12: false });
  return new Intl.DateTimeFormat('en-GB', opts).format(d);
}

function num(n: number | null | undefined): string {
  return n === null || n === undefined ? '—' : n.toLocaleString('en-US');
}

function pct(n: number | null | undefined): string {
  return n === null || n === undefined ? '—' : `${n.toFixed(1)}%`;
}

// ── small pieces ─────────────────────────────────────────────────────────

function StatTile({ icon: Icon, label, value, hint, tone = 'default' }: {
  icon: typeof Users; label: string; value: string; hint?: string; tone?: 'default' | 'warn' | 'danger';
}) {
  const iconTone = tone === 'danger'
    ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
    : tone === 'warn'
      ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
      : 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-300';
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex items-start gap-3">
      <span className={`shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-xl ${iconTone}`}><Icon className="w-5 h-5" strokeWidth={1.75} /></span>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-2xl font-extrabold text-sa-500 dark:text-sa-300 mt-0.5 qm-tabular" dir="ltr">{value}</p>
        {hint && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 truncate">{hint}</p>}
      </div>
    </div>
  );
}

/**
 * «الطلاب خارج العدّ» — why the headcount on this board is not the number the
 * university quotes. The roster covers the colleges QMENTOR_FACULTIES names;
 * the memberships feed carries more, and the gap is listed here by college
 * rather than argued about each term.
 */
function CoverageDialog({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const { data, isLoading, error } = useCoverage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white">{t('الطلاب خارج العدّ', 'Students outside the count')}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t('ما تحمله تغذية العضويات ولا يحمله الروستر.', 'What the memberships feed holds and the roster does not.')}
            </p>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('إغلاق', 'Close')}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoading && <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">{t('جارٍ القراءة…', 'Reading…')}</p>}
        {error && <p className="text-sm text-red-600 dark:text-red-300 py-6 text-center">{t('تعذّرت القراءة.', 'Could not read.')}</p>}

        {data && !data.measured && (
          <p className="text-sm text-gray-600 dark:text-gray-300 py-6 text-center">{data.note}</p>
        )}

        {data && data.measured && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { label: t('في التغذية', 'In the feed'), value: data.in_feed },
                { label: t('في الروستر', 'In the roster'), value: data.in_scope },
                { label: t('الفرق', 'The gap'), value: data.missing },
              ].map(c => (
                <div key={c.label} className="rounded-xl border border-gray-100 dark:border-gray-700 p-3">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{c.label}</p>
                  <p className="text-xl font-extrabold text-sa-500 dark:text-sa-300 mt-0.5 qm-tabular" dir="ltr">{num(c.value)}</p>
                </div>
              ))}
            </div>

            {data.rows.length === 0 ? (
              <p className="text-sm text-gray-600 dark:text-gray-300 py-6 text-center">
                {t('لا أحد خارج العدّ — الروستر يغطي كل ما تحمله التغذية.', 'Nobody is outside — the roster covers the whole feed.')}
              </p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-start font-medium py-2">{t('الكلية', 'College')}</th>
                    <th className="text-end font-medium py-2">{t('في التغذية', 'Feed')}</th>
                    <th className="text-end font-medium py-2">{t('في الروستر', 'Roster')}</th>
                    <th className="text-end font-medium py-2">{t('ناقص', 'Missing')}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map(r => (
                    <tr key={r.faculty_no} className="border-b border-gray-100 dark:border-gray-750">
                      <td className="py-2">
                        <span className="text-gray-900 dark:text-white">{r.faculty_name}</span>
                        <span className={`ms-2 inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          r.reason === 'خارج النطاق'
                            ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300'
                        }`}>{r.reason}</span>
                      </td>
                      <td className="text-end qm-tabular text-gray-600 dark:text-gray-300" dir="ltr">{num(r.in_feed)}</td>
                      <td className="text-end qm-tabular text-gray-600 dark:text-gray-300" dir="ltr">{num(r.in_cohort)}</td>
                      <td className="text-end qm-tabular font-bold text-gray-900 dark:text-white" dir="ltr">{num(r.missing)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-3">
              {t('مقيس في الفصل', 'Measured in')} {data.semester ?? '—'}
              {data.measured_at ? ` · ${new Date(data.measured_at).toLocaleString('ar-SA')}` : ''}
              {' · '}
              {t('يتحدّث مع كل سحب روستر.', 'refreshed with every roster pull.')}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function LevelLegend({ levels }: { levels: LevelMeta[] }) {
  const dark = isDark();
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-300">
      {LEVEL_KEYS.map((k, i) => (
        <li key={k} className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: (dark ? LEVEL_FILL_DARK : LEVEL_FILL)[k] }} />
          {levels[i]?.ar ?? k}
        </li>
      ))}
    </ul>
  );
}

/** Inline level strip: the four counts as a segmented bar plus the numbers — the chart's row-level twin. */
function LevelStrip({ levels, buckets }: { levels: LevelMeta[]; buckets: LevelBuckets }) {
  const total = LEVEL_KEYS.reduce((n, k) => n + buckets[k], 0);
  const dark = isDark();
  if (total === 0) return <span className="text-xs text-gray-400">{'لم يُقيَّم بعد'}</span>;
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex h-2 w-24 sm:w-32 shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 gap-px">
        {LEVEL_KEYS.map(k => buckets[k] > 0 && (
          <span key={k} style={{ width: `${(buckets[k] / total) * 100}%`, background: (dark ? LEVEL_FILL_DARK : LEVEL_FILL)[k] }} title={`${levels[LEVEL_KEYS.indexOf(k)]?.ar ?? k}: ${buckets[k]}`} />
        ))}
      </div>
      <span className="text-[11px] text-gray-500 dark:text-gray-400 qm-tabular whitespace-nowrap" dir="ltr">
        {LEVEL_KEYS.map(k => buckets[k]).join(' / ')}
      </span>
    </div>
  );
}

function StackedLevels({ rows, levels, onPick }: { rows: HomeGroup[]; levels: LevelMeta[]; onPick?: (g: HomeGroup) => void }) {
  const { t } = useLanguage();
  const dark = isDark();
  const fills = dark ? LEVEL_FILL_DARK : LEVEL_FILL;
  const data = rows.map(g => ({ name: g.name, key: g.key, L0: g.levels.L0, L1: g.levels.L1, L2: g.levels.L2, L3: g.levels.L3, scored: g.scored, students: g.students }));
  const height = Math.max(180, 44 * rows.length + 40);
  return (
    <div style={{ height }} dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" barCategoryGap={10} margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#374151' : '#E5E7EB'} horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12, fill: dark ? '#D1D5DB' : '#374151' }} axisLine={false} tickLine={false} orientation="right" />
          <Tooltip
            cursor={{ fill: dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
            contentStyle={{ backgroundColor: dark ? '#1F2937' : '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, color: dark ? '#F3F4F6' : '#111827', fontSize: 12, direction: 'rtl' }}
            formatter={(value, name) => [String(value), levels[LEVEL_KEYS.indexOf(name as keyof LevelBuckets)]?.ar ?? String(name)]}
            labelFormatter={(label, payload) => {
              const p = (payload?.[0]?.payload ?? null) as { scored?: number; students?: number } | null;
              return p ? `${label} — ${t('مقيَّم', 'scored')} ${p.scored ?? 0} ${t('من', 'of')} ${p.students ?? 0}` : String(label);
            }}
          />
          <Legend formatter={(value) => levels[LEVEL_KEYS.indexOf(value as keyof LevelBuckets)]?.ar ?? String(value)} wrapperStyle={{ fontSize: 12 }} />
          {LEVEL_KEYS.map((k, i) => (
            <Bar key={k} dataKey={k} stackId="lvl" fill={fills[k]} stroke={dark ? '#1F2937' : '#FFFFFF'} strokeWidth={1} radius={i === LEVEL_KEYS.length - 1 ? [0, 4, 4, 0] : 0} onClick={(d) => onPick?.(rows.find(g => g.key === (d as unknown as { key?: string }).key) as HomeGroup)} cursor={onPick ? 'pointer' : undefined}>
              {data.map(d => <Cell key={d.key} />)}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-8 text-center text-sm text-gray-500 dark:text-gray-400">{text}</div>
  );
}

// ── the page ─────────────────────────────────────────────────────────────

export default function HomeSummary({ role }: { role: HomeRole }) {
  const { t } = useLanguage();
  const [faculty, setFaculty] = useState<string | undefined>(undefined);
  const seat = role === 'admin' ? undefined : role;
  const { data, levels, source, isLoading, isError, refetch, role: answeredRole } = useHomeSummary({ seat, faculty: role === 'admin' ? faculty : undefined });

  const title = role === 'admin'
    ? t('ملخص المنظومة', 'Cohort summary')
    : role === 'advisor'
      ? t('طلابي المُسندون', 'My advisees')
      : t('طلاب مقرراتي', 'My taught students');

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wide text-sa-700 dark:text-sa-300">+QSpark · {t('المرشد الذكي', 'Smart Mentor')}</p>
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">{title}</h1>
        {data?.last_sync && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            {t('آخر مزامنة', 'Last sync')} ({data.last_sync.stage}): <span className="qm-tabular" dir="ltr">{fmtDate(data.last_sync.finished_at)}</span>
            {data.last_sync.failed > 0 && <span className="text-amber-600 dark:text-amber-400">· {t('إخفاقات', 'failed')} {data.last_sync.failed}</span>}
          </p>
        )}
      </div>
      {data?.totals.scored_at && (
        <p className="text-xs text-gray-400 dark:text-gray-500">{t('آخر تقييم للمخاطر', 'Last risk evaluation')}: <span className="qm-tabular" dir="ltr">{fmtDate(data.totals.scored_at)}</span></p>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        {header}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 py-12 justify-center"><Loader2 className="w-4 h-4 animate-spin" />{t('جاري تحميل الملخص…', 'Loading the summary…')}</div>
      </div>
    );
  }

  if (isError || !data || source !== 'api') {
    return (
      <div className="space-y-6">
        {header}
        <div className="rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-5 text-sm text-amber-800 dark:text-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold">{source === 'forbidden' ? t('هذا الملخص ليس لهذا الحساب.', 'This summary is not for this account.') : t('تعذّر قراءة الملخص الآن.', 'The summary could not be read right now.')}</p>
            {source !== 'forbidden' && <button onClick={() => refetch()} className="mt-2 text-xs font-bold underline">{t('أعد المحاولة', 'Try again')}</button>}
          </div>
        </div>
      </div>
    );
  }

  const effectiveRole: HomeRole = (answeredRole === 'admin' || answeredRole === 'advisor' || answeredRole === 'instructor') ? answeredRole : role;

  return (
    <div className="space-y-6">
      {header}
      {effectiveRole === 'admin'
        ? <AdminBody data={data} levels={levels} faculty={faculty} setFaculty={setFaculty} />
        : <ScopedBody data={data} levels={levels} role={effectiveRole} />}
    </div>
  );
}

// ── admin ────────────────────────────────────────────────────────────────

function AdminBody({ data, levels, faculty, setFaculty }: {
  data: NonNullable<ReturnType<typeof useHomeSummary>['data']>; levels: LevelMeta[]; faculty?: string; setFaculty: (f?: string) => void;
}) {
  const { t } = useLanguage();
  const groups = data.groups ?? [];
  const byMajor = data.group_by === 'major';
  const highCritical = data.totals.by_level.filter(l => l.level >= 2).reduce((n, l) => n + l.n, 0);
  const absenceKnown = data.totals.absence_high !== null && data.totals.absence_high !== undefined;

  const gpaRows = useMemo(() => [...groups].sort((a, b) => (b.avg_gpa ?? 0) - (a.avg_gpa ?? 0)), [groups]);
  const [coverageOpen, setCoverageOpen] = useState(false);

  return (
    <>
      {coverageOpen && <CoverageDialog onClose={() => setCoverageOpen(false)} />}
      {byMajor && data.faculty && (
        <nav className="flex items-center gap-1.5 text-sm">
          <button onClick={() => setFaculty(undefined)} className="text-sa-700 dark:text-sa-300 font-semibold hover:underline">{t('كل الكليات', 'All colleges')}</button>
          <ChevronRight className="w-4 h-4 text-gray-400 rtl:rotate-180" />
          <span className="text-gray-700 dark:text-gray-200 font-semibold">{data.faculty.faculty_name ?? data.faculty.faculty_no}</span>
        </nav>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile icon={Users} label={t('الطلاب', 'Students')} value={num(data.totals.students)} hint={`${t('مقيَّم', 'scored')} ${num(data.totals.scored)}`} />
        <StatTile icon={ShieldAlert} label={t('مرتفع + حرج', 'High + critical')} value={num(highCritical)} hint={data.totals.scored > 0 ? pct((highCritical / data.totals.scored) * 100) + ' ' + t('من المقيَّمين', 'of scored') : undefined} tone={highCritical > 0 ? 'danger' : 'default'} />
        <StatTile icon={GraduationCap} label={t('متوسط المعدل التراكمي', 'Average GPA')} value={data.totals.avg_gpa === null ? '—' : data.totals.avg_gpa.toFixed(2)} hint={t('من 5', 'out of 5')} />
        <StatTile icon={CalendarX} label={`${t('غياب', 'Absence')} ≥ ${data.totals.absence_threshold ?? 18}%`} value={absenceKnown ? num(data.totals.absence_high) : '—'} hint={absenceKnown ? t('طالب في مقرر واحد على الأقل', 'students in at least one course') : t('لا يدعمها قاعدة البيانات', 'not supported by this database')} tone={absenceKnown && (data.totals.absence_high ?? 0) > 0 ? 'warn' : 'default'} />
      </div>

      {/* The headcount above is the roster, and the roster is the configured
          colleges. Whoever asks why it is not the number the university quotes
          gets the answer here instead of in a meeting. */}
      <div className="flex justify-end -mt-1">
        <button
          onClick={() => setCoverageOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-sa-600 dark:text-sa-300 hover:underline"
        >
          <UserMinus className="w-3.5 h-3.5" />
          {t('الطلاب خارج العدّ', 'Students outside the count')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatTile icon={Bell} label={t('تنبيهات آخر 7 أيام', 'Alerts, last 7 days')} value={num(data.alerts_7d)} />
        <StatTile icon={ClipboardCheck} label={t('موافقات معلّقة', 'Pending approvals')} value={num(data.pending_approvals)} tone={data.pending_approvals > 0 ? 'warn' : 'default'} />
        <Link to="/risk-analytics" className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 flex items-center justify-between hover:border-sa-400 transition-colors group">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{t('تحليل المخاطر الكامل', 'Full risk analytics')}</span>
          <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-sa-500" />
        </Link>
      </div>

      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white">{byMajor ? t('توزيع المستويات حسب التخصص', 'Levels by major') : t('توزيع المستويات حسب الكلية', 'Levels by college')}</h2>
          <LevelLegend levels={levels} />
        </div>
        {groups.length === 0
          ? <EmptyState text={t('لا طلاب في الجداول بعد — شغّل المزامنة أولاً.', 'No students in the tables yet — run the sync first.')} />
          : <StackedLevels rows={groups} levels={levels} onPick={byMajor ? undefined : (g) => setFaculty(g.faculty_no)} />}
        {!byMajor && groups.length > 0 && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">{t('انقر على كلية لعرض تخصصاتها.', 'Click a college to see its majors.')}</p>}
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white mb-3">{byMajor ? t('التخصصات', 'Majors') : t('الكليات', 'Colleges')}</h2>
          {groups.length === 0 ? <EmptyState text={t('لا بيانات.', 'No data.')} /> : (
            <div className="overflow-x-auto -mx-2">
              <table className="min-w-full text-sm">
                <thead className="text-[11px] text-gray-500 dark:text-gray-400">
                  <tr className="text-start">
                    <th className="px-2 py-1.5 text-start font-semibold">{byMajor ? t('التخصص', 'Major') : t('الكلية', 'College')}</th>
                    <th className="px-2 py-1.5 text-start font-semibold">{t('الطلاب', 'Students')}</th>
                    <th className="px-2 py-1.5 text-start font-semibold">{t('المستويات', 'Levels')}</th>
                    <th className="px-2 py-1.5 text-start font-semibold">{t('المعدل', 'GPA')}</th>
                    <th className="px-2 py-1.5 text-start font-semibold">{t('غياب ≥18%', 'Abs ≥18%')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {gpaRows.map(g => (
                    <tr key={g.key} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                      <td className="px-2 py-2 font-semibold text-gray-900 dark:text-white">
                        {byMajor ? g.name : <button onClick={() => setFaculty(g.faculty_no)} className="hover:text-sa-700 dark:hover:text-sa-300 text-start">{g.name}</button>}
                      </td>
                      <td className="px-2 py-2 qm-tabular text-gray-700 dark:text-gray-200" dir="ltr">{num(g.students)}<span className="text-gray-400 text-[11px]"> / {num(g.scored)}</span></td>
                      <td className="px-2 py-2"><LevelStrip levels={levels} buckets={g.levels} /></td>
                      <td className="px-2 py-2 qm-tabular text-gray-700 dark:text-gray-200" dir="ltr">{g.avg_gpa === null ? '—' : g.avg_gpa.toFixed(2)}</td>
                      <td className="px-2 py-2 qm-tabular text-gray-700 dark:text-gray-200" dir="ltr">{g.absence_share === null ? '—' : `${pct(g.absence_share)} (${num(g.absence_high)})`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white mb-1">{t('التخصصات الأعلى خطراً', 'Highest-risk majors')}</h2>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-3">
            {t('نسبة مرتفع + حرج من المقيَّمين، خمسة لكل درجة، للتخصصات التي فيها 5 مقيَّمين فأكثر.',
               'High + critical share of scored students, five per degree, majors with 5+ scored.')}
          </p>
          <MajorsByDegree data={data} />
        </section>
      </div>

      <RiskyCourses courses={data.risky_courses ?? []} />
    </>
  );
}

/**
 * التخصصات الأعلى خطراً, five per degree.
 *
 * Ranked inside each degree rather than across them: a master's programme of
 * twelve students and a bachelor of two thousand are not comparable, and a
 * mixed ranking is all postgraduate — the programmes that carry most of the
 * cohort never reach it. A degree with nothing to show is left out entirely.
 */
function MajorsByDegree({ data }: { data: NonNullable<ReturnType<typeof useHomeSummary>['data']> }) {
  const { t } = useLanguage();
  const byDegree = data.top_majors_by_degree ?? {};
  const order: Degree[] = ['bachelor', 'master', 'doctorate'];
  const present = order.filter(d => (byDegree[d] ?? []).length > 0);

  if (present.length === 0) {
    return <EmptyState text={t('لا تخصصات مقيَّمة بما يكفي بعد.', 'No major has enough scored students yet.')} />;
  }

  return (
    <div className="space-y-4">
      {present.map(degree => (
        <div key={degree}>
          <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">
            {data.degree_labels?.[degree] ?? degree}
          </h3>
          <ol className="space-y-2">
            {(byDegree[degree] ?? []).map((m, i) => (
              <li key={m.key} className="flex items-center gap-3">
                <span className="w-5 text-[11px] text-gray-400 qm-tabular">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{m.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                    {m.faculty_name} · {num(m.high_critical)} {t('من', 'of')} {num(m.scored)}
                  </p>
                </div>
                <div className="w-24 h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, m.high_share)}%`, background: LEVEL_FILL.L3 }} />
                </div>
                <span className="w-14 text-end text-sm font-bold qm-tabular text-gray-900 dark:text-white" dir="ltr">{pct(m.high_share)}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

/**
 * المقررات الأعلى خطراً — and which indicator put each one there.
 *
 * Absence is this term's and failure is the last full graded term's, so the
 * row names its indicator and its term rather than blending two different
 * questions into one number a reader cannot act on.
 */
function RiskyCourses({ courses }: { courses: RiskyCourse[] }) {
  const { t } = useLanguage();

  if (courses.length === 0) {
    return null;
  }

  const tone = (c: RiskyCourse) => c.indicator === 'absence'
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300'
    : 'bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300';

  return (
    <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <h2 className="text-base font-extrabold text-gray-900 dark:text-white mb-1">{t('المقررات الأعلى خطراً', 'Highest-risk courses')}</h2>
      <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-3">
        {t(`الغياب من هذا الفصل (≥${courses[0].absence_threshold}% في المقرر)، والرسوب من آخر فصل مرصودة درجاته. المقررات التي فيها 10 طلاب فأكثر.`,
           `Absence from this term (≥${courses[0].absence_threshold}% in the course), failure from the last fully graded term. Courses with 10+ students.`)}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[11px] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="text-start font-medium py-2">{t('المقرر', 'Course')}</th>
              <th className="text-start font-medium py-2">{t('المؤشر', 'Indicator')}</th>
              <th className="text-end font-medium py-2">{t('الطلاب', 'Students')}</th>
              <th className="text-end font-medium py-2">{t('النسبة', 'Share')}</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(c => (
              <tr key={c.course_code} className="border-b border-gray-100 dark:border-gray-700">
                <td className="py-2">
                  <span className="font-mono text-xs text-gray-600 dark:text-gray-300">{c.course_code}</span>
                  <span className="ms-2 text-gray-900 dark:text-white">{c.course_name}</span>
                </td>
                <td className="py-2">
                  <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${tone(c)}`}>{c.indicator_label}</span>
                  {c.failure_semester && c.indicator === 'failure' && (
                    <span className="ms-2 text-[10px] text-gray-400">{t('فصل', 'term')} {c.failure_semester}</span>
                  )}
                </td>
                <td className="py-2 text-end qm-tabular text-gray-600 dark:text-gray-300" dir="ltr">{num(c.affected)} / {num(c.students)}</td>
                <td className="py-2 text-end qm-tabular font-bold text-gray-900 dark:text-white" dir="ltr">{pct(c.share)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ── advisor / instructor ─────────────────────────────────────────────────

function ScopedBody({ data, levels, role }: { data: NonNullable<ReturnType<typeof useHomeSummary>['data']>; levels: LevelMeta[]; role: 'advisor' | 'instructor' }) {
  const { t } = useLanguage();
  const top = data.top_students ?? [];
  const highCritical = data.totals.by_level.filter(l => l.level >= 2).reduce((n, l) => n + l.n, 0);
  const listed = data.totals.listed ?? data.totals.students;

  if (listed === 0) {
    return (
      <EmptyState text={role === 'advisor'
        ? t('لا طلاب مسندون إليك في قوائم الإرشاد هذا الفصل.', 'No advisees are assigned to you this term.')
        : t('لا طلاب في الشعب التي تدرّسها هذا الفصل.', 'No students in the sections you teach this term.')} />
    );
  }

  const buckets: LevelBuckets = { L0: 0, L1: 0, L2: 0, L3: 0 };
  data.totals.by_level.forEach(l => { buckets[`L${l.level}` as keyof LevelBuckets] = l.n; });

  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile icon={Users} label={role === 'advisor' ? t('طلابي', 'My advisees') : t('طلاب شعبي', 'My students')} value={num(listed)} hint={`${t('مقيَّم', 'scored')} ${num(data.totals.scored)}${data.totals.students < listed ? ` · ${t('خارج الجداول', 'outside the tables')} ${num(listed - data.totals.students)}` : ''}`} />
        <StatTile icon={ShieldAlert} label={t('مرتفع + حرج', 'High + critical')} value={num(highCritical)} tone={highCritical > 0 ? 'danger' : 'default'} />
        <StatTile icon={Bell} label={t('تنبيهات آخر 7 أيام', 'Alerts, last 7 days')} value={num(data.alerts_7d)} />
        <StatTile icon={ClipboardCheck} label={t('موافقات معلّقة', 'Pending approvals')} value={num(data.pending_approvals)} hint={`${t('تدخلات آخر 7 أيام', 'interventions, 7 days')} ${num(data.interventions_7d)}`} tone={data.pending_approvals > 0 ? 'warn' : 'default'} />
      </div>

      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white">{t('توزيع المستويات', 'Level distribution')}</h2>
          <LevelLegend levels={levels} />
        </div>
        {data.totals.scored === 0
          ? <EmptyState text={t('لم يُقيَّم أحد من طلابك بعد — يظهر التوزيع بعد التقييم الليلي.', 'None of your students is scored yet — the distribution appears after the nightly run.')} />
          : (
            <div className="grid grid-cols-4 gap-2">
              {data.totals.by_level.map(l => (
                <div key={l.level} className="rounded-xl border border-gray-100 dark:border-gray-700 p-3">
                  <span className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-bold ${LEVEL_BADGE[l.level] ?? ''}`}>{l.ar}</span>
                  <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1 qm-tabular" dir="ltr">{num(l.n)}</p>
                  <p className="text-[11px] text-gray-400">{pct((l.n / data.totals.scored) * 100)}</p>
                </div>
              ))}
            </div>
          )}
        <div className="mt-3"><LevelStrip levels={levels} buckets={buckets} /></div>
      </section>

      {role === 'instructor' && <CoursesTable courses={data.courses ?? []} levels={levels} />}

      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-extrabold text-gray-900 dark:text-white">{t('الأعلى خطراً', 'Highest risk')}</h2>
          <Link to={role === 'advisor' ? '/advisor-dashboard' : '/instructor'} className="text-xs font-bold text-sa-700 dark:text-sa-300 hover:underline">{t('القائمة الكاملة', 'Full list')}</Link>
        </div>
        {top.length === 0 ? <EmptyState text={t('لا تقييمات بعد.', 'No evaluations yet.')} /> : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {top.map(s => (
              <li key={s.id}>
                <Link to={s.link} className="flex items-center gap-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/40 rounded-lg px-1 -mx-1 group">
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${LEVEL_BADGE[s.level] ?? ''}`}>{s.level_label ?? s.level}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{s.name} <span className="text-[11px] text-gray-400 qm-tabular" dir="ltr">{s.id}</span></p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{[s.major, s.top_factor ? `${t('العامل الأول', 'Top factor')}: ${s.top_factor}` : null].filter(Boolean).join(' · ')}</p>
                  </div>
                  <span className="text-sm font-bold qm-tabular text-gray-900 dark:text-white shrink-0" dir="ltr">{s.score}</span>
                  <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-sa-500 shrink-0" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function CoursesTable({ courses, levels }: { courses: HomeCourse[]; levels: LevelMeta[] }) {
  const { t } = useLanguage();
  return (
    <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <h2 className="text-base font-extrabold text-gray-900 dark:text-white mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-sa-600 dark:text-sa-400" />{t('حسب الشعبة', 'By section')}</h2>
      {courses.length === 0 ? <EmptyState text={t('لا شعب معروفة لهذا الفصل.', 'No sections known for this term.')} /> : (
        <div className="overflow-x-auto -mx-2">
          <table className="min-w-full text-sm">
            <thead className="text-[11px] text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-2 py-1.5 text-start font-semibold">{t('المقرر', 'Course')}</th>
                <th className="px-2 py-1.5 text-start font-semibold">{t('الشعبة', 'Section')}</th>
                <th className="px-2 py-1.5 text-start font-semibold">{t('الطلاب', 'Students')}</th>
                <th className="px-2 py-1.5 text-start font-semibold">{t('المستويات', 'Levels')}</th>
                <th className="px-2 py-1.5 text-start font-semibold">{t('مرتفع + حرج', 'High + critical')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {courses.map(c => (
                <tr key={c.key}>
                  <td className="px-2 py-2 font-semibold text-gray-900 dark:text-white"><span className="qm-tabular" dir="ltr">{c.course_code ?? ''}</span> {c.course_name ?? ''}</td>
                  <td className="px-2 py-2 qm-tabular text-gray-700 dark:text-gray-200" dir="ltr">{c.section ?? '—'}</td>
                  <td className="px-2 py-2 qm-tabular text-gray-700 dark:text-gray-200" dir="ltr">{num(c.students)}<span className="text-gray-400 text-[11px]"> / {num(c.scored)}</span></td>
                  <td className="px-2 py-2"><LevelStrip levels={levels} buckets={c.levels} /></td>
                  <td className="px-2 py-2 qm-tabular font-bold text-gray-900 dark:text-white" dir="ltr">{num(c.high_critical)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
