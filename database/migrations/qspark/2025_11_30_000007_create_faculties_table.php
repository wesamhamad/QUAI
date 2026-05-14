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
        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->string('code', 10)->unique(); // 01, 02, 03
            $table->string('name_ar', 150); // كلية الشريعة والدراسات الإسلامية
            $table->string('name_en', 150)->nullable(); // College of Sharia and Islamic Studies
            $table->string('short_name_ar', 50)->nullable(); // الشريعة
            $table->string('short_name_en', 50)->nullable(); // Sharia
            $table->string('dean_name')->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculties');
    }
};

