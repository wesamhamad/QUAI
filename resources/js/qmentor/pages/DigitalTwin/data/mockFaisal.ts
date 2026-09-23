import type { DigitalTwinData, Course, StudyPlanNode } from '../types';
import { mockStudentList } from './mockStudentList';
import { currentTerm, weeksElapsed, elapsedMonths, toElapsedWeeks } from '../../../lib/term';

/**
 * Everything time-shaped below is dated from the RUNNING term, not from the
 * term this file was first written in. It used to be pinned to 472
 * (registration in January, midterms in March, the absence alert on 13 April)
 * and drew four months of attendance and fourteen weeks of heatmap — a term's
 * worth of history shown in the second week of 481. The percentages are real
 * (the SIS register); only their dates were fiction.
 */
const TERM = currentTerm();
const TERM_START = TERM.starts_on ? new Date(TERM.starts_on + 'T08:00:00') : new Date();
const WEEKS = weeksElapsed() ?? 14;

/** ISO timestamp N days after the term started, clamped to today. */
const fromTermStart = (days: number, time = '09:00:00'): string => {
  const d = new Date(TERM_START);
  d.setDate(d.getDate() + days);
  const now = new Date();
  const at = d > now ? now : d;
  return at.toISOString().slice(0, 10) + 'T' + time;
};

/** ISO timestamp N days ago (never before the term started). */
const daysBack = (days: number, time = '09:00:00'): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const at = d < TERM_START ? TERM_START : d;
  return at.toISOString().slice(0, 10) + 'T' + time;
};

/**
 * فيصل خالد محمد (443211517) — the one live student.
 *
 * Everything here mirrors two real sources, so the twin reads the same
 * whether qu-api answered or this fallback did:
 *  - resources/fixtures/student_layan.json — her SIS snapshot: the five 481
 *    courses with their real instructors, the graded semesters 443–472, the
 *    absence register cut to the running term 481 (starts 2026-08-23): two
 *    missed sessions in week one — ACCT354 on Tuesday and ISPM356 on
 *    Wednesday, 3% each — and ACCT350 / ACCT353 / ACCT355 clean → mean
 *    attendance 99%. The old 15–22.5% figures were a completed term's totals
 *    shown as if they were this week's.
 *  - the published 5ACCT plan (qu.edu.sa/colleges/cbe/programs/
 *    bachelor-in-accounting): 129 hours over 8 levels, no electives.
 *    Levels 1–4 are completed with her transcript grades (plus IC 103 taken
 *    early; ARAB103 still open), level 5 is the running term, 6–8 remain.
 *
 * She is an Accounting student in الأعمال والاقتصاد: nothing in this file may
 * mention a computer-science course. The generic mock student keeps serving
 * the non-live roster rows; this file serves only her.
 */

// Her seed row in the twin list (guarded by StudentFaisalConsistencyTest):
// 4.83 / level 5 / 67 of 129 h / محاسبة. One source, not a second copy.
const layanProfile = mockStudentList.find(s => s.profile.studentId === '443211517')!.profile;

/** The 5ACCT plan, one row per course, statuses from her real transcript. */
const plan: (StudyPlanNode & { level: number; grade?: string; gradePoints?: number })[] = [
  // ── المستوى الأول — completed 452 ──
  { level: 1, code: 'BUS 111', name: 'مبادئ الإدارة والتنظيم', nameEn: 'Principles of Management & Organization', creditHours: 3, status: 'completed', prerequisites: [], category: 'college', grade: 'A+', gradePoints: 5.0 },
  { level: 1, code: 'ECON110', name: 'مبادئ الاقتصاد الجزئي', nameEn: 'Principles of Microeconomics', creditHours: 3, status: 'completed', prerequisites: [], category: 'college', grade: 'A', gradePoints: 4.75 },
  { level: 1, code: 'MATH111', name: 'الرياضيات في العلوم الاجتماعية (1)', nameEn: 'Mathematics for Social Sciences I', creditHours: 3, status: 'completed', prerequisites: [], category: 'college', grade: 'A', gradePoints: 4.75 },
  { level: 1, code: 'MIS 110', name: 'مقدمة في التقنية', nameEn: 'Introduction to Technology', creditHours: 3, status: 'completed', prerequisites: [], category: 'college', grade: 'A+', gradePoints: 5.0 },
  { level: 1, code: 'IC 101', name: 'المدخل إلى الثقافة الإسلامية', nameEn: 'Introduction to Islamic Culture', creditHours: 2, status: 'completed', prerequisites: [], category: 'university', grade: 'A+', gradePoints: 5.0 },
  { level: 1, code: 'ARAB101', name: 'المهارات اللغوية', nameEn: 'Arabic Language Skills', creditHours: 2, status: 'completed', prerequisites: [], category: 'university', grade: 'A', gradePoints: 4.75 },

  // ── المستوى الثاني — completed 455 + 461 ──
  { level: 2, code: 'ACCT120', name: 'مبادئ المحاسبة المالية', nameEn: 'Principles of Financial Accounting', creditHours: 3, status: 'completed', prerequisites: [], category: 'major', grade: 'B', gradePoints: 4.0 },
  { level: 2, code: 'ECON120', name: 'مبادئ الاقتصاد الكلي', nameEn: 'Principles of Macroeconomics', creditHours: 3, status: 'completed', prerequisites: ['ECON110'], category: 'college', grade: 'A', gradePoints: 4.75 },
  { level: 2, code: 'MKTG120', name: 'مبادئ التسويق', nameEn: 'Principles of Marketing', creditHours: 3, status: 'completed', prerequisites: [], category: 'college', grade: 'A+', gradePoints: 5.0 },
  { level: 2, code: 'STAT124', name: 'الإحصاء في الاقتصاد والإدارة (1)', nameEn: 'Statistics for Economics & Management I', creditHours: 3, status: 'completed', prerequisites: [], category: 'college', grade: 'A+', gradePoints: 5.0 },
  { level: 2, code: 'MATH122', name: 'الرياضيات في العلوم الاجتماعية (2)', nameEn: 'Mathematics for Social Sciences II', creditHours: 3, status: 'completed', prerequisites: ['MATH111'], category: 'college', grade: 'A+', gradePoints: 5.0 },

  // ── المستوى الثالث — completed 462 (MIS 231 taken in 461) ──
  { level: 3, code: 'BUS 231', name: 'الاتصالات الإدارية', nameEn: 'Managerial Communication', creditHours: 3, status: 'completed', prerequisites: ['BUS 111'], category: 'college', grade: 'A+', gradePoints: 5.0 },
  { level: 3, code: 'MIS 231', name: 'مقدمة في تطبيقات الحاسب', nameEn: 'Introduction to Computer Applications', creditHours: 3, status: 'completed', prerequisites: ['MIS 110'], category: 'college', grade: 'A+', gradePoints: 5.0 },
  { level: 3, code: 'STAT235', name: 'الإحصاء في الاقتصاد والإدارة (2)', nameEn: 'Statistics for Economics & Management II', creditHours: 3, status: 'completed', prerequisites: ['STAT124'], category: 'college', grade: 'A+', gradePoints: 5.0 },
  { level: 3, code: 'FIN 230', name: 'مبادئ التمويل', nameEn: 'Principles of Finance', creditHours: 3, status: 'completed', prerequisites: ['ACCT120'], category: 'college', grade: 'A+', gradePoints: 5.0 },
  { level: 3, code: 'IC 102', name: 'الإسلام وبناء المجتمع', nameEn: 'Islam & Community Building', creditHours: 2, status: 'completed', prerequisites: ['IC 101'], category: 'university', grade: 'A', gradePoints: 4.75 },
  { level: 3, code: 'ACCT231', name: 'مبادئ المحاسبة الإدارية', nameEn: 'Principles of Managerial Accounting', creditHours: 3, status: 'completed', prerequisites: ['ACCT120'], category: 'major', grade: 'B+', gradePoints: 4.5 },

  // ── المستوى الرابع — completed 465 + 471, except ARAB103 (still open) ──
  { level: 4, code: 'ACCT240', name: 'المحاسبة المتوسطة (1)', nameEn: 'Intermediate Accounting I', creditHours: 3, status: 'completed', prerequisites: ['ACCT120'], category: 'major', grade: 'A', gradePoints: 4.75 },
  { level: 4, code: 'ACCT241', name: 'محاسبة التكاليف', nameEn: 'Cost Accounting', creditHours: 3, status: 'completed', prerequisites: ['ACCT231'], category: 'major', grade: 'A', gradePoints: 4.75 },
  { level: 4, code: 'BUS 240', name: 'السلوك التنظيمي', nameEn: 'Organizational Behavior', creditHours: 3, status: 'completed', prerequisites: ['BUS 111'], category: 'college', grade: 'A', gradePoints: 4.75 },
  { level: 4, code: 'MIS 242', name: 'مقدمة نظم المعلومات الإدارية', nameEn: 'Introduction to MIS', creditHours: 3, status: 'completed', prerequisites: ['MIS 110'], category: 'college', grade: 'A+', gradePoints: 5.0 },
  { level: 4, code: 'POM 241', name: 'إدارة العمليات', nameEn: 'Operations Management', creditHours: 3, status: 'completed', prerequisites: [], category: 'college', grade: 'A', gradePoints: 4.75 },
  { level: 4, code: 'ARAB103', name: 'التحرير العربي', nameEn: 'Arabic Composition', creditHours: 2, status: 'remaining', prerequisites: ['ARAB101'], category: 'university' },

  // ── المستوى الخامس — the running term 481 ──
  { level: 5, code: 'ACCT350', name: 'المحاسبة المتوسطة (2)', nameEn: 'Intermediate Accounting II', creditHours: 3, status: 'in-progress', prerequisites: ['ACCT240'], category: 'major' },
  { level: 5, code: 'ACCT353', name: 'نظم المعلومات المحاسبية', nameEn: 'Accounting Information Systems', creditHours: 3, status: 'in-progress', prerequisites: ['ACCT120', 'MIS 242'], category: 'major' },
  { level: 5, code: 'ACCT354', name: 'المحاسبة الحكومية والمنظمات غير الهادفة للربح', nameEn: 'Governmental & Non-Profit Accounting', creditHours: 3, status: 'in-progress', prerequisites: ['ACCT240'], category: 'major' },
  { level: 5, code: 'ACCT355', name: 'الزكاة والمحاسبة الضريبية', nameEn: 'Zakat & Tax Accounting', creditHours: 3, status: 'in-progress', prerequisites: ['ACCT120'], category: 'major' },
  { level: 5, code: 'ISPM356', name: 'القانون التجاري السعودي', nameEn: 'Saudi Commercial Law', creditHours: 3, status: 'in-progress', prerequisites: [], category: 'college' },

  // ── المستوى السادس — IC 103 already banked in 471 ──
  { level: 6, code: 'ACCT360', name: 'المحاسبة المالية المتقدمة', nameEn: 'Advanced Financial Accounting', creditHours: 3, status: 'remaining', prerequisites: ['ACCT350'], category: 'major' },
  { level: 6, code: 'ACCT361', name: 'المحاسبة الإدارية المتقدمة', nameEn: 'Advanced Managerial Accounting', creditHours: 3, status: 'remaining', prerequisites: ['ACCT231'], category: 'major' },
  { level: 6, code: 'ACCT362', name: 'المراجعة الداخلية', nameEn: 'Internal Auditing', creditHours: 3, status: 'remaining', prerequisites: ['ACCT240'], category: 'major' },
  { level: 6, code: 'ACCT363', name: 'تطبيقات الحاسب الآلي في المحاسبة', nameEn: 'Computer Applications in Accounting', creditHours: 3, status: 'remaining', prerequisites: ['ACCT353'], category: 'major' },
  { level: 6, code: 'ACCT474', name: 'حلقة بحث في المحاسبة', nameEn: 'Accounting Research Seminar', creditHours: 3, status: 'remaining', prerequisites: ['ACCT350'], category: 'major' },
  { level: 6, code: 'IC 103', name: 'النظام الاقتصادي في الإسلام', nameEn: 'Economic System of Islam', creditHours: 2, status: 'completed', prerequisites: ['IC 102'], category: 'university', grade: 'A+', gradePoints: 5.0 },

  // ── المستوى السابع ──
  { level: 7, code: 'ACCT365', name: 'تحليل التقارير المالية', nameEn: 'Financial Statement Analysis', creditHours: 3, status: 'remaining', prerequisites: ['ACCT350'], category: 'major' },
  { level: 7, code: 'ACCT471', name: 'مواضيع متخصصة في المحاسبة', nameEn: 'Special Topics in Accounting', creditHours: 3, status: 'remaining', prerequisites: ['ACCT350'], category: 'major' },
  { level: 7, code: 'BUS 488', name: 'الإدارة الاستراتيجية', nameEn: 'Strategic Management', creditHours: 3, status: 'remaining', prerequisites: ['BUS 111'], category: 'college' },
  { level: 7, code: 'FIN 360', name: 'تمويل المنشآت', nameEn: 'Corporate Finance', creditHours: 3, status: 'remaining', prerequisites: ['FIN 230'], category: 'college' },
  { level: 7, code: 'IC 104', name: 'أسس النظام السياسي في الإسلام', nameEn: 'Political System of Islam', creditHours: 2, status: 'remaining', prerequisites: ['IC 103'], category: 'university' },
  { level: 7, code: 'ENG 101', name: 'اللغة الإنجليزية (1)', nameEn: 'English Language I', creditHours: 3, status: 'remaining', prerequisites: [], category: 'university' },

  // ── المستوى الثامن ──
  { level: 8, code: 'ACCT481', name: 'المحاسبة الدولية', nameEn: 'International Accounting', creditHours: 3, status: 'remaining', prerequisites: ['ACCT360'], category: 'major' },
  { level: 8, code: 'ECON484', name: 'تحليل جدوى المشروعات', nameEn: 'Project Feasibility Analysis', creditHours: 3, status: 'remaining', prerequisites: ['ECON110'], category: 'college' },
  { level: 8, code: 'ACCT482', name: 'المراجعة الخارجية', nameEn: 'External Auditing', creditHours: 3, status: 'remaining', prerequisites: ['ACCT362'], category: 'major' },
  { level: 8, code: 'ACCT484', name: 'تأهيل الزمالة المحاسبية', nameEn: 'SOCPA Fellowship Preparation', creditHours: 3, status: 'remaining', prerequisites: ['ACCT360'], category: 'major' },
  { level: 8, code: 'ACCT485', name: 'نظرية المحاسبة', nameEn: 'Accounting Theory', creditHours: 3, status: 'remaining', prerequisites: ['ACCT360'], category: 'major' },
];

/** Her five 481 courses with the fixture's real instructors. */
const currentCourses: Course[] = [
  { code: 'ACCT350', name: 'المحاسبة المتوسطة (2)', nameEn: 'Intermediate Accounting II', creditHours: 3, status: 'in-progress', instructor: 'محمد ماهر عبدالحميد الباز', instructorEn: 'Mohamed Maher Elbaz', contentPreview: 'الأصول غير المتداولة، الالتزامات طويلة الأجل، حقوق الملكية' },
  { code: 'ACCT353', name: 'نظم المعلومات المحاسبية', nameEn: 'Accounting Information Systems', creditHours: 3, status: 'in-progress', instructor: 'بلال نجيب منصور الجراية', instructorEn: 'Bilal Aljraiah', contentPreview: 'الدورات المحاسبية، الرقابة الداخلية، مخططات تدفق البيانات' },
  { code: 'ACCT354', name: 'المحاسبة الحكومية والمنظمات غير الهادفة للربح', nameEn: 'Governmental & Non-Profit Accounting', creditHours: 3, status: 'in-progress', instructor: 'جهان عبد الوهاب احمد غربال', instructorEn: 'Jehan Ghorbal', contentPreview: 'محاسبة الأموال المخصصة، الموازنة الحكومية، تقارير القطاع العام' },
  { code: 'ACCT355', name: 'الزكاة والمحاسبة الضريبية', nameEn: 'Zakat & Tax Accounting', creditHours: 3, status: 'in-progress', instructor: 'حسين محمد النافعابي محمد', instructorEn: 'Hussein Alnafeabi', contentPreview: 'وعاء الزكاة، ضريبة القيمة المضافة، إقرارات هيئة الزكاة والضريبة والجمارك' },
  { code: 'ISPM356', name: 'القانون التجاري السعودي', nameEn: 'Saudi Commercial Law', creditHours: 3, status: 'in-progress', instructor: 'بشرى سليمان محمد العثيم', instructorEn: 'Bushra Alothaim', contentPreview: 'نظام الشركات، الأوراق التجارية، السجل التجاري' },
];

export const mockFaisal: DigitalTwinData = {
  profile: layanProfile,

  // Her graded semesters as SIS codes (443 = صيفي ١٤٤٤ … 472 = ثاني ١٤٤٧).
  // 451 is the prep year's non-GPA term (SIS reports 0 over straight A's)
  // and 481 — the running term — is still ungraded; both stay off the trend
  // line. 472 is her last graded term, so it closes on the 4.83 the SIS
  // reports as her last recorded GPA.
  semesterGPAs: [
    { semester: '443', semesterEn: '443', gpa: 5.0, creditHours: 12 },
    { semester: '452', semesterEn: '452', gpa: 4.88, creditHours: 16 },
    { semester: '455', semesterEn: '455', gpa: 4.88, creditHours: 6 },
    { semester: '461', semesterEn: '461', gpa: 4.75, creditHours: 12 },
    { semester: '462', semesterEn: '462', gpa: 4.86, creditHours: 14 },
    { semester: '465', semesterEn: '465', gpa: 4.75, creditHours: 6 },
    { semester: '471', semesterEn: '471', gpa: 4.86, creditHours: 11 },
    { semester: '472', semesterEn: '472', gpa: 4.83, creditHours: 14 },
  ],

  currentCourses,

  allCourses: plan.map(({ code, name, nameEn, creditHours, status, grade, gradePoints }) => ({
    code, name, nameEn, creditHours, status, grade, gradePoints,
  })),

  studyPlan: plan.map(({ code, name, nameEn, creditHours, status, prerequisites, category }) => ({
    code, name, nameEn, creditHours, status, prerequisites, category,
  })),

  behavioral: {
    lmsLoginFrequency: 6.1,
    assignmentSubmissionRate: 98,
    attendanceRate: 99, // mean of (100 − absence%) over her five courses
    lmsHoursPerWeek: 12.5,
    // Only the months this term has reached, ending on her current 99%.
    attendanceByMonth: (() => {
      const months = elapsedMonths(4);
      const rates = [100, 100, 100, 99];
      return months.map((month, i) => ({
        month,
        rate: rates[rates.length - months.length + i] ?? 99,
      }));
    })(),
    // hours/submissions per course; the three courses with a missed session
    // engage least — two weeks in, the spread is still small
    courseEngagement: [
      { course: 'ACCT350', hours: 4.8, submissions: 8 },
      { course: 'ACCT353', hours: 4.1, submissions: 7 },
      { course: 'ACCT354', hours: 3.1, submissions: 5 },
      { course: 'ACCT355', hours: 3.6, submissions: 6 },
      { course: 'ISPM356', hours: 2.8, submissions: 4 },
    ],
    // 96 classes is a whole term; in week N only N/14 of them have happened.
    // Two absences, both unexcused, both in week one — the same two sessions
    // the heatmap paints and the SIS register lists.
    ...(() => {
      const held = Math.max(5, Math.round((96 / 14) * WEEKS));
      return {
        excusedAbsences: 0,
        unexcusedAbsences: 2,
        totalClasses: held,
      };
    })(),
    // The whole term 481 is drawn, not only what has happened: weeks the term
    // has not reached are `future` (an empty outline), so the grid says «we are
    // in week 2» without a caption. Today is the last recorded day — nothing is
    // painted after it. Her register holds exactly two absences, both in week 1
    // (ACCT354 on Tuesday, ISPM356 on Wednesday); every other held session is
    // present.
    attendanceHeatmap: (() => {
      const totalWeeks = TERM.weeks_total ?? 14;
      const today = new Date();
      // The grid's rows are Sunday…Thursday; JS getDay() is 0=Sunday.
      const todayIndex = Math.min(4, Math.max(0, today.getDay()));
      const absencesWeekOne: Record<number, 'absent-unexcused'> = { 2: 'absent-unexcused', 3: 'absent-unexcused' };

      const entries: { week: number; day: number; status: 'present' | 'absent-excused' | 'absent-unexcused' | 'no-class' | 'future' }[] = [];
      for (let w = 1; w <= totalWeeks; w++) {
        for (let d = 0; d < 5; d++) {
          const isFuture = w > WEEKS || (w === WEEKS && d > todayIndex);
          const status = isFuture
            ? 'future'
            : w === 1 && absencesWeekOne[d]
              ? absencesWeekOne[d]
              : 'present';
          entries.push({ week: w, day: d, status });
        }
      }
      return entries;
    })(),
  },

  // Low risk overall — a 4.83 GPA carries no academic risk, and two weeks in
  // the register holds exactly two missed sessions, both in week one (ACCT354
  // and ISPM356, 3% each), far from the 25% deprivation bar. Nothing financial
  // is outstanding.
  risk: {
    overallScore: 16,
    trend: 'stable',
    categoryScores: [
      { category: 'academic_performance', score: 6, label: 'الأداء الأكاديمي', labelEn: 'Academic Performance' },
      { category: 'engagement', score: 14, label: 'المشاركة', labelEn: 'Engagement' },
      { category: 'financial', score: 6, label: 'المالية', labelEn: 'Financial' },
      { category: 'health_wellness', score: 15, label: 'الصحة والعافية', labelEn: 'Health & Wellness' },
      { category: 'social_integration', score: 22, label: 'التكامل الاجتماعي', labelEn: 'Social Integration' },
      { category: 'course_specific', score: 12, label: 'المقررات', labelEn: 'Course-Specific' },
      { category: 'time_management', score: 18, label: 'إدارة الوقت', labelEn: 'Time Management' },
      { category: 'institutional', score: 10, label: 'المؤسسي', labelEn: 'Institutional' },
      { category: 'external', score: 8, label: 'العوامل الخارجية', labelEn: 'External' },
    ],
    indicators: [
      { id: 'r1', name: 'غياب مبكر يستحق المتابعة', nameEn: 'Early Absence Worth Watching', category: 'course_specific', score: 12, trend: 'stable', description: 'حصتان فائتتان في الأسبوع الأول: المحاسبة الحكومية (ACCT354) والقانون التجاري (ISPM356) — 3% مقابل حد الحرمان 25%', descriptionEn: 'Two missed sessions in week one — ACCT354 and ISPM356, 3% against the 25% deprivation bar' },
      { id: 'r2', name: 'غياب منخفض في بقية المقررات', nameEn: 'Low Absence Elsewhere', category: 'engagement', score: 8, trend: 'stable', description: 'لا غياب في المحاسبة المتوسطة (2) ولا نظم المعلومات المحاسبية ولا الزكاة والمحاسبة الضريبية', descriptionEn: 'ACCT350, ACCT353 and ACCT355 clean' },
      { id: 'r4', name: 'انخفاض المعدل', nameEn: 'GPA Drop', category: 'academic_performance', score: 5, trend: 'stable', description: 'لا يوجد — المعدل 4.83 من 5 مستقر عبر ثمانية فصول', descriptionEn: 'None — her 4.83 GPA has held across eight graded semesters' },
      { id: 'r5', name: 'التفاعل مع المنصة التعليمية', nameEn: 'LMS Engagement', category: 'engagement', score: 12, trend: 'improving', description: 'تسليم منتظم للواجبات وتفاعل جيد مع بلاك بورد', descriptionEn: 'Assignments submitted on time and healthy Blackboard activity' },
      { id: 'r6', name: 'المشاركة في الأنشطة', nameEn: 'Campus Engagement', tooltip: 'مشاركة محدودة في الأنشطة اللاصفية', tooltipEn: 'Limited extracurricular participation', category: 'social_integration', score: 22, trend: 'stable', description: 'مشاركة محدودة في الأنشطة الجامعية خارج المقررات', descriptionEn: 'Limited participation in activities beyond her courses' },
    ],
    // The last seven months up to this one, ending on her current 16.
    history: (() => {
      const scores = [18, 20, 19, 21, 18, 17, 16];
      const now = new Date();
      return scores.map((score, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (scores.length - 1 - i), 1);
        return { date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, score };
      });
    })(),
  },

  recommendations: [
    {
      id: 'rec1', title: 'حافظي على انتظام الحضور من بداية الفصل', titleEn: 'Keep Attendance Clean From Week One',
      description: 'حصتان فائتتان في الأسبوع الأول (المحاسبة الحكومية والقانون التجاري) — 3% مقابل حد الحرمان 25%، ولا غياب منذ ذلك الحين. البداية نظيفة، والانتظام الآن يبقيها كذلك',
      descriptionEn: 'Two missed sessions in week one (ACCT354 and ISPM356) — 3% against the 25% deprivation bar, and none since. The start is clean; staying regular now keeps it that way',
      category: 'academic', priority: 'suggestion',
    },
    {
      id: 'rec2', title: 'جلسة مع المرشدة الأكاديمية', titleEn: 'Session with Your Academic Advisor',
      description: 'جدول الوكيل اجتماع Teams مع المرشدة أمل الحربي لمراجعة خطة الفصل في أسبوعه الأول',
      descriptionEn: 'The agent scheduled a Teams meeting with advisor Amal Al-Harbi to review the term plan in its opening weeks',
      category: 'academic', priority: 'suggestion',
    },
    {
      id: 'rec3', title: 'التسجيل المبكر للمستوى السادس', titleEn: 'Register Early for Level 6',
      description: 'مقررات المستوى السادس (المحاسبة المالية المتقدمة، المراجعة الداخلية، تطبيقات الحاسب في المحاسبة) تُفتح شعبها مبكراً — أضيفي التحرير العربي (ARAB103) المتبقي من المستوى الرابع',
      descriptionEn: 'Level-6 sections (Advanced Financial Accounting, Internal Auditing, Computer Applications in Accounting) fill early — add the outstanding ARAB103 from level 4',
      category: 'academic', priority: 'suggestion',
    },
    {
      id: 'rec4', title: 'التحضير المبكر لزمالة SOCPA', titleEn: 'Start SOCPA Fellowship Prep Early',
      description: 'بمعدل 4.83 في تخصص المحاسبة، الانضمام لنادي المحاسبة والتحضير المبكر لمقرر تأهيل الزمالة (ACCT484) يفتح مسار الزمالة السعودية للمحاسبين القانونيين',
      descriptionEn: 'With a 4.83 GPA in Accounting, joining the Accounting Club and preparing early for ACCT484 opens the SOCPA fellowship track',
      category: 'career', priority: 'suggestion',
    },
  ],

  // Dated from the running term, so the story cannot be a term behind the
  // board it is drawn on: registration on the opening day, the first absences
  // in the days since, and the agent's intervention in the last two days.
  timeline: [
    { id: 't1', type: 'academic', title: 'تسجيل مقررات المستوى الخامس', titleEn: 'Level-5 Registration', description: 'تم تسجيل 5 مقررات بإجمالي 15 ساعة: المحاسبة المتوسطة (2)، نظم المعلومات المحاسبية، المحاسبة الحكومية، الزكاة والمحاسبة الضريبية، القانون التجاري', descriptionEn: 'Registered 5 courses totaling 15 hours: ACCT350, ACCT353, ACCT354, ACCT355 and ISPM356', timestamp: fromTermStart(0, '08:30:00') },
    { id: 't2', type: 'academic', title: 'بدء المحاضرات', titleEn: 'Classes Started', description: 'انتظمت المحاضرات في مقررات المستوى الخامس الخمسة — أول تسليم على بلاك بورد في وقته', descriptionEn: 'Level-5 classes under way across all five courses — first Blackboard submission on time', timestamp: fromTermStart(3, '14:00:00') },
    { id: 't3', type: 'behavioral', title: 'أول غياب في الفصل', titleEn: 'First Absence of the Term', description: 'حصة فائتة في المحاسبة الحكومية (الثلاثاء) وأخرى في القانون التجاري (الأربعاء) — 3% من المحاضرات المنعقدة حتى الآن', descriptionEn: 'One missed session in ACCT354 (Tuesday) and one in ISPM356 (Wednesday) — 3% of the lectures held so far', timestamp: daysBack(4, '10:00:00') },
    { id: 't4', type: 'academic', title: 'الحضور تحت المتابعة', titleEn: 'Attendance Under Watch', description: 'الغياب 3% في مقررين — أقل بكثير من حد الحرمان (25%)، ويُرصد أسبوعياً', descriptionEn: 'Absence at 3% in two courses — well below the 25% deprivation bar, tracked weekly', timestamp: daysBack(2, '09:00:00') },
    { id: 't5', type: 'intervention', title: 'دعوة لجلسة إرشادية', titleEn: 'Advisory Session Invitation', description: 'أُرسل بريد إلكتروني للطالبة بدعوة لجلسة إرشادية لمراجعة خطة الفصل', descriptionEn: 'Emailed the student an invitation to an advisory session on the term plan', timestamp: daysBack(1, '08:30:00') },
    { id: 't6', type: 'intervention', title: 'تحليل التوأم الرقمي', titleEn: 'Digital Twin Analyzed', description: 'حلّل وكيل +QSpark ملفها وأرسل خلاصة الحضور والأداء إلى المرشدة الأكاديمية', descriptionEn: 'The QSpark+ agent analyzed her profile and sent the attendance and performance summary to her advisor', timestamp: daysBack(1, '09:15:00') },
    { id: 't7', type: 'academic', title: 'جدولة اجتماع Teams', titleEn: 'Teams Meeting Scheduled', description: 'جلسة مع المرشدة أمل الحربي — 10:00 صباحاً لمراجعة الحضور والأداء الأكاديمي', descriptionEn: 'Session with advisor Amal Al-Harbi — 10:00 AM to review attendance and performance', timestamp: daysBack(1, '09:20:00') },
  ],
};
