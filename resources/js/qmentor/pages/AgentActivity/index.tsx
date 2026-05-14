import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import HeaderStats from './components/HeaderStats';
import LiveActivityFeed from './components/LiveActivityFeed';
import CategoryBreakdown from './components/CategoryBreakdown';
import TaskTable from './components/TaskTable';
import PerformanceCharts from './components/PerformanceCharts';
import DrillDownPanel from './components/DrillDownPanel';
import FilterBar from './components/FilterBar';
import type { AgentTask, FilterCategory, FilterMode, FilterStatus, ActivityEntry } from './types';

export default function AgentActivity() {
  const { t } = useLanguage();

  // Filters
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Drill-down
  const [selectedTask, setSelectedTask] = useState<AgentTask | null>(null);

  const handleCategoryClick = (categoryKey: string) => {
    setFilterCategory(categoryKey);
  };

  const handleActivitySelect = (entry: ActivityEntry) => {
    import('./data/agentTasks').then(({ allTasks }) => {
      const task = allTasks.find(t => t.id === entry.taskId);
      if (task) setSelectedTask(task);
    });
  };

  return (
    <div className="min-h-screen">
      <div className="space-y-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <PageHeader
          title={t('مركز نشاط الوكيل الذكي', 'AI Agent Activity Center')}
          subtitle={t(
            'مراقبة 60 مهمة مستقلة عبر 8 فئات — مصفوفة الاستقلالية',
            '60 autonomous tasks across 8 categories — Task Autonomy Matrix'
          )}
          accentColor="bg-sa-500"
          breadcrumbs={[
            { label: t('الرئيسية', 'Home'), href: '/' },
            { label: t('نشاط الوكيل', 'Agent Activity') },
          ]}
          actions={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-sa-50 dark:bg-sa-950 border border-sa-200 dark:border-sa-800"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sa-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sa-500" />
              </span>
              <Shield className="w-3.5 h-3.5 text-sa-600 dark:text-sa-400" />
              <span className="text-xs text-sa-700 dark:text-sa-300 font-medium">{t('جميع الأنظمة تعمل', 'All Systems Operational')}</span>
            </motion.div>
          }
        />

        {/* Header Stats */}
        <HeaderStats />

        {/* Two-column: Category Breakdown + Activity Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-3">
            <CategoryBreakdown onCategoryClick={handleCategoryClick} />
          </div>
          <div className="xl:col-span-2">
            <LiveActivityFeed onSelectEntry={handleActivitySelect} />
          </div>
        </div>

        {/* Performance Charts */}
        <PerformanceCharts />

        {/* Filters + Table */}
        <FilterBar
          filterCategory={filterCategory}
          filterMode={filterMode}
          filterStatus={filterStatus}
          searchQuery={searchQuery}
          onCategoryChange={setFilterCategory}
          onModeChange={setFilterMode}
          onStatusChange={setFilterStatus}
          onSearchChange={setSearchQuery}
        />

        <TaskTable
          filterCategory={filterCategory}
          filterMode={filterMode}
          filterStatus={filterStatus}
          searchQuery={searchQuery}
          onSelectTask={setSelectedTask}
        />
      </div>

      {/* Drill-Down Panel */}
      {selectedTask && (
        <DrillDownPanel task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
