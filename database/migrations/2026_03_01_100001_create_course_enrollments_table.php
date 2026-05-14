<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_enrollments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->uuid('training_bag_id');
            $table->foreign('training_bag_id')->references('id')->on('training_bags')->cascadeOnDelete();
            $table->unsignedTinyInteger('progress_percentage')->default(0);
            $table->json('visited_chapters')->nullable();
            $table->unsignedSmallInteger('last_chapter_index')->default(0);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'training_bag_id']);
            $table->index(['user_id', 'completed_at']);
            $table->index(['training_bag_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_enrollments');
    }
};
