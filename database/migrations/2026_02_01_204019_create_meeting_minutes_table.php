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
        Schema::create('meeting_minutes', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('voice_call_id')->nullable();
            $table->uuid('conversation_id')->nullable();
            $table->string('title');
            $table->text('transcription')->nullable(); // النص المفرغ من الصوت
            $table->longText('ai_summary')->nullable(); // ملخص الذكاء الاصطناعي
            $table->json('attendees')->nullable(); // الحضور
            $table->json('action_items')->nullable(); // بنود العمل
            $table->json('decisions')->nullable(); // القرارات
            $table->string('audio_file_path')->nullable(); // مسار ملف الصوت
            $table->string('document_path')->nullable(); // مسار ملف DOCX
            $table->string('signature_image_path')->nullable(); // مسار صورة التوقيع
            $table->string('status')->default('draft'); // draft, transcribing, completed, sent
            $table->string('recipient_email')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('voice_call_id')
                  ->references('id')
                  ->on('voice_calls')
                  ->onDelete('set null');

            $table->foreign('conversation_id')
                  ->references('id')
                  ->on('conversations')
                  ->onDelete('set null');

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('meeting_minutes');
    }
};
