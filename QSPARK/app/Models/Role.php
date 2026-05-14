<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    protected $fillable = [
        'name',
        'display_name_ar',
        'display_name_en',
        'description',
        'level',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'level' => 'integer',
    ];

    // ============================================
    // الثوابت
    // ============================================
    public const ADMIN = 'admin';
    public const FACULTY = 'faculty';
    public const STUDENT = 'student';

    // ============================================
    // العلاقات
    // ============================================
    
    /**
     * المستخدمون الذين لديهم هذا الدور
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_user')
            ->withPivot('assigned_at', 'assigned_by');
    }

    /**
     * الصلاحيات المرتبطة بهذا الدور
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'permission_role');
    }

    // ============================================
    // الدوال المساعدة
    // ============================================
    
    /**
     * إعطاء صلاحية للدور
     */
    public function givePermission(Permission|string $permission): void
    {
        if (is_string($permission)) {
            $permission = Permission::where('name', $permission)->firstOrFail();
        }
        
        $this->permissions()->syncWithoutDetaching($permission->id);
    }

    /**
     * سحب صلاحية من الدور
     */
    public function revokePermission(Permission|string $permission): void
    {
        if (is_string($permission)) {
            $permission = Permission::where('name', $permission)->firstOrFail();
        }
        
        $this->permissions()->detach($permission->id);
    }

    /**
     * التحقق من وجود صلاحية
     */
    public function hasPermission(string $permissionName): bool
    {
        return $this->permissions()->where('name', $permissionName)->exists();
    }

    /**
     * مزامنة الصلاحيات
     */
    public function syncPermissions(array $permissions): void
    {
        $permissionIds = Permission::whereIn('name', $permissions)->pluck('id');
        $this->permissions()->sync($permissionIds);
    }

    // ============================================
    // Scopes
    // ============================================
    
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
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
}

