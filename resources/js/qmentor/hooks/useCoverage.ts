import { useQuery } from '@tanstack/react-query';

/**
 * تغطية العدّ — what the memberships feed holds against what the roster kept
 * (GET /api/qmentor/cohort/coverage, super admin only).
 *
 * The board's headcount is the roster table, and the roster table is the
 * colleges QMENTOR_FACULTIES covers. The feed carries more, so the board's
 * number is smaller than the one the university quotes. This says by how
 * much, and which colleges the difference sits in.
 *
 * The figures come from the last roster run — the only pass that reads every
 * membership — so before a run has stored them the answer is `measured:
 * false` with a note, never a guess.
 */

export interface CoverageRow {
  faculty_no: string;
  faculty_name: string;
  in_feed: number;
  in_cohort: number;
  missing: number;
  reason: string;
}

export interface Coverage {
  measured: boolean;
  in_scope: number;
  note?: string;
  semester?: string | null;
  measured_at?: string | null;
  in_feed?: number;
  missing?: number;
  rows?: CoverageRow[];
}

async function fetchCoverage(): Promise<Coverage | null> {
  const res = await fetch('/api/qmentor/cohort/coverage', {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    return null;
  }
  const body = await res.json();

  return (body?.data as Coverage) ?? null;
}

export function useCoverage() {
  const query = useQuery({
    queryKey: ['qmentor', 'cohort', 'coverage'],
    queryFn: fetchCoverage,
    retry: false,
    // It only moves when a roster run finishes, which is nightly at most.
    staleTime: 30 * 60 * 1000,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ?? (query.data === null && !query.isLoading ? new Error('unavailable') : null),
  };
}
