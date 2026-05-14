<?php

namespace App\Filament\Pages;

use App\Support\Filament\DecisionDashboardPage;

class ClarityDashboard extends DecisionDashboardPage
{
    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';

    protected static ?string $navigationLabel = 'لوحة Microsoft Clarity';

    protected static ?string $title = 'لوحة Microsoft Clarity';

    protected static ?int $navigationSort = 5;

    protected static ?string $slug = 'dashboards/clarity';

    protected function dashboardSlug(): string
    {
        return 'clarity';
    }
}
