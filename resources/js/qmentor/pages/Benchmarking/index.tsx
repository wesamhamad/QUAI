import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedTab from '../../components/shared/AnimatedTab';
import PageHeader from '../../components/shared/PageHeader';
import UniversityOverview from './components/UniversityOverview';
import CollegeComparison from './components/CollegeComparison';
import DepartmentRankings from './components/DepartmentRankings';
import TrendAnalysis from './components/TrendAnalysis';
import PeerBenchmarking from './components/PeerBenchmarking';
import ReportBuilder from './components/ReportBuilder';
import { semesterSnapshots, currentSnapshot, peerUniversities } from './data/mockBenchmarkData';

type TabKey = 'overview' | 'colleges' | 'departments' | 'trends' | 'peers' | 'report';

export default function BenchmarkingPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const tabs: { key: TabKey; labelAr: string; labelEn: string }[] = [
    { key: 'overview', labelAr: 'نظرة عامة', labelEn: 'Overview' },
    { key: 'colleges', labelAr: 'مقارنة الكليات', labelEn: 'Colleges' },
    { key: 'departments', labelAr: 'تصنيف الأقسام', labelEn: 'Departments' },
    { key: 'trends', labelAr: 'الاتجاهات', labelEn: 'Trends' },
    { key: 'peers', labelAr: 'الجامعات النظيرة', labelEn: 'Peers' },
    { key: 'report', labelAr: 'التقارير', labelEn: 'Reports' },
  ];

  return (
    <div>
      <PageHeader
        title={t('لوحة المقارنة المعيارية المؤسسية', 'Institutional Benchmarking Dashboard')}
        subtitle={t(
          `تحليل أداء ${currentSnapshot.university.totalEnrollment.toLocaleString()} طالب عبر ${currentSnapshot.colleges.length} كليات`,
          `Analyzing performance of ${currentSnapshot.university.totalEnrollment.toLocaleString()} students across ${currentSnapshot.colleges.length} colleges`
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('المقارنة المعيارية', 'Benchmarking') },
        ]}
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
        {activeTab === 'overview' && <UniversityOverview snapshots={semesterSnapshots} />}
        {activeTab === 'colleges' && <CollegeComparison colleges={currentSnapshot.colleges} />}
        {activeTab === 'departments' && <DepartmentRankings colleges={currentSnapshot.colleges} />}
        {activeTab === 'trends' && <TrendAnalysis snapshots={semesterSnapshots} />}
        {activeTab === 'peers' && <PeerBenchmarking peers={peerUniversities} />}
        {activeTab === 'report' && <ReportBuilder snapshots={semesterSnapshots} />}
      </AnimatedTab>
    </div>
  );
}
