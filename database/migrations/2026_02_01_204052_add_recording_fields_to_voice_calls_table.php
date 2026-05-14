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
        Schema::table('voice_calls', function (Blueprint $table) {
            $table->boolean('is_recording')->default(false);
            $table->string('recording_path')->nullable();
            $table->timestamp('recording_started_at')->nullable();
            $table->timestamp('recording_ended_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('voice_calls', function (Blueprint $table) {
            $table->dropColumn(['is_recording', 'recording_path', 'recording_started_at', 'recording_ended_at']);
        });
    }
};
