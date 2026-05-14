<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SyncFacultyData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'faculty:sync {instructor_id?} {--all}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync faculty data from Oracle to local cache';

    /**
     * Execute the console command.
     *
     * Disabled: SISService faculty methods now call qu-api v3 using the user
     * session JWT, which is not available in console context. Re-enable once
     * a service-mode token (or equivalent) is wired up.
     */
    public function handle()
    {
        $this->error('faculty:sync is currently unavailable.');
        $this->line('SISService faculty methods now call qu-api v3 with the user session JWT,');
        $this->line('which is not present in console context. Run the sync from a web request,');
        $this->line('or restore a service-mode token before re-enabling.');

        return 1;
    }
}

