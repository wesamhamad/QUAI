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
        // جدول للصلاحيات المباشرة للمستخدم (override)
        // يمكن إعطاء صلاحية إضافية أو سحب صلاحية من مستخدم معين
        Schema::create('permission_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('permission_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['grant', 'revoke'])->default('grant'); // grant = إعطاء، revoke = سحب
            $table->timestamp('assigned_at')->useCurrent();
            $table->foreignId('assigned_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('reason')->nullable(); // سبب الإعطاء/السحب
            
            // منع تكرار نفس الصلاحية للمستخدم
            $table->unique(['user_id', 'permission_id']);
            
            $table->index('user_id');
            $table->index('permission_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permission_user');
    }
};

