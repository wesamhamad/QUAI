<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ShowConfigCommand extends Command
{
    protected $signature = 'config:debug';
    protected $description = 'Show current session and cache configuration';

    public function handle()
    {
        $this->info('=== Configuration Debug ===');
        $this->newLine();
        
        $this->info('Session Configuration:');
        $this->line('  Driver: ' . config('session.driver'));
        $this->line('  Lifetime: ' . config('session.lifetime') . ' minutes');
        $this->line('  Table: ' . config('session.table'));
        $this->line('  Store: ' . config('session.store'));
        $this->newLine();
        
        $this->info('Cache Configuration:');
        $this->line('  Default: ' . config('cache.default'));
        $this->line('  Prefix: ' . config('cache.prefix'));
        $this->newLine();
        
        $this->info('Environment Variables:');
        $this->line('  SESSION_DRIVER: ' . env('SESSION_DRIVER', 'not set'));
        $this->line('  CACHE_STORE: ' . env('CACHE_STORE', 'not set'));
        $this->line('  APP_ENV: ' . env('APP_ENV'));
        
        return 0;
    }
}