<?php

namespace App\QSpark\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

/**
 * Makes `qspark` the default auth guard for the duration of a QSPARK request.
 *
 * QSPARK's controllers and views call auth()->user() / auth()->check() with no
 * explicit guard. Switching the default guard here lets all of that code keep
 * resolving against App\QSpark\Models\User (the `qspark` guard) without having
 * to rewrite every auth() call — while QUAI routes keep the `web` guard.
 */
class UseQSparkGuard
{
    public function handle(Request $request, Closure $next): Response
    {
        Auth::shouldUse('qspark');

        return $next($request);
    }
}
