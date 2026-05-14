import { Search, X, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { taskCategories } from '../data/agentTasks';
import type { FilterCategory, FilterMode, FilterStatus, AutonomyMode, TaskStatus } from '../types';

interface Props {
  filterCategory: FilterCategory;
  filterMode: FilterMode;
  filterStatus: FilterStatus;
  searchQuery: string;
  onCategoryChange: (v: FilterCategory) => void;
  onModeChange: (v: FilterMode) => void;
  onStatusChange: (v: FilterStatus) => void;
  onSearchChange: (v: string) => void;
}

const modes: { key: AutonomyMode | 'all'; labelAr: string; labelEn: string }[] = [
  { key: 'all', labelAr: 'الكل', labelEn: 'All Modes' },
  { key: 'autonomous', labelAr: 'مستقل', labelEn: 'Autonomous' },
  { key: 'agent_notify', labelAr: 'وكيل + إشعار', labelEn: 'Agent + Notify' },
  { key: 'human_approves', labelAr: 'يعتمد بشري', labelEn: 'Human Approves' },
  { key: 'human_only', labelAr: 'بشري فقط', labelEn: 'Human Only' },
];

const statuses: { key: TaskStatus | 'all'; labelAr: string; labelEn: string }[] = [
  { key: 'all', labelAr: 'الكل', labelEn: 'All Status' },
  { key: 'running', labelAr: 'يعمل', labelEn: 'Running' },
  { key: 'completed', labelAr: 'مكتمل', labelEn: 'Completed' },
  { key: 'scheduled', labelAr: 'مجدول', labelEn: 'Scheduled' },
  { key: 'idle', labelAr: 'خامل', labelEn: 'Idle' },
];

export default function FilterBar({
  filterCategory, filterMode, filterStatus, searchQuery,
  onCategoryChange, onModeChange, onStatusChange, onSearchChange,
}: Props) {
  const { t } = useLanguage();

  const hasFilters = filterCategory !== 'all' || filterMode !== 'all' || filterStatus !== 'all' || searchQuery !== '';

  const selectClass = 'bg-white border border-gray-300 text-gray-700 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sa-500/20 focus:border-sa-500 appearance-none cursor-pointer hover:border-gray-400 transition-colors';

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        {/* Label */}
        <div className="flex items-center gap-1.5 text-gray-400">
          <SlidersHorizontal className="w-4 h-4" />
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder={t('البحث في المهام...', 'Search tasks...')}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-sa-500/20 focus:border-sa-500 placeholder-gray-400 transition-colors"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={e => onCategoryChange(e.target.value)}
          className={selectClass}
        >
          <option value="all">{t('كل الفئات', 'All Categories')}</option>
          {taskCategories.map(cat => (
            <option key={cat.key} value={cat.key}>
              {t(cat.nameAr, cat.nameEn)}
            </option>
          ))}
        </select>

        {/* Mode Filter */}
        <select
          value={filterMode}
          onChange={e => onModeChange(e.target.value as FilterMode)}
          className={selectClass}
        >
          {modes.map(m => (
            <option key={m.key} value={m.key}>{t(m.labelAr, m.labelEn)}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={e => onStatusChange(e.target.value as FilterStatus)}
          className={selectClass}
        >
          {statuses.map(s => (
            <option key={s.key} value={s.key}>{t(s.labelAr, s.labelEn)}</option>
          ))}
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={() => {
              onCategoryChange('all');
              onModeChange('all');
              onStatusChange('all');
              onSearchChange('');
            }}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 px-2 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            {t('مسح', 'Clear')}
          </button>
        )}
      </div>
    </div>
  );
}
