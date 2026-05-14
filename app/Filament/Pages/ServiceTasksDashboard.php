<?php

namespace App\Filament\Pages;

use App\Support\Filament\DecisionDashboardPage;

class ServiceTasksDashboard extends DecisionDashboardPage
{
    protected static ?string $navigationIcon = 'heroicon-o-wrench-screwdriver';

    protected static ?string $navigationLabel = 'لوحة مهام تقنية المعلومات (نظام ساعد)';

    protected static ?string $title = 'لوحة مهام تقنية المعلومات (نظام ساعد)';

    protected static ?int $navigationSort = 1;

    protected static ?string $slug = 'dashboards/service-tasks';

    protected function dashboardSlug(): string
    {
        return 'service-tasks';
    }
}
