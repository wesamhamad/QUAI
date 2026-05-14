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
        Schema::create('student_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('student_profiles')->onDelete('cascade');
            $table->foreignId('course_section_id')->constrained('course_sections')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained()->onDelete('cascade');
            
            // بيانات الحضور
            $table->decimal('attendance_percent', 5, 2)->nullable();
            $table->integer('total_absences')->default(0);
            $table->integer('excused_absences')->default(0);
            $table->integer('unexcused_absences')->default(0);
            $table->integer('total_lectures')->nullable();
            $table->integer('attended_lectures')->nullable();
            
            // بيانات الدرجات
            $table->decimal('midterm_grade', 5, 2)->nullable();
            $table->decimal('final_grade', 5, 2)->nullable();
            $table->decimal('coursework_grade', 5, 2)->nullable();
            $table->decimal('total_grade', 5, 2)->nullable();
            $table->string('letter_grade', 5)->nullable(); // A+, A, B+, B, ...
            $table->decimal('grade_points', 4, 2)->nullable(); // 4.0, 3.75, 3.5, ...
            
            // حالة التسجيل
            $table->string('status', 20)->default('enrolled'); // enrolled, withdrawn, completed, failed
            $table->date('enrollment_date')->nullable();
            $table->date('withdrawal_date')->nullable();
            
            $table->timestamps();
            
            // فهارس
            $table->unique(['student_id', 'course_section_id'], 'unique_enrollment');
            $table->index('semester_id');
            $table->index('status');
            $table->index('attendance_percent');
            $table->index('letter_grade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_enrollments');
    }
};

