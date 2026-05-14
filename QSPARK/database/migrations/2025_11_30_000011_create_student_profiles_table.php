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
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('major_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('current_semester_id')->nullable()->constrained('semesters')->onDelete('set null');
            
            // بيانات شخصية
            $table->string('national_id', 20)->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->date('birth_date')->nullable();
            
            // بيانات أكاديمية
            $table->string('student_level', 20)->nullable(); // freshman, sophomore, junior, senior
            $table->string('academic_status', 20)->default('active'); // active, suspended, graduated, withdrawn
            $table->decimal('cumulative_gpa', 4, 2)->nullable();
            $table->decimal('semester_gpa', 4, 2)->nullable();
            $table->integer('attempted_hours')->default(0);
            $table->integer('passed_hours')->default(0);
            $table->integer('remaining_hours')->nullable();
            
            // بيانات الحضور العامة
            $table->decimal('overall_attendance_percent', 5, 2)->nullable();
            $table->integer('total_absences')->default(0);
            $table->integer('excused_absences')->default(0);
            
            // بيانات الألعاب والنشاط
            $table->integer('total_play_minutes')->default(0);
            $table->integer('game_points')->default(0);
            $table->integer('game_attempts')->default(0);
            
            // تواريخ مهمة
            $table->date('admission_date')->nullable();
            $table->date('expected_graduation_date')->nullable();
            
            $table->timestamps();
            
            $table->index('major_id');
            $table->index('academic_status');
            $table->index('cumulative_gpa');
            $table->index('overall_attendance_percent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_profiles');
    }
};

