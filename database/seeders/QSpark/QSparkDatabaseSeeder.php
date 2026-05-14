<?php

namespace Database\Seeders\QSpark;

use Illuminate\Database\Seeder;

class QSparkDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            DemoDataSeeder::class,
        ]);
    }
}
