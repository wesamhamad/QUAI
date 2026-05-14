<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('production', 'staging')) {
            URL::forceScheme('https');
        }

        // Super Admin bypasses all permission checks
        Gate::before(function ($user) {
            return $user->isSuperAdmin() ? true : null;
        });
    }
}
