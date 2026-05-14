import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Bot, BellRing, UserCheck, User, Clock, Database, TrendingUp,
  CheckCircle, Loader2, Minus, XCircle,
  BarChart3, ShieldAlert, Bell, AlertTriangle, AlertOctagon,
  MessageSquare, BookOpen, Settings,
} from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { CATEGORY_CONFIG } from '../data/agentTasks';
import { mockActivityFeed } from '../data/mockActivityFeed';
import type { AgentTask, AutonomyMode, TaskStatus } from '../types';

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

const modeConfig: Record<AutonomyMode, { labelAr: string; labelEn: string; color: string; icon: typeof Bot }> = {
  autonomous: { labelAr: 'مستقل بالكامل', labelEn: 'Fully Autonomous', color: '#25935F', icon: Bot },
  agent_notify: { labelAr: 'وكيل + إشعار بشري', labelEn: 'Agent + Notify', color: '#2E90FA', icon: BellRing },
  human_approves: { labelAr: 'يعتمد بشري', labelEn: 'Human Approves', color: '#F79009', icon: UserCheck },
  human_only: { labelAr: 'بشري فقط', labelEn: 'Human Only', color: '#9DA4AE', icon: User },
};

const statusConfig: Record<TaskStatus, { labelAr: string; labelEn: string; className: string; icon: typeof Loader2 }> = {
  running: { labelAr: 'يعمل الآن', labelEn: 'Running', className: 'text-sa-600', icon: Loader2 },
  completed: { labelAr: 'مكتمل', labelEn: 'Completed', className: 'text-blue-500', icon: CheckCircle },
  scheduled: { labelAr: 'مجدول', labelEn: 'Scheduled', className: 'text-amber-500', icon: Clock },
  idle: { labelAr: 'خامل', labelEn: 'Idle', className: 'text-gray-400', icon: Minus },
  failed: { labelAr: 'فشل', labelEn: 'Failed', className: 'text-red-500', icon: XCircle },
};

function getTaskLog(taskId: number) {
  return mockActivityFeed
    .filter(entry => entry.taskId === taskId)
    .slice(0, 5);
}

interface Props {
  task: AgentTask | null;
  onClose: () => void;
}

export default function DrillDownPanel({ task, onClose }: Props) {
  const { lang, t } = useLanguage();

  if (!task) return null;

  const mode = modeConfig[task.mode];
  const ModeIcon = mode.icon;
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;
  const catConfig = CATEGORY_CONFIG[task.category];
  const CatIcon = categoryIcons[task.category] || BarChart3;
  const relatedLogs = getTaskLog(task.id);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-gray-200 overflow-y-auto shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${catConfig?.color}12` }}>
                  <CatIcon className="w-5 h-5" style={{ color: catConfig?.color }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {lang === 'ar' ? task.nameAr : task.name}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {t('المهمة', 'Task')} #{task.id}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-5 space-y-6">
            {/* Status + Mode badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border" style={{ backgroundColor: `${mode.color}08`, borderColor: `${mode.color}25` }}>
                <ModeIcon className="w-4 h-4" style={{ color: mode.color }} />
                <span className="text-sm font-medium" style={{ color: mode.color }}>
                  {t(mode.labelAr, mode.labelEn)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
                <StatusIcon className={`w-4 h-4 ${status.className} ${task.status === 'running' ? 'animate-spin' : ''}`} />
                <span className={`text-sm font-medium ${status.className}`}>
                  {t(status.labelAr, status.labelEn)}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">{t('الوصف', 'Description')}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {lang === 'ar' ? task.descriptionAr : task.description}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] text-gray-400 uppercase">{t('التكرار', 'Frequency')}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {lang === 'ar' ? task.frequencyAr : task.frequency}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] text-gray-400 uppercase">{t('آخر تشغيل', 'Last Run')}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{task.lastExecution}</p>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] text-gray-400 uppercase">{t('اليوم', 'Today')}</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{task.countToday.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[10px] text-gray-400 uppercase">{t('نسبة النجاح', 'Success Rate')}</span>
                </div>
                {task.successRate != null ? (
                  <div>
                    <p className="text-sm font-bold text-gray-900">{task.successRate}%</p>
                    <div className="w-full h-1.5 rounded-full bg-gray-200 mt-1 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${task.successRate}%`,
                          backgroundColor: task.successRate >= 98 ? '#25935F' : task.successRate >= 95 ? '#2E90FA' : '#F79009',
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">-</p>
                )}
              </div>
            </div>

            {/* Average Duration */}
            {task.avgDuration && (
              <div>
                <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">{t('متوسط المدة', 'Avg Duration')}</h4>
                <p className="text-sm font-medium text-gray-700 font-mono">{task.avgDuration}</p>
              </div>
            )}

            {/* Data Sources */}
            <div>
              <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                <Database className="w-3.5 h-3.5 inline mr-1" />
                {t('مصادر البيانات', 'Data Sources')}
              </h4>
              <div className="flex flex-wrap gap-2">
                {task.dataSources.map(source => (
                  <span key={source} className="text-xs px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-600">
                    {source}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Activity Logs */}
            {relatedLogs.length > 0 && (
              <div>
                <h4 className="text-xs text-gray-400 uppercase tracking-wider mb-2">{t('سجل الأحداث الأخيرة', 'Recent Logs')}</h4>
                <div className="space-y-2">
                  {relatedLogs.map(log => (
                    <div key={log.id} className="rounded-lg bg-gray-50 border border-gray-100 p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-gray-400 font-mono">{log.timestamp}</span>
                        {log.duration && (
                          <span className="text-[10px] text-gray-400">{log.duration}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">
                        {lang === 'ar' ? log.messageAr : log.message}
                      </p>
                      {log.details && (
                        <p className="text-[11px] text-gray-400 mt-1">
                          {lang === 'ar' ? log.detailsAr : log.details}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {relatedLogs.length === 0 && (
              <div className="text-center py-6 text-gray-400 text-sm">
                {t('لا توجد سجلات أحداث حديثة', 'No recent activity logs for this task')}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
