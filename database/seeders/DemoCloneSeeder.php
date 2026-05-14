<?php

namespace Database\Seeders;

use App\Models\User;
use App\Support\DemoData;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Demo build seeder. Creates one Super Admin + one Admin + one Faculty plus a
 * User record per student in {@see DemoData::students()}. Every account shares
 * the password "password" so logging in for the demo is trivial.
 */
class DemoCloneSeeder extends Seeder
{
    public function run(): void
    {
        $this->command?->info('Seeding demo users…');

        // Roles must exist first.
        $this->call(RolePermissionSeeder::class);

        $this->makeUser('w.aljuraysh', 'وسام عبدالله الجريش', 'Super Admin', 'staff');
        $this->makeUser('admin',       'هدى محمد العبدالعزيز',   'Admin',       'staff');
        $this->makeUser('faculty',     'د. عبدالعزيز محمد القحطاني', 'Faculty', 'staff');

        foreach (DemoData::students() as $s) {
            $username = 'student.' . substr($s['student_id'], -4);
            $this->makeUser($username, $s['name'], 'Student', 'student', $s['student_id']);
        }

        $this->command?->info('Demo users ready — ' . User::count() . ' total.');
    }

    private function makeUser(string $username, string $name, string $role, string $type, ?string $studentId = null): User
    {
        $user = User::firstOrCreate(
            ['username' => $username],
            [
                'name'              => $name,
                'email'             => $username . '@qu.edu.sa',
                'password'          => Hash::make('password'),
                'user_type'         => $type,
                'employee_id'       => $type === 'student' ? null : (string) random_int(40000, 49999),
                'student_id'        => $studentId,
                'identity'          => '1' . random_int(100000000, 999999999),
                'mobile'            => '05' . random_int(10000000, 99999999),
                'email_verified_at' => now(),
            ]
        );

        if (!$user->hasRole($role)) {
            $user->syncRoles($role);
        }

        return $user;
    }
}
