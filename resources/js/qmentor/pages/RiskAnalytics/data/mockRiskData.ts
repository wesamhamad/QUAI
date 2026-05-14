import type {
  UniversityRiskOverview,
  RiskCategoryInfo,
  AtRiskStudent,
  EarlyWarning,
  RiskTrendPoint,
  RiskCategoryKey,
} from '../types';
import { riskIndicators, categoryMeta } from './riskIndicators';

export const universityOverview: UniversityRiskOverview = {
  totalStudents: 71240,
  lowRisk: 52418,
  mediumRisk: 12823,
  highRisk: 4631,
  criticalRisk: 1368,
  overallScore: 28,
  trend: 'improving',
  trendDelta: -2.3,
};

const categoryKeys: RiskCategoryKey[] = [
  'A', 'G', 'S', 'E', 'AC', 'R', 'T', 'C', 'P',
];

export const riskCategories: RiskCategoryInfo[] = categoryKeys.map(key => {
  const meta = categoryMeta[key];
  const indicators = riskIndicators.filter(i => i.category === key);
  const avgScore = Math.round(indicators.reduce((s, i) => s + (i.currentValue / i.threshold) * 50, 0) / (indicators.length || 1));
  const scores: Record<string, { score: number; count: number; trend: RiskCategoryInfo['trend'] }> = {
    A:  { score: 42, count: 3850, trend: 'stable' },
    G:  { score: 48, count: 4120, trend: 'declining' },
    S:  { score: 22, count: 1540, trend: 'improving' },
    E:  { score: 31, count: 2210, trend: 'stable' },
    AC: { score: 35, count: 2680, trend: 'improving' },
    R:  { score: 38, count: 3200, trend: 'stable' },
    T:  { score: 52, count: 4850, trend: 'declining' },
    C:  { score: 33, count: 2100, trend: 'stable' },
    P:  { score: 27, count: 1890, trend: 'improving' },
  };
  const data = scores[key] ?? { score: avgScore, count: 1000, trend: 'stable' as const };
  return {
    key,
    nameAr: meta.nameAr,
    nameEn: meta.nameEn,
    code: meta.code,
    icon: meta.icon,
    riskScore: data.score,
    studentCount: data.count,
    trend: data.trend,
    indicators,
  };
});

const colleges = [
  { ar: 'كلية الحاسب', en: 'College of Computer' },
  { ar: 'كلية الهندسة', en: 'College of Engineering' },
  { ar: 'كلية العلوم', en: 'College of Science' },
  { ar: 'كلية إدارة الأعمال', en: 'College of Business' },
  { ar: 'كلية الطب', en: 'College of Medicine' },
  { ar: 'كلية الصيدلة', en: 'College of Pharmacy' },
  { ar: 'كلية الشريعة', en: 'College of Sharia' },
  { ar: 'كلية التربية', en: 'College of Education' },
];

const departments = [
  { ar: 'علوم الحاسب', en: 'Computer Science' },
  { ar: 'نظم المعلومات', en: 'Information Systems' },
  { ar: 'الهندسة المدنية', en: 'Civil Engineering' },
  { ar: 'الهندسة الكهربائية', en: 'Electrical Engineering' },
  { ar: 'الرياضيات', en: 'Mathematics' },
  { ar: 'الفيزياء', en: 'Physics' },
  { ar: 'المحاسبة', en: 'Accounting' },
  { ar: 'التسويق', en: 'Marketing' },
];

const maleNames = [
  { ar: 'محمد أحمد عتيب', en: 'Mohammed Mohammed Otaib' },
  { ar: 'عبدالله سعد قحطان', en: 'Abdullah Mohammed Qahtan' },
  { ar: 'خالد فهد ناصر', en: 'Khalid Mohammed Nasser' },
  { ar: 'فيصل ناصر دوسر', en: 'Faisal Mohammed Dosar' },
  { ar: 'سعود عبدالرحمن سعد', en: 'Saud Mohammed Saad' },
  { ar: 'تركي سلطان شمر', en: 'Turki Mohammed Shammar' },
  { ar: 'نواف بندر عنز', en: 'Nawaf Mohammed Anaz' },
  { ar: 'ماجد حمد عبدالله', en: 'Majed Mohammed Abdullah' },
  { ar: 'عمر يوسف زاهر', en: 'Omar Mohammed Zaher' },
  { ar: 'بدر محمد فهد', en: 'Badr Mohammed Fahd' },
  { ar: 'سلطان عبدالعزيز رشيد', en: 'Sultan Mohammed Rasheed' },
  { ar: 'راكان خالد محمد', en: 'Rakan Mohammed Mohammed' },
  { ar: 'عبدالرحمن صالح شاهر', en: 'Abdulrahman Mohammed Shaher' },
  { ar: 'يزيد ماجد عمر', en: 'Yazeed Mohammed Omar' },
  { ar: 'مشاري فهد حازم', en: 'Mishari Mohammed Hazem' },
  { ar: 'حمد سعيد مالك', en: 'Hamad Mohammed Malek' },
  { ar: 'طلال نايف قرن', en: 'Talal Mohammed Qarn' },
  { ar: 'أنس وليد أحمد', en: 'Anas Mohammed Ahmad' },
  { ar: 'زياد هاني السليمان', en: 'Ziad Al-Sulaiman' },
  { ar: 'مهند عادل جهاد', en: 'Muhannad Mohammed Jihad' },
  { ar: 'وائل سامي ثقيف', en: 'Wael Mohammed Thaqif' },
  { ar: 'إبراهيم رائد بقمي', en: 'Ibrahim Mohammed Bugmi' },
  { ar: 'حاتم فارس الكلثم', en: 'Hatem Al-Kaltham' },
  { ar: 'سامي جاسم عجم', en: 'Sami Al-Ajmi' },
  { ar: 'ريان أحمد الحميدان', en: 'Rayan Al-Humaidan' },
  { ar: 'يوسف خالد النفيسة', en: 'Yousef Al-Nafisah' },
  { ar: 'عبدالملك طارق الصقر', en: 'Abdulmalik Al-Saqr' },
  { ar: 'ناصر مبارك لاحم', en: 'Nasser Mohammed Lahem' },
  { ar: 'مازن فيصل خالد', en: 'Mazen Mohammed Khaled' },
  { ar: 'أسامة منصور الحارثي', en: 'Osama Al-Harthi' },
  { ar: 'هيثم غازي عمر', en: 'Haitham Mohammed Omar' },
  { ar: 'صالح عمر البيشي', en: 'Saleh Al-Bishi' },
  { ar: 'جاسر حسن الفيفي', en: 'Jaser Al-Fifi' },
  { ar: 'لؤي رشيد عبدالله', en: 'Louai Mohammed Abdullah' },
  { ar: 'منصور علي شهران', en: 'Mansour Mohammed Shahran' },
  { ar: 'أحمد فواز محمد', en: 'Ahmed Mohammed Mohammed' },
  { ar: 'عبدالعزيز سعيد عسير', en: 'Abdulaziz Mohammed Aseer' },
  { ar: 'فواز نايف خثعم', en: 'Fawaz Mohammed Khathaam' },
  { ar: 'رائد تركي الدعجاني', en: 'Raed Al-Daajani' },
  { ar: 'نايف بدر المزيني', en: 'Naif Al-Muzaini' },
  { ar: 'حسام وليد العصيمي', en: 'Hussam Al-Osaimi' },
  { ar: 'بسام سلمان البشري', en: 'Bassam Al-Bishri' },
  { ar: 'ثامر رياض الوادعي', en: 'Thamer Al-Wadai' },
  { ar: 'غسان فهد الحمدان', en: 'Ghassan Al-Hamdan' },
  { ar: 'شهاب عبدالله الفراج', en: 'Shihab Al-Farraj' },
  { ar: 'كمال يعقوب الخضيري', en: 'Kamal Al-Khudairi' },
  { ar: 'داوود إسماعيل النعيم', en: 'Dawood Al-Nuaim' },
  { ar: 'وسيم حسام الطويرقي', en: 'Waseem Al-Tuwairqi' },
  { ar: 'رامي عثمان الريس', en: 'Rami Al-Rais' },
  { ar: 'عادل صقر الجعيد', en: 'Adel Al-Juaid' },
  { ar: 'مراد حافظ العلياني', en: 'Murad Al-Alyani' },
  { ar: 'صهيب ممدوح الفهاد', en: 'Suhaib Al-Fahad' },
  { ar: 'عامر جابر القرشي', en: 'Amer Al-Qurashi' },
  { ar: 'وليد حمود العضياني', en: 'Waleed Al-Adhyani' },
  { ar: 'هشام نبيل المرواني', en: 'Hisham Al-Marwani' },
];

const riskLevels: Array<{ level: AtRiskStudent['riskLevel']; score: [number, number] }> = [
  { level: 'critical', score: [80, 95] },
  { level: 'high', score: [60, 79] },
  { level: 'medium', score: [40, 59] },
  { level: 'low', score: [15, 39] },
];

const factorsAr = [
  'انخفاض المعدل', 'ضعف الحضور', 'تأخر التسليمات', 'قلة التفاعل',
  'مشاكل مالية', 'ضغوط نفسية', 'عدم التوافق مع التخصص', 'ضعف إدارة الوقت',
  'غياب متكرر', 'انعزال اجتماعي',
];
const factorsEn = [
  'GPA decline', 'Low attendance', 'Late submissions', 'Low engagement',
  'Financial issues', 'Psychological stress', 'Major mismatch', 'Poor time management',
  'Frequent absences', 'Low engagement & participation',
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() + (max - min) / (max - min + 1)) * (max - min) + min;
}

function seededRand(seed: number, min: number, max: number) {
  const x = Math.sin(seed) * 10000;
  const r = x - Math.floor(x);
  return Math.floor(r * (max - min + 1)) + min;
}

export const atRiskStudents: AtRiskStudent[] = maleNames.map((name, i) => {
  const riskGroup = riskLevels[i < 8 ? 0 : i < 22 ? 1 : i < 40 ? 2 : 3];
  const score = seededRand(i + 1, riskGroup.score[0], riskGroup.score[1]);
  const college = colleges[seededRand(i + 10, 0, colleges.length - 1)];
  const dept = departments[seededRand(i + 20, 0, departments.length - 1)];
  const f1 = seededRand(i + 30, 0, factorsAr.length - 1);
  const f2 = seededRand(i + 40, 0, factorsAr.length - 1);
  const f3 = seededRand(i + 50, 0, factorsAr.length - 1);
  const uniqueFactors = [...new Set([f1, f2, f3])].slice(0, 3);
  const cats = categoryKeys.filter((_, ci) => seededRand(i + ci + 60, 0, 3) === 0).slice(0, 3);
  const trends: AtRiskStudent['trend'][] = ['improving', 'stable', 'declining'];

  return {
    id: `STU-${(44100 + i).toString()}`,
    name: name.ar,
    nameEn: name.en,
    studentId: `44${(100 + i).toString().padStart(4, '0')}${seededRand(i, 100, 999)}`,
    college: college.ar,
    collegeEn: college.en,
    department: dept.ar,
    departmentEn: dept.en,
    riskLevel: riskGroup.level,
    riskScore: score,
    topFactors: uniqueFactors.map(fi => factorsAr[fi]),
    topFactorsEn: uniqueFactors.map(fi => factorsEn[fi]),
    trend: trends[seededRand(i + 70, 0, 2)],
    categories: cats.length > 0 ? cats : [categoryKeys[seededRand(i, 0, 8)]],
  };
});

export const earlyWarnings: EarlyWarning[] = [
  { id: 'EW01', studentName: 'محمد أحمد عتيب', studentNameEn: 'Mohammed Mohammed Otaib', studentId: '441000234', triggerAr: 'المعدل التراكمي انخفض تحت 2.0', triggerEn: 'GPA dropped below 2.0', category: 'G', severity: 'critical', timestamp: '2026-04-12T08:30:00', acknowledged: false, escalated: false },
  { id: 'EW02', studentName: 'عبدالله سعد قحطان', studentNameEn: 'Abdullah Qahtan', studentId: '441010345', triggerAr: 'غياب 3 أسابيع متتالية', triggerEn: '3 consecutive weeks of absence', category: 'A', severity: 'critical', timestamp: '2026-04-12T07:15:00', acknowledged: false, escalated: false },
  { id: 'EW03', studentName: 'خالد فهد ناصر', studentNameEn: 'Khalid Nasser', studentId: '441020456', triggerAr: 'لم يسلم 5 واجبات متتالية', triggerEn: '5 consecutive missed assignments', category: 'S', severity: 'high', timestamp: '2026-04-11T16:45:00', acknowledged: true, escalated: false },
  { id: 'EW04', studentName: 'فيصل ناصر دوسر', studentNameEn: 'Faisal Dosar', studentId: '441030567', triggerAr: 'رسوب في اختبارين نصفيين', triggerEn: 'Failed 2 midterm exams', category: 'G', severity: 'high', timestamp: '2026-04-11T14:20:00', acknowledged: true, escalated: true },
  { id: 'EW05', studentName: 'سعود عبدالرحمن سعد', studentNameEn: 'Saud Saad', studentId: '441040678', triggerAr: 'طلب سحب من 3 مقررات', triggerEn: 'Requested withdrawal from 3 courses', category: 'R', severity: 'high', timestamp: '2026-04-11T11:00:00', acknowledged: false, escalated: false },
  { id: 'EW06', studentName: 'تركي سلطان شمر', studentNameEn: 'Turki Shammar', studentId: '441050789', triggerAr: 'لم يدخل نظام التعلم منذ أسبوعين', triggerEn: 'No LMS login for 2 weeks', category: 'E', severity: 'medium', timestamp: '2026-04-10T09:30:00', acknowledged: true, escalated: false },
  { id: 'EW07', studentName: 'نواف بندر عنز', studentNameEn: 'Nawaf Anaz', studentId: '441060890', triggerAr: 'تأخر سداد الرسوم الدراسية', triggerEn: 'Overdue tuition payment', category: 'AC', severity: 'medium', timestamp: '2026-04-10T08:00:00', acknowledged: false, escalated: false },
  { id: 'EW08', studentName: 'ماجد حمد عبدالله', studentNameEn: 'Majed Abdullah', studentId: '441070901', triggerAr: 'إنذار أكاديمي ثاني', triggerEn: 'Second academic warning', category: 'AC', severity: 'critical', timestamp: '2026-04-09T15:45:00', acknowledged: true, escalated: true },
  { id: 'EW09', studentName: 'عمر يوسف زاهر', studentNameEn: 'Omar Zaher', studentId: '441080012', triggerAr: 'انخفاض حاد في درجات المختبرات', triggerEn: 'Sharp decline in lab scores', category: 'G', severity: 'medium', timestamp: '2026-04-09T13:20:00', acknowledged: false, escalated: false },
  { id: 'EW10', studentName: 'بدر محمد فهد', studentNameEn: 'Badr Fahd', studentId: '441090123', triggerAr: 'تحويل من العيادة النفسية', triggerEn: 'Referred from counseling clinic', category: 'C', severity: 'high', timestamp: '2026-04-09T10:00:00', acknowledged: true, escalated: false },
  { id: 'EW11', studentName: 'سلطان عبدالعزيز رشيد', studentNameEn: 'Sultan Rasheed', studentId: '441100234', triggerAr: 'معدل تسليم الواجبات أقل من 40%', triggerEn: 'Assignment submission rate below 40%', category: 'S', severity: 'high', timestamp: '2026-04-08T16:30:00', acknowledged: false, escalated: false },
  { id: 'EW12', studentName: 'راكان خالد محمد', studentNameEn: 'Rakan Mohammed', studentId: '441110345', triggerAr: 'طلب تغيير تخصص للمرة الثالثة', triggerEn: 'Third major change request', category: 'R', severity: 'medium', timestamp: '2026-04-08T11:15:00', acknowledged: true, escalated: false },
];

export const riskTrends: RiskTrendPoint[] = [
  { week: 'الأسبوع 1', weekEn: 'Week 1', low: 53200, medium: 12100, high: 4400, critical: 1540 },
  { week: 'الأسبوع 2', weekEn: 'Week 2', low: 53000, medium: 12300, high: 4500, critical: 1440 },
  { week: 'الأسبوع 3', weekEn: 'Week 3', low: 52800, medium: 12500, high: 4550, critical: 1390 },
  { week: 'الأسبوع 4', weekEn: 'Week 4', low: 52418, medium: 12823, high: 4631, critical: 1368 },
];

export const collegeRiskData = [
  { nameAr: 'كلية الحاسب', nameEn: 'Computer', low: 6200, medium: 1500, high: 580, critical: 170 },
  { nameAr: 'كلية الهندسة', nameEn: 'Engineering', low: 7100, medium: 1800, high: 650, critical: 200 },
  { nameAr: 'كلية العلوم', nameEn: 'Science', low: 5800, medium: 1400, high: 520, critical: 130 },
  { nameAr: 'كلية إدارة الأعمال', nameEn: 'Business', low: 8500, medium: 2100, high: 780, critical: 220 },
  { nameAr: 'كلية الطب', nameEn: 'Medicine', low: 3200, medium: 600, high: 200, critical: 50 },
  { nameAr: 'كلية الصيدلة', nameEn: 'Pharmacy', low: 2800, medium: 550, high: 190, critical: 48 },
  { nameAr: 'كلية الشريعة', nameEn: 'Sharia', low: 9500, medium: 2400, high: 850, critical: 280 },
  { nameAr: 'كلية التربية', nameEn: 'Education', low: 9318, medium: 2473, high: 861, critical: 270 },
];
