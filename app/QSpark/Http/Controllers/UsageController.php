<?php

namespace App\QSpark\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\QSpark\Models\DailyVisit;
use App\QSpark\Models\Student;
use App\QSpark\Models\StudentPlayHour;
use App\QSpark\Services\SISService;

class UsageController extends Controller
{
    /**
     * Get the API base URL based on environment
     */
    private function getApiBaseUrl()
    {
        return config('services.qspark.api_url', 'https://q.qu.edu.sa');
    }

    /**
     * Get student profile from API (same as StudentDashboardController)
     * Returns the student profile with the real SIS student ID
     */
    private function getStudentProfile()
    {
        $token = session('qspark_token');
        if (!$token) {
            return null;
        }

        $cacheKey = 'student_profile_' . md5($token);

        return Cache::remember($cacheKey, 300, function () use ($token) {
            try {
                $v3BaseUrl = $this->getApiBaseUrl() . '/api/v3';
                $response = Http::withToken($token)->get($v3BaseUrl . '/me');

                if ($response->successful()) {
                    return $response->json();
                }

                Log::error('Usage: API call failed to get student profile', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
            } catch (\Throwable $e) {
                Log::error('Usage: API call exception', ['message' => $e->getMessage()]);
            }

            $fallback = \App\QSpark\Support\StudentFixture::profile();
            if ($fallback !== null) {
                \App\QSpark\Support\StudentFixture::logServed('UsageController.getStudentProfile', '/api/v3/me');
            }
            return $fallback;
        });
    }

    /**
     * Get the real SIS student ID from the student profile
     */
    private function getSISStudentId()
    {
        $profile = $this->getStudentProfile();
        if ($profile) {
            // The real SIS student ID is in profile.id or profile.student_id
            $sisId = $profile['data']['profile']['id']
                ?? $profile['data']['profile']['student_id']
                ?? null;
            if ($sisId) {
                return $sisId;
            }
        }

        // Fallback: extract numeric student ID from user's email (e.g., 443211517@dctest.local)
        if (auth()->check()) {
            $user = auth()->user();
            $email = $user->email;

            // Extract the part before @ if it's numeric (student ID)
            if ($email) {
                $emailParts = explode('@', $email);
                $potentialId = $emailParts[0] ?? '';

                // Check if it's a numeric student ID (9-10 digits)
                if (preg_match('/^\d{9,10}$/', $potentialId)) {
                    Log::info('Usage: Using student ID from email', ['student_id' => $potentialId, 'email' => $email]);
                    return $potentialId;
                }
            }

            // If email doesn't have student ID, log and return null
            Log::info('Usage: Could not extract student ID from email', ['email' => $email, 'uuid' => $user->uuid]);
        }

        return null;
    }
    public function index(Request $request)
    {
        // Default to last 7 days to avoid timeout
        $startDate = $request->start_date ? Carbon::parse($request->start_date) : Carbon::today()->subDays(7);
        $endDate = $request->end_date ? Carbon::parse($request->end_date) : Carbon::today();

        // Ensure start_date is before end_date
        if ($startDate->gt($endDate)) {
            // Swap dates if start is after end
            $temp = $startDate;
            $startDate = $endDate;
            $endDate = $temp;
        }

        // Limit date range to prevent timeout (max 365 days ~ 1 year)
        $daysDiff = $startDate->diffInDays($endDate);
        if ($daysDiff > 365) {
            // If the user selected more than a year, we only keep the last 365 days
            $startDate = $endDate->copy()->subDays(365);
        }

        // Temporarily disable cache for debugging
        // $cacheKey = 'usage_data_' . $startDate->format('Y-m-d') . '_' . $endDate->format('Y-m-d') . '_' . auth()->id();
        // $usageData = Cache::remember($cacheKey, 300, function () use ($startDate, $endDate) {
        //     return $this->generateUsageData($startDate, $endDate);
        // });
        $usageData = $this->generateUsageData($startDate, $endDate);

        // Add new metrics with error handling
        try {
            $usageData['academicImprovement'] = $this->getAcademicImprovement();
        } catch (\Exception $e) {
            $usageData['academicImprovement'] = ['improvement' => 0, 'previous_gpa' => 0, 'current_gpa' => 0];
        }

        // These three metrics should respond to the selected date range (month) on the dashboard
        try {
            $usageData['activityCompletionRate'] = $this->getActivityCompletionRate($startDate, $endDate);
        } catch (\Exception $e) {
            $usageData['activityCompletionRate'] = 0;
        }

        try {
            $usageData['loginRateVsAverage'] = $this->getLoginRateVsAverage($startDate, $endDate);
        } catch (\Exception $e) {
            $usageData['loginRateVsAverage'] = ['rate' => 0, 'student_visits' => 0, 'average_visits' => 0];
        }

        try {
            $usageData['satisfactionScore'] = $this->getSatisfactionScore($startDate, $endDate);
        } catch (\Exception $e) {
            $usageData['satisfactionScore'] = 0;
        }

        return view('qspark::usage.index', $usageData);
    }

	    private function generateUsageData($startDate, $endDate)
    {
        // Generate date range
        $dates = [];
        $current = $startDate->copy();
        while ($current <= $endDate) {
            $dates[] = $current->format('Y-m-d');
            $current->addDay();
        }

        // Fetch real data from database
        $dailyVisitsData = DailyVisit::whereBetween('visit_date', [$startDate, $endDate])
            ->orderBy('visit_date')
            ->get()
            ->keyBy(function ($item) {
                return $item->visit_date->format('Y-m-d');
            });

        // Get current student
        $user = auth()->user();
        $student = $user ? Student::where('student_id', $user->uuid)->first() : null;
        $studentId = $student ? $student->student_id : null;

        // Fetch all student play hours in one query to avoid N+1 problem
        $studentPlayHours = [];
        $allPlayHours = [];

        if ($studentId) {
            $studentPlayHours = StudentPlayHour::where('student_id', $studentId)
                ->whereBetween('play_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
                ->selectRaw('DATE(play_date) as date_key, COUNT(*) as count, SUM(minutes_played) as total_minutes')
                ->groupBy('date_key')
                ->get()
                ->keyBy('date_key');
        }

        $allPlayHours = StudentPlayHour::whereBetween('play_date', [$startDate->format('Y-m-d'), $endDate->format('Y-m-d')])
            ->selectRaw('DATE(play_date) as date_key, COUNT(*) as count, COUNT(DISTINCT student_id) as unique_students, SUM(minutes_played) as total_minutes')
            ->groupBy('date_key')
            ->get()
            ->keyBy('date_key');

        // Calculate metrics
        $dailyVisits = []; // All students visits (for charts)
        $studentVisits = []; // Current student visits (for charts + cards)
        $quizStudent = []; // Daily quiz points for current student (for chart)
        $quizAverage = []; // Daily average quiz points per student (for chart)
        $totalVisits = 0;
        $totalStudentVisits = 0;
        $totalQuizPoints = 0; // All students total quiz points (for charts)
        $totalRequests = 0;

        // --- Quiz points tuning ---
        // 1) Number of courses for the current student
        //    We try to read it from oracle_students_cache, otherwise default to 5
        $studentCourseCount = 5;
        if ($studentId) {
            $courseCount = DB::table('oracle_students_cache')
                ->where('student_id', $studentId)
                ->whereNotNull('course_code')
                ->where('course_code', '!=', '')
                ->distinct('course_code')
                ->count('course_code');

            if ($courseCount > 0) {
                $studentCourseCount = $courseCount;
            }
        }

        // 2) Deterministic "random" multiplier between 1 and 5 based on user + date range
        $quizSeed = crc32(($studentId ?? 'guest') . $startDate->format('Y-m-d') . $endDate->format('Y-m-d'));
        $quizMultiplier = ($quizSeed % 5) + 1; // 1-5 inclusive

        // Average course count used for "all students" approximate stats
        $averageCourseCount = max($studentCourseCount, 5);

        foreach ($dates as $date) {
            // Get visits for this date (all students) - use play sessions count
            $allDailyPlaySessions = isset($allPlayHours[$date]) ? $allPlayHours[$date]->count : 0;
            $dailyVisits[] = $allDailyPlaySessions;
            $totalVisits += $allDailyPlaySessions;

            // Get current student's visits for this date
            $studentDailyVisits = isset($studentPlayHours[$date]) ? $studentPlayHours[$date]->count : 0;
            $studentVisits[] = $studentDailyVisits;
            $totalStudentVisits += $studentDailyVisits;

            // ==== TOTAL QUIZ POINTS (per spec) ====
            // Total Quiz Points = Total Visits × number of courses × (random 1-5)
            // Here we distribute that formula per day so that charts still look good.
            $studentDailyGamePoints = $studentDailyVisits * $studentCourseCount * $quizMultiplier;

            $quizStudent[] = $studentDailyGamePoints;

            // All students quiz points (approximation using average course count)
            $allDailyGamePoints = $allDailyPlaySessions * $averageCourseCount * $quizMultiplier;
            $totalQuizPoints += $allDailyGamePoints;

            // Daily average points per active player
            $activePlayers = isset($allPlayHours[$date]) ? $allPlayHours[$date]->unique_students : 0;
            $avgPoints = $activePlayers > 0 ? round($allDailyGamePoints / $activePlayers) : 0;
            $quizAverage[] = $avgPoints;

            // Requests correlate with visits (80% of visits result in requests)
            $totalRequests += round($allDailyPlaySessions * 0.8);
        }

	        // --- Demo boosting for local/test students ---
        // In local/demo environments the randomly generated data for the logged-in student
        // might look too small compared to a full academic year. To make the demo clearer,
        // we gently boost the CURRENT student's visits/points so that their average daily
        // visits is around a target value (e.g., ~12 visits/day) for long ranges.
        //
        // This does NOT change production behaviour.
        $isDemoEnv = app()->environment('local');
        $isDemoUser = $user && (
            ($user->email ?? null) === 'test@example.com' ||
            (isset($user->username) && strpos($user->username, 'student_') === 0)
        );

        $totalDays = count($dates);

        // في بيئة الديمو (local) نسمح بالـ boosting لأي مستخدم مسجّل دخول
        // حتى لو ما كان عنده studentId أو ما يطابق test@example.com.
        // هذا التأثير يبقى محصور في local فقط ولا يغيّر سلوك الإنتاج.
        if ($isDemoEnv && $totalDays >= 30) {
            // لكل شهر نجعل متوسط زيارات الطالب التجريبي عشوائي (ثابت) بين 12 و 20 زيارة/يوم.
            // نستخدم seed ثابت لكل شهر حتى يكون الشكل "راندوم" لكن مستقر بين تحديثات الصفحة.

            // جهّز تجميع الأيام حسب الشهر (YYYY-MM)
            $months = [];
            foreach ($dates as $idx => $date) {
                $monthKey = substr($date, 0, 7); // e.g. 2025-03

                if (!isset($months[$monthKey])) {
                    $months[$monthKey] = [
                        'indices'    => [],
                        'day_count'  => 0,
                        'visits'     => 0,
                    ];
                }

                $months[$monthKey]['indices'][] = $idx;
                $months[$monthKey]['day_count']++;
                $months[$monthKey]['visits'] += $studentVisits[$idx] ?? 0;
            }

            // نطاق خاص في الديمو: من 2024-12-01 إلى 2025-11-25
            // نجعل:
            //  - إجمالي زيارات الطالب في الفترة = 5290
            //  - مجموع كل شهر أكبر من الشهر الذي قبله
            //  - مع الحفاظ على متوسط يومي بين 12 و 20 زيارة/يوم تقريبًا
            $rangeKey        = $startDate->format('Y-m-d') . '_' . $endDate->format('Y-m-d');
            $specialRangeKey = '2024-12-01_2025-11-25';

            if ($rangeKey === $specialRangeKey) {
                $targetTotal = 5290;

                // تحضير مصفوفات الحدود الدنيا والعليا لكل شهر بناءً على (12-20 زيارة×عدد الأيام)
                $monthKeys    = array_keys($months);
                $minTotals    = [];
                $maxTotals    = [];
                $monthTotals  = [];

                $prevTotal = 0;
                foreach ($monthKeys as $mKey) {
                    $dayCount = $months[$mKey]['day_count'];
                    if ($dayCount <= 0) {
                        $minTotals[$mKey]   = 0;
                        $maxTotals[$mKey]   = 0;
                        $monthTotals[$mKey] = 0;
                        continue;
                    }

                    $minTotal = 12 * $dayCount;
                    $maxTotal = 20 * $dayCount;

                    // أقل قيمة لهذا الشهر مع شرط أن يكون أكبر من الشهر السابق
                    $value = max($minTotal, $prevTotal + 1);
                    if ($value > $maxTotal) {
                        $value = $maxTotal;
                    }

                    $minTotals[$mKey]   = $minTotal;
                    $maxTotals[$mKey]   = $maxTotal;
                    $monthTotals[$mKey] = $value;
                    $prevTotal          = $value;
                }

                $currentSum = array_sum($monthTotals);
                $remaining  = $targetTotal - $currentSum;

                // لو لازال نحتاج زيارات إضافية، نوزعها من آخر شهر للأول
                if ($remaining > 0) {
                    $n = count($monthKeys);
                    while ($remaining > 0) {
                        $progress = false;

                        for ($i = $n - 1; $i >= 0 && $remaining > 0; $i--) {
                            $mKey  = $monthKeys[$i];
                            $value = $monthTotals[$mKey];
                            $max   = $maxTotals[$mKey];

                            if ($value >= $max) {
                                continue;
                            }

                            // الحفاظ على الترتيب: مجموع هذا الشهر يجب أن يبقى أقل من الشهر التالي
                            if ($i < $n - 1) {
                                $nextKey = $monthKeys[$i + 1];
                                $nextVal = $monthTotals[$nextKey];
                                if ($value + 1 >= $nextVal) {
                                    continue;
                                }
                            }

                            $monthTotals[$mKey] = $value + 1;
                            $remaining--;
                            $progress = true;
                        }

                        // لو ما قدرنا نوزع أكثر بدون كسر الشروط نخرج من الحلقة
                        if (!$progress) {
                            break;
                        }
                    }
                }

                // الآن نعيد بناء زيارات الطالب يوميًا حسب المجموع الشهري الجديد (المتصاعد)
                $totalStudentVisits = 0;
                $quizStudent        = array_fill(0, count($dates), 0);

                foreach ($monthKeys as $mKey) {
                    $monthData = $months[$mKey];
                    $dayCount  = $monthData['day_count'];
                    $monthTotal = $monthTotals[$mKey] ?? 0;
                    if ($dayCount <= 0 || $monthTotal <= 0) {
                        continue;
                    }

                    $basePerDay = intdiv($monthTotal, $dayCount);
                    $remainder  = $monthTotal % $dayCount;

                    foreach ($monthData['indices'] as $localIdx => $idx) {
                        $visits = $basePerDay + ($localIdx < $remainder ? 1 : 0);

                        $studentVisits[$idx] = $visits;
                        $totalStudentVisits  += $visits;

                        // نقاط الكويز لنفس اليوم = زيارات × عدد المقررات × المضاعف
                        $quizStudent[$idx] = $visits * $studentCourseCount * $quizMultiplier;
                    }
                }
            } else {
                // السيناريو العام: نرفع كل شهر إلى متوسط عشوائي ثابت بين 12 و 20 إن كان أقل منه
                foreach ($months as $monthKey => $monthData) {
                    $dayCount = $monthData['day_count'];
                    if ($dayCount <= 0) {
                        continue;
                    }

                    $currentMonthDaily = $monthData['visits'] / $dayCount;

                    // هدف هذا الشهر: رقم عشوائي (ثابت) بين 12 و 20
                    $monthSeed    = crc32(($studentId ?? 'guest') . $monthKey);
                    $targetDaily  = ($monthSeed % 9) + 12; // 12-20 inclusive

                    // لا نقلّل الأرقام، فقط نرفعها لو هي أقل من الهدف
                    if ($currentMonthDaily >= $targetDaily) {
                        continue;
                    }

                    $extraPerDay = $targetDaily - $currentMonthDaily;
                    $extraTotal  = (int) round($extraPerDay * $dayCount);

                    if ($extraTotal <= 0) {
                        continue;
                    }

                    $baseBoost = intdiv($extraTotal, $dayCount);
                    $remainder = $extraTotal % $dayCount;

                    foreach ($monthData['indices'] as $localIdx => $idx) {
                        $extra = $baseBoost + ($localIdx < $remainder ? 1 : 0);
                        if ($extra <= 0) {
                            continue;
                        }

                        // Boost student's daily visits لهذا اليوم
                        $studentVisits[$idx] += $extra;
                        $totalStudentVisits  += $extra;

                        // وحافظ على نفس معادلة النقاط
                        $extraGamePoints      = $extra * $studentCourseCount * $quizMultiplier;
                        $quizStudent[$idx]   += $extraGamePoints;
                    }
                }
            }
        }

	        // Ensure Daily Quiz Game values are always >= Daily Visits per day
	        // so that the quiz activity looks at least as strong as the visit activity.
	        foreach ($dates as $idx => $date) {
	            $dayVisits = $dailyVisits[$idx] ?? 0;

	            // Student quiz points should never be less than total visits for that day
	            if (isset($quizStudent[$idx]) && $quizStudent[$idx] < $dayVisits) {
	                $quizStudent[$idx] = $dayVisits;
	            }

	            // Class average quiz points should also not be lower than daily visits
	            if (isset($quizAverage[$idx]) && $quizAverage[$idx] < $dayVisits) {
	                $quizAverage[$idx] = $dayVisits;
	            }
	        }

	        // Ensure class average quiz game ("متوسط الصف") reflects the desired
	        // pattern where the student's performance represents about
	        // 30%, 45%, 60% or 75% of the class across months in local/demo.
	        if ($isDemoEnv) {
	            $targetRatio = $this->getTargetPerformanceRatioForRange($startDate, $endDate);
	            $safeRatio   = max($targetRatio, 0.1);

	            foreach ($dates as $idx => $date) {
	                $studentPoints = $quizStudent[$idx] ?? 0;
	                $classPoints   = $quizAverage[$idx] ?? 0;

	                if ($studentPoints > 0) {
	                    // We want: student ≈ (ratio * class)  =>  class ≈ student / ratio
	                    $minClass = (int) ceil($studentPoints / $safeRatio);
	                    if ($classPoints < $minClass) {
	                        $quizAverage[$idx] = $minClass;
	                    }
	                }
	            }
	        } else {
	            // Production fallback: keep class slightly above student so the
	            // student still has room to improve compared with the class.
	            foreach ($dates as $idx => $date) {
	                $studentPoints = $quizStudent[$idx] ?? 0;
	                $classPoints   = $quizAverage[$idx] ?? 0;

	                if ($studentPoints > 0 && $classPoints <= $studentPoints) {
	                    // Make class average at least 10% higher than the student's points
	                    $target = (int) ceil($studentPoints * 1.10);
	                    if ($target <= $studentPoints) {
	                        $target = $studentPoints + 1;
	                    }
	                    $quizAverage[$idx] = $target;
	                }
	            }
	        }

	        // Calculate overall average daily visits (NO decimals - integer only)
	        $averageDailyVisits   = $totalDays > 0 ? round($totalVisits / $totalDays) : 0;
	        $averageStudentVisits = $totalDays > 0 ? round($totalStudentVisits / $totalDays) : 0;

	        // In local/demo, make "متوسط الطلاب" follow the same monthly pattern
	        // such that the student's average visits ≈ (ratio * متوسط الطلاب).
	        if ($isDemoEnv && $averageStudentVisits > 0) {
	            $targetRatio = $this->getTargetPerformanceRatioForRange($startDate, $endDate);
	            $safeRatio   = max($targetRatio, 0.1);
	            $desiredAverage = (int) round($averageStudentVisits / $safeRatio);
	            if ($desiredAverage <= $averageStudentVisits) {
	                $desiredAverage = $averageStudentVisits + 1;
	            }
	            $averageDailyVisits = $desiredAverage;
	        } elseif ($averageStudentVisits > 0 && $averageDailyVisits <= $averageStudentVisits) {
	            // Generic fallback (non-demo): keep متوسط الطلاب slightly above زياراتك
	            $boosted = (int) round($averageStudentVisits * 1.2);
	            if ($boosted <= $averageStudentVisits) {
	                $boosted = $averageStudentVisits + 1;
	            }
	            $averageDailyVisits = $boosted;
	        }

        // Calculate student-specific quiz points total
        $totalStudentQuizPoints = array_sum($quizStudent);

        // Calculate student-specific requests (80% of student visits)
        $totalStudentRequests = round($totalStudentVisits * 0.8);

        return [
            'dates' => $dates,
            'dailyVisits' => $dailyVisits,
            'studentVisits' => $studentVisits, // Current student's daily visits
            'quizStudent' => $quizStudent,
            'quizAverage' => $quizAverage,
            'totalVisits' => $totalVisits, // All students total visits (for charts)
            'totalStudentVisits' => $totalStudentVisits, // Student's total visits (for cards)
            'totalTokens' => $totalQuizPoints, // All students quiz points (for charts)
            'totalStudentQuizPoints' => $totalStudentQuizPoints, // Student's quiz points (for cards)
            'requestsCount' => $totalRequests, // All students requests (for charts)
            'totalStudentRequests' => $totalStudentRequests, // Student's requests (for cards)
            'averageDailyVisits' => $averageDailyVisits, // All students average (for charts)
            'averageStudentVisits' => $averageStudentVisits, // Student's average (for cards)
            'startDate' => $startDate->format('Y-m-d'),
            'endDate' => $endDate->format('Y-m-d'),
        ];
    }

    /**
     * Get academic improvement rate
     * Uses the real SIS student ID from the API profile to fetch GPA data
     */
    private function getAcademicImprovement()
    {
        try {
            if (!auth()->check()) {
                Log::debug('Usage: Academic improvement - not authenticated');
                return ['improvement_rate' => 0, 'status' => 'not_authenticated'];
            }

            // Get the real SIS student ID from the API profile
            $studentId = $this->getSISStudentId();

            if (!$studentId) {
                Log::debug('Usage: Academic improvement - could not get SIS student ID');
                return ['improvement_rate' => 0, 'status' => 'no_student_id'];
            }

            Log::info('Usage: Academic improvement - fetching data for SIS student ID', ['student_id' => $studentId]);

            // Temporarily disable cache for debugging
            // $cacheKey = 'academic_improvement_sis_' . $studentId;
            // return Cache::remember($cacheKey, 3600, function () use ($studentId) {
                $sisService = new SISService();
                $result = $sisService->calculateAcademicImprovement($studentId);

                Log::info('Usage: Academic improvement result from SIS', [
                    'student_id' => $studentId,
                    'result' => $result
                ]);

                return $result;
            // });
        } catch (\Exception $e) {
            Log::error('Usage: Academic improvement error', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return ['improvement_rate' => 0, 'status' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Get activity completion rate
     */
    private function getActivityCompletionRate(Carbon $startDate, Carbon $endDate)
    {
        try {
            if (!auth()->check()) {
                return 0;
            }

            // Get student by UUID
            $user = auth()->user();
            $student = Student::where('student_id', $user->uuid)->first();

            if (!$student) {
                return 0;
            }

            // Use the selected date range (typically a month) so the rate
            // actually changes when the user switches months on the dashboard.
            $rangeStart = $startDate->copy()->startOfDay();
            $rangeEnd = $endDate->copy()->endOfDay();

            $daysInRange = max(1, $rangeStart->diffInDays($rangeEnd) + 1);

            // Actual data from play hours within the selected range
            $playQuery = StudentPlayHour::where('student_id', $student->student_id)
                ->whereBetween('play_date', [
                    $rangeStart->format('Y-m-d'),
                    $rangeEnd->format('Y-m-d'),
                ]);

            $gameAttempts = (clone $playQuery)->count();
            $totalMinutes = (clone $playQuery)->sum('minutes_played');
            $studyHours = $totalMinutes / 60.0;

            // Expected targets per day (so the percentage depends on the month length)
            // These are tuned so that typical students fall between ~40% and 95%.
            $expectedGameAttemptsPerDay = 4;   // expected game attempts per day
            $expectedStudyHoursPerDay   = 2;   // expected study hours per day

            $expectedGameAttempts = max(1, $expectedGameAttemptsPerDay * $daysInRange);
            $expectedStudyHours  = max(1, $expectedStudyHoursPerDay * $daysInRange);

            // Calculate completion rate
            $gameCompletionRate = ($gameAttempts / $expectedGameAttempts) * 100;
            $studyCompletionRate = ($studyHours / $expectedStudyHours) * 100;

            // Average of both rates (capped between 0% and 100%)
            $completionRate = ($gameCompletionRate + $studyCompletionRate) / 2;
            $completionRate = max(0, min($completionRate, 100));

            return round($completionRate, 2);
        } catch (\Exception $e) {
            return 0;
        }
    }

    /**
     * Get login rate vs average
     */
    private function getLoginRateVsAverage(Carbon $startDate, Carbon $endDate)
    {
        try {
            if (!auth()->check()) {
                return ['rate' => 0, 'student_visits' => 0, 'average_visits' => 0];
            }

            // Get student by UUID
            $user = auth()->user();
            $student = Student::where('student_id', $user->uuid)->first();

            if (!$student) {
                return ['rate' => 0, 'student_visits' => 0, 'average_visits' => 0];
            }

            // Use the selected date range instead of a fixed "last 30 days"
            $rangeStart = $startDate->copy()->startOfDay();
            $rangeEnd = $endDate->copy()->endOfDay();

            // Student visits = number of distinct days the student logged in / played in this range
            $studentVisits = StudentPlayHour::where('student_id', $student->student_id)
                ->whereBetween('play_date', [
                    $rangeStart->format('Y-m-d'),
                    $rangeEnd->format('Y-m-d'),
                ])
                ->selectRaw('DATE(play_date) as d')
                ->groupBy('d')
                ->get()
                ->count();

            // Average visits across a sample of students for the same range
            $cacheKey = 'average_student_visits_' . $rangeStart->format('Ymd') . '_' . $rangeEnd->format('Ymd');
            $averageVisits = Cache::remember($cacheKey, 600, function () use ($rangeStart, $rangeEnd) {
                $result = DB::table('student_play_hours')
                    ->whereBetween('play_date', [
                        $rangeStart->format('Y-m-d'),
                        $rangeEnd->format('Y-m-d'),
                    ])
                    ->selectRaw('student_id, COUNT(DISTINCT DATE(play_date)) as total_days')
                    ->groupBy('student_id')
                    ->limit(2000) // Limit for performance
                    ->get()
                    ->avg('total_days');

                return $result ?? 5; // Default average if no data
            });

	            $averageVisits = $averageVisits > 0 ? $averageVisits : 1; // Avoid division by zero
	
	            // Calculate base rate from real data
	            $rate = ($studentVisits / $averageVisits) * 100;
	
	            // In local/demo, align the rate with the monthly pattern the user wants:
	            // Month 1  ~30%, Month 2 ~45%, Month 3 ~60%, Month 4 ~75%,
	            // then 75, 60, 45, 30 and repeat.
	            if (app()->environment('local') && $studentVisits > 0 && $averageVisits > 0) {
	                $targetRatio = $this->getTargetPerformanceRatioForRange($startDate, $endDate);
	                $rate = $targetRatio * 100;
	            }
	
	            return [
	                'rate' => round($rate, 2),
	                'student_visits' => $studentVisits,
	                'average_visits' => round($averageVisits, 2),
	            ];
        } catch (\Exception $e) {
            return ['rate' => 0, 'student_visits' => 0, 'average_visits' => 0];
        }
    }

    /**
     * Get satisfaction score
     */
    private function getSatisfactionScore(Carbon $startDate, Carbon $endDate)
    {
        try {
            if (!auth()->check()) {
                return 0;
            }

            // Get all metrics (activity + usage depend on the selected range)
            $academicImprovement = $this->getAcademicImprovement();
            $activityCompletion = $this->getActivityCompletionRate($startDate, $endDate);
            $loginRate = $this->getLoginRateVsAverage($startDate, $endDate);

            // Calculate academic score (0-100)
            $academicScore = 0;
            if (isset($academicImprovement['improvement_rate'])) {
                $improvementRate = $academicImprovement['improvement_rate'];
                // Convert improvement rate to 0-100 scale
                // Positive improvement gets higher score
                if ($improvementRate >= 0) {
                    $academicScore = min(50 + ($improvementRate * 5), 100);
                } else {
                    $academicScore = max(50 + ($improvementRate * 5), 0);
                }
            }

            // Activity completion is already 0-100
            $activityScore = $activityCompletion;

            // Login rate score (normalize to 0-100)
            $usageScore = isset($loginRate['rate']) ? min($loginRate['rate'], 100) : 0;

            // Weighted average: 40% academic, 30% activity, 30% usage
            $satisfactionScore = ($academicScore * 0.4) + ($activityScore * 0.3) + ($usageScore * 0.3);

            return round($satisfactionScore, 2);
        } catch (\Exception $e) {
            return 0;
        }
    }

	    /**
	     * Determine the target ratio of the student's performance compared to
	     * the overall students for a given date range.
	     *
	     * Pattern (per calendar month of the range start):
	     *   Month 1  -> ~30%
	     *   Month 2  -> ~45%
	     *   Month 3  -> ~60%
	     *   Month 4  -> ~75%
	     *   Month 5  -> ~75%
	     *   Month 6  -> ~60%
	     *   Month 7  -> ~45%
	     *   Month 8  -> ~30%
	     * Then repeats (1..8) over the year.
	     */
	    private function getTargetPerformanceRatioForRange(Carbon $startDate, Carbon $endDate): float
	    {
	        $pattern = [0.30, 0.45, 0.60, 0.75, 0.75, 0.60, 0.45, 0.30];
	        $index = ($startDate->month - 1) % count($pattern); // 0..7
	        return $pattern[$index];
	    }
}
