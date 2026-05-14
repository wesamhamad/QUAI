import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import type { SearchResult } from './types';
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  UserIcon,
  BookOpenIcon,
  DocumentIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const mockResults: SearchResult[] = [
  { id: '1', type: 'student', titleAr: 'عبدالرحمن عبدالله محمد', titleEn: 'Abdulrahman Abdullah Mohammed', subtitleAr: 'كلية الحاسب', subtitleEn: 'CS College', href: '/digital-twin' },
  { id: '2', type: 'student', titleAr: 'نورة عبدالله محمد', titleEn: 'Noura Abdullah Mohammed', subtitleAr: 'كلية العلوم', subtitleEn: 'Science College', href: '/digital-twin' },
  { id: '3', type: 'course', titleAr: 'هياكل البيانات - CS201', titleEn: 'Data Structures - CS201', subtitleAr: '45 طالب', subtitleEn: '45 students', href: '/faculty' },
  { id: '4', type: 'course', titleAr: 'الخوارزميات - CS301', titleEn: 'Algorithms - CS301', subtitleAr: '38 طالب', subtitleEn: '38 students', href: '/faculty' },
  { id: '5', type: 'page', titleAr: 'لوحة التحكم', titleEn: 'Dashboard', href: '/' },
  { id: '6', type: 'page', titleAr: 'التوأم الرقمي', titleEn: 'Digital Twin', href: '/digital-twin' },
  { id: '7', type: 'page', titleAr: 'تحليل المخاطر', titleEn: 'Risk Analytics', href: '/risk-analytics' },
  { id: '8', type: 'page', titleAr: 'الخطة الدراسية', titleEn: 'Study Plan', href: '/study-plan' },
  { id: '9', type: 'page', titleAr: 'الإعدادات', titleEn: 'Settings', href: '/settings' },
  { id: '10', type: 'help', titleAr: 'كيف أغير كلمة المرور؟', titleEn: 'How to change password?', href: '/settings' },
  { id: '11', type: 'help', titleAr: 'كيف أستخدم الخطة الذكية؟', titleEn: 'How to use Smart Study Plan?', href: '/study-plan' },
];

const typeIcons: Record<SearchResult['type'], typeof UserIcon> = {
  student: UserIcon,
  course: BookOpenIcon,
  page: DocumentIcon,
  help: QuestionMarkCircleIcon,
};

const typeLabels: Record<SearchResult['type'], { ar: string; en: string }> = {
  student: { ar: 'طلاب', en: 'Students' },
  course: { ar: 'مقررات', en: 'Courses' },
  page: { ar: 'صفحات', en: 'Pages' },
  help: { ar: 'مساعدة', en: 'Help' },
};

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? mockResults.filter(r =>
        r.titleAr.includes(query) ||
        r.titleEn.toLowerCase().includes(query.toLowerCase()) ||
        (r.subtitleAr && r.subtitleAr.includes(query)) ||
        (r.subtitleEn && r.subtitleEn.toLowerCase().includes(query.toLowerCase()))
      )
    : mockResults.slice(0, 6);

  const grouped = filtered.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.type]) acc[r.type] = [];
    acc[r.type].push(r);
    return acc;
  }, {});

  const flatResults = Object.values(grouped).flat();

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatResults[selectedIndex]) {
      navigate(flatResults[selectedIndex].href);
      onClose();
    } else if (e.key === 'Escape') {
      onClose();
    }
  }, [flatResults, selectedIndex, navigate, onClose]);

  if (!open) return null;

  let flatIndex = -1;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 border-b border-gray-200 dark:border-gray-700">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder={t('ابحث عن طلاب، مقررات، صفحات...', 'Search students, courses, pages...')}
            className="flex-1 py-3.5 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto py-2">
          {Object.entries(grouped).length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              {t('لا توجد نتائج', 'No results found')}
            </div>
          ) : (
            Object.entries(grouped).map(([type, items]) => {
              const Icon = typeIcons[type as SearchResult['type']];
              return (
                <div key={type}>
                  <div className="px-4 py-1.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t(typeLabels[type as SearchResult['type']].ar, typeLabels[type as SearchResult['type']].en)}
                  </div>
                  {items.map(item => {
                    flatIndex++;
                    const idx = flatIndex;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { navigate(item.href); onClose(); }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-start transition-colors ${
                          selectedIndex === idx
                            ? 'bg-sa-50 dark:bg-sa-950/30'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${
                          selectedIndex === idx ? 'text-sa-500' : 'text-gray-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white truncate">
                            {t(item.titleAr, item.titleEn)}
                          </p>
                          {(item.subtitleAr || item.subtitleEn) && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {t(item.subtitleAr || '', item.subtitleEn || '')}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-gray-200 dark:border-gray-700 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono">↑↓</kbd>
            {t('تنقل', 'Navigate')}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono">↵</kbd>
            {t('فتح', 'Open')}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono">ESC</kbd>
            {t('إغلاق', 'Close')}
          </span>
        </div>
      </div>
    </div>
  );
}
