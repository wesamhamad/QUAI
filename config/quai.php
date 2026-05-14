<?php

return [
    // API rate limiter — referenced by QuaiServiceProvider.
    'rate_limit' => [
        'enabled' => env('QUAI_RATE_LIMIT_ENABLED', true),
        'max_requests' => env('QUAI_RATE_LIMIT_MAX', 60),
        'decay_minutes' => env('QUAI_RATE_LIMIT_DECAY', 1),
    ],

    // The QSPARK app is merged into QUAI and served under the /qspark URL
    // prefix (routes/qspark.php, mounted from bootstrap/app.php). The
    // /qspark-demo wrapper builds the iframe URL from url('/qspark'), so there
    // is no separate base URL to configure.
];
