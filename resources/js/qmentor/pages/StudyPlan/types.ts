export type CourseStatus = 'completed' | 'in-progress' | 'available' | 'locked';
export type CourseCategory = 'university' | 'college' | 'major-core' | 'major-elective' | 'free-elective';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Course {
  code: string;
  nameAr: string;
  nameEn: string;
  creditHours: number;
  prerequisites: string[];
  category: CourseCategory;
  planSemester: number; // recommended semester in the plan
  status: CourseStatus;
  grade?: string;
  gradePoints?: number;
  descriptionAr?: string;
  descriptionEn?: string;
}

export interface StudentPlanProfile {
  name: string;
  nameEn: string;
  studentId: string;
  major: string;
  majorEn: string;
  college: string;
  collegeEn: string;
  currentSemester: number;
  currentGPA: number;
  gpaScale: number;
  completedCredits: number;
  requiredCredits: number;
  expectedGraduation: string;
  expectedGraduationEn: string;
}

export interface SemesterPlan {
  semester: number;
  label: string;
  labelEn: string;
  courses: string[]; // course codes
}

export interface ElectiveRecommendation {
  code: string;
  nameAr: string;
  nameEn: string;
  creditHours: number;
  category: CourseCategory;
  reasonAr: string;
  reasonEn: string;
  difficulty: DifficultyLevel;
  professorRating: number; // 1-5
  gpaImpact: 'booster' | 'neutral' | 'risk';
  careerTags: string[];
  careerTagsEn: string[];
  timeSlot?: string;
  timeSlotEn?: string;
}

export interface WhatIfResult {
  projectedGPA: number;
  originalGPA: number;
  graduationDate: string;
  graduationDateEn: string;
  originalGraduationDate: string;
  originalGraduationDateEn: string;
  semestersRemaining: number;
  originalSemestersRemaining: number;
  impactSummaryAr: string;
  impactSummaryEn: string;
}

export interface ScheduleOption {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  semesters: SemesterPlan[];
  projectedGPA: number;
  graduationDate: string;
  graduationDateEn: string;
  tag: 'fastest' | 'balanced' | 'gpa-safe';
}

export interface AvailableCourse {
  code: string;
  nameAr: string;
  nameEn: string;
  creditHours: number;
  instructor: string;
  instructorEn: string;
  schedule: string;
  scheduleEn: string;
  room: string;
  roomEn: string;
  seats: number;
  enrolled: number;
  section: string;
}

export interface GraduationMilestone {
  label: string;
  labelEn: string;
  credits: number;
  completed: boolean;
  current: boolean;
}
