<?php

return [
    // API rate limiter — referenced by QuaiServiceProvider.
    'rate_limit' => [
        'enabled' => env('QUAI_RATE_LIMIT_ENABLED', true),
        'max_requests' => env('QUAI_RATE_LIMIT_MAX', 60),
        'decay_minutes' => env('QUAI_RATE_LIMIT_DECAY', 1),
    ],

    // Base URL of the bundled standalone Q SPARK demo (./QSPARK) — a SEPARATE
    // Laravel app with its own /dev/{role} auto-login routes. Defaults to the
    // production host; override QSPARK_DEMO_URL per environment when QSPARK is
    // served elsewhere (e.g. http://127.0.0.1:8001 locally via
    // `php artisan serve --port=8001` inside ./QSPARK).
    // NOTE: the host this points at must actually expose /dev/{role}; the main
    // QUAI app does not, so QSPARK must be deployed at this URL for the iframe
    // to resolve instead of 404ing.
    'qspark_demo_url' => env('QSPARK_DEMO_URL', 'https://quailab.dev'),
];
