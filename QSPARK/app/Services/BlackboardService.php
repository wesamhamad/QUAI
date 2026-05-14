<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class BlackboardService
{
    private $baseUrl;

    public function __construct()
    {
        $this->baseUrl = 'https://api.qu.edu.sa/api/v2';
    }

    /**
     * Get all courses for the authenticated student (from SIS student/courses)
     *
     * @param  string  $token  Bearer token
     * @return array
     */
    public function getCourses($token)
    {
        try {
            // Use a new cache key so we don't reuse old /blackboard/courses results
            $cacheKey = 'student_courses_for_grades_'.md5($token);

            // Check if we have cached data first
            $cached = Cache::get($cacheKey);
            if ($cached !== null) {
                return $cached;
            }

            $response = Http::timeout(30)->withHeaders([
                'Authorization' => "Bearer {$token}",
                'Accept' => 'application/json',
            ])->get("{$this->baseUrl}/student/courses");

            if (! $response->successful()) {
                Log::error('Failed to fetch student courses for Blackboard grades', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                // Don't cache failed responses - return empty but don't store
                return [];
            }

            $data = $response->json();
            $courses = $data['data'] ?? [];

            // Only cache successful responses with data
            if (! empty($courses)) {
                Cache::put($cacheKey, $courses, 3600);
            }

            return $courses;
        } catch (\Exception $e) {
            Log::error('Exception fetching student courses for Blackboard grades', ['error' => $e->getMessage()]);

            return [];
        }
    }

    /**
     * Get course details by course ID
     *
     * @param  string  $courseId  Course external_id
     * @param  string  $token  Bearer token
     * @return array|null
     */
    public function getCourseDetails($courseId, $token)
    {
        try {
            $cacheKey = "blackboard_course_details_{$courseId}_".md5($token);

            return Cache::remember($cacheKey, 3600, function () use ($courseId, $token) {
                $response = Http::timeout(30)->withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/json',
                ])->get("{$this->baseUrl}/blackboard/course/{$courseId}");

                if (! $response->successful() || ! ($response->json()['success'] ?? false)) {
                    Log::error('Failed to fetch course details', [
                        'course_id' => $courseId,
                        'status' => $response->status(),
                    ]);

                    return null;
                }

                return $response->json()['data'] ?? null;
            });
        } catch (\Exception $e) {
            Log::error('Exception fetching course details', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Get course grades
     *
     * @param  string  $courseId  Course external_id (e.g., 1_2_471_15_7224)
     * @param  string  $token  Bearer token
     * @return array
     */
    public function getCourseGrades($courseId, $token)
    {
        try {
            $cacheKey = "blackboard_course_grades_{$courseId}_".md5($token);

            return Cache::remember($cacheKey, 1800, function () use ($courseId, $token) {
                Log::info('Fetching Blackboard course grades', ['course_id' => $courseId]);

                $response = Http::timeout(30)->withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/json',
                ])->get("{$this->baseUrl}/blackboard/courses/{$courseId}/grades");

                if (! $response->successful()) {
                    Log::error('Failed to fetch course grades', [
                        'course_id' => $courseId,
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);

                    return [];
                }

                $data = $response->json();

                if (! ($data['success'] ?? false)) {
                    Log::warning('Blackboard grades API returned unsuccessful', [
                        'course_id' => $courseId,
                        'data' => $data,
                    ]);

                    return [];
                }

                return $data['data'] ?? [];
            });
        } catch (\Exception $e) {
            Log::error('Exception fetching course grades', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Get course contents
     *
     * @param  string  $courseId  Course external_id
     * @param  string  $token  Bearer token
     * @return array
     */
    public function getCourseContents($courseId, $token)
    {
        try {
            $cacheKey = "blackboard_course_contents_{$courseId}_".md5($token);

            return Cache::remember($cacheKey, 3600, function () use ($courseId, $token) {
                $response = Http::timeout(30)->withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/json',
                ])->get("{$this->baseUrl}/blackboard/courses/{$courseId}/contents/v2");

                if (! $response->successful()) {
                    Log::error('Failed to fetch course contents', [
                        'course_id' => $courseId,
                        'status' => $response->status(),
                    ]);

                    return [];
                }

                $data = $response->json();

                return $data['data'] ?? [];
            });
        } catch (\Exception $e) {
            Log::error('Exception fetching course contents', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Get course announcements
     *
     * @param  string  $courseId  Course external_id
     * @param  string  $token  Bearer token
     * @return array
     */
    public function getCourseAnnouncements($courseId, $token)
    {
        try {
            $cacheKey = "blackboard_course_announcements_{$courseId}_".md5($token);

            return Cache::remember($cacheKey, 1800, function () use ($courseId, $token) {
                $response = Http::timeout(30)->withHeaders([
                    'Authorization' => "Bearer {$token}",
                    'Accept' => 'application/json',
                ])->get("{$this->baseUrl}/blackboard/courses/{$courseId}/announcements");

                if (! $response->successful()) {
                    Log::error('Failed to fetch course announcements', [
                        'course_id' => $courseId,
                        'status' => $response->status(),
                    ]);

                    return [];
                }

                $data = $response->json();

                return $data['data'] ?? [];
            });
        } catch (\Exception $e) {
            Log::error('Exception fetching course announcements', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Get all courses with their grades for the authenticated student
     *
     * @param  string  $token  Bearer token
     * @return array
     */
    public function getCoursesWithGrades($token)
    {
        $courses = $this->getCourses($token);
        $coursesWithGrades = [];

        foreach ($courses as $course) {
            // external_id from /student/courses is the Blackboard course identifier
            $courseId = $course['external_id'] ?? $course['courseId'] ?? null;

            if (! $courseId) {
                continue;
            }

            // Get course details
            $details = $this->getCourseDetails($courseId, $token);

            // Get course grades
            $grades = $this->getCourseGrades($courseId, $token);

            $coursesWithGrades[] = [
                'course_id' => $courseId,
                'course_name' => $details['name']
                    ?? $course['course_name']
                    ?? $course['name']
                    ?? 'Unknown',
                'course_code' => $details['courseId']
                    ?? $course['course_code']
                    ?? $course['courseId']
                    ?? 'N/A',
                'external_id' => $courseId,
                'details' => $details,
                'grades' => $grades,
                'last_accessed' => $course['lastAccessed']
                    ?? $course['last_accessed']
                    ?? null,
            ];
        }

        // Sort so courses that have grades appear first
        usort($coursesWithGrades, function ($a, $b) {
            $aHasGrades = ! empty($a['grades']);
            $bHasGrades = ! empty($b['grades']);
            if ($aHasGrades === $bHasGrades) {
                return 0;
            }

            // Courses with grades come first
            return $aHasGrades ? -1 : 1;
        });

        return $coursesWithGrades;
    }
}
