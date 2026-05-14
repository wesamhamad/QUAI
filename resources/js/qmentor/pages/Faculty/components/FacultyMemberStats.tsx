import { useState } from 'react';
import { Star } from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip,
} from 'recharts';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { FacultyMember } from '../types';

interface Props {
  faculty: FacultyMember[];
}

const OUTCOME_COLORS = ['#25935F', '#F04438', '#F5BD02'];

export default function FacultyMemberStats({ faculty }: Props) {
  const { t } = useLanguage();
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember>(faculty[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = faculty.filter(f =>
    f.nameAr.includes(searchQuery) || f.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const outcomeData = selectedFaculty ? [
    { name: t('ناجح', 'Passed'), value: selectedFaculty.studentOutcomes.passed },
    { name: t('راسب', 'Failed'), value: selectedFaculty.studentOutcomes.failed },
    { name: t('منسحب', 'Withdrawn'), value: selectedFaculty.studentOutcomes.withdrawn },
  ] : [];

  const gradeData = selectedFaculty ? [
    { grade: 'A+', count: selectedFaculty.gradeDistribution.aPlus },
    { grade: 'A', count: selectedFaculty.gradeDistribution.a },
    { grade: 'B+', count: selectedFaculty.gradeDistribution.bPlus },
    { grade: 'B', count: selectedFaculty.gradeDistribution.b },
    { grade: 'C+', count: selectedFaculty.gradeDistribution.cPlus },
    { grade: 'C', count: selectedFaculty.gradeDistribution.c },
    { grade: 'D+', count: selectedFaculty.gradeDistribution.dPlus },
    { grade: 'D', count: selectedFaculty.gradeDistribution.d },
    { grade: 'F', count: selectedFaculty.gradeDistribution.f },
  ] : [];

  const totalGrades = gradeData.reduce((s, g) => s + g.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Faculty List */}
      <Card className="lg:col-span-1">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={t('بحث عن عضو...', 'Search faculty...')}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white mb-3"
        />
        <div className="space-y-1 max-h-[500px] overflow-y-auto">
          {filtered.map(f => (
            <button
              key={f.id}
              onClick={() => setSelectedFaculty(f)}
              className={`w-full text-start p-3 rounded-lg transition-all ${
                selectedFaculty?.id === f.id
                  ? 'bg-sa-50 dark:bg-sa-950 border border-sa-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
              }`}
            >
              <p className="font-medium text-sm text-gray-900 dark:text-white">{t(f.nameAr, f.nameEn)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t(f.departmentAr, f.departmentEn)} · {t(f.rank, f.rankEn)}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                <span className="inline-flex items-center gap-0.5"><Star className="w-3 h-3" /> {f.avgStudentSatisfaction.toFixed(1)}</span>
                <span>{f.coursesCount} {t('مقررات', 'courses')}</span>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Faculty Detail */}
      {selectedFaculty && (
        <div className="lg:col-span-2 space-y-4">
          {/* Header */}
          <Card>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t(selectedFaculty.nameAr, selectedFaculty.nameEn)}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t(selectedFaculty.rank, selectedFaculty.rankEn)} · {t(selectedFaculty.departmentAr, selectedFaculty.departmentEn)} · {t(selectedFaculty.collegeAr, selectedFaculty.collegeEn)}
                </p>
              </div>
              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sa-50 dark:bg-sa-950">
                <span className="text-xs text-gray-500 dark:text-gray-400">{t('رضا الطلاب', 'Satisfaction')}</span>
                <span className="text-lg font-bold text-sa-600">{selectedFaculty.avgStudentSatisfaction.toFixed(1)}</span>
                <span className="text-xs text-gray-400">/5</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedFaculty.coursesCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('المقررات', 'Courses')}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedFaculty.totalStudents}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('الطلاب', 'Students')}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <p className="text-2xl font-bold text-sa-600">{selectedFaculty.avgGPA.toFixed(2)}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('المعدل', 'Avg GPA')}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {((selectedFaculty.studentOutcomes.passed / selectedFaculty.totalStudents) * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('نسبة النجاح', 'Pass Rate')}</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Student Outcomes Pie */}
            <Card>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('نتائج الطلاب', 'Student Outcomes')}</h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={outcomeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {outcomeData.map((_, i) => <Cell key={i} fill={OUTCOME_COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#F3F4F6' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Grade Distribution Bars */}
            <Card>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('توزيع الدرجات', 'Grade Distribution')}</h4>
              <div className="space-y-2">
                {gradeData.map(g => (
                  <div key={g.grade} className="flex items-center gap-2">
                    <span className="w-6 text-xs font-mono text-gray-500 dark:text-gray-400">{g.grade}</span>
                    <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sa-500 rounded-full transition-all"
                        style={{ width: `${totalGrades > 0 ? (g.count / totalGrades) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-8 text-xs text-gray-500 dark:text-gray-400 text-end">{g.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
