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

    // Faculty-only: list of students and tabbed per-student view.
    Route::get('/faculty/students', [FacultyController::class, 'index'])
        ->middleware('role:Faculty|Admin|Super Admin')
        ->name('faculty.students');

    Route::get('/faculty/students/{studentId}', [FacultyController::class, 'show'])
        ->middleware('role:Faculty|Admin|Super Admin')
        ->name('faculty.students.show');

    // Q Decision Support System — admin-only static dashboards.
    Route::middleware('role:Admin|Super Admin')->group(function () {
        Route::get('/q-decision/self-report', [QDecisionController::class, 'selfReport'])
            ->name('q-decision.self-report');
        Route::get('/q-decision/digital-advisor', [QDecisionController::class, 'digitalAdvisor'])
            ->name('q-decision.digital-advisor');
    });
});
