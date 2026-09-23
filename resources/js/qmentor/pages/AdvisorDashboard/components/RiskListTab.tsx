import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import DataSourceBadge from '../../../components/shared/DataSourceBadge';
import { useAdvisees, useRiskCaseload, type Advisee, type CaseloadRisk } from '../../../hooks/useAdvisorData';

/**
 * «المعرضون للخطر» / «التعافي» — the engine's verdict over the caseload, as
 * two tabs of the advisor desk (they were two pages, 2026-09-16).
 *
 *   minLevel 1 → at risk: medium or above (level ≥ 1), worst first.
 *   minLevel 2 → recovery: high or critical (level ≥ 2), each opening on the
 *                student's twin and action plan.
 *
 * Reads the same two feeds the desk reads: the caseload (the whole cohort for
 * the admin, SIS_ADVISORY_LISTS for an advisor) and the latest risk score per
 * student (31 indicators, nightly). Nothing sampled.
 */

type LevelKey = 'critical' | 'high' | 'medium';

interface Row {
  id: string;
  name: string;
  nameEn: string | null;
  faculty: string;
  major: string;
  gpa: number | null;
  score: number;
  level: LevelKey;
  factors: string[];
  override: string | null;
}

const LEVEL_KEY: Record<number, LevelKey | 'low'> = { 0: 'low', 1: 'medium', 2: 'high', 3: 'critical' };
const LEVEL_ORDER: Record<LevelKey, number> = { critical: 3, high: 2, medium: 1 };

const badge: Record<LevelKey, string> = {
  critical: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
  high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  medium: 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400',
};
const dot: Record<LevelKey, string> = { critical: 'bg-error-500', high: 'bg-orange-500', medium: 'bg-gold-500' };

const PAGE = 50;

type RiskRow = Advisee & { risk_level?: number | null; risk_score?: number | null; risk_override?: string | null; top_factors?: { label: string }[] };

export default function RiskListTab({ minLevel, wholeCohort }: { minLevel: 1 | 2; wholeCohort: boolean }) {
  const { t } = useLanguage();
  const recovery = minLevel >= 2;

  const [q, setQ] = useState('');
  const [faculty, setFaculty] = useState('all');
  const [level, setLevel] = useState<'all' | LevelKey>('all');
  const [shown, setShown] = useState(PAGE);

  // Admin: the cohort rows already carry the latest level, score and top factors (?at_risk=1, uncapped).
  // Advisor: the SIS advisee list, joined to the engine's verdict per advisee.
  const advisees = useAdvisees(undefined, wholeCohort, undefined, wholeCohort);
  const rows = (advisees.source === 'api' ? advisees.data : null) ?? [];
  const ids = useMemo(() => rows.map(a => a.student_id), [rows]);
  const risk = useRiskCaseload(wholeCohort ? [] : ids, false);
  const riskMap: Record<string, CaseloadRisk> = risk.source === 'api' ? (risk.data?.students ?? {}) : {};
  const live = advisees.source === 'api';
  const loading = advisees.isLoading || (!wholeCohort && risk.isLoading);

  const all = useMemo<Row[]>(() => {
    const out: Row[] = [];
    for (const a of rows as RiskRow[]) {
      const r = riskMap[a.student_id];
      const lvl = r ? r.level.level : (a.risk_level ?? null);
      if (lvl == null || lvl < minLevel) continue;
      const key = LEVEL_KEY[lvl];
      if (key === 'low') continue;
      const gpa = a.last_recorded_gpa == null || a.last_recorded_gpa === '' ? null : Number(a.last_recorded_gpa);
      out.push({
        id: a.student_id,
        name: a.student_name,
        nameEn: a.student_name_en,
        faculty: a.faculty_name ?? '',
        major: a.major_name ?? a.dept_name ?? '',
        gpa: gpa != null && Number.isFinite(gpa) ? gpa : null,
        score: r ? r.score : Number(a.risk_score ?? 0),
        level: key,
        factors: (r ? r.top_factors : (a.top_factors ?? [])).map(f => f.label),
        override: r ? r.override : (a.risk_override ?? null),
      });
    }
    return out.sort((x, y) => LEVEL_ORDER[y.level] - LEVEL_ORDER[x.level] || y.score - x.score || (x.gpa ?? 5) - (y.gpa ?? 5));
  }, [rows, riskMap, minLevel]);

  const faculties = useMemo(() => [...new Set(all.map(r => r.faculty).filter(Boolean))].sort(), [all]);

  const filtered = useMemo(() => {
    const term = q.trim();
    return all.filter(r =>
      (faculty === 'all' || r.faculty === faculty)
      && (level === 'all' || r.level === level)
      && (term === '' || r.id.startsWith(term) || r.name.includes(term) || (r.nameEn ?? '').toLowerCase().includes(term.toLowerCase())),
    );
  }, [all, q, faculty, level]);

  const count = (k: LevelKey) => all.filter(r => r.level === k).length;
  const levelLabel = (k: LevelKey) => t(k === 'critical' ? 'حرج' : k === 'high' ? 'مرتفع' : 'متوسط', k === 'critical' ? 'Critical' : k === 'high' ? 'High' : 'Medium');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {recovery
            ? t(
                wholeCohort ? 'كل طالب في نطاق المنصة عند مستوى مرتفع أو حرج — كل طالب يفتح على توأمه وخطة عمله' : 'طلابك عند مستوى مرتفع أو حرج — كل طالب يفتح على توأمه وخطة عمله',
                wholeCohort ? 'Every student in scope at High or Critical — each opens on their twin and action plan' : 'Your advisees at High or Critical — each opens on their twin and action plan',
              )
            : t(
                wholeCohort ? 'كل طالب في نطاق المنصة صنّفه محرك المخاطر عند مستوى متوسط فأعلى — الأسوأ أولاً' : 'طلابك الذين صنّفهم محرك المخاطر عند مستوى متوسط فأعلى — الأسوأ أولاً',
                wholeCohort ? 'Every student in scope the risk engine placed at medium or above, worst first' : 'Your advisees the risk engine placed at medium or above, worst first',
              )}
        </p>
        <DataSourceBadge source={live ? 'api' : 'mock'} />
      </div>

      <div className={`grid grid-cols-1 sm:grid-cols-${recovery ? 3 : 4} gap-4`}>
        <Stat tone="bg-error-50 dark:bg-error-900/20 border-error-200 dark:border-error-800 text-error-700 dark:text-error-300" label={levelLabel('critical')} value={count('critical')} />
        <Stat tone="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300" label={levelLabel('high')} value={count('high')} />
        {!recovery && <Stat tone="bg-gold-50 dark:bg-gold-900/20 border-gold-200 dark:border-gold-800 text-gold-700 dark:text-gold-300" label={levelLabel('medium')} value={count('medium')} />}
        <Stat tone="bg-info-50 dark:bg-info-900/20 border-info-200 dark:border-info-800 text-info-700 dark:text-info-300" label={recovery ? t('إجمالي برنامج التعافي', 'Total in recovery') : t('إجمالي المعرضين للخطر', 'Total at risk')} value={all.length} sub={!wholeCohort && rows.length ? `${t('من', 'of')} ${rows.length.toLocaleString()}` : undefined} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-3">
          <input
            id={`risklist-search-${minLevel}`}
            value={q}
            onChange={e => { setQ(e.target.value); setShown(PAGE); }}
            placeholder={t('بحث بالرقم الجامعي أو الاسم', 'Search by ID or name')}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-2 text-gray-700 dark:text-gray-300 min-w-[14rem]"
          />
          {wholeCohort && faculties.length > 1 && (
            <select id={`risklist-faculty-${minLevel}`} value={faculty} onChange={e => { setFaculty(e.target.value); setShown(PAGE); }} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-2 text-gray-700 dark:text-gray-300">
              <option value="all">{t('جميع الكليات', 'All colleges')}</option>
              {faculties.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          )}
          <select id={`risklist-level-${minLevel}`} value={level} onChange={e => { setLevel(e.target.value as 'all' | LevelKey); setShown(PAGE); }} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-2 text-gray-700 dark:text-gray-300">
            <option value="all">{t('جميع المستويات', 'All levels')}</option>
            <option value="critical">{levelLabel('critical')}</option>
            <option value="high">{levelLabel('high')}</option>
            {!recovery && <option value="medium">{levelLabel('medium')}</option>}
          </select>
          <span className="text-sm text-gray-500 dark:text-gray-400 self-center">{filtered.length.toLocaleString()} {t('طالب', 'students')}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading && all.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">{t('جارٍ تحميل القائمة…', 'Loading…')}</p>
        ) : !live ? (
          <p className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {t('تعذّر قراءة قائمة الطلاب من النظام، ولا تُعرض هنا أي بيانات تجريبية.', 'The student list could not be read from the system; no demonstration data is shown here.')}
          </p>
        ) : all.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500 dark:text-gray-400">
            {recovery
              ? t('لا يوجد طالب عند مستوى مرتفع أو حرج في النطاق الحالي.', 'No student is at High or Critical in the current scope.')
              : t('لا يوجد طالب مصنّف عند مستوى متوسط فأعلى في النطاق الحالي.', 'No student is classified at medium or above in the current scope.')}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                  <Th>{t('الطالب', 'Student')}</Th>
                  <Th>{t('الرقم', 'ID')}</Th>
                  {wholeCohort && <Th>{t('الكلية', 'College')}</Th>}
                  <Th>{t('التخصص', 'Major')}</Th>
                  <Th center>{t('المعدل', 'GPA')}</Th>
                  <Th center>{t('الدرجة', 'Score')}</Th>
                  <Th center>{t('الخطورة', 'Risk')}</Th>
                  <Th>{t('أبرز المؤشرات', 'Top factors')}</Th>
                  {recovery && <Th />}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, shown).map(r => (
                  <tr key={r.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      <Link to={`/digital-twin?student=${encodeURIComponent(r.id)}`} className="hover:text-sa-600 dark:hover:text-sa-400">
                        {t(r.name, r.nameEn ?? r.name)}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{r.id}</td>
                    {wholeCohort && <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{r.faculty}</td>}
                    <td className="px-4 py-3 text-xs text-gray-600 dark:text-gray-400">{r.major}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${r.gpa != null && r.gpa < 2 ? 'text-error-500' : 'text-gray-900 dark:text-white'}`}>{r.gpa != null ? r.gpa.toFixed(2) : '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300">{r.score}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${badge[r.level]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dot[r.level]}`} />
                        {levelLabel(r.level)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {r.override && <span className="px-1.5 py-0.5 rounded bg-error-50 dark:bg-error-900/30 text-xs text-error-700 dark:text-error-300">{r.override}</span>}
                        {r.factors.map((f, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">{f}</span>
                        ))}
                        {!r.override && r.factors.length === 0 && <span className="text-xs text-gray-400">—</span>}
                      </div>
                    </td>
                    {recovery && (
                      <td className="px-4 py-3">
                        <Link to={`/digital-twin?student=${encodeURIComponent(r.id)}`} className="text-xs text-sa-700 dark:text-sa-300 font-semibold hover:underline whitespace-nowrap">{t('التوأم وخطة العمل', 'Twin & plan')}</Link>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length > shown && (
              <div className="p-3 text-center border-t border-gray-100 dark:border-gray-700/50">
                <button type="button" onClick={() => setShown(s => s + PAGE)} className="text-sm text-sa-600 dark:text-sa-400 hover:underline">
                  {t('عرض المزيد', 'Show more')} ({(filtered.length - shown).toLocaleString()})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ tone, label, value, sub }: { tone: string; label: string; value: number; sub?: string }) {
  return (
    <div className={`border rounded-xl p-4 ${tone}`}>
      <p className="text-sm opacity-80">{label}</p>
      <p className="text-2xl font-bold mt-1">{value.toLocaleString()}{sub && <span className="text-xs font-normal opacity-70 ms-2">{sub}</span>}</p>
    </div>
  );
}

function Th({ children, center }: { children?: React.ReactNode; center?: boolean }) {
  return <th className={`${center ? 'text-center' : 'text-start'} px-4 py-3 font-medium text-gray-500 dark:text-gray-400`}>{children}</th>;
}
