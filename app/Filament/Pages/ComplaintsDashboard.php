<?php

namespace App\Filament\Pages;

use App\Support\Filament\DecisionDashboardPage;

class ComplaintsDashboard extends DecisionDashboardPage
{
    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    protected static ?int $navigationSort = 2;

    protected static ?string $slug = 'dashboards/complaints';

    protected function dashboardSlug(): string
    {
        return 'complaints';
    }

    public static function getNavigationLabel(): string
    {
        return __('messages.dashboard_complaints');
    }

    public function getTitle(): string
    {
        return __('messages.dashboard_complaints');
    }
}
