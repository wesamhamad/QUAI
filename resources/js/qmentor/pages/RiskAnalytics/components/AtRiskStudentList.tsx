import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { AtRiskStudent, RiskLevel, RiskCategoryKey } from '../types';
import { categoryMeta } from '../data/riskIndicators';

interface Props {
  students: AtRiskStudent[];
}

function riskBadge(level: RiskLevel, t: (ar: string, en: string) => string) {
  const map: Record<RiskLevel, { bg: string; labelAr: string; labelEn: string }> = {
    low: { bg: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', labelAr: 'منخفض', labelEn: 'Low' },
    medium: { bg: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', labelAr: 'متوسط', labelEn: 'Medium' },
    high: { bg: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400', labelAr: 'مرتفع', labelEn: 'High' },
    critical: { bg: 'bg-red-200 text-red-700 dark:bg-red-900/50 dark:text-red-300', labelAr: 'حرج', labelEn: 'Critical' },
  };
  const s = map[level];
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.bg}`}>
      {t(s.labelAr, s.labelEn)}
    </span>
  );
}

const trendIcons = { improving: '↗', stable: '→', declining: '↘' };
const trendColors = { improving: 'text-sa-600', stable: 'text-gray-500', declining: 'text-error-500' };

const colleges = [
  { ar: 'كلية الحاسب', en: 'College of Computer' },
  { ar: 'كلية الهندسة', en: 'College of Engineering' },
  { ar: 'كلية العلوم', en: 'College of Science' },
  { ar: 'كلية إدارة الأعمال', en: 'College of Business' },
  { ar: 'كلية الطب', en: 'College of Medicine' },
  { ar: 'كلية الصيدلة', en: 'College of Pharmacy' },
  { ar: 'كلية الشريعة', en: 'College of Sharia' },
  { ar: 'كلية التربية', en: 'College of Education' },
];

export default function AtRiskStudentList({ students }: Props) {
  const { t, lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<RiskCategoryKey | 'all'>('all');
  const [collegeFilter, setCollegeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = students.filter(s => {
    if (riskFilter !== 'all' && s.riskLevel !== riskFilter) return false;
    if (categoryFilter !== 'all' && !s.categories.includes(categoryFilter)) return false;
    if (collegeFilter !== 'all') {
      const match = lang === 'ar' ? s.college === collegeFilter : s.collegeEn === collegeFilter;
      if (!match) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      return s.name.includes(q) || s.nameEn.toLowerCase().includes(q) || s.studentId.includes(q);
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {t('الطلاب المعرضون للخطر', 'At-Risk Students')} ({filtered.length})
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <FunnelIcon className="w-4 h-4" />
          {t('فلاتر', 'Filters')}
        </button>
      </div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <MagnifyingGlassIcon className="w-4 h-4 absolute top-2.5 start-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('بحث بالاسم أو الرقم الجامعي...', 'Search by name or student ID...')}
            className="w-full ps-9 pe-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sa-500 focus:border-transparent"
          />
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3">
            <select
              value={riskFilter}
              onChange={e => setRiskFilter(e.target.value as RiskLevel | 'all')}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500"
            >
              <option value="all">{t('جميع المستويات', 'All Risk Levels')}</option>
              <option value="critical">{t('حرج', 'Critical')}</option>
              <option value="high">{t('مرتفع', 'High')}</option>
              <option value="medium">{t('متوسط', 'Medium')}</option>
              <option value="low">{t('منخفض', 'Low')}</option>
            </select>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value as RiskCategoryKey | 'all')}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500"
            >
              <option value="all">{t('جميع الفئات', 'All Categories')}</option>
              {Object.entries(categoryMeta).map(([key, meta]) => (
                <option key={key} value={key}>{t(meta.nameAr, meta.nameEn)}</option>
              ))}
            </select>
            <select
              value={collegeFilter}
              onChange={e => setCollegeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500"
            >
              <option value="all">{t('جميع الكليات', 'All Colleges')}</option>
              {colleges.map(c => (
                <option key={c.en} value={lang === 'ar' ? c.ar : c.en}>
                  {t(c.ar, c.en)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-start py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t('الطالب', 'Student')}</th>
              <th className="text-start py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t('الكلية', 'College')}</th>
              <th className="text-start py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t('الخطورة', 'Risk')}</th>
              <th className="text-start py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t('العوامل الرئيسية', 'Top Factors')}</th>
              <th className="text-start py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400">{t('الاتجاه', 'Trend')}</th>
              <th className="text-start py-2 px-3 text-xs font-medium text-gray-500 dark:text-gray-400"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 20).map(student => (
              <tr key={student.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="py-3 px-3">
                  <p className="font-medium text-gray-900 dark:text-white">{t(student.name, student.nameEn)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{student.studentId}</p>
                </td>
                <td className="py-3 px-3 text-xs text-gray-600 dark:text-gray-400">
                  <p>{t(student.college, student.collegeEn)}</p>
                  <p className="text-gray-400">{t(student.department, student.departmentEn)}</p>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{student.riskScore}</span>
                    {riskBadge(student.riskLevel, t)}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex flex-wrap gap-1">
                    {(lang === 'ar' ? student.topFactors : student.topFactorsEn).map((f, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">
                        {f}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className={`text-sm ${trendColors[student.trend]}`}>
                    {trendIcons[student.trend]}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <Link
                    to="/digital-twin"
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-sa-500 text-white hover:bg-sa-600 transition-colors"
                  >
                    {t('عرض', 'View')}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > 20 && (
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          {t(`عرض 20 من ${filtered.length} طالب`, `Showing 20 of ${filtered.length} students`)}
        </p>
      )}
    </div>
  );
}
