<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_evaluations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamp('evaluation_date');
            $table->unsignedBigInteger('evaluation_seq');
            $table->unsignedInteger('request_type');
            $table->string('request_desc');
            $table->unsignedTinyInteger('evaluation_category'); // 1=غير راضي, 2=محايد, 3=راضي
            $table->unsignedBigInteger('evaluated_by');
            $table->string('email')->nullable();
            $table->string('mobile_no')->nullable();
            $table->string('emp_name')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('evaluation_date');
            $table->index('request_desc');
            $table->index('evaluation_category');
            $table->index('evaluated_by');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_evaluations');
    }
};
