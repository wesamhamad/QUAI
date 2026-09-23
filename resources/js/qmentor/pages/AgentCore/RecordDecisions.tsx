import { useState } from 'react';
import { Award, BadgeCheck, BookOpen, CalendarClock, ChevronDown, GraduationCap, Hourglass, Target } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../../components/ui/Card';
import type { RecordDecisions as RecordDecisionsData, CertificateAssessment, ReadinessVerdict } from '../../hooks/useAgentCore';

/**
 * ما يقرّره من السجل الرقمي — for one student: where the skill gap is, and
 * for each certificate in their major's catalogue, whether it is early or
 * time — now, in two months, six, a year, or after graduation — with the
 * reasoning spelled out (coverage × stage in the plan × the student's own
 * pace of earning hours). Nothing here is generated text; it is the
 * readiness engine's arithmetic, shown.
 */
export default function RecordDecisions({ data, loading }: { data: RecordDecisionsData | null; loading: boolean }) {
  const { t } = useLanguage();

  if (loading) return <div className="h-72 rounded-2xl skeleton-shimmer" />;

  if (!data) {
    return (
      <Card className="text-sm text-gray-500 dark:text-gray-400">
        {t('لا يوجد طالب في النطاق — افتح الصفحة بحساب طالب، أو اختر طالباً من قائمتك الإرشادية (‎?student=‎).', 'No student in scope — open as a student, or choose one of your advisees (?student=).')}
      </Card>
    );
  }

  const a = data.assessment;
  if (!a) {
    return (
      <Card className="text-sm text-gray-500 dark:text-gray-400">
        {t('تعذّر قراءة السجل الرقمي لهذا الطالب الآن.', 'The digital record could not be read for this student right now.')}
      </Card>
    );
  }

  const lanes: Array<{ key: ReadinessVerdict; label: string; icon: typeof Award; tone: string }> = [
    { key: 'now', label: t('جاهز الآن', 'Ready now'), icon: BadgeCheck, tone: 'border-sa-400 bg-sa-50/60 dark:bg-sa-950/40' },
    { key: 'two_months', label: t('بعد شهرين', 'In 2 months'), icon: CalendarClock, tone: 'border-success-300 bg-success-50/50 dark:bg-success-500/5' },
    { key: 'six_months', label: t('بعد 6 أشهر', 'In 6 months'), icon: Hourglass, tone: 'border-info-300 bg-info-50/50 dark:bg-info-500/5' },
    { key: 'year', label: t('بعد سنة', 'In a year'), icon: Target, tone: 'border-gold-300 bg-gold-50/50 dark:bg-gold-500/5' },
    { key: 'later', label: t('لاحقاً — سنة فأكثر', 'Later — a year or more'), icon: Hourglass, tone: 'border-gray-300 bg-gray-50/70 dark:bg-gray-800/40' },
    { key: 'after_graduation', label: t('بعد التخرج', 'After graduation'), icon: GraduationCap, tone: 'border-gray-300 bg-gray-50 dark:bg-gray-800/60' },
  ];
  const laneOf = (v: ReadinessVerdict): ReadinessVerdict => v;
  const progressPct = Math.round((a.progress.ratio ?? 0) * 100);

  return (
    <div className="space-y-4">
      {/* ── the agent's sentence about this student ── */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -end-24 h-72 w-72 rounded-full bg-sa-500" />
        </div>
        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-1 font-semibold">
                <Award className="w-3.5 h-3.5" />{data.student_label}
              </span>
              {data.profile.major && <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-1">{data.profile.major}</span>}
              <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-1">{t(`عائلة الشهادات: ${a.family.label}`, `Certificate family: ${a.family.key}`)}</span>
              {data.source === 'demo' && <span className="rounded-full bg-gold-50 text-gold-800 dark:bg-gold-500/10 dark:text-gold-300 px-2.5 py-1 font-semibold">{t('سجل تجريبي', 'demo record')}</span>}
              {a.plan && (
                <a href={a.plan.url || undefined} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-300 px-2.5 py-1 font-semibold hover:underline">
                  <BookOpen className="w-3.5 h-3.5" />
                  {t(`خطة ${a.plan.name} · المستوى ${a.plan.level} من ${a.plan.levels} · ${a.plan.passed_count}/${a.plan.total_count} مقرراً`, `${a.plan.name} · level ${a.plan.level}/${a.plan.levels} · ${a.plan.passed_count}/${a.plan.total_count} courses`)}
                </a>
              )}
            </div>
            <p className="mt-3 text-base sm:text-lg font-extrabold text-gray-900 dark:text-white leading-snug">{a.headline}</p>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              {t(
                `قُرئت ${data.total_skills} مهارة/نشاطاً بمجموع ${data.accepted_hours} ساعة معتمدة؛ وتيرة الطالب ${a.pace.hours_per_month} س/شهر (${a.pace.basis === 'history' ? 'من سجل الفصول' : 'الحدّ الأدنى الافتراضي'})؛ التقدّم في الخطة ${progressPct}٪ (${a.progress.basis}).`,
                `${data.total_skills} skills/activities read, ${data.accepted_hours} accepted hours; pace ${a.pace.hours_per_month} h/month (${a.pace.basis}); plan progress ${progressPct}% (${a.progress.basis}).`,
              )}
            </p>
            {a.plan && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800/60 p-2">
                  <p className="font-bold text-gray-700 dark:text-gray-200">{t('يدرس هذا الفصل', 'This term')}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5" dir="ltr">{a.plan.current.length ? a.plan.current.map(c => c.code).join(' · ') : '—'}</p>
                </div>
                <div className="rounded-lg bg-gray-50 dark:bg-gray-800/60 p-2">
                  <p className="font-bold text-gray-700 dark:text-gray-200">{t(`المستوى ${a.plan.level + 1} القادم`, `Next level ${a.plan.level + 1}`)}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5" dir="ltr">{a.plan.next.length ? a.plan.next.map(c => c.code).join(' · ') : '—'}</p>
                </div>
                <div className={`rounded-lg p-2 ${a.plan.deferred.length ? 'bg-gold-50 dark:bg-gold-500/10' : 'bg-gray-50 dark:bg-gray-800/60'}`}>
                  <p className={`font-bold ${a.plan.deferred.length ? 'text-gold-800 dark:text-gold-300' : 'text-gray-700 dark:text-gray-200'}`}>{t('متطلبات مؤجَّلة', 'Deferred requirements')}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-0.5">{a.plan.deferred.length ? a.plan.deferred.map(c => `${c.code} ${c.name}`).join('، ') : t('لا شيء — على مسار الخطة', 'none — on plan')}</p>
                </div>
              </div>
            )}
          </div>
          {/* gaps */}
          <div className="rounded-xl border border-error-200/70 dark:border-error-500/30 bg-error-50/40 dark:bg-error-500/5 p-3">
            <p className="text-[11px] font-extrabold text-error-700 dark:text-error-400">{t('أين الخلل — أكثر المهارات طلباً وغياباً', 'Where the gap is — most demanded, missing')}</p>
            {a.gaps.length === 0 ? (
              <p className="mt-2 text-xs text-gray-500">{t('لا فجوة ظاهرة في مهارات هذه العائلة.', 'No visible gap for this family.')}</p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {a.gaps.slice(0, 5).map(g => (
                  <li key={g.skill_en} className="text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-gray-900 dark:text-white">{g.skill}</span>
                      <span className="text-[10px] text-gray-400">{t(`تحتاجها ${g.needed_by.length} شهادة`, `needed by ${g.needed_by.length}`)}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">{g.suggest}</p>
                  </li>
                ))}
              </ul>
            )}
            {a.strengths.length > 0 && (
              <p className="mt-2 pt-2 border-t border-error-200/50 dark:border-error-500/20 text-[11px] text-gray-500 dark:text-gray-400">
                <span className="font-semibold text-sa-700 dark:text-sa-300">{t('ما يملكه فعلاً: ', 'What they already have: ')}</span>
                {a.strengths.slice(0, 4).map(s => s.skill).join('، ')}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* ── the certificate timeline ── */}
      <div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
          {t('الشهادات مرتّبة على خطّ الزمن كما يقرّره الوكيل: ما تغطّيه مقرراتك المجتازة وأنشطتك × ما ستغطّيه مقررات خطتك القادمة ومتى × مرحلتك في الخطة × وتيرتك.', 'Certificates on the timeline as the agent decides: what passed courses and activities cover × what upcoming plan courses will cover and when × plan stage × pace.')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-3">
          {lanes.map(lane => {
            const items = a.certificates.filter(c => laneOf(c.verdict) === lane.key);
            const Icon = lane.icon;
            return (
              <div key={lane.key} className={`rounded-2xl border ${lane.tone} p-3 min-h-[140px] flex flex-col`}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-gray-700 dark:text-gray-200" />
                  <span className="text-xs font-extrabold text-gray-900 dark:text-white">{lane.label}</span>
                  <span className="ms-auto text-[10px] text-gray-400">{items.length}</span>
                </div>
                {items.length === 0 ? (
                  <p className="text-[11px] text-gray-400">—</p>
                ) : (
                  <div className="space-y-2">
                    {items.map(c => <CertCard key={c.code} c={c} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CertCard({ c }: { c: CertificateAssessment }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ring = Math.max(0, Math.min(100, c.coverage_pct));
  return (
    <button
      type="button"
      onClick={() => setOpen(v => !v)}
      className="w-full text-start rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2.5 hover:border-sa-400 transition-colors"
    >
      <div className="flex items-start gap-2">
        <span
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-gray-900 dark:text-white"
          style={{ background: `conic-gradient(var(--color-sa-500) ${ring * 3.6}deg, var(--color-gray-200) 0deg)` }}
          aria-label={`${ring}%`}
        >
          <span className="absolute inset-1 rounded-full bg-white dark:bg-gray-800" />
          <span className="relative qm-tabular">{ring}٪</span>
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-gray-900 dark:text-white leading-snug">{c.title}</p>
          <p className="text-[10px] text-gray-400">{c.provider} · {c.stage_label}</p>
          <p className="mt-0.5 text-[10px] font-semibold text-sa-700 dark:text-sa-300">{c.when_label}</p>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </div>
      {open && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/60 space-y-1.5">
          <p className="text-[11px] text-gray-600 dark:text-gray-300 leading-relaxed">{c.reason}</p>
          {c.missing.length > 0 && (
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-error-600 dark:text-error-400">{t('ينقصه: ', 'Missing: ')}</span>
              {c.missing.map((m, i) => (
                <span key={m.skill_en}>
                  {i > 0 && '، '}
                  {m.skill}
                  {m.next_course && <span className="text-sa-700 dark:text-sa-300"> ({t(`يغطّيه ${m.next_course.code} — ${m.next_course.when}`, `via ${m.next_course.code} — ${m.next_course.when}`)})</span>}
                </span>
              ))}
            </p>
          )}
          {c.matched.length > 0 && (
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-sa-700 dark:text-sa-300">{t('يغطّيه: ', 'Covered by: ')}</span>{c.matched.map(m => m.skill).join('، ')}
            </p>
          )}
          {c.link && (
            <a href={c.link} target="_blank" rel="noreferrer" className="inline-block text-[10px] font-semibold text-sa-700 dark:text-sa-300 hover:underline" onClick={e => e.stopPropagation()}>
              {t('صفحة الشهادة', 'Certificate page')}
            </a>
          )}
        </div>
      )}
    </button>
  );
}
