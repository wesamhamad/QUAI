<?php

namespace App\Filament\Pages;

use App\Support\Filament\DecisionDashboardPage;

class FeedbackDashboard extends DecisionDashboardPage
{
    protected static ?string $navigationIcon = 'heroicon-o-light-bulb';

    protected static ?int $navigationSort = 6;

    protected static ?string $slug = 'dashboards/feedback';

    protected function dashboardSlug(): string
    {
        return 'feedback';
    }

    public static function getNavigationLabel(): string
    {
        return __('messages.dashboard_feedback');
    }

    public function getTitle(): string
    {
        return __('messages.dashboard_feedback');
    }
}
