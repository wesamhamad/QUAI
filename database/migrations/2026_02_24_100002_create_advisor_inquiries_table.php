<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('advisor_inquiries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->uuid('conversation_id')->nullable();
            $table->string('category');
            $table->string('subject');
            $table->text('description');
            $table->string('student_id');
            $table->string('student_name');
            $table->string('college')->nullable();
            $table->string('department')->nullable();
            $table->string('status')->default('pending');
            $table->text('advisor_response')->nullable();
            $table->json('attachments')->nullable();
            $table->json('conversation_summary')->nullable();
            $table->timestamps();

            $table->foreign('conversation_id')
                  ->references('id')
                  ->on('advisor_conversations')
                  ->onDelete('set null');

            $table->index(['user_id', 'status']);
            $table->index('student_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('advisor_inquiries');
    }
};
