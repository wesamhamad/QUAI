<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;

class AdminTrendData extends QSparkModel
{
    protected $table = 'admin_trend_data';

    protected $fillable = [
        'semester',
        'data_type',
        'value',
        'student_count',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'student_count' => 'integer',
    ];

    /**
     * Get GPA trend data for the last N semesters
     */
    public static function getGpaTrend($currentSemester, $count = 5)
    {
        $semesters = [];
        for ($i = $count - 1; $i >= 0; $i--) {
            $semesters[] = $currentSemester - $i;
        }

        $data = self::where('data_type', 'gpa_trend')
            ->whereIn('semester', $semesters)
            ->orderBy('semester', 'asc')
            ->get();

        return [
            'labels' => $data->pluck('semester')->map(fn($s) => (string)$s)->toArray(),
            'data' => $data->pluck('value')->toArray(),
        ];
    }

    /**
     * Get engagement trend data for the last N semesters
     */
    public static function getEngagementTrend($currentSemester, $count = 5)
    {
        $semesters = [];
        for ($i = $count - 1; $i >= 0; $i--) {
            $semesters[] = $currentSemester - $i;
        }

        $data = self::where('data_type', 'engagement_trend')
            ->whereIn('semester', $semesters)
            ->orderBy('semester', 'asc')
            ->get();

        return [
            'labels' => $data->pluck('semester')->map(fn($s) => (string)$s)->toArray(),
            'data' => $data->pluck('student_count')->toArray(),
        ];
    }

    /**
     * Store or update GPA trend data for a semester
     */
    public static function storeGpaTrend($semester, $avgGpa, $studentCount = 0)
    {
        return self::updateOrCreate(
            [
                'semester' => $semester,
                'data_type' => 'gpa_trend',
            ],
            [
                'value' => $avgGpa,
                'student_count' => $studentCount,
            ]
        );
    }

    /**
     * Store or update engagement trend data for a semester
     */
    public static function storeEngagementTrend($semester, $activeStudents)
    {
        return self::updateOrCreate(
            [
                'semester' => $semester,
                'data_type' => 'engagement_trend',
            ],
            [
                'student_count' => $activeStudents,
                'value' => 0, // Not used for engagement
            ]
        );
    }
}
