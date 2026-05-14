import { useState } from 'react';
import {
  CalendarIcon,
  BellAlertIcon,
  DocumentChartBarIcon,
  EnvelopeIcon,
  FlagIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';

interface QuickActionsProps {
  onScheduleMeeting?: () => void;
  onAddIntervention?: () => void;
}

export default function QuickActions({ onScheduleMeeting, onAddIntervention }: QuickActionsProps) {
  const { t } = useLanguage();
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const actions = [
    {
      icon: CalendarIcon,
      labelAr: 'جدولة اجتماع',
      labelEn: 'Schedule Meeting',
      color: 'bg-sa-500 hover:bg-sa-600',
      action: () => onScheduleMeeting?.() ?? showToast(t('تم فتح جدولة الاجتماع', 'Meeting scheduler opened')),
    },
    {
      icon: BellAlertIcon,
      labelAr: 'إرسال تنبيه',
      labelEn: 'Send Alert',
      color: 'bg-warning-500 hover:bg-warning-600',
      action: () => showToast(t('تم إرسال التنبيه بنجاح', 'Alert sent successfully')),
    },
    {
      icon: DocumentChartBarIcon,
      labelAr: 'إنشاء تقرير',
      labelEn: 'Generate Report',
      color: 'bg-lavender-500 hover:bg-lavender-600',
      action: () => showToast(t('جاري إنشاء التقرير...', 'Generating report...')),
    },
    {
      icon: EnvelopeIcon,
      labelAr: 'بريد جماعي',
      labelEn: 'Bulk Email',
      color: 'bg-info-500 hover:bg-info-600',
      action: () => showToast(t('تم فتح محرر البريد', 'Email composer opened')),
    },
    {
      icon: FlagIcon,
      labelAr: 'علامة للمراجعة',
      labelEn: 'Flag for Review',
      color: 'bg-error-500 hover:bg-error-600',
      action: () => onAddIntervention?.() ?? showToast(t('تم الإضافة للمراجعة', 'Flagged for review')),
    },
    {
      icon: ArrowPathIcon,
      labelAr: 'تحويل لإرشاد',
      labelEn: 'Refer to Counseling',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => showToast(t('تم التحويل للإرشاد بنجاح', 'Referred to counseling successfully')),
    },
  ];

  return (
    <div className="relative">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        {t('إجراءات سريعة', 'Quick Actions')}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {actions.map(action => {
          const Icon = action.icon;
          const label = t(action.labelAr, action.labelEn);
          return (
            <button
              key={action.labelEn}
              onClick={action.action}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl text-white transition-colors ${action.color}`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="absolute -top-12 inset-x-0 mx-auto w-fit px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium rounded-lg shadow-lg animate-pulse z-10">
          {toast}
        </div>
      )}
    </div>
  );
}
