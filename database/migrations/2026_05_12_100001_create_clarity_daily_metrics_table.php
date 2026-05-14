<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clarity_daily_metrics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('clarity_project_id')->constrained('clarity_projects')->cascadeOnDelete();
            $table->date('captured_for');

            // Traffic
            $table->unsignedInteger('total_sessions')->default(0);
            $table->unsignedInteger('bot_sessions')->default(0);
            $table->unsignedInteger('distinct_users')->default(0);
            $table->decimal('pages_per_session', 6, 3)->default(0);

            // Engagement
            $table->unsignedInteger('total_time_seconds')->default(0);
            $table->unsignedInteger('active_time_seconds')->default(0);
            $table->decimal('avg_scroll_depth', 5, 2)->default(0);

            // Friction (subTotal = raw event count; *_pct = % of sessions with the metric)
            $table->unsignedInteger('dead_clicks')->default(0);
            $table->decimal('dead_clicks_pct', 5, 2)->default(0);
            $table->unsignedInteger('rage_clicks')->default(0);
            $table->decimal('rage_clicks_pct', 5, 2)->default(0);
            $table->unsignedInteger('quickback_clicks')->default(0);
            $table->decimal('quickback_clicks_pct', 5, 2)->default(0);
            $table->unsignedInteger('excessive_scrolls')->default(0);
            $table->decimal('excessive_scrolls_pct', 5, 2)->default(0);
            $table->unsignedInteger('error_clicks')->default(0);
            $table->decimal('error_clicks_pct', 5, 2)->default(0);
            $table->unsignedInteger('script_errors')->default(0);
            $table->decimal('script_errors_pct', 5, 2)->default(0);

            // Breakdowns + raw — JSON so we can render without re-fetching
            $table->json('browsers')->nullable();
            $table->json('devices')->nullable();
            $table->json('operating_systems')->nullable();
            $table->json('countries')->nullable();
            $table->json('page_titles')->nullable();
            $table->json('popular_pages')->nullable();
            $table->json('referrers')->nullable();
            $table->json('raw_response')->nullable();
            $table->boolean('is_demo')->default(false);

            $table->timestamps();

            $table->unique(['clarity_project_id', 'captured_for']);
            $table->index('captured_for');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clarity_daily_metrics');
    }
};
