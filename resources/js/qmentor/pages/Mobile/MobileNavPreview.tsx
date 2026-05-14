import { useState } from 'react';
import { HomeIcon, UserCircleIcon, ChatBubbleLeftRightIcon, BellAlertIcon, EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { HomeIcon as HomeIconSolid, UserCircleIcon as UserCircleSolid, ChatBubbleLeftRightIcon as ChatSolid, BellAlertIcon as BellSolid, EllipsisHorizontalIcon as EllipsisSolid } from '@heroicons/react/24/solid';

interface MobileNavPreviewProps {
  t: (ar: string, en: string) => string;
}

const tabs = [
  { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', Icon: HomeIcon, IconActive: HomeIconSolid },
  { id: 'twin', labelAr: 'التوأم الرقمي', labelEn: 'Digital Twin', Icon: UserCircleIcon, IconActive: UserCircleSolid },
  { id: 'chat', labelAr: 'المحادثة', labelEn: 'Chat', Icon: ChatBubbleLeftRightIcon, IconActive: ChatSolid },
  { id: 'alerts', labelAr: 'التنبيهات', labelEn: 'Alerts', Icon: BellAlertIcon, IconActive: BellSolid, badge: 3 },
  { id: 'more', labelAr: 'المزيد', labelEn: 'More', Icon: EllipsisHorizontalIcon, IconActive: EllipsisSolid },
];

export default function MobileNavPreview({ t }: MobileNavPreviewProps) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('معاينة شريط التنقل السفلي للجوال مع 5 تبويبات رئيسية', 'Preview of the mobile bottom tab bar with 5 main tabs')}
      </p>

      {/* Phone Frame */}
      <div className="mx-auto max-w-[320px]">
        <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
          {/* Notch */}
          <div className="flex justify-center mb-2">
            <div className="w-28 h-6 bg-black rounded-full" />
          </div>

          {/* Screen */}
          <div className="bg-white dark:bg-gray-800 rounded-[1.75rem] overflow-hidden h-[520px] flex flex-col">
            {/* Status Bar */}
            <div className="flex justify-between items-center px-6 py-2 text-xs font-semibold text-gray-900 dark:text-white">
              <span>9:41</span>
              <div className="flex gap-1">
                <div className="w-4 h-2 bg-gray-900 dark:bg-white rounded-sm" />
                <div className="w-3 h-2 bg-gray-900 dark:bg-white rounded-sm" />
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="text-center">
                {tabs.filter(tab => tab.id === activeTab).map(tab => {
                  const ActiveIcon = tab.IconActive;
                  return (
                    <div key={tab.id}>
                      <ActiveIcon className="w-16 h-16 mx-auto text-sa-500 mb-3" />
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t(tab.labelAr, tab.labelEn)}</h3>
                      <p className="text-xs text-gray-400 mt-1">{t('محتوى الصفحة', 'Page Content')}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Tab Bar */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 pb-4 pt-2">
              <div className="flex justify-around items-center">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = isActive ? tab.IconActive : tab.Icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className="flex flex-col items-center gap-0.5 relative"
                    >
                      <div className="relative">
                        <Icon className={`w-6 h-6 ${isActive ? 'text-sa-500' : 'text-gray-400'}`} />
                        {tab.badge && (
                          <span className="absolute -top-1.5 -end-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {tab.badge}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] ${isActive ? 'text-sa-500 font-semibold' : 'text-gray-400'}`}>
                        {t(tab.labelAr, tab.labelEn)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
