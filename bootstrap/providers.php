<?php

return [
    App\Providers\AppServiceProvider::class,
    App\Providers\QuaiServiceProvider::class,
    App\Providers\Filament\AdminPanelProvider::class,

    // Merged QSPARK app — view namespace, blade cache directives, SAML events.
    App\QSpark\Providers\QSparkServiceProvider::class,
    App\QSpark\Providers\QSparkEventServiceProvider::class,
    App\QSpark\Providers\ViewCacheServiceProvider::class,
];
