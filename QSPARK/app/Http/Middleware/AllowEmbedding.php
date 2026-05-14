<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Lets the QUAI shell embed QSPARK inside an <iframe>.
 *
 * By default browsers (and most edge/CDN configs) block framing with
 * `X-Frame-Options: DENY` — that is the "refused to connect" the QUAI
 * /qspark-demo page used to show. This middleware replaces that blanket
 * block with a scoped CSP `frame-ancestors` allow-list:
 *
 *   - `'self'` covers the same-origin case — QSPARK served under
 *     quailab.dev/qspark embedded by quailab.dev/qspark-demo.
 *   - any extra origins in QSPARK_FRAME_ANCESTORS are appended, so a
 *     cross-origin local dev setup (QUAI on :8077, QSPARK on :8001)
 *     still works.
 *
 * X-Frame-Options is removed because it cannot express an allow-list and a
 * lingering DENY would override the CSP directive in older browsers.
 *
 * This is intentionally narrow — it only touches framing headers. (The unused
 * PerformanceOptimizationMiddleware also minifies/compresses HTML, which is
 * why it is not wired up.)
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

        // CSP frame-ancestors supersedes X-Frame-Options; drop the legacy
        // header so a DENY set anywhere upstream cannot win.
        $response->headers->remove('X-Frame-Options');

        return $response;
    }
}
