import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedTab from '../../components/shared/AnimatedTab';
import PageHeader from '../../components/shared/PageHeader';
import UserProfile from './UserProfile';
import Preferences from './Preferences';
import HelpSupport from './HelpSupport';
import AboutQMentor from './AboutQMentor';
import type { SettingsTab } from './types';
import {
  UserCircleIcon,
  AdjustmentsHorizontalIcon,
  QuestionMarkCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const tabs: { key: SettingsTab; icon: typeof UserCircleIcon; ar: string; en: string }[] = [
  { key: 'profile', icon: UserCircleIcon, ar: 'الملف الشخصي', en: 'Profile' },
  { key: 'preferences', icon: AdjustmentsHorizontalIcon, ar: 'التفضيلات', en: 'Preferences' },
  { key: 'help', icon: QuestionMarkCircleIcon, ar: 'المساعدة', en: 'Help & Support' },
  { key: 'about', icon: InformationCircleIcon, ar: 'حول', en: 'About' },
];

export default function Settings() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  return (
    <div>
      <PageHeader
        title={t('الإعدادات', 'Settings')}
        subtitle={t('إدارة حسابك وتفضيلات المنصة', 'Manage your account and platform preferences')}
        accentColor="bg-sa-500"
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('الإعدادات', 'Settings') },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="lg:w-52 shrink-0">
          <nav className="lg:sticky lg:top-6">
            <div className="flex lg:flex-col gap-0.5 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 font-medium'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2 : 1.5} />
                    {t(tab.ar, tab.en)}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Content */}
        <AnimatedTab activeKey={activeTab} className="flex-1 min-w-0">
          {activeTab === 'profile' && <UserProfile />}
          {activeTab === 'preferences' && <Preferences />}
          {activeTab === 'help' && <HelpSupport />}
          {activeTab === 'about' && <AboutQMentor />}
        </AnimatedTab>
      </div>

    </div>
  );
}
