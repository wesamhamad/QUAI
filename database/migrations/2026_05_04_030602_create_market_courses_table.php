<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('market_courses', function (Blueprint $table) {
            $table->id();
            $table->string('platform', 32)->index();         // 'coursera', 'udemy', 'misk', 'edx'
            $table->string('platform_id', 191)->nullable();
            $table->string('title');
            $table->string('provider')->nullable();          // institution / instructor
            $table->string('query', 191)->index();           // the skill/keyword we searched for
            $table->string('language', 16)->nullable();
            $table->decimal('rating', 3, 2)->nullable();
            $table->unsignedInteger('students')->nullable();
            $table->string('url', 1024)->nullable();
            $table->text('description')->nullable();
            $table->timestamp('scraped_at')->index();
            $table->timestamps();

            $table->unique(['platform', 'platform_id'], 'market_courses_platform_id_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('market_courses');
    }
};
