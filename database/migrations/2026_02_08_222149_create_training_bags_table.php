<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_bags', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title', 500);
            $table->text('description')->nullable();
            $table->string('target_audience', 100);
            $table->string('duration', 10);
            $table->json('objectives')->nullable();
            $table->string('language', 10)->default('ar');
            $table->longText('content');
            $table->string('share_token', 100)->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_bags');
    }
};
