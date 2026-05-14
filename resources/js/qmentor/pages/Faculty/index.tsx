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
  colleges, allDepartments, allCourses, facultyMembers as mockFacultyMembers, semesterTrends, heatmapData,

} from './data/mockFacultyData';
import { useCurrentCourses } from '../../hooks/useStudentData';
import type { FacultyMember } from './types';

type TabKey = 'heatmap' | 'courses' | 'departments' | 'colleges' | 'faculty' | 'atrisk' | 'workload' | 'trends';

export default function FacultyDashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('heatmap');

  const coursesResult = useCurrentCourses(null);
  const overallSource = coursesResult.source === 'api' ? 'api' as const : 'mock' as const;

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

  const tabs: { key: TabKey; labelAr: string; labelEn: string }[] = [
    { key: 'heatmap', labelAr: 'خريطة الشعب', labelEn: 'Section Heatmap' },
    { key: 'courses', labelAr: 'إحصائيات المقررات', labelEn: 'Course Statistics' },
    { key: 'departments', labelAr: 'الأقسام', labelEn: 'Departments' },
    { key: 'colleges', labelAr: 'الكليات', labelEn: 'Colleges' },
    { key: 'faculty', labelAr: 'أعضاء هيئة التدريس', labelEn: 'Faculty Members' },
    { key: 'atrisk', labelAr: 'الطلاب المعرضون للخطر', labelEn: 'At-Risk Students' },
    { key: 'workload', labelAr: 'تحليل الأعباء', labelEn: 'Workload Analysis' },
    { key: 'trends', labelAr: 'تحليل الاتجاهات', labelEn: 'Trend Analysis' },
  ];

  return (
    <div>
      <PageHeader
        title={t('لوحة أعضاء هيئة التدريس', 'Faculty Analytics Dashboard')}
        subtitle={t(
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
