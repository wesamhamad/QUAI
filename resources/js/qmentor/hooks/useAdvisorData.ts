import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api';
import type { ApiResponse } from '../lib/api';

/** A student on the signed-in advisor's list, as SIS_ADVISORY_LISTS holds it. */
export interface Advisee {
  student_id: string;
  student_name: string;
  student_name_en: string | null;
  semester: string;
  email: string | null;
  mobile_no: string | null;
  faculty_no: string | null;
  faculty_name: string | null;
  dept_no: string | null;
  dept_name: string | null;
  major_no: string | null;
  major_name: string | null;
  major_name_en: string | null;
  last_recorded_gpa: number | string | null;
  /** Roster figures (cohort rows only; the SIS list does not carry them). */
  student_level?: number | string | null;
  passed_hours?: number | string | null;
  plan_hours?: number | string | null;
  expected_graduation_semester?: string | null;
  academic_status?: string | null;
  risk_level?: number | null;
  risk_score?: number | null;
  /** Which nightly passes have answered for this student (cohort rows only). */
  data_stages?: DataStages;
  last_error?: string | null;
}

/** The passes of the nightly chain, in the order CohortStageJob runs them. */
export interface DataStages {
  roster: boolean;
  academic: boolean;
  profile: boolean;
  blackboard: boolean;
  score: boolean;
}

export const STAGE_LABELS: { key: keyof DataStages; label: string }[] = [
  { key: 'roster', label: 'الروستر' },
  { key: 'academic', label: 'الأكاديمي' },
  { key: 'profile', label: 'الملف' },
  { key: 'blackboard', label: 'بلاكبورد' },
  { key: 'score', label: 'التقييم' },
];

/** How many of the five passes have answered. 5 = the chain finished this student. */
export const stagesDone = (st: DataStages | undefined): number =>
  st ? STAGE_LABELS.reduce((n, s) => n + (st[s.key] ? 1 : 0), 0) : 0;

/**
 * One course in an advisee's plan.
 *
 * These field names come from qu-api's `PlanCourseData`, not from the SIS
 * columns behind it — `code`/`title`, not `course_code`/`course_name`.
 * `status` is SIS's own verdict, via `sis_prereg_pkg.check_pass_courses`.
 */
export interface AdviseePlanCourse {
  code: string | null;
  title: string | null;
  hours: string | null;
  status: 'passed' | 'student_schedule' | 'remaining' | 'N/A';
  category: string | null;
  group: string | null;
}

/** A plan level. Ids -1 and -2 are the elective buckets, not real levels. */
export interface AdviseePlanLevel {
  id: number;
  title: string | null;
  required_hours: number | null;
  details: AdviseePlanCourse[];
}

/** A predicted grade for one remaining course, with what it rests on. */
export interface AdviseePrediction {
  course_no: string;
  course_code: string;
  predicted_points: number;
  predicted_letter: string;
  confidence: 'high' | 'medium' | 'low';
  course_mean: number;
  samples: number;
  correlated_with: { course_no: string; course_code: string; r: number; samples: number }[];
}

export interface AdviseePredictions {
  method: string;
  scale: string;
  predictions: AdviseePrediction[];
}

export interface AdvisorIdentity {
  instructor_id: string;
  instructor_name: string | null;
  faculty_no: string | null;
  faculty_name: string | null;
  dept_no: string | null;
  dept_name: string | null;
  email: string | null;
}

/**
 * `source` distinguishes three outcomes the advisor screens must not blur:
 * data arrived, the upstream could not answer, or the caller is not an advisor.
 * An empty caseload is still `api` — it means "no students assigned", which is
 * a different message from "we could not ask".
 */
interface AdvisorQueryResult<T> {
  data: T | null;
  source: 'api' | 'unavailable' | 'unauthenticated';
  isLoading: boolean;
  isError: boolean;
}

function useAdvisorQuery<T>(
  queryKey: unknown[],
  apiFn: () => Promise<ApiResponse>,
  enabled = true,
): AdvisorQueryResult<T> {
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await apiFn();
      return {
        data: (response.data ?? null) as T | null,
        source: (response.source ?? 'unavailable') as AdvisorQueryResult<T>['source'],
      };
    },
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data?.data ?? null,
    source: query.data?.source ?? 'unavailable',
    isLoading: query.isLoading,
    isError: query.isError,
  };
}

export function useAdvisorIdentity() {
  return useAdvisorQuery<AdvisorIdentity>(
    ['advisor', 'me'],
    () => apiClient.getAdvisorIdentity(),
  );
}

export function useAdvisees(semester?: string, all = false, q?: string, atRisk = false, filters: { level?: number; facultyName?: string } = {}) {
  return useAdvisorQuery<Advisee[]>(
    ['advisor', 'advisees', semester ?? 'current', all ? 'all' : 'mine', q ?? '', atRisk ? 'at-risk' : '', filters.level ?? '', filters.facultyName ?? ''],
    () => apiClient.getAdvisees(semester, all, q, atRisk, filters),
  );
}

/** The LMS activity section as qu-api snapshots it (`blackboard_activity`, source dda). */
export interface BlackboardActivity {
  last_login: string | null;
  window_days: number;
  logins_per_week: number | null;
  hours_per_week: number | null;
  sessions: number;
  courses: Record<string, { last_accessed: string | null; hours_per_week: number | null; events: number }>;
  source?: string;
}

/** Per-course submissions (bb_submissions), keyed by course code. */
export interface BlackboardSubmissions {
  external_id?: string;
  last_accessed: string | null;
  gradable: number;
  submitted: number;
  columns: { id: string; name: string; due: string | null; submitted: boolean; status: string | null }[];
}

/** /students/{id}/blackboard and /student/blackboard: the same shape on both paths. */
export interface BlackboardSlice {
  grades: Record<string, unknown[]>;
  activity: BlackboardActivity | null;
  submissions: Record<string, BlackboardSubmissions>;
}

/** Twin slices of one advisee (or, for the admin, any cohort student) from the pre-loaded tables. */
export function useAdviseeTwin(studentId: string | null) {
  const on = !!studentId;
  const id = studentId as string;
  return {
    profile: useAdvisorQuery<Record<string, unknown>>(['advisor', 'twin', 'profile', studentId], () => apiClient.getAdviseeProfile(id), on),
    courses: useAdvisorQuery<unknown[]>(['advisor', 'twin', 'courses', studentId], () => apiClient.getAdviseeCourses(id), on),
    transactions: useAdvisorQuery<unknown[]>(['advisor', 'twin', 'transactions', studentId], () => apiClient.getAdviseeTransactions(id), on),
    absences: useAdvisorQuery<unknown[]>(['advisor', 'twin', 'absences', studentId], () => apiClient.getAdviseeAbsences(id), on),
    risk: useAdvisorQuery<Record<string, unknown>>(['advisor', 'twin', 'risk', studentId], () => apiClient.getRiskStudent(id), on),
    plan: useAdvisorQuery<{ levels: AdviseePlanLevel[] }>(['advisor', 'twin', 'plan', studentId], () => apiClient.getAdviseePlan(id), on),
    recommendations: useAdvisorQuery<unknown[]>(['advisor', 'twin', 'recs', studentId], () => apiClient.getAdviseeRecommendations(id), on),
    timeline: useAdvisorQuery<unknown[]>(['advisor', 'twin', 'timeline', studentId], () => apiClient.getAdviseeTimeline(id), on),
    finals: useAdvisorQuery<Record<string, unknown>>(['advisor', 'twin', 'finals', studentId], () => apiClient.getAdviseeFinals(id), on),
    timetable: useAdvisorQuery<Record<string, unknown>>(['advisor', 'twin', 'timetable', studentId], () => apiClient.getAdviseeTimetable(id), on),
    blackboard: useAdvisorQuery<BlackboardSlice>(['advisor', 'twin', 'blackboard', studentId], () => apiClient.getAdviseeBlackboard(id), on),
  };
}

export interface AdminUsage {
  generated_at: string;
  window: { from: string; to: string; label: string };
  header: { environment: string; scope: string; period: string; last_sync: string | null; model_version: string };
  platform: { p95_ms: number | null; requests: number; avg_ms: number | null; errors: number };
  components: { key: string; ar: string; requests: number; users: number; faculties: number; avg_ms: number | null; errors: number }[];
  org: {
    faculties: { faculty_no: string; faculty_name: string | null; students: number; accounts: number; active: number; departments: number; majors: number }[];
    departments: { faculty_no: string; faculty_name: string | null; dept_no: string | null; dept_name: string | null; students: number; majors: number; active: number }[];
    majors: { faculty_no: string; faculty_name: string | null; major_no: string; major_name: string | null; students: number }[];
    active_students: number;
  };
  outcomes: { scored: number; scored_in_window: number; levels: Record<'L0' | 'L1' | 'L2' | 'L3', number>; interventions: number; agent_actions: number; approved_plans: number; pending_approvals: number; counseling_referrals: number; closed_measured: number; closed_resolved: number; alerts: number; alerts_by_channel: Record<string, number>; analyses: number };
  users: { total: number; students: number; instructors: number; staff: number; active_7d: number | null; active_30d: number | null; new_30d: number; enabled: number };
  totals: { p95_ms: number | null; requests: number; users: number; anonymous: number; days_seen: number; avg_ms: number; errors: number; rejected: number; requests_today: number; users_today: number };
  sessions: { live_now: number; sessions: number; avg_minutes: number | null; avg_requests: number | null };
  daily: { d: string; requests: number; users: number; avg_ms: number; errors: number }[];
  hourly: Record<string, number> | number[];
  features: { feature: string; requests: number; users: number; avg_ms: number; max_ms: number; errors: number; last_at: string }[];
  slowest: { path: string; n: number; avg_ms: number; max_ms: number }[];
  by_type: { user_type: string; requests: number; users: number }[];
}

export function useAdminUsage(period: string | number = 30) {
  return useAdvisorQuery<AdminUsage>(['qmentor', 'admin', 'usage', period], () => apiClient.getAdminUsage(period));
}

export function useAdviseePlan(studentId: string | null) {
  return useAdvisorQuery<{ levels: AdviseePlanLevel[] }>(
    ['advisor', 'advisee-plan', studentId],
    () => apiClient.getAdviseePlan(studentId as string),
    !!studentId,
  );
}

export function useAdviseeProfile(studentId: string | null) {
  return useAdvisorQuery<Record<string, unknown>>(
    ['advisor', 'advisee-profile', studentId],
    () => apiClient.getAdviseeProfile(studentId as string),
    !!studentId,
  );
}

export function useAdviseePredictions(studentId: string | null) {
  return useAdvisorQuery<AdviseePredictions>(
    ['advisor', 'advisee-predictions', studentId],
    () => apiClient.getAdviseePredictions(studentId as string),
    !!studentId,
  );
}

/** Latest engine evaluation per advisee — keyed by student id. */
export interface CaseloadRisk {
  score: number;
  level: { level: number; key: 'low' | 'medium' | 'high' | 'critical'; ar: string };
  override: string | null;
  top_factors: { id: string; label: string; level: number; evidence: string }[];
  computed_at: string;
}

export function useRiskCaseload(ids: string[], all = false) {
  return useAdvisorQuery<{ students: Record<string, CaseloadRisk>; scored: number }>(
    ['advisor', 'risk-caseload', all ? 'all' : ids.join(',')],
    () => apiClient.getRiskCaseload(ids, all),
    all || ids.length > 0,
  );
}

export interface LoggedIntervention {
  id: number;
  student_id: string;
  student_name: string;
  type: string;
  label: string;
  note: string;
  outcome: string | null;
  follow_up: string | null;
  performed_at: string;
}

export function useMyInterventions() {
  return useAdvisorQuery<{ interventions: LoggedIntervention[] }>(
    ['advisor', 'interventions'],
    () => apiClient.getMyInterventions(),
  );
}

export interface ApprovalRow {
  id: number;
  task_no: number;
  task: string;
  action: string;
  level: string;
  student_id: string;
  student_name: string;
  reason: string | null;
  payload: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'escalated' | 'executed';
  sla_hours: number;
  due_at: string | null;
  created_at: string;
  decided_by: string | null;
  decided_at: string | null;
  decision_note: string | null;
  execution: { executed?: boolean; detail?: string | null } | null;
}

export function useApprovals() {
  return useAdvisorQuery<{ pending: number; approvals: ApprovalRow[] }>(['advisor', 'approvals'], () => apiClient.getApprovals());
}

export interface AutonomyTask {
  no: number; ar: string; en: string; mode: 'agent' | 'agent_notify' | 'human_approves' | 'human_only';
  level: 'L0' | 'L1' | 'L2' | 'L3' | 'L4'; actor: string; impl: string; ui: string; sla_hours?: number;
}

export interface AutonomyPayload {
  enabled: boolean;
  levels: Record<string, { ar: string; en: string; approval: boolean | null }>;
  tasks: AutonomyTask[];
  by_mode: Record<string, number>;
  approvals: { pending: number; escalated: number; approved: number; rejected: number };
  escalation_configured: boolean;
  outward_dispatch: boolean;
}

export function useAutonomy() {
  return useAdvisorQuery<AutonomyPayload>(['qmentor', 'autonomy'], () => apiClient.getAutonomy());
}
