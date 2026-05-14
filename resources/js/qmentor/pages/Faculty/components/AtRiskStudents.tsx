import { useState } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { Course } from '../types';

interface Props {
  courses: Course[];
}

interface AtRiskStudent {
  id: string;
  nameAr: string;
  nameEn: string;
  studentId: string;
  courseCode: string;
  gpa: number;
  absenceRate: number;
  riskLevel: 'high' | 'medium' | 'low';
  indicators: string[];
  indicatorsEn: string[];
}

function generateAtRiskStudents(courses: Course[]): AtRiskStudent[] {
  // Triple-name pools \u2014 emitted as first + father + grandfather (no family/tribe name).
  const arabicFirstNames = ['أحمد', 'محمد', 'فهد', 'سارة', 'نورة', 'خالد', 'عبدالله', 'ريم', 'هند', 'سلطان', 'ياسر', 'دانة', 'لمى', 'عمر', 'مها'];
  const arabicSecondNames = ['عبدالله', 'محمد', 'عبدالعزيز', 'سعد', 'عبدالرحمن', 'خالد', 'فهد', 'ناصر', 'سلمان', 'إبراهيم'];
  const arabicThirdNames = ['محمد', 'سعد', 'عبدالله', 'عبدالعزيز', 'خالد', 'عبدالرحمن', 'فهد', 'ناصر', 'سلمان', 'إبراهيم'];
  const englishFirstNames = ['Ahmed', 'Mohammed', 'Fahad', 'Sarah', 'Noura', 'Khalid', 'Abdullah', 'Reem', 'Hind', 'Sultan', 'Yasser', 'Dana', 'Lama', 'Omar', 'Maha'];
  const englishSecondNames = ['Abdullah', 'Mohammed', 'Abdulaziz', 'Saad', 'Abdulrahman', 'Khalid', 'Fahad', 'Nasser', 'Salman', 'Ibrahim'];
  const englishThirdNames = ['Mohammed', 'Saad', 'Abdullah', 'Abdulaziz', 'Khalid', 'Abdulrahman', 'Fahad', 'Nasser', 'Salman', 'Ibrahim'];

  const indicators = [
    { ar: 'غياب متكرر', en: 'Frequent absence' },
    { ar: 'انخفاض المعدل', en: 'GPA decline' },
    { ar: 'رسوب سابق', en: 'Previous failure' },
    { ar: 'إنذار أكاديمي', en: 'Academic warning' },
    { ar: 'تأخر تسليم', en: 'Late submissions' },
  ];

  const students: AtRiskStudent[] = [];
  courses.forEach((course, ci) => {
    const count = Math.floor(course.enrollment * (course.dfwRate / 100) * 0.6);
    for (let i = 0; i < Math.min(count, 5); i++) {
      const fi = (ci * 5 + i) % arabicFirstNames.length;
      const si = (ci * 3 + i) % arabicSecondNames.length;
      const gi = (ci * 7 + i + 2) % arabicThirdNames.length;
      const gpa = Number((1.0 + Math.random() * 1.5).toFixed(2));
      const absenceRate = Number((10 + Math.random() * 20).toFixed(0));
      const riskLevel = gpa < 1.5 ? 'high' : gpa < 2.0 ? 'medium' : 'low';
      const numIndicators = riskLevel === 'high' ? 3 : riskLevel === 'medium' ? 2 : 1;
      const selectedIndicators = indicators.slice(0, numIndicators);
      students.push({
        id: `risk-${ci}-${i}`,
        nameAr: `${arabicFirstNames[fi]} ${arabicSecondNames[si]} ${arabicThirdNames[gi]}`,
        nameEn: `${englishFirstNames[fi]} ${englishSecondNames[si]} ${englishThirdNames[gi]}`,
        studentId: `4${String(40000 + ci * 100 + i)}`,
        courseCode: course.code,
        gpa,
        absenceRate: Number(absenceRate),
        riskLevel,
        indicators: selectedIndicators.map(ind => ind.ar),
        indicatorsEn: selectedIndicators.map(ind => ind.en),
      });
    }
  });
  return students;
}

const riskColors = {
  high: 'bg-error-100 text-error-700 dark:bg-error-900/30 dark:text-error-400',
  medium: 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-400',
  low: 'bg-info-100 text-info-700 dark:bg-info-900/30 dark:text-info-400',
};

const riskDots = {
  high: 'bg-error-500',
  medium: 'bg-gold-500',
  low: 'bg-info-500',
};

export default function AtRiskStudents({ courses }: Props) {
  const { t } = useLanguage();
  const students = generateAtRiskStudents(courses);
  const [filterCourse, setFilterCourse] = useState<string>('all');
  const [filterRisk, setFilterRisk] = useState<string>('all');

  const filtered = students.filter(s => {
    if (filterCourse !== 'all' && s.courseCode !== filterCourse) return false;
    if (filterRisk !== 'all' && s.riskLevel !== filterRisk) return false;
    return true;
  });

  const highCount = students.filter(s => s.riskLevel === 'high').length;
  const mediumCount = students.filter(s => s.riskLevel === 'medium').length;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl p-4">
          <p className="text-sm text-error-600 dark:text-error-400">{t('خطر عالي', 'High Risk')}</p>
          <p className="text-2xl font-bold text-error-700 dark:text-error-300 mt-1">{highCount}</p>
        </div>
        <div className="bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 rounded-xl p-4">
          <p className="text-sm text-gold-600 dark:text-gold-400">{t('خطر متوسط', 'Medium Risk')}</p>
          <p className="text-2xl font-bold text-gold-700 dark:text-gold-300 mt-1">{mediumCount}</p>
        </div>
        <div className="bg-info-50 dark:bg-info-900/20 border border-info-200 dark:border-info-800 rounded-xl p-4">
          <p className="text-sm text-info-600 dark:text-info-400">{t('إجمالي المعرضين للخطر', 'Total At-Risk')}</p>
          <p className="text-2xl font-bold text-info-700 dark:text-info-300 mt-1">{students.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-3">
          <select
            value={filterCourse}
            onChange={e => setFilterCourse(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-2 text-gray-700 dark:text-gray-300"
          >
            <option value="all">{t('جميع المقررات', 'All Courses')}</option>
            {[...new Set(students.map(s => s.courseCode))].map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
          <select
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm px-3 py-2 text-gray-700 dark:text-gray-300"
          >
            <option value="all">{t('جميع المستويات', 'All Levels')}</option>
            <option value="high">{t('خطر عالي', 'High Risk')}</option>
            <option value="medium">{t('خطر متوسط', 'Medium Risk')}</option>
            <option value="low">{t('خطر منخفض', 'Low Risk')}</option>
          </select>
          <span className="text-sm text-gray-500 dark:text-gray-400 self-center">
            {filtered.length} {t('طالب', 'students')}
          </span>
        </div>
      </div>

      {/* Student List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t('الطالب', 'Student')}</th>
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t('الرقم', 'ID')}</th>
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t('المقرر', 'Course')}</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t('المعدل', 'GPA')}</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t('الغياب', 'Absence')}</th>
                <th className="text-center px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t('الخطورة', 'Risk')}</th>
                <th className="text-start px-4 py-3 font-medium text-gray-500 dark:text-gray-400">{t('المؤشرات', 'Indicators')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(student => (
                <tr key={student.id} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                    {t(student.nameAr, student.nameEn)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500 dark:text-gray-400">{student.studentId}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs font-mono">
                      {student.courseCode}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-bold ${student.gpa < 2.0 ? 'text-error-500' : 'text-gray-900 dark:text-white'}`}>
                      {student.gpa.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`font-medium ${student.absenceRate >= 20 ? 'text-error-500' : 'text-gray-900 dark:text-white'}`}>
                      {student.absenceRate}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${riskColors[student.riskLevel]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${riskDots[student.riskLevel]}`} />
                      {t(
                        student.riskLevel === 'high' ? 'عالي' : student.riskLevel === 'medium' ? 'متوسط' : 'منخفض',
                        student.riskLevel === 'high' ? 'High' : student.riskLevel === 'medium' ? 'Medium' : 'Low'
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(t(student.indicators.join(','), student.indicatorsEn.join(','))).split(',').map((ind, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">
                          {ind}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
