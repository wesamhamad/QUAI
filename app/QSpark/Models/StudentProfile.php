<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudentProfile extends QSparkModel
{
    protected $fillable = [
        'user_id',
        'major_id',
        'current_semester_id',
        'national_id',
        'gender',
        'birth_date',
        'student_level',
        'academic_status',
        'cumulative_gpa',
        'semester_gpa',
        'attempted_hours',
        'passed_hours',
        'remaining_hours',
        'overall_attendance_percent',
        'total_absences',
        'excused_absences',
        'total_play_minutes',
        'game_points',
        'game_attempts',
        'admission_date',
        'expected_graduation_date',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'admission_date' => 'date',
        'expected_graduation_date' => 'date',
        'cumulative_gpa' => 'decimal:2',
        'semester_gpa' => 'decimal:2',
        'overall_attendance_percent' => 'decimal:2',
        'attempted_hours' => 'integer',
        'passed_hours' => 'integer',
        'remaining_hours' => 'integer',
        'total_absences' => 'integer',
        'excused_absences' => 'integer',
        'total_play_minutes' => 'integer',
        'game_points' => 'integer',
        'game_attempts' => 'integer',
    ];

    // ============================================
    // العلاقات
    // ============================================

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function major(): BelongsTo
    {
        return $this->belongsTo(Major::class);
    }

    public function currentSemester(): BelongsTo
    {
        return $this->belongsTo(Semester::class, 'current_semester_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(StudentEnrollment::class, 'student_id');
    }

    // ============================================
    // Scopes
    // ============================================

    public function scopeActive($query)
    {
        return $query->where('academic_status', 'active');
    }

    public function scopeAtRisk($query, float $gpaThreshold = 2.0, float $attendanceThreshold = 75)
    {
        return $query->where(function ($q) use ($gpaThreshold, $attendanceThreshold) {
            $q->where('cumulative_gpa', '<', $gpaThreshold)
              ->orWhere('overall_attendance_percent', '<', $attendanceThreshold);
        });
    }

    public function scopeInMajor($query, $majorId)
    {
        return $query->where('major_id', $majorId);
    }

    // ============================================
    // Accessors
    // ============================================

    public function getTotalStudyHoursAttribute(): float
    {
        return round($this->total_play_minutes / 60, 1);
    }

    public function getIsAtRiskAttribute(): bool
    {
        return $this->cumulative_gpa < 2.0 || $this->overall_attendance_percent < 75;
    }

    public function getAcademicStatusNameAttribute(): string
    {
        return match($this->academic_status) {
            'active' => 'نشط',
            'suspended' => 'موقوف',
            'graduated' => 'متخرج',
            'withdrawn' => 'منسحب',
            default => $this->academic_status,
        };
    }

    // ============================================
    // Methods
    // ============================================

    public function addPlayMinutes(int $minutes): void
    {
        $this->increment('total_play_minutes', $minutes);
    }

    public function addGamePoints(int $points): void
    {
        $this->increment('game_points', $points);
        $this->increment('game_attempts');
    }
}

