import { useState, useMemo } from 'react';
import { CalculatorIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { RecoveryStudent, RecoveryCourse } from '../types';

interface Props {
  student: RecoveryStudent;
  courses: RecoveryCourse[];
}

const gradeOptions = [
  { label: 'A+', points: 5.0 },
  { label: 'A', points: 5.0 },
  { label: 'A-', points: 4.75 },
  { label: 'B+', points: 4.5 },
  { label: 'B', points: 4.0 },
  { label: 'B-', points: 3.5 },
  { label: 'C+', points: 3.0 },
  { label: 'C', points: 2.5 },
  { label: 'D+', points: 2.0 },
  { label: 'D', points: 2.0 },
  { label: 'F', points: 1.0 },
];

export default function GPASimulator({ student, courses }: Props) {
  const { t } = useLanguage();

  const [simulatedGrades, setSimulatedGrades] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    courses.forEach(c => { initial[c.code] = c.currentPoints; });
    return initial;
  });

  const previousCredits = 75; // completed credits before this semester
  const previousGradePoints = student.currentGPA * previousCredits;

  const projectedGPA = useMemo(() => {
    const semesterCredits = courses.reduce((sum, c) => sum + c.creditHours, 0);
    const semesterGradePoints = courses.reduce((sum, c) => sum + (simulatedGrades[c.code] || 0) * c.creditHours, 0);
    const totalCredits = previousCredits + semesterCredits;
    const totalGradePoints = previousGradePoints + semesterGradePoints;
    return totalGradePoints / totalCredits;
  }, [simulatedGrades, courses, previousCredits, previousGradePoints]);

  const gpaChange = projectedGPA - student.currentGPA;
  const meetsTarget = projectedGPA >= student.targetGPA;

  const handleGradeChange = (code: string, points: number) => {
    setSimulatedGrades(prev => ({ ...prev, [code]: points }));
  };

  const resetGrades = () => {
    const initial: Record<string, number> = {};
    courses.forEach(c => { initial[c.code] = c.currentPoints; });
    setSimulatedGrades(initial);
  };

  return (
    <div className="space-y-4">
      {/* Projected GPA Display */}
      <Card className={`border-2 ${meetsTarget ? 'border-sa-500 bg-sa-50/50 dark:bg-sa-950/20' : 'border-amber-400 bg-amber-50/50 dark:bg-amber-950/20'}`}>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className={`p-3 rounded-xl ${meetsTarget ? 'bg-sa-100 dark:bg-sa-900/50 text-sa-600 dark:text-sa-400' : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'}`}>
            <CalculatorIcon className="w-8 h-8" />
          </div>
          <div className="flex-1 text-center sm:text-start">
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('المعدل المتوقع', 'Projected GPA')}</p>
            <div className="flex items-baseline gap-2 justify-center sm:justify-start">
              <span className={`text-4xl font-bold ${meetsTarget ? 'text-sa-600 dark:text-sa-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {projectedGPA.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">/ {student.gpaScale}</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className={`flex items-center gap-1 text-sm font-medium ${gpaChange >= 0 ? 'text-sa-600 dark:text-sa-400' : 'text-red-600 dark:text-red-400'}`}>
              <ArrowTrendingUpIcon className={`w-4 h-4 ${gpaChange < 0 ? 'rotate-180' : ''}`} />
              {gpaChange >= 0 ? '+' : ''}{gpaChange.toFixed(2)}
            </div>
            {meetsTarget ? (
              <span className="text-xs font-medium text-sa-600 dark:text-sa-400 bg-sa-100 dark:bg-sa-900/50 px-2 py-0.5 rounded-full">
                {t('يحقق الهدف ✓', 'Meets Target ✓')}
              </span>
            ) : (
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">
                {t('لم يحقق الهدف', 'Below Target')}
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Grade Selector per Course */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            {t('محاكاة التقديرات', 'Grade Simulation')}
          </h3>
          <button
            onClick={resetGrades}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-sa-600 dark:hover:text-sa-400 transition-colors"
          >
            {t('إعادة تعيين', 'Reset')}
          </button>
        </div>

        <div className="space-y-4">
          {courses.map(course => {
            const currentPoints = simulatedGrades[course.code] || 0;
            const currentLabel = gradeOptions.find(g => g.points === currentPoints)?.label || '—';
            const improved = currentPoints > course.currentPoints;
            const declined = currentPoints < course.currentPoints;

            return (
              <div key={course.code} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {t(course.nameAr, course.nameEn)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ms-2">({course.code})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t('الحالي', 'Current')}: {course.currentGrade}
                    </span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${
                      improved ? 'text-sa-700 bg-sa-100 dark:text-sa-400 dark:bg-sa-900/30' :
                      declined ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30' :
                      'text-gray-700 bg-gray-100 dark:text-gray-300 dark:bg-gray-700'
                    }`}>
                      {currentLabel}
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={gradeOptions.length - 1}
                  value={gradeOptions.findIndex(g => g.points === currentPoints)}
                  onChange={e => handleGradeChange(course.code, gradeOptions[Number(e.target.value)].points)}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-sa-500"
                />
                <div className="flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
                  <span>F</span>
                  <span>D</span>
                  <span>C</span>
                  <span>B</span>
                  <span>A+</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Quick Insight */}
      <Card className="bg-gray-50 dark:bg-gray-800/50">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-white">{t('نصيحة:', 'Tip:')}</span>{' '}
          {t(
            'للخروج من الإنذار، تحتاج معدل فصلي لا يقل عن ٣.٥ من ٥.٠ في المقررات الحالية. ركز على المواد ذات الساعات الأعلى لتأثير أكبر على المعدل.',
            'To exit probation, you need a semester GPA of at least 3.5/5.0 in current courses. Focus on high-credit courses for maximum GPA impact.'
          )}
        </p>
      </Card>
    </div>
  );
}
