<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class OracleStudentCache extends Model
{
    protected $table = 'oracle_students_cache';

    protected $fillable = [
        'student_id',
        'student_name',
        'faculty_no',
        'faculty_name',
        'major_no',
        'major_name',
        'gpa',
        'absence_percent',
        'total_absences',
        'attendance_percent',
        'course_code',
        'course_name',
        'semester',
        'last_synced_at',
    ];

    protected $casts = [
        'gpa' => 'decimal:2',
        'absence_percent' => 'decimal:2',
        'attendance_percent' => 'decimal:2',
        'total_absences' => 'integer',
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
     * Get students with GPA data
     */
    public static function getWithGPA($semester)
    {
        return self::where('semester', $semester)
            ->whereNotNull('gpa')
            ->where('gpa', '>', 0)
            ->orderBy('gpa', 'desc')
            ->get();
    }

    /**
     * Get students with attendance data
     */
    public static function getWithAttendance($semester)
    {
        return self::where('semester', $semester)
            ->whereNotNull('attendance_percent')
            ->get();
    }

    /**
     * Sync data from Oracle
     */
    public static function syncFromOracle($semester, $studentsData, $gpaData, $attendanceData)
    {
        // Delete old data for this semester
        self::where('semester', $semester)->delete();

        // Create maps for GPA and attendance
        $gpaMap = [];
        foreach ($gpaData as $student) {
            $gpaMap[$student->student_id] = $student;
        }

        $attendanceMap = [];
        foreach ($attendanceData as $record) {
            $attendanceMap[$record->student_id] = $record;
        }

        $now = Carbon::now();
        $totalInserted = 0;
        $chunkSize = 500;
        $insertData = [];

        foreach ($studentsData as $student) {
            $gpaInfo = $gpaMap[$student->student_id] ?? null;
            $attendanceInfo = $attendanceMap[$student->student_id] ?? null;

            $insertData[] = [
                'student_id' => $student->student_id,
                'student_name' => $student->student_name ?? null,
                'faculty_no' => $student->faculty_no ?? null,
                'faculty_name' => $student->faculty_name ?? null,
                'major_no' => $student->major_no ?? null,
                'major_name' => $student->major_name ?? null,
                'gpa' => $gpaInfo->gpa ?? null,
                'absence_percent' => $attendanceInfo->absence_percent ?? null,
                'attendance_percent' => $attendanceInfo->attendance_percent ?? null,
                'total_absences' => $attendanceInfo->total_absences ?? null,
                'course_code' => $student->course_code ?? null,
                'course_name' => $student->course_name ?? null,
                'semester' => $semester,
                'last_synced_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ];

            // Insert when chunk is full
            if (count($insertData) >= $chunkSize) {
                self::insert($insertData);
                $totalInserted += count($insertData);
                $insertData = [];
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
