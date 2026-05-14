<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('clude_agents', function (Blueprint $table) {
            $table->string('type')->default('general')->after('user_id')->index();
            $table->string('college_code')->nullable()->after('type');
        });
    }

    public function down(): void
    {
        Schema::table('clude_agents', function (Blueprint $table) {
            $table->dropIndex(['type']);
            $table->dropColumn(['type', 'college_code']);
        });
    }
};
