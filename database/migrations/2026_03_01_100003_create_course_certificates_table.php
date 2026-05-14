<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_certificates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->uuid('training_bag_id');
            $table->foreign('training_bag_id')->references('id')->on('training_bags')->cascadeOnDelete();
            $table->string('verification_code', 20)->unique();
            $table->string('student_name');
            $table->string('course_title');
            $table->unsignedSmallInteger('overall_score');
            $table->timestamp('issued_at');
            $table->timestamps();

            $table->unique(['user_id', 'training_bag_id']);
            $table->index('verification_code');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_certificates');
    }
};
