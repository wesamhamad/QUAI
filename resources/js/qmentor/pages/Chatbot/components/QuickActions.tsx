import {
  AcademicCapIcon,
  CalendarDaysIcon,
  UsersIcon,
  ClockIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import { quickActions } from '../data/mockConversations';

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  AcademicCapIcon,
  CalendarDaysIcon,
  UsersIcon,
  ClockIcon,
  UserCircleIcon,
};

interface QuickActionsProps {
  onAction: (query: string) => void;
}

export default function QuickActions({ onAction }: QuickActionsProps) {
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div className="flex flex-wrap gap-2 px-4 py-3">
      {quickActions.map(action => {
        const Icon = iconMap[action.icon];
        return (
          <button
            key={action.id}
            onClick={() => onAction(isAr ? action.query : action.queryEn)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-300 hover:bg-sa-50 dark:hover:bg-sa-950 hover:border-sa-300 dark:hover:border-sa-700 transition-colors"
          >
            {Icon && <Icon className="w-4 h-4 text-sa-600 dark:text-sa-400" />}
            <span>{isAr ? action.label : action.labelEn}</span>
          </button>
        );
      })}
    </div>
  );
}
