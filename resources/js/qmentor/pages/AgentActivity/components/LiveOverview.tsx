import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bot, CheckCircle, AlertTriangle, Zap, Activity, Bell } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import { apiClient } from '../../../lib/api';
import { useAutonomy, useApprovals } from '../../../hooks/useAdvisorData';

interface Progress {
  recent_runs: { id: number; stage: string; trigger: string; started_at: string; finished_at: string | null; pending: number; succeeded: number; failed: number; note: string | null }[];
  alerts: { last: string | null; note: string | null; created: number | null };
  analyze?: { done: number; total: number; tokens: number };
  cohort: number;
  queued: number;
  running: { stage: string; since: string } | null;
}

const STAGE_AR: Record<string, string> = { roster: 'قائمة الطلاب', faculty: 'هيئة التدريس', academic: 'سجل الدرجات', profile: 'الملف والغياب والخطة', blackboard: 'بلاكبورد', score: 'تقييم الخطر', alerts: 'التنبيهات', evidence: 'مرفقات الملف', users: 'الحسابات', analyze: 'التحليل' };

/**
 * What the agent actually did — from its own tables: the autonomy matrix
 * (config), the approval queue, the sync-run log and the alert run. The
 * sample task list this page carried before is gone.
 */
export default function LiveOverview() {
  const { t } = useLanguage();
  const autonomy = useAutonomy();
  const approvals = useApprovals();
  const progress = useQuery({ queryKey: ['qmentor', 'cohort', 'progress', 'overview'], queryFn: async () => (await apiClient.get<{ data: Progress }>('/cohort/progress')).data, staleTime: 30_000, refetchInterval: 60_000 });

  const a = autonomy.data;
  const runs = progress.data?.recent_runs ?? [];
  const stats = useMemo(() => {
    const finished = runs.filter(r => r.finished_at);
    const ok = finished.reduce((s, r) => s + (r.succeeded ?? 0), 0);
    const fail = finished.reduce((s, r) => s + (r.failed ?? 0), 0);
    const today = runs.filter(r => r.started_at && String(r.started_at).slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
    return { ok, fail, rate: ok + fail > 0 ? Math.round((ok / (ok + fail)) * 1000) / 10 : null, today };
  }, [runs]);

  const cards = [
    { icon: Bot, value: a?.tasks.length ?? '—', ar: 'مهام المصفوفة', en: 'Matrix tasks', hint: a ? `L0–L4 · ${a.enabled ? 'الأتمتة تعمل' : 'الأتمتة موقوفة'}` : '' },
    { icon: Zap, value: a ? (a.by_mode.agent ?? 0) + (a.by_mode.agent_notify ?? 0) : '—', ar: 'ينفّذها الوكيل وحده', en: 'Agent-run', hint: a ? `${a.by_mode.agent ?? 0} صامتة · ${a.by_mode.agent_notify ?? 0} مع إبلاغ` : '' },
    { icon: AlertTriangle, value: a ? (a.by_mode.human_approves ?? 0) + (a.by_mode.human_only ?? 0) : '—', ar: 'تحتاج إنساناً', en: 'Human required', hint: a ? `${a.by_mode.human_approves ?? 0} بموافقة · ${a.by_mode.human_only ?? 0} إنسان فقط` : '' },
    { icon: Bell, value: approvals.data?.pending ?? a?.approvals.pending ?? '—', ar: 'طلبات بانتظار المرشد', en: 'Pending approvals', hint: a ? `${a.approvals.approved} اعتُمد · ${a.approvals.rejected} رُفض · ${a.approvals.escalated} صُعّد` : '' },
    { icon: CheckCircle, value: stats.rate == null ? '—' : `${stats.rate}%`, ar: 'نجاح آخر التشغيلات', en: 'Recent run success', hint: `${stats.ok.toLocaleString('en')} نجح · ${stats.fail.toLocaleString('en')} فشل` },
    { icon: Activity, value: progress.data?.alerts.created ?? '—', ar: 'تنبيهات آخر جولة', en: 'Alerts last run', hint: progress.data?.alerts.last ? String(progress.data.alerts.last).slice(0, 16).replace('T', ' ') : '' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map(c => (
          <Card key={c.ar}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-sa-700 dark:text-sa-300">{t(c.ar, c.en)}</span><c.icon className="w-4 h-4 text-sa-500" /></div>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums">{c.value}</div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{c.hint}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t('سجل التشغيلات', 'Run log')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="text-gray-400 text-right"><th className="py-1">المرحلة</th><th className="py-1">المشغِّل</th><th className="py-1">البداية</th><th className="py-1">نجح</th><th className="py-1">فشل</th><th className="py-1">ملاحظة</th></tr></thead>
              <tbody>
                {runs.map(r => (
                  <tr key={r.id} className="border-t border-gray-100 dark:border-gray-700">
                    <td className="py-1.5 font-semibold text-gray-800 dark:text-gray-100">{STAGE_AR[r.stage] ?? r.stage}</td>
                    <td className="py-1.5 text-gray-500 font-mono">{r.trigger}</td>
                    <td className="py-1.5 text-gray-500 font-mono" dir="ltr">{String(r.started_at).slice(0, 16).replace('T', ' ')}{!r.finished_at && ' …'}</td>
                    <td className="py-1.5 tabular-nums">{r.succeeded ?? 0}</td>
                    <td className={`py-1.5 tabular-nums ${(r.failed ?? 0) > 0 ? 'text-red-600 font-semibold' : ''}`}>{r.failed ?? 0}</td>
                    <td className="py-1.5 text-gray-500" dir="auto">{r.note ?? ''}</td>
                  </tr>
                ))}
                {runs.length === 0 && <tr><td colSpan={6} className="py-3 text-gray-400">{t('لا تشغيلات مسجّلة بعد', 'No runs yet')}</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{t('طلبات الوكيل للمرشدين', 'Requests to advisors')}</h3>
          <p className="text-[11px] text-gray-400 mb-3">{t('المهام L3: يجهّز الوكيل ويطلب موافقة قبل أي رسالة خارج المنصة أو تصعيد', 'L3 tasks: prepared by the agent, executed only on approval')}</p>
          <div className="space-y-2">
            {(approvals.data?.approvals ?? []).slice(0, 8).map(p => (
              <div key={p.id} className="text-xs border-t border-gray-100 dark:border-gray-700 pt-2">
                <div className="flex justify-between gap-2"><span className="font-semibold text-gray-800 dark:text-gray-100">#{p.id} · {p.action}</span><span className="text-gray-400">{p.status}</span></div>
                <div className="text-gray-500">{t('الطالب', 'student')} {p.student_id} · {p.due_at ? `${t('المهلة', 'due')} ${String(p.due_at).slice(0, 16).replace('T', ' ')}` : ''}</div>
                {p.reason && <div className="text-gray-500" dir="auto">{p.reason}</div>}
              </div>
            ))}
            {(approvals.data?.approvals ?? []).length === 0 && <p className="text-xs text-gray-400">{t('لا طلبات معلّقة', 'No pending requests')}</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
