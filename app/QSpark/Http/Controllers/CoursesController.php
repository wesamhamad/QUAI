<?php

namespace App\QSpark\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class CoursesController extends Controller
{
    private function getApiToken()
    {
        $token = session('qspark_token');
        Log::info('Getting API token', ['token_exists' => ! empty($token), 'token_length' => strlen($token ?? '')]);

        return $token;
    }

    private function getApiBaseUrl()
    {
        return match (config('app.env')) {
            'local' => env('QU_API_URL', 'http://127.0.0.1:8001'),
            'production' => 'https://api.qu.edu.sa',
            default => 'https://api-test.qu.edu.sa',
        };
    }

    private function fetchBlackboardCourses()
    {
        $token = $this->getApiToken();
        if (! $token) {
            Log::warning('No token available for Blackboard API');

            return [];
        }

        Log::info('Starting fetchBlackboardCourses', ['token_length' => strlen($token)]);

        // Cache for 5 minutes
        $cacheKey = 'blackboard_courses_'.md5($token);

        return Cache::remember($cacheKey, 300, function () use ($token) {
            try {
                Log::info('Fetching Blackboard courses with details', ['token_length' => strlen($token)]);

                $response = Http::timeout(30)->withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/json',
                ])->get($this->getApiBaseUrl().'/api/v2/blackboard/courses?details=true');

                Log::info('Blackboard courses API response', [
                    'status' => $response->status(),
                    'successful' => $response->successful(),
                ]);

                if (! $response->successful()) {
                    Log::warning('Blackboard courses API failed, continuing without Blackboard data', ['status' => $response->status()]);

                    return [];
                }

                $data = $response->json();
                Log::info('Blackboard API response data', ['success' => $data['success'] ?? false]);

                if (! ($data['success'] ?? false)) {
                    Log::warning('Blackboard API returned success=false', ['data' => $data]);

                    return [];
                }

                $courses = $data['data'] ?? [];
                Log::info('Found courses with details', ['count' => count($courses)]);

                if (empty($courses)) {
                    Log::warning('No courses found in API response');

                    return [];
                }

                // Process courses - they already have all details
                $detailedCourses = [];
                foreach ($courses as $course) {
                    // Each course already has all the details we need
                    $detailedCourse = $course;
                    $detailedCourse['blackboard_id'] = $course['id']; // The 'id' field is the blackboard_id like "_478329_1"
                    $detailedCourse['original_id'] = $course['id'];
                    $detailedCourses[] = $detailedCourse;

                    Log::info('Processed course with details', [
                        'courseId' => $course['courseId'] ?? 'unknown',
                        'blackboard_id' => $course['id'],
                        'name' => $course['name'] ?? 'unknown',
                    ]);
                }

                Log::info('Detailed courses processed', ['count' => count($detailedCourses)]);

                return $detailedCourses;

            } catch (\Exception $e) {
                Log::error('Exception in fetchBlackboardCourses', [
                    'error' => $e->getMessage(),
                    'line' => $e->getLine(),
                ]);

                return [];
            }
        });
    }

    private function fetchTimetable()
    {
        $token = $this->getApiToken();
        if (! $token) {
            Log::warning('No token available for Timetable API');

            return [];
        }

        // Cache for 1 hour
        $cacheKey = 'timetable_'.md5($token);

        return Cache::remember($cacheKey, 60, function () use ($token) {
            try {
                Log::info('Fetching timetable', ['token_length' => strlen($token)]);

                $response = Http::timeout(30)->withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/json',
                ])->get($this->getApiBaseUrl().'/api/v2/time-table');

                Log::info('Timetable API Response', [
                    'status' => $response->status(),
                    'successful' => $response->successful(),
                    'body' => $response->body(),
                ]);

                if (! $response->successful()) {
                    Log::error('Timetable API failed', ['status' => $response->status()]);

                    return [];
                }

                $data = $response->json();
                Log::info('Timetable API Data', ['data' => $data]);

                // Extract timetable from the correct structure
                $timetable = [];
                if ($data['success'] && isset($data['data']['time-table'])) {
                    $timetable = $data['data']['time-table'];
                }

                Log::info('Timetable extracted', ['count' => count($timetable)]);

                return $timetable;
            } catch (\Exception $e) {
                Log::error('Failed to fetch timetable', ['error' => $e->getMessage()]);

                return [];
            }
        });
    }

    private function fetchCourseInstructors()
    {
        $token = $this->getApiToken();
        if (! $token) {
            Log::warning('No token available for Course Instructors API');

            return [];
        }

        // Cache for 10 minutes
        $cacheKey = 'course_instructors_'.md5($token);

        return Cache::remember($cacheKey, 600, function () use ($token) {
            try {
                Log::info('Fetching course instructors', ['token_length' => strlen($token)]);

                $response = Http::timeout(30)->withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/json',
                ])->get($this->getApiBaseUrl().'/api/v2/course_instructors');

                Log::info('Course Instructors API Response', [
                    'status' => $response->status(),
                    'successful' => $response->successful(),
                    'body' => $response->body(),
                ]);

                if (! $response->successful()) {
                    Log::error('Course Instructors API failed', ['status' => $response->status()]);

                    return [];
                }

                $data = $response->json();
                Log::info('Course Instructors API Data', ['data' => $data]);

                $instructors = $data['success'] ? ($data['data'] ?? []) : [];
                Log::info('Course Instructors extracted', ['count' => count($instructors)]);

                return $instructors;
            } catch (\Exception $e) {
                Log::error('Failed to fetch course instructors', ['error' => $e->getMessage()]);

                return [];
            }
        });
    }

    public function getMatchedCourses()
    {
        $cacheKey = 'matched_courses_'.md5(session('qspark_token', ''));

        return Cache::remember($cacheKey, 600, function () {
            Log::info('Starting course matching process');

            // Fetch data from all sources
            $blackboardCourses = $this->fetchBlackboardCourses();
            $timetableClasses = $this->fetchTimetable();
            $instructors = $this->fetchCourseInstructors();

            Log::info('Data fetching completed', [
                'blackboard_count' => count($blackboardCourses),
                'timetable_count' => count($timetableClasses),
                'instructors_count' => count($instructors),
            ]);

            // Debug: Log sample data
            if (! empty($blackboardCourses)) {
                Log::info('Sample Blackboard course', [
                    'first_course' => $blackboardCourses[0],
                ]);
            }

            if (! empty($timetableClasses)) {
                Log::info('Sample timetable class', [
                    'first_class' => $timetableClasses[0],
                ]);
            }

            // If we have Blackboard courses, use them as the primary source
            if (! empty($blackboardCourses)) {
                $matchedCourses = [];

                foreach ($blackboardCourses as $bbCourse) {
                    // Extract course code from courseId (e.g., "1_2_465_ACCT241_109" -> "ACCT241")
                    $courseId = $bbCourse['courseId'] ?? '';
                    $courseCode = $this->extractCourseCode($courseId);

                    Log::info('Processing Blackboard course', [
                        'courseId' => $courseId,
                        'extracted_code' => $courseCode,
                        'blackboard_id' => $bbCourse['blackboard_id'] ?? 'missing',
                    ]);

                    if ($courseCode) {
                        $matchedCourse = [
                            'id' => count($matchedCourses) + 1,
                            'code' => $courseCode,
                            'name' => $bbCourse['name'] ?? $courseCode,
                            'name_ar' => $bbCourse['name_ar'] ?? $bbCourse['name'] ?? $courseCode,
                            'name_en' => $bbCourse['name_en'] ?? $courseCode,
                            'section' => $bbCourse['section'] ?? '',
                            'blackboard_id' => $bbCourse['blackboard_id'] ?? $bbCourse['id'],
                            'blackboard_url' => $bbCourse['externalAccessUrl'] ?? null,
                            'instructor' => 'Unknown',
                            'schedule' => [],
                            'source' => 'blackboard',
                        ];

                        // Try to match with timetable for additional info
                        $timetableMatch = collect($timetableClasses)->first(function ($class) use ($courseCode) {
                            return strpos($class['course_code'] ?? '', $courseCode) !== false;
                        });

                        if ($timetableMatch) {
                            $matchedCourse['instructor'] = $timetableMatch['instructor'] ?? 'Unknown';
                            $matchedCourse['schedule'] = $timetableMatch['schedule'] ?? [];
                            $matchedCourse['source'] = 'blackboard+timetable';
                        }

                        $matchedCourses[] = $matchedCourse;
                    }
                }

                Log::info('Course matching completed', ['total_matched' => count($matchedCourses)]);

                return $matchedCourses;
            }

            // Fallback to timetable-only courses if no Blackboard courses
            Log::info('No Blackboard courses found, using timetable only');

            return $this->processTimetableOnlyCourses($timetableClasses);
        });
    }

    private function extractCourseCode($courseId)
    {
        // Extract course code from courseId like "1_2_465_ACCT241_109"
        $parts = explode('_', $courseId);
        if (count($parts) >= 4) {
            return $parts[3]; // ACCT241
        }

        return null;
    }

    private function processTimetableOnlyCourses($timetableClasses)
    {
        $matchedCourses = [];

        foreach ($timetableClasses as $class) {
            $courseCode = $class['course_code'] ?? '';
            $sectionSeq = $class['section_seq'] ?? '';
            $courseNo = $class['course_no'] ?? null;

            $matchedCourses[] = [
                'id' => count($matchedCourses) + 1,
                'code' => $courseCode,
                'name' => $class['course_name'] ?? $courseCode,
                'name_ar' => $class['course_name_ar'] ?? $class['course_name'] ?? $courseCode,
                'name_en' => $class['course_name_en'] ?? $courseCode,
                'section' => $sectionSeq,
                'blackboard_id' => null,
                'blackboard_url' => null,
                'instructor' => $class['instructor'] ?? 'Unknown',
                'schedule' => $class['schedule'] ?? [],
                'source' => 'timetable',
            ];
        }

        Log::info('Timetable-only courses processed', ['total_courses' => count($matchedCourses)]);

        return $matchedCourses;
    }

    /**
     * Fetch student courses from the new API endpoint for course lookup
     */
    private function fetchStudentCoursesForLookup()
    {
        $token = session('qspark_token');
        if (! $token) {
            Log::warning('No token available for student courses API');

            return [];
        }

        try {
            $data = null;
            // Demo mode: skip the live HTTP call entirely and serve the fixture
            // directly so the production logs aren't littered with 401s from
            // api.qu.edu.sa (the demo's qspark_token is a placeholder).
            if (config('app.demo_mode')) {
                $data = \App\QSpark\Support\StudentFixture::courses();
                if ($data !== null) {
                    \App\QSpark\Support\StudentFixture::logServed('CoursesController.fetchStudentCoursesForLookup[demo]', '/api/v2/student/courses');
                }
            } else {
                Log::info('Fetching student courses from API for lookup');

                try {
                    $response = Http::timeout(30)->withHeaders([
                        'Authorization' => "Bearer {$token}",
                        'Accept' => 'application/json',
                    ])->get($this->getApiBaseUrl().'/api/v2/student/courses');

                    if ($response->successful()) {
                        $data = $response->json();
                    } else {
                        Log::error('Student courses API failed', ['status' => $response->status()]);
                    }
                } catch (\Throwable $e) {
                    Log::error('Student courses API exception', ['error' => $e->getMessage()]);
                }

                if ($data === null) {
                    $data = \App\QSpark\Support\StudentFixture::courses();
                    if ($data !== null) {
                        \App\QSpark\Support\StudentFixture::logServed('CoursesController.fetchStudentCoursesForLookup', '/api/v2/student/courses');
                    }
                }
            }

            if ($data === null) {
                return [];
            }

            $coursesData = $data['data'] ?? [];

            // Log raw API response to debug external_id
            Log::info('fetchStudentCoursesForLookup - raw API response', [
                'courses_count' => count($coursesData),
                'first_course_keys' => ! empty($coursesData[0]) ? array_keys($coursesData[0]) : [],
                'first_course_external_id' => $coursesData[0]['external_id'] ?? 'NOT_FOUND',
            ]);

            // Format courses for lookup
            $courses = [];
            foreach ($coursesData as $index => $course) {
                $courses[] = [
                    'numeric_id' => $index + 1,
                    'id' => $index + 1,
                    'code' => $course['course_code'] ?? 'N/A',
                    'course_code' => $course['course_code'] ?? 'N/A',
                    'name' => $course['course_name'] ?? 'Unknown Course',
                    'course_name' => $course['course_name'] ?? 'Unknown Course',
                    'section' => $course['section_seq'] ?? '',
                    'section_seq' => $course['section_seq'] ?? '',
                    'activity_desc' => $course['activity_desc'] ?? 'نظري',
                    'external_id' => $course['external_id'] ?? null,
                    'blackboard_id' => $course['external_id'] ?? null, // Use external_id as blackboard_id
                    'instructor' => $course['instructor_name'] ?? null,
                    'instructor_name' => $course['instructor_name'] ?? null,
                ];
            }

            return $courses;

        } catch (\Exception $e) {
            Log::error('Error fetching student courses for lookup', ['error' => $e->getMessage()]);

            return [];
        }
    }

    private function findCourseByIdOrCode($id)
    {
        // Use the student courses API directly (more reliable)
        $courses = $this->fetchStudentCoursesForLookup();

        Log::info('Searching for course', ['id' => $id, 'total_courses' => count($courses)]);

        // If ID is numeric, find by numeric_id first
        if (is_numeric($id)) {
            $numericId = (int) $id;
            foreach ($courses as $index => $course) {
                // Use array index + 1 as numeric_id if not set
                $courseNumericId = $course['numeric_id'] ?? ($index + 1);

                if ($courseNumericId === $numericId) {
                    Log::info('Found course by numeric ID', [
                        'numeric_id' => $numericId,
                        'course_code' => $course['code'] ?? 'N/A', // Fix: use 'code' not 'course_code'
                    ]);

                    return $course;
                }
            }

            // Also try course_no as fallback
            $numericIdStr = (string) $id;
            foreach ($courses as $course) {
                if (isset($course['course_no']) && $course['course_no'] === $numericIdStr) {
                    Log::info('Found course by course_no', ['course_no' => $numericIdStr]);

                    return $course;
                }
            }
        }

        // Fallback to string matching
        foreach ($courses as $course) {
            if (isset($course['code']) && $course['code'] === $id) { // Fix: use 'code'
                Log::info('Found course by course_code', ['course_code' => $id]);

                return $course;
            }
            if (isset($course['courseId']) && $course['courseId'] === $id) {
                Log::info('Found course by courseId', ['courseId' => $id]);

                return $course;
            }
        }

        Log::warning('Course not found', ['id' => $id]);

        return null;
    }

    private function fetchCourseAttachments($courseId)
    {
        $token = $this->getApiToken();
        if (! $token) {
            Log::warning('No token available for Course Attachments API');

            return [];
        }

        $blackboardId = $courseId;
        $cacheKey = 'course_attachments_'.$blackboardId.'_'.md5($token);

        return Cache::remember($cacheKey, 1800, function () use ($token, $blackboardId) {
            try {
                $endpoint = $this->getApiBaseUrl()."/api/v2/blackboard/course/{$blackboardId}/attachments";

                $response = Http::timeout(30)->withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/json',
                ])->get($endpoint);

                if (! $response->successful()) {
                    Log::error('Course Attachments API failed', [
                        'blackboardId' => $blackboardId,
                        'status' => $response->status(),
                    ]);

                    return [];
                }

                $data = $response->json();

                if (! ($data['success'] ?? false)) {
                    Log::warning('Blackboard attachments API returned success=false', [
                        'data' => $data,
                    ]);

                    return [];
                }

                $attachments = $data['data'] ?? [];

                // Transform API attachments to match the expected format
                $processedFiles = [];
                foreach ($attachments as $attachment) {
                    $processedFiles[] = [
                        'contentTitle' => $attachment['contentTitle'] ?? 'Unknown Content',
                        'fileName' => $attachment['fileName'] ?? 'unknown.pdf',
                        'downloadUrl' => $attachment['apiDownloadUrl'] ?? null,
                        'generateQuizUrl' => $attachment['generateQuizUrl'] ?? null,
                        'attachmentId' => $attachment['attachmentId'] ?? null,
                        'contentId' => $attachment['contentId'] ?? null,
                        'courseId' => $attachment['courseId'] ?? null,
                    ];
                }

                Log::info('Course attachments processed', [
                    'blackboardId' => $blackboardId,
                    'count' => count($processedFiles),
                    'files' => $processedFiles,
                ]);

                return $processedFiles;

            } catch (\Exception $e) {
                Log::error('Failed to fetch course attachments', [
                    'blackboardId' => $blackboardId,
                    'error' => $e->getMessage(),
                ]);

                return [];
            }
        });
    }

    public function show($courseId, Request $request)
    {
        $token = session('qspark_token');

        if (! $token) {
            return redirect()->route('qspark.login');
        }

        try {
            $course = $this->findCourseByIdOrCode($courseId);

            if (! $course) {
                abort(404, 'Course not found');
            }

            $code = $course['code'] ?? $course['course_code'] ?? 'Unknown';
            $externalId = $course['external_id'] ?? null;
            $page = max(1, (int) $request->get('page', 1));

            // Return view immediately with empty files - AJAX will load them
            // This makes the page appear instantly
            return view('qspark::courses.show', [
                'code' => $code,
                'id' => $courseId,
                'courseId' => $courseId,
                'blackboardCourseId' => $externalId,
                'externalId' => $externalId,
                'files' => [],  // Empty - will be loaded via AJAX
                'hasBlackboardAccess' => ! empty($externalId),
                'currentPage' => $page,
                'totalPages' => 1,
                'perPage' => 6,
                'totalFiles' => 0,
                'loadViaAjax' => true,  // Flag for view to use AJAX loading
            ]);

        } catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Error showing course: '.$e->getMessage());
            abort(500, 'Error loading course');
        }
    }

    /**
     * Fetch contents tree from qu-api /contents/v2 (already resolves files).
     * Returns a flat list of nodes; each node carries its own `files` array.
     */
    private function fetchCourseContentsList($externalId)
    {
        $cacheKey = 'course_contents_list_v2_'.md5($externalId);

        if ($cached = Cache::get($cacheKey)) {
            return $cached;
        }

        $contents = [];
        try {
            $token = session('qspark_token');
            if ($token) {
                $response = Http::timeout(30)->withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/json',
                ])->get($this->getApiBaseUrl()."/api/v2/blackboard/courses/{$externalId}/contents/v2");

                if ($response->successful()) {
                    $payload = $response->json();
                    $tree = $payload['data'] ?? [];
                    $contents = $this->flattenV2Tree($tree);
                } else {
                    Log::warning('qu-api /contents/v2 failed', [
                        'external_id' => $externalId,
                        'status' => $response->status(),
                    ]);
                }
            }
        } catch (\Throwable $e) {
            Log::error('Error fetching contents list', ['error' => $e->getMessage()]);
        }

        if (! empty($contents)) {
            Cache::put($cacheKey, $contents, 300);

            return $contents;
        }

        // Fall back to fixture so the course page renders something even when
        // qu-api or its Blackboard integration is down.
        $fallback = \App\QSpark\Support\StudentFixture::blackboardContents($externalId);
        if ($fallback !== null) {
            \App\QSpark\Support\StudentFixture::logServed('fetchCourseContentsList', "/blackboard/courses/{$externalId}/contents/v2");

            return $this->flattenFixtureContents($fallback);
        }

        return [];
    }

    /**
     * Walk the v2 contents tree and return a flat list of nodes with their
     * pre-resolved `files` array attached.
     */
    private function flattenV2Tree(array $tree, array &$out = []): array
    {
        foreach ($tree as $node) {
            if (! is_array($node)) {
                continue;
            }
            $out[] = $node;
            if (! empty($node['children']) && is_array($node['children'])) {
                $this->flattenV2Tree($node['children'], $out);
            }
        }

        return $out;
    }

    /**
     * Flatten the fixture's nested {data: [{children: [...]}]} shape into a
     * flat list matching the qu-api v2 response shape.
     */
    private function flattenFixtureContents($payload): array
    {
        $rows = is_array($payload) ? ($payload['data'] ?? $payload['results'] ?? $payload) : [];
        if (! is_array($rows)) {
            return [];
        }

        $flat = [];
        $walk = function ($items) use (&$walk, &$flat) {
            foreach ((array) $items as $item) {
                if (! is_array($item)) {
                    continue;
                }
                $children = $item['children'] ?? null;
                $copy = $item;
                unset($copy['children']);
                $copy['hasChildren'] = ! empty($children);
                $flat[] = $copy;
                if (! empty($children)) {
                    $walk($children);
                }
            }
        };
        $walk($rows);

        return $flat;
    }

    /**
     * Build per-file UI rows from contents already carrying a `files` array
     * (qu-api /contents/v2 attaches Ultra-body extracts and classic attachments).
     */
    private function fetchAttachmentsForContents($externalId, $contents)
    {
        $files = [];

        foreach ($contents as $content) {
            $contentId = $content['id'] ?? null;
            $contentTitle = $content['title'] ?? 'Untitled';

            if (! $contentId) {
                continue;
            }

            // v2 endpoint already attaches resolved files per node (Ultra body
            // extracts + classic /attachments leaves). No second hop needed.
            foreach ((array) ($content['files'] ?? []) as $file) {
                $attachmentId = $file['attachmentId'] ?? null;
                $isUltra = ($file['source'] ?? null) === 'ultra-body';
                $fileName = $file['name'] ?? 'Unknown';
                $apiBase = $this->getApiBaseUrl();

                if ($attachmentId) {
                    // Classic attachments — keep existing flow.
                    $generateQuizUrl = $apiBase."/api/v2/blackboard/courses/{$externalId}/contents/{$contentId}/attachments/{$attachmentId}/generate-quiz";
                    $downloadUrl = route('qspark.courses.blackboard.download', [
                        'externalId' => $externalId,
                        'contentId' => $contentId,
                        'attachmentId' => $attachmentId,
                    ]);
                } elseif ($isUltra) {
                    // Ultra-body file — use qu-api's ultra-files endpoint, keyed by md5(name).
                    $fileHash = md5($fileName);
                    $generateQuizUrl = $apiBase."/api/v2/blackboard/courses/{$externalId}/contents/{$contentId}/ultra-files/{$fileHash}/generate-quiz";
                    $downloadUrl = $file['downloadUrl'] ?? null;
                } else {
                    $generateQuizUrl = null;
                    $downloadUrl = $file['downloadUrl'] ?? null;
                }

                $files[] = [
                    'contentTitle' => $contentTitle,
                    'fileName' => $fileName,
                    'downloadUrl' => $downloadUrl,
                    'generateQuizUrl' => $generateQuizUrl,
                    'contentId' => $contentId,
                    'attachmentId' => $attachmentId,
                    'size' => $file['size'] ?? null,
                    'mimeType' => $file['mimeType'] ?? null,
                ];
            }
        }

        return $files;
    }

    /**
     * Get course files as JSON for AJAX requests
     */
    public function getCourseFilesJson($courseId, Request $request)
    {
        $token = session('qspark_token');
        if (! $token) {
            return response()->json(['success' => false, 'files' => [], 'message' => 'Not authenticated']);
        }

        try {
            $course = $this->findCourseByIdOrCode($courseId);
            if (! $course) {
                return response()->json(['success' => false, 'files' => [], 'message' => 'Course not found']);
            }

            $externalId = $course['external_id'] ?? null;
            $code = $course['code'] ?? $course['course_code'] ?? 'Unknown';

            // If external_id is missing, try to get it from time-table API
            if (! $externalId) {
                $externalId = $this->getExternalIdFromTimetable($code, $token);
            }

            Log::info('getCourseFilesJson - course data', [
                'courseId' => $courseId,
                'code' => $code,
                'external_id' => $externalId,
                'course_keys' => array_keys($course),
            ]);

            $perPage = 6;
            $page = max(1, (int) $request->get('page', 1));

            $files = [];
            $totalFiles = 0;
            $totalPages = 1;

            if ($externalId) {
                $contents = $this->fetchCourseContentsList($externalId);

                // Keep only nodes that actually carry files. Containers
                // (folder/lesson/document without files) are skipped so
                // pagination always lands on real downloadables.
                $fileBearing = array_values(array_filter($contents, function ($node) {
                    return ! empty($node['files']);
                }));

                $totalContents = count($fileBearing);
                $offset = ($page - 1) * $perPage;
                $paginatedContents = array_slice($fileBearing, $offset, $perPage);

                $files = $this->fetchAttachmentsForContents($externalId, $paginatedContents);
                $totalFiles = $totalContents;
                $totalPages = max(1, (int) ceil($totalContents / $perPage));
            }

            Log::info('getCourseFilesJson response', [
                'files_count' => count($files),
                'code' => $code,
                'first_file' => $files[0] ?? null,
                'has_generateQuizUrl' => isset($files[0]['generateQuizUrl']),
            ]);

            return response()->json([
                'success' => true,
                'files' => $files,
                'currentPage' => $page,
                'totalPages' => $totalPages,
                'totalFiles' => $totalFiles,
                'perPage' => $perPage,
                'code' => $code,
            ]);

        } catch (\Exception $e) {
            Log::error('Error in getCourseFilesJson: '.$e->getMessage());

            return response()->json(['success' => false, 'files' => [], 'message' => 'Error loading files']);
        }
    }

    /**
     * Flatten nested content structure (handles children recursively)
     */
    private function flattenContents($contents, &$result = [])
    {
        foreach ($contents as $content) {
            $result[] = $content;

            // Recursively process children if they exist
            if (isset($content['children']) && is_array($content['children'])) {
                $this->flattenContents($content['children'], $result);
            }
        }

        return $result;
    }

    /**
     * Fetch course contents from new Blackboard API
     * Flow:
     * 1. GET /api/v2/blackboard/courses/{external_id}/contents -> get content IDs
     * 2. For each content: GET /api/v2/blackboard/courses/{external_id}/contents/{contentId}/attachments -> get attachment IDs
     * 3. Build download URL: /api/v2/blackboard/courses/{external_id}/contents/{contentId}/attachments/{attachmentId}/download
     */
    private function fetchCourseContents($externalId)
    {
        $token = session('qspark_token');
        if (! $token) {
            Log::warning('No token available for course contents API');

            return [];
        }

        try {
            Log::info('Step 1: Fetching course contents list', ['external_id' => $externalId]);

            // Step 1: Get all contents for the course
            $contentsResponse = Http::timeout(30)->withHeaders([
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json',
            ])->get($this->getApiBaseUrl()."/api/v2/blackboard/courses/{$externalId}/contents/v2");

            if (! $contentsResponse->successful()) {
                Log::error('Course contents API failed', [
                    'status' => $contentsResponse->status(),
                    'external_id' => $externalId,
                    'body' => $contentsResponse->body(),
                ]);

                return [];
            }

            $contentsData = $contentsResponse->json();
            $contents = $contentsData['data'] ?? [];

            Log::info('Course contents received', [
                'external_id' => $externalId,
                'contents_count' => count($contents),
                'full_response' => $contentsData,
            ]);

            $files = [];

            // Step 2: Process all contents (including nested children)
            $allContents = $this->flattenContents($contents);

            Log::info('Flattened contents', [
                'external_id' => $externalId,
                'total_contents' => count($allContents),
            ]);

            // Step 3: For each content, fetch its attachments
            foreach ($allContents as $content) {
                $contentId = $content['id'] ?? null;
                $contentTitle = $content['title'] ?? 'Untitled';

                if (! $contentId) {
                    continue;
                }

                Log::info('Step 2: Fetching attachments for content', [
                    'external_id' => $externalId,
                    'content_id' => $contentId,
                    'content_title' => $contentTitle,
                ]);

                try {
                    $attachmentsResponse = Http::timeout(30)->withHeaders([
                        'Authorization' => "Bearer {$token}",
                        'Accept' => 'application/json',
                    ])->get($this->getApiBaseUrl()."/api/v2/blackboard/courses/{$externalId}/contents/{$contentId}/attachments");

                    if ($attachmentsResponse->successful()) {
                        $attachmentsData = $attachmentsResponse->json();
                        $attachments = $attachmentsData['data'] ?? [];

                        Log::info('Attachments received', [
                            'content_id' => $contentId,
                            'attachments_count' => count($attachments),
                        ]);

                        // Step 3: Build download URLs for each attachment
                        foreach ($attachments as $attachment) {
                            $attachmentId = $attachment['id'] ?? null;
                            $fileName = $attachment['fileName'] ?? $attachment['name'] ?? 'Unknown';

                            if ($attachmentId) {
                                // Use our local route that will proxy the download with authentication
                                $downloadUrl = route('qspark.courses.blackboard.download', [
                                    'externalId' => $externalId,
                                    'contentId' => $contentId,
                                    'attachmentId' => $attachmentId,
                                ]);

                                // Build quiz generation URL using v2 API format
                                $generateQuizUrl = $this->getApiBaseUrl()."/api/v2/blackboard/courses/{$externalId}/contents/{$contentId}/attachments/{$attachmentId}/generate-quiz";

                                $files[] = [
                                    'contentTitle' => $contentTitle,
                                    'fileName' => $fileName,
                                    'downloadUrl' => $downloadUrl,
                                    'generateQuizUrl' => $generateQuizUrl,
                                    'contentId' => $contentId,
                                    'attachmentId' => $attachmentId,
                                    'size' => $attachment['size'] ?? null,
                                    'mimeType' => $attachment['mimeType'] ?? null,
                                ];

                                Log::info('Attachment added', [
                                    'content_title' => $contentTitle,
                                    'file_name' => $fileName,
                                    'download_url' => $downloadUrl,
                                ]);
                            }
                        }
                    } else {
                        Log::error('Failed to fetch attachments for content', [
                            'content_id' => $contentId,
                            'status' => $attachmentsResponse->status(),
                            'body' => $attachmentsResponse->body(),
                            'url' => $this->getApiBaseUrl()."/api/v2/blackboard/courses/{$externalId}/contents/{$contentId}/attachments",
                        ]);
                    }
                } catch (\Exception $e) {
                    Log::error('Error fetching attachments for content', [
                        'content_id' => $contentId,
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            Log::info('Course contents processing complete', [
                'external_id' => $externalId,
                'total_files' => count($files),
            ]);

            return $files;

        } catch (\Exception $e) {
            Log::error('Error fetching course contents', [
                'external_id' => $externalId,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    private function getPdfPageCount($filePath)
    {
        // Cache PDF page counts
        $cacheKey = 'pdf_pages_'.md5($filePath).'_'.filemtime($filePath);

        return Cache::remember($cacheKey, 86400, function () use ($filePath) {
            $content = file_get_contents($filePath);
            $pageCount = preg_match_all('/\/Page\W/', $content);

            return $pageCount ?: 1;
        });
    }

    private function formatFileSize($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);

        return round($bytes, 2).' '.$units[$pow];
    }

    /**
     * Download a Blackboard attachment by proxying the API request
     * This is needed because the API requires authentication
     */
    public function downloadBlackboardAttachment($externalId, $contentId, $attachmentId)
    {
        $token = session('qspark_token');

        if (! $token) {
            return redirect()->route('qspark.login');
        }

        try {
            Log::info('Downloading Blackboard attachment', [
                'external_id' => $externalId,
                'content_id' => $contentId,
                'attachment_id' => $attachmentId,
            ]);

            $url = $this->getApiBaseUrl()."/api/v2/blackboard/courses/{$externalId}/contents/{$contentId}/attachments/{$attachmentId}/download";

            $response = Http::timeout(60)->withHeaders([
                'Authorization' => "Bearer {$token}",
                'Accept' => '*/*',
            ])->get($url);

            if (! $response->successful()) {
                Log::error('Failed to download Blackboard attachment', [
                    'status' => $response->status(),
                    'url' => $url,
                ]);
                abort(404, 'File not found');
            }

            // Get the filename from Content-Disposition header or use a default
            $contentDisposition = $response->header('Content-Disposition');
            $fileName = 'attachment';

            if ($contentDisposition && preg_match('/filename[^;=\n]*=(([\'"]).*?\2|[^;\n]*)/', $contentDisposition, $matches)) {
                $fileName = trim($matches[1], '"\'');
            }

            // Get content type
            $contentType = $response->header('Content-Type') ?? 'application/octet-stream';

            Log::info('Blackboard attachment downloaded successfully', [
                'file_name' => $fileName,
                'content_type' => $contentType,
                'size' => strlen($response->body()),
            ]);

            // Return the file as a download
            return response($response->body())
                ->header('Content-Type', $contentType)
                ->header('Content-Disposition', 'attachment; filename="'.$fileName.'"')
                ->header('Cache-Control', 'no-cache, no-store, must-revalidate')
                ->header('Pragma', 'no-cache')
                ->header('Expires', '0');

        } catch (\Exception $e) {
            Log::error('Error downloading Blackboard attachment', [
                'external_id' => $externalId,
                'content_id' => $contentId,
                'attachment_id' => $attachmentId,
                'error' => $e->getMessage(),
            ]);
            abort(500, 'Error downloading file');
        }
    }

    public function downloadAll($id)
    {
        $course = $this->findCourseByIdOrCode($id);

        if (! $course) {
            abort(404, 'Course not found');
        }

        $code = $course['course_code'];
        $folderPath = public_path('courses/'.$code.'/');

        if (! file_exists($folderPath)) {
            abort(404, 'Course materials not found');
        }

        $zip = new \ZipArchive;
        $zipFileName = $code.'_materials.zip';
        $zipPath = storage_path('app/temp/'.$zipFileName);

        if (! file_exists(dirname($zipPath))) {
            mkdir(dirname($zipPath), 0755, true);
        }

        if ($zip->open($zipPath, \ZipArchive::CREATE) === true) {
            $iterator = new \DirectoryIterator($folderPath);
            foreach ($iterator as $fileInfo) {
                if ($fileInfo->isFile() && $fileInfo->getExtension() === 'pdf') {
                    $zip->addFile($fileInfo->getPathname(), $fileInfo->getFilename());
                }
            }
            $zip->close();

            return response()->download($zipPath)->deleteFileAfterSend(true);
        }

        abort(500, 'Could not create zip file');
    }

    public function download($courseCode, $fileName)
    {
        $path = public_path("courses/$courseCode/$fileName");

        if (! file_exists($path)) {
            abort(404);
        }

        return response()->download($path, $fileName);
    }

    public function quiz($id)
    {
        // Resolve course using aggregated sources (no Eloquent model).
        // The questions for the game come from session keyed by the code in the URL,
        // so a missed lookup shouldn't 404 the player out — fall back to using the URL value.
        $course = $this->findCourseByIdOrCode($id);
        $code = $course['code'] ?? $course['course_code'] ?? (string) $id;
        $courseName = $course['name'] ?? $course['name_ar'] ?? $course['name_en'] ?? $code;
        $courseId = $course['numeric_id'] ?? $course['id'] ?? null;

        // Get grouped questions for adaptive gameplay (new format)
        $groupedQuestions = Session::get("quiz.$code.grouped_questions", []);
        // Legacy support: also check old format
        $legacyQuestions = Session::get("quiz.$code.questions", Session::get('quiz_questions', []));
        $courseCode = Session::get("quiz.$code.courseCode", Session::get('quiz_course_code'));
        $threadId = Session::get("quiz.$code.thread_id", Session::get('quiz_thread_id'));
        $attachmentKey = Session::get("quiz.$code.attachment_key");

        // Guard against mismatch or missing questions
        if ($courseCode && $courseCode !== $code) {
            Log::warning('Session course mismatch, clearing quiz session', [
                'expected' => $code,
                'found' => $courseCode,
            ]);
            Session::forget("quiz.$courseCode.grouped_questions");
            Session::forget("quiz.$courseCode.questions");
            Session::forget("quiz.$courseCode.courseCode");
            Session::forget("quiz.$courseCode.thread_id");
            $groupedQuestions = [];
            $legacyQuestions = [];
            $courseCode = null;
            $threadId = null;
        }

        // Calculate total count
        $totalCount = 0;
        if (! empty($groupedQuestions)) {
            $totalCount = count($groupedQuestions['easy'] ?? []) +
                         count($groupedQuestions['medium'] ?? []) +
                         count($groupedQuestions['hard'] ?? []);
        } elseif (! empty($legacyQuestions)) {
            $totalCount = count($legacyQuestions);
        }

        Log::info('Quiz page accessed', [
            'course_code' => $code,
            'session_course_code' => $courseCode,
            'thread_id' => $threadId,
            'attachment_key' => $attachmentKey,
            'grouped_questions' => ! empty($groupedQuestions),
            'total_questions' => $totalCount,
        ]);

        // Try to fetch current student ID for recording play time
        $studentId = null;
        try {
            $token = $this->getApiToken();
            if ($token) {
                $resp = Http::timeout(10)
                    ->withToken($token)
                    ->acceptJson()
                    ->get($this->getApiBaseUrl().'/api/v3/me');
                if ($resp->successful()) {
                    $studentId = data_get($resp->json(), 'data.id');
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Failed to fetch student ID for quiz view', ['error' => $e->getMessage()]);
        }

        return view('qspark::quiz.react-game', [
            'groupedQuestions' => $groupedQuestions,
            'questions' => $legacyQuestions, // Keep for backward compatibility
            'courseCode' => $courseCode ?: $code,
            'courseId' => $courseId,
            'attachmentKey' => $attachmentKey,
            'threadId' => $threadId,
            'code' => $code,
            'courseName' => $courseName,
            'studentId' => $studentId,
        ]);
    }

    public function quizFile($code, $fileName)
    {
        $filePath = public_path("courses/$code/$fileName");

        if (! file_exists($filePath)) {
            abort(404, 'File not found');
        }

        // Cache individual file text extraction
        $cacheKey = 'pdf_text_'.md5($filePath).'_'.filemtime($filePath);
        $cleanText = Cache::remember($cacheKey, 3600, function () use ($filePath) {
            $rawText = shell_exec("pdftotext '$filePath' -");

            return self::cleanExtractedText($rawText);
        });

        $pdfs = [[
            'file' => asset("courses/$code/$fileName"),
            'text' => $cleanText,
        ]];

        return view('qspark::quiz.index', [
            'code' => $code,
            'pdfs' => $pdfs,
        ]);
    }

    public static function cleanExtractedText($text)
    {
        $lines = array_filter(
            array_map('trim', explode("\n", $text)),
            function ($line) {
                return mb_strlen($line) > 10 && ! preg_match('/^\s*[\d.]+\s*$/u', $line);
            }
        );

        $paragraph = implode(' ', $lines);
        $paragraph = preg_replace('/[‪‬]+/u', '', $paragraph);
        $paragraph = preg_replace('/\s+/', ' ', $paragraph);

        return mb_substr($paragraph, 0, 1200);
    }

    public function downloadFile(Request $request, $courseId, $fileName)
    {
        $token = $this->getApiToken();
        if (! $token) {
            return response()->json(['error' => 'No authentication token'], 401);
        }

        $course = $this->findCourseByIdOrCode($courseId);
        if (! $course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        try {
            $downloadUrl = $request->input('download_url');

            $response = Http::timeout(30)->withHeaders([
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json',
            ])->get($downloadUrl);

            if ($response->successful()) {
                return response($response->body())
                    ->header('Content-Type', $response->header('Content-Type'))
                    ->header('Content-Disposition', 'attachment; filename="'.$fileName.'"');
            }

            return response()->json(['error' => 'Download failed'], 500);
        } catch (\Exception $e) {
            Log::error('File download error', ['error' => $e->getMessage()]);

            return response()->json(['error' => 'Download failed'], 500);
        }
    }

    public function downloadAllFiles($courseId)
    {
        $token = $this->getApiToken();
        if (! $token) {
            return response()->json(['error' => 'No authentication token'], 401);
        }

        $course = $this->findCourseByIdOrCode($courseId);
        if (! $course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        $blackboardCourseId = $course['courseId'] ?? null;
        if (! $blackboardCourseId) {
            return response()->json(['error' => 'Blackboard course ID not found'], 404);
        }

        try {
            $response = Http::timeout(60)->withHeaders([
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json',
            ])->get($this->getApiBaseUrl()."/api/v2/blackboard/course/{$blackboardCourseId}/download-all");

            if ($response->successful()) {
                return response($response->body())
                    ->header('Content-Type', 'application/zip')
                    ->header('Content-Disposition', 'attachment; filename="'.$blackboardCourseId.'_materials.zip"');
            }

            return response()->json(['error' => 'Download failed'], 500);
        } catch (\Exception $e) {
            Log::error('Download all error', ['error' => $e->getMessage()]);

            return response()->json(['error' => 'Download failed'], 500);
        }
    }

    public function debugCourseData($courseId)
    {
        $course = $this->findCourseByIdOrCode($courseId);

        if (! $course) {
            return response()->json(['error' => 'Course not found'], 404);
        }

        return response()->json([
            'course_id' => $courseId,
            'matched_course_data' => $course,
            'available_fields' => array_keys($course),
            'has_blackboard_data' => ! empty($course['raw_blackboard_data']),
            'has_timetable_data' => ! empty($course['raw_timetable_data']),
            'has_instructor_data' => ! empty($course['raw_instructor_data']),
        ], 200, [], JSON_PRETTY_PRINT);
    }

    /**
     * Get external_id (Blackboard course ID) from time-table API
     * This is needed because the student/courses API doesn't include external_id
     */
    private function getExternalIdFromTimetable($courseCode, $token)
    {
        // Cache the timetable data to avoid repeated API calls
        $cacheKey = 'timetable_external_ids_'.md5($token);

        $externalIds = Cache::remember($cacheKey, 1800, function () use ($token) {
            try {
                $response = Http::timeout(30)->withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/json',
                ])->get($this->getApiBaseUrl().'/api/v2/student/time-table');

                if (! $response->successful()) {
                    Log::warning('Time-table API failed when getting external_ids', ['status' => $response->status()]);

                    return [];
                }

                $data = $response->json();
                $timetable = $data['data']['time-table'] ?? [];

                // Build a map of course_code => external_id
                $map = [];
                foreach ($timetable as $course) {
                    $code = $course['course_code'] ?? null;
                    $extId = $course['external_id'] ?? null;
                    if ($code && $extId) {
                        // Clean the course code (remove extra spaces)
                        $cleanCode = preg_replace('/\s+/', ' ', trim($code));
                        $map[$cleanCode] = $extId;
                    }
                }

                Log::info('Built external_id map from timetable', ['courses_count' => count($map)]);

                return $map;

            } catch (\Exception $e) {
                Log::error('Error fetching timetable for external_ids', ['error' => $e->getMessage()]);

                return [];
            }
        });

        // Clean the input course code and look it up
        $cleanCourseCode = preg_replace('/\s+/', ' ', trim($courseCode));
        $externalId = $externalIds[$cleanCourseCode] ?? null;

        Log::info('getExternalIdFromTimetable result', [
            'course_code' => $courseCode,
            'clean_code' => $cleanCourseCode,
            'external_id' => $externalId,
        ]);

        return $externalId;
    }
}
