export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
export type InterventionType = 'meeting' | 'email' | 'referral' | 'note' | 'counseling' | 'flag';
export type InterventionSeverity = 'urgent' | 'high' | 'normal' | 'low';

export interface Student {
  id: string;
  name: string;
  nameEn: string;
  department: string;
  departmentEn: string;
  gpa: number;
  riskLevel: RiskLevel;
  lastContact: string;
  status: 'active' | 'probation' | 'suspended';
  statusAr: string;
  email: string;
}

export interface Intervention {
  id: string;
  studentId: string;
  studentName: string;
  studentNameEn: string;
  date: string;
  type: InterventionType;
  typeAr: string;
  severity: InterventionSeverity;
  summary: string;
  summaryEn: string;
  followUpDate?: string;
  resolved?: boolean;
}

export interface Appointment {
  id: string;
  studentName: string;
  studentNameEn: string;
  date: string;
  time: string;
  type: string;
  typeAr: string;
  isToday: boolean;
  notes?: string;
  notesAr?: string;
}

export interface CaseloadEntry {
  advisorName: string;
  advisorNameEn: string;
  totalStudents: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export type SortField = 'name' | 'id' | 'department' | 'gpa' | 'riskLevel' | 'lastContact' | 'status';
export type SortDirection = 'asc' | 'desc';
