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
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique(); // admin, faculty, student
            $table->string('display_name_ar', 100)->nullable(); // مدير النظام
            $table->string('display_name_en', 100)->nullable(); // System Admin
            $table->text('description')->nullable();
            $table->integer('level')->default(0); // للترتيب الهرمي
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};

