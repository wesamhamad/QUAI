<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_model_assignments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('service'); // chat, training_bag, meeting_minutes, qu_agent
            $table->foreignUuid('ai_model_id')->constrained('ai_models')->cascadeOnDelete();
            $table->boolean('is_default')->default(false);
            $table->json('options')->nullable(); // temperature, max_tokens, timeout overrides
            $table->timestamps();

            $table->unique(['service', 'ai_model_id']);
            $table->index('service');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_model_assignments');
    }
};
