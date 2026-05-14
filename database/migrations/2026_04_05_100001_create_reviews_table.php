<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('review_source_id');
            $table->enum('platform', ['google_play', 'app_store', 'google_maps', 'reddit', 'news']);
            $table->string('external_review_id');
            $table->string('author_name')->nullable();
            $table->decimal('rating', 2, 1)->nullable();
            $table->text('content');
            $table->string('language', 5)->default('ar');
            $table->timestamp('published_at')->nullable();
            $table->string('url')->nullable();
            $table->json('raw_data')->nullable();
            $table->enum('sentiment', ['positive', 'negative', 'neutral'])->nullable();
            $table->decimal('sentiment_score', 3, 2)->nullable();
            $table->json('topics')->nullable();
            $table->boolean('is_analyzed')->default(false);
            $table->timestamps();

            $table->foreign('review_source_id')
                  ->references('id')
                  ->on('review_sources')
                  ->onDelete('cascade');

            $table->unique(['platform', 'external_review_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
