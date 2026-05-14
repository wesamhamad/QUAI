<?php

namespace App\Filament\Pages;

use App\Support\Filament\DecisionDashboardPage;

class ReviewsDashboard extends DecisionDashboardPage
{
    protected static ?string $navigationIcon = 'heroicon-o-star';

    protected static ?string $navigationLabel = 'لوحة التقييمات الخارجية';

    protected static ?string $title = 'لوحة التقييمات الخارجية';

    protected static ?int $navigationSort = 4;

    protected static ?string $slug = 'dashboards/reviews';

    protected function dashboardSlug(): string
    {
        return 'reviews';
    }
}
