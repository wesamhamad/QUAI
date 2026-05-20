<?php

namespace App\Filament\Pages;

use App\Support\Filament\DecisionDashboardPage;

class ReviewsDashboard extends DecisionDashboardPage
{
    protected static ?string $navigationIcon = 'heroicon-o-star';

    protected static ?int $navigationSort = 4;

    protected static ?string $slug = 'dashboards/reviews';

    protected function dashboardSlug(): string
    {
        return 'reviews';
    }

    public static function getNavigationLabel(): string
    {
        return __('messages.dashboard_reviews');
    }

    public function getTitle(): string
    {
        return __('messages.dashboard_reviews');
    }
}
