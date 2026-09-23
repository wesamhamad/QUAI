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

// ── Ported from the live build: risk engine, advisor caseload, cohort ops ──
// The same paths the +QSpark SPA calls on production; here they read the
// synthetic DemoCohort (see app/Support/DemoCohort.php). Session middleware so
// the controllers know who is asking; `auth` so a guest is a 401 body.
$qmentorSession = [
    \Illuminate\Cookie\Middleware\EncryptCookies::class,
    \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    \Illuminate\Session\Middleware\StartSession::class,
    'auth',
];

Route::prefix('qmentor')->middleware($qmentorSession)->group(function () {
    $risk = App\Http\Controllers\Api\QMentorRiskDemoController::class;
    $ops = App\Http\Controllers\Api\QMentorOpsDemoController::class;

    Route::get('/risk/me', [$risk, 'me']);
    Route::get('/risk/students/{studentId}', [$risk, 'student']);
    Route::post('/risk/students/{studentId}/override', [$risk, 'override']);
    Route::get('/risk/caseload', [$risk, 'caseload']);
    Route::get('/risk/cohort', [$risk, 'cohort']);
    Route::get('/risk/backtest', [$risk, 'backtest']);
    Route::get('/risk/alerts', [$risk, 'alerts']);
    Route::post('/risk/alerts/{id}/read', [$risk, 'markRead']);

    Route::get('/approvals', [$ops, 'approvals']);
    Route::post('/approvals/{id}/decide', [$ops, 'decide']);
    Route::get('/autonomy', [$ops, 'autonomy']);
    Route::get('/interventions', [$ops, 'myInterventions']);
    Route::get('/interventions/{studentId}', [$ops, 'interventionsFor']);
    Route::post('/interventions', [$ops, 'storeIntervention']);

    Route::get('/faculty/overview', [$ops, 'facultyOverview']);
    Route::get('/admin/usage', [$ops, 'adminUsage']);
    Route::get('/admin/usage.csv', [$ops, 'adminUsageExport']);

    Route::get('/cohort/progress', [$ops, 'progress']);
    Route::get('/cohort/coverage', [$ops, 'coverage']);
    Route::get('/cohort/stream', [$ops, 'stream']);
    Route::get('/cohort/preview', [$ops, 'preview']);
    Route::post('/cohort/start', [$ops, 'start']);
    Route::post('/cohort/stop', [$ops, 'stop']);
    Route::post('/cohort/start-scope', [$ops, 'startScope']);
    Route::post('/cohort/start-faculty', [$ops, 'startFaculty']);

    Route::get('/agent-core', [$ops, 'agentCore']);
    Route::get('/graph/events', [$ops, 'graphEvents']);
    Route::post('/graph/meeting', [$ops, 'graphMeeting']);
    Route::post('/graph/email', [$ops, 'graphEmail']);

    Route::get('/student/blackboard', [$ops, 'studentBlackboard']);
    Route::get('/student/recommendations', [$ops, 'studentRecommendations']);
    Route::get('/student/timeline', [$ops, 'studentTimeline']);
});

// الإرشاد الأكاديمي — the advisor's caseload (reads a record other than the caller's own).
Route::prefix('advisor')->middleware($qmentorSession)->group(function () {
    $adv = App\Http\Controllers\Api\QMentorAdvisorDemoController::class;
    Route::get('/me', [$adv, 'me']);
    Route::get('/advisees', [$adv, 'advisees']);
    Route::get('/students/{studentId}/plan', [$adv, 'studentPlan']);
    Route::get('/students/{studentId}/profile', [$adv, 'studentProfile']);
    Route::get('/students/{studentId}/predictions', [$adv, 'studentPredictions']);
    Route::get('/students/{studentId}/courses', [$adv, 'studentCourses']);
    Route::get('/students/{studentId}/transactions', [$adv, 'studentTransactions']);
    Route::get('/students/{studentId}/absences', [$adv, 'studentAbsences']);
    Route::get('/students/{studentId}/recommendations', [$adv, 'studentRecommendations']);
    Route::get('/students/{studentId}/timeline', [$adv, 'studentTimeline']);
    Route::get('/students/{studentId}/finals', [$adv, 'studentFinals']);
    Route::get('/students/{studentId}/timetable', [$adv, 'studentTimetable']);
    Route::get('/students/{studentId}/blackboard', [$adv, 'studentBlackboard']);
});

// «طلاب مقرراتي» — the taught roster.
Route::prefix('instructor')->middleware($qmentorSession)->group(function () {
    $adv = App\Http\Controllers\Api\QMentorAdvisorDemoController::class;
    Route::get('/students', [$adv, 'instructorStudents']);
    Route::get('/courses', [$adv, 'instructorCourses']);
});

// الرئيسية — the per-seat summary behind the home page.
Route::prefix('home')->middleware($qmentorSession)->group(function () {
    Route::get('/summary', [App\Http\Controllers\Api\QMentorHomeDemoController::class, 'summary']);
});

// Health check — demo build is always "healthy" since no sidecars are required.
Route::get('/health', fn () => response()->json([
    'status'    => 'healthy',
    'service'   => 'QUAI Demo',
    'version'   => '1.0.0',
    'timestamp' => now()->toIso8601String(),
]));

