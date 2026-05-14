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
        Schema::create('admin_students_cache', function (Blueprint $table) {
            $table->id();
            $table->string('student_id', 50)->index();
            $table->string('student_name')->nullable();
            $table->string('semester', 10)->index();
            $table->decimal('last_recorded_gpa', 4, 2)->nullable()->index();
            $table->decimal('attendance_percent', 5, 2)->nullable()->index();
            $table->decimal('absence_percent', 5, 2)->nullable();
            $table->string('course_code', 50)->nullable();
            $table->string('course_name')->nullable();

            // Faculty/College/Specialization fields
            $table->string('faculty_no', 50)->nullable()->index();
            $table->string('faculty_name')->nullable();
            $table->string('major_no', 50)->nullable()->index();
            $table->string('major_name')->nullable();
            $table->string('dept_no', 50)->nullable()->index();
            $table->string('dept_name')->nullable();

            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            // Composite indexes for faster queries
            $table->index(['semester', 'last_recorded_gpa']);
            $table->index(['semester', 'attendance_percent']);
            $table->index(['semester', 'faculty_no']);
            $table->index(['semester', 'major_no']);
            $table->index(['semester', 'dept_no']);
            $table->unique(['student_id', 'semester']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_students_cache');
    }
};

