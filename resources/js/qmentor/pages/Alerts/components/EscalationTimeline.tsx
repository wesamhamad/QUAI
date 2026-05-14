import {
  BellAlertIcon,
  UserIcon,
  WrenchScrewdriverIcon,
  CheckBadgeIcon,
  XMarkIcon,
  BuildingLibraryIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Alert, EscalationEntry } from '../types';

interface EscalationTimelineProps {
  alert: Alert | null;
  onClose: () => void;
}

const stageIcons: Record<EscalationEntry['stage'], typeof BellAlertIcon> = {
  triggered: BellAlertIcon,
  advisor_notified: UserIcon,
  dean_notified: BuildingLibraryIcon,
  vp_notified: ShieldCheckIcon,
  action_taken: WrenchScrewdriverIcon,
  resolved: CheckBadgeIcon,
};

const stageColors: Record<EscalationEntry['stage'], string> = {
  triggered: 'bg-error-500',
  advisor_notified: 'bg-gold-500',
  dean_notified: 'bg-orange-500',
  vp_notified: 'bg-purple-500',
  action_taken: 'bg-info-500',
  resolved: 'bg-success-500',
};

const stageBgColors: Record<EscalationEntry['stage'], string> = {
  triggered: 'bg-error-100 dark:bg-error-900/30',
  advisor_notified: 'bg-gold-100 dark:bg-gold-900/30',
  dean_notified: 'bg-orange-100 dark:bg-orange-900/30',
  vp_notified: 'bg-purple-100 dark:bg-purple-900/30',
  action_taken: 'bg-info-100 dark:bg-info-900/30',
  resolved: 'bg-success-100 dark:bg-success-900/30',
};

export default function EscalationTimeline({ alert, onClose }: EscalationTimelineProps) {
  const { t } = useLanguage();

  if (!alert || !alert.escalation || alert.escalation.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('مسار التصعيد', 'Escalation Timeline')}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t(alert.title, alert.titleEn)} — {t(alert.studentName, alert.studentNameEn)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute start-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

        <div className="space-y-6">
          {alert.escalation.map((entry, idx) => {
            const Icon = stageIcons[entry.stage];
            const isLast = idx === alert.escalation!.length - 1;
            return (
              <div key={entry.id} className="relative flex gap-4">
                {/* Icon circle */}
                <div className={`relative z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${stageBgColors[entry.stage]}`}>
                  <div className={`w-3 h-3 rounded-full ${stageColors[entry.stage]} ${isLast ? 'animate-pulse' : ''}`} />
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t(entry.stageAr, entry.stageEn)}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${stageColors[entry.stage]}`} />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t(entry.note, entry.noteEn)}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Icon className="w-3.5 h-3.5" />
                      {t(entry.actor, entry.actorEn)}
                    </span>
                    <span>•</span>
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
