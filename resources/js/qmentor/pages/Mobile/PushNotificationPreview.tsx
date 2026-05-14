import { AcademicCapIcon, ExclamationTriangleIcon, UserCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { pushNotifications } from './data/mockMessageData';
import type { PushNotification } from './types';

interface PushNotificationPreviewProps {
  t: (ar: string, en: string) => string;
}

const iconMap = {
  grade: AcademicCapIcon,
  attendance: ExclamationTriangleIcon,
  advisor: UserCircleIcon,
  deadline: ClockIcon,
};

const iconColorMap = {
  grade: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/30',
  attendance: 'text-amber-500 bg-amber-50 dark:bg-amber-900/30',
  advisor: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30',
  deadline: 'text-red-500 bg-red-50 dark:bg-red-900/30',
};

function IOSNotification({ notif, t }: { notif: PushNotification; t: (ar: string, en: string) => string }) {
  const Icon = iconMap[notif.icon];
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-3 shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-3">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-xl ${iconColorMap[notif.icon]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{notif.appName}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{notif.time}</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{t(notif.titleAr, notif.titleEn)}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{t(notif.bodyAr, notif.bodyEn)}</p>
        </div>
      </div>
    </div>
  );
}

function AndroidNotification({ notif, t }: { notif: PushNotification; t: (ar: string, en: string) => string }) {
  const Icon = iconMap[notif.icon];
  return (
    <div className="bg-[#2D2D2D] rounded-2xl p-3 shadow-lg mb-3">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-4 h-4 rounded-full bg-sa-500 flex items-center justify-center">
          <span className="text-[8px] text-white font-bold">Q</span>
        </div>
        <span className="text-xs text-gray-400 font-medium">{notif.appName}</span>
        <span className="text-xs text-gray-500">•</span>
        <span className="text-xs text-gray-500">{notif.time}</span>
        <div className="flex-1" />
        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5H7z"/></svg>
      </div>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{t(notif.titleAr, notif.titleEn)}</p>
          <p className="text-sm text-gray-400 line-clamp-2">{t(notif.bodyAr, notif.bodyEn)}</p>
        </div>
        <div className={`p-1.5 rounded-lg ${iconColorMap[notif.icon]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function PushNotificationPreview({ t }: PushNotificationPreviewProps) {
  const iosNotifs = pushNotifications.filter(n => n.platform === 'ios');
  const androidNotifs = pushNotifications.filter(n => n.platform === 'android');

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('معاينة إشعارات الدفع على iOS و Android', 'Preview of push notifications on iOS and Android')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* iOS */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            iOS
          </h3>
          <div className="bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4">
            {iosNotifs.map(n => <IOSNotification key={n.id} notif={n} t={t} />)}
          </div>
        </div>

        {/* Android */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.27-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.463 11.463 0 00-8.92 0L5.66 5.67c-.18-.28-.54-.37-.83-.22-.31.16-.43.54-.27.85L6.4 9.48A10.78 10.78 0 002 18h20a10.78 10.78 0 00-4.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"/></svg>
            Android
          </h3>
          <div className="bg-[#1A1A1A] rounded-2xl p-4">
            {androidNotifs.map(n => <AndroidNotification key={n.id} notif={n} t={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
