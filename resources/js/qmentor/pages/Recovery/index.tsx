import { useState, useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedTab from '../../components/shared/AnimatedTab';
import PageHeader from '../../components/shared/PageHeader';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import RecoveryDashboard from './components/RecoveryDashboard';
import GPASimulator from './components/GPASimulator';
import RecoveryMilestones from './components/RecoveryMilestones';
import ActionItems from './components/ActionItems';
import ProgressTracker from './components/ProgressTracker';
import SupportResources from './components/SupportResources';
import {
  recoveryStudent,
  recoveryCourses,
  recoveryMilestones,
  actionItems,
  weeklyProgress,
  supportResources,
} from './data/mockRecoveryData';
import { useStudentProfile, useAbsences } from '../../hooks/useStudentData';
import type { RecoveryStudent, RecoveryCourse } from './types';

type TabKey = 'dashboard' | 'simulator' | 'milestones' | 'actions' | 'progress' | 'support';

export default function RecoveryPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  const profileResult = useStudentProfile(null);
  const absencesResult = useAbsences(null);
  const overallSource = (profileResult.source === 'api' || absencesResult.source === 'api') ? 'api' as const : 'mock' as const;

  // Merge real student profile if available
  const student: RecoveryStudent = useMemo(() => {
    if (profileResult.source !== 'api' || !profileResult.data) return recoveryStudent;
    const raw = profileResult.data as Record<string, unknown>;
    const profile = (raw.profile ?? raw) as Record<string, unknown>;
    const academic = (profile.academic ?? {}) as Record<string, unknown>;
    const major = (profile.major ?? {}) as Record<string, unknown>;
    const gpa = parseFloat(String(academic.last_recorded_gpa ?? academic.cumulative_gpa ?? '0'));
    if (!gpa) return recoveryStudent;

    return {
      ...recoveryStudent,
      name: String(profile.name ?? recoveryStudent.name),
      nameEn: String(profile.name_en ?? recoveryStudent.nameEn),
      studentId: String(profile.student_id ?? profile.id ?? recoveryStudent.studentId),
      major: String(major.name ?? recoveryStudent.major),
      majorEn: String(major.name_en ?? recoveryStudent.majorEn),
      currentGPA: gpa,
    };
  }, [profileResult.source, profileResult.data]);

  // Add high-absence courses as recovery targets
  const courses: RecoveryCourse[] = useMemo(() => {
    if (absencesResult.source !== 'api' || !Array.isArray(absencesResult.data)) return recoveryCourses;

    const realCourses: RecoveryCourse[] = (absencesResult.data as Record<string, unknown>[])
      .filter(c => (parseFloat(String(c.absence_all_percent ?? '0')) || 0) >= 10)
      .map(c => {
        const pct = parseFloat(String(c.absence_all_percent ?? '0')) || 0;
        return {
          code: String(c.cource_code ?? c.course_code ?? ''),
          nameAr: String(c.cource_name ?? c.course_name ?? ''),
          nameEn: String(c.cource_name ?? c.course_name ?? ''),
          creditHours: 3,
          currentGrade: pct >= 20 ? 'D' : 'C',
          currentPoints: pct >= 20 ? 2.0 : 2.5,
          isAtRisk: pct >= 15,
        };
      });

    if (realCourses.length === 0) return recoveryCourses;
    // Merge: real high-absence courses first, then mock courses that don't overlap
    const realCodes = new Set(realCourses.map(c => c.code));
    return [...realCourses, ...recoveryCourses.filter(c => !realCodes.has(c.code))];
  }, [absencesResult.source, absencesResult.data]);

  const tabs: { key: TabKey; labelAr: string; labelEn: string }[] = [
    { key: 'dashboard', labelAr: 'لوحة التعافي', labelEn: 'Dashboard' },
    { key: 'simulator', labelAr: 'محاكي المعدل', labelEn: 'GPA Simulator' },
    { key: 'milestones', labelAr: 'المراحل', labelEn: 'Milestones' },
    { key: 'actions', labelAr: 'المهام', labelEn: 'Actions' },
    { key: 'progress', labelAr: 'التقدم', labelEn: 'Progress' },
    { key: 'support', labelAr: 'الدعم', labelEn: 'Support' },
  ];

  return (
    <div>
      <PageHeader
        title={t('برنامج التعافي الأكاديمي', 'Academic Recovery Program')}
        subtitle={t(
          'خطة التعافي الأكاديمي الطارئ — متابعة التقدم وتحقيق الأهداف',
          'Emergency academic recovery plan — track progress and achieve goals'
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('برنامج التعافي', 'Recovery Program') },
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
        {activeTab === 'dashboard' && (
          <RecoveryDashboard student={student} courses={courses} />
        )}
        {activeTab === 'simulator' && (
          <GPASimulator student={student} courses={courses} />
        )}
        {activeTab === 'milestones' && (
          <RecoveryMilestones milestones={recoveryMilestones} />
        )}
        {activeTab === 'actions' && (
          <ActionItems items={actionItems} />
        )}
        {activeTab === 'progress' && (
          <ProgressTracker progress={weeklyProgress} student={student} />
        )}
        {activeTab === 'support' && (
          <SupportResources resources={supportResources} />
        )}
      </AnimatedTab>
    </div>
  );
}
