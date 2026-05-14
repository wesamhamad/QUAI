<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('course_id');
            $table->string('attachment_id')->nullable();
            $table->string('thread_id')->nullable();
            $table->integer('score');
            $table->integer('correct_count');
            $table->integer('total_count');
            $table->integer('streak_max');
            $table->integer('time_taken_ms');
            $table->timestamp('played_at');
            $table->timestamps();

            $table->index(['user_id', 'played_at']);
            $table->index(['course_id', 'score']);
        });

        Schema::create('quiz_streaks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->integer('current_streak')->default(0);
            $table->integer('longest_streak')->default(0);
            $table->date('last_played_on')->nullable();
            $table->timestamps();
        });

        Schema::create('quiz_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('achievement_key');
            $table->timestamp('unlocked_at');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'achievement_key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_achievements');
        Schema::dropIfExists('quiz_streaks');
        Schema::dropIfExists('quiz_scores');
    }
};
