import { SparklesIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import { useLanguage } from '../../../contexts/LanguageContext';
import { matchResults, dayLabels, formatHour, getSubjectName } from '../data/mockTutoringData';

export default function MatchResults() {
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-sa-50 to-sa-100 dark:from-sa-900/20 dark:to-sa-800/20 rounded-xl border border-sa-200 dark:border-sa-800">
        <SparklesIcon className="w-5 h-5 text-sa-600 dark:text-sa-400" />
        <p className="text-sm text-sa-700 dark:text-sa-300">
          {t(
            'تم تحليل أدائك الأكاديمي ومطابقتك مع أفضل المدرسين المتاحين',
            'Your academic performance was analyzed to match you with the best available tutors'
          )}
        </p>
      </div>

      <div className="space-y-4">
        {matchResults.map((match, idx) => {
          const name = lang === 'ar' ? match.tutor.nameAr : match.tutor.nameEn;
          return (
            <div key={match.tutor.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                {/* Rank */}
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                    idx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                    idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    'bg-gradient-to-br from-sa-400 to-sa-600'
                  }`}>
                    #{idx + 1}
                  </div>
                  <span className="text-xs font-bold text-sa-600 dark:text-sa-400">{match.matchScore}%</span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {lang === 'ar' ? match.tutor.collegeAr : match.tutor.collegeEn}
                    </span>
                  </div>

                  {/* Match Reason */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <CheckCircleIcon className="w-4 h-4 text-green-500 inline me-1" />
                    {lang === 'ar' ? match.reasonAr : match.reasonEn}
                  </p>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {match.tutor.subjects.map(sub => (
                      <span key={sub} className="px-2 py-0.5 rounded-full text-xs font-medium bg-sa-50 dark:bg-sa-900/20 text-sa-700 dark:text-sa-300">
                        {getSubjectName(sub, lang)}
                      </span>
                    ))}
                  </div>

                  {/* Mutual Availability */}
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <ClockIcon className="w-4 h-4" />
                    <span>{t('أوقات مشتركة:', 'Mutual times:')}</span>
                    {match.mutualSlots.map((slot, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                        {dayLabels[slot.day]?.[lang]} {formatHour(slot.startHour)}-{formatHour(slot.endHour)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Match Score Bar */}
                <div className="hidden sm:flex flex-col items-center gap-1 w-16">
                  <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-sa-400 to-sa-600 rounded-full" style={{ width: `${match.matchScore}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{t('تطابق', 'Match')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
