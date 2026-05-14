<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

/**
 * BlackboardLearnApiService
 * 
 * Service class for direct Blackboard Learn REST API interactions.
 * Implements OAuth 2.0 Client Credentials flow for authentication.
 * 
 * API Documentation: https://developer.anthology.com/portal/displayApi/Learn
 * 
 * Endpoints covered:
 * - Courses (v3): List, Get, Search courses
 * - Users: Get user info, memberships
 * - Gradebook: Columns, Grades, Categories
 * - Content: Course contents and attachments
 * - Announcements: Course announcements
 */
class BlackboardLearnApiService
{
    private string $baseUrl;
    private string $apiPath;
    private string $tokenUrl;
    private string $clientId;
    private string $clientSecret;
    private int $timeout;
    private int $cacheTtl;

    public function __construct()
    {
        $this->baseUrl = config('services.blackboard.base_url', 'https://qu.blackboard.com');
        $this->apiPath = config('services.blackboard.api_path', '/learn/api/public');
        $this->tokenUrl = config('services.blackboard.token_url') 
            ?? $this->baseUrl . '/learn/api/public/v1/oauth2/token';
        $this->clientId = config('services.blackboard.client_id', '');
        $this->clientSecret = config('services.blackboard.client_secret', '');
        $this->timeout = (int) config('services.blackboard.timeout', 30);
        $this->cacheTtl = (int) config('services.blackboard.cache_ttl', 3600);
    }

    /**
     * Get OAuth 2.0 access token using client credentials flow
     * Token is cached for its lifetime minus a 5-minute buffer
     *
     * @return string|null
     */
    public function getAccessToken(): ?string
    {
        // Demo mode: never reach out to Blackboard.
        if (config('app.demo_mode')) {
            return null;
        }

        $cacheKey = 'blackboard_learn_token';

        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        Log::info('BlackboardLearnApiService: Requesting new access token');

        try {
            $response = Http::asForm()
                ->timeout($this->timeout)
                ->withBasicAuth($this->clientId, $this->clientSecret)
                ->post($this->tokenUrl, [
                    'grant_type' => 'client_credentials',
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $token = $data['access_token'] ?? null;
                $expiresIn = $data['expires_in'] ?? 3600;

                if ($token) {
                    // Cache for token lifetime minus 5 minutes buffer
                    $cacheDuration = max($expiresIn - 300, 60);
                    Cache::put($cacheKey, $token, now()->addSeconds($cacheDuration));
                    
                    Log::info('BlackboardLearnApiService: Token obtained successfully', [
                        'expires_in' => $expiresIn,
                        'cache_duration' => $cacheDuration
                    ]);
                    
                    return $token;
                }
            }

            Log::error('BlackboardLearnApiService: Token request failed', [
                'status' => $response->status(),
                'body' => substr($response->body(), 0, 500)
            ]);
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnApiService: Exception during token request', [
                'error' => $e->getMessage()
            ]);
        }

        return null;
    }

    /**
     * Make an authenticated API request to Blackboard Learn
     *
     * @param string $method HTTP method (GET, POST, PUT, DELETE, PATCH)
     * @param string $endpoint API endpoint (without base URL)
     * @param array $params Query parameters or body data
     * @param bool $useCache Whether to cache the response
     * @param int|null $cacheTtl Custom cache TTL (uses default if null)
     * @return array|null
     */
    public function request(
        string $method,
        string $endpoint,
        array $params = [],
        bool $useCache = true,
        ?int $cacheTtl = null,
        bool $isRetry = false
    ): ?array {
        $token = $this->getAccessToken();
        if (!$token) {
            Log::error('BlackboardLearnApiService: No access token available');
            return null;
        }

        $url = $this->baseUrl . $this->apiPath . $endpoint;
        $cacheKey = 'bb_learn_' . md5($url . json_encode($params));
        $ttl = $cacheTtl ?? $this->cacheTtl;

        // Return cached response if available
        if ($useCache && $method === 'GET' && Cache::has($cacheKey)) {
            Log::debug('BlackboardLearnApiService: Returning cached response', ['endpoint' => $endpoint]);
            return Cache::get($cacheKey);
        }

        try {
            $http = Http::timeout($this->timeout)
                ->withToken($token)
                ->withHeaders(['Accept' => 'application/json']);

            $response = match (strtoupper($method)) {
                'GET' => $http->get($url, $params),
                'POST' => $http->post($url, $params),
                'PUT' => $http->put($url, $params),
                'PATCH' => $http->patch($url, $params),
                'DELETE' => $http->delete($url, $params),
                default => throw new \InvalidArgumentException("Unsupported HTTP method: {$method}")
            };

            if ($response->successful()) {
                $data = $response->json();

                // Cache successful GET responses
                if ($useCache && $method === 'GET') {
                    Cache::put($cacheKey, $data, now()->addSeconds($ttl));
                }

                return $data;
            }

            // Handle 401 Unauthorized - token expired, refresh and retry once
            if ($response->status() === 401 && !$isRetry) {
                Log::info('BlackboardLearnApiService: Token expired, refreshing and retrying', ['endpoint' => $endpoint]);
                Cache::forget('bb_learn_access_token');
                return $this->request($method, $endpoint, $params, $useCache, $cacheTtl, true);
            }

            // Don't log 400 errors for attachment requests (expected for non-file content)
            if ($response->status() !== 400 || !str_contains($endpoint, 'attachments')) {
                Log::error('BlackboardLearnApiService: API request failed', [
                    'endpoint' => $endpoint,
                    'status' => $response->status(),
                    'body' => substr($response->body(), 0, 500)
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('BlackboardLearnApiService: Exception during API request', [
                'endpoint' => $endpoint,
                'error' => $e->getMessage()
            ]);
        }

        return null;
    }

    // =========================================================================
    // COURSES API (v3)
    // =========================================================================

    /**
     * Get all courses (with pagination support)
     * GET /learn/api/public/v3/courses
     *
     * @param array $params Query parameters (availability.available, created, fields, etc.)
     * @return array|null
     */
    public function getCourses(array $params = []): ?array
    {
        return $this->request('GET', '/v3/courses', $params);
    }

    /**
     * Get a specific course by ID
     * GET /learn/api/public/v3/courses/{courseId}
     *
     * @param string $courseId Course ID (can use externalId:COURSE_CODE format)
     * @param array $fields Optional fields to return
     * @return array|null
     */
    public function getCourse(string $courseId, array $fields = []): ?array
    {
        $params = !empty($fields) ? ['fields' => implode(',', $fields)] : [];
        return $this->request('GET', "/v3/courses/{$courseId}", $params);
    }

    /**
     * Search for courses
     * GET /learn/api/public/v3/courses
     *
     * @param string|null $searchText Search term
     * @param array $filters Additional filters
     * @return array|null
     */
    public function searchCourses(?string $searchText = null, array $filters = []): ?array
    {
        $params = $filters;
        if ($searchText) {
            $params['name'] = $searchText;
        }
        return $this->request('GET', '/v3/courses', $params);
    }

    // =========================================================================
    // COURSE MEMBERSHIPS / USERS API
    // =========================================================================

    /**
     * Get course memberships (enrolled users)
     * GET /learn/api/public/v1/courses/{courseId}/users
     *
     * @param string $courseId Course ID
     * @param array $params Query parameters (expand, fields, role, etc.)
     * @return array|null
     */
    public function getCourseMemberships(string $courseId, array $params = []): ?array
    {
        return $this->request('GET', "/v1/courses/{$courseId}/users", $params);
    }

    /**
     * Get a specific user's membership in a course
     * GET /learn/api/public/v1/courses/{courseId}/users/{userId}
     *
     * @param string $courseId Course ID
     * @param string $userId User ID
     * @return array|null
     */
    public function getCourseMembership(string $courseId, string $userId): ?array
    {
        return $this->request('GET', "/v1/courses/{$courseId}/users/{$userId}");
    }

    /**
     * Get courses for a specific user
     * GET /learn/api/public/v1/users/{userId}/courses
     *
     * @param string $userId User ID (can use externalId:STUDENT_ID format)
     * @param array $params Query parameters
     * @return array|null
     */
    public function getUserCourses(string $userId, array $params = []): ?array
    {
        return $this->request('GET', "/v1/users/{$userId}/courses", $params);
    }

    // =========================================================================
    // USERS API
    // =========================================================================

    /**
     * Get a specific user by ID (v1)
     * GET /learn/api/public/v1/users/{userId}
     *
     * @param string $userId User ID (can use externalId:EMPLOYEE_ID format)
     * @param array $fields Optional fields to return
     * @return array|null
     */
    public function getUser(string $userId, array $fields = []): ?array
    {
        $params = !empty($fields) ? ['fields' => implode(',', $fields)] : [];
        return $this->request('GET', "/v1/users/{$userId}", $params);
    }

    /**
     * Get a specific user by ID (v3) - includes more details like externalId
     * GET /learn/api/public/v3/users/{userId}
     *
     * @param string $userId User ID (can use externalId:EMPLOYEE_ID format)
     * @param array $fields Optional fields to return
     * @return array|null
     */
    public function getUserV3(string $userId, array $fields = []): ?array
    {
        $params = !empty($fields) ? ['fields' => implode(',', $fields)] : [];
        return $this->request('GET', "/v3/users/{$userId}", $params);
    }

    /**
     * Get instructor courses for a user
     * GET /learn/api/public/v1/users/{userId}/courses?courseRoleIds=Instructor
     *
     * @param string $userId User ID (can use externalId:EMPLOYEE_ID format)
     * @param array $params Additional query parameters
     * @return array|null
     */
    public function getInstructorCourses(string $userId, array $params = []): ?array
    {
        $params['courseRoleIds'] = 'Instructor';
        return $this->request('GET', "/v1/users/{$userId}/courses", $params);
    }

    /**
     * Search for users
     * GET /learn/api/public/v1/users
     *
     * @param array $params Search parameters (externalId, userName, email, etc.)
     * @return array|null
     */
    public function searchUsers(array $params = []): ?array
    {
        return $this->request('GET', '/v1/users', $params);
    }

    // =========================================================================
    // GRADEBOOK API (v2)
    // =========================================================================

    /**
     * Get gradebook columns for a course
     * GET /learn/api/public/v2/courses/{courseId}/gradebook/columns
     *
     * @param string $courseId Course ID
     * @param array $fields Optional fields to return
     * @return array|null
     */
    public function getGradebookColumns(string $courseId, array $fields = []): ?array
    {
        $params = !empty($fields) ? ['fields' => implode(',', $fields)] : [];
        return $this->request('GET', "/v2/courses/{$courseId}/gradebook/columns", $params);
    }

    /**
     * Get a specific gradebook column
     * GET /learn/api/public/v2/courses/{courseId}/gradebook/columns/{columnId}
     *
     * @param string $courseId Course ID
     * @param string $columnId Column ID
     * @return array|null
     */
    public function getGradebookColumn(string $courseId, string $columnId): ?array
    {
        return $this->request('GET', "/v2/courses/{$courseId}/gradebook/columns/{$columnId}");
    }

    /**
     * Get grades for all users on a column
     * GET /learn/api/public/v2/courses/{courseId}/gradebook/columns/{columnId}/users
     *
     * @param string $courseId Course ID
     * @param string $columnId Column ID
     * @param array $params Query parameters
     * @return array|null
     */
    public function getColumnGrades(string $courseId, string $columnId, array $params = []): ?array
    {
        return $this->request('GET', "/v2/courses/{$courseId}/gradebook/columns/{$columnId}/users", $params, true, 1800);
    }

    /**
     * Get grade for a specific user on a column
     * GET /learn/api/public/v2/courses/{courseId}/gradebook/columns/{columnId}/users/{userId}
     *
     * @param string $courseId Course ID
     * @param string $columnId Column ID
     * @param string $userId User ID
     * @return array|null
     */
    public function getUserGrade(string $courseId, string $columnId, string $userId): ?array
    {
        return $this->request('GET', "/v2/courses/{$courseId}/gradebook/columns/{$columnId}/users/{$userId}");
    }

    /**
     * Get the last changed grade indicator for a column
     * GET /learn/api/public/v2/courses/{courseId}/gradebook/columns/{columnId}/users/lastChanged
     *
     * @param string $courseId Course ID
     * @param string $columnId Column ID
     * @return array|null
     */
    public function getLastChangedGrade(string $courseId, string $columnId): ?array
    {
        return $this->request('GET', "/v2/courses/{$courseId}/gradebook/columns/{$columnId}/users/lastChanged", [], false);
    }

    /**
     * Get all grades for a specific user in a course
     * GET /learn/api/public/v2/courses/{courseId}/gradebook/users/{userId}
     *
     * @param string $courseId Course ID
     * @param string $userId User ID
     * @return array|null
     */
    public function getUserCourseGrades(string $courseId, string $userId): ?array
    {
        return $this->request('GET', "/v2/courses/{$courseId}/gradebook/users/{$userId}");
    }

    /**
     * Get gradebook categories for a course
     * GET /learn/api/public/v1/courses/{courseId}/gradebook/categories
     *
     * @param string $courseId Course ID
     * @return array|null
     */
    public function getGradebookCategories(string $courseId): ?array
    {
        return $this->request('GET', "/v1/courses/{$courseId}/gradebook/categories");
    }

    // =========================================================================
    // CONTENT API
    // =========================================================================

    /**
     * Get course contents (root level)
     * GET /learn/api/public/v1/courses/{courseId}/contents
     *
     * @param string $courseId Course ID
     * @param array $params Query parameters
     * @return array|null
     */
    public function getCourseContents(string $courseId, array $params = []): ?array
    {
        return $this->request('GET', "/v1/courses/{$courseId}/contents", $params);
    }

    /**
     * Get a specific content item
     * GET /learn/api/public/v1/courses/{courseId}/contents/{contentId}
     *
     * @param string $courseId Course ID
     * @param string $contentId Content ID
     * @return array|null
     */
    public function getContent(string $courseId, string $contentId): ?array
    {
        return $this->request('GET', "/v1/courses/{$courseId}/contents/{$contentId}");
    }

    /**
     * Get children of a content item
     * GET /learn/api/public/v1/courses/{courseId}/contents/{contentId}/children
     *
     * @param string $courseId Course ID
     * @param string $contentId Parent content ID
     * @return array|null
     */
    public function getContentChildren(string $courseId, string $contentId): ?array
    {
        return $this->request('GET', "/v1/courses/{$courseId}/contents/{$contentId}/children");
    }

    /**
     * Get attachments for a content item
     * GET /learn/api/public/v1/courses/{courseId}/contents/{contentId}/attachments
     *
     * @param string $courseId Course ID
     * @param string $contentId Content ID
     * @return array|null
     */
    public function getContentAttachments(string $courseId, string $contentId): ?array
    {
        return $this->request('GET', "/v1/courses/{$courseId}/contents/{$contentId}/attachments");
    }

    // =========================================================================
    // ANNOUNCEMENTS API
    // =========================================================================

    /**
     * Get course announcements
     * GET /learn/api/public/v1/courses/{courseId}/announcements
     *
     * @param string $courseId Course ID
     * @param array $params Query parameters
     * @return array|null
     */
    public function getCourseAnnouncements(string $courseId, array $params = []): ?array
    {
        return $this->request('GET', "/v1/courses/{$courseId}/announcements", $params, true, 1800);
    }

    /**
     * Get a specific announcement
     * GET /learn/api/public/v1/courses/{courseId}/announcements/{announcementId}
     *
     * @param string $courseId Course ID
     * @param string $announcementId Announcement ID
     * @return array|null
     */
    public function getAnnouncement(string $courseId, string $announcementId): ?array
    {
        return $this->request('GET', "/v1/courses/{$courseId}/announcements/{$announcementId}");
    }

    // =========================================================================
    // ASSESSMENT / QUIZ HELPER METHODS
    // =========================================================================

    /**
     * Get all assessments (tests/quizzes) for a course
     * Filters content items by type to find assessments
     *
     * @param string $courseId Course ID
     * @return array
     */
    public function getCourseAssessments(string $courseId): array
    {
        $contents = $this->getCourseContents($courseId);
        if (!$contents) {
            return [];
        }

        $assessments = [];
        $this->findAssessments($courseId, $contents['results'] ?? [], $assessments);

        return $assessments;
    }

    /**
     * Recursively find assessments in course content
     *
     * @param string $courseId
     * @param array $contents
     * @param array $assessments Reference to assessments array
     */
    private function findAssessments(string $courseId, array $contents, array &$assessments): void
    {
        foreach ($contents as $content) {
            $contentHandler = $content['contentHandler']['id'] ?? '';

            // Check for assessment types
            if (in_array($contentHandler, [
                'resource/x-bb-assessment',
                'resource/x-bb-asmt-test-link',
                'resource/x-bb-asmt-survey-link'
            ])) {
                $assessments[] = [
                    'id' => $content['id'],
                    'title' => $content['title'] ?? 'Untitled Assessment',
                    'description' => $content['description'] ?? '',
                    'contentHandler' => $contentHandler,
                    'availability' => $content['availability'] ?? null,
                    'created' => $content['created'] ?? null,
                ];
            }

            // Check children if this is a folder/container
            if (isset($content['hasChildren']) && $content['hasChildren']) {
                $children = $this->getContentChildren($courseId, $content['id']);
                if ($children && isset($children['results'])) {
                    $this->findAssessments($courseId, $children['results'], $assessments);
                }
            }
        }
    }

    /**
     * Get comprehensive course data including grades and assessments
     * Useful for quiz game integration
     *
     * @param string $courseId Course ID
     * @param string|null $userId Optional user ID for user-specific grades
     * @return array
     */
    public function getCourseDataForQuiz(string $courseId, ?string $userId = null): array
    {
        $course = $this->getCourse($courseId);
        if (!$course) {
            return ['error' => 'Course not found'];
        }

        $data = [
            'course' => $course,
            'gradebook_columns' => $this->getGradebookColumns($courseId) ?? [],
            'categories' => $this->getGradebookCategories($courseId) ?? [],
            'assessments' => $this->getCourseAssessments($courseId),
            'announcements' => $this->getCourseAnnouncements($courseId) ?? [],
        ];

        if ($userId) {
            $data['user_grades'] = $this->getUserCourseGrades($courseId, $userId) ?? [];
        }

        return $data;
    }

    /**
     * Clear cached data for a specific course
     *
     * @param string $courseId Course ID
     * @return void
     */
    public function clearCourseCache(string $courseId): void
    {
        $patterns = [
            "/v3/courses/{$courseId}",
            "/v1/courses/{$courseId}/users",
            "/v2/courses/{$courseId}/gradebook",
            "/v1/courses/{$courseId}/contents",
            "/v1/courses/{$courseId}/announcements",
        ];

        foreach ($patterns as $pattern) {
            $cacheKey = 'bb_learn_' . md5($this->baseUrl . $this->apiPath . $pattern . '[]');
            Cache::forget($cacheKey);
        }

        Log::info('BlackboardLearnApiService: Cache cleared for course', ['course_id' => $courseId]);
    }
}

