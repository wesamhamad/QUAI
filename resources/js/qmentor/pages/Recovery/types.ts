export type MilestoneStatus = 'completed' | 'in-progress' | 'upcoming';
export type ActionPriority = 'high' | 'medium' | 'low';
export type ActionStatus = 'completed' | 'in-progress' | 'pending' | 'overdue';

export interface RecoveryStudent {
  name: string;
  nameEn: string;
  studentId: string;
  major: string;
  majorEn: string;
  currentGPA: number;
  targetGPA: number;
  gpaScale: number;
  probationSemester: number;
  currentSemester: number;
  weeksRemaining: number;
  totalWeeks: number;
  milestonesCompleted: number;
  totalMilestones: number;
}

export interface RecoveryCourse {
  code: string;
  nameAr: string;
  nameEn: string;
  creditHours: number;
  currentGrade: string;
  currentPoints: number;
  isAtRisk: boolean;
}

export interface RecoveryMilestone {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  status: MilestoneStatus;
  dateAr: string;
  dateEn: string;
  week: number;
}

export interface ActionItem {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  priority: ActionPriority;
  status: ActionStatus;
  dueDateAr: string;
  dueDateEn: string;
  assignedByAr: string;
  assignedByEn: string;
  categoryAr: string;
  categoryEn: string;
}

export interface WeeklyProgress {
  week: number;
  labelAr: string;
  labelEn: string;
  gpa: number;
  attendance: number; // percentage
  assignmentsCompleted: number;
  assignmentsTotal: number;
}

export interface SupportResource {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  contactAr: string;
  contactEn: string;
  hoursAr: string;
  hoursEn: string;
  locationAr: string;
  locationEn: string;
  iconType: 'counseling' | 'writing' | 'tutoring' | 'financial' | 'career' | 'health';
}
