<?php

namespace App\QSpark\Http\Controllers;

use App\QSpark\Models\DailyVisit;
use App\QSpark\Models\Student;
use App\QSpark\Models\StudentMonthlyRecommendation;
use App\QSpark\Models\StudentPlayHour;
use App\QSpark\Services\BlackboardService;
use App\QSpark\Services\SISService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class StudentDashboardController extends Controller
{
    private $token;

    private $baseUrl;

    public function __construct()
    {
        $this->token = session('qspark_token');
        // In demo mode every authenticated user has an implicit token; upstream
        // calls will fail and the StudentFixture fallback supplies sample data.
        if (! $this->token && config('app.demo_mode') && auth()->check()) {
            $this->token = 'demo-token';
            session(['qspark_token' => $this->token]);
        }
        // Base URL for v2 endpoints (time-table, absences, final-exams)
        // Note: /me endpoint uses v3 (handled separately in getStudentProfile)
        $this->baseUrl = $this->getApiBaseUrl().'/api/v2';
    }

    /**
     * Cache key for the current academic semester (QU calendar).
     *   Sep-Dec → fall, Jan-May → spring, Jun-Aug → summer.
     * Stored in the recommendation model's `month` column verbatim.
     */
    private function currentSemesterKey(): string
    {
        $now = Carbon::now('Asia/Riyadh');
        $term = match (true) {
            $now->month >= 9 => 'fall',
            $now->month >= 6 => 'summer',
            default => 'spring',
        };

        return $now->year.'-'.$term;
    }

    /**
     * Get the API base URL based on environment
     */
    private function getApiBaseUrl(): string
    {
        return match (config('app.env')) {
            'local' => env('QU_API_URL', 'http://127.0.0.1:8001'),
            'production' => 'https://api.qu.edu.sa',
            default => 'https://api-test.qu.edu.sa',
        };
    }

    private function setToken($token)
    {
        session(['qspark_token' => $token]);
        $this->token = $token;
    }

    private function callApiWithToken($endpoint)
    {
        // Demo mode: skip the live HTTP call entirely.
        if (config('app.demo_mode')) {
            $fallback = \App\QSpark\Support\StudentFixture::forEndpoint($endpoint);
            if ($fallback !== null) {
                \App\QSpark\Support\StudentFixture::logServed('callApiWithToken[demo]', $endpoint);
            }
            return $fallback;
        }

        $fullUrl = $this->baseUrl.$endpoint;

        try {
            $response = Http::withToken($this->token)->get($fullUrl);
            Log::info('API response status: '.$response->status().' for '.$endpoint);

            if ($response->successful()) {
                return $response->json();
            }
            Log::warning('API call failed', ['endpoint' => $endpoint, 'status' => $response->status()]);
        } catch (\Throwable $e) {
            Log::error('Error calling API', ['endpoint' => $endpoint, 'error' => $e->getMessage()]);
        }

        $fallback = \App\QSpark\Support\StudentFixture::forEndpoint($endpoint);
        if ($fallback !== null) {
            \App\QSpark\Support\StudentFixture::logServed('callApiWithToken', $endpoint);
        }

        return $fallback;
    }

    /**
     * Fetch the student's currently registered courses from /student/courses.
     * Returns a deduplicated list of [code => name] pairs for the active term.
     */
    private function getEnrolledCourses(): array
    {
        $cacheKey = 'student_courses_'.md5((string) $this->token);

        return Cache::remember($cacheKey, 600, function () {
            $response = $this->callApiWithToken('/student/courses');
            $rows = $response['data'] ?? [];
            $byCode = [];
            foreach ($rows as $row) {
                $code = $row['course_code'] ?? null;
                if ($code && ! isset($byCode[$code])) {
                    $byCode[$code] = $row['course_name'] ?? $code;
                }
            }

            return $byCode;
        });
    }

    private function getFirstName($fullName)
    {
        if (! $fullName || trim($fullName) === '') {
            return 'غير متوفر';
        }

        $parts = explode(' ', trim($fullName));

        return $parts[0];
    }

    private function syncStudentData($studentProfile, $gpa, $attendanceRate)
    {
        $studentData = [
            'student_id' => $studentProfile['data']['profile']['id'] ?? $studentProfile['data']['profile']['student_id'] ?? '',
            'arabic_name' => $studentProfile['data']['profile']['name'] ?? '',
            'english_name' => $studentProfile['data']['profile']['name_en'] ?? '',
            'email' => $studentProfile['data']['profile']['email'] ?? '',
            'gender' => in_array($studentProfile['data']['profile']['gender'] ?? null, ['Male', 'Female'], true)
                ? $studentProfile['data']['profile']['gender']
                : null,
            'gpa' => $gpa,
            'attendance_rate' => $attendanceRate,
        ];

        return Student::updateOrCreateStudent($studentData);
    }

    public function show(Request $request)
    {
        if (! $this->token) {
            $loginUrl = $this->getApiBaseUrl().'/web/login';
            $redirectUrl = urlencode(route('qspark.token.receive'));

            return redirect("{$loginUrl}?redirect={$redirectUrl}");
        }

        // Cache dashboard data for 1 hour
        $cacheKey = 'dashboard_data_'.md5($this->token).'_'.auth()->id();
        $dashboardData = Cache::remember($cacheKey, 60, function () {
            return $this->getDashboardData();
        });

        return view('qspark::student-dashboard', $dashboardData);
    }

    /**
     * Show student grades by batch with course types
     */
    public function showGrades(Request $request)
    {
        if (! $this->token) {
            $loginUrl = $this->getApiBaseUrl().'/web/login';
            $redirectUrl = urlencode(route('qspark.token.receive'));

            return redirect("{$loginUrl}?redirect={$redirectUrl}");
        }

        // Get student profile to get student ID
        $studentProfile = $this->getStudentProfile();
        $studentId = $studentProfile['data']['profile']['id'] ?? $studentProfile['data']['profile']['student_id'] ?? null;

        if (! $studentId) {
            return view('qspark::student-grades', [
                'courses' => [],
                'error' => 'Student ID not found',
            ]);
        }

        // SISService already handles caching internally (removed duplicate cache layer)
        $sisService = new SISService;
        $gradesData = $sisService->getStudentCoursesWithGrades($studentId);

        // Group courses by category
        $groupedCourses = [];
        foreach ($gradesData as $course) {
            $categoryName = $course->category_name ?? 'غير محدد';
            $groupTypeName = $course->group_type_name ?? 'غير محدد';

            if (! isset($groupedCourses[$categoryName])) {
                $groupedCourses[$categoryName] = [];
            }

            if (! isset($groupedCourses[$categoryName][$groupTypeName])) {
                $groupedCourses[$categoryName][$groupTypeName] = [];
            }

            $groupedCourses[$categoryName][$groupTypeName][] = $course;
        }

        return view('qspark::student-grades', [
            'courses' => $gradesData,
            'groupedCourses' => $groupedCourses,
            'studentProfile' => $studentProfile['data']['profile'] ?? [],
        ]);
    }

    /**
     * Show Blackboard course grades
     */
    public function showBlackboardGrades(Request $request)
    {
        if (! $this->token) {
            $loginUrl = $this->getApiBaseUrl().'/web/login';
            $redirectUrl = urlencode(route('qspark.token.receive'));

            return redirect("{$loginUrl}?redirect={$redirectUrl}");
        }

        $studentProfile = $this->getStudentProfile();

        // Demo mode: skip the live Blackboard fetch entirely and synthesize a
        // per-course breakdown from the StudentFixture course bundle so the
        // page renders with realistic grades instead of "no grades available".
        if (config('app.demo_mode')) {
            $coursesWithGrades = $this->demoBlackboardCoursesWithGrades();
        } else {
            // Cache Blackboard grades data for 30 minutes - only cache if we get data
            $cacheKey = 'blackboard_grades_v3_'.md5($this->token);
            $coursesWithGrades = Cache::get($cacheKey);

            if ($coursesWithGrades === null) {
                $blackboardService = new BlackboardService;
                $coursesWithGrades = $blackboardService->getCoursesWithGrades($this->token);

                // Only cache if we got actual data
                if (! empty($coursesWithGrades)) {
                    Cache::put($cacheKey, $coursesWithGrades, 1800);
                }
            }
        }

        return view('qspark::blackboard-grades', [
            'courses' => $coursesWithGrades,
            'studentProfile' => $studentProfile['data']['profile'] ?? [],
        ]);
    }

    /**
     * Build a deterministic dummy Blackboard grades payload from the demo
     * course fixture. Each course gets the same set of weighted items
     * (quizzes, assignment, midterm, project, final); the per-course score
     * offset is seeded from the course code so reloads stay stable.
     */
    private function demoBlackboardCoursesWithGrades(): array
    {
        $bundle = \App\QSpark\Support\StudentFixture::courses();
        $rows = $bundle['data'] ?? [];
        if (empty($rows)) {
            return [];
        }

        $items = [
            ['name' => 'الاختبار القصير الأول', 'possible' => 10, 'pct' => 0.92],
            ['name' => 'الواجب الأول',           'possible' => 15, 'pct' => 0.88],
            ['name' => 'الاختبار النصفي',         'possible' => 30, 'pct' => 0.86],
            ['name' => 'الاختبار القصير الثاني', 'possible' => 10, 'pct' => 0.95],
            ['name' => 'مشروع المقرر',            'possible' => 15, 'pct' => 0.90],
            ['name' => 'الاختبار النهائي',        'possible' => 40, 'pct' => 0.84],
        ];

        $accessedBase = strtotime('2026-04-20');
        $courses = [];
        foreach ($rows as $row) {
            $code = (string) ($row['course_code'] ?? '');
            if ($code === '') {
                continue;
            }

            // ±6 percentage-point offset per course so each card differs but
            // the same course always shows the same numbers across reloads.
            $seed = (abs(crc32($code)) % 13) - 6;
            $grades = [];
            foreach ($items as $i => $item) {
                $variance = ((abs(crc32($code.'_'.$i)) % 11) - 5) / 100;
                $pct = max(0.55, min(1.0, $item['pct'] + ($seed / 100) + $variance));
                $grades[] = [
                    'name'     => $item['name'],
                    'score'    => round($item['possible'] * $pct, 1),
                    'possible' => $item['possible'],
                ];
            }

            $courses[] = [
                'course_id'     => $row['external_id'] ?? $code,
                'course_name'   => $row['course_name'] ?? $code,
                'course_code'   => $code,
                'external_id'   => $row['external_id'] ?? $code,
                'details'       => [],
                'grades'        => $grades,
                'last_accessed' => date('Y-m-d H:i:s', $accessedBase - ((abs(crc32($code)) % 21) * 86400)),
            ];
        }

        return $courses;
    }

    private function getDashboardData()
    {
        $gpa = 0;
        $studentProfile = $this->getStudentProfile();
        // Log::info('studentProfile',$studentProfile);
        $studentArabicName = $studentProfile['data']['profile']['name'] ?? 'غير متوفر';
        $studentEnglishName = $studentProfile['data']['profile']['name_en'] ?? 'Not Available';
        $gpa = $studentProfile['data']['profile']['academic']['last_recorded_gpa'] ?? 0;
        Log::info('GPA', ['gpa' => $gpa]);

        $gender = $studentProfile['data']['profile']['gender'] ?? 'غير متوفر';

        $timeTable = $this->getStudentTimeTable();
        $todayClasses = [];
        $today = date('l');

        $absencesData = $this->getStudentAbsences();
        $absences = $absencesData['data'] ?? [];

        if ($timeTable && isset($timeTable['data']['time-table'])) {
            foreach ($timeTable['data']['time-table'] as $class) {
                foreach ($class['times'] as $time) {
                    if ($time['day']['name'] === $today) {
                        $todayClasses[] = [
                            'course_code' => $class['course_code'] ?? '',
                            'course_name' => $class['course_name'],
                            'activity_desc' => $class['activity_desc'],
                            'start' => $time['time_slot']['formatted']['start'],
                            'end' => $time['time_slot']['formatted']['end'],
                            'campus_desc' => $class['campus_desc'],
                        ];
                    }
                }
            }
        }

        // توزيع الغيابات بالأيام (الأحد - الخميس)
        $dayCounts = array_fill(0, 5, 0);
        foreach ($absences as $course) {
            foreach ($course['absences'] as $absence) {
                $dayIndex = intval($absence['absence_day']);
                if ($dayIndex >= 1 && $dayIndex <= 5) {
                    $dayCounts[$dayIndex - 1]++;
                }
            }
        }

        // Build per-course attendance from the absences API. When the API
        // returns no absences for the term, fall back to the enrolled-course
        // list so each registered course is shown with 100% attendance
        // instead of an empty card.
        $courseRows = [];
        foreach ($absences as $course) {
            $code = $course['cource_code'] ?? null;
            if (! $code) {
                continue;
            }
            $absencePercent = floatval($course['absence_all_percent'] ?? 0);
            $courseRows[$code] = [
                'name' => $course['cource_name'] ?? $code,
                'absence_percent' => $absencePercent,
                'absence_count' => is_array($course['absences'] ?? null) ? count($course['absences']) : 0,
            ];
        }

        if (empty($courseRows)) {
            foreach ($this->getEnrolledCourses() as $code => $name) {
                $courseRows[$code] = [
                    'name' => $name,
                    'absence_percent' => 0.0,
                    'absence_count' => 0,
                ];
            }
        }

        $attendanceDetails = [];
        $totalRate = 0;
        foreach ($courseRows as $code => $row) {
            $rate = round(max(100 - $row['absence_percent'], 0), 2);
            $totalRate += $rate;

            if ($rate > 75) {
                $color = 'bg-green-500';
            } elseif ($rate >= 50) {
                $color = 'bg-orange-500';
            } else {
                $color = 'bg-red-500';
            }

            $attendanceDetails[] = [
                'course' => $code,
                'rate' => $rate,
                'total' => $row['absence_count'],
                'color' => $color,
            ];
        }

        $attendanceRate = empty($courseRows)
            ? 0
            : round($totalRate / count($courseRows), 2);

        // ✅ جلب بيانات الاختبارات النهائية
        $finalExams = $this->getFinalExamsDate();
        $finalExamsCourses = $finalExams['courses'] ?? [];

        Log::info('Final exams data: '.json_encode($finalExamsCourses));
        // ✅ حساب أقرب اختبار نهائي وأقرب اختبارين بعده
        $upcomingExams = [];
        foreach ($finalExamsCourses as $exam) {
            $examDetails = $exam['exam'];
            $date = $examDetails['exam_date'] ?? null;

            Log::info('Exam processing:', [
                'course' => $exam['course_code'] ?? '—',
                'exam_date' => $date,
            ]);

            if ($date && $date !== '-' && strtotime($date)) {
                $examDate = Carbon::parse($date, 'Asia/Riyadh');
                $daysLeft = Carbon::now('Asia/Riyadh')->diffInDays($examDate, false);
                $daysLeft = intval($daysLeft);

                Log::info('Parsed exam date:', [$examDate->toDateTimeString()]);
                Log::info('Days left:', [$daysLeft]);

                if ($daysLeft >= 0) {
                    $upcomingExams[] = [
                        'course_code' => $exam['course_code'] ?? '',
                        'course' => $exam['course_name'] ?? '—',
                        'date' => $examDate->format('Y-m-d'),
                        'days_left' => $daysLeft,
                    ];
                } else {
                    Log::info('Skipped exam (past date).');
                }
            } else {
                Log::info('Skipped exam (invalid or missing date).');
            }
        }

        Log::info('Carbon now:', [Carbon::now('Asia/Riyadh')->toDateTimeString()]);

        // ترتيبهم بالأقرب
        usort($upcomingExams, fn ($a, $b) => $a['days_left'] <=> $b['days_left']);

        $nearestExam = $upcomingExams[0] ?? null;
        $nextTwoExams = array_slice($upcomingExams, 1, 2);
        Log::info('Nearest exam: '.json_encode($nearestExam));
        Log::info('Next two exams: '.json_encode($nextTwoExams));

        // Resolve the canonical play-time identifier from SAML attributes
        // first — SIS is unreachable in production, so we cannot depend on the
        // student profile fetch. For QU SAML users, username == SIS student
        // number, which is what GameSessionService::endSession() writes.
        $authUser = auth()->user();
        $playStudentId = $authUser?->username
            ?? $studentProfile['data']['profile']['id']
            ?? $studentProfile['data']['profile']['student_id']
            ?? null;

        // Get today's play time in minutes
        $todayPlayMinutes = $playStudentId ? StudentPlayHour::getTodayMinutes($playStudentId) : 0;
        // Daily target: 60 minutes = 100%
        $playMinutesPercentage = min(($todayPlayMinutes / 60) * 100, 100);

        $student = $this->syncStudentData($studentProfile, $gpa, $attendanceRate);

        // Update cumulative study minutes from game
        if ($todayPlayMinutes > 0) {
            $student->addStudyHours($todayPlayMinutes);
        }

        // Get next lecture
        $nextLecture = $this->getNextLecture($timeTable);

        $gameStats = $this->computeGameStats($playStudentId);

        return [
            'studentArabicName' => $studentArabicName,
            'studentEnglishName' => $studentEnglishName,
            'gender' => $gender,
            'gpa' => $gpa,
            'todayClasses' => $todayClasses,
            'absences' => $absences,
            'dayCounts' => $dayCounts,
            'finalExamsCourses' => $finalExamsCourses,
            'timePeriod' => Carbon::now('Asia/Riyadh')->format('A'),
            'attendanceRate' => $attendanceRate,
            'attendanceDetails' => $attendanceDetails,
            'nearestExam' => $nearestExam ?? null,
            'nextTwoExams' => $nextTwoExams,
            'todayPlayMinutes' => $todayPlayMinutes,
            'playMinutesPercentage' => $playMinutesPercentage,
            'totalStudyHours' => $student->total_study_hours,
            'nextLecture' => $nextLecture,
            'gameAttempts' => $gameStats['attempts'],
            'maxAttempts' => $gameStats['max_attempts'],
            'gamePoints' => $gameStats['points'],
            'consecutiveDays' => $gameStats['consecutive_days'],
        ];
    }

    /**
     * Compute the "Game Status" card numbers from student_play_hours.
     * - attempts:       sessions logged today
     * - max_attempts:   daily cap shown next to attempts (UX only, not enforced)
     * - points:         minutes_played * 2, lifetime total
     * - consecutive_days: longest current streak counting back from today
     *                  (or yesterday if today has no session yet)
     */
    private function computeGameStats(?string $studentId): array
    {
        $default = ['attempts' => 0, 'max_attempts' => 3, 'points' => 0, 'consecutive_days' => 0];
        if (! $studentId) {
            return $default;
        }

        $today = Carbon::now('Asia/Riyadh')->toDateString();

        // Attempts = today's ended games. student_play_hours is keyed
        // (student_id, play_date) so it would always show 1 row regardless of
        // how many times the student played; student_quiz_performance has one
        // row per ended game, which is what we want.
        $attempts = (int) DB::table('student_quiz_performance')
            ->where('student_id', $studentId)
            ->whereDate('created_at', $today)
            ->count();

        $totalMinutes = (int) StudentPlayHour::where('student_id', $studentId)->sum('minutes_played');

        $playDates = StudentPlayHour::where('student_id', $studentId)
            ->selectRaw('DATE(play_date) AS d')
            ->groupBy('d')
            ->orderByDesc('d')
            ->pluck('d')
            ->map(fn ($d) => (string) $d)
            ->all();

        $streak = 0;
        if (! empty($playDates)) {
            $cursor = $playDates[0] === $today
                ? Carbon::today('Asia/Riyadh')
                : Carbon::today('Asia/Riyadh')->subDay();
            foreach ($playDates as $d) {
                if ($d === $cursor->toDateString()) {
                    $streak++;
                    $cursor->subDay();
                } else {
                    break;
                }
            }
        }

        return [
            'attempts' => $attempts,
            'max_attempts' => 3,
            'points' => $totalMinutes * 2,
            'consecutive_days' => $streak,
        ];
    }

    public function getStudentProfile()
    {
        // Cache student profile for 30 minutes (1800 seconds) - frequently accessed
        $cacheKey = 'student_profile_'.md5($this->token);

        return Cache::remember($cacheKey, 1800, function () {
            // Demo mode: serve the sanitized fixture directly.
            if (config('app.demo_mode')) {
                \App\QSpark\Support\StudentFixture::logServed('getStudentProfile[demo]', '/api/v3/me');
                return \App\QSpark\Support\StudentFixture::profile();
            }

            Log::info('Calling API to get student profile.');
            // Use v3 endpoint for student profile
            $v3BaseUrl = $this->getApiBaseUrl().'/api/v3';

            try {
                $response = Http::withToken($this->token)->get($v3BaseUrl.'/me');
                Log::info('API response status: '.$response->status());

                if ($response->successful()) {
                    $data = $response->json();
                    Log::info('API response data: '.json_encode($data));

                    return $data;
                }

                Log::error('API call failed', ['status' => $response->status(), 'body' => $response->body()]);
            } catch (\Throwable $e) {
                Log::error('API call exception', ['message' => $e->getMessage()]);
            }

            $fallback = \App\QSpark\Support\StudentFixture::profile();
            if ($fallback !== null) {
                \App\QSpark\Support\StudentFixture::logServed('getStudentProfile', '/api/v3/me');
            }

            return $fallback;
        });
    }

    public function getStudentTimeTable()
    {
        // Cache timetable for 2 hours (7200 seconds) - rarely changes during semester
        $cacheKey = 'student_timetable_'.md5($this->token);

        return Cache::remember($cacheKey, 7200, function () {
            Log::info('Calling API to get student timetable.');

            return $this->callApiWithToken('/time-table');
        });
    }

    public function getStudentAbsences()
    {
        // Cache absences for 30 minutes (1800 seconds) - updates when classes end
        $cacheKey = 'student_absences_'.md5($this->token);

        return Cache::remember($cacheKey, 1800, function () {
            Log::info('Calling API to get student absences.');
            $result = $this->callApiWithToken('/absences-with-details');
            Log::debug('Absences API response', [
                'has_data' => isset($result['data']),
                'course_count' => is_array($result['data'] ?? null) ? count($result['data']) : 0,
                'first_course_keys' => is_array($result['data'][0] ?? null) ? array_keys($result['data'][0]) : null,
                'first_course_sample' => $result['data'][0] ?? null,
                'raw_status' => $result['status'] ?? null,
                'raw_message' => $result['message'] ?? null,
            ]);

            return $result;
        });
    }

    public function getFinalExamsDate()
    {
        // Cache final exams for 6 hours (21600 seconds) - rarely changes
        $cacheKey = 'student_final_exams_'.md5($this->token);

        return Cache::remember($cacheKey, 21600, function () {
            Log::info('Calling API to get final exams date.');
            $result = $this->callApiWithToken('/final-exams');
            Log::info('Final exams API response:', ['result' => $result]);

            return $result;
        });
    }

    private function getNextLecture($timeTable)
    {
        if (! $timeTable || ! isset($timeTable['data']['time-table'])) {
            return null;
        }

        $now = Carbon::now('Asia/Riyadh');
        $currentDayNumber = $now->dayOfWeekIso; // 1 = Monday, 7 = Sunday
        $currentTime = $now->format('H:i');

        $allLectures = [];

        // Collect all lectures with their day and time
        foreach ($timeTable['data']['time-table'] as $class) {
            foreach ($class['times'] as $time) {
                $dayNumber = $time['day']['number'];
                $startTime = $time['time_slot']['formatted']['start'];
                $endTime = $time['time_slot']['formatted']['end'];

                // Calculate minutes from start of week for sorting
                $minutesFromWeekStart = ($dayNumber - 1) * 24 * 60 +
                    (intval(substr($startTime, 0, 2)) * 60) +
                    intval(substr($startTime, 3, 2));

                $allLectures[] = [
                    'course_code' => $class['course_code'],
                    'course_name' => $class['course_name'],
                    'activity_desc' => $class['activity_desc'],
                    'day_number' => $dayNumber,
                    'day_name' => $time['day']['name'],
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                    'room' => $time['room'],
                    'minutes_from_week_start' => $minutesFromWeekStart,
                ];
            }
        }

        // Sort by minutes from week start
        usort($allLectures, fn ($a, $b) => $a['minutes_from_week_start'] <=> $b['minutes_from_week_start']);

        // Current minutes from week start
        $currentMinutesFromWeekStart = ($currentDayNumber - 1) * 24 * 60 +
            (intval(substr($currentTime, 0, 2)) * 60) +
            intval(substr($currentTime, 3, 2));

        // Find next lecture
        foreach ($allLectures as $lecture) {
            if ($lecture['minutes_from_week_start'] > $currentMinutesFromWeekStart) {
                return $lecture;
            }
        }

        // If no lecture found this week, return first lecture of next week
        return $allLectures[0] ?? null;
    }

    /**
     * Get academic improvement rate
     * Compares performance before and after using the platform
     */
    private function getAcademicImprovement($studentId)
    {
        if (! $studentId) {
            return [
                'improvement_rate' => 0,
                'before_gpa' => 0,
                'after_gpa' => 0,
                'status' => 'no_student_id',
            ];
        }

        try {
            $sisService = new SISService;

            return $sisService->calculateAcademicImprovement($studentId);
        } catch (\Exception $e) {
            Log::error('Failed to get academic improvement', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);

            return [
                'improvement_rate' => 0,
                'before_gpa' => 0,
                'after_gpa' => 0,
                'status' => 'error',
            ];
        }
    }

    /**
     * Get activity completion rate
     * Measures student's commitment to training and learning
     */
    private function getActivityCompletionRate($studentId)
    {
        if (! $studentId) {
            return [
                'completion_rate' => 0,
                'completed_activities' => 0,
                'total_activities' => 0,
            ];
        }

        try {
            // Calculate based on game attempts and study hours
            $student = Student::where('student_id', $studentId)->first();

            if (! $student) {
                return [
                    'completion_rate' => 0,
                    'completed_activities' => 0,
                    'total_activities' => 0,
                ];
            }

            // Define expected activities (realistic targets for the semester)
            $expectedGameAttempts = 30; // Expected number of game attempts for the semester
            $expectedStudyHours = 100; // Expected study hours for the semester (in hours)

            // Get actual data
            $gameAttempts = $student->game_attempts ?? 0;
            // Note: total_study_hours accessor converts minutes to hours
            $studyHours = $student->total_study_hours ?? 0;

            // Calculate completion rate
            $gameCompletionRate = ($gameAttempts / $expectedGameAttempts) * 100;
            $studyCompletionRate = ($studyHours / $expectedStudyHours) * 100;

            // Average of both rates (capped at 100%)
            $overallCompletionRate = min((($gameCompletionRate + $studyCompletionRate) / 2), 100);

            return [
                'completion_rate' => round($overallCompletionRate, 2),
                'game_attempts' => $gameAttempts,
                'study_hours' => $studyHours,
                'expected_game_attempts' => $expectedGameAttempts,
                'expected_study_hours' => $expectedStudyHours,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to get activity completion rate', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);

            return [
                'completion_rate' => 0,
                'completed_activities' => 0,
                'total_activities' => 0,
            ];
        }
    }

    /**
     * Get login rate vs average
     * Compares student's activity level with other users
     */
    private function getLoginRateVsAverage($studentId)
    {
        if (! $studentId) {
            return [
                'student_visits' => 0,
                'average_visits' => 0,
                'comparison_rate' => 0,
            ];
        }

        try {
            // Get student's visits in the last 30 days
            $studentVisits = DailyVisit::where('user_id', auth()->id())
                ->where('visit_date', '>=', Carbon::now()->subDays(30))
                ->sum('visit_count');

            // Get average visits for all students
            $averageVisits = DailyVisit::where('visit_date', '>=', Carbon::now()->subDays(30))
                ->groupBy('user_id')
                ->selectRaw('SUM(visit_count) as total')
                ->get()
                ->avg('total') ?? 1;

            // Calculate comparison rate
            $comparisonRate = 0;
            if ($averageVisits > 0) {
                $comparisonRate = ($studentVisits / $averageVisits) * 100;
            }

            return [
                'student_visits' => $studentVisits,
                'average_visits' => round($averageVisits, 2),
                'comparison_rate' => round($comparisonRate, 2),
            ];
        } catch (\Exception $e) {
            Log::error('Failed to get login rate vs average', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);

            return [
                'student_visits' => 0,
                'average_visits' => 0,
                'comparison_rate' => 0,
            ];
        }
    }

    /**
     * Get satisfaction score
     * Measures student's benefit from the platform
     */
    private function getSatisfactionScore($studentId)
    {
        if (! $studentId) {
            return [
                'satisfaction_score' => 0,
                'status' => 'no_student_id',
            ];
        }

        try {
            // Calculate satisfaction based on multiple factors:
            // 1. Academic improvement
            // 2. Activity completion
            // 3. Regular usage

            $academicImprovement = $this->getAcademicImprovement($studentId);
            $activityCompletion = $this->getActivityCompletionRate($studentId);
            $loginRate = $this->getLoginRateVsAverage($studentId);

            // Weight factors
            $academicWeight = 0.4;
            $activityWeight = 0.3;
            $usageWeight = 0.3;

            // Normalize academic improvement to 0-100 scale
            $academicScore = 50; // Base score
            if ($academicImprovement['status'] === 'success') {
                $improvementRate = $academicImprovement['improvement_rate'];
                if ($improvementRate > 0) {
                    $academicScore = min(100, 50 + ($improvementRate * 10));
                } elseif ($improvementRate < 0) {
                    $academicScore = max(0, 50 + ($improvementRate * 10));
                }
            }

            $activityScore = $activityCompletion['completion_rate'];
            $usageScore = min(100, $loginRate['comparison_rate']);

            // Calculate weighted satisfaction score
            $satisfactionScore = ($academicScore * $academicWeight) +
                                ($activityScore * $activityWeight) +
                                ($usageScore * $usageWeight);

            return [
                'satisfaction_score' => round($satisfactionScore, 2),
                'academic_score' => round($academicScore, 2),
                'activity_score' => round($activityScore, 2),
                'usage_score' => round($usageScore, 2),
                'status' => 'success',
            ];
        } catch (\Exception $e) {
            Log::error('Failed to get satisfaction score', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);

            return [
                'satisfaction_score' => 0,
                'status' => 'error',
            ];
        }
    }

    /**
     * Show monthly recommendations and treatment plans for student
     */
    public function showRecommendations(Request $request)
    {
        if (! $this->token) {
            $loginUrl = $this->getApiBaseUrl().'/web/login';
            $redirectUrl = urlencode(route('qspark.token.receive'));

            return redirect("{$loginUrl}?redirect={$redirectUrl}");
        }

        // Get student profile
        $profile = $this->getStudentProfile();
        if (! $profile) {
            return redirect()->route('qspark.dashboard.student')->with('error', 'فشل في جلب بيانات الطالب');
        }

        $studentId = $profile['data']['id'] ?? auth()->user()->uuid;

        // Get or create student record
        $student = Student::where('student_id', $studentId)->first();
        if (! $student) {
            // Create basic student record
            $student = Student::updateOrCreateStudent([
                'student_id' => $studentId,
                'arabic_name' => $profile['data']['profile']['name'] ?? '',
                'english_name' => $profile['data']['profile']['name_en'] ?? '',
                'email' => $profile['data']['profile']['email'] ?? '',
                'gender' => $profile['data']['profile']['gender'] ?? null,
                'gpa' => $profile['data']['academic']['lastRecordedGpa'] ?? 0,
                'attendance_rate' => 0,
            ]);
        }

        // Get dashboard data for AI analysis
        $dashboardData = $this->getDashboardData();

        // Demo mode: always serve a complete, fully-Arabic dummy recommendation
        // so every section of the page is populated regardless of AI/DB state.
        // This also refreshes any stale (English / partial) record left behind
        // by an earlier live Gemini run.
        $currentMonth = $this->currentSemesterKey();
        $studentDataForDummy = [
            'name' => $dashboardData['studentArabicName'] ?? ($student->arabic_name ?? 'الطالب'),
            'gpa' => $dashboardData['gpa'] ?? ($student->gpa ?? 0),
            'attendance_rate' => $dashboardData['attendanceRate'] ?? ($student->attendance_rate ?? 0),
            'game_attempts' => $dashboardData['gameAttempts'] ?? ($student->game_attempts ?? 0),
        ];
        $recommendation = $this->createFallbackRecommendation($studentId, $currentMonth, $studentDataForDummy);

        // Prefer AI-generated career data on the recommendation; fall back to
        // the static major-keyed list only if AI didn't produce anything.
        $majorName = $profile['data']['profile']['major']['name'] ?? '';
        $majorNameEn = $profile['data']['profile']['major']['name_en'] ?? '';
        $aiCertifications = $recommendation->certifications ?? [];
        $aiInternships = $recommendation->internships ?? [];
        if (empty($aiCertifications) || empty($aiInternships)) {
            $careerData = $this->getMajorSpecificCareerData($majorName, $majorNameEn);
            $aiCertifications = ! empty($aiCertifications) ? $aiCertifications : $careerData['certifications'];
            $aiInternships = ! empty($aiInternships) ? $aiInternships : $careerData['internships'];
        }

        return view('qspark::student-recommendations', [
            'studentName' => $dashboardData['studentArabicName'] ?? 'الطالب',
            'recommendation' => $recommendation,
            'month' => Carbon::now('Asia/Riyadh')->locale(app()->getLocale())->translatedFormat('F Y'),
            'gpa' => $dashboardData['gpa'] ?? 0,
            'attendanceRate' => $dashboardData['attendanceRate'] ?? 0,
            'majorName' => $majorName,
            'majorNameEn' => $majorNameEn,
            'certifications' => $aiCertifications,
            'internships' => $aiInternships,
        ]);
    }

    /**
     * Get major-specific certifications and internships for Saudi market
     */
    private function getMajorSpecificCareerData($majorNameAr, $majorNameEn)
    {
        // Normalize major name for matching
        $majorKey = strtolower(trim($majorNameEn));

        $careerData = [
            // Accounting
            'accounting' => [
                'certifications' => [
                    ['title' => 'شهادة المحاسب القانوني المعتمد (CPA)', 'provider' => 'الجمعية الأمريكية للمحاسبين القانونيين - AICPA'],
                    ['title' => 'شهادة المحاسب الإداري المعتمد (CMA)', 'provider' => 'معهد المحاسبين الإداريين - IMA'],
                    ['title' => 'شهادة المراجع الداخلي المعتمد (CIA)', 'provider' => 'معهد المراجعين الداخليين - IIA'],
                    ['title' => 'شهادة SOCPA - الهيئة السعودية للمراجعين والمحاسبين', 'provider' => 'الهيئة السعودية للمراجعين والمحاسبين'],
                    ['title' => 'شهادة المحلل المالي المعتمد (CFA)', 'provider' => 'معهد المحللين الماليين - CFA Institute'],
                ],
                'internships' => [
                    ['title' => 'تدريب في شركات المراجعة الكبرى', 'company' => 'ديلويت، KPMG، EY، PwC السعودية', 'duration' => 'تدريب صيفي 3 أشهر'],
                    ['title' => 'برامج تدريب في البنوك السعودية', 'company' => 'البنك الأهلي، الراجحي، بنك الرياض', 'duration' => 'تدريب تعاوني 6 أشهر'],
                    ['title' => 'تدريب في أرامكو السعودية - قسم المالية', 'company' => 'أرامكو السعودية', 'duration' => '3-6 أشهر'],
                    ['title' => 'فرص تدريب في هيئة الزكاة والضريبة والجمارك', 'company' => 'هيئة الزكاة والضريبة والجمارك', 'duration' => 'تدريب فصلي'],
                    ['title' => 'برنامج التدريب في مؤسسة النقد العربي السعودي (ساما)', 'company' => 'البنك المركزي السعودي - ساما', 'duration' => 'تدريب صيفي'],
                ],
            ],
            // Business Administration
            'business administration' => [
                'certifications' => [
                    ['title' => 'شهادة إدارة المشاريع الاحترافية (PMP)', 'provider' => 'معهد إدارة المشاريع - PMI'],
                    ['title' => 'شهادة Six Sigma Green/Black Belt', 'provider' => 'المعهد الأمريكي للجودة - ASQ'],
                    ['title' => 'شهادة محترف الموارد البشرية (PHR/SPHR)', 'provider' => 'معهد الموارد البشرية - HRCI'],
                    ['title' => 'شهادات جوجل الاحترافية في إدارة الأعمال', 'provider' => 'Google Professional Certificates'],
                    ['title' => 'شهادة محلل الأعمال المعتمد (CBAP)', 'provider' => 'المعهد الدولي لتحليل الأعمال - IIBA'],
                ],
                'internships' => [
                    ['title' => 'برامج تدريب في الشركات الاستشارية', 'company' => 'ماكنزي، بوسطن كونسلتينج، بين آند كومباني', 'duration' => 'تدريب صيفي'],
                    ['title' => 'تدريب في صندوق الاستثمارات العامة (PIF)', 'company' => 'صندوق الاستثمارات العامة', 'duration' => '6 أشهر'],
                    ['title' => 'فرص تدريب في سابك - قسم التخطيط الاستراتيجي', 'company' => 'سابك', 'duration' => 'تدريب تعاوني'],
                    ['title' => 'برنامج تدريب في شركة الاتصالات السعودية STC', 'company' => 'STC - قسم إدارة الأعمال', 'duration' => '3-6 أشهر'],
                    ['title' => 'تدريب في الغرف التجارية السعودية', 'company' => 'الغرفة التجارية بالرياض/جدة', 'duration' => 'تدريب فصلي'],
                ],
            ],
            // Computer Science / IT
            'computer science' => [
                'certifications' => [
                    ['title' => 'شهادات AWS المعتمدة (Solutions Architect, Developer)', 'provider' => 'Amazon Web Services'],
                    ['title' => 'شهادات Microsoft Azure (AZ-900, AZ-104)', 'provider' => 'Microsoft'],
                    ['title' => 'شهادة مطور جافا المعتمد (OCP)', 'provider' => 'Oracle'],
                    ['title' => 'شهادات أمن المعلومات (CISSP, CEH, CompTIA Security+)', 'provider' => 'ISC2, EC-Council, CompTIA'],
                    ['title' => 'شهادات جوجل في تحليل البيانات والذكاء الاصطناعي', 'provider' => 'Google Professional Certificates'],
                ],
                'internships' => [
                    ['title' => 'تدريب في شركات التقنية السعودية', 'company' => 'STC Solutions، موبايلي للحلول الرقمية', 'duration' => 'تدريب تعاوني 6 أشهر'],
                    ['title' => 'برنامج تدريب في أرامكو السعودية - قسم تقنية المعلومات', 'company' => 'أرامكو السعودية', 'duration' => '3-6 أشهر'],
                    ['title' => 'فرص تدريب في الهيئة السعودية للبيانات والذكاء الاصطناعي (SDAIA)', 'company' => 'SDAIA', 'duration' => 'تدريب صيفي'],
                    ['title' => 'تدريب في شركات التقنية الناشئة', 'company' => 'حاضنات ومسرعات الأعمال التقنية', 'duration' => 'تدريب مرن'],
                    ['title' => 'برنامج تدريب في البنوك - قسم الأمن السيبراني', 'company' => 'البنك الأهلي، الراجحي - قسم IT', 'duration' => 'تدريب فصلي'],
                ],
            ],
            // Engineering
            'engineering' => [
                'certifications' => [
                    ['title' => 'شهادة المهندس المحترف (PE)', 'provider' => 'الهيئة السعودية للمهندسين'],
                    ['title' => 'شهادة إدارة المشاريع الاحترافية (PMP)', 'provider' => 'معهد إدارة المشاريع - PMI'],
                    ['title' => 'شهادات AutoCAD و Revit المعتمدة', 'provider' => 'Autodesk'],
                    ['title' => 'شهادة Six Sigma Green Belt', 'provider' => 'ASQ'],
                    ['title' => 'شهادات الطاقة المتجددة والاستدامة', 'provider' => 'LEED, NABCEP'],
                ],
                'internships' => [
                    ['title' => 'تدريب في أرامكو السعودية - الهندسة', 'company' => 'أرامكو السعودية', 'duration' => '6 أشهر'],
                    ['title' => 'برامج تدريب في سابك - قسم الهندسة', 'company' => 'سابك', 'duration' => 'تدريب تعاوني'],
                    ['title' => 'فرص تدريب في شركة الكهرباء السعودية', 'company' => 'الشركة السعودية للكهرباء', 'duration' => '3-6 أشهر'],
                    ['title' => 'تدريب في شركات المقاولات الكبرى', 'company' => 'السيف، بن لادن، العمودي', 'duration' => 'تدريب صيفي'],
                    ['title' => 'برنامج تدريب في مشاريع نيوم والقدية', 'company' => 'نيوم، القدية، البحر الأحمر', 'duration' => 'تدريب فصلي'],
                ],
            ],
            // Marketing
            'marketing' => [
                'certifications' => [
                    ['title' => 'شهادة جوجل في التسويق الرقمي', 'provider' => 'Google Digital Marketing Certificate'],
                    ['title' => 'شهادة HubSpot في التسويق الداخلي', 'provider' => 'HubSpot Academy'],
                    ['title' => 'شهادة فيسبوك المعتمدة في الإعلانات', 'provider' => 'Meta Blueprint'],
                    ['title' => 'شهادة محترف التسويق الرقمي (CDMP)', 'provider' => 'Digital Marketing Institute'],
                    ['title' => 'شهادات تحليلات جوجل (Google Analytics)', 'provider' => 'Google'],
                ],
                'internships' => [
                    ['title' => 'تدريب في وكالات التسويق والإعلان', 'company' => 'FP7، Webedia Arabia، Havas', 'duration' => 'تدريب صيفي'],
                    ['title' => 'برامج تدريب في شركات التجارة الإلكترونية', 'company' => 'نون، جرير، إكسترا', 'duration' => '3-6 أشهر'],
                    ['title' => 'فرص تدريب في STC - قسم التسويق', 'company' => 'STC، موبايلي، زين', 'duration' => 'تدريب تعاوني'],
                    ['title' => 'تدريب في الشركات الكبرى - إدارة التسويق', 'company' => 'أرامكو، سابك، معادن', 'duration' => 'تدريب فصلي'],
                    ['title' => 'برنامج تدريب في منصات التواصل الاجتماعي', 'company' => 'شركات إدارة المحتوى الرقمي', 'duration' => 'تدريب مرن'],
                ],
            ],
        ];

        // Try to match the major
        foreach ($careerData as $key => $data) {
            if (str_contains($majorKey, $key) || str_contains($key, $majorKey)) {
                return $data;
            }
        }

        // Check Arabic name as well
        $majorKeyAr = trim($majorNameAr);
        if (str_contains($majorKeyAr, 'محاسبة')) {
            return $careerData['accounting'];
        } elseif (str_contains($majorKeyAr, 'إدارة') || str_contains($majorKeyAr, 'أعمال')) {
            return $careerData['business administration'];
        } elseif (str_contains($majorKeyAr, 'حاسب') || str_contains($majorKeyAr, 'تقنية') || str_contains($majorKeyAr, 'معلومات')) {
            return $careerData['computer science'];
        } elseif (str_contains($majorKeyAr, 'هندسة')) {
            return $careerData['engineering'];
        } elseif (str_contains($majorKeyAr, 'تسويق')) {
            return $careerData['marketing'];
        }

        // Default fallback - general business certifications
        return [
            'certifications' => [
                ['title' => 'شهادة إدارة المشاريع الاحترافية (PMP)', 'provider' => 'معهد إدارة المشاريع - PMI'],
                ['title' => 'شهادات مايكروسوفت المعتمدة', 'provider' => 'Microsoft Certifications'],
                ['title' => 'شهادة المحلل المالي المعتمد (CFA)', 'provider' => 'معهد المحللين الماليين - CFA Institute'],
                ['title' => 'شهادات جوجل الاحترافية', 'provider' => 'Google Professional Certificates'],
                ['title' => 'شهادة محترف الموارد البشرية (PHR/SPHR)', 'provider' => 'معهد الموارد البشرية - HRCI'],
            ],
            'internships' => [
                ['title' => 'فرص تدريب في الشركات الكبرى', 'company' => 'أرامكو، سابك، معادن', 'duration' => '3-6 أشهر'],
                ['title' => 'برامج تدريب في المؤسسات المالية', 'company' => 'البنك الأهلي، الراجحي، بنك الرياض', 'duration' => 'تدريب صيفي'],
                ['title' => 'تدريب في شركات الاتصالات', 'company' => 'STC، موبايلي، زين السعودية', 'duration' => 'تدريب فصلي'],
                ['title' => 'فرص تدريب في المؤسسات الحكومية', 'company' => 'الوزارات والهيئات الحكومية', 'duration' => 'تدريب سنوي'],
                ['title' => 'برامج تدريب في الشركات الاستشارية', 'company' => 'ديلويت، PwC، KPMG، EY', 'duration' => 'تدريب صيفي'],
            ],
        ];
    }

    /**
     * Regenerate recommendations for current month
     */
    public function regenerateRecommendations(Request $request)
    {
        if (! $this->token) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Get student profile
        $profile = $this->getStudentProfile();
        if (! $profile) {
            return response()->json(['error' => 'Failed to get student profile'], 500);
        }

        $studentId = $profile['data']['id'] ?? auth()->user()->uuid;

        // Get or create student record
        $student = Student::where('student_id', $studentId)->first();
        if (! $student) {
            $student = Student::updateOrCreateStudent([
                'student_id' => $studentId,
                'arabic_name' => $profile['data']['profile']['name'] ?? '',
                'english_name' => $profile['data']['profile']['name_en'] ?? '',
                'email' => $profile['data']['profile']['email'] ?? '',
                'gender' => $profile['data']['profile']['gender'] ?? null,
                'gpa' => $profile['data']['academic']['lastRecordedGpa'] ?? 0,
                'attendance_rate' => 0,
            ]);
        }

        // Delete existing recommendation for current month
        $currentMonth = $this->currentSemesterKey();
        StudentMonthlyRecommendation::where('student_id', $studentId)
            ->where('month', $currentMonth)
            ->delete();

        // Get dashboard data for AI analysis
        $dashboardData = $this->getDashboardData();

        // Demo mode: regenerate the complete, fully-Arabic dummy recommendation
        // rather than calling the live AI (keeps every section populated).
        $studentDataForDummy = [
            'name' => $dashboardData['studentArabicName'] ?? ($student->arabic_name ?? 'الطالب'),
            'gpa' => $dashboardData['gpa'] ?? ($student->gpa ?? 0),
            'attendance_rate' => $dashboardData['attendanceRate'] ?? ($student->attendance_rate ?? 0),
            'game_attempts' => $dashboardData['gameAttempts'] ?? ($student->game_attempts ?? 0),
        ];
        $recommendation = $this->createFallbackRecommendation($studentId, $currentMonth, $studentDataForDummy);

        return response()->json([
            'success' => true,
            'message' => 'تم إعادة توليد التوصيات بنجاح',
            'redirect' => route('qspark.dashboard.student.recommendations'),
        ]);
    }

    /**
     * Fetch comprehensive student data from all available API endpoints
     */
    private function fetchComprehensiveStudentData($studentId, $dashboardData, $student)
    {
        $comprehensiveData = [
            // Basic Info
            'name' => $dashboardData['studentArabicName'] ?? 'الطالب',
            'gpa' => $dashboardData['gpa'] ?? 0,
            'attendance_rate' => $dashboardData['attendanceRate'] ?? 0,
            'total_study_hours' => $student->total_study_hours ?? 0,
            'game_attempts' => $student->game_attempts ?? 0,
            'game_points' => $student->game_points ?? 0,
            'upcoming_exams' => count($dashboardData['finalExamsCourses'] ?? []),
            'attendance_details' => $dashboardData['attendanceDetails'] ?? [],
        ];

        try {
            // 1. Student Skills
            $skillsData = $this->callApiWithToken("/skills/student/{$studentId}");
            $comprehensiveData['skills'] = $skillsData['data'] ?? [];
            $comprehensiveData['skills_count'] = count($comprehensiveData['skills']);

            // 2. Student Academic Plan
            $profile = $this->getStudentProfile();
            $majorNo = $profile['data']['academic']['major'] ?? null;
            if ($majorNo) {
                $academicPlan = $this->callApiWithToken("/academic_plan/{$majorNo}");
                $comprehensiveData['academic_plan'] = $academicPlan['data'] ?? [];
                $comprehensiveData['major'] = $majorNo;
            }

            // 3. Student Courses (Current Semester)
            $courses = $this->callApiWithToken('/student/courses');
            $comprehensiveData['current_courses'] = $courses['data'] ?? [];
            $comprehensiveData['current_courses_count'] = count($comprehensiveData['current_courses']);

            // 4. Academic Transactions
            $transactions = $this->callApiWithToken('/student-academic-transactions');
            $comprehensiveData['academic_transactions'] = $transactions['data'] ?? [];

            // 5. Rewards
            $rewards = $this->callApiWithToken('/rewards');
            $comprehensiveData['rewards'] = $rewards['data'] ?? [];
            $comprehensiveData['rewards_count'] = count($comprehensiveData['rewards']);

            // 6. Academic Advisor
            $advisor = $this->callApiWithToken('/academic-advisor');
            $comprehensiveData['academic_advisor'] = $advisor['data'] ?? null;

            // 7. Absences with Details
            $absences = $this->callApiWithToken('/absences-with-details');
            $comprehensiveData['absences'] = $absences['data'] ?? [];
            $comprehensiveData['total_absences'] = count($comprehensiveData['absences']);

            // 8. Time Table
            $timeTable = $this->callApiWithToken('/time-table');
            $comprehensiveData['time_table'] = $timeTable['data'] ?? [];
            $comprehensiveData['weekly_classes_count'] = count($comprehensiveData['time_table']);

            // 9. Blackboard Announcements
            $announcements = Http::withToken($this->token)
                ->get($this->getApiBaseUrl().'/api/v2/blackboard/announcements');
            if ($announcements->successful()) {
                $comprehensiveData['blackboard_announcements'] = $announcements->json()['data'] ?? [];
                $comprehensiveData['announcements_count'] = count($comprehensiveData['blackboard_announcements']);
            }

            // 10. Calculate additional metrics
            $comprehensiveData['courses_with_low_attendance'] = $this->calculateLowAttendanceCourses($comprehensiveData['attendance_details']);
            $comprehensiveData['study_load'] = $this->calculateStudyLoad($comprehensiveData['current_courses'], $comprehensiveData['time_table']);

        } catch (\Exception $e) {
            Log::error('Error fetching comprehensive student data', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
            ]);
        }

        return $comprehensiveData;
    }

    /**
     * Calculate courses with low attendance
     */
    private function calculateLowAttendanceCourses($attendanceDetails)
    {
        $lowAttendanceCourses = [];
        foreach ($attendanceDetails as $course) {
            $attendanceRate = $course['attendance_rate'] ?? 100;
            if ($attendanceRate < 75) {
                $lowAttendanceCourses[] = [
                    'course_name' => $course['course_name'] ?? 'Unknown',
                    'attendance_rate' => $attendanceRate,
                ];
            }
        }

        return $lowAttendanceCourses;
    }

    /**
     * Calculate study load based on courses and schedule
     */
    private function calculateStudyLoad($courses, $timeTable)
    {
        $totalCredits = 0;
        foreach ($courses as $course) {
            $totalCredits += $course['credit_hours'] ?? 0;
        }

        $weeklyClassHours = count($timeTable);

        return [
            'total_credits' => $totalCredits,
            'weekly_class_hours' => $weeklyClassHours,
            'estimated_study_hours' => $totalCredits * 3, // Rule of thumb: 3 hours per credit
            'load_level' => $totalCredits >= 18 ? 'high' : ($totalCredits >= 15 ? 'medium' : 'low'),
        ];
    }

    /**
     * Generate monthly recommendations using Gemini API
     */
    private function generateMonthlyRecommendations($studentId, $dashboardData, $student)
    {
        $currentMonth = $this->currentSemesterKey();

        // Check if recommendation already exists for this month
        $existingRecommendation = StudentMonthlyRecommendation::where('student_id', $studentId)
            ->where('month', $currentMonth)
            ->first();

        if ($existingRecommendation) {
            Log::info('Using existing monthly recommendation', [
                'student_id' => $studentId,
                'month' => $currentMonth,
            ]);

            return $existingRecommendation;
        }

        // Fetch comprehensive student data from all API endpoints
        $studentDataForAI = $this->fetchComprehensiveStudentData($studentId, $dashboardData, $student);

        // Create bilingual prompt for Gemini (Arabic + English)
        $prompt = $this->createBilingualRecommendationPrompt($studentDataForAI);

        try {
            // Call Gemini API
            $geminiApiKey = config('services.gemini.api_key', 'AIzaSyCzowQYyrHS23OL76M07UBzLh75BjHeV18');

            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'x-goog-api-key' => $geminiApiKey,
                ])
                ->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent', [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt],
                            ],
                        ],
                    ],
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $aiResponse = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

                // Parse AI response (expecting JSON format)
                $parsedResponse = $this->parseAIResponse($aiResponse);

                // Create recommendation record
                $recommendation = StudentMonthlyRecommendation::create([
                    'student_id' => $studentId,
                    'month' => $currentMonth,
                    'recommendations' => $parsedResponse['recommendations'] ?? [],
                    'treatment_plans' => $parsedResponse['treatment_plans'] ?? [],
                    'tips' => $parsedResponse['tips'] ?? [],
                    'strengths' => $parsedResponse['strengths'] ?? [],
                    'weaknesses' => $parsedResponse['weaknesses'] ?? [],
                    'predicted_gpa' => $parsedResponse['predicted_gpa'] ?? null,
                    'timeline_roadmap' => $parsedResponse['timeline_roadmap'] ?? [],
                    'certifications' => $parsedResponse['certifications'] ?? [],
                    'internships' => $parsedResponse['internships'] ?? [],
                    'student_data' => $studentDataForAI,
                    'generated_at' => Carbon::now('Asia/Riyadh'),
                ]);

                Log::info('Generated monthly recommendations', [
                    'student_id' => $studentId,
                    'month' => $currentMonth,
                ]);

                return $recommendation;
            } else {
                Log::error('Gemini API failed', ['status' => $response->status()]);

                return $this->createFallbackRecommendation($studentId, $currentMonth, $studentDataForAI);
            }
        } catch (\Exception $e) {
            Log::error('Error generating recommendations', ['error' => $e->getMessage()]);

            return $this->createFallbackRecommendation($studentId, $currentMonth, $studentDataForAI);
        }
    }

    /**
     * Create prompt for QU AI
     */
    private function createRecommendationPrompt($studentData)
    {
        // Build comprehensive student profile
        $skillsInfo = isset($studentData['skills_count']) ? "عدد المهارات المكتسبة: {$studentData['skills_count']}" : '';
        $coursesInfo = isset($studentData['current_courses_count']) ? "عدد المواد الحالية: {$studentData['current_courses_count']}" : '';
        $rewardsInfo = isset($studentData['rewards_count']) ? "عدد الجوائز والإنجازات: {$studentData['rewards_count']}" : '';
        $absencesInfo = isset($studentData['total_absences']) ? "عدد الغيابات: {$studentData['total_absences']}" : '';
        $studyLoadInfo = isset($studentData['study_load']) ? "الحمل الدراسي: {$studentData['study_load']['load_level']} ({$studentData['study_load']['total_credits']} ساعة معتمدة)" : '';
        $lowAttendanceInfo = isset($studentData['courses_with_low_attendance']) && count($studentData['courses_with_low_attendance']) > 0
            ? 'مواد بحضور منخفض: '.count($studentData['courses_with_low_attendance'])
            : '';

        return "أنت مستشار أكاديمي متخصص في جامعة قطر مع خبرة 15 سنة في التخطيط الأكاديمي والتطوير الشخصي. قم بتحليل بيانات الطالب التالية بعمق وقدم خطة شاملة ومفصلة باللغة العربية.

📊 بيانات الطالب الأساسية:
- الاسم: {$studentData['name']}
- المعدل التراكمي: {$studentData['gpa']} من 5.0
- نسبة الحضور العامة: {$studentData['attendance_rate']}%
- ساعات الدراسة الإجمالية: {$studentData['total_study_hours']} ساعة
- محاولات الألعاب التعليمية: {$studentData['game_attempts']}
- النقاط المكتسبة: {$studentData['game_points']}
- عدد الاختبارات القادمة: {$studentData['upcoming_exams']}

  البيانات الأكاديمية المتقدمة:
{$coursesInfo}
{$studyLoadInfo}
{$absencesInfo}
{$lowAttendanceInfo}

🏆 الإنجازات والمهارات:
{$skillsInfo}
{$rewardsInfo}

⚠️ نقاط تحتاج انتباه:
".(isset($studentData['courses_with_low_attendance']) && count($studentData['courses_with_low_attendance']) > 0
    ? '- يوجد '.count($studentData['courses_with_low_attendance'])." مواد بحضور أقل من 75%\n"
    : "- الحضور جيد في جميع المواد\n").'
'.(isset($studentData['study_load']['load_level']) && $studentData['study_load']['load_level'] === 'high'
    ? "- الحمل الدراسي مرتفع، يحتاج إدارة وقت دقيقة\n"
    : '').'
'.(($studentData['gpa'] ?? 0) < 3.0
    ? "- المعدل التراكمي يحتاج تحسين عاجل\n"
    : '').'

قدم الإجابة بصيغة JSON فقط بدون أي نص إضافي، بالشكل التالي:

{
  "recommendations": [
    "نصيحة استراتيجية 1 مع تفاصيل التنفيذ",
    "نصيحة استراتيجية 2 مع تفاصيل التنفيذ",
    "نصيحة استراتيجية 3 مع تفاصيل التنفيذ",
    "نصيحة استراتيجية 4 مع تفاصيل التنفيذ"
  ],
  "treatment_plans": [
    "خطة علاجية تفصيلية 1 مع خطوات واضحة",
    "خطة علاجية تفصيلية 2 مع خطوات واضحة",
    "خطة علاجية تفصيلية 3 مع خطوات واضحة"
  ],
  "tips": [
    "نصيحة عملية 1",
    "نصيحة عملية 2",
    "نصيحة عملية 3",
    "نصيحة عملية 4"
  ],
  "learning_paths": [
    {
      "title": "مسار تحسين المعدل التراكمي",
      "description": "خطة شاملة لرفع المعدل خلال الفصل الدراسي",
      "duration": "4 أشهر",
      "steps": [
        "الخطوة 1: تحديد المواد الضعيفة",
        "الخطوة 2: وضع جدول مراجعة يومي",
        "الخطوة 3: الاستفادة من الساعات المكتبية",
        "الخطوة 4: تكوين مجموعات دراسية"
      ]
    },
    {
      "title": "مسار تطوير مهارات الدراسة",
      "description": "تحسين تقنيات الدراسة والاستيعاب",
      "duration": "شهرين",
      "steps": [
        "الخطوة 1: تعلم تقنية بومودورو",
        "الخطوة 2: تطبيق الخرائط الذهنية",
        "الخطوة 3: ممارسة الاسترجاع النشط"
      ]
    }
  ],
  "weekly_plans": [
    {
      "week": 1,
      "focus": "التقييم والتخطيط",
      "tasks": [
        "مراجعة جميع المواد وتحديد نقاط الضعف",
        "إنشاء جدول دراسي أسبوعي",
        "تحديد أهداف SMART لكل مادة"
      ],
      "expected_hours": 15
    },
    {
      "week": 2,
      "focus": "البدء في التنفيذ",
      "tasks": [
        "البدء بمراجعة المواد الضعيفة",
        "حضور جميع المحاضرات والتفاعل",
        "حل 50% من التمارين المطلوبة"
      ],
      "expected_hours": 20
    },
    {
      "week": 3,
      "focus": "التعمق والممارسة",
      "tasks": [
        "حل تمارين إضافية",
        "المشاركة في مجموعات دراسية",
        "مراجعة الملاحظات يومياً"
      ],
      "expected_hours": 22
    },
    {
      "week": 4,
      "focus": "المراجعة والتقييم",
      "tasks": [
        "مراجعة شاملة لجميع المواد",
        "حل اختبارات تجريبية",
        "تقييم التقدم وتعديل الخطة"
      ],
      "expected_hours": 25
    }
  ],
  "goals": [
    {
      "type": "monthly",
      "category": "academic",
      "description": "رفع المعدل التراكمي إلى 3.8 أو أعلى",
      "target_value": 3.8,
      "timeline": "نهاية الفصل الدراسي",
      "action_steps": [
        "دراسة 3 ساعات يومياً",
        "حضور جميع المحاضرات",
        "حل جميع الواجبات في وقتها"
      ]
    },
    {
      "type": "monthly",
      "category": "attendance",
      "description": "الوصول إلى نسبة حضور 95% أو أعلى",
      "target_value": 95,
      "timeline": "نهاية الشهر",
      "action_steps": [
        "وضع تنبيهات للمحاضرات",
        "النوم مبكراً",
        "تجهيز الحقيبة من الليلة السابقة"
      ]
    },
    {
      "type": "weekly",
      "category": "study_hours",
      "description": "دراسة 20 ساعة أسبوعياً على الأقل",
      "target_value": 20,
      "timeline": "كل أسبوع",
      "action_steps": [
        "تخصيص 3 ساعات يومياً",
        "استخدام تقنية بومودورو",
        "تتبع الساعات في تطبيق"
      ]
    }
  ],
  "strengths": [
    "نقطة قوة 1 بناءً على البيانات",
    "نقطة قوة 2 بناءً على البيانات",
    "نقطة قوة 3 بناءً على البيانات"
  ],
  "weaknesses": [
    "نقطة ضعف 1 مع اقتراح للتحسين",
    "نقطة ضعف 2 مع اقتراح للتحسين",
    "نقطة ضعف 3 مع اقتراح للتحسين"
  ],
  "improvement_areas": [
    "مجال تحسين 1: [وصف تفصيلي]",
    "مجال تحسين 2: [وصف تفصيلي]",
    "مجال تحسين 3: [وصف تفصيلي]"
  ],
  "recommended_resources": [
    {
      "type": "video",
      "title": "دورة تقنيات الدراسة الفعالة",
      "description": "تعلم أفضل الطرق للدراسة والاستيعاب",
      "link": "يوتيوب أو منصة تعليمية"
    },
    {
      "type": "book",
      "title": "كتاب إدارة الوقت للطلاب",
      "description": "استراتيجيات عملية لتنظيم الوقت",
      "link": "مكتبة الجامعة"
    },
    {
      "type": "app",
      "title": "تطبيق Forest للتركيز",
      "description": "تطبيق يساعد على التركيز وتجنب المشتتات",
      "link": "متجر التطبيقات"
    }
  ],
  "study_techniques": [
    {
      "name": "تقنية بومودورو",
      "description": "25 دقيقة دراسة مركزة + 5 دقائق راحة",
      "benefits": "تحسين التركيز وتقليل الإرهاق"
    },
    {
      "name": "الاسترجاع النشط",
      "description": "محاولة تذكر المعلومات بدون النظر للملاحظات",
      "benefits": "تثبيت المعلومات في الذاكرة طويلة المدى"
    },
    {
      "name": "الخرائط الذهنية",
      "description": "رسم مخططات بصرية للمفاهيم والعلاقات",
      "benefits": "فهم أعمق وربط المعلومات"
    }
  ],
  "timeline_roadmap": {
    "one_week": {
      "title": "خطة الأسبوع القادم",
      "goals": [
        "حضور جميع المحاضرات والتفاعل فيها",
        "مراجعة ملاحظات كل محاضرة في نفس اليوم",
        "حل 50% من الواجبات المطلوبة"
      ],
      "focus_areas": ["الحضور", "المراجعة اليومية", "الواجبات"]
    },
    "one_month": {
      "title": "خطة الشهر القادم",
      "goals": [
        "رفع المعدل التراكمي بمقدار 0.2 نقطة",
        "إكمال جميع الواجبات في وقتها",
        "تحسين نسبة الحضور إلى 95%",
        "لعب 10 ألعاب تعليمية على الأقل"
      ],
      "focus_areas": ["تحسين المعدل", "الالتزام", "التفاعل مع المنصة"]
    },
    "six_months": {
      "title": "خطة الستة أشهر القادمة",
      "goals": [
        "رفع المعدل التراكمي إلى 4.5 أو أعلى",
        "إتقان جميع المواد الأساسية في التخصص",
        "المشاركة في مشروع بحثي أو تطوعي",
        "بناء شبكة علاقات مع الأساتذة والزملاء"
      ],
      "focus_areas": ["التميز الأكاديمي", "المشاريع", "التواصل"]
    },
    "one_year": {
      "title": "خطة السنة القادمة",
      "goals": [
        "الحفاظ على معدل تراكمي ممتاز (4.5+)",
        "إكمال 75% من ساعات التخصص",
        "الحصول على تدريب صيفي في مجال التخصص",
        "تطوير مهارات إضافية (لغة، برمجة، إلخ)"
      ],
      "focus_areas": ["الاستمرارية", "التدريب العملي", "تطوير المهارات"]
    },
    "pre_graduation": {
      "title": "خطة ما قبل التخرج",
      "goals": [
        "إكمال جميع متطلبات التخرج بنجاح",
        "تحقيق معدل تراكمي نهائي 4.5 أو أعلى",
        "إعداد مشروع التخرج بجودة عالية",
        "البحث عن فرص عمل أو دراسات عليا",
        "بناء سيرة ذاتية قوية وملف إنجازات"
      ],
      "focus_areas": ["التخرج بتميز", "التخطيط المهني", "الإنجازات"]
    }
  },
  "predicted_gpa": 3.9
}

📌 متطلبات مهمة:
1. حلل البيانات بعمق وقدم توصيات مخصصة بناءً على الأداء الفعلي والبيانات الشاملة المتوفرة
2. استخدم بيانات المهارات والإنجازات لتحديد نقاط القوة
3. استخدم بيانات الحضور والغيابات لتحديد المواد التي تحتاج اهتمام
4. استخدم الحمل الدراسي لتقييم قدرة الطالب على التحمل
5. اجعل الخطط عملية وقابلة للتنفيذ مع خطوات واضحة
6. ضع أهداف SMART (محددة، قابلة للقياس، قابلة للتحقيق، ذات صلة، محددة بوقت)
7. قدم مسارات تعليمية متدرجة من السهل للصعب
8. اقترح موارد حقيقية ومفيدة (كتب، فيديوهات، تطبيقات)
9. كن إيجابياً ومحفزاً في الصياغة
10. ركز على التحسين المستمر والنمو الشخصي
11. في خطط Timeline، كن واقعياً ومحدداً بناءً على الوضع الحالي للطالب
12. إذا كان الطالب لديه مواد بحضور منخفض، ضع خطة عاجلة لتحسين الحضور
13. إذا كان الحمل الدراسي مرتفع، ركز على تقنيات إدارة الوقت والأولويات
14. استخدم الجوائز والإنجازات كمحفز وقدم خطط للحصول على المزيد';
    }

    /**
     * Create bilingual prompt for QU AI (Arabic + English)
     */
    private function createBilingualRecommendationPrompt($studentData)
    {
        // Build comprehensive student profile
        $skillsInfo = isset($studentData['skills_count']) ? "عدد المهارات المكتسبة: {$studentData['skills_count']}" : '';
        $coursesInfo = isset($studentData['current_courses_count']) ? "عدد المواد الحالية: {$studentData['current_courses_count']}" : '';
        $rewardsInfo = isset($studentData['rewards_count']) ? "عدد الجوائز والإنجازات: {$studentData['rewards_count']}" : '';
        $absencesInfo = isset($studentData['total_absences']) ? "عدد الغيابات: {$studentData['total_absences']}" : '';
        $studyLoadInfo = isset($studentData['study_load']) ? "الحمل الدراسي: {$studentData['study_load']['load_level']} ({$studentData['study_load']['total_credits']} ساعة معتمدة)" : '';
        $lowAttendanceInfo = isset($studentData['courses_with_low_attendance']) && count($studentData['courses_with_low_attendance']) > 0
            ? 'مواد بحضور منخفض: '.count($studentData['courses_with_low_attendance'])
            : '';

        return "أنت مستشار أكاديمي متخصص في جامعة قطر مع خبرة 15 سنة. قم بتحليل بيانات الطالب وقدم خطة شاملة **بلغتين: العربية والإنجليزية**.

📊 بيانات الطالب:
- الاسم: {$studentData['name']}
- المعدل التراكمي: {$studentData['gpa']} من 5.0
- نسبة الحضور: {$studentData['attendance_rate']}%
- ساعات الدراسة: {$studentData['total_study_hours']} ساعة
- محاولات الألعاب: {$studentData['game_attempts']}
- النقاط: {$studentData['game_points']}
- اختبارات قادمة: {$studentData['upcoming_exams']}

  البيانات الأكاديمية:
{$coursesInfo}
{$studyLoadInfo}
{$absencesInfo}
{$lowAttendanceInfo}

🏆 الإنجازات:
{$skillsInfo}
{$rewardsInfo}

⚠️ نقاط تحتاج انتباه:
".(isset($studentData['courses_with_low_attendance']) && count($studentData['courses_with_low_attendance']) > 0
    ? '- يوجد '.count($studentData['courses_with_low_attendance'])." مواد بحضور أقل من 75%\n"
    : "- الحضور جيد\n").'
'.(isset($studentData['study_load']['load_level']) && $studentData['study_load']['load_level'] === 'high'
    ? "- الحمل الدراسي مرتفع\n"
    : '').'

� **متطلبات خاصة لخطة ما قبل التخرج**:
- في قسم "pre_graduation" من timeline_roadmap، يجب إضافة:
  1. **recommended_certifications**: شهادات احترافية مقترحة بناءً على تخصص الطالب واحتياجات سوق العمل في قطر والخليج (بلغتين)
  2. **internship_opportunities**: فرص تدريب عملي مفيدة تدعم الطالب في مجال تخصصه (بلغتين)
- اقترح شهادات معترف بها دولياً ومطلوبة في السوق
- اقترح فرص تدريب في شركات ومؤسسات قطرية وخليجية

�🎯 **مهم جداً**: قدم الإجابة بصيغة JSON فقط، مع **جميع النصوص بلغتين** (ar و en) كالتالي:

{
  "recommendations": {
    "ar": ["نصيحة 1 بالعربي", "نصيحة 2 بالعربي", "نصيحة 3 بالعربي"],
    "en": ["Recommendation 1 in English", "Recommendation 2 in English", "Recommendation 3 in English"]
  },
  "treatment_plans": {
    "ar": ["خطة علاجية 1", "خطة علاجية 2"],
    "en": ["Treatment plan 1", "Treatment plan 2"]
  },
  "tips": {
    "ar": ["نصيحة 1", "نصيحة 2", "نصيحة 3"],
    "en": ["Tip 1", "Tip 2", "Tip 3"]
  },
  "strengths": {
    "ar": ["نقطة قوة 1", "نقطة قوة 2", "نقطة قوة 3"],
    "en": ["Strength 1", "Strength 2", "Strength 3"]
  },
  "weaknesses": {
    "ar": ["نقطة ضعف 1", "نقطة ضعف 2"],
    "en": ["Weakness 1", "Weakness 2"]
  },
  "learning_paths": [
    {
      "title": {"ar": "مسار تحسين المعدل", "en": "GPA Improvement Path"},
      "description": {"ar": "خطة شاملة لرفع المعدل", "en": "Comprehensive plan to improve GPA"},
      "duration": {"ar": "4 أشهر", "en": "4 months"},
      "steps": {
        "ar": ["الخطوة 1", "الخطوة 2", "الخطوة 3"],
        "en": ["Step 1", "Step 2", "Step 3"]
      }
    }
  ],
  "weekly_plans": [
    {
      "week": 1,
      "focus": {"ar": "التركيز على الحضور", "en": "Focus on attendance"},
      "tasks": {
        "ar": ["مهمة 1", "مهمة 2"],
        "en": ["Task 1", "Task 2"]
      },
      "expected_hours": 15
    }
  ],
  "goals": [
    {
      "title": {"ar": "رفع المعدل إلى 4.0", "en": "Raise GPA to 4.0"},
      "target": {"ar": "4.0 من 5.0", "en": "4.0 out of 5.0"},
      "deadline": {"ar": "نهاية الفصل", "en": "End of semester"},
      "action_steps": {
        "ar": ["خطوة 1", "خطوة 2"],
        "en": ["Step 1", "Step 2"]
      }
    }
  ],
  "improvement_areas": {
    "ar": ["مجال 1", "مجال 2"],
    "en": ["Area 1", "Area 2"]
  },
  "recommended_resources": [
    {
      "title": {"ar": "كتاب إدارة الوقت", "en": "Time Management Book"},
      "type": "book",
      "description": {"ar": "وصف بالعربي", "en": "Description in English"},
      "link": "https://example.com"
    }
  ],
  "study_techniques": [
    {
      "name": {"ar": "تقنية بومودورو", "en": "Pomodoro Technique"},
      "description": {"ar": "وصف التقنية", "en": "Technique description"},
      "benefits": {"ar": "الفوائد", "en": "Benefits"}
    }
  ],
  "certifications": [
    {
      "title": {"ar": "شهادة إدارة المشاريع PMP", "en": "PMP Project Management Certification"},
      "provider": {"ar": "معهد إدارة المشاريع", "en": "Project Management Institute"},
      "duration": {"ar": "3-6 أشهر", "en": "3-6 months"},
      "benefits": {"ar": "تحسين مهارات القيادة والإدارة", "en": "Improve leadership and management skills"},
      "link": "https://www.pmi.org/certifications/project-management-pmp"
    }
  ],
  "internships": [
    {
      "title": {"ar": "تدريب في الشركات التقنية", "en": "Tech Company Internship"},
      "company": {"ar": "شركات قطر للتكنولوجيا", "en": "Qatar Technology Companies"},
      "duration": {"ar": "3 أشهر صيفية", "en": "3 months summer"},
      "benefits": {"ar": "خبرة عملية وتطوير مهارات", "en": "Practical experience and skill development"},
      "how_to_apply": {"ar": "التقديم عبر مركز التوظيف بالجامعة", "en": "Apply through university career center"}
    }
  ],
  "timeline_roadmap": {
    "one_week": {
      "title": {"ar": "خطة الأسبوع القادم", "en": "Next Week Plan"},
      "goals": {"ar": ["هدف 1", "هدف 2"], "en": ["Goal 1", "Goal 2"]},
      "focus_areas": {"ar": ["مجال 1", "مجال 2"], "en": ["Area 1", "Area 2"]}
    },
    "one_month": {
      "title": {"ar": "خطة الشهر القادم", "en": "Next Month Plan"},
      "goals": {"ar": ["هدف 1", "هدف 2"], "en": ["Goal 1", "Goal 2"]},
      "focus_areas": {"ar": ["مجال 1"], "en": ["Area 1"]}
    },
    "six_months": {
      "title": {"ar": "خطة 6 أشهر", "en": "6 Months Plan"},
      "goals": {"ar": ["هدف 1"], "en": ["Goal 1"]},
      "focus_areas": {"ar": ["مجال 1"], "en": ["Area 1"]}
    },
    "one_year": {
      "title": {"ar": "خطة السنة", "en": "One Year Plan"},
      "goals": {"ar": ["هدف 1"], "en": ["Goal 1"]},
      "focus_areas": {"ar": ["مجال 1"], "en": ["Area 1"]}
    },
    "pre_graduation": {
      "title": {"ar": "خطة ما قبل التخرج", "en": "Pre-Graduation Plan"},
      "goals": {"ar": ["هدف 1"], "en": ["Goal 1"]},
      "focus_areas": {"ar": ["مجال 1"], "en": ["Area 1"]},
      "recommended_certifications": {
        "ar": ["شهادة مقترحة 1 بناءً على التخصص", "شهادة مقترحة 2"],
        "en": ["Recommended certification 1 based on major", "Recommended certification 2"]
      },
      "internship_opportunities": {
        "ar": ["فرصة تدريب 1 في مجال التخصص", "فرصة تدريب 2"],
        "en": ["Internship opportunity 1 in major field", "Internship opportunity 2"]
      }
    }
  },
  "predicted_gpa": 4.2
}';
    }

    /**
     * Parse AI response from JSON
     */
    private function parseAIResponse($aiResponse)
    {
        // Try to extract JSON from response
        $jsonStart = strpos($aiResponse, '{');
        $jsonEnd = strrpos($aiResponse, '}');

        if ($jsonStart !== false && $jsonEnd !== false) {
            $jsonString = substr($aiResponse, $jsonStart, $jsonEnd - $jsonStart + 1);
            $parsed = json_decode($jsonString, true);

            if ($parsed) {
                // Ensure all required fields exist with defaults
                return [
                    'recommendations' => $parsed['recommendations'] ?? [],
                    'treatment_plans' => $parsed['treatment_plans'] ?? [],
                    'tips' => $parsed['tips'] ?? [],
                    'learning_paths' => $parsed['learning_paths'] ?? [],
                    'weekly_plans' => $parsed['weekly_plans'] ?? [],
                    'goals' => $parsed['goals'] ?? [],
                    'strengths' => $parsed['strengths'] ?? [],
                    'weaknesses' => $parsed['weaknesses'] ?? [],
                    'improvement_areas' => $parsed['improvement_areas'] ?? [],
                    'recommended_resources' => $parsed['recommended_resources'] ?? [],
                    'study_techniques' => $parsed['study_techniques'] ?? [],
                    'predicted_gpa' => $parsed['predicted_gpa'] ?? null,
                    'timeline_roadmap' => $parsed['timeline_roadmap'] ?? [],
                    'certifications' => $parsed['certifications'] ?? [],
                    'internships' => $parsed['internships'] ?? [],
                ];
            }
        }

        // Fallback if parsing fails
        return [
            'recommendations' => ['استمر في العمل الجيد!'],
            'treatment_plans' => ['راجع المواد بانتظام'],
            'tips' => ['نظم وقتك بشكل جيد'],
            'learning_paths' => [],
            'weekly_plans' => [],
            'goals' => [],
            'strengths' => [],
            'weaknesses' => [],
            'improvement_areas' => [],
            'recommended_resources' => [],
            'study_techniques' => [],
            'predicted_gpa' => null,
            'timeline_roadmap' => [],
        ];
    }

    /**
     * Create fallback recommendation if AI fails
     */
    private function createFallbackRecommendation($studentId, $month, $studentData)
    {
        // Demo dataset: a complete recommendation that populates every section
        // the recommendations page renders. Locale-aware (ar/en) and lightly
        // data-aware (GPA / attendance) for realism.
        $T = fn (string $ar, string $en) => app()->getLocale() === 'en' ? $en : $ar;

        $gpa = (float) ($studentData['gpa'] ?? 0);
        $attendanceRate = (float) ($studentData['attendance_rate'] ?? 0);
        $gpaText = $gpa > 0 ? rtrim(rtrim(number_format($gpa, 2), '0'), '.') : '—';
        $attendanceText = $attendanceRate > 0 ? rtrim(rtrim(number_format($attendanceRate, 1), '0'), '.') : '—';

        $predictedGpa = $gpa > 0 ? min(5.0, round($gpa + ($gpa < 3.5 ? 0.35 : 0.15), 2)) : 4.5;

        // ── Strengths ─────────────────────────────────────────────────────
        $strengths = [
            $T('التزام واضح بحضور المحاضرات والتفاعل مع المحتوى التعليمي.',
               'Strong commitment to attending lectures and engaging with course material.'),
            $T('قدرة جيدة على إدارة الوقت بين المقررات المختلفة.',
               'Good ability to manage time across different courses.'),
            $T('استخدام منصة كيو سبارك بشكل منتظم لمتابعة التقدم الأكاديمي.',
               'Regular use of the QSpark platform to track academic progress.'),
            $T('دافعية عالية نحو تطوير المهارات والحصول على الشهادات المهنية.',
               'High motivation to develop skills and earn professional certifications.'),
        ];
        if ($gpa >= 3.5) {
            array_unshift($strengths, $T(
                "معدل تراكمي ممتاز ({$gpaText}) — استمر في هذا الأداء الرائع!",
                "Excellent cumulative GPA ({$gpaText}) — keep up this outstanding performance!"
            ));
        }
        if ($attendanceRate >= 90) {
            $strengths[] = $T(
                "نسبة حضور ممتازة ({$attendanceText}%) — حافظ على هذا الالتزام.",
                "Excellent attendance rate ({$attendanceText}%) — keep up this commitment."
            );
        }

        // ── Weaknesses ────────────────────────────────────────────────────
        $weaknesses = [
            $T('تأخر في تسليم بعض الواجبات قرب موعد التسليم النهائي.',
               'Some assignments are submitted close to the deadline.'),
            $T('الاعتماد على المراجعة المكثفة قبل الاختبارات بدلاً من المراجعة المنتظمة.',
               'Relying on cramming before exams instead of regular review.'),
            $T('قلة المشاركة في مجموعات الدراسة والأنشطة الجماعية.',
               'Limited participation in study groups and collaborative activities.'),
        ];
        if ($gpa > 0 && $gpa < 3.5) {
            array_unshift($weaknesses, $T(
                "المعدل التراكمي يحتاج إلى تحسين — حالياً {$gpaText} من 5.0.",
                "Cumulative GPA needs improvement — currently {$gpaText} out of 5.0."
            ));
        }
        if ($attendanceRate > 0 && $attendanceRate < 90) {
            $weaknesses[] = $T(
                "نسبة الحضور منخفضة ({$attendanceText}%) — يُنصح بالوصول إلى 95% على الأقل.",
                "Attendance rate is low ({$attendanceText}%) — aim for at least 95%."
            );
        }

        // ── Top-level recommendations & treatment plans ───────────────────
        $recommendations = [
            $T('ضع جدولاً دراسياً أسبوعياً ثابتاً وخصص وقتاً يومياً لكل مقرر.',
               'Build a consistent weekly study schedule and dedicate daily time to each course.'),
            $T('راجع ملاحظات كل محاضرة في نفس اليوم لتثبيت المعلومات.',
               'Review each lecture\'s notes the same day to lock in the information.'),
            $T('احرص على الحضور المنتظم لجميع المحاضرات — الحضور أساس النجاح.',
               'Attend every lecture consistently — attendance is the foundation of success.'),
            $T('استفد من الألعاب التعليمية والاختبارات القصيرة في المنصة لتعزيز الفهم.',
               'Use the platform\'s educational games and quick quizzes to reinforce understanding.'),
            $T('ابدأ مبكراً بالتخطيط للشهادات المهنية والتدريب العملي.',
               'Start planning early for professional certifications and hands-on training.'),
        ];
        $treatmentPlans = [
            $T('خصص 3 ساعات يومياً للمراجعة مع التركيز على المقررات الأكثر صعوبة.',
               'Dedicate 3 hours daily to review, focusing on the most challenging courses.'),
            $T('استخدم تقنية بومودورو (25 دقيقة تركيز / 5 دقائق راحة) لرفع الإنتاجية.',
               'Use the Pomodoro technique (25 min focus / 5 min break) to boost productivity.'),
            $T('حدد موعداً أسبوعياً ثابتاً لمراجعة شاملة لكل المقررات.',
               'Schedule a fixed weekly slot for a comprehensive review of all courses.'),
            $T('تواصل مع المرشد الأكاديمي عند مواجهة أي تعثر دراسي مبكراً.',
               'Reach out to your academic advisor early when you face any academic difficulty.'),
        ];

        // ── Tips ──────────────────────────────────────────────────────────
        $tips = [
            $T('نظم وقتك بين الدراسة والراحة — التوازن مفتاح الاستمرارية.',
               'Balance study time with rest — balance is the key to consistency.'),
            $T('استخدم تقنية بومودورو: 25 دقيقة دراسة مركزة، 5 دقائق راحة.',
               'Use the Pomodoro technique: 25 minutes of focused study, 5 minutes of rest.'),
            $T('راجع ملاحظاتك بعد كل محاضرة مباشرة لتثبيت المعلومات.',
               'Review your notes immediately after each lecture to retain information.'),
            $T('كوّن مجموعات دراسية مع زملائك للمناقشة والتعلم التعاوني.',
               'Form study groups with classmates for discussion and collaborative learning.'),
            $T('نم 7-8 ساعات يومياً — النوم الجيد يحسّن التركيز والذاكرة.',
               'Sleep 7–8 hours a night — good sleep improves focus and memory.'),
        ];

        // ── Improvement areas ─────────────────────────────────────────────
        $improvementAreas = [
            $T('تنظيم الوقت: ضع خطة أسبوعية مكتوبة والتزم بها.',
               'Time management: write down a weekly plan and stick to it.'),
            $T('المراجعة المنتظمة: راجع المقررات أولاً بأول بدلاً من التراكم.',
               'Regular review: keep courses up to date instead of letting them pile up.'),
            $T('تسليم الواجبات مبكراً: ابدأ الواجب فور استلامه ولا تؤجله.',
               'Submit assignments early: start each one as soon as you receive it, do not delay.'),
            $T('المشاركة الصفية: اطرح الأسئلة وشارك في النقاش داخل المحاضرة.',
               'In-class participation: ask questions and join the discussion during lectures.'),
            $T('استخدام مصادر التعلم: استفد من الفيديوهات والتطبيقات التعليمية.',
               'Use learning resources: take advantage of educational videos and apps.'),
            $T('إدارة ضغط الاختبارات: وزّع المراجعة على فترات بدل المراجعة الليلية.',
               'Manage exam pressure: spread out reviews instead of cramming the night before.'),
        ];

        // ── Learning paths ────────────────────────────────────────────────
        $learningPaths = [
            [
                'title' => $T('مسار تحسين الأداء الأكاديمي', 'Academic Performance Improvement Track'),
                'description' => $T('خطة شاملة لرفع المعدل التراكمي وتحسين الأداء العام.',
                    'A comprehensive plan to raise your cumulative GPA and improve overall performance.'),
                'duration' => $T('4 أشهر', '4 months'),
                'steps' => [
                    $T('الأسبوع 1-2: تقييم نقاط القوة والضعف في جميع المقررات.',
                       'Weeks 1–2: assess strengths and weaknesses across all courses.'),
                    $T('الأسبوع 3-4: وضع جدول دراسي منظم وتخصيص وقت لكل مادة.',
                       'Weeks 3–4: build an organized study schedule with dedicated time per course.'),
                    $T('الشهر 2: البدء في المراجعة المكثفة للمقررات الأكثر صعوبة.',
                       'Month 2: start intensive review of the most challenging courses.'),
                    $T('الشهر 3-4: التطبيق العملي وحل التمارين والاختبارات التجريبية.',
                       'Months 3–4: practical application — practice exercises and mock exams.'),
                ],
            ],
            [
                'title' => $T('مسار المهارات والتطوير المهني', 'Skills & Professional Development Track'),
                'description' => $T('بناء مهارات عملية تؤهلك لسوق العمل قبل التخرج.',
                    'Build practical skills that prepare you for the job market before graduation.'),
                'duration' => $T('6 أشهر', '6 months'),
                'steps' => [
                    $T('الشهر 1: تحديد المهارات المطلوبة في مجال تخصصك.',
                       'Month 1: identify the skills in demand in your field of study.'),
                    $T('الشهر 2-3: التسجيل في دورة احترافية معتمدة عبر الإنترنت.',
                       'Months 2–3: enroll in an accredited professional online course.'),
                    $T('الشهر 4-5: تنفيذ مشروع تطبيقي صغير لإثراء ملف الإنجازات.',
                       'Months 4–5: deliver a small applied project to enrich your portfolio.'),
                    $T('الشهر 6: تجهيز سيرة ذاتية احترافية والبحث عن فرصة تدريب.',
                       'Month 6: prepare a professional résumé and look for an internship opportunity.'),
                ],
            ],
        ];

        // ── Weekly plans ──────────────────────────────────────────────────
        $weeklyPlans = [];
        for ($week = 1; $week <= 4; $week++) {
            $weeklyPlans[] = [
                'week' => $week,
                'focus' => $week == 1
                    ? $T('التقييم والتخطيط', 'Assessment & planning')
                    : ($week == 2
                        ? $T('البدء في التنفيذ', 'Start execution')
                        : ($week == 3
                            ? $T('التعمق والممارسة', 'Deepen & practice')
                            : $T('المراجعة والتقييم', 'Review & evaluation'))),
                'tasks' => $week == 1 ? [
                    $T('مراجعة جميع المقررات وتحديد نقاط الضعف.',
                       'Review every course and identify weak spots.'),
                    $T('إنشاء جدول دراسي أسبوعي مكتوب.',
                       'Create a written weekly study schedule.'),
                    $T('تحديد أهداف واضحة وقابلة للقياس لكل مادة.',
                       'Set clear, measurable goals for each course.'),
                ] : ($week == 2 ? [
                    $T('البدء بمراجعة المقررات الأكثر صعوبة.',
                       'Start by reviewing the most challenging courses.'),
                    $T('حضور جميع المحاضرات والتفاعل فيها.',
                       'Attend every lecture and participate actively.'),
                    $T('حل 50% من التمارين والواجبات المطلوبة.',
                       'Complete 50% of the required exercises and assignments.'),
                ] : ($week == 3 ? [
                    $T('حل تمارين إضافية واختبارات تطبيقية.',
                       'Work through extra exercises and applied quizzes.'),
                    $T('المشاركة في مجموعة دراسية واحدة على الأقل.',
                       'Join at least one study group.'),
                    $T('مراجعة الملاحظات يومياً قبل النوم.',
                       'Review your notes daily before going to sleep.'),
                ] : [
                    $T('مراجعة شاملة لجميع المقررات.',
                       'Comprehensive review of all courses.'),
                    $T('حل اختبارات تجريبية كاملة بمحاكاة وقت الاختبار.',
                       'Take full mock exams under exam-time conditions.'),
                    $T('تقييم التقدم وتعديل الخطة للشهر القادم.',
                       'Assess your progress and adjust the plan for next month.'),
                ])),
                'expected_hours' => 15 + ($week * 3),
            ];
        }

        // ── SMART goals ───────────────────────────────────────────────────
        $goals = [
            [
                'type' => $T('شهري', 'Monthly'),
                'category' => $T('أكاديمي', 'Academic'),
                'description' => $T('رفع المعدل التراكمي بمقدار 0.3 نقطة على الأقل.',
                    'Raise the cumulative GPA by at least 0.3 points.'),
                'target_value' => $gpa > 0 ? min(5.0, round($gpa + 0.3, 2)) : 4.5,
                'timeline' => $T('نهاية الفصل الدراسي', 'End of semester'),
                'action_steps' => [
                    $T('الدراسة 3 ساعات يومياً على الأقل.', 'Study at least 3 hours daily.'),
                    $T('حضور جميع المحاضرات دون استثناء.', 'Attend every lecture without exception.'),
                    $T('تسليم جميع الواجبات في وقتها أو قبله.', 'Submit every assignment on or ahead of time.'),
                    $T('إجراء مراجعة أسبوعية شاملة لكل المقررات.', 'Run a comprehensive weekly review of all courses.'),
                ],
            ],
            [
                'type' => $T('أسبوعي', 'Weekly'),
                'category' => $T('ساعات الدراسة', 'Study hours'),
                'description' => $T('تخصيص 20 ساعة دراسة فعّالة كل أسبوع.',
                    'Dedicate 20 hours of effective study every week.'),
                'target_value' => $T('20 ساعة', '20 hours'),
                'timeline' => $T('كل أسبوع', 'Every week'),
                'action_steps' => [
                    $T('تخصيص 3 ساعات دراسة يومياً.', 'Set aside 3 study hours every day.'),
                    $T('استخدام تقنية بومودورو للحفاظ على التركيز.', 'Use the Pomodoro technique to stay focused.'),
                    $T('تتبع ساعات الدراسة في تطبيق أو دفتر متابعة.', 'Track your study hours in an app or planner.'),
                ],
            ],
            [
                'type' => $T('شهري', 'Monthly'),
                'category' => $T('الحضور', 'Attendance'),
                'description' => $T('رفع نسبة الحضور إلى 95% أو أعلى.',
                    'Raise attendance to 95% or higher.'),
                'target_value' => '95%',
                'timeline' => $T('نهاية الشهر', 'End of month'),
                'action_steps' => [
                    $T('ضبط تنبيهات لجميع المحاضرات.', 'Set reminders for every lecture.'),
                    $T('النوم مبكراً والاستيقاظ قبل المحاضرة بوقت كافٍ.', 'Sleep early and wake up well before lecture time.'),
                    $T('تجهيز الحقيبة والمواد من الليلة السابقة.', 'Prepare your bag and materials the night before.'),
                ],
            ],
            [
                'type' => $T('فصلي', 'Semester'),
                'category' => $T('تطوير المهارات', 'Skill development'),
                'description' => $T('إكمال دورة احترافية معتمدة في مجال التخصص.',
                    'Complete an accredited professional course in your major.'),
                'target_value' => $T('شهادة واحدة', 'One certificate'),
                'timeline' => $T('خلال الفصل الدراسي', 'During the semester'),
                'action_steps' => [
                    $T('اختيار دورة معتمدة مناسبة لمجال التخصص.', 'Pick an accredited course aligned with your major.'),
                    $T('تخصيص ساعتين أسبوعياً لمتابعة الدورة.', 'Dedicate two hours a week to the course.'),
                    $T('تطبيق ما تم تعلمه في مشروع عملي صغير.', 'Apply what you learn in a small hands-on project.'),
                ],
            ],
        ];

        // ── Recommended resources ─────────────────────────────────────────
        $recommendedResources = [
            [
                'type' => 'video',
                'title' => $T('دورة تقنيات الدراسة الفعّالة', 'Effective Study Techniques Course'),
                'description' => $T('تعلّم أفضل الطرق للدراسة والاستيعاب وإدارة وقت المراجعة.',
                    'Learn the best ways to study, comprehend, and manage review time.'),
                'link' => $T('يوتيوب — ابحث عن «تقنيات الدراسة الفعّالة»',
                    'YouTube — search for "Effective Study Techniques"'),
            ],
            [
                'type' => 'app',
                'title' => $T('تطبيق Forest للتركيز', 'Forest — focus app'),
                'description' => $T('تطبيق يساعدك على التركيز وتجنّب المشتتات أثناء الدراسة.',
                    'An app that helps you focus and avoid distractions while studying.'),
                'link' => $T('متجر التطبيقات', 'App Store'),
            ],
            [
                'type' => 'book',
                'title' => $T('كتاب: العادات الذرية', 'Book: Atomic Habits'),
                'description' => $T('دليل عملي لبناء عادات دراسية صغيرة ومستدامة.',
                    'A practical guide to building small, sustainable study habits.'),
                'link' => $T('متوفر في المكتبة الجامعية', 'Available at the university library'),
            ],
            [
                'type' => 'app',
                'title' => $T('تطبيق Notion لتنظيم المهام', 'Notion — task organizer'),
                'description' => $T('لتنظيم الجدول الدراسي والواجبات والملاحظات في مكان واحد.',
                    'Organize your schedule, assignments, and notes in one place.'),
                'link' => 'notion.so',
            ],
            [
                'type' => 'video',
                'title' => $T('سلسلة شرح المقررات الأساسية', 'Core Courses Explanation Series'),
                'description' => $T('شروحات مبسطة للمفاهيم الصعبة في مقررات التخصص.',
                    'Simplified explanations of difficult concepts in major courses.'),
                'link' => $T('منصة كيو سبارك — قسم المكتبة التعليمية',
                    'QSpark platform — Educational Library section'),
            ],
            [
                'type' => 'link',
                'title' => $T('منصة كورسيرا — دورات مجانية', 'Coursera — free courses'),
                'description' => $T('دورات احترافية معتمدة من جامعات عالمية في مختلف المجالات.',
                    'Accredited professional courses from world-class universities in many fields.'),
                'link' => 'coursera.org',
            ],
        ];

        // ── Study techniques ──────────────────────────────────────────────
        $studyTechniques = [
            [
                'name' => $T('تقنية بومودورو', 'Pomodoro Technique'),
                'description' => $T('25 دقيقة دراسة مركّزة + 5 دقائق راحة.',
                    '25 minutes of focused study + 5 minutes of rest.'),
                'benefits' => $T('تحسين التركيز وتقليل الإرهاق الذهني.',
                    'Improves focus and reduces mental fatigue.'),
            ],
            [
                'name' => $T('الاسترجاع النشط', 'Active Recall'),
                'description' => $T('محاولة تذكّر المعلومات دون النظر إلى الملاحظات.',
                    'Try to recall information without looking at your notes.'),
                'benefits' => $T('تثبيت المعلومات في الذاكرة طويلة المدى.',
                    'Anchors information in long-term memory.'),
            ],
            [
                'name' => $T('الخرائط الذهنية', 'Mind Maps'),
                'description' => $T('رسم مخططات بصرية للمفاهيم والعلاقات بينها.',
                    'Draw visual diagrams of concepts and the relationships between them.'),
                'benefits' => $T('فهم أعمق وربط المعلومات ببعضها.',
                    'Deeper understanding and stronger connections between ideas.'),
            ],
            [
                'name' => $T('المراجعة المتباعدة', 'Spaced Repetition'),
                'description' => $T('إعادة مراجعة المادة على فترات متزايدة.',
                    'Re-review the material at increasing intervals.'),
                'benefits' => $T('مقاومة النسيان وترسيخ المعلومات على المدى البعيد.',
                    'Resists forgetting and locks information in for the long term.'),
            ],
        ];

        // Timeline Roadmap
        $timelineRoadmap = [
            'one_week' => [
                'title' => $T('خطة الأسبوع القادم', 'Next Week Plan'),
                'goals' => [
                    $T('حضور جميع المحاضرات والتفاعل فيها',
                       'Attend every lecture and participate actively.'),
                    $T('مراجعة ملاحظات كل محاضرة في نفس اليوم',
                       'Review each lecture\'s notes the same day.'),
                    $T('حل 50% من الواجبات المطلوبة',
                       'Complete 50% of the required assignments.'),
                ],
                'focus_areas' => [
                    $T('الحضور', 'Attendance'),
                    $T('المراجعة اليومية', 'Daily review'),
                    $T('الواجبات', 'Assignments'),
                ],
            ],
            'one_month' => [
                'title' => $T('خطة الشهر القادم', 'Next Month Plan'),
                'goals' => [
                    $T('رفع المعدل التراكمي بمقدار 0.2 نقطة',
                       'Raise the cumulative GPA by 0.2 points.'),
                    $T('إكمال جميع الواجبات في وقتها',
                       'Complete every assignment on time.'),
                    $T('تحسين نسبة الحضور إلى 95%',
                       'Improve attendance rate to 95%.'),
                    $T('لعب 10 ألعاب تعليمية على الأقل',
                       'Play at least 10 educational games.'),
                ],
                'focus_areas' => [
                    $T('تحسين المعدل', 'Improving GPA'),
                    $T('الالتزام', 'Commitment'),
                    $T('التفاعل مع المنصة', 'Platform engagement'),
                ],
            ],
            'six_months' => [
                'title' => $T('خطة الستة أشهر القادمة', 'Next Six Months Plan'),
                'goals' => [
                    $T('رفع المعدل التراكمي إلى 4.5 أو أعلى',
                       'Raise the cumulative GPA to 4.5 or higher.'),
                    $T('إتقان جميع المواد الأساسية في التخصص',
                       'Master every core course in your major.'),
                    $T('المشاركة في مشروع بحثي أو تطوعي',
                       'Take part in a research or volunteering project.'),
                    $T('بناء شبكة علاقات مع الأساتذة والزملاء',
                       'Build a network with faculty and peers.'),
                ],
                'focus_areas' => [
                    $T('التميز الأكاديمي', 'Academic excellence'),
                    $T('المشاريع', 'Projects'),
                    $T('التواصل', 'Networking'),
                ],
            ],
            'one_year' => [
                'title' => $T('خطة السنة القادمة', 'Next Year Plan'),
                'goals' => [
                    $T('الحفاظ على معدل تراكمي ممتاز (4.5+)',
                       'Maintain an excellent cumulative GPA (4.5+).'),
                    $T('إكمال 75% من ساعات التخصص',
                       'Complete 75% of the major\'s credit hours.'),
                    $T('الحصول على تدريب صيفي في مجال التخصص',
                       'Land a summer internship in your field.'),
                    $T('تطوير مهارات إضافية (لغة، برمجة، إلخ)',
                       'Develop additional skills (language, programming, etc.).'),
                ],
                'focus_areas' => [
                    $T('الاستمرارية', 'Consistency'),
                    $T('التدريب العملي', 'Hands-on training'),
                    $T('تطوير المهارات', 'Skill development'),
                ],
            ],
            'pre_graduation' => [
                'title' => $T('خطة ما قبل التخرج', 'Pre-Graduation Plan'),
                'goals' => [
                    $T('إكمال جميع متطلبات التخرج بنجاح',
                       'Successfully complete every graduation requirement.'),
                    $T('تحقيق معدل تراكمي نهائي 4.5 أو أعلى',
                       'Achieve a final cumulative GPA of 4.5 or higher.'),
                    $T('إعداد مشروع التخرج بجودة عالية',
                       'Deliver a high-quality graduation project.'),
                    $T('البحث عن فرص عمل أو دراسات عليا',
                       'Search for employment or graduate-study opportunities.'),
                    $T('بناء سيرة ذاتية قوية وملف إنجازات',
                       'Build a strong résumé and achievements portfolio.'),
                ],
                'focus_areas' => [
                    $T('التخرج بتميز', 'Graduating with distinction'),
                    $T('التخطيط المهني', 'Career planning'),
                    $T('الإنجازات', 'Achievements'),
                ],
                'recommended_certifications' => [
                    $T('شهادة إدارة المشاريع الاحترافية (PMP) - معهد إدارة المشاريع',
                       'Project Management Professional (PMP) — Project Management Institute'),
                    $T('شهادات مايكروسوفت المعتمدة (Microsoft Certifications) - مايكروسوفت',
                       'Microsoft Certifications — Microsoft'),
                    $T('شهادة المحلل المالي المعتمد (CFA) - معهد المحللين الماليين المعتمدين',
                       'Chartered Financial Analyst (CFA) — CFA Institute'),
                    $T('شهادات جوجل الاحترافية (Google Professional Certificates) - جوجل',
                       'Google Professional Certificates — Google'),
                    $T('شهادة محترف الموارد البشرية (PHR/SPHR) - معهد الموارد البشرية',
                       'HR Professional certification (PHR/SPHR) — HR Certification Institute'),
                ],
                'internship_opportunities' => [
                    $T('فرص تدريب في شركات الطاقة السعودية (أرامكو السعودية، سابك) - 3-6 أشهر',
                       'Internships at Saudi energy companies (Saudi Aramco, SABIC) — 3–6 months.'),
                    $T('برامج تدريب في المؤسسات المالية (البنك الأهلي، الراجحي، ساما) - صيفي',
                       'Internship programs at financial institutions (SNB, Al Rajhi, SAMA) — summer.'),
                    $T('تدريب في شركات التقنية والاتصالات (STC، موبايلي، زين) - فصلي',
                       'Internships at tech & telecom companies (STC, Mobily, Zain) — semester-long.'),
                    $T('فرص تدريب في المؤسسات الحكومية (الوزارات والهيئات الحكومية) - سنوي',
                       'Government-sector internships (ministries and authorities) — annual.'),
                    $T('برامج تدريب في الشركات الاستشارية (ديلويت، PwC، KPMG، EY) - صيفي',
                       'Internships at consulting firms (Deloitte, PwC, KPMG, EY) — summer.'),
                ],
            ],
        ];

        // updateOrCreate so a stale (English / partial) record from an earlier
        // live AI run is refreshed in place instead of triggering a duplicate.
        return StudentMonthlyRecommendation::updateOrCreate(
            [
                'student_id' => $studentId,
                'month' => $month,
            ],
            [
                'recommendations' => $recommendations,
                'treatment_plans' => $treatmentPlans,
                'tips' => $tips,
                'learning_paths' => $learningPaths,
                'weekly_plans' => $weeklyPlans,
                'goals' => $goals,
                'strengths' => $strengths,
                'weaknesses' => $weaknesses,
                'improvement_areas' => $improvementAreas,
                'recommended_resources' => $recommendedResources,
                'study_techniques' => $studyTechniques,
                'predicted_gpa' => $predictedGpa,
                'completion_percentage' => 0,
                'timeline_roadmap' => $timelineRoadmap,
                'student_data' => $studentData,
                'generated_at' => Carbon::now('Asia/Riyadh'),
            ]
        );
    }

    /**
     * Fixed list of allowed chat prompts. Keys are stable IDs sent from the
     * client; values are the actual question text shown to the user and sent
     * to the model. We never accept free-text from the user — that bounds
     * input tokens and prevents abuse.
     */
    private function allowedChatPrompts(): array
    {
        $ids = ['improve_gpa', 'study_tips', 'time_management', 'exam_prep',
            'handle_pressure', 'skill_dev', 'final_exams', 'focus'];
        $out = [];
        foreach ($ids as $id) {
            $out[$id] = __('messages.chat_prompt_' . $id);
        }
        return $out;
    }

    /**
     * Predefined demo answers used as a fallback when the live AI provider
     * is not configured or is unreachable. Keys match allowedChatPrompts().
     */
    private function dummyChatAnswers(): array
    {
        return [
            'improve_gpa' => "لرفع معدلك التراكمي، ركّز على الخطوات التالية:\n\n"
                . "✅ ضع خطة أسبوعية واضحة لكل مادة وحدّد ساعات مذاكرة ثابتة.\n"
                . "✅ ابدأ بالمواد ذات الساعات المعتمدة الأعلى لأن أثرها أكبر على المعدل.\n"
                . "✅ راجع نقاط ضعفك مع أعضاء هيئة التدريس في الساعات المكتبية.\n"
                . "✅ حلّ نماذج الاختبارات السابقة وراجع أخطاءك بانتظام.\n"
                . "✅ لا تهمل الواجبات والمشاركة فهي تدعم درجاتك التراكمية.",
            'study_tips' => "نصائح عملية لدراسة فعّالة:\n\n"
                . "• اعتمد تقنية بومودورو: ٢٥ دقيقة تركيز ثم ٥ دقائق راحة.\n"
                . "• لخّص كل محاضرة بخريطة ذهنية أو نقاط مختصرة.\n"
                . "• ذاكر بصوت مرتفع أو اشرح المادة لزميلك لتثبيت المعلومة.\n"
                . "• ابتعد عن الهاتف أثناء الجلسة وضعه في وضع الطيران.\n"
                . "• راجع المادة خلال ٢٤ ساعة من المحاضرة لتقليل النسيان.",
            'time_management' => "لتنظيم وقتك بين الدراسة والراحة:\n\n"
                . "✅ ابدأ يومك بقائمة مهام مرتّبة حسب الأولوية.\n"
                . "✅ خصّص بلوكات زمنية ثابتة للدراسة (٩٠ دقيقة) وأخرى للراحة (٣٠ دقيقة).\n"
                . "✅ احرص على نوم ٧–٨ ساعات يومياً فهو يضاعف كفاءة المذاكرة.\n"
                . "✅ اجعل يوماً في الأسبوع للراحة الكاملة والأنشطة الاجتماعية.\n"
                . "✅ راجع خطتك الأسبوعية كل خميس وعدّلها حسب احتياجاتك.",
            'exam_prep' => "أفضل طرق المذاكرة للاختبارات:\n\n"
                . "• ابدأ المراجعة قبل الاختبار بأسبوعين على الأقل.\n"
                . "• قسّم المنهج إلى وحدات صغيرة وحدّد هدفاً يومياً واضحاً.\n"
                . "• استخدم البطاقات التعليمية (Flashcards) للمفاهيم والتعاريف.\n"
                . "• حلّ نماذج اختبارات سابقة تحت ضغط الوقت.\n"
                . "• اجمع ملاحظاتك في ورقة واحدة قبل ليلة الاختبار للمراجعة السريعة.",
            'handle_pressure' => "للتعامل مع ضغط الدراسة والقلق:\n\n"
                . "✅ تنفّس بعمق ٤-٤-٦ (شهيق ٤ ثوانٍ، حبس ٤، زفير ٦) عند التوتر.\n"
                . "✅ قسّم المهام الكبيرة إلى خطوات صغيرة قابلة للتنفيذ.\n"
                . "✅ مارس رياضة خفيفة ٢٠ دقيقة يومياً لتفريغ التوتر.\n"
                . "✅ تحدّث مع مرشدك الأكاديمي أو وحدة الإرشاد الطلابي عند الحاجة.\n"
                . "✅ تذكّر أن الراحة ليست تكاسلاً بل جزء من خطة النجاح.",
            'skill_dev' => "أهم المهارات لطالب جامعي ناجح:\n\n"
                . "• التفكير النقدي وحلّ المشكلات.\n"
                . "• التواصل الفعّال والعرض والإلقاء.\n"
                . "• إدارة الوقت وتحديد الأولويات.\n"
                . "• العمل الجماعي والتعاون مع فرق متعددة التخصصات.\n"
                . "• المهارات الرقمية الأساسية (Excel، أدوات التعاون، أساسيات البرمجة).\n"
                . "• تعلّم لغة ثانية وتطوير المهارات البحثية.",
            'final_exams' => "للاستعداد للامتحانات النهائية بفاعلية:\n\n"
                . "✅ ضع خطة مراجعة لكل مادة قبل الاختبارات بثلاثة أسابيع.\n"
                . "✅ ابدأ بأصعب المواد أولاً عندما يكون تركيزك في أعلى مستوى.\n"
                . "✅ شكّل مجموعة دراسة صغيرة لتبادل الملخصات والأسئلة.\n"
                . "✅ احرص على نوم منتظم وتغذية متوازنة طوال فترة الاختبارات.\n"
                . "✅ لا تذاكر مادة جديدة في ليلة الاختبار، اكتفِ بالمراجعة السريعة.",
            'focus' => "للحفاظ على التركيز أثناء المذاكرة:\n\n"
                . "• اختر مكاناً هادئاً ومرتباً وبإضاءة جيدة.\n"
                . "• اضبط الهاتف على وضع \"عدم الإزعاج\" أو ضعه في غرفة أخرى.\n"
                . "• ضع هدفاً واضحاً لكل جلسة (مثلاً: إنهاء فصلين خلال ساعة).\n"
                . "• خذ راحة قصيرة كل ٢٥–٣٠ دقيقة لتفادي الإرهاق الذهني.\n"
                . "• اشرب الماء بانتظام وتجنّب الوجبات الثقيلة قبل المذاكرة.",
        ];
    }

    /**
     * Display the full-page chat interface.
     */
    public function chatPage()
    {
        $profile = $this->getStudentProfile();
        $arName = $profile['data']['profile']['name'] ?? '';
        $enName = $profile['data']['profile']['name_en'] ?? '';
        $arName = trim((string) $arName);
        $enName = trim((string) $enName);
        if (app()->getLocale() === 'en') {
            $studentName = $enName !== '' ? $enName : ($arName !== '' ? $arName : 'Student');
        } else {
            $studentName = $arName !== '' ? $arName : ($enName !== '' ? $enName : 'الطالب');
        }

        return view('qspark::student-chat', [
            'studentName' => $studentName,
            'prompts' => $this->allowedChatPrompts(),
        ]);
    }

    /**
     * Handle a chat selection. Accepts only an ID from the allowed prompt
     * list, then asks OpenAI gpt-4o-mini for a short answer (<=400 tokens).
     */
    public function sendChatMessage(Request $request)
    {
        $request->validate([
            'prompt_id' => 'required|string',
        ]);

        if (! $this->token) {
            return response()->json(['success' => false, 'error' => 'Not authenticated'], 401);
        }

        $prompts = $this->allowedChatPrompts();
        $promptId = $request->input('prompt_id');
        if (! isset($prompts[$promptId])) {
            return response()->json(['success' => false, 'error' => 'Invalid choice'], 422);
        }
        $userMessage = $prompts[$promptId];
        $dummyAnswers = $this->dummyChatAnswers();

        $apiKey = config('services.openai.api_key');
        if (empty($apiKey)) {
            return response()->json([
                'success' => true,
                'status' => 'completed',
                'question' => $userMessage,
                'response' => $this->convertMarkdownToHtml($dummyAnswers[$promptId] ?? ''),
            ]);
        }

        $systemPrompt = 'أنت مساعد ذكي لطلاب جامعة القصيم. أجب بالعربية في 4-6 جمل قصيرة، نقاط واضحة وعملية، بدون مقدمات. استخدم ✅ أو • للقوائم.';

        try {
            $response = Http::timeout(30)
                ->withToken($apiKey)
                ->post('https://api.openai.com/v1/chat/completions', [
                    'model' => env('OPENAI_QUIZ_MODEL', 'gpt-4o-mini'),
                    'temperature' => 0.5,
                    'max_tokens' => 400,
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user',   'content' => $userMessage],
                    ],
                ]);

            if (! $response->successful()) {
                Log::error('OpenAI chat call failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return response()->json([
                    'success' => true,
                    'status' => 'completed',
                    'question' => $userMessage,
                    'response' => $this->convertMarkdownToHtml($dummyAnswers[$promptId] ?? ''),
                ]);
            }

            $aiResponse = $response->json('choices.0.message.content') ?? '';
            if (trim($aiResponse) === '') {
                return response()->json([
                    'success' => true,
                    'status' => 'completed',
                    'question' => $userMessage,
                    'response' => $this->convertMarkdownToHtml($dummyAnswers[$promptId] ?? ''),
                ]);
            }

            return response()->json([
                'success' => true,
                'status' => 'completed',
                'question' => $userMessage,
                'response' => $this->convertMarkdownToHtml($aiResponse),
            ]);
        } catch (\Throwable $e) {
            Log::error('Chat API exception', ['message' => $e->getMessage()]);

            return response()->json([
                'success' => true,
                'status' => 'completed',
                'question' => $userMessage,
                'response' => $this->convertMarkdownToHtml($dummyAnswers[$promptId] ?? ''),
            ]);
        }
    }

    /**
     * Get the chat result - kept for backward compatibility
     * With Gemini, responses are immediate so this just returns completed status
     */
    public function getChatResult(Request $request)
    {
        // With Gemini API, responses are immediate
        // This endpoint is kept for backward compatibility
        return response()->json([
            'status' => 'completed',
            'response' => 'تم معالجة الرسالة بنجاح.',
        ]);
    }

    /**
     * Convert markdown formatting to HTML for chat responses
     */
    private function convertMarkdownToHtml(string $text): string
    {
        // Escape HTML first to prevent XSS
        $text = htmlspecialchars($text, ENT_QUOTES, 'UTF-8');

        // Convert **bold** to <strong>
        $text = preg_replace('/\*\*(.+?)\*\*/u', '<strong>$1</strong>', $text);

        // Convert *italic* to <em> (but not if it's part of a list item)
        // Match single asterisks that are not at the start of a line
        $text = preg_replace('/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/u', '<em>$1</em>', $text);

        // Process the text line by line for lists
        $lines = explode("\n", $text);
        $result = [];
        $inUnorderedList = false;
        $inOrderedList = false;

        foreach ($lines as $line) {
            $trimmedLine = trim($line);

            // Check for unordered list item (starts with * or - or •)
            if (preg_match('/^[\*\-•]\s+(.+)$/u', $trimmedLine, $matches)) {
                if (! $inUnorderedList) {
                    if ($inOrderedList) {
                        $result[] = '</ol>';
                        $inOrderedList = false;
                    }
                    $result[] = '<ul class="chat-list">';
                    $inUnorderedList = true;
                }
                $result[] = '<li>'.$matches[1].'</li>';

                continue;
            }

            // Check for ordered list item (starts with number followed by . or ))
            if (preg_match('/^(\d+)[\.\)]\s+(.+)$/u', $trimmedLine, $matches)) {
                if (! $inOrderedList) {
                    if ($inUnorderedList) {
                        $result[] = '</ul>';
                        $inUnorderedList = false;
                    }
                    $result[] = '<ol class="chat-list">';
                    $inOrderedList = true;
                }
                $result[] = '<li>'.$matches[2].'</li>';

                continue;
            }

            // Close any open lists if we hit a non-list line
            if ($inUnorderedList) {
                $result[] = '</ul>';
                $inUnorderedList = false;
            }
            if ($inOrderedList) {
                $result[] = '</ol>';
                $inOrderedList = false;
            }

            // Add the line (preserve empty lines as breaks)
            if (empty($trimmedLine)) {
                $result[] = '<br>';
            } else {
                $result[] = '<p>'.$line.'</p>';
            }
        }

        // Close any remaining open lists
        if ($inUnorderedList) {
            $result[] = '</ul>';
        }
        if ($inOrderedList) {
            $result[] = '</ol>';
        }

        return implode('', $result);
    }
}
