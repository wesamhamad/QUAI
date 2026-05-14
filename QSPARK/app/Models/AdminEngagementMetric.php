<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class AdminEngagementMetric extends Model
{
    protected $table = 'admin_engagement_metrics';

    protected $fillable = [
        'semester',
        'total_students',
        'engaged_students',
        'overall_engagement_rate',
        'total_faculty',
        'faculty_with_students',
        'faculty_participation_rate',
        'engagement_by_college',
        'engagement_by_specialization',
        'last_calculated_at',
    ];

    protected $casts = [
        'engagement_by_college' => 'array',
        'engagement_by_specialization' => 'array',
        'last_calculated_at' => 'datetime',
    ];

    /**
     * Get metrics for a semester
     */
    public static function getBySemester($semester)
    {
        return self::where('semester', $semester)->first();
    }

    /**
     * Store or update metrics for a semester
     */
    public static function storeMetrics($semester, $metrics)
    {
        return self::updateOrCreate(
            ['semester' => $semester],
            [
                'total_students' => $metrics['total_students'] ?? 0,
                'engaged_students' => $metrics['engaged_students'] ?? 0,
                'overall_engagement_rate' => $metrics['overall_engagement_rate'] ?? 0,
                'total_faculty' => $metrics['total_faculty'] ?? 0,
                'faculty_with_students' => $metrics['faculty_with_students'] ?? 0,
                'faculty_participation_rate' => $metrics['faculty_participation_rate'] ?? 0,
                'engagement_by_college' => $metrics['engagement_by_college'] ?? [],
                'engagement_by_specialization' => $metrics['engagement_by_specialization'] ?? [],
                'last_calculated_at' => Carbon::now(),
            ]
        );
    }
}
