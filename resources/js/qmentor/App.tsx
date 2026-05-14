import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import ErrorBoundary, { SectionErrorBoundary } from './components/shared/ErrorBoundary';
import { TabbedPageSkeleton, DetailPageSkeleton, ChatSkeleton, DashboardWithTableSkeleton } from './components/shared/PageSkeleton';
import { useRole } from './contexts/RoleContext';
import { useLanguage } from './contexts/LanguageContext';
import { canAccess } from './lib/rolePermissions';
import type { ReactNode } from 'react';

// Lazy-load pages for code splitting
const DigitalTwin = lazy(() => import('./pages/DigitalTwin/index'));
const AdvisorDashboard = lazy(() => import('./pages/AdvisorDashboard/index'));
const RiskAnalytics = lazy(() => import('./pages/RiskAnalytics/index'));
const StudyPlan = lazy(() => import('./pages/StudyPlan/index'));
const Chatbot = lazy(() => import('./pages/Chatbot/index'));
const Alerts = lazy(() => import('./pages/Alerts/index'));
const Faculty = lazy(() => import('./pages/Faculty/index'));
const PeerTutoring = lazy(() => import('./pages/PeerTutoring/index'));
const Recovery = lazy(() => import('./pages/Recovery/index'));
const Benchmarking = lazy(() => import('./pages/Benchmarking/index'));
const Settings = lazy(() => import('./pages/Settings/index'));
const Mobile = lazy(() => import('./pages/Mobile/index'));
const AgentActivity = lazy(() => import('./pages/AgentActivity/index'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard/index'));
const IndicatorDetail = lazy(() => import('./pages/StudentDashboard/IndicatorDetail'));
const ActionPlan = lazy(() => import('./pages/StudentDashboard/ActionPlan'));
const Schedule = lazy(() => import('./pages/StudentDashboard/Schedule'));
const ContactAdvisor = lazy(() => import('./pages/StudentDashboard/ContactAdvisor'));
const Grades = lazy(() => import('./pages/Grades/index'));

function RoleGuard({ path, children }: { path: string; children: ReactNode }) {
  const { role } = useRole();
  const { t } = useLanguage();

  if (!canAccess(role, path)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {t('لا يمكنك الوصول إلى هذه الصفحة', 'You don\'t have access to this page')}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {t('هذه الصفحة غير متاحة لدورك الحالي', 'This page is not available for your current role')}
        </p>
        <a href="/qmentor/" className="px-4 py-2 rounded-lg bg-sa-500 text-white hover:bg-sa-600 transition-colors text-sm font-medium">
          {t('العودة للرئيسية', 'Back to Dashboard')}
        </a>
      </div>
    );
  }

  return <>{children}</>;
}

/** Wraps a lazy-loaded page with error boundary and Suspense fallback */
function PageRoute({ path, children, fallback }: { path: string; children: ReactNode; fallback: ReactNode }) {
  return (
    <RoleGuard path={path}>
      <SectionErrorBoundary>
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      </SectionErrorBoundary>
    </RoleGuard>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/digital-twin" element={<PageRoute path="/digital-twin" fallback={<DetailPageSkeleton />}><DigitalTwin /></PageRoute>} />
          <Route path="/advisor-dashboard" element={<PageRoute path="/advisor-dashboard" fallback={<DashboardWithTableSkeleton />}><AdvisorDashboard /></PageRoute>} />
          <Route path="/risk-analytics" element={<PageRoute path="/risk-analytics" fallback={<TabbedPageSkeleton />}><RiskAnalytics /></PageRoute>} />
          <Route path="/study-plan" element={<PageRoute path="/study-plan" fallback={<TabbedPageSkeleton />}><StudyPlan /></PageRoute>} />
          <Route path="/chatbot" element={<PageRoute path="/chatbot" fallback={<ChatSkeleton />}><Chatbot /></PageRoute>} />
          <Route path="/alerts" element={<PageRoute path="/alerts" fallback={<TabbedPageSkeleton />}><Alerts /></PageRoute>} />
          <Route path="/faculty" element={<PageRoute path="/faculty" fallback={<TabbedPageSkeleton />}><Faculty /></PageRoute>} />
          <Route path="/peer-tutoring" element={<PageRoute path="/peer-tutoring" fallback={<TabbedPageSkeleton />}><PeerTutoring /></PageRoute>} />
          <Route path="/recovery" element={<PageRoute path="/recovery" fallback={<TabbedPageSkeleton />}><Recovery /></PageRoute>} />
          <Route path="/benchmarking" element={<PageRoute path="/benchmarking" fallback={<TabbedPageSkeleton />}><Benchmarking /></PageRoute>} />
          <Route path="/settings" element={<PageRoute path="/settings" fallback={<TabbedPageSkeleton cards={2} />}><Settings /></PageRoute>} />
          <Route path="/mobile" element={<PageRoute path="/mobile" fallback={<TabbedPageSkeleton />}><Mobile /></PageRoute>} />
          <Route path="/agent-activity" element={<PageRoute path="/agent-activity" fallback={<DashboardWithTableSkeleton />}><AgentActivity /></PageRoute>} />
          <Route path="/student-dashboard" element={<PageRoute path="/student-dashboard" fallback={<DashboardWithTableSkeleton />}><StudentDashboard /></PageRoute>} />
          <Route path="/indicator-detail" element={<PageRoute path="/indicator-detail" fallback={<DetailPageSkeleton />}><IndicatorDetail /></PageRoute>} />
          <Route path="/action-plan" element={<PageRoute path="/action-plan" fallback={<DetailPageSkeleton />}><ActionPlan /></PageRoute>} />
          <Route path="/schedule" element={<PageRoute path="/schedule" fallback={<TabbedPageSkeleton />}><Schedule /></PageRoute>} />
          <Route path="/contact-advisor" element={<PageRoute path="/contact-advisor" fallback={<DetailPageSkeleton />}><ContactAdvisor /></PageRoute>} />
          <Route path="/grades" element={<PageRoute path="/grades" fallback={<TabbedPageSkeleton />}><Grades /></PageRoute>} />
        </Routes>
      </AppShell>
    </ErrorBoundary>
  );
}
