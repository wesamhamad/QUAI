import { Bot, AlertTriangle, Calendar, Mail, BarChart3, ArrowRight, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { AgentAction } from '../data/mockAdvisorData';

const iconMap = {
  alert: AlertTriangle,
  meeting: Calendar,
  email: Mail,
  analysis: BarChart3,
  referral: ArrowRight,
};

const statusConfig = {
  completed: { cls: 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-400', icon: CheckCircle },
  pending_approval: { cls: 'bg-warning-100 text-warning-600', icon: ShieldAlert },
  scheduled: { cls: 'bg-sa-100 text-sa-600 dark:bg-sa-900/50 dark:text-sa-300', icon: Clock },
};

interface Props {
  actions: AgentAction[];
}

function timeAgo(timestamp: string, isAr: boolean): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return isAr ? 'الآن' : 'Just now';
  if (mins < 60) return isAr ? `منذ ${mins} د` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return isAr ? `منذ ${hrs} س` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return isAr ? `منذ ${days} ي` : `${days}d ago`;
}

export default function AgentActionsFeed({ actions }: Props) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-sa-50 dark:bg-sa-950">
          <Bot className="w-4 h-4 text-sa-600 dark:text-sa-400" />
        </div>
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">
          {t('إجراءات الوكيل الذكي', 'AI Agent Actions')}
        </h3>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sa-500 text-white">
          {actions.length}
        </span>
      </div>

      <div className="space-y-1">
        {actions.map(action => {
          const Icon = iconMap[action.typeIcon];
          const status = statusConfig[action.status];
          const StatusIcon = status.icon;
          return (
            <div
              key={action.id}
              className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
            >
              <div className="shrink-0 mt-0.5 p-1.5 rounded-lg bg-sa-50 dark:bg-sa-950">
                <Icon className="w-3.5 h-3.5 text-sa-600 dark:text-sa-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sa-700 dark:text-sa-300">{isAr ? action.studentName : action.studentNameEn}</span>
                  <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${status.cls}`}>
                    <StatusIcon className="w-2.5 h-2.5" />
                    {action.status === 'completed' ? t('مكتمل', 'Done') : action.status === 'pending_approval' ? t('بانتظار الموافقة', 'Needs Approval') : t('مجدول', 'Scheduled')}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {isAr ? action.actionAr : action.actionEn}
                </p>
              </div>
              <span className="text-[10px] text-gray-400 shrink-0 mt-1">
                {timeAgo(action.timestamp, isAr)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
