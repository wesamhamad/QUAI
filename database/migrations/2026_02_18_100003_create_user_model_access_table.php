<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_model_access', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('ai_model_id')->constrained('ai_models')->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $table->boolean('all_users')->default(false);
            $table->timestamps();

            $table->unique(['ai_model_id', 'user_id']);
            $table->index('ai_model_id');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_model_access');
    }
};
