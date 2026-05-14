<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Collection;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name', // Standard Laravel field - auto-populated from arabic_full_name or english_full_name
        'uuid',
        'employee_id',
        'identity',
        'identity_type',
        'arabic_first_name',
        'arabic_father_name',
        'arabic_grand_father_name',
        'arabic_family_name',
        'arabic_full_name',
        'english_first_name',
        'english_father_name',
        'english_grand_father_name',
        'english_family_name',
        'english_full_name',
        'mobile',
        'email',
        'username',
        'role', // Legacy field - kept for backward compatibility
        'saml_roles', // Store all SAML roles as JSON
        'loggedin_via_nafath',
        'faculty_id',
        'department_id',
        'is_active',
        'last_login_at',
        'last_login_ip',
        'preferred_language',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'is_active' => 'boolean',
            'loggedin_via_nafath' => 'boolean',
            'saml_roles' => 'array',
        ];
    }

    // ============================================
    // العلاقات - Relations
    // ============================================

    /**
     * الأدوار المرتبطة بالمستخدم
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user')
            ->withPivot('assigned_at', 'assigned_by');
    }

    /**
     * الصلاحيات المباشرة للمستخدم (override)
     */
    public function directPermissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'permission_user')
            ->withPivot('type', 'assigned_at', 'assigned_by', 'reason');
    }

    /**
     * الكلية
     */
    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    /**
     * القسم
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * ملف الطالب
     */
    public function studentProfile(): HasOne
    {
        return $this->hasOne(StudentProfile::class);
    }

    /**
     * ملف عضو هيئة التدريس
     */
    public function instructorProfile(): HasOne
    {
        return $this->hasOne(InstructorProfile::class);
    }

    // ============================================
    // دوال الأسماء
    // ============================================

    /**
     * Get full Arabic name (constructed dynamically).
     */
    public function getFullArabicName(): string
    {
        return trim(implode(' ', array_filter([
            $this->arabic_first_name,
            $this->arabic_father_name,
            $this->arabic_grand_father_name,
            $this->arabic_family_name,
        ])));
    }

    /**
     * Get full English name (constructed dynamically).
     */
    public function getFullEnglishName(): string
    {
        return trim(implode(' ', array_filter([
            $this->english_first_name,
            $this->english_father_name,
            $this->english_grand_father_name,
            $this->english_family_name,
        ])));
    }

    // ============================================
    // دوال الأدوار - Role Methods
    // ============================================

    /**
     * Check if user is an admin (using new roles system with legacy fallback)
     */
    public function isAdmin(): bool
    {
        return $this->hasRoleByName(Role::ADMIN) || $this->role === 'admin';
    }

    /**
     * Check if user is a faculty member
     */
    public function isFaculty(): bool
    {
        return $this->hasRoleByName(Role::FACULTY) || $this->role === 'faculty';
    }

    /**
     * Check if user is a student
     */
    public function isStudent(): bool
    {
        return $this->hasRoleByName(Role::STUDENT) || $this->role === 'student';
    }

    /**
     * Check if user has a specific role by name
     */
    public function hasRoleByName(string $roleName): bool
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Check if user has a specific role (legacy support)
     */
    public function hasRole(string $role): bool
    {
        return $this->hasRoleByName($role) || $this->role === $role;
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole(array $roles): bool
    {
        // Check new system
        if ($this->roles()->whereIn('name', $roles)->exists()) {
            return true;
        }
        // Fallback to legacy
        return in_array($this->role, $roles);
    }

    /**
     * Assign a role to the user
     */
    public function assignRole(Role|string $role): void
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->firstOrFail();
        }

        $this->roles()->syncWithoutDetaching([
            $role->id => ['assigned_at' => now()]
        ]);

        // Also update legacy field with primary role
        if (!$this->role) {
            $this->update(['role' => $role->name]);
        }
    }

    /**
     * Remove a role from the user
     */
    public function removeRole(Role|string $role): void
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->first();
        }

        if ($role) {
            $this->roles()->detach($role->id);
        }
    }

    /**
     * Sync user roles
     */
    public function syncRoles(array $roles): void
    {
        $roleIds = Role::whereIn('name', $roles)->pluck('id');
        $this->roles()->sync($roleIds);

        // Update legacy field
        $this->update(['role' => $roles[0] ?? null]);
    }

    // ============================================
    // دوال الصلاحيات - Permission Methods
    // ============================================

    /**
     * Get all permissions (from roles + direct)
     */
    public function getAllPermissions(): Collection
    {
        // Get permissions from roles
        $rolePermissions = $this->roles()
            ->with('permissions')
            ->get()
            ->pluck('permissions')
            ->flatten()
            ->pluck('name');

        // Get direct granted permissions
        $grantedPermissions = $this->directPermissions()
            ->wherePivot('type', 'grant')
            ->pluck('name');

        // Get direct revoked permissions
        $revokedPermissions = $this->directPermissions()
            ->wherePivot('type', 'revoke')
            ->pluck('name');

        // Merge role + granted, then remove revoked
        return $rolePermissions
            ->merge($grantedPermissions)
            ->diff($revokedPermissions)
            ->unique();
    }

    /**
     * Check if user has a specific permission
     */
    public function hasPermission(string $permissionName): bool
    {
        // Admin has all permissions
        if ($this->isAdmin()) {
            return true;
        }

        // Check if permission is directly revoked
        $isRevoked = $this->directPermissions()
            ->where('name', $permissionName)
            ->wherePivot('type', 'revoke')
            ->exists();

        if ($isRevoked) {
            return false;
        }

        // Check if permission is directly granted
        $isGranted = $this->directPermissions()
            ->where('name', $permissionName)
            ->wherePivot('type', 'grant')
            ->exists();

        if ($isGranted) {
            return true;
        }

        // Check if permission comes from roles
        return $this->roles()
            ->whereHas('permissions', fn($q) => $q->where('name', $permissionName))
            ->exists();
    }

    /**
     * Check if user has any of the given permissions
     */
    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Grant a direct permission to user
     */
    public function grantPermission(Permission|string $permission, ?string $reason = null): void
    {
        if (is_string($permission)) {
            $permission = Permission::where('name', $permission)->firstOrFail();
        }

        $this->directPermissions()->syncWithoutDetaching([
            $permission->id => [
                'type' => 'grant',
                'assigned_at' => now(),
                'assigned_by' => auth()->id(),
                'reason' => $reason,
            ]
        ]);
    }

    /**
     * Revoke a permission from user
     */
    public function revokePermission(Permission|string $permission, ?string $reason = null): void
    {
        if (is_string($permission)) {
            $permission = Permission::where('name', $permission)->firstOrFail();
        }

        $this->directPermissions()->syncWithoutDetaching([
            $permission->id => [
                'type' => 'revoke',
                'assigned_at' => now(),
                'assigned_by' => auth()->id(),
                'reason' => $reason,
            ]
        ]);
    }

    // ============================================
    // Login Tracking
    // ============================================

    /**
     * Update last login info
     */
    public function updateLoginInfo(?string $ip = null): void
    {
        $this->update([
            'last_login_at' => now(),
            'last_login_ip' => $ip ?? request()->ip(),
        ]);
    }
}
