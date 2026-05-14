<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminStudentCache extends Model
{
    protected $table = 'admin_students_cache';

    protected $fillable = [
        'student_id',
        'student_name',
        'semester',
        'last_recorded_gpa',
        'attendance_percent',
        'absence_percent',
        'course_code',
        'course_name',
        'faculty_no',
        'faculty_name',
        'major_no',
        'major_name',
        'dept_no',
        'dept_name',
        'last_synced_at',
    ];

    protected $casts = [
        'last_recorded_gpa' => 'float',
        'attendance_percent' => 'float',
        'absence_percent' => 'float',
        'last_synced_at' => 'datetime',
    ];

    /**
     * Get all students for a semester
     */
    public static function getAllStudents($semester)
    {
        return self::where('semester', $semester)
            ->orderBy('student_name')
            ->get();
    }

    /**
     * Get all students with GPA for a semester
     */
    public static function getAllWithGPA($semester)
    {
        return self::where('semester', $semester)
            ->whereNotNull('last_recorded_gpa')
            ->orderBy('last_recorded_gpa', 'desc')
            ->get();
    }

    /**
     * Get top students by GPA
     */
    public static function getTopStudents($semester, $limit = 10)
    {
        return self::where('semester', $semester)
            ->whereNotNull('last_recorded_gpa')
            ->orderBy('last_recorded_gpa', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Get all students with attendance data
     */
    public static function getWithAttendance($semester)
    {
        return self::where('semester', $semester)
            ->whereNotNull('attendance_percent')
            ->get();
    }

    /**
     * Get students at risk (GPA < 3.0 OR attendance < 75%)
     */
    public static function getStudentsAtRisk($semester, $limit = 20)
    {
        return self::where('semester', $semester)
            ->where(function($query) {
                $query->where('last_recorded_gpa', '<', 3.0)
                      ->orWhere('attendance_percent', '<', 75);
            })
            ->orderByRaw("
                CASE 
                    WHEN last_recorded_gpa < 3.0 AND attendance_percent < 75 THEN 0
                    WHEN last_recorded_gpa < 3.0 THEN 1
                    ELSE 2
                END
            ")
            ->limit($limit)
            ->get()
            ->map(function($student) {
                $student->risk_reason = 'low_attendance';
                if ($student->last_recorded_gpa < 3.0 && $student->attendance_percent < 75) {
                    $student->risk_reason = 'both';
                } elseif ($student->last_recorded_gpa < 3.0) {
                    $student->risk_reason = 'low_gpa';
                }
                return $student;
            });
    }

    /**
     * Sync data from Oracle for all students
     * Process in chunks to avoid memory issues
     */
    public static function syncFromOracle($semester, $studentsWithGPA, $attendanceData)
    {
        // Delete old data for this semester
        self::where('semester', $semester)->delete();

        // Create attendance map for easy lookup
        $attendanceMap = [];
        foreach ($attendanceData as $record) {
            $attendanceMap[$record->student_id] = $record;
        }

        // Free memory
        unset($attendanceData);

        $now = Carbon::now();
        $totalInserted = 0;
        $chunkSize = 500;
        $insertData = [];

        // Process students in chunks to avoid memory issues
        foreach ($studentsWithGPA as $index => $student) {
            $attendanceInfo = $attendanceMap[$student->student_id] ?? null;

            $insertData[] = [
                'student_id' => $student->student_id,
                'student_name' => $student->student_name ?? null,
                'semester' => $semester,
                'last_recorded_gpa' => $student->last_recorded_gpa ?? null,
                'attendance_percent' => $attendanceInfo->attendance_percent ?? null,
                'absence_percent' => $attendanceInfo->absence_percent ?? null,
                'course_code' => $student->course_code ?? null,
                'course_name' => $student->course_name ?? null,
                'faculty_no' => $student->faculty_no ?? null,
                'faculty_name' => $student->faculty_name ?? null,
                'major_no' => $student->major_no ?? null,
                'major_name' => $student->major_name ?? null,
                'dept_no' => $student->dept_no ?? null,
                'dept_name' => $student->dept_name ?? null,
                'last_synced_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            // Insert when chunk is full
            if (count($insertData) >= $chunkSize) {
                self::insert($insertData);
                $totalInserted += count($insertData);
                $insertData = []; // Clear array to free memory
            }
        }

        // Insert remaining data
        if (!empty($insertData)) {
            self::insert($insertData);
            $totalInserted += count($insertData);
        }

        return $totalInserted;
    }
}

