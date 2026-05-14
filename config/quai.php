<?php

return [
    // API rate limiter — referenced by QuaiServiceProvider.
    'rate_limit' => [
        'enabled' => env('QUAI_RATE_LIMIT_ENABLED', true),
        'max_requests' => env('QUAI_RATE_LIMIT_MAX', 60),
        'decay_minutes' => env('QUAI_RATE_LIMIT_DECAY', 1),
    ],

    // Base URL of the bundled standalone Q SPARK demo (./QSPARK) — a SEPARATE
    // Laravel app with its own /dev/{role} auto-login routes. It must NOT point
    // at APP_URL (the main QUAI app has no /dev/* routes, so the iframe 404s).
    // Set QSPARK_DEMO_URL to wherever the QSPARK app is actually served:
    //   local : http://127.0.0.1:8001  (php artisan serve --port=8001 in ./QSPARK)
    //   prod  : the deployed QSPARK host, e.g. https://qspark.quailab.dev
    'qspark_demo_url' => env('QSPARK_DEMO_URL', 'http://127.0.0.1:8001'),
];
