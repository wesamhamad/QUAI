<?php

namespace App\Filament\Pages;

use App\Support\Filament\DecisionDashboardPage;

class FeedbackDashboard extends DecisionDashboardPage
{
    protected static ?string $navigationIcon = 'heroicon-o-light-bulb';

    protected static ?string $navigationLabel = 'لوحة الأفكار — تطبيق MyQU';

    protected static ?string $title = 'لوحة الأفكار — تطبيق MyQU';

    protected static ?int $navigationSort = 6;

    protected static ?string $slug = 'dashboards/feedback';

    protected function dashboardSlug(): string
    {
        return 'feedback';
    }
}
