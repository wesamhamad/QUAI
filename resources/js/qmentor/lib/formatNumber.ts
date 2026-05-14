const arDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/** Convert Western digits to Arabic-Indic digits */
export function toArabicDigits(n: string | number): string {
  return String(n).replace(/\d/g, d => arDigits[Number(d)]);
}

/** Format a number with locale-aware digits and optional decimal places */
export function formatNumber(n: number, lang: 'ar' | 'en', decimals?: number): string {
  const formatted = decimals !== undefined ? n.toFixed(decimals) : n.toLocaleString('en-US');
  return lang === 'ar' ? toArabicDigits(formatted) : formatted;
}

/** Format GPA with 2 decimal places */
export function formatGPA(gpa: number, lang: 'ar' | 'en'): string {
  return formatNumber(gpa, lang, 2);
}

/** Format percentage */
export function formatPercent(pct: number, lang: 'ar' | 'en'): string {
  const val = formatNumber(pct, lang, 1);
  return lang === 'ar' ? `${val}٪` : `${val}%`;
}
