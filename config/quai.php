<?php

return [
    // API rate limiter — referenced by QuaiServiceProvider.
    'rate_limit' => [
        'enabled' => env('QUAI_RATE_LIMIT_ENABLED', true),
        'max_requests' => env('QUAI_RATE_LIMIT_MAX', 60),
        'decay_minutes' => env('QUAI_RATE_LIMIT_DECAY', 1),
    ],
];
