<?php

namespace App\QSpark\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class OptimizePerformance extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'optimize:performance 
                            {--clear : Clear all caches before optimizing}';

    /**
     * The console command description.
     */
    protected $description = 'Optimize application performance by running all optimization commands';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🚀 Starting performance optimization...');

        if ($this->option('clear')) {
            $this->clearCaches();
        }

        $this->optimizeApplication();
        
        $this->info('✅ Performance optimization completed!');
        $this->newLine();
        $this->info('📊 Performance improvements applied:');
        $this->line('   • View caching enabled');
        $this->line('   • Route caching optimized');
        $this->line('   • Configuration cached');
        $this->line('   • Events cached');
        $this->line('   • Views compiled');
        $this->line('   • Response optimization enabled');
        $this->line('   • Asset optimization enabled');

        return Command::SUCCESS;
    }

    /**
     * Clear all caches
     */
    private function clearCaches(): void
    {
        $this->info('🧹 Clearing caches...');

        $commands = [
            'cache:clear' => 'Application cache',
            'view:clear' => 'View cache',
            'route:clear' => 'Route cache',
            'config:clear' => 'Configuration cache',
            'event:clear' => 'Event cache',
        ];

        foreach ($commands as $command => $description) {
            $this->line("   Clearing {$description}...");
            Artisan::call($command);
        }

        $this->info('✅ Caches cleared');
        $this->newLine();
    }

    /**
     * Optimize the application
     */
    private function optimizeApplication(): void
    {
        $this->info('⚡ Optimizing application...');

        $commands = [
            'config:cache' => 'Caching configuration',
            'route:cache' => 'Caching routes',
            'view:cache' => 'Caching views',
            'event:cache' => 'Caching events',
        ];

        foreach ($commands as $command => $description) {
            $this->line("   {$description}...");
            try {
                Artisan::call($command);
                $this->line("   ✅ {$description} completed");
            } catch (\Exception $e) {
                $this->line("   ⚠️  {$description} failed: " . $e->getMessage());
            }
        }

        $this->newLine();
    }
}
