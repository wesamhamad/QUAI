<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class StudentMonthlyRecommendation extends Model
{
    protected $fillable = [
        'student_id',
        'month',
        'recommendations',
        'treatment_plans',
        'tips',
        'learning_paths',
        'weekly_plans',
        'goals',
        'strengths',
        'weaknesses',
        'improvement_areas',
        'recommended_resources',
        'study_techniques',
        'certifications',
        'internships',
        'predicted_gpa',
        'completion_percentage',
        'timeline_roadmap',
        'student_data',
        'generated_at',
    ];

    protected $casts = [
        'recommendations' => 'array',
        'treatment_plans' => 'array',
        'tips' => 'array',
        'learning_paths' => 'array',
        'weekly_plans' => 'array',
        'goals' => 'array',
        'strengths' => 'array',
        'weaknesses' => 'array',
        'improvement_areas' => 'array',
        'recommended_resources' => 'array',
        'study_techniques' => 'array',
        'certifications' => 'array',
        'internships' => 'array',
        'predicted_gpa' => 'decimal:2',
        'timeline_roadmap' => 'array',
        'student_data' => 'array',
        'generated_at' => 'datetime',
    ];

    /**
     * Get the student associated with this recommendation
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    /**
     * Get or create recommendation for current month
     */
    public static function getOrCreateForCurrentMonth($studentId, $studentData)
    {
        $currentMonth = Carbon::now('Asia/Riyadh')->format('Y-m');
        
        return self::firstOrCreate(
            [
                'student_id' => $studentId,
                'month' => $currentMonth,
            ],
            [
                'recommendations' => [],
                'treatment_plans' => [],
                'tips' => [],
                'student_data' => $studentData,
                'generated_at' => Carbon::now('Asia/Riyadh'),
            ]
        );
    }

    /**
     * Check if recommendations need to be regenerated (monthly)
     */
    public function needsRegeneration()
    {
        $currentMonth = Carbon::now('Asia/Riyadh')->format('Y-m');
        return $this->month !== $currentMonth;
    }

    /**
     * Get the latest recommendation for a student
     */
    public static function getLatestForStudent($studentId)
    {
        return self::where('student_id', $studentId)
            ->orderBy('generated_at', 'desc')
            ->first();
    }
}

