<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('advisor_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('conversation_id');
            $table->string('role');
            $table->text('content');
            $table->integer('tokens_used')->nullable();
            $table->integer('response_time_ms')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('conversation_id')
                  ->references('id')
                  ->on('advisor_conversations')
                  ->onDelete('cascade');

            $table->index(['conversation_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('advisor_messages');
    }
};
