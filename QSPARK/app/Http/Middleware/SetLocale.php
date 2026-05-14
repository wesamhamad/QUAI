<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        // Demo is Arabic-only — always render in Arabic regardless of session.
        App::setLocale('ar');
        Session::put('locale', 'ar');

        return $next($request);
    }
}
