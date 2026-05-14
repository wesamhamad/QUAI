import type { Student, Intervention, Appointment, CaseloadEntry } from '../types';

export const mockStudents: Student[] = [
  { id: '441001234', name: 'أحمد محمد عتيب', nameEn: 'Ahmed Mohammed Otaib', department: 'علوم الحاسب', departmentEn: 'Computer Science', gpa: 1.8, riskLevel: 'critical', lastContact: '2026-04-10', status: 'probation', statusAr: 'إنذار أكاديمي', email: 'ahmed@qu.edu.sa' },
  { id: '441002345', name: 'فهد عبدالله قحطان', nameEn: 'Fahd Mohammed Qahtan', department: 'هندسة كهربائية', departmentEn: 'Electrical Engineering', gpa: 1.5, riskLevel: 'critical', lastContact: '2026-04-08', status: 'probation', statusAr: 'إنذار أكاديمي', email: 'fahd@qu.edu.sa' },
  { id: '441003456', name: 'نورة سعد شمر', nameEn: 'Noura Mohammed Shammar', department: 'إدارة أعمال', departmentEn: 'Business Administration', gpa: 2.1, riskLevel: 'high', lastContact: '2026-04-11', status: 'active', statusAr: 'نشط', email: 'noura@qu.edu.sa' },
  { id: '441004567', name: 'خالد إبراهيم دوسر', nameEn: 'Khalid Mohammed Dosar', department: 'علوم الحاسب', departmentEn: 'Computer Science', gpa: 2.3, riskLevel: 'high', lastContact: '2026-04-07', status: 'active', statusAr: 'نشط', email: 'khalid@qu.edu.sa' },
  { id: '441005678', name: 'سارة فهد سعد', nameEn: 'Sarah Mohammed Saad', department: 'رياضيات', departmentEn: 'Mathematics', gpa: 2.0, riskLevel: 'high', lastContact: '2026-04-09', status: 'probation', statusAr: 'إنذار أكاديمي', email: 'sarah@qu.edu.sa' },
  { id: '441006789', name: 'عبدالرحمن سليمان ناصر', nameEn: 'Abdulrahman Mohammed Nasser', department: 'هندسة مدنية', departmentEn: 'Civil Engineering', gpa: 2.5, riskLevel: 'medium', lastContact: '2026-04-06', status: 'active', statusAr: 'نشط', email: 'abdulrahman@qu.edu.sa' },
  { id: '441007890', name: 'ريم عبدالعزيز محمد', nameEn: 'Reem Mohammed Mohammed', department: 'علوم الحاسب', departmentEn: 'Computer Science', gpa: 2.7, riskLevel: 'medium', lastContact: '2026-04-05', status: 'active', statusAr: 'نشط', email: 'reem@qu.edu.sa' },
  { id: '441008901', name: 'محمد خالد زاهر', nameEn: 'Mohammed Mohammed Zaher', department: 'فيزياء', departmentEn: 'Physics', gpa: 2.4, riskLevel: 'medium', lastContact: '2026-04-04', status: 'active', statusAr: 'نشط', email: 'mohammed@qu.edu.sa' },
  { id: '441009012', name: 'هيفاء ناصر عنز', nameEn: 'Haifa Mohammed Anaz', department: 'إدارة أعمال', departmentEn: 'Business Administration', gpa: 2.6, riskLevel: 'medium', lastContact: '2026-04-03', status: 'active', statusAr: 'نشط', email: 'haifa@qu.edu.sa' },
  { id: '441010123', name: 'تركي فيصل عبدالله', nameEn: 'Turki Mohammed Abdullah', department: 'هندسة كهربائية', departmentEn: 'Electrical Engineering', gpa: 2.8, riskLevel: 'medium', lastContact: '2026-04-02', status: 'active', statusAr: 'نشط', email: 'turki@qu.edu.sa' },
  { id: '441011234', name: 'لمى أحمد راشد', nameEn: 'Lama Mohammed Rashed', department: 'رياضيات', departmentEn: 'Mathematics', gpa: 3.2, riskLevel: 'low', lastContact: '2026-04-01', status: 'active', statusAr: 'نشط', email: 'lama@qu.edu.sa' },
  { id: '441012345', name: 'عمر محمد السعيد', nameEn: 'Omar Al-Saeed', department: 'علوم الحاسب', departmentEn: 'Computer Science', gpa: 3.5, riskLevel: 'low', lastContact: '2026-03-30', status: 'active', statusAr: 'نشط', email: 'omar@qu.edu.sa' },
  { id: '441013456', name: 'دانة عبدالله فهد', nameEn: 'Dana Mohammed Fahd', department: 'هندسة مدنية', departmentEn: 'Civil Engineering', gpa: 3.8, riskLevel: 'low', lastContact: '2026-03-28', status: 'active', statusAr: 'نشط', email: 'dana@qu.edu.sa' },
  { id: '441014567', name: 'سلطان سعود مالك', nameEn: 'Sultan Mohammed Malek', department: 'فيزياء', departmentEn: 'Physics', gpa: 3.3, riskLevel: 'low', lastContact: '2026-03-25', status: 'active', statusAr: 'نشط', email: 'sultan@qu.edu.sa' },
  { id: '441015678', name: 'مشاعل تركي فهد', nameEn: 'Mashael Mohammed Fahd', department: 'إدارة أعمال', departmentEn: 'Business Administration', gpa: 3.1, riskLevel: 'low', lastContact: '2026-03-20', status: 'active', statusAr: 'نشط', email: 'mashael@qu.edu.sa' },
  { id: '441016789', name: 'يزيد عادل شاهر', nameEn: 'Yazeed Mohammed Shaher', department: 'هندسة كهربائية', departmentEn: 'Electrical Engineering', gpa: 1.9, riskLevel: 'critical', lastContact: '2026-04-11', status: 'suspended', statusAr: 'موقوف', email: 'yazeed@qu.edu.sa' },
  { id: '441017890', name: 'غادة صالح عمر', nameEn: 'Ghada Mohammed Omar', department: 'علوم الحاسب', departmentEn: 'Computer Science', gpa: 2.2, riskLevel: 'high', lastContact: '2026-04-10', status: 'active', statusAr: 'نشط', email: 'ghada@qu.edu.sa' },
  { id: '441018901', name: 'بندر نايف رشيد', nameEn: 'Bandar Mohammed Rasheed', department: 'رياضيات', departmentEn: 'Mathematics', gpa: 3.6, riskLevel: 'low', lastContact: '2026-03-18', status: 'active', statusAr: 'نشط', email: 'bandar@qu.edu.sa' },
  { id: '441019012', name: 'وجدان ماجد قرن', nameEn: 'Wijdan Mohammed Qarn', department: 'هندسة مدنية', departmentEn: 'Civil Engineering', gpa: 2.9, riskLevel: 'medium', lastContact: '2026-04-01', status: 'active', statusAr: 'نشط', email: 'wijdan@qu.edu.sa' },
  { id: '441020123', name: 'فيصل حمد السويلم', nameEn: 'Faisal Al-Suwailem', department: 'فيزياء', departmentEn: 'Physics', gpa: 2.1, riskLevel: 'high', lastContact: '2026-04-09', status: 'active', statusAr: 'نشط', email: 'faisal@qu.edu.sa' },
  { id: '441021234', name: 'العنود خالد منصور', nameEn: 'Al-Anoud Al-Mansour', department: 'إدارة أعمال', departmentEn: 'Business Administration', gpa: 3.4, riskLevel: 'low', lastContact: '2026-03-22', status: 'active', statusAr: 'نشط', email: 'alanoud@qu.edu.sa' },
  { id: '441022345', name: 'ماجد عبدالمحسن الخليفة', nameEn: 'Majed Al-Khalifa', department: 'علوم الحاسب', departmentEn: 'Computer Science', gpa: 1.7, riskLevel: 'critical', lastContact: '2026-04-12', status: 'probation', statusAr: 'إنذار أكاديمي', email: 'majed@qu.edu.sa' },
  { id: '441023456', name: 'أريج محمد النفيسة', nameEn: 'Areej Al-Nafisa', department: 'هندسة كهربائية', departmentEn: 'Electrical Engineering', gpa: 2.8, riskLevel: 'medium', lastContact: '2026-04-03', status: 'active', statusAr: 'نشط', email: 'areej@qu.edu.sa' },
  { id: '441024567', name: 'ثامر سعد عسير', nameEn: 'Thamer Mohammed Aseer', department: 'رياضيات', departmentEn: 'Mathematics', gpa: 3.0, riskLevel: 'low', lastContact: '2026-03-15', status: 'active', statusAr: 'نشط', email: 'thamer@qu.edu.sa' },
  { id: '441025678', name: 'منيرة عبدالرحمن بقمي', nameEn: 'Munira Mohammed Bugmi', department: 'هندسة مدنية', departmentEn: 'Civil Engineering', gpa: 2.3, riskLevel: 'high', lastContact: '2026-04-08', status: 'active', statusAr: 'نشط', email: 'munira@qu.edu.sa' },
  { id: '441026789', name: 'نواف طلال جهاد', nameEn: 'Nawaf Mohammed Jihad', department: 'فيزياء', departmentEn: 'Physics', gpa: 3.7, riskLevel: 'low', lastContact: '2026-03-10', status: 'active', statusAr: 'نشط', email: 'nawaf@qu.edu.sa' },
  { id: '441027890', name: 'حصة فهد دخيل', nameEn: 'Hessa Mohammed Dakheel', department: 'إدارة أعمال', departmentEn: 'Business Administration', gpa: 2.5, riskLevel: 'medium', lastContact: '2026-04-05', status: 'active', statusAr: 'نشط', email: 'hessa@qu.edu.sa' },
  { id: '441028901', name: 'عادل ناصر ثقيف', nameEn: 'Adel Mohammed Thaqif', department: 'علوم الحاسب', departmentEn: 'Computer Science', gpa: 2.0, riskLevel: 'high', lastContact: '2026-04-11', status: 'probation', statusAr: 'إنذار أكاديمي', email: 'adel@qu.edu.sa' },
];

export const mockInterventions: Intervention[] = [
  { id: 'int-1', studentId: '441001234', studentName: 'أحمد محمد عتيب', studentNameEn: 'Ahmed Mohammed Otaib', date: '2026-04-10', type: 'meeting', typeAr: 'اجتماع', severity: 'urgent', summary: 'مناقشة خطة التحسين الأكاديمي وتحديد الأهداف', summaryEn: 'Discussed academic improvement plan and set goals', followUpDate: '2026-04-17' },
  { id: 'int-2', studentId: '441002345', studentName: 'فهد عبدالله قحطان', studentNameEn: 'Fahd Mohammed Qahtan', date: '2026-04-08', type: 'email', typeAr: 'بريد إلكتروني', severity: 'high', summary: 'إرسال تنبيه بخصوص الغياب المتكرر', summaryEn: 'Sent alert regarding frequent absences', followUpDate: '2026-04-15' },
  { id: 'int-3', studentId: '441003456', studentName: 'نورة سعد شمر', studentNameEn: 'Noura Mohammed Shammar', date: '2026-04-11', type: 'referral', typeAr: 'تحويل', severity: 'high', summary: 'تحويل إلى مركز الإرشاد النفسي', summaryEn: 'Referred to counseling center', followUpDate: '2026-04-18' },
  { id: 'int-4', studentId: '441016789', studentName: 'يزيد عادل شاهر', studentNameEn: 'Yazeed Mohammed Shaher', date: '2026-04-11', type: 'meeting', typeAr: 'اجتماع', severity: 'urgent', summary: 'جلسة إرشادية لمراجعة الوضع الأكاديمي', summaryEn: 'Advisory session to review academic status', followUpDate: '2026-04-14' },
  { id: 'int-5', studentId: '441005678', studentName: 'سارة فهد سعد', studentNameEn: 'Sarah Mohammed Saad', date: '2026-04-09', type: 'note', typeAr: 'ملاحظة', severity: 'normal', summary: 'الطالبة تحتاج دعم إضافي في مادة التحليل', summaryEn: 'Student needs additional support in Analysis course' },
  { id: 'int-6', studentId: '441022345', studentName: 'ماجد عبدالمحسن الخليفة', studentNameEn: 'Majed Al-Khalifa', date: '2026-04-12', type: 'meeting', typeAr: 'اجتماع', severity: 'urgent', summary: 'اجتماع طارئ لمناقشة احتمالية الفصل الأكاديمي', summaryEn: 'Emergency meeting regarding potential academic dismissal', followUpDate: '2026-04-14' },
  { id: 'int-7', studentId: '441004567', studentName: 'خالد إبراهيم دوسر', studentNameEn: 'Khalid Mohammed Dosar', date: '2026-04-07', type: 'email', typeAr: 'بريد إلكتروني', severity: 'normal', summary: 'إرسال جدول الدروس الإضافية', summaryEn: 'Sent supplementary tutoring schedule' },
  { id: 'int-8', studentId: '441028901', studentName: 'عادل ناصر ثقيف', studentNameEn: 'Adel Mohammed Thaqif', date: '2026-04-11', type: 'referral', typeAr: 'تحويل', severity: 'high', summary: 'تحويل لبرنامج التعلم التكيفي', summaryEn: 'Referred to adaptive learning program', followUpDate: '2026-04-20' },
];

export const mockAppointments: Appointment[] = [
  { id: 'apt-1', studentName: 'ماجد عبدالمحسن الخليفة', studentNameEn: 'Majed Al-Khalifa', date: '2026-04-13', time: '10:00', type: 'Follow-up', typeAr: 'متابعة', isToday: true, notes: 'Review improvement plan progress', notesAr: 'مراجعة تقدم خطة التحسين' },
  { id: 'apt-2', studentName: 'أحمد محمد عتيب', studentNameEn: 'Ahmed Mohammed Otaib', date: '2026-04-13', time: '11:30', type: 'Academic Review', typeAr: 'مراجعة أكاديمية', isToday: true, notes: 'Midterm grade review', notesAr: 'مراجعة درجات منتصف الفصل' },
  { id: 'apt-3', studentName: 'يزيد عادل شاهر', studentNameEn: 'Yazeed Mohammed Shaher', date: '2026-04-13', time: '14:00', type: 'Counseling', typeAr: 'إرشاد', isToday: true },
  { id: 'apt-4', studentName: 'نورة سعد شمر', studentNameEn: 'Noura Mohammed Shammar', date: '2026-04-14', time: '09:00', type: 'Check-in', typeAr: 'متابعة دورية', isToday: false },
  { id: 'apt-5', studentName: 'فهد عبدالله قحطان', studentNameEn: 'Fahd Mohammed Qahtan', date: '2026-04-14', time: '13:00', type: 'Academic Review', typeAr: 'مراجعة أكاديمية', isToday: false },
  { id: 'apt-6', studentName: 'سارة فهد سعد', studentNameEn: 'Sarah Mohammed Saad', date: '2026-04-15', time: '10:30', type: 'Follow-up', typeAr: 'متابعة', isToday: false },
  { id: 'apt-7', studentName: 'عادل ناصر ثقيف', studentNameEn: 'Adel Mohammed Thaqif', date: '2026-04-16', time: '11:00', type: 'Academic Review', typeAr: 'مراجعة أكاديمية', isToday: false },
  { id: 'apt-8', studentName: 'خالد إبراهيم دوسر', studentNameEn: 'Khalid Mohammed Dosar', date: '2026-04-17', time: '09:30', type: 'Counseling', typeAr: 'إرشاد', isToday: false },
];

export const mockCaseload: CaseloadEntry[] = [
  { advisorName: 'د. عبدالله المحمد', advisorNameEn: 'Dr. Abdullah Al-Mohammed', totalStudents: 28, critical: 5, high: 6, medium: 7, low: 10 },
  { advisorName: 'د. فاطمة راشد', advisorNameEn: 'Dr. Fatimah Rashed', totalStudents: 32, critical: 3, high: 8, medium: 10, low: 11 },
  { advisorName: 'د. سعد خالد', advisorNameEn: 'Dr. Saad Khaled', totalStudents: 25, critical: 2, high: 5, medium: 8, low: 10 },
  { advisorName: 'د. منى شمر', advisorNameEn: 'Dr. Muna Shammar', totalStudents: 30, critical: 4, high: 7, medium: 9, low: 10 },
  { advisorName: 'د. خالد عتيب', advisorNameEn: 'Dr. Khalid Otaib', totalStudents: 22, critical: 1, high: 4, medium: 7, low: 10 },
];

/* Agent actions taken on advisor's students */
export interface AgentAction {
  id: string;
  timestamp: string;
  studentName: string;
  studentNameEn: string;
  studentId: string;
  actionAr: string;
  actionEn: string;
  typeIcon: 'alert' | 'meeting' | 'email' | 'analysis' | 'referral';
  status: 'completed' | 'pending_approval' | 'scheduled';
}

export const mockAgentActions: AgentAction[] = [
  { id: 'aa-1', timestamp: '2026-04-13T09:15:00', studentName: 'ليان', studentNameEn: 'Layan', studentId: '441099001', actionAr: 'تم تحليل التوأم الرقمي — انخفاض الحضور بنسبة 18% خلال أسبوعين', actionEn: 'Digital Twin analyzed — attendance dropped 18% over 2 weeks', typeIcon: 'analysis', status: 'completed' },
  { id: 'aa-2', timestamp: '2026-04-13T09:20:00', studentName: 'ليان', studentNameEn: 'Layan', studentId: '441099001', actionAr: 'تم جدولة اجتماع Teams مع المرشد — الأحد 10:00 ص', actionEn: 'Scheduled Teams meeting with advisor — Sunday 10:00 AM', typeIcon: 'meeting', status: 'scheduled' },
  { id: 'aa-3', timestamp: '2026-04-13T08:45:00', studentName: 'أحمد محمد عتيب', studentNameEn: 'Ahmed Mohammed Otaib', studentId: '441001234', actionAr: 'إرسال تنبيه تلقائي — المعدل أقل من 2.0 للفصل الثاني', actionEn: 'Auto-sent alert — GPA below 2.0 for second semester', typeIcon: 'alert', status: 'completed' },
  { id: 'aa-4', timestamp: '2026-04-13T08:30:00', studentName: 'ليان', studentNameEn: 'Layan', studentId: '441099001', actionAr: 'إرسال بريد إلكتروني للطالبة — دعوة لجلسة إرشادية', actionEn: 'Emailed student — invitation for advisory session', typeIcon: 'email', status: 'completed' },
  { id: 'aa-5', timestamp: '2026-04-12T16:00:00', studentName: 'فهد عبدالله قحطان', studentNameEn: 'Fahd Mohammed Qahtan', studentId: '441002345', actionAr: 'تحويل تلقائي لبرنامج التعافي — غياب متكرر', actionEn: 'Auto-referred to Recovery Program — frequent absences', typeIcon: 'referral', status: 'pending_approval' },
  { id: 'aa-6', timestamp: '2026-04-12T14:30:00', studentName: 'ليان', studentNameEn: 'Layan', studentId: '441099001', actionAr: 'تم إنشاء ملف التوأم الرقمي وإرساله للمرشد', actionEn: 'Created Digital Twin profile and sent to advisor', typeIcon: 'analysis', status: 'completed' },
  { id: 'aa-7', timestamp: '2026-04-12T11:00:00', studentName: 'ماجد عبدالمحسن الخليفة', studentNameEn: 'Majed Al-Khalifa', studentId: '441022345', actionAr: 'جدولة اجتماع Teams طارئ — احتمالية فصل أكاديمي', actionEn: 'Scheduled emergency Teams meeting — potential dismissal', typeIcon: 'meeting', status: 'completed' },
];

/* Layan's Digital Twin snapshot sent by agent */
export const layanDigitalTwin = {
  name: 'ليان',
  nameEn: 'Layan',
  studentId: '441099001',
  department: 'علوم الحاسب',
  departmentEn: 'Computer Science',
  gpa: 2.35,
  riskLevel: 'medium' as const,
  attendanceRate: 72,
  earnedHours: 64,
  totalHours: 134,
  currentCourses: 5,
  missedAssignments: 3,
  lastLogin: '2026-04-12',
  trend: 'declining' as const,
  topConcerns: [
    { ar: 'انخفاض الحضور 18% في أسبوعين', en: 'Attendance dropped 18% in 2 weeks' },
    { ar: 'لم تسلّم 3 واجبات في CS301', en: '3 missed assignments in CS301' },
    { ar: 'لم تدخل نظام التعلم منذ 5 أيام', en: 'No LMS login for 5 days' },
  ],
};

/* Teams scheduled meetings */
export interface TeamsMeeting {
  id: string;
  studentName: string;
  studentNameEn: string;
  date: string;
  time: string;
  durationMin: number;
  topicAr: string;
  topicEn: string;
  teamsLink: string;
  status: 'upcoming' | 'in_progress' | 'completed';
  scheduledBy: 'agent' | 'advisor';
}

export const mockTeamsMeetings: TeamsMeeting[] = [
  { id: 'tm-1', studentName: 'ليان', studentNameEn: 'Layan', date: '2026-04-14', time: '10:00', durationMin: 30, topicAr: 'مراجعة وضع الحضور والأداء الأكاديمي', topicEn: 'Review attendance and academic performance', teamsLink: 'https://teams.microsoft.com/l/meetup-join/meeting_1', status: 'upcoming', scheduledBy: 'agent' },
  { id: 'tm-2', studentName: 'ماجد عبدالمحسن الخليفة', studentNameEn: 'Majed Al-Khalifa', date: '2026-04-13', time: '14:00', durationMin: 45, topicAr: 'جلسة طارئة — مراجعة الوضع الأكاديمي', topicEn: 'Emergency session — academic status review', teamsLink: 'https://teams.microsoft.com/l/meetup-join/meeting_2', status: 'upcoming', scheduledBy: 'agent' },
  { id: 'tm-3', studentName: 'أحمد محمد عتيب', studentNameEn: 'Ahmed Mohammed Otaib', date: '2026-04-15', time: '11:00', durationMin: 30, topicAr: 'متابعة خطة التحسين', topicEn: 'Follow up on improvement plan', teamsLink: 'https://teams.microsoft.com/l/meetup-join/meeting_3', status: 'upcoming', scheduledBy: 'advisor' },
  { id: 'tm-4', studentName: 'نورة سعد شمر', studentNameEn: 'Noura Mohammed Shammar', date: '2026-04-16', time: '09:30', durationMin: 30, topicAr: 'متابعة التحويل لمركز الإرشاد', topicEn: 'Follow up on counseling referral', teamsLink: 'https://teams.microsoft.com/l/meetup-join/meeting_4', status: 'upcoming', scheduledBy: 'advisor' },
];

export const riskDistribution = {
  critical: mockStudents.filter(s => s.riskLevel === 'critical').length,
  high: mockStudents.filter(s => s.riskLevel === 'high').length,
  medium: mockStudents.filter(s => s.riskLevel === 'medium').length,
  low: mockStudents.filter(s => s.riskLevel === 'low').length,
};

export const averageGpa = +(mockStudents.reduce((sum, s) => sum + s.gpa, 0) / mockStudents.length).toFixed(2);
