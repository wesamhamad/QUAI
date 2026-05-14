<?php

namespace App\QSpark\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class QSparkEventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        // SAML Events (aacotroneo/laravel-saml2)
        \Aacotroneo\Saml2\Events\Saml2LoginEvent::class => [
            \App\QSpark\Listeners\SamlLoginListener::class,
        ],

        \Aacotroneo\Saml2\Events\Saml2LogoutEvent::class => [
            \App\QSpark\Listeners\SamlLogoutListener::class,
        ],
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
