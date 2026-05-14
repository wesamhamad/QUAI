import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import { useAdvisorInfo } from '../../hooks/useStudentData';
import {
  User,
  Mail,
  Video,
  MapPin,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Interaction {
  id: string;
  dateEn: string;
  dateAr: string;
  typeAr: string;
  typeEn: string;
  summaryAr: string;
  summaryEn: string;
  icon: 'video' | 'email' | 'chat';
}

interface AdvisorData {
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  departmentAr: string;
  departmentEn: string;
  officeAr: string;
  officeEn: string;
  officeHoursAr: string;
  officeHoursEn: string;
  email: string;
  initials: string;
}

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */

const mockAdvisor: AdvisorData = {
  nameAr: 'د. محمد ناصر',
  nameEn: 'Dr. Mohammed Nasser',
  titleAr: 'أستاذ مشارك',
  titleEn: 'Associate Professor',
  departmentAr: 'قسم علوم الحاسب',
  departmentEn: 'Computer Science Dept.',
  officeAr: 'مبنى 6، غرفة 215',
  officeEn: 'Building 6, Room 215',
  officeHoursAr: 'أحد / ثلاثاء 10:00 - 12:00',
  officeHoursEn: 'Sun / Tue 10:00 – 12:00',
  email: 'm.alharbi@qu.edu.sa',
  initials: 'MA',
};

const mockInteractions: Interaction[] = [
  {
    id: '1',
    dateEn: 'Apr 14, 2026',
    dateAr: '١٤ أبريل ٢٠٢٦',
    typeAr: 'اجتماع Teams',
    typeEn: 'Teams Meeting',
    summaryAr: 'مناقشة الخطة الدراسية للفصل القادم وتحديد المقررات المطلوبة.',
    summaryEn: 'Discussed next semester study plan and identified required courses.',
    icon: 'video',
  },
  {
    id: '2',
    dateEn: 'Apr 7, 2026',
    dateAr: '٧ أبريل ٢٠٢٦',
    typeAr: 'بريد إلكتروني',
    typeEn: 'Email',
    summaryAr: 'استفسار حول إمكانية تأجيل مقرر هياكل البيانات.',
    summaryEn: 'Inquiry about deferring the Data Structures course.',
    icon: 'email',
  },
  {
    id: '3',
    dateEn: 'Mar 28, 2026',
    dateAr: '٢٨ مارس ٢٠٢٦',
    typeAr: 'محادثة QMentor',
    typeEn: 'QMentor Chat',
    summaryAr: 'طلب توصية أكاديمية لبرنامج التدريب الصيفي.',
    summaryEn: 'Requested academic recommendation for summer internship program.',
    icon: 'chat',
  },
];

/* ------------------------------------------------------------------ */
/*  Helper: interaction icon                                           */
/* ------------------------------------------------------------------ */

function InteractionIcon({ type }: { type: Interaction['icon'] }) {
  const cls = 'w-4 h-4';
  switch (type) {
    case 'video':
      return <Video className={cls} />;
    case 'email':
      return <Mail className={cls} />;
    case 'chat':
      return <MessageSquare className={cls} />;
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ContactAdvisor() {
  const { t } = useLanguage();
  const { data: advisor } = useAdvisorInfo(mockAdvisor);

  return (
    <div>
      {/* Header */}
      <PageHeader
        title={t('تواصل مع مرشدي الأكاديمي', 'Contact My Advisor')}
        subtitle={t(
          'تواصل مع مرشدك الأكاديمي عبر القنوات المتاحة وتابع مواعيدك',
          'Reach out to your academic advisor via available channels and view your meetings'
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('تواصل مع مرشدي الأكاديمي', 'Contact My Advisor') },
        ]}
        accentColor="bg-sa-500"
      />

      {/* ---- Advisor Card ---- */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-sa-500 flex items-center justify-center text-white text-2xl font-bold shrink-0 select-none">
            {advisor.initials}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-start">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t(advisor.nameAr, advisor.nameEn)}
            </h2>
            <p className="text-sm text-sa-600 dark:text-sa-400 mt-0.5">
              {t(advisor.titleAr, advisor.titleEn)} &mdash; {t(advisor.departmentAr, advisor.departmentEn)}
            </p>

            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4 text-sm text-gray-600 dark:text-gray-300">
              {/* Office */}
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sa-500" />
                {t(advisor.officeAr, advisor.officeEn)}
              </span>
              {/* Office hours */}
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sa-50 dark:bg-sa-900/30 px-3 py-0.5 text-sa-700 dark:text-sa-300 text-xs font-medium">
                <Clock className="w-3.5 h-3.5" />
                {t(advisor.officeHoursAr, advisor.officeHoursEn)}
              </span>
              {/* Email */}
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-sa-500" />
                <a
                  href={`mailto:${advisor.email}`}
                  className="hover:text-sa-600 dark:hover:text-sa-400 transition-colors underline underline-offset-2"
                >
                  {advisor.email}
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Contact Methods ---- */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('طرق التواصل', 'Contact Methods')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {/* Teams Meeting */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-4">
            <Video className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {t('اجتماعات Teams', 'Teams Meetings')}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            {t(
              'عرض مواعيد اجتماعات Microsoft Teams مع مرشدك الأكاديمي.',
              'View your Microsoft Teams meetings with your academic advisor.'
            )}
          </p>
          <a
            href="#schedule"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('schedule-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-auto inline-flex items-center gap-2 rounded-lg bg-sa-600 hover:bg-sa-700 text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            <Calendar className="w-4 h-4" />
            {t('عرض مواعيدي', 'View My Meetings')}
          </a>
        </div>

        {/* Email */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {t('بريد إلكتروني', 'Send Email')}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            {t(
              'أرسل رسالة بريد إلكتروني مباشرة إلى مرشدك الأكاديمي.',
              'Send a direct email to your academic advisor.'
            )}
          </p>
          <a
            href={`mailto:${advisor.email}`}
            className="mt-auto inline-flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            {t('إرسال بريد', 'Compose Email')}
          </a>
        </div>

        {/* QMentor Chat */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
            {t('محادثة QMentor', 'Chat via QMentor')}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
            {t(
              'تحدث مع مرشدك عبر المحادثة الذكية في QMentor.',
              'Chat with your advisor through QMentor intelligent chat.'
            )}
          </p>
          <a
            href="/chatbot"
            className="mt-auto inline-flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            {t('بدء محادثة', 'Start Chat')}
          </a>
        </div>
      </div>

      {/* ---- Teams Meetings ---- */}
      <div id="schedule-section" className="mb-10">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('مواعيد اجتماعات Teams', 'Teams Meetings')}
        </h3>

        {/* Auto-scheduled meeting card */}
        <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/40 dark:to-gray-800 p-6 shadow-sm">
          {/* Agent badge */}
          <div className="flex items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
              </svg>
              {t('تمت الجدولة تلقائياً بواسطة QMentor Agent', 'Auto-scheduled by QMentor Agent')}
            </span>
          </div>

          {/* Meeting details */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Left: Meeting info */}
            <div className="flex-1">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                {t('جلسة إرشاد أكاديمي', 'Academic Advising Session')}
              </h4>

              <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>{t(advisor.nameAr, advisor.nameEn)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{t('الثلاثاء، ٢٢ أبريل ٢٠٢٦', 'Tuesday, April 22, 2026')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{t('١٠:٠٠ - ١٠:٣٠ صباحاً', '10:00 – 10:30 AM')}</span>
                </div>
              </div>

              {/* Reason */}
              <div className="mt-4 rounded-lg bg-white/60 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">
                  {t('سبب الجلسة', 'Session Reason')}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t(
                    'مراجعة الأداء الأكاديمي ومناقشة خطة التحسين بناءً على تحليل المخاطر.',
                    'Review academic performance and discuss improvement plan based on risk analysis.'
                  )}
                </p>
              </div>
            </div>

            {/* Right: Status & Join */}
            <div className="flex flex-col items-center justify-center gap-3 sm:min-w-[180px]">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-semibold">{t('تم الحضور', 'Attended')}</span>
              </div>

              {/* Teams Join Button (disabled) */}
              <button
                disabled
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#5B5FC7] text-white px-5 py-2.5 text-sm font-medium opacity-60 cursor-not-allowed"
                title={t('سيتم تفعيل الرابط قبل موعد الاجتماع', 'Link will be active before the meeting')}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.821 6.116l-3.963 2.385V6.168A1.169 1.169 0 0014.689 5H5.169A1.169 1.169 0 004 6.168v8.664A1.169 1.169 0 005.169 16h9.52a1.169 1.169 0 001.169-1.168v-2.333l3.963 2.385A.585.585 0 0020.7 14.4V6.6a.585.585 0 00-.879-.484z" />
                </svg>
                {t('انضمام عبر Teams', 'Join via Teams')}
              </button>

              <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center leading-tight">
                {t(
                  'سيتم تفعيل الرابط قبل موعد الاجتماع',
                  'Link will be active before the meeting'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Recent Interactions ---- */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t('آخر التواصلات', 'Recent Interactions')}
      </h3>

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm divide-y divide-gray-100 dark:divide-gray-700">
        {mockInteractions.map((item) => (
          <div key={item.id} className="p-4 sm:p-5 flex items-start gap-4">
            <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
              <InteractionIcon type={item.icon} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {t(item.typeAr, item.typeEn)}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {t(item.dateAr, item.dateEn)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {t(item.summaryAr, item.summaryEn)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
