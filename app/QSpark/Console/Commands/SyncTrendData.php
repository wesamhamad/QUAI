<?php

namespace App\QSpark\Console\Commands;

use Illuminate\Console\Command;
use App\QSpark\Models\AdminTrendData;
use App\QSpark\Services\SISService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SyncTrendData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:sync-trend-data {--semesters=5 : Number of semesters to sync}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync GPA and engagement trend data from Oracle to local database';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting trend data synchronization...');

        try {
            // Get current semester
            $sisService = new SISService();
            $currentSemester = $sisService->getCurrentSemester();
            $semesterCount = (int) $this->option('semesters');

            $this->info("Current semester: {$currentSemester}");
            $this->info("Syncing last {$semesterCount} semesters...");

            // Sync GPA trend data
            $this->syncGpaTrend($currentSemester, $semesterCount);

            // Sync engagement trend data
            $this->syncEngagementTrend($currentSemester, $semesterCount);

            $this->info('✅ Trend data synchronization completed successfully!');
            return 0;

        } catch (\Exception $e) {
            $this->error('❌ Error syncing trend data: ' . $e->getMessage());
            Log::error('Trend data sync failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return 1;
        }
    }

    /**
     * Sync GPA trend data from Oracle
     * Uses SIS_ACADEMIC_RECORDS to get semester GPA and cumulative GPA
     */
    private function syncGpaTrend($currentSemester, $count)
    {
        $this->info('📊 Syncing GPA trend data...');
        $bar = $this->output->createProgressBar($count);

        for ($i = $count - 1; $i >= 0; $i--) {
            $semester = $currentSemester - $i;

            try {
                // Get average cumulative GPA from Oracle using SIS_ACADEMIC_RECORDS
                // This matches the query structure you provided
                $result = DB::connection('oracle')
                    ->table('SIS_ACADEMIC_RECORDS as R')
                    ->where('R.SEMESTER', $semester)
                    ->whereNotNull('R.CUM_GPA')
                    ->where('R.CUM_GPA', '>', 0)
                    ->selectRaw('
                        AVG(NVL(R.CUM_GPA, 0)) as avg_cumulative_gpa,
                        AVG(NVL(R.SEMESTER_GPA, 0)) as avg_semester_gpa,
                        COUNT(DISTINCT R.STUDENT_ID) as student_count,
                        AVG(NVL(R.ATTEMPTED_HRS, 0)) as avg_attempted_hrs,
                        AVG(NVL(R.PASSED_HRS, 0)) as avg_passed_hrs
                    ')
                    ->first();

                $avgGpa = $result->avg_cumulative_gpa ?? 0;
                $studentCount = $result->student_count ?? 0;

                // If no data from Oracle, try cache table
                if (!$avgGpa || $studentCount == 0) {
                    $cacheResult = DB::table('admin_students_cache')
                        ->where('semester', $semester)
                        ->whereNotNull('last_recorded_gpa')
                        ->selectRaw('AVG(last_recorded_gpa) as avg_gpa, COUNT(DISTINCT student_id) as student_count')
                        ->first();

                    $avgGpa = $cacheResult->avg_gpa ?? 0;
                    $studentCount = $cacheResult->student_count ?? 0;
                }

                // Apply 80% approximation if we have data
                if ($avgGpa > 0 && $studentCount > 0) {
                    $avgGpa = round($avgGpa * 0.8, 2);
                    $studentCount = round($studentCount * 0.8);
                }

                // Store in database
                AdminTrendData::storeGpaTrend($semester, $avgGpa, $studentCount);

                $bar->advance();

            } catch (\Exception $e) {
                $this->warn("\nError syncing semester {$semester}: " . $e->getMessage());
                Log::error("GPA sync error for semester {$semester}", [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }

        $bar->finish();
        $this->newLine();
        $this->info('✅ GPA trend data synced');
    }

    /**
     * Sync engagement trend data from Oracle
     * Uses SIS_STUDENTS and SIS_ACADEMIC_RECORDS to count active students
     */
    private function syncEngagementTrend($currentSemester, $count)
    {
        $this->info('📈 Syncing engagement trend data...');
        $bar = $this->output->createProgressBar($count);

        for ($i = $count - 1; $i >= 0; $i--) {
            $semester = $currentSemester - $i;

            try {
                // Count active students from Oracle
                // Join with SIS_STUDENTS to ensure we only count valid students
                $activeCount = DB::connection('oracle')
                    ->table('SIS_ACADEMIC_RECORDS as R')
                    ->join('SIS_STUDENTS as S', 'R.STUDENT_ID', '=', 'S.STUDENT_ID')
                    ->where('R.SEMESTER', $semester)
                    ->whereNotNull('R.CUM_GPA')
                    ->where('R.CUM_GPA', '>', 0)
                    ->whereNotNull('S.STUDENT_ID')
                    ->distinct()
                    ->count('R.STUDENT_ID');

                // If no data from Oracle, try cache table
                if (!$activeCount || $activeCount == 0) {
                    $activeCount = DB::table('admin_students_cache')
                        ->where('semester', $semester)
                        ->whereNotNull('last_recorded_gpa')
                        ->distinct()
                        ->count('student_id');
                }

                // Apply 80% approximation if we have data
                if ($activeCount > 0) {
                    $activeCount = round($activeCount * 0.8);
                }

                // Store in database
                AdminTrendData::storeEngagementTrend($semester, $activeCount);

                $bar->advance();

            } catch (\Exception $e) {
                $this->warn("\nError syncing semester {$semester}: " . $e->getMessage());
                Log::error("Engagement sync error for semester {$semester}", [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
            }
        }

        $bar->finish();
        $this->newLine();
        $this->info('✅ Engagement trend data synced');
    }
}
