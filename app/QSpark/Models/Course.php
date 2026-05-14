<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends QSparkModel
{
    protected $fillable = [
        'department_id',
        'code',
        'course_no',
        'name_ar',
        'name_en',
        'description_ar',
        'description_en',
        'credit_hours',
        'lecture_hours',
        'lab_hours',
        'course_type',
        'is_active',
    ];

    protected $casts = [
        'credit_hours' => 'integer',
        'lecture_hours' => 'integer',
        'lab_hours' => 'integer',
        'is_active' => 'boolean',
    ];

    // ============================================
    // الثوابت
    // ============================================
    public const TYPE_REQUIRED = 'required';
    public const TYPE_ELECTIVE = 'elective';
    public const TYPE_GENERAL = 'general';

    // ============================================
    // العلاقات
    // ============================================

    /**
     * القسم المسؤول عن المقرر
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * شعب المقرر
     */
    public function sections(): HasMany
    {
        return $this->hasMany(CourseSection::class);
    }

    // ============================================
    // Scopes
    // ============================================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('course_type', $type);
    }

    public function scopeInDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    // ============================================
    // Accessors
    // ============================================

    /**
     * اسم المقرر حسب اللغة
     */
    public function getNameAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->name_ar : ($this->name_en ?? $this->name_ar);
    }

    /**
     * الوصف حسب اللغة
     */
    public function getDescriptionAttribute(): ?string
    {
        return app()->getLocale() === 'ar' ? $this->description_ar : ($this->description_en ?? $this->description_ar);
    }

    /**
     * اسم نوع المقرر بالعربي
     */
    public function getCourseTypeNameAttribute(): string
    {
        return match($this->course_type) {
            'required' => 'إجباري',
            'elective' => 'اختياري',
            'general' => 'متطلب عام',
            default => $this->course_type,
        };
    }

    // ============================================
    // Static Methods
    // ============================================

    public static function findByCode(string $code): ?self
    {
        return static::where('code', $code)->first();
    }

    public static function findByCourseNo(string $courseNo): ?self
    {
        return static::where('course_no', $courseNo)->first();
    }
}

