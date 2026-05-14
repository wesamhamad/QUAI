<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_evaluation_summaries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedInteger('service_rank'); // ترتيب الخدمة
            $table->string('service_name');
            $table->unsignedInteger('very_satisfied')->default(0);  // 😊 أخضر
            $table->unsignedInteger('satisfied')->default(0);       // 🙂 أخضر فاتح
            $table->unsignedInteger('neutral')->default(0);         // 😐 برتقالي
            $table->unsignedInteger('dissatisfied')->default(0);    // 😞 أحمر
            $table->unsignedInteger('total')->default(0);
            $table->decimal('satisfaction_rate', 5, 2)->default(0); // نسبة الرضا
            $table->timestamps();

            $table->index('service_rank');
            $table->index('total');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_evaluation_summaries');
    }
};
