import { useState } from 'react';
import { CalendarIcon, MapPinIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import { tutors, subjects, dayLabels, formatHour } from '../data/mockTutoringData';
import type { SessionLocation, AvailabilityDay } from '../types';

const days: AvailabilityDay[] = ['sun', 'mon', 'tue', 'wed', 'thu'];
const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 8 AM to 5 PM

export default function SessionScheduler() {
  const { t, lang } = useLanguage();
  const [selectedTutor, setSelectedTutor] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDay, setSelectedDay] = useState<AvailabilityDay | ''>('');
  const [selectedHour, setSelectedHour] = useState<number | ''>('');
  const [location, setLocation] = useState<SessionLocation>('online');
  const [booked, setBooked] = useState(false);

  const tutor = tutors.find(t => t.id === selectedTutor);
  const availableHours = tutor && selectedDay
    ? tutor.availability
        .filter(s => s.day === selectedDay)
        .flatMap(s => hours.filter(h => h >= s.startHour && h < s.endHour))
    : [];

  const canBook = selectedTutor && selectedSubject && selectedDay && selectedHour !== '';

  const handleBook = () => {
    if (canBook) setBooked(true);
  };

  if (booked) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
          <CheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('تم حجز الجلسة بنجاح!', 'Session booked successfully!')}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          {t('ستتلقى إشعاراً بتأكيد الموعد', 'You will receive a confirmation notification')}
        </p>
        <button
          onClick={() => setBooked(false)}
          className="px-6 py-2.5 rounded-xl bg-sa-500 text-white text-sm font-medium hover:bg-sa-600 transition-colors"
        >
          {t('حجز جلسة أخرى', 'Book another session')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-sa-500" />
          {t('حجز جلسة تدريس', 'Book a Tutoring Session')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tutor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('اختر المدرس', 'Select Tutor')}
            </label>
            <select
              value={selectedTutor}
              onChange={e => { setSelectedTutor(e.target.value); setSelectedDay(''); setSelectedHour(''); }}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="">{t('-- اختر --', '-- Select --')}</option>
              {tutors.map(t => (
                <option key={t.id} value={t.id}>{lang === 'ar' ? t.nameAr : t.nameEn}</option>
              ))}
            </select>
          </div>

          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('المادة', 'Subject')}
            </label>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              <option value="">{t('-- اختر المادة --', '-- Select Subject --')}</option>
              {(tutor ? tutor.subjects : subjects.map(s => s.key)).map(key => {
                const sub = subjects.find(s => s.key === key);
                return <option key={key} value={key}>{sub ? (lang === 'ar' ? sub.nameAr : sub.nameEn) : key}</option>;
              })}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('الموقع', 'Location')}
            </label>
            <div className="flex gap-2">
              {(['online', 'campus'] as SessionLocation[]).map(loc => (
                <button
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    location === loc
                      ? 'bg-sa-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <MapPinIcon className="w-4 h-4" />
                  {loc === 'online' ? t('عن بُعد', 'Online') : t('حضوري', 'Campus')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      {tutor && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            {t('اختر الموعد', 'Select Time')}
          </h3>

          {/* Day Selector */}
          <div className="flex gap-2 mb-4">
            {days.map(day => {
              const hasSlots = tutor.availability.some(s => s.day === day);
              return (
                <button
                  key={day}
                  disabled={!hasSlots}
                  onClick={() => { setSelectedDay(day); setSelectedHour(''); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    selectedDay === day
                      ? 'bg-sa-500 text-white'
                      : hasSlots
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        : 'bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  {dayLabels[day]?.[lang]}
                </button>
              );
            })}
          </div>

          {/* Time Slots */}
          {selectedDay && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {availableHours.map(hour => (
                <button
                  key={hour}
                  onClick={() => setSelectedHour(hour)}
                  className={`py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    selectedHour === hour
                      ? 'bg-sa-500 text-white'
                      : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-sa-50 dark:hover:bg-sa-900/20 hover:text-sa-600'
                  }`}
                >
                  {formatHour(hour)}
                </button>
              ))}
              {availableHours.length === 0 && (
                <p className="col-span-full text-center text-sm text-gray-400 py-4">
                  {t('لا توجد أوقات متاحة في هذا اليوم', 'No available times on this day')}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={handleBook}
        disabled={!canBook}
        className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
          canBook
            ? 'bg-sa-500 text-white hover:bg-sa-600 shadow-sm'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        {t('تأكيد الحجز', 'Confirm Booking')}
      </button>
    </div>
  );
}
