import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import type { ActiveSession } from './types';
import {
  ShieldCheckIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  ArrowRightOnRectangleIcon,
  CheckBadgeIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const mockSessions: ActiveSession[] = [
  {
    id: '1',
    device: 'Windows Desktop',
    browser: 'Chrome 124',
    ip: '10.20.30.***',
    location: 'بريدة، القصيم',
    locationEn: 'Buraydah, Qassim',
    lastActive: '2026-04-12T18:30:00Z',
    isCurrent: true,
  },
  {
    id: '2',
    device: 'iPhone 15',
    browser: 'Safari Mobile',
    ip: '10.20.31.***',
    location: 'الرياض',
    locationEn: 'Riyadh',
    lastActive: '2026-04-12T14:20:00Z',
    isCurrent: false,
  },
  {
    id: '3',
    device: 'MacBook Pro',
    browser: 'Firefox 125',
    ip: '10.20.32.***',
    location: 'جدة',
    locationEn: 'Jeddah',
    lastActive: '2026-04-11T09:15:00Z',
    isCurrent: false,
  },
];

export default function AccountSecurity() {
  const { t } = useLanguage();
  const [sessions, setSessions] = useState(mockSessions);

  function handleLogout(id: string) {
    setSessions(prev => prev.filter(s => s.id !== id));
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="space-y-6">
      {/* SSO Connection */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheckIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('تسجيل الدخول الموحد', 'Single Sign-On')}
          </h3>
        </div>
        <div className="bg-sa-50 dark:bg-sa-950/30 border border-sa-200 dark:border-sa-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sa-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">QU</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t('بوابة كيو - MyQU', 'MyQU Portal')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SAML 2.0 SSO · {t('متصل', 'Connected')}
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300">
              <CheckBadgeIcon className="w-3.5 h-3.5" />
              {t('نشط', 'Active')}
            </span>
          </div>
        </div>
      </div>

      {/* Two-Factor Auth */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheckIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('المصادقة الثنائية', 'Two-Factor Authentication')}
          </h3>
        </div>
        <div className="bg-gold-50 dark:bg-gold-950/30 border border-gold-200 dark:border-gold-800 rounded-xl p-4 flex items-center gap-3">
          <ExclamationTriangleIcon className="w-5 h-5 text-gold-600 dark:text-gold-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {t('المصادقة الثنائية غير مفعلة', '2FA is not enabled')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t('يُدار عبر بوابة MyQU', 'Managed through MyQU portal')}
            </p>
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-300">
            {t('غير مفعل', 'Disabled')}
          </span>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <ComputerDesktopIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {t('الجلسات النشطة', 'Active Sessions')}
          </h3>
        </div>
        <div className="space-y-3">
          {sessions.map(session => (
            <div
              key={session.id}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                session.isCurrent
                  ? 'border-sa-200 dark:border-sa-800 bg-sa-50/50 dark:bg-sa-950/20'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                {session.device.includes('iPhone') || session.device.includes('Android') ? (
                  <DevicePhoneMobileIcon className="w-5 h-5" />
                ) : (
                  <ComputerDesktopIcon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {session.device} · {session.browser}
                  </p>
                  {session.isCurrent && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-sa-100 text-sa-700 dark:bg-sa-900/30 dark:text-sa-300 shrink-0">
                      {t('الحالية', 'Current')}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {t(session.location, session.locationEn)} · {session.ip} · {formatDate(session.lastActive)}
                </p>
              </div>
              {!session.isCurrent && (
                <button
                  onClick={() => handleLogout(session.id)}
                  className="p-2 rounded-lg text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors shrink-0"
                  title={t('تسجيل الخروج', 'Sign out')}
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
