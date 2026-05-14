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
        Schema::create('semesters', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique(); // 202510, 202520, 202530
            $table->string('name_ar', 100); // الفصل الدراسي الأول 2024-2025
            $table->string('name_en', 100)->nullable(); // First Semester 2024-2025
            $table->year('academic_year'); // 2024, 2025
            $table->tinyInteger('term')->comment('1=First, 2=Second, 3=Summer'); // 1, 2, 3
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->date('registration_start')->nullable();
            $table->date('registration_end')->nullable();
            $table->boolean('is_current')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('is_current');
            $table->index(['academic_year', 'term']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semesters');
    }
};

