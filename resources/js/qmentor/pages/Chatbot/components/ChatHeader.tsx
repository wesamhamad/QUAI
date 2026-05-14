import {
  Cog6ToothIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';

interface ChatHeaderProps {
  onToggleMinimize: () => void;
  minimized: boolean;
}

export default function ChatHeader({ onToggleMinimize, minimized }: ChatHeaderProps) {
  const { t, lang, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-sa-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">QM</span>
          </div>
          <span className="absolute bottom-0 end-0 w-3 h-3 bg-success-500 rounded-full border-2 border-white dark:border-gray-800" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('مساعد QMentor الذكي', 'QMentor AI Assistant')}
          </h2>
          <p className="text-xs text-success-600 dark:text-success-400">
            {t('متصل الآن', 'Online')}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleLanguage}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={t('تبديل اللغة', 'Toggle Language')}
        >
          <GlobeAltIcon className="w-5 h-5" />
          <span className="sr-only">{lang === 'ar' ? 'EN' : 'عربي'}</span>
        </button>
        <button
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={t('الإعدادات', 'Settings')}
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onToggleMinimize}
          className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={minimized ? t('توسيع', 'Expand') : t('تصغير', 'Minimize')}
        >
          {minimized ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
