import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronUp, ChevronDown, Bot, BellRing, UserCheck, User,
  Loader2, CheckCircle2, Clock, Minus, XCircle, Filter,
  BarChart3, ShieldAlert, Bell, AlertTriangle, AlertOctagon,
  MessageSquare, BookOpen, Settings,
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { allTasks, CATEGORY_CONFIG } from '../data/agentTasks';
import type { AgentTask, AutonomyMode, TaskStatus, FilterCategory, FilterMode, FilterStatus } from '../types';

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

const modeConfig: Record<AutonomyMode, { labelAr: string; labelEn: string; badgeClass: string; icon: typeof Bot }> = {
  autonomous: { labelAr: 'مستقل', labelEn: 'Autonomous', badgeClass: 'bg-sa-50 text-sa-700 border border-sa-200', icon: Bot },
  agent_notify: { labelAr: 'وكيل + إشعار', labelEn: 'Agent + Notify', badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200', icon: BellRing },
  human_approves: { labelAr: 'يعتمد بشري', labelEn: 'Human Approves', badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200', icon: UserCheck },
  human_only: { labelAr: 'بشري فقط', labelEn: 'Human Only', badgeClass: 'bg-gray-50 text-gray-600 border border-gray-200', icon: User },
};

const statusConfig: Record<TaskStatus, { icon: typeof Loader2; className: string; labelAr: string; labelEn: string }> = {
  running: { icon: Loader2, className: 'text-sa-600 animate-spin', labelAr: 'يعمل', labelEn: 'Running' },
  completed: { icon: CheckCircle2, className: 'text-blue-500', labelAr: 'مكتمل', labelEn: 'Done' },
  scheduled: { icon: Clock, className: 'text-amber-500', labelAr: 'مجدول', labelEn: 'Scheduled' },
  idle: { icon: Minus, className: 'text-gray-400', labelAr: 'خامل', labelEn: 'Idle' },
  failed: { icon: XCircle, className: 'text-red-500', labelAr: 'فشل', labelEn: 'Failed' },
};

type SortKey = 'id' | 'name' | 'category' | 'mode' | 'status' | 'lastExecution' | 'countToday' | 'successRate';

interface Props {
  filterCategory: FilterCategory;
  filterMode: FilterMode;
  filterStatus: FilterStatus;
  searchQuery: string;
  onSelectTask: (task: AgentTask) => void;
}

export default function TaskTable({ filterCategory, filterMode, filterStatus, searchQuery, onSelectTask }: Props) {
  const { lang, t } = useLanguage();
  const [sortKey, setSortKey] = useState<SortKey>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const filteredTasks = useMemo(() => {
    let result = allTasks;

    if (filterCategory !== 'all') {
      result = result.filter(task => task.category === filterCategory);
    }
    if (filterMode !== 'all') {
      result = result.filter(task => task.mode === filterMode);
    }
    if (filterStatus !== 'all') {
      result = result.filter(task => task.status === filterStatus);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(task =>
        task.name.toLowerCase().includes(q) ||
        task.nameAr.includes(q) ||
        task.description.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case 'id': comparison = a.id - b.id; break;
        case 'name': comparison = a.name.localeCompare(b.name); break;
        case 'category': comparison = a.category.localeCompare(b.category); break;
        case 'mode': comparison = a.mode.localeCompare(b.mode); break;
        case 'status': comparison = a.status.localeCompare(b.status); break;
        case 'countToday': comparison = a.countToday - b.countToday; break;
        case 'successRate': comparison = (a.successRate ?? 0) - (b.successRate ?? 0); break;
        default: comparison = 0;
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [filterCategory, filterMode, filterStatus, searchQuery, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: SortKey }) => (
    <th
      className="text-start px-4 py-3 font-medium cursor-pointer hover:text-gray-700 transition-colors select-none"
      onClick={() => toggleSort(sortKeyName)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortKey === sortKeyName && (
          sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
        )}
      </div>
    </th>
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-gray-900">
            {t('جدول المهام التفصيلي', 'Task Detail Table')}
          </h3>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
            {filteredTasks.length}/{allTasks.length}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-100">
              <SortHeader label="#" sortKeyName="id" />
              <SortHeader label={t('المهمة', 'Task Name')} sortKeyName="name" />
              <SortHeader label={t('الفئة', 'Category')} sortKeyName="category" />
              <SortHeader label={t('الاستقلالية', 'Autonomy')} sortKeyName="mode" />
              <SortHeader label={t('الحالة', 'Status')} sortKeyName="status" />
              <SortHeader label={t('آخر تشغيل', 'Last Run')} sortKeyName="lastExecution" />
              <SortHeader label={t('اليوم', 'Today')} sortKeyName="countToday" />
              <SortHeader label={t('نسبة النجاح', 'Success')} sortKeyName="successRate" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTasks.map((task, i) => {
              const mode = modeConfig[task.mode];
              const ModeIcon = mode.icon;
              const status = statusConfig[task.status];
              const StatusIcon = status.icon;
              const catConfig = CATEGORY_CONFIG[task.category];
              const CatIcon = categoryIcons[task.category] || BarChart3;

              return (
                <motion.tr
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => onSelectTask(task)}
                  className="hover:bg-gray-50 cursor-pointer transition-colors group"
                >
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs">{task.id}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                      {lang === 'ar' ? task.nameAr : task.name}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <CatIcon className="w-3.5 h-3.5" style={{ color: catConfig?.color }} />
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${mode.badgeClass}`}>
                      <ModeIcon className="w-3 h-3" />
                      {t(mode.labelAr, mode.labelEn)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <StatusIcon className={`w-3.5 h-3.5 ${status.className}`} />
                      <span className="text-xs text-gray-500">{t(status.labelAr, status.labelEn)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs font-mono">{task.lastExecution}</td>
                  <td className="px-4 py-3 text-gray-700 font-semibold tabular-nums">{task.countToday.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    {task.successRate != null && (
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${task.successRate}%`,
                              backgroundColor: task.successRate >= 98 ? '#25935F' : task.successRate >= 95 ? '#2E90FA' : task.successRate >= 90 ? '#F79009' : '#F04438',
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 tabular-nums">{task.successRate}%</span>
                      </div>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredTasks.length === 0 && (
        <div className="py-12 text-center text-gray-400">
          <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>{t('لا توجد مهام مطابقة', 'No matching tasks found')}</p>
        </div>
      )}
    </div>
  );
}
