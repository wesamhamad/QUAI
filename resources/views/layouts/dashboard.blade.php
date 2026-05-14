<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'QUAI - منصة الذكاء الاصطناعي')</title>

    {{-- FOUC prevention: apply saved theme before CSS loads --}}
    <script>
        (function(){var t=localStorage.getItem('quai-theme');if(t)document.documentElement.setAttribute('data-theme',t);})();
    </script>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet">
    @stack('styles')
</head>
<body>
    {{-- Global light-green page loader; visible until the page finishes loading and on internal navigations. --}}
    @include('layouts.partials.page-loader')

    <div class="q-dashboard">
        {{-- Sidebar --}}
        @include('layouts.partials.sidebar')

        {{-- Main Content --}}
        <div class="q-main">
            @include('layouts.partials.topbar')

            <main class="@yield('content-class', 'q-content')">
                @yield('content')
            </main>
        </div>

        {{-- Mobile Overlay --}}
        <div class="q-overlay" id="sidebarOverlay"></div>
    </div>

    {{-- AI loader overlay for navigations to /digital-record (sidebar, home card, deep links). --}}
    @auth
        @include('digital-record._loader')
    @endauth

    {{-- Theme & Dropdown JS --}}
    <script>
        // Theme toggle
        (function() {
            function updateIcons() {
                const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
                document.querySelectorAll('.q-icon-sun').forEach(el => el.style.display = isDark ? 'block' : 'none');
                document.querySelectorAll('.q-icon-moon').forEach(el => el.style.display = isDark ? 'none' : 'block');
            }
            updateIcons();

            document.getElementById('themeToggle')?.addEventListener('click', () => {
                const html = document.documentElement;
                const next = (html.getAttribute('data-theme') || 'light') === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', next);
                localStorage.setItem('quai-theme', next);
                updateIcons();
            });
        })();

        // User dropdown
        (function() {
            const btn = document.getElementById('userMenuBtn');
            const dropdown = document.getElementById('userDropdown');
            if (!btn || !dropdown) return;

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('open');
            });
            document.addEventListener('click', (e) => {
                if (!e.target.closest('#userMenu')) dropdown.classList.remove('open');
            });
        })();
    </script>

    @stack('scripts')
</body>
</html>
