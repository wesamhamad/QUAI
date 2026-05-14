import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Student, InterventionType, InterventionSeverity } from '../types';

interface InterventionModalProps {
  open: boolean;
  onClose: () => void;
  students: Student[];
  onSave?: (intervention: {
    studentId: string;
    type: InterventionType;
    severity: InterventionSeverity;
    summary: string;
    followUpDate: string;
  }) => void;
}

const severityColors: Record<InterventionSeverity, string> = {
  urgent: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
  high: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400',
  normal: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400',
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

export default function InterventionModal({ open, onClose, students, onSave }: InterventionModalProps) {
  const { t, lang } = useLanguage();
  const [studentId, setStudentId] = useState('');
  const [type, setType] = useState<InterventionType>('meeting');
  const [severity, setSeverity] = useState<InterventionSeverity>('normal');
  const [summary, setSummary] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  if (!open) return null;

  const resetForm = () => {
    setStudentId('');
    setType('meeting');
    setSeverity('normal');
    setSummary('');
    setFollowUpDate('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave?.({ studentId, type, severity, summary, followUpDate });
    resetForm();
    onClose();
  };

  const selectClasses = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('إضافة تدخل جديد', 'Add New Intervention')}
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <XMarkIcon className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('الطالب', 'Student')}
            </label>
            <select value={studentId} onChange={e => setStudentId(e.target.value)} required className={selectClasses}>
              <option value="">{t('اختر الطالب...', 'Select student...')}</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>
                  {lang === 'ar' ? s.name : s.nameEn} ({s.id})
                </option>
              ))}
            </select>
          </div>

          {/* Type + Severity row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('نوع التدخل', 'Type')}
              </label>
              <select value={type} onChange={e => setType(e.target.value as InterventionType)} className={selectClasses}>
                <option value="meeting">{t('اجتماع', 'Meeting')}</option>
                <option value="email">{t('بريد إلكتروني', 'Email')}</option>
                <option value="referral">{t('تحويل', 'Referral')}</option>
                <option value="counseling">{t('إرشاد نفسي', 'Counseling')}</option>
                <option value="flag">{t('علامة للمراجعة', 'Flag for Review')}</option>
                <option value="note">{t('ملاحظة', 'Note')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('الأولوية', 'Severity')}
              </label>
              <select value={severity} onChange={e => setSeverity(e.target.value as InterventionSeverity)} className={selectClasses}>
                <option value="urgent">{t('عاجل', 'Urgent')}</option>
                <option value="high">{t('مرتفع', 'High')}</option>
                <option value="normal">{t('عادي', 'Normal')}</option>
                <option value="low">{t('منخفض', 'Low')}</option>
              </select>
            </div>
          </div>

          {/* Severity preview */}
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${severityColors[severity]}`}>
            {severity === 'urgent' ? t('عاجل — يتطلب إجراء فوري', 'Urgent — requires immediate action')
              : severity === 'high' ? t('أولوية مرتفعة', 'High priority')
              : severity === 'normal' ? t('أولوية عادية', 'Normal priority')
              : t('أولوية منخفضة', 'Low priority')}
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('ملاحظات التدخل', 'Intervention Notes')}
            </label>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              required
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sa-500 resize-none"
              placeholder={t('اكتب ملخص التدخل...', 'Write intervention summary...')}
            />
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('تاريخ المتابعة', 'Follow-up Date')}
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={e => setFollowUpDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={selectClasses}
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {t('اختياري — سيتم تذكيرك بالمتابعة', 'Optional — you will be reminded to follow up')}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-sa-500 text-white text-sm font-medium hover:bg-sa-600 transition-colors"
            >
              {t('حفظ التدخل', 'Save Intervention')}
            </button>
            <button
              type="button"
              onClick={() => { resetForm(); onClose(); }}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              {t('إلغاء', 'Cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
