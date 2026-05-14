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
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();
            
            // Unique identifier for the attachment (courseId_contentId_attachmentId)
            $table->string('attachment_key')->index();
            
            // Course info
            $table->string('course_code')->nullable()->index();
            $table->string('course_id')->nullable(); // Blackboard course ID
            $table->string('content_id')->nullable();
            $table->string('attachment_id')->nullable();
            
            // Question data
            $table->text('question');
            $table->string('question_hash', 64)->nullable(); // SHA256 hash for uniqueness
            $table->json('options'); // Array of options
            $table->tinyInteger('correct_index'); // Index of correct answer (0-3)
            $table->enum('difficulty', ['easy', 'medium', 'hard'])->default('medium');
            $table->string('type')->default('enemy'); // enemy, minion, boss

            // Language detection
            $table->string('language', 5)->default('ar'); // ar, en

            // AI metadata
            $table->string('thread_id')->nullable();

            $table->timestamps();

            // Unique constraint using hash instead of full text
            $table->unique(['attachment_key', 'question_hash'], 'unique_question_per_attachment');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};

