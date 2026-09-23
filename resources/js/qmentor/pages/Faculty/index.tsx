import { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedTab from '../../components/shared/AnimatedTab';
import PageHeader from '../../components/shared/PageHeader';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import SectionHeatmap from './components/SectionHeatmap';
import CourseStatistics from './components/CourseStatistics';
import DepartmentView from './components/DepartmentView';
import CollegeView from './components/CollegeView';
import FacultyMemberStats from './components/FacultyMemberStats';
import TrendAnalysis from './components/TrendAnalysis';
import AtRiskStudents from './components/AtRiskStudents';
import WorkloadAnalysis from './components/WorkloadAnalysis';
import {
  colleges as mockColleges, allDepartments as mockDepartments, allCourses as mockCourses, facultyMembers as mockFacultyMembers, semesterTrends as mockTrends, heatmapData as mockHeatmap,

} from './data/mockFacultyData';
import { useCurrentCourses, useFacultyOverview } from '../../hooks/useStudentData';
import { adaptOverview, semesterLabel, type FacultyOverview } from './adapters';
import type { FacultyMember } from './types';
import { Link } from 'react-router-dom';
import { useRole } from '../../contexts/RoleContext';
import EmptyState from '../DigitalTwin/components/EmptyState';

type TabKey = 'heatmap' | 'courses' | 'departments' | 'colleges' | 'faculty' | 'atrisk' | 'workload' | 'trends';

export default function FacultyDashboard() {
  const { role } = useRole();
  return role === 'advisor' ? <AdvisorFacultyNotice /> : <FacultyAnalytics />;
}

/** The college/department aggregates are not scoped to anyone's advisees, so faculty do not read them (the API 403s). */
function AdvisorFacultyNotice() {
  const { t } = useLanguage();
  return (
    <div>
      <PageHeader
        title={t('لوحة أعضاء هيئة التدريس', 'Faculty Analytics Dashboard')}
        subtitle={t('تحليلات الكليات والأقسام متاحة للمشرف العام فقط', 'College and department analytics are available to the administrator only')}
        breadcrumbs={[{ label: t('الرئيسية', 'Home'), href: '/' }, { label: t('لوحة هيئة التدريس', 'Faculty Dashboard') }]}
        accentColor="bg-sa-500"
      />
      <EmptyState
        title={t('لا توجد بيانات ضمن نطاقك هنا', 'Nothing in your scope here')}
        description={t('بيانات طلابك الإرشاديين في «طلابي» و«الطلاب المعرضون للخطر».', 'Your advisees are under My Advisees and At-Risk Students.')}
        icon="chart"
      />
      <div className="mt-4 flex justify-center gap-4 text-sm">
        <Link to="/advisor-dashboard" className="text-sa-600 hover:underline">{t('طلابي', 'My Advisees')}</Link>
        <Link to="/advisor-dashboard?tab=at-risk" className="text-sa-600 hover:underline">{t('الطلاب المعرضون للخطر', 'At-Risk Students')}</Link>
      </div>
    </div>
  );
}

function FacultyAnalytics() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('heatmap');

  const coursesResult = useCurrentCourses(null);

  // The cohort aggregates (college / department / course) — live when the
  // signed-in user is an advisor or the admin and the cohort tables are loaded.
  const overview = useFacultyOverview<FacultyOverview | null>(null);
  const live = overview.source === 'api' && overview.data != null;
  const overallSource = live ? 'api' as const : 'mock' as const;
  const shaped = useMemo(() => live ? adaptOverview(overview.data as FacultyOverview) : null, [live, overview.data]);
  const colleges = shaped?.colleges ?? mockColleges;
  const allDepartments = shaped?.departments ?? mockDepartments;
  const allCourses = shaped?.courses ?? mockCourses;
  const semesterTrends = shaped?.trends ?? mockTrends;
  const heatmapData = shaped?.heatmap ?? mockHeatmap;

  // Inject real course instructors into faculty list
  const facultyMembers: FacultyMember[] = useMemo(() => {
    if (coursesResult.source !== 'api' || !Array.isArray(coursesResult.data)) return mockFacultyMembers;

    const realInstructors = new Map<string, Record<string, unknown>>();
    (coursesResult.data as Record<string, unknown>[]).forEach(c => {
      const name = String(c.instructor_name ?? '');
      if (name && !realInstructors.has(name)) {
        realInstructors.set(name, c);
      }
    });

    if (realInstructors.size === 0) return mockFacultyMembers;

    // Check if real instructors already exist in mock list
    const existingNames = new Set(mockFacultyMembers.map(f => f.nameAr));
    const newFaculty: FacultyMember[] = [];

    realInstructors.forEach((course, name) => {
      if (!existingNames.has(name)) {
        newFaculty.push({
          id: `fac-real-${newFaculty.length}`,
          nameAr: name,
          nameEn: name,
          departmentId: 'dept-real',
          departmentAr: String(course.activity_desc ?? 'محاسبة'),
          departmentEn: String(course.activity_desc ?? 'Accounting'),
          collegeAr: 'كلية إدارة الأعمال والاقتصاد',
          collegeEn: 'College of Business & Economics',
          rank: 'أستاذ مساعد',
          rankEn: 'Assistant Professor',
          coursesCount: 1,
          avgStudentSatisfaction: 4.2,
          avgGPA: 3.5,
          totalStudents: 45,
          gradeDistribution: { aPlus: 5, a: 10, bPlus: 12, b: 8, cPlus: 5, c: 3, dPlus: 1, d: 1, f: 0 },
          studentOutcomes: { passed: 40, failed: 3, withdrawn: 2 },
        });
      }
    });

    return [...newFaculty, ...mockFacultyMembers];
  }, [coursesResult.source, coursesResult.data]);

  const allTabs: { key: TabKey; labelAr: string; labelEn: string }[] = [
    { key: 'heatmap', labelAr: 'خريطة الشعب', labelEn: 'Section Heatmap' },
    { key: 'courses', labelAr: 'إحصائيات المقررات', labelEn: 'Course Statistics' },
    { key: 'departments', labelAr: 'الأقسام', labelEn: 'Departments' },
    { key: 'colleges', labelAr: 'الكليات', labelEn: 'Colleges' },
    { key: 'faculty', labelAr: 'أعضاء هيئة التدريس', labelEn: 'Faculty Members' },
    { key: 'atrisk', labelAr: 'الطلاب المعرضون للخطر', labelEn: 'At-Risk Students' },
    { key: 'workload', labelAr: 'تحليل الأعباء', labelEn: 'Workload Analysis' },
    { key: 'trends', labelAr: 'تحليل الاتجاهات', labelEn: 'Trend Analysis' },
  ];
  // The transcript feed names no instructor, so the two per-member tabs have
  // nothing real to show once live data is in; they stay on the roadmap.
  const tabs = live ? allTabs.filter(t => t.key !== 'faculty' && t.key !== 'workload') : allTabs;
  const gradedLabel = live ? semesterLabel((overview.data as FacultyOverview).graded_semester) : null;
  const rosterLabel = live ? semesterLabel((overview.data as FacultyOverview).roster_semester) : null;

  return (
    <div>
      <PageHeader
        title={t('لوحة أعضاء هيئة التدريس', 'Faculty Analytics Dashboard')}
        subtitle={live
          ? t(
            `${colleges.length} كليات · ${allDepartments.length} قسم · ${allCourses.length} مقرر · التسجيل من فصل ${rosterLabel?.ar} والنتائج من فصل ${gradedLabel?.ar} · «الشعبة» هنا = مقرر × قسم`,
            `${colleges.length} colleges · ${allDepartments.length} departments · ${allCourses.length} courses · enrolment from ${rosterLabel?.en}, results from ${gradedLabel?.en} · a "section" here is course × department`
          )
          : t(
            `تحليلات ${colleges.length} كليات · ${allDepartments.length} قسم · ${allCourses.length} مقرر · ${facultyMembers.length} عضو هيئة تدريس`,
            `Analytics across ${colleges.length} colleges · ${allDepartments.length} departments · ${allCourses.length} courses · ${facultyMembers.length} faculty members`
          )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('لوحة هيئة التدريس', 'Faculty Dashboard') },
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
        {activeTab === 'heatmap' && <SectionHeatmap data={heatmapData} colleges={colleges} />}
        {activeTab === 'courses' && <CourseStatistics courses={allCourses} />}
        {activeTab === 'departments' && <DepartmentView departments={allDepartments} />}
        {activeTab === 'colleges' && <CollegeView colleges={colleges} />}
        {activeTab === 'faculty' && <FacultyMemberStats faculty={facultyMembers} />}
        {activeTab === 'atrisk' && <AtRiskStudents courses={allCourses} />}
        {activeTab === 'workload' && <WorkloadAnalysis faculty={facultyMembers} />}
        {activeTab === 'trends' && <TrendAnalysis trends={semesterTrends} />}
      </AnimatedTab>
    </div>
  );
}
