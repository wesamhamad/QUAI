<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_visits', function (Blueprint $table) {
            $table->id();
            $table->date('visit_date');
            $table->unsignedInteger('visits_count')->default(0);
            $table->timestamps();
            
            $table->unique('visit_date');
            $table->index('visit_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_visits');
    }
};