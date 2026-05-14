import { useState } from 'react';
import {
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  BellIcon,
  CheckIcon,
  DeviceTabletIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { AlertPreference, NotificationChannel } from '../types';

interface AlertPreferencesProps {
  preferences: AlertPreference[];
  onSave: (prefs: AlertPreference[]) => void;
}

export default function AlertPreferences({ preferences, onSave }: AlertPreferencesProps) {
  const { t } = useLanguage();
  const [prefs, setPrefs] = useState<AlertPreference[]>(preferences);
  const [saved, setSaved] = useState(false);

  const channelIcons: Record<NotificationChannel, typeof BellIcon> = {
    in_app: BellIcon,
    email: EnvelopeIcon,
    sms: DevicePhoneMobileIcon,
    push: DeviceTabletIcon,
  };

  const channelLabels: Record<NotificationChannel, string> = {
    in_app: t('داخل التطبيق', 'In-App'),
    email: t('بريد إلكتروني', 'Email'),
    sms: t('رسائل نصية', 'SMS'),
    push: t('إشعارات فورية', 'Push'),
  };

  function toggleEnabled(idx: number) {
    setPrefs(p => p.map((pref, i) => i === idx ? { ...pref, enabled: !pref.enabled } : pref));
    setSaved(false);
  }

  function toggleChannel(idx: number, ch: NotificationChannel) {
    setPrefs(p => p.map((pref, i) => i === idx ? {
      ...pref,
      channels: { ...pref.channels, [ch]: !pref.channels[ch] },
    } : pref));
    setSaved(false);
  }

  function updateThreshold(idx: number, val: number) {
    setPrefs(p => p.map((pref, i) => i === idx ? { ...pref, threshold: val } : pref));
    setSaved(false);
  }

  function handleSave() {
    onSave(prefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('تفضيلات التنبيهات', 'Alert Preferences')}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {t('اختر أنواع التنبيهات وقنوات الإشعارات المفضلة', 'Choose which alert types to receive and preferred notification channels')}
        </p>

        <div className="space-y-4">
          {prefs.map((pref, idx) => (
            <div
              key={pref.type}
              className={`rounded-xl border p-4 transition-all ${
                pref.enabled
                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleEnabled(idx)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      pref.enabled ? 'bg-sa-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        pref.enabled ? 'start-[22px]' : 'start-0.5'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {t(pref.labelAr, pref.labelEn)}
                  </span>
                </div>

                {pref.threshold !== undefined && pref.enabled && (
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 dark:text-gray-400">
                      {t('الحد', 'Threshold')}:
                    </label>
                    <input
                      type="number"
                      value={pref.threshold}
                      onChange={e => updateThreshold(idx, parseFloat(e.target.value) || 0)}
                      step={pref.type === 'gpa_drop' ? 0.1 : 1}
                      className="w-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-2 py-1 text-gray-700 dark:text-gray-300 text-center"
                    />
                  </div>
                )}
              </div>

              {pref.enabled && (
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t('القنوات:', 'Channels:')}
                  </span>
                  {(Object.keys(pref.channels) as NotificationChannel[]).map(ch => {
                    const Icon = channelIcons[ch];
                    const active = pref.channels[ch];
                    return (
                      <button
                        key={ch}
                        onClick={() => toggleChannel(idx, ch)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          active
                            ? 'bg-sa-100 text-sa-700 dark:bg-sa-900/30 dark:text-sa-400'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {channelLabels[ch]}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
              saved
                ? 'bg-success-500 text-white'
                : 'bg-sa-500 text-white hover:bg-sa-600'
            }`}
          >
            {saved ? (
              <>
                <CheckIcon className="w-4 h-4" />
                {t('تم الحفظ', 'Saved')}
              </>
            ) : (
              t('حفظ التفضيلات', 'Save Preferences')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
