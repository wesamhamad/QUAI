<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanupSamlMessageIds extends Command
{
    protected $signature = 'saml:cleanup-message-ids';
    protected $description = 'Clean up old SAML message IDs';

    public function handle()
    {
        $deleted = DB::table('saml_message_ids')
            ->where('created_at', '<', now()->subHours(24))
            ->delete();
            
        $this->info("Deleted {$deleted} old SAML message IDs");
    }
}