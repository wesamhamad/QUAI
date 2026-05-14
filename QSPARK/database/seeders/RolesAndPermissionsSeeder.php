<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ============================================
        // إنشاء الصلاحيات
        // ============================================
        
        $permissions = [
            // صلاحيات الطلاب
            ['name' => 'view_students', 'display_name_ar' => 'عرض جميع الطلاب', 'display_name_en' => 'View All Students', 'group' => 'students'],
            ['name' => 'view_own_students', 'display_name_ar' => 'عرض طلابي', 'display_name_en' => 'View Own Students', 'group' => 'students'],
            ['name' => 'edit_students', 'display_name_ar' => 'تعديل الطلاب', 'display_name_en' => 'Edit Students', 'group' => 'students'],
            ['name' => 'delete_students', 'display_name_ar' => 'حذف الطلاب', 'display_name_en' => 'Delete Students', 'group' => 'students'],
            
            // صلاحيات الدرجات
            ['name' => 'view_grades', 'display_name_ar' => 'عرض الدرجات', 'display_name_en' => 'View Grades', 'group' => 'grades'],
            ['name' => 'edit_grades', 'display_name_ar' => 'تعديل الدرجات', 'display_name_en' => 'Edit Grades', 'group' => 'grades'],
            
            // صلاحيات التقارير
            ['name' => 'view_reports', 'display_name_ar' => 'عرض التقارير', 'display_name_en' => 'View Reports', 'group' => 'reports'],
            ['name' => 'export_reports', 'display_name_ar' => 'تصدير التقارير', 'display_name_en' => 'Export Reports', 'group' => 'reports'],
            ['name' => 'view_analytics', 'display_name_ar' => 'عرض التحليلات', 'display_name_en' => 'View Analytics', 'group' => 'reports'],
            
            // صلاحيات الألعاب
            ['name' => 'play_games', 'display_name_ar' => 'لعب الألعاب', 'display_name_en' => 'Play Games', 'group' => 'games'],
            ['name' => 'generate_questions', 'display_name_ar' => 'توليد الأسئلة', 'display_name_en' => 'Generate Questions', 'group' => 'games'],
            
            // صلاحيات الملف الشخصي
            ['name' => 'view_own_profile', 'display_name_ar' => 'عرض ملفي الشخصي', 'display_name_en' => 'View Own Profile', 'group' => 'profile'],
            ['name' => 'edit_own_profile', 'display_name_ar' => 'تعديل ملفي الشخصي', 'display_name_en' => 'Edit Own Profile', 'group' => 'profile'],
            ['name' => 'view_recommendations', 'display_name_ar' => 'عرض التوصيات', 'display_name_en' => 'View Recommendations', 'group' => 'profile'],
            
            // صلاحيات المقررات
            ['name' => 'view_courses', 'display_name_ar' => 'عرض المقررات', 'display_name_en' => 'View Courses', 'group' => 'courses'],
            ['name' => 'view_own_courses', 'display_name_ar' => 'عرض مقرراتي', 'display_name_en' => 'View Own Courses', 'group' => 'courses'],
            ['name' => 'manage_courses', 'display_name_ar' => 'إدارة المقررات', 'display_name_en' => 'Manage Courses', 'group' => 'courses'],
            
            // صلاحيات إدارية
            ['name' => 'manage_users', 'display_name_ar' => 'إدارة المستخدمين', 'display_name_en' => 'Manage Users', 'group' => 'admin'],
            ['name' => 'manage_roles', 'display_name_ar' => 'إدارة الأدوار', 'display_name_en' => 'Manage Roles', 'group' => 'admin'],
            ['name' => 'manage_settings', 'display_name_ar' => 'إدارة الإعدادات', 'display_name_en' => 'Manage Settings', 'group' => 'admin'],
            ['name' => 'view_system_logs', 'display_name_ar' => 'عرض سجلات النظام', 'display_name_en' => 'View System Logs', 'group' => 'admin'],
            ['name' => 'sync_data', 'display_name_ar' => 'مزامنة البيانات', 'display_name_en' => 'Sync Data', 'group' => 'admin'],
            ['name' => 'manage_faculties', 'display_name_ar' => 'إدارة الكليات', 'display_name_en' => 'Manage Faculties', 'group' => 'admin'],
            ['name' => 'manage_departments', 'display_name_ar' => 'إدارة الأقسام', 'display_name_en' => 'Manage Departments', 'group' => 'admin'],
        ];

        foreach ($permissions as $permData) {
            Permission::updateOrCreate(
                ['name' => $permData['name']],
                $permData
            );
        }

        // ============================================
        // إنشاء الأدوار
        // ============================================
        
        $roles = [
            [
                'name' => 'admin',
                'display_name_ar' => 'مدير النظام',
                'display_name_en' => 'System Administrator',
                'description' => 'صلاحيات كاملة لإدارة النظام',
                'level' => 100,
            ],
            [
                'name' => 'faculty',
                'display_name_ar' => 'عضو هيئة تدريس',
                'display_name_en' => 'Faculty Member',
                'description' => 'صلاحيات عضو هيئة التدريس',
                'level' => 50,
            ],
            [
                'name' => 'student',
                'display_name_ar' => 'طالب',
                'display_name_en' => 'Student',
                'description' => 'صلاحيات الطالب',
                'level' => 10,
            ],
        ];

        foreach ($roles as $roleData) {
            Role::updateOrCreate(
                ['name' => $roleData['name']],
                $roleData
            );
        }

        // ============================================
        // ربط الصلاحيات بالأدوار
        // ============================================
        
        $this->syncRolePermissions(
            Role::where('name', 'admin')->first(),
            Permission::pluck('id')->all()
        );

        $this->syncRolePermissions(
            Role::where('name', 'faculty')->first(),
            Permission::whereIn('name', [
                'view_own_students',
                'view_own_courses',
                'view_grades',
                'view_reports',
                'export_reports',
                'generate_questions',
                'view_own_profile',
                'edit_own_profile',
                'view_analytics',
            ])->pluck('id')->all()
        );

        $this->syncRolePermissions(
            Role::where('name', 'student')->first(),
            Permission::whereIn('name', [
                'view_own_profile',
                'edit_own_profile',
                'view_recommendations',
                'play_games',
                'view_grades',
            ])->pluck('id')->all()
        );

        $this->command->info('Roles and permissions seeded successfully.');
    }

    private function syncRolePermissions(Role $role, array $permissionIds): void
    {
        DB::table('permission_role')
            ->where('role_id', $role->id)
            ->whereNotIn('permission_id', $permissionIds ?: [0])
            ->delete();

        if (empty($permissionIds)) {
            return;
        }

        $rows = array_map(
            fn ($pid) => ['role_id' => $role->id, 'permission_id' => $pid],
            $permissionIds
        );

        DB::table('permission_role')->insertOrIgnore($rows);
    }
}

