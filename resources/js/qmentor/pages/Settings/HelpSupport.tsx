import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { FAQItem } from './types';
import {
  ChevronDownIcon,
  EnvelopeIcon,
  PlayCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const faqItems: FAQItem[] = [
  { id: '1', questionAr: 'كيف أقوم بتغيير كلمة المرور؟', questionEn: 'How do I change my password?', answerAr: 'يمكنك تغيير كلمة المرور من خلال بوابة MyQU. اذهب إلى الإعدادات ثم الأمان واختر تغيير كلمة المرور.', answerEn: 'You can change your password through the MyQU portal. Go to Settings, then Security, and choose Change Password.' },
  { id: '2', questionAr: 'كيف أتواصل مع المرشد الأكاديمي؟', questionEn: 'How do I contact my academic advisor?', answerAr: 'استخدم ميزة المحادثة الذكية من القائمة الجانبية، أو اذهب إلى لوحة المرشد لمعرفة معلومات التواصل.', answerEn: 'Use the Advising Chatbot from the sidebar, or go to the Advisor Dashboard for contact information.' },
  { id: '3', questionAr: 'ما هو التوأم الرقمي؟', questionEn: 'What is the Digital Twin?', answerAr: 'التوأم الرقمي هو نموذج ذكي يعكس حالتك الأكاديمية ويقدم توصيات مخصصة بناءً على أدائك ومسارك الدراسي.', answerEn: 'The Digital Twin is an intelligent model that reflects your academic state and provides personalized recommendations based on your performance and academic path.' },
  { id: '4', questionAr: 'كيف أستخدم الخطة الدراسية الذكية؟', questionEn: 'How do I use the Smart Study Plan?', answerAr: 'اذهب إلى صفحة الخطة الدراسية من القائمة، أدخل بياناتك الأكاديمية وستحصل على خطة مخصصة تراعي تفضيلاتك ومتطلبات تخصصك.', answerEn: 'Navigate to the Study Plan page from the sidebar. Enter your academic info and you will get a personalized plan that considers your preferences and major requirements.' },
  { id: '5', questionAr: 'كيف أفعّل الإشعارات؟', questionEn: 'How do I enable notifications?', answerAr: 'من صفحة الإعدادات، انتقل إلى قسم التفضيلات واختر قنوات الإشعارات المفضلة لديك (بريد إلكتروني، رسائل نصية، داخل التطبيق).', answerEn: 'From the Settings page, go to the Preferences section and choose your preferred notification channels (email, SMS, in-app).' },
  { id: '6', questionAr: 'هل يمكنني تغيير لغة الواجهة؟', questionEn: 'Can I change the interface language?', answerAr: 'نعم، يمكنك التبديل بين العربية والإنجليزية من الشريط العلوي أو من إعدادات التفضيلات.', answerEn: 'Yes, you can switch between Arabic and English from the top bar or from the Preferences settings.' },
  { id: '7', questionAr: 'ما هو تحليل المخاطر الأكاديمية؟', questionEn: 'What is Academic Risk Analytics?', answerAr: 'نظام ذكاء اصطناعي يحلل أداءك الأكاديمي ويكتشف عوامل الخطر مبكرًا ويقدم توصيات استباقية لتحسين مسارك الدراسي.', answerEn: 'An AI system that analyzes your academic performance, detects risk factors early, and provides proactive recommendations to improve your academic path.' },
  { id: '8', questionAr: 'كيف أحجز موعد إرشاد أكاديمي؟', questionEn: 'How do I book an advising appointment?', answerAr: 'من لوحة المرشد الأكاديمي، اضغط على زر حجز موعد واختر الوقت المناسب من الأوقات المتاحة.', answerEn: 'From the Advisor Dashboard, click the Book Appointment button and select a suitable time from available slots.' },
  { id: '9', questionAr: 'هل بياناتي آمنة على المنصة؟', questionEn: 'Is my data secure on the platform?', answerAr: 'نعم، نستخدم تشفير SSL وبروتوكولات أمان متقدمة. جميع البيانات مخزنة بأمان وفقًا لسياسات الجامعة ومعايير SDAIA.', answerEn: 'Yes, we use SSL encryption and advanced security protocols. All data is stored securely according to university policies and SDAIA standards.' },
  { id: '10', questionAr: 'كيف أطلب دعم فني؟', questionEn: 'How do I request technical support?', answerAr: 'يمكنك إرسال طلب من نموذج الدعم أدناه، أو التواصل مع فريق الدعم عبر البريد الإلكتروني support@qu.edu.sa.', answerEn: 'You can submit a request using the support form below, or contact the support team at support@qu.edu.sa.' },
];

const videoTutorials = [
  { id: '1', titleAr: 'مقدمة عن منصة QMentor', titleEn: 'Introduction to QMentor', durationAr: '٥ دقائق', durationEn: '5 min' },
  { id: '2', titleAr: 'استخدام التوأم الرقمي', titleEn: 'Using Digital Twin', durationAr: '٨ دقائق', durationEn: '8 min' },
  { id: '3', titleAr: 'إنشاء خطة دراسية ذكية', titleEn: 'Creating a Smart Study Plan', durationAr: '٦ دقائق', durationEn: '6 min' },
  { id: '4', titleAr: 'فهم تحليل المخاطر', titleEn: 'Understanding Risk Analytics', durationAr: '٧ دقائق', durationEn: '7 min' },
];

export default function HelpSupport() {
  const { t } = useLanguage();
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setContactForm({ subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="space-y-6">
      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-success-500 animate-pulse" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t('حالة النظام', 'System Status')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('جميع الأنظمة تعمل بشكل طبيعي', 'All systems operational')}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300">
            {t('يعمل', 'Operational')}
          </span>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t('الأسئلة الشائعة', 'Frequently Asked Questions')}
        </h3>
        <div className="space-y-2">
          {faqItems.map(faq => (
            <div key={faq.id} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center justify-between px-4 py-3 text-start hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="text-sm text-gray-900 dark:text-white">
                  {t(faq.questionAr, faq.questionEn)}
                </span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
                  openFaq === faq.id ? 'rotate-180' : ''
                }`} />
              </button>
              {openFaq === faq.id && (
                <div className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {t(faq.answerAr, faq.answerEn)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video Tutorials */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {t('دروس الفيديو', 'Video Tutorials')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {videoTutorials.map(vid => (
            <button
              key={vid.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-start"
            >
              <div className="w-10 h-10 rounded-lg bg-sa-50 dark:bg-sa-950 flex items-center justify-center shrink-0">
                <PlayCircleIcon className="w-5 h-5 text-sa-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-900 dark:text-white truncate">
                  {t(vid.titleAr, vid.titleEn)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t(vid.durationAr, vid.durationEn)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <EnvelopeIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('تواصل مع الدعم', 'Contact Support')}
          </h3>
        </div>
        {submitted ? (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800">
            <CheckCircleIcon className="w-5 h-5 text-success-600 dark:text-success-400" />
            <p className="text-sm text-success-700 dark:text-success-300">
              {t('تم إرسال طلبك بنجاح. سنتواصل معك قريبًا.', 'Your request has been submitted successfully. We will contact you soon.')}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('الموضوع', 'Subject')}
              </label>
              <input
                type="text"
                required
                value={contactForm.subject}
                onChange={e => setContactForm(f => ({ ...f, subject: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500 focus:border-transparent outline-none"
                placeholder={t('موضوع الرسالة', 'Message subject')}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('الرسالة', 'Message')}
              </label>
              <textarea
                required
                rows={4}
                value={contactForm.message}
                onChange={e => setContactForm(f => ({ ...f, message: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500 focus:border-transparent outline-none resize-none"
                placeholder={t('اكتب رسالتك هنا...', 'Write your message here...')}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-medium bg-sa-500 text-white hover:bg-sa-600 transition-colors"
            >
              {t('إرسال', 'Submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
