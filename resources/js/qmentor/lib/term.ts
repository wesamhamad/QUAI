/**
 * The running term, injected by the Blade shell from campus_semesters
 * (see App\Support\QMentor\CurrentTerm and qmentor/app.blade.php).
 *
 * Every fallback series on the student screens is cut to this: a board opened
 * in week 2 must not draw four weeks of risk history, and attendance must not
 * be reported for months the term has not reached. When the shell says
 * nothing (tests, storybook, a page rendered outside the SPA), the helpers
 * degrade to "no clamp" rather than inventing a start date.
 */
export interface CurrentTerm {
  code: string;
  starts_on: string | null;
  ends_on: string | null;
  weeks_elapsed: number | null;
  weeks_total: number | null;
}

export function currentTerm(): CurrentTerm {
  const injected = typeof window !== 'undefined'
    ? (window as unknown as { __qmentor_term?: CurrentTerm }).__qmentor_term
    : undefined;

  return injected ?? { code: '', starts_on: null, ends_on: null, weeks_elapsed: null, weeks_total: null };
}

/** Weeks the term has actually lived, or null when the shell didn't say. */
export function weeksElapsed(): number | null {
  const n = currentTerm().weeks_elapsed;
  return typeof n === 'number' && n > 0 ? n : null;
}

/**
 * Cut a week-indexed series to the weeks that have really happened, keeping
 * the LAST entries — the series ends at "now", which is the number the page
 * shows as the current value.
 */
export function toElapsedWeeks<T>(series: T[]): T[] {
  const weeks = weeksElapsed();
  if (weeks === null || weeks >= series.length) return series;
  return series.slice(series.length - weeks);
}

/** The Arabic month names the term has reached, most recent last. */
export function elapsedMonths(max = 4): string[] {
  const start = currentTerm().starts_on;
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  if (!start) return months.slice(0, max);

  const from = new Date(start + 'T00:00:00');
  const now = new Date();
  const span = (now.getFullYear() - from.getFullYear()) * 12 + (now.getMonth() - from.getMonth()) + 1;
  const count = Math.max(1, Math.min(max, span));

  const out: string[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push(months[d.getMonth()]);
  }
  return out;
}
