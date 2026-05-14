import { User, TrendingDown, AlertTriangle, Clock, BookOpen, Wifi } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';

interface TwinData {
  name: string;
  nameEn: string;
  studentId: string;
  department: string;
  departmentEn: string;
  gpa: number;
  riskLevel: string;
  attendanceRate: number;
  earnedHours: number;
  totalHours: number;
  currentCourses: number;
  missedAssignments: number;
  lastLogin: string;
  trend: string;
  topConcerns: { ar: string; en: string }[];
}

interface Props {
  data: TwinData;
}

export default function StudentDigitalTwinCard({ data }: Props) {
  const { t, lang } = useLanguage();
  const isAr = lang === 'ar';
  const progressPct = Math.round((data.earnedHours / data.totalHours) * 100);

  return (
    <div className="rounded-2xl border-2 border-sa-200 dark:border-sa-800 bg-gradient-to-br from-sa-25 to-white dark:from-sa-950 dark:to-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-sa-50 dark:bg-sa-950 border-b border-sa-100 dark:border-sa-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sa-500 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {t('التوأم الرقمي — ', 'Digital Twin — ')}{isAr ? data.name : data.nameEn}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {data.studentId} · {isAr ? data.department : data.departmentEn}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sa-100 dark:bg-sa-900/50">
          <TrendingDown className="w-3.5 h-3.5 text-sa-700 dark:text-sa-300" />
          <span className="text-xs font-semibold text-sa-700 dark:text-sa-300">
            {t('تراجع', 'Declining')}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-px bg-sa-100 dark:bg-sa-900/30">
        {[
          { label: t('المعدل', 'GPA'), value: data.gpa.toFixed(2), icon: BookOpen },
          { label: t('الحضور', 'Attendance'), value: `${data.attendanceRate}%`, icon: Clock },
          { label: t('واجبات فائتة', 'Missed'), value: data.missedAssignments, icon: AlertTriangle },
          { label: t('مقررات', 'Courses'), value: data.currentCourses, icon: Wifi },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-gray-800 px-3 py-3 text-center">
              <Icon className="w-3.5 h-3.5 text-sa-400 dark:text-sa-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-[10px] text-gray-400">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="px-5 py-3 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500">{t('التقدم في الخطة', 'Plan Progress')}</span>
          <span className="text-xs font-bold text-sa-600 dark:text-sa-400">{data.earnedHours}/{data.totalHours} {t('ساعة', 'hrs')} ({progressPct}%)</span>
        </div>
        <div className="w-full h-2 bg-sa-50 dark:bg-sa-950 rounded-full overflow-hidden">
          <div className="h-full bg-sa-500 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Concerns */}
      <div className="px-5 py-3 border-t border-sa-100 dark:border-sa-900">
        <p className="text-xs font-semibold text-sa-700 dark:text-sa-300 mb-2">
          {t('أبرز المخاوف:', 'Top Concerns:')}
        </p>
        <ul className="space-y-1.5">
          {data.topConcerns.map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-sa-400 mt-1.5 shrink-0" />
              {isAr ? c.ar : c.en}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
