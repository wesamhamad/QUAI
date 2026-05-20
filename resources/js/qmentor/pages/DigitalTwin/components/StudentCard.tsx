import React from 'react';
import type { StudentProfile } from '../types';
import { useLanguage } from '../../../contexts/LanguageContext';

const riskColors = {
  low: { bg: 'bg-sa-100 dark:bg-sa-900', text: 'text-sa-700 dark:text-sa-300', label: 'منخفض', labelEn: 'Low' },
  medium: { bg: 'bg-gold-100 dark:bg-gold-900', text: 'text-gold-700 dark:text-gold-300', label: 'متوسط', labelEn: 'Medium' },
  high: { bg: 'bg-error-100 dark:bg-red-900', text: 'text-error-500 dark:text-red-300', label: 'مرتفع', labelEn: 'High' },
  critical: { bg: 'bg-error-100 dark:bg-red-900', text: 'text-error-600 dark:text-red-200', label: 'حرج', labelEn: 'Critical' },
};

interface Props {
  profile: StudentProfile;
  isSelected: boolean;
  onClick: () => void;
}

export default function StudentCard({ profile, isSelected, onClick }: Props) {
  const { lang } = useLanguage();
  const risk = riskColors[profile.riskLevel];
  const displayName = lang === 'ar' ? profile.name : profile.nameEn;

  return (
    <button
      onClick={onClick}
      className={`w-full ${lang === 'ar' ? 'text-right' : 'text-left'} p-4 rounded-xl border transition-all duration-200 ${
        isSelected
          ? 'bg-sa-50 dark:bg-sa-900/30 border-sa-500 border-r-4'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-sa-50/50 dark:hover:bg-gray-750 hover:border-sa-200 dark:hover:border-sa-800'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sa-500 to-sa-700 flex items-center justify-center text-white text-sm font-bold shrink-0">
          {displayName.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">{displayName}</span>
          </div>

          {/* Student ID & department */}
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {profile.studentId} • {lang === 'ar' ? profile.department : profile.departmentEn}
          </p>

          {/* Bottom row: GPA + risk */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {profile.gpa.toFixed(2)} / {profile.gpaScale}
            </span>
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${risk.bg} ${risk.text}`}>
              {lang === 'ar' ? risk.label : risk.labelEn}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
