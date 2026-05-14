import type { LucideIcon } from 'lucide-react';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// SRS Section 5.B — 9 risk categories with letter codes
export type RiskCategoryKey =
  | 'A'   // Attendance
  | 'G'   // Grades
  | 'S'   // Assignments
  | 'E'   // LMS Engagement
  | 'AC'  // Academic Standing
  | 'R'   // Registration
  | 'T'   // Schedule & Exams
  | 'C'   // Compound
  | 'P';  // Graduation Path

export type TrendDirection = 'improving' | 'stable' | 'declining';

export interface RiskIndicatorDef {
  id: string;
  nameAr: string;
  nameEn: string;
  category: RiskCategoryKey;
  descriptionAr: string;
  descriptionEn: string;
  threshold: number;
  currentValue: number;
  status: RiskLevel;
  dataSource: string;
  dataSourceAr: string;
}

export interface RiskCategoryInfo {
  key: RiskCategoryKey;
  nameAr: string;
  nameEn: string;
  code: string;
  icon: LucideIcon;
  riskScore: number;
  studentCount: number;
  trend: TrendDirection;
  indicators: RiskIndicatorDef[];
}

export interface AtRiskStudent {
  id: string;
  name: string;
  nameEn: string;
  studentId: string;
  college: string;
  collegeEn: string;
  department: string;
  departmentEn: string;
  riskLevel: RiskLevel;
  riskScore: number;
  topFactors: string[];
  topFactorsEn: string[];
  trend: TrendDirection;
  categories: RiskCategoryKey[];
  categoryScores: Partial<Record<RiskCategoryKey, RiskLevel>>;
}

export interface EarlyWarning {
  id: string;
  studentName: string;
  studentNameEn: string;
  studentId: string;
  triggerAr: string;
  triggerEn: string;
  category: string;
  severity: RiskLevel;
  timestamp: string;
  acknowledged: boolean;
  escalated: boolean;
}

export interface RiskTrendPoint {
  week: string;
  weekEn: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

export interface UniversityRiskOverview {
  totalStudents: number;
  lowRisk: number;
  mediumRisk: number;
  highRisk: number;
  criticalRisk: number;
  overallScore: number;
  trend: TrendDirection;
  trendDelta: number;
}
