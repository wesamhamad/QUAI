import type { Course, StudentPlanProfile, SemesterPlan, ElectiveRecommendation, ScheduleOption } from '../types';

export const studentProfile: StudentPlanProfile = {
  name: 'ليان أحمد دوسر',
  nameEn: 'Layan Ahmad Dosar',
  studentId: '443200156',
  major: 'علوم الحاسب',
  majorEn: 'Computer Science',
  college: 'كلية الحاسب',
  collegeEn: 'College of Computer',
  currentSemester: 5,
  currentGPA: 4.32,
  gpaScale: 5.0,
  completedCredits: 85,
  requiredCredits: 136,
  expectedGraduation: '١٤٤٧/١٤٤٨ هـ',
  expectedGraduationEn: '2025/2026',
};

export const allCourses: Course[] = [
  // Semester 1 — University Requirements
  { code: 'ARAB101', nameAr: 'المهارات اللغوية', nameEn: 'Arabic Language Skills', creditHours: 3, prerequisites: [], category: 'university', planSemester: 1, status: 'completed', grade: 'A', gradePoints: 5.0 },
  { code: 'ENGL101', nameAr: 'اللغة الإنجليزية ١', nameEn: 'English I', creditHours: 3, prerequisites: [], category: 'university', planSemester: 1, status: 'completed', grade: 'A+', gradePoints: 5.0 },
  { code: 'MATH101', nameAr: 'تفاضل وتكامل ١', nameEn: 'Calculus I', creditHours: 3, prerequisites: [], category: 'college', planSemester: 1, status: 'completed', grade: 'B+', gradePoints: 4.5 },
  { code: 'CS101', nameAr: 'مقدمة في الحاسب', nameEn: 'Intro to Computing', creditHours: 3, prerequisites: [], category: 'major-core', planSemester: 1, status: 'completed', grade: 'A+', gradePoints: 5.0 },
  { code: 'PHYS101', nameAr: 'فيزياء عامة ١', nameEn: 'Physics I', creditHours: 3, prerequisites: [], category: 'college', planSemester: 1, status: 'completed', grade: 'A-', gradePoints: 4.75 },

  // Semester 2
  { code: 'ISLM101', nameAr: 'الثقافة الإسلامية ١', nameEn: 'Islamic Culture I', creditHours: 2, prerequisites: [], category: 'university', planSemester: 2, status: 'completed', grade: 'A', gradePoints: 5.0 },
  { code: 'ENGL102', nameAr: 'اللغة الإنجليزية ٢', nameEn: 'English II', creditHours: 3, prerequisites: ['ENGL101'], category: 'university', planSemester: 2, status: 'completed', grade: 'A', gradePoints: 5.0 },
  { code: 'MATH102', nameAr: 'تفاضل وتكامل ٢', nameEn: 'Calculus II', creditHours: 3, prerequisites: ['MATH101'], category: 'college', planSemester: 2, status: 'completed', grade: 'B+', gradePoints: 4.5 },
  { code: 'CS111', nameAr: 'برمجة ١', nameEn: 'Programming I', creditHours: 3, prerequisites: ['CS101'], category: 'major-core', planSemester: 2, status: 'completed', grade: 'A', gradePoints: 5.0 },
  { code: 'STAT201', nameAr: 'الاحتمالات والإحصاء', nameEn: 'Probability & Statistics', creditHours: 3, prerequisites: ['MATH101'], category: 'college', planSemester: 2, status: 'completed', grade: 'A-', gradePoints: 4.75 },

  // Semester 3
  { code: 'ISLM201', nameAr: 'الثقافة الإسلامية ٢', nameEn: 'Islamic Culture II', creditHours: 2, prerequisites: ['ISLM101'], category: 'university', planSemester: 3, status: 'completed', grade: 'A', gradePoints: 5.0 },
  { code: 'CS211', nameAr: 'برمجة ٢', nameEn: 'Programming II', creditHours: 3, prerequisites: ['CS111'], category: 'major-core', planSemester: 3, status: 'completed', grade: 'A-', gradePoints: 4.75 },
  { code: 'CS201', nameAr: 'هياكل البيانات', nameEn: 'Data Structures', creditHours: 3, prerequisites: ['CS111'], category: 'major-core', planSemester: 3, status: 'completed', grade: 'A', gradePoints: 5.0 },
  { code: 'MATH201', nameAr: 'رياضيات متقطعة', nameEn: 'Discrete Mathematics', creditHours: 3, prerequisites: ['MATH101'], category: 'college', planSemester: 3, status: 'completed', grade: 'A-', gradePoints: 4.75 },
  { code: 'CS221', nameAr: 'تنظيم الحاسب', nameEn: 'Computer Organization', creditHours: 3, prerequisites: ['CS101'], category: 'major-core', planSemester: 3, status: 'completed', grade: 'B+', gradePoints: 4.5 },

  // Semester 4
  { code: 'ISLM301', nameAr: 'الثقافة الإسلامية ٣', nameEn: 'Islamic Culture III', creditHours: 2, prerequisites: ['ISLM201'], category: 'university', planSemester: 4, status: 'completed', grade: 'A', gradePoints: 5.0 },
  { code: 'CS202', nameAr: 'تصميم وتحليل الخوارزميات', nameEn: 'Algorithms', creditHours: 3, prerequisites: ['CS201', 'MATH201'], category: 'major-core', planSemester: 4, status: 'completed', grade: 'A', gradePoints: 5.0 },
  { code: 'CS301', nameAr: 'نظم التشغيل', nameEn: 'Operating Systems', creditHours: 3, prerequisites: ['CS201', 'CS221'], category: 'major-core', planSemester: 4, status: 'completed', grade: 'B+', gradePoints: 4.5 },
  { code: 'CS302', nameAr: 'قواعد البيانات', nameEn: 'Databases', creditHours: 3, prerequisites: ['CS201'], category: 'major-core', planSemester: 4, status: 'completed', grade: 'A', gradePoints: 5.0 },
  { code: 'MATH301', nameAr: 'الجبر الخطي', nameEn: 'Linear Algebra', creditHours: 3, prerequisites: ['MATH102'], category: 'college', planSemester: 4, status: 'completed', grade: 'B', gradePoints: 4.0 },

  // Semester 5 (current)
  { code: 'CS401', nameAr: 'هندسة البرمجيات', nameEn: 'Software Engineering', creditHours: 3, prerequisites: ['CS202', 'CS302'], category: 'major-core', planSemester: 5, status: 'in-progress', descriptionAr: 'تصميم وتطوير البرمجيات بمنهجيات حديثة', descriptionEn: 'Modern software design and development methodologies' },
  { code: 'CS421', nameAr: 'الذكاء الاصطناعي', nameEn: 'Artificial Intelligence', creditHours: 3, prerequisites: ['CS202', 'STAT201'], category: 'major-core', planSemester: 5, status: 'in-progress', descriptionAr: 'أساسيات الذكاء الاصطناعي والتعلم', descriptionEn: 'Fundamentals of AI and learning algorithms' },
  { code: 'CS433', nameAr: 'شبكات الحاسب', nameEn: 'Computer Networks', creditHours: 3, prerequisites: ['CS301'], category: 'major-core', planSemester: 5, status: 'in-progress', descriptionAr: 'بروتوكولات وتقنيات الشبكات', descriptionEn: 'Network protocols and technologies' },
  { code: 'CS311', nameAr: 'نظرية الحوسبة', nameEn: 'Theory of Computation', creditHours: 3, prerequisites: ['CS202', 'MATH201'], category: 'major-core', planSemester: 5, status: 'in-progress', descriptionAr: 'اللغات الشكلية والحوسبة', descriptionEn: 'Formal languages and computability' },
  { code: 'ARAB301', nameAr: 'الكتابة والتعبير', nameEn: 'Arabic Writing', creditHours: 2, prerequisites: ['ARAB101'], category: 'university', planSemester: 5, status: 'in-progress' },

  // Semester 6 (available next)
  { code: 'CS450', nameAr: 'مشروع التخرج ١', nameEn: 'Senior Project I', creditHours: 3, prerequisites: ['CS401'], category: 'major-core', planSemester: 6, status: 'available', descriptionAr: 'تصميم وتخطيط مشروع التخرج', descriptionEn: 'Design and plan the capstone project', instructor: 'د. سارة قحطان', instructorEn: 'Dr. Sarah Qahtan', schedule: 'أحد-ثلاثاء ٨:٠٠-٩:٣٠', scheduleEn: 'Sun-Tue 8:00-9:30', room: 'قاعة ٢٠٥', roomEn: 'Room 205', seats: 15 },
  { code: 'CS461', nameAr: 'أمن المعلومات', nameEn: 'Information Security', creditHours: 3, prerequisites: ['CS433', 'CS301'], category: 'major-core', planSemester: 6, status: 'available', descriptionAr: 'أمن الشبكات والتشفير', descriptionEn: 'Network security and cryptography', instructor: 'د. فهد عتيب', instructorEn: 'Dr. Fahad Otaib', schedule: 'اثنين-أربعاء ١٠:٠٠-١١:٣٠', scheduleEn: 'Mon-Wed 10:00-11:30', room: 'قاعة ٣٠١', roomEn: 'Room 301', seats: 22 },
  { code: 'CS442', nameAr: 'الحوسبة السحابية', nameEn: 'Cloud Computing', creditHours: 3, prerequisites: ['CS301', 'CS433'], category: 'major-elective', planSemester: 6, status: 'available', descriptionAr: 'تقنيات وخدمات الحوسبة السحابية', descriptionEn: 'Cloud computing technologies and services', instructor: 'د. نورة شمر', instructorEn: 'Dr. Noura Shammar', schedule: 'اثنين-أربعاء ١٢:٠٠-١:٣٠', scheduleEn: 'Mon-Wed 12:00-1:30', room: 'قاعة ١٠٣', roomEn: 'Room 103', seats: 30 },
  { code: 'CS472', nameAr: 'تعلم الآلة', nameEn: 'Machine Learning', creditHours: 3, prerequisites: ['CS421', 'MATH301', 'STAT201'], category: 'major-elective', planSemester: 6, status: 'available', descriptionAr: 'خوارزميات وتطبيقات تعلم الآلة', descriptionEn: 'ML algorithms and applications', instructor: 'د. عبدالله ناصر', instructorEn: 'Dr. Abdullah Nasser', schedule: 'أحد-ثلاثاء ٢:٠٠-٣:٣٠', scheduleEn: 'Sun-Tue 2:00-3:30', room: 'معمل ٤٠٢', roomEn: 'Lab 402', seats: 25 },
  { code: 'ISLM401', nameAr: 'الثقافة الإسلامية ٤', nameEn: 'Islamic Culture IV', creditHours: 2, prerequisites: ['ISLM301'], category: 'university', planSemester: 6, status: 'available', instructor: 'د. محمد السالم', instructorEn: 'Dr. Mohammed Al-Salem', schedule: 'أربعاء ١٠:٠٠-١٢:٠٠', scheduleEn: 'Wed 10:00-12:00', room: 'قاعة ٥٠١', roomEn: 'Room 501', seats: 50 },

  // Semester 7 (locked)
  { code: 'CS451', nameAr: 'مشروع التخرج ٢', nameEn: 'Senior Project II', creditHours: 3, prerequisites: ['CS450'], category: 'major-core', planSemester: 7, status: 'locked', descriptionAr: 'تنفيذ مشروع التخرج والعرض', descriptionEn: 'Implement and present the capstone project' },
  { code: 'CS481', nameAr: 'التدريب التعاوني', nameEn: 'Co-op Training', creditHours: 6, prerequisites: ['CS401', 'CS433'], category: 'major-core', planSemester: 7, status: 'locked', descriptionAr: 'تدريب عملي في القطاع', descriptionEn: 'Industry cooperative training' },
  { code: 'CS473', nameAr: 'التعلم العميق', nameEn: 'Deep Learning', creditHours: 3, prerequisites: ['CS472'], category: 'major-elective', planSemester: 7, status: 'locked', descriptionAr: 'الشبكات العصبية العميقة', descriptionEn: 'Deep neural networks and applications' },
  { code: 'CS462', nameAr: 'التشفير التطبيقي', nameEn: 'Applied Cryptography', creditHours: 3, prerequisites: ['CS461', 'MATH201'], category: 'major-elective', planSemester: 7, status: 'locked', descriptionAr: 'تقنيات التشفير والتطبيقات', descriptionEn: 'Cryptographic techniques and applications' },

  // Semester 8 (locked)
  { code: 'CS490', nameAr: 'موضوعات مختارة', nameEn: 'Selected Topics in CS', creditHours: 3, prerequisites: ['CS451'], category: 'major-elective', planSemester: 8, status: 'locked', descriptionAr: 'موضوعات بحثية متقدمة', descriptionEn: 'Advanced research topics' },
  { code: 'CS482', nameAr: 'ريادة الأعمال التقنية', nameEn: 'Tech Entrepreneurship', creditHours: 2, prerequisites: ['CS401'], category: 'free-elective', planSemester: 8, status: 'locked', descriptionAr: 'تأسيس وإدارة الشركات التقنية', descriptionEn: 'Founding and managing tech startups' },
  { code: 'CS443', nameAr: 'إنترنت الأشياء', nameEn: 'Internet of Things', creditHours: 3, prerequisites: ['CS433', 'CS221'], category: 'major-elective', planSemester: 8, status: 'locked', descriptionAr: 'تقنيات وبروتوكولات إنترنت الأشياء', descriptionEn: 'IoT technologies and protocols' },
  { code: 'MGT301', nameAr: 'مبادئ الإدارة', nameEn: 'Principles of Management', creditHours: 3, prerequisites: [], category: 'free-elective', planSemester: 8, status: 'locked' },
];

export const currentSemesterPlan: SemesterPlan[] = [
  {
    semester: 6,
    label: 'الفصل السادس (القادم)',
    labelEn: 'Semester 6 (Next)',
    courses: ['CS450', 'CS461', 'CS472', 'CS442', 'ISLM401'],
  },
  {
    semester: 7,
    label: 'الفصل السابع',
    labelEn: 'Semester 7',
    courses: ['CS451', 'CS481', 'CS473'],
  },
  {
    semester: 8,
    label: 'الفصل الثامن',
    labelEn: 'Semester 8',
    courses: ['CS490', 'CS482', 'CS443', 'MGT301'],
  },
];

export const electiveRecommendations: ElectiveRecommendation[] = [
  {
    code: 'CS472',
    nameAr: 'تعلم الآلة',
    nameEn: 'Machine Learning',
    creditHours: 3,
    category: 'major-elective',
    reasonAr: 'يتوافق مع تخصصك في الذكاء الاصطناعي ومعدلك المرتفع في الإحصاء — طالبات علوم الحاسب يحققن معدل ٤.٢ في هذه المادة',
    reasonEn: 'Aligns with your AI track and strong statistics performance — CS students average 4.2 GPA in this course',
    difficulty: 'hard',
    professorRating: 4.5,
    gpaImpact: 'neutral',
    careerTags: ['علم البيانات', 'ذكاء اصطناعي'],
    careerTagsEn: ['Data Science', 'AI'],
    timeSlot: 'أحد-ثلاثاء ٢:٠٠-٣:٣٠',
    timeSlotEn: 'Sun-Tue 2:00-3:30',
    peerSuccessRate: 78,
  },
  {
    code: 'CS442',
    nameAr: 'الحوسبة السحابية',
    nameEn: 'Cloud Computing',
    creditHours: 3,
    category: 'major-elective',
    reasonAr: 'مطلوب في سوق العمل بشدة — ٨٥٪ من الطلاب ينجحون بتقدير B+ أو أعلى',
    reasonEn: 'High demand in job market — 85% of students achieve B+ or higher',
    difficulty: 'medium',
    professorRating: 4.8,
    gpaImpact: 'booster',
    careerTags: ['حوسبة سحابية', 'DevOps'],
    careerTagsEn: ['Cloud', 'DevOps'],
    timeSlot: 'اثنين-أربعاء ١٢:٠٠-١:٣٠',
    timeSlotEn: 'Mon-Wed 12:00-1:30',
    peerSuccessRate: 85,
  },
  {
    code: 'CS482',
    nameAr: 'ريادة الأعمال التقنية',
    nameEn: 'Tech Entrepreneurship',
    creditHours: 2,
    category: 'free-elective',
    reasonAr: 'مادة خفيفة ترفع المعدل — ٩٢٪ نسبة نجاح الأقران بتقدير A',
    reasonEn: 'Light workload GPA booster — 92% peer success rate with grade A',
    difficulty: 'easy',
    professorRating: 4.2,
    gpaImpact: 'booster',
    careerTags: ['ريادة أعمال', 'إدارة مشاريع'],
    careerTagsEn: ['Entrepreneurship', 'Project Management'],
    timeSlot: 'ثلاثاء ١٢:٠٠-٢:٠٠',
    timeSlotEn: 'Tue 12:00-2:00',
    peerSuccessRate: 92,
  },
  {
    code: 'CS473',
    nameAr: 'التعلم العميق',
    nameEn: 'Deep Learning',
    creditHours: 3,
    category: 'major-elective',
    reasonAr: 'تكملة مسار الذكاء الاصطناعي بعد تعلم الآلة — ٦٥٪ نسبة نجاح الأقران',
    reasonEn: 'Completes AI track after Machine Learning — 65% peer success rate',
    difficulty: 'hard',
    professorRating: 4.3,
    gpaImpact: 'risk',
    careerTags: ['تعلم عميق', 'رؤية حاسوبية'],
    careerTagsEn: ['Deep Learning', 'Computer Vision'],
    timeSlot: 'أحد-ثلاثاء ٢:٠٠-٣:٣٠',
    timeSlotEn: 'Sun-Tue 2:00-3:30',
    peerSuccessRate: 65,
  },
  {
    code: 'CS443',
    nameAr: 'إنترنت الأشياء',
    nameEn: 'Internet of Things',
    creditHours: 3,
    category: 'major-elective',
    reasonAr: 'مجال واعد في رؤية ٢٠٣٠ — ٧٥٪ نسبة نجاح الأقران',
    reasonEn: 'Growing field aligned with Vision 2030 — 75% peer success rate',
    difficulty: 'medium',
    professorRating: 3.9,
    gpaImpact: 'neutral',
    careerTags: ['إنترنت الأشياء', 'أنظمة مدمجة'],
    careerTagsEn: ['IoT', 'Embedded Systems'],
    timeSlot: 'اثنين-أربعاء ٨:٠٠-٩:٣٠',
    timeSlotEn: 'Mon-Wed 8:00-9:30',
    peerSuccessRate: 75,
  },
];

export const scheduleOptions: ScheduleOption[] = [
  {
    id: 'fastest',
    nameAr: 'الأسرع',
    nameEn: 'Fastest',
    descriptionAr: 'أقصر مدة للتخرج — عبء دراسي مرتفع (١٨ ساعة/فصل)',
    descriptionEn: 'Shortest time to graduation — heavy load (18 hrs/sem)',
    tag: 'fastest',
    projectedGPA: 4.15,
    graduationDate: '١٤٤٦/٢',
    graduationDateEn: 'Spring 2025',
    semesters: [
      { semester: 6, label: 'الفصل ٦', labelEn: 'Sem 6', courses: ['CS450', 'CS461', 'CS472', 'CS442', 'ISLM401', 'CS462'] },
      { semester: 7, label: 'الفصل ٧', labelEn: 'Sem 7', courses: ['CS451', 'CS481', 'CS473'] },
      { semester: 8, label: 'الفصل ٨', labelEn: 'Sem 8', courses: ['CS490', 'CS482', 'CS443', 'MGT301'] },
    ],
  },
  {
    id: 'balanced',
    nameAr: 'المتوازن',
    nameEn: 'Balanced',
    descriptionAr: 'توازن بين المعدل والسرعة (١٥ ساعة/فصل)',
    descriptionEn: 'Balanced GPA and speed (15 hrs/sem)',
    tag: 'balanced',
    projectedGPA: 4.32,
    graduationDate: '١٤٤٧/١',
    graduationDateEn: 'Fall 2025',
    semesters: [
      { semester: 6, label: 'الفصل ٦', labelEn: 'Sem 6', courses: ['CS450', 'CS461', 'CS442', 'ISLM401'] },
      { semester: 7, label: 'الفصل ٧', labelEn: 'Sem 7', courses: ['CS472', 'CS451', 'CS481'] },
      { semester: 8, label: 'الفصل ٨', labelEn: 'Sem 8', courses: ['CS473', 'CS490', 'CS482', 'CS443', 'MGT301'] },
    ],
  },
  {
    id: 'gpa-safe',
    nameAr: 'الآمن للمعدل',
    nameEn: 'GPA-Safe',
    descriptionAr: 'حماية المعدل — عبء دراسي خفيف (١٢ ساعة/فصل)',
    descriptionEn: 'Protect your GPA — light load (12 hrs/sem)',
    tag: 'gpa-safe',
    projectedGPA: 4.45,
    graduationDate: '١٤٤٧/٢',
    graduationDateEn: 'Spring 2026',
    semesters: [
      { semester: 6, label: 'الفصل ٦', labelEn: 'Sem 6', courses: ['CS450', 'CS442', 'ISLM401'] },
      { semester: 7, label: 'الفصل ٧', labelEn: 'Sem 7', courses: ['CS461', 'CS472', 'CS451'] },
      { semester: 8, label: 'الفصل ٨', labelEn: 'Sem 8', courses: ['CS481', 'CS473', 'CS482'] },
      { semester: 9, label: 'الفصل ٩', labelEn: 'Sem 9', courses: ['CS490', 'CS462', 'CS443', 'MGT301'] },
    ],
  },
];

// Mock available courses for registration (API fallback)
export const availableCoursesForRegistration = [
  { code: 'CS450', nameAr: 'مشروع التخرج ١', nameEn: 'Senior Project I', creditHours: 3, instructor: 'د. سارة قحطان', instructorEn: 'Dr. Sarah Qahtan', schedule: 'أحد-ثلاثاء ٨:٠٠-٩:٣٠', scheduleEn: 'Sun-Tue 8:00-9:30', room: 'قاعة ٢٠٥', roomEn: 'Room 205', seats: 15, enrolled: 12, section: '1' },
  { code: 'CS461', nameAr: 'أمن المعلومات', nameEn: 'Information Security', creditHours: 3, instructor: 'د. فهد عتيب', instructorEn: 'Dr. Fahad Otaib', schedule: 'اثنين-أربعاء ١٠:٠٠-١١:٣٠', scheduleEn: 'Mon-Wed 10:00-11:30', room: 'قاعة ٣٠١', roomEn: 'Room 301', seats: 22, enrolled: 18, section: '1' },
  { code: 'CS461', nameAr: 'أمن المعلومات', nameEn: 'Information Security', creditHours: 3, instructor: 'د. خالد سعد', instructorEn: 'Dr. Khalid Saad', schedule: 'أحد-ثلاثاء ١٢:٠٠-١:٣٠', scheduleEn: 'Sun-Tue 12:00-1:30', room: 'قاعة ١٠٣', roomEn: 'Room 103', seats: 25, enrolled: 20, section: '2' },
  { code: 'CS442', nameAr: 'الحوسبة السحابية', nameEn: 'Cloud Computing', creditHours: 3, instructor: 'د. نورة شمر', instructorEn: 'Dr. Noura Shammar', schedule: 'اثنين-أربعاء ١٢:٠٠-١:٣٠', scheduleEn: 'Mon-Wed 12:00-1:30', room: 'قاعة ١٠٣', roomEn: 'Room 103', seats: 30, enrolled: 24, section: '1' },
  { code: 'CS472', nameAr: 'تعلم الآلة', nameEn: 'Machine Learning', creditHours: 3, instructor: 'د. عبدالله ناصر', instructorEn: 'Dr. Abdullah Nasser', schedule: 'أحد-ثلاثاء ٢:٠٠-٣:٣٠', scheduleEn: 'Sun-Tue 2:00-3:30', room: 'معمل ٤٠٢', roomEn: 'Lab 402', seats: 25, enrolled: 22, section: '1' },
  { code: 'ISLM401', nameAr: 'الثقافة الإسلامية ٤', nameEn: 'Islamic Culture IV', creditHours: 2, instructor: 'د. محمد السالم', instructorEn: 'Dr. Mohammed Al-Salem', schedule: 'أربعاء ١٠:٠٠-١٢:٠٠', scheduleEn: 'Wed 10:00-12:00', room: 'قاعة ٥٠١', roomEn: 'Room 501', seats: 50, enrolled: 35, section: '1' },
  { code: 'MGT301', nameAr: 'مبادئ الإدارة', nameEn: 'Principles of Management', creditHours: 3, instructor: 'د. أحمد عبدالله', instructorEn: 'Dr. Ahmed Abdullah', schedule: 'اثنين-أربعاء ٨:٠٠-٩:٣٠', scheduleEn: 'Mon-Wed 8:00-9:30', room: 'قاعة ٦٠٢', roomEn: 'Room 602', seats: 40, enrolled: 32, section: '1' },
];
