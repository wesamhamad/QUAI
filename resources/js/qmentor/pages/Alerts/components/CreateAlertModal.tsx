import { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { AlertType, AlertSeverity } from '../types';

interface CreateAlertModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    type: AlertType;
    severity: AlertSeverity;
    studentId: string;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
  }) => void;
}

export default function CreateAlertModal({ open, onClose, onCreate }: CreateAlertModalProps) {
  const { t } = useLanguage();
  const [type, setType] = useState<AlertType>('academic_warning');
  const [severity, setSeverity] = useState<AlertSeverity>('warning');
  const [studentId, setStudentId] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descAr, setDescAr] = useState('');
  const [descEn, setDescEn] = useState('');

  if (!open) return null;

  const typeOptions: { value: AlertType; label: string }[] = [
    { value: 'gpa_drop', label: t('انخفاض المعدل', 'GPA Drop') },
    { value: 'attendance', label: t('الحضور', 'Attendance') },
    { value: 'deadline', label: t('المواعيد', 'Deadlines') },
    { value: 'academic_warning', label: t('إنذار أكاديمي', 'Academic Warning') },
    { value: 'registration', label: t('التسجيل', 'Registration') },
    { value: 'financial', label: t('المالية', 'Financial') },
  ];

  const severityOptions: { value: AlertSeverity; label: string }[] = [
    { value: 'info', label: t('معلومة', 'Info') },
    { value: 'warning', label: t('تحذير', 'Warning') },
    { value: 'critical', label: t('حرج', 'Critical') },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onCreate({ type, severity, studentId, titleAr, titleEn, descriptionAr: descAr, descriptionEn: descEn });
    onClose();
    setStudentId('');
    setTitleAr('');
    setTitleEn('');
    setDescAr('');
    setDescEn('');
  }

  const inputClass = 'w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-2 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-sa-500 focus:border-sa-500';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('إنشاء تنبيه', 'Create Alert')}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('النوع', 'Type')}</label>
              <select value={type} onChange={e => setType(e.target.value as AlertType)} className={inputClass}>
                {typeOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t('الخطورة', 'Severity')}</label>
              <select value={severity} onChange={e => setSeverity(e.target.value as AlertSeverity)} className={inputClass}>
                {severityOptions.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>{t('رقم الطالب', 'Student ID')}</label>
            <input
              type="text"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              placeholder="STU-001000"
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('العنوان (عربي)', 'Title (Arabic)')}</label>
              <input type="text" value={titleAr} onChange={e => setTitleAr(e.target.value)} className={inputClass} dir="rtl" required />
            </div>
            <div>
              <label className={labelClass}>{t('العنوان (إنجليزي)', 'Title (English)')}</label>
              <input type="text" value={titleEn} onChange={e => setTitleEn(e.target.value)} className={inputClass} dir="ltr" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('الوصف (عربي)', 'Description (Arabic)')}</label>
              <textarea value={descAr} onChange={e => setDescAr(e.target.value)} rows={3} className={inputClass} dir="rtl" required />
            </div>
            <div>
              <label className={labelClass}>{t('الوصف (إنجليزي)', 'Description (English)')}</label>
              <textarea value={descEn} onChange={e => setDescEn(e.target.value)} rows={3} className={inputClass} dir="ltr" required />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {t('إلغاء', 'Cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-sm font-medium bg-sa-500 text-white hover:bg-sa-600 transition-colors"
            >
              {t('إنشاء', 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
