<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class QuizQuestion extends Model
{
    protected $fillable = [
        'attachment_key',
        'student_id',
        'course_code',
        'course_id',
        'content_id',
        'attachment_id',
        'question',
        'options',
        'correct_index',
        'difficulty',
        'type',
        'topic',
        'language',
        'thread_id',
        'edited_by',
        'edited_at',
        'exported_at',
        'exported_by',
    ];

    protected $casts = [
        'options' => 'array',
        'correct_index' => 'integer',
        'edited_at' => 'datetime',
        'exported_at' => 'datetime',
    ];

    // ============================================
    // Relationships
    // ============================================

    /**
     * Get the student who generated this question
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    /**
     * Get the faculty who edited this question
     */
    public function editor()
    {
        return $this->belongsTo(User::class, 'edited_by', 'employee_id');
    }

    /**
     * Get the faculty who exported this question
     */
    public function exporter()
    {
        return $this->belongsTo(User::class, 'exported_by', 'employee_id');
    }

    // ============================================
    // Scopes
    // ============================================

    public function scopeByAttachment(Builder $query, string $attachmentKey): Builder
    {
        return $query->where('attachment_key', $attachmentKey);
    }

    public function scopeByCourse(Builder $query, string $courseCode): Builder
    {
        return $query->where('course_code', $courseCode);
    }

    public function scopeByDifficulty(Builder $query, string $difficulty): Builder
    {
        return $query->where('difficulty', $difficulty);
    }

    public function scopeEasy(Builder $query): Builder
    {
        return $query->where('difficulty', 'easy');
    }

    public function scopeMedium(Builder $query): Builder
    {
        return $query->where('difficulty', 'medium');
    }

    public function scopeHard(Builder $query): Builder
    {
        return $query->where('difficulty', 'hard');
    }

    /**
     * Scope to get only non-exported questions
     */
    public function scopeNotExported(Builder $query): Builder
    {
        return $query->whereNull('exported_at');
    }

    /**
     * Scope to get only exported questions
     */
    public function scopeExported(Builder $query): Builder
    {
        return $query->whereNotNull('exported_at');
    }

    // ============================================
    // Static Methods
    // ============================================

    /**
     * Generate attachment key from IDs
     */
    public static function generateAttachmentKey(string $courseId, string $contentId, string $attachmentId): string
    {
        return "{$courseId}_{$contentId}_{$attachmentId}";
    }

    /**
     * Check if questions exist for an attachment
     */
    public static function hasQuestionsForAttachment(string $attachmentKey): bool
    {
        return self::where('attachment_key', $attachmentKey)->exists();
    }

    /**
     * Get questions for an attachment
     */
    public static function getQuestionsForAttachment(string $attachmentKey): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('attachment_key', $attachmentKey)->get();
    }

    /**
     * Store questions for an attachment
     */
    public static function storeQuestions(array $questions, string $attachmentKey, array $metadata = []): int
    {
        $stored = 0;
        foreach ($questions as $q) {
            // Detect language from question text
            $questionText = $q['question'] ?? '';
            $language = preg_match('/[\x{0600}-\x{06FF}]/u', $questionText) ? 'ar' : 'en';
            $questionHash = hash('sha256', $questionText);

            try {
                self::updateOrCreate(
                    [
                        'attachment_key' => $attachmentKey,
                        'question_hash' => $questionHash,
                    ],
                    [
                        'question' => $questionText,
                        'course_code' => $metadata['course_code'] ?? null,
                        'course_id' => $metadata['course_id'] ?? null,
                        'content_id' => $metadata['content_id'] ?? null,
                        'attachment_id' => $metadata['attachment_id'] ?? null,
                        'options' => $q['options'] ?? [],
                        'correct_index' => $q['correctIndex'] ?? 0,
                        'difficulty' => $q['difficulty'] ?? 'medium',
                        'type' => $q['type'] ?? 'enemy',
                        'language' => $language,
                        'thread_id' => $metadata['thread_id'] ?? null,
                    ]
                );
                $stored++;
            } catch (\Exception $e) {
                \Log::warning('Failed to store quiz question', ['error' => $e->getMessage()]);
            }
        }

        return $stored;
    }

    /**
     * Get adaptive questions based on difficulty
     */
    public static function getAdaptiveQuestions(string $attachmentKey, string $difficulty, int $count = 5, array $excludeIds = []): array
    {
        $query = self::where('attachment_key', $attachmentKey);

        if (! empty($excludeIds)) {
            $query->whereNotIn('id', $excludeIds);
        }

        // Priority: requested difficulty first, then adjacent difficulties
        $difficultyOrder = match ($difficulty) {
            'easy' => ['easy', 'medium', 'hard'],
            'hard' => ['hard', 'medium', 'easy'],
            default => ['medium', 'easy', 'hard'],
        };

        $questions = collect();

        foreach ($difficultyOrder as $diff) {
            if ($questions->count() >= $count) {
                break;
            }

            $remaining = $count - $questions->count();
            $batch = (clone $query)
                ->where('difficulty', $diff)
                ->whereNotIn('id', $questions->pluck('id')->toArray())
                ->inRandomOrder()
                ->limit($remaining)
                ->get();

            $questions = $questions->merge($batch);
        }

        // Transform to game format (JavaScript expects camelCase).
        // Options are shuffled at retrieval to prevent memorization and to
        // counter the LLM's bias toward putting the correct answer first.
        return $questions->shuffle()->values()->map(function ($q) {
            $shuffled = self::shuffleOptions((array) $q->options, (int) $q->correct_index);

            return [
                'id' => $q->id,
                'question' => $q->question,
                'options' => $shuffled['options'],
                'correctIndex' => $shuffled['correctIndex'],
                'difficulty' => $q->difficulty,
                'type' => $q->type,
            ];
        })->toArray();
    }

    /**
     * Get ALL questions for an attachment, grouped by difficulty (for adaptive gameplay)
     * Returns up to 18 questions: 6 easy, 6 medium, 6 hard
     * Optimized: Uses a single query with grouping instead of 3 separate queries
     */
    public static function getAllQuestionsGrouped(string $attachmentKey, int $perDifficulty = 6): array
    {
        // Single query to get all questions for this attachment
        $allQuestions = self::where('attachment_key', $attachmentKey)
            ->select(['id', 'question', 'options', 'correct_index', 'difficulty', 'type'])
            ->get();

        $result = [
            'easy' => [],
            'medium' => [],
            'hard' => [],
        ];

        // Group by difficulty in PHP (faster than 3 DB queries)
        $grouped = $allQuestions->groupBy('difficulty');

        foreach (['easy', 'medium', 'hard'] as $difficulty) {
            $questions = $grouped->get($difficulty, collect());

            // Shuffle and limit in PHP
            $shuffled = $questions->shuffle()->take($perDifficulty);

            $result[$difficulty] = $shuffled->map(function ($q) {
                $randomized = self::shuffleOptions((array) $q->options, (int) $q->correct_index);

                return [
                    'id' => $q->id,
                    'question' => $q->question,
                    'options' => $randomized['options'],
                    'correctIndex' => $randomized['correctIndex'],
                    'difficulty' => $q->difficulty,
                    'type' => $q->type,
                ];
            })->values()->toArray();
        }

        return $result;
    }

    /**
     * Shuffle a question's options and remap the correct index. Counteracts
     * the LLM's tendency to put the correct answer at index 0 and prevents
     * students from memorizing positions across sessions.
     */
    private static function shuffleOptions(array $options, int $correctIndex): array
    {
        $options = array_values($options);
        $correctText = $options[$correctIndex] ?? null;

        if ($correctText === null || count($options) < 2) {
            return ['options' => $options, 'correctIndex' => $correctIndex];
        }

        shuffle($options);
        $newIndex = array_search($correctText, $options, true);

        if ($newIndex === false) {
            return ['options' => $options, 'correctIndex' => 0];
        }

        return ['options' => $options, 'correctIndex' => (int) $newIndex];
    }
}
