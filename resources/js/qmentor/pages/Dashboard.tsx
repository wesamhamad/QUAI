import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useRole } from '../contexts/RoleContext';
import { canAccess } from '../lib/rolePermissions';
import { StaggerContainer, StaggerItem } from '../lib/motion';
import {
  useStudentProfile,
  useCurrentCourses,
  useAcademicTransactions,
  useCourseContent,
} from '../hooks/useStudentData';
import {
  Users,
  UserCheck,
  BarChart3,
  CalendarDays,
  MessageSquare,
  Bell,
  GraduationCap,
  HandHelping,
  HeartPulse,
  GitCompareArrows,
  Smartphone,
  Settings,
  Bot,
  ArrowUpRight,
  FileText,
  BookOpen,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Award,
  Target,
  X,
  ArrowRight,
  Check,
  Loader2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ServiceItem {
  icon: LucideIcon;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  path: string;
  accent: string;
  iconBg: string;
  featured?: boolean;
}

const services: ServiceItem[] = [
  // Student-focused services
  {
    icon: BarChart3,
    titleAr: 'حالة المخاطر',
    titleEn: 'My Risk Status',
    descriptionAr: 'عرض مستوى الخطر الأكاديمي والمؤشرات الأساسية',
    descriptionEn: 'View your academic risk level and key contributing indicators',
    path: '/student-dashboard',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
    featured: true,
  },
  {
    icon: CalendarDays,
    titleAr: 'الجدول والمواعيد',
    titleEn: 'Schedule & Deadlines',
    descriptionAr: 'عرض جدولك الأسبوعي والمواعيد النهائية والاختبارات',
    descriptionEn: 'View your weekly schedule, deadlines, and upcoming exams',
    path: '/schedule',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
  },
  {
    icon: UserCheck,
    titleAr: 'تواصل مع المرشد',
    titleEn: 'Contact Advisor',
    descriptionAr: 'تواصل مع مرشدك الأكاديمي عبر Teams أو البريد أو حجز موعد',
    descriptionEn: 'Reach your advisor via Teams, email, or schedule a meeting',
    path: '/contact-advisor',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
  },
  // Advisor/Admin services
  {
    icon: Users,
    titleAr: 'التوأم الرقمي',
    titleEn: 'Digital Twin',
    descriptionAr: 'نموذج رقمي شامل لكل طالب يتتبع الأداء الأكاديمي والسلوكي',
    descriptionEn: 'Comprehensive digital model tracking student academic & behavioral performance',
    path: '/digital-twin',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
    featured: true,
  },
  {
    icon: UserCheck,
    titleAr: 'لوحة المرشد',
    titleEn: 'Advisor Dashboard',
    descriptionAr: 'أدوات متقدمة للمرشدين الأكاديميين لمتابعة الطلاب',
    descriptionEn: 'Advanced tools for academic advisors to monitor students',
    path: '/advisor-dashboard',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
    featured: true,
  },
  {
    icon: BarChart3,
    titleAr: 'تحليل المخاطر',
    titleEn: 'Risk Analytics',
    descriptionAr: 'تحليل ذكي للتعرف المبكر على الطلاب المعرضين للخطر',
    descriptionEn: 'Smart analytics for early identification of at-risk students',
    path: '/risk-analytics',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
    featured: true,
  },
  {
    icon: CalendarDays,
    titleAr: 'الخطة الدراسية',
    titleEn: 'Study Plan',
    descriptionAr: 'خطط دراسية مخصصة بناءً على أداء الطالب',
    descriptionEn: 'Personalized study plans based on student performance',
    path: '/study-plan',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-600 dark:bg-sa-950 dark:text-sa-400',
  },
  {
    icon: MessageSquare,
    titleAr: 'المحادثة الذكية',
    titleEn: 'Chatbot',
    descriptionAr: 'مساعد ذكي للإجابة على استفسارات الطلاب',
    descriptionEn: 'AI assistant for answering student inquiries',
    path: '/chatbot',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
  },
  {
    icon: Bell,
    titleAr: 'التنبيهات الذكية',
    titleEn: 'Smart Alerts',
    descriptionAr: 'تنبيهات فورية عند انخفاض الأداء أو الحضور',
    descriptionEn: 'Instant alerts on performance or attendance drops',
    path: '/alerts',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
  },
  {
    icon: GraduationCap,
    titleAr: 'لوحة أعضاء هيئة التدريس',
    titleEn: 'Faculty Dashboard',
    descriptionAr: 'أدوات لأعضاء هيئة التدريس لمتابعة تقدم الطلاب',
    descriptionEn: 'Tools for faculty to track student progress',
    path: '/faculty',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
  },
  {
    icon: HandHelping,
    titleAr: 'التدريس بالأقران',
    titleEn: 'Peer Tutoring',
    descriptionAr: 'ربط الطلاب المتفوقين بزملائهم للمساعدة الأكاديمية',
    descriptionEn: 'Connect high-performing students with peers for academic help',
    path: '/peer-tutoring',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
  },
  {
    icon: HeartPulse,
    titleAr: 'برنامج التعافي',
    titleEn: 'Recovery Program',
    descriptionAr: 'برامج دعم مخصصة للطلاب المتعثرين أكاديمياً',
    descriptionEn: 'Tailored support programs for academically struggling students',
    path: '/recovery',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
  },
  {
    icon: GitCompareArrows,
    titleAr: 'المقارنة المعيارية',
    titleEn: 'Benchmarking',
    descriptionAr: 'مقارنة الأداء المؤسسي مع المعايير المحلية والعالمية',
    descriptionEn: 'Compare institutional performance against local and global benchmarks',
    path: '/benchmarking',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
  },
  {
    icon: Bot,
    titleAr: 'نشاط الوكيل الذكي',
    titleEn: 'AI Agent Activity',
    descriptionAr: 'مراقبة المهام المستقلة للوكيل الذكي ومصفوفة الاستقلالية',
    descriptionEn: 'Monitor autonomous agent tasks and the autonomy matrix',
    path: '/agent-activity',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
  },
  {
    icon: Smartphone,
    titleAr: 'الجوال والرسائل',
    titleEn: 'Mobile & Messaging',
    descriptionAr: 'إشعارات فورية عبر الجوال والرسائل النصية',
    descriptionEn: 'Instant mobile notifications and text messaging',
    path: '/mobile',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
  },
  {
    icon: Settings,
    titleAr: 'الإعدادات',
    titleEn: 'Settings',
    descriptionAr: 'إعدادات المنصة والتفضيلات الشخصية',
    descriptionEn: 'Platform settings and personal preferences',
    path: '/settings',
    accent: 'border-t-sa-500',
    iconBg: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400',
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Shared types & helpers for the QSpark+ tabs
// ─────────────────────────────────────────────────────────────────────────

const QSPARK_FALLBACK_URL = 'https://qspark.qu.edu.sa/';

function getQsparkBaseUrl(): string {
  const links = (window as unknown as { __qmentor_links?: { qspark?: string } }).__qmentor_links;
  return links?.qspark || QSPARK_FALLBACK_URL;
}

function getDigitalRecordUrl(): string {
  const links = (window as unknown as { __qmentor_links?: { digitalRecord?: string } }).__qmentor_links;
  return links?.digitalRecord || '/digital-record';
}

/**
 * Build a deep link into QSpark.
 * QSpark resolves `/courses/{id}` via array-index + 1 of the same
 * /api/v2/student/courses payload our dashboard consumes (see
 * CoursesController::fetchStudentCoursesForLookup), so passing the
 * 1-based index from `currentCourses` lands on the right course.
 * String fallback uses ?search= for callers that only have a code
 * (e.g. low-grade banner sourcing from past transactions).
 */
function buildQsparkCourseLink(idOrCode?: number | string | null): string {
  const base = getQsparkBaseUrl().replace(/\/$/, '');
  if (idOrCode === null || idOrCode === undefined || idOrCode === '') return base + '/';
  if (typeof idOrCode === 'number' && Number.isFinite(idOrCode) && idOrCode > 0) {
    return `${base}/courses/${idOrCode}`;
  }
  return `${base}/?search=${encodeURIComponent(String(idOrCode))}`;
}

// Flow popup steps for digital record
const FLOW_STEPS = [
  { titleAr: 'تحليل المهارات', titleEn: 'Skills Analysis', descAr: 'مراجعة مهاراتك المعتمدة من سجل المهارات', descEn: 'Review your certified skills from the skills record' },
  { titleAr: 'تحليل سوق العمل', titleEn: 'Labor Market Analysis', descAr: 'مقارنة مهاراتك بمتطلبات سوق العمل السعودي', descEn: 'Compare your skills against Saudi labor market demands' },
  { titleAr: 'خطة التطوير', titleEn: 'Development Plan', descAr: 'اقتراحات دورات ووظائف مخصصة لسد الفجوات', descEn: 'Personalized course & job suggestions to close gaps' },
];

function FlowPopup({ open, onClose, onContinue, t }: { open: boolean; onClose: () => void; onContinue: () => void; t: (a: string, e: string) => string }) {
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!open) {
      setRunning(false);
      setActiveStep(-1);
    }
  }, [open]);

  useEffect(() => {
    if (!running) return;
    if (activeStep >= FLOW_STEPS.length) {
      const done = setTimeout(() => onContinue(), 250);
      return () => clearTimeout(done);
    }
    const next = setTimeout(() => setActiveStep(s => s + 1), 650);
    return () => clearTimeout(next);
  }, [running, activeStep, onContinue]);

  const handleStart = () => {
    setRunning(true);
    setActiveStep(0);
  };

  const handleClose = () => {
    if (running) return;
    onClose();
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={handleClose}>
      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6" onClick={e => e.stopPropagation()}>
        {!running && (
          <button onClick={onClose} className="absolute top-4 end-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X className="w-5 h-5" />
          </button>
        )}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-sa-100 dark:bg-sa-900/40 text-sa-600 dark:text-sa-400 flex items-center justify-center mx-auto mb-3">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {running
              ? t('جارٍ تحضير سجلك...', 'Preparing your record…')
              : t('سجلك الرقمي الكامل', 'Your Full Digital Record')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {running
              ? t('لحظات قليلة، نقوم بتجهيز التحليل', 'Just a moment — assembling your analysis')
              : t('سيتم تحليل بياناتك عبر ثلاث مراحل', 'Your data will be analyzed in three stages')}
          </p>
        </div>
        <div className="space-y-4 mb-6">
          {FLOW_STEPS.map((step, i) => {
            const isDone = running && i < activeStep;
            const isActive = running && i === activeStep;
            return (
              <div
                key={i}
                className={`flex items-start gap-3 transition-opacity ${running && i > activeStep ? 'opacity-40' : 'opacity-100'}`}
              >
                <div
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    isDone
                      ? 'bg-sa-600 text-white'
                      : isActive
                        ? 'bg-sa-500 text-white ring-4 ring-sa-200 dark:ring-sa-900/60'
                        : 'bg-sa-500 text-white'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : isActive ? <Loader2 className="w-4 h-4 animate-spin" /> : i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{t(step.titleAr, step.titleEn)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t(step.descAr, step.descEn)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleStart}
          disabled={running}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-sa-600 hover:bg-sa-700 disabled:bg-sa-500 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors"
        >
          {running && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>
            {running
              ? t('جارٍ التحويل...', 'Redirecting…')
              : t('متابعة إلى السجل الرقمي', 'Continue to Digital Record')}
          </span>
          {!running && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

interface CurrentCourse {
  course_code?: string;
  course_name?: string;
  external_id?: string;
  bb_course_id?: string;
  instructor_name?: string;
  section_seq?: string;
}

interface ContentItem {
  id?: string;
  title?: string;
  type?: string;
  body?: string | null;
  position?: number;
  contentHandler?: { id?: string; file?: { fileName?: string; mimeType?: string } };
  children?: ContentItem[] | null;
}

interface TransactionCourse {
  course_no?: string;
  course_code?: string;
  course_name?: string;
  course_name_s?: string | null;
  letter_grade?: string;
  letter_grade_s?: string;
  crd_hrs?: string;
  quality_points?: string;
  status_code?: string;
}

interface Semester {
  semester?: string;
  semester_gpa?: string | number;
  total_credit_hours?: number;
  courses?: TransactionCourse[];
}

const flattenContent = (items: ContentItem[] | null | undefined): ContentItem[] => {
  if (!items) return [];
  const out: ContentItem[] = [];
  for (const it of items) {
    out.push(it);
    if (it.children && it.children.length > 0) out.push(...flattenContent(it.children));
  }
  return out;
};

const classifySlide = (item: ContentItem): 'slide' | 'exam' | 'assignment' | 'other' => {
  const title = (item.title || '').toLowerCase();
  if (/(slide|عرض|شرائح|محاضرة|lecture|chapter|الفصل|الباب)/i.test(title)) return 'slide';
  if (/(اختبار|كويز|quiz|test|exam|نصفي|midterm|final|نهائي)/i.test(title)) return 'exam';
  if (/(واجب|assignment|hw|homework)/i.test(title)) return 'assignment';
  return 'other';
};

/** Detect courses with low historical grades (D / F / هـ / د) — these become
 *  agent-recommended candidates for QSpark remediation. */
function findLowGradeCourses(semesters: Semester[]): TransactionCourse[] {
  const out: TransactionCourse[] = [];
  const seen = new Set<string>();
  for (const sem of semesters) {
    for (const c of sem.courses ?? []) {
      const letter = (c.letter_grade_s || c.letter_grade || '').toUpperCase().trim();
      const isLow = letter.startsWith('D') || letter.startsWith('F') || letter.includes('هـ') || letter.startsWith('د');
      const key = c.course_code || c.course_no || c.course_name || '';
      if (isLow && key && !seen.has(key)) {
        seen.add(key);
        out.push(c);
      }
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────
// Tab 1: Academic Advisor (existing services grid)
// ─────────────────────────────────────────────────────────────────────────

function AcademicAdvisorTab({ t }: { t: (a: string, e: string) => string }) {
  const { role } = useRole();
  const visibleServices = services.filter(s => canAccess(role, s.path));

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-bl from-sa-600 via-sa-700 to-sa-900 p-8 sm:p-10 text-white">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute -top-24 -start-24 h-72 w-72 rounded-full bg-white" />
          <div className="absolute -bottom-20 -end-20 h-56 w-56 rounded-full bg-white" />
          <div className="absolute top-1/2 start-1/3 h-40 w-40 rounded-full bg-white" />
        </div>
        <div className="relative max-w-2xl">
          <p className="text-label text-sa-200 mb-2">
            {t('جامعة القصيم', 'Qassim University')}
          </p>
          <h1 className="text-display text-white">
            {t('مرحباً بك في QMentor', 'Welcome to QMentor')}
          </h1>
          <p className="mt-3 text-sa-200 text-base leading-relaxed">
            {t(
              'منصة الإرشاد الأكاديمي الذكي — تحليلات متقدمة وأدوات ذكية لدعم نجاح الطلاب',
              'Smart Academic Mentoring Platform — Advanced analytics and AI tools for student success'
            )}
          </p>
        </div>
      </div>

      <section>
        <h2 className="text-label text-gray-400 dark:text-gray-500 mb-4">
          {t('الخدمات', 'Services')}
        </h2>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleServices.map(service => {
            const Icon = service.icon;
            return (
              <StaggerItem key={service.path}>
                <Link
                  to={service.path}
                  className={`group relative block h-full rounded-2xl border-t-[3px] ${service.accent} border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`inline-flex rounded-xl p-2.5 ${service.iconBg}`}>
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-sa-500 transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {t(service.titleAr, service.titleEn)}
                  </h3>
                  <p className="text-caption mt-0.5">
                    {t(service.titleEn, service.titleAr)}
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                    {t(service.descriptionAr, service.descriptionEn)}
                  </p>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Tab 2: Digital Record (سجلك الرقمي)
// ─────────────────────────────────────────────────────────────────────────

interface ProfileShape {
  profile?: {
    name?: string;
    student_id?: string;
    academic?: {
      cumulative_gpa?: number | string;
      last_recorded_gpa?: number | string;
      total_earned_hours?: number;
      total_plan_hours?: number;
    };
    major?: { name?: string; name_en?: string };
    faculty?: { name?: string; name_en?: string };
  };
}

function DigitalRecordTab({ t }: { t: (a: string, e: string) => string }) {
  const profileResult = useStudentProfile<ProfileShape | null>(null);
  const transactionsResult = useAcademicTransactions<Semester[] | null>(null);
  const digitalRecordUrl = getDigitalRecordUrl();
  const [showFlowPopup, setShowFlowPopup] = useState(false);

  const profile = profileResult.data?.profile ?? null;
  const academic = profile?.academic ?? null;
  const cumulativeGpa = academic
    ? parseFloat(String(academic.last_recorded_gpa ?? academic.cumulative_gpa ?? '0'))
    : 0;
  const earnedHours = Number(academic?.total_earned_hours ?? 0);
  const planHours = Number(academic?.total_plan_hours ?? 0);
  const progressPct = planHours > 0 ? Math.min(100, Math.round((earnedHours / planHours) * 100)) : 0;

  const semesters = useMemo<Semester[]>(() => {
    if (transactionsResult.source !== 'api' || !Array.isArray(transactionsResult.data)) return [];
    return transactionsResult.data;
  }, [transactionsResult.source, transactionsResult.data]);

  const completedCourses = semesters.reduce((sum, s) => sum + (s.courses?.length ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Flow Popup */}
      <FlowPopup
        open={showFlowPopup}
        onClose={() => setShowFlowPopup(false)}
        onContinue={() => { setShowFlowPopup(false); window.location.href = digitalRecordUrl; }}
        t={t}
      />

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-bl from-emerald-600 via-sa-700 to-sa-900 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-12 -end-12 w-56 h-56 rounded-full bg-white/5" />
        <div className="absolute bottom-0 start-1/3 w-40 h-40 rounded-full bg-white/5" />
        <div className="relative flex items-start gap-4">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-sa-200">
              {t('سجلك الرقمي', 'Digital Record')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-0.5">
              {profile?.name || t('طالب جامعة القصيم', 'Qassim University Student')}
            </h2>
            <p className="text-sm text-sa-100/90 mt-1 leading-relaxed">
              {t(
                'سجل ذكي يربط مهاراتك وإنجازاتك واحتياجات سوق العمل، مع تحليل الفجوات ومقترحات التطوير.',
                'A smart record linking your skills and achievements with labor-market needs, with gap analysis and growth suggestions.'
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('المعدل التراكمي', 'Cumulative GPA')}</p>
          <p className="text-2xl font-extrabold text-sa-600 dark:text-sa-400 mt-1">
            {cumulativeGpa > 0 ? cumulativeGpa.toFixed(2) : '—'}
            <span className="text-sm text-gray-400 dark:text-gray-500 font-normal"> / 5.00</span>
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('الساعات المكتسبة', 'Earned Hours')}</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {earnedHours || '—'}
            {planHours > 0 && (
              <span className="text-sm text-gray-400 dark:text-gray-500 font-normal"> / {planHours}</span>
            )}
          </p>
          {planHours > 0 && (
            <div className="mt-2 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
              <div className="h-full bg-sa-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('فصول مكتملة', 'Completed Semesters')}</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{semesters.length || '—'}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('مقررات مجتازة', 'Completed Courses')}</p>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{completedCourses || '—'}</p>
        </div>
      </div>

      {/* Major / faculty */}
      {(profile?.major?.name || profile?.faculty?.name) && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-sa-600 dark:text-sa-400" />
            {t('المسار الأكاديمي', 'Academic Track')}
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {profile?.faculty?.name && (
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">{t('الكلية', 'Faculty')}</dt>
                <dd className="font-medium text-gray-900 dark:text-white mt-0.5">{profile.faculty.name}</dd>
              </div>
            )}
            {profile?.major?.name && (
              <div>
                <dt className="text-xs text-gray-500 dark:text-gray-400">{t('التخصص', 'Major')}</dt>
                <dd className="font-medium text-gray-900 dark:text-white mt-0.5">{profile.major.name}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* Open full record — now opens flow popup */}
      <button
        onClick={() => setShowFlowPopup(true)}
        className="w-full flex items-center justify-between rounded-2xl border-2 border-sa-500 bg-sa-50 dark:bg-sa-950/30 p-5 hover:bg-sa-100 dark:hover:bg-sa-900/40 transition-colors group text-start"
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl bg-sa-500 text-white flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-sa-800 dark:text-sa-200">
              {t('افتح سجلك الرقمي الكامل', 'Open the full Digital Record')}
            </p>
            <p className="text-xs text-sa-700/80 dark:text-sa-300/80 mt-0.5">
              {t(
                'تحليل المهارات، فجوات سوق العمل، ومقترحات التطوير المخصصة لك.',
                'Skills analysis, labor-market gaps, and personalized development suggestions.'
              )}
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-sa-700 dark:text-sa-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Tab 3: Learning Platform (منصة التعلم والتجربة الأكاديمية)
// ─────────────────────────────────────────────────────────────────────────

function CourseSlidesPanel({ courseId, t }: { courseId: string; t: (a: string, e: string) => string }) {
  const { source, data, isLoading } = useCourseContent<ContentItem[] | null>(courseId, null);
  const flattened = useMemo(() => flattenContent(Array.isArray(data) ? data : []), [data]);
  const slides = useMemo(() => flattened.filter(i => classifySlide(i) === 'slide'), [flattened]);

  if (isLoading) {
    return <p className="text-xs text-gray-400 dark:text-gray-500 py-2">{t('جاري تحميل الشرائح...', 'Loading slides…')}</p>;
  }
  if (source !== 'api' || flattened.length === 0) {
    return <p className="text-xs text-gray-400 dark:text-gray-500 py-2">{t('لا توجد مواد تعليمية متاحة من Blackboard', 'No Blackboard materials available')}</p>;
  }

  const display = slides.length > 0 ? slides : flattened.slice(0, 12);
  const heading = slides.length > 0 ? t('شرائح ومحاضرات', 'Slides & Lectures') : t('مواد المقرر', 'Course Materials');

  return (
    <div className="space-y-2 mt-3">
      <h4 className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
        <BookOpen className="w-3.5 h-3.5" />
        {heading}
        <span className="text-gray-400 dark:text-gray-500 font-normal">· {display.length}</span>
      </h4>
      <ul className="space-y-1.5 ms-5">
        {display.slice(0, 10).map((item, i) => (
          <li key={item.id ?? `slide-${i}`} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span className="shrink-0 mt-1 w-1 h-1 rounded-full bg-sa-400" />
            <span className="break-words">{item.title || t('بدون عنوان', 'Untitled')}</span>
          </li>
        ))}
        {display.length > 10 && (
          <li className="text-xs text-gray-400 dark:text-gray-500 ms-3">
            + {display.length - 10} {t('أخرى', 'more')}
          </li>
        )}
      </ul>
    </div>
  );
}

function LearningPlatformTab({ t }: { t: (a: string, e: string) => string }) {
  const coursesResult = useCurrentCourses<CurrentCourse[] | null>(null);
  const transactionsResult = useAcademicTransactions<Semester[] | null>(null);

  const [openCourse, setOpenCourse] = useState<string | null>(null);

  const currentCourses = useMemo<CurrentCourse[]>(() => {
    if (coursesResult.source !== 'api' || !Array.isArray(coursesResult.data)) return [];
    return coursesResult.data;
  }, [coursesResult.source, coursesResult.data]);

  const lowGradeCourses = useMemo<TransactionCourse[]>(() => {
    if (transactionsResult.source !== 'api' || !Array.isArray(transactionsResult.data)) return [];
    return findLowGradeCourses(transactionsResult.data);
  }, [transactionsResult.source, transactionsResult.data]);

  // Set of course codes with low grades for quick lookup
  const lowGradeCodeSet = useMemo(() => {
    const s = new Set<string>();
    for (const c of lowGradeCourses) {
      const code = (c.course_code || c.course_no || '').trim();
      if (code) s.add(code);
    }
    return s;
  }, [lowGradeCourses]);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-bl from-sa-700 via-sa-800 to-emerald-900 p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute -top-12 -end-12 w-56 h-56 rounded-full bg-white/5" />
        <div className="relative flex items-start gap-4">
          <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs uppercase tracking-wide text-sa-200">
              {t('منصة التعلم والتجربة الأكاديمية', 'Learning & Academic Experience Platform')}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold mt-0.5">
              {t('شرائح Blackboard وتوصيات QSpark الذكية', 'Blackboard Slides & Smart QSpark Recommendations')}
            </h2>
            <p className="text-sm text-sa-100/90 mt-1 leading-relaxed">
              {t(
                'شرائح ومحاضرات مقرراتك الحالية من Blackboard، مع توصيات تلقائية من المرشد الذكي للمقررات التي حصلت فيها على درجات منخفضة لإعادة التعلم عبر QSpark.',
                "Slides and lectures from your current Blackboard courses, with smart recommendations from the AI advisor to re-learn low-grade courses on QSpark."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Agent recommendation banner — auto-detected low grades → QSpark */}
      {lowGradeCourses.length > 0 && (
        <section className="rounded-2xl border-2 border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/30 p-5">
          <header className="flex items-start gap-3 mb-3">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                {t('توصية المرشد الذكي', 'Smart Advisor Recommendation')}
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-white">
                  AGENT
                </span>
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-1 leading-relaxed">
                {t(
                  'رصد المرشد الذكي مقررات بدرجات منخفضة (D / F). مُعتمد لك إعادة دراستها بشكل تفاعلي عبر QSpark لتعويض الفجوة قبل الاختبار التالي.',
                  'The AI advisor detected courses with low grades (D / F). You are assigned to re-take them interactively on QSpark to close the gap before the next exam.'
                )}
              </p>
            </div>
          </header>

          <ul className="space-y-2">
            {lowGradeCourses.map(c => {
              const code = c.course_code || c.course_no || '';
              const name = c.course_name || c.course_name_s || code;
              const letter = (c.letter_grade_s || c.letter_grade || '').toUpperCase();
              return (
                <li
                  key={code || name}
                  className="flex items-center justify-between gap-3 rounded-xl bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800/60 p-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span className="font-mono">{code}</span>
                        {letter && (
                          <>
                            {' · '}
                            <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-bold">
                              {letter}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  <a
                    href={buildQsparkCourseLink(code)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sa-600 hover:bg-sa-700 text-white text-xs font-bold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {t('العبه على QSpark', 'Play on QSpark')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Current courses + Blackboard slides */}
      <section>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {t('مقرراتك الحالية على Blackboard', 'Your Current Blackboard Courses')}
        </h3>

        {coursesResult.isLoading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('جاري تحميل المقررات...', 'Loading courses…')}</p>
        )}

        {!coursesResult.isLoading && currentCourses.length === 0 && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('لا توجد مقررات في الفصل الحالي على Blackboard.', 'No current-semester courses on Blackboard.')}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {currentCourses.map((course, idx) => {
            const courseId = course.bb_course_id || course.external_id || '';
            const isOpen = openCourse === courseId;
            const courseCode = course.course_code || '';
            const isLowGrade = lowGradeCodeSet.has(courseCode);
            // QSpark resolves /courses/{id} by array index + 1 of the same
            // /api/v2/student/courses payload — keep ordering in sync.
            const qsparkId = idx + 1;
            return (
              <article key={courseId || course.course_code} className={`rounded-2xl border ${isLowGrade ? 'border-amber-300 dark:border-amber-700/60' : 'border-gray-200 dark:border-gray-700'} bg-white dark:bg-gray-800 overflow-hidden`}>
                <div className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors">
                  <button
                    onClick={() => setOpenCourse(isOpen ? null : courseId)}
                    disabled={!courseId}
                    className="flex items-start gap-3 min-w-0 flex-1 text-start disabled:cursor-default"
                  >
                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${isLowGrade ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' : 'bg-sa-100 dark:bg-sa-900/40 text-sa-700 dark:text-sa-400'}`}>
                      {isLowGrade ? <AlertTriangle className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {course.course_name}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        <span className="font-mono">{courseCode}</span>
                        {course.instructor_name && <> · {course.instructor_name}</>}
                        {course.section_seq && <> · {t('شعبة', 'Section')} {course.section_seq}</>}
                        {isLowGrade && (
                          <span className="ms-1.5 px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                            {t('درجة منخفضة', 'Low Grade')}
                          </span>
                        )}
                      </p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={buildQsparkCourseLink(qsparkId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${isLowGrade
                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                        : 'bg-sa-600 hover:bg-sa-700 text-white'}`}
                      title={t('افتح المقرر في QSpark', 'Open course in QSpark')}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span className="hidden sm:inline">{t('ادرسه على QSpark', 'Study on QSpark')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {courseId && (
                      <button
                        onClick={() => setOpenCourse(isOpen ? null : courseId)}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        aria-label={isOpen ? t('إخفاء الشرائح', 'Hide slides') : t('عرض الشرائح', 'Show slides')}
                      >
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                {isOpen && courseId && (
                  <div className="px-5 pb-4 border-t border-gray-100 dark:border-gray-700/50">
                    <CourseSlidesPanel courseId={courseId} t={t} />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Main Dashboard with QSpark+ tabs
// ─────────────────────────────────────────────────────────────────────────

type TabKey = 'advisor' | 'digital-record' | 'learning';

export default function Dashboard() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const initialTab = (() => {
    const param = searchParams.get('tab');
    if (param === 'advisor' || param === 'digital-record' || param === 'learning') return param;
    return 'advisor' as TabKey;
  })();
  const isSolo = searchParams.get('solo') === '1';
  const isQSparkBrand = typeof window !== 'undefined'
    && window.location.pathname.startsWith('/qspark-plus')
    && !isSolo;
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const tabs: { key: TabKey; labelAr: string; labelEn: string; icon: LucideIcon }[] = [
    { key: 'advisor',        labelAr: 'المرشد الأكاديمي',                   labelEn: 'Academic Advisor',         icon: UserCheck },
    { key: 'digital-record', labelAr: 'سجلك الرقمي',                         labelEn: 'Digital Record',           icon: Award },
    { key: 'learning',       labelAr: 'منصة التعلم والتجربة الأكاديمية',     labelEn: 'Learning Platform',        icon: BookOpen },
  ];

  return (
    <div className="space-y-6">
      {isQSparkBrand && (
        <div className="rounded-2xl bg-gradient-to-br from-sa-600 to-sa-800 p-5 sm:p-6 text-white shadow-md">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-extrabold">
              <sup className="text-sm">+</sup>Q
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wide opacity-90">{t('المنظومة الأكاديمية', 'Academic System')}</p>
              <h1 className="text-xl sm:text-2xl font-extrabold leading-tight">+QSpark</h1>
              <p className="text-sm opacity-90 mt-1">
                {t('منظومة متكاملة تجمع المرشد الأكاديمي وسجلك الرقمي ومنصة التعلم.', 'Integrated suite combining Academic Advisor, Digital Record, and Learning Platform.')}
              </p>
            </div>
          </div>
        </div>
      )}
      {!isSolo && (
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex overflow-x-auto gap-2 sm:gap-6 scrollbar-hide -mb-px">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 py-3 px-2 sm:px-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? 'border-sa-500 text-sa-700 dark:text-sa-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {t(tab.labelAr, tab.labelEn)}
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {activeTab === 'advisor' && <AcademicAdvisorTab t={t} />}
      {activeTab === 'digital-record' && <DigitalRecordTab t={t} />}
      {activeTab === 'learning' && <LearningPlatformTab t={t} />}
    </div>
  );
}
