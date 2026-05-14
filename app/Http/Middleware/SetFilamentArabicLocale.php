<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Forces the Filament admin panel to always render in Arabic / RTL,
 * regardless of the user's session or browser locale. Filament derives
 * the page direction from the `filament-panels::layout.direction`
 * translation, which resolves to `rtl` for the `ar` locale.
 */
class SetFilamentArabicLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        app()->setLocale('ar');

        return $next($request);
    }
}
