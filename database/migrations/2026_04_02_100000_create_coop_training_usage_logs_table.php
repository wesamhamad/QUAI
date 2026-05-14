<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('coop_training_usage_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('agent_id')->nullable();
            $table->string('session_id', 100)->nullable();
            $table->string('model')->nullable();
            $table->unsignedInteger('input_tokens')->default(0);
            $table->unsignedInteger('output_tokens')->default(0);
            $table->unsignedInteger('total_tokens')->default(0);
            $table->boolean('cache_hit')->default(false);
            $table->unsignedInteger('response_time_ms')->default(0);
            $table->string('source', 50)->default('ollama_local'); // ollama_local, semantic_cache
            $table->timestamp('created_at')->useCurrent();

            $table->index('agent_id');
            $table->index('created_at');
            $table->index('source');
            $table->index('model');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coop_training_usage_logs');
    }
};
