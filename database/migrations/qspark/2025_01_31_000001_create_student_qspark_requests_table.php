<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_qspark_requests', function (Blueprint $table) {
            $table->id();
            $table->string('student_id');
            $table->unsignedBigInteger('qspark_id');
            $table->string('duration_unit');
            $table->integer('duration');
            $table->date('start_at');
            $table->date('finish_at');
            $table->string('attachments')->nullable();
            $table->string('status');
            $table->text('notes')->nullable();
            $table->timestamp('deleted_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_qspark_requests');
    }
};