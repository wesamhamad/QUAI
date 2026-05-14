<?php

return [
    // API rate limiter — referenced by QuaiServiceProvider.
    'rate_limit' => [
        'enabled' => env('QUAI_RATE_LIMIT_ENABLED', true),
        'max_requests' => env('QUAI_RATE_LIMIT_MAX', 60),
        'decay_minutes' => env('QUAI_RATE_LIMIT_DECAY', 1),
    ],

    // Base URL of the bundled standalone Q SPARK demo (./QSPARK).
    // The QSPARK card on the home page deep-links into /dev/{role} on this host
    // so the user is auto-signed-in with the matching demo persona.
    'qspark_demo_url' => env('APP_URL', 'https://quailab.dev'),
];
