<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;

class AssetOptimizationService
{
    /**
     * Generate optimized image URLs with WebP support
     */
    public function optimizeImage(string $imagePath, int $width = null, int $height = null, int $quality = 85): string
    {
        // Check if browser supports WebP
        $supportsWebP = $this->browserSupportsWebP();
        
        // Generate cache key
        $cacheKey = 'optimized_image_' . md5($imagePath . $width . $height . $quality . ($supportsWebP ? 'webp' : 'original'));
        
        return Cache::remember($cacheKey, 3600, function () use ($imagePath, $width, $height, $quality, $supportsWebP) {
            // In a real implementation, you would:
            // 1. Check if optimized version exists
            // 2. Generate optimized version if needed
            // 3. Return optimized URL
            
            // For now, return original path with query parameters for optimization hints
            $params = [];
            if ($width) $params['w'] = $width;
            if ($height) $params['h'] = $height;
            if ($quality !== 85) $params['q'] = $quality;
            if ($supportsWebP) $params['f'] = 'webp';
            
            $queryString = !empty($params) ? '?' . http_build_query($params) : '';
            
            return asset($imagePath) . $queryString;
        });
    }

    /**
     * Generate critical CSS for above-the-fold content
     */
    public function generateCriticalCSS(string $url): string
    {
        $cacheKey = 'critical_css_' . md5($url);
        
        return Cache::remember($cacheKey, 86400, function () {
            // Critical CSS for the dashboard and main layout
            return '
                body { font-family: "Tajawal", sans-serif; margin: 0; padding: 0; }
                .bg-\\[\\#f8f9fb\\] { background-color: #f8f9fb; }
                .min-h-screen { min-height: 100vh; }
                .flex { display: flex; }
                .flex-1 { flex: 1 1 0%; }
                .flex-col { flex-direction: column; }
                .w-20 { width: 5rem; }
                .bg-\\[\\#F4F5F7\\] { background-color: #F4F5F7; }
                .items-center { align-items: center; }
                .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
                .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
                .shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }
                .p-6 { padding: 1.5rem; }
                .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
                .font-extrabold { font-weight: 800; }
                .grid { display: grid; }
                .gap-6 { gap: 1.5rem; }
                .rounded-2xl { border-radius: 1rem; }
                .p-4 { padding: 1rem; }
                .bg-white { background-color: rgb(255 255 255); }
                .rounded-lg { border-radius: 0.5rem; }
            ';
        });
    }

    /**
     * Inline critical CSS in the document head
     */
    public function inlineCriticalCSS(string $html, string $url): string
    {
        $criticalCSS = $this->generateCriticalCSS($url);
        
        // Find the closing </head> tag and insert critical CSS before it
        $headClosePos = strpos($html, '</head>');
        if ($headClosePos !== false) {
            $before = substr($html, 0, $headClosePos);
            $after = substr($html, $headClosePos);
            
            $criticalCSSBlock = "<style id=\"critical-css\">{$criticalCSS}</style>\n";
            
            return $before . $criticalCSSBlock . $after;
        }
        
        return $html;
    }

    /**
     * Preload critical resources
     */
    public function getPreloadLinks(): array
    {
        return [
            '<link rel="preload" href="' . asset('css/app.css') . '" as="style">',
            '<link rel="preload" href="' . asset('js/app.js') . '" as="script">',
            '<link rel="preload" href="https://fonts.bunny.net/css?family=tajawal:400,500,600,700" as="style" crossorigin>',
        ];
    }

    /**
     * Generate resource hints for external domains
     */
    public function getResourceHints(): array
    {
        return [
            '<link rel="dns-prefetch" href="//cdn.tailwindcss.com">',
            '<link rel="dns-prefetch" href="//cdn.jsdelivr.net">',
            '<link rel="dns-prefetch" href="//unpkg.com">',
            '<link rel="dns-prefetch" href="//fonts.bunny.net">',
            '<link rel="preconnect" href="https://api-test.qu.edu.sa">',
            '<link rel="preconnect" href="https://api.qu.edu.sa">',
        ];
    }

    /**
     * Check if browser supports WebP
     */
    private function browserSupportsWebP(): bool
    {
        $userAgent = request()->header('User-Agent', '');
        $accept = request()->header('Accept', '');
        
        // Check Accept header for WebP support
        if (str_contains($accept, 'image/webp')) {
            return true;
        }
        
        // Check user agent for known WebP-supporting browsers
        $webpBrowsers = ['Chrome', 'Firefox', 'Opera', 'Edge'];
        foreach ($webpBrowsers as $browser) {
            if (str_contains($userAgent, $browser)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Lazy load images by adding loading="lazy" attribute
     */
    public function lazyLoadImages(string $html): string
    {
        // Add loading="lazy" to all img tags that don't already have it
        $html = preg_replace(
            '/<img(?![^>]*loading=)([^>]*?)>/i',
            '<img loading="lazy"$1>',
            $html
        );
        
        return $html;
    }

    /**
     * Defer non-critical JavaScript
     */
    public function deferNonCriticalJS(string $html): string
    {
        // Add defer to script tags that don't have async or defer
        $html = preg_replace(
            '/<script(?![^>]*(?:async|defer))([^>]*?)>/i',
            '<script defer$1>',
            $html
        );
        
        return $html;
    }

    /**
     * Remove unused CSS (simplified version)
     */
    public function removeUnusedCSS(string $css, string $html): string
    {
        // This is a simplified version - in production you'd use a tool like PurgeCSS
        $usedClasses = [];
        
        // Extract classes from HTML
        preg_match_all('/class=["\']([^"\']*)["\']/', $html, $matches);
        foreach ($matches[1] as $classString) {
            $classes = explode(' ', $classString);
            $usedClasses = array_merge($usedClasses, $classes);
        }
        
        $usedClasses = array_unique(array_filter($usedClasses));
        
        // This is a very basic implementation - you'd want a more sophisticated approach
        return $css;
    }
}
