<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class GenerateUsageData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'usage:generate
                            {--fresh : Clear existing data before generating}
                            {--from= : Start date (Y-m-d format, default: 2024-01-01)}
                            {--to= : End date (Y-m-d format, default: today)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate realistic usage analytics data for the dashboard';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Starting Usage Data Generation...');
        $this->newLine();

        // Show configuration
        $this->table(
            ['Setting', 'Value'],
            [
                ['Fresh Install', $this->option('fresh') ? 'Yes (will clear existing data)' : 'No (will append)'],
                ['Start Date', $this->option('from') ?? '2024-01-01'],
                ['End Date', $this->option('to') ?? 'Today'],
            ]
        );

        $this->newLine();

        // Confirm before proceeding
        if ($this->option('fresh')) {
            if (!$this->confirm('⚠️  This will DELETE all existing usage data. Continue?', false)) {
                $this->error('Operation cancelled.');
                return 1;
            }
        }

        $this->newLine();
        $this->info('📊 Running Usage Analytics Seeder...');
        $this->newLine();

        // Run the seeder
        try {
            Artisan::call('db:seed', [
                '--class' => 'UsageAnalyticsSeeder',
                '--force' => true,
            ]);

            // Display seeder output
            $this->line(Artisan::output());

            $this->newLine();
            $this->info('✅ Usage data generated successfully!');
            $this->newLine();

            // Show summary
            $this->showSummary();

            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Error generating usage data: ' . $e->getMessage());
            $this->error($e->getTraceAsString());
            return 1;
        }
    }

    /**
     * Show summary of generated data
     */
    private function showSummary()
    {
        $this->info('📈 Data Summary:');
        $this->newLine();

        try {
            $totalVisits = \DB::table('daily_visits')->sum('visits_count');
            $totalDays = \DB::table('daily_visits')->count();
            $totalStudents = \DB::table('students')->count();
            $totalPlayHours = \DB::table('student_play_hours')->sum('minutes_played');
            $totalGameSessions = \DB::table('student_play_hours')->count();

            $this->table(
                ['Metric', 'Value'],
                [
                    ['Total Days', number_format($totalDays)],
                    ['Total Visits', number_format($totalVisits)],
                    ['Average Daily Visits', $totalDays > 0 ? number_format($totalVisits / $totalDays, 1) : 0],
                    ['Active Students', number_format($totalStudents)],
                    ['Total Game Sessions', number_format($totalGameSessions)],
                    ['Total Play Hours', number_format($totalPlayHours / 60, 1) . ' hours'],
                ]
            );

            $this->newLine();
            $this->info('💡 Tip: Clear cache to see the new data:');
            $this->line('   php artisan cache:clear');
            $this->newLine();
            $this->info('🌐 View the dashboard at:');
            $this->line('   ' . url('/usage'));

        } catch (\Exception $e) {
            $this->warn('Could not generate summary: ' . $e->getMessage());
        }
    }
}

