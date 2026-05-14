<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->text('university_api_token')->nullable()->after('student_id');
            $table->timestamp('university_api_token_expires_at')->nullable()->after('university_api_token');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['university_api_token', 'university_api_token_expires_at']);
        });
    }
};
