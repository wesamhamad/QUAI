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
        Schema::table('oracle_students_cache', function (Blueprint $table) {
            $table->string('faculty_no', 50)->nullable()->after('student_name');
            $table->string('faculty_name')->nullable()->after('faculty_no');
            $table->string('major_no', 50)->nullable()->after('faculty_name');
            $table->string('major_name')->nullable()->after('major_no');
            $table->decimal('absence_percent', 5, 2)->nullable()->after('gpa');
            $table->integer('total_absences')->nullable()->after('absence_percent');

            // Add indexes
            $table->index(['semester', 'faculty_no']);
            $table->index(['semester', 'major_no']);
            $table->index(['semester', 'absence_percent']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('oracle_students_cache', function (Blueprint $table) {
            $table->dropIndex(['semester', 'faculty_no']);
            $table->dropIndex(['semester', 'major_no']);
            $table->dropIndex(['semester', 'absence_percent']);
            $table->dropColumn(['faculty_no', 'faculty_name', 'major_no', 'major_name', 'absence_percent', 'total_absences']);
        });
    }
};
