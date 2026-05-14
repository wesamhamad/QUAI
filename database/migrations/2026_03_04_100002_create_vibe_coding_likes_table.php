<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vibe_coding_likes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->uuid('app_id');
            $table->timestamps();

            $table->foreign('app_id')
                  ->references('id')
                  ->on('vibe_coding_apps')
                  ->onDelete('cascade');

            $table->unique(['user_id', 'app_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vibe_coding_likes');
    }
};
