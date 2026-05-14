import React from 'react';
import type { StudentProfile } from '../types';

const riskColors = {
  low: { bg: 'bg-sa-100 dark:bg-sa-900', text: 'text-sa-700 dark:text-sa-300', label: 'منخفض', labelEn: 'Low' },
  medium: { bg: 'bg-gold-100 dark:bg-gold-900', text: 'text-gold-700 dark:text-gold-300', label: 'متوسط', labelEn: 'Medium' },
  high: { bg: 'bg-error-100 dark:bg-red-900', text: 'text-error-500 dark:text-red-300', label: 'مرتفع', labelEn: 'High' },
  critical: { bg: 'bg-error-100 dark:bg-red-900', text: 'text-error-600 dark:text-red-200', label: 'حرج', labelEn: 'Critical' },
};

const standingLabels: Record<string, { ar: string; en: string }> = {
  excellent: { ar: 'ممتاز', en: 'Excellent' },
  'very-good': { ar: 'جيد جداً', en: 'Very Good' },
  good: { ar: 'جيد', en: 'Good' },
  fair: { ar: 'مقبول', en: 'Fair' },
  warning: { ar: 'إنذار', en: 'Warning' },
  probation: { ar: 'فصل أكاديمي', en: 'Probation' },
};

const statusLabels: Record<string, { ar: string; en: string; color: string }> = {
  active: { ar: 'مسجل', en: 'Active', color: 'bg-sa-500' },
  suspended: { ar: 'موقوف', en: 'Suspended', color: 'bg-error-500' },
  graduated: { ar: 'متخرج', en: 'Graduated', color: 'bg-info-500' },
  withdrawn: { ar: 'منسحب', en: 'Withdrawn', color: 'bg-gray-500' },
};

interface Props {
  profile: StudentProfile;
}

export default function StudentHeader({ profile }: Props) {
  const risk = riskColors[profile.riskLevel];
  const standing = standingLabels[profile.academicStanding];
  const status = statusLabels[profile.enrollmentStatus];
  const creditPercent = Math.round((profile.creditHoursCompleted / profile.creditHoursRequired) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sa-500 to-sa-700 flex items-center justify-center text-white text-2xl font-bold">
            {profile.name.charAt(0)}
          </div>
          <span className={`absolute -bottom-1 -left-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${status.color}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">{profile.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${risk.bg} ${risk.text}`}>
              {risk.label}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color} text-white`}>
              {status.ar}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {profile.studentId} • {profile.college} • {profile.department} • المستوى {profile.level}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="المعدل التراكمي" value={`${profile.gpa}`} sub={`/ ${profile.gpaScale}`} accent />
            <StatCard label="الساعات المكتملة" value={`${profile.creditHoursCompleted}`} sub={`/ ${profile.creditHoursRequired} (${creditPercent}%)`} />
            <StatCard label="التخرج المتوقع" value={profile.expectedGraduation} />
            <StatCard label="التقدير" value={standing?.ar ?? ''} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className={`text-lg font-bold ${accent ? 'text-sa-600 dark:text-sa-400' : 'text-gray-900 dark:text-white'}`}>
        {value}
        {sub && <span className="text-xs font-normal text-gray-400 dark:text-gray-500 mr-1">{sub}</span>}
      </p>
    </div>
  );
}
