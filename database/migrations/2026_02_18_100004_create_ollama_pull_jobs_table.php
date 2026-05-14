<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ollama_pull_jobs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('model_name');
            $table->string('status')->default('pending'); // pending, downloading, completed, failed
            $table->unsignedInteger('progress')->default(0); // 0-100
            $table->text('status_message')->nullable();
            $table->text('error_message')->nullable();
            $table->foreignId('initiated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ollama_pull_jobs');
    }
};
