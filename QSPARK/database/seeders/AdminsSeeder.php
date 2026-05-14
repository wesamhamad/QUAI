<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminUsernames = [
            'w.aljuraysh',
        ];

        foreach ($adminUsernames as $username) {
            $user = User::where('username', $username)->first();

            if (!$user) {
                $this->command->warn("Admin user '{$username}' not found yet; skipping. Will be assigned the admin role on the next seed after their first SAML login.");
                continue;
            }

            $user->assignRole('admin');
            if ($user->role !== 'admin') {
                $user->forceFill(['role' => 'admin'])->save();
            }
            $this->command->info("Admin role assigned to {$username}.");
        }
    }
}
