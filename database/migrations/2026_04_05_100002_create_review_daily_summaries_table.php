<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('review_daily_summaries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('date');
            $table->string('platform')->nullable();
            $table->integer('total_reviews')->default(0);
            $table->decimal('avg_sentiment_score', 5, 2)->nullable();
            $table->integer('positive_count')->default(0);
            $table->integer('negative_count')->default(0);
            $table->integer('neutral_count')->default(0);
            $table->json('top_topics')->nullable();
            $table->json('word_frequencies')->nullable();
            $table->text('summary_text')->nullable();
            $table->timestamps();

            $table->unique(['date', 'platform']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review_daily_summaries');
    }
};
