<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FixSessionConfigCommand extends Command
{
    protected $signature = 'config:fix-session';
    protected $description = 'Fix session driver configuration and setup database sessions';

    public function handle()
    {
        $this->info('=== Fixing Session Configuration ===');
        
        // Check if .env file exists
        $envPath = base_path('.env');
        if (!File::exists($envPath)) {
            $this->error('.env file not found!');
            return 1;
        }
        
        // Read current .env content
        $envContent = File::get($envPath);
        
        // Update SESSION_DRIVER to database
        if (strpos($envContent, 'SESSION_DRIVER=') !== false) {
            $envContent = preg_replace('/SESSION_DRIVER=.*/', 'SESSION_DRIVER=database', $envContent);
            $this->info('Updated SESSION_DRIVER to database');
        } else {
            $envContent .= "\nSESSION_DRIVER=database\n";
            $this->info('Added SESSION_DRIVER=database');
        }
        
        // Update CACHE_STORE to database if not set
        if (strpos($envContent, 'CACHE_STORE=') === false) {
            $envContent .= "CACHE_STORE=database\n";
            $this->info('Added CACHE_STORE=database');
        }
        
        // Write back to .env file
        File::put($envPath, $envContent);
        
        // Create sessions table if needed
        $this->info('Creating sessions table...');
        $this->call('session:table', ['--quiet' => true]);
        
        // Run migrations
        $this->info('Running migrations...');
        $this->call('migrate', ['--force' => true]);
        
        // Clear and cache config
        $this->info('Clearing configuration cache...');
        $this->call('config:clear');
        $this->call('cache:clear');
        $this->call('config:cache');
        
        // Show final configuration
        $this->newLine();
        $this->call('config:debug');
        
        $this->info('Session configuration fixed successfully!');
        return 0;
    }
}