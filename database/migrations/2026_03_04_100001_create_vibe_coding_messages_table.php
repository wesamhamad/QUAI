<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vibe_coding_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('app_id');
            $table->string('role');
            $table->text('content');
            $table->longText('code_snapshot')->nullable();
            $table->integer('tokens_used')->nullable();
            $table->integer('response_time_ms')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('app_id')
                  ->references('id')
                  ->on('vibe_coding_apps')
                  ->onDelete('cascade');

            $table->index(['app_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vibe_coding_messages');
    }
};
