import { useQuery } from '@tanstack/react-query';
import type { Advisee } from './useAdvisorData';

/**
 * «طلاب مقرراتي» — the students in the sections the signed-in faculty member
 * teaches this term, from /api/instructor/students (TaughtRoster on the
 * server: qu-api v3 /instructor/students ∪ the synced faculty_students_cache).
 * Same row shape as the advisor's cohort rows, plus the engine's latest
 * verdict and the section the roster knows.
 */
export type TaughtStudent = Advisee & {
  risk_level: number | null;
  risk_score: number | null;
  risk_override: string | null;
  top_factors: { id?: string; label: string; evidence?: string }[];
  course_code: string | null;
  course_name: string | null;
  section: string | null;
};

interface InstructorEnvelope<T> {
  data: T | null;
  source: 'api' | 'unavailable' | 'unauthenticated' | 'forbidden';
}

async function instructorGet<T>(path: string): Promise<InstructorEnvelope<T>> {
  const res = await fetch(`/api/instructor${path}`, {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
  if (res.status === 401) return { data: null, source: 'unauthenticated' };
  if (res.status === 403) return { data: null, source: 'forbidden' };
  if (!res.ok) return { data: null, source: 'unavailable' };
  const body = (await res.json()) as Partial<InstructorEnvelope<T>>;
  return { data: (body.data ?? null) as T | null, source: body.source ?? 'unavailable' };
}

export function useTaughtStudents(semester?: string) {
  const query = useQuery({
    queryKey: ['instructor', 'students', semester ?? 'current'],
    queryFn: () => instructorGet<TaughtStudent[]>(`/students${semester ? `?semester=${encodeURIComponent(semester)}` : ''}`),
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

export interface TaughtCourse {
  course_no?: string | number | null;
  course_code?: string | null;
  course_name?: string | null;
  section?: string | number | null;
  students_count?: number | null;
  [key: string]: unknown;
}

export function useTaughtCourses(semester?: string) {
  const query = useQuery({
    queryKey: ['instructor', 'courses', semester ?? 'current'],
    queryFn: () => instructorGet<TaughtCourse[]>(`/courses${semester ? `?semester=${encodeURIComponent(semester)}` : ''}`),
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
