<?php

namespace Database\Seeders\QSpark;

use Illuminate\Database\Seeder;
use App\QSpark\Models\Student;
use App\QSpark\Models\StudentPlayHour;
use App\QSpark\Models\User;
use Carbon\Carbon;

class StudentMetricsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all users with student role
        $students = User::where('role', 'student')->get();

        foreach ($students as $user) {
            // Create or update student record
            $student = Student::updateOrCreate(
                ['student_id' => $user->uuid],
                [
                    'arabic_name' => $user->arabic_full_name ?? $user->name,
                    'english_name' => $user->english_full_name ?? $user->name,
                    'email' => $user->email,
                    'gender' => rand(0, 1) ? 'Male' : 'Female',
                    'gpa' => rand(250, 500) / 100, // 2.50 to 5.00
                    'attendance_rate' => rand(7000, 10000) / 100, // 70% to 100%
                    'total_study_hours' => rand(600, 2400), // 10-40 hours in minutes
                    'game_points' => rand(1000, 10000),
                    'game_attempts' => rand(5, 25),
                ]
            );

            // Add play hours for the last 30 days
            $startDate = Carbon::now()->subDays(30);
            $endDate = Carbon::now();

            $currentDate = $startDate->copy();
            while ($currentDate <= $endDate) {
                // Random chance of playing each day (70% chance)
                if (rand(1, 100) <= 70) {
                    StudentPlayHour::updateOrCreate(
                        [
                            'student_id' => $student->student_id,
                            'play_date' => $currentDate->format('Y-m-d'),
                        ],
                        [
                            'minutes_played' => rand(15, 120), // 15 minutes to 2 hours
                        ]
                    );
                }

                $currentDate->addDay();
            }

            $this->command->info("Added metrics for student: {$student->student_id}");
        }

        $this->command->info('Student metrics seeded successfully!');
    }
}

