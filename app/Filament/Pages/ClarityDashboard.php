<?php

namespace App\Filament\Pages;

use App\Support\Filament\DecisionDashboardPage;

class ClarityDashboard extends DecisionDashboardPage
{
    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';

    protected static ?int $navigationSort = 5;

    protected static ?string $slug = 'dashboards/clarity';

    protected function dashboardSlug(): string
    {
        return 'clarity';
    }

    public static function getNavigationLabel(): string
    {
        return __('messages.dashboard_clarity');
    }

    public function getTitle(): string
    {
        return __('messages.dashboard_clarity');
    }
}
