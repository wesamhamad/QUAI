import { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import PageHeader from '../../components/shared/PageHeader';
import AnimatedTab from '../../components/shared/AnimatedTab';
import { useTimetable, useFinalExams } from '../../hooks/useStudentData';
import {
  Calendar,
  Clock,
  AlertTriangle,
  BookOpen,
  FileText,
  MapPin,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimetableEntry {
  courseCode: string;
  courseName: string;
  courseNameAr: string;
  day: number; // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu
  startHour: number;
  endHour: number;
  room: string;
  color: string;
}

interface FinalExam {
  courseCode: string;
  courseName: string;
  courseNameAr: string;
  date: string; // ISO date
  time: string;
  room: string;
}

interface Deadline {
  id: string;
  courseCode: string;
  title: string;
  titleAr: string;
  dueDate: string; // ISO datetime
  type: 'assignment' | 'quiz' | 'exam';
}

type TabKey = 'weekly' | 'deadlines';

// ─── Mock Data ───────────────────────────────────────────────────────────────

const mockTimetable: TimetableEntry[] = [
  { courseCode: 'CS101', courseName: 'Intro to CS', courseNameAr: 'مقدمة في الحاسب', day: 0, startHour: 10, endHour: 11, room: '6-201', color: 'bg-blue-500' },
  { courseCode: 'CS101', courseName: 'Intro to CS', courseNameAr: 'مقدمة في الحاسب', day: 2, startHour: 10, endHour: 11, room: '6-201', color: 'bg-blue-500' },
  { courseCode: 'MATH201', courseName: 'Linear Algebra', courseNameAr: 'الجبر الخطي', day: 1, startHour: 12, endHour: 13, room: '3-105', color: 'bg-emerald-500' },
  { courseCode: 'MATH201', courseName: 'Linear Algebra', courseNameAr: 'الجبر الخطي', day: 3, startHour: 12, endHour: 13, room: '3-105', color: 'bg-emerald-500' },
  { courseCode: 'CS201', courseName: 'Data Structures', courseNameAr: 'هياكل البيانات', day: 0, startHour: 14, endHour: 15, room: '6-310', color: 'bg-violet-500' },
  { courseCode: 'CS201', courseName: 'Data Structures', courseNameAr: 'هياكل البيانات', day: 2, startHour: 14, endHour: 15, room: '6-310', color: 'bg-violet-500' },
  { courseCode: 'CS201', courseName: 'Data Structures', courseNameAr: 'هياكل البيانات', day: 4, startHour: 14, endHour: 15, room: '6-310', color: 'bg-violet-500' },
  { courseCode: 'ENG101', courseName: 'English I', courseNameAr: 'اللغة الإنجليزية ١', day: 1, startHour: 8, endHour: 9, room: '2-110', color: 'bg-amber-500' },
  { courseCode: 'PHYS101', courseName: 'Physics I', courseNameAr: 'فيزياء ١', day: 3, startHour: 10, endHour: 11, room: '4-220', color: 'bg-rose-500' },
];

const now = new Date();

function futureDate(daysAhead: number, hour = 9, minute = 0): string {
  const d = new Date(now);
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

const mockExams: FinalExam[] = [
  { courseCode: 'CS101', courseName: 'Intro to CS', courseNameAr: 'مقدمة في الحاسب', date: futureDate(2, 9), time: '09:00', room: 'Hall A' },
  { courseCode: 'MATH201', courseName: 'Linear Algebra', courseNameAr: 'الجبر الخطي', date: futureDate(6, 11), time: '11:00', room: 'Hall B' },
  { courseCode: 'CS201', courseName: 'Data Structures', courseNameAr: 'هياكل البيانات', date: futureDate(12, 9), time: '09:00', room: 'Hall C' },
];

const mockDeadlines: Deadline[] = [
  { id: '1', courseCode: 'CS101', title: 'Lab 5: Loops', titleAr: 'معمل ٥: الحلقات', dueDate: futureDate(1, 23, 59), type: 'assignment' },
  { id: '2', courseCode: 'MATH201', title: 'Quiz 3: Matrices', titleAr: 'اختبار ٣: المصفوفات', dueDate: futureDate(1, 14, 0), type: 'quiz' },
  { id: '3', courseCode: 'CS201', title: 'Assignment 4: Linked Lists', titleAr: 'واجب ٤: القوائم المتصلة', dueDate: futureDate(3, 23, 59), type: 'assignment' },
  { id: '4', courseCode: 'ENG101', title: 'Essay Draft 2', titleAr: 'مسودة المقال ٢', dueDate: futureDate(5, 23, 59), type: 'assignment' },
  { id: '5', courseCode: 'PHYS101', title: 'Midterm Exam', titleAr: 'اختبار نصفي', dueDate: futureDate(8, 10, 0), type: 'exam' },
  { id: '6', courseCode: 'CS101', title: 'Project Milestone 2', titleAr: 'مرحلة المشروع ٢', dueDate: futureDate(10, 23, 59), type: 'assignment' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hoursUntil(dateStr: string): number {
  return (new Date(dateStr).getTime() - now.getTime()) / (1000 * 60 * 60);
}

function daysUntil(dateStr: string): number {
  return Math.ceil(hoursUntil(dateStr) / 24);
}

function formatDate(dateStr: string, lang: 'ar' | 'en'): string {
  return new Date(dateStr).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatTime(dateStr: string, lang: 'ar' | 'en'): string {
  return new Date(dateStr).toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function urgencyColor(days: number): string {
  if (days < 3) return 'border-red-500 dark:border-red-400';
  if (days <= 7) return 'border-amber-500 dark:border-amber-400';
  return 'border-emerald-500 dark:border-emerald-400';
}

function urgencyBg(days: number): string {
  if (days < 3) return 'bg-red-50 dark:bg-red-950/30';
  if (days <= 7) return 'bg-amber-50 dark:bg-amber-950/30';
  return 'bg-emerald-50 dark:bg-emerald-950/30';
}

function urgencyText(days: number): string {
  if (days < 3) return 'text-red-600 dark:text-red-400';
  if (days <= 7) return 'text-amber-600 dark:text-amber-400';
  return 'text-emerald-600 dark:text-emerald-400';
}

// ─── API → UI mappers ───────────────────────────────────────────────────────

const courseColorPalette = [
  'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
  'bg-rose-500', 'bg-cyan-500', 'bg-fuchsia-500', 'bg-indigo-500',
];

/** Stable hash → palette index so the same course code always gets the same color. */
function colorForCourse(code: string): string {
  let h = 0;
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) | 0;
  return courseColorPalette[Math.abs(h) % courseColorPalette.length];
}

/** Hour from "HH:MM" (truncated). */
function parseHour(t: unknown): number {
  if (typeof t !== 'string') return 0;
  const m = /^(\d{1,2})/.exec(t);
  return m ? parseInt(m[1], 10) : 0;
}

/**
 * The university API returns:
 *   { student_id, semester, "time-table": [
 *       { course_code, course_name, times: [
 *           { day: { number, name } | number,
 *             room: "..." | null,
 *             time_slot: { original: {start, end}, formatted: {start: "HH:MM", end: "HH:MM"} } }
 *       ]}
 *   ]}
 * Older/flat shape with `start`, `end` directly on the slot is also accepted.
 * Each course typically has multiple time slots — we flatten them into one
 * TimetableEntry per slot, with day mapped to 0..4 (Sun..Thu).
 */
function mapApiTimetable(raw: unknown): TimetableEntry[] {
  if (!raw || typeof raw !== 'object') return [];
  const obj = raw as Record<string, unknown>;
  const list = (obj['time-table'] ?? obj.timetable ?? raw) as unknown;
  if (!Array.isArray(list)) return [];

  const out: TimetableEntry[] = [];
  for (const c of list as Array<Record<string, unknown>>) {
    const code = String(c.course_code ?? '');
    const nameAr = String(c.course_name ?? code);
    const nameEn = String(c.course_name_s ?? c.course_name_en ?? code);
    const color = colorForCourse(code);
    const times = Array.isArray(c.times) ? c.times : [];
    for (const slot of times as Array<Record<string, unknown>>) {
      const dayRaw = slot.day;
      const dayNum = typeof dayRaw === 'number'
        ? dayRaw
        : Number((dayRaw as Record<string, unknown> | undefined)?.number ?? 0);
      // API days are 1=Sunday..7=Saturday. UI dayLabels are 0=Sun..4=Thu.
      const day = Math.max(0, Math.min(4, dayNum - 1));

      // Resolve start/end. Real API wraps them as
      //   time_slot: { formatted: { start: "11:45", end: "13:00" } }
      // Fall back to flat `slot.start` / `slot.end` for older shapes.
      const ts = slot.time_slot as Record<string, unknown> | undefined;
      const fmt = (ts?.formatted ?? ts?.original) as Record<string, unknown> | undefined;
      const startStr = fmt?.start ?? ts?.start ?? slot.start;
      const endStr = fmt?.end ?? ts?.end ?? slot.end;

      const startHour = parseHour(startStr);
      // Skip rows with no usable start time (e.g. training sections with empty `times`).
      if (startHour === 0 && typeof startStr !== 'string') continue;

      out.push({
        courseCode: code,
        courseName: nameEn,
        courseNameAr: nameAr,
        day,
        startHour,
        endHour: parseHour(endStr) || startHour + 1,
        room: String(slot.room ?? c.campus_desc ?? '—'),
        color,
      });
    }
  }
  return out;
}

/**
 * The finals endpoint returns:
 *   { student_id, semester, courses: [
 *       { course_code, course_name, exam: { exam_date, start_time, end_time, hall_no, ... } }
 *   ]}
 */
function mapApiFinalExams(raw: unknown): FinalExam[] {
  if (!raw || typeof raw !== 'object') return [];
  const obj = raw as Record<string, unknown>;
  const list = (obj.courses ?? raw) as unknown;
  if (!Array.isArray(list)) return [];

  const out: FinalExam[] = [];
  const seen = new Set<string>();

  for (const c of list as Array<Record<string, unknown>>) {
    const exam = (c.exam ?? {}) as Record<string, unknown>;
    const dateRaw = String(exam.exam_date ?? exam.date ?? '').trim();
    if (!dateRaw) continue;

    // The API can send any of:
    //   "2026-06-03"
    //   "2026-06-03 00:00:00"          ← Oracle TO_CHAR default (space sep)
    //   "2026-06-03T08:00:00"          ← already ISO
    //   "2026-06-03T08:00:00+03:00"    ← already with offset
    // Strip any time portion the API attached, then re-attach start_time so
    // the countdown card shows the actual exam start, not midnight.
    const datePart = dateRaw.replace(/[T ].*$/, '');
    const start = String(exam.start_time ?? exam.start ?? '00:00').trim();
    // start may be "08:00" or "08:00:00"
    const startNormalized = /^\d{1,2}:\d{2}$/.test(start) ? `${start}:00` : start;
    const isoDate = `${datePart}T${startNormalized}`;

    // Skip if we still can't parse it after normalization.
    if (Number.isNaN(new Date(isoDate).getTime())) continue;

    // The university API often returns multiple exam rows per course (lecture
    // + tutorial sections). Dedupe by course_code + date to avoid 5 cards for
    // the same exam.
    const dedupeKey = `${c.course_code ?? ''}|${datePart}`;
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    out.push({
      courseCode: String(c.course_code ?? ''),
      courseName: String(c.course_name_s ?? c.course_name_en ?? c.course_name ?? ''),
      courseNameAr: String(c.course_name ?? ''),
      date: isoDate,
      time: /^\d{1,2}:\d{2}/.test(start) ? start.slice(0, 5) : '—',
      room: String(exam.hall_no ?? exam.room ?? exam.campus_name ?? '—'),
    });
  }
  return out;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Schedule() {
  const { t, lang } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('weekly');

  // The university API returns shapes that don't match our flat TimetableEntry /
  // FinalExam types — `time-table` is wrapped in `{student_id, semester, time-table:[]}`
  // and each entry's `times` are nested objects (`day: {number, name}`, `start`, `end`).
  // Same for finals. We accept either shape and coerce.
  const { data: rawTimetable, source: timetableSource } = useTimetable<unknown>(mockTimetable);
  const { data: rawExams, source: examsSource } = useFinalExams<unknown>(mockExams);

  const timetable: TimetableEntry[] = useMemo(() => {
    if (timetableSource !== 'api') {
      return Array.isArray(rawTimetable) ? rawTimetable as TimetableEntry[] : mockTimetable;
    }
    return mapApiTimetable(rawTimetable);
  }, [rawTimetable, timetableSource]);

  const exams: FinalExam[] = useMemo(() => {
    if (examsSource !== 'api') {
      return Array.isArray(rawExams) ? rawExams as FinalExam[] : mockExams;
    }
    return mapApiFinalExams(rawExams);
  }, [rawExams, examsSource]);

  const deadlines = mockDeadlines;

  const dayLabels = [
    { en: 'Sun', ar: 'أحد' },
    { en: 'Mon', ar: 'اثنين' },
    { en: 'Tue', ar: 'ثلاثاء' },
    { en: 'Wed', ar: 'أربعاء' },
    { en: 'Thu', ar: 'خميس' },
  ];

  const timeSlots = Array.from({ length: 9 }, (_, i) => 8 + i); // 8:00 - 16:00

  const tabs: { key: TabKey; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { key: 'weekly', labelAr: 'الجدول الأسبوعي', labelEn: 'Weekly Schedule', icon: <Calendar className="w-4 h-4" /> },
    { key: 'deadlines', labelAr: 'المواعيد القادمة', labelEn: 'Upcoming Deadlines', icon: <Clock className="w-4 h-4" /> },
  ];

  // ── Group deadlines ──
  const grouped = useMemo(() => {
    const next48: Deadline[] = [];
    const thisWeek: Deadline[] = [];
    const nextWeek: Deadline[] = [];

    for (const d of deadlines) {
      const h = hoursUntil(d.dueDate);
      if (h <= 48 && h > 0) next48.push(d);
      else if (h > 48 && h <= 168) thisWeek.push(d);
      else if (h > 168 && h <= 336) nextWeek.push(d);
    }

    return { next48, thisWeek, nextWeek };
  }, [deadlines]);

  // ── Type badge ──
  function TypeBadge({ type }: { type: Deadline['type'] }) {
    const styles = {
      assignment: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
      quiz: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
      exam: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    };
    const labels = {
      assignment: t('واجب', 'Assignment'),
      quiz: t('اختبار قصير', 'Quiz'),
      exam: t('اختبار', 'Exam'),
    };
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[type]}`}>
        {type === 'assignment' && <FileText className="w-3 h-3" />}
        {type === 'quiz' && <BookOpen className="w-3 h-3" />}
        {type === 'exam' && <AlertTriangle className="w-3 h-3" />}
        {labels[type]}
      </span>
    );
  }

  // ── Deadline card ──
  function DeadlineCard({ deadline, urgent }: { deadline: Deadline; urgent?: boolean }) {
    const h = hoursUntil(deadline.dueDate);
    return (
      <div className={`relative flex items-start gap-4 p-4 rounded-xl border bg-white dark:bg-gray-800 ${urgent ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'} transition-all hover:shadow-md`}>
        {urgent && (
          <span className="absolute top-3 end-3 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
          </span>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-sa-600 dark:text-sa-400">{deadline.courseCode}</span>
            <TypeBadge type={deadline.type} />
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {t(deadline.titleAr, deadline.title)}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(deadline.dueDate, lang)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(deadline.dueDate, lang)}
            </span>
          </div>
        </div>
        <div className={`text-end shrink-0 ${h <= 48 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
          <p className="text-lg font-bold">{Math.max(0, Math.ceil(h))}</p>
          <p className="text-[10px] uppercase tracking-wide">{t('ساعة', 'hrs')}</p>
        </div>
      </div>
    );
  }

  // ── Export ICS helper ──
  function handleExportCalendar() {
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//QMentor//Schedule//EN',
    ];

    for (const exam of exams) {
      const d = new Date(exam.date);
      const dtStr = d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      lines.push(
        'BEGIN:VEVENT',
        `DTSTART:${dtStr}`,
        `SUMMARY:${exam.courseCode} Final Exam`,
        `LOCATION:${exam.room}`,
        'END:VEVENT'
      );
    }

    lines.push('END:VCALENDAR');
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qmentor-schedule.ics';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title={t('جدولي والمواعيد النهائية', 'My Schedule & Deadlines')}
        subtitle={t(
          'اعرف ما هو القادم بدون فتح بلاك بورد',
          'Know what\'s next without opening Blackboard'
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('جدولي والمواعيد النهائية', 'My Schedule & Deadlines') },
        ]}
        accentColor="bg-sa-500"
        actions={
          <button
            onClick={handleExportCalendar}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-sa-600 text-white hover:bg-sa-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            {t('تصدير التقويم', 'Add to Calendar')}
          </button>
        }
      />

      {/* ── Exam Countdown Cards ──────────────────────────────────────────── */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
          {t('العد التنازلي للاختبارات النهائية', 'Final Exam Countdown')}
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {exams.map((exam) => {
            const days = daysUntil(exam.date);
            return (
              <div
                key={exam.courseCode}
                className={`shrink-0 w-56 rounded-2xl border-2 p-5 ${urgencyColor(days)} ${urgencyBg(days)} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-sa-600 dark:text-sa-400">{exam.courseCode}</span>
                  <span className={`text-2xl font-black ${urgencyText(days)}`}>{days}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2 truncate">
                  {t(exam.courseNameAr, exam.courseName)}
                </p>
                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(exam.date, lang)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {exam.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {exam.room}
                  </div>
                </div>
                <p className={`mt-3 text-xs font-semibold ${urgencyText(days)}`}>
                  {days < 3
                    ? t('قريب جداً!', 'Very Soon!')
                    : days <= 7
                      ? t('هذا الأسبوع', 'This Week')
                      : t('يوم متبقي', 'days left')}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Tab Navigation ────────────────────────────────────────────────── */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex overflow-x-auto gap-6 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              data-active={activeTab === tab.key}
              className="tab-underline flex items-center gap-1.5 text-sm whitespace-nowrap pb-3"
            >
              {tab.icon}
              {t(tab.labelAr, tab.labelEn)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────────────────────────── */}
      <AnimatedTab activeKey={activeTab} className="space-y-6">
        {/* ── Weekly Schedule ─────────────────────────────────────────────── */}
        {activeTab === 'weekly' && (
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            {/* Grid header: day labels */}
            <div className="grid grid-cols-[4rem_repeat(5,1fr)] border-b border-gray-200 dark:border-gray-700">
              <div className="p-3" />
              {dayLabels.map((day, i) => (
                <div
                  key={i}
                  className="p-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide border-s border-gray-100 dark:border-gray-700"
                >
                  {t(day.ar, day.en)}
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="relative">
              {timeSlots.map((hour) => (
                <div
                  key={hour}
                  className="grid grid-cols-[4rem_repeat(5,1fr)] min-h-[3.5rem] border-b border-gray-100 dark:border-gray-700/50"
                >
                  {/* Time label */}
                  <div className="p-2 text-[11px] font-medium text-gray-400 dark:text-gray-500 text-center flex items-start justify-center pt-3">
                    {hour.toString().padStart(2, '0')}:00
                  </div>

                  {/* Day columns */}
                  {dayLabels.map((_, dayIdx) => {
                    const entry = timetable.find(
                      (e) => e.day === dayIdx && e.startHour === hour
                    );
                    return (
                      <div
                        key={dayIdx}
                        className="relative border-s border-gray-100 dark:border-gray-700/50 p-1"
                      >
                        {entry && (
                          <div
                            className={`${entry.color} rounded-lg p-2 text-white h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow cursor-default`}
                          >
                            <div>
                              <p className="text-xs font-bold leading-tight">{entry.courseCode}</p>
                              <p className="text-[10px] opacity-90 truncate">
                                {t(entry.courseNameAr, entry.courseName)}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-[10px] opacity-80">
                              <MapPin className="w-3 h-3" />
                              {entry.room}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Upcoming Deadlines ──────────────────────────────────────────── */}
        {activeTab === 'deadlines' && (
          <div className="space-y-8">
            {/* Next 48 Hours */}
            {grouped.next48.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
                    {t('خلال ٤٨ ساعة', 'Next 48 Hours')}
                  </h3>
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold">
                    {grouped.next48.length}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {grouped.next48.map((d) => (
                    <DeadlineCard key={d.id} deadline={d} urgent />
                  ))}
                </div>
              </div>
            )}

            {/* This Week */}
            {grouped.thisWeek.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                    {t('هذا الأسبوع', 'This Week')}
                  </h3>
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 text-xs font-bold">
                    {grouped.thisWeek.length}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {grouped.thisWeek.map((d) => (
                    <DeadlineCard key={d.id} deadline={d} />
                  ))}
                </div>
              </div>
            )}

            {/* Next Week */}
            {grouped.nextWeek.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ChevronRight className="w-4 h-4 text-emerald-500" />
                  <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    {t('الأسبوع القادم', 'Next Week')}
                  </h3>
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    {grouped.nextWeek.length}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {grouped.nextWeek.map((d) => (
                    <DeadlineCard key={d.id} deadline={d} />
                  ))}
                </div>
              </div>
            )}

            {grouped.next48.length === 0 && grouped.thisWeek.length === 0 && grouped.nextWeek.length === 0 && (
              <div className="text-center py-16 text-gray-400 dark:text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">{t('لا توجد مواعيد نهائية قادمة', 'No upcoming deadlines')}</p>
              </div>
            )}
          </div>
        )}
      </AnimatedTab>
    </div>
  );
}
