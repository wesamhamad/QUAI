<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('student_id')->unique(); // QU student ID
            $table->string('arabic_name')->nullable();
            $table->string('english_name')->nullable();
            $table->string('email')->nullable();
            $table->enum('gender', ['Male', 'Female'])->nullable();
            $table->decimal('gpa', 3, 2)->nullable();
            $table->decimal('attendance_rate', 5, 2)->default(0);
            $table->integer('total_study_hours')->default(0); // Total minutes
            $table->integer('game_points')->default(0);
            $table->integer('game_attempts')->default(0);
            $table->timestamps();
            
            $table->index('student_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};