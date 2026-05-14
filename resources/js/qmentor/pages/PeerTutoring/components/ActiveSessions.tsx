import { ClockIcon, MapPinIcon, StarIcon, CheckCircleIcon, XCircleIcon, PlayCircleIcon, CalendarIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../../../contexts/LanguageContext';
import { sessions, getSubjectName } from '../data/mockTutoringData';
import type { SessionStatus } from '../types';

const statusConfig: Record<SessionStatus, { labelAr: string; labelEn: string; color: string; Icon: typeof ClockIcon }> = {
  scheduled: { labelAr: 'مجدولة', labelEn: 'Scheduled', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300', Icon: CalendarIcon },
  in_progress: { labelAr: 'جارية', labelEn: 'In Progress', color: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300', Icon: PlayCircleIcon },
  completed: { labelAr: 'مكتملة', labelEn: 'Completed', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300', Icon: CheckCircleIcon },
  cancelled: { labelAr: 'ملغاة', labelEn: 'Cancelled', color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-300', Icon: XCircleIcon },
};

export default function ActiveSessions() {
  const { t, lang } = useLanguage();

  const upcoming = sessions.filter(s => s.status === 'scheduled' || s.status === 'in_progress');
  const past = sessions.filter(s => s.status === 'completed' || s.status === 'cancelled');

  return (
    <div className="space-y-6">
      {/* Upcoming */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <ClockIcon className="w-5 h-5 text-sa-500" />
          {t('الجلسات القادمة', 'Upcoming Sessions')}
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sa-100 dark:bg-sa-900/20 text-sa-700 dark:text-sa-300">
            {upcoming.length}
          </span>
        </h3>
        {upcoming.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
            {t('لا توجد جلسات قادمة', 'No upcoming sessions')}
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map(session => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>

      {/* Past */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
          {t('الجلسات السابقة', 'Past Sessions')}
        </h3>
        <div className="space-y-3">
          {past.map(session => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: typeof sessions[0] }) {
  const { t, lang } = useLanguage();
  const cfg = statusConfig[session.status];
  const StatusIcon = cfg.Icon;
  const tutorName = lang === 'ar' ? session.tutorNameAr : session.tutorNameEn;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 dark:text-white">{tutorName}</h4>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
              <StatusIcon className="w-3 h-3" />
              {lang === 'ar' ? cfg.labelAr : cfg.labelEn}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="px-2 py-0.5 rounded bg-sa-50 dark:bg-sa-900/20 text-sa-700 dark:text-sa-300 font-medium">
              {getSubjectName(session.subject, lang)}
            </span>
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              {session.date}
            </span>
            <span className="flex items-center gap-1">
              <ClockIcon className="w-3.5 h-3.5" />
              {session.startHour}:00 - {session.endHour}:00
            </span>
            <span className="flex items-center gap-1">
              <MapPinIcon className="w-3.5 h-3.5" />
              {session.location === 'online' ? t('عن بُعد', 'Online') : t('حضوري', 'Campus')}
            </span>
          </div>
        </div>

        {session.rating && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} className={`w-4 h-4 ${i < session.rating! ? 'text-gold-500' : 'text-gray-200 dark:text-gray-600'}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
