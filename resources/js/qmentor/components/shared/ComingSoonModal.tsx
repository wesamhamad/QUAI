import { XMarkIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';

interface ComingSoonModalProps {
  open: boolean;
  onClose?: () => void;
  featureName?: string;
}

export default function ComingSoonModal({ open, onClose, featureName }: ComingSoonModalProps) {
  const { t } = useLanguage();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sa-50 dark:bg-sa-950 flex items-center justify-center">
          <RocketLaunchIcon className="w-8 h-8 text-sa-500" />
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('قريباً', 'Coming Soon')}
        </h3>

        {featureName && (
          <p className="text-sm font-medium text-sa-600 dark:text-sa-400 mb-2">
            {featureName}
          </p>
        )}

        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          {t(
            'هذه الميزة قيد التطوير وستكون متاحة قريباً.',
            'This feature is being developed and will be available shortly.'
          )}
        </p>

        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sa-500 text-white text-sm font-medium hover:bg-sa-600 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
            {t('إغلاق', 'Close')}
          </button>
        )}
      </div>
    </div>
  );
}
