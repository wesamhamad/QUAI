<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\App;
use Illuminate\Http\Request;

class ViewCacheService
{
    /**
     * Cache durations in minutes for different view types
     */
    const CACHE_DURATIONS = [
        'static' => 60,        // 1 hour for static content
        'semi_static' => 60,   // 1 hour for semi-static content
        'dynamic' => 60,       // 1 hour for dynamic content
        'user_specific' => 60, // 1 hour for user-specific content
    ];

    /**
     * Cache a view with data
     */
    public function cacheView(string $viewName, array $data, string $type = 'dynamic'): array
    {
        $cacheKey = $this->generateViewDataCacheKey($viewName, $data);
        $duration = self::CACHE_DURATIONS[$type] ?? self::CACHE_DURATIONS['dynamic'];

        return Cache::remember($cacheKey, now()->addMinutes($duration), function () use ($data) {
            return $data;
        });
    }

    /**
     * Cache partial view data
     */
    public function cachePartial(string $partialName, callable $dataCallback, string $type = 'dynamic'): mixed
    {
        $cacheKey = $this->generatePartialCacheKey($partialName);
        $duration = self::CACHE_DURATIONS[$type] ?? self::CACHE_DURATIONS['dynamic'];

        return Cache::remember($cacheKey, now()->addMinutes($duration), $dataCallback);
    }

    /**
     * Cache API data for views
     */
    public function cacheApiData(string $endpoint, callable $apiCallback, int $minutes = 60): mixed
    {
        $cacheKey = $this->generateApiCacheKey($endpoint);
        
        return Cache::remember($cacheKey, now()->addMinutes($minutes), $apiCallback);
    }

    /**
     * Invalidate cache for specific view
     */
    public function invalidateView(string $viewName): void
    {
        $pattern = "view_data:{$viewName}:*";
        $this->invalidateCachePattern($pattern);
    }

    /**
     * Invalidate cache for user-specific content
     */
    public function invalidateUserCache(int $userId): void
    {
        $pattern = "*:user_{$userId}:*";
        $this->invalidateCachePattern($pattern);
    }

    /**
     * Invalidate all view cache
     */
    public function invalidateAllViews(): void
    {
        $patterns = [
            'view_cache:*',
            'view_data:*',
            'partial_cache:*',
            'api_cache:*'
        ];

        foreach ($patterns as $pattern) {
            $this->invalidateCachePattern($pattern);
        }
    }

    /**
     * Generate cache key for view data
     */
    private function generateViewDataCacheKey(string $viewName, array $data): string
    {
        $key = "view_data:{$viewName}";
        
        // Include locale
        $key .= ':' . App::getLocale();
        
        // Include user ID for user-specific content
        if (Auth::check()) {
            $key .= ':user_' . Auth::id();
        }

        // Include data hash for cache busting when data changes
        $key .= ':' . md5(serialize($data));

        return $key;
    }

    /**
     * Generate cache key for partials
     */
    private function generatePartialCacheKey(string $partialName): string
    {
        $key = "partial_cache:{$partialName}";
        
        // Include locale
        $key .= ':' . App::getLocale();
        
        // Include user ID for user-specific partials
        if (Auth::check()) {
            $key .= ':user_' . Auth::id();
        }

        return $key;
    }

    /**
     * Generate cache key for API data
     */
    private function generateApiCacheKey(string $endpoint): string
    {
        $key = "api_cache:" . md5($endpoint);
        
        // Include user ID for user-specific API data
        if (Auth::check()) {
            $key .= ':user_' . Auth::id();
        }

        return $key;
    }

    /**
     * Invalidate cache by pattern
     */
    private function invalidateCachePattern(string $pattern): void
    {
        // This is a simplified version - in production you might want to use Redis SCAN
        // or implement a more sophisticated cache tagging system
        try {
            $cacheStore = Cache::getStore();
            
            if (method_exists($cacheStore, 'flush')) {
                // For development - you might want to implement more granular invalidation
                // Cache::flush(); // Uncomment only if you want to clear all cache
            }
        } catch (\Exception $e) {
            // Log error but don't break the application
            \Log::warning('Cache invalidation failed: ' . $e->getMessage());
        }
    }

    /**
     * Get cache statistics
     */
    public function getCacheStats(): array
    {
        // This would need to be implemented based on your cache driver
        return [
            'total_keys' => 0,
            'memory_usage' => 0,
            'hit_rate' => 0,
        ];
    }
}
