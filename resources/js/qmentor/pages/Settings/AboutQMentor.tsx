import { useLanguage } from '../../contexts/LanguageContext';
import {
  InformationCircleIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  CodeBracketIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

const changelog = [
  { version: '2.1.0', dateAr: '١٢ أبريل ٢٠٢٦', dateEn: 'April 12, 2026', descAr: 'إضافة واجهة المقارنة المعيارية ونظام الإعدادات المحسّن', descEn: 'Added Benchmarking dashboard and enhanced Settings interface' },
  { version: '2.0.0', dateAr: '١ مارس ٢٠٢٦', dateEn: 'March 1, 2026', descAr: 'إطلاق منصة QMentor الجديدة مع واجهة React', descEn: 'Launched new QMentor platform with React interface' },
  { version: '1.5.0', dateAr: '١٥ يناير ٢٠٢٦', dateEn: 'January 15, 2026', descAr: 'إضافة الخطة الدراسية الذكية والمحادثة الذكية', descEn: 'Added Smart Study Plan and Advising Chatbot' },
  { version: '1.0.0', dateAr: '١ سبتمبر ٢٠٢٥', dateEn: 'September 1, 2025', descAr: 'الإصدار الأول من منصة QMentor', descEn: 'Initial release of QMentor platform' },
];

const credits = [
  { ar: 'جامعة القصيم - عمادة تقنية المعلومات', en: 'Qassim University - IT Deanship' },
  { ar: 'مركز التميز في الذكاء الاصطناعي', en: 'AI Excellence Center' },
  { ar: 'فريق تطوير QMentor', en: 'QMentor Development Team' },
];

export default function AboutQMentor() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Version Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-sa-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white font-bold text-2xl">Q</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {t('منصة QMentor', 'QMentor Platform')}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
          {t('الإرشاد الأكاديمي الذكي', 'AI-Powered Academic Advising')}
        </p>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sa-100 text-sa-700 dark:bg-sa-900/30 dark:text-sa-300">
          v2.1.0
        </span>
      </div>

      {/* Changelog */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <CodeBracketIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('سجل التحديثات', 'Changelog')}
          </h3>
        </div>
        <div className="space-y-4">
          {changelog.map((entry, i) => (
            <div key={entry.version} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-sa-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                {i < changelog.length - 1 && <div className="w-px flex-1 bg-gray-200 dark:bg-gray-700 mt-1" />}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">v{entry.version}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t(entry.dateAr, entry.dateEn)}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t(entry.descAr, entry.descEn)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credits */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <HeartIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('الاعتمادات', 'Credits')}
          </h3>
        </div>
        <div className="space-y-2">
          {credits.map((c, i) => (
            <div key={i} className="flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-lg bg-sa-50 dark:bg-sa-950 flex items-center justify-center">
                <span className="text-sa-600 dark:text-sa-400 text-xs font-bold">{i + 1}</span>
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{t(c.ar, c.en)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <InformationCircleIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('روابط مهمة', 'Important Links')}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: DocumentTextIcon, ar: 'التوثيق', en: 'Documentation' },
            { icon: ShieldCheckIcon, ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
            { icon: DocumentTextIcon, ar: 'شروط الاستخدام', en: 'Terms of Use' },
            { icon: InformationCircleIcon, ar: 'عن جامعة القصيم', en: 'About Qassim University' },
          ].map((link, i) => {
            const Icon = link.icon;
            return (
              <button
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-start"
              >
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t(link.ar, link.en)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
