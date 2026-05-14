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
            // إضافة علاقات للجداول المرجعية
            $table->foreignId('faculty_id')->nullable()->after('role')->constrained('faculties')->onDelete('set null');
            $table->foreignId('department_id')->nullable()->after('faculty_id')->constrained('departments')->onDelete('set null');
            
            // حقول إضافية مفيدة
            $table->boolean('is_active')->default(true)->after('department_id');
            $table->timestamp('last_login_at')->nullable()->after('is_active');
            $table->string('last_login_ip', 45)->nullable()->after('last_login_at');
            $table->string('preferred_language', 5)->default('ar')->after('last_login_ip');
            
            // فهارس
            $table->index('faculty_id');
            $table->index('department_id');
            $table->index('is_active');
            $table->index('last_login_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['faculty_id']);
            $table->dropForeign(['department_id']);
            $table->dropColumn([
                'faculty_id',
                'department_id',
                'is_active',
                'last_login_at',
                'last_login_ip',
                'preferred_language',
            ]);
        });
    }
};

