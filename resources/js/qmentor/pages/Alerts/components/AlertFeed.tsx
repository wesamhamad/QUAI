import { useState } from 'react';
import {
  BellAlertIcon,
  AcademicCapIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowUpCircleIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Alert, AlertType, AlertSeverity, AlertStatus } from '../types';

interface AlertFeedProps {
  alerts: Alert[];
  selectedAlerts: Set<string>;
  onToggleSelect: (id: string) => void;
  onStatusChange: (id: string, status: AlertStatus) => void;
  onViewEscalation: (alert: Alert) => void;
}

const typeIcons: Record<AlertType, typeof BellAlertIcon> = {
  gpa_drop: AcademicCapIcon,
  attendance: CalendarDaysIcon,
  deadline: ClockIcon,
  academic_warning: ExclamationTriangleIcon,
  registration: BellAlertIcon,
  financial: CurrencyDollarIcon,
};

const severityColors: Record<AlertSeverity, string> = {
  info: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400',
  warning: 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400',
  urgent: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
};

const severityDots: Record<AlertSeverity, string> = {
  info: 'bg-info-500',
  warning: 'bg-gold-500',
  urgent: 'bg-orange-500',
  critical: 'bg-error-500',
};

const statusColors: Record<AlertStatus, string> = {
  active: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
  acknowledged: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400',
  dismissed: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
  escalated: 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400',
  resolved: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400',
};

export default function AlertFeed({ alerts, selectedAlerts, onToggleSelect, onStatusChange, onViewEscalation }: AlertFeedProps) {
  const { t } = useLanguage();
  const [filterType, setFilterType] = useState<AlertType | 'all'>('all');
  const [filterSeverity, setFilterSeverity] = useState<AlertSeverity | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<AlertStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const typeLabels: Record<AlertType | 'all', string> = {
    all: t('الكل', 'All'),
    gpa_drop: t('انخفاض المعدل', 'GPA Drop'),
    attendance: t('الحضور', 'Attendance'),
    deadline: t('المواعيد', 'Deadlines'),
    academic_warning: t('إنذار أكاديمي', 'Academic Warning'),
    registration: t('التسجيل', 'Registration'),
    financial: t('المالية', 'Financial'),
  };

  const severityLabels: Record<AlertSeverity | 'all', string> = {
    all: t('الكل', 'All'),
    info: t('معلومة', 'Info'),
    warning: t('تحذير', 'Warning'),
    urgent: t('عاجل', 'Urgent'),
    critical: t('حرج', 'Critical'),
  };

  const statusLabels: Record<AlertStatus | 'all', string> = {
    all: t('الكل', 'All'),
    active: t('نشط', 'Active'),
    acknowledged: t('معترف به', 'Acknowledged'),
    dismissed: t('مرفوض', 'Dismissed'),
    escalated: t('مُصعَّد', 'Escalated'),
    resolved: t('محلول', 'Resolved'),
  };

  const filtered = alerts.filter(a => {
    if (filterType !== 'all' && a.type !== filterType) return false;
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  function formatTimestamp(iso: string) {
    const d = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffH = Math.floor(diffMs / 3600000);
    if (diffH < 1) return t('الآن', 'Just now');
    if (diffH < 24) return t(`منذ ${diffH} ساعة`, `${diffH}h ago`);
    const diffD = Math.floor(diffH / 24);
    if (diffD < 7) return t(`منذ ${diffD} يوم`, `${diffD}d ago`);
    return d.toLocaleDateString();
  }

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('التصفية', 'Filters')}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({filtered.length} {t('من', 'of')} {alerts.length})
            </span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="text-sm text-sa-600 dark:text-sa-400 hover:underline"
          >
            {showFilters ? t('إخفاء', 'Hide') : t('إظهار', 'Show')}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as AlertType | 'all')}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-2 text-gray-700 dark:text-gray-300"
            >
              {Object.entries(typeLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value as AlertSeverity | 'all')}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-2 text-gray-700 dark:text-gray-300"
            >
              {Object.entries(severityLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as AlertStatus | 'all')}
              className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-2 text-gray-700 dark:text-gray-300"
            >
              {Object.entries(statusLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filtered.map(alert => {
          const Icon = typeIcons[alert.type];
          const isSelected = selectedAlerts.has(alert.id);
          return (
            <div
              key={alert.id}
              className={`bg-white dark:bg-gray-800 rounded-xl border transition-all ${
                isSelected
                  ? 'border-sa-500 ring-1 ring-sa-500/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              } p-4`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(alert.id)}
                  className="mt-1 rounded border-gray-300 text-sa-600 focus:ring-sa-500"
                />

                {/* Icon */}
                <div className={`shrink-0 p-2 rounded-lg ${severityColors[alert.severity]}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {t(alert.title, alert.titleEn)}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${severityColors[alert.severity]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${severityDots[alert.severity]}`} />
                      {severityLabels[alert.severity]}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[alert.status]}`}>
                      {statusLabels[alert.status]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {t(alert.description, alert.descriptionEn)}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{t(alert.studentName, alert.studentNameEn)}</span>
                    <span>•</span>
                    <span>{formatTimestamp(alert.timestamp)}</span>
                    <span>•</span>
                    <span className="font-mono">{alert.id}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {alert.status === 'active' && (
                    <>
                      <button
                        onClick={() => onStatusChange(alert.id, 'acknowledged')}
                        title={t('قبول', 'Acknowledge')}
                        className="p-1.5 rounded-lg text-success-600 hover:bg-success-50 dark:hover:bg-success-900/20 transition-colors"
                      >
                        <CheckCircleIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onStatusChange(alert.id, 'dismissed')}
                        title={t('رفض', 'Dismiss')}
                        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onStatusChange(alert.id, 'escalated')}
                        title={t('تصعيد', 'Escalate')}
                        className="p-1.5 rounded-lg text-gold-600 hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-colors"
                      >
                        <ArrowUpCircleIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {alert.escalation && alert.escalation.length > 0 && (
                    <button
                      onClick={() => onViewEscalation(alert)}
                      className="px-2 py-1 text-xs rounded-lg text-sa-600 dark:text-sa-400 hover:bg-sa-50 dark:hover:bg-sa-900/20 transition-colors"
                    >
                      {t('التصعيد', 'Timeline')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <BellAlertIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">{t('لا توجد تنبيهات تطابق الفلتر', 'No alerts match the current filters')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
