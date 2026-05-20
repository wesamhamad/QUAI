import { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Bars3Icon, SunIcon, MoonIcon, LanguageIcon, MagnifyingGlassIcon, ChevronDownIcon, UsersIcon, HomeIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { Bot, GraduationCap, Shield, User, type LucideIcon } from 'lucide-react';

interface DemoStudent {
  student_id: string;
  name: string;
  name_en?: string;
  major: string;
  faculty: string;
  gpa?: number;
  level?: number;
}
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useRole, type Role } from '../../contexts/RoleContext';
import GlobalSearch from '../../pages/Settings/GlobalSearch';
import { dropdownTrigger, dropdownPanel, dropdownHeader, dropdownItem, dropdownItemBase } from '../ui/dropdownStyles';

const roleConfig: { value: Role; ar: string; en: string; icon: LucideIcon }[] = [
  { value: 'student', ar: 'طالب', en: 'Student', icon: User },
  { value: 'agent', ar: 'الوكيل الذكي', en: 'AI Agent', icon: Bot },
  { value: 'advisor', ar: 'مرشد أكاديمي', en: 'Academic Advisor', icon: GraduationCap },
  { value: 'admin', ar: 'مدير', en: 'Admin', icon: Shield },
];

interface TopBarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
  /** Hide the mobile nav toggle when there is no side menu (e.g. QSpark+). */
  hideMenuButton?: boolean;
}

export default function TopBar({ onMenuClick, hideMenuButton = false }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage();
  const { role, setRole, canSwitchRole, viewOnly } = useRole();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isQSparkBrand = typeof window !== 'undefined'
    && window.location.pathname.startsWith('/qspark-plus')
    && location.pathname === '/'
    && searchParams.get('solo') !== '1';
  const [searchOpen, setSearchOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [studentMenuOpen, setStudentMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Links/credentials injected by the Blade shell — let the SPA return to the
  // QUAI platform home and sign out from any page.
  const appLinks = (window as { __qmentor_links?: { home?: string; logout?: string } }).__qmentor_links;
  const csrfToken = (window as { __qmentor_csrf?: string }).__qmentor_csrf ?? '';
  const homeUrl = appLinks?.home ?? '/';
  const logoutUrl = appLinks?.logout;

  // Logout is a state-changing POST, so submit a CSRF-protected form rather
  // than navigating — mirrors the Blade topbar's logout form.
  const handleLogout = () => {
    if (!logoutUrl) return;
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = logoutUrl;
    const token = document.createElement('input');
    token.type = 'hidden';
    token.name = '_token';
    token.value = csrfToken;
    form.appendChild(token);
    document.body.appendChild(form);
    form.submit();
  };

  const currentRoleConfig = roleConfig.find(r => r.value === role)!;
  const CurrentRoleIcon = currentRoleConfig.icon;

  // Student-switcher dropdown — flips between the three featured demo cases.
  // The roster is injected by the Blade layout for every signed-in user, so
  // the switcher is available to students too (not just faculty/admin).
  const qmentorUser = (window as { __qmentor_user?: { is_faculty?: boolean; is_admin?: boolean; is_super_admin?: boolean; student_id?: string | null } }).__qmentor_user;
  // Faculty (who aren't super admins) only switch between the agent and advisor
  // views — the student and admin roles are reserved for super admins. The plain
  // admin account is handled separately (pinned to the read-only مدير view).
  const isFacultyOnly = !!qmentorUser?.is_faculty && !qmentorUser?.is_super_admin && !qmentorUser?.is_admin;
  const availableRoles = isFacultyOnly
    ? roleConfig.filter(r => r.value !== 'student' && r.value !== 'admin')
    : roleConfig;
  const studentRoster = ((window as { __qmentor_students?: DemoStudent[] }).__qmentor_students) ?? [];
  // Faculty (non-super-admin) don't get the student-case switcher — it's a
  // demo/admin affordance, not part of the faculty view.
  const showStudentSwitcher = studentRoster.length > 0 && !isFacultyOnly;
  // ?as= is the source of truth, but react-router navigation strips it; fall
  // back to the sessionStorage mirror so the switcher label stays correct.
  const storedAs = typeof window !== 'undefined'
    ? (() => { try { return sessionStorage.getItem('qmentor:as'); } catch { return null; } })()
    : null;
  const activeStudentId = searchParams.get('as') ?? storedAs ?? qmentorUser?.student_id ?? null;
  const activeStudent = studentRoster.find(s => s.student_id === activeStudentId) ?? studentRoster[0];

  const selectStudent = (sid: string) => {
    // Persist the choice before reloading so every API call (and the label)
    // picks it up even on pages that navigate away from the ?as= URL.
    try { sessionStorage.setItem('qmentor:as', sid); } catch { /* ignore */ }
    const url = new URL(window.location.href);
    url.searchParams.set('as', sid);
    // Drop cached SPA state from the previous student so each page re-fetches.
    try { localStorage.removeItem('qmentor-role'); } catch { /* ignore */ }
    window.location.href = url.toString();
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <header className="flex items-center justify-between h-16 px-2 sm:px-4 lg:px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!hideMenuButton && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">
            {isQSparkBrand
              ? t('منصة +QSpark', 'QSpark+ Platform')
              : t('منصة QMentor', 'QMentor Platform')}
          </h1>
        </div>

        {/* Center: Search bar */}
        <button
          onClick={() => setSearchOpen(true)}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors max-w-xs w-full"
        >
          <MagnifyingGlassIcon className="w-4 h-4 shrink-0" />
          <span className="flex-1 text-start truncate">{t('بحث...', 'Search...')}</span>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
            ⌘K
          </kbd>
        </button>

        {/* Right: Controls */}
        <div className="flex items-center gap-0.5 sm:gap-2 min-w-0">
          {/* Mobile search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>

          {/* Student switcher — faculty/admin flip between the 3 demo cases. */}
          {showStudentSwitcher && studentRoster.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setStudentMenuOpen(prev => !prev)}
                className={dropdownTrigger}
                title={t('عرض كطالب', 'View as student')}
              >
                <UsersIcon className="w-4 h-4 text-sa-600 dark:text-sa-400" />
                <span className="hidden md:inline max-w-[160px] truncate">
                  {activeStudent ? (lang === 'ar' ? activeStudent.name : (activeStudent.name_en ?? activeStudent.name)) : t('اختر طالباً', 'Select student')}
                </span>
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              {studentMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setStudentMenuOpen(false)} />
                  <div className={`fixed start-2 end-2 top-16 z-50 sm:absolute sm:start-0 sm:end-auto sm:top-full sm:mt-1 sm:w-72 sm:max-w-[calc(100vw-1rem)] ${dropdownPanel}`}>
                    <div className={`${dropdownHeader} border-b border-gray-100 dark:border-gray-700`}>
                      {t('حالات الطلاب', 'Student cases')}
                    </div>
                    {studentRoster.map(s => {
                      const isActive = s.student_id === activeStudent?.student_id;
                      return (
                        <button
                          key={s.student_id}
                          onClick={() => { setStudentMenuOpen(false); selectStudent(s.student_id); }}
                          className={dropdownItem(isActive, 'start')}
                        >
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 ${isActive ? 'bg-sa-600' : 'bg-gray-400 dark:bg-gray-500'}`}>
                            {(lang === 'ar' ? s.name : (s.name_en ?? s.name)).split(' ')[0]?.[0] ?? 'S'}
                          </div>
                          <div className="text-start flex-1 min-w-0">
                            <div className={`text-sm truncate ${isActive ? 'font-semibold text-sa-700 dark:text-sa-300' : 'text-gray-700 dark:text-gray-200'}`}>
                              {lang === 'ar' ? s.name : (s.name_en ?? s.name)}
                            </div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                              {s.student_id} · {s.major}
                            </div>
                            <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                              {t('المعدل', 'GPA')}: {s.gpa ?? '—'} · {t('المستوى', 'Level')} {s.level ?? '—'}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Read-only role badge — the admin account is pinned to the مدير
              view with no role switcher. */}
          {!canSwitchRole && viewOnly && (
            <div
              className="relative flex items-center gap-1.5 px-1.5 sm:px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm text-gray-600 dark:text-gray-300"
              title={t('عرض للقراءة فقط', 'Read-only view')}
            >
              <CurrentRoleIcon className="w-4 h-4 text-sa-600 dark:text-sa-400" />
              <span className="hidden sm:inline">{t(currentRoleConfig.ar, currentRoleConfig.en)}</span>
              <span className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                {t('للعرض فقط', 'View only')}
              </span>
              <span className="sm:hidden absolute -top-1 -end-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-white dark:ring-gray-800" aria-hidden="true" />
            </div>
          )}

          {/* Role switcher — visible only to super admins (testing). Students are pinned. */}
          {canSwitchRole && (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(prev => !prev)}
                className={dropdownTrigger}
                title={t('تبديل الدور', 'Switch role')}
              >
                <CurrentRoleIcon className="w-4 h-4 text-sa-600 dark:text-sa-400" />
                <span className="hidden sm:inline">{t(currentRoleConfig.ar, currentRoleConfig.en)}</span>
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              {roleMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                  <div className={`fixed start-2 end-2 top-16 z-50 sm:absolute sm:start-0 sm:end-auto sm:top-full sm:mt-1 sm:w-48 sm:max-w-[calc(100vw-1rem)] ${dropdownPanel}`}>
                    {availableRoles.map(r => {
                      const Icon = r.icon;
                      const isActive = r.value === role;
                      return (
                        <button
                          key={r.value}
                          onClick={() => { setRole(r.value); setRoleMenuOpen(false); }}
                          className={dropdownItem(isActive)}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-sa-600 dark:text-sa-400' : 'text-gray-400 dark:text-gray-500'}`} />
                          <span>{t(r.ar, r.en)}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Language toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={t('التبديل إلى الإنجليزية', 'Switch to Arabic')}
          >
            <LanguageIcon className="w-4 h-4" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={t('تبديل الوضع', 'Toggle theme')}
          >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          {/* User menu — avatar dropdown with home shortcut + logout, so both
              are reachable from every SPA page (QMentor and QSpark+). */}
          <div className="relative ms-1 sm:ms-2">
            <button
              onClick={() => setUserMenuOpen(prev => !prev)}
              className="w-8 h-8 rounded-full bg-sa-500 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-sa-500"
              title={(window as { __qmentor_user?: { name?: string } }).__qmentor_user?.name || t('الحساب', 'Account')}
            >
              <span className="text-white text-sm font-medium">
                {(window as { __qmentor_user?: { name?: string } }).__qmentor_user?.name?.[0] || 'U'}
              </span>
            </button>
            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className={`absolute end-0 top-full mt-1 z-50 w-60 max-w-[calc(100vw-1rem)] ${dropdownPanel}`}>
                  <div className={`${dropdownHeader} border-b border-gray-100 dark:border-gray-700 normal-case`}>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {(window as { __qmentor_user?: { name?: string } }).__qmentor_user?.name || t('مستخدم', 'User')}
                    </div>
                    <div className="text-[11px] font-normal text-gray-500 dark:text-gray-400 truncate">
                      {(window as { __qmentor_user?: { email?: string } }).__qmentor_user?.email || ''}
                    </div>
                  </div>
                  <a
                    href={homeUrl}
                    className={dropdownItem(false)}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <HomeIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <span>{t('الرئيسية', 'Home')}</span>
                  </a>
                  {logoutUrl && (
                    <button
                      onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                      className={`${dropdownItemBase} px-3 items-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40`}
                    >
                      <ArrowRightStartOnRectangleIcon className="w-4 h-4" />
                      <span>{t('تسجيل الخروج', 'Log out')}</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
