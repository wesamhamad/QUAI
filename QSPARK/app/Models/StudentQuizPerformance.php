<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class StudentQuizPerformance extends Model
{
    protected $table = 'student_quiz_performance';

    protected $fillable = [
        'student_id',
        'course_code',
        'attachment_key',
        'session_id',
        'total_questions',
        'correct_answers',
        'wrong_answers',
        'lives_remaining',
        'total_time',
        'avg_answer_time',
        'fastest_answer',
        'slowest_answer',
        'starting_difficulty',
        'ending_difficulty',
        'difficulty_changes',
        'questions_answered',
        'performance_score',
        'recommended_difficulty',
    ];

    protected $casts = [
        'difficulty_changes' => 'array',
        'questions_answered' => 'array',
        'total_questions' => 'integer',
        'correct_answers' => 'integer',
        'wrong_answers' => 'integer',
        'lives_remaining' => 'integer',
        'total_time' => 'integer',
        'avg_answer_time' => 'float',
        'performance_score' => 'float',
    ];

    // ============================================
    // Relationships
    // ============================================

    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    // ============================================
    // Scopes
    // ============================================

    public function scopeForStudent(Builder $query, string $studentId): Builder
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeForCourse(Builder $query, string $courseCode): Builder
    {
        return $query->where('course_code', $courseCode);
    }

    public function scopeLatest(Builder $query): Builder
    {
        return $query->orderBy('created_at', 'desc');
    }

    // ============================================
    // Static Methods
    // ============================================

    /**
     * Get recommended difficulty for a student based on their history
     */
    public static function getRecommendedDifficulty(string $studentId, ?string $courseCode = null): string
    {
        $query = self::where('student_id', $studentId);
        
        if ($courseCode) {
            $query->where('course_code', $courseCode);
        }
        
        // Get last 3 performances
        $recentPerformances = $query->orderBy('created_at', 'desc')->limit(3)->get();
        
        if ($recentPerformances->isEmpty()) {
            return 'medium'; // Default for new players
        }

        // Calculate average performance score
        $avgScore = $recentPerformances->avg('performance_score');
        $avgLives = $recentPerformances->avg('lives_remaining');
        $avgTime = $recentPerformances->avg('avg_answer_time');

        // Scoring logic:
        // High score (>70) + lives (>2) + fast (<10s) = increase difficulty
        // Low score (<40) + low lives (<1) + slow (>20s) = decrease difficulty
        
        if ($avgScore >= 70 && $avgLives >= 2 && $avgTime < 15) {
            return 'hard';
        } elseif ($avgScore < 40 || $avgLives < 1 || $avgTime > 25) {
            return 'easy';
        }
        
        return 'medium';
    }

    /**
     * Calculate performance score based on game results
     */
    public static function calculatePerformanceScore(
        int $correctAnswers,
        int $totalQuestions,
        int $livesRemaining,
        float $avgAnswerTime
    ): float {
        // Base score from correct answers (0-50 points)
        $accuracyScore = ($correctAnswers / max(1, $totalQuestions)) * 50;
        
        // Lives bonus (0-25 points) - 3 lives = 25, 2 = 17, 1 = 8, 0 = 0
        $livesScore = ($livesRemaining / 3) * 25;
        
        // Speed bonus (0-25 points) - faster is better
        // Under 5 seconds = 25, 5-10 = 20, 10-15 = 15, 15-20 = 10, 20+ = 5
        $speedScore = match(true) {
            $avgAnswerTime < 5 => 25,
            $avgAnswerTime < 10 => 20,
            $avgAnswerTime < 15 => 15,
            $avgAnswerTime < 20 => 10,
            default => 5,
        };
        
        return round($accuracyScore + $livesScore + $speedScore, 2);
    }

    /**
     * Record a game session performance
     */
    public static function recordSession(array $data): self
    {
        $performance = self::calculatePerformanceScore(
            $data['correct_answers'] ?? 0,
            $data['total_questions'] ?? 5,
            $data['lives_remaining'] ?? 0,
            $data['avg_answer_time'] ?? 30
        );

        // Determine recommended difficulty for next session
        $recommended = match(true) {
            $performance >= 75 => 'hard',
            $performance < 40 => 'easy',
            default => 'medium',
        };

        return self::create([
            'student_id' => $data['student_id'],
            'course_code' => $data['course_code'] ?? null,
            'attachment_key' => $data['attachment_key'] ?? null,
            'session_id' => $data['session_id'] ?? uniqid('quiz_'),
            'total_questions' => $data['total_questions'] ?? 5,
            'correct_answers' => $data['correct_answers'] ?? 0,
            'wrong_answers' => $data['wrong_answers'] ?? 0,
            'lives_remaining' => $data['lives_remaining'] ?? 0,
            'total_time' => $data['total_time'] ?? 0,
            'avg_answer_time' => $data['avg_answer_time'] ?? 0,
            'fastest_answer' => $data['fastest_answer'] ?? null,
            'slowest_answer' => $data['slowest_answer'] ?? null,
            'starting_difficulty' => $data['starting_difficulty'] ?? 'medium',
            'ending_difficulty' => $data['ending_difficulty'] ?? 'medium',
            'difficulty_changes' => $data['difficulty_changes'] ?? [],
            'questions_answered' => $data['questions_answered'] ?? [],
            'performance_score' => $performance,
            'recommended_difficulty' => $recommended,
        ]);
    }
}

