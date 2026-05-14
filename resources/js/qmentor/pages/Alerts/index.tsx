import { useState, useCallback, useMemo, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import AnimatedTab from '../../components/shared/AnimatedTab';
import PageHeader from '../../components/shared/PageHeader';
import DataSourceBadge from '../../components/shared/DataSourceBadge';
import AlertFeed from './components/AlertFeed';
import AlertPreferences from './components/AlertPreferences';
import EscalationTimeline from './components/EscalationTimeline';
import AlertAnalytics from './components/AlertAnalytics';
import CreateAlertModal from './components/CreateAlertModal';
import { mockAlerts, roleAlerts, defaultPreferences, analyticsData } from './data/mockAlertData';
import type { Alert, AlertStatus, AlertPreference } from './types';
import { useStudentProfile, useAbsences } from '../../hooks/useStudentData';
import { useRole } from '../../contexts/RoleContext';
import {
  BellAlertIcon,
  Cog6ToothIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  PlusIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowUpCircleIcon,
} from '@heroicons/react/24/outline';

type TabKey = 'feed' | 'preferences' | 'escalation' | 'analytics';

export default function AlertsPage() {
  const { t } = useLanguage();
  const { role } = useRole();
  const [activeTab, setActiveTab] = useState<TabKey>('feed');

  const profileResult = useStudentProfile(null);
  const absencesResult = useAbsences(null);
  const overallSource = (profileResult.source === 'api' || absencesResult.source === 'api') ? 'api' as const : 'mock' as const;

  // Generate real alerts from absence data and merge with mock
  const initialAlerts = useMemo(() => {
    const realAlerts: Alert[] = [];

    if (profileResult.source === 'api' && profileResult.data && absencesResult.source === 'api' && Array.isArray(absencesResult.data)) {
      const raw = profileResult.data as Record<string, unknown>;
      const profile = (raw.profile ?? raw) as Record<string, unknown>;
      const name = String(profile.name ?? '');
      const nameEn = String(profile.name_en ?? '');
      const studentId = String(profile.student_id ?? profile.id ?? '');

      (absencesResult.data as Record<string, unknown>[]).forEach((course, i) => {
        const pct = parseFloat(String(course.absence_all_percent ?? '0')) || 0;
        if (pct >= 10) {
          const code = String(course.cource_code ?? course.course_code ?? '');
          const courseName = String(course.cource_name ?? course.course_name ?? code);
          realAlerts.push({
            id: `ALT-REAL-${i}`,
            type: 'attendance',
            severity: pct >= 25 ? 'critical' : pct >= 20 ? 'urgent' : pct >= 15 ? 'warning' : 'info',
            status: 'active',
            title: `غياب ${courseName} وصل ${pct}%`,
            titleEn: `${code} absence at ${pct}%`,
            description: `نسبة الغياب في ${courseName} (${code}) وصلت ${pct}% — تقترب من حد الحرمان 25%`,
            descriptionEn: `Absence in ${courseName} (${code}) reached ${pct}% — approaching 25% deprivation limit`,
            studentId,
            studentName: name,
            studentNameEn: nameEn,
            timestamp: new Date().toISOString(),
          });
        }
      });
    }

    const myRoleAlerts = roleAlerts.filter(a => a.targetRole === role || a.targetRole === 'all');
    const genericAlerts = mockAlerts.map(a => ({ ...a, targetRole: undefined as Alert['targetRole'] }));
    return [...realAlerts, ...myRoleAlerts, ...genericAlerts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [profileResult.source, profileResult.data, absencesResult.source, absencesResult.data, role]);

  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [preferences, setPreferences] = useState<AlertPreference[]>(defaultPreferences);
  const [selectedAlerts, setSelectedAlerts] = useState<Set<string>>(new Set());
  const [escalationAlert, setEscalationAlert] = useState<Alert | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sync alerts when API data becomes available
  useEffect(() => {
    setAlerts(initialAlerts);
  }, [initialAlerts]);

  const activeCount = alerts.filter(a => a.status === 'active').length;
  const urgentCount = alerts.filter(a => (a.severity === 'critical' || a.severity === 'urgent') && a.status === 'active').length;

  const tabs: { key: TabKey; labelAr: string; labelEn: string; icon: typeof BellAlertIcon }[] = [
    { key: 'feed', labelAr: 'التنبيهات', labelEn: 'Alert Feed', icon: BellAlertIcon },
    { key: 'preferences', labelAr: 'التفضيلات', labelEn: 'Preferences', icon: Cog6ToothIcon },
    { key: 'escalation', labelAr: 'التصعيد', labelEn: 'Escalation', icon: ArrowTrendingUpIcon },
    { key: 'analytics', labelAr: 'التحليلات', labelEn: 'Analytics', icon: ChartBarIcon },
  ];

  const handleStatusChange = useCallback((id: string, status: AlertStatus) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    setSelectedAlerts(prev => { const n = new Set(prev); n.delete(id); return n; });
  }, []);

  const handleToggleSelect = useCallback((id: string) => {
    setSelectedAlerts(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }, []);

  function handleBulkAction(status: AlertStatus) {
    setAlerts(prev => prev.map(a => selectedAlerts.has(a.id) ? { ...a, status } : a));
    setSelectedAlerts(new Set());
  }

  function handleViewEscalation(alert: Alert) {
    setEscalationAlert(alert);
    setActiveTab('escalation');
  }

  function handleCreateAlert(data: {
    type: Alert['type'];
    severity: Alert['severity'];
    studentId: string;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
  }) {
    const newAlert: Alert = {
      id: `ALT-${String(alerts.length + 1).padStart(4, '0')}`,
      type: data.type,
      severity: data.severity,
      status: 'active',
      title: data.titleAr,
      titleEn: data.titleEn,
      description: data.descriptionAr,
      descriptionEn: data.descriptionEn,
      studentId: data.studentId,
      studentName: 'طالب جديد',
      studentNameEn: 'New Student',
      timestamp: new Date().toISOString(),
    };
    setAlerts(prev => [newAlert, ...prev]);
  }

  return (
    <div>
      <PageHeader
        accentColor="bg-sa-500"
        title={t('التنبيهات الذكية', 'Smart Alerts')}
        subtitle={t(
          `${activeCount} تنبيه نشط · ${urgentCount} عاجل/حرج`,
          `${activeCount} active alerts · ${urgentCount} urgent/critical`
        )}
        breadcrumbs={[
          { label: t('الرئيسية', 'Home'), href: '/' },
          { label: t('التنبيهات', 'Alerts') },
        ]}
        actions={<div className="flex items-center gap-2"><DataSourceBadge source={overallSource} />
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-sa-500 text-white hover:bg-sa-600 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            {t('إنشاء تنبيه', 'Create Alert')}
          </button></div>
        }
      />

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex overflow-x-auto gap-6 scrollbar-hide">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="tab-underline flex items-center gap-1.5 text-sm whitespace-nowrap pb-3"
                data-active={activeTab === tab.key}
              >
                <Icon className="w-4 h-4" />
                {t(tab.labelAr, tab.labelEn)}
                {tab.key === 'feed' && activeCount > 0 && (
                  <span className="ms-1 px-1.5 py-0.5 rounded-full text-xs font-bold bg-error-500 text-white">
                    {activeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedAlerts.size > 0 && activeTab === 'feed' && (
        <div className="bg-sa-50 dark:bg-sa-900/20 border border-sa-200 dark:border-sa-800 rounded-xl p-3 mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-sa-700 dark:text-sa-300">
            {t(`${selectedAlerts.size} تنبيه محدد`, `${selectedAlerts.size} alerts selected`)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBulkAction('acknowledged')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-success-500 text-white hover:bg-success-600 transition-colors"
            >
              <CheckCircleIcon className="w-4 h-4" />
              {t('قبول الكل', 'Acknowledge All')}
            </button>
            <button
              onClick={() => handleBulkAction('dismissed')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
              {t('رفض الكل', 'Dismiss All')}
            </button>
            <button
              onClick={() => handleBulkAction('escalated')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gold-500 text-white hover:bg-gold-600 transition-colors"
            >
              <ArrowUpCircleIcon className="w-4 h-4" />
              {t('تصعيد الكل', 'Escalate All')}
            </button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <AnimatedTab activeKey={activeTab} className="space-y-6">
        {activeTab === 'feed' && (
          <AlertFeed
            alerts={alerts}
            selectedAlerts={selectedAlerts}
            onToggleSelect={handleToggleSelect}
            onStatusChange={handleStatusChange}
            onViewEscalation={handleViewEscalation}
          />
        )}
        {activeTab === 'preferences' && (
          <AlertPreferences preferences={preferences} onSave={setPreferences} />
        )}
        {activeTab === 'escalation' && (
          <EscalationTimeline alert={escalationAlert} onClose={() => setEscalationAlert(null)} />
        )}
        {activeTab === 'analytics' && (
          <AlertAnalytics data={analyticsData} />
        )}
      </AnimatedTab>

      {/* No escalation selected */}
      {activeTab === 'escalation' && !escalationAlert && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          <ArrowTrendingUpIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">{t('اختر تنبيهًا من القائمة لعرض مسار التصعيد', 'Select an alert from the feed to view its escalation timeline')}</p>
        </div>
      )}

      <CreateAlertModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateAlert}
      />
    </div>
  );
}
