import { useState, useMemo, useRef } from 'react';
import { PlusIcon, XMarkIcon, ExclamationTriangleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { Course, SemesterPlan } from '../types';

interface Props {
  courses: Course[];
  initialPlan: SemesterPlan[];
}

export default function SemesterBuilder({ courses, initialPlan }: Props) {
  const { t } = useLanguage();
  const [plan, setPlan] = useState<SemesterPlan[]>(initialPlan);
  const [addingTo, setAddingTo] = useState<number | null>(null);

  // Drag state
  const [dragItem, setDragItem] = useState<{ code: string; fromSemIdx: number } | null>(null);
  const [dragOverSemIdx, setDragOverSemIdx] = useState<number | null>(null);

  const courseMap = useMemo(() => new Map(courses.map(c => [c.code, c])), [courses]);

  // All courses already placed
  const placedCodes = useMemo(() => new Set(plan.flatMap(s => s.courses)), [plan]);

  // Available courses that can be added to a given semester
  const getAvailableForSemester = (semIdx: number) => {
    const completed = new Set(courses.filter(c => c.status === 'completed' || c.status === 'in-progress').map(c => c.code));
    for (let i = 0; i < semIdx; i++) {
      plan[i].courses.forEach(code => completed.add(code));
    }
    return courses.filter(c => {
      if (placedCodes.has(c.code)) return false;
      if (c.status === 'completed' || c.status === 'in-progress') return false;
      return c.prerequisites.every(pre => completed.has(pre));
    });
  };

  // Check if prerequisites are satisfied for a course in a target semester
  const canPlaceInSemester = (code: string, targetSemIdx: number) => {
    const course = courseMap.get(code);
    if (!course) return false;
    const completed = new Set(courses.filter(c => c.status === 'completed' || c.status === 'in-progress').map(c => c.code));
    for (let i = 0; i < targetSemIdx; i++) {
      plan[i].courses.forEach(c => {
        if (c !== code) completed.add(c);
      });
    }
    return course.prerequisites.every(pre => completed.has(pre));
  };

  const semesterCredits = (codes: string[]) =>
    codes.reduce((sum, code) => sum + (courseMap.get(code)?.creditHours || 0), 0);

  const removeCourse = (semIdx: number, code: string) => {
    setPlan(prev => prev.map((s, i) =>
      i === semIdx ? { ...s, courses: s.courses.filter(c => c !== code) } : s
    ));
  };

  const addCourse = (semIdx: number, code: string) => {
    setPlan(prev => prev.map((s, i) =>
      i === semIdx ? { ...s, courses: [...s.courses, code] } : s
    ));
    setAddingTo(null);
  };

  const addSemester = () => {
    const nextNum = plan.length > 0 ? plan[plan.length - 1].semester + 1 : 6;
    setPlan(prev => [...prev, {
      semester: nextNum,
      label: `الفصل ${nextNum}`,
      labelEn: `Semester ${nextNum}`,
      courses: [],
    }]);
  };

  // Drag handlers
  const handleDragStart = (code: string, fromSemIdx: number) => {
    setDragItem({ code, fromSemIdx });
  };

  const handleDragOver = (e: React.DragEvent, semIdx: number) => {
    e.preventDefault();
    setDragOverSemIdx(semIdx);
  };

  const handleDragLeave = () => {
    setDragOverSemIdx(null);
  };

  const handleDrop = (e: React.DragEvent, targetSemIdx: number) => {
    e.preventDefault();
    setDragOverSemIdx(null);
    if (!dragItem) return;
    const { code, fromSemIdx } = dragItem;

    if (fromSemIdx === targetSemIdx) {
      setDragItem(null);
      return;
    }

    if (!canPlaceInSemester(code, targetSemIdx)) {
      setDragItem(null);
      return;
    }

    setPlan(prev => prev.map((s, i) => {
      if (i === fromSemIdx) return { ...s, courses: s.courses.filter(c => c !== code) };
      if (i === targetSemIdx) return { ...s, courses: [...s.courses, code] };
      return s;
    }));

    setDragItem(null);
  };

  const handleDragEnd = () => {
    setDragItem(null);
    setDragOverSemIdx(null);
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="flex items-center gap-2 px-1">
        <Bars3Icon className="w-4 h-4 text-gray-400" />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('اسحب المقررات بين الفصول لإعادة ترتيب خطتك', 'Drag courses between semesters to rearrange your plan')}
        </p>
      </div>

      {plan.map((sem, semIdx) => {
        const credits = semesterCredits(sem.courses);
        const overload = credits > 18;
        const underload = credits > 0 && credits < 12;
        const isDragTarget = dragOverSemIdx === semIdx;

        return (
          <Card
            key={sem.semester}
            className={`transition-all ${
              isDragTarget
                ? 'border-sa-500 border-2 bg-sa-50/50 dark:bg-sa-950/30 ring-2 ring-sa-300 dark:ring-sa-700'
                : overload ? 'border-error-500 border-2' : underload ? 'border-yellow-500 border-2' : ''
            }`}
          >
            <div
              onDragOver={(e) => handleDragOver(e, semIdx)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, semIdx)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {t(sem.label, sem.labelEn)}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {credits} {t('ساعة', 'credits')}
                    </span>
                    {overload && (
                      <span className="flex items-center gap-1 text-xs text-error-500 font-medium">
                        <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                        {t('تجاوز الحد الأقصى (١٨)', 'Exceeds max (18)')}
                      </span>
                    )}
                    {underload && (
                      <span className="flex items-center gap-1 text-xs text-yellow-600 font-medium">
                        <ExclamationTriangleIcon className="w-3.5 h-3.5" />
                        {t('أقل من الحد الأدنى (١٢)', 'Below minimum (12)')}
                      </span>
                    )}
                    {/* Credit visual bar */}
                    <div className="hidden sm:flex items-center gap-1">
                      <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${overload ? 'bg-error-500' : underload ? 'bg-yellow-500' : 'bg-sa-500'}`}
                          style={{ width: `${Math.min((credits / 18) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400">/18</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAddingTo(addingTo === semIdx ? null : semIdx)}
                  className="p-1.5 rounded-lg bg-sa-500 text-white hover:bg-sa-600 transition-colors"
                >
                  <PlusIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Course grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {sem.courses.map(code => {
                  const course = courseMap.get(code);
                  if (!course) return null;
                  const isDragging = dragItem?.code === code && dragItem?.fromSemIdx === semIdx;
                  return (
                    <div
                      key={code}
                      draggable
                      onDragStart={() => handleDragStart(code, semIdx)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center justify-between p-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 group cursor-grab active:cursor-grabbing transition-all ${
                        isDragging ? 'opacity-40 scale-95' : 'hover:shadow-sm hover:border-sa-300 dark:hover:border-sa-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Bars3Icon className="w-3.5 h-3.5 text-gray-300 dark:text-gray-500 shrink-0 group-hover:text-sa-400" />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-sa-600 dark:text-sa-400">{code}</span>
                          <p className="text-xs text-gray-700 dark:text-gray-300 truncate">{t(course.nameAr, course.nameEn)}</p>
                          <p className="text-[10px] text-gray-400">{course.creditHours} {t('س', 'cr')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeCourse(semIdx, code)}
                        className="p-1 rounded text-gray-400 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/30 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}

                {/* Drop zone placeholder when empty */}
                {sem.courses.length === 0 && (
                  <div className="col-span-full p-4 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-600 text-center">
                    <p className="text-xs text-gray-400">
                      {t('اسحب مقرراً هنا أو اضغط + للإضافة', 'Drag a course here or click + to add')}
                    </p>
                  </div>
                )}
              </div>

              {/* Add course dropdown */}
              {addingTo === semIdx && (
                <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-dashed border-gray-300 dark:border-gray-600">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {t('المقررات المتاحة', 'Available Courses')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableForSemester(semIdx).map(c => (
                      <button
                        key={c.code}
                        onClick={() => addCourse(semIdx, c.code)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs hover:border-sa-500 hover:text-sa-600 transition-colors"
                      >
                        <PlusIcon className="w-3 h-3" />
                        <span className="font-medium">{c.code}</span>
                        <span className="text-gray-400">({c.creditHours}{t('س', 'cr')})</span>
                      </button>
                    ))}
                    {getAvailableForSemester(semIdx).length === 0 && (
                      <p className="text-xs text-gray-400">{t('لا توجد مقررات متاحة', 'No available courses')}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      })}

      {/* Add semester */}
      <button
        onClick={addSemester}
        className="w-full p-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:border-sa-500 hover:text-sa-500 transition-colors flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-4 h-4" />
        {t('إضافة فصل دراسي', 'Add Semester')}
      </button>
    </div>
  );
}
