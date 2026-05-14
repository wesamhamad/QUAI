<?php

namespace App\QSpark\Console\Commands;

use Illuminate\Console\Command;
use App\QSpark\Models\AdminStudentCache;
use App\QSpark\Models\AdminFacultyCache;
use App\QSpark\Models\AdminEngagementMetric;
use App\QSpark\Models\AdminImprovingStudent;
use App\QSpark\Services\SISService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SyncAdminData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:sync {semester?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync all students data from Oracle to admin cache';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting Admin Data Sync from Oracle...');

        $sisService = new SISService();
        
        // Get semester (use provided or current)
        $semester = $this->argument('semester') ?? $sisService->getCurrentSemester();
        $this->info("Semester: {$semester}");

        try {
            // Fetch all students with GPA from Oracle
            $this->info("Fetching all students with GPA from Oracle...");
            $this->line("This may take several minutes for large datasets...");
            
            $studentsWithGPA = $this->getAllStudentsWithGPA($semester);
            $this->info("✓ Fetched " . count($studentsWithGPA) . " students with GPA");

            // Fetch all students attendance from Oracle
            $this->info("Fetching all students attendance from Oracle...");
            $attendanceData = $this->getAllStudentsAttendance($semester);
            $this->info("✓ Fetched " . count($attendanceData) . " attendance records");

            // Sync students to cache
            $this->info("Syncing student data to cache...");
            $syncedCount = AdminStudentCache::syncFromOracle($semester, $studentsWithGPA, $attendanceData);
            $this->info("✓ Synced {$syncedCount} students");

            // Fetch and sync faculty data
            $this->info("Fetching all faculty members from Oracle...");
            $facultyData = $this->getAllFaculty();
            $this->info("✓ Fetched " . count($facultyData) . " faculty members");

            $this->info("Syncing faculty data to cache...");
            $facultySyncedCount = AdminFacultyCache::syncFromOracle($facultyData);
            $this->info("✓ Synced {$facultySyncedCount} faculty members");

            $this->newLine();
            $this->info("✓ Sync completed successfully!");
            $this->info("Total students synced: {$syncedCount}");
            $this->info("Students with GPA: " . count($studentsWithGPA));
            $this->info("Students with attendance: " . count($attendanceData));
            $this->info("Total faculty synced: {$facultySyncedCount}");

            // Show some statistics
            $this->newLine();
            $this->info("Cache Statistics:");
            $avgGpa = AdminStudentCache::where('semester', $semester)
                ->whereNotNull('last_recorded_gpa')
                ->avg('last_recorded_gpa');
            $this->line("  Average GPA: " . round($avgGpa, 2));

            $avgAttendance = AdminStudentCache::where('semester', $semester)
                ->whereNotNull('attendance_percent')
                ->avg('attendance_percent');
            $this->line("  Average Attendance: " . round($avgAttendance, 2) . "%");

            $atRiskCount = AdminStudentCache::where('semester', $semester)
                ->where(function($query) {
                    $query->where('last_recorded_gpa', '<', 3.0)
                          ->orWhere('attendance_percent', '<', 75);
                })
                ->count();
            $this->line("  Students at Risk: {$atRiskCount}");

            // Calculate and store engagement metrics
            $this->newLine();
            $this->info("Calculating engagement metrics...");
            $metrics = $this->calculateEngagementMetrics($semester);
            AdminEngagementMetric::storeMetrics($semester, $metrics);
            $this->info("✓ Engagement metrics calculated and stored");

            // Calculate and store improving students
            $this->newLine();
            $this->info("Calculating improving students...");
            $this->calculateImprovingStudents($semester);
            $this->info("✓ Improving students calculated and stored");

            return 0;

        } catch (\Exception $e) {
            $this->error("✗ Error: {$e->getMessage()}");
            Log::error("Admin data sync error", [
                'semester' => $semester,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return 1;
        }
    }

    /**
     * Get all students with GPA from Oracle
     */
    private function getAllStudentsWithGPA($semester)
    {
        try {
            $students = DB::connection('oracle')->select("
                SELECT * FROM (
                    SELECT DISTINCT
                        f.STUDENT_ID AS student_id,
                        SIS_GETTERS.GET_STUDENT(f.STUDENT_ID, 1) AS student_name,
                        sis_reg_pkg.get_student_gpa(f.STUDENT_ID, NULL, 1) AS last_recorded_gpa,
                        MIN(t.COURSE_NO) AS course_code,
                        SIS_GETTERS.GET_COURSE(MIN(t.COURSE_NO), 1) AS course_name,
                        s.FACULTY_NO AS faculty_no,
                        SIS_GETTERS.GET_FACULTY(s.FACULTY_NO, 1) AS faculty_name,
                        s.MAJOR_NO AS major_no,
                        SIS_GETTERS.GET_MAJOR(s.MAJOR_NO, 1) AS major_name,
                        s.DEPT_NO AS dept_no,
                        SIS_GETTERS.GET_DEPT(s.FACULTY_NO, s.DEPT_NO, 1) AS dept_name
                    FROM SIS_STUDENT_ACTIVITIES f
                    JOIN SIS_SECTION_INSTRUCTORS t ON t.SEMESTER = f.SEMESTER
                        AND t.COURSE_NO = f.COURSE_NO
                        AND t.SECTION = f.SECTION
                        AND t.ACTIVITY_CODE = f.ACTIVITY_CODE
                    JOIN vSIS_STUDENTS s ON s.STUDENT_ID = f.STUDENT_ID
                    WHERE f.SEMESTER = :semester
                    GROUP BY f.STUDENT_ID, s.FACULTY_NO, s.MAJOR_NO, s.DEPT_NO
                    HAVING sis_reg_pkg.get_student_gpa(f.STUDENT_ID, NULL, 1) IS NOT NULL
                )
                ORDER BY last_recorded_gpa DESC
            ", ['semester' => $semester]);

            return $students;
        } catch (\Exception $e) {
            Log::error('Failed to fetch all students with GPA from SIS', [
                'semester' => $semester,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get all students attendance from Oracle
     * Improved version with better NULL handling and no ROWNUM limit
     */
    private function getAllStudentsAttendance($semester)
    {
        try {
            $attendanceData = DB::connection('oracle')->select("
                SELECT
                    a.STUDENT_ID AS student_id,
                    SIS_GETTERS.GET_STUDENT(a.STUDENT_ID, 1) AS student_name,
                    AVG(
                        CASE
                            WHEN sis_absence_pkg.get_all_absence_percent(
                                a.student_id,
                                a.semester,
                                a.campus_no,
                                a.degree_code,
                                a.course_no,
                                a.course_edition
                            ) IS NULL THEN 0
                            ELSE sis_absence_pkg.get_all_absence_percent(
                                a.student_id,
                                a.semester,
                                a.campus_no,
                                a.degree_code,
                                a.course_no,
                                a.course_edition
                            )
                        END
                    ) AS absence_percent,
                    AVG(
                        CASE
                            WHEN sis_absence_pkg.get_all_absence_percent(
                                a.student_id,
                                a.semester,
                                a.campus_no,
                                a.degree_code,
                                a.course_no,
                                a.course_edition
                            ) IS NULL THEN 100
                            ELSE 100 - sis_absence_pkg.get_all_absence_percent(
                                a.student_id,
                                a.semester,
                                a.campus_no,
                                a.degree_code,
                                a.course_no,
                                a.course_edition
                            )
                        END
                    ) AS attendance_percent
                FROM sis_student_absence a
                WHERE a.SEMESTER = :semester
                GROUP BY a.STUDENT_ID
            ", [
                'semester' => $semester
            ]);

            return $attendanceData;
        } catch (\Exception $e) {
            Log::error('Failed to fetch all students attendance from SIS', [
                'semester' => $semester,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get all faculty members from Oracle
     */
    private function getAllFaculty()
    {
        try {
            $faculty = DB::connection('oracle')->select("
                SELECT
                    s.INSTRUCTOR_ID,
                    s.INSTRUCTOR_NAME_S AS name_ar,
                    s.EMAIL,
                    s.FACULTY_NO,
                    SIS_GETTERS.GET_FACULTY(s.FACULTY_NO, 1) AS faculty_name,
                    s.DEPT_NO,
                    SIS_GETTERS.GET_DEPT(s.FACULTY_NO, s.DEPT_NO, 1) AS dept_name,
                    s.RANK_CODE,
                    SIS_GETTERS.GET_SCIENTIFIC_RANK(s.RANK_CODE, 1) AS rank_name
                FROM SIS_INSTRUCTORS s
                JOIN SIS_FACULTIES f ON s.FACULTY_NO = f.FACULTY_NO
                JOIN SIS_DEPTS d ON s.FACULTY_NO = d.FACULTY_NO AND s.DEPT_NO = d.DEPT_NO
                WHERE f.IS_WEB = 1
                  AND f.IS_USED = 1
                  AND d.IS_WEB = 1
                  AND d.IS_USED = 1
                ORDER BY s.FACULTY_NO, s.DEPT_NO, s.INSTRUCTOR_NAME_S
            ");

            return $faculty;
        } catch (\Exception $e) {
            Log::error('Failed to fetch all faculty from SIS', [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Calculate engagement metrics for all faculties and specializations
     */
    private function calculateEngagementMetrics($semester)
    {
        try {
            // Get all faculties from Oracle
            $faculties = DB::connection('oracle')->select("
                SELECT DISTINCT D.FACULTY_NO, SIS_GETTERS.GET_FACULTY(D.FACULTY_NO,1) faculty_name
                FROM SIS_DEPTS d, SIS_FACULTIES f
                WHERE D.FACULTY_NO=F.FACULTY_NO
                AND F.IS_WEB=1 AND F.IS_USED=1
                ORDER BY D.FACULTY_NO
            ");

            // Calculate engagement metrics for each faculty
            $engagementByCollege = [];
            foreach ($faculties as $faculty) {
                $metrics = DB::table('admin_students_cache')
                    ->where('semester', $semester)
                    ->where('faculty_no', (string)$faculty->faculty_no)
                    ->select(
                        DB::raw('COUNT(DISTINCT student_id) as student_count'),
                        DB::raw('AVG(last_recorded_gpa) as avg_gpa'),
                        DB::raw('AVG(attendance_percent) as avg_attendance')
                    )
                    ->first();

                if ($metrics && $metrics->student_count > 0) {
                    $engagementByCollege[] = [
                        'faculty_no' => (string)$faculty->faculty_no,
                        'faculty_name' => $faculty->faculty_name,
                        'student_count' => (int)$metrics->student_count,
                        'avg_gpa' => round($metrics->avg_gpa ?? 0, 2),
                        'avg_attendance' => round($metrics->avg_attendance ?? 0, 2)
                    ];
                }
            }

            // Sort by student count descending
            usort($engagementByCollege, function($a, $b) {
                return $b['student_count'] <=> $a['student_count'];
            });

            // Engagement by specialization (major) - limit to top 30 to avoid memory issues
            $engagementBySpecialization = DB::table('admin_students_cache')
                ->where('semester', $semester)
                ->whereNotNull('major_no')
                ->select(
                    'major_no',
                    'major_name',
                    DB::raw('COUNT(DISTINCT student_id) as student_count'),
                    DB::raw('AVG(last_recorded_gpa) as avg_gpa'),
                    DB::raw('AVG(attendance_percent) as avg_attendance')
                )
                ->groupBy('major_no', 'major_name')
                ->orderBy('student_count', 'desc')
                ->limit(30)
                ->get()
                ->map(function($item) {
                    return [
                        'major_no' => $item->major_no,
                        'major_name' => $item->major_name,
                        'student_count' => (int)$item->student_count,
                        'avg_gpa' => round($item->avg_gpa ?? 0, 2),
                        'avg_attendance' => round($item->avg_attendance ?? 0, 2)
                    ];
                })
                ->toArray();

            // Faculty participation rate
            $totalFaculty = count($faculties);
            $facultyWithStudents = count($engagementByCollege);
            $facultyParticipationRate = $totalFaculty > 0 ? ($facultyWithStudents / $totalFaculty) * 100 : 0;

            // Overall engagement rate
            $totalStudents = DB::table('admin_students_cache')
                ->where('semester', $semester)
                ->distinct()
                ->count('student_id');

            $engagedStudents = DB::table('admin_students_cache')
                ->where('semester', $semester)
                ->whereNotNull('last_recorded_gpa')
                ->whereNotNull('attendance_percent')
                ->distinct()
                ->count('student_id');

            $overallEngagementRate = $totalStudents > 0 ? ($engagedStudents / $totalStudents) * 100 : 0;

            return [
                'total_students' => $totalStudents,
                'engaged_students' => $engagedStudents,
                'overall_engagement_rate' => round($overallEngagementRate, 2),
                'total_faculty' => $totalFaculty,
                'faculty_with_students' => $facultyWithStudents,
                'faculty_participation_rate' => round($facultyParticipationRate, 2),
                'engagement_by_college' => $engagementByCollege,
                'engagement_by_specialization' => $engagementBySpecialization,
            ];
        } catch (\Exception $e) {
            Log::error('Failed to calculate engagement metrics', [
                'error' => $e->getMessage()
            ]);
            return [
                'total_students' => 0,
                'engaged_students' => 0,
                'overall_engagement_rate' => 0,
                'total_faculty' => 0,
                'faculty_with_students' => 0,
                'faculty_participation_rate' => 0,
                'engagement_by_college' => [],
                'engagement_by_specialization' => [],
            ];
        }
    }

    /**
     * Calculate and store improving students for each faculty
     */
    private function calculateImprovingStudents($semester)
    {
        try {
            // Clear previous data for this semester
            AdminImprovingStudent::where('semester', $semester)->delete();

            // Get all faculties
            $faculties = DB::connection('oracle')->select("
                SELECT DISTINCT D.FACULTY_NO, SIS_GETTERS.GET_FACULTY(D.FACULTY_NO,1) faculty_name
                FROM SIS_DEPTS d, SIS_FACULTIES f
                WHERE D.FACULTY_NO=F.FACULTY_NO
                AND F.IS_WEB=1 AND F.IS_USED=1
                ORDER BY D.FACULTY_NO
            ");

            // For each faculty, get top 5 improving students
            foreach ($faculties as $faculty) {
                // Get students with GPA improvement for this faculty
                $improvingStudents = DB::table('admin_students_cache')
                    ->where('semester', $semester)
                    ->where('faculty_no', (string)$faculty->faculty_no)
                    ->whereNotNull('last_recorded_gpa')
                    ->orderBy('last_recorded_gpa', 'desc')
                    ->limit(5)
                    ->get();

                // Store each improving student
                foreach ($improvingStudents as $student) {
                    // Fetch full student details and academic records from Oracle
                    $studentDetails = DB::connection('oracle')->select("
                        SELECT
                            s.STUDENT_ID,
                            s.STUDENT_NAME,
                            s.STUDENT_NAME_S,
                            s.FACULTY_NO,
                            f.FACULTY_NAME,
                            f.FACULTY_NAME_S,
                            s.MAJOR_NO,
                            m.MAJOR_NAME,
                            m.MAJOR_NAME_S,
                            m.MAJOR_CODE
                        FROM vsis_students s
                                 LEFT JOIN SIS_MAJORS m ON s.MAJOR_NO = m.MAJOR_NO
                                 LEFT JOIN SIS_FACULTIES f ON s.FACULTY_NO = f.FACULTY_NO
                        WHERE s.STUDENT_ID = :student_id
                    ", ['student_id' => $student->student_id]);

                    if (count($studentDetails) > 0) {
                        $details = $studentDetails[0];

                        // Fetch academic records for GPA improvement calculation
                        // Get current and previous semester
                        $previousSemester = $semester - 1;
                        $academicRecords = DB::connection('oracle')->select("
                            SELECT
                                R.SEMESTER,
                                CASE
                                    WHEN R.SEMESTER_GPA IS NULL THEN 0
                                    ELSE R.SEMESTER_GPA
                                END AS semester_gpa,
                                CASE
                                    WHEN R.CUM_GPA IS NULL THEN 0
                                    ELSE R.CUM_GPA
                                END AS cumulative_gpa,
                                NVL(R.ATTEMPTED_HRS, 0) AS attempted_hours,
                                NVL(R.PASSED_HRS, 0) AS passed_hours,
                                R.STUDENT_LEVEL
                            FROM SIS_ACADEMIC_RECORDS R
                            WHERE R.STUDENT_ID = :student_id
                              AND R.SEMESTER IN (:current_semester, :previous_semester)
                            ORDER BY R.SEMESTER ASC
                        ", [
                            'student_id' => $student->student_id,
                            'current_semester' => $semester,
                            'previous_semester' => $previousSemester
                        ]);

                        // Calculate GPA improvement
                        $previousGpa = 0;
                        $currentGpa = 0;
                        $gpaImprovement = 0;

                        if (count($academicRecords) >= 2) {
                            $previousGpa = (float)$academicRecords[0]->cumulative_gpa;
                            $currentGpa = (float)$academicRecords[1]->cumulative_gpa;
                            $gpaImprovement = $currentGpa - $previousGpa;
                        } elseif (count($academicRecords) === 1) {
                            $currentGpa = (float)$academicRecords[0]->cumulative_gpa;
                            $gpaImprovement = $currentGpa;
                        }

                        AdminImprovingStudent::create([
                            'semester' => $semester,
                            'student_id' => $student->student_id,
                            'student_name' => $student->student_name,
                            'student_name_s' => $details->STUDENT_NAME_S ?? null,
                            'faculty_no' => (string)$faculty->faculty_no,
                            'faculty_name' => $faculty->faculty_name,
                            'faculty_name_s' => $details->FACULTY_NAME_S ?? null,
                            'major_no' => $details->MAJOR_NO ?? null,
                            'major_name' => $details->MAJOR_NAME ?? null,
                            'major_name_s' => $details->MAJOR_NAME_S ?? null,
                            'major_code' => $details->MAJOR_CODE ?? null,
                            'gpa_improvement' => round($gpaImprovement, 2),
                            'previous_gpa' => round($previousGpa, 2),
                            'current_gpa' => round($currentGpa, 2),
                            'current_attendance' => $student->attendance_percent ?? 0,
                        ]);
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Failed to calculate improving students', [
                'error' => $e->getMessage()
            ]);
        }
    }
}

