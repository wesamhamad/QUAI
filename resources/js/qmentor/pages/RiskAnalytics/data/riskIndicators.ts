import {
  CalendarX2, BarChart3, ClipboardList, Monitor,
  GraduationCap, FileEdit, CalendarClock, Layers,
  Route,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { RiskIndicatorDef, RiskCategoryKey } from '../types';

// ── SRS Section 5.B — 66 indicators across 9 categories ──

export const riskIndicators: RiskIndicatorDef[] = [
  // ── A: Attendance (8 indicators) ──
  { id: 'A01', nameAr: 'نسبة الغياب الكلية', nameEn: 'Overall Absence Rate', category: 'A', descriptionAr: 'نسبة الغياب من إجمالي المحاضرات', descriptionEn: 'Absence percentage of total lectures', threshold: 25, currentValue: 12, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'A02', nameAr: 'الغياب المتتالي', nameEn: 'Consecutive Absences', category: 'A', descriptionAr: 'أطول سلسلة غياب متتالية', descriptionEn: 'Longest consecutive absence streak', threshold: 3, currentValue: 1.5, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'A03', nameAr: 'الغياب بدون عذر', nameEn: 'Unexcused Absences', category: 'A', descriptionAr: 'عدد مرات الغياب بدون عذر مقبول', descriptionEn: 'Absences without accepted excuse', threshold: 5, currentValue: 3.2, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'A04', nameAr: 'التأخر المتكرر', nameEn: 'Frequent Tardiness', category: 'A', descriptionAr: 'عدد مرات التأخر عن المحاضرات', descriptionEn: 'Number of late arrivals to lectures', threshold: 8, currentValue: 5, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'A05', nameAr: 'غياب الاختبارات', nameEn: 'Exam Absences', category: 'A', descriptionAr: 'عدد الاختبارات المتغيب عنها', descriptionEn: 'Number of missed exams', threshold: 1, currentValue: 0.3, status: 'low', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'A06', nameAr: 'أنماط الغياب', nameEn: 'Absence Patterns', category: 'A', descriptionAr: 'تكرار الغياب في أيام محددة', descriptionEn: 'Recurring absence on specific days', threshold: 3, currentValue: 2, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'A07', nameAr: 'الحرمان من المقرر', nameEn: 'Course Denial Risk', category: 'A', descriptionAr: 'مقررات قريبة من حد الحرمان (25%)', descriptionEn: 'Courses near denial threshold (25%)', threshold: 1, currentValue: 0.5, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'A08', nameAr: 'اتجاه الغياب', nameEn: 'Absence Trend', category: 'A', descriptionAr: 'اتجاه معدل الغياب خلال الأسابيع الأخيرة', descriptionEn: 'Absence rate trend over recent weeks', threshold: 50, currentValue: 42, status: 'high', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },

  // ── G: Grades (11 indicators) ──
  { id: 'G01', nameAr: 'المعدل التراكمي', nameEn: 'Cumulative GPA', category: 'G', descriptionAr: 'المعدل التراكمي الحالي', descriptionEn: 'Current cumulative GPA', threshold: 2.0, currentValue: 2.3, status: 'low', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'G02', nameAr: 'معدل الفصل', nameEn: 'Semester GPA', category: 'G', descriptionAr: 'معدل الفصل الحالي', descriptionEn: 'Current semester GPA', threshold: 2.0, currentValue: 2.1, status: 'low', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'G03', nameAr: 'انخفاض المعدل', nameEn: 'GPA Decline Rate', category: 'G', descriptionAr: 'معدل انخفاض المعدل التراكمي عبر الفصول', descriptionEn: 'Rate of GPA decline across semesters', threshold: 0.5, currentValue: 0.35, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'G04', nameAr: 'معدل الرسوب', nameEn: 'Failure Rate', category: 'G', descriptionAr: 'نسبة المقررات غير المجتازة', descriptionEn: 'Percentage of failed courses', threshold: 20, currentValue: 12, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'G05', nameAr: 'درجات الاختبارات النصفية', nameEn: 'Midterm Scores', category: 'G', descriptionAr: 'متوسط درجات الاختبارات النصفية', descriptionEn: 'Average midterm exam scores', threshold: 60, currentValue: 58, status: 'high', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'G06', nameAr: 'تباين الدرجات', nameEn: 'Grade Variance', category: 'G', descriptionAr: 'التباين في الدرجات بين المقررات', descriptionEn: 'Grade variance across courses', threshold: 25, currentValue: 18, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'G07', nameAr: 'المقررات المعادة', nameEn: 'Repeated Courses', category: 'G', descriptionAr: 'عدد المقررات المعادة', descriptionEn: 'Number of courses repeated', threshold: 3, currentValue: 1.8, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'G08', nameAr: 'أداء المختبرات', nameEn: 'Lab Performance', category: 'G', descriptionAr: 'الأداء في المقررات العملية', descriptionEn: 'Performance in lab/practical courses', threshold: 70, currentValue: 72, status: 'low', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'G09', nameAr: 'أداء المشاريع', nameEn: 'Project Performance', category: 'G', descriptionAr: 'متوسط درجات المشاريع والأبحاث', descriptionEn: 'Average project and research scores', threshold: 65, currentValue: 70, status: 'low', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'G10', nameAr: 'المقررات الحرجة', nameEn: 'Gateway Course Performance', category: 'G', descriptionAr: 'أداء في المقررات البوابية', descriptionEn: 'Performance in gateway/critical courses', threshold: 65, currentValue: 60, status: 'high', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'G11', nameAr: 'نسبة الإكمال', nameEn: 'Completion Ratio', category: 'G', descriptionAr: 'نسبة الساعات المكتسبة للمسجلة', descriptionEn: 'Ratio of earned to attempted credits', threshold: 75, currentValue: 82, status: 'low', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },

  // ── S: Assignments (6 indicators) ──
  { id: 'S01', nameAr: 'معدل تسليم الواجبات', nameEn: 'Assignment Submission Rate', category: 'S', descriptionAr: 'نسبة الواجبات المسلمة في الوقت', descriptionEn: 'On-time assignment submission rate', threshold: 80, currentValue: 65, status: 'high', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'S02', nameAr: 'الواجبات المتأخرة', nameEn: 'Late Submissions', category: 'S', descriptionAr: 'عدد الواجبات المسلمة بعد الموعد', descriptionEn: 'Assignments submitted after deadline', threshold: 3, currentValue: 2.5, status: 'high', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'S03', nameAr: 'الواجبات المفقودة', nameEn: 'Missing Assignments', category: 'S', descriptionAr: 'واجبات لم يتم تسليمها', descriptionEn: 'Assignments not submitted at all', threshold: 2, currentValue: 1.2, status: 'medium', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'S04', nameAr: 'جودة التسليمات', nameEn: 'Submission Quality', category: 'S', descriptionAr: 'متوسط درجات الواجبات المسلمة', descriptionEn: 'Average score of submitted assignments', threshold: 70, currentValue: 62, status: 'high', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'S05', nameAr: 'اتجاه التسليم', nameEn: 'Submission Trend', category: 'S', descriptionAr: 'اتجاه معدل التسليم في الأسابيع الأخيرة', descriptionEn: 'Submission rate trend over recent weeks', threshold: 70, currentValue: 55, status: 'high', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'S06', nameAr: 'المشاركة في المناقشات', nameEn: 'Discussion Participation', category: 'S', descriptionAr: 'المشاركة في منتديات النقاش', descriptionEn: 'Discussion forum participation rate', threshold: 60, currentValue: 45, status: 'high', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },

  // ── E: LMS Engagement (6 indicators) ──
  { id: 'E01', nameAr: 'تسجيل دخول LMS', nameEn: 'LMS Login Frequency', category: 'E', descriptionAr: 'عدد مرات الدخول الأسبوعية لنظام التعلم', descriptionEn: 'Weekly LMS login count', threshold: 5, currentValue: 3.2, status: 'medium', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'E02', nameAr: 'مشاهدة المحتوى', nameEn: 'Content Viewing', category: 'E', descriptionAr: 'نسبة المحتوى المشاهد من إجمالي المتاح', descriptionEn: 'Percentage of available content viewed', threshold: 70, currentValue: 55, status: 'high', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'E03', nameAr: 'ساعات النشاط', nameEn: 'LMS Time-on-Task', category: 'E', descriptionAr: 'ساعات النشاط الأسبوعية على النظام', descriptionEn: 'Weekly active hours on LMS', threshold: 10, currentValue: 6.5, status: 'medium', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'E04', nameAr: 'تفاعل المنتديات', nameEn: 'Forum Activity', category: 'E', descriptionAr: 'عدد المشاركات في منتديات المقررات', descriptionEn: 'Course forum post count', threshold: 3, currentValue: 1.5, status: 'medium', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'E05', nameAr: 'تنزيل المواد', nameEn: 'Material Downloads', category: 'E', descriptionAr: 'عدد المواد المحملة من النظام', descriptionEn: 'Number of materials downloaded from LMS', threshold: 80, currentValue: 52, status: 'medium', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'E06', nameAr: 'مشاهدة التسجيلات', nameEn: 'Recording Views', category: 'E', descriptionAr: 'مشاهدة تسجيلات المحاضرات', descriptionEn: 'Lecture recording view rate', threshold: 60, currentValue: 38, status: 'high', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },

  // ── AC: Academic Standing (7 indicators) ──
  { id: 'AC01', nameAr: 'الإنذارات الأكاديمية', nameEn: 'Academic Warnings', category: 'AC', descriptionAr: 'عدد الإنذارات الأكاديمية المتراكمة', descriptionEn: 'Cumulative academic warnings count', threshold: 2, currentValue: 1.5, status: 'high', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'AC02', nameAr: 'الحالة الأكاديمية', nameEn: 'Academic Status', category: 'AC', descriptionAr: 'الحالة الأكاديمية الحالية (عادي/إنذار/فصل)', descriptionEn: 'Current academic status (normal/warning/dismissed)', threshold: 1, currentValue: 0.8, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'AC03', nameAr: 'فصول التعثر', nameEn: 'Semesters on Probation', category: 'AC', descriptionAr: 'عدد الفصول في حالة إنذار أكاديمي', descriptionEn: 'Number of semesters on academic probation', threshold: 2, currentValue: 0.5, status: 'low', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'AC04', nameAr: 'تغيير التخصص', nameEn: 'Major Changes', category: 'AC', descriptionAr: 'عدد مرات تغيير التخصص', descriptionEn: 'Number of major changes', threshold: 2, currentValue: 0.8, status: 'low', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'AC05', nameAr: 'الانقطاع الأكاديمي', nameEn: 'Academic Interruptions', category: 'AC', descriptionAr: 'فصول التأجيل أو الانقطاع', descriptionEn: 'Deferral or interruption semesters', threshold: 2, currentValue: 0.3, status: 'low', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'AC06', nameAr: 'التحويل بين الكليات', nameEn: 'Transfer Requests', category: 'AC', descriptionAr: 'طلبات التحويل المقدمة', descriptionEn: 'Transfer request submissions', threshold: 2, currentValue: 0.5, status: 'low', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'AC07', nameAr: 'خطر الفصل', nameEn: 'Dismissal Risk', category: 'AC', descriptionAr: 'احتمالية الفصل الأكاديمي', descriptionEn: 'Academic dismissal probability', threshold: 30, currentValue: 18, status: 'medium', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },

  // ── R: Registration (6 indicators) ──
  { id: 'R01', nameAr: 'حمل المقررات', nameEn: 'Course Load', category: 'R', descriptionAr: 'عدد الساعات المسجلة مقارنة بالموصى به', descriptionEn: 'Registered credits vs recommended', threshold: 18, currentValue: 15, status: 'low', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'R02', nameAr: 'التسجيل المتأخر', nameEn: 'Late Registration', category: 'R', descriptionAr: 'التسجيل بعد الموعد الموصى به', descriptionEn: 'Registration after recommended deadline', threshold: 1, currentValue: 0.3, status: 'low', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'R03', nameAr: 'معدل الحذف', nameEn: 'Drop/Withdrawal Rate', category: 'R', descriptionAr: 'نسبة المقررات المحذوفة', descriptionEn: 'Course drop/withdrawal percentage', threshold: 15, currentValue: 8, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'R04', nameAr: 'المتطلبات المسبقة', nameEn: 'Prerequisite Gaps', category: 'R', descriptionAr: 'مقررات مسجلة بدون استيفاء المتطلبات', descriptionEn: 'Courses with unmet prerequisites', threshold: 2, currentValue: 0.5, status: 'low', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'R05', nameAr: 'تسلسل المقررات', nameEn: 'Course Sequence Alignment', category: 'R', descriptionAr: 'مدى الالتزام بالتسلسل الموصى به', descriptionEn: 'Alignment with recommended course sequence', threshold: 80, currentValue: 75, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'R06', nameAr: 'تعارض الجدول', nameEn: 'Schedule Conflicts', category: 'R', descriptionAr: 'تعارضات محتملة في الجدول الدراسي', descriptionEn: 'Potential scheduling conflicts', threshold: 1, currentValue: 0.2, status: 'low', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },

  // ── T: Schedule & Exams (5 indicators) ──
  { id: 'T01', nameAr: 'كثافة الاختبارات', nameEn: 'Exam Density', category: 'T', descriptionAr: 'عدد الاختبارات في أسبوع واحد', descriptionEn: 'Number of exams in a single week', threshold: 4, currentValue: 3, status: 'high', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'T02', nameAr: 'التحضير للاختبارات', nameEn: 'Exam Preparation', category: 'T', descriptionAr: 'وقت التحضير قبل الاختبارات', descriptionEn: 'Preparation time before exams', threshold: 70, currentValue: 50, status: 'high', dataSource: 'Blackboard LMS', dataSourceAr: 'بلاك بورد' },
  { id: 'T03', nameAr: 'فجوات الجدول', nameEn: 'Schedule Gaps', category: 'T', descriptionAr: 'فجوات طويلة بين المحاضرات', descriptionEn: 'Long gaps between lectures', threshold: 3, currentValue: 2, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'T04', nameAr: 'المحاضرات المبكرة', nameEn: 'Early Morning Classes', category: 'T', descriptionAr: 'عدد المحاضرات قبل 8 صباحًا', descriptionEn: 'Classes scheduled before 8 AM', threshold: 3, currentValue: 1.5, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'T05', nameAr: 'توازن الأيام', nameEn: 'Day Balance', category: 'T', descriptionAr: 'توزيع المحاضرات على أيام الأسبوع', descriptionEn: 'Lecture distribution across weekdays', threshold: 70, currentValue: 60, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },

  // ── C: Compound (12 indicators) ──
  { id: 'C01', nameAr: 'مؤشر المخاطر المركب', nameEn: 'Composite Risk Index', category: 'C', descriptionAr: 'مؤشر مركب من عدة فئات مخاطر', descriptionEn: 'Composite index from multiple risk categories', threshold: 50, currentValue: 35, status: 'medium', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
  { id: 'C02', nameAr: 'احتمال التسرب', nameEn: 'Dropout Probability', category: 'C', descriptionAr: 'احتمالية ترك الدراسة', descriptionEn: 'Probability of dropping out', threshold: 30, currentValue: 15, status: 'medium', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
  { id: 'C03', nameAr: 'مؤشر الأداء الشامل', nameEn: 'Holistic Performance Index', category: 'C', descriptionAr: 'مؤشر أداء شامل يجمع الأكاديمي والسلوكي', descriptionEn: 'Holistic index combining academic and behavioral', threshold: 60, currentValue: 55, status: 'high', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
  { id: 'C04', nameAr: 'مؤشر التفاعل المتقاطع', nameEn: 'Cross-Engagement Index', category: 'C', descriptionAr: 'تفاعل متعدد الأبعاد (حضور + LMS + واجبات)', descriptionEn: 'Multi-dimensional engagement (attendance + LMS + assignments)', threshold: 65, currentValue: 48, status: 'high', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
  { id: 'C05', nameAr: 'سرعة التدهور', nameEn: 'Decline Velocity', category: 'C', descriptionAr: 'سرعة تدهور الأداء الأكاديمي', descriptionEn: 'Speed of academic performance decline', threshold: 20, currentValue: 12, status: 'medium', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
  { id: 'C06', nameAr: 'استجابة التدخل', nameEn: 'Intervention Response', category: 'C', descriptionAr: 'مدى استجابة الطالب للتدخلات السابقة', descriptionEn: 'Student response to previous interventions', threshold: 60, currentValue: 50, status: 'high', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
  { id: 'C07', nameAr: 'الإرشاد الأكاديمي', nameEn: 'Advising Engagement', category: 'C', descriptionAr: 'مستوى التفاعل مع المرشد الأكاديمي', descriptionEn: 'Academic advising engagement level', threshold: 60, currentValue: 48, status: 'high', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
  { id: 'C08', nameAr: 'مقارنة الأقران', nameEn: 'Peer Comparison', category: 'C', descriptionAr: 'ترتيب الطالب بين أقرانه في نفس التخصص', descriptionEn: 'Student ranking among same-major peers', threshold: 50, currentValue: 38, status: 'high', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
  { id: 'C09', nameAr: 'مؤشر الاستقرار', nameEn: 'Stability Index', category: 'C', descriptionAr: 'استقرار الأداء الأكاديمي عبر الفصول', descriptionEn: 'Academic performance stability across semesters', threshold: 70, currentValue: 58, status: 'high', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
  { id: 'C10', nameAr: 'التوقع التنبؤي', nameEn: 'Predictive Forecast', category: 'C', descriptionAr: 'توقع الأداء للفصل القادم', descriptionEn: 'Next semester performance prediction', threshold: 60, currentValue: 52, status: 'high', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
  { id: 'C11', nameAr: 'عامل التحفيز', nameEn: 'Motivation Factor', category: 'C', descriptionAr: 'مؤشر تحفيز الطالب المقدر بالسلوك', descriptionEn: 'Behavioral-inferred motivation indicator', threshold: 65, currentValue: 50, status: 'high', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
  { id: 'C12', nameAr: 'الدعم الأسري', nameEn: 'Support Network', category: 'C', descriptionAr: 'مستوى الدعم الأسري والاجتماعي', descriptionEn: 'Family and social support network level', threshold: 60, currentValue: 55, status: 'medium', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },

  // ── P: Graduation Path (5 indicators) ──
  { id: 'P01', nameAr: 'التقدم نحو التخرج', nameEn: 'Graduation Progress', category: 'P', descriptionAr: 'نسبة إكمال متطلبات التخرج', descriptionEn: 'Graduation requirements completion rate', threshold: 100, currentValue: 65, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'P02', nameAr: 'الساعات المتبقية', nameEn: 'Remaining Credits', category: 'P', descriptionAr: 'الساعات المتبقية للتخرج', descriptionEn: 'Credits remaining to graduate', threshold: 40, currentValue: 28, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'P03', nameAr: 'الفصول المتوقعة', nameEn: 'Expected Semesters', category: 'P', descriptionAr: 'عدد الفصول المتوقعة للتخرج', descriptionEn: 'Expected semesters to graduation', threshold: 2, currentValue: 3, status: 'high', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
  { id: 'P04', nameAr: 'المقررات المتبقية الحرجة', nameEn: 'Critical Remaining Courses', category: 'P', descriptionAr: 'مقررات صعبة متبقية في الخطة', descriptionEn: 'Difficult courses remaining in plan', threshold: 3, currentValue: 2, status: 'medium', dataSource: 'Banner SIS', dataSourceAr: 'نظام بانر' },
  { id: 'P05', nameAr: 'معدل التخرج المتوقع', nameEn: 'Expected Graduation GPA', category: 'P', descriptionAr: 'المعدل المتوقع عند التخرج', descriptionEn: 'Projected GPA at graduation', threshold: 2.5, currentValue: 2.4, status: 'medium', dataSource: 'QMentor AI', dataSourceAr: 'كيو منتور' },
];

export const categoryMeta: Record<RiskCategoryKey, { nameAr: string; nameEn: string; code: string; icon: LucideIcon }> = {
  A:  { nameAr: 'الحضور والغياب', nameEn: 'Attendance', code: 'A', icon: CalendarX2 },
  G:  { nameAr: 'الدرجات', nameEn: 'Grades', code: 'G', icon: BarChart3 },
  S:  { nameAr: 'الواجبات', nameEn: 'Assignments', code: 'S', icon: ClipboardList },
  E:  { nameAr: 'التفاعل مع LMS', nameEn: 'LMS Engagement', code: 'E', icon: Monitor },
  AC: { nameAr: 'الوضع الأكاديمي', nameEn: 'Academic Standing', code: 'AC', icon: GraduationCap },
  R:  { nameAr: 'التسجيل', nameEn: 'Registration', code: 'R', icon: FileEdit },
  T:  { nameAr: 'الجدول والاختبارات', nameEn: 'Schedule & Exams', code: 'T', icon: CalendarClock },
  C:  { nameAr: 'المؤشرات المركبة', nameEn: 'Compound', code: 'C', icon: Layers },
  P:  { nameAr: 'مسار التخرج', nameEn: 'Graduation Path', code: 'P', icon: Route },
};
