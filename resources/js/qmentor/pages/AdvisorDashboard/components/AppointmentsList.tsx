import { ClockIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Appointment } from '../types';

interface AppointmentsListProps {
  appointments: Appointment[];
}

export default function AppointmentsList({ appointments }: AppointmentsListProps) {
  const { t } = useLanguage();
  const today = appointments.filter(a => a.isToday);
  const upcoming = appointments.filter(a => !a.isToday);

  return (
    <div>
      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
        {t('المواعيد القادمة', 'Upcoming Appointments')}
      </h3>

      {today.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-sa-600 dark:text-sa-400 mb-2 flex items-center gap-1">
            <CalendarDaysIcon className="w-3.5 h-3.5" />
            {t('اليوم', 'Today')}
          </p>
          <div className="space-y-2">
            {today.map(apt => (
              <div
                key={apt.id}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-sa-50 dark:bg-sa-950/30 border border-sa-200 dark:border-sa-800"
              >
                <div className="text-center min-w-[40px]">
                  <span className="text-sm font-bold text-sa-600 dark:text-sa-400">{apt.time}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {t(apt.studentName, apt.studentNameEn)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t(apt.typeAr, apt.type)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-1">
            <ClockIcon className="w-3.5 h-3.5" />
            {t('القادمة', 'Upcoming')}
          </p>
          <div className="space-y-2">
            {upcoming.map(apt => (
              <div
                key={apt.id}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/30"
              >
                <div className="text-center min-w-[40px]">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">{apt.time}</p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">{apt.date.slice(5)}</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {t(apt.studentName, apt.studentNameEn)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t(apt.typeAr, apt.type)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
