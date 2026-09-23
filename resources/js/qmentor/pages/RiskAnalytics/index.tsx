import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedTab from '../../components/shared/AnimatedTab';
import PageHeader from '../../components/shared/PageHeader';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import RiskOverview from './components/RiskOverview';
import CategoryBreakdown from './components/CategoryBreakdown';
import IndicatorDetail from './components/IndicatorDetail';
import PredictiveCharts from './components/PredictiveCharts';
import AtRiskStudentList from './components/AtRiskStudentList';
import EarlyWarningTriggers from './components/EarlyWarningTriggers';
import RiskScoreCalculator from './components/RiskScoreCalculator';
import RiskHeatmap from './components/RiskHeatmap';
import PredictionAccuracy from './components/PredictionAccuracy';
import { useRole } from '../../contexts/RoleContext';
import { useRiskCohort } from '../../hooks/useStudentData';
import { useAdvisees, useRiskCaseload } from '../../hooks/useAdvisorData';
import { overviewFrom, categoriesFrom, indicatorsFrom, trendFrom, collegesFrom, studentsFrom, warningsFrom, type CohortPayload, type RosterRow } from './live';
import EmptyState from '../DigitalTwin/components/EmptyState';

type TabKey = 'overview' | 'categories' | 'indicators' | 'charts' | 'heatmap' | 'students' | 'warnings' | 'accuracy';
const TAB_KEYS: TabKey[] = ['overview', 'categories', 'indicators', 'charts', 'heatmap', 'students', 'warnings', 'accuracy'];

export default function RiskAnalyticsPage() {
  const { t } = useLanguage();
  const { role } = useRole();
  // ?tab=students opens «الطلاب المعرضون للخطر» directly: the sidebar entry
  // links here, and the tab is a real destination rather than two clicks in.
  const [params] = useSearchParams();
  const wantedTab = params.get('tab') as TabKey | null;
  const [activeTab, setActiveTab] = useState<TabKey>(
    wantedTab && TAB_KEYS.includes(wantedTab) ? wantedTab : 'overview',
  );
  // «الطلاب المعرضون للخطر» in the sidebar is a destination of its own, not a
  // stop inside تحليل المخاطر: arriving through it shows the list and nothing
  // else. The board keeps its tabs when it is opened as the board.
  const soloTab = params.get('solo') === '1' && wantedTab !== null;

  // Everything on this page is the engine's own output: the cohort aggregates
  // (/risk/cohort), the roster with each student's level (/advisor/advisees —
  // the whole cohort for the admin, the caseload for an advisor) and the top
  // factors per student (/risk/caseload). Nothing is sampled.
  // An advisor has no university-wide view (/risk/cohort is the admin's): their
  // page is their advisees' engine verdicts, from /risk/caseload.
  const isAdvisor = role === 'advisor';
  const cohort = useRiskCohort<CohortPayload | null>(null);
  const roster = useAdvisees(undefined, role === 'admin');
  const rosterRows = useMemo(() => (roster.source === 'api' && Array.isArray(roster.data) ? (roster.data as RosterRow[]) : []), [roster.source, roster.data]);
  const ids = useMemo(() => (isAdvisor ? rosterRows : rosterRows.filter(r => (r.risk_level ?? 0) >= 1)).map(r => r.student_id).slice(0, 300), [rosterRows, isAdvisor]);
  const caseload = useRiskCaseload(ids, role === 'admin');
  const rows = useMemo(() => {
    if (!isAdvisor) return rosterRows;
    const st = (caseload.data as { students?: Record<string, { level?: { level: number }; score?: number }> } | null)?.students ?? {};
    return rosterRows.map(r => (st[r.student_id] ? { ...r, risk_level: st[r.student_id].level?.level ?? null, risk_score: st[r.student_id].score ?? null } : r));
  }, [isAdvisor, rosterRows, caseload.data]);
  const factors = useMemo(() => {
    const m: Record<string, { id: string; label: string; level: number; evidence?: string }[]> = {};
    const st = (caseload.data as { students?: Record<string, { top_factors?: { id: string; label: string; level: number; evidence?: string }[] }> } | null)?.students ?? {};
    for (const [id, v] of Object.entries(st)) m[id] = v.top_factors ?? [];
    return m;
  }, [caseload.data]);

  const live = !isAdvisor && cohort.source === 'api' && !!cohort.data && cohort.data.students_scored > 0;
  const overallSource = live ? 'api' as const : 'mock' as const;
  const c = cohort.data as CohortPayload;
  const universityOverview = useMemo(() => (live ? overviewFrom(c) : null), [live, c]);
  const riskCategories = useMemo(() => (live ? categoriesFrom(c) : []), [live, c]);
  const riskIndicators = useMemo(() => (live ? indicatorsFrom(c) : []), [live, c]);
  const riskTrends = useMemo(() => (live ? trendFrom(c) : []), [live, c]);
  const collegeRiskData = useMemo(() => (live ? collegesFrom(c) : []), [live, c]);
  const atRiskStudents = useMemo(() => studentsFrom(rows, factors), [rows, factors]);
  const earlyWarnings = useMemo(() => warningsFrom(rows, factors, live ? c.computed_at : null), [rows, factors, live, c]);

  const allTabs: { key: TabKey; labelAr: string; labelEn: string }[] = [
    { key: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview' },
    { key: 'categories', labelAr: 'الفئات', labelEn: 'Categories' },
    { key: 'indicators', labelAr: 'المؤشرات', labelEn: 'Indicators' },
    { key: 'charts', labelAr: 'التحليلات', labelEn: 'Analytics' },
    { key: 'heatmap', labelAr: 'خريطة حرارية', labelEn: 'Heatmap' },
    { key: 'students', labelAr: 'الطلاب المعرضون للخطر', labelEn: 'At-Risk Students' },
    { key: 'warnings', labelAr: 'التنبيهات', labelEn: 'Warnings' },
    { key: 'accuracy', labelAr: 'أداء النموذج', labelEn: 'Model Accuracy' },
  ];

  const tabs = isAdvisor ? allTabs.filter(tb => tb.key === 'students' || tb.key === 'warnings') : allTabs;
  const [advisorTab, setAdvisorTab] = useState<TabKey>('students');
  const currentTab = isAdvisor ? advisorTab : activeTab;
  const selectTab = isAdvisor ? setAdvisorTab : setActiveTab;

  const unacknowledgedCount = earlyWarnings.filter(w => !w.acknowledged).length;

  return (
    <div>
      <PageHeader
        title={soloTab
          ? t('الطلاب المعرضون للخطر', 'At-Risk Students')
          : t('تحليلات المخاطر التنبؤية', 'Predictive Risk Analytics')}
        subtitle={isAdvisor
          ? t(`${rosterRows.length.toLocaleString('en')} طالباً في قائمتك الإرشادية · حكم محرك الخطر لكل طالب`, `${rosterRows.length} advisees · the risk engine's verdict per student`)
          : t(
          live ? `${c.students_scored.toLocaleString('en')} طالباً مقيَّماً من ${c.students_in_cohort.toLocaleString('en')} عبر 31 مؤشراً في 9 فئات · النموذج ${c.model_version}` : 'بانتظار التقييم الليلي',
          live ? `${c.students_scored} of ${c.students_in_cohort} students scored on 31 indicators in 9 categories · model ${c.model_version}` : 'Waiting for the nightly scoring'
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: soloTab ? t('الطلاب المعرضون للخطر', 'At-Risk Students') : t('تحليلات المخاطر', 'Risk Analytics') },
        ]}
        actions={isAdvisor ? (roster.source === 'api' ? <DataSourceBadge source="api" /> : undefined) : <DataSourceBadge source={overallSource} />}
        accentColor="bg-sa-500"
      />

      {/* Tab Navigation — underline style. Hidden when the page was opened as
          one destination: a single tab underlined on its own is furniture. */}
      <div className={`border-b border-gray-200 dark:border-gray-700 mb-8 ${soloTab ? 'hidden' : ''}`}>
        <div className="flex overflow-x-auto gap-6 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => selectTab(tab.key)}
              data-active={currentTab === tab.key}
              className="tab-underline flex items-center gap-1.5 text-sm whitespace-nowrap pb-3"
            >
              {t(tab.labelAr, tab.labelEn)}
              {tab.key === 'warnings' && unacknowledgedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-error-500 text-white">
                  {unacknowledgedCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatedTab activeKey={currentTab} className="space-y-6">
        {isAdvisor && roster.source !== 'api' && !roster.isLoading && <EmptyState title="تعذّر جلب قائمة طلابك الإرشاديين" description="تُقرأ القائمة من النظام الأكاديمي ومن قائمة الإرشاد المزامنة؛ حاول لاحقاً." icon="list" />}
        {isAdvisor && roster.source === 'api' && currentTab === 'students' && (atRiskStudents.length ? <AtRiskStudentList students={atRiskStudents} /> : <EmptyState title="لا طلاب في مستوى متوسط فأعلى ضمن قائمتك الإرشادية" description="" icon="list" />)}
        {isAdvisor && roster.source === 'api' && currentTab === 'warnings' && (earlyWarnings.length ? <EarlyWarningTriggers warnings={earlyWarnings} /> : <EmptyState title="لا تنبيهات مبكرة لطلابك" description="يظهر هنا كل طالب من قائمتك في مستوى مرتفع أو حرج مع المؤشر الذي رفعه." icon="shield" />)}
        {!isAdvisor && !live && <EmptyState title="لم يُقيَّم الحشد بعد" description="تظهر هذه التحليلات بعد تشغيل تقييم الخطر (qmentor:score) على طلاب الكليات." icon="shield" />}
        {live && activeTab === 'overview' && universityOverview && (
          <>
            <RiskOverview data={universityOverview} />
            <RiskScoreCalculator categories={riskCategories} />
          </>
        )}
        {live && activeTab === 'categories' && <CategoryBreakdown categories={riskCategories} />}
        {live && activeTab === 'indicators' && <IndicatorDetail indicators={riskIndicators} />}
        {live && activeTab === 'charts' && universityOverview && (
          <PredictiveCharts overview={universityOverview} categories={riskCategories} trends={riskTrends} collegeData={collegeRiskData} />
        )}
        {live && activeTab === 'heatmap' && <RiskHeatmap collegeData={collegeRiskData} />}
        {live && activeTab === 'students' && (atRiskStudents.length ? <AtRiskStudentList students={atRiskStudents} /> : <EmptyState title="لا طلاب في مستوى متوسط فأعلى ضمن نطاقك" description="" icon="list" />)}
        {live && activeTab === 'warnings' && (earlyWarnings.length ? <EarlyWarningTriggers warnings={earlyWarnings} /> : <EmptyState title="لا تنبيهات مبكرة" description="يظهر هنا كل طالب في مستوى مرتفع أو حرج مع المؤشر الذي رفعه." icon="shield" />)}
        {live && activeTab === 'accuracy' && <PredictionAccuracy />}
      </AnimatedTab>
    </div>
  );
}
