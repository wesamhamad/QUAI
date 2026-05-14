<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // sqlite (used by the demo clone) stores enums as plain TEXT, so no
        // ALTER is needed there. On MySQL/MariaDB expand the enum the usual way.
        if (DB::getDriverName() === 'sqlite') {
            return;
        }
        DB::statement("ALTER TABLE review_sources MODIFY COLUMN platform ENUM('google_play', 'app_store', 'google_maps', 'reddit', 'news', 'social_media', 'youtube', 'manual') NOT NULL");
        DB::statement("ALTER TABLE reviews MODIFY COLUMN platform ENUM('google_play', 'app_store', 'google_maps', 'reddit', 'news', 'social_media', 'youtube', 'manual') NOT NULL");
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'sqlite') {
            return;
        }
        DB::statement("ALTER TABLE review_sources MODIFY COLUMN platform ENUM('google_play', 'app_store', 'google_maps', 'reddit', 'news') NOT NULL");
        DB::statement("ALTER TABLE reviews MODIFY COLUMN platform ENUM('google_play', 'app_store', 'google_maps', 'reddit', 'news') NOT NULL");
    }
};
