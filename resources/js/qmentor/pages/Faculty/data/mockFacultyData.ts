import type {
  College,
  Department,
  Course,
  CourseSection,
  FacultyMember,
  SemesterTrend,
  HeatmapCell,
  GradeDistribution,
  PerformanceLevel,
} from '../types';

function randBetween(min: number, max: number, decimals = 2): number {
  return Number((Math.random() * (max - min) + min).toFixed(decimals));
}

function perfLevel(passRate: number): PerformanceLevel {
  if (passRate >= 90) return 'excellent';
  if (passRate >= 75) return 'good';
  if (passRate >= 60) return 'average';
  if (passRate >= 45) return 'poor';
  return 'failing';
}

function makeGradeDist(avgGPA: number): GradeDistribution {
  const high = avgGPA >= 3.5;
  const mid = avgGPA >= 2.5;
  return {
    aPlus: high ? randBetween(8, 15, 0) : mid ? randBetween(3, 8, 0) : randBetween(1, 4, 0),
    a: high ? randBetween(15, 25, 0) : mid ? randBetween(8, 15, 0) : randBetween(3, 8, 0),
    bPlus: high ? randBetween(15, 22, 0) : mid ? randBetween(12, 20, 0) : randBetween(5, 12, 0),
    b: randBetween(10, 18, 0),
    cPlus: mid ? randBetween(8, 15, 0) : randBetween(12, 20, 0),
    c: mid ? randBetween(5, 12, 0) : randBetween(10, 18, 0),
    dPlus: high ? randBetween(2, 6, 0) : randBetween(5, 12, 0),
    d: high ? randBetween(1, 4, 0) : randBetween(3, 8, 0),
    f: high ? randBetween(1, 3, 0) : mid ? randBetween(3, 8, 0) : randBetween(8, 18, 0),
  };
}

// ─── Faculty Members ─── (triple Arabic names: first + father + grandfather, no tribe)
const facultyNames: { ar: string; en: string }[] = [
  { ar: 'د. محمد عبدالله سعد',      en: 'Dr. Mohammed Abdullah Saad' },
  { ar: 'د. عبدالله محمد عبدالعزيز', en: 'Dr. Abdullah Mohammed Abdulaziz' },
  { ar: 'د. فهد سعد عبدالله',       en: 'Dr. Fahd Saad Abdullah' },
  { ar: 'د. خالد عبدالعزيز محمد',    en: 'Dr. Khalid Abdulaziz Mohammed' },
  { ar: 'د. سعد عبدالرحمن خالد',    en: 'Dr. Saad Abdulrahman Khalid' },
  { ar: 'د. أحمد محمد عبدالله',      en: 'Dr. Ahmad Mohammed Abdullah' },
  { ar: 'د. عبدالرحمن سعد محمد',    en: 'Dr. Abdulrahman Saad Mohammed' },
  { ar: 'د. سلطان عبدالله سلمان',   en: 'Dr. Sultan Abdullah Salman' },
  { ar: 'د. ياسر ناصر عبدالله',     en: 'Dr. Yasser Nasser Abdullah' },
  { ar: 'د. نايف عبدالعزيز محمد',   en: 'Dr. Naif Abdulaziz Mohammed' },
  { ar: 'د. تركي عبدالله محمد',     en: 'Dr. Turki Abdullah Mohammed' },
  { ar: 'د. بندر سعد عبدالله',      en: 'Dr. Bandar Saad Abdullah' },
  { ar: 'د. ماجد محمد ناصر',        en: 'Dr. Majed Mohammed Nasser' },
  { ar: 'د. عمر إبراهيم عبدالله',   en: 'Dr. Omar Ibrahim Abdullah' },
  { ar: 'د. حسن عبدالرحمن خالد',    en: 'Dr. Hassan Abdulrahman Khalid' },
  { ar: 'د. إبراهيم عبدالله محمد',  en: 'Dr. Ibrahim Abdullah Mohammed' },
  { ar: 'د. صالح سعد عبدالعزيز',    en: 'Dr. Saleh Saad Abdulaziz' },
  { ar: 'د. وليد محمد عبدالله',      en: 'Dr. Waleed Mohammed Abdullah' },
  { ar: 'د. مشعل عبدالله محمد',     en: 'Dr. Mishal Abdullah Mohammed' },
  { ar: 'د. راشد محمد سعد',          en: 'Dr. Rashed Mohammed Saad' },
  { ar: 'د. فيصل عبدالله سعد',      en: 'Dr. Faisal Abdullah Saad' },
  { ar: 'د. عادل عبدالعزيز محمد',   en: 'Dr. Adel Abdulaziz Mohammed' },
];

const ranks = [
  { ar: 'أستاذ', en: 'Professor' },
  { ar: 'أستاذ مشارك', en: 'Associate Professor' },
  { ar: 'أستاذ مساعد', en: 'Assistant Professor' },
  { ar: 'محاضر', en: 'Lecturer' },
];

// ─── College & Department Structure ───
interface DeptDef { ar: string; en: string; courses: { code: string; ar: string; en: string }[] }
interface CollegeDef { ar: string; en: string; departments: DeptDef[] }

const collegeStructure: CollegeDef[] = [
  {
    ar: 'كلية الحاسب', en: 'College of Computer',
    departments: [
      { ar: 'علوم الحاسب', en: 'Computer Science', courses: [
        { code: 'CS101', ar: 'مقدمة في البرمجة', en: 'Intro to Programming' },
        { code: 'CS201', ar: 'هياكل البيانات', en: 'Data Structures' },
        { code: 'CS301', ar: 'قواعد البيانات', en: 'Databases' },
        { code: 'CS401', ar: 'الذكاء الاصطناعي', en: 'Artificial Intelligence' },
      ]},
      { ar: 'نظم المعلومات', en: 'Information Systems', courses: [
        { code: 'IS101', ar: 'مقدمة نظم المعلومات', en: 'Intro to IS' },
        { code: 'IS201', ar: 'تحليل النظم', en: 'Systems Analysis' },
        { code: 'IS301', ar: 'أمن المعلومات', en: 'Information Security' },
      ]},
      { ar: 'هندسة البرمجيات', en: 'Software Engineering', courses: [
        { code: 'SE101', ar: 'هندسة البرمجيات', en: 'Software Engineering' },
        { code: 'SE201', ar: 'إدارة المشاريع', en: 'Project Management' },
        { code: 'SE301', ar: 'اختبار البرمجيات', en: 'Software Testing' },
      ]},
    ],
  },
  {
    ar: 'كلية الهندسة', en: 'College of Engineering',
    departments: [
      { ar: 'الهندسة الكهربائية', en: 'Electrical Engineering', courses: [
        { code: 'EE101', ar: 'الدوائر الكهربائية', en: 'Electric Circuits' },
        { code: 'EE201', ar: 'الإلكترونيات', en: 'Electronics' },
        { code: 'EE301', ar: 'معالجة الإشارات', en: 'Signal Processing' },
      ]},
      { ar: 'الهندسة المدنية', en: 'Civil Engineering', courses: [
        { code: 'CE101', ar: 'مقاومة المواد', en: 'Strength of Materials' },
        { code: 'CE201', ar: 'ميكانيكا التربة', en: 'Soil Mechanics' },
        { code: 'CE301', ar: 'التصميم الإنشائي', en: 'Structural Design' },
      ]},
      { ar: 'الهندسة الميكانيكية', en: 'Mechanical Engineering', courses: [
        { code: 'ME101', ar: 'الديناميكا الحرارية', en: 'Thermodynamics' },
        { code: 'ME201', ar: 'ميكانيكا الموائع', en: 'Fluid Mechanics' },
        { code: 'ME301', ar: 'تصميم الآلات', en: 'Machine Design' },
      ]},
    ],
  },
  {
    ar: 'كلية العلوم', en: 'College of Science',
    departments: [
      { ar: 'الرياضيات', en: 'Mathematics', courses: [
        { code: 'MATH101', ar: 'التفاضل والتكامل', en: 'Calculus' },
        { code: 'MATH201', ar: 'الجبر الخطي', en: 'Linear Algebra' },
        { code: 'MATH301', ar: 'الإحصاء', en: 'Statistics' },
      ]},
      { ar: 'الفيزياء', en: 'Physics', courses: [
        { code: 'PHY101', ar: 'فيزياء عامة', en: 'General Physics' },
        { code: 'PHY201', ar: 'الفيزياء الحديثة', en: 'Modern Physics' },
      ]},
      { ar: 'الكيمياء', en: 'Chemistry', courses: [
        { code: 'CHEM101', ar: 'كيمياء عامة', en: 'General Chemistry' },
        { code: 'CHEM201', ar: 'كيمياء عضوية', en: 'Organic Chemistry' },
      ]},
    ],
  },
  {
    ar: 'كلية إدارة الأعمال', en: 'College of Business Administration',
    departments: [
      { ar: 'المحاسبة', en: 'Accounting', courses: [
        { code: 'ACC101', ar: 'مبادئ المحاسبة', en: 'Accounting Principles' },
        { code: 'ACC201', ar: 'المحاسبة الإدارية', en: 'Managerial Accounting' },
        { code: 'ACC301', ar: 'المراجعة', en: 'Auditing' },
      ]},
      { ar: 'إدارة الأعمال', en: 'Business Administration', courses: [
        { code: 'BA101', ar: 'مبادئ الإدارة', en: 'Management Principles' },
        { code: 'BA201', ar: 'إدارة الموارد البشرية', en: 'Human Resources' },
        { code: 'BA301', ar: 'التسويق', en: 'Marketing' },
      ]},
      { ar: 'التمويل', en: 'Finance', courses: [
        { code: 'FIN101', ar: 'مبادئ التمويل', en: 'Finance Principles' },
        { code: 'FIN201', ar: 'الاستثمار', en: 'Investment' },
      ]},
    ],
  },
  {
    ar: 'كلية الطب', en: 'College of Medicine',
    departments: [
      { ar: 'الطب الباطني', en: 'Internal Medicine', courses: [
        { code: 'MED101', ar: 'التشريح', en: 'Anatomy' },
        { code: 'MED201', ar: 'علم الأدوية', en: 'Pharmacology' },
        { code: 'MED301', ar: 'الأمراض الباطنية', en: 'Internal Diseases' },
      ]},
      { ar: 'الجراحة', en: 'Surgery', courses: [
        { code: 'SUR101', ar: 'مبادئ الجراحة', en: 'Surgery Principles' },
        { code: 'SUR201', ar: 'الجراحة العامة', en: 'General Surgery' },
      ]},
      { ar: 'طب الأسرة', en: 'Family Medicine', courses: [
        { code: 'FM101', ar: 'طب المجتمع', en: 'Community Medicine' },
        { code: 'FM201', ar: 'الرعاية الأولية', en: 'Primary Care' },
      ]},
    ],
  },
];

// ─── Build Data ───
let facultyIdx = 0;
let sectionIdx = 0;

function nextFaculty() {
  return facultyNames[facultyIdx++ % facultyNames.length];
}

function buildSections(courseCode: string, collegeDef: CollegeDef): CourseSection[] {
  const count = 2 + Math.floor(Math.random() * 3); // 2-4 sections
  const sections: CourseSection[] = [];
  for (let i = 0; i < count; i++) {
    const fac = nextFaculty();
    const avgGPA = randBetween(1.8, 3.9);
    const passRate = randBetween(55, 98);
    sections.push({
      id: `sec-${++sectionIdx}`,
      sectionNumber: `${courseCode}-${String(i + 1).padStart(2, '0')}`,
      facultyId: `fac-${(facultyIdx - 1) % facultyNames.length}`,
      facultyNameAr: fac.ar,
      facultyNameEn: fac.en,
      enrollment: Math.floor(randBetween(25, 80, 0)),
      avgGPA,
      passRate,
      performance: perfLevel(passRate),
    });
  }
  return sections;
}

function buildCourses(deptDef: DeptDef, deptId: string, collegeDef: CollegeDef): Course[] {
  return deptDef.courses.map((c, i) => {
    const sections = buildSections(c.code, collegeDef);
    const enrollment = sections.reduce((s, sec) => s + sec.enrollment, 0);
    const avgGPA = Number((sections.reduce((s, sec) => s + sec.avgGPA * sec.enrollment, 0) / enrollment).toFixed(2));
    const passRate = Number((sections.reduce((s, sec) => s + sec.passRate * sec.enrollment, 0) / enrollment).toFixed(1));
    const dfwRate = Number((100 - passRate + randBetween(0, 5)).toFixed(1));
    return {
      id: `course-${deptId}-${i}`,
      code: c.code,
      nameAr: c.ar,
      nameEn: c.en,
      departmentId: deptId,
      enrollment,
      avgGPA,
      dfwRate: Math.min(dfwRate, 45),
      passRate,
      universityAvgGPA: randBetween(2.4, 3.2),
      gradeDistribution: makeGradeDist(avgGPA),
      sections,
    };
  });
}

function buildDepartments(collegeDef: CollegeDef, collegeId: string): Department[] {
  return collegeDef.departments.map((d, i) => {
    const deptId = `dept-${collegeId}-${i}`;
    const courses = buildCourses(d, deptId, collegeDef);
    const totalStudents = courses.reduce((s, c) => s + c.enrollment, 0);
    const avgGPA = Number((courses.reduce((s, c) => s + c.avgGPA * c.enrollment, 0) / totalStudents).toFixed(2));
    return {
      id: deptId,
      nameAr: d.ar,
      nameEn: d.en,
      collegeId,
      totalStudents,
      avgGPA,
      retentionRate: randBetween(78, 96),
      atRiskCount: Math.floor(totalStudents * randBetween(0.05, 0.18)),
      dfwRate: Number((courses.reduce((s, c) => s + c.dfwRate, 0) / courses.length).toFixed(1)),
      courses,
    };
  });
}

export const colleges: College[] = collegeStructure.map((c, i) => {
  const collegeId = `college-${i}`;
  const departments = buildDepartments(c, collegeId);
  const totalStudents = departments.reduce((s, d) => s + d.totalStudents, 0);
  const avgGPA = Number((departments.reduce((s, d) => s + d.avgGPA * d.totalStudents, 0) / totalStudents).toFixed(2));
  return {
    id: collegeId,
    nameAr: c.ar,
    nameEn: c.en,
    departments,
    totalStudents,
    avgGPA,
    retentionRate: Number((departments.reduce((s, d) => s + d.retentionRate, 0) / departments.length).toFixed(1)),
    atRiskCount: departments.reduce((s, d) => s + d.atRiskCount, 0),
    dfwRate: Number((departments.reduce((s, d) => s + d.dfwRate, 0) / departments.length).toFixed(1)),
  };
});

export const allDepartments: Department[] = colleges.flatMap(c => c.departments);
export const allCourses: Course[] = allDepartments.flatMap(d => d.courses);
export const allSections: CourseSection[] = allCourses.flatMap(c => c.sections);

export const facultyMembers: FacultyMember[] = facultyNames.map((f, i) => {
  const dept = allDepartments[i % allDepartments.length];
  const college = colleges.find(c => c.id === dept.collegeId)!;
  const rank = ranks[i % ranks.length];
  const avgGPA = randBetween(2.2, 3.8);
  const totalStudents = Math.floor(randBetween(80, 300, 0));
  const passed = Math.floor(totalStudents * randBetween(0.65, 0.95));
  const failed = Math.floor((totalStudents - passed) * randBetween(0.4, 0.8));
  return {
    id: `fac-${i}`,
    nameAr: f.ar,
    nameEn: f.en,
    departmentId: dept.id,
    departmentAr: dept.nameAr,
    departmentEn: dept.nameEn,
    collegeAr: college.nameAr,
    collegeEn: college.nameEn,
    rank: rank.ar,
    rankEn: rank.en,
    coursesCount: Math.floor(randBetween(2, 5, 0)),
    avgStudentSatisfaction: randBetween(3.0, 4.9),
    avgGPA,
    totalStudents,
    gradeDistribution: makeGradeDist(avgGPA),
    studentOutcomes: { passed, failed, withdrawn: totalStudents - passed - failed },
  };
});

export const semesterTrends: SemesterTrend[] = [
  { semester: '١٤٤٣ هـ - الأول', semesterEn: '2021 - Fall', avgGPA: 2.71, dfwRate: 18.3, passRate: 81.7, enrollment: 68500, retentionRate: 86.2, atRiskCount: 4120 },
  { semester: '١٤٤٣ هـ - الثاني', semesterEn: '2022 - Spring', avgGPA: 2.78, dfwRate: 17.1, passRate: 82.9, enrollment: 66800, retentionRate: 87.1, atRiskCount: 3890 },
  { semester: '١٤٤٤ هـ - الأول', semesterEn: '2022 - Fall', avgGPA: 2.82, dfwRate: 16.5, passRate: 83.5, enrollment: 70200, retentionRate: 87.8, atRiskCount: 3760 },
  { semester: '١٤٤٤ هـ - الثاني', semesterEn: '2023 - Spring', avgGPA: 2.85, dfwRate: 15.8, passRate: 84.2, enrollment: 69100, retentionRate: 88.3, atRiskCount: 3580 },
  { semester: '١٤٤٥ هـ - الأول', semesterEn: '2023 - Fall', avgGPA: 2.89, dfwRate: 15.2, passRate: 84.8, enrollment: 71400, retentionRate: 88.9, atRiskCount: 3420 },
  { semester: '١٤٤٥ هـ - الثاني', semesterEn: '2024 - Spring', avgGPA: 2.93, dfwRate: 14.6, passRate: 85.4, enrollment: 70800, retentionRate: 89.5, atRiskCount: 3250 },
];

export const heatmapData: HeatmapCell[] = allSections.map(sec => {
  const course = allCourses.find(c => c.sections.some(s => s.id === sec.id))!;
  return {
    courseCode: course.code,
    sectionNumber: sec.sectionNumber,
    facultyNameAr: sec.facultyNameAr,
    facultyNameEn: sec.facultyNameEn,
    passRate: sec.passRate,
    avgGPA: sec.avgGPA,
    performance: sec.performance,
  };
});
