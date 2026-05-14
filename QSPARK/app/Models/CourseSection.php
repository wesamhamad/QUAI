<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseSection extends Model
{
    protected $fillable = [
        'course_id',
        'instructor_id',
        'semester_id',
        'section_no',
        'activity_code',
        'activity_name',
        'schedule',
        'capacity',
        'enrolled_count',
        'status',
    ];

    protected $casts = [
        'schedule' => 'array',
        'capacity' => 'integer',
        'enrolled_count' => 'integer',
    ];

    // ============================================
    // العلاقات
    // ============================================

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(InstructorProfile::class, 'instructor_id');
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(StudentEnrollment::class, 'course_section_id');
    }

    // ============================================
    // Scopes
    // ============================================

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeInSemester($query, $semesterId)
    {
        return $query->where('semester_id', $semesterId);
    }

    public function scopeCurrentSemester($query)
    {
        $current = Semester::current();
        return $current ? $query->where('semester_id', $current->id) : $query;
    }

    public function scopeByInstructor($query, $instructorId)
    {
        return $query->where('instructor_id', $instructorId);
    }

    // ============================================
    // Accessors
    // ============================================

    public function getFullNameAttribute(): string
    {
        return $this->course?->name . ' - ' . $this->section_no;
    }

    public function getActivityNameDisplayAttribute(): string
    {
        return match($this->activity_code) {
            'LEC' => 'محاضرة',
            'LAB' => 'معمل',
            'TUT' => 'تمارين',
            default => $this->activity_name ?? $this->activity_code,
        };
    }

    public function getAvailableSeatsAttribute(): int
    {
        return max(0, ($this->capacity ?? 0) - $this->enrolled_count);
    }

    public function getIsFullAttribute(): bool
    {
        return $this->capacity && $this->enrolled_count >= $this->capacity;
    }

    // ============================================
    // Methods
    // ============================================

    public function updateEnrolledCount(): void
    {
        $this->update([
            'enrolled_count' => $this->enrollments()->count()
        ]);
    }
}

