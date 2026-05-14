<?php

namespace App\QSpark\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Detects whether QSPARK is being served inside the QUAI shell's <iframe>.
 *
 * When embedded, QUAI already renders its own topbar + sidebar, so QSPARK must
 * suppress its own chrome to avoid a doubled header/sidebar. Detection relies on
 * the browser-supplied `Sec-Fetch-Dest` header (`iframe` for any navigation whose
 * target context is a nested frame, `document` for a top-level tab/window), with
 * an explicit `?embedded=1` fallback. The result is persisted in the session so
 * it survives in-frame navigations and AJAX requests (which report `empty`).
 */
class DetectEmbeddedMode
{
    public function handle(Request $request, Closure $next): Response
    {
        $dest = $request->header('Sec-Fetch-Dest');

        if ($dest === 'iframe' || $request->boolean('embedded')) {
            // Loaded inside a frame — remember it for the rest of the session.
            $request->session()->put('embedded', true);
        } elseif ($dest === 'document') {
            // Genuine top-level navigation (standalone tab) — leave embedded mode.
            $request->session()->forget('embedded');
        }
        // Other destinations (empty/script/style/...) leave the flag untouched.

        view()->share('isEmbedded', (bool) $request->session()->get('embedded', false));

        return $next($request);
    }
}
