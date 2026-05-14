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
        Schema::create('student_quiz_exports', function (Blueprint $table) {
            $table->id();
            
            // Student who exported
            $table->string('student_id')->index();
            
            // Course info
            $table->string('course_code')->index();
            
            // Attachment key (courseId_contentId_attachmentId)
            $table->string('attachment_key')->index();
            
            // Number of questions exported
            $table->integer('questions_count')->default(0);
            
            // Export metadata
            $table->string('export_format')->default('word'); // word, pdf, etc.
            
            $table->timestamps();
            
            // Ensure each student can only export questions from a specific attachment once
            $table->unique(['student_id', 'attachment_key'], 'unique_student_attachment_export');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_quiz_exports');
    }
};

