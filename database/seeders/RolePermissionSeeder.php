<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Demo build — only three feature areas + admin panel access.
        $permissions = [
            'access_admin_panel',
            'view_users',
            'manage_users',
            'manage_roles',
            'view_qmentor',
            'view_qspark',
            'view_digital_record',
            'view_student_records',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Super Admin — kept for legacy code paths; gets every permission.
        $superAdmin = Role::firstOrCreate(['name' => 'Super Admin']);
        $superAdmin->syncPermissions(Permission::all());

        // Admin — full demo access including admin panel and student records.
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $admin->syncPermissions([
            'access_admin_panel', 'view_users', 'manage_users', 'manage_roles',
            'view_qmentor', 'view_qspark', 'view_digital_record', 'view_student_records',
        ]);

        // Faculty — can browse any student across the three apps.
        $faculty = Role::firstOrCreate(['name' => 'Faculty']);
        $faculty->syncPermissions([
            'view_qmentor', 'view_qspark', 'view_digital_record', 'view_student_records',
        ]);

        // Student — own data only.
        $student = Role::firstOrCreate(['name' => 'Student']);
        $student->syncPermissions([
            'view_qmentor', 'view_qspark', 'view_digital_record',
        ]);

        // Assign Super Admin to w.aljuraysh
        $admin = User::where('username', 'like', '%aljuraysh%')
            ->orWhere('email', 'like', '%aljuraysh%')
            ->first();

        if ($admin) {
            $admin->syncRoles('Super Admin');
            $this->command?->info("Assigned Super Admin to: {$admin->username} ({$admin->email})");
        } else {
            $this->command?->warn('User w.aljuraysh not found — creating with Super Admin role.');
            $admin = User::create([
                'username' => 'w.aljuraysh',
                'name' => 'Wesam Aljuraysh',
                'email' => 'w.aljuraysh@qu.edu.sa',
            ]);
            $admin->assignRole('Super Admin');
            $this->command?->info("Created w.aljuraysh as Super Admin.");
        }
    }
}
