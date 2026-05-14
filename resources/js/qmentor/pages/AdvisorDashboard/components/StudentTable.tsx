import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, ChevronUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Student, SortField, SortDirection, RiskLevel } from '../types';

const RISK_ORDER: Record<RiskLevel, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const PAGE_SIZE = 8;

const riskBadgeClasses: Record<RiskLevel, string> = {
  critical: 'bg-error-100 text-error-600 dark:bg-error-600/20 dark:text-error-500',
  high: 'bg-error-100 text-error-500 dark:bg-error-500/20 dark:text-error-500',
  medium: 'bg-gold-100 text-gold-600 dark:bg-gold-500/20 dark:text-gold-500',
  low: 'bg-sa-100 text-sa-600 dark:bg-sa-500/20 dark:text-sa-400',
};

const riskLabels: Record<RiskLevel, { ar: string; en: string }> = {
  critical: { ar: 'حرج', en: 'Critical' },
  high: { ar: 'مرتفع', en: 'High' },
  medium: { ar: 'متوسط', en: 'Medium' },
  low: { ar: 'منخفض', en: 'Low' },
};

interface StudentTableProps {
  students: Student[];
}

export default function StudentTable({ students }: StudentTableProps) {
  const { t, lang, dir } = useLanguage();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('riskLevel');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);

  const departments = useMemo(() => {
    const set = new Set(students.map(s => lang === 'ar' ? s.department : s.departmentEn));
    return Array.from(set).sort();
  }, [students, lang]);

  const filtered = useMemo(() => {
    let result = students;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.id.includes(q)
      );
    }
    if (riskFilter !== 'all') result = result.filter(s => s.riskLevel === riskFilter);
    if (deptFilter !== 'all') result = result.filter(s => (lang === 'ar' ? s.department : s.departmentEn) === deptFilter);
    return result;
  }, [students, search, riskFilter, deptFilter, lang]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = (lang === 'ar' ? a.name : a.nameEn).localeCompare(lang === 'ar' ? b.name : b.nameEn); break;
        case 'id': cmp = a.id.localeCompare(b.id); break;
        case 'department': cmp = (lang === 'ar' ? a.department : a.departmentEn).localeCompare(lang === 'ar' ? b.department : b.departmentEn); break;
        case 'gpa': cmp = a.gpa - b.gpa; break;
        case 'riskLevel': cmp = RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]; break;
        case 'lastContact': cmp = a.lastContact.localeCompare(b.lastContact); break;
        case 'status': cmp = a.status.localeCompare(b.status); break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir, lang]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronUpIcon className="w-3 h-3 opacity-30" />;
    return sortDir === 'asc' ? <ChevronUpIcon className="w-3 h-3" /> : <ChevronDownIcon className="w-3 h-3" />;
  };

  const PrevIcon = dir === 'rtl' ? ChevronRightIcon : ChevronLeftIcon;
  const NextIcon = dir === 'rtl' ? ChevronLeftIcon : ChevronRightIcon;

  const columns: { key: SortField; ar: string; en: string }[] = [
    { key: 'name', ar: 'اسم الطالب', en: 'Student Name' },
    { key: 'id', ar: 'الرقم الجامعي', en: 'Student ID' },
    { key: 'department', ar: 'القسم', en: 'Department' },
    { key: 'gpa', ar: 'المعدل', en: 'GPA' },
    { key: 'riskLevel', ar: 'مستوى الخطر', en: 'Risk Level' },
    { key: 'lastContact', ar: 'آخر تواصل', en: 'Last Contact' },
    { key: 'status', ar: 'الحالة', en: 'Status' },
  ];

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <MagnifyingGlassIcon className="w-4 h-4 absolute top-1/2 -translate-y-1/2 start-3 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder={t('بحث بالاسم أو الرقم الجامعي...', 'Search by name or ID...')}
            className="w-full ps-9 pe-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sa-500 focus:border-transparent"
          />
        </div>
        <select
          value={riskFilter}
          onChange={e => { setRiskFilter(e.target.value as RiskLevel | 'all'); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500"
        >
          <option value="all">{t('جميع المستويات', 'All Risk Levels')}</option>
          {(['critical', 'high', 'medium', 'low'] as RiskLevel[]).map(level => (
            <option key={level} value={level}>{t(riskLabels[level].ar, riskLabels[level].en)}</option>
          ))}
        </select>
        <select
          value={deptFilter}
          onChange={e => { setDeptFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500"
        >
          <option value="all">{t('جميع الأقسام', 'All Departments')}</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  onClick={() => toggleSort(col.key)}
                  className="px-4 py-3 text-start font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 whitespace-nowrap select-none"
                >
                  <span className="inline-flex items-center gap-1">
                    {t(col.ar, col.en)}
                    <SortIcon field={col.key} />
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginated.map(student => (
              <tr
                key={student.id}
                onClick={() => navigate('/digital-twin')}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {t(student.name, student.nameEn)}
                </td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 font-mono text-xs">{student.id}</td>
                <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {t(student.department, student.departmentEn)}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{student.gpa.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${riskBadgeClasses[student.riskLevel]}`}>
                    {t(riskLabels[student.riskLevel].ar, riskLabels[student.riskLevel].en)}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 dark:text-gray-400 whitespace-nowrap">{student.lastContact}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${
                    student.status === 'active' ? 'text-success-600' :
                    student.status === 'probation' ? 'text-warning-500' :
                    'text-error-500'
                  }`}>
                    {t(student.statusAr, student.status.charAt(0).toUpperCase() + student.status.slice(1))}
                  </span>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                  {t('لا توجد نتائج', 'No results found')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
        <span>
          {t(
            `عرض ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, sorted.length)} من ${sorted.length}`,
            `Showing ${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, sorted.length)} of ${sorted.length}`
          )}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <PrevIcon className="w-4 h-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium ${
                p === page
                  ? 'bg-sa-500 text-white'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <NextIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
