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
        Schema::table('users', function (Blueprint $table) {
            // Identity fields from SAML
            $table->string('identity', 50)->nullable()->after('employee_id'); // National ID or Iqama
            $table->string('identity_type', 30)->nullable()->after('identity'); // national_id, iqama, etc.
            
            // Store all SAML roles as JSON
            $table->json('saml_roles')->nullable()->after('role');
            
            // Add index for identity
            $table->index('identity');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['identity']);
            $table->dropColumn([
                'identity',
                'identity_type',
                'saml_roles',
            ]);
        });
    }
};

