<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('saml_message_ids', function (Blueprint $table) {
            $table->string('username')->nullable()->after('message_id');
            $table->index(['username', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('saml_message_ids', function (Blueprint $table) {
            $table->dropIndex(['username', 'created_at']);
            $table->dropColumn('username');
        });
    }
};