<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clude_agents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('role');
            $table->string('knowledge_strategy');
            $table->string('language')->default('ar');
            $table->string('model');
            $table->text('system_prompt')->nullable();
            $table->json('best_practices')->nullable();
            $table->string('status')->default('active');
            $table->string('share_token')->unique();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('clude_agents');
    }
};
