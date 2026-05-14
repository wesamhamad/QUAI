<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>QMentor - {{ config('app.name') }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite('resources/js/qmentor/main.tsx')
</head>
<body class="antialiased">
    <div id="qmentor-app"></div>

    @auth
    <script>
        @php
            $u = auth()->user();
            // Faculty/Admin can impersonate a student via ?as=<student_id>.
            $impersonate = request()->query('as');
            $canImpersonate = $u && method_exists($u, 'hasAnyRole')
                && $u->hasAnyRole(['Faculty', 'Admin', 'Super Admin']);

            // Three featured demo cases the student switcher cycles through.
            // In this demo build every signed-in user (students included) may
            // switch between these three via ?as=<id> to walk through the
            // healthy / follow-up / dismissal-risk cases side by side.
            $featuredIds = ['443211517', '443100021', '443100022'];
            $wantsFeatured = is_string($impersonate) && in_array($impersonate, $featuredIds, true);

            $effectiveStudentId = (($canImpersonate && is_string($impersonate) && $impersonate !== '') || $wantsFeatured)
                ? $impersonate
                : ($u->student_id ?? null);

            // is_student is true only when the SPA actually has a student context
            // to operate on — either the logged-in user is a student, or a faculty
            // member is actively impersonating one via ?as=<student_id>. A faculty
            // member browsing /qmentor without impersonation lands in the advisor view.
            $hasStudentContext = $u->isStudent() || ($canImpersonate && $effectiveStudentId !== null);

            $userData = [
                'id' => $u->id,
                'name' => $u->name ?? '',
                'email' => $u->email ?? '',
                'student_id' => $effectiveStudentId,
                'user_type' => $u->user_type ?? null,
                'is_student' => $hasStudentContext,
                'is_faculty' => $canImpersonate && !$u->isStudent(),
                // The plain "Admin" role (not Super Admin) is pinned to the
                // read-only مدير view in QMentor.
                'is_admin' => $u->hasRole('Admin'),
                'is_super_admin' => $u->isSuperAdmin(),
                'impersonating' => ($canImpersonate || $wantsFeatured) && $impersonate ? $impersonate : null,
            ];
            // The roster is always exposed so the switcher renders for every
            // signed-in user — not just faculty/admin.
            $studentRoster = array_values(array_filter(
                \App\Support\DemoData::students(),
                fn ($s) => in_array($s['student_id'], $featuredIds, true)
            ));
        @endphp
        window.__qmentor_user = {!! json_encode($userData) !!};
        window.__qmentor_students = {!! json_encode($studentRoster) !!};
        {{-- 'qspark' points at the real QSpark learning hub — NOT /qspark-plus,
             which is just the QMentor SPA rebranded. The "Study on QSpark"
             buttons deep-link here. 'home' / 'logout' let the SPA shell return
             to the QUAI platform home and sign out from any page. --}}
        window.__qmentor_links = {!! json_encode([
            'qspark' => route('qspark.index'),
            'digitalRecord' => route('digital-record.index'),
            'home' => route('home'),
            'logout' => route('demo.logout'),
        ]) !!};
        window.__qmentor_csrf = @json(csrf_token());
    </script>
    @endauth
</body>
</html>
