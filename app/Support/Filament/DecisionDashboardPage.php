<?php

namespace App\Support\Filament;

use App\Http\Controllers\QDecisionController;
use App\Support\DecisionDashboards;
use Filament\Pages\Page;
use Livewire\Attributes\Url;

/**
 * Shared base for the six Q-Decision Filament dashboard pages.
 *
 * Lives outside app/Filament/Pages on purpose so Filament's page
 * discovery does not try to register this abstract class.
 */
abstract class DecisionDashboardPage extends Page
{
    protected static string $view = 'filament.pages.decision-dashboard';

    /** Active quarter — bound to the URL so it survives refresh / sharing. */
    #[Url]
    public string $quarter = 'Q1';

    /** Concrete pages return their DecisionDashboards / sections() slug. */
    abstract protected function dashboardSlug(): string;

    public static function getNavigationGroup(): ?string
    {
        return __('messages.nav_group_dashboards');
    }

    /** Demo pages are always visible (bypass Shield permission gating). */
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
        $slug = $this->dashboardSlug();
        $meta = QDecisionController::DASHBOARDS[$slug];
        $meta['title'] = __($meta['title_key']);
        $section = collect(QDecisionController::recommendationSections())->firstWhere('id', $slug);

        return [
            'meta'          => $meta,
            'data'          => DecisionDashboards::all($this->quarter)[$meta['data']],
            'section'       => $section,
            'priorityMeta'  => QDecisionController::priorityMeta(),
            'quarters'      => DecisionDashboards::quarters(),
            'activeQuarter' => $this->quarter,
        ];
    }
}
