import type {
  RecoveryStudent,
  RecoveryCourse,
  RecoveryMilestone,
  ActionItem,
  WeeklyProgress,
  SupportResource,
} from '../types';

export const recoveryStudent: RecoveryStudent = {
  name: 'سعود محمد ناصر',
  nameEn: 'Saud Mohammed Nasser',
  studentId: '441234567',
  major: 'علوم الحاسب',
  majorEn: 'Computer Science',
  currentGPA: 1.85,
  targetGPA: 2.5,
  gpaScale: 5.0,
  probationSemester: 5,
  currentSemester: 6,
  weeksRemaining: 8,
  totalWeeks: 14,
  milestonesCompleted: 4,
  totalMilestones: 8,
};

export const recoveryCourses: RecoveryCourse[] = [
  { code: 'CS301', nameAr: 'هياكل البيانات', nameEn: 'Data Structures', creditHours: 3, currentGrade: 'D', currentPoints: 2.0, isAtRisk: true },
  { code: 'CS310', nameAr: 'قواعد البيانات', nameEn: 'Databases', creditHours: 3, currentGrade: 'C', currentPoints: 2.5, isAtRisk: false },
  { code: 'CS320', nameAr: 'شبكات الحاسب', nameEn: 'Computer Networks', creditHours: 3, currentGrade: 'D+', currentPoints: 2.0, isAtRisk: true },
  { code: 'MATH201', nameAr: 'الرياضيات المتقطعة', nameEn: 'Discrete Mathematics', creditHours: 3, currentGrade: 'C+', currentPoints: 3.0, isAtRisk: false },
  { code: 'ENGL102', nameAr: 'اللغة الإنجليزية ٢', nameEn: 'English II', creditHours: 3, currentGrade: 'B', currentPoints: 4.0, isAtRisk: false },
];

export const recoveryMilestones: RecoveryMilestone[] = [
  { id: 'm1', titleAr: 'اجتماع المرشد الأكاديمي', titleEn: 'Initial Advisor Meeting', descriptionAr: 'اجتماع أولي مع المرشد لوضع خطة التعافي', descriptionEn: 'Meet with academic advisor to establish recovery plan', status: 'completed', dateAr: '١٤٤٧/٧/١', dateEn: 'Jan 1, 2026', week: 1 },
  { id: 'm2', titleAr: 'اعتماد خطة الدراسة', titleEn: 'Study Plan Approved', descriptionAr: 'اعتماد خطة الدراسة المكثفة من المرشد', descriptionEn: 'Intensive study plan approved by advisor', status: 'completed', dateAr: '١٤٤٧/٧/٥', dateEn: 'Jan 5, 2026', week: 1 },
  { id: 'm3', titleAr: 'بدء الدروس الخصوصية', titleEn: 'Tutoring Started', descriptionAr: 'بدء جلسات الدروس الخصوصية في المواد الضعيفة', descriptionEn: 'Begin tutoring sessions for at-risk courses', status: 'completed', dateAr: '١٤٤٧/٧/١٢', dateEn: 'Jan 12, 2026', week: 2 },
  { id: 'm4', titleAr: 'فحص منتصف الفصل', titleEn: 'Mid-term Check', descriptionAr: 'مراجعة الأداء بعد اختبارات منتصف الفصل', descriptionEn: 'Performance review after midterm exams', status: 'completed', dateAr: '١٤٤٧/٨/١٥', dateEn: 'Feb 15, 2026', week: 6 },
  { id: 'm5', titleAr: 'تقييم التقدم', titleEn: 'Progress Evaluation', descriptionAr: 'تقييم شامل للتقدم مع المرشد', descriptionEn: 'Comprehensive progress evaluation with advisor', status: 'in-progress', dateAr: '١٤٤٧/٩/١', dateEn: 'Mar 1, 2026', week: 8 },
  { id: 'm6', titleAr: 'اختبار تحسين الأداء', titleEn: 'Performance Improvement Test', descriptionAr: 'اختبار قصير لقياس التحسن في المواد الضعيفة', descriptionEn: 'Short assessment to measure improvement in weak subjects', status: 'upcoming', dateAr: '١٤٤٧/٩/١٥', dateEn: 'Mar 15, 2026', week: 10 },
  { id: 'm7', titleAr: 'مراجعة ما قبل النهائي', titleEn: 'Pre-Final Review', descriptionAr: 'جلسة مراجعة شاملة قبل الاختبارات النهائية', descriptionEn: 'Comprehensive review session before final exams', status: 'upcoming', dateAr: '١٤٤٧/١٠/١', dateEn: 'Apr 1, 2026', week: 12 },
  { id: 'm8', titleAr: 'التقييم النهائي', titleEn: 'Final Evaluation', descriptionAr: 'تقييم نهائي وتحديد ما إذا تم رفع الإنذار', descriptionEn: 'Final evaluation to determine probation status', status: 'upcoming', dateAr: '١٤٤٧/١٠/١٥', dateEn: 'Apr 15, 2026', week: 14 },
];

export const actionItems: ActionItem[] = [
  { id: 'a1', titleAr: 'حضور جلسة الإرشاد', titleEn: 'Attend Counseling Session', descriptionAr: 'جلسة إرشادية مع المرشد النفسي', descriptionEn: 'Counseling session with psychological advisor', priority: 'high', status: 'completed', dueDateAr: '١٤٤٧/٧/٣', dueDateEn: 'Jan 3, 2026', assignedByAr: 'د. محمد عتيب', assignedByEn: 'Dr. Mohammed Otaib', categoryAr: 'إرشاد', categoryEn: 'Counseling' },
  { id: 'a2', titleAr: 'تسليم الواجب التعويضي - هياكل بيانات', titleEn: 'Submit Make-up Assignment - Data Structures', descriptionAr: 'إكمال وتسليم الواجب التعويضي', descriptionEn: 'Complete and submit make-up assignment', priority: 'high', status: 'completed', dueDateAr: '١٤٤٧/٧/١٠', dueDateEn: 'Jan 10, 2026', assignedByAr: 'د. خالد السعيد', assignedByEn: 'Dr. Khalid Al-Saeed', categoryAr: 'أكاديمي', categoryEn: 'Academic' },
  { id: 'a3', titleAr: 'حضور دروس خصوصية - شبكات', titleEn: 'Attend Tutoring - Networks', descriptionAr: 'حضور جلستين أسبوعياً مع المعيد', descriptionEn: 'Attend 2 weekly sessions with teaching assistant', priority: 'high', status: 'in-progress', dueDateAr: '١٤٤٧/٩/٣٠', dueDateEn: 'Mar 30, 2026', assignedByAr: 'د. محمد عتيب', assignedByEn: 'Dr. Mohammed Otaib', categoryAr: 'دروس خصوصية', categoryEn: 'Tutoring' },
  { id: 'a4', titleAr: 'مراجعة مركز الكتابة', titleEn: 'Visit Writing Center', descriptionAr: 'مراجعة التقارير مع مركز الكتابة', descriptionEn: 'Review reports with writing center', priority: 'medium', status: 'in-progress', dueDateAr: '١٤٤٧/٩/١٥', dueDateEn: 'Mar 15, 2026', assignedByAr: 'د. محمد عتيب', assignedByEn: 'Dr. Mohammed Otaib', categoryAr: 'أكاديمي', categoryEn: 'Academic' },
  { id: 'a5', titleAr: 'مقابلة المرشد الأكاديمي', titleEn: 'Meet Academic Advisor', descriptionAr: 'مراجعة الأداء الأسبوعي مع المرشد', descriptionEn: 'Weekly performance review with advisor', priority: 'high', status: 'in-progress', dueDateAr: 'أسبوعياً', dueDateEn: 'Weekly', assignedByAr: 'د. محمد عتيب', assignedByEn: 'Dr. Mohammed Otaib', categoryAr: 'إرشاد', categoryEn: 'Counseling' },
  { id: 'a6', titleAr: 'حل تمارين إضافية - رياضيات', titleEn: 'Extra Math Exercises', descriptionAr: 'حل ١٠ تمارين إضافية أسبوعياً', descriptionEn: 'Solve 10 extra exercises weekly', priority: 'medium', status: 'pending', dueDateAr: '١٤٤٧/٩/٣٠', dueDateEn: 'Mar 30, 2026', assignedByAr: 'د. فهد منصور', assignedByEn: 'Dr. Fahad Al-Mansour', categoryAr: 'أكاديمي', categoryEn: 'Academic' },
  { id: 'a7', titleAr: 'مراجعة المساعدات المالية', titleEn: 'Review Financial Aid', descriptionAr: 'التواصل مع مكتب المساعدات المالية', descriptionEn: 'Contact financial aid office', priority: 'low', status: 'pending', dueDateAr: '١٤٤٧/٨/٣٠', dueDateEn: 'Feb 28, 2026', assignedByAr: 'د. محمد عتيب', assignedByEn: 'Dr. Mohammed Otaib', categoryAr: 'مالي', categoryEn: 'Financial' },
  { id: 'a8', titleAr: 'تسليم مشروع قواعد البيانات', titleEn: 'Submit Database Project', descriptionAr: 'تسليم المشروع النهائي لمقرر قواعد البيانات', descriptionEn: 'Submit final project for database course', priority: 'high', status: 'pending', dueDateAr: '١٤٤٧/١٠/٥', dueDateEn: 'Apr 5, 2026', assignedByAr: 'د. خالد السعيد', assignedByEn: 'Dr. Khalid Al-Saeed', categoryAr: 'أكاديمي', categoryEn: 'Academic' },
  { id: 'a9', titleAr: 'حضور ورشة إدارة الوقت', titleEn: 'Attend Time Management Workshop', descriptionAr: 'ورشة عمل لتحسين مهارات إدارة الوقت', descriptionEn: 'Workshop to improve time management skills', priority: 'medium', status: 'overdue', dueDateAr: '١٤٤٧/٨/١٥', dueDateEn: 'Feb 15, 2026', assignedByAr: 'د. محمد عتيب', assignedByEn: 'Dr. Mohammed Otaib', categoryAr: 'تطوير ذاتي', categoryEn: 'Self-Development' },
  { id: 'a10', titleAr: 'تقديم تقرير التقدم شاهر', titleEn: 'Submit Monthly Progress Report', descriptionAr: 'تقرير شامل عن التقدم الأكاديمي شاهر', descriptionEn: 'Comprehensive monthly academic progress report', priority: 'medium', status: 'pending', dueDateAr: '١٤٤٧/٩/١', dueDateEn: 'Mar 1, 2026', assignedByAr: 'د. محمد عتيب', assignedByEn: 'Dr. Mohammed Otaib', categoryAr: 'تقارير', categoryEn: 'Reports' },
];

export const weeklyProgress: WeeklyProgress[] = [
  { week: 1, labelAr: 'الأسبوع ١', labelEn: 'Week 1', gpa: 1.85, attendance: 60, assignmentsCompleted: 2, assignmentsTotal: 5 },
  { week: 2, labelAr: 'الأسبوع ٢', labelEn: 'Week 2', gpa: 1.90, attendance: 75, assignmentsCompleted: 4, assignmentsTotal: 5 },
  { week: 3, labelAr: 'الأسبوع ٣', labelEn: 'Week 3', gpa: 1.95, attendance: 85, assignmentsCompleted: 4, assignmentsTotal: 5 },
  { week: 4, labelAr: 'الأسبوع ٤', labelEn: 'Week 4', gpa: 2.05, attendance: 90, assignmentsCompleted: 5, assignmentsTotal: 5 },
];

export const supportResources: SupportResource[] = [
  { id: 'r1', titleAr: 'مركز الإرشاد النفسي', titleEn: 'Counseling Center', descriptionAr: 'دعم نفسي واجتماعي للطلاب', descriptionEn: 'Psychological and social support for students', contactAr: '٠١٦٣٨٠١٢٣٤', contactEn: '016-380-1234', hoursAr: 'أحد - خميس: ٨ ص - ٤ م', hoursEn: 'Sun - Thu: 8 AM - 4 PM', locationAr: 'مبنى ١٦ - الطابق الثاني', locationEn: 'Building 16 - 2nd Floor', iconType: 'counseling' },
  { id: 'r2', titleAr: 'مركز الكتابة الأكاديمية', titleEn: 'Academic Writing Center', descriptionAr: 'مساعدة في كتابة التقارير والأبحاث', descriptionEn: 'Help with writing reports and research papers', contactAr: '٠١٦٣٨٠٥٦٧٨', contactEn: '016-380-5678', hoursAr: 'أحد - أربعاء: ٩ ص - ٣ م', hoursEn: 'Sun - Wed: 9 AM - 3 PM', locationAr: 'المكتبة المركزية - الطابق الأول', locationEn: 'Central Library - 1st Floor', iconType: 'writing' },
  { id: 'r3', titleAr: 'مركز الدروس الخصوصية', titleEn: 'Tutoring Center', descriptionAr: 'جلسات فردية وجماعية في المواد الصعبة', descriptionEn: 'Individual and group sessions for difficult subjects', contactAr: '٠١٦٣٨٠٩٠١٢', contactEn: '016-380-9012', hoursAr: 'أحد - خميس: ١٠ ص - ٦ م', hoursEn: 'Sun - Thu: 10 AM - 6 PM', locationAr: 'مبنى ٤٤ - الطابق الأرضي', locationEn: 'Building 44 - Ground Floor', iconType: 'tutoring' },
  { id: 'r4', titleAr: 'مكتب المساعدات المالية', titleEn: 'Financial Aid Office', descriptionAr: 'منح ومساعدات مالية للطلاب المحتاجين', descriptionEn: 'Scholarships and financial aid for students in need', contactAr: '٠١٦٣٨٠٣٤٥٦', contactEn: '016-380-3456', hoursAr: 'أحد - خميس: ٨ ص - ٢ م', hoursEn: 'Sun - Thu: 8 AM - 2 PM', locationAr: 'عمادة شؤون الطلاب - مبنى ١', locationEn: 'Deanship of Student Affairs - Building 1', iconType: 'financial' },
  { id: 'r5', titleAr: 'مركز الإرشاد المهني', titleEn: 'Career Services', descriptionAr: 'استشارات مهنية وتخطيط المسار الوظيفي', descriptionEn: 'Career counseling and career path planning', contactAr: '٠١٦٣٨٠٧٨٩٠', contactEn: '016-380-7890', hoursAr: 'أحد - أربعاء: ٩ ص - ٤ م', hoursEn: 'Sun - Wed: 9 AM - 4 PM', locationAr: 'مبنى ١ - الطابق الثالث', locationEn: 'Building 1 - 3rd Floor', iconType: 'career' },
  { id: 'r6', titleAr: 'المركز الصحي', titleEn: 'Health Center', descriptionAr: 'خدمات صحية وعيادات نفسية', descriptionEn: 'Health services and mental health clinics', contactAr: '٠١٦٣٨٠٢٣٤٥', contactEn: '016-380-2345', hoursAr: 'أحد - خميس: ٧:٣٠ ص - ٤ م', hoursEn: 'Sun - Thu: 7:30 AM - 4 PM', locationAr: 'المركز الصحي الجامعي', locationEn: 'University Health Center', iconType: 'health' },
];
