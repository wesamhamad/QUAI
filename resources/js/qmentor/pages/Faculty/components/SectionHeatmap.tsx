import { useState, useMemo } from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { HeatmapCell, College } from '../types';

interface Props {
  data: HeatmapCell[];
  colleges: College[];
}

const perfColors: Record<string, string> = {
  excellent: 'bg-sa-500',
  good: 'bg-sa-400',
  average: 'bg-yellow-400',
  poor: 'bg-orange-400',
  failing: 'bg-error-500',
};

const perfBg: Record<string, string> = {
  excellent: 'bg-sa-50 dark:bg-sa-950',
  good: 'bg-sa-50/60 dark:bg-sa-950/60',
  average: 'bg-yellow-50 dark:bg-yellow-950',
  poor: 'bg-orange-50 dark:bg-orange-950',
  failing: 'bg-red-50 dark:bg-red-950',
};

export default function SectionHeatmap({ data, colleges }: Props) {
  const { t } = useLanguage();
  const [selectedCollege, setSelectedCollege] = useState<string>('all');
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const allDepts = useMemo(() => colleges.flatMap(c => c.departments), [colleges]);

  const filteredData = useMemo(() => {
    if (selectedCollege === 'all') return data;
    const college = colleges.find(c => c.id === selectedCollege);
    if (!college) return data;
    const deptCourses = college.departments.flatMap(d => d.courses.flatMap(c => c.sections.map(s => s.sectionNumber)));
    return data.filter(d => deptCourses.includes(d.sectionNumber));
  }, [data, selectedCollege, colleges]);

  const courseCodes = useMemo(() => [...new Set(filteredData.map(d => d.courseCode))], [filteredData]);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t('خريطة حرارية للشعب', 'Section Heatmap')}
        </h3>
        <select
          value={selectedCollege}
          onChange={e => setSelectedCollege(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white"
        >
          <option value="all">{t('جميع الكليات', 'All Colleges')}</option>
          {colleges.map(c => (
            <option key={c.id} value={c.id}>{t(c.nameAr, c.nameEn)}</option>
          ))}
        </select>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
        {[
          { key: 'excellent', ar: 'ممتاز ≥90%', en: 'Excellent ≥90%' },
          { key: 'good', ar: 'جيد ≥75%', en: 'Good ≥75%' },
          { key: 'average', ar: 'متوسط ≥60%', en: 'Average ≥60%' },
          { key: 'poor', ar: 'ضعيف ≥45%', en: 'Poor ≥45%' },
          { key: 'failing', ar: 'راسب <45%', en: 'Failing <45%' },
        ].map(item => (
          <div key={item.key} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded ${perfColors[item.key]}`} />
            <span>{t(item.ar, item.en)}</span>
          </div>
        ))}
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {courseCodes.slice(0, 20).map(code => {
            const sections = filteredData.filter(d => d.courseCode === code);
            return (
              <div key={code} className="flex items-center gap-2 mb-1.5">
                <span className="w-20 text-xs font-mono text-gray-600 dark:text-gray-400 shrink-0">{code}</span>
                <div className="flex gap-1 flex-wrap">
                  {sections.map((sec, i) => (
                    <div
                      key={i}
                      className={`relative w-10 h-10 rounded-lg ${perfColors[sec.performance]} cursor-pointer transition-transform hover:scale-110`}
                      onMouseEnter={() => setHoveredCell(sec)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                        {sec.passRate.toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hover Tooltip */}
      {hoveredCell && (
        <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <span className="text-gray-500 dark:text-gray-400">{t('الشعبة', 'Section')}</span>
              <p className="font-medium text-gray-900 dark:text-white">{hoveredCell.sectionNumber}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">{t('عضو هيئة التدريس', 'Faculty')}</span>
              <p className="font-medium text-gray-900 dark:text-white">{t(hoveredCell.facultyNameAr, hoveredCell.facultyNameEn)}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">{t('نسبة النجاح', 'Pass Rate')}</span>
              <p className="font-medium text-gray-900 dark:text-white">{hoveredCell.passRate.toFixed(1)}%</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">{t('المعدل التراكمي', 'Avg GPA')}</span>
              <p className="font-medium text-gray-900 dark:text-white">{hoveredCell.avgGPA.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
