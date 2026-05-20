import React from 'react';
import { Calendar, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { useQuEvents } from '../../../hooks/useStudentData';
import { useLanguage } from '../../../contexts/LanguageContext';

interface QuEvent {
  id: number;
  title: string;
  link: string;
  type: string;
  location: string;
  startDate: string | null;
  endDate: string | null;
}

function formatDate(dateStr: string | null, locale: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

function eventTypeLabel(type: string, isAr: boolean): { label: string; color: string } {
  switch (type) {
    case 'academic': return { label: isAr ? 'أكاديمي' : 'Academic', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' };
    case 'event': return { label: isAr ? 'فعالية' : 'Event', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
    default: return { label: isAr ? 'عام' : 'General', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' };
  }
}

export default function QuEvents() {
  const { t, lang } = useLanguage();
  const locale = lang === 'ar' ? 'ar-SA' : 'en-US';
  const { data: rawEvents, isLoading, source } = useQuEvents();
  const events = (rawEvents as QuEvent[]).filter(e => {
    if (!e.startDate) return true;
    return new Date(e.startDate) >= new Date();
  }).slice(0, 6);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t('فعاليات الجامعة المقترحة', 'Suggested University Events')}</h3>
        </div>
        <a href="https://www.qu.edu.sa/events" target="_blank" rel="noopener noreferrer"
           className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
          {t('عرض الكل', 'View all')} <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500">{t('جاري تحميل الفعاليات...', 'Loading events...')}</div>
      ) : events.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t('لا توجد فعاليات قادمة', 'No upcoming events')}</div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const { label, color } = eventTypeLabel(event.type, lang === 'ar');
            return (
              <a key={event.id} href={event.link} target="_blank" rel="noopener noreferrer"
                 className="block p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover:shadow-sm transition-all group">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                      {event.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                      {event.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {formatDate(event.startDate, locale)}
                          {event.endDate && event.endDate !== event.startDate && ` — ${formatDate(event.endDate, locale)}`}
                        </span>
                      )}
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
                    {label}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {source === 'api' && (
        <p className="text-[10px] text-gray-400 mt-3 text-center">
          {t('المصدر: qu.edu.sa/events — يتم التحديث تلقائياً', 'Source: qu.edu.sa/events — updated automatically')}
        </p>
      )}
    </div>
  );
}
