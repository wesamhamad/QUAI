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
        Schema::table('student_monthly_recommendations', function (Blueprint $table) {
            $table->text('certifications')->nullable()->after('study_techniques');
            $table->text('internships')->nullable()->after('certifications');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_monthly_recommendations', function (Blueprint $table) {
            $table->dropColumn(['certifications', 'internships']);
        });
    }
};
