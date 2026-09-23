import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, BellAlertIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import AlertFeed from './components/AlertFeed';
import type { Alert, AlertStatus } from './types';
import { useRole } from '../../contexts/RoleContext';
import { useAdvisees, useRiskCaseload } from '../../hooks/useAdvisorData';
import { useTaughtStudents } from '../../hooks/useInstructorData';
import { useRiskAlerts, useMarkAlertRead, type RiskAlert } from '../../hooks/useAlerts';
import EmptyState from '../DigitalTwin/components/EmptyState';

const LEVEL_AR = ['منخفض', 'متوسط', 'مرتفع', 'حرج'];
const LEVEL_EN = ['Low', 'Medium', 'High', 'Critical'];

/**
 * التنبيهات — three readers, three scopes, all decided on the server:
 *   student / admin → the alerts the engine wrote for that student
 *                     (/risk/alerts; the admin reads the demo student's).
 *   advisor         → the high/critical verdicts on their own advisees.
 *   instructor      → the same, over the students of their sections.
 * No sample rows anywhere (mockAlertData removed 2026-09-16).
 */
export default function AlertsPage() {
  const { role } = useRole();
  if (role === 'advisor') return <CaseloadAlerts scope="advisees" />;
  if (role === 'instructor') return <CaseloadAlerts scope="taught" />;
  return <OwnAlerts />;
}

/** The engine's platform alerts for the signed-in student, newest first; a click marks one read. */
function OwnAlerts() {
  const { t, lang } = useLanguage();
  const alerts = useRiskAlerts();
  const markRead = useMarkAlertRead();
  const rows = alerts.data?.alerts ?? [];
  const unread = alerts.data?.unread ?? 0;

  const describe = (a: RiskAlert) => {
    const to = a.level_to != null ? (lang === 'ar' ? LEVEL_AR[a.level_to] : LEVEL_EN[a.level_to]) : null;
    const from = a.level_from != null ? (lang === 'ar' ? LEVEL_AR[a.level_from] : LEVEL_EN[a.level_from]) : null;
    if (a.kind === 'level_change' || (from && to)) {
      return t(`تغيّر مستوى الخطر${from ? ` من ${from}` : ''}${to ? ` إلى ${to}` : ''}`, `Risk level changed${from ? ` from ${from}` : ''}${to ? ` to ${to}` : ''}`);
    }
    return to ? t(`مستوى الخطر: ${to}`, `Risk level: ${to}`) : a.kind;
  };

  return (
    <div>
      <PageHeader
        accentColor="bg-sa-500"
        title={t('التنبيهات الذكية', 'Smart Alerts')}
        subtitle={alerts.source === 'api' ? t(`${rows.length} تنبيه · ${unread} غير مقروء`, `${rows.length} alerts · ${unread} unread`) : t('تنبيهات محرك المخاطر على سجلك', 'The risk engine’s alerts on your record')}
        breadcrumbs={[{ label: t('الرئيسية', 'Home'), href: '/' }, { label: t('التنبيهات', 'Alerts') }]}
        actions={<DataSourceBadge source={alerts.source === 'api' ? 'api' : 'mock'} />}
      />
      {alerts.isLoading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sa-500" /></div>
      ) : alerts.source !== 'api' ? (
        <EmptyState title={t('تعذّر جلب التنبيهات', 'Could not load alerts')} description={t('حاول لاحقاً.', 'Please try again later.')} icon="shield" />
      ) : rows.length === 0 ? (
        <EmptyState title={t('لا تنبيهات', 'No alerts')} description={t('يظهر هنا كل تنبيه يكتبه محرك المخاطر عند تغيّر مستواك.', 'Every alert the risk engine writes when your level changes appears here.')} icon="shield" />
      ) : (
        <div className="space-y-3">
          {rows.map(a => {
            const read = !!a.read_at;
            const tone = (a.level_to ?? 0) >= 3 ? 'border-s-error-500' : (a.level_to ?? 0) === 2 ? 'border-s-orange-500' : (a.level_to ?? 0) === 1 ? 'border-s-gold-500' : 'border-s-sa-500';
            return (
              <div key={a.id} className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 border-s-4 ${tone} p-4 ${read ? 'opacity-75' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <BellAlertIcon className="w-4 h-4 text-gray-400 shrink-0" />
                      <p className="font-semibold text-gray-900 dark:text-white">{describe(a)}</p>
                      {!read && <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-error-500 text-white">{t('جديد', 'New')}</span>}
                      {a.confidential && <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-500">{t('سرّي', 'Confidential')}</span>}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(a.created_at).toLocaleString(lang === 'ar' ? 'ar-SA' : 'en-GB')}
                      {a.score != null && <> · {t('الدرجة', 'Score')} {a.score}</>}
                    </p>
                    {a.top_factors && a.top_factors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {a.top_factors.slice(0, 4).map((f, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">{f.label}{f.evidence ? ` — ${f.evidence}` : ''}</span>
                        ))}
                      </div>
                    )}
                    <Link to="/student-dashboard" className="inline-block mt-2 text-xs text-sa-700 dark:text-sa-300 font-semibold hover:underline">{t('حالة المخاطر وخطة العمل', 'Risk status & action plan')}</Link>
                  </div>
                  {!read && (
                    <button
                      type="button"
                      onClick={() => markRead.mutate({ id: a.id })}
                      disabled={markRead.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-success-500 text-white hover:bg-success-600 transition-colors disabled:opacity-50 shrink-0"
                    >
                      <CheckCircleIcon className="w-4 h-4" />
                      {t('قرأته', 'Mark read')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * A faculty member's alerts: the risk engine's high/critical verdicts on the
 * students in their scope — advisees (/advisor/advisees) or the students of
 * their sections (/instructor/students) — joined to /risk/caseload. Nothing
 * from confidential counselling referrals: those are never part of the verdict.
 */
function CaseloadAlerts({ scope }: { scope: 'advisees' | 'taught' }) {
  const { t } = useLanguage();
  const advisees = useAdvisees(undefined, false);
  const taught = useTaughtStudents();
  const roster = scope === 'advisees' ? advisees : taught;
  const rows = useMemo(() => (roster.source === 'api' && Array.isArray(roster.data) ? roster.data : []), [roster.source, roster.data]);
  const ids = useMemo(() => rows.map(r => r.student_id), [rows]);
  const risk = useRiskCaseload(ids);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [statuses, setStatuses] = useState<Record<string, AlertStatus>>({});

  const alerts = useMemo<Alert[]>(() => {
    const st = risk.source === 'api' ? (risk.data?.students ?? {}) : {};
    const out: Alert[] = [];
    for (const r of rows) {
      const v = st[r.student_id];
      if (!v || v.level.level < 2) continue;
      const f = v.top_factors?.[0];
      const id = `RISK-${r.student_id}`;
      out.push({
        id,
        type: 'academic_warning',
        severity: v.level.level >= 3 ? 'critical' : 'urgent',
        status: statuses[id] ?? 'active',
        title: `${v.level.ar}: ${f?.label ?? 'مؤشرات الخطر'}`,
        titleEn: `${v.level.key} risk${f ? `: ${f.label}` : ''}`,
        description: f?.evidence ?? '',
        descriptionEn: f?.evidence ?? '',
        studentId: r.student_id,
        studentName: r.student_name ?? r.student_id,
        studentNameEn: r.student_name_en ?? r.student_name ?? r.student_id,
        timestamp: v.computed_at,
      });
    }
    return out.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'critical' ? -1 : 1));
  }, [rows, risk.source, risk.data, statuses]);

  const loading = roster.isLoading || risk.isLoading;
  const who = scope === 'advisees' ? t('لطلابك الإرشاديين', 'for your advisees') : t('لطلاب مقرراتك', 'for your course students');

  return (
    <div>
      <PageHeader
        accentColor="bg-sa-500"
        title={t('التنبيهات الذكية', 'Smart Alerts')}
        subtitle={`${alerts.length} ${t('تنبيه', 'alerts')} ${who}`}
        breadcrumbs={[{ label: t('الرئيسية', 'Home'), href: '/' }, { label: t('التنبيهات', 'Alerts') }]}
        actions={roster.source === 'api' ? <DataSourceBadge source="api" /> : undefined}
      />
      {loading ? (
        <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sa-500" /></div>
      ) : roster.source !== 'api' ? (
        <EmptyState title={scope === 'advisees' ? t('تعذّر جلب قائمة طلابك الإرشاديين', 'Could not load your advisees') : t('تعذّر جلب قائمة طلاب مقرراتك', 'Could not load your course students')} description={t('حاول لاحقاً.', 'Please try again later.')} icon="list" />
      ) : alerts.length === 0 ? (
        <EmptyState title={t('لا تنبيهات لطلابك', 'No alerts for your students')} description={t('يظهر هنا كل طالب في نطاقك يضعه محرك الخطر في مستوى مرتفع أو حرج.', 'Students in your scope the risk engine places at high or critical appear here.')} icon="shield" />
      ) : (
        <AlertFeed
          alerts={alerts}
          selectedAlerts={selected}
          onToggleSelect={id => setSelected(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; })}
          onStatusChange={(id, status) => setStatuses(prev => ({ ...prev, [id]: status }))}
          onViewEscalation={() => {}}
        />
      )}
    </div>
  );
}
