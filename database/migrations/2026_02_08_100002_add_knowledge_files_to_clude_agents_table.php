<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clude_agents', function (Blueprint $table) {
            $table->json('knowledge_files')->nullable()->after('best_practices');
        });
    }

    public function down(): void
    {
        Schema::table('clude_agents', function (Blueprint $table) {
            $table->dropColumn('knowledge_files');
        });
    }
};
