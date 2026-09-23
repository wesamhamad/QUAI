import React, { useMemo } from 'react';
import { BookOpen, Target, SlidersHorizontal, AlertTriangle, ExternalLink } from 'lucide-react';
import { useAgentCore } from '../../../hooks/useAgentCore';
import type { QSparkSummary, QSparkSetting, QSparkWeakQuestion } from '../../../hooks/useAgentCore';
import QSparkDecisions from '../../AgentCore/QSparkDecisions';
import { DifficultyChip } from '../../AgentCore/QSparkDecisions';

/**
 * منصة التعلم والتجربة الأكاديمية, inside the twin and narrowed to one student.
 *
 * The same read the المرشد الذكي page uses (/api/qmentor/agent-core), scoped
 * with `?qspark_student=` so every figure is this student's own play. The
 * roster picker is deliberately not passed: the twin already chose the
 * student, and a second picker here would let an advisor step outside them.
 *
 * On top of the platform board it draws the link the reader asks for: the
 * agent does not rewrite quiz settings per course, it rewrites them per
 * learning objective — the piece of course material (attachment) the quiz was
 * generated from. Grouping the missed questions and the rewritten settings by
 * that key is exactly the agent's own unit of decision, so the section shows,
 * per objective: how the student performs on it, which questions fail under
 * it, and what the agent changed because of them.
 */
export default function LearningPlatform({
  studentId,
  studentName,
  fallbackSummary,
}: {
  /** Omitted in the student view: the API then scopes to the viewer's own play. */
  studentId?: string;
  studentName?: string;
  /** A fixture board for a fixture student — see data/mockLearningPlatform.ts.
   *  Used only when the API has nothing for them; a live student never gets one. */
  fallbackSummary?: QSparkSummary | null;
}) {
  const { data, isLoading, isFetching } = useAgentCore(studentId ?? null);
  const apiSummary = data?.qspark ?? null;
  // The API answers for فيصل alone. For a fixture student it comes back empty
  // (or not at all), and the fixture board stands in — never the platform-wide
  // numbers, and never another student's.
  const summary = !isLoading && fallbackSummary && (!apiSummary || apiSummary.scope_empty)
    ? fallbackSummary
    : apiSummary;
  const objectives = useMemo(() => groupByObjective(summary), [summary]);

  return (
    <div className="space-y-4">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-bl from-sa-700 via-sa-800 to-emerald-900 p-6 text-white relative overflow-hidden print:hidden">
        <div className="absolute -top-12 -end-12 w-56 h-56 rounded-full bg-white/5" />
        <div className="relative flex items-start gap-4">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-sa-200">منصة التعلم والتجربة الأكاديمية</p>
            <h2 className="text-xl sm:text-2xl font-extrabold mt-0.5">
              ما قرأه الوكيل من تجربة {firstName(studentName)} — وما غيّره بسببه
            </h2>
            <p className="text-sm text-sa-100/90 mt-1 leading-relaxed">
              الأسئلة التي يتعثّر فيها الطالب، وإعدادات الاختبار التي أعاد الوكيل كتابتها، وربط كلٍّ منها
              بالهدف التعليمي (مادة المقرر) الذي وُلِّد منه السؤال.
            </p>
          </div>
        </div>
      </div>

      {/* A student with no rows gets told so — never another population's board. */}
      {!isLoading && summary?.scope_empty && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {summary.scope_denied
              ? 'لا صلاحية لعرض لوحة هذا الطالب على منصة التعلم.'
              : `لم يلعب ${firstName(studentName)} أي اختبار على منصة التعلم خلال النافذة الحالية.`}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {summary.scope_denied
              ? 'تُعرض هذه اللوحة لطلاب قائمتك الإرشادية فقط — ولا تُستبدل بأرقام المنصة العامة.'
              : 'لا يوجد بنك أسئلة منشور في تخصصه بعد، ولا تُعرض هنا أرقام طلاب آخرين — يمتلئ هذا التبويب أول ما يُنشر محتوى مقرراته ويلعب عليه.'}
          </p>
        </div>
      )}

      {/* No answer at all (the agent-core read failed or returned nothing): say so, never a fixture. */}
      {!isLoading && !summary && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">لا بيانات من منصة التعلم لهذا الطالب.</p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">لم تُجب منصة التعلم عن هذا الطالب بعد؛ ولا تُعرض هنا أرقام توضيحية.</p>
        </div>
      )}

      {summary && !summary.scope_empty && (
        <>
          {/* Objectives ⟷ decisions */}
          <ObjectiveLinkage objectives={objectives} loading={isLoading} />

          {/* The platform board itself — weak questions, rewritten settings, decision log */}
          <QSparkDecisions summary={summary} loading={isLoading} refreshing={!isLoading && !!isFetching} />
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────

/** «تجربة فيصل», not «تجربة فيصل خالد محمد» — the headline reads as a sentence. */
function firstName(name?: string): string {
  const first = (name ?? '').trim().split(/\s+/)[0];
  return first || 'الطالب';
}

interface Objective {
  key: string;
  courseCode: string;
  /** Human label for the material, or null when the key is an opaque id. */
  title: string | null;
  questions: QSparkWeakQuestion[];
  setting: QSparkSetting | null;
}

function groupByObjective(summary: QSparkSummary | null): Objective[] {
  if (!summary) return [];

  const byKey = new Map<string, Objective>();
  const keyOf = (course: string | null | undefined, attachment: string | null | undefined) =>
    `${course ?? '—'}|${attachment ?? ''}`;

  for (const q of summary.weak_questions) {
    const key = keyOf(q.course_code, q.attachment_key);
    if (!byKey.has(key)) {
      byKey.set(key, {
        key,
        courseCode: q.course_code ?? '—',
        title: objectiveTitle(q.attachment_key),
        questions: [],
        setting: null,
      });
    }
    byKey.get(key)!.questions.push(q);
  }

  // A setting the agent rewrote is itself keyed by course+attachment, so it
  // lands on its own objective — and creates the row when the objective has no
  // weak question left (the change already worked).
  for (const s of summary.settings) {
    const key = keyOf(s.course_code, s.attachment_key);
    if (!byKey.has(key)) {
      byKey.set(key, {
        key,
        courseCode: s.course_code,
        title: objectiveTitle(s.attachment_key),
        questions: [],
        setting: s,
      });
    } else {
      byKey.get(key)!.setting = s;
    }
  }

  return [...byKey.values()].sort((a, b) => b.questions.length - a.questions.length);
}

/**
 * The attachment key is the material the quiz was generated from. Some keys
 * are readable (`ACCT201_chapter_3_receivables.pdf`, `unit3_generated`) and
 * become the objective's title; others are opaque SIS composites
 * (`1_2_472_25_7281__5016148_1`), which carry no meaning for a reader — those
 * return null and the row shows the course code alone rather than a row of
 * digits pretending to be a title.
 */
function objectiveTitle(attachmentKey: string | null | undefined): string | null {
  if (!attachmentKey) return 'أسئلة المقرر العامة';
  const cleaned = attachmentKey
    .replace(/\.[a-z0-9]{2,5}$/i, '')
    .replace(/^[A-Z]{2,4}\s?\d{3,4}[_-]?/i, '')
    .replace(/[{}]/g, '')
    .replace(/[_-]+/g, ' ')
    .trim();

  // No letters left — it was an id, not a name.
  return /[a-z\u0600-\u06FF]/i.test(cleaned) ? cleaned : null;
}

function ObjectiveLinkage({ objectives, loading }: { objectives: Objective[]; loading: boolean }) {
  if (loading) return <div className="h-48 rounded-2xl skeleton-shimmer" />;

  return (
    <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
      <header className="flex items-start gap-3 mb-4">
        <span className="shrink-0 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sa-600 text-white">
          <Target className="w-4.5 h-4.5" />
        </span>
        <div>
          <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">كيف ربط الوكيل قراراته بالأهداف التعليمية</h3>
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
            كل هدف تعليمي هو مادة المقرر التي وُلِّدت منها الأسئلة. تحت كل هدف: الأسئلة المتعثّرة فيه، والإعداد
            الذي أعاد الوكيل كتابته لهذا الهدف بالذات — لا للمقرر كله.
          </p>
        </div>
      </header>

      {objectives.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          لا توجد محاولات مسجّلة لهذا الطالب على منصة التعلم بعد — يمتلئ هذا القسم مع أول اختبار يلعبه.
        </p>
      ) : (
        <ul className="space-y-3">
          {objectives.map(o => (
            <li key={o.key} className="rounded-xl border border-gray-100 dark:border-gray-700/60 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-sa-50 dark:bg-sa-950 px-2 py-0.5 text-[11px] font-bold font-mono text-sa-700 dark:text-sa-300" dir="ltr">
                  {o.courseCode}
                </span>
                {o.title && <span className="text-sm font-bold text-gray-900 dark:text-white">{o.title}</span>}
                <span className="text-[11px] text-gray-400">
                  {o.questions.length > 0 ? `${o.questions.length} سؤالاً متعثّراً` : 'لا أسئلة متعثّرة الآن'}
                </span>
              </div>

              {o.questions.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {o.questions.slice(0, 5).map(q => (
                    <li key={q.question_id} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-warning-500" />
                      <span className="min-w-0 flex-1 line-clamp-1">{q.question ?? '(سؤال محذوف)'}</span>
                      <DifficultyChip d={q.difficulty} />
                      <span className="shrink-0 qm-tabular text-error-600 dark:text-error-400 font-bold">
                        خطأ {Math.round(q.wrong_rate * 100)}٪
                      </span>
                      <span className="shrink-0 qm-tabular text-gold-600 dark:text-gold-400 font-bold">
                        بلا إجابة {Math.round(q.timeout_rate * 100)}٪
                      </span>
                    </li>
                  ))}
                  {o.questions.length > 5 && (
                    <li className="text-[11px] text-gray-400 ms-5">+ {o.questions.length - 5} أخرى</li>
                  )}
                </ul>
              )}

              {o.setting ? (
                <div className="mt-3 rounded-lg bg-sa-50/60 dark:bg-sa-950/40 border border-sa-200/70 dark:border-sa-800/60 p-3">
                  <p className="flex items-center gap-1.5 text-[11px] font-bold text-sa-700 dark:text-sa-300">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    ما غيّره الوكيل لهذا الهدف
                    <span className="font-normal text-gray-400">
                      · {o.setting.decided_by === 'agent' ? 'قرار الوكيل' : 'عضو هيئة التدريس'}
                    </span>
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                    <Pill>
                      أسئلة: <b>{o.setting.questions_per_difficulty.easy}</b>/<b>{o.setting.questions_per_difficulty.medium}</b>/<b>{o.setting.questions_per_difficulty.hard}</b>{' '}
                      <span className="text-gray-400">سهل/متوسط/صعب</span>
                    </Pill>
                    <Pill>البداية: <b>{startLabel(o.setting.starting_difficulty)}</b></Pill>
                    <Pill>الوقت: <b>{o.setting.question_time_limit}</b> ث</Pill>
                  </div>
                  {o.setting.reason && (
                    <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">{o.setting.reason}</p>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-[11px] text-gray-400">لم يُغيَّر إعداد لهذا الهدف بعد — يُراقَب فقط.</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <a
        href="/qspark-plus/agent-core"
        className="mt-4 inline-flex items-center gap-1.5 text-xs text-sa-600 dark:text-sa-400 hover:text-sa-700 dark:hover:text-sa-300"
      >
        <ExternalLink className="w-3.5 h-3.5" />
        عرض لوحة المرشد الذكي كاملة
      </a>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5">
      {children}
    </span>
  );
}

function startLabel(d: string): string {
  return ({ easy: 'سهل', medium: 'متوسط', hard: 'صعب' } as Record<string, string>)[d] ?? d;
}
