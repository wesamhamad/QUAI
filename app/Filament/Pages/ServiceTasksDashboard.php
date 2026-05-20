<?php

namespace App\Filament\Pages;

use App\Support\Filament\DecisionDashboardPage;

class ServiceTasksDashboard extends DecisionDashboardPage
{
    protected static ?string $navigationIcon = 'heroicon-o-wrench-screwdriver';

    protected static ?int $navigationSort = 1;

    protected static ?string $slug = 'dashboards/service-tasks';

    protected function dashboardSlug(): string
    {
        return 'service-tasks';
    }

    public static function getNavigationLabel(): string
    {
        return __('messages.dashboard_service_tasks');
    }

    public function getTitle(): string
    {
        return __('messages.dashboard_service_tasks');
    }
}
