<?php

namespace Database\Seeders\QSpark;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UsageAnalyticsSeeder extends Seeder
{
    /**
     * Seed realistic usage analytics data from 01/01/2024 to today
     * Based on 60,000 active students at Qassim University
     */
    public function run(): void
    {
        $this->command->info('🚀 Starting Usage Analytics Seeder...');

        // Clear existing data
        $this->command->info('🗑️  Clearing existing analytics data...');
        DB::table('daily_visits')->truncate();
        DB::table('student_play_hours')->truncate();
        DB::table('students')->truncate();

        // Generate data from January 1, 2024 to today
        $startDate = Carbon::parse('2024-01-01');
        $endDate = Carbon::today();

        $this->command->info("📅 Generating data from {$startDate->format('Y-m-d')} to {$endDate->format('Y-m-d')}");

        // Seed students first
        $this->seedStudents();

        // Seed daily visits and game activity
        $this->seedDailyAnalytics($startDate, $endDate);

        $this->command->info('✅ Usage Analytics Seeder completed successfully!');
    }
    
    /**
     * Seed realistic student data
     */
    private function seedStudents(): void
    {
        $this->command->info('👥 Seeding students...');

        $totalStudents = 60000; // Total active students
        $activeGamePlayers = 8000; // Students who actively play games (more realistic for full year)

        $students = [];
        $batchSize = 1000;

        for ($i = 1; $i <= $activeGamePlayers; $i++) {
            // More realistic GPA distribution (bell curve around 3.5-4.0)
            $gpaRand = rand(0, 100);
            if ($gpaRand < 10) {
                $gpa = rand(200, 280) / 100; // 2.00-2.80 (10%)
            } elseif ($gpaRand < 30) {
                $gpa = rand(280, 350) / 100; // 2.80-3.50 (20%)
            } elseif ($gpaRand < 70) {
                $gpa = rand(350, 430) / 100; // 3.50-4.30 (40%)
            } else {
                $gpa = rand(430, 500) / 100; // 4.30-5.00 (30%)
            }

            // More realistic attendance distribution
            $attendanceRand = rand(0, 100);
            if ($attendanceRand < 15) {
                $attendance = rand(5000, 7000) / 100; // 50-70% (15%)
            } elseif ($attendanceRand < 40) {
                $attendance = rand(7000, 8500) / 100; // 70-85% (25%)
            } else {
                $attendance = rand(8500, 10000) / 100; // 85-100% (60%)
            }

            $students[] = [
                'student_id' => '4' . str_pad($i, 8, '0', STR_PAD_LEFT), // QU student IDs start with 4
                'arabic_name' => $this->generateArabicName(),
                'english_name' => 'Student ' . $i,
                'email' => '4' . str_pad($i, 8, '0', STR_PAD_LEFT) . '@qu.edu.sa',
                'gender' => rand(0, 1) ? 'Male' : 'Female',
                'gpa' => $gpa,
                'attendance_rate' => $attendance,
                'total_study_hours' => 0, // Will be updated by play hours
                'game_points' => 0, // Will be updated by game activity
                'game_attempts' => 0,
                'created_at' => Carbon::parse('2024-01-01'),
                'updated_at' => Carbon::now(),
            ];

            // Insert in batches
            if (count($students) >= $batchSize) {
                DB::table('students')->insert($students);
                $students = [];
                $this->command->info("  ✓ Inserted {$i} students...");
            }
        }

        // Insert remaining students
        if (!empty($students)) {
            DB::table('students')->insert($students);
        }

        $this->command->info("  ✅ Seeded {$activeGamePlayers} active game players");
    }
    
    /**
     * Seed daily analytics data
     */
    private function seedDailyAnalytics(Carbon $startDate, Carbon $endDate): void
    {
        $this->command->info('📊 Seeding daily analytics...');
        
        $current = $startDate->copy();
        $totalDays = $startDate->diffInDays($endDate) + 1;
        $dayCount = 0;
        
        $dailyVisits = [];
        $playHours = [];
        
        while ($current <= $endDate) {
            $dayCount++;
            
            // Calculate realistic visit count based on academic calendar
            $visits = $this->calculateDailyVisits($current);
            
            $dailyVisits[] = [
                'visit_date' => $current->format('Y-m-d'),
                'visits_count' => $visits,
                'created_at' => $current->copy()->setTime(23, 59, 59),
                'updated_at' => $current->copy()->setTime(23, 59, 59),
            ];

            // Generate game play hours for active students
            $this->generateDailyPlayHours($current, $visits, $playHours);

            // Insert in batches every 30 days
            if ($dayCount % 30 == 0 || $current->eq($endDate)) {
                if (!empty($dailyVisits)) {
                    DB::table('daily_visits')->insert($dailyVisits);
                    $dailyVisits = [];
                }

                if (!empty($playHours)) {
                    DB::table('student_play_hours')->insert($playHours);
                    $this->updateStudentStats($playHours);
                    $playHours = [];
                }

                $this->command->info("  ✓ Processed {$dayCount}/{$totalDays} days...");
            }

            $current->addDay();
        }

        $this->command->info('  ✅ Daily analytics seeded successfully');
    }

    /**
     * Calculate realistic daily visits based on academic calendar
     */
    private function calculateDailyVisits(Carbon $date): int
    {
        $isWeekend = $date->isWeekend();
        $year = $date->year;
        $month = $date->month;

        // === 2024 Academic Calendar ===
        if ($year == 2024) {
            // Spring Semester 2024 (Jan - May)
            if ($month >= 1 && $month <= 5) {
                $baseVisits = $isWeekend ? rand(100, 180) : rand(250, 400);

                // Mid-term exams (March)
                if ($date->between(Carbon::parse('2024-03-10'), Carbon::parse('2024-03-25'))) {
                    $baseVisits = (int)($baseVisits * 1.7);
                }

                // Final exams (May)
                if ($date->between(Carbon::parse('2024-05-10'), Carbon::parse('2024-05-30'))) {
                    $baseVisits = (int)($baseVisits * 2.0);
                }

                // Ramadan 2024 (March 11 - April 9)
                if ($date->between(Carbon::parse('2024-03-11'), Carbon::parse('2024-04-09'))) {
                    $baseVisits = (int)($baseVisits * 0.65);
                }
            }

            // Summer Break (June - August)
            elseif ($month >= 6 && $month <= 8) {
                $baseVisits = $isWeekend ? rand(40, 80) : rand(80, 150);

                // Summer courses (July)
                if ($month == 7) {
                    $baseVisits = (int)($baseVisits * 1.4);
                }
            }

            // Fall Semester 2024 (Sep - Dec)
            else {
                $baseVisits = $isWeekend ? rand(120, 200) : rand(280, 450);

                // Mid-term exams (November)
                if ($date->between(Carbon::parse('2024-11-01'), Carbon::parse('2024-11-15'))) {
                    $baseVisits = (int)($baseVisits * 1.8);
                }

                // Final exams (December)
                if ($date->between(Carbon::parse('2024-12-15'), Carbon::parse('2024-12-28'))) {
                    $baseVisits = (int)($baseVisits * 2.2);
                }

                // Winter break start
                if ($date->gte(Carbon::parse('2024-12-29'))) {
                    $baseVisits = (int)($baseVisits * 0.3);
                }
            }
        }

        // === 2025 Academic Calendar ===
        else {
            // Winter Break (Jan 1-10)
            if ($date->between(Carbon::parse('2025-01-01'), Carbon::parse('2025-01-10'))) {
                $baseVisits = $isWeekend ? rand(20, 50) : rand(40, 90);
            }

            // Spring Semester 2025 (Jan - May)
            elseif ($month >= 1 && $month <= 5) {
                $baseVisits = $isWeekend ? rand(110, 190) : rand(260, 420);

                // Ramadan 2025 (March 1 - March 29)
                if ($date->between(Carbon::parse('2025-03-01'), Carbon::parse('2025-03-29'))) {
                    $baseVisits = (int)($baseVisits * 0.6);
                }

                // Mid-term exams (March)
                if ($date->between(Carbon::parse('2025-03-15'), Carbon::parse('2025-03-28'))) {
                    $baseVisits = (int)($baseVisits * 1.6);
                }

                // Final exams (May-June)
                if ($date->between(Carbon::parse('2025-05-15'), Carbon::parse('2025-06-10'))) {
                    $baseVisits = (int)($baseVisits * 2.1);
                }
            }

            // Summer Break (June - August)
            elseif ($month >= 6 && $month <= 8) {
                $baseVisits = $isWeekend ? rand(35, 75) : rand(70, 140);

                // Summer courses (July)
                if ($month == 7) {
                    $baseVisits = (int)($baseVisits * 1.5);
                }
            }

            // Fall Semester 2025 (Sep - Dec)
            else {
                $baseVisits = $isWeekend ? rand(130, 210) : rand(290, 460);

                // Mid-term exams (November)
                if ($date->between(Carbon::parse('2025-11-01'), Carbon::parse('2025-11-20'))) {
                    $baseVisits = (int)($baseVisits * 1.9);
                }

                // Current period boost (if we're in this period)
                if ($date->gte(Carbon::parse('2025-11-18')) && $date->lte(Carbon::today())) {
                    $baseVisits = (int)($baseVisits * 1.3);
                }
            }
        }

        return max(15, $baseVisits); // Minimum 15 visits per day
    }

    /**
     * Generate daily play hours for students
     */
    private function generateDailyPlayHours(Carbon $date, int $visits, array &$playHours): void
    {
        // More realistic percentage based on day type
        $isWeekend = $date->isWeekend();
        $isExamPeriod = $this->isExamPeriod($date);

        // Adjust game player percentage based on context
        if ($isExamPeriod) {
            $gamePlayerPercent = rand(35, 55); // More students use platform during exams
        } elseif ($isWeekend) {
            $gamePlayerPercent = rand(15, 30); // Less activity on weekends
        } else {
            $gamePlayerPercent = rand(25, 40); // Normal weekday activity
        }

        $gamePlayers = (int)($visits * $gamePlayerPercent / 100);
        $gamePlayers = max(5, min($gamePlayers, 500)); // Between 5-500 players per day

        // Get random students
        $students = DB::table('students')
            ->inRandomOrder()
            ->limit($gamePlayers)
            ->pluck('student_id');

        foreach ($students as $studentId) {
            // More realistic play time distribution
            $playTimeRand = rand(0, 100);
            if ($playTimeRand < 30) {
                $minutesPlayed = rand(5, 15); // Quick session (30%)
            } elseif ($playTimeRand < 70) {
                $minutesPlayed = rand(15, 45); // Normal session (40%)
            } else {
                $minutesPlayed = rand(45, 120); // Long session (30%)
            }

            // Exam periods tend to have longer sessions
            if ($isExamPeriod) {
                $minutesPlayed = (int)($minutesPlayed * 1.3);
            }

            $playHours[] = [
                'student_id' => $studentId,
                'play_date' => $date->format('Y-m-d'),
                'minutes_played' => min($minutesPlayed, 180), // Max 3 hours per day
                'created_at' => $date->copy()->setTime(rand(8, 22), rand(0, 59)),
                'updated_at' => $date->copy()->setTime(rand(8, 22), rand(0, 59)),
            ];
        }
    }

    /**
     * Check if date is during exam period
     */
    private function isExamPeriod(Carbon $date): bool
    {
        $examPeriods = [
            // 2024 Exam Periods
            ['2024-03-10', '2024-03-25'],
            ['2024-05-10', '2024-05-30'],
            ['2024-11-01', '2024-11-15'],
            ['2024-12-15', '2024-12-28'],
            // 2025 Exam Periods
            ['2025-03-15', '2025-03-28'],
            ['2025-05-15', '2025-06-10'],
            ['2025-11-01', '2025-11-20'],
        ];

        foreach ($examPeriods as $period) {
            if ($date->between(Carbon::parse($period[0]), Carbon::parse($period[1]))) {
                return true;
            }
        }

        return false;
    }

    /**
     * Update student statistics based on play hours
     */
    private function updateStudentStats(array $playHours): void
    {
        foreach ($playHours as $playHour) {
            $minutesPlayed = $playHour['minutes_played'];

            // Update total study hours
            DB::table('students')
                ->where('student_id', $playHour['student_id'])
                ->increment('total_study_hours', $minutesPlayed);

            // More realistic points calculation based on time played
            // Average: 10-15 points per minute
            $pointsPerMinute = rand(10, 15);
            $basePoints = $minutesPlayed * $pointsPerMinute;

            // Add some randomness (±20%)
            $randomFactor = rand(80, 120) / 100;
            $points = (int)($basePoints * $randomFactor);

            DB::table('students')
                ->where('student_id', $playHour['student_id'])
                ->increment('game_points', $points);

            // Increment attempts (1-3 attempts per session based on duration)
            $attempts = $minutesPlayed < 20 ? 1 : ($minutesPlayed < 60 ? rand(1, 2) : rand(2, 3));
            DB::table('students')
                ->where('student_id', $playHour['student_id'])
                ->increment('game_attempts', $attempts);
        }
    }

    /**
     * Generate realistic Arabic name
     */
    private function generateArabicName(): string
    {
        $firstNames = ['محمد', 'أحمد', 'عبدالله', 'خالد', 'سعد', 'فهد', 'عبدالعزيز', 'سلطان', 'فيصل', 'نواف',
                       'فاطمة', 'نورة', 'سارة', 'مريم', 'عائشة', 'خديجة', 'هند', 'ريم', 'لينا', 'جواهر'];
        $fatherNames = ['عبدالرحمن', 'إبراهيم', 'سليمان', 'عبدالله', 'محمد', 'أحمد', 'علي', 'حسن', 'يوسف', 'عمر'];
        $familyNames = ['العتيبي', 'الدوسري', ' ', 'الشمري', 'المطيري', 'العنزي', 'الحربي', 'الزهراني', 'الغامدي', 'السهلي'];

        return $firstNames[array_rand($firstNames)] . ' ' .
               $fatherNames[array_rand($fatherNames)] . ' ' .
               $familyNames[array_rand($familyNames)];
    }
}

