<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    // --- Merged from the QSPARK app (used by App\QSpark\* services) ---

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_QUIZ_MODEL', 'gpt-4o-mini'),
        'direct_quiz' => env('OPENAI_QUIZ_DIRECT', false),
    ],

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
    ],

    /*
    | Blackboard Learn REST API — OAuth 2.0 client credentials flow.
    | See: https://developer.anthology.com/portal/displayApi/Learn
    */
    'blackboard' => [
        'base_url' => env('BLACKBOARD_BASE_URL', 'https://qu.blackboard.com'),
        'api_path' => '/learn/api/public',
        'token_url' => env('BLACKBOARD_TOKEN_URL'),
        'client_id' => env('BLACKBOARD_CLIENT_ID'),
        'client_secret' => env('BLACKBOARD_CLIENT_SECRET'),
        'timeout' => env('BLACKBOARD_TIMEOUT', 30),
        'cache_ttl' => env('BLACKBOARD_CACHE_TTL', 3600),
    ],

];
