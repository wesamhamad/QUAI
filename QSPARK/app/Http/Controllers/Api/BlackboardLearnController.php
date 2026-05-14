<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BlackboardLearnApiService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

/**
 * BlackboardLearnController
 * 
 * API Controller for exposing Blackboard Learn data to the frontend.
 * Provides endpoints for courses, grades, content, and assessments.
 * 
 * All endpoints require authentication and return JSON responses.
 */
class BlackboardLearnController extends Controller
{
    private BlackboardLearnApiService $blackboardApi;

    public function __construct(BlackboardLearnApiService $blackboardApi)
    {
        $this->blackboardApi = $blackboardApi;
    }

    /**
     * Get all courses the current user is enrolled in
     * 
     * GET /api/blackboard/courses
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getCourses(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            // Use employee_id for faculty/staff, uuid for students
            // Blackboard uses externalId format
            $userIdentifier = $user->employee_id ?? $user->uuid;
            $userId = "externalId:{$userIdentifier}";
            $courses = $this->blackboardApi->getUserCourses($userId);

            if ($courses === null) {
                return response()->json([
                    'success' => false,
                    'error' => 'Failed to fetch courses from Blackboard',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $courses['results'] ?? [],
                'paging' => $courses['paging'] ?? null,
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnController: Error fetching courses', [
                'error' => $e->getMessage(),
            ]);
            return response()->json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    /**
     * Get details of a specific course
     * 
     * GET /api/blackboard/courses/{courseId}
     *
     * @param string $courseId
     * @return JsonResponse
     */
    public function getCourse(string $courseId): JsonResponse
    {
        try {
            $course = $this->blackboardApi->getCourse($courseId);

            if ($course === null) {
                return response()->json(['success' => false, 'error' => 'Course not found'], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $course,
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnController: Error fetching course', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    /**
     * Get gradebook columns for a course
     * 
     * GET /api/blackboard/courses/{courseId}/gradebook
     *
     * @param string $courseId
     * @return JsonResponse
     */
    public function getGradebook(string $courseId): JsonResponse
    {
        try {
            $columns = $this->blackboardApi->getGradebookColumns($courseId);
            $categories = $this->blackboardApi->getGradebookCategories($courseId);

            if ($columns === null) {
                return response()->json(['success' => false, 'error' => 'Failed to fetch gradebook'], 500);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'columns' => $columns['results'] ?? [],
                    'categories' => $categories['results'] ?? [],
                ],
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnController: Error fetching gradebook', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    /**
     * Get grades for the current user in a course
     * 
     * GET /api/blackboard/courses/{courseId}/grades
     *
     * @param string $courseId
     * @return JsonResponse
     */
    public function getUserGrades(string $courseId): JsonResponse
    {
        try {
            $user = auth()->user();
            if (!$user) {
                return response()->json(['success' => false, 'error' => 'Unauthorized'], 401);
            }

            // Use employee_id for faculty/staff, uuid for students
            $userIdentifier = $user->employee_id ?? $user->uuid;
            $userId = "externalId:{$userIdentifier}";
            $grades = $this->blackboardApi->getUserCourseGrades($courseId, $userId);

            if ($grades === null) {
                return response()->json(['success' => false, 'error' => 'Failed to fetch grades'], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $grades['results'] ?? [],
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnController: Error fetching user grades', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    /**
     * Get course contents
     *
     * GET /api/blackboard/courses/{courseId}/contents
     *
     * @param string $courseId
     * @return JsonResponse
     */
    public function getCourseContents(string $courseId): JsonResponse
    {
        try {
            $contents = $this->blackboardApi->getCourseContents($courseId);

            if ($contents === null) {
                return response()->json(['success' => false, 'error' => 'Failed to fetch contents'], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $contents['results'] ?? [],
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnController: Error fetching course contents', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    /**
     * Get children of a content item (for folder expansion)
     *
     * GET /api/blackboard/course/{courseId}/content/{contentId}/children
     *
     * @param string $courseId
     * @param string $contentId
     * @return JsonResponse
     */
    public function getContentChildren(string $courseId, string $contentId): JsonResponse
    {
        try {
            $children = $this->blackboardApi->getContentChildren($courseId, $contentId);

            if ($children === null) {
                return response()->json(['success' => false, 'error' => 'Failed to fetch children'], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $children['results'] ?? [],
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnController: Error fetching content children', [
                'course_id' => $courseId,
                'content_id' => $contentId,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    /**
     * Get assessments (quizzes/tests) for a course
     *
     * GET /api/blackboard/courses/{courseId}/assessments
     *
     * @param string $courseId
     * @return JsonResponse
     */
    public function getCourseAssessments(string $courseId): JsonResponse
    {
        try {
            $assessments = $this->blackboardApi->getCourseAssessments($courseId);

            return response()->json([
                'success' => true,
                'data' => $assessments,
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnController: Error fetching assessments', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    /**
     * Get course announcements
     *
     * GET /api/blackboard/courses/{courseId}/announcements
     *
     * @param string $courseId
     * @return JsonResponse
     */
    public function getCourseAnnouncements(string $courseId): JsonResponse
    {
        try {
            $announcements = $this->blackboardApi->getCourseAnnouncements($courseId);

            if ($announcements === null) {
                return response()->json(['success' => false, 'error' => 'Failed to fetch announcements'], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $announcements['results'] ?? [],
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnController: Error fetching announcements', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    /**
     * Get comprehensive course data for quiz game integration
     *
     * GET /api/blackboard/courses/{courseId}/quiz-data
     *
     * @param string $courseId
     * @return JsonResponse
     */
    public function getCourseQuizData(string $courseId): JsonResponse
    {
        try {
            $user = auth()->user();
            // Use employee_id for faculty/staff, uuid for students
            $userIdentifier = $user ? ($user->employee_id ?? $user->uuid) : null;
            $userId = $userIdentifier ? "externalId:{$userIdentifier}" : null;

            $data = $this->blackboardApi->getCourseDataForQuiz($courseId, $userId);

            if (isset($data['error'])) {
                return response()->json(['success' => false, 'error' => $data['error']], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnController: Error fetching quiz data', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    /**
     * Get course memberships (students enrolled)
     *
     * GET /api/blackboard/courses/{courseId}/members
     *
     * @param Request $request
     * @param string $courseId
     * @return JsonResponse
     */
    public function getCourseMemberships(Request $request, string $courseId): JsonResponse
    {
        try {
            $params = [];

            // Filter by role if specified
            if ($request->has('role')) {
                $params['role'] = $request->input('role');
            }

            // Expand user data if requested
            if ($request->boolean('expand_users', false)) {
                $params['expand'] = 'user';
            }

            $members = $this->blackboardApi->getCourseMemberships($courseId, $params);

            if ($members === null) {
                return response()->json(['success' => false, 'error' => 'Failed to fetch members'], 500);
            }

            return response()->json([
                'success' => true,
                'data' => $members['results'] ?? [],
                'paging' => $members['paging'] ?? null,
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnController: Error fetching course members', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    /**
     * Clear cache for a specific course
     *
     * POST /api/blackboard/courses/{courseId}/clear-cache
     *
     * @param string $courseId
     * @return JsonResponse
     */
    public function clearCourseCache(string $courseId): JsonResponse
    {
        try {
            $this->blackboardApi->clearCourseCache($courseId);

            return response()->json([
                'success' => true,
                'message' => 'Cache cleared for course',
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnController: Error clearing cache', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['success' => false, 'error' => 'Internal server error'], 500);
        }
    }

    /**
     * Check Blackboard API connection status
     *
     * GET /api/blackboard/status
     *
     * @return JsonResponse
     */
    public function status(): JsonResponse
    {
        try {
            $token = $this->blackboardApi->getAccessToken();

            if (!$token) {
                return response()->json([
                    'success' => false,
                    'connected' => false,
                    'error' => 'Unable to obtain access token',
                ], 503);
            }

            // Try a simple API call to verify
            $courses = $this->blackboardApi->getCourses(['limit' => 1]);

            return response()->json([
                'success' => true,
                'connected' => true,
                'api_accessible' => $courses !== null,
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnController: Error checking status', [
                'error' => $e->getMessage(),
            ]);
            return response()->json([
                'success' => false,
                'connected' => false,
                'error' => 'Connection check failed',
            ], 503);
        }
    }
}

