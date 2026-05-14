import { useState } from 'react';
import {
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { ElectiveRecommendation, DifficultyLevel } from '../types';

interface Props {
  recommendations: ElectiveRecommendation[];
}

const difficultyColors: Record<DifficultyLevel, string> = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
};

const difficultyLabelsAr: Record<DifficultyLevel, string> = { easy: 'سهل', medium: 'متوسط', hard: 'صعب' };
const difficultyLabelsEn: Record<DifficultyLevel, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' };

const impactBadge = {
  booster: { labelAr: 'رافع للمعدل', labelEn: 'GPA Booster', color: 'bg-emerald-500 text-white', icon: <ArrowTrendingUpIcon className="w-3 h-3" /> },
  neutral: { labelAr: 'محايد', labelEn: 'Neutral', color: 'bg-gray-500 text-white', icon: null },
  risk: { labelAr: 'خطر على المعدل', labelEn: 'GPA Risk', color: 'bg-error-500 text-white', icon: <ArrowTrendingDownIcon className="w-3 h-3" /> },
};

export default function ElectiveRecommendations({ recommendations }: Props) {
  const { t } = useLanguage();
  const [diffFilter, setDiffFilter] = useState<DifficultyLevel | 'all'>('all');

  const filtered = diffFilter === 'all' ? recommendations : recommendations.filter(r => r.difficulty === diffFilter);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(rating);
      const half = !filled && i < rating;
      return filled ? (
        <StarSolid key={i} className="w-3.5 h-3.5 text-amber-400" />
      ) : half ? (
        <StarIcon key={i} className="w-3.5 h-3.5 text-amber-400" />
      ) : (
        <StarIcon key={i} className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
      );
    });
  };

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <Card>
        <div className="flex items-center gap-3">
          <FunnelIcon className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">{t('الصعوبة:', 'Difficulty:')}</span>
          {(['all', 'easy', 'medium', 'hard'] as const).map(d => (
            <button
              key={d}
              onClick={() => setDiffFilter(d)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                diffFilter === d
                  ? 'bg-sa-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {d === 'all' ? t('الكل', 'All') : t(difficultyLabelsAr[d], difficultyLabelsEn[d])}
            </button>
          ))}
        </div>
      </Card>

      {/* Recommendation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(rec => {
          const impact = impactBadge[rec.gpaImpact];
          return (
            <Card key={rec.code} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-xs font-bold text-sa-600 dark:text-sa-400">{rec.code}</span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                    {t(rec.nameAr, rec.nameEn)}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${impact.color}`}>
                    {impact.icon}
                    {t(impact.labelAr, impact.labelEn)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {t(rec.reasonAr, rec.reasonEn)}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                <span className={`px-2 py-0.5 rounded ${difficultyColors[rec.difficulty]}`}>
                  {t(difficultyLabelsAr[rec.difficulty], difficultyLabelsEn[rec.difficulty])}
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  {rec.creditHours} {t('ساعات', 'credits')}
                </span>
                <div className="flex items-center gap-0.5">
                  {renderStars(rec.professorRating)}
                  <span className="text-gray-400 ms-1">{rec.professorRating}</span>
                </div>
              </div>

              {/* Career tags */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(t('ar', 'en') === 'ar' ? rec.careerTags : rec.careerTagsEn).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-sa-100 dark:bg-sa-900/30 text-sa-700 dark:text-sa-300 text-[10px] font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Time slot */}
              {rec.timeSlot && (
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  {t(rec.timeSlot, rec.timeSlotEn || '')}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
