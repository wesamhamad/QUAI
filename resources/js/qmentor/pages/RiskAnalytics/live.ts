import type { AtRiskStudent, EarlyWarning, RiskCategoryInfo, RiskCategoryKey, RiskIndicatorDef, RiskLevel, RiskTrendPoint, UniversityRiskOverview } from './types';
import { categoryMeta } from './data/riskIndicators';
import type { Advisee } from '../../hooks/useAdvisorData';

/** /api/qmentor/risk/cohort */
export interface CohortPayload {
  computed_at: string | null;
  students_scored: number;
  students_in_cohort: number;
  by_level: { level: number; key: string; ar: string; n: number }[];
  by_faculty: { faculty_no: string; faculty_name: string | null; levels: Record<string, number>; total: number; avg_gpa: number; enrolled: number }[];
  by_department: { faculty_no: string; dept_no: string; dept_name: string | null; levels: Record<string, number>; total: number; avg_gpa: number }[];
  avg_gpa: number;
  indicator_prevalence: Record<string, number>;
  by_category: Record<string, number>;
  indicators: { id: string; label: string; category: string; available: number; medium: number; high: number; threshold: { dir: 'up' | 'down'; bands: number[]; unit: string } | null }[];
  trend: { date: string; L0: number; L1: number; L2: number; L3: number }[];
  model_version: string;
}

export type RosterRow = Advisee & { risk_level?: number | null; risk_score?: number | null };

const LEVELS: RiskLevel[] = ['low', 'medium', 'high', 'critical'];
export const levelOf = (n: number | null | undefined): RiskLevel => LEVELS[Math.max(0, Math.min(3, Number(n ?? 0)))];

const CATEGORY_LABEL: Record<string, [string, string]> = {
  A: ['الحضور', 'Attendance'], G: ['الدرجات', 'Grades'], S: ['الواجبات', 'Assignments'], E: ['التفاعل مع المنصة', 'LMS engagement'],
  AC: ['الوضع الأكاديمي', 'Academic standing'], R: ['التسجيل', 'Registration'], T: ['الجدول والاختبارات', 'Schedule & exams'], C: ['مؤشرات مركّبة', 'Compound'], P: ['مسار التخرج', 'Graduation path'],
};

export function overviewFrom(c: CohortPayload): UniversityRiskOverview {
  const n = (k: string) => c.by_level.find(l => l.key === k)?.n ?? 0;
  const scored = Math.max(1, c.students_scored);
  const weighted = (n('medium') * 1 + n('high') * 2 + n('critical') * 3) / (scored * 3) * 100;
  const t = c.trend;
  const prev = t.length >= 2 ? t[t.length - 2] : null;
  const last = t.length ? t[t.length - 1] : null;
  const share = (p: { L0: number; L1: number; L2: number; L3: number }) => { const tot = p.L0 + p.L1 + p.L2 + p.L3 || 1; return ((p.L1 + p.L2 * 2 + p.L3 * 3) / (tot * 3)) * 100; };
  const delta = prev && last ? Math.round((share(last) - share(prev)) * 10) / 10 : 0;
  return {
    totalStudents: c.students_in_cohort,
    lowRisk: n('low'), mediumRisk: n('medium'), highRisk: n('high'), criticalRisk: n('critical'),
    overallScore: Math.round(weighted),
    trend: delta < -1 ? 'improving' : delta > 1 ? 'declining' : 'stable',
    trendDelta: delta,
  };
}

export function categoriesFrom(c: CohortPayload): RiskCategoryInfo[] {
  const keys = Object.keys(categoryMeta) as RiskCategoryKey[];
  return keys.map(key => {
    const meta = categoryMeta[key];
    const inds = c.indicators.filter(i => i.category === key);
    const flagged = inds.length ? Math.max(...inds.map(i => i.high)) : 0;
    const evaluated = inds.length ? Math.max(...inds.map(i => i.available)) : 0;
    const score = evaluated ? Math.round((inds.reduce((s, i) => s + i.medium + i.high, 0) / (inds.length * evaluated)) * 100) : 0;
    return {
      key, nameAr: CATEGORY_LABEL[key]?.[0] ?? meta.nameAr, nameEn: CATEGORY_LABEL[key]?.[1] ?? meta.nameEn, code: key, icon: meta.icon,
      riskScore: Math.min(100, score), studentCount: flagged, trend: 'stable',
      indicators: inds.map(i => indicatorDef(i, c.students_scored)),
    };
  });
}

function indicatorDef(i: CohortPayload['indicators'][number], scored: number): RiskIndicatorDef {
  const share = i.available ? (i.high / i.available) * 100 : 0;
  return {
    id: i.id, nameAr: i.label, nameEn: i.id, category: i.category as RiskCategoryKey,
    descriptionAr: i.available ? `مُقيَّم لـ ${i.available.toLocaleString('en')} من ${scored.toLocaleString('en')} طالباً · متوسط فأعلى ${i.medium.toLocaleString('en')} · مرتفع فأعلى ${i.high.toLocaleString('en')}` : 'غير متاح في التغذية بعد',
    descriptionEn: i.available ? `evaluated for ${i.available} of ${scored} · medium+ ${i.medium} · high+ ${i.high}` : 'not available in the feeds yet',
    threshold: i.threshold?.bands?.[1] ?? 0, currentValue: Math.round(share * 10) / 10,
    status: !i.available ? 'low' : share >= 25 ? 'critical' : share >= 10 ? 'high' : share >= 3 ? 'medium' : 'low',
    dataSource: i.threshold?.unit ?? '', dataSourceAr: i.threshold ? `الوحدة: ${i.threshold.unit} · الحدود ${i.threshold.bands.join(' / ')}` : '',
  };
}

export function indicatorsFrom(c: CohortPayload): RiskIndicatorDef[] {
  return c.indicators.map(i => indicatorDef(i, c.students_scored));
}

export function trendFrom(c: CohortPayload): RiskTrendPoint[] {
  return c.trend.map(p => ({ week: p.date, weekEn: p.date, low: p.L0, medium: p.L1, high: p.L2, critical: p.L3 }));
}

export function collegesFrom(c: CohortPayload) {
  return c.by_faculty.map(f => ({
    nameAr: f.faculty_name ? `كلية ${f.faculty_name}` : `كلية ${f.faculty_no}`, nameEn: f.faculty_name ?? f.faculty_no,
    low: f.levels.L0 ?? 0, medium: f.levels.L1 ?? 0, high: f.levels.L2 ?? 0, critical: f.levels.L3 ?? 0,
  }));
}

export function studentsFrom(rows: RosterRow[], factors: Record<string, { id: string; label: string; level: number }[]>): AtRiskStudent[] {
  return rows.filter(r => (r.risk_level ?? 0) >= 1).map(r => {
    const tf = factors[r.student_id] ?? [];
    const cats = Array.from(new Set(tf.map(f => f.id.split('-')[0]))) as RiskCategoryKey[];
    return {
      id: r.student_id, name: r.student_name ?? r.student_id, nameEn: r.student_name_en ?? r.student_name ?? r.student_id, studentId: r.student_id,
      college: r.faculty_name ?? '', collegeEn: r.faculty_name ?? '', department: (r.major_name ?? r.dept_name ?? '').trim(), departmentEn: (r.major_name_en ?? r.major_name ?? '').trim(),
      riskLevel: levelOf(r.risk_level), riskScore: Number(r.risk_score ?? 0), topFactors: tf.map(f => f.label), topFactorsEn: tf.map(f => f.id), trend: 'stable',
      categories: cats, categoryScores: Object.fromEntries(tf.map(f => [f.id.split('-')[0], levelOf(f.level)])) as AtRiskStudent['categoryScores'],
    };
  });
}

export function warningsFrom(rows: RosterRow[], factors: Record<string, { id: string; label: string; level: number; evidence?: string }[]>, computedAt: string | null): EarlyWarning[] {
  const out: EarlyWarning[] = [];
  for (const r of rows) {
    if ((r.risk_level ?? 0) < 2) continue;
    for (const f of (factors[r.student_id] ?? []).filter(f => f.level >= 2).slice(0, 2)) {
      out.push({
        id: `${r.student_id}-${f.id}`, studentName: r.student_name ?? r.student_id, studentNameEn: r.student_name_en ?? r.student_id, studentId: r.student_id,
        triggerAr: `${f.label}: ${f.evidence ?? ''}`.trim(), triggerEn: `${f.id}: ${f.evidence ?? ''}`.trim(), category: f.id.split('-')[0],
        severity: levelOf(r.risk_level), timestamp: computedAt ?? new Date().toISOString(), acknowledged: false, escalated: (r.risk_level ?? 0) >= 3,
      });
    }
  }
  return out;
}
