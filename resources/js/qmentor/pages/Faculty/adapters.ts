import type { College, Department, Course, CourseSection, HeatmapCell, SemesterTrend, PerformanceLevel, GradeDistribution } from './types';

/**
 * Shapes the cohort aggregates from /api/qmentor/faculty/overview into the
 * types the Faculty tabs already render. The feed has no sections or
 * instructors, so a "section" here is a course × department cell: the
 * department whose students sat the course.
 */
export interface FacultyOverview {
  roster_semester: string;
  graded_semester: string;
  generated_at: string;
  note: string;
  colleges: { id: string; name: string; students: number; avg_gpa: number; at_risk: number; scored: number; dfw_rate: number | null;
    departments: { id: string; dept_no: string; name: string; students: number; avg_gpa: number; at_risk: number; scored: number; dfw_rate: number | null }[] }[];
  courses: { id: string; code: string; name: string; faculty_no: string; enrollment: number; graded: number; avg_grade: number; pass_rate: number | null; dfw_rate: number | null; distribution: GradeDistribution }[];
  heatmap: { course_code: string; faculty_no: string; dept_id: string; dept_name: string; graded: number; pass_rate: number; avg_grade: number }[];
  trends: { semester: string; students: number; avg_gpa: number; dfw_rate: number | null; at_risk: number }[];
}

export function performanceOf(passRate: number): PerformanceLevel {
  if (passRate >= 90) return 'excellent';
  if (passRate >= 75) return 'good';
  if (passRate >= 60) return 'average';
  if (passRate >= 45) return 'poor';
  return 'failing';
}

/** 472 → «١٤٤٧ هـ - الثاني» / «1447 - Term 2». */
export function semesterLabel(code: string): { ar: string; en: string } {
  const m = /^(\d{2})(\d)$/.exec(code);
  if (!m) return { ar: code, en: code };
  const year = `14${m[1]}`;
  const term = m[2] === '1' ? ['الأول', 'Term 1'] : m[2] === '2' ? ['الثاني', 'Term 2'] : ['الصيفي', 'Summer'];
  return { ar: `${year} هـ - ${term[0]}`, en: `${year} - ${term[1]}` };
}

/** Grade points on QU's 5-scale from a 0–100 mark: the same bands SIS letters use. */
export function gpaFromMark(mark: number): number {
  if (mark >= 95) return 5; if (mark >= 90) return 4.75; if (mark >= 85) return 4.5; if (mark >= 80) return 4;
  if (mark >= 75) return 3.5; if (mark >= 70) return 3; if (mark >= 65) return 2.5; if (mark >= 60) return 2;
  return 1;
}

export function adaptOverview(o: FacultyOverview): { colleges: College[]; departments: Department[]; courses: Course[]; heatmap: HeatmapCell[]; trends: SemesterTrend[] } {
  const univAvg = o.courses.length ? o.courses.reduce((s, c) => s + gpaFromMark(c.avg_grade), 0) / o.courses.length : 0;

  const cellsByCourse = new Map<string, typeof o.heatmap>();
  for (const h of o.heatmap) {
    const key = `${h.course_code}|${h.faculty_no}`;
    cellsByCourse.set(key, [...(cellsByCourse.get(key) ?? []), h]);
  }

  const courses: Course[] = o.courses.map(c => {
    const cells = cellsByCourse.get(c.id) ?? [];
    const sections: CourseSection[] = cells.map(h => ({
      id: `${c.id}@${h.dept_id}`,
      sectionNumber: `${c.code}@${h.dept_id}`,
      facultyId: h.dept_id,
      facultyNameAr: h.dept_name,
      facultyNameEn: h.dept_name,
      enrollment: h.graded,
      avgGPA: gpaFromMark(h.avg_grade),
      passRate: h.pass_rate,
      performance: performanceOf(h.pass_rate),
    }));
    const firstDept = cells[0]?.dept_id ?? o.colleges.find(col => col.id === c.faculty_no)?.departments[0]?.id ?? c.faculty_no;
    return {
      id: c.id,
      code: c.code.replace(/\s+/g, ''),
      nameAr: c.name,
      nameEn: c.name,
      departmentId: firstDept,
      enrollment: c.enrollment || c.graded,
      avgGPA: gpaFromMark(c.avg_grade),
      dfwRate: c.dfw_rate ?? 0,
      passRate: c.pass_rate ?? 0,
      universityAvgGPA: Math.round(univAvg * 100) / 100,
      gradeDistribution: c.distribution,
      sections,
    };
  });

  const colleges: College[] = o.colleges.map(col => ({
    id: col.id,
    nameAr: col.name,
    nameEn: col.name,
    totalStudents: col.students,
    avgGPA: col.avg_gpa,
    retentionRate: 0,
    atRiskCount: col.at_risk,
    dfwRate: col.dfw_rate ?? 0,
    departments: col.departments.map(d => ({
      id: d.id,
      nameAr: d.name,
      nameEn: d.name,
      collegeId: col.id,
      totalStudents: d.students,
      avgGPA: d.avg_gpa,
      retentionRate: 0,
      atRiskCount: d.at_risk,
      dfwRate: d.dfw_rate ?? 0,
      // A course belongs to every department whose students sat it.
      courses: courses.filter(c => c.departmentId === d.id || c.sections.some(s => s.facultyId === d.id)),
    })),
  }));

  const heatmap: HeatmapCell[] = courses.flatMap(c => c.sections.map(s => ({
    courseCode: c.code,
    sectionNumber: s.sectionNumber,
    facultyNameAr: s.facultyNameAr,
    facultyNameEn: s.facultyNameEn,
    passRate: s.passRate,
    avgGPA: s.avgGPA,
    performance: s.performance,
  })));

  const trends: SemesterTrend[] = o.trends.map(t => {
    const l = semesterLabel(t.semester);
    return {
      semester: l.ar,
      semesterEn: l.en,
      avgGPA: t.avg_gpa,
      dfwRate: t.dfw_rate ?? 0,
      passRate: t.dfw_rate == null ? 0 : Math.round((100 - t.dfw_rate) * 10) / 10,
      enrollment: t.students,
      retentionRate: 0,
      atRiskCount: t.at_risk,
    };
  });

  return { colleges, departments: colleges.flatMap(c => c.departments), courses, heatmap, trends };
}
