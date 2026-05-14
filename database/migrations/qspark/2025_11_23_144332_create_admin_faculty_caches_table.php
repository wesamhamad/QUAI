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
        Schema::create('admin_faculty_caches', function (Blueprint $table) {
            $table->id();

            // Faculty information
            $table->string('instructor_id', 50)->unique()->index();
            $table->string('name_ar')->nullable();
            $table->string('email')->nullable();

            // Faculty/College information
            $table->string('faculty_no', 50)->nullable()->index();
            $table->string('faculty_name')->nullable();

            // Department information
            $table->string('dept_no', 50)->nullable()->index();
            $table->string('dept_name')->nullable();

            // Rank information
            $table->string('rank_code', 50)->nullable();
            $table->string('rank_name')->nullable();

            // Metadata
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            // Indexes for performance
            $table->index(['faculty_no', 'dept_no']);
            $table->index('rank_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_faculty_caches');
    }
};
