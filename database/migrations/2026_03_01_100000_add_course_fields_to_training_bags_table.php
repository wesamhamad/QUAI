<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('training_bags', function (Blueprint $table) {
            $table->boolean('is_published')->default(false)->after('share_token');
            $table->string('thumbnail_gradient', 100)->nullable()->after('is_published');
            $table->unsignedSmallInteger('chapter_count')->nullable()->after('thumbnail_gradient');
            $table->unsignedSmallInteger('quiz_count')->nullable()->after('chapter_count');
            $table->unsignedInteger('enrollment_count')->default(0)->after('quiz_count');
            $table->string('category', 50)->nullable()->after('enrollment_count');
            $table->string('difficulty_level', 20)->nullable()->after('category');
            $table->unsignedInteger('estimated_minutes')->nullable()->after('difficulty_level');

            $table->index('is_published');
            $table->index('category');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::table('training_bags', function (Blueprint $table) {
            $table->dropIndex(['is_published']);
            $table->dropIndex(['category']);
            $table->dropIndex(['created_at']);

            $table->dropColumn([
                'is_published',
                'thumbnail_gradient',
                'chapter_count',
                'quiz_count',
                'enrollment_count',
                'category',
                'difficulty_level',
                'estimated_minutes',
            ]);
        });
    }
};
