<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clude_agent_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('agent_id');
            $table->string('session_id');
            $table->string('role');
            $table->text('content');
            $table->integer('tokens_used')->nullable();
            $table->integer('response_time_ms')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')
                  ->references('id')
                  ->on('clude_agents')
                  ->onDelete('cascade');

            $table->index('session_id');
            $table->index(['agent_id', 'session_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clude_agent_messages');
    }
};
