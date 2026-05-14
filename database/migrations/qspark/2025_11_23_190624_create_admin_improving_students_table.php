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
        Schema::create('admin_improving_students', function (Blueprint $table) {
            $table->id();
            $table->string('semester');
            $table->string('student_id');
            $table->string('student_name');
            $table->string('student_name_s')->nullable();
            $table->string('faculty_no');
            $table->string('faculty_name');
            $table->string('faculty_name_s')->nullable();
            $table->string('major_no')->nullable();
            $table->string('major_name')->nullable();
            $table->string('major_name_s')->nullable();
            $table->string('major_code')->nullable();
            $table->decimal('gpa_improvement', 5, 2)->default(0);
            $table->decimal('attendance_improvement', 5, 2)->default(0);
            $table->decimal('current_gpa', 5, 2)->nullable();
            $table->decimal('previous_gpa', 5, 2)->nullable();
            $table->decimal('current_attendance', 5, 2)->nullable();
            $table->decimal('previous_attendance', 5, 2)->nullable();
            $table->integer('rank_in_faculty')->default(0);
            $table->timestamps();

            $table->index(['semester', 'faculty_no']);
            $table->index(['semester', 'gpa_improvement']);
            // Explicit short name: the auto-generated one exceeds MySQL's
            // 64-char identifier limit once the `qspark_` table prefix is added.
            $table->index(['semester', 'attendance_improvement'], 'ais_semester_attendance_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_improving_students');
    }
};
