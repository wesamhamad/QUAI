<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;

class QuaiServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Configure API rate limiting
        $this->configureRateLimiting();
    }

    /**
     * Configure rate limiting for the API
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('api', function (Request $request) {
            if (!config('quai.rate_limit.enabled')) {
                return Limit::none();
            }

            return Limit::perMinute(config('quai.rate_limit.max_requests', 60))
                ->by($request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'error' => [
                            'message' => 'Rate limit exceeded. Please try again later.',
                            'type' => 'rate_limit_error',
                            'retry_after' => $headers['Retry-After'] ?? 60,
                        ],
                    ], 429, $headers);
                });
        });
    }
}

