import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';

/** One system on the agent's ring, as /api/qmentor/agent-core describes it. */
export interface AgentSource {
  id: string;
  label: string;
  label_en: string;
  system: string;
  reads: string[];
  reads_en: string[];
  /** Proactive step codes (T1…T11) this source drives; empty when it only informs recommendations. */
  feeds: string[];
  informs?: string;
  informs_en?: string;
  available: boolean;
}

/** One of the eleven proactive steps, with per-semester student counts (current term first). */
export interface AgentTrigger {
  code: string;
  label: string;
  severity: 'critical' | 'high' | 'medium' | string;
  severity_label: string;
  tier: string;
  tier_label: string;
  detects: string;
  window_days: number;
  available: boolean;
  unavailable_reason: string | null;
  semesters: Array<number | null>;
  total: number | null;
  /** How many of this term's students on this step are seeded demo rows (payload.demo). */
  demo_students?: number;
}

export interface AgentCounts {
  appointments: number;
  proactive: number;
  dispatched: number;
  held: number;
  matched_students: number;
  raised: number;
  signal_students: number;
  resolved: number;
  response_median_hours: number | null;
}

export interface AgentCore {
  semester: string;
  semesters: Array<{ code: string; current: boolean; label: string }>;
  /** The current term's dates — a step that needs classes running is drawn as «لم يبدأ الفصل بعد» before them. */
  term: { code: string; starts_on: string | null; ends_on: string | null; started: boolean; days_to_start: number | null };
  scope: 'university' | 'caseload';
  engine_ready: boolean;
  sources: AgentSource[];
  triggers: AgentTrigger[];
  counts: AgentCounts;
  /** Decisions the agent draws from the learning platform — null when the module is off. */
  qspark: QSparkSummary | null;
  /** The viewer's (or chosen) student's skill gaps and certificate readiness — null when no student is in scope. */
  digital_record: RecordDecisions | null;
}

export interface AgentCoreResult {
  data: AgentCore | null;
  source: 'api' | 'unavailable' | 'unauthenticated';
  isLoading: boolean;
  isFetching?: boolean;
}

/**
 * The whole "how QMentor thinks" payload in one read. Aggregates only, so it
 * is safe to cache for the session; the numbers move once a day at most.
 */
export function useAgentCore(qsparkStudent?: string | null): AgentCoreResult {
  const query = useQuery({
    queryKey: ['qmentor', 'agent-core', qsparkStudent ?? null],
    queryFn: async () => {
      const response = await apiClient.getAgentCore(qsparkStudent);
      return {
        data: (response.data ?? null) as AgentCore | null,
        source: (response.source ?? 'unavailable') as AgentCoreResult['source'],
      };
    },
    retry: false,
    staleTime: 10 * 60 * 1000,
  });

  return {
    data: query.data?.data ?? null,
    source: query.isError ? 'unavailable' : (query.data?.source ?? 'unavailable'),
    // isFetching, not isLoading: switching student keeps the previous payload
    // mounted, and the QSpark section must still say it is reloading.
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}

// ── ما يقرّره من QSpark ──────────────────────────────────────────────────

export interface QSparkWeakQuestion {
  question_id: number;
  course_code: string | null;
  attachment_key?: string | null;
  difficulty: string;
  question: string | null;
  served: number;
  wrong_rate: number;
  timeout_rate: number;
  /** The standing decision about this question, if the agent took one. */
  decision?: { code: string; title: string; status: string; auto: boolean } | null;
}

export interface QSparkSetting {
  course_code: string;
  attachment_key: string | null;
  questions_per_difficulty: { easy: number; medium: number; hard: number };
  starting_difficulty: string;
  question_time_limit: number;
  decided_by: string;
  reason: string | null;
  applied_at: string | null;
}

export interface AgentDecisionRow {
  id: number;
  code: string;
  subject_type: string;
  subject_key: string;
  course_code: string | null;
  student_id?: string | null;
  title: string;
  detail: string | null;
  status: 'applied' | 'proposed' | 'dismissed' | string;
  auto: boolean;
  decided_at: string;
  applied_at: string | null;
  evidence: Record<string, unknown> | null;
  action: Record<string, unknown> | null;
}

export interface QSparkSummary {
  enabled: boolean;
  last_run_at: string | null;
  sessions: number;
  students: number;
  questions_served: number;
  accuracy: number | null;
  timeout_rate: number | null;
  courses: number;
  attachments: number;
  decisions: { applied: number; proposed: number; dismissed: number };
  weak_questions: QSparkWeakQuestion[];
  settings: QSparkSetting[];
  recent: AgentDecisionRow[];
  /** Open decisions per code: how many applied, how many proposed. */
  by_code?: Record<string, { applied: number; proposed: number }>;
  /** Students with quiz rows in the window — the picker's options. */
  roster?: QSparkRosterEntry[];
  /** The student every figure above is narrowed to, or null for the whole platform. */
  student?: QSparkStudentScope | null;
  scoped_student_id?: string | null;
  /** A student was asked about and has no play in the window — not «the platform is quiet». */
  scope_empty?: boolean;
  /** The reader may not see the student they named. */
  scope_denied?: boolean;
}

export interface QSparkRosterEntry {
  student_id: string;
  label: string;
  served: number;
  courses: number;
  accuracy: number;
  course_codes: string[];
  /** The published plan those courses belong to — the student's programme. */
  program: string | null;
  program_key: string | null;
}

export interface QSparkStudentScope {
  student_id: string;
  label: string;
  courses: Array<{
    course_code: string;
    course_name: string | null;
    in_plan: boolean;
    served: number;
    accuracy: number;
    wrong_rate: number;
    timeout_rate: number;
    last_played_at: string | null;
  }>;
  /** How the courses they sat check out against the published plan. */
  program: {
    key: string | null;
    name: string | null;
    code: string | null;
    matched: number;
    total: number;
    unmatched: string[];
  };
}

// ── ما يقرّره من السجل الرقمي ─────────────────────────────────────────────

export type ReadinessVerdict = 'now' | 'two_months' | 'six_months' | 'year' | 'later' | 'after_graduation';

export interface CertificateAssessment {
  code: string;
  title: string;
  title_en: string;
  provider: string;
  stage: string;
  stage_label: string;
  link?: string | null;
  coverage_pct: number;
  matched: Array<{ skill: string; evidence: string[] | string; hours: number }>;
  missing: Array<{ skill: string; skill_en: string; weight: number; next_course?: PlanNextCourse | null }>;
  remaining_hours: number;
  eta_months: number;
  verdict: ReadinessVerdict;
  verdict_label: string;
  when_label: string;
  reason: string;
}

export interface PlanNextCourse {
  code: string;
  name: string;
  level: number;
  terms_away: number;
  in_progress: boolean;
  eta_months: number;
  when: string;
}

export interface SkillGap {
  skill: string;
  skill_en: string;
  demand: number;
  needed_by: string[];
  next_course?: PlanNextCourse | null;
  suggest: string;
}

/** The published plan read against the transcript — null when no plan is configured for the major. */
export interface PlanSummary {
  name: string;
  url: string;
  level: number;
  levels: number;
  passed_count: number;
  total_count: number;
  remaining_hours: number;
  current: Array<{ code: string; name: string; level: number }>;
  deferred: Array<{ code: string; name: string; level: number }>;
  next: Array<{ code: string; name: string; level: number; hours?: number }>;
}

export interface RecordAssessment {
  family: { key: string; label: string };
  progress: { ratio: number; passed_hours: number | null; plan_hours: number | null; semesters_completed: number | null; estimated: boolean; basis: string };
  pace: { hours_per_month: number; basis: string; accepted_hours: number; months_spanned: number };
  strengths: Array<{ skill: string; skill_en: string; evidence: string[]; hours: number }>;
  gaps: SkillGap[];
  certificates: CertificateAssessment[];
  plan?: PlanSummary | null;
  headline: string;
  generated_at: string;
}

export interface RecordDecisions {
  student_id: string;
  student_label: string;
  source: 'demo' | 'register' | 'seed' | 'empty' | string;
  profile: { major: string | null; major_en: string | null; faculty: string | null; faculty_en: string | null; gpa: number | string | null };
  total_skills: number;
  accepted_hours: number;
  assessment: RecordAssessment | null;
}
