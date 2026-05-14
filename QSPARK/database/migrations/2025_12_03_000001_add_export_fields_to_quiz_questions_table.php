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
        Schema::table('quiz_questions', function (Blueprint $table) {
            // Track if question has been exported (only allow export once)
            $table->timestamp('exported_at')->nullable()->after('edited_at');
            
            // Track who exported the question
            $table->string('exported_by')->nullable()->after('exported_at');
            
            // Add index for faster filtering of non-exported questions
            $table->index('exported_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quiz_questions', function (Blueprint $table) {
            $table->dropIndex(['exported_at']);
            $table->dropColumn(['exported_at', 'exported_by']);
        });
    }
};

