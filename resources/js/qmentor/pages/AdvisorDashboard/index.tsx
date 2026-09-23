import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
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
import { useRole } from '../../contexts/RoleContext';
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
import ApprovalsQueue from './components/ApprovalsQueue';
import StudentMessaging from './components/StudentMessaging';
import RiskListTab from './components/RiskListTab';
import EmptyState from '../DigitalTwin/components/EmptyState';
import { useAdvisees, useRiskCaseload, useMyInterventions } from '../../hooks/useAdvisorData';
import type { LoggedIntervention } from '../../hooks/useAdvisorData';
import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../lib/api';
import type { Intervention } from './types';
import type { Advisee } from '../../hooks/useAdvisorData';
import type { Student, Appointment, CaseloadEntry } from './types';

/**
 * Map a SIS advisory-list row onto the table's Student shape.
 *
 * Risk is graded off GPA alone here, deliberately: the richer signals the
 * mock rows carry (attendance, last contact, interventions) have no source
 * for a student other than the signed-in one, and inventing them for a real
 * person on an advisor's screen would be worse than leaving them out.
 */
function toStudent(advisee: Advisee): Student {
  const gpa = Number(advisee.last_recorded_gpa) || 0;

  let riskLevel: Student['riskLevel'] = 'low';
  if (gpa > 0 && gpa < 2) riskLevel = 'critical';
  else if (gpa < 2.5) riskLevel = 'high';
  else if (gpa < 3) riskLevel = 'medium';

  return {
    id: String(advisee.student_id),
    name: advisee.student_name ?? '',
    nameEn: advisee.student_name_en ?? advisee.student_name ?? '',
    department: advisee.major_name ?? advisee.dept_name ?? '',
    departmentEn: advisee.major_name_en ?? advisee.major_name ?? '',
    gpa,
    riskLevel,
    lastContact: '',
    status: gpa > 0 && gpa < 2 ? 'probation' : 'active',
    statusAr: gpa > 0 && gpa < 2 ? 'إنذار أكاديمي' : 'نشط',
    email: advisee.email ?? '',
  };
}

type TabKey = 'portfolio' | 'at-risk' | 'recovery' | 'agent' | 'interventions' | 'messaging' | 'caseload';
const TAB_KEYS: TabKey[] = ['portfolio', 'at-risk', 'recovery', 'agent', 'interventions', 'messaging', 'caseload'];

// No appointment feed exists for advisors yet: nothing is shown rather than sample rows.
const noAppointments: Appointment[] = [];

export default function AdvisorDashboard() {
  const { t } = useLanguage();
  const { role } = useRole();
  // The admin's «caseload» is the whole pilot cohort; an advisor's is SIS_ADVISORY_LISTS.
  const wholeCohort = role === 'admin';
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  // ?tab=at-risk / ?tab=recovery — the two former pages, now tabs, keep a deep link.
  const [searchParams] = useSearchParams();
  const requested = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState<TabKey>(requested && (TAB_KEYS as string[]).includes(requested) ? requested as TabKey : 'portfolio');

  // The caseload itself, from SIS_ADVISORY_LISTS via qu-api v3. This replaced
  // a mock list into which one real student was injected — a shape that made
  // the board impossible to trust, because nothing on screen said which of the
  // eight rows was a person and which was fabricated.
  const adviseesResult = useAdvisees(undefined, wholeCohort);
  const hasRealCaseload = adviseesResult.source === 'api' && (adviseesResult.data?.length ?? 0) > 0;

  // The engine's verdict per advisee (31 indicators, nightly). It replaces the
  // GPA-only guess in toStudent() wherever the student has been scored.
  const adviseeIds = useMemo(() => (adviseesResult.data ?? []).map(a => a.student_id), [adviseesResult.data]);
  const riskResult = useRiskCaseload(wholeCohort ? [] : adviseeIds, wholeCohort);
  const riskMap = riskResult.source === 'api' ? (riskResult.data?.students ?? {}) : {};

  const students = useMemo(() => {
    // Real advisees only — an empty or unavailable caseload is shown as such, never as sample students.
    if (!hasRealCaseload) return [];
    return (adviseesResult.data ?? []).map(a => {
      const base = toStudent(a);
      const r = riskMap[a.student_id];
      return r ? { ...base, riskLevel: r.level.key } : base;
    });
  }, [hasRealCaseload, adviseesResult.data, riskMap]);

  // Interventions the advisor logged (UC-ADV-03/05) — a real row per save.
  const queryClient = useQueryClient();
  const myInterventions = useMyInterventions();
  const interventions = useMemo<Intervention[]>(() => {
    const rows = myInterventions.source === 'api' ? (myInterventions.data?.interventions ?? []) : null;
    if (!rows || rows.length === 0) return [];
    return rows.map((r: LoggedIntervention) => ({
      id: String(r.id),
      studentId: r.student_id,
      studentName: r.student_name,
      studentNameEn: r.student_id,
      date: String(r.performed_at).slice(0, 10),
      type: (r.type === 'call' ? 'note' : r.type) as Intervention['type'],
      typeAr: r.label,
      severity: 'normal',
      summary: r.note,
      summaryEn: r.note,
      followUpDate: r.follow_up ?? undefined,
      resolved: !!r.outcome,
    }));
  }, [myInterventions.source, myInterventions.data]);

  const saveIntervention = async (i: { studentId: string; type: string; severity: string; summary: string; followUpDate?: string }) => {
    const type = i.type === 'flag' ? 'note' : i.type; // 'counseling' is its own type: addressed to the counselling centre, confidential
    await apiClient.logIntervention({
      student_id: i.studentId,
      type,
      note: (i.type === 'flag' ? '[علامة للمراجعة] ' : '') + i.summary,
      outcome: i.severity === 'urgent' ? 'عاجل' : undefined,
      follow_up: i.followUpDate || undefined,
    });
    queryClient.invalidateQueries({ queryKey: ['advisor', 'interventions'] });
  };

  const atRiskCount = students.filter(s => s.riskLevel === 'critical' || s.riskLevel === 'high').length;
  const highRiskCount = students.filter(s => s.riskLevel === 'critical').length;
  const improvingCount = students.filter(s => s.riskLevel === 'medium').length;
  const pendingInterventions = students.filter(s => s.riskLevel === 'critical').length;
  const todayAppointments = noAppointments.filter(a => a.isToday).length;
  const gpaStudents = students.filter(s => s.gpa > 0);
  const averageGpa = gpaStudents.length ? +(gpaStudents.reduce((sum, s) => sum + s.gpa, 0) / gpaStudents.length).toFixed(2) : '—';
  // The caseload chart describes this advisor's own advisees, from the same rows as the table.
  const caseload: CaseloadEntry[] = students.length ? [{
    advisorName: t('طلابي', 'My advisees'), advisorNameEn: 'My advisees', totalStudents: students.length,
    critical: students.filter(s => s.riskLevel === 'critical').length,
    high: students.filter(s => s.riskLevel === 'high').length,
    medium: students.filter(s => s.riskLevel === 'medium').length,
    low: students.filter(s => s.riskLevel === 'low').length,
  }] : [];

  const tabs: { key: TabKey; labelAr: string; labelEn: string }[] = [
    { key: 'portfolio', labelAr: 'محفظة الطلاب', labelEn: 'Student Portfolio' },
    { key: 'at-risk', labelAr: 'المعرضون للخطر', labelEn: 'At Risk' },
    { key: 'recovery', labelAr: 'التعافي', labelEn: 'Recovery' },
    { key: 'agent', labelAr: 'الوكيل والاجتماعات', labelEn: 'Agent & Meetings' },
    { key: 'interventions', labelAr: 'التدخلات والمواعيد', labelEn: 'Interventions & Appointments' },
    { key: 'messaging', labelAr: 'إرسال رسالة', labelEn: 'Send Message' },
    { key: 'caseload', labelAr: 'إدارة الحالات', labelEn: 'Caseload Management' },
  ];

  return (
    <div>
      <PageHeader
        title={t('طلابي', 'My Advisees')}
        subtitle={wholeCohort && hasRealCaseload
          ? t(`حشد كليات التجربة — أعلى ${students.length.toLocaleString()} طالباً بحسب الخطر ثم المعدل`, `Pilot cohort — top ${students.length.toLocaleString()} students by risk, then GPA`)
          : t('إدارة ومتابعة الطلاب المسندين إليك', 'Manage and monitor your assigned students')}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('طلابي', 'My Advisees') },
        ]}
        actions={adviseesResult.source === 'api' ? <DataSourceBadge source="api" /> : undefined}
        accentColor="bg-sa-500"
      />

      {!adviseesResult.isLoading && !hasRealCaseload && (
        <div className="mb-6 rounded-xl border border-dashed border-gold-300 dark:border-gold-500/40 bg-gold-50/70 dark:bg-gold-500/10 px-4 py-3">
          <p className="text-sm text-gold-800 dark:text-gold-300">
            {adviseesResult.source === 'api'
              ? t(
                  'لا يوجد طلاب مسندون إليك إرشادياً في هذا الفصل.',
                  'No students are assigned to you as an advisor this term.',
                )
              : t(
                  'تعذّر جلب قائمة طلابك الإرشاديين من النظام الأكاديمي. حاول لاحقاً.',
                  'Could not load your advisees from the academic system. Please try again later.',
                )}
          </p>
        </div>
      )}

      {/* Risk Overview Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <StatCard
          title={t('إجمالي الطلاب', 'Total Students')}
          value={students.length}
          icon={<UsersIcon className="w-5 h-5" />}
        />
        <StatCard
          title={t('طلاب معرضون للخطر', 'At-Risk')}
          value={atRiskCount}
          icon={<ExclamationTriangleIcon className="w-5 h-5" />}
          className="border-s-4 border-s-error-500"
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
                {students.length === 0 && !adviseesResult.isLoading
                  ? <EmptyState title={t('لا طلاب في قائمتك الإرشادية', 'No advisees')} description={t('تظهر هنا قائمة الطلاب المسندين إليك إرشادياً من النظام الأكاديمي.', 'Students assigned to you as advisor appear here.')} icon="list" />
                  : <StudentTable students={students} />}
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

        {activeTab === 'at-risk' && <RiskListTab minLevel={1} wholeCohort={wholeCohort} />}
        {activeTab === 'recovery' && <RiskListTab minLevel={2} wholeCohort={wholeCohort} />}

        {activeTab === 'agent' && (
          <div className="grid grid-cols-1 gap-6">
            {/* What the agent asks a person to decide (SRS §8 L3) — real queue only */}
            <Card>
              <ApprovalsQueue />
            </Card>
          </div>
        )}

        {activeTab === 'interventions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <InterventionLog
                interventions={interventions}
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
                <AppointmentsList appointments={noAppointments} />
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

        {activeTab === 'caseload' && (
          <CaseloadManagement students={students} caseload={caseload} />
        )}
      </AnimatedTab>

      <InterventionModal
        open={showInterventionModal}
        onClose={() => setShowInterventionModal(false)}
        students={students}
        onSave={i => { void saveIntervention(i); }}
      />

      <AppointmentScheduler
        open={showScheduler}
        onClose={() => setShowScheduler(false)}
        students={students}
      />
    </div>
  );
}
