<?php

namespace App\QSpark\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use App\QSpark\Http\Controllers\StudentDashboardController;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\QSpark\Services\ViewCacheService;

class CalendarController extends Controller
{
    private $studentDashboard;

    public function __construct(StudentDashboardController $studentDashboard)
    {
        $this->studentDashboard = $studentDashboard;
    }

    public function index(Request $request)
    {
        if (!$request->has('view') || !$request->has('month') || !$request->has('year')) {
            return redirect()->route('qspark.calendar.index', [
                'view' => $request->input('view', 'monthly'),
                'month' => (int) $request->input('month', now()->month),
                'year' => (int) $request->input('year', now()->year),
            ]);
        }

        $year = (int) $request->input('year');
        $month = (int) $request->input('month');

        // Cache calendar data for 1 hour
        $cacheKey = 'calendar_data_' . $year . '_' . $month . '_' . auth()->id();
        $calendarData = Cache::remember($cacheKey, 60, function () use ($year, $month) {
            return $this->getCalendarData($year, $month);
        });

        return view('qspark::calendar', $calendarData);
    }

    private function getCalendarData($year, $month)
    {
        // 🔵 جلب بيانات المحاضرات اليومية
        $timeTable = $this->studentDashboard->getStudentTimeTable();
        Log::info('Time table data in calendar controller: ' . json_encode($timeTable));
        $lectures = [];

        if ($timeTable && isset($timeTable['data']['time-table'])) {
            foreach ($timeTable['data']['time-table'] as $index => $class) {
                foreach ($class['times'] as $timeIndex => $time) {
                    // Map English day names to Arabic and vice versa
                    $dayName = $time['day']['name'] ?? '';
                    $dayNameMapped = $this->mapDayName($dayName);
                    
                    $lectureData = [
                        'course_name' => $class['course_name'] ?? '',
                        'course_code' => $class['course_code'] ?? '',
                        'activity_desc' => $class['activity_desc'] ?? '',
                        'day' => $dayNameMapped,
                        'day_number' => $time['day']['number'] ?? '',
                        'start' => $time['time_slot']['formatted']['start'] ?? '',
                        'end' => $time['time_slot']['formatted']['end'] ?? '',
                        'section_seq' => $class['section_seq'] ?? '',
                    ];
                    
                    $lectures[] = $lectureData;
                }
            }
        }

        // 🟣 جلب بيانات الاختبارات النهائية
        $finalExams = $this->studentDashboard->getFinalExamsDate();
        $exams = $finalExams['courses'] ?? [];
        Log::info('$finalExams[courses]', $finalExams['courses']);

        Log::info('$lectures', $lectures);

        // ✅ تمريرها إلى الـ view مع الشهر والسنة
        return [
            'year' => $year,
            'month' => $month,
            'lectures' => $lectures,
            'exams' => $exams,
        ];
    }

    private function mapDayName($dayName)
    {
        $dayMapping = [
            'Sunday' => 'الأحد',
            'Monday' => 'الاثنين', 
            'Tuesday' => 'الثلاثاء',
            'Wednesday' => 'الأربعاء',
            'Thursday' => 'الخميس',
            'Friday' => 'الجمعة',
            'Saturday' => 'السبت',
            // Reverse mapping
            'الأحد' => 'الأحد',
            'الاثنين' => 'الاثنين',
            'الثلاثاء' => 'الثلاثاء', 
            'الأربعاء' => 'الأربعاء',
            'الخميس' => 'الخميس',
            'الجمعة' => 'الجمعة',
            'السبت' => 'السبت'
        ];

        return $dayMapping[$dayName] ?? $dayName;
    }
}
