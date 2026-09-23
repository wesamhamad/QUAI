import { Zap, CircleCheckBig, Lightbulb, SlidersHorizontal, Clock, ArrowUpDown, CircleHelp, UserRoundSearch } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import Card from '../../components/ui/Card';
import { StaggerContainer, StaggerItem } from '../../lib/motion';
import type { QSparkSummary, AgentDecisionRow, QSparkSetting } from '../../hooks/useAgentCore';

/**
 * ما يقرّره من QSpark — the loop drawn as evidence: the questions students
 * miss or leave, what the agent changed because of them (difficulty, count,
 * time, starting level), and what it only proposes (rewording is a human's
 * call). Every number here is a real row in quiz_question_outcomes.
 */
export default function QSparkDecisions({
  summary, loading, refreshing = false, selectedStudent = null, onSelectStudent,
}: {
  summary: QSparkSummary | null;
  loading: boolean;
  /** A student switch is in flight — the previous board stays up, dimmed. */
  refreshing?: boolean;
  selectedStudent?: string | null;
  onSelectStudent?: (id: string | null) => void;
}) {
  const { t } = useLanguage();

  if (loading) {
    return <div className="h-64 rounded-2xl skeleton-shimmer" />;
  }

  if (!summary) {
    return (
      <Card className="text-sm text-gray-500 dark:text-gray-400">
        {t('وحدة قرارات QSpark غير مفعّلة على هذا الخادم.', 'The QSpark decisions module is off on this server.')}
      </Card>
    );
  }

  const pct = (v: number | null | undefined) => (v === null || v === undefined ? '—' : `${Math.round(v * 100)}٪`);
  const hasData = summary.questions_served > 0;
  const roster = summary.roster ?? [];
  const scope = summary.student ?? null;

  return (
    <div className={`space-y-3 ${refreshing ? 'opacity-60 transition-opacity' : ''}`}>
      {/* ── who the board is about ── */}
      {roster.length > 0 && onSelectStudent && (
        <Card className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-300 shrink-0">
              <UserRoundSearch className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-gray-900 dark:text-white">{t('عن مَن هذه القرارات؟', 'Who is this about?')}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                {t('اختر طالباً لتضييق كل رقم أدناه على لعبه هو — أسئلته، مقرراته، والقرارات التي تخصّه.', 'Pick a student to narrow every figure below to their own play — their questions, their courses, the decisions about them.')}
              </p>
            </div>
            <select
              value={selectedStudent ?? ''}
              onChange={e => onSelectStudent(e.target.value || null)}
              className="ms-auto min-w-[220px] rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sa-400"
            >
              <option value="">{t(`كل الطلاب (${roster.length}+)`, `All students (${roster.length}+)`)}</option>
              {roster.map(r => (
                <option key={r.student_id} value={r.student_id}>
                  {`${r.label} · ${r.program ?? t('بلا خطة منشورة', 'no published plan')} · ${r.course_codes.join('، ')}`}
                </option>
              ))}
            </select>
          </div>

          {/* The check the reader asked for: the courses behind these numbers,
              matched against the published plan — so «هل البيانات على تخصصه؟»
              is answered with evidence, not with a claim. */}
          {scope && (
            <div className="rounded-xl border border-sa-200/70 dark:border-sa-800/60 bg-sa-50/60 dark:bg-sa-950/40 p-3">
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="rounded-full bg-white dark:bg-gray-900 px-2.5 py-1 font-semibold text-gray-700 dark:text-gray-200">{scope.label}</span>
                {scope.program.name && (
                  <span className="rounded-full bg-sa-600 text-white px-2.5 py-1 font-semibold">
                    {scope.program.name}{scope.program.code ? ` · ${scope.program.code}` : ''}
                  </span>
                )}
                <span className="text-gray-500 dark:text-gray-400">
                  {t(
                    `${scope.program.matched} من ${scope.program.total} مقرراً لعبه الطالب مذكور في الخطة المنشورة`,
                    `${scope.program.matched} of ${scope.program.total} courses played are in the published plan`,
                  )}
                </span>
                {scope.program.unmatched.length > 0 && (
                  <span className="rounded-full bg-gold-50 text-gold-800 dark:bg-gold-500/10 dark:text-gold-300 px-2.5 py-1 font-semibold" dir="ltr">
                    {t('خارج الخطة: ', 'outside the plan: ')}{scope.program.unmatched.join(', ')}
                  </span>
                )}
              </div>
              <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
                {scope.courses.map(c => (
                  <li key={c.course_code} className="rounded-lg bg-white dark:bg-gray-900 p-2 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-100" dir="ltr">{c.course_code}</span>
                      <span className={`text-[10px] font-semibold rounded-full px-2 py-0.5 ${c.in_plan ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                        {c.in_plan ? t('في خطته', 'in plan') : t('خارج الخطة', 'off plan')}
                      </span>
                    </div>
                    {c.course_name && <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{c.course_name}</p>}
                    <p className="mt-1 text-[10px] text-gray-400">
                      {t(`${c.served} سؤالاً · دقّة ${Math.round(c.accuracy * 100)}٪`, `${c.served} questions · ${Math.round(c.accuracy * 100)}% accuracy`)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      )}

    <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-4">
      {/* ── what it read ── */}
      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sa-500 text-white"><Zap className="w-4.5 h-4.5" /></span>
          <div>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">{t('ما قرأه من الاختبارات', 'What it read from the quizzes')}</h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              {scope
                ? `${t('آخر 60 يوماً · ', 'Last 60 days · ')}${scope.label}${scope.program.name ? ' · ' + scope.program.name : ''}`
                : t('آخر 60 يوماً · منصة التعلم QSpark', 'Last 60 days · QSpark')}
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-2">
          <Tile label={t('جلسات لعب', 'Sessions')} value={summary.sessions.toLocaleString('en-US')} />
          <Tile label={t('طلاب', 'Students')} value={summary.students.toLocaleString('en-US')} />
          <Tile label={t('أسئلة قُدّمت', 'Questions served')} value={summary.questions_served.toLocaleString('en-US')} />
          <Tile label={t('مقررات', 'Courses')} value={summary.courses.toLocaleString('en-US')} />
          <Tile label={t('دقّة الإجابة', 'Accuracy')} value={pct(summary.accuracy)} tone={summary.accuracy !== null && summary.accuracy < 0.5 ? 'warn' : 'ok'} />
          <Tile label={t('تُركت بلا إجابة', 'Left unanswered')} value={pct(summary.timeout_rate)} tone={summary.timeout_rate !== null && summary.timeout_rate >= 0.2 ? 'warn' : 'ok'} />
        </dl>
        <div className="mt-auto rounded-xl bg-sa-50 dark:bg-sa-950/60 p-3">
          <p className="text-[11px] font-semibold text-sa-700 dark:text-sa-300">{t('قرارات هذه النافذة', 'Decisions this window')}</p>
          <div className="mt-1 flex items-center gap-3 text-sm">
            <span className="font-extrabold text-gray-900 dark:text-white">{summary.decisions.applied}</span>
            <span className="text-xs text-gray-500">{t('مطبَّقة تلقائياً', 'auto-applied')}</span>
            <span className="font-extrabold text-gray-900 dark:text-white">{summary.decisions.proposed}</span>
            <span className="text-xs text-gray-500">{t('مقترحة لعضو هيئة التدريس', 'proposed to faculty')}</span>
          </div>
          {summary.last_run_at && (
            <p className="mt-1 text-[10px] text-gray-400">{t('آخر دورة قرار: ', 'Last run: ')}{new Date(summary.last_run_at).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</p>
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-4 min-w-0">
        {/* ── the weakest questions ── */}
        <Card>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">{t('الأسئلة التي يتعثّر فيها الطلاب', 'The questions students stumble on')}</h3>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">{t('نسبة الخطأ ونسبة الترك بلا إجابة لكل سؤال — وما قرّره الوكيل بشأنه.', 'Wrong rate and left-unanswered rate per question — and what the agent decided about it.')}</p>
            </div>
          </div>
          {!hasData ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('لم تُسجَّل محاولات بعد — تظهر هنا أول ما يلعب الطلاب.', 'No attempts yet — this fills as students play.')}</p>
          ) : (
            <ul className="divide-y divide-gray-100 dark:divide-gray-700/60">
              {summary.weak_questions.map(q => {
                const decision = q.decision
                  ?? summary.recent.find(d => d.subject_type === 'question' && String(d.subject_key) === String(q.question_id))
                  ?? null;
                return (
                  <li key={q.question_id} className="py-2.5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-800 dark:text-gray-100 line-clamp-2">{q.question ?? t('(سؤال محذوف)', '(deleted question)')}</p>
                      <p className="mt-0.5 text-[11px] text-gray-400 flex items-center gap-2">
                        <span className="font-mono" dir="ltr">{q.course_code}</span>
                        <DifficultyChip d={q.difficulty} />
                        <span>{t(`${q.served} محاولة`, `${q.served} attempts`)}</span>
                      </p>
                    </div>
                    <div className="w-full sm:w-56 shrink-0 space-y-1">
                      <Bar label={t('خطأ', 'wrong')} value={q.wrong_rate} tone="error" />
                      <Bar label={t('بلا إجابة', 'unanswered')} value={q.timeout_rate} tone="gold" />
                    </div>
                    <div className="sm:w-44 shrink-0">
                      {decision ? <DecisionChip d={decision} /> : <span className="text-[11px] text-gray-400">{t('يُراقَب — لا قرار بعد', 'watched — no decision yet')}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* ── settings it rewrote ── */}
        {summary.settings.length > 0 && (
          <Card>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-1">{t('إعدادات الاختبار التي غيّرها الوكيل', 'Quiz settings the agent rewrote')}</h3>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mb-3">{t('تُقرأ في التوليد التالي وفي اللعبة التالية مباشرة — القرار هنا فعلٌ لا توصية.', 'Read by the next generation and the next game — the decision here is an action, not advice.')}</p>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {summary.settings.map(s => (
                <StaggerItem key={`${s.course_code}:${s.attachment_key ?? ''}`}>
                  <SettingCard s={s} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Card>
        )}

        {/* ── decision feed ── */}
        {summary.recent.length > 0 && (
          <Card>
            <h3 className="text-sm font-extrabold text-gray-900 dark:text-white mb-1">{t('سجل القرارات', 'Decision log')}</h3>
            {summary.by_code && Object.keys(summary.by_code).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {Object.entries(summary.by_code).map(([code, n]) => {
                  const Icon = iconFor(code);
                  return (
                    <span key={code} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-2 py-1 text-[11px]">
                      <Icon className="w-3.5 h-3.5 text-sa-600 dark:text-sa-400" />
                      <span className="font-semibold text-gray-800 dark:text-gray-100">{codeLabel(code, t)}</span>
                      {n.applied > 0 && <span className="rounded bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-300 px-1.5 font-bold">{n.applied} {t('مطبَّق', 'applied')}</span>}
                      {n.proposed > 0 && <span className="rounded bg-gold-50 text-gold-800 dark:bg-gold-500/10 dark:text-gold-300 px-1.5 font-bold">{n.proposed} {t('مقترح', 'proposed')}</span>}
                    </span>
                  );
                })}
              </div>
            )}
            <ol className="space-y-2">
              {summary.recent.map(d => {
                const Icon = iconFor(d.code);
                return (
                  <li key={d.id} className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-gray-700/60 p-3">
                    <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${d.status === 'applied' ? 'bg-sa-500 text-white' : 'bg-gold-50 text-gold-700 dark:bg-gold-500/10 dark:text-gold-300'}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{d.title}</span>
                        <StatusBadge status={d.status} auto={d.auto} />
                        {d.course_code && <span className="text-[10px] font-mono text-gray-400" dir="ltr">{d.course_code}</span>}
                      </div>
                      {d.detail && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{d.detail}</p>}
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0">{new Date(d.decided_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                  </li>
                );
              })}
            </ol>
          </Card>
        )}
      </div>
    </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────

function Tile({ label, value, tone = 'ok' }: { label: string; value: string; tone?: 'ok' | 'warn' }) {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-800/60 p-2.5">
      <dt className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className={`text-lg font-extrabold qm-tabular ${tone === 'warn' ? 'text-warning-600 dark:text-warning-400' : 'text-gray-900 dark:text-white'}`}>{value}</dd>
    </div>
  );
}

function Bar({ label, value, tone }: { label: string; value: number; tone: 'error' | 'gold' }) {
  const w = Math.max(2, Math.round(value * 100));
  const color = tone === 'error' ? 'bg-error-500' : 'bg-gold-400';
  return (
    <div className="flex items-center gap-2 text-[10px] text-gray-500">
      <span className="w-14 shrink-0">{label}</span>
      <span className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden"><span className={`block h-full rounded-full ${color}`} style={{ width: `${w}%` }} /></span>
      <span className="w-9 text-end font-bold text-gray-700 dark:text-gray-200 qm-tabular">{Math.round(value * 100)}٪</span>
    </div>
  );
}

export function DifficultyChip({ d }: { d: string }) {
  const { t } = useLanguage();
  const map: Record<string, [string, string]> = {
    easy: ['سهل', 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400'],
    medium: ['متوسط', 'bg-info-50 text-info-700 dark:bg-info-500/10 dark:text-info-400'],
    hard: ['صعب', 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400'],
  };
  const [ar, cls] = map[d] ?? [d, 'bg-gray-100 text-gray-600'];
  return <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}>{t(ar, d)}</span>;
}

function StatusBadge({ status, auto }: { status: string; auto: boolean }) {
  const { t } = useLanguage();
  if (status === 'applied') {
    return <span className="rounded-full bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-300 px-2 py-0.5 text-[10px] font-bold">{auto ? t('طُبّق تلقائياً', 'auto-applied') : t('طُبّق', 'applied')}</span>;
  }
  if (status === 'proposed') {
    return <span className="rounded-full bg-gold-50 text-gold-800 dark:bg-gold-500/10 dark:text-gold-300 px-2 py-0.5 text-[10px] font-bold">{t('مقترح — يعتمده عضو هيئة التدريس', 'proposed — faculty approves')}</span>;
  }
  return <span className="rounded-full bg-gray-100 text-gray-500 px-2 py-0.5 text-[10px] font-bold">{status}</span>;
}

function DecisionChip({ d }: { d: { code: string; title: string; status: string } }) {
  const Icon = iconFor(d.code);
  const applied = d.status === 'applied';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold ${applied ? 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-300' : 'bg-gold-50 text-gold-800 dark:bg-gold-500/10 dark:text-gold-300'}`}>
      <Icon className="w-3.5 h-3.5" />
      <span className="truncate">{d.title}</span>
    </span>
  );
}

function SettingCard({ s }: { s: QSparkSetting }) {
  const { t } = useLanguage();
  const q = s.questions_per_difficulty;
  const start: Record<string, string> = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };
  return (
    <div className="rounded-xl border border-sa-200 dark:border-sa-800 bg-sa-50/40 dark:bg-sa-950/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-extrabold text-gray-900 dark:text-white font-mono" dir="ltr">{s.course_code}{s.attachment_key ? ` · ${shortKey(s.attachment_key)}` : ''}</span>
        <span className="text-[10px] text-gray-400">{s.decided_by === 'agent' ? t('قرار الوكيل', 'agent') : t('عضو هيئة التدريس', 'faculty')}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
        <span className="rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5">{t('أسئلة: ', 'questions: ')}<b>{q.easy}</b>/<b>{q.medium}</b>/<b>{q.hard}</b> <span className="text-gray-400">{t('سهل/متوسط/صعب', 'e/m/h')}</span></span>
        <span className="rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5">{t('البداية: ', 'start: ')}<b>{t(start[s.starting_difficulty] ?? s.starting_difficulty, s.starting_difficulty)}</b></span>
        <span className="rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-0.5">{t('الوقت: ', 'time: ')}<b>{s.question_time_limit}</b> {t('ث', 's')}</span>
      </div>
      {s.reason && <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400">{s.reason}</p>}
    </div>
  );
}

function shortKey(k: string): string {
  const parts = k.split('_').filter(Boolean);
  return parts.length > 2 ? `…${parts.slice(-2).join('_')}` : k;
}

function codeLabel(code: string, t: (a: string, e: string) => string): string {
  const map: Record<string, [string, string]> = {
    QS_REWORD_QUESTION: ['إعادة صياغة سؤال', 'Reword question'],
    QS_RECLASSIFY_HARDER: ['رفع صعوبة سؤال', 'Raise difficulty'],
    QS_RECLASSIFY_EASIER: ['خفض صعوبة سؤال', 'Lower difficulty'],
    QS_MORE_QUESTIONS: ['زيادة عدد الأسئلة', 'More questions'],
    QS_START_HARDER: ['بدء اللعبة بمستوى أعلى', 'Start harder'],
    QS_START_EASIER: ['بدء اللعبة بمستوى أسهل', 'Start easier'],
    QS_MORE_TIME: ['وقت أطول للإجابة', 'More time'],
    QS_STUDENT_PRACTICE: ['طالب يحتاج تدريباً', 'Student needs practice'],
  };
  const [ar, en] = map[code] ?? [code, code];
  return t(ar, en);
}

function iconFor(code: string): LucideIcon {
  if (code.includes('REWORD')) return CircleHelp;
  if (code.includes('RECLASSIFY')) return ArrowUpDown;
  if (code.includes('MORE_TIME')) return Clock;
  if (code.includes('MORE_QUESTIONS') || code.includes('START')) return SlidersHorizontal;
  if (code.includes('STUDENT')) return UserRoundSearch;
  if (code.includes('CERT_READY')) return CircleCheckBig;
  return Lightbulb;
}
