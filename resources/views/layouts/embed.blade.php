{{--
    Chrome-less variant of layouts.dashboard: same head, styles and script
    stacks, no sidebar / topbar / AI loader overlay. Used when a page is
    rendered inside an iframe by another QUAI screen (سجلك الرقمي inside the
    QMentor digital twin), where the surrounding app already draws navigation.
--}}
<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'QUAI - منصة الذكاء الاصطناعي')</title>

    {{-- The embedding page owns the theme; mirror its choice from the same key. --}}
    <script>
        (function(){var t=localStorage.getItem('quai-theme');if(t)document.documentElement.setAttribute('data-theme',t);})();
    </script>

    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet">
    @stack('styles')
    <style>
        body { background: transparent; }
        .q-embed-content { padding: var(--q-space-4) var(--q-space-4) var(--q-space-8); }
    </style>
</head>
<body>
    <main class="q-embed-content">
        @yield('content')
    </main>

    @stack('scripts')
</body>
</html>
