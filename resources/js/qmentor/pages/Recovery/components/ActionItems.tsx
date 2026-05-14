import { useState } from 'react';
import {
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { ActionItem, ActionStatus, ActionPriority } from '../types';

interface Props {
  items: ActionItem[];
}

const priorityConfig: Record<ActionPriority, { labelAr: string; labelEn: string; class: string }> = {
  high: { labelAr: 'عالي', labelEn: 'High', class: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  medium: { labelAr: 'متوسط', labelEn: 'Medium', class: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  low: { labelAr: 'منخفض', labelEn: 'Low', class: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};

const statusConfig: Record<ActionStatus, { labelAr: string; labelEn: string; icon: typeof CheckCircleIcon; class: string }> = {
  completed: { labelAr: 'مكتمل', labelEn: 'Done', icon: CheckCircleIcon, class: 'text-sa-500' },
  'in-progress': { labelAr: 'جاري', labelEn: 'Active', icon: ClockIcon, class: 'text-blue-500' },
  pending: { labelAr: 'معلق', labelEn: 'Pending', icon: ClockIcon, class: 'text-gray-400' },
  overdue: { labelAr: 'متأخر', labelEn: 'Overdue', icon: ExclamationTriangleIcon, class: 'text-red-500' },
};

type FilterKey = 'all' | ActionStatus;

export default function ActionItems({ items }: Props) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterKey>('all');

  const filters: { key: FilterKey; labelAr: string; labelEn: string }[] = [
    { key: 'all', labelAr: 'الكل', labelEn: 'All' },
    { key: 'in-progress', labelAr: 'جاري', labelEn: 'Active' },
    { key: 'pending', labelAr: 'معلق', labelEn: 'Pending' },
    { key: 'overdue', labelAr: 'متأخر', labelEn: 'Overdue' },
    { key: 'completed', labelAr: 'مكتمل', labelEn: 'Done' },
  ];

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);
  const overdueCount = items.filter(i => i.status === 'overdue').length;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {t('المهام المطلوبة', 'Action Items')}
        </h3>
        {overdueCount > 0 && (
          <span className="text-xs font-medium text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">
            {overdueCount} {t('متأخر', 'overdue')}
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto scrollbar-hide">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f.key
                ? 'bg-sa-500 text-white'
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            {t(f.labelAr, f.labelEn)}
          </button>
        ))}
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {filtered.map(item => {
          const status = statusConfig[item.status];
          const priority = priorityConfig[item.priority];
          const StatusIcon = status.icon;

          return (
            <div
              key={item.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                item.status === 'completed'
                  ? 'bg-gray-50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700/50 opacity-60'
                  : item.status === 'overdue'
                  ? 'bg-red-50/50 dark:bg-red-950/10 border-red-200 dark:border-red-800/50'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <StatusIcon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${status.class}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-medium ${
                    item.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'
                  }`}>
                    {t(item.titleAr, item.titleEn)}
                  </p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${priority.class}`}>
                    {t(priority.labelAr, priority.labelEn)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {t(item.descriptionAr, item.descriptionEn)}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                  <span>{t(item.dueDateAr, item.dueDateEn)}</span>
                  <span>•</span>
                  <span>{t(item.assignedByAr, item.assignedByEn)}</span>
                  <span>•</span>
                  <span>{t(item.categoryAr, item.categoryEn)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
