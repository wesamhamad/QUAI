<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('api_call_logs', function (Blueprint $table) {
            $table->id();
            $table->string('method', 10);
            $table->string('path', 2048);
            $table->unsignedSmallInteger('status_code');
            $table->decimal('duration_ms', 10, 2);
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();
            $table->unsignedInteger('request_size')->default(0);
            $table->unsignedInteger('response_size')->default(0);
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();

            $table->index('method');
            $table->index('status_code');
            $table->index('created_at');
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('api_call_logs');
    }
};
