<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ai_models', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('provider_id')->constrained('ai_providers')->cascadeOnDelete();
            $table->string('model_id'); // e.g. "gpt-4o", "iKhalid/ALLaM:7b"
            $table->string('display_name');
            $table->string('status')->default('available'); // available, downloading, error, deleted
            $table->unsignedBigInteger('size_bytes')->nullable();
            $table->string('family')->nullable();
            $table->string('quantization')->nullable();
            $table->json('capabilities')->nullable(); // ["chat","completion","vision","embeddings"]
            $table->json('metadata')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['provider_id', 'model_id']);
            $table->index('status');
            $table->index('is_enabled');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_models');
    }
};
