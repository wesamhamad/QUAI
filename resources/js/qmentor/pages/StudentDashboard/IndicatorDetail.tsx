import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Minus,
  Calendar,
  MessageCircle,
  Lightbulb,
  ChevronRight,
  ChevronLeft,
  Activity,
  BookOpen,
  ClipboardList,
  GraduationCap,
  ShieldAlert,
  BarChart3,
  FileText,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import {
  useStudentProfile,
  useAbsences,
  useAcademicTransactions,
  useWarnings,
  useHaltReasons,
  usePenalties,
  useCurrentCourses,
  useRiskMe,
} from '../../hooks/useStudentData';
import { useQueries } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import { toElapsedWeeks, weeksElapsed } from '../../lib/term';
import { mockFaisal } from '../DigitalTwin/data/mockFaisal';
import DigitalRecordFrame from '../DigitalTwin/components/DigitalRecordFrame';

// ── Types ─────────────────────────────────────────────────────────────

type Severity = 'low' | 'medium' | 'high' | 'critical';

interface ContextualEvent {
  date: string;
  descriptionAr: string;
  descriptionEn: string;
}

interface Indicator {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  value: string;
  numericValue: number;
  unit: string;
  severity: Severity;
  weeklyData: number[];
  weekLabelsAr: string[];
  weekLabelsEn: string[];
  /** What one point on the trend line is. Default: a week of the running term. */
  trendUnit?: 'week' | 'semester';
  thresholds: { low: number; medium: number; high: number; critical: number; max: number };
  /** Set when nothing has been measured yet this term — the indicator shows this
   *  note instead of a value, a trend badge and a gauge position. */
  awaitingDataAr?: string;
  awaitingDataEn?: string;
  contextualEvents: ContextualEvent[];
  icon: typeof Activity;
}

// ── Server risk evaluation (31 indicators) → this page's Indicator shape ──

interface EngineIndicatorRow {
  id: string;
  label: string;
  category: string;
  available: boolean;
  level: number | null;
  value: number | boolean | null;
  evidence: string;
}

interface EngineRiskDetail {
  scored: boolean;
  computed_at: string;
  indicators: EngineIndicatorRow[];
  indicator_history: Record<string, { at: string; value: number | boolean | null; level: number | null }[]>;
  thresholds: Record<string, { dir: 'up' | 'down'; bands: (number | string)[]; unit: string }>;
}

const LEVEL_NAMES: Severity[] = ['low', 'medium', 'high', 'critical'];

const categoryLabel: Record<string, [string, string]> = {
  A: ['الحضور', 'Attendance'], G: ['الأداء الأكاديمي', 'Grades'], S: ['الواجبات', 'Assignments'],
  E: ['التفاعل مع المنصة', 'LMS Engagement'], AC: ['الوضع الأكاديمي', 'Academic Standing'],
  R: ['سلوك التسجيل', 'Registration'], T: ['الاختبارات', 'Exams'], C: ['مؤشرات مركّبة', 'Compound'], P: ['مسار التخرج', 'Graduation Path'],
};

const categoryIconMap: Record<string, typeof Activity> = {
  A: Calendar, G: BarChart3, S: ClipboardList, E: Activity, AC: ShieldAlert, R: FileText, T: GraduationCap, C: AlertTriangle, P: GraduationCap,
};

/** Only measured indicators are shown; a gap (E-02, R-01 …) is a line in the doc, not an empty card. */
function indicatorsFromEngine(e: EngineRiskDetail): Indicator[] {
  return e.indicators
    .filter(i => i.available && i.level !== null)
    .map(i => {
      const th = e.thresholds[i.id];
      const bands = (th?.bands ?? []).map(b => (typeof b === 'number' ? b : NaN));
      const numeric = typeof i.value === 'number' ? i.value : typeof i.value === 'boolean' ? (i.value ? 1 : 0) : (i.level ?? 0);
      const up = th?.dir !== 'down';
      const [m, h, c] = bands;
      const thresholds = up
        ? { low: 0, medium: m || 1, high: h || 2, critical: c || 3, max: Math.max(c || 3, numeric) * 1.25 }
        : { low: 0, medium: c || 0, high: h || 0, critical: m || 0, max: Math.max(m || 1, numeric) * 1.25 };
      const trail = (e.indicator_history[i.id] ?? []).map(x => (typeof x.value === 'number' ? x.value : typeof x.value === 'boolean' ? (x.value ? 1 : 0) : 0));
      const labels = (e.indicator_history[i.id] ?? []).map(x => x.at.slice(5, 10));
      const [catAr, catEn] = categoryLabel[i.category] ?? [i.category, i.category];
      return {
        id: i.id,
        nameAr: i.label,
        nameEn: i.id,
        categoryAr: catAr,
        categoryEn: catEn,
        value: typeof i.value === 'boolean' ? (i.value ? 'نعم' : 'لا') : `${Math.round(numeric * 100) / 100}${th?.unit ?? ''}`,
        numericValue: numeric,
        unit: th?.unit ?? '',
        severity: LEVEL_NAMES[i.level ?? 0],
        weeklyData: trail.length ? trail : [numeric],
        weekLabelsAr: labels.length ? labels : [e.computed_at.slice(5, 10)],
        weekLabelsEn: labels.length ? labels : [e.computed_at.slice(5, 10)],
        thresholds,
        contextualEvents: [{ date: e.computed_at.slice(0, 10), descriptionAr: i.evidence, descriptionEn: i.evidence }],
        icon: categoryIconMap[i.category] ?? Activity,
      };
    });
}

// ── Mock Data ─────────────────────────────────────────────────────────

/**
 * The fallback indicators — فيصل خالد محمد (443211517), the one live
 * student, so this page never contradicts her digital twin.
 *
 * These used to be a computer-science student's numbers (CS101, MATH201,
 * PHYS101, GPA 2.45 of 4, absence rising to 18%, 30% missing assignments) —
 * a person who does not exist, shown to an accounting student with a 4.83 GPA
 * whose only real flag is attendance. Every figure below now comes from the
 * same two sources her twin is built on (mockFaisal.ts and the SIS fixture):
 *   · absence, cut to the running term 481: two missed sessions in week one
 *     (ACCT354 on Tuesday, ISPM356 on Wednesday) at 3% each, the other three
 *     courses clean → 1% mean, against the 25% deprivation bar
 *   · assignment submission 98% → 2% missing
 *   · GPA 4.83 of 5, held across eight graded semesters
 *
 * Weeks and dates are relative to the running term, not a fixed April: a page
 * opened in week 2 shows two weeks and events from the last few days.
 */

/** A date this many days back, as YYYY-MM-DD — events stay inside the term. */
const dAgo = (n: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

/** Week series and their labels, cut to the weeks the term has actually run. */
const weekly = (values: number[]) => toElapsedWeeks(values);
const weekLabels = (values: number[], en = false) =>
  toElapsedWeeks(values).map((_, i) => (en ? `Week ${i + 1}` : `الأسبوع ${i + 1}`));

/**
 * TEMPORARY — read the fixture picture for absence instead of the live SIS feed.
 *
 * The running term's SIS rows disagree with every other screen: one absence in
 * ACCT363, a course she is not registered in this term, against the two the
 * fixture and her twin both hold (ACCT354 on Tuesday, ISPM356 on Wednesday,
 * week one). Until that feed is reconciled the board must not contradict
 * itself, so A-01 keeps the consistent picture. Flip to false to go back to
 * the live feed.
 */
const USE_FIXTURE_ABSENCES = true;

const mockIndicators: Indicator[] = [
  {
    id: 'A-01',
    nameAr: 'نسبة الغياب',
    nameEn: 'Absence Rate',
    categoryAr: 'الانخراط',
    categoryEn: 'Engagement',
    value: '1%',
    numericValue: 1,
    unit: '%',
    severity: 'low',
    weeklyData: weekly([0, 1, 1, 1]),
    weekLabelsAr: weekLabels([0, 1, 1, 1]),
    weekLabelsEn: weekLabels([0, 1, 1, 1], true),
    thresholds: { low: 0, medium: 10, high: 15, critical: 25, max: 35 },
    contextualEvents: [
      { date: dAgo(7), descriptionAr: 'غياب عن ACCT354 — الثلاثاء، الأسبوع الأول (الغياب في المقرر 3%)', descriptionEn: 'Missed ACCT354 — Tuesday, week one (3% absence in this course)' },
      { date: dAgo(6), descriptionAr: 'غياب عن ISPM356 — الأربعاء، الأسبوع الأول (الغياب في المقرر 3%)', descriptionEn: 'Missed ISPM356 — Wednesday, week one (3% absence in this course)' },
    ],
    icon: Calendar,
  },
  {
    id: 'G-02',
    nameAr: 'متوسط الاختبارات',
    nameEn: 'Exam Average',
    categoryAr: 'الأداء الأكاديمي',
    categoryEn: 'Academic Performance',
    value: '0',
    numericValue: 0,
    unit: '',
    severity: 'low',
    weeklyData: [],
    weekLabelsAr: [],
    weekLabelsEn: [],
    thresholds: { low: 70, medium: 55, high: 40, critical: 25, max: 100 },
    awaitingDataAr: 'لم يتم عقد أي اختبار بعد — الفصل في أسبوعه الثاني',
    awaitingDataEn: 'No exam has been held yet — the term is in week two',
    contextualEvents: [],
    icon: BookOpen,
  },
  {
    id: 'G-04',
    nameAr: 'المعدل التراكمي',
    nameEn: 'Cumulative GPA',
    categoryAr: 'الأداء الأكاديمي',
    categoryEn: 'Academic Performance',
    value: '4.83',
    numericValue: 4.83,
    unit: 'GPA',
    severity: 'low',
    // The GPA does not move week to week — it moves term to term. The series
    // is the digital twin's own (mockFaisal.semesterGPAs): the same eight graded
    // terms, the same numbers, labelled by the term code the twin labels them
    // with, so the two screens cannot disagree. Not passed through weekly():
    // clamping a term series to the weeks elapsed in the running term is what
    // flattened it to «الأسبوع 1 / الأسبوع 2».
    trendUnit: 'semester',
    weeklyData: mockFaisal.semesterGPAs.map(s => s.gpa),
    weekLabelsAr: mockFaisal.semesterGPAs.map(s => s.semester),
    weekLabelsEn: mockFaisal.semesterGPAs.map(s => s.semesterEn || s.semester),
    // Out of 5, the Qassim scale — the old thresholds were a 4-point scale.
    thresholds: { low: 4.5, medium: 3.75, high: 2.75, critical: 2.0, max: 5.0 },
    contextualEvents: [
      { date: dAgo(9), descriptionAr: 'المعدل 4.83 من 5 مستقر عبر ثمانية فصول مرصودة', descriptionEn: 'GPA 4.83 of 5, stable across eight graded semesters' },
    ],
    icon: GraduationCap,
  },
  {
    id: 'S-01',
    nameAr: 'الواجبات المفقودة',
    nameEn: 'Missing Assignments',
    categoryAr: 'التسليمات',
    categoryEn: 'Submissions',
    value: '0',
    numericValue: 0,
    unit: '',
    severity: 'low',
    weeklyData: [],
    weekLabelsAr: [],
    weekLabelsEn: [],
    thresholds: { low: 0, medium: 15, high: 25, critical: 40, max: 50 },
    awaitingDataAr: 'لا توجد واجبات مرفوعة بعد — الفصل في أسبوعه الثاني',
    awaitingDataEn: 'No assignments posted yet — the term is in week two',
    contextualEvents: [],
    icon: ClipboardList,
  },
  {
    id: 'G-07',
    nameAr: 'مسار الأداء',
    nameEn: 'Performance Trajectory',
    categoryAr: 'الأداء الأكاديمي',
    categoryEn: 'Academic Performance',
    value: 'مستقر',
    numericValue: 88,
    unit: '',
    severity: 'low',
    weeklyData: weekly([88, 87, 88, 88]),
    weekLabelsAr: weekLabels([88, 87, 88, 88]),
    weekLabelsEn: weekLabels([88, 87, 88, 88], true),
    thresholds: { low: 80, medium: 70, high: 55, critical: 40, max: 100 },
    contextualEvents: [
      { date: dAgo(2), descriptionAr: 'الاتجاه العام: أداء مستقر — الخطر من الحضور لا من الدرجات', descriptionEn: 'Trend: stable performance — the risk is attendance, not grades' },
    ],
    icon: BarChart3,
  },
  {
    id: 'AC-01',
    nameAr: 'الإنذارات الأكاديمية',
    nameEn: 'Academic Warnings',
    categoryAr: 'المخاطر الأكاديمية',
    categoryEn: 'Academic Risks',
    value: '0',
    numericValue: 0,
    unit: '',
    severity: 'low',
    weeklyData: weekly([0, 0, 0, 0]),
    weekLabelsAr: weekLabels([0, 0, 0, 0]),
    weekLabelsEn: weekLabels([0, 0, 0, 0], true),
    thresholds: { low: 0, medium: 1, high: 2, critical: 3, max: 4 },
    contextualEvents: [
      {
        date: new Date().toISOString().slice(0, 10),
        descriptionAr: 'لا توجد إنذارات أو إيقافات أو عقوبات مسجّلة',
        descriptionEn: 'No warnings, halts, or penalties on record',
      },
    ],
    icon: ShieldAlert,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────

const severityConfig: Record<Severity, { color: string; bg: string; border: string; labelAr: string; labelEn: string }> = {
  low:      { color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-200 dark:border-emerald-800', labelAr: 'منخفض', labelEn: 'Low' },
  medium:   { color: 'text-amber-700 dark:text-amber-400',    bg: 'bg-amber-50 dark:bg-amber-950/40',    border: 'border-amber-200 dark:border-amber-800',    labelAr: 'متوسط', labelEn: 'Medium' },
  high:     { color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-950/40',         border: 'border-red-200 dark:border-red-800',         labelAr: 'مرتفع', labelEn: 'High' },
  critical: { color: 'text-red-800 dark:text-red-300',         bg: 'bg-red-100 dark:bg-red-950/60',        border: 'border-red-300 dark:border-red-700',         labelAr: 'حرج',   labelEn: 'Critical' },
};

const severityFill: Record<Severity, string> = {
  low: '#25935F',
  medium: '#F5BD02',
  high: '#F04438',
  critical: '#D92D20',
};

function getTrendDirection(data: number[]): 'up' | 'down' | 'flat' {
  if (data.length < 2) return 'flat';
  const last = data[data.length - 1];
  const prev = data[data.length - 2];
  if (last > prev) return 'up';
  if (last < prev) return 'down';
  return 'flat';
}

// ── Threshold Gauge Component ─────────────────────────────────────────

function ThresholdGauge({ indicator, t }: { indicator: Indicator; t: (ar: string, en: string) => string }) {
  const { thresholds, numericValue } = indicator;
  const { max } = thresholds;

  // For GPA-like indicators where lower thresholds mean worse (inverted)
  const isInverted = indicator.id === 'G-02' || indicator.id === 'G-04' || indicator.id === 'G-07';

  const segments = isInverted
    ? [
        { label: t('حرج', 'Critical'), start: 0, end: thresholds.critical, color: '#D92D20' },
        { label: t('مرتفع', 'High'),    start: thresholds.critical, end: thresholds.high, color: '#F04438' },
        { label: t('متوسط', 'Medium'),   start: thresholds.high, end: thresholds.medium, color: '#F5BD02' },
        { label: t('منخفض', 'Low'),      start: thresholds.medium, end: thresholds.low, color: '#25935F' },
        { label: '',                      start: thresholds.low, end: max, color: '#D1FAE5' },
      ]
    : [
        { label: t('منخفض', 'Low'),      start: thresholds.low, end: thresholds.medium, color: '#25935F' },
        { label: t('متوسط', 'Medium'),   start: thresholds.medium, end: thresholds.high, color: '#F5BD02' },
        { label: t('مرتفع', 'High'),     start: thresholds.high, end: thresholds.critical, color: '#F04438' },
        { label: t('حرج', 'Critical'),   start: thresholds.critical, end: max, color: '#D92D20' },
      ];

  const markerPercent = Math.min(Math.max((numericValue / max) * 100, 2), 98);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {t('مقياس المستوى', 'Threshold Gauge')}
      </h3>

      {/* Gauge bar */}
      <div className="relative">
        <div className="flex h-5 rounded-lg overflow-hidden">
          {segments.map((seg, i) => {
            const widthPercent = ((seg.end - seg.start) / max) * 100;
            return (
              <div
                key={i}
                style={{ width: `${widthPercent}%`, backgroundColor: seg.color }}
                className="relative transition-all"
              />
            );
          })}
        </div>

        {/* Marker — the segments are laid out by flex, so under RTL they run
            right-to-left; a physical `left` put the needle at the mirror image
            of its own value (4.83/5 landing under «حرج»). `insetInlineStart`
            follows the same direction as the bar, and a zero-width centring
            box needs no translate. */}
        <div
          className="absolute top-0 w-0 flex flex-col items-center"
          style={{ insetInlineStart: `${markerPercent}%` }}
        >
          <div className="w-0.5 h-5 bg-gray-900 dark:bg-white" />
          <div className="mt-1 w-3 h-3 rotate-45 bg-gray-900 dark:bg-white rounded-sm -translate-y-0.5" />
        </div>
      </div>

      {/* Labels under segments */}
      <div className="flex text-[10px] text-gray-500 dark:text-gray-400">
        {segments.filter(s => s.label).map((seg, i) => {
          const widthPercent = ((seg.end - seg.start) / max) * 100;
          return (
            <div key={i} style={{ width: `${widthPercent}%` }} className="text-center truncate">
              {seg.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── SVG Trend Chart Component ─────────────────────────────────────────

function TrendChart({ indicator, t }: { indicator: Indicator; t: (ar: string, en: string) => string }) {
  const { weeklyData } = indicator;

  // A week-indexed series is cut to the weeks the term has actually lived
  // (toElapsedWeeks). Two weeks in, that leaves two identical points, and a
  // flat segment between them reads as a measured trend when nothing has been
  // measured yet. Say so instead — the semester series (G-04) is unaffected.
  const weeks = weeksElapsed();
  if (indicator.trendUnit !== 'semester' && weeklyData.length < 3) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {t('اتجاه الأسابيع', 'Weekly Trend')}
        </h3>
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            {weeks !== null
              ? t(`لا يوجد اتجاه بعد — الفصل في أسبوعه ${weeks}.`, `No trend yet — the term is in week ${weeks}.`)
              : t('لا يوجد اتجاه بعد — الفصل في بدايته.', 'No trend yet — the term has just started.')}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('يظهر الخط بعد ثلاثة أسابيع من الرصد.', 'The line appears after three weeks of observation.')}
          </p>
        </div>
      </div>
    );
  }
  const labels = t(indicator.weekLabelsAr.join(','), indicator.weekLabelsEn.join(',')).split(',');

  const svgW = 360;
  const svgH = 160;
  const padXStart = 52;
  const padXEnd = 24;
  const padTop = 20;
  const padBottom = 30;
  const chartW = svgW - padXStart - padXEnd;
  const chartH = svgH - padTop - padBottom;

  const dataMin = Math.min(...weeklyData);
  const dataMax = Math.max(...weeklyData);
  const isGPA = indicator.unit === 'GPA';
  // Snap bounds to clean numbers so gridline labels don't collide with data values.
  // GPA → nearest 0.5 with breathing room; counts → 15% padding.
  const minVal = isGPA
    ? Math.max(0, Math.floor((dataMin - 0.25) * 2) / 2)
    : dataMin - (dataMax - dataMin) * 0.15;
  const maxVal = isGPA
    ? Math.ceil((dataMax + 0.25) * 2) / 2
    : dataMax + (dataMax - dataMin) * 0.15;
  const range = maxVal - minVal || 1;
  const tickPositions = isGPA ? [0, 0.5, 1] : [0, 0.25, 0.5, 0.75, 1];

  const points = weeklyData.map((v, i) => ({
    x: padXStart + (i / (weeklyData.length - 1)) * chartW,
    y: padTop + chartH - ((v - minVal) / range) * chartH,
    value: v,
  }));

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const strokeColor = severityFill[indicator.severity];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {indicator.trendUnit === 'semester'
          ? t(`اتجاه المعدل عبر ${indicator.weeklyData.length} فصول مرصودة`, `GPA across ${indicator.weeklyData.length} graded semesters`)
          : t('اتجاه 4 أسابيع', '4-Week Trend')}
      </h3>
      <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full" aria-label={t('رسم بياني للاتجاه', 'Trend chart')}>
        {/* Grid lines */}
        {tickPositions.map((pct) => {
          const y = padTop + chartH - pct * chartH;
          const val = (minVal + pct * range).toFixed(isGPA ? 1 : 0);
          return (
            <g key={pct}>
              <line x1={padXStart} y1={y} x2={svgW - padXEnd} y2={y} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeWidth={0.5} />
              <text x={padXStart - 8} y={y + 3} textAnchor="end" className="fill-gray-400 dark:fill-gray-500" fontSize={9}>{val}</text>
            </g>
          );
        })}

        {/* Line */}
        <path d={pathD} fill="none" stroke={strokeColor} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Area fill */}
        <path
          d={`${pathD} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`}
          fill={strokeColor}
          opacity={0.08}
        />

        {/* Dots + labels */}
        {points.map((p, i) => {
          const isFirst = i === 0;
          const isLast = i === points.length - 1;
          const labelX = isFirst ? p.x + 4 : isLast ? p.x - 4 : p.x;
          const labelAnchor = isFirst ? 'start' : isLast ? 'end' : 'middle';
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={4} fill={strokeColor} />
              <circle cx={p.x} cy={p.y} r={2} fill="white" />
              <text x={labelX} y={p.y - 10} textAnchor={labelAnchor} className="fill-gray-700 dark:fill-gray-300" fontSize={10} fontWeight={600}>
                {/* Two decimals at most — a computed percentage otherwise
                    prints its full float (0.7799999999999998). */}
                {indicator.unit === 'GPA' ? p.value.toFixed(2) : Number(p.value.toFixed(2))}
              </text>
              <text x={p.x} y={svgH - 6} textAnchor="middle" className="fill-gray-400 dark:fill-gray-500" fontSize={8}>
                {labels[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────

interface AbsenceCourse {
  cource_code?: string;
  cource_name?: string;
  course_code?: string;
  course_name?: string;
  absence_all_percent?: number | string;
  absences?: Array<{
    absence_date?: string;
    absence_excused?: number | string;
  }>;
}

interface ProfileData {
  profile?: { name?: string; academic?: { cumulative_gpa?: number | string; last_recorded_gpa?: number | string; academic_status?: string } };
  academic?: { cumulative_gpa?: number | string; last_recorded_gpa?: number | string; academic_status?: string };
}

interface TransactionSemester {
  semester?: string;
  semester_gpa?: number | string;
}

interface WarningsResponse {
  student_id?: string;
  warning_count?: number;
}

interface HaltRecord {
  halted_reason?: string;
  reason_no?: number | string;
  entry_date?: string;
  semester?: string;
}

interface PenaltyRecord {
  penalty_desc?: string;
  penalty_code?: string;
  semester?: string;
  entry_date?: string;
}

// ── Blackboard content helpers (used by S-01 + G-02) ────────────────────

interface BBContentItem {
  id?: string;
  title?: string;
  type?: string;
  contentHandler?: { id?: string };
  children?: BBContentItem[] | null;
}

interface CurrentCourseShape {
  course_code?: string;
  course_name?: string;
  external_id?: string;
  bb_course_id?: string;
}

const isAssignmentTitle = (t: string): boolean =>
  /(واجب|تكليف|مهمة|assignment|hw|homework)/i.test(t);

const isExamTitle = (t: string): boolean =>
  /(اختبار|كويز|نصفي|midterm|quiz|exam|test)/i.test(t);

/** Flatten a content tree into a single list. */
function flattenContent(items: BBContentItem[] | null | undefined): BBContentItem[] {
  if (!items) return [];
  const out: BBContentItem[] = [];
  for (const it of items) {
    out.push(it);
    if (it.children && it.children.length > 0) out.push(...flattenContent(it.children));
  }
  return out;
}

/** Per-course bag of items classified by title heuristic. */
interface ClassifiedContent {
  courseCode: string;
  courseName: string;
  assignments: BBContentItem[];
  exams: BBContentItem[];
}

function classifyContents(courses: CurrentCourseShape[], contentResults: Array<{ data?: BBContentItem[] | null }>): ClassifiedContent[] {
  return courses.map((c, i) => {
    const items = flattenContent(contentResults[i]?.data ?? null);
    return {
      courseCode: String(c.course_code ?? ''),
      courseName: String(c.course_name ?? ''),
      assignments: items.filter(it => isAssignmentTitle(it.title ?? '')),
      exams:       items.filter(it => isExamTitle(it.title ?? '')),
    };
  });
}

/** S-01 — visible assignments per course, with the assignment titles as events. */
function overrideAssignmentsIndicator(base: Indicator, classified: ClassifiedContent[] | null): Indicator {
  if (!classified || classified.length === 0) return base;
  // Nothing submitted yet this term — published Blackboard assignments are not
  // the student's own submissions, and their synthetic ramp is not a trend.
  if (base.awaitingDataAr) return base;

  const total = classified.reduce((a, c) => a + c.assignments.length, 0);

  // Headline metric: count of assignments visible across all current courses.
  // Severity reflects load — many visible assignments => higher engagement need.
  const severity: Severity = total >= 12 ? 'high' : total >= 6 ? 'medium' : 'low';

  const events: ContextualEvent[] = [];
  for (const c of classified) {
    for (const item of c.assignments.slice(0, 3)) {
      events.push({
        date: '',
        descriptionAr: `${c.courseCode} — ${item.title || 'بدون عنوان'}`,
        descriptionEn: `${c.courseCode} — ${item.title || 'Untitled'}`,
      });
    }
  }

  return {
    ...base,
    nameAr: 'الواجبات المتاحة',
    nameEn: 'Visible Assignments',
    value: String(total),
    numericValue: total,
    unit: '',
    severity,
    weeklyData: [Math.max(0, total - 6), Math.max(0, total - 4), Math.max(0, total - 2), total],
    contextualEvents: events.length > 0 ? events.slice(0, 6) : [{
      date: new Date().toISOString().slice(0, 10),
      descriptionAr: 'لا توجد واجبات منشورة في Blackboard حالياً',
      descriptionEn: 'No assignments published on Blackboard yet',
    }],
  };
}

/** G-02 — visible exams/quizzes per course, with their titles as events.
 *  Live scores require Blackboard 3LO so the value is the visible count, not an average. */
function overrideExamsIndicator(base: Indicator, classified: ClassifiedContent[] | null): Indicator {
  if (!classified || classified.length === 0) return base;
  // Nothing sat yet this term — a count of published Blackboard items is not
  // an exam average, and its synthetic ramp is not a trend.
  if (base.awaitingDataAr) return base;

  const total = classified.reduce((a, c) => a + c.exams.length, 0);
  const severity: Severity = total >= 8 ? 'high' : total >= 4 ? 'medium' : 'low';

  const events: ContextualEvent[] = [];
  for (const c of classified) {
    for (const item of c.exams.slice(0, 3)) {
      events.push({
        date: '',
        descriptionAr: `${c.courseCode} — ${item.title || 'بدون عنوان'}`,
        descriptionEn: `${c.courseCode} — ${item.title || 'Untitled'}`,
      });
    }
  }

  return {
    ...base,
    value: String(total),
    numericValue: total,
    unit: '',
    severity,
    weeklyData: [Math.max(0, total - 4), Math.max(0, total - 3), Math.max(0, total - 1), total],
    contextualEvents: events.length > 0 ? events.slice(0, 6) : [{
      date: new Date().toISOString().slice(0, 10),
      descriptionAr: 'لا توجد اختبارات منشورة في Blackboard حالياً (الدرجات الحية تتطلب ربط Blackboard)',
      descriptionEn: 'No exams published on Blackboard yet (live scores require Blackboard linking)',
    }],
  };
}

/** Replace mock AC-01 (Academic Warnings) with real probation count, plus
 *  contextual events drawn from halt reasons and disciplinary penalties.
 *  When the API resolves with zero warnings/halts/penalties, we show a clean
 *  "no warnings" state instead of falling back to mock advisory events. */
function overrideWarningsIndicator(
  base: Indicator,
  warnings: WarningsResponse | null,
  halts: HaltRecord[] | null,
  penalties: PenaltyRecord[] | null,
): Indicator {
  // Bail out only when nothing was attempted from the API (all three sources
  // null). If at least one resolved — even with zero rows — that's real data.
  if (warnings == null && halts == null && penalties == null) {
    return base;
  }

  const count = Number(warnings?.warning_count ?? 0);
  const severity: Severity =
    count >= 3 ? 'critical' : count === 2 ? 'high' : count === 1 ? 'medium' : 'low';

  const events: ContextualEvent[] = [];

  for (const h of halts ?? []) {
    const date = String(h.entry_date ?? '').slice(0, 10) || '—';
    const reason = h.halted_reason || `Reason #${h.reason_no ?? ''}`;
    events.push({
      date,
      descriptionAr: `إيقاف: ${reason}`,
      descriptionEn: `Halt: ${reason}`,
    });
  }

  for (const p of penalties ?? []) {
    const date = String(p.entry_date ?? p.semester ?? '').slice(0, 10) || '—';
    const desc = p.penalty_desc || `Code ${p.penalty_code ?? ''}`;
    events.push({
      date,
      descriptionAr: `عقوبة: ${desc}`,
      descriptionEn: `Penalty: ${desc}`,
    });
  }

  // Include a headline event when there are warnings but no halts/penalties.
  if (count > 0 && events.length === 0) {
    events.push({
      date: new Date().toISOString().slice(0, 10),
      descriptionAr: `إجمالي الإنذارات الأكاديمية: ${count}`,
      descriptionEn: `Total academic warnings: ${count}`,
    });
  }

  // Clean state when everything resolved to zero — don't show mock advisory.
  if (count === 0 && events.length === 0) {
    events.push({
      date: new Date().toISOString().slice(0, 10),
      descriptionAr: 'لا توجد إنذارات أو إيقافات أو عقوبات مسجّلة',
      descriptionEn: 'No warnings, halts, or penalties on record',
    });
  }

  return {
    ...base,
    value: String(count),
    numericValue: count,
    severity,
    weeklyData: [0, Math.max(0, count - 2), Math.max(0, count - 1), count],
    contextualEvents: events.slice(0, 6),
  };
}

/** Replace mock A-01 (absence) values with real per-course averages and absence dates. */
function overrideAbsenceIndicator(base: Indicator, absences: AbsenceCourse[] | null): Indicator {
  // The API returned an empty array (or no absence data at all). That's real
  // data — the student has zero absences on record. Show 0% with a clean
  // empty-state event instead of falling back to mock CS101 absences.
  if (!absences || absences.length === 0) {
    return {
      ...base,
      value: '0%',
      numericValue: 0,
      severity: 'low',
      weeklyData: [0, 0, 0, 0],
      contextualEvents: [
        {
          date: new Date().toISOString().slice(0, 10),
          descriptionAr: 'لا توجد حالات غياب مسجّلة',
          descriptionEn: 'No absences on record',
        },
      ],
    };
  }

  const pcts = absences
    .map(c => parseFloat(String(c.absence_all_percent ?? '0')))
    .filter(n => !Number.isNaN(n));
  if (pcts.length === 0) {
    return {
      ...base,
      value: '0%',
      numericValue: 0,
      severity: 'low',
      weeklyData: [0, 0, 0, 0],
      contextualEvents: [{
        date: new Date().toISOString().slice(0, 10),
        descriptionAr: 'لا توجد حالات غياب مسجّلة',
        descriptionEn: 'No absences on record',
      }],
    };
  }

  const avg = pcts.reduce((a, b) => a + b, 0) / pcts.length;

  // Build contextual events from the most recent absence dates across courses
  const recentAbsences: ContextualEvent[] = absences
    .flatMap(c => {
      // The code alone: the course names SIS returns are long enough to wrap
      // the row twice, and the code is what the student's schedule calls it.
      const courseLabel = c.cource_code ?? c.course_code ?? '';
      return (c.absences ?? [])
        .filter(a => a.absence_date)
        .map(a => ({
          date: String(a.absence_date).slice(0, 10),
          descriptionAr: `غياب عن ${courseLabel}${Number(a.absence_excused) ? ' (بعذر)' : ''}`,
          descriptionEn: `Missed ${courseLabel}${Number(a.absence_excused) ? ' (excused)' : ''}`,
        }));
    })
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const severity: Severity =
    avg >= 25 ? 'critical' : avg >= 15 ? 'high' : avg >= 10 ? 'medium' : 'low';

  return {
    ...base,
    value: `${avg.toFixed(0)}%`,
    numericValue: Math.round(avg),
    severity,
    // Rounded to two decimals: the synthetic ramp below is float arithmetic on
    // a percentage, and its raw output (0.7799999999999998) reaches the chart
    // labels.
    weeklyData: (pcts.length >= 4
      ? pcts.slice(0, 4)
      : [Math.max(0, avg - 6), Math.max(0, avg - 4), Math.max(0, avg - 2), avg]
    ).map(v => Math.round(v * 100) / 100),
    contextualEvents: recentAbsences.length > 0 ? recentAbsences : base.contextualEvents,
  };
}

/** Replace mock G-04 (GPA) with real cumulative GPA and semester-by-semester trend. */
function overrideGpaIndicator(
  base: Indicator,
  profile: ProfileData | null,
  transactions: TransactionSemester[] | null,
): Indicator {
  const academic = profile?.profile?.academic ?? profile?.academic ?? null;
  const cumulative = academic
    ? parseFloat(String(academic.last_recorded_gpa ?? academic.cumulative_gpa ?? '0'))
    : 0;
  if (cumulative === 0 && (!transactions || transactions.length === 0)) return base;

  const semesterGpas = (transactions ?? [])
    .map(s => parseFloat(String(s.semester_gpa ?? '0')))
    .filter(n => !Number.isNaN(n) && n > 0);
  // Every graded term, labelled by its own code — the twin's chart exactly.
  // Fewer than two graded terms is not a trend: keep the seeded series.
  const gradedTerms = (transactions ?? [])
    .filter(s => parseFloat(String(s.semester_gpa ?? '0')) > 0)
    .sort((a, b) => String(a.semester ?? '').localeCompare(String(b.semester ?? '')));
  const trendData = semesterGpas.length >= 2
    ? gradedTerms.map(s => parseFloat(String(s.semester_gpa ?? '0')))
    : base.weeklyData;
  const trendLabels = semesterGpas.length >= 2
    ? gradedTerms.map(s => String(s.semester ?? ''))
    : base.weekLabelsAr;

  const severity: Severity =
    cumulative === 0 ? base.severity
    : cumulative >= 3.5 ? 'low'
    : cumulative >= 2.5 ? 'medium'
    : cumulative >= 2.0 ? 'high'
    : 'critical';

  const events: ContextualEvent[] = gradedTerms
    .slice(-3)
    .reverse()
    .map(s => ({
      date: String(s.semester ?? ''),
      descriptionAr: `معدل الفصل ${s.semester ?? ''}: ${parseFloat(String(s.semester_gpa ?? '0')).toFixed(2)}`,
      descriptionEn: `Semester ${s.semester ?? ''} GPA: ${parseFloat(String(s.semester_gpa ?? '0')).toFixed(2)}`,
    }));

  return {
    ...base,
    value: cumulative.toFixed(2),
    numericValue: cumulative,
    severity,
    trendUnit: 'semester',
    weeklyData: trendData,
    weekLabelsAr: trendLabels,
    weekLabelsEn: semesterGpas.length >= 2 ? trendLabels : base.weekLabelsEn,
    contextualEvents: events.length > 0 ? events : base.contextualEvents,
  };
}

export default function IndicatorDetail() {
  const { t, dir } = useLanguage();
  const [searchParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState(searchParams.get('id') ?? mockIndicators[0].id);
  const riskResult = useRiskMe<EngineRiskDetail | null>(null);
  const engine = riskResult.source === 'api' && riskResult.data?.scored ? riskResult.data : null;
  // The two panels that sit beside the indicators rather than being one: the
  // student's own digital record and their own learning-platform loop. Neither
  // takes a student id here — the APIs scope to the viewer.
  const [panel, setPanel] = useState<'indicator' | 'record'>('indicator');

  const profileResult = useStudentProfile<ProfileData | null>(null);
  const absencesResult = useAbsences<AbsenceCourse[] | null>(null);
  const transactionsResult = useAcademicTransactions<TransactionSemester[] | null>(null);
  const warningsResult = useWarnings<WarningsResponse | null>(null);
  const haltsResult = useHaltReasons<HaltRecord[] | null>(null);
  const penaltiesResult = usePenalties<PenaltyRecord[] | null>(null);
  const coursesResult = useCurrentCourses<CurrentCourseShape[] | null>(null);

  // Fan out a Blackboard contents query per current course so S-01 + G-02 can
  // count assignments/exams from the real LMS data. Limited to the first 6
  // courses to avoid hammering the API.
  const courseList = useMemo<CurrentCourseShape[]>(() => {
    if (coursesResult.source !== 'api' || !Array.isArray(coursesResult.data)) return [];
    return coursesResult.data.slice(0, 6);
  }, [coursesResult.source, coursesResult.data]);

  const contentQueries = useQueries({
    queries: courseList.map(c => {
      const id = c.bb_course_id || c.external_id || '';
      return {
        queryKey: ['qmentor', 'course-content', id],
        queryFn: async () => {
          if (!id) return { data: null, source: 'unavailable' as const };
          return apiClient.getCourseContent(id);
        },
        enabled: Boolean(id),
        staleTime: 5 * 60 * 1000,
        retry: false,
      };
    }),
  });

  const classifiedContents: ClassifiedContent[] | null = useMemo(() => {
    if (courseList.length === 0) return null;
    const anyResolved = contentQueries.some(q => q.data && (q.data as { source?: string }).source === 'api');
    if (!anyResolved) return null;
    const normalized = contentQueries.map(q => {
      const r = q.data as { data?: BBContentItem[] | null; source?: string } | undefined;
      return { data: r?.source === 'api' ? (r.data ?? null) : null };
    });
    return classifyContents(courseList, normalized);
  // contentQueries identity changes every render; hash by data payloads to keep this stable.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseList, contentQueries.map(q => q.data).join('|')]);

  const indicators = useMemo<Indicator[]>(() => {
    if (engine) {
      const fromEngine = indicatorsFromEngine(engine);
      if (fromEngine.length) return fromEngine;
    }
    return mockIndicators.map(ind => {
      if (ind.id === 'A-01' && !USE_FIXTURE_ABSENCES && absencesResult.source === 'api') {
        return overrideAbsenceIndicator(ind, absencesResult.data);
      }
      if (ind.id === 'G-04' && (profileResult.source === 'api' || transactionsResult.source === 'api')) {
        return overrideGpaIndicator(
          ind,
          profileResult.source === 'api' ? profileResult.data : null,
          transactionsResult.source === 'api' ? transactionsResult.data : null,
        );
      }
      if (ind.id === 'AC-01' && (
        warningsResult.source === 'api' || haltsResult.source === 'api' || penaltiesResult.source === 'api'
      )) {
        return overrideWarningsIndicator(
          ind,
          warningsResult.source === 'api' ? warningsResult.data : null,
          haltsResult.source === 'api' ? haltsResult.data : null,
          penaltiesResult.source === 'api' ? penaltiesResult.data : null,
        );
      }
      if (ind.id === 'S-01' && classifiedContents) {
        return overrideAssignmentsIndicator(ind, classifiedContents);
      }
      if (ind.id === 'G-02' && classifiedContents) {
        return overrideExamsIndicator(ind, classifiedContents);
      }
      return ind;
    });
  }, [
    engine,
    profileResult.source, profileResult.data,
    absencesResult.source, absencesResult.data,
    transactionsResult.source, transactionsResult.data,
    warningsResult.source, warningsResult.data,
    haltsResult.source, haltsResult.data,
    penaltiesResult.source, penaltiesResult.data,
    classifiedContents,
  ]);

  const selected = indicators.find((ind) => ind.id === selectedId) ?? indicators[0];
  const awaitingData = Boolean(selected.awaitingDataAr && selected.awaitingDataEn);
  const sev = severityConfig[selected.severity];
  const trend = getTrendDirection(selected.weeklyData);
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <div>
      <PageHeader
        title={t('تفاصيل المؤشر', 'Indicator Detail')}
        subtitle={t(
          'عرض تفصيلي لمؤشرات المخاطر مع العتبات والاتجاهات والأحداث السياقية',
          'Detailed view of risk indicators with thresholds, trends, and contextual events'
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('حالة المخاطر', 'My Risk Status'), href: '/risk-analytics' },
          { label: t('تفاصيل المؤشر', 'Indicator Detail') },
        ]}
        accentColor="bg-sa-500"
      />

      {/* ── Indicator Selector Tabs ─────────────────────────── */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1 min-w-max">
          {indicators.map((ind) => {
            const isActive = ind.id === selectedId;
            const Icon = ind.icon;
            const indSev = severityConfig[ind.severity];
            return (
              <button
                key={ind.id}
                onClick={() => { setSelectedId(ind.id); setPanel('indicator'); }}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  isActive && panel === 'indicator'
                    ? 'border-sa-500 text-sa-700 dark:text-sa-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t(ind.nameAr, ind.nameEn)}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${indSev.bg} ${indSev.color}`}>
                  {ind.id}
                </span>
              </button>
            );
          })}

          <button
            onClick={() => setPanel('record')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              panel === 'record'
                ? 'border-sa-500 text-sa-700 dark:text-sa-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{t('السجل الرقمي', 'Digital Record')}</span>
          </button>

          {/* On the student's own board this is not a panel: it hands her over
              to her courses on the learning platform itself. The advisor's
              digital twin keeps the in-page LearningPlatform view. */}
          <a
            href="/qspark/dashboard-student/courses"
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t('منصة التعلم والتجربة الأكاديمية', 'Learning Platform')}</span>
          </a>
        </div>
      </div>

      {panel === 'record' && <DigitalRecordFrame />}

      {/* ── Main Content Grid ───────────────────────────────── */}
      {panel === 'indicator' && (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: Indicator Card + Gauge ──────────────────── */}
        <div className="lg:col-span-1 space-y-6">

          {/* Value Card */}
          <div className={`rounded-xl border ${sev.border} ${sev.bg} p-6 space-y-4`}>
            <div className="flex items-start justify-between">
              <div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  awaitingData
                    ? 'bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600'
                    : `${sev.bg} ${sev.color} ${sev.border}`
                } border`}>
                  {awaitingData ? t('لا توجد بيانات بعد', 'No data yet') : t(sev.labelAr, sev.labelEn)}
                </span>
                <h2 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                  {t(selected.nameAr, selected.nameEn)}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {selected.id} · {t(selected.categoryAr, selected.categoryEn)}
                </p>
              </div>
              <selected.icon className={`w-8 h-8 ${sev.color} opacity-60`} />
            </div>

            {/* Current Value */}
            <div className="text-center py-3">
              <span className={`text-5xl font-extrabold tracking-tight ${awaitingData ? 'text-gray-300 dark:text-gray-600' : sev.color}`}>
                {selected.value}
              </span>
              {selected.unit && !awaitingData && (
                <span className="ms-1 text-lg text-gray-500 dark:text-gray-400">{selected.unit}</span>
              )}
            </div>

            {/* Trend badge — a value that was never measured has no trend */}
            <div className="flex items-center justify-center gap-1.5 text-sm">
              {awaitingData ? (
                <span className="text-gray-500 dark:text-gray-400 font-medium text-center px-2">
                  {t(selected.awaitingDataAr!, selected.awaitingDataEn!)}
                </span>
              ) : trend === 'down' ? (
                <>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-red-600 dark:text-red-400 font-medium">{t('في تراجع', 'Declining')}</span>
                </>
              ) : trend === 'up' ? (
                <>
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">{t('في تحسّن', 'Improving')}</span>
                </>
              ) : (
                <>
                  <Minus className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-500 dark:text-gray-400 font-medium">{t('مستقر', 'Stable')}</span>
                </>
              )}
            </div>
          </div>

          {/* Threshold Gauge — omitted until there is a value to place on it */}
          {!awaitingData && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
              <ThresholdGauge indicator={selected} t={t} />
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              to="/action-plan"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-sa-600 hover:bg-sa-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              <Lightbulb className="w-4 h-4" />
              {t('احصل على مساعدة', 'Get Help')}
              <Chevron className="w-4 h-4" />
            </Link>
            <Link
              to="/chatbot"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-200 rounded-xl font-semibold text-sm transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              {t('تحدّث مع +QSpark', 'Chat with QSpark+')}
              <Chevron className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Right: Chart + Contextual Events ─────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* 4-Week Trend Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
            <TrendChart indicator={selected} t={t} />
          </div>

          {/* Contextual Data List */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${sev.color}`} />
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t('الأحداث السياقية', 'Contextual Events')}
              </h3>
              <span className="ms-auto text-xs text-gray-400 dark:text-gray-500">
                {selected.contextualEvents.length} {t('أحداث', 'events')}
              </span>
            </div>

            <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {selected.contextualEvents.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                  {awaitingData
                    ? t(selected.awaitingDataAr!, selected.awaitingDataEn!)
                    : t('لا توجد أحداث مسجّلة', 'No events recorded')}
                </p>
              )}
              {selected.contextualEvents.map((event, i) => (
                <div key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="shrink-0 mt-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: severityFill[selected.severity] }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {t(event.descriptionAr, event.descriptionEn)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {event.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary insight */}
          <div className={`rounded-xl border p-4 flex items-start gap-3 ${
            awaitingData
              ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
              : `${sev.border} ${sev.bg}`
          }`}>
            <Activity className={`w-5 h-5 shrink-0 mt-0.5 ${awaitingData ? 'text-gray-400' : sev.color}`} />
            <div>
              <p className={`text-sm font-semibold ${awaitingData ? 'text-gray-600 dark:text-gray-300' : sev.color}`}>
                {t('ملخص المؤشر', 'Indicator Summary')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                {awaitingData ? t(
                  `المؤشر ${selected.id} (${selected.nameAr}) — ${selected.awaitingDataAr}. سيظهر المتوسط والاتجاه بعد رصد أول درجة.`,
                  `Indicator ${selected.id} (${selected.nameEn}) — ${selected.awaitingDataEn}. The average and its trend appear once a first score is recorded.`
                ) : t(
                  `المؤشر ${selected.id} (${selected.nameAr}) بقيمة حالية ${selected.value} ومستوى ${sev.labelAr}. يُظهر الاتجاه ${trend === 'down' ? 'تراجعاً' : trend === 'up' ? 'تحسّناً' : 'استقراراً'} خلال الأسابيع الأربعة الماضية. يوجد ${selected.contextualEvents.length} أحداث سياقية مسجّلة.`,
                  `Indicator ${selected.id} (${selected.nameEn}) has a current value of ${selected.value} at ${sev.labelEn} level. The trend shows ${trend === 'down' ? 'a decline' : trend === 'up' ? 'improvement' : 'stability'} over the past 4 weeks. There are ${selected.contextualEvents.length} contextual events recorded.`
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
