<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — demo-clone build
|--------------------------------------------------------------------------
| Only QMentor endpoints remain; every other feature has been removed. The
| QMentor controller returns hard-coded dummy data — no external HTTP calls.
*/

// QMentor API endpoints — session middleware so the controller can read the
// authenticated user and, for faculty, the ?as=<student_id> override.
Route::prefix('qmentor')->middleware([
    \Illuminate\Cookie\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
])->group(function () {
    Route::get('/student/profile', [App\Http\Controllers\Api\QMentorApiController::class, 'profile']);
    Route::get('/student/courses', [App\Http\Controllers\Api\QMentorApiController::class, 'courses']);
    Route::get('/student/transactions', [App\Http\Controllers\Api\QMentorApiController::class, 'transactions']);
    Route::get('/student/plan', [App\Http\Controllers\Api\QMentorApiController::class, 'plan']);
    Route::get('/student/timetable', [App\Http\Controllers\Api\QMentorApiController::class, 'timetable']);
    Route::get('/student/exams', [App\Http\Controllers\Api\QMentorApiController::class, 'exams']);
    Route::get('/student/absences', [App\Http\Controllers\Api\QMentorApiController::class, 'absences']);
    Route::get('/student/grades', [App\Http\Controllers\Api\QMentorApiController::class, 'grades']);
    Route::get('/student/advisor', [App\Http\Controllers\Api\QMentorApiController::class, 'advisor']);
    Route::get('/student/rewards', [App\Http\Controllers\Api\QMentorApiController::class, 'rewards']);
    Route::get('/student/skills', [App\Http\Controllers\Api\QMentorApiController::class, 'skills']);
    Route::get('/academic/calendar', [App\Http\Controllers\Api\QMentorApiController::class, 'calendar']);
    Route::get('/academic/departments', [App\Http\Controllers\Api\QMentorApiController::class, 'departments']);
    Route::get('/academic/available-courses', [App\Http\Controllers\Api\QMentorApiController::class, 'availableCourses']);
    Route::get('/blackboard/announcements', [App\Http\Controllers\Api\QMentorApiController::class, 'announcements']);
    Route::get('/blackboard/courses/{courseId}/contents', [App\Http\Controllers\Api\QMentorApiController::class, 'courseContent']);
    Route::get('/blackboard/courses/{courseId}/grades', [App\Http\Controllers\Api\QMentorApiController::class, 'courseGrades']);
    Route::get('/students/search/{name}', [App\Http\Controllers\Api\QMentorApiController::class, 'searchStudents']);
    Route::get('/qu/events', [App\Http\Controllers\Api\QMentorApiController::class, 'quEvents']);

    // Standing & risk — warnings, major changes, halts, penalties
    Route::get('/student/warnings',      [App\Http\Controllers\Api\QMentorApiController::class, 'warnings']);
    Route::get('/student/major-changes', [App\Http\Controllers\Api\QMentorApiController::class, 'majorChanges']);
    Route::get('/student/halt-reasons',  [App\Http\Controllers\Api\QMentorApiController::class, 'haltReasons']);
    Route::get('/student/penalties',     [App\Http\Controllers\Api\QMentorApiController::class, 'penalties']);

    // Academic plan (v1) — full plan, summary, and current-student-major
    Route::get('/academic-plan/me',                        [App\Http\Controllers\Api\QMentorApiController::class, 'academicPlanForMe']);
    Route::get('/academic-plan/major/{majorNo}',           [App\Http\Controllers\Api\QMentorApiController::class, 'academicPlanByMajor']);
    Route::get('/academic-plan/major/{majorNo}/summary',   [App\Http\Controllers\Api\QMentorApiController::class, 'academicPlanSummary']);

    // Major-change planner — list eligible majors in same college, compare plans
    Route::get('/majors/my-faculty',                       [App\Http\Controllers\Api\QMentorApiController::class, 'majorsInFaculty']);
    Route::get('/majors/faculty/{facultyNo}',              [App\Http\Controllers\Api\QMentorApiController::class, 'majorsInFaculty']);
    Route::get('/majors/compare/{targetMajorNo}',          [App\Http\Controllers\Api\QMentorApiController::class, 'compareMajor']);
});

// v2 endpoints — enriched responses (also need session for Auth::user())
Route::prefix('v2')->middleware([
    \Illuminate\Cookie\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
])->group(function () {
    Route::get('/academic-advisor', [App\Http\Controllers\Api\QMentorApiController::class, 'academicAdvisor']);
});

// Smart-advisor (chatbot) — demo stub that returns canned conversations,
// history, and a streamed answer based on keyword matching.
Route::prefix('v1/smart-advisor')->middleware([
    \Illuminate\Cookie\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
])->group(function () {
    Route::get('/conversations', [App\Http\Controllers\Api\SmartAdvisorController::class, 'conversations']);
    Route::get('/conversations/{id}/history', [App\Http\Controllers\Api\SmartAdvisorController::class, 'history']);
    Route::delete('/conversations/{id}', [App\Http\Controllers\Api\SmartAdvisorController::class, 'archive']);
    Route::post('/escalate', [App\Http\Controllers\Api\SmartAdvisorController::class, 'escalate']);
    Route::post('/chat-stream', [App\Http\Controllers\Api\SmartAdvisorController::class, 'chatStream']);
});

// Health check — demo build is always "healthy" since no sidecars are required.
Route::get('/health', fn () => response()->json([
    'status'    => 'healthy',
    'service'   => 'QUAI Demo',
    'version'   => '1.0.0',
    'timestamp' => now()->toIso8601String(),
]));

