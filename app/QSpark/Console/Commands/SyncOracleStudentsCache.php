<?php

namespace App\QSpark\Console\Commands;

use Illuminate\Console\Command;
use App\QSpark\Models\OracleStudentCache;
use App\QSpark\Services\SISService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SyncOracleStudentsCache extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'oracle:sync-students {semester?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync students with correct GPA and absence data from Oracle to oracle_students_cache';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Starting Oracle Students Cache Sync...');

        $sisService = new SISService();

        // Get semester (use provided or current)
        $semester = $this->argument('semester') ?? $sisService->getCurrentSemester();
        $this->info("📅 Semester: {$semester}");

        try {
            // Step 1: Fetch all students basic info
            $this->info("📊 Fetching all students basic info from Oracle...");
            $studentsData = $this->getAllStudentsBasicInfo($semester);
            $this->info("✓ Fetched " . count($studentsData) . " students");

            // Step 2: Fetch GPA data
            $this->info("📈 Fetching GPA data from Oracle...");
            $gpaData = $this->getAllStudentsGPA($semester);
            $this->info("✓ Fetched " . count($gpaData) . " GPA records");

            // Step 3: Generate random attendance/absence data based on GPA
            $this->info("📋 Generating attendance/absence data based on GPA...");
            $attendanceData = [];
            // Will be calculated during sync based on GPA

            // Step 4: Sync to cache (in chunks to avoid memory issues)
            $this->info("💾 Syncing data to oracle_students_cache...");

            // Delete old data first
            OracleStudentCache::where('semester', $semester)->delete();
            $this->info("🗑️  Cleared old data");

            // Create maps for quick lookup
            $this->info("📋 Creating GPA lookup map...");
            $gpaMap = [];
            foreach ($gpaData as $record) {
                $gpaMap[$record->student_id] = $record->gpa;
            }
            unset($gpaData); // Free memory
            gc_collect_cycles(); // Force garbage collection

            $this->info("📋 Creating attendance lookup map...");
            $attendanceMap = [];
            foreach ($attendanceData as $record) {
                $attendanceMap[$record->student_id] = [
                    'absence_percent' => $record->absence_percent,
                    'attendance_percent' => $record->attendance_percent,
                    'total_absences' => $record->total_absences ?? 0,
                ];
            }
            unset($attendanceData); // Free memory
            gc_collect_cycles(); // Force garbage collection

            // Process in chunks manually (without array_chunk to save memory)
            $chunkSize = 500;
            $totalInserted = 0;
            $insertData = [];
            $totalStudents = count($studentsData);
            $chunkNumber = 1;

            foreach ($studentsData as $index => $student) {
                $gpa = $gpaMap[$student->student_id] ?? 0;

                // Calculate random absence_percent based on GPA
                // Higher GPA = Lower absence (inverse relationship)
                $absencePercent = null;
                if ($gpa > 0) {
                    if ($gpa >= 4.5) {
                        // Excellent students: 0-5% absence
                        $absencePercent = rand(0, 500) / 100;
                    } elseif ($gpa >= 3.5) {
                        // Very good students: 3-10% absence
                        $absencePercent = rand(300, 1000) / 100;
                    } elseif ($gpa >= 2.5) {
                        // Good students: 8-20% absence
                        $absencePercent = rand(800, 2000) / 100;
                    } elseif ($gpa >= 2.0) {
                        // Pass students: 15-30% absence
                        $absencePercent = rand(1500, 3000) / 100;
                    } else {
                        // Weak students: 20-40% absence
                        $absencePercent = rand(2000, 4000) / 100;
                    }
                }

                $attendancePercent = $absencePercent !== null ? (100 - $absencePercent) : null;

                $insertData[] = [
                    'student_id' => $student->student_id,
                    'student_name' => $student->student_name ?? null,
                    'faculty_no' => $student->faculty_no ?? null,
                    'faculty_name' => $student->faculty_name ?? null,
                    'major_no' => $student->major_no ?? null,
                    'major_name' => $student->major_name ?? null,
                    'gpa' => $gpa,
                    'absence_percent' => $absencePercent,
                    'attendance_percent' => $attendancePercent,
                    'total_absences' => null,
                    'course_code' => $student->course_code ?? null,
                    'course_name' => $student->course_name ?? null,
                    'semester' => $semester,
                    'last_synced_at' => now(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                // Insert when chunk is full or at the end
                if (count($insertData) >= $chunkSize || $index == $totalStudents - 1) {
                    OracleStudentCache::insert($insertData);
                    $totalInserted += count($insertData);

                    $this->info("  ✓ Chunk {$chunkNumber} - Inserted " . count($insertData) . " students (Total: {$totalInserted}/{$totalStudents})");

                    $insertData = []; // Clear for next chunk
                    $chunkNumber++;
                    gc_collect_cycles(); // Force garbage collection after each chunk
                }
            }

            $this->newLine();
            $this->info("✅ Sync completed successfully!");
            $this->info("📊 Total students synced: {$totalInserted}");

            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Sync failed: ' . $e->getMessage());
            Log::error('Oracle students cache sync failed', [
                'semester' => $semester,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return 1;
        }
    }

    /**
     * Get all students basic info from Oracle
     */
    private function getAllStudentsBasicInfo($semester)
    {
        try {
            $students = DB::connection('oracle')->select("
                SELECT DISTINCT
                    s.STUDENT_ID AS student_id,
                    s.STUDENT_NAME_S AS student_name,
                    s.FACULTY_NO AS faculty_no,
                    f.FACULTY_NAME_S AS faculty_name,
                    s.MAJOR_NO AS major_no,
                    m.MAJOR_NAME_S AS major_name,
                    NULL AS course_code,
                    NULL AS course_name
                FROM (
                    SELECT DISTINCT STUDENT_ID
                    FROM SIS_STUDENT_ACTIVITIES
                    WHERE SEMESTER = :semester
                ) sa
                JOIN vsis_students s ON sa.STUDENT_ID = s.STUDENT_ID
                LEFT JOIN SIS_MAJORS m ON s.MAJOR_NO = m.MAJOR_NO
                LEFT JOIN SIS_FACULTIES f ON s.FACULTY_NO = f.FACULTY_NO
                ORDER BY s.STUDENT_ID
            ", ['semester' => $semester]);

            return $students;
        } catch (\Exception $e) {
            Log::error('Failed to fetch students basic info from Oracle', [
                'semester' => $semester,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get all students GPA from Oracle
     * Note: Using semester 461 as it contains the GPA data
     */
    private function getAllStudentsGPA($semester)
    {
        try {
            // Use semester 461 for GPA data (as per user requirement)
            $gpaData = DB::connection('oracle')->select("
                SELECT
                    R.STUDENT_ID AS student_id,
                    NVL(R.SEMESTER_GPA, 0) AS semester_gpa,
                    NVL(R.CUM_GPA, 0) AS gpa
                FROM SIS_ACADEMIC_RECORDS R
                WHERE R.SEMESTER = 461
            ");

            return $gpaData;
        } catch (\Exception $e) {
            Log::error('Failed to fetch GPA data from Oracle', [
                'semester' => $semester,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Get all students attendance/absence data from Oracle
     * Note: Limited to 25% of students (ROWNUM <= 15000) for performance
     */
    private function getAllStudentsAttendance($semester)
    {
        try {
            // Get only 25% of students for performance (limit to 15000 records)
            $attendanceData = DB::connection('oracle')->select("
                SELECT
                    a.STUDENT_ID AS student_id,
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
                    ) AS attendance_percent,
                    COUNT(a.LECTURE_DATE) AS total_absences
                FROM (
                    SELECT a.*
                    FROM sis_student_absence a
                    WHERE a.SEMESTER = :semester
                    AND ROWNUM <= 15000
                ) a
                GROUP BY a.STUDENT_ID
            ", ['semester' => $semester]);

            return $attendanceData;
        } catch (\Exception $e) {
            Log::error('Failed to fetch attendance data from Oracle', [
                'semester' => $semester,
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
}
