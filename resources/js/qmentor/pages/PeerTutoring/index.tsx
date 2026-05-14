import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedTab from '../../components/shared/AnimatedTab';
import PageHeader from '../../components/shared/PageHeader';
import TutorDiscovery from './components/TutorDiscovery';
import MatchResults from './components/MatchResults';
import SessionScheduler from './components/SessionScheduler';
import ActiveSessions from './components/ActiveSessions';
import TutorLeaderboard from './components/TutorLeaderboard';
import BecomeTutorForm from './components/BecomeTutorForm';

type TabKey = 'discover' | 'matches' | 'schedule' | 'sessions' | 'leaderboard' | 'become_tutor';

export default function PeerTutoringPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabKey>('discover');

  const tabs: { key: TabKey; labelAr: string; labelEn: string }[] = [
    { key: 'discover', labelAr: 'البحث عن مدرس', labelEn: 'Find Tutors' },
    { key: 'matches', labelAr: 'المطابقات الذكية', labelEn: 'AI Matches' },
    { key: 'schedule', labelAr: 'حجز جلسة', labelEn: 'Book Session' },
    { key: 'sessions', labelAr: 'جلساتي', labelEn: 'My Sessions' },
    { key: 'leaderboard', labelAr: 'المتصدرون', labelEn: 'Leaderboard' },
    { key: 'become_tutor', labelAr: 'كن مدرساً', labelEn: 'Become Tutor' },
  ];

  return (
    <div>
      <PageHeader
        title={t('التدريس بالأقران', 'Peer Tutoring')}
        subtitle={t(
          'تواصل مع زملائك للتعلم والتدريس المتبادل',
          'Connect with peers for mutual learning and tutoring'
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('التدريس بالأقران', 'Peer Tutoring') },
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
        {activeTab === 'discover' && <TutorDiscovery />}
        {activeTab === 'matches' && <MatchResults />}
        {activeTab === 'schedule' && <SessionScheduler />}
        {activeTab === 'sessions' && <ActiveSessions />}
        {activeTab === 'leaderboard' && <TutorLeaderboard />}
        {activeTab === 'become_tutor' && <BecomeTutorForm />}
      </AnimatedTab>
    </div>
  );
}
