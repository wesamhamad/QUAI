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
  enrollmentStatus: 'active' | 'suspended' | 'graduated' | 'withdrawn';
  lastActive: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  academicStanding: 'excellent' | 'very-good' | 'good' | 'fair' | 'warning' | 'probation';
  level: number;
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
}

export interface StudyPlanNode {
  code: string;
  name: string;
  nameEn: string;
  creditHours: number;
  status: 'completed' | 'in-progress' | 'remaining' | 'failed';
  prerequisites: string[];
  category: 'university' | 'college' | 'major' | 'elective';
}

export interface AttendanceHeatmapEntry {
  week: number;
  day: number; // 0=Sun, 1=Mon, ...
  status: 'present' | 'absent-excused' | 'absent-unexcused' | 'no-class';
}

export interface BehavioralMetrics {
  lmsLoginFrequency: number; // per week
  assignmentSubmissionRate: number; // percentage
  attendanceRate: number; // percentage
  libraryVisits: number; // per month
  lmsHoursPerWeek: number;
  attendanceByMonth: { month: string; monthEn?: string; rate: number }[];
  studyPatterns: { hour: number; activity: number }[];
  courseEngagement: { course: string; hours: number; submissions: number }[];
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
}

export interface RiskAssessmentData {
  overallScore: number;
  trend: 'improving' | 'stable' | 'declining';
  categoryScores: { category: RiskCategory; score: number; label: string; labelEn: string }[];
  indicators: RiskIndicator[];
  history: { date: string; score: number }[];
}

export interface AIRecommendation {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: 'academic' | 'behavioral' | 'wellness' | 'career';
  priority: 'urgent' | 'important' | 'suggestion';
  actionLabel: string;
  actionLabelEn: string;
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
