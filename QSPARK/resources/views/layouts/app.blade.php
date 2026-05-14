<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ app()->getLocale() == 'ar' ? 'rtl' : 'ltr' }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Q SPARK - {{ __('messages.dashboard') }} - Advanced learning management system for Qatar University students">
  <meta name="csrf-token" content="{{ csrf_token() }}">

  <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>

  <title>@yield('title', 'Q SPARK')</title>

  <!-- TailwindCSS v3 (vendored locally; see public/vendor/) -->
  <script src="{{ asset('vendor/tailwindcss/tailwind.js') }}"></script>
  <script>
    // DGA Design System palette (Saudi Digital Government Authority)
    // Primary = SA green, Secondary = Gold, Accent = Lavender, plus semantic states.
    // Default palette names are remapped so all existing class usage adopts DGA shades.
    (function () {
      var dga = {
        primary: { 25:'#F7FDF9', 50:'#F3FCF6', 100:'#DFF6E7', 200:'#B8EACB', 300:'#88D8AD', 400:'#54C08A', 500:'#25935F', 600:'#1B8354', 700:'#166A45', 800:'#14573A', 900:'#104631', 950:'#092A1E' },
        gray:    { 25:'#FCFCFD', 50:'#F9FAFB', 100:'#F3F4F6', 200:'#E5E7EB', 300:'#D2D6DB', 400:'#9DA4AE', 500:'#6C737F', 600:'#4D5761', 700:'#384250', 800:'#1F2A37', 900:'#111927', 950:'#0D121C' },
        gold:    { 25:'#FFFEF7', 50:'#FFFEF2', 100:'#DFF6E7', 200:'#FCF3BD', 300:'#FAE996', 400:'#54C08A', 500:'#F5BD02', 600:'#DBA102', 700:'#B87B02', 800:'#945C01', 900:'#6E3C00', 950:'#472400' },
        lavender:{ 25:'#F7FDF9', 50:'#F3FCF6', 100:'#DFF6E7', 200:'#B8EACB', 300:'#88D8AD', 400:'#54C08A', 500:'#25935F', 600:'#1B8354', 700:'#166A45', 800:'#14573A', 900:'#104631', 950:'#092A1E' },
        error:   { 25:'#FFFBFA', 50:'#FEF3F2', 100:'#FEE4E2', 200:'#FECDCA', 300:'#FDA29B', 400:'#F97066', 500:'#F04438', 600:'#D92D20', 700:'#B42318', 800:'#912018', 900:'#7A271A', 950:'#55160C' },
        warning: { 25:'#FFFCF5', 50:'#FFFAEB', 100:'#FEF0C7', 200:'#FEDF89', 300:'#FEC84B', 400:'#FDB022', 500:'#F79009', 600:'#DC6803', 700:'#B54708', 800:'#93370D', 900:'#7A2E0E', 950:'#4E1D09' },
        info:    { 25:'#F5FAFF', 50:'#ECFDF3', 100:'#DFF6E7', 200:'#B2DDFF', 300:'#84CAFF', 400:'#53B1FD', 500:'#25935F', 600:'#1570EF', 700:'#175CD3', 800:'#1849A9', 900:'#194185', 950:'#102A56' },
        success: { 25:'#F6FEF9', 50:'#ECFDF3', 100:'#DCFAE6', 200:'#ABEFC6', 300:'#75E0A7', 400:'#47CD89', 500:'#17B26A', 600:'#079455', 700:'#067647', 800:'#085D3A', 900:'#074D31', 950:'#053321' }
      };
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              // Explicit DGA namespace
              'dga-primary':  dga.primary,
              'dga-gray':     dga.gray,
              'dga-gold':     dga.gold,
              'dga-lavender': dga.lavender,
              'dga-error':    dga.error,
              'dga-warning':  dga.warning,
              'dga-info':     dga.info,
              'dga-success':  dga.success,
              // Remap default Tailwind palette names so legacy class usage adopts DGA shades
              gray:     dga.gray,
              slate:    dga.gray,
              zinc:     dga.gray,
              neutral:  dga.gray,
              stone:    dga.gray,
              // Green-first: every prominent accent class collapses to DGA SA shades
              blue:     dga.primary,
              indigo:   dga.primary,
              sky:      dga.primary,
              cyan:     dga.primary,
              purple:   dga.primary,
              violet:   dga.primary,
              fuchsia:  dga.primary,
              pink:     dga.primary,
              red:      dga.error,
              rose:     dga.error,
              orange:   dga.warning,
              amber:    dga.warning,
              yellow:   dga.gold,
              green:    dga.success,
              emerald:  dga.success,
              teal:     dga.success,
              lime:     dga.success
            },
            backgroundImage: {
              'dga-grad-1': 'linear-gradient(90deg,#1B8354 0%,#25935F 100%)',
              'dga-grad-2': 'linear-gradient(45deg,#166A45 0%,#1B8354 100%)',
              'dga-grad-3': 'linear-gradient(45deg,#092A1E 0%,#1B8354 100%)',
              'dga-grad-4': 'linear-gradient(90deg,#14573A 0%,#1B8354 100%)',
              'dga-grad-5': 'linear-gradient(26.5deg,#14573A 0%,#166A45 100%)',
              'dga-grad-6': 'linear-gradient(45deg,#104631 0%,#1B8354 100%)'
            }
          }
        },
        plugins: []
      };
    })();
  </script>

  <!-- Flowbite CSS (vendored locally; see public/vendor/) -->
  <link href="{{ asset('vendor/flowbite/flowbite.min.css') }}" rel="stylesheet">

  <style>
    /* DGA Design System CSS variables */
    :root {
      --dga-sa-25:#F7FDF9; --dga-sa-50:#F3FCF6; --dga-sa-100:#DFF6E7; --dga-sa-200:#B8EACB;
      --dga-sa-300:#88D8AD; --dga-sa-400:#54C08A; --dga-sa-500:#25935F; --dga-sa-600:#1B8354;
      --dga-sa-700:#166A45; --dga-sa-800:#14573A; --dga-sa-900:#104631; --dga-sa-950:#092A1E;
      --dga-gray-25:#FCFCFD; --dga-gray-50:#F9FAFB; --dga-gray-100:#F3F4F6; --dga-gray-200:#E5E7EB;
      --dga-gray-300:#D2D6DB; --dga-gray-400:#9DA4AE; --dga-gray-500:#6C737F; --dga-gray-600:#4D5761;
      --dga-gray-700:#384250; --dga-gray-800:#1F2A37; --dga-gray-900:#111927; --dga-gray-950:#0D121C;
      --dga-gold-25:#FFFEF7; --dga-gold-50:#FFFEF2; --dga-gold-100:#DFF6E7; --dga-gold-200:#FCF3BD;
      --dga-gold-300:#FAE996; --dga-gold-400:#54C08A; --dga-gold-500:#F5BD02; --dga-gold-600:#DBA102;
      --dga-gold-700:#B87B02; --dga-gold-800:#945C01; --dga-gold-900:#6E3C00; --dga-gold-950:#472400;
      --dga-lavender-25:#F7FDF9; --dga-lavender-50:#F3FCF6; --dga-lavender-100:#DFF6E7; --dga-lavender-200:#B8EACB;
      --dga-lavender-300:#88D8AD; --dga-lavender-400:#54C08A; --dga-lavender-500:#25935F; --dga-lavender-600:#1B8354;
      --dga-lavender-700:#166A45; --dga-lavender-800:#14573A; --dga-lavender-900:#104631; --dga-lavender-950:#092A1E;
      --dga-error:#F04438; --dga-error-dark:#B42318; --dga-error-light:#FEE4E2;
      --dga-warning:#F79009; --dga-warning-dark:#B54708; --dga-warning-light:#FEF0C7;
      --dga-info:#25935F;  --dga-info-dark:#175CD3;  --dga-info-light:#DFF6E7;
      --dga-success:#17B26A; --dga-success-dark:#067647; --dga-success-light:#DCFAE6;
    }
    body { font-family: 'Tajawal', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif; }

    /* Numbers always LTR */
    .number,.time,.date,.percentage,.en-numbers { font-variant-numeric: lining-nums; direction:ltr!important; unicode-bidi:embed; display:inline-block; font-family:Arial,sans-serif; }
    [dir="rtl"] .number,[dir="rtl"] .time,[dir="rtl"] .date,[dir="rtl"] .percentage,[dir="rtl"] .en-numbers { direction:ltr!important; text-align:left; }

    /* ===== RTL Complete Support ===== */

    /* Spacing - reverse margins/paddings */
    [dir="rtl"] .ml-1 { margin-left:0; margin-right:0.25rem; }
    [dir="rtl"] .mr-1 { margin-right:0; margin-left:0.25rem; }
    [dir="rtl"] .ml-2 { margin-left:0; margin-right:0.5rem; }
    [dir="rtl"] .mr-2 { margin-right:0; margin-left:0.5rem; }
    [dir="rtl"] .ml-3 { margin-left:0; margin-right:0.75rem; }
    [dir="rtl"] .mr-3 { margin-right:0; margin-left:0.75rem; }
    [dir="rtl"] .ml-4 { margin-left:0; margin-right:1rem; }
    [dir="rtl"] .mr-4 { margin-right:0; margin-left:1rem; }
    [dir="rtl"] .ml-6 { margin-left:0; margin-right:1.5rem; }
    [dir="rtl"] .mr-6 { margin-right:0; margin-left:1.5rem; }
    [dir="rtl"] .ml-8 { margin-left:0; margin-right:2rem; }
    [dir="rtl"] .mr-8 { margin-right:0; margin-left:2rem; }
    [dir="rtl"] .ml-12 { margin-left:0; margin-right:3rem; }
    [dir="rtl"] .mr-12 { margin-right:0; margin-left:3rem; }
    [dir="rtl"] .ml-auto { margin-left:0; margin-right:auto; }
    [dir="rtl"] .mr-auto { margin-right:0; margin-left:auto; }

    [dir="rtl"] .pl-1 { padding-left:0; padding-right:0.25rem; }
    [dir="rtl"] .pr-1 { padding-right:0; padding-left:0.25rem; }
    [dir="rtl"] .pl-2 { padding-left:0; padding-right:0.5rem; }
    [dir="rtl"] .pr-2 { padding-right:0; padding-left:0.5rem; }
    [dir="rtl"] .pl-3 { padding-left:0; padding-right:0.75rem; }
    [dir="rtl"] .pr-3 { padding-right:0; padding-left:0.75rem; }
    [dir="rtl"] .pl-4 { padding-left:0; padding-right:1rem; }
    [dir="rtl"] .pr-4 { padding-right:0; padding-left:1rem; }
    [dir="rtl"] .pl-6 { padding-left:0; padding-right:1.5rem; }
    [dir="rtl"] .pr-6 { padding-right:0; padding-left:1.5rem; }
    [dir="rtl"] .pl-8 { padding-left:0; padding-right:2rem; }
    [dir="rtl"] .pr-8 { padding-right:0; padding-left:2rem; }

    /* Text alignment */
    [dir="rtl"] .text-left { text-align: right; }
    [dir="rtl"] .text-right { text-align: left; }

    /* Positioning */
    [dir="rtl"] .left-0 { left: auto; right: 0; }
    [dir="rtl"] .right-0 { right: auto; left: 0; }
    [dir="rtl"] .left-1 { left: auto; right: 0.25rem; }
    [dir="rtl"] .right-1 { right: auto; left: 0.25rem; }
    [dir="rtl"] .left-2 { left: auto; right: 0.5rem; }
    [dir="rtl"] .right-2 { right: auto; left: 0.5rem; }
    [dir="rtl"] .left-4 { left: auto; right: 1rem; }
    [dir="rtl"] .right-4 { right: auto; left: 1rem; }

    /* Border radius */
    [dir="rtl"] .rounded-l { border-radius: 0 0.25rem 0.25rem 0; }
    [dir="rtl"] .rounded-r { border-radius: 0.25rem 0 0 0.25rem; }
    [dir="rtl"] .rounded-l-lg { border-radius: 0 0.5rem 0.5rem 0; }
    [dir="rtl"] .rounded-r-lg { border-radius: 0.5rem 0 0 0.5rem; }
    [dir="rtl"] .rounded-l-xl { border-radius: 0 0.75rem 0.75rem 0; }
    [dir="rtl"] .rounded-r-xl { border-radius: 0.75rem 0 0 0.75rem; }

    /* Borders */
    [dir="rtl"] .border-l { border-left: 0; border-right: 1px solid; }
    [dir="rtl"] .border-r { border-right: 0; border-left: 1px solid; }
    [dir="rtl"] .border-l-2 { border-left: 0; border-right: 2px solid; }
    [dir="rtl"] .border-r-2 { border-right: 0; border-left: 2px solid; }
    [dir="rtl"] .border-l-4 { border-left: 0; border-right: 4px solid; }
    [dir="rtl"] .border-r-4 { border-right: 0; border-left: 4px solid; }

    /* Space between */
    [dir="rtl"] .space-x-1 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 1; }
    [dir="rtl"] .space-x-2 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 1; }
    [dir="rtl"] .space-x-3 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 1; }
    [dir="rtl"] .space-x-4 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 1; }
    [dir="rtl"] .space-x-6 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 1; }
    [dir="rtl"] .space-x-8 > :not([hidden]) ~ :not([hidden]) { --tw-space-x-reverse: 1; }

    /* Gap utilities don't need RTL override - flexbox handles it */

    /* Rotate chevrons/arrows for RTL */
    [dir="rtl"] .rtl\:rotate-180 { transform: rotate(180deg); }

    /* Inset utilities */
    [dir="rtl"] .inset-x-0 { left: 0; right: 0; }

    /* Translation */
    [dir="rtl"] .translate-x-full { --tw-translate-x: -100%; }
    [dir="rtl"] .-translate-x-full { --tw-translate-x: 100%; }

    /* Scroll snap */
    [dir="rtl"] .scroll-pl-6 { scroll-padding-left: 0; scroll-padding-right: 1.5rem; }
    [dir="rtl"] .scroll-pr-6 { scroll-padding-right: 0; scroll-padding-left: 1.5rem; }

    /* Divide utilities */
    [dir="rtl"] .divide-x > :not([hidden]) ~ :not([hidden]) { --tw-divide-x-reverse: 1; }
  </style>

  <!-- Alpine (vendored locally; see public/vendor/) -->
  <script src="{{ asset('vendor/alpinejs/alpine.min.js') }}" defer></script>

  @stack('styles')
</head>
<body class="bg-dga-gray-50 min-h-screen text-dga-gray-900">
  {{-- When embedded in the QUAI shell's iframe, QUAI already renders the
       topbar + sidebar, so QSPARK suppresses its own chrome to avoid doubling. --}}
  @php($isStudentView = auth()->check() && auth()->user()->isStudent())
  <div class="flex min-h-screen">
    {{-- Students navigate via the top tab bar instead of the side menu. --}}
    @unless(($isEmbedded ?? false) || $isStudentView)
      @include('layouts.sidebar')
    @endunless

    <main class="flex-1 flex flex-col">
      @unless($isEmbedded ?? false)
        @include('layouts.header')

        @if($isStudentView)
          @include('layouts.student-tabs')
        @endif
      @endunless

      <div class="flex-1">
        @yield('content')
      </div>

      @unless($isEmbedded ?? false)
        @include('layouts.footer')
      @endunless
    </main>
  </div>

  @include('layouts.terms-modal')

  @include('layouts.scripts')

  <!-- IMPORTANT: keep stack LAST so child views' scripts are definitely after everything -->
  @stack('scripts')
</body>
</html>