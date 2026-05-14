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
        Schema::create('faculty_students_cache', function (Blueprint $table) {
            $table->id();
            $table->string('instructor_id', 50)->index();
            $table->string('student_id', 50)->index();
            $table->string('student_name')->nullable();
            $table->string('course_no', 50);
            $table->string('course_code', 50)->nullable();
            $table->string('course_name')->nullable();
            $table->string('section', 10)->nullable();
            $table->string('activity_code', 10)->nullable();
            $table->decimal('last_recorded_gpa', 4, 2)->nullable()->index();
            $table->decimal('attendance_percent', 5, 2)->nullable()->index();
            $table->decimal('absence_percent', 5, 2)->nullable();
            $table->string('semester', 10)->index();
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            // Composite indexes for faster queries
            $table->index(['instructor_id', 'semester']);
            $table->index(['student_id', 'semester']);
            $table->index(['semester', 'last_recorded_gpa']);
            $table->index(['semester', 'attendance_percent']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty_students_cache');
    }
};

