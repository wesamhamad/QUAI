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
        Schema::create('admin_engagement_metrics', function (Blueprint $table) {
            $table->id();

            // Semester
            $table->string('semester', 50)->index();

            // Overall metrics
            $table->integer('total_students')->default(0);
            $table->integer('engaged_students')->default(0);
            $table->decimal('overall_engagement_rate', 5, 2)->default(0);

            // Faculty participation
            $table->integer('total_faculty')->default(0);
            $table->integer('faculty_with_students')->default(0);
            $table->decimal('faculty_participation_rate', 5, 2)->default(0);

            // College engagement data (JSON)
            $table->longText('engagement_by_college')->nullable();

            // Specialization engagement data (JSON)
            $table->longText('engagement_by_specialization')->nullable();

            // Metadata
            $table->timestamp('last_calculated_at')->nullable();
            $table->timestamps();

            // Indexes
            $table->unique('semester');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_engagement_metrics');
    }
};
