<?php

namespace App\QSpark\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        // Locale resolution: explicit ?lang= override, then session, then default (ar).
        $supported = ['ar', 'en'];
        $locale = $request->query('lang')
            ?? Session::get('locale')
            ?? config('app.locale', 'ar');

        if (! \in_array($locale, $supported, true)) {
            $locale = 'ar';
        }

        App::setLocale($locale);
        Session::put('locale', $locale);

        return $next($request);
    }
}
