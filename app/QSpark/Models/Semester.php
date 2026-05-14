<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Semester extends QSparkModel
{
    protected $fillable = [
        'code',
        'name_ar',
        'name_en',
        'academic_year',
        'term',
        'start_date',
        'end_date',
        'registration_start',
        'registration_end',
        'is_current',
        'is_active',
    ];

    protected $casts = [
        'academic_year' => 'integer',
        'term' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date',
        'registration_start' => 'date',
        'registration_end' => 'date',
        'is_current' => 'boolean',
        'is_active' => 'boolean',
    ];

    // ============================================
    // الثوابت
    // ============================================
    public const TERM_FIRST = 1;
    public const TERM_SECOND = 2;
    public const TERM_SUMMER = 3;

    // ============================================
    // العلاقات
    // ============================================

    public function courseSections(): HasMany
    {
        return $this->hasMany(CourseSection::class);
    }

    public function studentEnrollments(): HasMany
    {
        return $this->hasMany(StudentEnrollment::class);
    }

    // ============================================
    // Scopes
    // ============================================

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    // ============================================
    // Static Methods
    // ============================================

    /**
     * الحصول على الفصل الدراسي الحالي
     */
    public static function current(): ?self
    {
        return static::where('is_current', true)->first();
    }

    /**
     * الحصول على كود الفصل الحالي
     */
    public static function currentCode(): ?string
    {
        return static::current()?->code;
    }

    /**
     * تعيين فصل دراسي كالفصل الحالي
     */
    public function setAsCurrent(): void
    {
        // إلغاء الفصل الحالي السابق
        static::where('is_current', true)->update(['is_current' => false]);
        
        // تعيين هذا كالفصل الحالي
        $this->update(['is_current' => true]);
    }

    // ============================================
    // Accessors
    // ============================================

    /**
     * اسم الفصل حسب اللغة
     */
    public function getNameAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->name_ar : ($this->name_en ?? $this->name_ar);
    }

    /**
     * اسم الترم
     */
    public function getTermNameAttribute(): string
    {
        return match($this->term) {
            1 => __('الفصل الأول'),
            2 => __('الفصل الثاني'),
            3 => __('الفصل الصيفي'),
            default => '',
        };
    }
}

