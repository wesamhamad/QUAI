<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InstructorProfile extends Model
{
    protected $fillable = [
        'user_id',
        'department_id',
        'rank_code',
        'rank_name_ar',
        'rank_name_en',
        'office_location',
        'office_phone',
        'research_interests',
        'academic_status',
        'total_courses_taught',
        'total_students_taught',
        'ai_questions_generated',
    ];

    protected $casts = [
        'total_courses_taught' => 'integer',
        'total_students_taught' => 'integer',
        'ai_questions_generated' => 'integer',
    ];

    // ============================================
    // العلاقات
    // ============================================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function courseSections(): HasMany
    {
        return $this->hasMany(CourseSection::class, 'instructor_id');
    }

    // ============================================
    // Scopes
    // ============================================

    public function scopeActive($query)
    {
        return $query->where('academic_status', 'active');
    }

    public function scopeInDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    public function scopeByRank($query, string $rankCode)
    {
        return $query->where('rank_code', $rankCode);
    }

    // ============================================
    // Accessors
    // ============================================

    public function getRankNameAttribute(): string
    {
        return app()->getLocale() === 'ar' 
            ? ($this->rank_name_ar ?? $this->rank_code) 
            : ($this->rank_name_en ?? $this->rank_name_ar ?? $this->rank_code);
    }

    public function getAcademicStatusNameAttribute(): string
    {
        return match($this->academic_status) {
            'active' => 'نشط',
            'on_leave' => 'إجازة',
            'retired' => 'متقاعد',
            default => $this->academic_status,
        };
    }

    // ============================================
    // Methods
    // ============================================

    public function incrementQuestionsGenerated(int $count = 1): void
    {
        $this->increment('ai_questions_generated', $count);
    }

    /**
     * الحصول على شعب المقررات للفصل الحالي
     */
    public function currentSemesterSections()
    {
        $currentSemester = Semester::current();
        
        if (!$currentSemester) {
            return collect();
        }

        return $this->courseSections()
            ->where('semester_id', $currentSemester->id)
            ->with('course')
            ->get();
    }

    /**
     * الحصول على عدد الطلاب في الفصل الحالي
     */
    public function getCurrentStudentsCountAttribute(): int
    {
        return $this->currentSemesterSections()->sum('enrolled_count');
    }
}

