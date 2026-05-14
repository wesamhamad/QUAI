import { useState } from 'react';
import { BellAlertIcon, CheckCircleIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { EarlyWarning, RiskLevel } from '../types';
import { categoryMeta } from '../data/riskIndicators';

interface Props {
  warnings: EarlyWarning[];
}

function severityBadge(severity: RiskLevel, t: (ar: string, en: string) => string) {
  const map: Record<RiskLevel, { bg: string; labelAr: string; labelEn: string }> = {
    low: { bg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', labelAr: 'منخفض', labelEn: 'Low' },
    medium: { bg: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', labelAr: 'متوسط', labelEn: 'Medium' },
    high: { bg: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', labelAr: 'مرتفع', labelEn: 'High' },
    critical: { bg: 'bg-red-200 text-red-700 dark:bg-red-900/50 dark:text-red-300', labelAr: 'حرج', labelEn: 'Critical' },
  };
  const s = map[severity];
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.bg}`}>
      {t(s.labelAr, s.labelEn)}
    </span>
  );
}

function formatTime(timestamp: string, lang: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return lang === 'ar' ? 'الآن' : 'Just now';
  if (diffHours < 24) return lang === 'ar' ? `قبل ${diffHours} ساعة` : `${diffHours}h ago`;
  return lang === 'ar' ? `قبل ${diffDays} يوم` : `${diffDays}d ago`;
}

export default function EarlyWarningTriggers({ warnings: initialWarnings }: Props) {
  const { t, lang } = useLanguage();
  const [warnings, setWarnings] = useState(initialWarnings);

  const handleAcknowledge = (id: string) => {
    setWarnings(prev => prev.map(w => w.id === id ? { ...w, acknowledged: true } : w));
  };

  const handleEscalate = (id: string) => {
    setWarnings(prev => prev.map(w => w.id === id ? { ...w, escalated: true, acknowledged: true } : w));
  };

  const unacknowledged = warnings.filter(w => !w.acknowledged).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-error-100 dark:bg-red-900/30">
            <BellAlertIcon className="w-5 h-5 text-error-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {t('تنبيهات الإنذار المبكر', 'Early Warning Triggers')}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {unacknowledged > 0
                ? t(`${unacknowledged} تنبيه غير معالج`, `${unacknowledged} unacknowledged`)
                : t('جميع التنبيهات معالجة', 'All acknowledged')}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {warnings.map(warning => (
          <div
            key={warning.id}
            className={`rounded-lg border p-4 transition-colors ${
              warning.acknowledged
                ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30'
                : 'border-error-200 dark:border-error-800 bg-error-50 dark:bg-red-900/10'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {t(warning.studentName, warning.studentNameEn)}
                  </p>
                  {severityBadge(warning.severity, t)}
                  {warning.escalated && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                      {t('مُصعَّد', 'Escalated')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {t(warning.triggerAr, warning.triggerEn)}
                </p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <span>{categoryMeta[warning.category] && t(categoryMeta[warning.category].nameAr, categoryMeta[warning.category].nameEn)}</span>
                  <span>·</span>
                  <span>{formatTime(warning.timestamp, lang)}</span>
                  <span>·</span>
                  <span>{warning.studentId}</span>
                </div>
              </div>

              {!warning.acknowledged && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleAcknowledge(warning.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-sa-500 text-white hover:bg-sa-600 transition-colors"
                  >
                    <CheckCircleIcon className="w-3.5 h-3.5" />
                    {t('معالجة', 'Acknowledge')}
                  </button>
                  <button
                    onClick={() => handleEscalate(warning.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-error-300 dark:border-error-700 text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <ArrowUpCircleIcon className="w-3.5 h-3.5" />
                    {t('تصعيد', 'Escalate')}
                  </button>
                </div>
              )}

              {warning.acknowledged && !warning.escalated && (
                <CheckCircleIcon className="w-5 h-5 text-sa-500 shrink-0" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
