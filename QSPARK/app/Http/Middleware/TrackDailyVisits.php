<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\DailyVisit;
use Symfony\Component\HttpFoundation\Response;

class TrackDailyVisits
{
    public function handle(Request $request, Closure $next): Response
    {
        // Only track GET requests and exclude API/admin routes
        if ($request->isMethod('GET') && 
            !$request->is('api/*') && 
            !$request->is('admin/*') &&
            !$request->ajax()) {
            
            try {
                DailyVisit::incrementToday();
            } catch (\Exception $e) {
                // Log error but don't break the request
                \Log::error('Failed to track daily visit: ' . $e->getMessage());
            }
        }

        return $next($request);
    }
}