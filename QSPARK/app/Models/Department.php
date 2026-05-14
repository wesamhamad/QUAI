<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Department extends Model
{
    protected $fillable = [
        'faculty_id',
        'code',
        'name_ar',
        'name_en',
        'head_name',
        'email',
        'phone',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    // ============================================
    // العلاقات
    // ============================================

    /**
     * الكلية التي يتبع لها القسم
     */
    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    /**
     * التخصصات في القسم
     */
    public function majors(): HasMany
    {
        return $this->hasMany(Major::class);
    }

    /**
     * المقررات التي يقدمها القسم
     */
    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }

    /**
     * أعضاء هيئة التدريس في القسم
     */
    public function instructorProfiles(): HasMany
    {
        return $this->hasMany(InstructorProfile::class);
    }

    /**
     * المستخدمون في القسم
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    // ============================================
    // Scopes
    // ============================================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name_ar');
    }

    public function scopeInFaculty($query, $facultyId)
    {
        return $query->where('faculty_id', $facultyId);
    }

    // ============================================
    // Accessors
    // ============================================

    /**
     * اسم القسم حسب اللغة
     */
    public function getNameAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->name_ar : ($this->name_en ?? $this->name_ar);
    }

    /**
     * الاسم الكامل مع الكلية
     */
    public function getFullNameAttribute(): string
    {
        return $this->name . ' - ' . $this->faculty?->name;
    }

    // ============================================
    // Static Methods
    // ============================================

    public static function findByCode(string $code): ?self
    {
        return static::where('code', $code)->first();
    }
}

