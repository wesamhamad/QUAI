import React, { useState, useMemo } from 'react';
import { Search, Users, Filter, ChevronDown, X } from 'lucide-react';
import { useRole } from '../../../contexts/RoleContext';
import { mockStudentList, advisorStudentIds } from '../data/mockStudentList';
import type { StudentListItem } from '../data/mockStudentList';
import StudentCard from './StudentCard';

interface Props {
  selectedStudentId: string | null;
  onSelectStudent: (student: StudentListItem) => void;
}

type RiskFilter = 'all' | 'low' | 'medium' | 'high' | 'critical';
type GPAFilter = 'all' | 'high' | 'mid' | 'low';

const riskLabels: Record<RiskFilter, string> = {
  all: 'الكل',
  low: 'منخفض',
  medium: 'متوسط',
  high: 'مرتفع',
  critical: 'حرج',
};

const gpaLabels: Record<GPAFilter, string> = {
  all: 'الكل',
  high: '4.0+',
  mid: '2.75 – 3.99',
  low: 'أقل من 2.75',
};

export default function StudentSelector({ selectedStudentId, onSelectStudent }: Props) {
  const { role } = useRole();
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [collegeFilter, setCollegeFilter] = useState('all');
  const [gpaFilter, setGPAFilter] = useState<GPAFilter>('all');

  const roleLabel = role === 'advisor' ? 'طلابي' : 'جميع الطلاب';

  const filteredByRole = useMemo(() => {
    if (role === 'advisor') {
      return mockStudentList.filter(s => advisorStudentIds.has(s.profile.studentId));
    }
    return mockStudentList;
  }, [role]);

  const colleges = useMemo(() => {
    const set = new Set(filteredByRole.map(s => s.profile.college));
    return Array.from(set);
  }, [filteredByRole]);

  const filteredStudents = useMemo(() => {
    let list = filteredByRole;

    // Text search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(s =>
        s.profile.name.includes(q) ||
        s.profile.nameEn.toLowerCase().includes(q) ||
        s.profile.studentId.includes(q)
      );
    }

    // Risk filter
    if (riskFilter !== 'all') {
      list = list.filter(s => s.profile.riskLevel === riskFilter);
    }

    // College filter
    if (collegeFilter !== 'all') {
      list = list.filter(s => s.profile.college === collegeFilter);
    }

    // GPA filter
    if (gpaFilter !== 'all') {
      list = list.filter(s => {
        if (gpaFilter === 'high') return s.profile.gpa >= 4.0;
        if (gpaFilter === 'mid') return s.profile.gpa >= 2.75 && s.profile.gpa < 4.0;
        return s.profile.gpa < 2.75;
      });
    }

    return list;
  }, [filteredByRole, search, riskFilter, collegeFilter, gpaFilter]);

  const hasActiveFilters = riskFilter !== 'all' || collegeFilter !== 'all' || gpaFilter !== 'all';

  const clearFilters = () => {
    setRiskFilter('all');
    setCollegeFilter('all');
    setGPAFilter('all');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-sa-500" />
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">{roleLabel}</h2>
            <span className="text-xs text-gray-500 dark:text-gray-400">({filteredStudents.length})</span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
              hasActiveFilters
                ? 'bg-sa-100 dark:bg-sa-900/50 text-sa-700 dark:text-sa-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Filter className="w-3 h-3" />
            تصفية
            <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الرقم الجامعي..."
            className="w-full pr-9 pl-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-sa-500 focus:outline-none"
          />
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-3 space-y-2.5 pt-3 border-t border-gray-100 dark:border-gray-700">
            {/* Risk Level */}
            <div>
              <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1 block">مستوى الخطورة</label>
              <div className="flex flex-wrap gap-1">
                {(Object.keys(riskLabels) as RiskFilter[]).map(key => (
                  <button
                    key={key}
                    onClick={() => setRiskFilter(key)}
                    className={`text-[10px] px-2 py-1 rounded-md font-medium transition-colors ${
                      riskFilter === key
                        ? 'bg-sa-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {riskLabels[key]}
                  </button>
                ))}
              </div>
            </div>

            {/* College */}
            <div>
              <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1 block">الكلية</label>
              <select
                value={collegeFilter}
                onChange={e => setCollegeFilter(e.target.value)}
                className="w-full text-xs bg-gray-100 dark:bg-gray-700 border-0 rounded-lg py-1.5 px-2 text-gray-900 dark:text-white focus:ring-2 focus:ring-sa-500 focus:outline-none"
              >
                <option value="all">جميع الكليات</option>
                {colleges.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* GPA Range */}
            <div>
              <label className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mb-1 block">نطاق المعدل</label>
              <div className="flex flex-wrap gap-1">
                {(Object.keys(gpaLabels) as GPAFilter[]).map(key => (
                  <button
                    key={key}
                    onClick={() => setGPAFilter(key)}
                    className={`text-[10px] px-2 py-1 rounded-md font-medium transition-colors ${
                      gpaFilter === key
                        ? 'bg-sa-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {gpaLabels[key]}
                  </button>
                ))}
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-[10px] text-error-500 hover:text-error-600 font-medium"
              >
                <X className="w-3 h-3" />
                مسح الفلاتر
              </button>
            )}
          </div>
        )}
      </div>

      {/* Student List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">
            لا توجد نتائج
          </div>
        ) : (
          filteredStudents.map(student => (
            <StudentCard
              key={student.profile.studentId}
              profile={student.profile}
              isSelected={selectedStudentId === student.profile.studentId}
              onClick={() => onSelectStudent(student)}
            />
          ))
        )}
      </div>
    </div>
  );
}
