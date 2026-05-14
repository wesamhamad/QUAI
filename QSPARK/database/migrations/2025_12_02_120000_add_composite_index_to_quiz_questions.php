<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Adds composite index for optimized question loading by attachment and difficulty
     */
    public function up(): void
    {
        Schema::table('quiz_questions', function (Blueprint $table) {
            // Composite index for faster queries when filtering by attachment_key and difficulty
            $table->index(['attachment_key', 'difficulty'], 'idx_attachment_difficulty');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quiz_questions', function (Blueprint $table) {
            $table->dropIndex('idx_attachment_difficulty');
        });
    }
};

