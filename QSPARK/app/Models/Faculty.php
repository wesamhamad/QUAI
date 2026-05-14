<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Faculty extends Model
{
    protected $fillable = [
        'code',
        'name_ar',
        'name_en',
        'short_name_ar',
        'short_name_en',
        'dean_name',
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
     * الأقسام التابعة للكلية
     */
    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    /**
     * المستخدمون التابعون للكلية
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

    // ============================================
    // Accessors
    // ============================================

    /**
     * اسم الكلية حسب اللغة
     */
    public function getNameAttribute(): string
    {
        return app()->getLocale() === 'ar' ? $this->name_ar : ($this->name_en ?? $this->name_ar);
    }

    /**
     * الاسم المختصر حسب اللغة
     */
    public function getShortNameAttribute(): string
    {
        $shortName = app()->getLocale() === 'ar' ? $this->short_name_ar : $this->short_name_en;
        return $shortName ?? $this->name;
    }

    // ============================================
    // Static Methods
    // ============================================

    public static function findByCode(string $code): ?self
    {
        return static::where('code', $code)->first();
    }
}

