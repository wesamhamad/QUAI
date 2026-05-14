import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import type { UserPreferences } from './types';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  BellIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  CalendarIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const defaultPrefs: UserPreferences = {
  language: 'ar',
  theme: 'light',
  notifications: {
    email: true,
    sms: false,
    inApp: true,
    alerts: true,
    grades: true,
    appointments: true,
    announcements: true,
  },
  calendarIntegration: false,
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
  },
};

function loadPrefs(): UserPreferences {
  try {
    const stored = localStorage.getItem('qmentor-preferences');
    return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs;
  } catch {
    return defaultPrefs;
  }
}

export default function Preferences() {
  const { t, lang, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [prefs, setPrefs] = useState<UserPreferences>(loadPrefs);

  useEffect(() => {
    localStorage.setItem('qmentor-preferences', JSON.stringify(prefs));
  }, [prefs]);

  function updateNotification(key: keyof UserPreferences['notifications'], val: boolean) {
    setPrefs(p => ({ ...p, notifications: { ...p.notifications, [key]: val } }));
  }

  const themeOptions: { value: 'light' | 'dark' | 'auto'; icon: typeof SunIcon; ar: string; en: string }[] = [
    { value: 'light', icon: SunIcon, ar: 'فاتح', en: 'Light' },
    { value: 'dark', icon: MoonIcon, ar: 'داكن', en: 'Dark' },
    { value: 'auto', icon: ComputerDesktopIcon, ar: 'تلقائي', en: 'Auto' },
  ];

  const notificationChannels: { key: keyof UserPreferences['notifications']; icon: typeof BellIcon; ar: string; en: string }[] = [
    { key: 'email', icon: EnvelopeIcon, ar: 'البريد الإلكتروني', en: 'Email' },
    { key: 'sms', icon: DevicePhoneMobileIcon, ar: 'الرسائل النصية', en: 'SMS' },
    { key: 'inApp', icon: BellIcon, ar: 'داخل التطبيق', en: 'In-App' },
  ];

  const notificationTypes: { key: keyof UserPreferences['notifications']; ar: string; en: string }[] = [
    { key: 'alerts', ar: 'التنبيهات الأكاديمية', en: 'Academic Alerts' },
    { key: 'grades', ar: 'الدرجات', en: 'Grades' },
    { key: 'appointments', ar: 'المواعيد', en: 'Appointments' },
    { key: 'announcements', ar: 'الإعلانات', en: 'Announcements' },
  ];

  const fontSizes: { value: 'small' | 'medium' | 'large'; ar: string; en: string }[] = [
    { value: 'small', ar: 'صغير', en: 'Small' },
    { value: 'medium', ar: 'متوسط', en: 'Medium' },
    { value: 'large', ar: 'كبير', en: 'Large' },
  ];

  return (
    <div className="space-y-6">
      {/* Language */}
      <Section title={t('اللغة', 'Language')} icon={<Globe className="w-5 h-5" />}>
        <div className="flex gap-3">
          {(['ar', 'en'] as const).map(l => (
            <button
              key={l}
              onClick={() => { if (lang !== l) toggleLanguage(); }}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                lang === l
                  ? 'border-sa-500 bg-sa-50 dark:bg-sa-950 text-sa-700 dark:text-sa-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              {l === 'ar' ? 'العربية' : 'English'}
            </button>
          ))}
        </div>
      </Section>

      {/* Theme */}
      <Section title={t('المظهر', 'Theme')} icon={theme === 'dark' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}>
        <div className="grid grid-cols-3 gap-3">
          {themeOptions.map(opt => {
            const Icon = opt.icon;
            const isActive = (opt.value === 'light' && theme === 'light') || (opt.value === 'dark' && theme === 'dark');
            return (
              <button
                key={opt.value}
                onClick={() => {
                  if (opt.value === 'auto') return;
                  if ((opt.value === 'light' && theme === 'dark') || (opt.value === 'dark' && theme === 'light')) {
                    toggleTheme();
                  }
                }}
                className={`flex flex-col items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                  isActive
                    ? 'border-sa-500 bg-sa-50 dark:bg-sa-950 text-sa-700 dark:text-sa-300'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                {t(opt.ar, opt.en)}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Notification Channels */}
      <Section title={t('قنوات الإشعارات', 'Notification Channels')} icon={<BellIcon className="w-5 h-5" />}>
        <div className="space-y-3">
          {notificationChannels.map(ch => {
            const Icon = ch.icon;
            return (
              <div key={ch.key} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{t(ch.ar, ch.en)}</span>
                </div>
                <Toggle
                  checked={prefs.notifications[ch.key]}
                  onChange={v => updateNotification(ch.key, v)}
                />
              </div>
            );
          })}
        </div>
      </Section>

      {/* Notification Types */}
      <Section title={t('أنواع الإشعارات', 'Notification Types')} icon={<BellIcon className="w-5 h-5" />}>
        <div className="space-y-3">
          {notificationTypes.map(nt => (
            <div key={nt.key} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">{t(nt.ar, nt.en)}</span>
              <Toggle
                checked={prefs.notifications[nt.key]}
                onChange={v => updateNotification(nt.key, v)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Calendar */}
      <Section title={t('التقويم', 'Calendar')} icon={<CalendarIcon className="w-5 h-5" />}>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {t('ربط التقويم الجامعي', 'Sync university calendar')}
          </span>
          <Toggle
            checked={prefs.calendarIntegration}
            onChange={v => setPrefs(p => ({ ...p, calendarIntegration: v }))}
          />
        </div>
      </Section>

      {/* Accessibility */}
      <Section title={t('إمكانية الوصول', 'Accessibility')} icon={<EyeIcon className="w-5 h-5" />}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
              {t('حجم الخط', 'Font Size')}
            </label>
            <div className="flex gap-2">
              {fontSizes.map(fs => (
                <button
                  key={fs.value}
                  onClick={() => setPrefs(p => ({ ...p, accessibility: { ...p.accessibility, fontSize: fs.value } }))}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                    prefs.accessibility.fontSize === fs.value
                      ? 'border-sa-500 bg-sa-50 dark:bg-sa-950 text-sa-700 dark:text-sa-300'
                      : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                  }`}
                >
                  {t(fs.ar, fs.en)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t('تباين عالي', 'High Contrast')}
            </span>
            <Toggle
              checked={prefs.accessibility.highContrast}
              onChange={v => setPrefs(p => ({ ...p, accessibility: { ...p.accessibility, highContrast: v } }))}
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-gray-500 dark:text-gray-400">{icon}</div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? 'bg-sa-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'start-[22px]' : 'start-0.5'
        }`}
      />
    </button>
  );
}
