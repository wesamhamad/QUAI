import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Bot } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useApprovals, type ApprovalRow } from '../../../hooks/useAdvisorData';
import { apiClient } from '../../../lib/api';

/**
 * طلبات الوكيل — what the agent wants to do and may not do alone (SRS §8 L3).
 * Approve executes at once (an email, an escalation) and the row records
 * what happened; reject stops it. Overdue rows show as escalated.
 */
const statusMeta: Record<ApprovalRow['status'], { ar: string; en: string; cls: string }> = {
  pending: { ar: 'بانتظارك', en: 'Awaiting you', cls: 'bg-gold-50 text-gold-800 dark:bg-gold-500/10 dark:text-gold-300' },
  escalated: { ar: 'تجاوز المهلة — صُعّد', en: 'Overdue — escalated', cls: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300' },
  approved: { ar: 'اعتُمد', en: 'Approved', cls: 'bg-sa-50 text-sa-700 dark:bg-sa-500/10 dark:text-sa-300' },
  executed: { ar: 'اعتُمد ونُفّذ', en: 'Approved & executed', cls: 'bg-sa-50 text-sa-700 dark:bg-sa-500/10 dark:text-sa-300' },
  rejected: { ar: 'رُفض', en: 'Rejected', cls: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
  expired: { ar: 'انتهى', en: 'Expired', cls: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
};

export default function ApprovalsQueue() {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { data, source, isLoading } = useApprovals();
  const [busy, setBusy] = useState<number | null>(null);
  const [note, setNote] = useState<Record<number, string>>({});

  const decide = async (id: number, decision: 'approve' | 'reject') => {
    setBusy(id);
    try {
      await apiClient.decideApproval(id, decision, note[id] || undefined);
      await queryClient.invalidateQueries({ queryKey: ['advisor', 'approvals'] });
      queryClient.invalidateQueries({ queryKey: ['qmentor', 'autonomy'] });
    } finally {
      setBusy(null);
    }
  };

  if (isLoading) return <div className="h-32 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />;
  if (source !== 'api' || !data) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">{t('تعذّر قراءة طلبات الوكيل.', 'Could not load the agent’s requests.')}</p>;
  }

  const open = data.approvals.filter(a => a.status === 'pending' || a.status === 'escalated');
  const closed = data.approvals.filter(a => !(a.status === 'pending' || a.status === 'escalated')).slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Bot className="w-4 h-4 text-sa-600" />
          {t('ما يطلبه الوكيل منك', 'What the agent asks of you')}
        </h3>
        <span className="text-xs text-gray-500">{t(`${open.length} مفتوح`, `${open.length} open`)}</span>
      </div>

      {open.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('لا طلبات مفتوحة. يظهر هنا كل ما يريد الوكيل فعله ولا يُسمح له به وحده: رسالة عند مستوى مرتفع أو حرج، أو تصعيد لرئيس القسم.', 'No open requests. Anything the agent wants to do but may not do alone appears here: a message at High/Critical, or an escalation to the department head.')}
        </p>
      )}

      {open.map(a => {
        const s = statusMeta[a.status];
        const overdue = a.status === 'escalated';
        return (
          <div key={a.id} className={`rounded-xl border p-4 space-y-2 ${overdue ? 'border-red-200 dark:border-red-800' : 'border-gold-200 dark:border-gold-500/30'} bg-white dark:bg-gray-800`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-gray-400">#{a.task_no}</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{a.task}</span>
              <span className={`text-[11px] rounded-full px-2 py-0.5 ${s.cls}`}>{t(s.ar, s.en)}</span>
              <span className="ms-auto text-xs text-gray-500 flex items-center gap-1">
                {overdue ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {a.due_at ? t(`المهلة ${a.sla_hours} س · ${String(a.due_at).slice(0, 16).replace('T', ' ')}`, `SLA ${a.sla_hours} h · ${String(a.due_at).slice(0, 16).replace('T', ' ')}`) : ''}
              </span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-medium">{a.student_name}</span> <span className="font-mono text-xs text-gray-400">{a.student_id}</span>
              {a.reason && <span className="block text-xs text-gray-500 mt-0.5">{a.reason}</span>}
            </div>
            {typeof a.payload?.body === 'string' && (
              <pre className="text-xs whitespace-pre-wrap rounded-lg bg-gray-50 dark:bg-gray-900 p-3 text-gray-700 dark:text-gray-300" dir="auto">{String(a.payload.subject ?? '')}{a.payload.subject ? '\n' : ''}{String(a.payload.body)}</pre>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <input
                id={`approval-note-${a.id}`}
                value={note[a.id] ?? ''}
                onChange={e => setNote(n => ({ ...n, [a.id]: e.target.value }))}
                placeholder={t('ملاحظة (اختياري)', 'Note (optional)')}
                className="flex-1 min-w-[160px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs"
              />
              <button disabled={busy === a.id} onClick={() => decide(a.id, 'approve')} className="inline-flex items-center gap-1 rounded-lg bg-sa-600 hover:bg-sa-700 text-white text-xs font-medium px-3 py-1.5 disabled:opacity-50">
                <CheckCircle2 className="w-3.5 h-3.5" /> {t('اعتماد وتنفيذ', 'Approve & execute')}
              </button>
              <button disabled={busy === a.id} onClick={() => decide(a.id, 'reject')} className="inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1.5 disabled:opacity-50">
                <XCircle className="w-3.5 h-3.5" /> {t('رفض', 'Reject')}
              </button>
            </div>
          </div>
        );
      })}

      {closed.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">{t('آخر القرارات', 'Recent decisions')}</h4>
          <ul className="space-y-1.5">
            {closed.map(a => {
              const s = statusMeta[a.status];
              return (
                <li key={a.id} className="flex flex-wrap items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-mono text-gray-400">#{a.task_no}</span>
                  <span className="text-gray-800 dark:text-gray-200">{a.task}</span>
                  <span>{a.student_name}</span>
                  <span className={`rounded-full px-2 py-0.5 ${s.cls}`}>{t(s.ar, s.en)}</span>
                  {a.execution?.detail && <span className="text-gray-400">— {a.execution.detail}</span>}
                  <span className="ms-auto text-gray-400">{a.decided_by ?? ''} · {String(a.decided_at ?? '').slice(0, 16).replace('T', ' ')}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
