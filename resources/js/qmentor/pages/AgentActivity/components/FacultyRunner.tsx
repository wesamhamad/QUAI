import { useCallback, useEffect, useState } from 'react';
import { Play, ChevronDown, CheckCircle2, Loader2, CircleDashed, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useRole } from '../../../contexts/RoleContext';
import { apiClient } from '../../../lib/api';

/**
 * تشغيل كلية بكلية — load the cohort one college at a time.
 *
 * Every college the NELC feed carries, each with its own stages underneath:
 * roster → grades → profile → Blackboard → scoring → alerts → accounts →
 * AI analyses. «تشغيل الكلية» queues the chain for that college only;
 * a stage's own button runs just that stage. Low parallelism by default so
 * qu-api / Oracle / Blackboard are not pushed; one chain at a time.
 */
interface College {
  faculty_no: string; name: string; expected: number; total: number;
  academic: number; profile: number; blackboard: number;
  errors: { academic: number; profile: number; blackboard: number };
  scored: number; users: number; analyzed: number; last_profile: string | null;
}
interface CollegeRun { token: string; faculty: string; stages: string[]; streams: number; at: string; by: string; current: boolean }
interface Snap { colleges?: College[]; college_run?: CollegeRun | null; queued: number; reserved?: number; running: { stage: string; since: string } | null }

const STAGES: { key: string; ar: string; en: string; count: (c: College) => number; errors?: (c: College) => number }[] = [
  { key: 'roster', ar: 'قائمة الطلاب', en: 'Roster', count: c => c.total },
  { key: 'academic', ar: 'سجل الدرجات', en: 'Grade history', count: c => c.academic, errors: c => c.errors.academic },
  { key: 'profile', ar: 'الملف والغياب والخطة', en: 'Profile, absences, plan', count: c => c.profile, errors: c => c.errors.profile },
  { key: 'blackboard', ar: 'بلاكبورد', en: 'Blackboard', count: c => c.blackboard, errors: c => c.errors.blackboard },
  { key: 'score', ar: 'تقييم الخطر', en: 'Risk scoring', count: c => c.scored },
  { key: 'alerts', ar: 'التنبيهات', en: 'Alerts', count: c => c.scored },
  { key: 'users', ar: 'الحسابات والصلاحيات', en: 'Accounts', count: c => c.users },
  { key: 'analyze', ar: 'تحليل الذكاء الاصطناعي', en: 'AI analyses', count: c => c.analyzed },
];

const fmtN = (n: number) => n.toLocaleString('en');

export default function FacultyRunner() {
  const { t } = useLanguage();
  const { role } = useRole();
  const [snap, setSnap] = useState<Snap | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [streams, setStreams] = useState(2);
  const [withAnalyze, setWithAnalyze] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const poll = useCallback(async () => {
    try {
      const r = await apiClient.get<{ data: Snap }>('/cohort/progress');
      setSnap(r.data);
    } catch { /* keep the last one */ }
  }, []);

  useEffect(() => {
    void poll();
    const id = window.setInterval(() => { void poll(); }, 8000);
    return () => window.clearInterval(id);
  }, [poll]);

  // Only a queued chain blocks a start (the server refuses the same way); the
  // scheduled cohort-sync runs (Blackboard every 4 h, profile every 6 h) do not.
  const active = !!snap && (snap.queued > 0 || (snap.reserved ?? 0) > 0);
  const run = snap?.college_run;
  const runningCollege = active && run?.current ? run.faculty : null;
  const allRunning = runningCollege === 'all';
  const scheduledOnly = !!snap?.running && !active;

  const start = async (c: College, stage: string, until: string) => {
    const label = stage === 'auto' ? t('ما لم يكتمل فقط', 'what is unfinished only') : stage === until ? t(`مرحلة «${STAGES.find(s => s.key === stage)?.ar}»`, `stage ${stage}`) : t('كل المراحل', 'all stages');
    if (!window.confirm(t(`تشغيل ${label} لكلية ${c.name} (${fmtN(c.expected || c.total)} طالباً) بـ ${streams} مسار؟`, `Run ${label} for ${c.name} at ${streams} streams?`))) return;
    setBusy(true);
    setMessage(null);
    try {
      const r = await apiClient.post<{ data?: { stages: string[] }; error?: string }>('/cohort/start-faculty', { faculty: c.faculty_no, stage, until, streams });
      setMessage(r.error ?? t(`أُدرجت ${c.name}: ${r.data?.stages.join(' ← ')} — يبدأ خلال دقيقة.`, `Queued ${c.name}: ${r.data?.stages.join(' → ')}.`));
      setOpen(c.faculty_no);
      await poll();
    } catch (e) {
      setMessage(t('تعذّر: ', 'Failed: ') + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(false);
    }
  };

  const startAll = async () => {
    const left = (snap?.colleges ?? []).reduce((n, c) => n + Math.max(0, (c.expected || c.total) - Math.min(c.academic, c.profile, c.blackboard)), 0);
    if (!window.confirm(t(
      `تشغيل كل الكليات (${snap?.colleges?.length ?? 0}) بـ ${streams} مسار؟\n\n• قائمة الطلاب وأعضاء هيئة التدريس لكل الكليات في قراءة واحدة\n• ثم الدرجات ← الملف ← بلاكبورد ← التقييم ← التنبيهات ← الحسابات${withAnalyze ? ' ← التحليل' : ''}\n• المكتمل لا يُعاد — المتبقي تقريباً ${fmtN(left)} طالباً`,
      `Run all colleges at ${streams} streams? Completed students are skipped.`,
    ))) return;
    setBusy(true);
    setMessage(null);
    try {
      const r = await apiClient.post<{ data?: { stages: string[] }; error?: string }>('/cohort/start-faculty', { faculty: 'all', stage: 'auto', until: withAnalyze ? 'analyze' : 'users', streams });
      setMessage(r.error ?? t(`أُدرجت كل الكليات: ${r.data?.stages.join(' ← ')} — يبدأ خلال دقيقة.`, `Queued all colleges: ${r.data?.stages.join(' → ')}.`));
      await poll();
    } catch (e) {
      setMessage(t('تعذّر: ', 'Failed: ') + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(false);
    }
  };

  if (!snap?.colleges) return null;
  const doneAll = (c: College) => c.total > 0 && c.academic >= c.total && c.profile >= c.total && c.blackboard >= c.total && c.scored >= c.total;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('تشغيل كلية بكلية', 'College by college')}</h2>
        <span className="text-xs text-gray-500">{t(`${snap.colleges.length} كلية فعّالة · كلية واحدة في كل مرة`, `${snap.colleges.length} active colleges · one at a time`)}</span>
        {role === 'admin' && (
          <div className="ms-auto flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
            <label className="inline-flex items-center gap-1.5">
              {t('التوازي', 'Parallel')}
              <select value={streams} disabled={busy || active} onChange={e => setStreams(Number(e.target.value))} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-xs">
                {[1, 2, 4].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <span className="text-gray-400">{t('(أقل = ضغط أخف على الخوادم)', '(lower = lighter load)')}</span>
            </label>
            <button disabled={busy || active} onClick={startAll} className="inline-flex items-center gap-1.5 rounded-lg bg-sa-600 hover:bg-sa-700 text-white text-xs font-semibold px-3 py-1.5 disabled:opacity-50">
              <Play className="w-3.5 h-3.5" /> {t('كل الطلاب لكل الكليات + أعضاء هيئة التدريس', 'All students, all colleges + faculty')}
            </button>
            <label className="inline-flex items-center gap-1.5">
              <input type="checkbox" checked={withAnalyze} disabled={busy || active} onChange={e => setWithAnalyze(e.target.checked)} className="accent-sa-600" />
              {t('يشمل تحليل الذكاء الاصطناعي', 'Include AI analyses')}
            </label>
          </div>
        )}
      </div>

      {message && <div className="text-xs rounded-lg bg-gray-50 dark:bg-gray-900 px-3 py-2 text-gray-700 dark:text-gray-300">{message}</div>}
      {allRunning && <div className="text-xs text-blue-700 dark:text-blue-300">{t(`تعمل كل الكليات الآن${snap.running ? ` — المرحلة: ${snap.running.stage === 'faculty' ? 'أعضاء هيئة التدريس' : snap.running.stage}` : ''}`, `All colleges running${snap.running ? ` — ${snap.running.stage}` : ''}`)}</div>}
      {active && !runningCollege && <div className="text-xs text-gold-800 dark:text-gold-300">{t('سلسلة أخرى في الطابور — أوقفها من «إيقاف ما في الطابور» أو انتظر انتهاءها.', 'Another chain is queued — stop it or wait.')}</div>}
      {scheduledOnly && <div className="text-xs text-gray-500">{t(`تشغيل مجدول يعمل (${snap.running?.stage}) — لا يمنع تشغيل كلية، وينتهي وحده عند ميزانيته.`, `A scheduled ${snap.running?.stage} run is going — it does not block a college run.`)}</div>}

      <div className="space-y-2">
        {snap.colleges.map(c => {
          const base = c.total || c.expected || 1;
          const isRunning = allRunning || runningCollege === c.faculty_no;
          const pct = Math.round(((c.academic + c.profile + c.blackboard + c.scored) / (4 * base)) * 100);
          const expanded = open === c.faculty_no;
          return (
            <div key={c.faculty_no} className={`rounded-xl border ${isRunning ? 'border-blue-300 dark:border-blue-700' : 'border-gray-100 dark:border-gray-700'}`}>
              <div className="flex flex-wrap items-center gap-3 px-3 py-2">
                <button onClick={() => setOpen(expanded ? null : c.faculty_no)} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
                  <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  {doneAll(c) ? <CheckCircle2 className="w-4 h-4 text-sa-600" /> : isRunning ? <Loader2 className="w-4 h-4 text-blue-600 animate-spin" /> : <CircleDashed className="w-4 h-4 text-gray-300" />}
                  {c.name}
                </button>
                <span className="text-xs font-mono text-gray-500">{fmtN(c.total)} / {fmtN(c.expected)}</span>
                <div className="flex-1 min-w-[120px] h-2 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div className={`h-full ${isRunning ? 'bg-blue-500' : 'bg-sa-500'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
                <span className="text-xs font-mono text-gray-500 w-10 text-end">{Math.min(100, pct)}%</span>
                {role === 'admin' && (
                  <button disabled={busy || active || doneAll(c)} onClick={() => start(c, 'auto', withAnalyze ? 'analyze' : 'users')} className="inline-flex items-center gap-1 rounded-lg bg-sa-600 hover:bg-sa-700 text-white text-xs font-medium px-3 py-1.5 disabled:opacity-50">
                    <Play className="w-3.5 h-3.5" /> {doneAll(c) ? t('مكتملة', 'Complete') : t('إكمال الكلية', 'Finish college')}
                  </button>
                )}
              </div>

              {expanded && (
                <ol className="border-t border-gray-100 dark:border-gray-700 px-3 py-2 space-y-1.5">
                  {STAGES.map((s, i) => {
                    const n = Math.min(s.count(c), base);
                    const errs = s.errors?.(c) ?? 0;
                    const p = s.key === 'roster' ? (c.total > 0 ? 100 : 0) : Math.round((n / base) * 100);
                    const here = isRunning && snap.running?.stage === s.key;
                    return (
                      <li key={s.key} className="grid grid-cols-[20px_minmax(140px,220px)_1fr_auto_auto] items-center gap-2 text-xs">
                        <span className="font-mono text-gray-400">{i + 1}</span>
                        <span className="text-gray-800 dark:text-gray-200">{t(s.ar, s.en)}</span>
                        <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                          <div className={`h-full ${here ? 'bg-blue-500 animate-pulse' : p >= 100 ? 'bg-sa-500' : 'bg-blue-400'}`} style={{ width: `${Math.min(100, p)}%` }} />
                        </div>
                        <span className="font-mono text-gray-500 whitespace-nowrap">
                          {s.key === 'roster' ? fmtN(c.total) : `${fmtN(n)} / ${fmtN(c.total)}`}
                          {errs > 0 && <span className="text-red-600 ms-1 inline-flex items-center gap-0.5"><AlertTriangle className="w-3 h-3" />{fmtN(errs)}</span>}
                        </span>
                        {role === 'admin' ? (
                          p >= 100 ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] text-sa-700 dark:text-sa-300"><CheckCircle2 className="w-3 h-3" />{t('مكتمل', 'Done')}</span>
                          ) : (
                            <button disabled={busy || active || (s.key !== 'roster' && c.total === 0)} onClick={() => start(c, s.key, s.key)} className="rounded-md border border-gray-300 dark:border-gray-600 px-2 py-0.5 text-[11px] text-gray-700 dark:text-gray-300 disabled:opacity-40">
                              {t('تشغيل', 'Run')}
                            </button>
                          )
                        ) : <span />}
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
