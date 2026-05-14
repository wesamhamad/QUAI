{{-- ===== Sidebar Navigation ===== --}}
<aside class="q-sidebar" id="sidebar">
    {{-- Logo / Brand --}}
    <div class="q-sidebar-header">
        <a href="{{ route('home') }}" class="q-sidebar-logo" title="QUAI">
            <svg viewBox="0 0 32 32" fill="none" style="width: 24px; height: 24px;">
                <path d="M16 2L4 9v14l12 7 12-7V9L16 2z" fill="rgba(255,255,255,0.2)" stroke="white" stroke-width="1.5"/>
                <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="800" font-family="IBM Plex Sans Arabic, sans-serif">Q</text>
            </svg>
        </a>
        <div class="q-sidebar-brand">
            <div class="q-sidebar-brand-name">QUAI</div>
            <div class="q-sidebar-brand-sub">منصة الذكاء الاصطناعي</div>
        </div>
    </div>

    {{-- Navigation --}}
    <nav class="q-sidebar-nav q-scrollbar-hide">
        <a href="{{ route('home') }}"
           class="q-nav-item {{ request()->routeIs('home') ? 'active' : '' }}">
            <svg class="q-nav-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            <span class="q-nav-label">الرئيسية</span>
        </a>

        @php($u = auth()->user())
        @php($isFaculty = $u && method_exists($u, 'hasAnyRole') && $u->hasAnyRole(['Faculty', 'Admin', 'Super Admin']))
        @php($isAdmin = $u && method_exists($u, 'hasAnyRole') && $u->hasAnyRole(['Admin', 'Super Admin']))

        <a href="/qmentor"
           class="q-nav-item {{ request()->is('qmentor*') ? 'active' : '' }}">
            <svg class="q-nav-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
            </svg>
            <span class="q-nav-label">QMentor</span>
        </a>

        <a href="{{ route('qspark-plus') }}"
           class="q-nav-item {{ request()->is('qspark') || request()->is('qspark-plus*') ? 'active' : '' }}">
            <svg class="q-nav-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/>
            </svg>
            <span class="q-nav-label">+QSpark</span>
        </a>

        <a href="{{ route('digital-record.index') }}"
           class="q-nav-item {{ request()->routeIs('digital-record.*') ? 'active' : '' }}">
            <svg class="q-nav-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="q-nav-label">سجلك الرقمي</span>
        </a>

        @if($isFaculty)
        <div class="q-nav-divider"></div>
        <a href="{{ route('faculty.students') }}"
           class="q-nav-item {{ request()->routeIs('faculty.*') ? 'active' : '' }}">
            <svg class="q-nav-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="q-nav-label">الطلاب</span>
        </a>
        @endif

        @if($isAdmin)
        <div class="q-nav-divider"></div>
        <a href="{{ url('/admin/dashboards/ai-recommendations') }}"
           class="q-nav-item">
            <svg class="q-nav-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3v18h18M7 14l4-4 4 4 5-5"/>
            </svg>
            <span class="q-nav-label">لوحات القرار</span>
        </a>
        <a href="{{ route('q-decision.digital-advisor') }}"
           class="q-nav-item {{ request()->routeIs('q-decision.digital-advisor') ? 'active' : '' }}">
            <svg class="q-nav-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            <span class="q-nav-label">المستشار الرقمي</span>
        </a>
        @endif

        @can('access_admin_panel')
        <a href="{{ url('/admin') }}" class="q-nav-item">
            <svg class="q-nav-icon" width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span class="q-nav-label">لوحة التحكم</span>
        </a>
        @endcan
    </nav>

    {{-- Sidebar Footer --}}
    <div class="q-sidebar-footer">
        <button class="q-sidebar-collapse-btn" id="sidebarCollapseBtn" title="طي القائمة">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
            </svg>
            <span class="q-sidebar-collapse-label">طي القائمة</span>
        </button>
    </div>
</aside>
