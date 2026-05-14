<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\DigitalRecordController;
use App\Http\Controllers\QDecisionController;
use App\Http\Controllers\QSparkController;
use App\Http\Controllers\Auth\DemoAuthController;

// ── Demo clone: password-based login ──────────────────────────────────────
Route::middleware(['web'])->group(function () {
    Route::get('/login', [DemoAuthController::class, 'showLoginForm'])->name('demo.login');
    Route::post('/login', [DemoAuthController::class, 'login'])->name('demo.login.attempt');
    Route::post('/logout', [DemoAuthController::class, 'logout'])->name('demo.logout');
    Route::post('/demo-login/{username}', [DemoAuthController::class, 'quickLogin'])->name('demo.login.quick');
});

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

    // Server-rendered QSpark hub (courses, learning paths, projects, achievements).
    Route::get('/qspark', [QSparkController::class, 'index'])->name('qspark.index');

    // Standalone Q SPARK demo (./QSPARK on :8001) embedded inside QUAI's shell
    // as an iframe. The wrapper view derives the role-matched deep-link
    // (/dev/{admin|faculty|student}) so the iframe auto-authenticates the user
    // into the matching QSPARK demo persona. An optional ?page= query forwards
    // a sanitized post-login path so the wrapper can land directly on a specific
    // QSPARK section (e.g. /admin/users, /faculty/courses).
    Route::get('/qspark-demo', function () {
        $user = auth()->user();
        $isAdmin = $user && method_exists($user, 'hasAnyRole') && $user->hasAnyRole(['Admin', 'Super Admin']);
        $isFaculty = $user && method_exists($user, 'hasAnyRole') && $user->hasAnyRole(['Faculty', 'Admin', 'Super Admin']);
        $qsparkRole = $isAdmin ? 'admin' : ($isFaculty ? 'faculty' : 'student');
        $qsparkBaseUrl = rtrim(config('quai.qspark_demo_url', 'http://127.0.0.1:8001'), '/');

        // Role-aware section catalogue: keys are stable section ids the home page
        // (or sidebar) can deep-link to; values are the QSPARK paths the iframe
        // should land on after auto-login.
        $sectionsByRole = [
            'admin' => [
                'dashboard'   => ['label' => 'لوحة الإدارة',  'path' => '/admin/dashboard'],
                'users'       => ['label' => 'المستخدمون',    'path' => '/admin/users'],
                'roles'       => ['label' => 'الأدوار',        'path' => '/admin/roles'],
                'permissions' => ['label' => 'الصلاحيات',     'path' => '/admin/permissions'],
            ],
            'faculty' => [
                'dashboard' => ['label' => 'لوحة هيئة التدريس', 'path' => '/faculty/dashboard'],
                'courses'   => ['label' => 'المقررات',          'path' => '/faculty/courses'],
                'students'  => ['label' => 'الطلاب',            'path' => '/faculty/students'],
                'reports'   => ['label' => 'التقارير',          'path' => '/faculty/reports'],
            ],
            'student' => [
                'dashboard'       => ['label' => 'لوحة الطالب',  'path' => '/dashboard-student'],
                'grades'          => ['label' => 'الدرجات',       'path' => '/dashboard-student/grades'],
                'courses'         => ['label' => 'المقررات',      'path' => '/dashboard-student/courses'],
                'recommendations' => ['label' => 'التوصيات',     'path' => '/dashboard-student/recommendations'],
                'chat'            => ['label' => 'المساعد الذكي', 'path' => '/dashboard-student/chat'],
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

        // Legacy alias — التقرير الذاتي now lives at the recommendations page.
        Route::get('/q-decision/self-report', fn () => redirect()->route('q-decision.recommendations'))
            ->name('q-decision.self-report');
    });
});
