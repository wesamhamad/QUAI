import { useState } from 'react';
import { TrophyIcon, StarIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../../../contexts/LanguageContext';
import { leaderboard } from '../data/mockTutoringData';
import type { LeaderboardPeriod } from '../types';

export default function TutorLeaderboard() {
  const { t, lang } = useLanguage();
  const [period, setPeriod] = useState<LeaderboardPeriod>('semester');

  const periods: { key: LeaderboardPeriod; labelAr: string; labelEn: string }[] = [
    { key: 'monthly', labelAr: 'شهري', labelEn: 'Monthly' },
    { key: 'semester', labelAr: 'الفصل', labelEn: 'Semester' },
    { key: 'all_time', labelAr: 'الكل', labelEn: 'All Time' },
  ];

  const medalColors = ['text-amber-500', 'text-gray-400', 'text-amber-700'];

  return (
    <div className="space-y-4">
      {/* Period Tabs */}
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
        {periods.map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === p.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {lang === 'ar' ? p.labelAr : p.labelEn}
          </button>
        ))}
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {leaderboard.slice(0, 3).map((entry, idx) => {
          const order = [1, 0, 2]; // 2nd, 1st, 3rd visual order
          const e = leaderboard[order[idx]];
          const name = lang === 'ar' ? e.tutor.nameAr : e.tutor.nameEn;
          const isFirst = order[idx] === 0;

          return (
            <div
              key={e.tutor.id}
              className={`flex flex-col items-center p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 ${
                isFirst ? 'ring-2 ring-amber-400 dark:ring-amber-500 shadow-md -mt-2' : ''
              }`}
            >
              <TrophyIcon className={`w-6 h-6 mb-2 ${medalColors[order[idx]] || 'text-sa-500'}`} />
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sa-400 to-sa-600 flex items-center justify-center text-white font-bold text-lg mb-2">
                {name.charAt(0)}
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm text-center">{name}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {e.sessionsCompleted} {t('جلسة', 'sessions')}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <StarIcon className="w-3.5 h-3.5 text-gold-500" />
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">{e.avgRating}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50">
              <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">#</th>
              <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">{t('المدرس', 'Tutor')}</th>
              <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">{t('الجلسات', 'Sessions')}</th>
              <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">{t('التقييم', 'Rating')}</th>
              <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">{t('المواد', 'Subjects')}</th>
              <th className="px-4 py-3 text-start text-xs font-medium text-gray-500 dark:text-gray-400">{t('التأثير', 'Impact')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {leaderboard.map(entry => {
              const name = lang === 'ar' ? entry.tutor.nameAr : entry.tutor.nameEn;
              return (
                <tr key={entry.tutor.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                    {entry.rank <= 3 ? (
                      <TrophyIcon className={`w-5 h-5 ${medalColors[entry.rank - 1]}`} />
                    ) : entry.rank}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sa-400 to-sa-600 flex items-center justify-center text-white text-xs font-bold">
                        {name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{entry.sessionsCompleted}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 text-gold-500" />
                      <span className="text-gray-700 dark:text-gray-300">{entry.avgRating}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{entry.subjectsCovered}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sa-50 dark:bg-sa-900/20 text-sa-700 dark:text-sa-300">
                      {entry.impactScore}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
