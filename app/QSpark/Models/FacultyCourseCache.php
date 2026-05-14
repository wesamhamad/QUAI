<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;

class FacultyCourseCache extends QSparkModel
{
    protected $table = 'faculty_courses_cache';

    protected $fillable = [
        'instructor_id',
        'course_no',
        'course_code',
        'course_name',
        'section',
        'activity_code',
        'activity_name',
        'semester',
        'student_count',
        'last_synced_at',
    ];

    protected $casts = [
        'last_synced_at' => 'datetime',
        'student_count' => 'integer',
    ];

    /**
     * Get courses for a specific instructor and semester
     */
    public static function getInstructorCourses($instructorId, $semester)
    {
        return self::where('instructor_id', $instructorId)
            ->where('semester', $semester)
            ->orderBy('course_code')
            ->orderBy('section')
            ->orderBy('activity_code')
            ->get();
    }

    /**
     * Sync data from Oracle
     */
    public static function syncFromOracle($instructorId, $semester, $oracleData)
    {
        // Delete old data for this instructor and semester
        self::where('instructor_id', $instructorId)
            ->where('semester', $semester)
            ->delete();

        // Insert new data
        $now = now();
        foreach ($oracleData as $course) {
            self::create([
                'instructor_id' => $instructorId,
                'course_no' => $course->course_no,
                'course_code' => $course->course_code ?? null,
                'course_name' => $course->course_name ?? null,
                'section' => $course->section ?? null,
                'activity_code' => $course->activity_code ?? null,
                'activity_name' => $course->activity_name ?? null,
                'semester' => $semester,
                'student_count' => 0, // Will be updated when syncing students
                'last_synced_at' => $now,
            ]);
        }
    }
}

