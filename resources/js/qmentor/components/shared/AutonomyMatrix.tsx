import { useMemo } from 'react';
import { ShieldCheck, ShieldAlert, Power, UserCheck, Bot, BellRing, Hand } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAutonomy, type AutonomyTask } from '../../hooks/useAdvisorData';
import DataSourceBadge from './DataSourceBadge';

/**
 * حدود الاستقلالية — the SRS §8 matrix as the platform actually enforces it.
 *
 * Read from config through /api/qmentor/autonomy, so the screen, the config
 * and the response file quote one list. Each row says which level the act
 * sits at, who decides, and where in the platform a person sees it.
 */
const modeMeta: Record<AutonomyTask['mode'], { ar: string; en: string; icon: typeof Bot; cls: string }> = {
  agent: { ar: 'الوكيل يعمل', en: 'Agent acts', icon: Bot, cls: 'bg-sa-50 text-sa-700 dark:bg-sa-500/10 dark:text-sa-300' },
  agent_notify: { ar: 'الوكيل يعمل ويُبلغ', en: 'Agent acts, human told', icon: BellRing, cls: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300' },
  human_approves: { ar: 'يحتاج موافقة إنسان', en: 'Human approves first', icon: UserCheck, cls: 'bg-gold-50 text-gold-800 dark:bg-gold-500/10 dark:text-gold-300' },
  human_only: { ar: 'إنسان فقط — الكود لا ينفّذه', en: 'Human only — never by code', icon: Hand, cls: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300' },
};

export default function AutonomyMatrix() {
  const { t } = useLanguage();
  const { data, source, isLoading } = useAutonomy();

  const grouped = useMemo(() => {
    const tasks = data?.tasks ?? [];
    const order: AutonomyTask['mode'][] = ['human_only', 'human_approves', 'agent_notify', 'agent'];
    return order.map(mode => ({ mode, rows: tasks.filter(x => x.mode === mode) })).filter(g => g.rows.length);
  }, [data]);

  if (isLoading) {
    return <div className="h-24 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />;
  }
  if (source !== 'api' || !data) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${data.enabled ? 'bg-sa-50 text-sa-700 dark:bg-sa-500/10 dark:text-sa-300' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'}`}>
          <Power className="w-3.5 h-3.5" />
          {data.enabled
            ? t('الأتمتة تعمل — مفتاح الإيقاف متاح لمسؤول النظام (§8 مهمة 55)', 'Automation on — kill switch available to the system admin (§8 task 55)')
            : t('الأتمتة موقوفة بمفتاح الإيقاف', 'Automation halted by the kill switch')}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {data.outward_dispatch ? <ShieldAlert className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
          {data.outward_dispatch
            ? t('الرسائل الخارجية مفعّلة', 'Outward messages enabled')
            : t('الرسائل الخارجية معطّلة — تُعتمد وتُسجَّل دون إرسال', 'Outward messages off — approved acts are recorded, not sent')}
        </span>
        <DataSourceBadge source="api" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          [t('بانتظار قرار إنسان', 'Awaiting a person'), data.approvals.pending, 'text-gold-700 dark:text-gold-300'],
          [t('تجاوزت المهلة وصُعّدت', 'Overdue, escalated'), data.approvals.escalated, 'text-red-700 dark:text-red-300'],
          [t('اعتُمدت', 'Approved'), data.approvals.approved, 'text-sa-700 dark:text-sa-300'],
          [t('رُفضت', 'Rejected'), data.approvals.rejected, 'text-gray-700 dark:text-gray-300'],
        ].map(([label, n, cls]) => (
          <div key={String(label)} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
            <div className={`text-2xl font-bold ${cls}`}>{n as number}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{label as string}</div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-3xl">
        {t(
          'القاعدة: ما يمسّ الطالب من خارج المنصة (رسالة عند مستوى مرتفع أو حرج، تصعيد لرئيس القسم) يُجهّزه الوكيل ويبقى موقوفاً حتى يوافق مرشده؛ وإن لم يُبتّ خلال المهلة يُصعَّد للدور التالي ولا يُنفَّذ تلقائياً أبداً. ما هو إجراء أكاديمي لا رجعة فيه (حذف مقرر، إنذار رسمي، فصل، اعتماد تسجيل) لا يملك الكود مساراً له أصلاً.',
          'The rule: anything that reaches the student from outside the platform (a message at High/Critical, an escalation to the department head) is prepared by the agent and waits for the advisor; unanswered within the SLA it is escalated to the next role, never executed. Irreversible academic acts (dropping a course, formal warnings, dismissal, registration approval) have no code path at all.',
        )}
      </p>

      {grouped.map(({ mode, rows }) => {
        const m = modeMeta[mode];
        const Icon = m.icon;
        return (
          <div key={mode} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold ${m.cls}`}>
              <Icon className="w-4 h-4" />
              {t(m.ar, m.en)}
              <span className="ms-auto text-xs font-normal opacity-80">{rows.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-gray-500 dark:text-gray-400">
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-start px-4 py-2 font-medium">#</th>
                    <th className="text-start px-4 py-2 font-medium">{t('المهمة', 'Task')}</th>
                    <th className="text-start px-4 py-2 font-medium">{t('المستوى', 'Level')}</th>
                    <th className="text-start px-4 py-2 font-medium">{t('من يقرّر', 'Who decides')}</th>
                    <th className="text-start px-4 py-2 font-medium">{t('المهلة', 'SLA')}</th>
                    <th className="text-start px-4 py-2 font-medium">{t('أين يظهر', 'Where')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(r => (
                    <tr key={r.no} className="border-b border-gray-50 dark:border-gray-700/60 last:border-0">
                      <td className="px-4 py-2 font-mono text-gray-400">{r.no}</td>
                      <td className="px-4 py-2 text-gray-900 dark:text-white">{t(r.ar, r.en)}<div className="text-[11px] text-gray-400 font-mono" dir="ltr">{r.impl}</div></td>
                      <td className="px-4 py-2"><span className="rounded px-1.5 py-0.5 font-mono bg-gray-100 dark:bg-gray-700">{r.level}</span> <span className="text-gray-500">{data.levels[r.level] ? t(data.levels[r.level].ar, data.levels[r.level].en) : ''}</span></td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{r.actor}</td>
                      <td className="px-4 py-2 text-gray-500">{r.sla_hours ? t(`${r.sla_hours} ساعة`, `${r.sla_hours} h`) : '—'}</td>
                      <td className="px-4 py-2 font-mono text-gray-500" dir="ltr">{r.ui}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
