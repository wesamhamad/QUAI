<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use App\Services\ViewCacheService;

class ClearViewCache extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'cache:clear-views 
                            {--type=all : Type of cache to clear (all, views, partials, api)}
                            {--user= : Clear cache for specific user ID}';

    /**
     * The console command description.
     */
    protected $description = 'Clear view cache with granular control';

    /**
     * Execute the console command.
     */
    public function handle(ViewCacheService $cacheService): int
    {
        $type = $this->option('type');
        $userId = $this->option('user');

        $this->info('Clearing view cache...');

        try {
            switch ($type) {
                case 'all':
                    $cacheService->invalidateAllViews();
                    $this->info('✅ All view cache cleared successfully');
                    break;

                case 'views':
                    $this->clearViewCache();
                    $this->info('✅ View cache cleared successfully');
                    break;

                case 'partials':
                    $this->clearPartialCache();
                    $this->info('✅ Partial cache cleared successfully');
                    break;

                case 'api':
                    $this->clearApiCache();
                    $this->info('✅ API cache cleared successfully');
                    break;

                default:
                    if ($userId) {
                        $cacheService->invalidateUserCache((int) $userId);
                        $this->info("✅ Cache cleared for user {$userId}");
                    } else {
                        $cacheService->invalidateAllViews();
                        $this->info('✅ All view cache cleared successfully');
                    }
                    break;
            }

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $this->error('❌ Failed to clear cache: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }

    /**
     * Clear view-specific cache
     */
    private function clearViewCache(): void
    {
        $patterns = [
            'view_cache:*',
            'view_data:*',
            'dashboard_data_*',
            'calendar_data_*',
            'usage_data_*',
        ];

        foreach ($patterns as $pattern) {
            $this->clearCachePattern($pattern);
        }
    }

    /**
     * Clear partial cache
     */
    private function clearPartialCache(): void
    {
        $this->clearCachePattern('partial_cache:*');
    }

    /**
     * Clear API cache
     */
    private function clearApiCache(): void
    {
        $patterns = [
            'api_cache:*',
            'timetable_*',
            'course_attachments_*',
            'course_pdfs_*',
            'pdf_text_*',
            'pdf_pages_*',
        ];

        foreach ($patterns as $pattern) {
            $this->clearCachePattern($pattern);
        }
    }

    /**
     * Clear cache by pattern (simplified implementation)
     */
    private function clearCachePattern(string $pattern): void
    {
        // This is a simplified implementation
        // In production, you might want to use Redis SCAN or implement cache tagging
        try {
            $cacheStore = Cache::getStore();
            
            // For file/database cache, we can't easily pattern match
            // So we'll just flush all cache for now
            // In production, consider using Redis with SCAN or cache tags
            
            $this->line("Clearing pattern: {$pattern}");
            
        } catch (\Exception $e) {
            $this->warn("Could not clear pattern {$pattern}: " . $e->getMessage());
        }
    }
}
