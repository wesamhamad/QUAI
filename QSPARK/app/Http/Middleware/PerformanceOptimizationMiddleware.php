<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PerformanceOptimizationMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Add performance headers
        $this->addPerformanceHeaders($response);
        
        // Add security headers that also improve performance
        $this->addSecurityHeaders($response);
        
        // Compress response if possible
        $this->compressResponse($response);

        return $response;
    }

    /**
     * Add performance-related headers
     */
    private function addPerformanceHeaders(Response $response): void
    {
        // Cache static assets for 1 year
        if ($this->isStaticAsset()) {
            $response->headers->set('Cache-Control', 'public, max-age=31536000, immutable');
            $response->headers->set('Expires', gmdate('D, d M Y H:i:s', time() + 31536000) . ' GMT');
        }
        
        // Add resource hints and HTTP/2 Server Push
        $linkHeaders = [
            '</css/app.css>; rel=preload; as=style',
            '</js/app.js>; rel=preload; as=script',
            '<https://cdn.tailwindcss.com>; rel=dns-prefetch',
            '<https://cdn.jsdelivr.net>; rel=dns-prefetch',
            '<https://unpkg.com>; rel=dns-prefetch',
            '<https://fonts.bunny.net>; rel=preconnect; crossorigin',
        ];

        $response->headers->set('Link', implode(', ', $linkHeaders));
    }

    /**
     * Add security headers that improve performance
     */
    private function addSecurityHeaders(Response $response): void
    {
        // Allow this app to be embedded as an iframe from explicitly trusted
        // origins (e.g. the parent QUAI shell on :8007). When QSPARK_FRAME_ANCESTORS
        // is set, we replace the default DENY policy with a CSP frame-ancestors
        // allow-list so the parent app can host the QSPARK UI inline.
        $frameAncestors = trim((string) env('QSPARK_FRAME_ANCESTORS', ''));

        $csp = "default-src 'self'; " .
               "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://unpkg.com https://cdn.jsdelivr.net; " .
               "style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://fonts.bunny.net; " .
               "font-src 'self' https://fonts.bunny.net; " .
               "img-src 'self' data: https:; " .
               "connect-src 'self' https://api-test.qu.edu.sa https://api.qu.edu.sa;";

        if ($frameAncestors !== '') {
            $csp .= " frame-ancestors 'self' " . $frameAncestors . ';';
        }

        $response->headers->set('Content-Security-Policy', $csp);

        // Other performance-related security headers
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // X-Frame-Options is the older header; modern browsers prefer CSP
        // frame-ancestors. When we explicitly allow embedding we must drop
        // X-Frame-Options entirely (it cannot express an allow-list and DENY
        // would otherwise override the CSP directive).
        if ($frameAncestors === '') {
            $response->headers->set('X-Frame-Options', 'DENY');
        } else {
            $response->headers->remove('X-Frame-Options');
        }

        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    /**
     * Compress response content
     */
    private function compressResponse(Response $response): void
    {
        $content = $response->getContent();
        
        if ($content && $this->shouldCompress($response)) {
            // Remove unnecessary whitespace from HTML
            if ($response->headers->get('Content-Type', '') === 'text/html; charset=UTF-8') {
                $content = $this->minifyHtml($content);
                $response->setContent($content);
            }
        }
    }

    /**
     * Check if the current request is for a static asset
     */
    private function isStaticAsset(): bool
    {
        $path = request()->path();
        $extensions = ['css', 'js', 'png', 'jpg', 'jpeg', 'gif', 'svg', 'ico', 'woff', 'woff2', 'ttf', 'eot'];
        
        foreach ($extensions as $ext) {
            if (str_ends_with($path, '.' . $ext)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Check if response should be compressed
     */
    private function shouldCompress(Response $response): bool
    {
        $contentType = $response->headers->get('Content-Type', '');
        $compressibleTypes = [
            'text/html',
            'text/css',
            'text/javascript',
            'application/javascript',
            'application/json',
            'text/xml',
            'application/xml'
        ];

        foreach ($compressibleTypes as $type) {
            if (str_contains($contentType, $type)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Minify HTML content
     */
    private function minifyHtml(string $html): string
    {
        // Remove comments (but preserve IE conditional comments)
        $html = preg_replace('/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->/s', '', $html);
        
        // Remove unnecessary whitespace
        $html = preg_replace('/\s+/', ' ', $html);
        $html = preg_replace('/>\s+</', '><', $html);
        
        // Remove whitespace around block elements
        $blockElements = ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'article', 'header', 'footer', 'nav', 'main'];
        foreach ($blockElements as $element) {
            $html = preg_replace('/\s*<' . $element . '([^>]*)>\s*/', '<' . $element . '$1>', $html);
            $html = preg_replace('/\s*<\/' . $element . '>\s*/', '</' . $element . '>', $html);
        }
        
        return trim($html);
    }
}
