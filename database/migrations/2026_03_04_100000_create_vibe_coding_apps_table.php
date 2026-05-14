<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vibe_coding_apps', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['web', 'python'])->default('web');
            $table->longText('code')->nullable();
            $table->json('files')->nullable();
            $table->string('share_token')->unique()->nullable();
            $table->enum('visibility', ['private', 'public'])->default('private');
            $table->boolean('is_published')->default(false);
            $table->string('thumbnail_gradient')->nullable();
            $table->string('category')->nullable();
            $table->integer('like_count')->default(0);
            $table->integer('view_count')->default(0);
            $table->integer('fork_count')->default(0);
            $table->uuid('forked_from')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'created_at']);
            $table->index(['visibility', 'is_published', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vibe_coding_apps');
    }
};
