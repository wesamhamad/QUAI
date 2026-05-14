<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('faculty_courses_cache', function (Blueprint $table) {
            $table->id();
            $table->string('instructor_id', 50)->index();
            $table->string('course_no', 50);
            $table->string('course_code', 50)->nullable();
            $table->string('course_name')->nullable();
            $table->string('section', 10)->nullable();
            $table->string('activity_code', 10)->nullable();
            $table->string('activity_name', 100)->nullable();
            $table->string('semester', 10)->index();
            $table->integer('student_count')->default(0);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            // Composite indexes for faster queries
            $table->index(['instructor_id', 'semester']);
            $table->index(['course_no', 'semester']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_courses_cache');
    }
};

