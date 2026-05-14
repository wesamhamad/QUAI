{{-- ===== Top Bar ===== --}}
<header class="q-topbar">
    <div class="q-topbar-right">
        <button class="q-hamburger" id="sidebarToggle" title="القائمة">
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
        </button>
        <h1 class="q-topbar-title">@yield('page-title', 'الرئيسية')</h1>
    </div>

    <div class="q-topbar-left">
        {{-- Theme Toggle --}}
        <button class="q-theme-toggle" id="themeToggle" title="تبديل الوضع">
            <svg class="q-icon-sun" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display:none;">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
            </svg>
            <svg class="q-icon-moon" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
        </button>

        {{-- User Menu --}}
        @auth
        <div class="q-user-menu" id="userMenu">
            <button class="q-user-menu-btn" id="userMenuBtn" title="{{ auth()->user()->name }}">
                <span class="q-avatar q-avatar-sm">{{ mb_substr(auth()->user()->name, 0, 1) }}</span>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 16px; height: 16px; color: var(--q-text-muted);">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
            </button>
            <div class="q-dropdown" id="userDropdown">
                <div class="q-dropdown-header">
                    <div style="font-weight: 700; font-size: var(--q-font-sm);">{{ auth()->user()->name }}</div>
                    <div style="font-size: var(--q-font-xs); color: var(--q-text-muted);">{{ auth()->user()->email }}</div>
                </div>
                @can('access_admin_panel')
                <a href="{{ url('/admin') }}" class="q-dropdown-item">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                    </svg>
                    لوحة التحكم
                </a>
                @endcan
                <div class="q-dropdown-divider"></div>
                <form method="POST" action="{{ route('demo.logout') }}" class="q-dropdown-form">
                    @csrf
                    <button type="submit" class="q-dropdown-item danger">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        تسجيل الخروج
                    </button>
                </form>
            </div>
        </div>
        @endauth
    </div>
</header>
