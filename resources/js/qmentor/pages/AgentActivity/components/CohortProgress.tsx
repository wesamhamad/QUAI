import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Square, RefreshCw, Wifi, WifiOff, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useRole } from '../../../contexts/RoleContext';
import { apiClient } from '../../../lib/api';

/**
 * حشد QMentor — the pre-load chain, live.
 *
 * Reads /api/qmentor/cohort/stream (Server-Sent Events, unbuffered). The
 * browser's EventSource reconnects by itself when a proxy or a sleep drops
 * the socket; while it is down we fall back to polling the JSON snapshot
 * every 5 s so the bars never freeze. One button enqueues the chain, one
 * removes its queued jobs (the running slice finishes on its own).
 */
interface StageStat { total: number; done: number; errors: number; pct: number }
interface RunRow { id: number; stage: string; trigger: string; started_at: string; finished_at: string | null; pending: number; succeeded: number; failed: number; budget_hit: boolean; note: string | null }
interface Snapshot {
  at: string;
  enabled: boolean;
  cohort: number;
  roster: { done: boolean; last: string | null; note: string | null };
  stages: Record<'academic' | 'profile' | 'blackboard', StageStat>;
  workers?: number;
  scope?: { expected: number; faculties: { faculty_no: string; name: string; expected: number; total: number; academic: number; profile: number; blackboard: number; scored: number }[] };
  users?: { students: number; instructors: number; cohort: number; faculty: number };
  analyze?: { done: number; total: number; last: string | null; tokens: number };
  score: { done: number; total: number; pct: number; last: string | null; note: string | null };
  alerts: { last: string | null; note: string | null; created: number | null };
  evidence: { last: string | null };
  queued: number;
  reserved: number;
  running: { stage: string; since: string; pending: number; streams?: number } | null;
  recent_runs: RunRow[];
}

const STEPS: { key: string; ar: string; en: string }[] = [
  { key: 'roster', ar: 'قائمة الطلاب', en: 'Roster' },
  { key: 'academic', ar: 'سجل الدرجات', en: 'Grade history' },
  { key: 'profile', ar: 'الملف والغياب والخطة', en: 'Profile, absences, plan' },
  { key: 'blackboard', ar: 'بلاكبورد', en: 'Blackboard' },
  { key: 'score', ar: 'تقييم الخطر (31 مؤشراً)', en: 'Risk scoring (31)' },
  { key: 'alerts', ar: 'التنبيهات', en: 'Alerts' },
  { key: 'evidence', ar: 'مرفقات ملف الرد', en: 'Evidence files' },
  { key: 'users', ar: 'حسابات المنصة والصلاحيات', en: 'Accounts and roles' },
  { key: 'analyze', ar: 'تحليل الذكاء الاصطناعي (سوق العمل + التوصيات)', en: 'AI analyses (labor market + recommendations)' },
];

const STAGE_OPTIONS: { key: string; ar: string; en: string }[] = [
  { key: 'all', ar: 'كل المراحل', en: 'All stages' },
  { key: 'profile', ar: 'الملف', en: 'Profile' },
  { key: 'blackboard', ar: 'بلاكبورد', en: 'Blackboard' },
  { key: 'score', ar: 'تقييم الخطر', en: 'Risk scoring' },
  { key: 'alerts', ar: 'التنبيهات', en: 'Alerts' },
  { key: 'evidence', ar: 'المرفقات', en: 'Evidence' },
  { key: 'users', ar: 'الحسابات', en: 'Accounts' },
  { key: 'analyze', ar: 'التحليل', en: 'AI analyses' },
];

const fmt = (s: string | null | undefined) => (s ? String(s).replace('T', ' ').slice(0, 16) : '—');

export default function CohortProgress() {
  const { t } = useLanguage();
  const { role } = useRole();
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [live, setLive] = useState<'connecting' | 'live' | 'polling'>('connecting');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const pollRef = useRef<number | null>(null);

  const poll = useCallback(async () => {
    try {
      const r = await apiClient.get<{ data: Snapshot }>('/cohort/progress');
      setSnap(r.data);
    } catch { /* keep the last snapshot */ }
  }, []);

  useEffect(() => {
    let closed = false;
    const connect = () => {
      if (closed) return;
      const es = new EventSource('/api/qmentor/cohort/stream', { withCredentials: true });
      esRef.current = es;
      es.addEventListener('progress', ev => {
        setLive('live');
        if (pollRef.current) { window.clearInterval(pollRef.current); pollRef.current = null; }
        try { setSnap(JSON.parse((ev as MessageEvent).data)); } catch { /* ignore a torn frame */ }
      });
      es.addEventListener('end', () => { es.close(); window.setTimeout(connect, 1000); }); // server-side cap reached: reopen
      es.onerror = () => {
        // EventSource retries on its own; until it is back, poll so the bars keep moving.
        setLive('polling');
        if (!pollRef.current) {
          void poll();
          pollRef.current = window.setInterval(() => { void poll(); }, 5000);
        }
      };
    };
    void poll();
    connect();
    return () => {
      closed = true;
      esRef.current?.close();
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [poll]);

  const [streams, setStreams] = useState(4);
  const [refreshFresh, setRefreshFresh] = useState(false);
  // «إعادة مرحلة محددة»: start the chain at one stage (to the end) and, for the
  // profile / Blackboard stages, forget the stamps first so everyone is re-read.
  const [stage, setStage] = useState<string>('all');
  const [resetStamp, setResetStamp] = useState(false);
  const stampable = stage === 'profile' || stage === 'blackboard';
  const stageLabel = (key: string) => STAGE_OPTIONS.find(o => o.key === key)?.ar ?? key;
  const rerunNote = (data?: { stage?: string; reset?: number }) =>
    data?.stage && data.stage !== 'all' ? t(` من مرحلة «${stageLabel(data.stage)}»${data.reset != null && stampable && resetStamp ? ` · أُعيد ${data.reset.toLocaleString('en')} طالباً للقراءة` : ''}`, ` from «${stageLabel(data.stage)}»${data.reset != null && stampable && resetStamp ? ` · ${data.reset} students reset` : ''}`) : '';

  // «حشد الكليات التسع»: the same chain over the configured scope — confirmed
  // with the real count and the expected wall time before anything is queued.
  const startScope = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const pv = await apiClient.get<{ data: { expected_students: number; estimated_label: string; faculties: { name: string; expected: number; fresh_today: boolean }[]; stages: string[] } }>(`/cohort/preview?streams=${streams}`);
      const p = pv.data;
      const fresh = p.faculties.filter(f => f.fresh_today).map(f => f.name);
      const NL = String.fromCharCode(10);
      const lines = [
        t('حشد الكليات التسع', 'Nine-college run'), '',
        ...p.faculties.map(f => `• ${f.name}: ${f.expected.toLocaleString('en')}${f.fresh_today ? (refreshFresh ? ' (محدّثة اليوم — ستُعاد)' : ' (محدّثة اليوم — تُتخطّى)') : ''}`), '',
        t(`الإجمالي ${p.expected_students.toLocaleString('en')} طالباً · ${streams} مسارات · المدة المتوقعة ≈ ${p.estimated_label}`, `Total ${p.expected_students} students · ${streams} streams · ≈ ${p.estimated_label}`),
        t('المراحل: ', 'Stages: ') + (stage === 'all' ? p.stages : p.stages.slice(Math.max(0, p.stages.indexOf(stage)))).join(' → '),
        ...(stampable && resetStamp ? [t(`تُمحى أختام مرحلة «${stageLabel(stage)}» لطلاب هذه الكليات فيُقرؤون من جديد.`, `The «${stageLabel(stage)}» stamps of these colleges' students are cleared; all are re-read.`)] : []),
        ...(fresh.length && !refreshFresh ? ['', t('تُتخطّى الكليات المحدّثة اليوم: ', 'Fresh colleges are skipped: ') + fresh.join('، ')] : []),
        '', t('ابدأ؟', 'Start?'),
      ];
      const text = lines.join(NL);
      if (!window.confirm(text)) return;
      const r = await apiClient.post<{ data?: { queued?: boolean; stage?: string; reset?: number; faculties?: string[]; skipped_fresh?: number; estimated_label?: string }; error?: string }>('/cohort/start-scope', { streams, refresh_fresh: refreshFresh, stage, reset_stamp: stampable && resetStamp });
      setMessage(r.error ?? t(`أُدرجت سلسلة ${r.data?.faculties?.length ?? 0} كليات في الطابور${rerunNote(r.data)} (تُخطّيت ${r.data?.skipped_fresh ?? 0} محدّثة) — يبدأ التنفيذ خلال دقيقة، المدة المتوقعة ${r.data?.estimated_label ?? ''}.`, `Queued ${r.data?.faculties?.length ?? 0} colleges${rerunNote(r.data)} (${r.data?.skipped_fresh ?? 0} fresh skipped) — starts within a minute, ≈ ${r.data?.estimated_label ?? ''}.`));
      await poll();
    } catch (e) {
      setMessage(t('تعذّر تنفيذ الطلب: ', 'Request failed: ') + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(false);
    }
  };

  const act = async (what: 'start' | 'stop') => {
    setBusy(true);
    setMessage(null);
    try {
      const r = await apiClient.post<{ data?: { queued?: boolean; stage?: string; reset?: number; removed?: number; note?: string }; error?: string }>(`/cohort/${what}`, what === 'start' ? { streams, stage, reset_stamp: stampable && resetStamp } : undefined);
      setMessage(r.error ?? (what === 'start' ? t(`أُدرجت السلسلة في الطابور${rerunNote(r.data)} — يبدأ التنفيذ خلال دقيقة.`, `Chain enqueued${rerunNote(r.data)} — starts within a minute.`) : t(`أُزيل ${r.data?.removed ?? 0} من الطابور. ${r.data?.note ?? ''}`, `Removed ${r.data?.removed ?? 0} queued jobs. ${r.data?.note ?? ''}`)));
      await poll();
    } catch (e) {
      setMessage(t('تعذّر تنفيذ الطلب: ', 'Request failed: ') + (e instanceof Error ? e.message : ''));
    } finally {
      setBusy(false);
    }
  };

  const stepState = (key: string): { pct: number; label: string; state: 'done' | 'running' | 'pending' | 'error' } => {
    if (!snap) return { pct: 0, label: '', state: 'pending' };
    const runningKey = snap.running?.stage;
    if (key === 'roster') return { pct: snap.roster.done ? 100 : 0, label: snap.roster.done ? t(`${snap.cohort.toLocaleString()} طالباً · ${fmt(snap.roster.last)}`, `${snap.cohort.toLocaleString()} students · ${fmt(snap.roster.last)}`) : t('لم تُقرأ بعد', 'Not read yet'), state: runningKey === 'roster' ? 'running' : snap.roster.done ? 'done' : 'pending' };
    if (key === 'academic' || key === 'profile' || key === 'blackboard') {
      const s = snap.stages[key];
      const st = runningKey === key ? 'running' : s.done >= s.total && s.total > 0 ? 'done' : s.errors > 0 && s.done === 0 ? 'error' : 'pending';
      return { pct: s.pct, label: `${s.done.toLocaleString()} / ${s.total.toLocaleString()}${s.errors ? ` · ${t('أخطاء', 'errors')} ${s.errors}` : ''}`, state: st };
    }
    if (key === 'score') return { pct: snap.score.pct, label: `${snap.score.done.toLocaleString()} / ${snap.score.total.toLocaleString()} · ${snap.score.note ?? ''}`, state: runningKey === 'score' ? 'running' : snap.score.pct >= 99.5 ? 'done' : 'pending' };
    if (key === 'users') {
      const u = snap.users; const pct = u && u.cohort ? Math.round(Math.min(100, (u.students / u.cohort) * 100) * 10) / 10 : 0;
      return { pct, label: u ? `${u.students.toLocaleString()} طالباً · ${u.instructors.toLocaleString()} مرشداً/عضو هيئة تدريس (${u.faculty.toLocaleString()} في الكليات)` : '—', state: runningKey === 'users' ? 'running' : pct >= 99 ? 'done' : 'pending' };
    }
    if (key === 'analyze') {
      const a = snap.analyze; const pct = a && a.total ? Math.round((a.done / a.total) * 1000) / 10 : 0;
      return { pct, label: a ? `${a.done.toLocaleString()} / ${a.total.toLocaleString()} · ${(a.tokens / 1000).toFixed(0)}k رمز · ${a.last ? fmt(a.last) : '—'}` : '—', state: runningKey === 'analyze' ? 'running' : pct >= 99.5 ? 'done' : 'pending' };
    }
    if (key === 'alerts') return { pct: snap.alerts.last ? 100 : 0, label: snap.alerts.last ? `${fmt(snap.alerts.last)} · ${snap.alerts.note ?? ''}` : '—', state: runningKey === 'alerts' ? 'running' : snap.alerts.last ? 'done' : 'pending' };
    return { pct: snap.evidence.last ? 100 : 0, label: snap.evidence.last ?? '—', state: snap.evidence.last ? 'done' : 'pending' };
  };

  const overall = snap
    ? Math.round((STEPS.reduce((acc, s) => acc + stepState(s.key).pct, 0) / STEPS.length) * 10) / 10
    : 0;
  const active = !!snap && (snap.queued > 0 || !!snap.running);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{t('حشد كليات التجربة — التحميل خطوة بخطوة', 'Pilot cohort — the pre-load, step by step')}</h2>
        <span className={`inline-flex items-center gap-1 text-xs rounded-full px-2 py-0.5 ${live === 'live' ? 'bg-sa-50 text-sa-700 dark:bg-sa-500/10 dark:text-sa-300' : 'bg-gold-50 text-gold-800 dark:bg-gold-500/10 dark:text-gold-300'}`}>
          {live === 'live' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          {live === 'live' ? t('بث مباشر', 'Live stream') : live === 'polling' ? t('البث منقطع — تحديث كل 5 ثوانٍ', 'Stream down — polling every 5 s') : t('جارٍ الاتصال', 'Connecting')}
        </span>
        {snap && !snap.enabled && <span className="text-xs rounded-full px-2 py-0.5 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300">{t('الأتمتة موقوفة', 'Automation halted')}</span>}
        <span className="ms-auto text-xs text-gray-500">{snap ? fmt(snap.at) : ''}</span>
      </div>

      {/* overall bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
          <span>{t('الإجمالي', 'Overall')}</span>
          <span className="font-mono">{overall}%</span>
        </div>
        <div className="h-3 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
          <div className={`h-full rounded-full transition-[width] duration-700 ${active ? 'bg-sa-500 animate-pulse' : 'bg-sa-600'}`} style={{ width: `${overall}%` }} />
        </div>
        {snap && (
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {snap.running
              ? t(`يعمل الآن: ${snap.running.stage}${(snap.running.streams ?? 1) > 1 ? ` × ${snap.running.streams} مسارات` : ''} منذ ${fmt(snap.running.since)} · في الطابور ${snap.queued}`, `Running: ${snap.running.stage}${(snap.running.streams ?? 1) > 1 ? ` × ${snap.running.streams} streams` : ''} since ${fmt(snap.running.since)} · queued ${snap.queued}`)
              : snap.queued > 0
                ? t(`في الطابور ${snap.queued} وظيفة — ينتظر عامل الطابور (كل دقيقة)`, `${snap.queued} job(s) queued — waiting for the worker (every minute)`)
                : t('لا شيء يعمل الآن', 'Idle')}
          </div>
        )}
      </div>

      {/* steps */}
      <ol className="space-y-2">
        {STEPS.map((s, i) => {
          const st = stepState(s.key);
          const Icon = st.state === 'done' ? CheckCircle2 : st.state === 'running' ? Loader2 : st.state === 'error' ? AlertTriangle : RefreshCw;
          const color = st.state === 'done' ? 'text-sa-600' : st.state === 'running' ? 'text-blue-600 animate-spin' : st.state === 'error' ? 'text-red-600' : 'text-gray-300 dark:text-gray-600';
          return (
            <li key={s.key} className="grid grid-cols-[24px_1fr] gap-3 items-start">
              <Icon className={`w-5 h-5 mt-0.5 ${color}`} />
              <div>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-gray-900 dark:text-white"><span className="font-mono text-xs text-gray-400 me-2">{i + 1}</span>{t(s.ar, s.en)}</span>
                  <span className="font-mono text-xs text-gray-500">{st.pct}%</span>
                </div>
                <div className="h-2 mt-1 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <div className={`h-full rounded-full transition-[width] duration-700 ${st.state === 'error' ? 'bg-red-500' : st.state === 'running' ? 'bg-blue-500' : 'bg-sa-500'}`} style={{ width: `${st.pct}%` }} />
                </div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 font-mono" dir="auto">{st.label}</div>
              </div>
            </li>
          );
        })}
      </ol>

      {role === 'admin' && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <button disabled={busy || active} onClick={() => act('start')} className="inline-flex items-center gap-1.5 rounded-lg bg-sa-600 hover:bg-sa-700 text-white text-sm font-medium px-4 py-2 disabled:opacity-50">
            <Play className="w-4 h-4" /> {t('بدء السلسلة كاملة', 'Start the full chain')}
          </button>
          <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            {t('التوازي', 'Parallel')}
            <select value={streams} disabled={busy || active} onChange={e => setStreams(Number(e.target.value))} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-xs text-gray-900 dark:text-white">
              {[1, 2, 4, 6, 8].map(n => <option key={n} value={n}>{n} {t('مسارات', 'streams')}</option>)}
            </select>
            {snap?.workers != null && <span className="text-gray-400">{t(`· ${snap.workers} عمّال مجدولون`, `· ${snap.workers} scheduled workers`)}</span>}
          </label>
          <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            {t('المرحلة', 'Stage')}
            <select value={stage} disabled={busy || active} onChange={e => setStage(e.target.value)} className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-xs text-gray-900 dark:text-white">
              {STAGE_OPTIONS.map(o => <option key={o.key} value={o.key}>{t(o.ar, o.en)}</option>)}
            </select>
          </label>
          <label className={`inline-flex items-center gap-1.5 text-xs ${stampable ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`} title={stampable ? undefined : t('يخصّ مرحلتي الملف وبلاكبورد فقط', 'Profile and Blackboard stages only')}>
            <input type="checkbox" checked={stampable && resetStamp} disabled={busy || active || !stampable} onChange={e => setResetStamp(e.target.checked)} className="accent-sa-600" />
            {t('إعادة قراءة الطلاب المختومين', 'Re-read stamped students')}
          </label>
          <span className="hidden sm:inline-block w-px h-6 bg-gray-200 dark:bg-gray-700" />
          <button disabled={busy || active} onClick={startScope} className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 hover:bg-black dark:bg-sa-700 dark:hover:bg-sa-600 text-white text-sm font-medium px-4 py-2 disabled:opacity-50">
            <Play className="w-4 h-4" /> {t('حشد الكليات التسع', 'Nine-college run')}{snap?.scope ? ` · ${snap.scope.expected.toLocaleString('en')}` : ''}
          </button>
          <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
            <input type="checkbox" checked={refreshFresh} disabled={busy || active} onChange={e => setRefreshFresh(e.target.checked)} className="accent-sa-600" />
            {t('إعادة جلب الكليات المحدّثة اليوم', 'Re-fetch colleges refreshed today')}
          </label>
          <button disabled={busy || !active} onClick={() => act('stop')} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium px-4 py-2 disabled:opacity-50">
            <Square className="w-4 h-4" /> {t('إيقاف ما في الطابور', 'Stop what is queued')}
          </button>
          {message && <span className="text-xs text-gray-600 dark:text-gray-400">{message}</span>}
        </div>
      )}

      {snap?.scope && snap.scope.faculties.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-1">{t('التقدم لكل كلية', 'Progress per college')} <span className="font-mono text-gray-400">· {t('المتوقع', 'expected')} {snap.scope.expected.toLocaleString('en')}</span></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-mono">
              <thead className="text-gray-400"><tr><th className="text-start px-2">الكلية</th><th className="text-start px-2">المتوقع</th><th className="text-start px-2">القائمة</th><th className="text-start px-2">الدرجات</th><th className="text-start px-2">الملف</th><th className="text-start px-2">بلاكبورد</th><th className="text-start px-2">مقيَّم</th></tr></thead>
              <tbody>
                {snap.scope.faculties.map(f => {
                  const cell = (v: number) => { const base = f.total || f.expected || 1; const pct = Math.round((v / base) * 100); return (
                    <td className="px-2 py-1"><div className="flex items-center gap-1.5"><div className="w-16 h-1.5 rounded bg-gray-100 dark:bg-gray-700 overflow-hidden"><div className={`h-full ${pct >= 100 ? 'bg-sa-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, pct)}%` }} /></div><span className="tabular-nums text-gray-600 dark:text-gray-300">{v.toLocaleString('en')}</span></div></td>
                  ); };
                  return (
                    <tr key={f.faculty_no} className="border-t border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      <td className="px-2 py-1 font-sans font-semibold">{f.name}</td>
                      <td className="px-2 py-1 tabular-nums text-gray-400">{f.expected.toLocaleString('en')}</td>
                      <td className="px-2 py-1 tabular-nums">{f.total.toLocaleString('en')}</td>
                      {cell(f.academic)}{cell(f.profile)}{cell(f.blackboard)}{cell(f.scored)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {snap && snap.recent_runs.length > 0 && (
        <details>
          <summary className="text-xs font-semibold text-gray-500 cursor-pointer">{t('آخر التشغيلات', 'Recent runs')}</summary>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-[11px] font-mono">
              <thead className="text-gray-400"><tr><th className="text-start px-2">#</th><th className="text-start px-2">stage</th><th className="text-start px-2">trigger</th><th className="text-start px-2">start</th><th className="text-start px-2">end</th><th className="text-start px-2">ok</th><th className="text-start px-2">fail</th><th className="text-start px-2">note</th></tr></thead>
              <tbody>
                {snap.recent_runs.map(r => (
                  <tr key={r.id} className="border-t border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                    <td className="px-2">{r.id}</td><td className="px-2">{r.stage}</td><td className="px-2">{r.trigger}</td><td className="px-2">{fmt(r.started_at)}</td><td className="px-2">{r.finished_at ? fmt(r.finished_at) : '…'}</td><td className="px-2">{r.succeeded}</td><td className="px-2">{r.failed}</td><td className="px-2" dir="auto">{r.note ?? ''}{r.budget_hit ? ' · budget' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}
