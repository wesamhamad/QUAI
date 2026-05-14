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
        Schema::create('course_sections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained()->onDelete('cascade');
            $table->foreignId('instructor_id')->nullable()->constrained('instructor_profiles')->onDelete('set null');
            $table->foreignId('semester_id')->constrained()->onDelete('cascade');
            
            $table->string('section_no', 10); // 01, 02, 03
            $table->string('activity_code', 10)->nullable(); // LEC, LAB, TUT
            $table->string('activity_name', 50)->nullable(); // محاضرة، معمل
            
            // أوقات المحاضرات (يمكن استخدام JSON لمرونة أكبر)
            $table->json('schedule')->nullable(); // [{"day": "SUN", "start": "08:00", "end": "09:30", "room": "101"}]
            
            $table->integer('capacity')->nullable();
            $table->integer('enrolled_count')->default(0);
            $table->string('status', 20)->default('active'); // active, cancelled, completed
            
            $table->timestamps();
            
            // فهارس
            $table->unique(['course_id', 'semester_id', 'section_no', 'activity_code'], 'unique_section');
            $table->index('instructor_id');
            $table->index('semester_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_sections');
    }
};

