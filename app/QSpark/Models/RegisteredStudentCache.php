<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;

class RegisteredStudentCache extends QSparkModel
{
    protected $table = 'registered_students_cache';

    protected $fillable = [
        'semester',
        'student_id',
        'first_name_ar',
        'last_name_ar',
        'national_id',
        'gender',
        'degree_code',
        'faculty_no',
        'campus_no',
        'email',
        'mobile_phone',
        'status_code',
        'cumulative_gpa',
        'semester_gpa',
        'attempted_hours',
        'passed_hours',
        'student_level',
        'attendance_percent',
        'total_absences',
        'excused_absences',
        'activity_count',
    ];

    protected $casts = [
        'semester' => 'integer',
        'faculty_no' => 'integer',
        'campus_no' => 'integer',
        'cumulative_gpa' => 'decimal:2',
        'semester_gpa' => 'decimal:2',
        'attempted_hours' => 'integer',
        'passed_hours' => 'integer',
        'attendance_percent' => 'decimal:2',
        'total_absences' => 'integer',
        'excused_absences' => 'integer',
        'activity_count' => 'integer',
    ];

    /**
     * Get total registered students for a semester
     */
    public static function getTotalStudents($semester)
    {
        return self::where('semester', $semester)->count();
    }

    /**
     * Get average GPA for a semester
     */
    public static function getAverageGpa($semester)
    {
        return self::where('semester', $semester)
            ->whereNotNull('cumulative_gpa')
            ->where('cumulative_gpa', '>', 0)
            ->avg('cumulative_gpa') ?? 0;
    }

    /**
     * Get average attendance for a semester
     */
    public static function getAverageAttendance($semester)
    {
        return self::where('semester', $semester)
            ->whereNotNull('attendance_percent')
            ->avg('attendance_percent') ?? 0;
    }

    /**
     * Get students by faculty
     */
    public static function getStudentsByFaculty($semester)
    {
        return self::where('semester', $semester)
            ->whereNotNull('faculty_no')
            ->groupBy('faculty_no')
            ->selectRaw('faculty_no, COUNT(*) as student_count')
            ->get();
    }
}
