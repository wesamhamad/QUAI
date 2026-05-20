<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Aligns the Filament admin panel with the chosen UI locale.
 *
 * Resolution order: explicit ?lang= query, then session, then config default.
 * Filament derives the page direction from the
 * `filament-panels::layout.direction` translation, which resolves to `rtl`
 * for the `ar` locale and `ltr` for `en`, so this is enough to flip the
 * whole admin shell when the user toggles the language switcher.
 */
class SetFilamentArabicLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $supported = ['ar', 'en'];
        $locale = $request->query('lang')
            ?? $request->session()->get('locale')
            ?? config('app.locale', 'ar');

        if (! \in_array($locale, $supported, true)) {
            $locale = 'ar';
        }

        app()->setLocale($locale);
        $request->session()->put('locale', $locale);

        return $next($request);
    }
}
