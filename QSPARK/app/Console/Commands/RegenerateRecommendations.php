<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\StudentMonthlyRecommendation;
use Carbon\Carbon;

class RegenerateRecommendations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'recommendations:regenerate {student_id?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete existing recommendations to force regeneration';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $studentId = $this->argument('student_id');
        $currentMonth = Carbon::now('Asia/Riyadh')->format('Y-m');

        if ($studentId) {
            // Delete for specific student
            $deleted = StudentMonthlyRecommendation::where('student_id', $studentId)
                ->where('month', $currentMonth)
                ->delete();

            if ($deleted) {
                $this->info("✅ Deleted recommendation for student {$studentId}. It will be regenerated on next visit.");
            } else {
                $this->warn("⚠️  No recommendation found for student {$studentId} in month {$currentMonth}");
            }
        } else {
            // Delete all for current month
            $deleted = StudentMonthlyRecommendation::where('month', $currentMonth)->delete();
            $this->info("✅ Deleted {$deleted} recommendations for month {$currentMonth}. They will be regenerated on next visit.");
        }

        return 0;
    }
}

