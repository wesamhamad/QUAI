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
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->nullable()->unique()->after('id');
            $table->string('employee_id')->nullable()->after('username');
            $table->string('identity')->nullable()->after('employee_id');
            $table->string('mobile')->nullable()->after('identity');
            $table->string('user_type')->nullable()->after('mobile');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['username', 'employee_id', 'identity', 'mobile', 'user_type']);
        });
    }
};
