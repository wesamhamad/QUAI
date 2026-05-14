<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('admin_students_cache', 'faculty_no')) {
            return;
        }

        Schema::table('admin_students_cache', function (Blueprint $table) {
            $table->string('faculty_no', 50)->nullable()->index()->after('course_name');
            $table->string('faculty_name')->nullable()->after('faculty_no');
            $table->string('major_no', 50)->nullable()->index()->after('faculty_name');
            $table->string('major_name')->nullable()->after('major_no');
            $table->string('dept_no', 50)->nullable()->index()->after('major_name');
            $table->string('dept_name')->nullable()->after('dept_no');

            $table->index(['semester', 'faculty_no']);
            $table->index(['semester', 'major_no']);
            $table->index(['semester', 'dept_no']);
        });
    }

    public function down(): void
    {
        if (!Schema::hasColumn('admin_students_cache', 'faculty_no')) {
            return;
        }

        Schema::table('admin_students_cache', function (Blueprint $table) {
            $table->dropIndex(['semester', 'faculty_no']);
            $table->dropIndex(['semester', 'major_no']);
            $table->dropIndex(['semester', 'dept_no']);
            $table->dropColumn([
                'faculty_no',
                'faculty_name',
                'major_no',
                'major_name',
                'dept_no',
                'dept_name'
            ]);
        });
    }
};
