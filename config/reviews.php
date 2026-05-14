<?php

return [
    /*
    |--------------------------------------------------------------------------
    | QU Reviews Scraper Configuration
    |--------------------------------------------------------------------------
    */

    // Google Places API (for Google Maps reviews)
    'google_places' => [
        'api_key' => env('GOOGLE_PLACES_API_KEY', ''),
    ],

    // Reddit API (OAuth)
    'reddit' => [
        'client_id' => env('REDDIT_CLIENT_ID', ''),
        'client_secret' => env('REDDIT_CLIENT_SECRET', ''),
    ],

    // News APIs
    'gnews' => [
        'api_key' => env('GNEWS_API_KEY', ''),
    ],
    'newsdata' => [
        'api_key' => env('NEWSDATA_API_KEY', ''),
    ],

    // Social Searcher (free: 100 searches/day across X, Facebook, Instagram, etc.)
    'social_searcher' => [
        'api_key' => env('SOCIAL_SEARCHER_API_KEY', ''),
    ],

    // YouTube Data API v3 (free: 10,000 units/day)
    'youtube' => [
        'api_key' => env('YOUTUBE_API_KEY', ''),
    ],

    // Default apps to track
    'apps' => [
        'google_play_id' => env('REVIEWS_GOOGLE_PLAY_ID', 'edu.qu.app'),
        'app_store_id' => env('REVIEWS_APP_STORE_ID', '6739521806'),
    ],

    // Arabic stopwords for word cloud filtering
    'arabic_stopwords' => [
        'من', 'في', 'على', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك',
        'التي', 'الذي', 'التى', 'هو', 'هي', 'هم', 'هن', 'أنا', 'نحن', 'أنت',
        'أنتم', 'كان', 'كانت', 'يكون', 'تكون', 'لا', 'لم', 'لن', 'ما', 'ليس',
        'بعد', 'قبل', 'بين', 'حتى', 'إذا', 'عند', 'أو', 'ثم', 'أن', 'إن',
        'كل', 'بعض', 'غير', 'أي', 'كذلك', 'أيضا', 'فقط', 'قد', 'ولا', 'بل',
        'لكن', 'أما', 'حيث', 'منذ', 'خلال', 'ضد', 'حول', 'دون', 'فوق', 'تحت',
        'جدا', 'الى', 'او', 'و', 'ف', 'ب', 'ل', 'ك',
    ],

    // Scraping schedule settings
    'schedule' => [
        'google_play' => '02:00',
        'app_store' => '02:05',
        'google_maps' => '02:10',
        'reddit' => '02:15',
        'news' => '02:20',
        'social_media' => '02:25',
        'youtube' => '02:30',
        'analysis' => '03:00',
        'daily_summary' => '04:00',
    ],
];
