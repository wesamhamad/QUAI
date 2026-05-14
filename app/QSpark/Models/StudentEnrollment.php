<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentEnrollment extends QSparkModel
{
    protected $fillable = [
        'student_id',
        'course_section_id',
        'semester_id',
        'attendance_percent',
        'total_absences',
        'excused_absences',
        'unexcused_absences',
        'total_lectures',
        'attended_lectures',
        'midterm_grade',
        'final_grade',
        'coursework_grade',
        'total_grade',
        'letter_grade',
        'grade_points',
        'status',
        'enrollment_date',
        'withdrawal_date',
    ];

    protected $casts = [
        'attendance_percent' => 'decimal:2',
        'midterm_grade' => 'decimal:2',
        'final_grade' => 'decimal:2',
        'coursework_grade' => 'decimal:2',
        'total_grade' => 'decimal:2',
        'grade_points' => 'decimal:2',
        'total_absences' => 'integer',
        'excused_absences' => 'integer',
        'unexcused_absences' => 'integer',
        'total_lectures' => 'integer',
        'attended_lectures' => 'integer',
        'enrollment_date' => 'date',
        'withdrawal_date' => 'date',
    ];

    // ============================================
    // العلاقات
    // ============================================

    public function student(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class, 'student_id');
    }

    public function courseSection(): BelongsTo
    {
        return $this->belongsTo(CourseSection::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    // ============================================
    // Scopes
    // ============================================

    public function scopeEnrolled($query)
    {
        return $query->where('status', 'enrolled');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeInSemester($query, $semesterId)
    {
        return $query->where('semester_id', $semesterId);
    }

    public function scopeAtRisk($query, float $attendanceThreshold = 75)
    {
        return $query->where('attendance_percent', '<', $attendanceThreshold);
    }

    // ============================================
    // Accessors
    // ============================================

    public function getUnexcusedAbsencesCountAttribute(): int
    {
        return $this->total_absences - $this->excused_absences;
    }

    public function getIsPassingAttribute(): bool
    {
        return $this->letter_grade && !in_array($this->letter_grade, ['F', 'D', 'D-']);
    }

    public function getStatusNameAttribute(): string
    {
        return match($this->status) {
            'enrolled' => 'مسجل',
            'withdrawn' => 'منسحب',
            'completed' => 'مكتمل',
            'failed' => 'راسب',
            default => $this->status,
        };
    }

    // ============================================
    // Methods
    // ============================================

    public function calculateAttendancePercent(): void
    {
        if ($this->total_lectures > 0) {
            $this->attendance_percent = ($this->attended_lectures / $this->total_lectures) * 100;
            $this->save();
        }
    }
}

