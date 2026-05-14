import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedTab from '../../components/shared/AnimatedTab';
import PageHeader from '../../components/shared/PageHeader';
import ResponsiveAudit from './ResponsiveAudit';
import MobileNavPreview from './MobileNavPreview';
import WhatsAppPreview from './WhatsAppPreview';
import TelegramPreview from './TelegramPreview';
import PushNotificationPreview from './PushNotificationPreview';
import SMSPreview from './SMSPreview';
import type { MobileTab } from './types';
import {
  DevicePhoneMobileIcon,
  Bars3BottomLeftIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  BellSnoozeIcon,
  ChatBubbleOvalLeftIcon,
} from '@heroicons/react/24/outline';

const tabs: { id: MobileTab; labelAr: string; labelEn: string; Icon: typeof DevicePhoneMobileIcon }[] = [
  { id: 'audit', labelAr: 'فحص الاستجابة', labelEn: 'Responsive Audit', Icon: DevicePhoneMobileIcon },
  { id: 'nav', labelAr: 'التنقل المحمول', labelEn: 'Mobile Nav', Icon: Bars3BottomLeftIcon },
  { id: 'whatsapp', labelAr: 'واتساب', labelEn: 'WhatsApp', Icon: ChatBubbleLeftRightIcon },
  { id: 'telegram', labelAr: 'تيليجرام', labelEn: 'Telegram', Icon: PaperAirplaneIcon },
  { id: 'push', labelAr: 'الإشعارات', labelEn: 'Push Notifications', Icon: BellSnoozeIcon },
  { id: 'sms', labelAr: 'الرسائل النصية', labelEn: 'SMS Alerts', Icon: ChatBubbleOvalLeftIcon },
];

export default function Mobile() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<MobileTab>('audit');

  return (
    <div>
      <PageHeader
        title={t('العرض المحمول والمراسلة', 'Mobile & Messaging Preview')}
        subtitle={t(
          'فحص استجابة الشاشات ومعاينة قنوات التواصل مع الطلاب',
          'Screen responsiveness audit and student messaging channel previews'
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('العرض المحمول', 'Mobile Preview') },
        ]}
        accentColor="bg-sa-500"
      />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex overflow-x-auto gap-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="tab-underline flex items-center gap-1.5 text-sm whitespace-nowrap pb-3"
              data-active={activeTab === tab.id}
            >
              <tab.Icon className="w-4 h-4" />
              {t(tab.labelAr, tab.labelEn)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatedTab activeKey={activeTab}>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          {activeTab === 'audit' && <ResponsiveAudit t={t} />}
          {activeTab === 'nav' && <MobileNavPreview t={t} />}
          {activeTab === 'whatsapp' && <WhatsAppPreview t={t} />}
          {activeTab === 'telegram' && <TelegramPreview t={t} />}
          {activeTab === 'push' && <PushNotificationPreview t={t} />}
          {activeTab === 'sms' && <SMSPreview t={t} />}
        </div>
      </AnimatedTab>
    </div>
  );
}
