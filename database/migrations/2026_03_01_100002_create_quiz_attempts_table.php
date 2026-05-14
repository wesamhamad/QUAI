<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->uuid('training_bag_id');
            $table->foreign('training_bag_id')->references('id')->on('training_bags')->cascadeOnDelete();
            $table->unsignedSmallInteger('chapter_index');
            $table->unsignedSmallInteger('score');
            $table->unsignedSmallInteger('total_questions');
            $table->unsignedSmallInteger('percentage');
            $table->json('answers')->nullable();
            $table->unsignedInteger('time_seconds')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'training_bag_id', 'chapter_index']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};
