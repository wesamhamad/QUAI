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
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100)->unique(); // view_students, edit_grades
            $table->string('display_name_ar', 150)->nullable(); // عرض الطلاب
            $table->string('display_name_en', 150)->nullable(); // View Students
            $table->string('group', 50)->nullable()->index(); // students, grades, reports, games
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permissions');
    }
};

