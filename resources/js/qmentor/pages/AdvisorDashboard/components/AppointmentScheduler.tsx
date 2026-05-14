import { useState } from 'react';
import { XMarkIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Student } from '../types';

interface AppointmentSchedulerProps {
  open: boolean;
  onClose: () => void;
  students: Student[];
  onSchedule?: (appointment: {
    studentId: string;
    date: string;
    time: string;
    type: string;
    notes: string;
  }) => void;
}

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30',
];

export default function AppointmentScheduler({ open, onClose, students, onSchedule }: AppointmentSchedulerProps) {
  const { t, lang } = useLanguage();
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('check-in');
  const [notes, setNotes] = useState('');

  if (!open) return null;

  const resetForm = () => {
    setStudentId('');
    setDate('');
    setTime('');
    setAppointmentType('check-in');
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSchedule?.({ studentId, date, time, type: appointmentType, notes });
    resetForm();
    onClose();
  };

  const selectClasses = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {t('جدولة موعد', 'Schedule Appointment')}
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

          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('نوع الموعد', 'Appointment Type')}
            </label>
            <select value={appointmentType} onChange={e => setAppointmentType(e.target.value)} className={selectClasses}>
              <option value="check-in">{t('متابعة دورية', 'Check-in')}</option>
              <option value="academic-review">{t('مراجعة أكاديمية', 'Academic Review')}</option>
              <option value="counseling">{t('إرشاد', 'Counseling')}</option>
              <option value="follow-up">{t('متابعة', 'Follow-up')}</option>
              <option value="emergency">{t('طارئ', 'Emergency')}</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('التاريخ', 'Date')}
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className={selectClasses}
            />
          </div>

          {/* Time Slot Grid */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('الوقت', 'Time Slot')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                    time === slot
                      ? 'bg-sa-500 text-white shadow-sm ring-2 ring-sa-300'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <ClockIcon className="w-3 h-3" />
                  {slot}
                </button>
              ))}
            </div>
            {!time && (
              <p className="text-xs text-gray-400 mt-1">{t('اختر وقت الموعد', 'Select a time slot')}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('ملاحظات', 'Notes')}
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sa-500 resize-none"
              placeholder={t('ملاحظات إضافية...', 'Additional notes...')}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={!time}
              className="flex-1 py-2.5 rounded-xl bg-sa-500 text-white text-sm font-medium hover:bg-sa-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('تأكيد الموعد', 'Confirm Appointment')}
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
