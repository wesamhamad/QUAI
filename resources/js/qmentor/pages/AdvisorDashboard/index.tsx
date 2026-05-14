import { useState, useMemo } from 'react';
import {
  UsersIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentCheckIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedTab from '../../components/shared/AnimatedTab';
import PageHeader from '../../components/shared/PageHeader';
import Card, { StatCard } from '../../components/ui/Card';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import StudentTable from './components/StudentTable';
import RiskDistributionChart from './components/RiskDistributionChart';
import InterventionLog from './components/InterventionLog';
import AppointmentsList from './components/AppointmentsList';
import QuickActions from './components/QuickActions';
import InterventionModal from './components/InterventionModal';
import AppointmentScheduler from './components/AppointmentScheduler';
import CaseloadManagement from './components/CaseloadManagement';
import AgentActionsFeed from './components/AgentActionsFeed';
import TeamsMeetings from './components/TeamsMeetings';
import StudentDigitalTwinCard from './components/StudentDigitalTwinCard';
import StudentReports from './components/StudentReports';
import StudentMessaging from './components/StudentMessaging';
import CaseloadAnalytics from './components/CaseloadAnalytics';
import { mockStudents, mockInterventions, mockAppointments, mockCaseload, mockAgentActions, mockTeamsMeetings, layanDigitalTwin } from './data/mockAdvisorData';
import { useStudentProfile, useAbsences, useCurrentCourses } from '../../hooks/useStudentData';
import type { Student } from './types';

type TabKey = 'portfolio' | 'agent' | 'interventions' | 'messaging' | 'reports' | 'analytics' | 'caseload';

export default function AdvisorDashboard() {
  const { t } = useLanguage();
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('portfolio');

  const profileResult = useStudentProfile(null);
  const absencesResult = useAbsences(null);
  const coursesResult = useCurrentCourses(null);

  const sources = [profileResult.source, absencesResult.source, coursesResult.source];
  const overallSource = sources.includes('api') ? 'api' as const : 'mock' as const;

  // Inject real student (Layan) into mock student list if API data is available
  const students = useMemo(() => {
    if (profileResult.source !== 'api' || !profileResult.data) return mockStudents;

    const raw = profileResult.data as Record<string, unknown>;
    const profile = (raw.profile ?? raw) as Record<string, unknown>;
    const academic = (profile.academic ?? {}) as Record<string, unknown>;
    const major = (profile.major ?? {}) as Record<string, unknown>;
    const gpa = parseFloat(String(academic.last_recorded_gpa ?? academic.cumulative_gpa ?? '0'));

    // Calculate risk from absence data
    let riskLevel: Student['riskLevel'] = 'low';
    if (absencesResult.source === 'api' && Array.isArray(absencesResult.data)) {
      const maxAbsence = Math.max(...(absencesResult.data as Record<string, unknown>[]).map(
        a => parseFloat(String(a.absence_all_percent ?? '0')) || 0
      ));
      if (maxAbsence >= 25) riskLevel = 'critical';
      else if (maxAbsence >= 15) riskLevel = 'high';
      else if (maxAbsence >= 10) riskLevel = 'medium';
    }

    const realStudent: Student = {
      id: String(profile.student_id ?? profile.id ?? ''),
      name: String(profile.name ?? ''),
      nameEn: String(profile.name_en ?? ''),
      department: String(major.name ?? ''),
      departmentEn: String(major.name_en ?? ''),
      gpa,
      riskLevel,
      lastContact: new Date().toISOString().split('T')[0],
      status: gpa < 2.0 ? 'probation' : 'active',
      statusAr: gpa < 2.0 ? 'إنذار أكاديمي' : 'نشط',
      email: '',
    };

    return [realStudent, ...mockStudents];
  }, [profileResult.source, profileResult.data, absencesResult.source, absencesResult.data]);

  const atRiskCount = students.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length;
  const highRiskCount = students.filter(s => s.riskLevel === 'critical').length;
  const improvingCount = students.filter(s => s.riskLevel === 'medium').length;
  const pendingInterventions = students.filter(s => s.riskLevel === 'critical').length;
  const todayAppointments = mockAppointments.filter(a => a.isToday).length;
  const averageGpa = +(students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2);

  const tabs: { key: TabKey; labelAr: string; labelEn: string }[] = [
    { key: 'portfolio', labelAr: 'محفظة الطلاب', labelEn: 'Student Portfolio' },
    { key: 'agent', labelAr: 'الوكيل والاجتماعات', labelEn: 'Agent & Meetings' },
    { key: 'interventions', labelAr: 'التدخلات والمواعيد', labelEn: 'Interventions & Appointments' },
    { key: 'messaging', labelAr: 'إرسال رسالة', labelEn: 'Send Message' },
    { key: 'reports', labelAr: 'التقارير', labelEn: 'Reports' },
    { key: 'analytics', labelAr: 'تحليلات الحالات', labelEn: 'Caseload Analytics' },
    { key: 'caseload', labelAr: 'إدارة الحالات', labelEn: 'Caseload Management' },
  ];

  return (
    <div>
      <PageHeader
        title={t('لوحة المرشد الأكاديمي', 'Advisor Dashboard')}
        subtitle={t('إدارة ومتابعة الطلاب المسندين إليك', 'Manage and monitor your assigned students')}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('لوحة المرشد', 'Advisor Dashboard') },
        ]}
        actions={<DataSourceBadge source={overallSource} />}
        accentColor="bg-sa-500"
      />

      {/* Risk Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard
          title={t('إجمالي الطلاب', 'Total Students')}
          value={students.length}
          icon={<UsersIcon className="w-5 h-5" />}
          trend={{ value: t('+٣ هذا الفصل', '+3 this semester'), positive: true }}
        />
        <StatCard
          title={t('طلاب معرضون للخطر', 'At-Risk')}
          value={atRiskCount}
          icon={<ExclamationTriangleIcon className="w-5 h-5" />}
          className="border-s-4 border-s-error-500"
          trend={{ value: t('+٢ عن الشهر', '+2 from last month'), positive: false }}
        />
        <StatCard
          title={t('خطر حرج', 'High Risk')}
          value={highRiskCount}
          icon={<ArrowTrendingDownIcon className="w-5 h-5" />}
          className="border-s-4 border-s-warning-500"
        />
        <StatCard
          title={t('تحسّن ملحوظ', 'Improving')}
          value={improvingCount}
          icon={<ArrowTrendingUpIcon className="w-5 h-5" />}
          className="border-s-4 border-s-success-500"
        />
        <StatCard
          title={t('المعدل المتوسط', 'Avg GPA')}
          value={averageGpa}
          icon={<AcademicCapIcon className="w-5 h-5" />}
        />
        <StatCard
          title={t('مواعيد اليوم', "Today's Appts")}
          value={todayAppointments}
          icon={<CalendarDaysIcon className="w-5 h-5" />}
        />
      </div>

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
              {tab.key === 'agent' && mockAgentActions.filter(a => a.status === 'pending_approval').length > 0 && (
                <span className="ms-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold bg-sa-500 text-white">
                  {mockAgentActions.filter(a => a.status === 'pending_approval').length}
                </span>
              )}
              {tab.key === 'interventions' && pendingInterventions > 0 && (
                <span className="ms-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold bg-error-500 text-white">
                  {pendingInterventions}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatedTab activeKey={activeTab}>
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <Card>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4">
                  {t('قائمة الطلاب', 'Student List')}
                </h3>
                <StudentTable students={students} />
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <RiskDistributionChart distribution={{
                  critical: students.filter(s => s.riskLevel === 'critical').length,
                  high: students.filter(s => s.riskLevel === 'high').length,
                  medium: students.filter(s => s.riskLevel === 'medium').length,
                  low: students.filter(s => s.riskLevel === 'low').length,
                }} />
              </Card>
              <Card>
                <QuickActions
                  onScheduleMeeting={() => setShowScheduler(true)}
                  onAddIntervention={() => setShowInterventionModal(true)}
                />
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'agent' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Digital Twin + Teams Meetings */}
            <div className="xl:col-span-2 space-y-6">
              <StudentDigitalTwinCard data={layanDigitalTwin} />
              <Card>
                <TeamsMeetings meetings={mockTeamsMeetings} />
              </Card>
            </div>
            {/* Right: Agent Actions Feed */}
            <div>
              <Card>
                <AgentActionsFeed actions={mockAgentActions} />
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'interventions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <InterventionLog
                interventions={mockInterventions}
                onAddNew={() => setShowInterventionModal(true)}
              />
            </Card>
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                    {t('المواعيد', 'Appointments')}
                  </h3>
                  <button
                    onClick={() => setShowScheduler(true)}
                    className="text-xs font-medium text-sa-600 dark:text-sa-400 hover:underline"
                  >
                    + {t('جدولة موعد', 'Schedule')}
                  </button>
                </div>
                <AppointmentsList appointments={mockAppointments} />
              </Card>
              <Card>
                <QuickActions
                  onScheduleMeeting={() => setShowScheduler(true)}
                  onAddIntervention={() => setShowInterventionModal(true)}
                />
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'messaging' && (
          <StudentMessaging />
        )}

        {activeTab === 'reports' && (
          <StudentReports />
        )}

        {activeTab === 'analytics' && (
          <CaseloadAnalytics />
        )}

        {activeTab === 'caseload' && (
          <CaseloadManagement students={students} caseload={mockCaseload} />
        )}
      </AnimatedTab>

      <InterventionModal
        open={showInterventionModal}
        onClose={() => setShowInterventionModal(false)}
        students={students}
      />

      <AppointmentScheduler
        open={showScheduler}
        onClose={() => setShowScheduler(false)}
        students={students}
      />
    </div>
  );
}
