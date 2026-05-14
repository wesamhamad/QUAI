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
        Schema::create('student_goal_progress', function (Blueprint $table) {
            $table->id();
            $table->string('student_id')->index();
            $table->foreignId('recommendation_id')->constrained('student_monthly_recommendations')->onDelete('cascade');
            $table->string('goal_type'); // 'weekly', 'monthly', 'semester'
            $table->string('goal_category'); // 'academic', 'attendance', 'study_hours', 'games'
            $table->text('goal_description');
            $table->decimal('target_value', 8, 2)->nullable(); // Target value (e.g., 3.5 GPA, 90% attendance)
            $table->decimal('current_value', 8, 2)->nullable(); // Current value
            $table->integer('completion_percentage')->default(0); // 0-100
            $table->enum('status', ['not_started', 'in_progress', 'completed', 'failed'])->default('not_started');
            $table->date('start_date');
            $table->date('target_date');
            $table->date('completed_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index(['student_id', 'status']);
            $table->index(['student_id', 'goal_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_goal_progress');
    }
};

