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
        Schema::create('student_quiz_performance', function (Blueprint $table) {
            $table->id();
            
            $table->string('student_id')->index(); // QU student ID
            $table->string('course_code')->nullable()->index();
            $table->string('attachment_key')->nullable()->index(); // Which file quiz
            
            // Session data
            $table->string('session_id')->nullable(); // Unique session identifier
            
            // Performance metrics
            $table->tinyInteger('total_questions')->default(5);
            $table->tinyInteger('correct_answers')->default(0);
            $table->tinyInteger('wrong_answers')->default(0);
            $table->tinyInteger('lives_remaining')->default(3); // Out of 3
            
            // Time metrics (in seconds)
            $table->integer('total_time')->default(0); // Total time spent
            $table->float('avg_answer_time')->default(0); // Average seconds per question
            $table->integer('fastest_answer')->nullable(); // Fastest answer time
            $table->integer('slowest_answer')->nullable(); // Slowest answer time
            
            // Difficulty progression
            $table->enum('starting_difficulty', ['easy', 'medium', 'hard'])->default('medium');
            $table->enum('ending_difficulty', ['easy', 'medium', 'hard'])->default('medium');
            $table->json('difficulty_changes')->nullable(); // Track difficulty changes during game
            
            // Questions answered (to avoid repeating)
            $table->json('questions_answered')->nullable(); // Array of question IDs answered
            
            // Overall performance score (calculated)
            $table->float('performance_score')->default(50); // 0-100 score
            
            // Adaptive level for next session
            $table->enum('recommended_difficulty', ['easy', 'medium', 'hard'])->default('medium');
            
            $table->timestamps();
            
            // Index for finding latest performance
            $table->index(['student_id', 'course_code', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_quiz_performance');
    }
};

