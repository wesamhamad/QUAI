<?php

namespace App\QSpark\Console\Commands;

use Illuminate\Console\Command;
use App\QSpark\Models\OracleStudentCache;
use App\QSpark\Services\SISService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SyncRegisteredStudents extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'admin:sync-registered-students {--semester=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync students (ID, Name, Faculty, Major, GPA) from Oracle to oracle_students_cache table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔄 Starting students sync...');

        try {
            // Get semester
            $sisService = new SISService();
            $semester = $this->option('semester') ?? $sisService->getCurrentSemester();

            $this->info("📅 Syncing data for semester: {$semester}");

            // Clear old data for this semester
            $this->info('🗑️  Clearing old data...');
            OracleStudentCache::where('semester', $semester)->delete();

            // Get total count first
            $this->info('📊 Counting students...');
            $totalCount = DB::connection('oracle')
                ->table('SIS_STUDENT_ACTIVITIES')
                ->where('SEMESTER', $semester)
                ->distinct('STUDENT_ID')
                ->count('STUDENT_ID');

            if ($totalCount === 0) {
                $this->warn('⚠️  No students found for semester ' . $semester);
                return 1;
            }

            $this->info("✅ Found {$totalCount} students");
            $this->info("💾 Processing in batches of 500...");

            $bar = $this->output->createProgressBar($totalCount);
            $bar->start();

            $synced = 0;
            $errors = 0;
            $batchSize = 500;
            $offset = 0;

            // Insert basic data FAST (without absence)
            while ($offset < $totalCount) {
                try {
                    $students = DB::connection('oracle')->select("
                        SELECT * FROM (
                            SELECT
                                s.STUDENT_ID,
                                s.STUDENT_NAME_S,
                                s.FACULTY_NO,
                                f.FACULTY_NAME_S,
                                s.MAJOR_NO,
                                m.MAJOR_NAME_S,
                                NVL(R.CUM_GPA, 0) AS cumulative_gpa,
                                ROWNUM as rn
                            FROM (
                                SELECT DISTINCT STUDENT_ID
                                FROM SIS_STUDENT_ACTIVITIES
                                WHERE SEMESTER = :semester1
                            ) sa
                            JOIN vsis_students s ON sa.STUDENT_ID = s.STUDENT_ID
                            LEFT JOIN SIS_MAJORS m ON s.MAJOR_NO = m.MAJOR_NO
                            LEFT JOIN SIS_FACULTIES f ON s.FACULTY_NO = f.FACULTY_NO
                            LEFT JOIN SIS_ACADEMIC_RECORDS R ON s.STUDENT_ID = R.STUDENT_ID AND R.SEMESTER = :semester2
                        )
                        WHERE rn > :offset AND rn <= :limit
                    ", [
                        'semester1' => $semester,
                        'semester2' => $semester,
                        'offset' => $offset,
                        'limit' => $offset + $batchSize,
                    ]);

                    if (empty($students)) {
                        break;
                    }

                    $insertData = [];
                    foreach ($students as $student) {
                        $insertData[] = [
                            'student_id' => $student->student_id,
                            'student_name' => $student->student_name_s,
                            'faculty_no' => $student->faculty_no,
                            'faculty_name' => $student->faculty_name_s,
                            'major_no' => $student->major_no,
                            'major_name' => $student->major_name_s,
                            'gpa' => $student->cumulative_gpa ?? 0,
                            'absence_percent' => null,
                            'total_absences' => null,
                            'semester' => $semester,
                            'last_synced_at' => now(),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ];
                    }

                    if (!empty($insertData)) {
                        DB::table('oracle_students_cache')->insert($insertData);
                        $synced += count($insertData);
                    }

                    unset($students, $insertData);
                    gc_collect_cycles();

                    $bar->advance($batchSize);
                    $offset += $batchSize;

                } catch (\Exception $e) {
                    $errors += $batchSize;
                    $bar->advance($batchSize);
                    $offset += $batchSize;
                    Log::error("Error syncing batch at offset {$offset}: " . $e->getMessage());
                }
            }

            $bar->finish();
            $this->newLine(2);

            $bar->finish();
            $this->newLine(2);

            $this->info("✅ Sync completed!");
            $this->info("📊 Synced: {$synced} students");

            if ($errors > 0) {
                $this->warn("⚠️  Errors: {$errors} students");
            }

            return 0;

        } catch (\Exception $e) {
            $this->error('❌ Error: ' . $e->getMessage());
            Log::error('Students sync error: ' . $e->getMessage());
            return 1;
        }
    }
}
