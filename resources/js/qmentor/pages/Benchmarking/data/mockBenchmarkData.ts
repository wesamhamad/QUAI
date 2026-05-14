import type { Semester, CollegeMetrics, SemesterSnapshot, PeerUniversity, UniversityKPIs, MetricOption } from '../types';

export const semesters: Semester[] = [
  { id: 's1', labelAr: '1445 هـ - الأول', labelEn: '2023 - Fall' },
  { id: 's2', labelAr: '1445 هـ - الثاني', labelEn: '2024 - Spring' },
  { id: 's3', labelAr: '1446 هـ - الأول', labelEn: '2024 - Fall' },
  { id: 's4', labelAr: '1446 هـ - الثاني', labelEn: '2025 - Spring' },
  { id: 's5', labelAr: '1447 هـ - الأول', labelEn: '2025 - Fall' },
];

const colleges: CollegeMetrics[] = [
  {
    id: 'eng', nameAr: 'كلية الهندسة', nameEn: 'College of Engineering',
    enrollment: 4200, avgGpa: 3.12, retentionRate: 88.5, graduationRate: 72.3, atRiskPercent: 14.2,
    departments: [
      { id: 'ce', nameAr: 'الهندسة المدنية', nameEn: 'Civil Engineering', collegeId: 'eng', enrollment: 1400, avgGpa: 3.05, retentionRate: 87.0, graduationRate: 70.5, atRiskPercent: 15.8, satisfaction: 78, researchOutput: 42 },
      { id: 'ee', nameAr: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering', collegeId: 'eng', enrollment: 1500, avgGpa: 3.18, retentionRate: 89.2, graduationRate: 73.1, atRiskPercent: 13.5, satisfaction: 81, researchOutput: 56 },
      { id: 'me', nameAr: 'الهندسة الميكانيكية', nameEn: 'Mechanical Engineering', collegeId: 'eng', enrollment: 1300, avgGpa: 3.14, retentionRate: 89.5, graduationRate: 73.8, atRiskPercent: 13.0, satisfaction: 80, researchOutput: 38 },
    ],
  },
  {
    id: 'cs', nameAr: 'كلية الحاسب', nameEn: 'College of Computing',
    enrollment: 3800, avgGpa: 3.24, retentionRate: 91.2, graduationRate: 78.6, atRiskPercent: 10.5,
    departments: [
      { id: 'csc', nameAr: 'علوم الحاسب', nameEn: 'Computer Science', collegeId: 'cs', enrollment: 1600, avgGpa: 3.30, retentionRate: 92.0, graduationRate: 80.2, atRiskPercent: 9.8, satisfaction: 85, researchOutput: 64 },
      { id: 'is', nameAr: 'نظم المعلومات', nameEn: 'Information Systems', collegeId: 'cs', enrollment: 1200, avgGpa: 3.20, retentionRate: 90.5, graduationRate: 77.0, atRiskPercent: 11.2, satisfaction: 82, researchOutput: 35 },
      { id: 'ai', nameAr: 'الذكاء الاصطناعي', nameEn: 'Artificial Intelligence', collegeId: 'cs', enrollment: 1000, avgGpa: 3.22, retentionRate: 91.0, graduationRate: 78.5, atRiskPercent: 10.5, satisfaction: 88, researchOutput: 72 },
    ],
  },
  {
    id: 'bus', nameAr: 'كلية إدارة الأعمال', nameEn: 'College of Business',
    enrollment: 5100, avgGpa: 3.08, retentionRate: 85.3, graduationRate: 75.1, atRiskPercent: 16.0,
    departments: [
      { id: 'acc', nameAr: 'المحاسبة', nameEn: 'Accounting', collegeId: 'bus', enrollment: 1800, avgGpa: 3.02, retentionRate: 84.0, graduationRate: 73.5, atRiskPercent: 17.5, satisfaction: 74, researchOutput: 28 },
      { id: 'fin', nameAr: 'المالية', nameEn: 'Finance', collegeId: 'bus', enrollment: 1700, avgGpa: 3.10, retentionRate: 85.8, graduationRate: 75.8, atRiskPercent: 15.2, satisfaction: 76, researchOutput: 32 },
      { id: 'mkt', nameAr: 'التسويق', nameEn: 'Marketing', collegeId: 'bus', enrollment: 1600, avgGpa: 3.12, retentionRate: 86.2, graduationRate: 76.0, atRiskPercent: 15.0, satisfaction: 79, researchOutput: 25 },
    ],
  },
  {
    id: 'sci', nameAr: 'كلية العلوم', nameEn: 'College of Science',
    enrollment: 3200, avgGpa: 3.18, retentionRate: 87.8, graduationRate: 71.0, atRiskPercent: 13.8,
    departments: [
      { id: 'math', nameAr: 'الرياضيات', nameEn: 'Mathematics', collegeId: 'sci', enrollment: 1100, avgGpa: 3.15, retentionRate: 86.5, graduationRate: 69.0, atRiskPercent: 14.5, satisfaction: 77, researchOutput: 48 },
      { id: 'phys', nameAr: 'الفيزياء', nameEn: 'Physics', collegeId: 'sci', enrollment: 1000, avgGpa: 3.22, retentionRate: 88.5, graduationRate: 72.0, atRiskPercent: 13.0, satisfaction: 79, researchOutput: 55 },
      { id: 'chem', nameAr: 'الكيمياء', nameEn: 'Chemistry', collegeId: 'sci', enrollment: 1100, avgGpa: 3.18, retentionRate: 88.2, graduationRate: 72.2, atRiskPercent: 13.8, satisfaction: 78, researchOutput: 52 },
    ],
  },
  {
    id: 'med', nameAr: 'كلية الطب', nameEn: 'College of Medicine',
    enrollment: 2800, avgGpa: 3.45, retentionRate: 94.5, graduationRate: 82.0, atRiskPercent: 7.2,
    departments: [
      { id: 'gm', nameAr: 'الطب العام', nameEn: 'General Medicine', collegeId: 'med', enrollment: 1200, avgGpa: 3.50, retentionRate: 95.0, graduationRate: 83.5, atRiskPercent: 6.5, satisfaction: 90, researchOutput: 78 },
      { id: 'surg', nameAr: 'الجراحة', nameEn: 'Surgery', collegeId: 'med', enrollment: 800, avgGpa: 3.42, retentionRate: 94.2, graduationRate: 81.0, atRiskPercent: 7.8, satisfaction: 87, researchOutput: 65 },
      { id: 'phar', nameAr: 'الصيدلة', nameEn: 'Pharmacy', collegeId: 'med', enrollment: 800, avgGpa: 3.38, retentionRate: 93.8, graduationRate: 80.5, atRiskPercent: 8.0, satisfaction: 86, researchOutput: 58 },
    ],
  },
];

function vary(base: number, range: number, semester: number): number {
  const offsets = [0, -0.4, 0.2, 0.6, 1.0];
  return +(base + offsets[semester] * range + (Math.sin(semester * 3 + base) * range * 0.3)).toFixed(2);
}

function varyInt(base: number, range: number, semester: number): number {
  return Math.round(vary(base, range, semester));
}

export const semesterSnapshots: SemesterSnapshot[] = semesters.map((sem, si) => {
  const semColleges: CollegeMetrics[] = colleges.map(c => ({
    ...c,
    enrollment: varyInt(c.enrollment, 80, si),
    avgGpa: +vary(c.avgGpa, 0.04, si).toFixed(2),
    retentionRate: +vary(c.retentionRate, 0.8, si).toFixed(1),
    graduationRate: +vary(c.graduationRate, 1.0, si).toFixed(1),
    atRiskPercent: +vary(c.atRiskPercent, 0.5, si).toFixed(1),
    departments: c.departments.map(d => ({
      ...d,
      enrollment: varyInt(d.enrollment, 30, si),
      avgGpa: +vary(d.avgGpa, 0.05, si).toFixed(2),
      retentionRate: +vary(d.retentionRate, 1.0, si).toFixed(1),
      graduationRate: +vary(d.graduationRate, 1.2, si).toFixed(1),
      atRiskPercent: +vary(d.atRiskPercent, 0.6, si).toFixed(1),
      satisfaction: varyInt(d.satisfaction, 2, si),
      researchOutput: varyInt(d.researchOutput, 3, si),
    })),
  }));

  const total = semColleges.reduce((s, c) => s + c.enrollment, 0);
  const university: UniversityKPIs = {
    totalEnrollment: total,
    overallGpa: +(semColleges.reduce((s, c) => s + c.avgGpa * c.enrollment, 0) / total).toFixed(2),
    retentionRate: +(semColleges.reduce((s, c) => s + c.retentionRate * c.enrollment, 0) / total).toFixed(1),
    graduationRate: +(semColleges.reduce((s, c) => s + c.graduationRate * c.enrollment, 0) / total).toFixed(1),
    atRiskPercent: +(semColleges.reduce((s, c) => s + c.atRiskPercent * c.enrollment, 0) / total).toFixed(1),
  };

  return { semesterId: sem.id, university, colleges: semColleges };
});

export const currentSnapshot = semesterSnapshots[semesterSnapshots.length - 1];

export const peerUniversities: PeerUniversity[] = [
  { id: 'qu', nameAr: 'جامعة القصيم', nameEn: 'Qassim University', enrollment: currentSnapshot.university.totalEnrollment, avgGpa: currentSnapshot.university.overallGpa, retentionRate: currentSnapshot.university.retentionRate, graduationRate: currentSnapshot.university.graduationRate, atRiskPercent: currentSnapshot.university.atRiskPercent, satisfaction: 82, researchOutput: 320 },
  { id: 'ksu', nameAr: 'جامعة الملك سعود', nameEn: 'King Saud University', enrollment: 42000, avgGpa: 3.28, retentionRate: 91.5, graduationRate: 79.2, atRiskPercent: 10.8, satisfaction: 84, researchOutput: 520 },
  { id: 'kau', nameAr: 'جامعة الملك عبدالعزيز', nameEn: 'King Abdulaziz University', enrollment: 38500, avgGpa: 3.22, retentionRate: 89.8, graduationRate: 77.5, atRiskPercent: 12.1, satisfaction: 83, researchOutput: 480 },
  { id: 'kfupm', nameAr: 'جامعة الملك فهد للبترول والمعادن', nameEn: 'KFUPM', enrollment: 12000, avgGpa: 3.42, retentionRate: 93.2, graduationRate: 81.8, atRiskPercent: 8.5, satisfaction: 87, researchOutput: 380 },
];

export const metricOptions: MetricOption[] = [
  { key: 'avgGpa', labelAr: 'المعدل التراكمي', labelEn: 'GPA' },
  { key: 'retentionRate', labelAr: 'معدل الاستبقاء', labelEn: 'Retention Rate' },
  { key: 'graduationRate', labelAr: 'معدل التخرج', labelEn: 'Graduation Rate' },
  { key: 'atRiskPercent', labelAr: 'نسبة المعرضين للخطر', labelEn: 'At-Risk %' },
  { key: 'enrollment', labelAr: 'عدد الطلاب', labelEn: 'Enrollment' },
  { key: 'satisfaction', labelAr: 'رضا الطلاب', labelEn: 'Satisfaction' },
  { key: 'researchOutput', labelAr: 'الإنتاج البحثي', labelEn: 'Research Output' },
];
