<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;

class AdminImprovingStudent extends QSparkModel
{
    protected $table = 'admin_improving_students';

    protected $fillable = [
        'semester',
        'student_id',
        'student_name',
        'student_name_s',
        'faculty_no',
        'faculty_name',
        'faculty_name_s',
        'major_no',
        'major_name',
        'major_name_s',
        'major_code',
        'gpa_improvement',
        'attendance_improvement',
        'current_gpa',
        'previous_gpa',
        'current_attendance',
        'previous_attendance',
        'rank_in_faculty',
    ];

    protected $casts = [
        'gpa_improvement' => 'float',
        'attendance_improvement' => 'float',
        'current_gpa' => 'float',
        'previous_gpa' => 'float',
        'current_attendance' => 'float',
        'previous_attendance' => 'float',
    ];

    /**
     * Get top improving students for a semester and faculty
     */
    public static function getTopImprovingByFaculty($semester, $facultyNo, $limit = 5)
    {
        return self::where('semester', $semester)
            ->where('faculty_no', $facultyNo)
            ->orderBy('gpa_improvement', 'desc')
            ->orderBy('attendance_improvement', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get all improving students for a semester grouped by faculty
     */
    public static function getByFacultyGrouped($semester)
    {
        return self::where('semester', $semester)
            ->orderBy('faculty_no')
            ->orderBy('gpa_improvement', 'desc')
            ->get()
            ->groupBy('faculty_no');
    }
}
