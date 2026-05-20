<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\DigitalRecordController;
use App\Http\Controllers\QDecisionController;
use App\Http\Controllers\Auth\DemoAuthController;

// ── Demo clone: password-based login ──────────────────────────────────────
Route::middleware(['web'])->group(function () {
    Route::get('/login', [DemoAuthController::class, 'showLoginForm'])->name('demo.login');
    Route::post('/login', [DemoAuthController::class, 'login'])->name('demo.login.attempt');
    Route::post('/logout', [DemoAuthController::class, 'logout'])->name('demo.logout');
    Route::post('/demo-login/{username}', [DemoAuthController::class, 'quickLogin'])->name('demo.login.quick');
});

// Global language switch — persists the chosen UI locale in the session.
// Used by both the QUAI shell language switcher and the QSpark sub-app's JS.
Route::post('/lang/{locale}', function (string $locale) {
    if (! \in_array($locale, ['ar', 'en'], true)) {
        return response()->json(['success' => false, 'message' => 'Invalid locale'], 400);
    }
    session(['locale' => $locale]);
    app()->setLocale($locale);
    return response()->json([
        'success' => true,
        'locale'  => $locale,
        'dir'     => $locale === 'ar' ? 'rtl' : 'ltr',
    ]);
})->middleware(['web', 'throttle:10,1'])->name('lang.switch');

// SDAIA policy view — auto-accepted at login, but keep the route so old links don't 404.
Route::get('/sdaia-policy', function () {
    if (auth()->user()?->hasAcceptedSdaiaPolicy()) {
        return redirect()->route('home');
    }
    return view('sdaia-policy');
})->middleware(['auth'])->name('sdaia.policy');

// QMentor SPA — same React app reused for the +QSpark branding via /qspark-plus.
// In demo mode, faculty can append ?as=<student_id> to view any student's data.
Route::get('/qmentor/{any?}', function () {
    return view('qmentor.app');
})->where('any', '.*')->middleware(['auth'])->name('qmentor');

Route::get('/qspark-plus/{any?}', function () {
    return view('qmentor.app');
})->where('any', '.*')->middleware(['auth'])->name('qspark-plus');

// Authenticated app — home + Digital Record + Faculty student picker.
Route::middleware(['auth'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::get('/digital-record', [DigitalRecordController::class, 'index'])
        ->name('digital-record.index');

    // The QSpark hub now lives in the merged QSPARK app, served under the
    // /qspark prefix (see routes/qspark.php, mounted from bootstrap/app.php).

    // The merged Q SPARK app is embedded inside QUAI's shell as a same-origin
    // iframe. The wrapper view derives the role-matched deep-link
    // (/dev/{admin|faculty|student}) so the iframe auto-authenticates the user
    // into the matching QSPARK demo persona. An optional ?page= query forwards
    // a sanitized post-login path so the wrapper can land directly on a specific
    // QSPARK section (e.g. /admin/users, /faculty/courses).
    Route::get('/qspark-demo', function () {
        $user = auth()->user();
        $isAdmin = $user && method_exists($user, 'hasAnyRole') && $user->hasAnyRole(['Admin', 'Super Admin']);
        $isFaculty = $user && method_exists($user, 'hasAnyRole') && $user->hasAnyRole(['Faculty', 'Admin', 'Super Admin']);
        $qsparkRole = $isAdmin ? 'admin' : ($isFaculty ? 'faculty' : 'student');
        // QSPARK is merged into this app under the /qspark prefix, so the iframe
        // is always same-origin. Use a root-relative path so the iframe loads
        // from whatever host serves the wrapper page (ai.qu.sa, quailab.dev,
        // localhost, …) instead of being pinned to config('app.url').
        $qsparkBaseUrl = '/qspark';

        // Role-aware section catalogue: keys are stable section ids the home page
        // (or sidebar) can deep-link to; values are the paths the iframe should
        // land on after auto-login. QSPARK is mounted under /qspark, so every
        // path carries that prefix (it becomes the quick-login ?next= target).
        $sectionsByRole = [
            'admin' => [
                'dashboard'   => ['label' => __('messages.qspark_section_admin_dashboard'), 'path' => '/qspark/admin/dashboard'],
                'users'       => ['label' => __('messages.qspark_section_users'),           'path' => '/qspark/admin/users'],
                'roles'       => ['label' => __('messages.qspark_section_roles'),           'path' => '/qspark/admin/roles'],
                'permissions' => ['label' => __('messages.qspark_section_permissions'),     'path' => '/qspark/admin/permissions'],
            ],
            'faculty' => [
                'dashboard' => ['label' => __('messages.qspark_section_faculty_dashboard'), 'path' => '/qspark/faculty/dashboard'],
                'courses'   => ['label' => __('messages.qspark_section_courses'),           'path' => '/qspark/faculty/courses'],
                'students'  => ['label' => __('messages.qspark_section_students'),          'path' => '/qspark/faculty/students'],
                'reports'   => ['label' => __('messages.qspark_section_reports'),           'path' => '/qspark/faculty/reports'],
            ],
            'student' => [
                'dashboard'       => ['label' => __('messages.qspark_section_student_dashboard'), 'path' => '/qspark/dashboard-student'],
                'grades'          => ['label' => __('messages.qspark_section_grades'),            'path' => '/qspark/dashboard-student/grades'],
                'courses'         => ['label' => __('messages.qspark_section_student_courses'),   'path' => '/qspark/dashboard-student/courses'],
                'recommendations' => ['label' => __('messages.qspark_section_recommendations'),   'path' => '/qspark/dashboard-student/recommendations'],
                'chat'            => ['label' => __('messages.qspark_section_chat'),              'path' => '/qspark/dashboard-student/chat'],
            ],
        ];
        $sections = $sectionsByRole[$qsparkRole] ?? [];

        $sectionKey = (string) request()->query('section', '');
        $pageQuery = (string) request()->query('page', '');
        $nextPath = '';
        if ($sectionKey !== '' && isset($sections[$sectionKey])) {
            $nextPath = $sections[$sectionKey]['path'];
        } elseif ($pageQuery !== '' && str_starts_with($pageQuery, '/') && ! str_starts_with($pageQuery, '//')) {
            // Allow ad-hoc ?page=/some/qspark/path while rejecting protocol-relative URLs.
            $nextPath = $pageQuery;
        }

        $qsparkUrl = $qsparkBaseUrl . '/dev/' . $qsparkRole;
        if ($nextPath !== '') {
            $qsparkUrl .= '?next=' . rawurlencode($nextPath);
        }

        return view('qspark-demo', [
            'qsparkUrl' => $qsparkUrl,
            'qsparkRole' => $qsparkRole,
            'qsparkBaseUrl' => $qsparkBaseUrl,
            'qsparkSections' => $sections,
            'qsparkActiveSection' => isset($sections[$sectionKey]) ? $sectionKey : 'dashboard',
        ]);
    })->name('qspark-demo');

    // Faculty-only: list of students and tabbed per-student view.
    Route::get('/faculty/students', [FacultyController::class, 'index'])
        ->middleware('role:Faculty|Admin|Super Admin')
        ->name('faculty.students');

    Route::get('/faculty/students/{studentId}', [FacultyController::class, 'show'])
        ->middleware('role:Faculty|Admin|Super Admin')
        ->name('faculty.students.show');

    // Q Decision Support System — admin-only static dashboards.
    Route::middleware('role:Admin|Super Admin')->group(function () {
        Route::get('/q-decision/recommendations', [QDecisionController::class, 'recommendations'])
            ->name('q-decision.recommendations');
        Route::get('/q-decision/dashboard/{dashboard}', [QDecisionController::class, 'dashboard'])
            ->name('q-decision.dashboard');
        Route::get('/q-decision/digital-advisor', [QDecisionController::class, 'digitalAdvisor'])
            ->name('q-decision.digital-advisor');

        // التقرير الذاتي now lives in the Filament admin panel.
        Route::get('/q-decision/self-report', fn () => redirect('/admin/dashboards/ai-recommendations'))
            ->name('q-decision.self-report');
    });
});
