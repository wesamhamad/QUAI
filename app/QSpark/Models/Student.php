<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Student extends QSparkModel
{
    protected $fillable = [
        'student_id',
        'arabic_name',
        'english_name',
        'email',
        'gender',
        'gpa',
        'attendance_rate',
        'total_study_hours',
        'game_points',
        'game_attempts',
    ];

    protected $casts = [
        'gpa' => 'decimal:2',
        'attendance_rate' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'student_id', 'uuid');
    }

    public function playHours()
    {
        return $this->hasMany(StudentPlayHour::class, 'student_id', 'student_id');
    }

    public function addStudyHours($minutes)
    {
        $this->increment('total_study_hours', $minutes);
    }

    public function getTotalStudyHoursAttribute()
    {
        return round(($this->attributes['total_study_hours'] ?? 0) / 60, 1);
    }

    public static function updateOrCreateStudent($studentData)
    {
        return static::updateOrCreate(
            ['student_id' => $studentData['student_id']],
            $studentData
        )->refresh();
    }
}