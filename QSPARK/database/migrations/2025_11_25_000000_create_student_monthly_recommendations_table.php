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
        Schema::create('student_monthly_recommendations', function (Blueprint $table) {
            $table->id();
            $table->string('student_id')->index(); // QU student ID
            $table->string('month'); // Format: YYYY-MM (e.g., 2025-11)
            $table->text('recommendations'); // JSON array of recommendations
            $table->text('treatment_plans')->nullable(); // JSON array of treatment plans
            $table->text('tips')->nullable(); // JSON array of helpful tips
            $table->json('student_data')->nullable(); // Snapshot of student data used for generation
            $table->timestamp('generated_at'); // When recommendations were generated
            $table->timestamps();
            
            // Unique constraint: one recommendation per student per month
            $table->unique(['student_id', 'month']);
            $table->index(['student_id', 'generated_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_monthly_recommendations');
    }
};

