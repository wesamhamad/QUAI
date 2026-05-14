<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('review_sources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->enum('platform', ['google_play', 'app_store', 'google_maps', 'reddit', 'news']);
            $table->string('external_id');
            $table->string('name');
            $table->json('config')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_scraped_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('review_sources');
    }
};
