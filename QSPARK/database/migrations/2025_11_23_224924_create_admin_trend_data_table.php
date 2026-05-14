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
        Schema::create('admin_trend_data', function (Blueprint $table) {
            $table->id();
            $table->integer('semester')->index();
            $table->string('data_type', 50); // 'gpa_trend' or 'engagement_trend'
            $table->decimal('value', 10, 2)->nullable();
            $table->integer('student_count')->default(0);
            $table->timestamps();

            // Unique constraint to prevent duplicate entries
            $table->unique(['semester', 'data_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_trend_data');
    }
};
