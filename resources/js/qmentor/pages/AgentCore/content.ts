import type { LucideIcon } from 'lucide-react';
import {
  Database, BookOpen, ShieldAlert, CalendarX, Activity, CalendarDays, Award, Zap, Layers,
  BellRing, CalendarCheck, Route, ChartBar, HeartPulse, MessageSquare,
  UserCheck, Lock, Eye, ScrollText,
} from 'lucide-react';

/** Icon per ring system id — the API names the system, the page draws it. */
export const sourceIcons: Record<string, LucideIcon> = {
  sis: Database,
  plan: BookOpen,
  standing: ShieldAlert,
  absences: CalendarX,
  prediction: Activity,
  timetable: CalendarDays,
  digital_record: Award,
  qspark: Zap,
  capacity: Layers,
};

/**
 * What the agent does with what it read — each one is a page in QMentor, so
 * the claim "it decides" is a link the visitor can open, not a sentence.
 */
export interface AgentOutput {
  icon: LucideIcon;
  titleAr: string;
  titleEn: string;
  whenAr: string;
  whenEn: string;
  /** Route inside the SPA; the role filter decides which to show. */
  path: string;
  /** Student-facing alternative, used when the advisor path is out of role. */
  studentPath?: string;
}

export const outputs: AgentOutput[] = [
  {
    icon: BellRing,
    titleAr: 'تنبيه مبكر',
    titleEn: 'Early alert',
    whenAr: 'حين تتحقق إشارة — معدل هابط، غياب يقارب الحرمان، رسوب متكرر — يصل التنبيه للطالب ومرشده قبل أن يصبح نتيجة.',
    whenEn: 'When a signal fires — a falling GPA, absences near the denial line, repeated failure — the alert reaches student and advisor before it becomes a result.',
    path: '/alerts',
    studentPath: '/student-dashboard',
  },
  {
    icon: CalendarCheck,
    titleAr: 'موعد استباقي مع المرشد',
    titleEn: 'Proactive advising appointment',
    whenAr: 'يطابق فراغات الطالب والمرشد من الجدول ويحجز اللقاء بنفسه، دون أن يطلبه أحد.',
    whenEn: 'Matches free slots from both timetables and books the meeting itself, before anyone asks.',
    path: '/advisor-dashboard',
    studentPath: '/contact-advisor',
  },
  {
    icon: Route,
    titleAr: 'خطة دراسية مخصّصة',
    titleEn: 'Personalised study plan',
    whenAr: 'يعيد ترتيب المقررات على ضوء الخطة والمتطلبات والسعة المتاحة، لا قالباً واحداً للجميع.',
    whenEn: 'Re-sequences courses against the plan, prerequisites and available capacity — not one template for all.',
    path: '/study-plan',
  },
  {
    icon: ChartBar,
    titleAr: 'تحليل المخاطر والتنبؤ',
    titleEn: 'Risk analysis & prediction',
    whenAr: 'يحوّل الإشارات إلى درجة مخاطر مفسَّرة: ما الذي رفعها، وما الذي يخفضها.',
    whenEn: 'Turns signals into an explained risk score: what raised it, and what would lower it.',
    path: '/risk-analytics',
    studentPath: '/indicator-detail',
  },
  {
    icon: HeartPulse,
    titleAr: 'برنامج التعافي',
    titleEn: 'Recovery programme',
    whenAr: 'للطالب المتعثّر أصلاً: مسار تعافٍ بمحطات قابلة للقياس ومتابعة حتى تنغلق الإشارة.',
    whenEn: 'For the student already struggling: a recovery track with measurable milestones, followed until the signal closes.',
    path: '/advisor-dashboard',
    studentPath: '/action-plan',
  },
  {
    icon: MessageSquare,
    titleAr: 'إجابة مبنية على السجل',
    titleEn: 'Record-grounded answers',
    whenAr: 'المحادثة الذكية تجيب من سجل الطالب الفعلي لا من نصّ عام.',
    whenEn: 'The chatbot answers from the student’s actual record, not generic text.',
    path: '/chatbot',
  },
];

export interface GovernanceItem {
  icon: LucideIcon;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
}

/** The rails the agent runs on — what a governance visitor asks first. */
export const governance: GovernanceItem[] = [
  {
    icon: UserCheck,
    titleAr: 'إنسان في الحلقة',
    titleEn: 'Human in the loop',
    bodyAr: 'الوكيل يرصد ويقترح ويحجز؛ المرشد البشري يعتمد ويقرّر ما يمسّ مسار الطالب.',
    bodyEn: 'The agent detects, proposes and books; the human advisor approves anything that touches the student’s path.',
  },
  {
    icon: Lock,
    titleAr: 'نطاق البيانات',
    titleEn: 'Scoped data',
    bodyAr: 'لا يرى المرشد إلا من أُسند إليه — القائمة الإرشادية تُفرض في المصدر (SIS) عند كل استدعاء، لا في الواجهة.',
    bodyEn: 'An advisor sees only assigned students — the advisory list is enforced at the source (SIS) on every call, not in the UI.',
  },
  {
    icon: Eye,
    titleAr: 'قابلية التفسير',
    titleEn: 'Explainability',
    bodyAr: 'كل إشارة تحمل سببها وعتبتها ومصدرها، وكل مؤشر يُعرض مع المعادلة التي أنتجته.',
    bodyEn: 'Every signal carries its reason, threshold and source; every KPI is shown with the formula that produced it.',
  },
  {
    icon: ScrollText,
    titleAr: 'أخلاقيات الذكاء الاصطناعي',
    titleEn: 'AI ethics',
    bodyAr: 'يعمل ضمن سياسة سدايا لأخلاقيات الذكاء الاصطناعي، ولا تُؤخذ قرارات آلية نهائية بلا مراجعة.',
    bodyEn: 'Operates under the SDAIA AI-ethics policy; no final automated decision is taken without review.',
  },
];
