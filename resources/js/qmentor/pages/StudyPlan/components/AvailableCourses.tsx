import { useState, useMemo } from 'react';
import {
  MagnifyingGlassIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  UsersIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { AvailableCourse } from '../types';

interface Props {
  courses: AvailableCourse[];
  source: 'api' | 'mock';
}

export default function AvailableCourses({ courses, source }: Props) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [filterDay, setFilterDay] = useState<string>('all');

  const dayFilters = [
    { key: 'all', labelAr: 'الكل', labelEn: 'All' },
    { key: 'sun', labelAr: 'أحد', labelEn: 'Sun' },
    { key: 'mon', labelAr: 'اثنين', labelEn: 'Mon' },
    { key: 'tue', labelAr: 'ثلاثاء', labelEn: 'Tue' },
    { key: 'wed', labelAr: 'أربعاء', labelEn: 'Wed' },
  ];

  const filtered = useMemo(() => {
    return courses.filter(c => {
      if (search) {
        const q = search.toLowerCase();
        if (!(c.code.toLowerCase().includes(q) || c.nameAr.includes(q) || c.nameEn.toLowerCase().includes(q) || c.instructor.includes(q) || c.instructorEn.toLowerCase().includes(q))) {
          return false;
        }
      }
      if (filterDay !== 'all') {
        const dayMap: Record<string, string[]> = {
          sun: ['أحد', 'Sun'],
          mon: ['اثنين', 'Mon'],
          tue: ['ثلاثاء', 'Tue'],
          wed: ['أربعاء', 'Wed'],
        };
        const keywords = dayMap[filterDay] || [];
        if (!keywords.some(k => c.schedule.includes(k) || c.scheduleEn.includes(k))) return false;
      }
      return true;
    });
  }, [courses, search, filterDay]);

  // Group by course code
  const grouped = useMemo(() => {
    const map = new Map<string, AvailableCourse[]>();
    filtered.forEach(c => {
      const list = map.get(c.code) || [];
      list.push(c);
      map.set(c.code, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
      <Card>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <MagnifyingGlassIcon className="w-4 h-4 absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('بحث بالرمز أو الاسم أو المدرس...', 'Search by code, name, or instructor...')}
              className="w-full ps-9 pe-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sa-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            {dayFilters.map(d => (
              <button
                key={d.key}
                onClick={() => setFilterDay(d.key)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filterDay === d.key
                    ? 'bg-sa-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t(d.labelAr, d.labelEn)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t(`${filtered.length} شعبة متاحة`, `${filtered.length} sections available`)}
        </p>
      </div>

      {/* Course cards */}
      {grouped.length === 0 ? (
        <Card>
          <p className="text-center text-sm text-gray-400 py-8">
            {t('لا توجد مقررات مطابقة', 'No matching courses found')}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {grouped.map(([code, sections]) => (
            <Card key={code} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs font-bold text-sa-600 dark:text-sa-400">{code}</span>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                    {t(sections[0].nameAr, sections[0].nameEn)}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-sa-100 dark:bg-sa-900/30 text-sa-700 dark:text-sa-300 text-[10px] font-bold">
                  {sections[0].creditHours} {t('ساعات', 'credits')}
                </span>
              </div>

              <div className="space-y-2">
                {sections.map((section, idx) => {
                  const seatsPct = Math.round((section.enrolled / section.seats) * 100);
                  const almostFull = seatsPct >= 80;
                  const full = section.enrolled >= section.seats;

                  return (
                    <div
                      key={`${section.code}-${section.section}`}
                      className={`p-3 rounded-lg border ${full ? 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20' : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30'}`}
                    >
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {t(`شعبة ${section.section}`, `Section ${section.section}`)}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <UserIcon className="w-3.5 h-3.5" />
                          {t(section.instructor, section.instructorEn)}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <ClockIcon className="w-3.5 h-3.5" />
                          {t(section.schedule, section.scheduleEn)}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                          <MapPinIcon className="w-3.5 h-3.5" />
                          {t(section.room, section.roomEn)}
                        </span>
                        <span className={`flex items-center gap-1 font-medium ${full ? 'text-red-600 dark:text-red-400' : almostFull ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          <UsersIcon className="w-3.5 h-3.5" />
                          {section.enrolled}/{section.seats}
                          {full && ` (${t('ممتلئ', 'Full')})`}
                        </span>
                      </div>
                      {/* Seat fill bar */}
                      <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${full ? 'bg-red-500' : almostFull ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(seatsPct, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
