<?php

namespace App\QSpark\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Lets the QUAI shell embed QSPARK inside an <iframe>.
 *
 * QUAI's /qspark-demo page frames the QSPARK UI (served by this same app under
 * the /qspark prefix). By default browsers — and Laravel Cloud's edge — block
 * framing with `X-Frame-Options: DENY`, which is the "Firefox can't open this
 * page" / "refused to connect" error the demo used to show.
 *
 * Because QSPARK now lives in the QUAI app itself, the iframe is strictly
 * same-origin, so this middleware:
 *
 *   - sets `X-Frame-Options: SAMEORIGIN` (overriding any upstream DENY), and
 *   - sets a CSP `frame-ancestors 'self'` directive — modern browsers honour
 *     this over X-Frame-Options. Extra origins from QSPARK_FRAME_ANCESTORS are
 *     appended so a cross-origin local-dev setup still works if needed.
 *
 * This is intentionally narrow — it only touches framing headers.
 */
class AllowEmbedding
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $extra = trim((string) env('QSPARK_FRAME_ANCESTORS', ''));
        $frameAncestors = trim("'self' " . $extra);

        $response->headers->set(
            'Content-Security-Policy',
            "frame-ancestors {$frameAncestors};"
        );

        // Same-origin embedding is fully expressible with SAMEORIGIN; set it
        // explicitly so it overrides any DENY injected by an upstream proxy.
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        return $response;
    }
}
