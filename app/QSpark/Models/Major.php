<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Major extends QSparkModel
{
    protected $fillable = [
        'department_id',
        'code',
        'name_ar',
        'name_en',
        'degree_type',
        'credit_hours_required',
        'years_to_complete',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'credit_hours_required' => 'integer',
        'years_to_complete' => 'integer',
        'sort_order' => 'integer',
        'is_active' => 'boolean',
    ];

    // ============================================
    // الثوابت
    // ============================================
    public const DEGREE_BACHELOR = 'bachelor';
    public const DEGREE_MASTER = 'master';
    public const DEGREE_PHD = 'phd';
    public const DEGREE_DIPLOMA = 'diploma';

    // ============================================
    // العلاقات
    // ============================================

    /**
     * القسم الذي يتبع له التخصص
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * الطلاب في هذا التخصص
     */
    public function studentProfiles(): HasMany
    {
        return $this->hasMany(StudentProfile::class);
    }

    // ============================================
    // Scopes
    // ============================================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByDegreeType($query, string $degreeType)
    {
        return $query->where('degree_type', $degreeType);
    }

    public function scopeInDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    // ============================================
    // Accessors
    // ============================================

    /**
     * اسم التخصص حسب اللغة
     */
    public function getNameAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->name_ar : ($this->name_en ?? $this->name_ar);
    }

    /**
     * نوع الدرجة العلمية بالعربي
     */
    public function getDegreeTypeNameAttribute(): string
    {
        return match($this->degree_type) {
            'bachelor' => 'بكالوريوس',
            'master' => 'ماجستير',
            'phd' => 'دكتوراه',
            'diploma' => 'دبلوم',
            default => $this->degree_type,
        };
    }

    /**
     * الاسم الكامل مع القسم والكلية
     */
    public function getFullNameAttribute(): string
    {
        return $this->name . ' - ' . $this->department?->name;
    }

    // ============================================
    // Static Methods
    // ============================================

    public static function findByCode(string $code): ?self
    {
        return static::where('code', $code)->first();
    }
}

