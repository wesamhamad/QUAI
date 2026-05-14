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
            // Learning paths and roadmaps
            $table->text('learning_paths')->nullable()->after('tips'); // JSON array of learning paths
            $table->text('weekly_plans')->nullable()->after('learning_paths'); // JSON array of weekly plans
            $table->text('goals')->nullable()->after('weekly_plans'); // JSON array of SMART goals
            
            // Strengths and weaknesses analysis
            $table->text('strengths')->nullable()->after('goals'); // JSON array of strengths
            $table->text('weaknesses')->nullable()->after('strengths'); // JSON array of weaknesses
            $table->text('improvement_areas')->nullable()->after('weaknesses'); // JSON array of areas to improve
            
            // Resources and recommendations
            $table->text('recommended_resources')->nullable()->after('improvement_areas'); // JSON array of resources
            $table->text('study_techniques')->nullable()->after('recommended_resources'); // JSON array of study techniques
            
            // Performance metrics
            $table->decimal('predicted_gpa', 3, 2)->nullable()->after('study_techniques'); // Predicted GPA for next semester
            $table->integer('completion_percentage')->default(0)->after('predicted_gpa'); // Overall completion %
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_monthly_recommendations', function (Blueprint $table) {
            $table->dropColumn([
                'learning_paths',
                'weekly_plans',
                'goals',
                'strengths',
                'weaknesses',
                'improvement_areas',
                'recommended_resources',
                'study_techniques',
                'predicted_gpa',
                'completion_percentage',
            ]);
        });
    }
};

