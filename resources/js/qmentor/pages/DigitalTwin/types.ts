export interface StudentProfile {
  id: string;
  name: string;
  nameEn: string;
  studentId: string;
  photo?: string;
  department: string;
  departmentEn: string;
  college: string;
  collegeEn: string;
  gpa: number;
  gpaScale: number;
  creditHoursCompleted: number;
  creditHoursRequired: number;
  expectedGraduation: string;
  enrollmentStatus: 'active' | 'suspended' | 'graduated' | 'withdrawn' | 'dismissed' | 'deferred' | 'unknown';
  /** Kept for the bundled fixtures only; live twins show `dataSyncedAt` instead. */
  lastActive?: string;
  /** `unscored`: the engine has not evaluated this student yet — never shown as «منخفض». */
  riskLevel: 'low' | 'medium' | 'high' | 'critical' | 'unscored';
  academicStanding: 'excellent' | 'very-good' | 'good' | 'fair' | 'warning' | 'probation';
  level: number;
  /** SIS advisor of record (snapshot `advisor`). */
  advisorName?: string | null;
  advisorEmail?: string | null;
  /** When the student's snapshots were last fetched — «آخر تحديث للبيانات». */
  dataSyncedAt?: string | null;
  /** SIS warnings on record; null = the warnings snapshot was never loaded. */
  warningCount?: number | null;
  /** Cohort GPA averages, computed server-side; null = no comparison available. */
  benchmarks?: { facultyAvg: number | null; universityAvg: number | null } | null;
}

export interface SemesterGPA {
  semester: string;
  semesterEn: string;
  gpa: number;
  creditHours: number;
}

export interface Course {
  code: string;
  name: string;
  nameEn: string;
  creditHours: number;
  grade?: string;
  gradePoints?: number;
  bbGrade?: string; // Blackboard grade
  status: 'completed' | 'in-progress' | 'remaining' | 'failed';
  semester?: string;
  instructor?: string;
  instructorEn?: string;
  instructorEmail?: string;
  contentPreview?: string;
  contentPreviewEn?: string;
  /** From the timetable / current-courses feed. */
  section?: string;
  room?: string;
  /** Final exam sitting (ISO datetime) and its campus, from the finals feed. */
  examDate?: string;
  examEnd?: string;
  examLocation?: string;
}

export interface StudyPlanNode {
  code: string;
  name: string;
  nameEn: string;
  creditHours: number;
  status: 'completed' | 'in-progress' | 'remaining' | 'failed';
  /** Always empty for SIS plans: the feed carries no prerequisite graph. */
  prerequisites: string[];
  category: 'university' | 'college' | 'major' | 'elective';
  /** Plan level (1…); undefined for the elective buckets. */
  level?: number;
}

export interface AttendanceHeatmapEntry {
  week: number;
  day: number; // 0=Sun, 1=Mon, ...
  /** `future`: a week the term has not reached — drawn empty, not as «لا محاضرة». */
  status: 'present' | 'absent-excused' | 'absent-unexcused' | 'no-class' | 'future';
}

/**
 * A `null` metric is «غير مقيس»: no feed carries it for this student (the LMS
 * figures need Blackboard, which the cohort sync has not received yet).
 */
export interface BehavioralMetrics {
  lmsLoginFrequency: number | null; // per week
  assignmentSubmissionRate: number | null; // percentage
  attendanceRate: number | null; // percentage
  lmsHoursPerWeek: number | null;
  /** Last Blackboard login (ISO) — «آخر دخول للمنصة»; null/undefined when the LMS feed has not answered. */
  lmsLastLogin?: string | null;
  attendanceByMonth: { month: string; monthEn?: string; rate: number }[];
  /** Demo-only extras kept by this build's fixtures. */
  libraryVisits?: number; // per month
  studyPatterns?: { hour: number; activity: number }[];
  courseEngagement: { course: string; hours: number | null; submissions: number | null; gradable?: number | null }[];
  /** Per-course absence as SIS reports it (absence_all_percent / absence_excused_percent). */
  absenceByCourse?: { course: string; name?: string; absencePercent: number; excusedPercent: number }[];
  /** The roster term the absences belong to (e.g. 481). */
  semester?: string;
  attendanceHeatmap?: AttendanceHeatmapEntry[];
  excusedAbsences?: number;
  unexcusedAbsences?: number;
  totalClasses?: number;
}

export type RiskCategory =
  | 'academic_performance'
  | 'engagement'
  | 'financial'
  | 'health_wellness'
  | 'social_integration'
  | 'course_specific'
  | 'time_management'
  | 'institutional'
  | 'external';

export interface RiskIndicator {
  id: string;
  name: string;
  nameEn: string;
  category: RiskCategory;
  score: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  description: string;
  descriptionEn: string;
  tooltip?: string;
  tooltipEn?: string;
  /** Engine code (A-01 …), shown small beside the Arabic label. */
  code?: string;
  /** Engine level 0–3 and the evaluation it was read from. */
  level?: number;
  computedAt?: string | null;
  /** Set on the absence indicators when an excuse request (medical / death / accident) on the absent course made the student Critical. */
  excuse?: { course: string; reason: string; reason_code: string };
}

/** One of the engine's `top_factors`, with its category's share of the weighted score. */
export interface RiskTopFactor {
  id: string;
  label: string;
  level: number;
  evidence: string;
  /** This factor's contribution — (level / 3) × its category weight — as a share (0–100) of the top factors' contributions. */
  weightShare: number;
}

export interface RiskAssessmentData {
  overallScore: number;
  trend: 'improving' | 'stable' | 'declining';
  categoryScores: { category: RiskCategory; score: number; label: string; labelEn: string }[];
  indicators: RiskIndicator[];
  history: { date: string; score: number }[];
  /** Server-side extras — absent on the bundled fixtures. */
  levelKey?: 'low' | 'medium' | 'high' | 'critical';
  computedAt?: string | null;
  modelVersion?: string | null;
  topFactors?: RiskTopFactor[];
}

export interface AIRecommendation {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: 'academic' | 'behavioral' | 'wellness' | 'career';
  priority: 'urgent' | 'important' | 'suggestion';
  /** Demo-only call-to-action labels kept by this build's fixtures. */
  actionLabel?: string;
  actionLabelEn?: string;
}

export interface TimelineEvent {
  id: string;
  type: 'academic' | 'behavioral' | 'intervention' | 'alert';
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  timestamp: string;
  icon?: string;
}

export interface DigitalTwinData {
  profile: StudentProfile;
  semesterGPAs: SemesterGPA[];
  currentCourses: Course[];
  allCourses: Course[];
  studyPlan: StudyPlanNode[];
  behavioral: BehavioralMetrics;
  risk: RiskAssessmentData;
  recommendations: AIRecommendation[];
  timeline: TimelineEvent[];
}
