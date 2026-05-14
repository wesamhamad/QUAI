<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('api_call_logs', function (Blueprint $table) {
            $table->string('model_name', 100)->nullable()->after('response_size');
            $table->unsignedInteger('prompt_tokens')->default(0)->after('model_name');
            $table->unsignedInteger('completion_tokens')->default(0)->after('prompt_tokens');
            $table->unsignedInteger('total_tokens')->default(0)->after('completion_tokens');
            $table->decimal('tokens_per_sec', 8, 1)->default(0)->after('total_tokens');

            $table->index('model_name');
            $table->index(['created_at', 'model_name']);
        });
    }

    public function down(): void
    {
        Schema::table('api_call_logs', function (Blueprint $table) {
            $table->dropIndex(['model_name']);
            $table->dropIndex(['created_at', 'model_name']);
            $table->dropColumn(['model_name', 'prompt_tokens', 'completion_tokens', 'total_tokens', 'tokens_per_sec']);
        });
    }
};
