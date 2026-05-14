import { useState, useMemo } from 'react';
import {
  BoltIcon,
  ScaleIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  PrinterIcon,
  ShareIcon,
  BookmarkIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { ScheduleOption, Course } from '../types';

interface Props {
  options: ScheduleOption[];
  courses: Course[];
}

const tagIcons: Record<string, React.ReactNode> = {
  fastest: <BoltIcon className="w-5 h-5" />,
  balanced: <ScaleIcon className="w-5 h-5" />,
  'gpa-safe': <ShieldCheckIcon className="w-5 h-5" />,
};

const tagColors: Record<string, string> = {
  fastest: 'border-amber-500 bg-amber-50 dark:bg-amber-950',
  balanced: 'border-sa-500 bg-sa-50 dark:bg-sa-950',
  'gpa-safe': 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950',
};

const tagTextColors: Record<string, string> = {
  fastest: 'text-amber-600 dark:text-amber-400',
  balanced: 'text-sa-600 dark:text-sa-400',
  'gpa-safe': 'text-emerald-600 dark:text-emerald-400',
};

export default function ScheduleOptions({ options, courses }: Props) {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>(options[1]?.id || '');

  const courseMap = useMemo(() => new Map(courses.map(c => [c.code, c])), [courses]);

  const handleSave = () => {
    alert(t('تم حفظ الخطة بنجاح (تجريبي)', 'Plan saved successfully (mock)'));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    alert(t('تم إرسال الخطة للمرشد الأكاديمي (تجريبي)', 'Plan shared with advisor (mock)'));
  };

  return (
    <div className="space-y-4">
      {/* Option cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map(opt => {
          const isSelected = selectedId === opt.id;
          const totalCredits = opt.semesters.reduce((sum, s) =>
            sum + s.courses.reduce((cs, code) => cs + (courseMap.get(code)?.creditHours || 0), 0), 0
          );

          return (
            <button
              key={opt.id}
              onClick={() => setSelectedId(opt.id)}
              className={`relative p-5 rounded-xl border-2 text-start transition-all ${
                isSelected
                  ? `${tagColors[opt.tag]} ${tagTextColors[opt.tag]} ring-2 ring-offset-2 dark:ring-offset-gray-900`
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              } ${isSelected ? `ring-${opt.tag === 'fastest' ? 'amber' : opt.tag === 'balanced' ? 'sa' : 'emerald'}-500` : ''}`}
            >
              {isSelected && (
                <CheckCircleIcon className={`absolute top-3 end-3 w-5 h-5 ${tagTextColors[opt.tag]}`} />
              )}

              <div className={`mb-3 ${isSelected ? tagTextColors[opt.tag] : 'text-gray-400'}`}>
                {tagIcons[opt.tag]}
              </div>
              <h3 className={`text-lg font-bold ${isSelected ? tagTextColors[opt.tag] : 'text-gray-900 dark:text-white'}`}>
                {t(opt.nameAr, opt.nameEn)}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t(opt.descriptionAr, opt.descriptionEn)}
              </p>

              <div className="mt-4 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('المعدل المتوقع', 'Projected GPA')}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{opt.projectedGPA}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('تاريخ التخرج', 'Graduation')}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{t(opt.graduationDate, opt.graduationDateEn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('الفصول', 'Semesters')}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{opt.semesters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">{t('الساعات', 'Credits')}</span>
                  <span className="font-bold text-gray-900 dark:text-white">{totalCredits}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected plan detail */}
      {selectedId && (() => {
        const opt = options.find(o => o.id === selectedId);
        if (!opt) return null;

        return (
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                {t(`تفاصيل الخطة: ${opt.nameAr}`, `Plan Details: ${opt.nameEn}`)}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sa-500 text-white text-xs font-medium hover:bg-sa-600 transition-colors"
                >
                  <BookmarkIcon className="w-3.5 h-3.5" />
                  {t('حفظ', 'Save')}
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <PrinterIcon className="w-3.5 h-3.5" />
                  {t('طباعة', 'Print')}
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <ShareIcon className="w-3.5 h-3.5" />
                  {t('مشاركة مع المرشد', 'Share with Advisor')}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {opt.semesters.map(sem => (
                <div key={sem.semester} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                      {t(sem.label, sem.labelEn)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {sem.courses.reduce((s, code) => s + (courseMap.get(code)?.creditHours || 0), 0)} {t('ساعة', 'credits')}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sem.courses.map(code => {
                      const course = courseMap.get(code);
                      return (
                        <span
                          key={code}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs"
                        >
                          <span className="font-bold text-sa-600 dark:text-sa-400">{code}</span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {course ? t(course.nameAr, course.nameEn) : code}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })()}
    </div>
  );
}
