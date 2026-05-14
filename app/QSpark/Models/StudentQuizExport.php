<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;

class StudentQuizExport extends QSparkModel
{
    protected $table = 'student_quiz_exports';

    protected $fillable = [
        'student_id',
        'course_code',
        'attachment_key',
        'questions_count',
        'export_format',
    ];

    protected $casts = [
        'questions_count' => 'integer',
    ];

    // ============================================
    // Relationships
    // ============================================

    /**
     * Get the student who exported
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    // ============================================
    // Static Methods
    // ============================================

    /**
     * Check if a student has already exported questions from an attachment
     */
    public static function hasExported(string $studentId, string $attachmentKey): bool
    {
        return self::where('student_id', $studentId)
            ->where('attachment_key', $attachmentKey)
            ->exists();
    }

    /**
     * Record an export for a student
     */
    public static function recordExport(
        string $studentId,
        string $courseCode,
        string $attachmentKey,
        int $questionsCount,
        string $format = 'word'
    ): self {
        return self::create([
            'student_id' => $studentId,
            'course_code' => $courseCode,
            'attachment_key' => $attachmentKey,
            'questions_count' => $questionsCount,
            'export_format' => $format,
        ]);
    }

    /**
     * Get all exports for a student
     */
    public static function getStudentExports(string $studentId): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('student_id', $studentId)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Get exports count for a student in a specific course
     */
    public static function getCourseExportsCount(string $studentId, string $courseCode): int
    {
        return self::where('student_id', $studentId)
            ->where('course_code', $courseCode)
            ->count();
    }
}

