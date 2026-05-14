<?php

if (!function_exists('dashboardRedirectFor')) {
    function dashboardRedirectFor(string $role)
    {
        return match ($role) {
            'admin'   => redirect()->route('admin.dashboard'),
            'faculty' => redirect()->route('faculty.dashboard'),
            default   => redirect()->route('dashboard.student'),
        };
    }
}

if (!function_exists('samlIdpForCurrentEnv')) {
    function samlIdpForCurrentEnv(): string
    {
        return match (config('app.env')) {
            'local'              => 'myqulocal',
            'staging', 'testing' => 'myqutest',
            default              => 'myqu',
        };
    }
}
