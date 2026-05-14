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
        Schema::table('conversations', function (Blueprint $table) {
            $table->boolean('is_voice_enabled')->default(false)->after('metadata');
            $table->string('participant_1_session_id')->nullable()->index()->after('is_voice_enabled');
            $table->string('participant_2_session_id')->nullable()->index()->after('participant_1_session_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('conversations', function (Blueprint $table) {
            $table->dropColumn(['is_voice_enabled', 'participant_1_session_id', 'participant_2_session_id']);
        });
    }
};
