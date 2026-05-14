import { useEffect, useMemo, useState } from 'react';
import { useMajorsInMyFaculty, useMajorComparison } from '../../../hooks/useStudentData';
import {
  ArrowsRightLeftIcon,
  MinusCircleIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../../contexts/LanguageContext';
import Card from '../../../components/ui/Card';
import type { Course, StudentPlanProfile, WhatIfResult } from '../types';

interface Props {
  profile: StudentPlanProfile;
  courses: Course[];
}

type Scenario = 'drop' | 'grade' | 'overload' | 'major';

interface ScenarioDef {
  key: Scenario;
  labelAr: string;
  labelEn: string;
  icon: React.ReactNode;
  descAr: string;
  descEn: string;
}

const scenarios: ScenarioDef[] = [
  { key: 'drop', labelAr: 'حذف مقرر', labelEn: 'Drop a Course', icon: <MinusCircleIcon className="w-5 h-5" />, descAr: 'شاهد تأثير حذف مقرر على خطتك', descEn: 'See the impact of dropping a course' },
  { key: 'grade', labelAr: 'تغيير التقدير', labelEn: 'Change Grade', icon: <ArrowTrendingUpIcon className="w-5 h-5" />, descAr: 'احسب تأثير تقدير معين على المعدل', descEn: 'Calculate grade impact on GPA' },
  { key: 'overload', labelAr: 'زيادة الساعات', labelEn: 'Overload Semester', icon: <AcademicCapIcon className="w-5 h-5" />, descAr: 'تأثير أخذ ساعات إضافية', descEn: 'Effect of taking extra credits' },
  { key: 'major', labelAr: 'تغيير التخصص', labelEn: 'Change Major', icon: <ArrowPathIcon className="w-5 h-5" />, descAr: 'ماذا لو انتقلت لتخصص آخر؟', descEn: 'What if you switch to another major?' },
];

const gradeOptions = [
  { label: 'A+', points: 5.0 },
  { label: 'A', points: 4.75 },
  { label: 'B+', points: 4.5 },
  { label: 'B', points: 4.0 },
  { label: 'C+', points: 3.5 },
  { label: 'C', points: 3.0 },
  { label: 'D+', points: 2.5 },
  { label: 'D', points: 2.0 },
  { label: 'F', points: 1.0 },
];

interface MajorOption {
  id: string;
  nameAr: string;
  nameEn: string;
  totalCredits: number;
  transferableCredits: number;
}

interface ApiMajor {
  major_no?: string;
  major_code?: string;
  major_name?: string;
  major_name_en?: string;
}

interface ApiComparison {
  target_major_no?: string;
  target_major_name?: string;
  target_total_hrs?: number;
  shared_hrs?: number;
  remaining_hrs?: number;
  shared?: Array<{ course_code?: string; course_name?: string; crd_hrs?: number; letter_grade?: string }>;
  remaining?: Array<{ course_code?: string; course_name?: string; crd_hrs?: number; group_type?: string }>;
}

// Fallback list shown only when /majors/my-faculty hasn't resolved.
const fallbackMajorOptions: MajorOption[] = [
  { id: 'it', nameAr: 'تقنية المعلومات', nameEn: 'Information Technology', totalCredits: 132, transferableCredits: 70 },
  { id: 'is', nameAr: 'نظم المعلومات', nameEn: 'Information Systems', totalCredits: 130, transferableCredits: 65 },
  { id: 'ce', nameAr: 'هندسة الحاسب', nameEn: 'Computer Engineering', totalCredits: 140, transferableCredits: 60 },
  { id: 'se', nameAr: 'هندسة البرمجيات', nameEn: 'Software Engineering', totalCredits: 136, transferableCredits: 75 },
];

export default function WhatIfSimulator({ profile, courses }: Props) {
  const { t } = useLanguage();
  const [activeScenario, setActiveScenario] = useState<Scenario>('drop');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<string>('A');
  const [selectedMajor, setSelectedMajor] = useState<string>(fallbackMajorOptions[0].id);
  const [result, setResult] = useState<WhatIfResult | null>(null);

  const inProgressCourses = courses.filter(c => c.status === 'in-progress');

  // Real majors from the student's own faculty (qu-api-v2). Falls back to the
  // demo list above when the API hasn't resolved yet.
  const majorsResult = useMajorsInMyFaculty<ApiMajor[] | null>(null);

  const majorOptions: MajorOption[] = useMemo(() => {
    if (majorsResult.source !== 'api' || !Array.isArray(majorsResult.data) || majorsResult.data.length === 0) {
      return fallbackMajorOptions;
    }
    return majorsResult.data.map(m => ({
      id: String(m.major_no ?? m.major_code ?? ''),
      nameAr: String(m.major_name ?? m.major_code ?? ''),
      nameEn: String(m.major_name_en ?? m.major_code ?? ''),
      // We don't know totals up-front; show '—' until the comparison runs.
      totalCredits: 0,
      transferableCredits: 0,
    })).filter(m => m.id !== '');
  }, [majorsResult.source, majorsResult.data]);

  // Whenever the majors list lands, snap selectedMajor to a valid id.
  useEffect(() => {
    if (majorOptions.length > 0 && !majorOptions.some(m => m.id === selectedMajor)) {
      setSelectedMajor(majorOptions[0].id);
    }
  }, [majorOptions, selectedMajor]);

  // Real comparison for the selected target major. Only fires when the major
  // scenario is active and we have a selection.
  const comparison = useMajorComparison<ApiComparison | null>(
    activeScenario === 'major' ? selectedMajor : '',
    null
  );
  const compareData = comparison.source === 'api' ? comparison.data : null;

  const simulate = () => {
    const currentCredits = profile.completedCredits;
    const currentGPA = profile.currentGPA;
    const baseGradPoints = currentGPA * currentCredits;

    let newResult: WhatIfResult;

    if (activeScenario === 'drop') {
      const droppedCourse = courses.find(c => c.code === selectedCourse);
      const droppedCredits = droppedCourse?.creditHours || 0;
      const remainingCredits = profile.requiredCredits - currentCredits;
      const newRemaining = remainingCredits + droppedCredits;
      const extraSemesters = Math.ceil(droppedCredits / 15);

      newResult = {
        projectedGPA: currentGPA,
        originalGPA: currentGPA,
        graduationDate: '١٤٤٧/٢',
        graduationDateEn: 'Spring 2026',
        originalGraduationDate: profile.expectedGraduation,
        originalGraduationDateEn: profile.expectedGraduationEn,
        semestersRemaining: (8 - profile.currentSemester) + extraSemesters,
        originalSemestersRemaining: 8 - profile.currentSemester,
        impactSummaryAr: `حذف ${droppedCourse?.nameAr || ''} سيؤخر التخرج بفصل واحد ويزيد الساعات المتبقية إلى ${newRemaining}`,
        impactSummaryEn: `Dropping ${droppedCourse?.nameEn || ''} delays graduation by 1 semester. Remaining credits: ${newRemaining}`,
      };
    } else if (activeScenario === 'grade') {
      const course = courses.find(c => c.code === selectedCourse);
      const gradeOpt = gradeOptions.find(g => g.label === selectedGrade);
      const courseCredits = course?.creditHours || 3;
      const gradePoints = gradeOpt?.points || 4.0;
      const newGPA = Math.round(((baseGradPoints + gradePoints * courseCredits) / (currentCredits + courseCredits)) * 100) / 100;

      newResult = {
        projectedGPA: newGPA,
        originalGPA: currentGPA,
        graduationDate: profile.expectedGraduation,
        graduationDateEn: profile.expectedGraduationEn,
        originalGraduationDate: profile.expectedGraduation,
        originalGraduationDateEn: profile.expectedGraduationEn,
        semestersRemaining: 8 - profile.currentSemester,
        originalSemestersRemaining: 8 - profile.currentSemester,
        impactSummaryAr: `الحصول على ${selectedGrade} في ${course?.nameAr} سيغير المعدل من ${currentGPA} إلى ${newGPA}`,
        impactSummaryEn: `Getting ${selectedGrade} in ${course?.nameEn} changes GPA from ${currentGPA} to ${newGPA}`,
      };
    } else if (activeScenario === 'overload') {
      const newGPA = Math.round((currentGPA - 0.1) * 100) / 100;
      newResult = {
        projectedGPA: newGPA,
        originalGPA: currentGPA,
        graduationDate: '١٤٤٦/٢',
        graduationDateEn: 'Spring 2025',
        originalGraduationDate: profile.expectedGraduation,
        originalGraduationDateEn: profile.expectedGraduationEn,
        semestersRemaining: (8 - profile.currentSemester) - 1,
        originalSemestersRemaining: 8 - profile.currentSemester,
        impactSummaryAr: 'زيادة الساعات إلى ٢١ ساعة قد تسرّع التخرج بفصل لكن المعدل قد ينخفض قليلاً',
        impactSummaryEn: 'Overloading to 21 credits may accelerate graduation by 1 semester but could slightly lower GPA',
      };
    } else {
      // Change major — prefer real comparison data when the API has resolved.
      const major = majorOptions.find(m => m.id === selectedMajor) ?? majorOptions[0];

      // If the comparison endpoint resolved, use its real shared/remaining
      // hours; otherwise fall back to the static-list approximation.
      const sharedHrs = compareData?.shared_hrs ?? major?.transferableCredits ?? 0;
      const remainingHrs = compareData?.remaining_hrs ?? Math.max(0, (major?.totalCredits ?? 0) - sharedHrs);
      const totalHrs = compareData?.target_total_hrs ?? major?.totalCredits ?? (sharedHrs + remainingHrs);
      const targetName = compareData?.target_major_name || major?.nameAr || '';
      const newSemesters = Math.max(1, Math.ceil(remainingHrs / 15));
      const newGPA = Math.round((currentGPA * 0.95) * 100) / 100; // estimate

      newResult = {
        projectedGPA: newGPA,
        originalGPA: currentGPA,
        graduationDate: `${newSemesters + profile.currentSemester > 8 ? '١٤٤٨/١' : '١٤٤٧/٢'}`,
        graduationDateEn: `${newSemesters + profile.currentSemester > 8 ? 'Fall 2026' : 'Spring 2026'}`,
        originalGraduationDate: profile.expectedGraduation,
        originalGraduationDateEn: profile.expectedGraduationEn,
        semestersRemaining: newSemesters,
        originalSemestersRemaining: 8 - profile.currentSemester,
        impactSummaryAr: `التحويل إلى ${targetName || major?.nameAr || ''} ينقل ${sharedHrs} ساعة من خطتك الحالية بدون إعادة. ستحتاج ${remainingHrs} ساعة إضافية من أصل ${totalHrs} (≈${newSemesters} فصول). المعدل التقديري: ${newGPA}`,
        impactSummaryEn: `Switching to ${targetName || major?.nameEn || ''} transfers ${sharedHrs} hrs of completed coursework (no retakes). You'll need ${remainingHrs} more hrs out of ${totalHrs} (~${newSemesters} semesters). Estimated GPA: ${newGPA}`,
      };
    }

    setResult(newResult);
  };

  return (
    <div className="space-y-4">
      {/* Scenario selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {scenarios.map(s => (
          <button
            key={s.key}
            onClick={() => { setActiveScenario(s.key); setResult(null); }}
            className={`p-4 rounded-xl border-2 text-start transition-all ${
              activeScenario === s.key
                ? 'border-sa-500 bg-sa-50 dark:bg-sa-950'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <div className={`mb-2 ${activeScenario === s.key ? 'text-sa-600 dark:text-sa-400' : 'text-gray-400'}`}>
              {s.icon}
            </div>
            <p className={`text-sm font-medium ${activeScenario === s.key ? 'text-sa-700 dark:text-sa-300' : 'text-gray-700 dark:text-gray-300'}`}>
              {t(s.labelAr, s.labelEn)}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              {t(s.descAr, s.descEn)}
            </p>
          </button>
        ))}
      </div>

      {/* Input controls */}
      <Card>
        <div className="flex flex-wrap items-end gap-4">
          {(activeScenario === 'drop' || activeScenario === 'grade') && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('اختر المقرر', 'Select Course')}
              </label>
              <select
                value={selectedCourse}
                onChange={e => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white"
              >
                <option value="">{t('-- اختر --', '-- Select --')}</option>
                {inProgressCourses.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {t(c.nameAr, c.nameEn)}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeScenario === 'grade' && (
            <div className="w-32">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('التقدير', 'Grade')}
              </label>
              <select
                value={selectedGrade}
                onChange={e => setSelectedGrade(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white"
              >
                {gradeOptions.map(g => (
                  <option key={g.label} value={g.label}>{g.label}</option>
                ))}
              </select>
            </div>
          )}

          {activeScenario === 'major' && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {t('اختر التخصص الجديد', 'Select New Major')}
              </label>
              <select
                value={selectedMajor}
                onChange={e => setSelectedMajor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-white"
              >
                {majorOptions.map(m => (
                  <option key={m.id} value={m.id}>
                    {t(m.nameAr, m.nameEn)} ({m.totalCredits} {t('ساعة', 'credits')})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={simulate}
            disabled={((activeScenario === 'drop' || activeScenario === 'grade') && !selectedCourse)}
            className="px-5 py-2 rounded-lg bg-sa-500 text-white text-sm font-medium hover:bg-sa-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <ArrowsRightLeftIcon className="w-4 h-4" />
            {t('محاكاة', 'Simulate')}
          </button>
        </div>

        {/* Major comparison cards — only majors in the student's own faculty.
            Selected card shows real shared/remaining hours from the API. */}
        {activeScenario === 'major' && (
          <>
            {majorsResult.source === 'api' && majorOptions.length === 0 && (
              <p className="mt-3 text-xs text-gray-400 dark:text-gray-500">
                {t('لا توجد تخصصات أخرى متاحة في كليتك حالياً', 'No other majors available in your faculty right now')}
              </p>
            )}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {majorOptions.map(m => {
                const isSelected = selectedMajor === m.id;
                // Show real comparison numbers on the selected card; others show
                // their static totals (we don't pre-fetch every major's plan).
                const shared = isSelected ? compareData?.shared_hrs : undefined;
                const total = isSelected ? compareData?.target_total_hrs : undefined;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMajor(m.id)}
                    className={`p-3 rounded-lg border text-start transition-all ${
                      isSelected
                        ? 'border-sa-500 bg-sa-50 dark:bg-sa-950'
                        : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30 hover:border-gray-300'
                    }`}
                  >
                    <p className={`text-sm font-medium ${isSelected ? 'text-sa-700 dark:text-sa-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {t(m.nameAr, m.nameEn)}
                    </p>
                    <div className="flex justify-between mt-2 text-[11px] text-gray-500 dark:text-gray-400">
                      <span>
                        {(total ?? m.totalCredits) || '—'} {t('ساعة', 'credits')}
                      </span>
                      <span>
                        {(shared ?? m.transferableCredits) || (isSelected && comparison.isLoading ? '...' : '—')}{' '}
                        {t('مشتركة', 'shared')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Real shared/remaining course lists for the selected major */}
            {compareData && (compareData.shared?.length || compareData.remaining?.length) ? (
              <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-3">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                    {t(
                      `مواد تنتقل معك (${compareData.shared?.length ?? 0})`,
                      `Courses that transfer (${compareData.shared?.length ?? 0})`
                    )}
                  </p>
                  <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {(compareData.shared ?? []).slice(0, 30).map((c, i) => (
                      <li key={i} className="text-[11px] text-gray-700 dark:text-gray-300 flex justify-between gap-2">
                        <span className="truncate"><span className="font-mono text-gray-500">{c.course_code}</span> {c.course_name}</span>
                        <span className="shrink-0 text-emerald-600 dark:text-emerald-400">{c.letter_grade || ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border border-amber-200 dark:border-amber-800/60 bg-amber-50/50 dark:bg-amber-950/20 p-3">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">
                    {t(
                      `مواد إضافية مطلوبة (${compareData.remaining?.length ?? 0})`,
                      `Additional courses needed (${compareData.remaining?.length ?? 0})`
                    )}
                  </p>
                  <ul className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {(compareData.remaining ?? []).slice(0, 30).map((c, i) => (
                      <li key={i} className="text-[11px] text-gray-700 dark:text-gray-300 flex justify-between gap-2">
                        <span className="truncate"><span className="font-mono text-gray-500">{c.course_code}</span> {c.course_name}</span>
                        <span className="shrink-0 text-gray-400">{c.crd_hrs ? `${c.crd_hrs}س` : ''}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
          </>
        )}
      </Card>

      {/* Results - before/after comparison */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Before */}
          <Card className="border-t-4 border-t-gray-400">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3">
              {t('الوضع الحالي', 'Current State')}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">{t('المعدل', 'GPA')}</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">{result.originalGPA}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">{t('التخرج', 'Graduation')}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{t(result.originalGraduationDate, result.originalGraduationDateEn)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">{t('فصول متبقية', 'Semesters Left')}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{result.originalSemestersRemaining}</span>
              </div>
            </div>
          </Card>

          {/* After */}
          <Card className="border-t-4 border-t-sa-500">
            <h4 className="text-xs font-bold text-sa-600 dark:text-sa-400 uppercase mb-3">
              {t('بعد التغيير', 'After Change')}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">{t('المعدل', 'GPA')}</span>
                <span className={`text-xl font-bold ${result.projectedGPA >= result.originalGPA ? 'text-emerald-600' : 'text-error-500'}`}>
                  {result.projectedGPA}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">{t('التخرج', 'Graduation')}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{t(result.graduationDate, result.graduationDateEn)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-300">{t('فصول متبقية', 'Semesters Left')}</span>
                <span className={`text-sm font-medium ${result.semestersRemaining > result.originalSemestersRemaining ? 'text-error-500' : 'text-emerald-600'}`}>
                  {result.semestersRemaining}
                </span>
              </div>
            </div>
          </Card>

          {/* Summary */}
          <div className="md:col-span-2">
            <Card className="bg-sa-50 dark:bg-sa-950 border-sa-200 dark:border-sa-800">
              <p className="text-sm text-sa-800 dark:text-sa-200">
                {t(result.impactSummaryAr, result.impactSummaryEn)}
              </p>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
