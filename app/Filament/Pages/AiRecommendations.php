<?php

namespace App\Filament\Pages;

use App\Http\Controllers\QDecisionController;
use App\Support\DecisionDashboards;
use Filament\Pages\Page;
use Livewire\Attributes\Url;

class AiRecommendations extends Page
{
    protected static ?string $navigationGroup = 'Dashboards';

    protected static ?string $navigationIcon = 'heroicon-o-sparkles';

    protected static ?string $navigationLabel = 'توصيات الذكاء الاصطناعي';

    protected static ?string $title = 'توصيات الذكاء الاصطناعي';

    protected static ?int $navigationSort = 0;

    protected static ?string $slug = 'dashboards/ai-recommendations';

    protected static string $view = 'filament.pages.ai-recommendations';

    #[Url]
    public string $quarter = 'Q1';

    public static function canAccess(): bool
    {
        return true;
    }

    public function mount(): void
    {
        $this->quarter = DecisionDashboards::normalizeQuarter($this->quarter);
    }

    public function setQuarter(string $quarter): void
    {
        $this->quarter = DecisionDashboards::normalizeQuarter($quarter);
    }

    protected function getViewData(): array
    {
        return [
            'sections'      => QDecisionController::recommendationSections(),
            'priorityMeta'  => QDecisionController::priorityMeta(),
            'quarters'      => DecisionDashboards::quarters(),
            'activeQuarter' => $this->quarter,
        ];
    }
}
