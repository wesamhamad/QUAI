<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class ViewCacheMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, int $minutes = 60): Response
    {
        // Skip caching for non-GET requests
        if (!$request->isMethod('GET')) {
            return $next($request);
        }

        // Skip caching for AJAX requests
        if ($request->ajax()) {
            return $next($request);
        }

        // Skip caching for authenticated users on certain routes
        if ($this->shouldSkipCaching($request)) {
            return $next($request);
        }

        // Generate cache key
        $cacheKey = $this->generateCacheKey($request);

        // Try to get cached response
        $cachedResponse = Cache::get($cacheKey);
        if ($cachedResponse) {
            return response($cachedResponse['content'])
                ->withHeaders($cachedResponse['headers'])
                ->setStatusCode($cachedResponse['status']);
        }

        // Get fresh response
        $response = $next($request);

        // Cache successful responses
        if ($response->getStatusCode() === 200 && $response instanceof \Illuminate\Http\Response) {
            $this->cacheResponse($cacheKey, $response, $minutes);
        }

        return $response;
    }

    /**
     * Determine if caching should be skipped for this request
     */
    private function shouldSkipCaching(Request $request): bool
    {
        // Skip for authenticated user-specific pages
        $userSpecificRoutes = [
            'dashboard-student',
            'usage',
            'courses/*/show',
        ];

        foreach ($userSpecificRoutes as $route) {
            if ($request->is($route)) {
                return Auth::check();
            }
        }

        // Skip for routes with query parameters that affect content
        $sensitiveParams = ['view', 'year', 'month', 'filter', 'search'];
        foreach ($sensitiveParams as $param) {
            if ($request->has($param)) {
                return false; // Don't skip, but include params in cache key
            }
        }

        return false;
    }

    /**
     * Generate a unique cache key for the request
     */
    private function generateCacheKey(Request $request): string
    {
        $key = 'view_cache:' . md5($request->fullUrl());
        
        // Include locale in cache key
        $key .= ':' . App::getLocale();
        
        // Include user ID for user-specific content
        if (Auth::check()) {
            $key .= ':user_' . Auth::id();
        }

        // Also include session token hash when present (for non-authenticated personalized pages)
        $token = $request->session()->get('qspark_token');
        if (!empty($token)) {
            $key .= ':tok_' . substr(md5($token), 0, 12);
        }

        // Include relevant query parameters
        $relevantParams = $request->only(['view', 'year', 'month', 'filter', 'search']);
        if (!empty($relevantParams)) {
            $key .= ':' . md5(serialize($relevantParams));
        }

        return $key;
    }

    /**
     * Cache the response
     */
    private function cacheResponse(string $cacheKey, Response $response, int $minutes): void
    {
        $cacheData = [
            'content' => $response->getContent(),
            'headers' => $response->headers->all(),
            'status' => $response->getStatusCode(),
        ];

        Cache::put($cacheKey, $cacheData, now()->addMinutes($minutes));
    }
}
