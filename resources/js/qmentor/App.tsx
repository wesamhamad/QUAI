import { Suspense, lazy, useEffect, type ComponentType } from 'react';
import { Routes, Route, useSearchParams } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import ErrorBoundary, { SectionErrorBoundary } from './components/shared/ErrorBoundary';
import { TabbedPageSkeleton, DetailPageSkeleton, ChatSkeleton, DashboardWithTableSkeleton } from './components/shared/PageSkeleton';
import { useRole } from './contexts/RoleContext';
import { useLanguage } from './contexts/LanguageContext';
import { canAccess } from './lib/rolePermissions';
import type { ReactNode } from 'react';

// Wraps lazy() so that a chunk-load failure (typically a stale main.js
// referencing a hash that was replaced by a rebuild/deploy) triggers a
// single page reload instead of surfacing a permanent ErrorBoundary state.
function lazyWithRetry<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  return lazy(async () => {
    const key = 'qmentor:chunk-reload';
    const alreadyReloaded = sessionStorage.getItem(key) === '1';
    try {
      const mod = await factory();
      sessionStorage.removeItem(key);
      return mod;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isChunkError = /dynamically imported module|Failed to fetch|Loading chunk|ChunkLoadError|Importing a module script failed/i.test(msg);
      if (isChunkError && !alreadyReloaded) {
        sessionStorage.setItem(key, '1');
        window.location.reload();
        return new Promise<{ default: T }>(() => {});
      }
      throw err;
    }
  });
}

// Lazy-load pages for code splitting
const DigitalTwin = lazyWithRetry(() => import('./pages/DigitalTwin/index'));
const AdvisorDashboard = lazyWithRetry(() => import('./pages/AdvisorDashboard/index'));
const RiskAnalytics = lazyWithRetry(() => import('./pages/RiskAnalytics/index'));
const StudyPlan = lazyWithRetry(() => import('./pages/StudyPlan/index'));
const Chatbot = lazyWithRetry(() => import('./pages/Chatbot/index'));
const Alerts = lazyWithRetry(() => import('./pages/Alerts/index'));
const Faculty = lazyWithRetry(() => import('./pages/Faculty/index'));
const PeerTutoring = lazyWithRetry(() => import('./pages/PeerTutoring/index'));
const Recovery = lazyWithRetry(() => import('./pages/Recovery/index'));
const Benchmarking = lazyWithRetry(() => import('./pages/Benchmarking/index'));
const Settings = lazyWithRetry(() => import('./pages/Settings/index'));
const Mobile = lazyWithRetry(() => import('./pages/Mobile/index'));
const AgentActivity = lazyWithRetry(() => import('./pages/AgentActivity/index'));
const StudentDashboard = lazyWithRetry(() => import('./pages/StudentDashboard/index'));
const IndicatorDetail = lazyWithRetry(() => import('./pages/StudentDashboard/IndicatorDetail'));
const ActionPlan = lazyWithRetry(() => import('./pages/StudentDashboard/ActionPlan'));
const Schedule = lazyWithRetry(() => import('./pages/StudentDashboard/Schedule'));
const ContactAdvisor = lazyWithRetry(() => import('./pages/StudentDashboard/ContactAdvisor'));
const Grades = lazyWithRetry(() => import('./pages/Grades/index'));

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

/**
 * Keeps the active student-impersonation id (?as=<id>) pinned to the URL.
 * react-router <NavLink>/<Link> drop the query string on navigation, which
 * would silently revert every API call back to the logged-in user. We mirror
 * ?as= into sessionStorage and re-append it whenever a navigation strips it,
 * so the student switcher's selection survives across the whole SPA session.
 */
function ImpersonationPin() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fromUrl = searchParams.get('as');
    if (fromUrl) {
      try { sessionStorage.setItem('qmentor:as', fromUrl); } catch { /* ignore */ }
      return;
    }
    let stored: string | null = null;
    try { stored = sessionStorage.getItem('qmentor:as'); } catch { /* ignore */ }
    if (stored) {
      const next = new URLSearchParams(searchParams);
      next.set('as', stored);
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return null;
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
      <ImpersonationPin />
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
