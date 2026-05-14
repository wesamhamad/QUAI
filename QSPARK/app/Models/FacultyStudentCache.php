<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacultyStudentCache extends Model
{
    protected $table = 'faculty_students_cache';

    protected $fillable = [
        'instructor_id',
        'student_id',
        'student_name',
        'course_no',
        'course_code',
        'course_name',
        'section',
        'activity_code',
        'last_recorded_gpa',
        'attendance_percent',
        'absence_percent',
        'semester',
        'last_synced_at',
    ];

    protected $casts = [
        'last_synced_at' => 'datetime',
        'last_recorded_gpa' => 'decimal:2',
        'attendance_percent' => 'decimal:2',
        'absence_percent' => 'decimal:2',
    ];

    /**
     * Get students for a specific instructor and semester
     */
    public static function getInstructorStudents($instructorId, $semester)
    {
        return self::where('instructor_id', $instructorId)
            ->where('semester', $semester)
            ->get();
    }

    /**
     * Get top students by GPA
     */
    public static function getTopStudents($instructorId, $semester, $limit = 10)
    {
        return self::where('instructor_id', $instructorId)
            ->where('semester', $semester)
            ->whereNotNull('last_recorded_gpa')
            ->orderBy('last_recorded_gpa', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get all students with GPA
     */
    public static function getAllWithGPA($instructorId, $semester)
    {
        return self::where('instructor_id', $instructorId)
            ->where('semester', $semester)
            ->whereNotNull('last_recorded_gpa')
            ->get();
    }

    /**
     * Get students with attendance data
     */
    public static function getWithAttendance($instructorId, $semester)
    {
        return self::where('instructor_id', $instructorId)
            ->where('semester', $semester)
            ->whereNotNull('attendance_percent')
            ->get();
    }

    /**
     * Sync data from Oracle
     */
    public static function syncFromOracle($instructorId, $semester, $studentsData, $gpaData, $attendanceData)
    {
        // Delete old data for this instructor and semester
        self::where('instructor_id', $instructorId)
            ->where('semester', $semester)
            ->delete();

        // Create maps for GPA and attendance data
        $gpaMap = [];
        foreach ($gpaData as $student) {
            $gpaMap[$student->student_id] = $student;
        }

        $attendanceMap = [];
        foreach ($attendanceData as $record) {
            $attendanceMap[$record->student_id] = $record;
        }

        // Insert new data
        $now = now();
        foreach ($studentsData as $student) {
            $gpaInfo = $gpaMap[$student->student_id] ?? null;
            $attendanceInfo = $attendanceMap[$student->student_id] ?? null;

            self::create([
                'instructor_id' => $instructorId,
                'student_id' => $student->student_id,
                'student_name' => $student->student_name ?? $gpaInfo->student_name ?? $attendanceInfo->student_name ?? null,
                'course_no' => $student->course_no,
                'course_code' => $student->course_code ?? $gpaInfo->course_code ?? $attendanceInfo->course_code ?? null,
                'course_name' => $student->course_name ?? $gpaInfo->course_name ?? $attendanceInfo->course_name ?? null,
                'section' => $student->section ?? null,
                'activity_code' => $student->activity_code ?? null,
                'last_recorded_gpa' => $gpaInfo->last_recorded_gpa ?? null,
                'attendance_percent' => $attendanceInfo->attendance_percent ?? null,
                'absence_percent' => $attendanceInfo->absence_percent ?? null,
                'semester' => $semester,
                'last_synced_at' => $now,
            ]);
        }

        // Update student counts in courses cache
        self::updateCourseCounts($instructorId, $semester);
    }

    /**
     * Update student counts in faculty_courses_cache
     */
    protected static function updateCourseCounts($instructorId, $semester)
    {
        $counts = self::where('instructor_id', $instructorId)
            ->where('semester', $semester)
            ->selectRaw('course_no, section, activity_code, COUNT(*) as count')
            ->groupBy('course_no', 'section', 'activity_code')
            ->get();

        foreach ($counts as $count) {
            FacultyCourseCache::where('instructor_id', $instructorId)
                ->where('semester', $semester)
                ->where('course_no', $count->course_no)
                ->where('section', $count->section)
                ->where('activity_code', $count->activity_code)
                ->update(['student_count' => $count->count]);
        }
    }
}

