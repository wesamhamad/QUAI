import { motion } from 'framer-motion';
import {
  BarChart3, ShieldAlert, Bell, AlertTriangle, AlertOctagon,
  MessageSquare, BookOpen, Settings, ChevronRight,
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { taskCategories } from '../data/agentTasks';
import type { AutonomyMode } from '../types';

const modeLabels: Record<AutonomyMode, { ar: string; en: string }> = {
  autonomous: { ar: 'مستقل', en: 'Auto' },
  agent_notify: { ar: 'إشعار', en: 'Notify' },
  human_approves: { ar: 'موافقة', en: 'Approve' },
  human_only: { ar: 'بشري', en: 'Manual' },
};

const modeShades: Record<AutonomyMode, string> = {
  autonomous: 'bg-sa-500',
  agent_notify: 'bg-sa-400',
  human_approves: 'bg-sa-300',
  human_only: 'bg-sa-200',
};

const categoryIcons: Record<string, typeof BarChart3> = {
  data_collection: BarChart3,
  risk_assessment: ShieldAlert,
  low_medium_alerts: Bell,
  high_risk_alerts: AlertTriangle,
  critical_alerts: AlertOctagon,
  chatbot: MessageSquare,
  study_plan: BookOpen,
  administration: Settings,
};

interface Props {
  onCategoryClick?: (categoryKey: string) => void;
}

export default function CategoryBreakdown({ onCategoryClick }: Props) {
  const { t } = useLanguage();

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {t('تصنيف الفئات', 'Category Breakdown')}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {t('8 فئات × مصفوفة الاستقلالية', '8 categories × autonomy matrix')}
          </p>
        </div>
        {/* Legend */}
        <div className="hidden md:flex items-center gap-3">
          {(Object.keys(modeLabels) as AutonomyMode[]).map(mode => (
            <div key={mode} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${modeShades[mode]}`} />
              <span className="text-[10px] text-gray-400 font-medium">{t(modeLabels[mode].ar, modeLabels[mode].en)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category rows */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {taskCategories.map((cat, i) => {
          const CatIcon = categoryIcons[cat.key] || BarChart3;
          const total = cat.tasks.length;
          const runningCount = cat.tasks.filter(t => t.status === 'running').length;
          const completedCount = cat.tasks.filter(t => t.status === 'completed').length;

          // Mode distribution
          const modeCounts: Record<AutonomyMode, number> = { autonomous: 0, agent_notify: 0, human_approves: 0, human_only: 0 };
          cat.tasks.forEach(task => modeCounts[task.mode]++);

          const lastRun = cat.tasks.reduce((latest, task) => {
            if (task.lastExecution === 'continuous') return 'Live';
            return latest || task.lastExecution;
          }, '' as string);

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04, duration: 0.25 }}
              onClick={() => onCategoryClick?.(cat.key)}
              className="group flex items-center gap-5 px-6 py-4 cursor-pointer hover:bg-sa-25 dark:hover:bg-gray-750 transition-colors"
            >
              {/* Icon */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-sa-50 dark:bg-sa-950 flex items-center justify-center">
                <CatIcon className="w-5 h-5 text-sa-600 dark:text-sa-400" strokeWidth={1.75} />
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t(cat.nameAr, cat.nameEn)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">{total} {t('مهمة', 'tasks')}</span>
                  {runningCount > 0 && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                      <span className="flex items-center gap-1 text-xs text-sa-600 dark:text-sa-400 font-medium">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sa-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sa-500" />
                        </span>
                        {runningCount} {t('نشط', 'active')}
                      </span>
                    </>
                  )}
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="text-xs text-gray-400">{lastRun}</span>
                </div>
              </div>

              {/* Mode distribution bar */}
              <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0 w-36">
                <div className="w-full h-2 rounded-full overflow-hidden flex bg-gray-100 dark:bg-gray-700">
                  {(Object.keys(modeCounts) as AutonomyMode[]).map(mode => {
                    const pct = (modeCounts[mode] / total) * 100;
                    if (pct === 0) return null;
                    return (
                      <div
                        key={mode}
                        className={`h-full ${modeShades[mode]} first:rounded-s-full last:rounded-e-full`}
                        style={{ width: `${pct}%` }}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <span>{modeCounts.autonomous} {t('مستقل', 'auto')}</span>
                  <span>·</span>
                  <span>{total - modeCounts.autonomous} {t('إشراف', 'supervised')}</span>
                </div>
              </div>

              {/* Completion */}
              <div className="hidden lg:flex flex-col items-center shrink-0 w-16">
                <span className="text-lg font-bold text-sa-600 dark:text-sa-400">
                  {completedCount}
                </span>
                <span className="text-[10px] text-gray-400">{t('مكتمل', 'done')}</span>
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-sa-500 transition-colors shrink-0" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
