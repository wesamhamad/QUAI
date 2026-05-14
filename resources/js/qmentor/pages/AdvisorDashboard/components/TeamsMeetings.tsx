import { useState, useEffect } from 'react';
import { Video, Clock, Bot, User, ExternalLink, Plus, Loader2, CheckCircle, Calendar } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { TeamsMeeting } from '../data/mockAdvisorData';

interface Props {
  meetings: TeamsMeeting[];
}

interface GraphEvent {
  id: string;
  subject: string;
  start: string;
  end: string;
  joinUrl: string | null;
  webLink: string;
  isOnline: boolean;
  bodyPreview: string;
  attendees: { email: string; name: string; status: string }[];
}

export default function TeamsMeetings({ meetings }: Props) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';

  const [graphEvents, setGraphEvents] = useState<GraphEvent[]>([]);
  const [graphConfigured, setGraphConfigured] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [scheduling, setScheduling] = useState(false);
  const [scheduleResult, setScheduleResult] = useState<{ success: boolean; joinUrl?: string; error?: string } | null>(null);

  // Fetch real calendar events on mount
  useEffect(() => {
    fetch('/api/qmentor/graph/events')
      .then(r => r.json())
      .then(data => {
        setGraphConfigured(data.configured ?? false);
        setGraphEvents(data.events ?? []);
      })
      .catch(() => setGraphConfigured(false))
      .finally(() => setLoadingEvents(false));
  }, []);

  // Schedule a test meeting with Layan
  const handleScheduleWithLayan = async () => {
    setScheduling(true);
    setScheduleResult(null);
    try {
      const start = new Date();
      start.setDate(start.getDate() + 1);
      start.setHours(10, 0, 0, 0);
      const end = new Date(start);
      end.setMinutes(end.getMinutes() + 30);

      const res = await fetch('/api/qmentor/graph/meeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'جلسة إرشادية — ليان حمد الجريش | Advisory Session — Layan Aljuraysh',
          startTime: start.toISOString(),
          endTime: end.toISOString(),
          attendees: ['443211517@qu.edu.sa', 'w.aljuraysh@qu.edu.sa'],
          body: '<p>جلسة إرشادية لمراجعة الوضع الأكاديمي — مجدولة تلقائياً بواسطة QMentor AI Agent</p><p>Advisory session to review academic status — auto-scheduled by QMentor AI Agent</p>',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setScheduleResult({ success: true, joinUrl: data.meeting?.joinUrl });
        // Refresh events
        const eventsRes = await fetch('/api/qmentor/graph/events');
        const eventsData = await eventsRes.json();
        setGraphEvents(eventsData.events ?? []);
      } else {
        setScheduleResult({ success: false, error: data.error });
      }
    } catch (e) {
      setScheduleResult({ success: false, error: String(e) });
    } finally {
      setScheduling(false);
    }
  };

  const sorted = [...meetings].sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sa-50 dark:bg-sa-950">
            <Video className="w-4 h-4 text-sa-600 dark:text-sa-400" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">
            {t('اجتماعات Teams', 'Teams Meetings')}
          </h3>
          {graphConfigured && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sa-50 text-sa-600 dark:bg-sa-950 dark:text-sa-400">
              {t('متصل', 'Connected')}
            </span>
          )}
        </div>

        {/* Schedule with Layan button */}
        <button
          onClick={handleScheduleWithLayan}
          disabled={scheduling}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sa-500 text-white text-xs font-semibold hover:bg-sa-600 disabled:opacity-50 transition-colors"
        >
          {scheduling ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
          {t('جدولة مع ليان', 'Schedule with Layan')}
        </button>
      </div>

      {/* Schedule result */}
      {scheduleResult && (
        <div className={`mb-4 p-3 rounded-xl text-xs ${scheduleResult.success ? 'bg-sa-50 dark:bg-sa-950 text-sa-700 dark:text-sa-300' : 'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'}`}>
          {scheduleResult.success ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{t('تم جدولة الاجتماع بنجاح!', 'Meeting scheduled successfully!')}</span>
              {scheduleResult.joinUrl && (
                <a href={scheduleResult.joinUrl} target="_blank" rel="noopener noreferrer" className="underline font-semibold ms-1">
                  {t('رابط الاجتماع', 'Join Link')}
                </a>
              )}
            </div>
          ) : (
            <span>{t('فشل في الجدولة:', 'Failed to schedule:')} {scheduleResult.error}</span>
          )}
        </div>
      )}

      {/* Real Graph events */}
      {graphConfigured && graphEvents.length > 0 && (
        <div className="mb-4">
          <p className="text-label text-gray-400 mb-2">{t('من تقويم Outlook', 'From Outlook Calendar')}</p>
          <div className="space-y-2">
            {graphEvents.slice(0, 5).map(event => (
              <div
                key={event.id}
                className="flex items-center gap-4 px-4 py-3 rounded-xl border border-sa-100 dark:border-sa-900 bg-sa-25 dark:bg-sa-950/30"
              >
                <div className="shrink-0 text-center w-14">
                  <p className="text-sm font-bold text-sa-700 dark:text-sa-300">
                    {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(event.start).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="w-px h-10 bg-sa-200 dark:bg-sa-800 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{event.subject}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {event.attendees.map(a => a.name || a.email).join(', ')}
                  </p>
                </div>
                {event.joinUrl && (
                  <a
                    href={event.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sa-500 text-white text-xs font-semibold hover:bg-sa-600 transition-colors shrink-0"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {t('انضمام', 'Join')}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loadingEvents && (
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
          <Loader2 className="w-3 h-3 animate-spin" />
          {t('جاري تحميل الاجتماعات...', 'Loading meetings...')}
        </div>
      )}

      {/* Mock meetings fallback */}
      <div>
        {!graphConfigured && !loadingEvents && (
          <p className="text-label text-gray-400 mb-2">{t('اجتماعات مجدولة', 'Scheduled Meetings')}</p>
        )}
        <div className="space-y-2">
          {sorted.map(meeting => {
            const dateStr = new Date(meeting.date).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            return (
              <div
                key={meeting.id}
                className="flex items-center gap-4 px-4 py-3 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 hover:border-sa-200 dark:hover:border-sa-800 transition-colors"
              >
                <div className="shrink-0 text-center w-14">
                  <p className="text-sm font-bold text-sa-700 dark:text-sa-300">{meeting.time}</p>
                  <p className="text-[10px] text-gray-400">{dateStr}</p>
                </div>
                <div className="w-px h-10 bg-sa-200 dark:bg-sa-800 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {isAr ? meeting.studentName : meeting.studentNameEn}
                    </span>
                    {meeting.scheduledBy === 'agent' && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sa-50 text-sa-600 dark:bg-sa-950 dark:text-sa-400">
                        <Bot className="w-2.5 h-2.5" />
                        {t('بواسطة الوكيل', 'By Agent')}
                      </span>
                    )}
                    {meeting.scheduledBy === 'advisor' && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                        <User className="w-2.5 h-2.5" />
                        {t('يدوي', 'Manual')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {isAr ? meeting.topicAr : meeting.topicEn}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Clock className="w-3 h-3" />
                    {meeting.durationMin}{t('د', 'm')}
                  </span>
                  <button
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sa-500 text-white text-xs font-semibold hover:bg-sa-600 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {t('انضمام', 'Join')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
