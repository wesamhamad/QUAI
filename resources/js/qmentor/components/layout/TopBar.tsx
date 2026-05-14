import { useState, useEffect, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Bars3Icon, SunIcon, MoonIcon, LanguageIcon, MagnifyingGlassIcon, ChevronDownIcon, UsersIcon } from '@heroicons/react/24/outline';
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

const roleConfig: { value: Role; ar: string; en: string; icon: LucideIcon }[] = [
  { value: 'student', ar: 'طالب', en: 'Student', icon: User },
  { value: 'agent', ar: 'الوكيل الذكي', en: 'AI Agent', icon: Bot },
  { value: 'advisor', ar: 'مرشد أكاديمي', en: 'Academic Advisor', icon: GraduationCap },
  { value: 'admin', ar: 'مدير', en: 'Admin', icon: Shield },
];

interface TopBarProps {
  onMenuClick: () => void;
  sidebarCollapsed: boolean;
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { lang, toggleLanguage, t } = useLanguage();
  const { role, setRole, canSwitchRole } = useRole();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isQSparkBrand = typeof window !== 'undefined'
    && window.location.pathname.startsWith('/qspark-plus')
    && location.pathname === '/'
    && searchParams.get('solo') !== '1';
  const [searchOpen, setSearchOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [studentMenuOpen, setStudentMenuOpen] = useState(false);

  const currentRoleConfig = roleConfig.find(r => r.value === role)!;
  const CurrentRoleIcon = currentRoleConfig.icon;

  // Student-impersonation dropdown — faculty/admin can flip between the three
  // featured demo cases. The roster is injected by the Blade layout.
  const qmentorUser = (window as { __qmentor_user?: { is_faculty?: boolean; is_super_admin?: boolean; student_id?: string | null } }).__qmentor_user;
  const showStudentSwitcher = !!(qmentorUser?.is_faculty || qmentorUser?.is_super_admin);
  const studentRoster = ((window as { __qmentor_students?: DemoStudent[] }).__qmentor_students) ?? [];
  const activeStudentId = searchParams.get('as') ?? qmentorUser?.student_id ?? null;
  const activeStudent = studentRoster.find(s => s.student_id === activeStudentId) ?? studentRoster[0];

  const selectStudent = (sid: string) => {
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
      <header className="flex items-center justify-between h-16 px-4 lg:px-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {/* Left: Mobile menu + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">
            {isQSparkBrand
              ? t('منصة +QSpark', '+QSpark Platform')
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
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <button
            onClick={() => setSearchOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MagnifyingGlassIcon className="w-5 h-5" />
          </button>

          {/* Student switcher — faculty/admin flip between the 3 demo cases. */}
          {showStudentSwitcher && studentRoster.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setStudentMenuOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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
                  <div className="absolute end-0 top-full mt-1 z-50 w-72 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1">
                    <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
                      {t('حالات الطلاب', 'Student cases')}
                    </div>
                    {studentRoster.map(s => {
                      const isActive = s.student_id === activeStudent?.student_id;
                      return (
                        <button
                          key={s.student_id}
                          onClick={() => { setStudentMenuOpen(false); selectStudent(s.student_id); }}
                          className={`w-full flex items-start gap-2.5 px-3 py-2.5 text-sm transition-colors ${
                            isActive
                              ? 'bg-sa-50 dark:bg-sa-950'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
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

          {/* Role switcher — visible only to super admins (testing). Students are pinned. */}
          {canSwitchRole && (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(prev => !prev)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title={t('تبديل الدور', 'Switch role')}
              >
                <CurrentRoleIcon className="w-4 h-4 text-sa-600 dark:text-sa-400" />
                <span className="hidden sm:inline">{t(currentRoleConfig.ar, currentRoleConfig.en)}</span>
                <ChevronDownIcon className="w-3 h-3" />
              </button>
              {roleMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                  <div className="absolute end-0 top-full mt-1 z-50 w-48 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg py-1">
                    {roleConfig.map(r => {
                      const Icon = r.icon;
                      const isActive = r.value === role;
                      return (
                        <button
                          key={r.value}
                          onClick={() => { setRole(r.value); setRoleMenuOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? 'bg-sa-50 text-sa-700 dark:bg-sa-950 dark:text-sa-300 font-medium'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={t('التبديل إلى الإنجليزية', 'Switch to Arabic')}
          >
            <LanguageIcon className="w-4 h-4" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={t('تبديل الوضع', 'Toggle theme')}
          >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-sa-500 flex items-center justify-center ms-2">
            <span className="text-white text-sm font-medium">
              {(window as any).__qmentor_user?.name?.[0] || 'U'}
            </span>
          </div>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
