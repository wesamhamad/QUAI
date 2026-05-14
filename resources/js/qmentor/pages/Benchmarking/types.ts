export interface Semester {
  id: string;
  labelAr: string;
  labelEn: string;
}

export interface DepartmentMetrics {
  id: string;
  nameAr: string;
  nameEn: string;
  collegeId: string;
  enrollment: number;
  avgGpa: number;
  retentionRate: number;
  graduationRate: number;
  atRiskPercent: number;
  satisfaction: number;
  researchOutput: number;
}

export interface CollegeMetrics {
  id: string;
  nameAr: string;
  nameEn: string;
  enrollment: number;
  avgGpa: number;
  retentionRate: number;
  graduationRate: number;
  atRiskPercent: number;
  departments: DepartmentMetrics[];
}

export interface UniversityKPIs {
  totalEnrollment: number;
  overallGpa: number;
  retentionRate: number;
  graduationRate: number;
  atRiskPercent: number;
}

export interface SemesterSnapshot {
  semesterId: string;
  university: UniversityKPIs;
  colleges: CollegeMetrics[];
}

export interface PeerUniversity {
  id: string;
  nameAr: string;
  nameEn: string;
  enrollment: number;
  avgGpa: number;
  retentionRate: number;
  graduationRate: number;
  atRiskPercent: number;
  satisfaction: number;
  researchOutput: number;
}

export type MetricKey = 'avgGpa' | 'retentionRate' | 'graduationRate' | 'atRiskPercent' | 'enrollment' | 'satisfaction' | 'researchOutput';

export interface MetricOption {
  key: MetricKey;
  labelAr: string;
  labelEn: string;
}
