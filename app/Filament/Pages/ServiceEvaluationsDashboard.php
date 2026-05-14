<?php

namespace App\Filament\Pages;

use App\Support\Filament\DecisionDashboardPage;

class ServiceEvaluationsDashboard extends DecisionDashboardPage
{
    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document-check';

    protected static ?string $navigationLabel = 'لوحة تقييم الخدمات';

    protected static ?string $title = 'لوحة تقييم الخدمات';

    protected static ?int $navigationSort = 3;

    protected static ?string $slug = 'dashboards/service-evaluations';

    protected function dashboardSlug(): string
    {
        return 'service-evaluations';
    }
}
