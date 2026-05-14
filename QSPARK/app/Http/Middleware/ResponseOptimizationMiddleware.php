<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\AssetOptimizationService;

class ResponseOptimizationMiddleware
{
    protected $assetOptimizer;

    public function __construct(AssetOptimizationService $assetOptimizer)
    {
        $this->assetOptimizer = $assetOptimizer;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only optimize HTML responses
        if ($this->shouldOptimize($response)) {
            $content = $response->getContent();
            
            // Apply optimizations
            $content = $this->optimizeHtml($content, $request);
            
            $response->setContent($content);
        }

        return $response;
    }

    /**
     * Check if response should be optimized
     */
    private function shouldOptimize(Response $response): bool
    {
        $contentType = $response->headers->get('Content-Type', '');
        return str_contains($contentType, 'text/html') && $response->getStatusCode() === 200;
    }

    /**
     * Optimize HTML content
     */
    private function optimizeHtml(string $html, Request $request): string
    {
        // 1. Inline critical CSS
        $html = $this->assetOptimizer->inlineCriticalCSS($html, $request->url());
        
        // 2. Add resource hints to head
        $html = $this->addResourceHints($html);
        
        // 3. Lazy load images
        $html = $this->assetOptimizer->lazyLoadImages($html);
        
        // 4. Defer non-critical JavaScript
        $html = $this->assetOptimizer->deferNonCriticalJS($html);
        
        // 5. Minify HTML
        $html = $this->minifyHtml($html);
        
        // 6. Add preload links
        $html = $this->addPreloadLinks($html);

        return $html;
    }

    /**
     * Add resource hints to HTML head
     */
    private function addResourceHints(string $html): string
    {
        $hints = $this->assetOptimizer->getResourceHints();
        $hintsHtml = implode("\n", $hints);
        
        // Insert after <head> tag
        $html = preg_replace(
            '/(<head[^>]*>)/i',
            '$1' . "\n" . $hintsHtml,
            $html,
            1
        );
        
        return $html;
    }

    /**
     * Add preload links to HTML head
     */
    private function addPreloadLinks(string $html): string
    {
        $preloads = $this->assetOptimizer->getPreloadLinks();
        $preloadsHtml = implode("\n", $preloads);
        
        // Insert after resource hints
        $html = preg_replace(
            '/(<link rel="dns-prefetch"[^>]*>\s*)/i',
            '$1' . "\n" . $preloadsHtml . "\n",
            $html,
            1
        );
        
        return $html;
    }

    /**
     * Minify HTML content
     */
    private function minifyHtml(string $html): string
    {
        // Remove HTML comments (preserve IE conditional comments)
        $html = preg_replace('/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->/s', '', $html);
        
        // Remove unnecessary whitespace between tags
        $html = preg_replace('/>\s+</', '><', $html);
        
        // Remove whitespace around block elements
        $blockElements = [
            'html', 'head', 'body', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'section', 'article', 'header', 'footer', 'nav', 'main', 'aside',
            'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
        ];
        
        foreach ($blockElements as $element) {
            $html = preg_replace('/\s*<' . $element . '([^>]*)>\s*/', '<' . $element . '$1>', $html);
            $html = preg_replace('/\s*<\/' . $element . '>\s*/', '</' . $element . '>', $html);
        }
        
        // Collapse multiple spaces into single space
        $html = preg_replace('/\s+/', ' ', $html);
        
        // Remove leading/trailing whitespace
        $html = trim($html);
        
        return $html;
    }
}
