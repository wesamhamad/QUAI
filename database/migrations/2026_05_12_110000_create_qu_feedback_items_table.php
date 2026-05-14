<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('qu_feedback_items', function (Blueprint $table) {
            // The API id is the authoritative identifier — mirror it as PK so
            // upserts are idempotent and the source-of-truth link is obvious.
            $table->unsignedBigInteger('id')->primary();
            $table->string('sub', 64)->nullable()->index();
            $table->string('display_name')->nullable();
            $table->text('body');
            $table->string('status', 32)->index();
            $table->string('admin_tag', 32)->nullable()->index();
            $table->text('note')->nullable();
            $table->unsignedInteger('reactions_count')->default(0);
            $table->unsignedInteger('reports_count')->default(0);
            $table->json('reactions')->nullable();
            $table->json('reports')->nullable();
            $table->timestamp('remote_created_at')->nullable()->index();
            $table->timestamp('remote_updated_at')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->boolean('is_demo')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('qu_feedback_items');
    }
};
