<?php

namespace App\QSpark\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\QSpark\Models\DailyVisit;
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
            } catch (\Throwable $e) {
                // The qspark connection isn't always writable in the demo
                // deployment (e.g. when QSPARK_DB_DATABASE points at an sqlite
                // path that doesn't exist on Laravel Cloud). The dashboard
                // doesn't actually need this counter for the demo, so swallow
                // failures at debug level instead of spamming error logs.
                \Log::debug('Skipped daily visit tracking: ' . $e->getMessage());
            }
        }

        return $next($request);
    }
}