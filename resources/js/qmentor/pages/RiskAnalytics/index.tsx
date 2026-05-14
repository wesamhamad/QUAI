import { useState, useMemo } from 'react';
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
import { universityOverview, riskCategories, atRiskStudents, earlyWarnings as mockEarlyWarnings, riskTrends, collegeRiskData } from './data/mockRiskData';
import { riskIndicators } from './data/riskIndicators';
import { useStudentProfile, useAbsences, useAcademicTransactions } from '../../hooks/useStudentData';
import type { EarlyWarning } from './types';

type TabKey = 'overview' | 'categories' | 'indicators' | 'charts' | 'heatmap' | 'students' | 'warnings' | 'accuracy';

export default function RiskAnalyticsPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const profileResult = useStudentProfile(null);
  const absencesResult = useAbsences(null);
  const transactionsResult = useAcademicTransactions(null);

  const sources = [profileResult.source, absencesResult.source, transactionsResult.source];
  const overallSource = sources.includes('api') ? 'api' as const : 'mock' as const;

  // Generate real early warnings from absence and GPA data
  const earlyWarnings = useMemo(() => {
    const realWarnings: EarlyWarning[] = [];

    if (profileResult.source === 'api' && profileResult.data) {
      const raw = profileResult.data as Record<string, unknown>;
      const profile = (raw.profile ?? raw) as Record<string, unknown>;
      const name = String(profile.name ?? '');
      const nameEn = String(profile.name_en ?? '');
      const studentId = String(profile.student_id ?? profile.id ?? '');

      // Generate absence-based warnings
      if (absencesResult.source === 'api' && Array.isArray(absencesResult.data)) {
        (absencesResult.data as Record<string, unknown>[]).forEach((course, i) => {
          const pct = parseFloat(String(course.absence_all_percent ?? '0')) || 0;
          if (pct >= 10) {
            const code = String(course.cource_code ?? course.course_code ?? '');
            const severity = pct >= 25 ? 'critical' : pct >= 15 ? 'high' : 'medium';
            realWarnings.push({
              id: `EW-REAL-ABS-${i}`,
              studentName: name,
              studentNameEn: nameEn,
              studentId,
              triggerAr: `نسبة الغياب في ${code} وصلت ${pct}% — تقترب من حد الـ 25%`,
              triggerEn: `${code} absence at ${pct}% — approaching 25% limit`,
              category: 'E',
              severity: severity as EarlyWarning['severity'],
              timestamp: new Date().toISOString(),
              acknowledged: false,
              escalated: false,
            });
          }
        });
      }

      // GPA-based warning
      const academic = ((raw.profile ?? raw) as Record<string, unknown>).academic as Record<string, unknown> | undefined;
      if (academic) {
        const gpa = parseFloat(String(academic.last_recorded_gpa ?? academic.cumulative_gpa ?? '0'));
        if (gpa > 0 && gpa < 3.0) {
          realWarnings.push({
            id: 'EW-REAL-GPA',
            studentName: name,
            studentNameEn: nameEn,
            studentId,
            triggerAr: `المعدل التراكمي ${gpa.toFixed(2)} — يحتاج متابعة`,
            triggerEn: `Cumulative GPA ${gpa.toFixed(2)} — needs monitoring`,
            category: 'G',
            severity: gpa < 2.0 ? 'critical' : 'medium',
            timestamp: new Date().toISOString(),
            acknowledged: false,
            escalated: false,
          });
        }
      }
    }

    return [...realWarnings, ...mockEarlyWarnings];
  }, [profileResult.source, profileResult.data, absencesResult.source, absencesResult.data]);

  const tabs: { key: TabKey; labelAr: string; labelEn: string }[] = [
    { key: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview' },
    { key: 'categories', labelAr: 'الفئات', labelEn: 'Categories' },
    { key: 'indicators', labelAr: 'المؤشرات', labelEn: 'Indicators' },
    { key: 'charts', labelAr: 'التحليلات', labelEn: 'Analytics' },
    { key: 'heatmap', labelAr: 'خريطة حرارية', labelEn: 'Heatmap' },
    { key: 'students', labelAr: 'الطلاب', labelEn: 'Students' },
    { key: 'warnings', labelAr: 'التنبيهات', labelEn: 'Warnings' },
    { key: 'accuracy', labelAr: 'أداء النموذج', labelEn: 'Model Accuracy' },
  ];

  const unacknowledgedCount = earlyWarnings.filter(w => !w.acknowledged).length;

  return (
    <div>
      <PageHeader
        title={t('تحليلات المخاطر التنبؤية', 'Predictive Risk Analytics')}
        subtitle={t(
          `مراقبة ${universityOverview.totalStudents.toLocaleString()} طالب عبر 66 مؤشر خطر في 9 فئات`,
          `Monitoring ${universityOverview.totalStudents.toLocaleString()} students across 66 risk indicators in 9 categories`
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('تحليلات المخاطر', 'Risk Analytics') },
        ]}
        actions={<DataSourceBadge source={overallSource} />}
        accentColor="bg-sa-500"
      />

      {/* Tab Navigation — underline style */}
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
      <AnimatedTab activeKey={activeTab} className="space-y-6">
        {activeTab === 'overview' && (
          <>
            <RiskOverview data={universityOverview} />
            <RiskScoreCalculator categories={riskCategories} />
            <PredictiveCharts
              overview={universityOverview}
              categories={riskCategories}
              trends={riskTrends}
              collegeData={collegeRiskData}
            />
          </>
        )}
        {activeTab === 'categories' && <CategoryBreakdown categories={riskCategories} />}
        {activeTab === 'indicators' && <IndicatorDetail indicators={riskIndicators} />}
        {activeTab === 'charts' && (
          <PredictiveCharts
            overview={universityOverview}
            categories={riskCategories}
            trends={riskTrends}
            collegeData={collegeRiskData}
          />
        )}
        {activeTab === 'heatmap' && <RiskHeatmap collegeData={collegeRiskData} />}
        {activeTab === 'students' && <AtRiskStudentList students={atRiskStudents} />}
        {activeTab === 'warnings' && <EarlyWarningTriggers warnings={earlyWarnings} />}
        {activeTab === 'accuracy' && <PredictionAccuracy />}
      </AnimatedTab>
    </div>
  );
}
