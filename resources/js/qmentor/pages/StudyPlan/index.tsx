import { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedTab from '../../components/shared/AnimatedTab';
import PageHeader from '../../components/shared/PageHeader';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import PlanOverview from './components/PlanOverview';
import PrerequisiteTree from './components/PrerequisiteTree';
import SemesterBuilder from './components/SemesterBuilder';
import WhatIfSimulator from './components/WhatIfSimulator';
import ElectiveRecommendations from './components/ElectiveRecommendations';
import ScheduleOptions from './components/ScheduleOptions';
import AvailableCourses from './components/AvailableCourses';
import {
  studentProfile,
  allCourses,
  currentSemesterPlan,
  electiveRecommendations,
  scheduleOptions,
  availableCoursesForRegistration,
} from './data/mockStudyPlanData';
import { useStudentProfile, useCurrentCourses, useStudentPlan, useAvailableCourses, useAcademicPlanForMe } from '../../hooks/useStudentData';
import type { Course, StudentPlanProfile, AvailableCourse } from './types';

type TabKey = 'overview' | 'prerequisites' | 'builder' | 'available' | 'whatif' | 'electives' | 'options';

function mapApiToAvailableCourses(apiData: unknown): AvailableCourse[] {
  if (!Array.isArray(apiData)) return [];
  return (apiData as Record<string, unknown>[]).map((c, i) => ({
    code: String(c.course_code ?? c.code ?? ''),
    nameAr: String(c.course_name ?? c.nameAr ?? ''),
    nameEn: String(c.course_name_en ?? c.nameEn ?? ''),
    creditHours: Number(c.credit_hours ?? c.creditHours ?? 3),
    instructor: String(c.instructor ?? ''),
    instructorEn: String(c.instructor_en ?? c.instructorEn ?? c.instructor ?? ''),
    schedule: String(c.schedule ?? ''),
    scheduleEn: String(c.schedule_en ?? c.scheduleEn ?? c.schedule ?? ''),
    room: String(c.room ?? ''),
    roomEn: String(c.room_en ?? c.roomEn ?? c.room ?? ''),
    seats: Number(c.seats ?? 30),
    enrolled: Number(c.enrolled ?? 0),
    section: String(c.section ?? i + 1),
  }));
}

// API profile: { profile: { name, name_en, student_id, academic: { cumulative_gpa, last_recorded_gpa, total_plan_hours, total_earned_hours, ... }, major: { name, name_en }, faculty: { name, name_en } } }
function mapApiToStudyPlanProfile(apiData: unknown): StudentPlanProfile {
  const raw = apiData as Record<string, unknown>;
  const profileWrapper = (raw.profile ?? raw) as Record<string, unknown>;
  const academic = (profileWrapper.academic ?? {}) as Record<string, unknown>;
  const major = (profileWrapper.major ?? {}) as Record<string, unknown>;
  const faculty = (profileWrapper.faculty ?? {}) as Record<string, unknown>;

  const gpa = parseFloat(String(academic.last_recorded_gpa ?? academic.cumulative_gpa ?? '')) || studentProfile.currentGPA;
  const earnedHours = Number(academic.total_earned_hours ?? studentProfile.completedCredits);

  return {
    name: String(profileWrapper.name ?? studentProfile.name),
    nameEn: String(profileWrapper.name_en ?? studentProfile.nameEn),
    studentId: String(profileWrapper.student_id ?? profileWrapper.id ?? studentProfile.studentId),
    major: String(major.name ?? studentProfile.major),
    majorEn: String(major.name_en ?? studentProfile.majorEn),
    college: String(faculty.name ?? studentProfile.college),
    collegeEn: String(faculty.name_en ?? studentProfile.collegeEn),
    currentSemester: Math.ceil(earnedHours / 15) || studentProfile.currentSemester,
    currentGPA: gpa,
    gpaScale: 5.0,
    completedCredits: earnedHours,
    requiredCredits: Number(academic.total_plan_hours ?? studentProfile.requiredCredits),
    expectedGraduation: studentProfile.expectedGraduation,
    expectedGraduationEn: studentProfile.expectedGraduationEn,
  };
}

/**
 * Map API plan response (from qu-api-v2) → Course[]
 * API shape: { levels: [{ id, title, details: [{ code, title, hours, status, category, group }] }] }
 */
function mapApiToCourses(apiData: unknown, fallback: Course[]): Course[] {
  if (!apiData || typeof apiData !== 'object') return fallback;
  const raw = apiData as Record<string, unknown>;
  const levels = (raw.levels ?? raw) as Array<Record<string, unknown>>;
  if (!Array.isArray(levels) || levels.length === 0) return fallback;

  const statusMap: Record<string, Course['status']> = {
    passed: 'completed',
    student_schedule: 'in-progress',
    remaining: 'available',
  };

  const categoryMap: Record<string, Course['category']> = {
    'متطلبات جامعة': 'university',
    'متطلبات كلية': 'college',
    'متطلبات تخصص': 'major-core',
    'متطلبات قسم': 'major-core',
    'اختيارية تخصص': 'major-elective',
    'اختيارية حرة': 'free-elective',
  };

  const courses: Course[] = [];

  for (const level of levels) {
    const semesterNum = Number(level.id ?? 0);
    const details = (level.details ?? []) as Array<Record<string, unknown>>;

    for (const d of details) {
      const code = String(d.code ?? '').trim();
      const apiStatus = String(d.status ?? 'remaining');
      const apiCategory = String(d.category ?? '');

      // Try to find a matching mock course to preserve prerequisites & English name
      const mockMatch = fallback.find(m => m.code.replace(/\s+/g, '') === code.replace(/\s+/g, ''));

      courses.push({
        code,
        nameAr: String(d.title ?? mockMatch?.nameAr ?? code),
        nameEn: mockMatch?.nameEn ?? String(d.title ?? code),
        creditHours: Number(d.hours ?? mockMatch?.creditHours ?? 3),
        prerequisites: mockMatch?.prerequisites ?? [],
        category: categoryMap[apiCategory] ?? mockMatch?.category ?? 'university',
        planSemester: semesterNum,
        status: statusMap[apiStatus] ?? 'locked',
        grade: mockMatch?.grade,
        gradePoints: mockMatch?.gradePoints,
        descriptionAr: mockMatch?.descriptionAr,
        descriptionEn: mockMatch?.descriptionEn,
      });
    }
  }

  return courses.length > 0 ? courses : fallback;
}

/**
 * Compact banner that surfaces real plan-summary stats (total hrs, required vs
 * elective, university/department/major hour breakdowns) above the Plan Options
 * tab. Source: first track of /api/v1/academic-plan/major-and-main, bundled by
 * the controller as `data.summary`.
 */
function PlanSummaryBanner({ data, t }: { data: unknown; t: (a: string, e: string) => string }) {
  if (!data || typeof data !== 'object') return null;
  const summary = (data as Record<string, unknown>) ?? null;
  if (!summary) return null;

  const stats: Array<{ ar: string; en: string; value: string | number }> = [];
  const push = (ar: string, en: string, ...keys: string[]) => {
    for (const key of keys) {
      const v = summary[key];
      if (v !== undefined && v !== null && v !== '' && Number(v) !== 0) {
        stats.push({ ar, en, value: String(v) });
        return;
      }
    }
  };
  push('إجمالي الساعات', 'Total Hours', 'total_hours', 'total_hrs');
  push('الساعات الإلزامية', 'Required Hours', 'required_hours', 'required_hrs');
  push('الساعات الاختيارية', 'Elective Hours', 'elective_hours', 'elective_hrs');
  push('متطلبات الجامعة', 'University Req.', 'university_requirements_hours', 'university_requirements_hrs');
  push('متطلبات القسم', 'Department Req.', 'department_required_hours', 'college_requirements_hrs');
  push('متطلبات التخصص', 'Major Req.', 'major_required_hours', 'major_requirements_hrs');

  if (stats.length === 0) return null;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 mb-4">
      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">
        {t('ملخص خطة التخصص', 'Major Plan Summary')}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="text-center sm:text-start">
            <p className="text-[10px] text-gray-400 dark:text-gray-500">{t(s.ar, s.en)}</p>
            <p className="text-base font-bold text-sa-700 dark:text-sa-400 mt-0.5">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Map the v1 academic-plan/{majorNo} response to ElectiveRecommendation[].
 * After server unwrap the plan looks like:
 *   { major_no, major_name, edition, courses: [
 *       { course_no, course_code, course_name, course_name_s, crd_hrs,
 *         category_code, category_code_desc, group_type, group_type_desc, ... }
 *   ] }
 * "Elective" is anything where `group_type !== '1'` (group_type='1' is required).
 * We also accept the legacy `{ levels: [{ details: [...] }] }` shape so this
 * still works against any controller that hasn't been migrated.
 */
function mapPlanToElectives(raw: unknown): import('./types').ElectiveRecommendation[] {
  if (!raw || typeof raw !== 'object') return [];
  const obj = raw as Record<string, unknown>;

  const categoryMap: Record<string, import('./types').CourseCategory> = {
    'متطلبات جامعة':  'university',
    'متطلبات كلية':   'college',
    'متطلبات تخصص':   'major-core',
    'متطلبات قسم':    'major-core',
    'اختيارية تخصص':  'major-elective',
    'اختيارية حرة':   'free-elective',
  };

  // Flatten all course rows from either shape into a single list.
  const rows: Array<Record<string, unknown>> = [];
  if (Array.isArray(obj.courses)) {
    rows.push(...(obj.courses as Array<Record<string, unknown>>));
  } else if (Array.isArray(obj.levels)) {
    for (const level of obj.levels as Array<Record<string, unknown>>) {
      const details = (level.details ?? []) as Array<Record<string, unknown>>;
      if (Array.isArray(details)) rows.push(...details);
    }
  }
  if (rows.length === 0) return [];

  const out: import('./types').ElectiveRecommendation[] = [];
  const seen = new Set<string>();

  for (const c of rows) {
    const groupType = String(c.group_type ?? '1');
    if (groupType === '1') continue; // required, not an elective
    const status = String(c.status ?? '').toLowerCase();
    if (status === 'passed') continue;

    const code = String(c.course_code ?? c.course_no ?? '').trim();
    if (!code || seen.has(code)) continue;
    seen.add(code);

    const nameAr = String(c.course_name ?? code);
    const nameEn = String(c.course_name_s ?? c.course_name_en ?? code);
    const categoryDesc = String(c.category_code_desc ?? '');
    const category: import('./types').CourseCategory = categoryMap[categoryDesc] ?? 'free-elective';
    const creditHours = Number(c.crd_hrs ?? c.hours ?? 3) || 3;

    out.push({
      code,
      nameAr,
      nameEn,
      creditHours,
      category,
      reasonAr: categoryDesc || 'مقرر اختياري ضمن خطتك',
      reasonEn: 'Elective course in your plan',
      difficulty: 'medium',
      professorRating: 4,
      gpaImpact: 'neutral',
      careerTags: [],
      careerTagsEn: [],
    });
  }

  return out;
}

export default function StudyPlanPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const profileResult = useStudentProfile(studentProfile);
  const coursesResult = useCurrentCourses(allCourses);
  const planResult = useStudentPlan(allCourses);

  const courses: Course[] = useMemo(() => {
    if (planResult.source === 'api' && planResult.data) {
      return mapApiToCourses(planResult.data, allCourses);
    }
    return allCourses;
  }, [planResult.source, planResult.data]);
  const availableResult = useAvailableCourses(availableCoursesForRegistration);

  // v1 academic plan — for "اختيارية مقترحة" + "خيارات الخطة" tabs.
  // Controller resolves major_no from /me and returns { summary, plan }:
  //   summary → /academic-plan/major-and-main first track (hour totals)
  //   plan    → /academic_plan/{majorNo} unwrapped to { major_no, courses: [...] }
  const academicPlanForMe = useAcademicPlanForMe<unknown>(null);

  const sources = [profileResult.source, coursesResult.source, planResult.source, academicPlanForMe.source];
  const overallSource = sources.includes('api') ? 'api' as const : 'mock' as const;

  const profile = profileResult.source === 'api'
    ? mapApiToStudyPlanProfile(profileResult.data as unknown as Record<string, unknown>)
    : studentProfile;

  const availableCoursesList: AvailableCourse[] = useMemo(() => {
    if (availableResult.source === 'api' && availableResult.data) {
      return mapApiToAvailableCourses(availableResult.data);
    }
    return availableCoursesForRegistration;
  }, [availableResult.source, availableResult.data]);

  // Derive electives from the v1 plan response. Controller bundles two upstream
  // payloads as { summary, plan }:
  //   plan    → { major_no, edition, courses: [{ course_code, course_name, crd_hrs, group_type, category_code_desc, ... }] }
  //   summary → flat hour-totals object (total_hours, required_hours, university_requirements_hours, ...)
  // group_type === '1' is required; everything else is an elective.
  const planForMeData = academicPlanForMe.source === 'api'
    ? (academicPlanForMe.data as { summary?: unknown; plan?: unknown } | null)
    : null;
  const planForMePlan = planForMeData?.plan ?? null;
  const planForMeSummary = planForMeData?.summary ?? null;

  const electiveList = useMemo(() => {
    const derived = mapPlanToElectives(planForMePlan);
    return derived.length > 0 ? derived : electiveRecommendations;
  }, [planForMePlan]);

  const tabs: { key: TabKey; labelAr: string; labelEn: string }[] = [
    { key: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview' },
    { key: 'prerequisites', labelAr: 'شجرة المتطلبات', labelEn: 'Prerequisites' },
    { key: 'builder', labelAr: 'بناء الجدول', labelEn: 'Builder' },
    { key: 'available', labelAr: 'المقررات المتاحة', labelEn: 'Available Courses' },
    { key: 'whatif', labelAr: 'ماذا لو؟', labelEn: 'What-If' },
    { key: 'electives', labelAr: 'اختيارية مقترحة', labelEn: 'Electives' },
    { key: 'options', labelAr: 'خيارات الخطة', labelEn: 'Plan Options' },
  ];

  return (
    <div>
      <PageHeader
        title={t('الخطة الدراسية', 'Study Plan Builder')}
        subtitle={t(
          'بناء وتعديل الخطة الدراسية بالذكاء الاصطناعي',
          'AI-powered study plan creation and optimization'
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('الخطة الدراسية', 'Study Plan') },
        ]}
        actions={<DataSourceBadge source={overallSource} />}
        accentColor="bg-sa-500"
      />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex overflow-x-auto gap-6 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              data-active={activeTab === tab.key}
              className="tab-underline flex items-center gap-1.5 text-sm whitespace-nowrap pb-3"
            >
              {t(tab.labelAr, tab.labelEn)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatedTab activeKey={activeTab} className="space-y-6">
        {activeTab === 'overview' && (
          <PlanOverview profile={profile} courses={courses} />
        )}
        {activeTab === 'prerequisites' && (
          <PrerequisiteTree courses={courses} />
        )}
        {activeTab === 'builder' && (
          <SemesterBuilder courses={courses} initialPlan={currentSemesterPlan} />
        )}
        {activeTab === 'available' && (
          <AvailableCourses courses={availableCoursesList} source={availableResult.source === 'api' ? 'api' : 'mock'} />
        )}
        {activeTab === 'whatif' && (
          <WhatIfSimulator profile={profile} courses={courses} />
        )}
        {activeTab === 'electives' && (
          <ElectiveRecommendations recommendations={electiveList} />
        )}
        {activeTab === 'options' && (
          <>
            {planForMeSummary ? <PlanSummaryBanner data={planForMeSummary} t={t} /> : null}
            <ScheduleOptions options={scheduleOptions} courses={courses} />
          </>
        )}
      </AnimatedTab>
    </div>
  );
}
