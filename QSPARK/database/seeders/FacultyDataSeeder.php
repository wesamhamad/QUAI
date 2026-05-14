<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FacultyCourseCache;
use App\Models\FacultyStudentCache;
use App\Services\SISService;
use Illuminate\Support\Facades\Log;

class FacultyDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Starting Faculty Data Sync from Oracle...');

        $sisService = new SISService();
        
        // Get current semester
        $currentSemester = $sisService->getCurrentSemester();
        $this->command->info("Current Semester: {$currentSemester}");

        // Get all instructors (you can modify this to sync specific instructors)
        // For now, we'll get instructors from the users table with role 'faculty'
        $instructors = \App\Models\User::where('role', 'faculty')->get();

        if ($instructors->isEmpty()) {
            $this->command->warn('No faculty users found. Please ensure users have role="faculty".');
            return;
        }

        $this->command->info("Found {$instructors->count()} faculty members to sync.");

        foreach ($instructors as $instructor) {
            $instructorId = $instructor->employee_id ?? $instructor->uuid;
            
            if (!$instructorId) {
                $this->command->warn("Skipping instructor {$instructor->email} - no employee_id or uuid");
                continue;
            }

            $this->command->info("Syncing data for instructor: {$instructor->arabic_full_name} ({$instructorId})");

            try {
                // Fetch data from Oracle
                $this->command->info("  - Fetching courses...");
                $courses = $sisService->getFacultyCourses($instructorId, $currentSemester);
                
                $this->command->info("  - Fetching students...");
                $students = $sisService->getFacultyStudents($instructorId, $currentSemester);
                
                $this->command->info("  - Fetching GPA data...");
                $gpaData = $sisService->getAllStudentsWithGPA($instructorId, $currentSemester);
                
                $this->command->info("  - Fetching attendance data...");
                $attendanceData = $sisService->getFacultyStudentsAttendance($instructorId, $currentSemester);

                // Sync courses
                $this->command->info("  - Syncing courses to cache...");
                FacultyCourseCache::syncFromOracle($instructorId, $currentSemester, $courses);
                
                // Sync students
                $this->command->info("  - Syncing students to cache...");
                FacultyStudentCache::syncFromOracle($instructorId, $currentSemester, $students, $gpaData, $attendanceData);

                $this->command->info("  ✓ Successfully synced data for {$instructor->arabic_full_name}");
                $this->command->info("    Courses: " . count($courses));
                $this->command->info("    Students: " . count($students));
                $this->command->info("    GPA Records: " . count($gpaData));
                $this->command->info("    Attendance Records: " . count($attendanceData));

            } catch (\Exception $e) {
                $this->command->error("  ✗ Error syncing data for {$instructor->arabic_full_name}: {$e->getMessage()}");
                Log::error("Faculty data sync error", [
                    'instructor_id' => $instructorId,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }

        $this->command->info('Faculty Data Sync completed!');
    }
}

