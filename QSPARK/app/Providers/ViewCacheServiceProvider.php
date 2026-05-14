<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\App;
use App\Services\ViewCacheService;
use App\Services\AssetOptimizationService;

class ViewCacheServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(ViewCacheService::class);
        $this->app->singleton(AssetOptimizationService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->registerBladeDirectives();
    }

    /**
     * Register custom Blade directives for caching
     */
    private function registerBladeDirectives(): void
    {
        // @cache directive for caching view sections
        Blade::directive('cache', function ($expression) {
            $parts = explode(',', $expression, 3);
            $key = trim($parts[0]);
            $minutes = isset($parts[1]) ? trim($parts[1]) : '60';
            $condition = isset($parts[2]) ? trim($parts[2]) : 'true';

            return "<?php if({$condition}): ?>" .
                   "<?php \$__cacheKey = 'blade_cache:' . {$key} . ':' . app()->getLocale() . (auth()->check() ? ':user_' . auth()->id() : ''); ?>" .
                   "<?php \$__cacheMinutes = {$minutes}; ?>" .
                   "<?php if(Cache::has(\$__cacheKey)): ?>" .
                   "<?php echo Cache::get(\$__cacheKey); ?>" .
                   "<?php else: ?>" .
                   "<?php ob_start(); ?>";
        });

        // @endcache directive
        Blade::directive('endcache', function () {
            return "<?php \$__content = ob_get_clean(); ?>" .
                   "<?php Cache::put(\$__cacheKey, \$__content, now()->addMinutes(isset(\$__cacheMinutes) ? \$__cacheMinutes : 60)); ?>" .
                   "<?php echo \$__content; ?>" .
                   "<?php endif; ?>" .
                   "<?php endif; ?>";
        });

        // @cacheif directive for conditional caching
        Blade::directive('cacheif', function ($expression) {
            $parts = explode(',', $expression, 4);
            $condition = trim($parts[0]);
            $key = trim($parts[1]);
            $minutes = isset($parts[2]) ? trim($parts[2]) : '60';

            return "<?php if({$condition}): ?>" .
                   "<?php \$__cacheKey = 'blade_cache:' . {$key} . ':' . app()->getLocale() . (auth()->check() ? ':user_' . auth()->id() : ''); ?>" .
                   "<?php \$__cacheMinutes = {$minutes}; ?>" .
                   "<?php if(Cache::has(\$__cacheKey)): ?>" .
                   "<?php echo Cache::get(\$__cacheKey); ?>" .
                   "<?php else: ?>" .
                   "<?php ob_start(); ?>";
        });

        // @endcacheif directive
        Blade::directive('endcacheif', function () {
            return "<?php \$__content = ob_get_clean(); ?>" .
                   "<?php Cache::put(\$__cacheKey, \$__content, now()->addMinutes(isset(\$__cacheMinutes) ? \$__cacheMinutes : 60)); ?>" .
                   "<?php echo \$__content; ?>" .
                   "<?php endif; ?>" .
                   "<?php else: ?>";
        });

        // @nocache directive for sections that should never be cached
        Blade::directive('nocache', function () {
            return "<?php if(true): ?>";
        });

        // @endnocache directive
        Blade::directive('endnocache', function () {
            return "<?php endif; ?>";
        });

        // @cacheuser directive for user-specific caching
        Blade::directive('cacheuser', function ($expression) {
            $parts = explode(',', $expression, 2);
            $key = trim($parts[0]);
            $minutes = isset($parts[1]) ? trim($parts[1]) : '30';

            return "<?php if(auth()->check()): ?>" .
                   "<?php \$__cacheKey = 'user_cache:' . {$key} . ':' . auth()->id() . ':' . app()->getLocale(); ?>" .
                   "<?php \$__cacheMinutes = {$minutes}; ?>" .
                   "<?php if(Cache::has(\$__cacheKey)): ?>" .
                   "<?php echo Cache::get(\$__cacheKey); ?>" .
                   "<?php else: ?>" .
                   "<?php ob_start(); ?>";
        });

        // @endcacheuser directive
        Blade::directive('endcacheuser', function () {
            return "<?php \$__content = ob_get_clean(); ?>" .
                   "<?php Cache::put(\$__cacheKey, \$__content, now()->addMinutes(isset(\$__cacheMinutes) ? \$__cacheMinutes : 60)); ?>" .
                   "<?php echo \$__content; ?>" .
                   "<?php endif; ?>" .
                   "<?php endif; ?>";
        });

        // @cachestatic directive for static content (long cache duration)
        Blade::directive('cachestatic', function ($expression) {
            $key = trim($expression);

            return "<?php \$__cacheKey = 'static_cache:' . {$key} . ':' . app()->getLocale(); ?>" .
                   "<?php if(Cache::has(\$__cacheKey)): ?>" .
                   "<?php echo Cache::get(\$__cacheKey); ?>" .
                   "<?php else: ?>" .
                   "<?php ob_start(); ?>";
        });

        // @endcachestatic directive
        Blade::directive('endcachestatic', function () {
            return "<?php \$__content = ob_get_clean(); ?>" .
                   "<?php Cache::put(\$__cacheKey, \$__content, now()->addMinutes(60)); ?>" .
                   "<?php echo \$__content; ?>" .
                   "<?php endif; ?>";
        });
    }
}
