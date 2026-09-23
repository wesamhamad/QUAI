import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, ExternalLink, Pause, Play, Radio, Sparkles,
  BookOpenCheck, ScanSearch, Gavel, RefreshCcw,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRole } from '../../contexts/RoleContext';
import { canAccess } from '../../lib/rolePermissions';
import PageHeader from '../../components/shared/PageHeader';
import Card from '../../components/ui/Card';
import { StaggerContainer, StaggerItem } from '../../lib/motion';
import { useAgentCore, type AgentCore, type AgentSource, type AgentTrigger } from '../../hooks/useAgentCore';
import Orbit from './Orbit';
import AutonomyMatrix from '../../components/shared/AutonomyMatrix';
import QSparkDecisions from './QSparkDecisions';
import RecordDecisions from './RecordDecisions';
import { governance, outputs, sourceIcons } from './content';

// ─────────────────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────────────────

/** A number that ticks up to its value once it is known. */
function CountUp({ value, duration = 900 }: { value: number | null | undefined; duration?: number }) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    if (value === null || value === undefined) return;
    const start = performance.now();
    const base = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(base + (value - base) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  if (value === null || value === undefined) return <span>—</span>;
  return <span className="qm-tabular">{shown.toLocaleString('en-US')}</span>;
}

const severityTone: Record<string, string> = {
  critical: 'bg-error-50 text-error-700 border-error-200 dark:bg-error-500/10 dark:text-error-400 dark:border-error-500/30',
  high: 'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-500/10 dark:text-warning-400 dark:border-warning-500/30',
  medium: 'bg-info-50 text-info-700 border-info-200 dark:bg-info-500/10 dark:text-info-400 dark:border-info-500/30',
};

function thisTerm(trigger: AgentTrigger): number | null {
  return trigger.semesters?.[0] ?? null;
}

// ─────────────────────────────────────────────────────────────────────────
// page
// ─────────────────────────────────────────────────────────────────────────

export default function AgentCore() {
  const { t, lang } = useLanguage();
  const { role } = useRole();
  // ما يقرّره من QSpark can be read for one student. The id lives here rather
  // than inside the section because the whole payload is one request; the
  // hook keys on it, so switching student refetches and nothing else changes.
  const [qsparkStudent, setQsparkStudent] = useState<string | null>(null);
  const { data, source, isLoading, isFetching } = useAgentCore(qsparkStudent);

  const sources = data?.sources ?? [];
  const triggers = data?.triggers ?? [];
  const counts = data?.counts;
  const live = source === 'api' && !!data?.engine_ready;

  // ── selection + the self-running tour ──
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [touring, setTouring] = useState(true);
  useEffect(() => {
    if (!touring || sources.length === 0) return;
    const id = window.setInterval(() => {
      setSelectedId(current => {
        const idx = sources.findIndex(s => s.id === current);
        return sources[(idx + 1) % sources.length]?.id ?? null;
      });
    }, 3600);
    return () => window.clearInterval(id);
  }, [touring, sources]);

  const selected: AgentSource | null = useMemo(
    () => sources.find(s => s.id === selectedId) ?? null,
    [sources, selectedId],
  );
  const pick = (id: string) => {
    setTouring(false);
    setSelectedId(prev => (prev === id ? null : id));
  };

  const availableCount = sources.filter(s => s.available).length;
  const links = (window as unknown as { __qmentor_links?: { qspark?: string; digitalRecord?: string } }).__qmentor_links ?? {};
  const externalFor = (id: string): string | undefined =>
    id === 'qspark' ? links.qspark : id === 'digital_record' ? links.digitalRecord : undefined;

  const visibleOutputs = outputs
    .map(o => ({ ...o, to: canAccess(role, o.path) ? o.path : (o.studentPath && canAccess(role, o.studentPath) ? o.studentPath : null) }))
    .filter(o => o.to !== null);

  const hubLine = counts
    ? t(`${counts.raised.toLocaleString('en-US')} إشارة هذا الفصل`, `${counts.raised.toLocaleString('en-US')} signals this term`)
    : undefined;

  return (
    <div className="space-y-8 max-w-[1400px] mx-auto">
      <PageHeader
        title={t('المرشد الذكي', 'Smart Mentor')}
        subtitle={t(
          'وكيل ذكي واحد لا مجموعة أدوات: يقرأ من أنظمة المنظومة الأكاديمية، يرصد الإشارات، يقرّر، ثم يتابع حتى تنغلق الإشارة.',
          'One intelligent agent, not a toolbox: it reads the academic systems, detects signals, decides, then follows up until the signal closes.',
        )}
        accentColor="bg-sa-500"
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('المرشد الذكي', 'Smart Mentor') },
        ]}
        actions={
          <div className="hidden md:flex items-center gap-2">
            {data && (
              <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {data.scope === 'caseload' ? t('نطاق: طلابي', 'Scope: my advisees') : t('نطاق: الجامعة', 'Scope: university')}
                {' · '}
                {t(`الفصل ${data.semester}`, `Term ${data.semester}`)}
              </span>
            )}
            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${
              live
                ? 'bg-sa-50 border-sa-200 text-sa-700 dark:bg-sa-950 dark:border-sa-800 dark:text-sa-300'
                : 'bg-gold-50 border-gold-200 text-gold-800 dark:bg-gold-500/10 dark:border-gold-500/30 dark:text-gold-300'
            }`}>
              <span className="relative flex h-2 w-2">
                {live && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sa-400 opacity-75" />}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${live ? 'bg-sa-500' : 'bg-gold-400'}`} />
              </span>
              {live ? t('متصل بمحرّك الإرشاد', 'Connected to the advising engine') : t('البنية دون أرقام حيّة', 'Structure shown without live figures')}
            </span>
          </div>
        }
      />

      {!isLoading && !live && (
        <div className="rounded-xl border border-dashed border-gold-300 dark:border-gold-500/40 bg-gold-50/70 dark:bg-gold-500/10 px-4 py-3">
          <p className="text-sm text-gold-800 dark:text-gold-300">
            {source === 'unauthenticated'
              ? t('سجّل الدخول لعرض أرقام هذا الفصل من محرّك الإرشاد.', 'Sign in to see this term’s figures from the advising engine.')
              : t('تعذّر الوصول إلى محرّك الإرشاد الآن — تُعرض بنية الوكيل كما هي، والأرقام تظهر «—» بدل قيمة غير مؤكدة.', 'The advising engine could not be reached — the agent’s structure is shown as is, and figures read “—” rather than an unverified value.')}
          </p>
        </div>
      )}

      {/* ── 1. المدار: الوكيل وحلقته ── */}
      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6">
        <Card className="relative overflow-hidden" padding={false}>
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" aria-hidden="true">
            <div className="absolute -top-24 -start-24 h-72 w-72 rounded-full bg-sa-500" />
            <div className="absolute -bottom-20 -end-20 h-56 w-56 rounded-full bg-sa-500" />
          </div>
          <div className="relative p-5 sm:p-7">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  {t('وكيل واحد، وحلقة من الأنظمة', 'One agent, a ring of systems')}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t('كل نقطة على الحلقة نظام يقرأ منه المرشد. اضغط أيّاً منها لترى ما يقرأه وما يُشعله.', 'Each point on the ring is a system the mentor reads. Click one to see what it reads and what it triggers.')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTouring(v => !v)}
                className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-sa-400 hover:text-sa-700 dark:hover:text-sa-300 transition-colors"
              >
                {touring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {touring ? t('إيقاف الجولة', 'Pause tour') : t('جولة تلقائية', 'Auto tour')}
              </button>
            </div>
            {isLoading ? (
              <div className="aspect-square max-w-[560px] mx-auto rounded-full skeleton-shimmer opacity-40" />
            ) : (
              <Orbit sources={sources} selectedId={selectedId} onSelect={pick} hubLine={hubLine} />
            )}
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-gray-500 dark:text-gray-400">
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success-500" />{t('متصل', 'Connected')}</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-gold-400" />{t('بانتظار تفعيل التغذية', 'Awaiting its feed')}</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-1 w-5 rounded bg-sa-500/60" />{t('تدفّق البيانات نحو الوكيل', 'Data flowing to the agent')}</span>
            </div>
          </div>
        </Card>

        {/* the panel beside the orbit: what the chosen system gives the agent */}
        <Card className="flex flex-col" padding={false}>
          <div className="p-5 flex-1">
            {selected ? (
              <SourceDetail source={selected} triggers={triggers} external={externalFor(selected.id)} />
            ) : (
              <div className="h-full flex flex-col">
                <div className="inline-flex items-center gap-2 text-sa-700 dark:text-sa-400">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-label">{t('QSpark+', 'QSpark+')}</span>
                </div>
                <h3 className="mt-2 text-lg font-extrabold text-gray-900 dark:text-white">
                  {t('الوكيل الذكي للمنظومة الأكاديمية', 'The academic system’s intelligent agent')}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t(
                    `يقرأ من ${sources.length} أنظمة (${availableCount} متصلة الآن)، ويشغّل ${triggers.length} خطوة استباقية تفحص كل طالب على مدار الفصل، ثم يحوّل ما يرصده إلى تنبيه أو موعد أو خطة — ويتابعه حتى يزول سببه.`,
                    `It reads ${sources.length} systems (${availableCount} connected now), runs ${triggers.length} proactive steps that check every student through the term, and turns what it finds into an alert, an appointment or a plan — then follows it until the cause is gone.`,
                  )}
                </p>
                <dl className="mt-5 grid grid-cols-2 gap-3">
                  <Metric label={t('إشارات رُصدت', 'Signals raised')} value={counts?.raised} hint={t('هذا الفصل', 'this term')} />
                  <Metric label={t('طلاب ظهرت لهم إشارة', 'Students flagged')} value={counts?.signal_students} hint={t('هذا الفصل', 'this term')} />
                  <Metric label={t('مواعيد استباقية', 'Proactive appointments')} value={counts?.proactive} hint={t('حجزها الوكيل', 'booked by the agent')} />
                  <Metric label={t('وسيط الاستجابة', 'Median response')} value={counts?.response_median_hours != null ? Math.round(counts.response_median_hours) : null} hint={t('ساعة من الرصد إلى اللقاء', 'hours, detection to meeting')} />
                </dl>
                <p className="mt-auto pt-4 text-[11px] text-gray-400 dark:text-gray-500">
                  {t('الأرقام مجاميع فقط — لا يظهر هنا اسم طالب.', 'Aggregates only — no student is named here.')}
                </p>
              </div>
            )}
          </div>
        </Card>
      </section>

      {/* ── 2. الدورة: يقرأ → يرصد → يقرّر → يتابع ── */}
      <section>
        <h2 className="text-label text-gray-400 dark:text-gray-500 mb-3">{t('دورة القرار', 'The decision loop')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          <Stage
            n={1} icon={BookOpenCheck}
            title={t('يقرأ', 'Reads')}
            value={<><CountUp value={availableCount} /><span className="text-base font-semibold text-gray-400"> / {sources.length}</span></>}
            unit={t('نظاماً متصلاً', 'systems connected')}
            body={t('كل ليلة وعند كل فتح للصفحة: معدل، تسجيل، غياب، إنذار، خطة، مهارات.', 'Every night and on every open: GPA, registration, absence, warning, plan, skills.')}
          />
          <Stage
            n={2} icon={ScanSearch}
            title={t('يرصد', 'Detects')}
            value={<CountUp value={counts?.raised} />}
            unit={t(`إشارة على ${counts?.signal_students?.toLocaleString('en-US') ?? '—'} طالباً`, `signals on ${counts?.signal_students?.toLocaleString('en-US') ?? '—'} students`)}
            body={t(`${triggers.length} خطوة استباقية بعتبات معلنة — كل إشارة تحمل سببها.`, `${triggers.length} proactive steps with published thresholds — every signal carries its reason.`)}
          />
          <Stage
            n={3} icon={Gavel}
            title={t('يقرّر', 'Decides')}
            value={<CountUp value={counts?.proactive} />}
            unit={t(`موعداً استباقياً لـ ${counts?.matched_students?.toLocaleString('en-US') ?? '—'} طالباً`, `proactive appointments for ${counts?.matched_students?.toLocaleString('en-US') ?? '—'} students`)}
            body={t('يطابق الفراغات ويحجز، أو يبني خطة، أو يرفع تنبيهاً — والمرشد البشري يعتمد.', 'Matches slots and books, builds a plan, or raises an alert — the human advisor approves.')}
          />
          <Stage
            n={4} icon={RefreshCcw}
            title={t('يتابع', 'Follows up')}
            value={<CountUp value={counts?.held} />}
            unit={t(`لقاءً منعقداً · ${counts?.resolved?.toLocaleString('en-US') ?? '—'} إشارة أُغلقت`, `meetings held · ${counts?.resolved?.toLocaleString('en-US') ?? '—'} signals closed`)}
            body={t('الإشارة تُغلق حين يزول سببها — تسجيلٌ تمّ أو معدلٌ تعافى — لا حين يُعقد اللقاء.', 'A signal closes when its cause is gone — a registration made, a GPA recovered — not when the meeting happens.')}
            last
          />
        </div>
      </section>

      {/* ── 2b. ما يقرّره من QSpark ── */}
      <section>
        <h2 className="text-label text-gray-400 dark:text-gray-500 mb-1">{t('ما يقرّره من منصة التعلم QSpark', 'What it decides from QSpark')}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {t('يقرأ الأسئلة التي أخطأ فيها الطلاب أو تركوها بلا إجابة، فيعيد تصنيف صعوبة السؤال، ويزيد عدد الأسئلة حيث يضعف الفهم، ويمنح وقتاً أطول، ويرفع للأستاذ ما يحتاج إعادة صياغة — ويرصد الطالب المتعثّر قبل أن يظهر ذلك في درجاته.', 'It reads the questions students got wrong or left unanswered, reclassifies difficulty, adds questions where understanding is weak, grants more time, proposes rewording to faculty — and flags the struggling student before it shows in grades.')}
        </p>
        <QSparkDecisions
          summary={data?.qspark ?? null}
          loading={isLoading}
          refreshing={!!isFetching && !isLoading}
          selectedStudent={qsparkStudent}
          onSelectStudent={setQsparkStudent}
        />
      </section>

      {/* ── 2c. ما يقرّره من السجل الرقمي ── */}
      <section>
        <h2 className="text-label text-gray-400 dark:text-gray-500 mb-1">{t('ما يقرّره من السجل الرقمي', 'What it decides from the digital record')}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {t('يحدّد أين الخلل في مهارات الطالب، ويقرّر لكل شهادة في مجاله إن كان الوقت مبكراً عليها أم حان: الآن، أو بعد شهرين، أو ستة أشهر، أو سنة، أو بعد التخرج — بناءً على تغطيته للمهارات وموقعه في الخطة ووتيرته.', 'It locates the skill gap and decides, for each certificate in the student\u2019s field, whether it is early or time: now, in two months, six, a year, or after graduation — from coverage, plan stage and pace.')}
        </p>
        <RecordDecisions data={data?.digital_record ?? null} loading={isLoading} />
      </section>

      {/* ── حدود الاستقلالية (SRS §8 / §10) ── */}
      <section>
        <h2 className="text-label text-gray-400 dark:text-gray-500 mb-1">{t('حدود ما يقرّره وحده', 'Where its autonomy stops')}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {t('كل ما ينفّذه الوكيل مصنّف على خمسة مستويات. الأخضر ينفّذه وحده، والأزرق ينفّذه ويُبلغ، والذهبي يجهّزه ويطلب موافقة إنسان قبل التنفيذ، والأحمر لا يملك الكود مساراً له.', 'Everything the agent does sits on one of five levels. Green it does alone, blue it does and tells someone, gold it prepares and waits for a person, red has no code path.')}
        </p>
        <AutonomyMatrix />
      </section>

      {/* ── 3. كتالوج الإشارات ── */}
      <section>
        <div className="flex items-end justify-between gap-3 mb-3">
          <div>
            <h2 className="text-label text-gray-400 dark:text-gray-500">{t('ما يرصده — الخطوات الاستباقية', 'What it detects — the proactive steps')}</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {t(`${triggers.length} خطوة تفحص كل طالب. الرقم هو عدد الطلاب الذين ظهرت لهم الإشارة هذا الفصل؛ ما وُسم «تجريبي» صفوف مزروعة بنِسب أوراكل ريثما تُفعَّل تغذيته.`, `${triggers.length} steps check every student. The number is how many students the signal surfaced this term; rows marked demo are seeded at Oracle proportions until their feed is live.`)}
            </p>
          </div>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 rounded-xl skeleton-shimmer" />)}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {triggers.map(tr => (
              <StaggerItem key={tr.code}>
                <TriggerCard trigger={tr} highlighted={!!selected && selected.feeds.includes(tr.code)} term={data?.term} semesters={data?.semesters ?? []} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </section>

      {/* ── 4. ما يقرّره ── */}
      <section>
        <h2 className="text-label text-gray-400 dark:text-gray-500 mb-1">{t('ما يقرّره — وكل قرار صفحة تفتحها', 'What it decides — each one a page you can open')}</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          {t('لا يكتفي الوكيل بالرصد: كل إشارة تنتهي إلى فعل له مكان في المنصة.', 'The agent does not stop at detection: every signal ends in an action that has a place on the platform.')}
        </p>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {visibleOutputs.map(o => {
            const Icon = o.icon;
            return (
              <StaggerItem key={o.path}>
                <Link
                  to={o.to as string}
                  className="group relative block h-full rounded-2xl border-t-[3px] border-t-sa-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="inline-flex rounded-xl p-2 bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400">
                      <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-sa-500 transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{t(o.titleAr, o.titleEn)}</h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t(o.whenAr, o.whenEn)}</p>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>

      {/* ── 5. الحوكمة ── */}
      <section className="rounded-2xl bg-gradient-to-bl from-sa-600 via-sa-700 to-sa-900 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" aria-hidden="true">
          <div className="absolute -top-24 -start-24 h-72 w-72 rounded-full bg-white" />
          <div className="absolute -bottom-20 -end-20 h-56 w-56 rounded-full bg-white" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-sa-200" />
            <span className="text-label text-sa-200">{t('الضوابط', 'Guardrails')}</span>
          </div>
          <h2 className="text-xl font-extrabold">{t('وكيل يعمل على سكّة', 'An agent that runs on rails')}</h2>
          <p className="mt-1 text-sm text-sa-100/90 max-w-2xl">
            {t('القدرة على القرار لا تعني غياب الضابط — هذه أربعة لا يتجاوزها الوكيل.', 'The power to decide does not mean the absence of a guardrail — these four the agent never crosses.')}
          </p>
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {governance.map(g => {
              const Icon = g.icon;
              return (
                <div key={g.titleEn} className="rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 p-4">
                  <span className="inline-flex rounded-lg p-2 bg-white/15"><Icon className="w-4 h-4" strokeWidth={1.8} /></span>
                  <h3 className="mt-2.5 text-sm font-bold">{t(g.titleAr, g.titleEn)}</h3>
                  <p className="mt-1 text-xs text-sa-100/90 leading-relaxed">{t(g.bodyAr, g.bodyEn)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {lang === 'ar' && (
        <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center pb-2">
          هذه الصفحة تصف ما يفعله الوكيل فعلاً في هذه المنصة؛ الأرقام من محرّك الإرشاد الاستباقي، والخطوات من إعداداته المعلنة.
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// pieces
// ─────────────────────────────────────────────────────────────────────────

function Metric({ label, value, hint }: { label: string; value: number | null | undefined; hint?: string }) {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-3">
      <dt className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="mt-0.5 text-xl font-extrabold text-gray-900 dark:text-white"><CountUp value={value} /></dd>
      {hint && <dd className="text-[10px] text-gray-400 dark:text-gray-500">{hint}</dd>}
    </div>
  );
}

function Stage({ n, icon: Icon, title, value, unit, body, last = false }: {
  n: number;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  value: React.ReactNode;
  unit: string;
  body: string;
  last?: boolean;
}) {
  const { dir } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: n * 0.08, duration: 0.3 }}
      className="relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5"
    >
      {!last && (
        <span
          className={`hidden xl:flex absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? '-left-3' : '-right-3'} z-10 h-6 w-6 items-center justify-center rounded-full bg-sa-500 text-white text-xs shadow`}
          aria-hidden="true"
        >
          {dir === 'rtl' ? '←' : '→'}
        </span>
      )}
      <div className="flex items-center gap-2.5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-sa-50 dark:bg-sa-950 text-sa-700 dark:text-sa-400">
          <Icon className="w-4 h-4" strokeWidth={1.9} />
        </span>
        <span className="text-label text-gray-400 dark:text-gray-500">{n}</span>
        <h3 className="text-base font-extrabold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs font-semibold text-sa-700 dark:text-sa-400 mt-0.5">{unit}</p>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{body}</p>
    </motion.div>
  );
}

/** Steps that can only fire once classes are running — before the term they read «لم يبدأ الفصل بعد», not 0. */
const IN_TERM_ONLY = new Set(['T11']);

function TriggerCard({ trigger, highlighted, term, semesters }: { trigger: AgentTrigger; highlighted: boolean; term?: AgentCore['term']; semesters: AgentCore['semesters'] }) {
  const { t } = useLanguage();
  const count = thisTerm(trigger);
  const notStarted = term ? !term.started : false;
  const waitingForTerm = notStarted && IN_TERM_ONLY.has(trigger.code) && (count ?? 0) === 0;
  // The most recent completed term with a number — what «the last term» showed.
  const lastIdx = trigger.semesters.findIndex((v, i) => i > 0 && v !== null && v > 0);
  const last = lastIdx > 0 ? { n: trigger.semesters[lastIdx] as number, label: semesters[lastIdx]?.label ?? '' } : null;
  const startsOn = term?.starts_on ? new Date(term.starts_on).toLocaleDateString('ar-SA-u-nu-latn', { day: 'numeric', month: 'long' }) : null;
  return (
    <div className={`h-full rounded-xl border p-4 transition-all duration-200 ${
      highlighted
        ? 'border-sa-500 bg-sa-50/60 dark:bg-sa-950/40 shadow-md shadow-sa-500/10'
        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
    }`}>
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5">
          <span className="rounded-md bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide">{trigger.code}</span>
          <span className={`rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${severityTone[trigger.severity] ?? severityTone.medium}`}>{trigger.severity_label}</span>
        </span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500">{trigger.tier_label}</span>
      </div>
      <h3 className="mt-2 text-sm font-bold text-gray-900 dark:text-white leading-snug">{trigger.label}</h3>
      {trigger.detects && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{trigger.detects}</p>}
      <div className="mt-3 flex items-end justify-between">
        {waitingForTerm ? (
          <div>
            <p className="text-[11px] font-bold text-info-700 dark:text-info-400">{t('لم يبدأ الفصل بعد', 'Term not started yet')}{startsOn ? t(` — يبدأ ${startsOn}`, ` — starts ${startsOn}`) : ''}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">{t('الغياب يُرصد مع بدء المحاضرات', 'Absence is detected once classes begin')}{last ? t(` · ${last.label}: ${last.n.toLocaleString('en-US')} طالباً`, ` · ${last.label}: ${last.n.toLocaleString('en-US')} students`) : ''}</p>
          </div>
        ) : trigger.available ? (
          <p className="text-xl font-extrabold text-gray-900 dark:text-white leading-none">
            <CountUp value={count} />
            <span className="text-[11px] font-semibold text-gray-400 ms-1">{t('طالباً هذا الفصل', 'students this term')}</span>
            {(trigger.demo_students ?? 0) > 0 && (
              <span className="ms-2 rounded px-1.5 py-0.5 text-[9px] font-bold bg-gold-50 text-gold-800 dark:bg-gold-500/10 dark:text-gold-300 align-middle" title={t(`${trigger.demo_students} منها بيانات تجريبية موسومة`, `${trigger.demo_students} of them are tagged demo rows`)}>{t('يتضمّن تجريبي', 'incl. demo')}</span>
            )}
            {(count ?? 0) === 0 && last && (
              <span className="block mt-1 text-[10px] font-medium text-gray-400">{t(`${last.label}: ${last.n.toLocaleString('en-US')} طالباً`, `${last.label}: ${last.n.toLocaleString('en-US')} students`)}</span>
            )}
          </p>
        ) : (
          <span className="text-[11px] font-semibold text-gold-700 dark:text-gold-300">{trigger.unavailable_reason ?? t('معطّلة', 'Off')}</span>
        )}
        {trigger.window_days > 0 && (
          <span className="text-[10px] text-gray-400 dark:text-gray-500">{t(`كل ${trigger.window_days} يوماً`, `every ${trigger.window_days} days`)}</span>
        )}
      </div>
    </div>
  );
}

function SourceDetail({ source, triggers, external }: { source: AgentSource; triggers: AgentTrigger[]; external?: string }) {
  const { t, lang } = useLanguage();
  const Icon = sourceIcons[source.id] ?? Sparkles;
  const fed = triggers.filter(tr => source.feeds.includes(tr.code));
  const reads = lang === 'ar' ? source.reads : source.reads_en;
  return (
    <motion.div key={source.id} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }} className="h-full flex flex-col">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sa-500 text-white">
          <Icon className="w-5 h-5" strokeWidth={1.9} />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white leading-tight">{t(source.label, source.label_en)}</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5 font-mono" dir="ltr">{source.system}</p>
        </div>
      </div>
      <span className={`mt-3 inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        source.available
          ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400'
          : 'bg-gold-50 text-gold-800 dark:bg-gold-500/10 dark:text-gold-300'
      }`}>
        <span className={`h-1.5 w-1.5 rounded-full ${source.available ? 'bg-success-500' : 'bg-gold-400'}`} />
        {source.available ? t('متصل — يقرأ منه الوكيل الآن', 'Connected — the agent reads it now') : t('بانتظار تفعيل التغذية', 'Awaiting its feed')}
      </span>

      <h4 className="mt-4 text-label text-gray-400 dark:text-gray-500">{t('ما يقرأه منه', 'What it reads')}</h4>
      <ul className="mt-1.5 space-y-1">
        {reads.map(r => (
          <li key={r} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sa-500" />
            <span>{r}</span>
          </li>
        ))}
      </ul>

      {fed.length > 0 ? (
        <>
          <h4 className="mt-4 text-label text-gray-400 dark:text-gray-500">{t('ما يُشعله من خطوات', 'Steps it triggers')}</h4>
          <ul className="mt-1.5 space-y-1.5">
            {fed.map(tr => (
              <li key={tr.code} className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 px-2.5 py-1.5">
                <span className="flex items-center gap-1.5 min-w-0">
                  <span className="rounded bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-1 py-0.5 text-[10px] font-extrabold">{tr.code}</span>
                  <span className="text-xs text-gray-700 dark:text-gray-200 truncate">{tr.label}</span>
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white shrink-0">
                  {tr.available ? (thisTerm(tr)?.toLocaleString('en-US') ?? '—') : t('معطّلة', 'off')}
                </span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        source.informs && (
          <>
            <h4 className="mt-4 text-label text-gray-400 dark:text-gray-500">{t('ما يُثريه', 'What it informs')}</h4>
            <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-200">{t(source.informs, source.informs_en ?? source.informs)}</p>
          </>
        )
      )}

      {external && (
        <a
          href={external}
          className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-sa-700 dark:text-sa-400 hover:underline"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          {t('افتح النظام', 'Open the system')}
        </a>
      )}
    </motion.div>
  );
}
