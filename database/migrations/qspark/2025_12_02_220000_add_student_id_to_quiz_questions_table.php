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
            // Add student_id to track which student generated the question
            $table->string('student_id')->nullable()->after('attachment_key')->index();
            
            // Add topic/chapter field for categorization
            $table->string('topic')->nullable()->after('type');
            
            // Add edited_by and edited_at for tracking faculty edits
            $table->string('edited_by')->nullable()->after('thread_id');
            $table->timestamp('edited_at')->nullable()->after('edited_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quiz_questions', function (Blueprint $table) {
            $table->dropColumn(['student_id', 'topic', 'edited_by', 'edited_at']);
        });
    }
};

