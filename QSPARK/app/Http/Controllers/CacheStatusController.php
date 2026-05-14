<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Services\ViewCacheService;

class CacheStatusController extends Controller
{
    public function index(ViewCacheService $cacheService)
    {
        $cacheStats = $this->getCacheStatistics();
        
        return view('cache.status', [
            'stats' => $cacheStats,
            'cacheStore' => config('cache.default'),
            'cachePrefix' => config('cache.prefix'),
        ]);
    }

    public function clear(Request $request)
    {
        $type = $request->input('type', 'all');
        $cacheService = app(ViewCacheService::class);

        try {
            switch ($type) {
                case 'views':
                    $this->clearViewCache();
                    $message = 'View cache cleared successfully';
                    break;
                case 'all':
                    Cache::flush();
                    $message = 'All cache cleared successfully';
                    break;
                default:
                    $cacheService->invalidateAllViews();
                    $message = 'View cache cleared successfully';
                    break;
            }

            return response()->json([
                'success' => true,
                'message' => $message
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to clear cache: ' . $e->getMessage()
            ], 500);
        }
    }

    private function getCacheStatistics(): array
    {
        $stats = [
            'cache_store' => config('cache.default'),
            'cache_prefix' => config('cache.prefix'),
            'estimated_keys' => 0,
            'sample_keys' => [],
        ];

        try {
            // Get some sample cache keys (this is a simplified approach)
            $sampleKeys = [
                'view_cache:' . md5('/dashboard-student') . ':' . app()->getLocale(),
                'dashboard_data_' . md5('sample_token') . '_' . (auth()->id() ?? 'guest'),
                'calendar_data_' . date('Y') . '_' . date('m') . '_' . (auth()->id() ?? 'guest'),
                'usage_data_2024-12-01_2025-08-17',
                'static_cache:sidebar_navigation:' . app()->getLocale(),
            ];

            foreach ($sampleKeys as $key) {
                if (Cache::has($key)) {
                    $stats['sample_keys'][] = [
                        'key' => $key,
                        'exists' => true,
                        'size' => strlen(serialize(Cache::get($key))),
                    ];
                } else {
                    $stats['sample_keys'][] = [
                        'key' => $key,
                        'exists' => false,
                        'size' => 0,
                    ];
                }
            }

            $stats['estimated_keys'] = count(array_filter($stats['sample_keys'], fn($k) => $k['exists']));

        } catch (\Exception $e) {
            $stats['error'] = $e->getMessage();
        }

        return $stats;
    }

    private function clearViewCache(): void
    {
        $patterns = [
            'view_cache:*',
            'view_data:*',
            'dashboard_data_*',
            'calendar_data_*',
            'usage_data_*',
            'static_cache:*',
            'partial_cache:*',
        ];

        // For database/file cache, we can't pattern match easily
        // So we'll clear all cache for now
        Cache::flush();
    }
}
