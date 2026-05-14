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
        Schema::create('instructor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            
            // بيانات الرتبة الأكاديمية
            $table->string('rank_code', 20)->nullable(); // PROF, ASSOC_PROF, ASST_PROF, LECTURER
            $table->string('rank_name_ar', 100)->nullable(); // أستاذ، أستاذ مشارك
            $table->string('rank_name_en', 100)->nullable(); // Professor, Associate Professor
            
            // بيانات إضافية
            $table->string('office_location', 100)->nullable();
            $table->string('office_phone', 20)->nullable();
            $table->text('research_interests')->nullable();
            $table->string('academic_status', 20)->default('active'); // active, on_leave, retired
            
            // إحصائيات
            $table->integer('total_courses_taught')->default(0);
            $table->integer('total_students_taught')->default(0);
            $table->integer('ai_questions_generated')->default(0);
            
            $table->timestamps();
            
            $table->index('department_id');
            $table->index('rank_code');
            $table->index('academic_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instructor_profiles');
    }
};

