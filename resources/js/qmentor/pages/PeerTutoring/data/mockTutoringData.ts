import {
  Calculator, Atom, FlaskConical, Dna, Monitor, FileText, BookOpen,
  BarChart3, Coins, Settings, Landmark, ClipboardList,
} from 'lucide-react';
import type { Tutor, MatchResult, TutoringSession, LeaderboardEntry, SubjectInfo, TimeSlot } from '../types';

export const subjects: SubjectInfo[] = [
  { key: 'math', nameAr: 'الرياضيات', nameEn: 'Mathematics', icon: Calculator },
  { key: 'physics', nameAr: 'الفيزياء', nameEn: 'Physics', icon: Atom },
  { key: 'chemistry', nameAr: 'الكيمياء', nameEn: 'Chemistry', icon: FlaskConical },
  { key: 'biology', nameAr: 'الأحياء', nameEn: 'Biology', icon: Dna },
  { key: 'cs', nameAr: 'علوم الحاسب', nameEn: 'Computer Science', icon: Monitor },
  { key: 'english', nameAr: 'اللغة الإنجليزية', nameEn: 'English', icon: FileText },
  { key: 'arabic', nameAr: 'اللغة العربية', nameEn: 'Arabic', icon: BookOpen },
  { key: 'statistics', nameAr: 'الإحصاء', nameEn: 'Statistics', icon: BarChart3 },
  { key: 'accounting', nameAr: 'المحاسبة', nameEn: 'Accounting', icon: Coins },
  { key: 'engineering', nameAr: 'الهندسة', nameEn: 'Engineering', icon: Settings },
  { key: 'islamic_studies', nameAr: 'الدراسات الإسلامية', nameEn: 'Islamic Studies', icon: Landmark },
  { key: 'management', nameAr: 'الإدارة', nameEn: 'Management', icon: ClipboardList },
];

export const tutors: Tutor[] = [
  {
    id: 't1', nameAr: 'أحمد محمد عبدالله', nameEn: 'Ahmed Mohammed Abdullah', studentId: '441001234',
    collegeAr: 'كلية العلوم', collegeEn: 'College of Science',
    subjects: ['math', 'statistics'], rating: 4.9, totalSessions: 87,
    availability: [{ day: 'sun', startHour: 10, endHour: 14 }, { day: 'tue', startHour: 10, endHour: 14 }],
    bio: 'معيد سابق في قسم الرياضيات، أحب تبسيط المفاهيم المعقدة',
    bioEn: 'Former TA in Math department, I love simplifying complex concepts', level: 4, isTutor: true,
  },
  {
    id: 't2', nameAr: 'نورة محمد قحطان', nameEn: 'Noura Mohammed Qahtan', studentId: '441005678',
    collegeAr: 'كلية الحاسب', collegeEn: 'College of Computing',
    subjects: ['cs', 'math'], rating: 4.8, totalSessions: 65,
    availability: [{ day: 'mon', startHour: 12, endHour: 16 }, { day: 'wed', startHour: 12, endHour: 16 }],
    bio: 'مبرمجة متمرسة وأستمتع بمساعدة الزملاء في البرمجة',
    bioEn: 'Experienced programmer who enjoys helping peers with coding', level: 3, isTutor: true,
  },
  {
    id: 't3', nameAr: 'فهد محمد سعد', nameEn: 'Fahad Mohammed Saad', studentId: '441002345',
    collegeAr: 'كلية الهندسة', collegeEn: 'College of Engineering',
    subjects: ['physics', 'engineering', 'math'], rating: 4.7, totalSessions: 52,
    availability: [{ day: 'sun', startHour: 8, endHour: 12 }, { day: 'thu', startHour: 8, endHour: 12 }],
    bio: 'طالب هندسة كهربائية، متخصص في الفيزياء والدوائر',
    bioEn: 'Electrical engineering student, specialized in physics and circuits', level: 4, isTutor: true,
  },
  {
    id: 't4', nameAr: 'سارة محمد عتيب', nameEn: 'Sarah Mohammed Otaib', studentId: '441003456',
    collegeAr: 'كلية العلوم', collegeEn: 'College of Science',
    subjects: ['chemistry', 'biology'], rating: 4.6, totalSessions: 41,
    availability: [{ day: 'mon', startHour: 10, endHour: 14 }, { day: 'wed', startHour: 10, endHour: 14 }],
    bio: 'طالبة كيمياء حيوية، أحب المختبرات والتجارب العملية',
    bioEn: 'Biochemistry student, love labs and hands-on experiments', level: 3, isTutor: true,
  },
  {
    id: 't5', nameAr: 'عبدالله محمد شمر', nameEn: 'Abdullah Mohammed Shammar', studentId: '441004567',
    collegeAr: 'كلية إدارة الأعمال', collegeEn: 'College of Business',
    subjects: ['accounting', 'management', 'statistics'], rating: 4.5, totalSessions: 38,
    availability: [{ day: 'sun', startHour: 14, endHour: 18 }, { day: 'tue', startHour: 14, endHour: 18 }],
    bio: 'طالب محاسبة متفوق، لدي خبرة في تبسيط المفاهيم المالية',
    bioEn: 'High-achieving accounting student, experienced in simplifying financial concepts', level: 4, isTutor: true,
  },
  {
    id: 't6', nameAr: 'ريم محمد ناصر', nameEn: 'Reem Mohammed Nasser', studentId: '441006789',
    collegeAr: 'كلية التربية', collegeEn: 'College of Education',
    subjects: ['arabic', 'islamic_studies'], rating: 4.8, totalSessions: 55,
    availability: [{ day: 'sun', startHour: 10, endHour: 14 }, { day: 'mon', startHour: 10, endHour: 14 }],
    bio: 'متخصصة في اللغة العربية والدراسات الإسلامية',
    bioEn: 'Specialized in Arabic language and Islamic studies', level: 4, isTutor: true,
  },
  {
    id: 't7', nameAr: 'خالد محمد دوسر', nameEn: 'Khalid Mohammed Dosar', studentId: '441007890',
    collegeAr: 'كلية الحاسب', collegeEn: 'College of Computing',
    subjects: ['cs', 'math', 'statistics'], rating: 4.4, totalSessions: 33,
    availability: [{ day: 'tue', startHour: 8, endHour: 12 }, { day: 'thu', startHour: 8, endHour: 12 }],
    bio: 'مهتم بالذكاء الاصطناعي وتعلم الآلة',
    bioEn: 'Interested in AI and machine learning', level: 3, isTutor: true,
  },
  {
    id: 't8', nameAr: 'منى محمد محمد', nameEn: 'Mona Mohammede', studentId: '441008901',
    collegeAr: 'كلية العلوم', collegeEn: 'College of Science',
    subjects: ['biology', 'chemistry'], rating: 4.3, totalSessions: 28,
    availability: [{ day: 'wed', startHour: 8, endHour: 12 }, { day: 'thu', startHour: 14, endHour: 18 }],
    bio: 'طالبة أحياء دقيقة، أحب مشاركة المعرفة',
    bioEn: 'Microbiology student, love sharing knowledge', level: 3, isTutor: true,
  },
  {
    id: 't9', nameAr: 'تركي محمد عنز', nameEn: 'Turki Mohammed Anaz', studentId: '441009012',
    collegeAr: 'كلية الهندسة', collegeEn: 'College of Engineering',
    subjects: ['engineering', 'physics'], rating: 4.6, totalSessions: 45,
    availability: [{ day: 'sun', startHour: 12, endHour: 16 }, { day: 'wed', startHour: 12, endHour: 16 }],
    bio: 'طالب هندسة ميكانيكية بخبرة في التدريس',
    bioEn: 'Mechanical engineering student with teaching experience', level: 4, isTutor: true,
  },
  {
    id: 't10', nameAr: 'هيفاء محمد زاهر', nameEn: 'Haifa Mohammed Zaher', studentId: '441010123',
    collegeAr: 'كلية إدارة الأعمال', collegeEn: 'College of Business',
    subjects: ['management', 'english'], rating: 4.7, totalSessions: 49,
    availability: [{ day: 'mon', startHour: 14, endHour: 18 }, { day: 'thu', startHour: 10, endHour: 14 }],
    bio: 'أدرس إدارة الأعمال وأتقن الإنجليزية',
    bioEn: 'Business administration student, fluent in English', level: 4, isTutor: true,
  },
  {
    id: 't11', nameAr: 'محمد محمد قرن', nameEn: 'Mohammed Mohammed Qarn', studentId: '441011234',
    collegeAr: 'كلية العلوم', collegeEn: 'College of Science',
    subjects: ['math', 'physics'], rating: 4.2, totalSessions: 22,
    availability: [{ day: 'sun', startHour: 8, endHour: 12 }, { day: 'tue', startHour: 8, endHour: 12 }],
    bio: 'طالب رياضيات تطبيقية في السنة الثالثة',
    bioEn: 'Applied mathematics student in third year', level: 3, isTutor: true,
  },
  {
    id: 't12', nameAr: 'لمى محمد بقمي', nameEn: 'Lama Mohammed Bugmi', studentId: '441012345',
    collegeAr: 'كلية الحاسب', collegeEn: 'College of Computing',
    subjects: ['cs', 'english'], rating: 4.5, totalSessions: 36,
    availability: [{ day: 'mon', startHour: 8, endHour: 12 }, { day: 'wed', startHour: 14, endHour: 18 }],
    bio: 'مطورة ويب وأساعد في مشاريع البرمجة',
    bioEn: 'Web developer, I help with programming projects', level: 3, isTutor: true,
  },
  {
    id: 't13', nameAr: 'سلطان محمد رشيد', nameEn: 'Sultan Mohammed Rasheed', studentId: '441013456',
    collegeAr: 'كلية العلوم', collegeEn: 'College of Science',
    subjects: ['statistics', 'math'], rating: 4.1, totalSessions: 19,
    availability: [{ day: 'tue', startHour: 14, endHour: 18 }, { day: 'thu', startHour: 14, endHour: 18 }],
    bio: 'طالب إحصاء، أحب تحليل البيانات',
    bioEn: 'Statistics student, love data analysis', level: 3, isTutor: true,
  },
  {
    id: 't14', nameAr: 'عهود محمد مالك', nameEn: 'Ohoud Mohammed Malek', studentId: '441014567',
    collegeAr: 'كلية التربية', collegeEn: 'College of Education',
    subjects: ['arabic', 'english'], rating: 4.9, totalSessions: 72,
    availability: [{ day: 'sun', startHour: 10, endHour: 14 }, { day: 'wed', startHour: 10, endHour: 14 }],
    bio: 'متخصصة في تعليم اللغات وأساليب التدريس الحديثة',
    bioEn: 'Specialized in language teaching and modern pedagogy', level: 4, isTutor: true,
  },
  {
    id: 't15', nameAr: 'بدر محمد شاهر', nameEn: 'Badr Mohammed Shaher', studentId: '441015678',
    collegeAr: 'كلية الهندسة', collegeEn: 'College of Engineering',
    subjects: ['engineering', 'math', 'physics'], rating: 4.3, totalSessions: 30,
    availability: [{ day: 'mon', startHour: 8, endHour: 12 }, { day: 'thu', startHour: 8, endHour: 12 }],
    bio: 'طالب هندسة مدنية، أحب حل المسائل',
    bioEn: 'Civil engineering student, love problem solving', level: 3, isTutor: true,
  },
  {
    id: 't16', nameAr: 'غادة محمد جهاد', nameEn: 'Ghada Mohammed Jihad', studentId: '441016789',
    collegeAr: 'كلية العلوم', collegeEn: 'College of Science',
    subjects: ['chemistry', 'biology', 'physics'], rating: 4.4, totalSessions: 34,
    availability: [{ day: 'sun', startHour: 14, endHour: 18 }, { day: 'tue', startHour: 10, endHour: 14 }],
    bio: 'طالبة كيمياء عامة وأساعد في المواد العلمية',
    bioEn: 'General chemistry student, helping with science subjects', level: 3, isTutor: true,
  },
  {
    id: 't17', nameAr: 'ياسر محمد عمر', nameEn: 'Yasser Mohammed Omar', studentId: '441017890',
    collegeAr: 'كلية إدارة الأعمال', collegeEn: 'College of Business',
    subjects: ['accounting', 'management'], rating: 4.6, totalSessions: 43,
    availability: [{ day: 'mon', startHour: 10, endHour: 14 }, { day: 'wed', startHour: 8, endHour: 12 }],
    bio: 'طالب محاسبة ومالية، خبرة في التدريس الجامعي',
    bioEn: 'Accounting and finance student with university tutoring experience', level: 4, isTutor: true,
  },
  {
    id: 't18', nameAr: 'دانة محمد سالم', nameEn: 'Dana Mohammed Salem', studentId: '441018901',
    collegeAr: 'كلية الحاسب', collegeEn: 'College of Computing',
    subjects: ['cs', 'statistics'], rating: 4.7, totalSessions: 51,
    availability: [{ day: 'tue', startHour: 12, endHour: 16 }, { day: 'thu', startHour: 12, endHour: 16 }],
    bio: 'متخصصة في علم البيانات والذكاء الاصطناعي',
    bioEn: 'Specialized in data science and AI', level: 4, isTutor: true,
  },
  {
    id: 't19', nameAr: 'فيصل الحارثي', nameEn: 'Faisal Al-Harthi', studentId: '441019012',
    collegeAr: 'كلية التربية', collegeEn: 'College of Education',
    subjects: ['islamic_studies', 'arabic'], rating: 4.5, totalSessions: 40,
    availability: [{ day: 'sun', startHour: 8, endHour: 12 }, { day: 'wed', startHour: 14, endHour: 18 }],
    bio: 'طالب شريعة وأصول دين، أحب نشر العلم',
    bioEn: 'Sharia and theology student, passionate about teaching', level: 4, isTutor: true,
  },
  {
    id: 't20', nameAr: 'رهف محمد ثقيف', nameEn: 'Rahaf Mohammed Thaqif', studentId: '441020123',
    collegeAr: 'كلية العلوم', collegeEn: 'College of Science',
    subjects: ['biology', 'english'], rating: 4.2, totalSessions: 25,
    availability: [{ day: 'mon', startHour: 14, endHour: 18 }, { day: 'thu', startHour: 10, endHour: 14 }],
    bio: 'طالبة أحياء وأتقن الإنجليزية العلمية',
    bioEn: 'Biology student, fluent in scientific English', level: 3, isTutor: true,
  },
  {
    id: 't21', nameAr: 'عمر محمد زبيد', nameEn: 'Omar Al-Zubaidi', studentId: '441021234',
    collegeAr: 'كلية الهندسة', collegeEn: 'College of Engineering',
    subjects: ['math', 'engineering'], rating: 4.0, totalSessions: 15,
    availability: [{ day: 'tue', startHour: 8, endHour: 12 }, { day: 'wed', startHour: 8, endHour: 12 }],
    bio: 'طالب هندسة صناعية مستعد للمساعدة',
    bioEn: 'Industrial engineering student ready to help', level: 2, isTutor: true,
  },
];

export const matchResults: MatchResult[] = [
  {
    tutor: tutors[0], matchScore: 95,
    reasonAr: 'تفوق في الرياضيات والإحصاء، يتوافق مع المواد الضعيفة لديك',
    reasonEn: 'Excels in Math & Statistics, matches your weak subjects',
    mutualSlots: [{ day: 'sun', startHour: 10, endHour: 12 }],
  },
  {
    tutor: tutors[1], matchScore: 88,
    reasonAr: 'خبرة في علوم الحاسب والبرمجة، أسلوب تعليمي ممتاز',
    reasonEn: 'CS & programming expert, excellent teaching style',
    mutualSlots: [{ day: 'mon', startHour: 12, endHour: 14 }],
  },
  {
    tutor: tutors[2], matchScore: 82,
    reasonAr: 'متخصص في الفيزياء والهندسة، تقييمات عالية من الطلاب',
    reasonEn: 'Physics & engineering specialist, high student ratings',
    mutualSlots: [{ day: 'thu', startHour: 8, endHour: 10 }],
  },
  {
    tutor: tutors[5], matchScore: 79,
    reasonAr: 'متفوقة في اللغة العربية، خبرة تدريسية واسعة',
    reasonEn: 'Arabic language expert with extensive teaching experience',
    mutualSlots: [{ day: 'sun', startHour: 10, endHour: 12 }],
  },
  {
    tutor: tutors[9], matchScore: 75,
    reasonAr: 'مهارات إدارية وإنجليزية ممتازة',
    reasonEn: 'Excellent management and English skills',
    mutualSlots: [{ day: 'mon', startHour: 14, endHour: 16 }],
  },
];

export const sessions: TutoringSession[] = [
  { id: 's1', tutorId: 't1', tutorNameAr: 'أحمد محمد عبدالله', tutorNameEn: 'Ahmed Mohammed Abdullah', studentNameAr: 'محمد الطالب', studentNameEn: 'Mohammed Student', subject: 'math', date: '2026-04-14', startHour: 10, endHour: 12, location: 'campus', status: 'scheduled' },
  { id: 's2', tutorId: 't2', tutorNameAr: 'نورة محمد قحطان', tutorNameEn: 'Noura Mohammed Qahtan', studentNameAr: 'محمد الطالب', studentNameEn: 'Mohammed Student', subject: 'cs', date: '2026-04-15', startHour: 12, endHour: 14, location: 'online', status: 'scheduled' },
  { id: 's3', tutorId: 't3', tutorNameAr: 'فهد محمد سعد', tutorNameEn: 'Fahad Mohammed Saad', studentNameAr: 'محمد الطالب', studentNameEn: 'Mohammed Student', subject: 'physics', date: '2026-04-10', startHour: 8, endHour: 10, location: 'campus', status: 'completed', rating: 5, notes: 'جلسة ممتازة في الديناميكا الحرارية', notesEn: 'Excellent thermodynamics session' },
  { id: 's4', tutorId: 't6', tutorNameAr: 'ريم محمد ناصر', tutorNameEn: 'Reem Mohammed Nasser', studentNameAr: 'محمد الطالب', studentNameEn: 'Mohammed Student', subject: 'arabic', date: '2026-04-08', startHour: 10, endHour: 12, location: 'online', status: 'completed', rating: 4 },
  { id: 's5', tutorId: 't5', tutorNameAr: 'عبدالله محمد شمر', tutorNameEn: 'Abdullah Mohammed Shammar', studentNameAr: 'محمد الطالب', studentNameEn: 'Mohammed Student', subject: 'accounting', date: '2026-04-06', startHour: 14, endHour: 16, location: 'campus', status: 'completed', rating: 5 },
  { id: 's6', tutorId: 't1', tutorNameAr: 'أحمد محمد عبدالله', tutorNameEn: 'Ahmed Mohammed Abdullah', studentNameAr: 'محمد الطالب', studentNameEn: 'Mohammed Student', subject: 'statistics', date: '2026-04-04', startHour: 10, endHour: 12, location: 'online', status: 'completed', rating: 5 },
  { id: 's7', tutorId: 't4', tutorNameAr: 'سارة محمد عتيب', tutorNameEn: 'Sarah Mohammed Otaib', studentNameAr: 'محمد الطالب', studentNameEn: 'Mohammed Student', subject: 'chemistry', date: '2026-04-12', startHour: 10, endHour: 12, location: 'campus', status: 'in_progress' },
  { id: 's8', tutorId: 't7', tutorNameAr: 'خالد محمد دوسر', tutorNameEn: 'Khalid Mohammed Dosar', studentNameAr: 'محمد الطالب', studentNameEn: 'Mohammed Student', subject: 'cs', date: '2026-04-02', startHour: 8, endHour: 10, location: 'online', status: 'cancelled' },
  { id: 's9', tutorId: 't14', tutorNameAr: 'عهود محمد مالك', tutorNameEn: 'Ohoud Mohammed Malek', studentNameAr: 'محمد الطالب', studentNameEn: 'Mohammed Student', subject: 'english', date: '2026-04-16', startHour: 10, endHour: 12, location: 'online', status: 'scheduled' },
  { id: 's10', tutorId: 't9', tutorNameAr: 'تركي محمد عنز', tutorNameEn: 'Turki Mohammed Anaz', studentNameAr: 'محمد الطالب', studentNameEn: 'Mohammed Student', subject: 'engineering', date: '2026-03-28', startHour: 12, endHour: 14, location: 'campus', status: 'completed', rating: 4 },
];

export const leaderboard: LeaderboardEntry[] = tutors
  .slice()
  .sort((a, b) => b.totalSessions - a.totalSessions)
  .slice(0, 10)
  .map((tutor, i) => ({
    rank: i + 1,
    tutor,
    sessionsCompleted: tutor.totalSessions,
    avgRating: tutor.rating,
    subjectsCovered: tutor.subjects.length,
    impactScore: Math.round(tutor.totalSessions * tutor.rating * 2),
  }));

export const dayLabels: Record<string, { ar: string; en: string }> = {
  sun: { ar: 'الأحد', en: 'Sun' },
  mon: { ar: 'الاثنين', en: 'Mon' },
  tue: { ar: 'الثلاثاء', en: 'Tue' },
  wed: { ar: 'الأربعاء', en: 'Wed' },
  thu: { ar: 'الخميس', en: 'Thu' },
};

export function getSubjectName(key: string, lang: 'ar' | 'en'): string {
  const s = subjects.find(s => s.key === key);
  return s ? (lang === 'ar' ? s.nameAr : s.nameEn) : key;
}

export function formatHour(h: number): string {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:00 ${period}`;
}
