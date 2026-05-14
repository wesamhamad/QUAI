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
        Schema::create('registered_students_cache', function (Blueprint $table) {
            $table->id();
            $table->integer('semester')->index();
            $table->string('student_id', 50)->index();
            $table->string('first_name_ar', 100)->nullable();
            $table->string('last_name_ar', 100)->nullable();
            $table->string('national_id', 50)->nullable();
            $table->string('gender', 10)->nullable();
            $table->string('degree_code', 20)->nullable();
            $table->integer('faculty_no')->nullable()->index();
            $table->integer('campus_no')->nullable();
            $table->string('email', 100)->nullable();
            $table->string('mobile_phone', 50)->nullable();
            $table->string('status_code', 20)->nullable();

            // Academic data
            $table->decimal('cumulative_gpa', 5, 2)->nullable();
            $table->decimal('semester_gpa', 5, 2)->nullable();
            $table->integer('attempted_hours')->nullable();
            $table->integer('passed_hours')->nullable();
            $table->string('student_level', 50)->nullable();

            // Attendance data
            $table->decimal('attendance_percent', 5, 2)->nullable();
            $table->integer('total_absences')->nullable();
            $table->integer('excused_absences')->nullable();

            // Activity count
            $table->integer('activity_count')->default(0);

            $table->timestamps();

            // Unique constraint
            $table->unique(['semester', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registered_students_cache');
    }
};
