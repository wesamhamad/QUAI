import { useState } from 'react';
import { AcademicCapIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import { subjects, dayLabels, formatHour } from '../data/mockTutoringData';
import type { TutoringSubject, AvailabilityDay } from '../types';

const days: AvailabilityDay[] = ['sun', 'mon', 'tue', 'wed', 'thu'];
const timeRanges = [
  { start: 8, end: 10, labelAr: '٨-١٠ ص', labelEn: '8-10 AM' },
  { start: 10, end: 12, labelAr: '١٠-١٢ ص', labelEn: '10-12 PM' },
  { start: 12, end: 14, labelAr: '١٢-٢ م', labelEn: '12-2 PM' },
  { start: 14, end: 16, labelAr: '٢-٤ م', labelEn: '2-4 PM' },
  { start: 16, end: 18, labelAr: '٤-٦ م', labelEn: '4-6 PM' },
];

export default function BecomeTutorForm() {
  const { t, lang } = useLanguage();
  const [isTutor, setIsTutor] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<TutoringSubject[]>([]);
  const [availability, setAvailability] = useState<Record<string, boolean>>({});
  const [bio, setBio] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleSubject = (key: TutoringSubject) => {
    setSelectedSubjects(prev =>
      prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]
    );
  };

  const toggleSlot = (day: AvailabilityDay, rangeIdx: number) => {
    const key = `${day}-${rangeIdx}`;
    setAvailability(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = () => {
    if (selectedSubjects.length > 0) setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
          <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('تم التسجيل كمدرس بنجاح!', 'Successfully registered as a tutor!')}
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          {t('ستظهر في قائمة المدرسين المتاحين', 'You will appear in the available tutors list')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Opt-in Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AcademicCapIcon className="w-6 h-6 text-sa-500" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t('أريد أن أكون مدرساً', 'I want to become a tutor')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('سجّل كمدرس لمساعدة زملائك', 'Register as a tutor to help your peers')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTutor(!isTutor)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isTutor ? 'bg-sa-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              isTutor ? 'start-6' : 'start-0.5'
            }`} />
          </button>
        </div>
      </div>

      {isTutor && (
        <>
          {/* Subject Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('المواد التي تستطيع تدريسها', 'Subjects you can tutor')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {subjects.map(sub => {
                const selected = selectedSubjects.includes(sub.key);
                return (
                  <button
                    key={sub.key}
                    onClick={() => toggleSubject(sub.key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      selected
                        ? 'bg-sa-500 text-white'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <sub.icon className="w-4 h-4" />
                    {lang === 'ar' ? sub.nameAr : sub.nameEn}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Availability Grid */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('أوقات التوفر', 'Availability')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-start text-xs text-gray-500 dark:text-gray-400" />
                    {timeRanges.map((r, i) => (
                      <th key={i} className="p-2 text-center text-xs text-gray-500 dark:text-gray-400">
                        {lang === 'ar' ? r.labelAr : r.labelEn}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map(day => (
                    <tr key={day}>
                      <td className="p-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {dayLabels[day]?.[lang]}
                      </td>
                      {timeRanges.map((_, ri) => {
                        const active = availability[`${day}-${ri}`];
                        return (
                          <td key={ri} className="p-1 text-center">
                            <button
                              onClick={() => toggleSlot(day, ri)}
                              className={`w-full py-2 rounded-lg transition-colors ${
                                active
                                  ? 'bg-sa-500 text-white'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-sa-100 dark:hover:bg-sa-900/20'
                              }`}
                            >
                              {active ? '✓' : '—'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              {t('نبذة عنك', 'About You')}
            </h3>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              placeholder={t('اكتب نبذة مختصرة عن خبرتك وأسلوبك في التدريس...', 'Write a brief bio about your experience and teaching style...')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm resize-none focus:ring-2 focus:ring-sa-500 focus:border-transparent"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={selectedSubjects.length === 0}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
              selectedSubjects.length > 0
                ? 'bg-sa-500 text-white hover:bg-sa-600 shadow-sm'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            }`}
          >
            {t('تسجيل كمدرس', 'Register as Tutor')}
          </button>
        </>
      )}
    </div>
  );
}
