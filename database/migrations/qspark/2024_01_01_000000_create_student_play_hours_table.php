<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('student_play_hours', function (Blueprint $table) {
            $table->id();
            $table->string('student_id'); // QU student ID
            $table->date('play_date');
            $table->integer('minutes_played')->default(0);
            $table->timestamps();
            
            $table->unique(['student_id', 'play_date']);
            $table->index('student_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('student_play_hours');
    }
};