import { useState } from 'react';
import { MagnifyingGlassIcon, StarIcon, FunnelIcon } from '@heroicons/react/24/solid';
import { ClockIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import { tutors, subjects, dayLabels, formatHour, getSubjectName } from '../data/mockTutoringData';
import type { TutoringSubject, Tutor } from '../types';

export default function TutorDiscovery() {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState<TutoringSubject | ''>('');
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = tutors.filter(tutor => {
    const name = lang === 'ar' ? tutor.nameAr : tutor.nameEn;
    if (search && !name.toLowerCase().includes(search.toLowerCase())) return false;
    if (subjectFilter && !tutor.subjects.includes(subjectFilter)) return false;
    if (minRating && tutor.rating < minRating) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('ابحث عن مدرس...', 'Search for a tutor...')}
            className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sa-500 focus:border-transparent text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            showFilters
              ? 'bg-sa-500 text-white'
              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <FunnelIcon className="w-4 h-4" />
          {t('تصفية', 'Filter')}
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value as TutoringSubject | '')}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value="">{t('جميع المواد', 'All Subjects')}</option>
            {subjects.map(s => (
              <option key={s.key} value={s.key}>{lang === 'ar' ? s.nameAr : s.nameEn}</option>
            ))}
          </select>
          <select
            value={minRating}
            onChange={e => setMinRating(Number(e.target.value))}
            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
          >
            <option value={0}>{t('أي تقييم', 'Any Rating')}</option>
            <option value={4}>4+ {t('نجوم', 'Stars')}</option>
            <option value={4.5}>4.5+ {t('نجوم', 'Stars')}</option>
          </select>
        </div>
      )}

      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t(`${filtered.length} مدرس متاح`, `${filtered.length} tutors available`)}
      </p>

      {/* Tutor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(tutor => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>
    </div>
  );
}

function TutorCard({ tutor }: { tutor: Tutor }) {
  const { t, lang } = useLanguage();
  const name = lang === 'ar' ? tutor.nameAr : tutor.nameEn;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition-shadow group">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sa-400 to-sa-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {lang === 'ar' ? tutor.collegeAr : tutor.collegeEn} &middot; {t(`المستوى ${tutor.level}`, `Level ${tutor.level}`)}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
          <StarIcon className="w-4 h-4 text-gold-500" />
          <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">{tutor.rating}</span>
        </div>
      </div>

      {/* Subjects */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tutor.subjects.map(sub => (
          <span key={sub} className="px-2 py-0.5 rounded-full text-xs font-medium bg-sa-50 dark:bg-sa-900/20 text-sa-700 dark:text-sa-300">
            {getSubjectName(sub, lang)}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-3">
        <span>{tutor.totalSessions} {t('جلسة', 'sessions')}</span>
        <span className="flex items-center gap-1">
          <ClockIcon className="w-3.5 h-3.5" />
          {tutor.availability.map(s => dayLabels[s.day]?.[lang] || s.day).join(', ')}
        </span>
      </div>

      {/* Availability */}
      <div className="text-xs text-gray-400 dark:text-gray-500">
        {tutor.availability.map((slot, i) => (
          <span key={i}>
            {i > 0 && ' | '}
            {dayLabels[slot.day]?.[lang]} {formatHour(slot.startHour)}-{formatHour(slot.endHour)}
          </span>
        ))}
      </div>
    </div>
  );
}
