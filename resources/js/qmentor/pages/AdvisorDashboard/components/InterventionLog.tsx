import {
  ChatBubbleLeftRightIcon, EnvelopeIcon, ArrowTopRightOnSquareIcon,
  PencilSquareIcon, HeartIcon, FlagIcon, CalendarIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Intervention, InterventionSeverity } from '../types';

const typeIcons: Record<string, typeof ChatBubbleLeftRightIcon> = {
  meeting: ChatBubbleLeftRightIcon,
  email: EnvelopeIcon,
  referral: ArrowTopRightOnSquareIcon,
  note: PencilSquareIcon,
  counseling: HeartIcon,
  flag: FlagIcon,
};

const typeColors: Record<string, string> = {
  meeting: 'bg-sa-100 text-sa-600 dark:bg-sa-500/20 dark:text-sa-400',
  email: 'bg-info-100 text-info-600 dark:bg-info-500/20 dark:text-info-500',
  referral: 'bg-lavender-100 text-lavender-600 dark:bg-lavender-500/20 dark:text-lavender-400',
  note: 'bg-gold-100 text-gold-600 dark:bg-gold-500/20 dark:text-gold-500',
  counseling: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
  flag: 'bg-error-100 text-error-600 dark:bg-error-500/20 dark:text-error-400',
};

const severityDots: Record<InterventionSeverity, string> = {
  urgent: 'bg-error-500',
  high: 'bg-warning-500',
  normal: 'bg-info-500',
  low: 'bg-gray-400',
};

interface InterventionLogProps {
  interventions: Intervention[];
  onAddNew: () => void;
}

export default function InterventionLog({ interventions, onAddNew }: InterventionLogProps) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {t('سجل التدخلات', 'Intervention Log')}
        </h3>
        <button
          onClick={onAddNew}
          className="text-xs font-medium text-sa-600 dark:text-sa-400 hover:text-sa-700 dark:hover:text-sa-300 transition-colors"
        >
          + {t('إضافة تدخل', 'Add Intervention')}
        </button>
      </div>
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {interventions.map(item => {
          const Icon = typeIcons[item.type] ?? PencilSquareIcon;
          return (
            <div
              key={item.id}
              className="flex gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              {/* Timeline dot + icon */}
              <div className="flex flex-col items-center gap-1 shrink-0">
                <div className={`p-2 rounded-lg ${typeColors[item.type] ?? typeColors.note}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {item.severity && (
                  <div className={`w-2 h-2 rounded-full ${severityDots[item.severity]}`} title={item.severity} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {t(item.studentName, item.studentNameEn)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{item.date}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {t(item.summary, item.summaryEn)}
                </p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    {t(item.typeAr, item.type)}
                  </span>
                  {item.followUpDate && (
                    <span className="flex items-center gap-0.5 text-[10px] text-sa-600 dark:text-sa-400">
                      <CalendarIcon className="w-3 h-3" />
                      {t('متابعة', 'Follow-up')}: {item.followUpDate.slice(5)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
