<?php

use App\Http\Controllers\PlayTimeController;
use App\Http\Controllers\Api\BlackboardLearnController;
use App\Http\Controllers\BlackboardConnectionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

// =========================================
// NOTE: Game API Routes are defined in routes/web.php
// because they require session-based authentication.
// See /api/game/* routes in web.php
// =========================================

// =========================================
// Existing API Routes
// =========================================
Route::post('/record-play-time', [PlayTimeController::class, 'recordPlayTime']);

// =========================================
// Blackboard Learn API Routes
// Direct integration with Blackboard Learn REST API
// =========================================
Route::prefix('blackboard')->group(function () {
    // Public status check (no auth required)
    Route::get('/status', [BlackboardLearnController::class, 'status']);
    Route::get('/connection', [BlackboardConnectionController::class, 'status']);

    // Content children - no auth needed (Blackboard API has its own auth)
    Route::get('/course/{courseId}/content/{contentId}/children', [BlackboardLearnController::class, 'getContentChildren']);

    // Authenticated routes (for API token users)
    Route::middleware(['auth:sanctum'])->group(function () {
        // Courses
        Route::get('/courses', [BlackboardLearnController::class, 'getCourses']);
        Route::get('/courses/{courseId}', [BlackboardLearnController::class, 'getCourse']);

        // Course content
        Route::get('/courses/{courseId}/contents', [BlackboardLearnController::class, 'getCourseContents']);
        Route::get('/courses/{courseId}/announcements', [BlackboardLearnController::class, 'getCourseAnnouncements']);
        Route::get('/courses/{courseId}/assessments', [BlackboardLearnController::class, 'getCourseAssessments']);

        // Gradebook
        Route::get('/courses/{courseId}/gradebook', [BlackboardLearnController::class, 'getGradebook']);
        Route::get('/courses/{courseId}/grades', [BlackboardLearnController::class, 'getUserGrades']);

        // Course memberships (for faculty)
        Route::get('/courses/{courseId}/members', [BlackboardLearnController::class, 'getCourseMemberships']);

        // Quiz game integration
        Route::get('/courses/{courseId}/quiz-data', [BlackboardLearnController::class, 'getCourseQuizData']);

        // Cache management
        Route::post('/courses/{courseId}/clear-cache', [BlackboardLearnController::class, 'clearCourseCache']);
    });
});

