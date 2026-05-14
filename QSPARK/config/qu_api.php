<?php

$baseUrl = env('QU_API_BASE_URL', match (env('APP_ENV', 'production')) {
    'staging' => 'https://api-test.qu.edu.sa',
    default => 'https://api.qu.edu.sa',
});

return [

    /*
    |--------------------------------------------------------------------------
    | QU API Base URL
    |--------------------------------------------------------------------------
    |
    | Base URL for the qu-api-v2 service. Driven by the QU_API_BASE_URL env
    | var. When unset, falls back to an APP_ENV-aware default:
    |   local/testing/production → https://api.qu.edu.sa
    |   staging                  → https://api-test.qu.edu.sa
    |
    | Local development points at production qu-api on purpose: LDAP/Oracle
    | are not reachable from a developer's machine.
    |
    */

    'base_url' => $baseUrl,

    /*
    |--------------------------------------------------------------------------
    | SSO Login URL
    |--------------------------------------------------------------------------
    |
    | Where the app redirects users to start the qu-api SSO flow. Defaults to
    | {base_url}/web/login; override with QU_API_SSO_LOGIN_URL when the SSO
    | endpoint lives somewhere other than the API host.
    |
    */

    'sso_login_url' => env('QU_API_SSO_LOGIN_URL', rtrim($baseUrl, '/').'/web/login'),

    /*
    |--------------------------------------------------------------------------
    | SSO Callback URL
    |--------------------------------------------------------------------------
    |
    | Where qu-api should redirect back to after SSO. Set per-environment via
    | QU_API_SSO_CALLBACK_URL (e.g. http://127.0.0.1:8000/token/receive for
    | local dev).
    |
    */

    'sso_callback_url' => env('QU_API_SSO_CALLBACK_URL'),

];
