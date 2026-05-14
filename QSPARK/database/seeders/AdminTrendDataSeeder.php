<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AdminTrendData;
use App\Services\SISService;

class AdminTrendDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Seeds sample trend data based on 80% approximation of realistic student data
     */
    public function run(): void
    {
        $this->command->info('🌱 Seeding admin trend data...');

        // Get current semester
        $sisService = new SISService();
        $currentSemester = $sisService->getCurrentSemester();

        // Generate data for last 5 semesters
        $semesterCount = 5;

        // Base values for realistic data
        $baseGpa = 3.0;
        $baseStudentCount = 120;

        for ($i = $semesterCount - 1; $i >= 0; $i--) {
            $semester = $currentSemester - $i;

            // Simulate gradual improvement in GPA (80% approximation)
            // GPA increases slightly each semester
            $gpa = round($baseGpa + (0.15 * ($semesterCount - $i - 1)), 2);

            // Student count increases gradually (80% approximation)
            $studentCount = $baseStudentCount + (10 * ($semesterCount - $i - 1));

            // Active students for engagement (slightly less than total)
            $activeStudents = round($studentCount * 0.85);

            // Store GPA trend data
            AdminTrendData::updateOrCreate(
                [
                    'semester' => $semester,
                    'data_type' => 'gpa_trend',
                ],
                [
                    'value' => $gpa,
                    'student_count' => $studentCount,
                ]
            );

            // Store engagement trend data
            AdminTrendData::updateOrCreate(
                [
                    'semester' => $semester,
                    'data_type' => 'engagement_trend',
                ],
                [
                    'student_count' => $activeStudents,
                    'value' => 0, // Not used for engagement
                ]
            );

            $this->command->info("✅ Semester {$semester}: GPA={$gpa}, Students={$studentCount}, Active={$activeStudents}");
        }

        $this->command->info('✅ Admin trend data seeded successfully!');
    }
}
