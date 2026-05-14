import {
  CheckCircleIcon,
  ClockIcon,
  EllipsisHorizontalCircleIcon,
} from '@heroicons/react/24/solid';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { RecoveryMilestone } from '../types';

interface Props {
  milestones: RecoveryMilestone[];
}

const statusConfig = {
  completed: {
    icon: CheckCircleIcon,
    colorClass: 'text-sa-500',
    bgClass: 'bg-sa-500',
    lineClass: 'bg-sa-500',
    badgeClass: 'bg-sa-100 text-sa-700 dark:bg-sa-900/30 dark:text-sa-400',
  },
  'in-progress': {
    icon: ClockIcon,
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-500',
    lineClass: 'bg-amber-300 dark:bg-amber-700',
    badgeClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  upcoming: {
    icon: EllipsisHorizontalCircleIcon,
    colorClass: 'text-gray-400 dark:text-gray-500',
    bgClass: 'bg-gray-300 dark:bg-gray-600',
    lineClass: 'bg-gray-200 dark:bg-gray-700',
    badgeClass: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  },
};

const statusLabel = {
  completed: { ar: 'مكتمل', en: 'Completed' },
  'in-progress': { ar: 'جاري', en: 'In Progress' },
  upcoming: { ar: 'قادم', en: 'Upcoming' },
};

export default function RecoveryMilestones({ milestones }: Props) {
  const { t } = useLanguage();
  const completedCount = milestones.filter(m => m.status === 'completed').length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {t('مراحل خطة التعافي', 'Recovery Plan Milestones')}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {completedCount}/{milestones.length} {t('مكتمل', 'completed')}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div
          className="bg-sa-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / milestones.length) * 100}%` }}
        />
      </div>

      {/* Timeline */}
      <div className="relative">
        {milestones.map((milestone, i) => {
          const config = statusConfig[milestone.status];
          const Icon = config.icon;
          const isLast = i === milestones.length - 1;

          return (
            <div key={milestone.id} className="flex gap-4 pb-6 last:pb-0">
              {/* Timeline Line & Icon */}
              <div className="flex flex-col items-center">
                <Icon className={`w-6 h-6 flex-shrink-0 ${config.colorClass}`} />
                {!isLast && (
                  <div className={`w-0.5 flex-1 mt-1 ${config.lineClass}`} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t(milestone.titleAr, milestone.titleEn)}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {t(milestone.descriptionAr, milestone.descriptionEn)}
                    </p>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 ${config.badgeClass}`}>
                    {t(statusLabel[milestone.status].ar, statusLabel[milestone.status].en)}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                  <span>{t(milestone.dateAr, milestone.dateEn)}</span>
                  <span>{t(`الأسبوع ${milestone.week}`, `Week ${milestone.week}`)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
