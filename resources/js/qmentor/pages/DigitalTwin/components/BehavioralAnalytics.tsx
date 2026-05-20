import React from 'react';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell,
} from 'recharts';
import type { BehavioralMetrics, AttendanceHeatmapEntry } from '../types';
import DataSourceBadge from '../../../components/shared/DataSourceBadge';
import { useLanguage } from '../../../contexts/LanguageContext';

interface AbsenceBreakdown {
  course: string;
  absencePercent: number;
}

interface Props {
  behavioral: BehavioralMetrics;
  absenceBreakdown?: AbsenceBreakdown[];
  source?: 'api' | 'mock';
}

function GaugeRing({ value, label, color }: { value: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="6" className="text-gray-200 dark:text-gray-700" />
        <motion.circle
          cx="40" cy="40" r="36" fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <span className="text-xl font-bold text-gray-900 dark:text-white -mt-[52px] mb-7">{value}%</span>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  );
}

const dayLabels = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس'];
const dayLabelsEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
const heatmapColors: Record<AttendanceHeatmapEntry['status'], string> = {
  present: '#25935F',
  'absent-excused': '#F5BD02',
  'absent-unexcused': '#F04438',
  'no-class': '#E5E7EB',
};

function AttendanceHeatmap({ data }: { data: AttendanceHeatmapEntry[] }) {
  const { t, lang } = useLanguage();
  const dayNames = lang === 'ar' ? dayLabels : dayLabelsEn;
  const weeks = Array.from(new Set(data.map(d => d.week))).sort((a, b) => a - b);

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{t('خريطة الحضور الحرارية', 'Attendance Heatmap')}</h3>
      <div className="overflow-x-auto">
        <div className="inline-block">
          {/* Week labels on top */}
          <div className="flex gap-0.5 mb-1 mr-12">
            {weeks.map(w => (
              <div key={w} className="w-5 h-4 text-[8px] text-gray-400 dark:text-gray-500 text-center">{w}</div>
            ))}
          </div>
          {/* Grid: days as rows, weeks as columns */}
          {[0, 1, 2, 3, 4].map(day => (
            <div key={day} className="flex items-center gap-0.5 mb-0.5">
              <span className="text-[9px] text-gray-400 dark:text-gray-500 w-10 shrink-0 text-left">{dayNames[day]}</span>
              {weeks.map(week => {
                const cell = data.find(d => d.week === week && d.day === day);
                const status = cell?.status ?? 'no-class';
                return (
                  <div
                    key={`${week}-${day}`}
                    className="w-5 h-5 rounded-sm transition-transform hover:scale-125"
                    style={{ backgroundColor: heatmapColors[status] }}
                    title={`${t('أسبوع', 'Week')} ${week} - ${dayNames[day]}: ${
                      status === 'present' ? t('حاضر', 'Present') :
                      status === 'absent-excused' ? t('غياب بعذر', 'Excused absence') :
                      status === 'absent-unexcused' ? t('غياب بدون عذر', 'Unexcused absence') : t('لا محاضرة', 'No class')
                    }`}
                  />
                );
              })}
            </div>
          ))}
          {/* Legend */}
          <div className="flex items-center gap-3 mt-2 mr-12">
            {[
              { status: 'present' as const, label: 'حاضر', labelEn: 'Present' },
              { status: 'absent-excused' as const, label: 'بعذر', labelEn: 'Excused' },
              { status: 'absent-unexcused' as const, label: 'بدون عذر', labelEn: 'Unexcused' },
              { status: 'no-class' as const, label: 'لا محاضرة', labelEn: 'No class' },
            ].map(item => (
              <div key={item.status} className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: heatmapColors[item.status] }} />
                <span className="text-[9px] text-gray-500 dark:text-gray-400">{lang === 'ar' ? item.label : item.labelEn}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExcusedVsUnexcused({ excused, unexcused, total }: { excused: number; unexcused: number; total: number }) {
  const { t, lang } = useLanguage();
  const present = total - excused - unexcused;
  const data = [
    { name: 'حاضر', nameEn: 'Present', value: present, color: '#25935F' },
    { name: 'بعذر', nameEn: 'Excused', value: excused, color: '#F5BD02' },
    { name: 'بدون عذر', nameEn: 'Unexcused', value: unexcused, color: '#F04438' },
  ];

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{t('تفصيل الحضور والغياب', 'Attendance Breakdown')}</h3>
      <div className="flex items-center gap-4">
        <div className="w-28 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%" cy="50%"
                innerRadius={28} outerRadius={42}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map(d => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs text-gray-600 dark:text-gray-400">{lang === 'ar' ? d.name : d.nameEn}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{d.value}</span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">({total > 0 ? Math.round(d.value / total * 100) : 0}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BehavioralAnalytics({ behavioral, absenceBreakdown, source = 'mock' }: Props) {
  const { t, lang } = useLanguage();
  const breakdownData = absenceBreakdown ?? behavioral.courseEngagement.map(ce => ({
    course: ce.course,
    absencePercent: Math.round(Math.random() * 20 + 5),
  }));
  const attendanceChartData = behavioral.attendanceByMonth.map(m => ({
    ...m,
    month: lang === 'ar' ? m.month : (m.monthEn ?? m.month),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-info-100 dark:bg-blue-900 flex items-center justify-center text-info-500 dark:text-blue-400"><TrendingUp className="w-4 h-4" /></span>
          {t('التحليلات السلوكية', 'Behavioral Analytics')}
        </h2>
        <DataSourceBadge source={source} />
      </div>

      {/* Gauge Rings */}
      <div className="grid grid-cols-3 gap-4">
        <GaugeRing value={behavioral.attendanceRate} label={t('نسبة الحضور', 'Attendance Rate')} color="#25935F" />
        <GaugeRing value={behavioral.assignmentSubmissionRate} label={t('تسليم الواجبات', 'Assignment Submission')} color="#F5BD02" />
        <GaugeRing value={Math.min(100, Math.round(behavioral.lmsLoginFrequency / 7 * 100))} label={t('دخول المنصة', 'LMS Logins')} color="#2E90FA" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{behavioral.lmsHoursPerWeek}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('ساعة / أسبوع في المنصة', 'hours / week on LMS')}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{behavioral.libraryVisits}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('زيارة للمكتبة / شهر', 'library visits / month')}</p>
        </div>
      </div>

      {/* Attendance Heatmap */}
      {behavioral.attendanceHeatmap && behavioral.attendanceHeatmap.length > 0 && (
        <AttendanceHeatmap data={behavioral.attendanceHeatmap} />
      )}

      {/* Excused vs Unexcused */}
      {behavioral.totalClasses != null && (
        <ExcusedVsUnexcused
          excused={behavioral.excusedAbsences ?? 0}
          unexcused={behavioral.unexcusedAbsences ?? 0}
          total={behavioral.totalClasses}
        />
      )}

      {/* Attendance Trend */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{t('اتجاه الحضور', 'Attendance Trend')}</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => [`${v}%`, t('الحضور', 'Attendance')]} />
              <Area type="monotone" dataKey="rate" stroke="#25935F" fill="#25935F" fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Per-Course Absence Breakdown */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{t('الغياب حسب المقرر', 'Absences by Course')}</h3>
        <div className="space-y-2">
          {breakdownData.map((item, i) => {
            const color = item.absencePercent > 15 ? '#F04438' : item.absencePercent > 10 ? '#F5BD02' : '#25935F';
            return (
              <motion.div
                key={item.course}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3"
              >
                <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-14">{item.course}</span>
                <div className="flex-1 h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(item.absencePercent / 25 * 100, 100)}%` }}
                    transition={{ duration: 0.6, delay: i * 0.05 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <span className="text-xs font-bold w-10 text-left" style={{ color }}>{item.absencePercent}%</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Study Patterns */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{t('نمط الدراسة (حسب الساعة)', 'Study Pattern (by hour)')}</h3>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={behavioral.studyPatterns} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} tickFormatter={(h: number) => `${h}:00`} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} formatter={(v: number) => [`${v}`, t('النشاط', 'Activity')]} />
              <Area type="monotone" dataKey="activity" stroke="#80519F" fill="#80519F" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Course Engagement */}
      <div>
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">{t('التفاعل مع المقررات', 'Course Engagement')}</h3>
        <div className="space-y-2">
          {behavioral.courseEngagement.map((ce, i) => (
            <motion.div
              key={ce.course}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs font-mono text-gray-600 dark:text-gray-400 w-14">{ce.course}</span>
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(ce.hours / 8) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.04 }}
                  className="h-full bg-info-500 rounded-full"
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 w-20 text-left">{ce.hours} {t('ساعة', 'hrs')}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
