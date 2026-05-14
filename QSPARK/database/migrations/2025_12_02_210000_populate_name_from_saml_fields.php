<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Populates the 'name' column from arabic_full_name or english_full_name
     * for existing users who have these SAML fields but empty name.
     */
    public function up(): void
    {
        // Update users where name is null or empty but arabic_full_name exists
        DB::table('users')
            ->whereNull('name')
            ->orWhere('name', '')
            ->whereNotNull('arabic_full_name')
            ->where('arabic_full_name', '!=', '')
            ->update(['name' => DB::raw('arabic_full_name')]);

        // Update remaining users where name is still null but english_full_name exists
        DB::table('users')
            ->where(function ($query) {
                $query->whereNull('name')
                    ->orWhere('name', '');
            })
            ->whereNotNull('english_full_name')
            ->where('english_full_name', '!=', '')
            ->where('english_full_name', '!=', '   ') // Some records have empty spaces
            ->update(['name' => DB::raw('english_full_name')]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No need to reverse - the name column will remain populated
    }
};

