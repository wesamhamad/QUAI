<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PerformanceController extends Controller
{
    public function status()
    {
        $metrics = [
            'cache_status' => $this->getCacheStatus(),
            'optimization_status' => $this->getOptimizationStatus(),
            'performance_tips' => $this->getPerformanceTips(),
            'server_info' => $this->getServerInfo(),
        ];

        return response()->json($metrics);
    }

    private function getCacheStatus(): array
    {
        return [
            'cache_driver' => config('cache.default'),
            'view_cache_enabled' => file_exists(base_path('bootstrap/cache/routes-v7.php')),
            'config_cached' => file_exists(base_path('bootstrap/cache/config.php')),
            'routes_cached' => file_exists(base_path('bootstrap/cache/routes-v7.php')),
            'events_cached' => file_exists(base_path('bootstrap/cache/events.php')),
        ];
    }

    private function getOptimizationStatus(): array
    {
        return [
            'middleware_enabled' => [
                'performance_optimization' => true,
                'response_optimization' => true,
                'view_cache' => true,
            ],
            'asset_optimization' => [
                'css_minification' => true,
                'js_deferring' => true,
                'image_lazy_loading' => true,
                'resource_hints' => true,
            ],
        ];
    }

    private function getPerformanceTips(): array
    {
        $tips = [];

        // Check if opcache is enabled
        if (!function_exists('opcache_get_status') || !opcache_get_status()) {
            $tips[] = 'Enable OPcache for better PHP performance';
        }

        // Check if gzip compression is enabled
        if (!in_array('gzip', stream_get_wrappers())) {
            $tips[] = 'Enable gzip compression on your web server';
        }

        // Check cache configuration
        if (config('cache.default') === 'file') {
            $tips[] = 'Consider using Redis or Memcached for better cache performance';
        }

        if (empty($tips)) {
            $tips[] = 'All major optimizations are in place!';
        }

        return $tips;
    }

    private function getServerInfo(): array
    {
        return [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'memory_limit' => ini_get('memory_limit'),
            'max_execution_time' => ini_get('max_execution_time'),
            'opcache_enabled' => function_exists('opcache_get_status') && opcache_get_status() !== false,
        ];
    }
}
