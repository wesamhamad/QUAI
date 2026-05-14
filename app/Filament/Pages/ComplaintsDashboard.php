<?php

namespace App\Filament\Pages;

use App\Support\Filament\DecisionDashboardPage;

class ComplaintsDashboard extends DecisionDashboardPage
{
    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    protected static ?string $navigationLabel = 'لوحة الشكاوى والمقترحات';

    protected static ?string $title = 'لوحة الشكاوى والمقترحات';

    protected static ?int $navigationSort = 2;

    protected static ?string $slug = 'dashboards/complaints';

    protected function dashboardSlug(): string
    {
        return 'complaints';
    }
}
