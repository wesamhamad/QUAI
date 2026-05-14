<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{
    protected $fillable = [
        'name',
        'display_name_ar',
        'display_name_en',
        'group',
        'description',
    ];

    // ============================================
    // ثوابت الصلاحيات
    // ============================================
    
    // صلاحيات الطلاب
    public const VIEW_STUDENTS = 'view_students';
    public const VIEW_OWN_STUDENTS = 'view_own_students';
    public const EDIT_STUDENTS = 'edit_students';
    public const DELETE_STUDENTS = 'delete_students';
    
    // صلاحيات الدرجات
    public const VIEW_GRADES = 'view_grades';
    public const EDIT_GRADES = 'edit_grades';
    
    // صلاحيات التقارير
    public const VIEW_REPORTS = 'view_reports';
    public const EXPORT_REPORTS = 'export_reports';
    public const VIEW_ANALYTICS = 'view_analytics';
    
    // صلاحيات الألعاب
    public const PLAY_GAMES = 'play_games';
    public const GENERATE_QUESTIONS = 'generate_questions';
    
    // صلاحيات الملف الشخصي
    public const VIEW_OWN_PROFILE = 'view_own_profile';
    public const EDIT_OWN_PROFILE = 'edit_own_profile';
    public const VIEW_RECOMMENDATIONS = 'view_recommendations';
    
    // صلاحيات إدارية
    public const MANAGE_USERS = 'manage_users';
    public const MANAGE_ROLES = 'manage_roles';
    public const MANAGE_SETTINGS = 'manage_settings';
    public const VIEW_SYSTEM_LOGS = 'view_system_logs';
    public const SYNC_DATA = 'sync_data';

    // ============================================
    // العلاقات
    // ============================================
    
    /**
     * الأدوار التي تملك هذه الصلاحية
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'permission_role');
    }

    /**
     * المستخدمون الذين لديهم هذه الصلاحية مباشرة
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'permission_user')
            ->withPivot('type', 'assigned_at', 'assigned_by', 'reason');
    }

    // ============================================
    // Scopes
    // ============================================
    
    public function scopeByGroup($query, string $group)
    {
        return $query->where('group', $group);
    }

    public function scopeByName($query, string $name)
    {
        return $query->where('name', $name);
    }

    // ============================================
    // Static Methods
    // ============================================
    
    public static function findByName(string $name): ?self
    {
        return static::where('name', $name)->first();
    }

    /**
     * الحصول على جميع الصلاحيات مجمعة حسب المجموعة
     */
    public static function getAllGrouped(): array
    {
        return static::all()->groupBy('group')->toArray();
    }
}

