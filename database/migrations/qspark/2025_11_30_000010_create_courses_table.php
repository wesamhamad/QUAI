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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->nullable()->constrained()->onDelete('set null');
            $table->string('code', 20)->unique(); // ACCT241, CS101
            $table->string('course_no', 20)->nullable(); // رقم المقرر في Oracle
            $table->string('name_ar', 200); // مبادئ المحاسبة
            $table->string('name_en', 200)->nullable(); // Principles of Accounting
            $table->text('description_ar')->nullable();
            $table->text('description_en')->nullable();
            $table->tinyInteger('credit_hours')->default(3);
            $table->tinyInteger('lecture_hours')->nullable();
            $table->tinyInteger('lab_hours')->nullable();
            $table->string('course_type', 20)->default('required'); // required, elective, general
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('department_id');
            $table->index('course_no');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};

