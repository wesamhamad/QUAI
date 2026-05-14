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
        Schema::create('majors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('department_id')->constrained()->onDelete('cascade');
            $table->string('code', 20)->unique(); // CS101, IS201
            $table->string('name_ar', 150); // بكالوريوس علوم الحاسب
            $table->string('name_en', 150)->nullable(); // Bachelor of Computer Science
            $table->string('degree_type', 20)->default('bachelor'); // bachelor, master, phd, diploma
            $table->integer('credit_hours_required')->nullable(); // 132
            $table->integer('years_to_complete')->nullable(); // 4
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('department_id');
            $table->index('degree_type');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('majors');
    }
};

