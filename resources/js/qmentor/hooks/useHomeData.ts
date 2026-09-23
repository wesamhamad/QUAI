import { useQuery } from '@tanstack/react-query';

/**
 * الرئيسية — the per-seat summary behind the home page (GET /api/home/summary).
 *
 * The server decides the scope from the signed-in user: the super admin gets
 * the cohort by college (`faculty` drills into one college's majors), a
 * faculty member gets their advisees or taught students (`seat` picks the
 * hat), a student is answered 403 with a redirect. Nothing here is mocked:
 * an empty caseload comes back as zeros and the page says so.
 */

export type HomeRole = 'admin' | 'advisor' | 'instructor';

export interface LevelMeta {
  level: number;
  key: string;
  ar: string;
  color: string;
  min?: number;
  max?: number;
}

export interface LevelCount extends LevelMeta {
  n: number;
}

export interface LevelBuckets {
  L0: number;
  L1: number;
  L2: number;
  L3: number;
}

export interface HomeTotals {
  students: number;
  listed?: number;
  scored: number;
  by_level: LevelCount[];
  avg_gpa: number | null;
  absence_high?: number | null;
  absence_threshold?: number;
  scored_at: string | null;
}

export interface HomeGroup {
  key: string;
  faculty_no: string;
  faculty_name: string | null;
  major_no: string | null;
  major_name: string | null;
  name: string;
  students: number;
  scored: number;
  levels: LevelBuckets;
  high_critical: number;
  high_share: number;
  avg_gpa: number | null;
  absence_high: number | null;
  absence_share: number | null;
  /** Inferred from the programme's name; null on college rows. */
  degree: Degree | null;
  degree_label: string | null;
}

export type Degree = 'bachelor' | 'master' | 'doctorate' | 'preparatory';

/**
 * One course the cohort is struggling in, and which indicator says so.
 * `absence` is this term's; `failure` is the last full graded term's, because
 * the current term has no final grades until they are entered.
 */
export interface RiskyCourse {
  course_code: string;
  course_name: string;
  indicator: 'absence' | 'failure';
  indicator_label: string;
  share: number;
  students: number;
  affected: number;
  absence_share: number | null;
  failure_share: number | null;
  failure_semester: string | null;
  absence_threshold: number;
}

export interface HomeTopStudent {
  id: string;
  name: string;
  major: string | null;
  gpa: number | null;
  level: number;
  level_label: string | null;
  score: number;
  override: string | null;
  top_factor: string | null;
  top_factor_evidence: string | null;
  link: string;
}

export interface HomeCourse {
  key: string;
  course_code: string | null;
  course_name: string | null;
  section: string | null;
  students: number;
  scored: number;
  levels: LevelBuckets;
  high_critical: number;
}

export interface HomeSync {
  stage: string;
  finished_at: string | null;
  succeeded: number;
  failed: number;
}

export interface HomeData {
  scope: 'cohort' | 'own';
  group_by?: 'faculty' | 'major';
  faculty?: { faculty_no: string; faculty_name: string | null } | null;
  totals: HomeTotals;
  groups?: HomeGroup[];
  top_majors?: HomeGroup[];
  top_majors_by_degree?: Partial<Record<Degree, HomeGroup[]>>;
  degree_labels?: Record<string, string>;
  risky_courses?: RiskyCourse[];
  top_students?: HomeTopStudent[];
  courses?: HomeCourse[];
  alerts_7d: number;
  pending_approvals: number;
  interventions_7d?: number;
  last_sync: HomeSync | null;
  generated_at: string;
}

export interface HomeEnvelope {
  source: 'api' | 'unavailable' | 'unauthenticated' | 'forbidden';
  role: HomeRole | 'student' | null;
  levels: LevelMeta[];
  data: HomeData | null;
  redirect?: string;
}

async function fetchHome(params: { seat?: 'advisor' | 'instructor'; faculty?: string }): Promise<HomeEnvelope> {
  const qs = new URLSearchParams();
  if (params.seat) qs.set('seat', params.seat);
  if (params.faculty) qs.set('faculty', params.faculty);
  const suffix = qs.toString() ? `?${qs.toString()}` : '';
  const res = await fetch(`/api/home/summary${suffix}`, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
  const empty: HomeEnvelope = { source: 'unavailable', role: null, levels: [], data: null };
  if (res.status === 401) return { ...empty, source: 'unauthenticated' };
  if (res.status === 403) {
    try {
      const body = (await res.json()) as Partial<HomeEnvelope>;
      return { ...empty, source: 'forbidden', role: body.role ?? null, redirect: body.redirect };
    } catch {
      return { ...empty, source: 'forbidden' };
    }
  }
  if (!res.ok) return empty;
  const body = (await res.json()) as Partial<HomeEnvelope>;
  return {
    source: body.source ?? 'unavailable',
    role: body.role ?? null,
    levels: Array.isArray(body.levels) ? body.levels : [],
    data: body.data ?? null,
  };
}

export function useHomeSummary(params: { seat?: 'advisor' | 'instructor'; faculty?: string }) {
  const query = useQuery({
    queryKey: ['home', 'summary', params.seat ?? '-', params.faculty ?? '-'],
    queryFn: () => fetchHome(params),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  return {
    envelope: query.data ?? null,
    data: query.data?.data ?? null,
    levels: query.data?.levels ?? [],
    role: query.data?.role ?? null,
    source: query.data?.source ?? 'unavailable',
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
