import { useState } from 'react';
import { Users, Activity, Gauge, AlertTriangle, Clock, Radio, Download, ShieldCheck, ClipboardList, HeartHandshake, BellRing } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import Card from '../../components/ui/Card';
import { useAdminUsage } from '../../hooks/useAdvisorData';

const n = (v: unknown) => Number(v ?? 0);
const fmt = (v: unknown) => n(v).toLocaleString('en');
const ms = (v: unknown) => (v == null ? '—' : n(v) >= 1000 ? `${(n(v) / 1000).toFixed(1)} ث` : `${Math.round(n(v))} م.ث`);
const PERIODS: { value: string | number; ar: string }[] = [
  { value: 7, ar: 'آخر 7 أيام' }, { value: 30, ar: 'آخر 30 يوماً' }, { value: 90, ar: 'آخر 90 يوماً' }, { value: 'all', ar: 'منذ الإطلاق' },
  { value: '461', ar: 'الفصل 461' }, { value: '462', ar: 'الفصل 462' }, { value: '465', ar: 'الصيفي 465' }, { value: '471', ar: 'الفصل 471' }, { value: '472', ar: 'الفصل 472' }, { value: '475', ar: 'الصيفي 475' }, { value: '481', ar: 'الفصل 481' },
];

/**
 * لوحة النظام — the admin's view of the platform itself: environment and
 * scope, accounts, who is on it, use per component and per college, what
 * came out (levels, interventions, approved plans, referrals, closed
 * signals), response time of the platform's own APIs, and a dated CSV.
 * Every figure is an aggregate over the platform's own tables.
 */
export default function SystemUsage() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<string | number>(30);
  const { data, source, isLoading } = useAdminUsage(period);
  const live = source === 'api' && !!data;
  const typeLabel: Record<string, string> = { student: 'طلاب', instructor: 'أعضاء هيئة تدريس / مرشدون', employee: 'موظفون', other: 'أخرى' };

  const kpis = live ? [
    { icon: Users, label: t('الحسابات', 'Accounts'), value: fmt(data.users.total), hint: `${fmt(data.users.students)} طالب · ${fmt(data.users.instructors)} عضو هيئة تدريس/مرشد · ${fmt(data.users.staff)} موظف` },
    { icon: Radio, label: t('متصلون الآن', 'Online now'), value: fmt(data.sessions.live_now), hint: t('جلسات نشطة خلال ١٥ دقيقة', 'active in the last 15 min') },
    { icon: Activity, label: t('مستخدمون مميّزون', 'Distinct users'), value: fmt(data.totals.users), hint: `${fmt(data.totals.users_today)} اليوم · ${fmt(data.org.active_students)} طالباً نشطاً${n(data.totals.anonymous) ? ` · ${fmt(data.totals.anonymous)} طلباً بلا جلسة` : ''}` },
    { icon: Clock, label: t('متوسط الجلسة', 'Avg session'), value: data.sessions.avg_minutes == null ? '—' : `${data.sessions.avg_minutes} د`, hint: `${fmt(data.sessions.sessions)} جلسة · ${data.sessions.avg_requests ?? '—'} طلباً للجلسة` },
    { icon: Gauge, label: t('استجابة واجهات +QSpark', 'Platform response'), value: ms(data.platform.avg_ms), hint: `p95 ${ms(data.platform.p95_ms)} · ${fmt(data.platform.requests)} طلباً · كل الخدمات ${ms(data.totals.avg_ms)}` },
    { icon: AlertTriangle, label: t('أخطاء الخادم', 'Server errors'), value: data.totals.requests ? `${((n(data.totals.errors) / n(data.totals.requests)) * 100).toFixed(2)}%` : '—', hint: `${fmt(data.totals.errors)} خطأ · ${fmt(data.totals.rejected)} مرفوض (4xx)` },
  ] : [];

  const daily = live ? data.daily : [];
  const dMax = Math.max(1, ...daily.map(d => n(d.requests)));
  const hourly: number[] = live ? Array.from({ length: 24 }, (_, h) => (Array.isArray(data.hourly) ? n(data.hourly[h]) : n((data.hourly as Record<string, number>)[String(h)]))) : [];
  const hMax = Math.max(1, ...hourly);
  const fMax = live ? Math.max(1, ...data.features.map(f => n(f.requests))) : 1;
  const o = live ? data.outcomes : null;
  const outcomeCards = o ? [
    { icon: ShieldCheck, ar: 'حالات صُنِّفت', value: fmt(o.scored), hint: `منخفض ${fmt(o.levels.L0)} · متوسط ${fmt(o.levels.L1)} · مرتفع ${fmt(o.levels.L2)} · حرج ${fmt(o.levels.L3)}` },
    { icon: ClipboardList, ar: 'تدخلات أُنشئت', value: fmt(o.interventions), hint: `${fmt(o.agent_actions)} إجراء آلي للوكيل في الفترة` },
    { icon: ShieldCheck, ar: 'خطط اعتمدها مرشد', value: fmt(o.approved_plans), hint: `${fmt(o.pending_approvals)} بانتظار القرار` },
    { icon: HeartHandshake, ar: 'إحالات إرشاد نفسي', value: fmt(o.counseling_referrals), hint: 'سرّية · موجّهة للمركز' },
    { icon: Activity, ar: 'إشارات أُغلقت بنتيجة مقيسة', value: fmt(o.closed_measured), hint: `${fmt(o.closed_resolved)} زالت الإشارة بعد التدخل` },
    { icon: BellRing, ar: 'تنبيهات', value: fmt(o.alerts), hint: Object.entries(o.alerts_by_channel).map(([k, v]) => `${k} ${fmt(v)}`).join(' · ') || '—' },
  ] : [];

  return (
    <div>
      <PageHeader
        title={t('لوحة النظام', 'System Dashboard')}
        subtitle={live ? undefined : isLoading ? t('يُحمَّل…', 'Loading…') : t('للمسؤول فقط', 'Super admin only')}
        breadcrumbs={[{ label: t('الرئيسية', 'Home'), href: '/' }, { label: t('لوحة النظام', 'System') }]}
        actions={(
          <div className="flex items-center gap-2 flex-wrap">
            <select value={String(period)} onChange={e => setPeriod(/^\d+$/.test(e.target.value) && Number(e.target.value) < 100 ? Number(e.target.value) : e.target.value)} className="text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1.5 text-gray-900 dark:text-white">
              {PERIODS.map(p => <option key={String(p.value)} value={String(p.value)}>{p.ar}</option>)}
            </select>
            {live && (
              <a href={`/api/qmentor/admin/usage.csv?${typeof period === 'number' ? `days=${period}` : `period=${period}`}`} className="inline-flex items-center gap-1 text-xs rounded-lg border border-sa-300 text-sa-700 dark:text-sa-300 px-2 py-1.5 font-semibold hover:bg-sa-50 dark:hover:bg-sa-950">
                <Download className="w-3.5 h-3.5" /> {t('تصدير CSV مؤرَّخ', 'Dated CSV')}
              </a>
            )}
            <DataSourceBadge source={live ? 'api' : 'mock'} syncedAt={live ? data.header.last_sync : null} />
          </div>
        )}
        accentColor="bg-sa-500"
      />

      {!live && !isLoading && <Card><p className="text-sm text-gray-500">{t('هذه اللوحة للمسؤول الأعلى فقط، أو لم تُسجَّل طلبات بعد.', 'Super admin only, or nothing logged yet.')}</p></Card>}

      {live && (
        <div className="space-y-6">
          <div className="text-xs text-gray-500 dark:text-gray-400 -mt-4">
            {t(`الفترة: ${data.window.label} (${data.window.from.slice(0, 10)} → ${data.window.to.slice(0, 10)}) · آخر مزامنة بيانات ${data.header.last_sync ? String(data.header.last_sync).slice(0, 16) : '—'} · نموذج المخاطر ${data.header.model_version} · حُسبت ${new Date(data.generated_at).toLocaleString('en-GB')}`, `Period ${data.window.label}`)}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {kpis.map(k => (
              <Card key={k.label}>
                <div className="flex items-center justify-between mb-2"><span className="text-xs font-bold text-sa-700 dark:text-sa-300">{k.label}</span><k.icon className="w-4 h-4 text-sa-500" /></div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white tabular-nums">{k.value}</div>
                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{k.hint}</div>
              </Card>
            ))}
          </div>

          <Card>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{t('مخرجات الفترة', 'Outcomes in the period')}</h3>
            <p className="text-[11px] text-gray-400 mb-3">{t('ما أنتجته المنصة، لا ما استقبلته: التصنيف بالمستوى القائم، والتدخلات والاعتمادات والإحالات والإغلاقات ضمن الفترة', 'what the platform produced, not what it received')}</p>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {outcomeCards.map(c => (
                <div key={c.ar} className="rounded-xl bg-gray-50 dark:bg-gray-700/30 p-3">
                  <div className="flex items-center justify-between"><span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">{c.ar}</span><c.icon className="w-3.5 h-3.5 text-sa-500" /></div>
                  <div className="text-xl font-extrabold text-gray-900 dark:text-white tabular-nums mt-1">{c.value}</div>
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">{c.hint}</div>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{t('نطاق كل مكوّن', 'Scope per component')}</h3>
              <p className="text-[11px] text-gray-400 mb-3">{t('الطلبات والمستخدمون المميّزون وكليات مستخدميه (عبر حسابات الطلاب)', 'requests, distinct users and their colleges')}</p>
              <table className="w-full text-xs">
                <thead><tr className="text-gray-400 text-right"><th className="py-1.5">المكوّن</th><th className="py-1.5">الطلبات</th><th className="py-1.5">مستخدمون</th><th className="py-1.5">كليات</th><th className="py-1.5">متوسط الرد</th><th className="py-1.5">أخطاء</th></tr></thead>
                <tbody>
                  {data.components.map(c => (
                    <tr key={c.key} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="py-1.5 font-semibold text-gray-800 dark:text-gray-100">{c.ar}</td>
                      <td className="py-1.5 tabular-nums">{fmt(c.requests)}</td><td className="py-1.5 tabular-nums">{fmt(c.users)}</td><td className="py-1.5 tabular-nums">{fmt(c.faculties)}</td>
                      <td className="py-1.5 tabular-nums">{ms(c.avg_ms)}</td><td className={`py-1.5 tabular-nums ${c.errors ? 'text-error-500 font-semibold' : ''}`}>{fmt(c.errors)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 space-y-1">
                {data.by_type.map(b => (
                  <div key={b.user_type} className="flex justify-between text-xs"><span className="text-gray-600 dark:text-gray-300">{typeLabel[b.user_type] ?? b.user_type}</span><span className="tabular-nums text-gray-900 dark:text-white font-semibold">{fmt(b.requests)} طلب · {fmt(b.users)} مستخدم</span></div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{t('الكليات', 'Colleges')}</h3>
              <p className="text-[11px] text-gray-400 mb-3">{t('طلاب الحشد وحساباتهم ومن استخدم المنصة منهم في الفترة', 'cohort students, accounts, and who used the platform in the period')}</p>
              <table className="w-full text-xs">
                <thead><tr className="text-gray-400 text-right"><th className="py-1.5">الكلية</th><th className="py-1.5">طلاب</th><th className="py-1.5">حسابات</th><th className="py-1.5">نشطون</th><th className="py-1.5">أقسام</th><th className="py-1.5">تخصصات</th></tr></thead>
                <tbody>
                  {data.org.faculties.map(f => (
                    <tr key={f.faculty_no} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="py-1.5 font-semibold text-gray-800 dark:text-gray-100">{f.faculty_name ?? f.faculty_no}</td>
                      <td className="py-1.5 tabular-nums">{fmt(f.students)}</td><td className="py-1.5 tabular-nums">{fmt(f.accounts)}</td><td className="py-1.5 tabular-nums">{fmt(f.active)}</td><td className="py-1.5 tabular-nums">{fmt(f.departments)}</td><td className="py-1.5 tabular-nums">{fmt(f.majors)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <details className="mt-3">
                <summary className="text-xs font-semibold text-sa-700 dark:text-sa-300 cursor-pointer">{t('الأقسام والتخصصات', 'Departments and majors')}</summary>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-[11px]">
                  <div>
                    {data.org.departments.map(d => (
                      <div key={`${d.faculty_no}-${d.dept_no}`} className="flex justify-between border-t border-gray-100 dark:border-gray-700 py-1"><span className="text-gray-700 dark:text-gray-200">{d.faculty_name} · {d.dept_name ?? `قسم ${d.dept_no ?? '—'}`}</span><span className="tabular-nums text-gray-500">{fmt(d.students)} · نشط {fmt(d.active)} · {fmt(d.majors)} تخصص</span></div>
                    ))}
                  </div>
                  <div>
                    {data.org.majors.map(m => (
                      <div key={`${m.faculty_no}-${m.major_no}`} className="flex justify-between border-t border-gray-100 dark:border-gray-700 py-1"><span className="text-gray-700 dark:text-gray-200">{m.major_name ?? m.major_no}</span><span className="tabular-nums text-gray-500">{fmt(m.students)}</span></div>
                    ))}
                  </div>
                </div>
              </details>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{t('الطلبات والمستخدمون يومياً', 'Requests and users per day')}</h3>
              <p className="text-[11px] text-gray-400 mb-3">{t('العمود: الطلبات · الرقم: المستخدمون المميّزون', 'bar: requests · number: distinct users')}</p>
              <div className="flex items-end gap-[2px] h-40 overflow-hidden">
                {daily.map(d => (
                  <div key={d.d} className="flex-1 min-w-0 flex flex-col items-center justify-end h-full" title={`${d.d}: ${fmt(d.requests)} طلب · ${fmt(d.users)} مستخدم · ${ms(d.avg_ms)}`}>
                    {daily.length <= 45 && <span className="text-[9px] text-gray-400 tabular-nums">{n(d.users) || ''}</span>}
                    <div className="w-full rounded-t bg-sa-500/80 hover:bg-sa-600" style={{ height: `${Math.max(2, (n(d.requests) / dMax) * 100)}%` }} />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>{daily[0]?.d}</span><span>{daily[daily.length - 1]?.d}</span></div>
            </Card>
            <Card>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{t('ساعات الاستخدام', 'Hours of use')}</h3>
              <p className="text-[11px] text-gray-400 mb-3">{t('توقيت الرياض', 'Riyadh time')}</p>
              <div className="flex items-end gap-[2px] h-28">
                {hourly.map((v, h) => <div key={h} className="flex-1 rounded-t bg-sa-400/80" style={{ height: `${Math.max(2, (v / hMax) * 100)}%` }} title={`${h}:00 — ${fmt(v)}`} />)}
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>0</span><span>6</span><span>12</span><span>18</span><span>23</span></div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">{t('استخدام كل خدمة', 'Use per feature')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="text-gray-400 text-right"><th className="py-1.5 font-semibold">الخدمة</th><th className="py-1.5 font-semibold">الطلبات</th><th className="py-1.5 font-semibold w-1/3"></th><th className="py-1.5 font-semibold">مستخدمون</th><th className="py-1.5 font-semibold">متوسط الرد</th><th className="py-1.5 font-semibold">أخطاء</th><th className="py-1.5 font-semibold">آخر استخدام</th></tr></thead>
                  <tbody>
                    {data.features.map(f => (
                      <tr key={f.feature} className="border-t border-gray-100 dark:border-gray-700">
                        <td className="py-1.5 font-semibold text-gray-800 dark:text-gray-100">{f.feature}</td>
                        <td className="py-1.5 tabular-nums">{fmt(f.requests)}</td>
                        <td className="py-1.5"><div className="h-2 rounded bg-sa-500" style={{ width: `${(n(f.requests) / fMax) * 100}%` }} /></td>
                        <td className="py-1.5 tabular-nums">{n(f.users) ? fmt(f.users) : '—'}</td>
                        <td className="py-1.5 tabular-nums">{ms(f.avg_ms)}</td>
                        <td className={`py-1.5 tabular-nums ${n(f.errors) > 0 ? 'text-error-500 font-semibold' : ''}`}>{fmt(f.errors)}</td>
                        <td className="py-1.5 text-gray-400 tabular-nums" dir="ltr">{String(f.last_at).slice(0, 16)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
            <Card>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{t('أبطأ نقاط +QSpark', 'Slowest QSpark+ endpoints')}</h3>
              <p className="text-[11px] text-gray-400 mb-3">{t('واجهات المنصة فقط، متوسط زمن الرد', 'platform APIs only, average response')}</p>
              <div className="space-y-2">
                {data.slowest.map(s => (
                  <div key={s.path} className="text-xs">
                    <div className="flex justify-between gap-2"><span className="truncate text-gray-700 dark:text-gray-200" dir="ltr">{s.path}</span><span className="tabular-nums font-semibold text-gray-900 dark:text-white whitespace-nowrap">{ms(s.avg_ms)}</span></div>
                    <div className="text-[10px] text-gray-400">{fmt(s.n)} طلب · الأقصى {ms(s.max_ms)}</div>
                  </div>
                ))}
                {data.slowest.length === 0 && <p className="text-xs text-gray-400">{t('لا نقاط بخمسة طلبات فأكثر.', 'No endpoint with 5+ requests.')}</p>}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
