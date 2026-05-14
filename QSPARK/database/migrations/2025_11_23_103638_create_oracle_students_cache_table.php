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
        Schema::create('oracle_students_cache', function (Blueprint $table) {
            $table->id();
            $table->string('student_id', 50)->index();
            $table->string('student_name')->nullable();
            $table->decimal('gpa', 4, 2)->nullable()->index();
            $table->decimal('attendance_percent', 5, 2)->nullable()->index();
            $table->string('course_code', 50)->nullable();
            $table->string('course_name')->nullable();
            $table->string('semester', 10)->index();
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            // Composite index for faster queries
            $table->index(['semester', 'gpa']);
            $table->index(['semester', 'attendance_percent']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('oracle_students_cache');
    }
};
