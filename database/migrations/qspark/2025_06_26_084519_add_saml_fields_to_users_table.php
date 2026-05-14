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
            $table->uuid('uuid')->nullable()->after('id');
            $table->string('employee_id')->nullable()->after('uuid');
            $table->string('arabic_first_name')->nullable();
            $table->string('arabic_father_name')->nullable();
            $table->string('arabic_grand_father_name')->nullable();
            $table->string('arabic_family_name')->nullable();
            $table->string('arabic_full_name')->nullable();
            $table->string('english_first_name')->nullable();
            $table->string('english_father_name')->nullable();
            $table->string('english_grand_father_name')->nullable();
            $table->string('english_family_name')->nullable();
            $table->string('english_full_name')->nullable();
            $table->string('mobile')->nullable();
            $table->string('username')->after('email')->nullable(); // أو اجعلها غير nullable إذا شرط أساسي
            $table->string('role')->nullable();
            $table->boolean('loggedin_via_nafath')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'uuid', 'employee_id',
                'arabic_first_name', 'arabic_father_name', 'arabic_grand_father_name', 'arabic_family_name', 'arabic_full_name',
                'english_first_name', 'english_father_name', 'english_grand_father_name', 'english_family_name', 'english_full_name',
                'mobile', 'username', 'role', 'loggedin_via_nafath',
            ]);
        });
    }
};
