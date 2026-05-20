import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRole } from '../../contexts/RoleContext';
import { canAccess } from '../../lib/rolePermissions';
import {
  HomeIcon,
  UserCircleIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  ChatBubbleLeftRightIcon,
  BellAlertIcon,
  BuildingLibraryIcon,
  UsersIcon,
  ShieldExclamationIcon,
  PresentationChartBarIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  XMarkIcon,
  CpuChipIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  PhoneIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  onMobileClose: () => void;
}

const navItems = [
  { path: '/', icon: HomeIcon, ar: 'الرئيسية', en: 'Dashboard' },
  // Student-specific pages
  { path: '/student-dashboard', icon: ShieldCheckIcon, ar: 'حالة المخاطر', en: 'My Risk Status' },
  { path: '/indicator-detail', icon: ExclamationTriangleIcon, ar: 'تفاصيل المؤشرات', en: 'Indicator Detail' },
  { path: '/action-plan', icon: ClipboardDocumentListIcon, ar: 'خطة الأعمال الأكاديمية', en: 'Academic Action Plan' },
  { path: '/schedule', icon: CalendarDaysIcon, ar: 'الجدول والمواعيد', en: 'Schedule & Deadlines' },
  { path: '/contact-advisor', icon: PhoneIcon, ar: 'تواصل مع المرشد', en: 'Contact Advisor' },
  { path: '/grades', icon: TrophyIcon, ar: 'الدرجات والتقييمات', en: 'Grades & Assessments' },
  // Advisor/Admin pages
  { path: '/digital-twin', icon: UserCircleIcon, ar: 'التوأم الرقمي', en: 'Digital Twin' },
  { path: '/advisor-dashboard', icon: ChartBarIcon, ar: 'لوحة المرشد', en: 'Advisor Dashboard' },
  { path: '/risk-analytics', icon: ExclamationTriangleIcon, ar: 'تحليل المخاطر', en: 'Risk Analytics' },
  { path: '/study-plan', icon: AcademicCapIcon, ar: 'الخطة الدراسية', en: 'Study Plan' },
  { path: '/chatbot', icon: ChatBubbleLeftRightIcon, ar: 'المحادثة الذكية', en: 'Advising Chatbot' },
  { path: '/alerts', icon: BellAlertIcon, ar: 'التنبيهات', en: 'Smart Alerts' },
  { path: '/faculty', icon: BuildingLibraryIcon, ar: 'لوحة أعضاء هيئة التدريس', en: 'Faculty Dashboard' },
  { path: '/peer-tutoring', icon: UsersIcon, ar: 'التدريس بالأقران', en: 'Peer Tutoring' },
  { path: '/recovery', icon: ShieldExclamationIcon, ar: 'برنامج التعافي', en: 'Recovery Program' },
  { path: '/benchmarking', icon: PresentationChartBarIcon, ar: 'المقارنة المعيارية', en: 'Benchmarking' },
  { path: '/agent-activity', icon: CpuChipIcon, ar: 'نشاط الوكيل', en: 'Agent Activity' },
  { path: '/settings', icon: Cog6ToothIcon, ar: 'الإعدادات', en: 'Settings' },
];

export default function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose }: SidebarProps) {
  const { lang, dir, t } = useLanguage();
  const { role } = useRole();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isQSparkBrand = typeof window !== 'undefined'
    && window.location.pathname.startsWith('/qspark-plus')
    && location.pathname === '/'
    && searchParams.get('solo') !== '1';
  const isRtl = dir === 'rtl';
  const visibleItems = navItems.filter(item => canAccess(role, item.path));
  // The "Q" brand mark leaves the SPA and returns to the QUAI platform home.
  const homeUrl = (window as { __qmentor_links?: { home?: string } })
    .__qmentor_links?.home ?? '/';
  // Carry the active student-impersonation id onto every nav link so switching
  // students survives sidebar navigation (react-router otherwise drops ?as=).
  const asParam = searchParams.get('as');

  const CollapseIcon = isRtl
    ? (collapsed ? ChevronDoubleLeftIcon : ChevronDoubleRightIcon)
    : (collapsed ? ChevronDoubleRightIcon : ChevronDoubleLeftIcon);

  return (
    <aside
      className={`
        fixed inset-y-0 z-50 flex flex-col
        bg-white dark:bg-gray-800 border-e border-gray-200 dark:border-gray-700
        sidebar-transition scrollbar-thin
        ${isRtl ? 'right-0' : 'left-0'}
        ${mobileOpen ? 'translate-x-0' : isRtl ? 'translate-x-full' : '-translate-x-full'}
        lg:translate-x-0 lg:static
        ${collapsed ? 'w-[68px]' : 'w-64'}
      `}
    >
      {/* Header — the brand mark links back to the QUAI platform home. */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <a
            href={homeUrl}
            title={t('العودة إلى الرئيسية', 'Back to home')}
            className="flex items-center gap-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sa-500"
          >
            <div className="w-8 h-8 rounded-lg bg-sa-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Q</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">
              {isQSparkBrand ? t('+QSpark', 'QSpark+') : t('QMentor', 'QMentor')}
            </span>
          </a>
        )}
        {collapsed && (
          <a
            href={homeUrl}
            title={t('العودة إلى الرئيسية', 'Back to home')}
            className="mx-auto w-8 h-8 rounded-lg bg-sa-500 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sa-500"
          >
            <span className="text-white font-bold text-sm">Q</span>
          </a>
        )}

        {/* Mobile close */}
        <button
          onClick={onMobileClose}
          className="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {visibleItems.map(item => (
          <NavLink
            key={item.path}
            to={asParam ? `${item.path}?as=${encodeURIComponent(asParam)}` : item.path}
            end={item.path === '/'}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${collapsed ? 'justify-center' : ''}
              ${isActive
                ? 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
              }`
            }
            title={collapsed ? (lang === 'ar' ? item.ar : item.en) : undefined}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{lang === 'ar' ? item.ar : item.en}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle (desktop only) */}
      <div className="hidden lg:block border-t border-gray-200 dark:border-gray-700 p-2">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        >
          <CollapseIcon className="w-4 h-4" />
          {!collapsed && <span>{t('طي القائمة', 'Collapse')}</span>}
        </button>
      </div>
    </aside>
  );
}
