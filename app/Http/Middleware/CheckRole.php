<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!auth()->check()) {
            abort(403, 'Unauthorized');
        }

        if (!auth()->user()->hasAnyRole($roles)) {
            abort(403, 'Unauthorized — insufficient role');
        }

        return $next($request);
    }
}
