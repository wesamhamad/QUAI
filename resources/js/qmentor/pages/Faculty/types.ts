export type PerformanceLevel = 'excellent' | 'good' | 'average' | 'poor' | 'failing';

export interface College {
  id: string;
  nameAr: string;
  nameEn: string;
  departments: Department[];
  totalStudents: number;
  avgGPA: number;
  retentionRate: number;
  atRiskCount: number;
  dfwRate: number;
}

export interface Department {
  id: string;
  nameAr: string;
  nameEn: string;
  collegeId: string;
  totalStudents: number;
  avgGPA: number;
  retentionRate: number;
  atRiskCount: number;
  dfwRate: number;
  courses: Course[];
}

export interface Course {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  departmentId: string;
  enrollment: number;
  avgGPA: number;
  dfwRate: number;
  passRate: number;
  universityAvgGPA: number;
  gradeDistribution: GradeDistribution;
  sections: CourseSection[];
}

export interface CourseSection {
  id: string;
  sectionNumber: string;
  facultyId: string;
  facultyNameAr: string;
  facultyNameEn: string;
  enrollment: number;
  avgGPA: number;
  passRate: number;
  performance: PerformanceLevel;
}

export interface GradeDistribution {
  aPlus: number;
  a: number;
  bPlus: number;
  b: number;
  cPlus: number;
  c: number;
  dPlus: number;
  d: number;
  f: number;
}

export interface FacultyMember {
  id: string;
  nameAr: string;
  nameEn: string;
  departmentId: string;
  departmentAr: string;
  departmentEn: string;
  collegeAr: string;
  collegeEn: string;
  rank: string;
  rankEn: string;
  coursesCount: number;
  avgStudentSatisfaction: number;
  avgGPA: number;
  totalStudents: number;
  gradeDistribution: GradeDistribution;
  studentOutcomes: { passed: number; failed: number; withdrawn: number };
}

export interface SemesterTrend {
  semester: string;
  semesterEn: string;
  avgGPA: number;
  dfwRate: number;
  passRate: number;
  enrollment: number;
  retentionRate: number;
  atRiskCount: number;
}

export interface HeatmapCell {
  courseCode: string;
  sectionNumber: string;
  facultyNameAr: string;
  facultyNameEn: string;
  passRate: number;
  avgGPA: number;
  performance: PerformanceLevel;
}
