<?php

return [
    // API rate limiter — referenced by QuaiServiceProvider.
    'rate_limit' => [
        'enabled' => env('QUAI_RATE_LIMIT_ENABLED', true),
        'max_requests' => env('QUAI_RATE_LIMIT_MAX', 60),
        'decay_minutes' => env('QUAI_RATE_LIMIT_DECAY', 1),
    ],

    // Base URL of the bundled standalone Q SPARK demo (./QSPARK) — a SEPARATE
    // Laravel app with its own /dev/{role} auto-login routes. It is NOT merged
    // into QUAI; the apps stay independent and are joined only at the web-server
    // layer. In production the QUAI nginx vhost mounts QSPARK at /qspark of the
    // shared domain, so the /qspark-demo iframe is same-origin and the browser
    // no longer blocks it. See deploy/nginx/quailab.dev.conf + SAME_DOMAIN_SETUP.md.
    // NOTE: this URL must actually expose /dev/{role}. Override QSPARK_DEMO_URL
    // per environment:
    //   Production: https://quailab.dev/qspark
    //   Local dev:  http://127.0.0.1:8001  (`php artisan serve --port=8001` in ./QSPARK)
    'qspark_demo_url' => env('QSPARK_DEMO_URL', 'https://quailab.dev/qspark'),
];
