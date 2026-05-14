<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('market_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('source', 32)->index();           // 'google_jobs', 'linkedin', etc.
            $table->string('source_id', 191)->nullable();    // platform-specific id when available
            $table->string('title');
            $table->string('company')->nullable();
            $table->string('location')->nullable();
            $table->string('query', 191)->index();           // the skill/keyword we searched for
            $table->text('description')->nullable();
            $table->json('skills')->nullable();              // skills extracted from description
            $table->string('url', 1024)->nullable();
            $table->timestamp('posted_at')->nullable();
            $table->timestamp('scraped_at')->index();
            $table->timestamps();

            $table->unique(['source', 'source_id'], 'market_jobs_source_id_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('market_jobs');
    }
};
