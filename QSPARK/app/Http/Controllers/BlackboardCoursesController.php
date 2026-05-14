<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\Http\Controllers\BlackboardConnectionController;
use App\Http\Controllers\StudentDashboardController;

class BlackboardCoursesController extends Controller
{
    private $baseUrl;
    private $connection;

    public function __construct()
    {
        $this->baseUrl = $this->getApiBaseUrl() . '/api/v2';
        $this->connection = new BlackboardConnectionController();
    }

    private function getApiBaseUrl(): string
    {
        return match(config('app.env')) {
            'local' => env('QU_API_URL', 'http://127.0.0.1:8001'),
            'production' => 'https://api.qu.edu.sa',
            default => 'https://api-test.qu.edu.sa',
        };
    }

    private function getApiToken()
    {
        $token = session('qspark_token');
        Log::info('Getting API token', ['token_exists' => !empty($token)]);
        return $token;
    }

    public function showUserCourses(Request $request)
    {
        $token = $this->getApiToken();

        if (!$token) {
            Log::error('No API token available');
            return $this->fallbackToTimetable();
        }

        try {
            // Get student courses from new API
            $coursesResponse = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json'
            ])->get("{$this->baseUrl}/blackboard/courses");

            if (!$coursesResponse->successful() || !($coursesResponse->json()['success'] ?? false)) {
                Log::error('Failed to fetch courses from API', ['status' => $coursesResponse->status()]);
                return $this->fallbackToTimetable();
            }

            $courses = $coursesResponse->json()['data'] ?? [];
            Log::info('Fetched courses from API', ['count' => count($courses)]);

            $enrichedCourses = [];
            foreach ($courses as $course) {
                $courseId = $course['courseId'];
                
                // Get course details
                $courseDetails = $this->getCourseDetailsFromApi($courseId, $token);
                if (!$courseDetails) continue;

                // Get course attachments
                $attachments = $this->getCourseAttachmentsFromApi($courseId, $token);

                $enrichedCourses[] = [
                    'courseId' => $courseId,
                    'details' => $courseDetails,
                    'lastAccessed' => $course['lastAccessed'] ?? null,
                    'contents' => $attachments,
                    'instructor_name' => null,
                    'activity_types' => [],
                ];
            }

            if (empty($enrichedCourses)) {
                return $this->fallbackToTimetable();
            }

            return view('courses')->with('courses', $enrichedCourses);

        } catch (\Throwable $e) {
            Log::error('Exception in showUserCourses: ' . $e->getMessage());
            return $this->fallbackToTimetable();
        }
    }

    private function getCourseDetailsFromApi($courseId, $token)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json'
            ])->get("{$this->baseUrl}/blackboard/course/{$courseId}");

            if ($response->successful() && ($response->json()['success'] ?? false)) {
                return $response->json()['data'];
            }

            Log::error("Failed to get course details for {$courseId}", ['status' => $response->status()]);
        } catch (\Throwable $e) {
            Log::error("Exception getting course details for {$courseId}: " . $e->getMessage());
        }

        return null;
    }

    private function getCourseAttachmentsFromApi($courseId, $token)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json'
            ])->get("{$this->baseUrl}/blackboard/course/{$courseId}/attachments");

            if ($response->successful() && ($response->json()['success'] ?? false)) {
                dd($response->json());
                return $response->json()['data'] ?? [];
            }

            Log::error("Failed to get attachments for {$courseId}", ['status' => $response->status()]);
        } catch (\Throwable $e) {
            Log::error("Exception getting attachments for {$courseId}: " . $e->getMessage());
        }

        return [];
    }

    private function fallbackToTimetable()
    {
        $studentDashboard = new StudentDashboardController();
        $timetableResponse = $studentDashboard->getStudentTimeTable();

        $coursesFromTimeTable = [];
        if ($timetableResponse && isset($timetableResponse['data']['time-table'])) {
            foreach ($timetableResponse['data']['time-table'] as $class) {
                $coursesFromTimeTable[] = [
                    'details' => [
                        'name' => $class['course_name'],
                        'courseId' => $class['course_code'],
                    ],
                    'lastAccessed' => now()->format('Y-m-d H:i'),
                    'instructor_name' => $class['instructor_name'] ?? null,
                    'activity_types' => [$class['activity_desc']],
                    'contents' => [],
                ];
            }
        }

        Log::info('Using timetable fallback');
        return view('courses')->with('courses', $coursesFromTimeTable);
    }

    /**
     * Helper to get detailed course info
     */
    private function getCourseDetails($courseId, $token)
    {
        try {
            $response = Http::withToken($token)
                ->get("{$this->baseUrl}/courses/{$courseId}");

            if ($response->successful()) {
                return $response->json();
            } else {
                Log::error("Failed to get details for courseId: {$courseId}", [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error("Exception in getCourseDetails for courseId {$courseId}: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Helper to get instructor name for a course
     */
    private function getInstructorNameForCourse($courseId, $token)
    {
        try {
            $response = Http::withToken($token)
                ->get("{$this->baseUrl}/courses/{$courseId}/users");

            if ($response->successful()) {
                $users = $response->json()['results'] ?? [];
                foreach ($users as $user) {
                    if ($user['courseRoleId'] === 'Instructor') {
                        // Fetch full user data to get name
                        $instructorId = $user['userId'];
                        return $this->getUserFullName($instructorId, $token);
                    }
                }
            } else {
                Log::error("Failed to get users for courseId: {$courseId}", [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error("Exception in getInstructorNameForCourse for courseId {$courseId}: " . $e->getMessage());
        }

        return null; // Return null if no instructor found
    }

    /**
     * Helper to get user full name by userId
    */
    private function getUserFullName($userId, $token)
    {
        try {
            $response = Http::withToken($token)
                ->get("{$this->baseUrl}/users/{$userId}");

            if ($response->successful()) {
                $userData = $response->json();
                $nameData = $userData['name'] ?? [];

                // Combine given, middle, and family as full name
                $given = $nameData['given'] ?? '';
                $middle = $nameData['middle'] ?? '';
                $family = $nameData['family'] ?? '';

                // Trim to avoid extra spaces if any part is missing
                $fullName = trim("{$given} {$middle} {$family}");

                return $fullName;
            } else {
                Log::error("Failed to get user data for userId: {$userId}", [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error("Exception in getUserFullName for userId {$userId}: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Helper to get userId from externalId
     */
    private function getUserIdFromExternalId($externalId)
    {
        $token = $this->connection->getToken();

        if (!$token) {
            Log::error('Unable to get Blackboard token for userId lookup');
            return null;
        }

        try {
            $response = Http::withToken($token)
                ->get("{$this->baseUrl}/users?externalId={$externalId}");

            if ($response->successful()) {
                $results = $response->json()['results'] ?? [];
                if (count($results) > 0) {
                    $userId = $results[0]['id'] ?? null;
                    Log::info("Found Blackboard userId: {$userId} for externalId: {$externalId}");
                    return $userId;
                }
            } else {
                Log::error('Failed to get userId from externalId', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('Exception in getUserIdFromExternalId: ' . $e->getMessage());
        }

        return null;
    }


    private function getCourseContents($courseId, $token)
    {
        try {
            $response = Http::withToken($token)
                ->get("{$this->baseUrl}/courses/{$courseId}/contents");

            if ($response->successful()) {
                return $response->json()['results'] ?? [];
            } else {
                Log::error("Failed to get contents for courseId: {$courseId}", [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error("Exception in getCourseContents for courseId {$courseId}: " . $e->getMessage());
        }

        return [];
    }

    public function showStaticCourses()
    {
        try {
            $token = session('qspark_token');
            $cacheKey = 'student_courses_formatted_' . md5($token ?? 'guest');

            // Cache for 10 minutes - significantly speeds up page loads
            $formattedCourses = Cache::remember($cacheKey, 600, function () {
                Log::info('showStaticCourses: Fetching from API (not cached)');

                // Get courses from the new student/courses API endpoint
                $courses = $this->fetchStudentCourses();

                // If no courses from API, fallback to timetable
                if (empty($courses)) {
                    Log::info('No courses from API, trying timetable');
                    $studentDashboard = new StudentDashboardController();
                    $timetableResponse = $studentDashboard->getStudentTimeTable();

                    if ($timetableResponse && isset($timetableResponse['data']['time-table'])) {
                        $courses = $this->formatTimetableForCourses($timetableResponse['data']['time-table']);
                    }
                }

                // Format courses for the view
                return collect($courses)->map(function ($course, $index) {
                    return [
                        'courseId' => $course['courseId'] ?? $course['code'] ?? $course['course_code'] ?? 'N/A',
                        'details' => [
                            'name' => $course['name'] ?? $course['course_name'] ?? 'Unknown Course',
                            'courseId' => $course['courseId'] ?? $course['code'] ?? $course['course_code'] ?? 'N/A',
                        ],
                        'lastAccessed' => $course['lastAccessed'] ?? now()->format('Y-m-d H:i'),
                        'instructor_name' => $course['instructor'] ?? $course['instructor_name'] ?? null,
                        'activity_types' => [$course['activity_desc'] ?? 'نظري'],
                        'activity_desc' => $course['activity_desc'] ?? 'نظري',
                        'contents' => [],
                        'course_code' => $course['code'] ?? $course['course_code'] ?? 'N/A',
                        'course_name' => $course['name'] ?? $course['course_name'] ?? 'Unknown Course',
                        'section_seq' => $course['section'] ?? $course['section_seq'] ?? null,
                        'blackboard_id' => $course['blackboard_id'] ?? $course['external_id'] ?? null,
                        'blackboard_url' => $course['blackboard_url'] ?? null,
                        'numeric_id' => $course['id'] ?? $course['numeric_id'] ?? ($index + 1),
                        'external_id' => $course['external_id'] ?? null,
                    ];
                })->toArray();
            });

            return view('courses')->with('courses', $formattedCourses);

        } catch (\Exception $e) {
            Log::error('Error in showStaticCourses: ' . $e->getMessage());
            return view('courses')->with('courses', []);
        }
    }

    /**
     * Get courses as JSON for AJAX requests
     */
    public function getCoursesJson()
    {
        try {
            $token = session('qspark_token');
            $cacheKey = 'student_courses_formatted_' . md5($token ?? 'guest');

            $formattedCourses = Cache::remember($cacheKey, 600, function () {
                $courses = $this->fetchStudentCourses();

                if (empty($courses)) {
                    $studentDashboard = new StudentDashboardController();
                    $timetableResponse = $studentDashboard->getStudentTimeTable();

                    if ($timetableResponse && isset($timetableResponse['data']['time-table'])) {
                        $courses = $this->formatTimetableForCourses($timetableResponse['data']['time-table']);
                    }
                }

                return collect($courses)->map(function ($course, $index) {
                    return [
                        'courseId' => $course['courseId'] ?? $course['code'] ?? $course['course_code'] ?? 'N/A',
                        'details' => [
                            'name' => $course['name'] ?? $course['course_name'] ?? 'Unknown Course',
                            'courseId' => $course['courseId'] ?? $course['code'] ?? $course['course_code'] ?? 'N/A',
                        ],
                        'lastAccessed' => $course['lastAccessed'] ?? now()->format('Y-m-d H:i'),
                        'instructor_name' => $course['instructor'] ?? $course['instructor_name'] ?? null,
                        'activity_types' => [$course['activity_desc'] ?? 'نظري'],
                        'activity_desc' => $course['activity_desc'] ?? 'نظري',
                        'contents' => [],
                        'course_code' => $course['code'] ?? $course['course_code'] ?? 'N/A',
                        'course_name' => $course['name'] ?? $course['course_name'] ?? 'Unknown Course',
                        'section_seq' => $course['section'] ?? $course['section_seq'] ?? null,
                        'blackboard_id' => $course['blackboard_id'] ?? $course['external_id'] ?? null,
                        'blackboard_url' => $course['blackboard_url'] ?? null,
                        'numeric_id' => $course['id'] ?? $course['numeric_id'] ?? ($index + 1),
                        'external_id' => $course['external_id'] ?? null,
                    ];
                })->toArray();
            });

            return response()->json(['success' => true, 'courses' => $formattedCourses]);

        } catch (\Exception $e) {
            Log::error('Error in getCoursesJson: ' . $e->getMessage());
            return response()->json(['success' => false, 'courses' => []]);
        }
    }

    /**
     * Fetch student courses from the new API endpoint
     * This endpoint includes instructor names and external_id
     * Cached for 15 minutes to speed up page loads
     */
    private function fetchStudentCourses()
    {
        $token = session('qspark_token');
        if (!$token) {
            Log::warning('No token available for student courses API');
            return [];
        }

        $cacheKey = 'student_courses_raw_' . md5($token);

        return Cache::remember($cacheKey, 900, function () use ($token) {
            $data = null;
            try {
                Log::info('Fetching student courses from API (not cached)');

                $response = Http::timeout(15)->withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/json'
                ])->get($this->getApiBaseUrl() . '/api/v2/student/courses');

                if ($response->successful()) {
                    $data = $response->json();
                } else {
                    Log::error('Student courses API failed', ['status' => $response->status()]);
                }
            } catch (\Throwable $e) {
                Log::error('Student courses API exception', ['error' => $e->getMessage()]);
            }

            if ($data === null) {
                $data = \App\Support\StudentFixture::courses();
                if ($data !== null) {
                    \App\Support\StudentFixture::logServed('BlackboardCoursesController.studentCoursesRaw', '/api/v2/student/courses');
                }
            }

            if ($data === null) {
                return [];
            }

            $coursesData = $data['data'] ?? [];

            $courses = [];
            $seenCourses = [];
            $counter = 1;

            foreach ($coursesData as $course) {
                $courseKey = ($course['course_code'] ?? '') . '_' . ($course['section_seq'] ?? '');

                if (isset($seenCourses[$courseKey])) {
                    continue;
                }

                $seenCourses[$courseKey] = true;

                $courses[] = [
                    'id' => $counter++,
                    'code' => $course['course_code'] ?? 'N/A',
                    'course_code' => $course['course_code'] ?? 'N/A',
                    'name' => $course['course_name'] ?? 'Unknown Course',
                    'course_name' => $course['course_name'] ?? 'Unknown Course',
                    'section' => $course['section_seq'] ?? '',
                    'section_seq' => $course['section_seq'] ?? '',
                    'activity_desc' => $course['activity_desc'] ?? 'نظري',
                    'external_id' => $course['external_id'] ?? null,
                    'instructor' => $course['instructor_name'] ?? null,
                    'instructor_name' => $course['instructor_name'] ?? null,
                    'lastAccessed' => now()->format('Y-m-d H:i'),
                    'exam_start' => $course['exam_start'] ?? null,
                    'exam_end' => $course['exam_end'] ?? null,
                    'times' => $course['times'] ?? [],
                ];
            }

            return $courses;
        });
    }

    private function formatTimetableForCourses($timetable)
    {
        $courses = [];
        $seenCourses = [];

        foreach ($timetable as $class) {
            $courseKey = ($class['course_code'] ?? '') . '_' . ($class['section_seq'] ?? '');

            // Skip if we've already added this course
            if (isset($seenCourses[$courseKey])) {
                continue;
            }

            $seenCourses[$courseKey] = true;

            $courses[] = [
                'id' => count($courses) + 1,
                'code' => $class['course_code'] ?? 'N/A',
                'course_code' => $class['course_code'] ?? 'N/A',
                'name' => $class['course_name'] ?? 'Unknown Course',
                'course_name' => $class['course_name'] ?? 'Unknown Course',
                'section' => $class['section'] ?? '',
                'section_seq' => $class['section_seq'] ?? '',
                'activity_desc' => $class['activity_desc'] ?? 'نظري',
                'external_id' => $class['external_id'] ?? null,
                'instructor' => null, // Timetable doesn't include instructor
                'lastAccessed' => now()->format('Y-m-d H:i'),
            ];
        }

        return $courses;
    }
}
