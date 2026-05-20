import type { DigitalTwinData } from '../types';

export const mockStudent: DigitalTwinData = {
  profile: {
    id: '1',
    name: 'عبدالرحمن محمد شمر',
    nameEn: 'Abdulrahman Mohammed Shammar',
    studentId: '442103567',
    department: 'علوم الحاسب',
    departmentEn: 'Computer Science',
    college: 'كلية الحاسب',
    collegeEn: 'College of Computer',
    gpa: 3.85,
    gpaScale: 5.0,
    creditHoursCompleted: 98,
    creditHoursRequired: 136,
    expectedGraduation: '1446/1447',
    enrollmentStatus: 'active',
    lastActive: '2024-03-10',
    riskLevel: 'low',
    academicStanding: 'very-good',
    level: 7,
  },

  semesterGPAs: [
    { semester: '١٤٤٠/١ فصل', semesterEn: 'Fall 1440', gpa: 3.2, creditHours: 15 },
    { semester: '١٤٤٠/٢ فصل', semesterEn: 'Spring 1440', gpa: 3.5, creditHours: 16 },
    { semester: '١٤٤١/١ فصل', semesterEn: 'Fall 1441', gpa: 3.7, creditHours: 18 },
    { semester: '١٤٤١/٢ فصل', semesterEn: 'Spring 1441', gpa: 3.6, creditHours: 17 },
    { semester: '١٤٤٢/١ فصل', semesterEn: 'Fall 1442', gpa: 4.0, creditHours: 15 },
    { semester: '١٤٤٢/٢ فصل', semesterEn: 'Spring 1442', gpa: 3.9, creditHours: 16 },
    { semester: '١٤٤٣/١ فصل', semesterEn: 'Fall 1443', gpa: 4.2, creditHours: 15 },
  ],

  currentCourses: [
    { code: 'CS401', name: 'هندسة البرمجيات', nameEn: 'Software Engineering', creditHours: 3, grade: 'A', gradePoints: 5.0, bbGrade: '95/100', status: 'in-progress', instructor: 'د. خالد عتيب', instructorEn: 'Dr. Khalid Otaib', instructorEmail: 'k.otaibi@qu.edu.sa', contentPreview: 'نماذج التصميم، UML، اختبار البرمجيات', contentPreviewEn: 'Design patterns, UML, software testing' },
    { code: 'CS421', name: 'الذكاء الاصطناعي', nameEn: 'Artificial Intelligence', creditHours: 3, grade: 'A-', gradePoints: 4.75, bbGrade: '91/100', status: 'in-progress', instructor: 'د. سارة سعد', instructorEn: 'Dr. Sara Saad', instructorEmail: 's.mutairi@qu.edu.sa', contentPreview: 'خوارزميات البحث، التعلم الآلي، الشبكات العصبية', contentPreviewEn: 'Search algorithms, machine learning, neural networks' },
    { code: 'CS433', name: 'شبكات الحاسب', nameEn: 'Computer Networks', creditHours: 3, grade: 'B+', gradePoints: 4.5, bbGrade: '87/100', status: 'in-progress', instructor: 'د. فهد ناصر', instructorEn: 'Dr. Fahd Nasser', instructorEmail: 'f.harbi@qu.edu.sa', contentPreview: 'TCP/IP، بروتوكولات الشبكة، أمن الشبكات', contentPreviewEn: 'TCP/IP, network protocols, network security' },
    { code: 'CS450', name: 'مشروع التخرج ١', nameEn: 'Senior Project 1', creditHours: 3, grade: 'A', gradePoints: 5.0, bbGrade: '97/100', status: 'in-progress', instructor: 'د. عبدالله شاهر', instructorEn: 'Dr. Abdullah Shaher', instructorEmail: 'a.shehri@qu.edu.sa', contentPreview: 'منهجية البحث، تصميم المشروع، التنفيذ', contentPreviewEn: 'Research methodology, project design, implementation' },
    { code: 'ARAB301', name: 'الكتابة والتعبير', nameEn: 'Arabic Writing', creditHours: 2, grade: 'B', gradePoints: 4.0, bbGrade: '82/100', status: 'in-progress', instructor: 'أ. محمد قحطان', instructorEn: 'Mr. Mohammed Qahtan', instructorEmail: 'm.qahtani@qu.edu.sa', contentPreview: 'فنون الكتابة، التحرير، البلاغة', contentPreviewEn: 'Writing arts, editing, rhetoric' },
  ],

  allCourses: [
    { code: 'CS101', name: 'مقدمة في الحاسب', nameEn: 'Intro to CS', creditHours: 3, grade: 'A', status: 'completed' },
    { code: 'CS201', name: 'هياكل البيانات', nameEn: 'Data Structures', creditHours: 3, grade: 'A-', status: 'completed' },
    { code: 'CS202', name: 'خوارزميات', nameEn: 'Algorithms', creditHours: 3, grade: 'B+', status: 'completed' },
    { code: 'CS301', name: 'نظم التشغيل', nameEn: 'Operating Systems', creditHours: 3, grade: 'A', status: 'completed' },
    { code: 'CS302', name: 'قواعد البيانات', nameEn: 'Databases', creditHours: 3, grade: 'A', status: 'completed' },
    { code: 'MATH101', name: 'تفاضل وتكامل ١', nameEn: 'Calculus I', creditHours: 3, grade: 'B', status: 'completed' },
    { code: 'MATH201', name: 'رياضيات متقطعة', nameEn: 'Discrete Math', creditHours: 3, grade: 'A-', status: 'completed' },
    { code: 'CS451', name: 'مشروع التخرج ٢', nameEn: 'Senior Project 2', creditHours: 3, status: 'remaining' },
    { code: 'CS461', name: 'أمن المعلومات', nameEn: 'Information Security', creditHours: 3, status: 'remaining' },
    { code: 'CS472', name: 'تعلم الآلة', nameEn: 'Machine Learning', creditHours: 3, status: 'remaining' },
  ],

  studyPlan: [
    { code: 'CS101', name: 'مقدمة في الحاسب', nameEn: 'Intro to CS', creditHours: 3, status: 'completed', prerequisites: [], category: 'major' },
    { code: 'CS201', name: 'هياكل البيانات', nameEn: 'Data Structures', creditHours: 3, status: 'completed', prerequisites: ['CS101'], category: 'major' },
    { code: 'CS202', name: 'خوارزميات', nameEn: 'Algorithms', creditHours: 3, status: 'completed', prerequisites: ['CS201'], category: 'major' },
    { code: 'CS301', name: 'نظم التشغيل', nameEn: 'Operating Systems', creditHours: 3, status: 'completed', prerequisites: ['CS201'], category: 'major' },
    { code: 'CS302', name: 'قواعد البيانات', nameEn: 'Databases', creditHours: 3, status: 'completed', prerequisites: ['CS201'], category: 'major' },
    { code: 'CS401', name: 'هندسة البرمجيات', nameEn: 'Software Engineering', creditHours: 3, status: 'in-progress', prerequisites: ['CS202'], category: 'major' },
    { code: 'CS421', name: 'الذكاء الاصطناعي', nameEn: 'Artificial Intelligence', creditHours: 3, status: 'in-progress', prerequisites: ['CS202', 'MATH201'], category: 'major' },
    { code: 'CS433', name: 'شبكات الحاسب', nameEn: 'Computer Networks', creditHours: 3, status: 'in-progress', prerequisites: ['CS301'], category: 'major' },
    { code: 'CS450', name: 'مشروع التخرج ١', nameEn: 'Senior Project 1', creditHours: 3, status: 'in-progress', prerequisites: ['CS301', 'CS302'], category: 'major' },
    { code: 'CS451', name: 'مشروع التخرج ٢', nameEn: 'Senior Project 2', creditHours: 3, status: 'remaining', prerequisites: ['CS450'], category: 'major' },
    { code: 'CS461', name: 'أمن المعلومات', nameEn: 'Information Security', creditHours: 3, status: 'remaining', prerequisites: ['CS433'], category: 'major' },
    { code: 'CS472', name: 'تعلم الآلة', nameEn: 'Machine Learning', creditHours: 3, status: 'remaining', prerequisites: ['CS421'], category: 'major' },
    { code: 'MATH101', name: 'تفاضل وتكامل ١', nameEn: 'Calculus I', creditHours: 3, status: 'completed', prerequisites: [], category: 'college' },
    { code: 'MATH201', name: 'رياضيات متقطعة', nameEn: 'Discrete Math', creditHours: 3, status: 'completed', prerequisites: ['MATH101'], category: 'college' },
    { code: 'ARAB301', name: 'الكتابة والتعبير', nameEn: 'Arabic Writing', creditHours: 2, status: 'in-progress', prerequisites: [], category: 'university' },
  ],

  behavioral: {
    lmsLoginFrequency: 5.2,
    assignmentSubmissionRate: 92,
    attendanceRate: 88,
    libraryVisits: 12,
    lmsHoursPerWeek: 14.5,
    attendanceByMonth: [
      { month: 'سبتمبر', monthEn: 'Sep', rate: 95 },
      { month: 'أكتوبر', monthEn: 'Oct', rate: 90 },
      { month: 'نوفمبر', monthEn: 'Nov', rate: 85 },
      { month: 'ديسمبر', monthEn: 'Dec', rate: 82 },
      { month: 'يناير', monthEn: 'Jan', rate: 88 },
      { month: 'فبراير', monthEn: 'Feb', rate: 92 },
      { month: 'مارس', monthEn: 'Mar', rate: 87 },
    ],
    studyPatterns: [
      { hour: 6, activity: 5 }, { hour: 7, activity: 10 }, { hour: 8, activity: 35 },
      { hour: 9, activity: 60 }, { hour: 10, activity: 75 }, { hour: 11, activity: 65 },
      { hour: 12, activity: 30 }, { hour: 13, activity: 20 }, { hour: 14, activity: 40 },
      { hour: 15, activity: 55 }, { hour: 16, activity: 70 }, { hour: 17, activity: 50 },
      { hour: 18, activity: 25 }, { hour: 19, activity: 15 }, { hour: 20, activity: 45 },
      { hour: 21, activity: 65 }, { hour: 22, activity: 55 }, { hour: 23, activity: 30 },
    ],
    courseEngagement: [
      { course: 'CS401', hours: 4.2, submissions: 8 },
      { course: 'CS421', hours: 5.1, submissions: 7 },
      { course: 'CS433', hours: 3.5, submissions: 6 },
      { course: 'CS450', hours: 6.0, submissions: 4 },
      { course: 'ARAB301', hours: 1.5, submissions: 5 },
    ],
    excusedAbsences: 4,
    unexcusedAbsences: 8,
    totalClasses: 98,
    attendanceHeatmap: (() => {
      const entries: { week: number; day: number; status: 'present' | 'absent-excused' | 'absent-unexcused' | 'no-class' }[] = [];
      for (let w = 1; w <= 14; w++) {
        for (let d = 0; d < 5; d++) {
          const rand = Math.random();
          entries.push({
            week: w,
            day: d,
            status: rand < 0.78 ? 'present' : rand < 0.85 ? 'absent-excused' : rand < 0.92 ? 'absent-unexcused' : 'no-class',
          });
        }
      }
      return entries;
    })(),
  },

  risk: {
    overallScore: 22,
    trend: 'improving',
    categoryScores: [
      { category: 'academic_performance', score: 15, label: 'الأداء الأكاديمي', labelEn: 'Academic Performance' },
      { category: 'engagement', score: 20, label: 'المشاركة', labelEn: 'Engagement' },
      { category: 'financial', score: 10, label: 'المالية', labelEn: 'Financial' },
      { category: 'health_wellness', score: 25, label: 'الصحة والعافية', labelEn: 'Health & Wellness' },
      { category: 'social_integration', score: 30, label: 'التكامل الاجتماعي', labelEn: 'Social Integration' },
      { category: 'course_specific', score: 18, label: 'المقررات', labelEn: 'Course-Specific' },
      { category: 'time_management', score: 35, label: 'إدارة الوقت', labelEn: 'Time Management' },
      { category: 'institutional', score: 12, label: 'المؤسسي', labelEn: 'Institutional' },
      { category: 'external', score: 8, label: 'العوامل الخارجية', labelEn: 'External' },
    ],
    indicators: [
      { id: 'r1', name: 'انخفاض المعدل', nameEn: 'GPA Drop', category: 'academic_performance', score: 12, trend: 'improving', description: 'لا يوجد انخفاض ملحوظ في المعدل', descriptionEn: 'No significant GPA drop detected' },
      { id: 'r2', name: 'تأخر التسليمات', nameEn: 'Late Submissions', category: 'engagement', score: 25, trend: 'stable', description: 'بعض التأخير في تسليم الواجبات', descriptionEn: 'Some delays in assignment submissions' },
      { id: 'r3', name: 'الغياب المتكرر', nameEn: 'Frequent Absences', category: 'engagement', score: 20, trend: 'improving', description: 'تحسن في نسبة الحضور مؤخراً', descriptionEn: 'Attendance has improved recently' },
      { id: 'r4', name: 'عدم التفاعل في المنصة', nameEn: 'Low LMS Activity', category: 'engagement', score: 18, trend: 'stable', description: 'تفاعل مقبول مع المنصة التعليمية', descriptionEn: 'Acceptable LMS engagement level' },
      { id: 'r5', name: 'ضغط المقررات', nameEn: 'Course Load Stress', category: 'time_management', score: 40, trend: 'declining', description: 'عبء أكاديمي مرتفع هذا الفصل', descriptionEn: 'High academic load this semester' },
      { id: 'r6', name: 'التفاعل والمشاركة', nameEn: 'Engagement & Participation', tooltip: 'خطر عزلة اجتماعية', tooltipEn: 'Social isolation risk', category: 'social_integration', score: 30, trend: 'stable', description: 'مشاركة محدودة في الأنشطة الجامعية', descriptionEn: 'Limited participation in university activities' },
    ],
    history: [
      { date: '2024-09', score: 35 }, { date: '2024-10', score: 30 },
      { date: '2024-11', score: 28 }, { date: '2024-12', score: 25 },
      { date: '2025-01', score: 24 }, { date: '2025-02', score: 22 },
      { date: '2025-03', score: 22 },
    ],
  },

  recommendations: [
    {
      id: 'rec1', title: 'مراجعة المرشد الأكاديمي', titleEn: 'Visit Academic Advisor',
      description: 'ينصح بزيارة المرشد الأكاديمي لمناقشة الخطة الدراسية للفصل القادم وتخفيف العبء الأكاديمي',
      descriptionEn: 'Visit your academic advisor to discuss next semester plan and reduce course load',
      category: 'academic', priority: 'important',
      actionLabel: 'حجز موعد', actionLabelEn: 'Book Appointment',
    },
    {
      id: 'rec2', title: 'تحسين إدارة الوقت', titleEn: 'Improve Time Management',
      description: 'استخدام تقنية بومودورو وتطبيقات تنظيم الوقت لتحسين الإنتاجية الدراسية',
      descriptionEn: 'Use Pomodoro technique and time management apps to improve study productivity',
      category: 'behavioral', priority: 'suggestion',
      actionLabel: 'عرض الموارد', actionLabelEn: 'View Resources',
    },
    {
      id: 'rec3', title: 'المشاركة في الأنشطة الطلابية', titleEn: 'Join Student Activities',
      description: 'الانضمام لنادي الحاسب الآلي أو المشاركة في هاكاثون الجامعة لتعزيز التكامل الاجتماعي',
      descriptionEn: 'Join the Computer Club or participate in university hackathons to boost social integration',
      category: 'wellness', priority: 'suggestion',
      actionLabel: 'استعراض الأنشطة', actionLabelEn: 'Browse Activities',
    },
    {
      id: 'rec4', title: 'تسليم الواجبات في موعدها', titleEn: 'Submit Assignments On Time',
      description: 'تم رصد تأخير في بعض التسليمات. يرجى الالتزام بالمواعيد النهائية لتحسين التقييم',
      descriptionEn: 'Late submissions detected. Please meet deadlines to improve assessment scores',
      category: 'academic', priority: 'urgent',
      actionLabel: 'عرض المواعيد', actionLabelEn: 'View Deadlines',
    },
  ],

  timeline: [
    { id: 't1', type: 'academic', title: 'تسجيل الفصل الدراسي', titleEn: 'Semester Registration', description: 'تم تسجيل 5 مقررات بإجمالي 14 ساعة', descriptionEn: 'Registered 5 courses totaling 14 credit hours', timestamp: '2025-01-15T08:30:00' },
    { id: 't2', type: 'behavioral', title: 'ارتفاع نسبة الحضور', titleEn: 'Attendance Improvement', description: 'تحسن الحضور بنسبة 5% مقارنة بالفصل السابق', descriptionEn: 'Attendance improved by 5% compared to last semester', timestamp: '2025-02-01T10:00:00' },
    { id: 't3', type: 'alert', title: 'تنبيه: تأخر تسليم واجب', titleEn: 'Alert: Late Assignment', description: 'تأخر تسليم واجب شبكات الحاسب بيومين', descriptionEn: 'Computer Networks assignment submitted 2 days late', timestamp: '2025-02-15T23:59:00' },
    { id: 't4', type: 'academic', title: 'اجتياز الاختبار النصفي', titleEn: 'Midterm Results', description: 'حصل على معدل A- في الاختبارات النصفية', descriptionEn: 'Achieved A- average on midterm exams', timestamp: '2025-03-01T14:00:00' },
    { id: 't5', type: 'intervention', title: 'جلسة إرشاد أكاديمي', titleEn: 'Academic Counseling Session', description: 'حضر جلسة مع المرشد الأكاديمي لمناقشة خطة التخرج', descriptionEn: 'Attended session with academic advisor to discuss graduation plan', timestamp: '2025-03-05T11:00:00' },
    { id: 't6', type: 'behavioral', title: 'نشاط في المنصة التعليمية', titleEn: 'LMS Activity Spike', description: 'زيادة ملحوظة في استخدام بلاك بورد هذا الأسبوع', descriptionEn: 'Notable increase in Blackboard usage this week', timestamp: '2025-03-08T16:30:00' },
    { id: 't7', type: 'academic', title: 'تقديم مشروع التخرج', titleEn: 'Senior Project Submission', description: 'تم تقديم المرحلة الأولى من مشروع التخرج بنجاح', descriptionEn: 'Successfully submitted phase 1 of senior project', timestamp: '2025-03-10T09:00:00' },
  ],
};
