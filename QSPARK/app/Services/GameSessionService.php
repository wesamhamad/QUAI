<?php

namespace App\Services;

use App\Models\QuizQuestion;
use App\Models\StudentPlayHour;
use App\Models\StudentQuizPerformance;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GameSessionService
{
    // Adaptive thresholds.
    //
    // Streak-based escalation: every "correct + answered before timeout"
    // bumps a signed streak counter up; every wrong / timeout bumps it
    // down. Hitting +ESCALATE_STREAK promotes the difficulty one level
    // (easy → medium → hard); hitting -DEMOTE_STREAK demotes it. The
    // streak resets whenever the difficulty changes so the player has to
    // earn the next jump.
    private const ESCALATE_STREAK = 2; // 2 correct + fast in a row → bump up

    private const DEMOTE_STREAK = 2;   // 2 wrong / slow in a row → bump down

    private const FAST_ANSWER_THRESHOLD = 15; // seconds — must answer within this for "fast"

    private const LIVES_STRUGGLING_THRESHOLD = 1; // <= 1 life forces difficulty down

    private const STARTING_DIFFICULTY = 'easy'; // first question (no prior signals)

    private const QUESTIONS_PER_DIFFICULTY = 6;

    private const QUESTION_TIME_LIMIT = 15;

    private const SESSION_TTL = 3600;

    private const QUESTION_POOL_CACHE_TTL = 1800;

    private const MAX_QUESTIONS_PER_GAME = 10;

    /**
     * Start a new game session with adaptive difficulty
     */
    public function startSession(string $courseCode, ?string $attachmentKey = null): array
    {
        $totalStartTime = microtime(true);
        $sessionId = 'game_'.Str::uuid()->toString();

        // Load questions from database or session (with caching)
        $questionPools = $this->loadQuestions($courseCode, $attachmentKey);

        // Shuffle each pool for variety
        $easyPool = $questionPools['easy'] ?? [];
        $mediumPool = $questionPools['medium'] ?? [];
        $hardPool = $questionPools['hard'] ?? [];
        shuffle($easyPool);
        shuffle($mediumPool);
        shuffle($hardPool);

        $sessionState = [
            'session_id' => $sessionId,
            'course_code' => $courseCode,
            'attachment_key' => $attachmentKey,
            'lives' => 3,
            'score' => 0,
            'current_question_index' => 0,
            'current_difficulty' => self::STARTING_DIFFICULTY,
            'starting_difficulty' => self::STARTING_DIFFICULTY,

            'question_pools' => [
                'easy' => $easyPool,
                'medium' => $mediumPool,
                'hard' => $hardPool,
            ],

            // Questions are picked one-at-a-time on each getNextQuestion call,
            // not pre-positioned, so the choice always reflects current signals.
            'question_queue' => [],
            'total_questions' => self::MAX_QUESTIONS_PER_GAME,
            'questions_served' => 0,

            'correct_answers' => 0,
            'wrong_answers' => 0,
            'question_times' => [],
            'questions_answered' => [],
            'difficulty_changes' => [],
            // Signed streak for difficulty escalation.
            //   +N = N consecutive correct + fast answers
            //   -N = N consecutive wrong / slow answers
            'streak' => 0,
            'started_at' => now()->toISOString(),
            'game_over' => false,
        ];

        Cache::put($sessionId, $sessionState, self::SESSION_TTL);

        $totalElapsed = round((microtime(true) - $totalStartTime) * 1000, 2);
        Log::info('GameSession: Started with adaptive difficulty', [
            'session_id' => $sessionId,
            'starting_difficulty' => self::STARTING_DIFFICULTY,
            'max_questions' => self::MAX_QUESTIONS_PER_GAME,
            'pools' => [
                'easy' => count($easyPool),
                'medium' => count($mediumPool),
                'hard' => count($hardPool),
            ],
            'total_elapsed_ms' => $totalElapsed,
        ]);

        return [
            'session_id' => $sessionId,
            'total_questions' => self::MAX_QUESTIONS_PER_GAME,
            'lives' => 3,
            'score' => 0,
            'current_difficulty' => self::STARTING_DIFFICULTY,
        ];
    }

    /**
     * Get current session state
     */
    public function getSessionState(string $sessionId): ?array
    {
        $state = Cache::get($sessionId);

        if (! $state) {
            return null;
        }

        // Return sanitized state (exclude full question queue for security)
        return [
            'session_id' => $state['session_id'],
            'lives' => $state['lives'],
            'score' => $state['score'],
            'current_question_index' => $state['current_question_index'],
            'total_questions' => $state['total_questions'],
            'current_difficulty' => $state['current_difficulty'],
            'correct_answers' => $state['correct_answers'],
            'wrong_answers' => $state['wrong_answers'],
            'game_over' => $state['game_over'],
        ];
    }

    /**
     * Get next question based on adaptive difficulty
     */
    public function getNextQuestion(string $sessionId): array
    {
        $state = Cache::get($sessionId);

        if (! $state) {
            return ['success' => false, 'message' => 'Session not found'];
        }

        if ($state['game_over']) {
            return ['success' => false, 'game_over' => true, 'message' => 'Game already ended'];
        }

        if ($state['lives'] <= 0) {
            $state['game_over'] = true;
            Cache::put($sessionId, $state, self::SESSION_TTL);

            return ['success' => false, 'game_over' => true, 'message' => 'No lives remaining'];
        }

        $currentIndex = $state['current_question_index'];

        // Check if we've reached the maximum questions
        if ($currentIndex >= self::MAX_QUESTIONS_PER_GAME) {
            $state['game_over'] = true;
            Cache::put($sessionId, $state, self::SESSION_TTL);

            return ['success' => false, 'game_over' => true, 'message' => 'All questions completed', 'victory' => true];
        }

        // Pick a fresh question for this slot based on the latest signals
        // (lives + time on previous question). This runs every time so the
        // selection always reflects current state, not a pre-positioned slot.
        if ($currentIndex >= count($state['question_queue'])) {
            $previousDifficulty = $state['current_difficulty'];
            $state['current_difficulty'] = $this->pickNextDifficulty($state);

            if ($previousDifficulty !== $state['current_difficulty']) {
                $state['difficulty_changes'][] = [
                    'from' => $previousDifficulty,
                    'to' => $state['current_difficulty'],
                    'at_question' => $currentIndex,
                    'lives' => $state['lives'],
                    'streak' => $state['streak'] ?? 0,
                    'last_time' => ! empty($state['question_times']) ? end($state['question_times']) : null,
                ];

                Log::info('GameSession: Difficulty changed', [
                    'session_id' => $sessionId,
                    'from' => $previousDifficulty,
                    'to' => $state['current_difficulty'],
                    'lives' => $state['lives'],
                    'streak' => $state['streak'] ?? 0,
                    'last_time' => ! empty($state['question_times']) ? end($state['question_times']) : null,
                ]);

                // Reset streak after a level change so the next jump must
                // be earned again from 0 — prevents oscillating across
                // boundaries on a single fast/slow answer.
                $state['streak'] = 0;
            }

            $state = $this->selectAndAddNextQuestion($state);

            if ($currentIndex >= count($state['question_queue'])) {
                $state['game_over'] = true;
                Cache::put($sessionId, $state, self::SESSION_TTL);

                return ['success' => false, 'game_over' => true, 'message' => 'No more questions available', 'victory' => true];
            }

            Cache::put($sessionId, $state, self::SESSION_TTL);
        }

        $question = $state['question_queue'][$currentIndex];

        return [
            'success' => true,
            'question' => [
                'id' => $question['id'] ?? $currentIndex,
                'question' => $question['question'],
                'options' => $question['options'],
                'difficulty' => $question['difficulty'] ?? self::STARTING_DIFFICULTY,
                'question_number' => $currentIndex + 1,
                'total_questions' => $state['total_questions'],
            ],
            'game_state' => [
                'lives' => $state['lives'],
                'score' => $state['score'],
                'current_difficulty' => $state['current_difficulty'],
            ],
        ];
    }

    /**
     * Process answer submission with adaptive difficulty evaluation
     */
    public function processAnswer(string $sessionId, int $questionId, int $answerIndex, float $timeTaken): array
    {
        $state = Cache::get($sessionId);

        if (! $state) {
            throw new \Exception('Session not found');
        }

        $currentIndex = $state['current_question_index'];
        $question = $state['question_queue'][$currentIndex] ?? null;

        if (! $question) {
            throw new \Exception('Question not found');
        }

        // Validate answer on backend (the actual game logic)
        $correctIndex = $question['correctIndex'] ?? 0;
        $isCorrect = $answerIndex === $correctIndex;

        // Track answer time
        $state['question_times'][] = $timeTaken;

        // Track question ID
        if ($question['id'] ?? null) {
            $state['questions_answered'][] = $question['id'];
        }

        // Update game state based on answer
        if ($isCorrect) {
            $state['score']++;
            $state['correct_answers']++;
        } else {
            $state['lives'] = max(0, $state['lives'] - 1);
            $state['wrong_answers']++;
        }

        // Update the signed streak. The next getNextQuestion call reads
        // this to decide whether to escalate / de-escalate / hold.
        $state['streak'] = $this->updateStreak(
            (int) ($state['streak'] ?? 0),
            $isCorrect,
            (float) $timeTaken
        );

        // Move to next question. Difficulty is re-picked on the next
        // getNextQuestion call from the latest signals (streak + lives).
        $state['current_question_index']++;

        $gameOver = $state['lives'] <= 0 || $state['current_question_index'] >= self::MAX_QUESTIONS_PER_GAME;
        $state['game_over'] = $gameOver;

        $this->persistIncrementalPlayMinutes($state);

        Cache::put($sessionId, $state, self::SESSION_TTL);

        return [
            'is_correct' => $isCorrect,
            'correct_index' => $correctIndex,
            'lives' => $state['lives'],
            'score' => $state['score'],
            'current_difficulty' => $state['current_difficulty'],
            'game_over' => $gameOver,
            'questions_remaining' => self::MAX_QUESTIONS_PER_GAME - $state['current_question_index'],
        ];
    }

    /**
     * Handle question timeout (counts as wrong answer)
     */
    public function handleTimeout(string $sessionId, int $questionId): array
    {
        $state = Cache::get($sessionId);

        if (! $state) {
            throw new \Exception('Session not found');
        }

        $currentIndex = $state['current_question_index'];
        $question = $state['question_queue'][$currentIndex] ?? null;

        // Timeout counts as wrong answer; the timeout duration becomes the
        // recorded answer time, which feeds into the next difficulty pick.
        $state['lives'] = max(0, $state['lives'] - 1);
        $state['wrong_answers']++;
        $state['question_times'][] = self::QUESTION_TIME_LIMIT;
        $state['streak'] = $this->updateStreak(
            (int) ($state['streak'] ?? 0),
            false,
            (float) self::QUESTION_TIME_LIMIT
        );
        $state['current_question_index']++;

        $gameOver = $state['lives'] <= 0 || $state['current_question_index'] >= self::MAX_QUESTIONS_PER_GAME;
        $state['game_over'] = $gameOver;

        $this->persistIncrementalPlayMinutes($state);

        Cache::put($sessionId, $state, self::SESSION_TTL);

        return [
            'correct_index' => $question['correctIndex'] ?? 0,
            'lives' => $state['lives'],
            'score' => $state['score'],
            'game_over' => $gameOver,
            'questions_remaining' => self::MAX_QUESTIONS_PER_GAME - $state['current_question_index'],
            'current_difficulty' => $state['current_difficulty'],
        ];
    }

    /**
     * Persist newly-elapsed full minutes of play time so the
     * "ساعات الدراسة اليوم" widget can tick up mid-session instead of
     * waiting until endSession(). Tracks how many whole minutes have
     * already been written via $state['persisted_minutes'] and only
     * writes the delta. End-session takes care of the final remainder.
     */
    private function persistIncrementalPlayMinutes(array &$state): void
    {
        try {
            $authUser = auth()->user();
            $studentId = $authUser?->username
                ?? $authUser?->uuid
                ?? session('student_id');
            if (! $studentId) {
                return;
            }

            $totalSeconds = (int) array_sum($state['question_times'] ?? []);
            $totalMinutes = intdiv($totalSeconds, 60);
            $alreadyPersisted = (int) ($state['persisted_minutes'] ?? 0);
            $delta = $totalMinutes - $alreadyPersisted;

            if ($delta > 0) {
                StudentPlayHour::addPlayTime($studentId, $delta);
                $state['persisted_minutes'] = $totalMinutes;
            }
        } catch (\Exception $e) {
            Log::warning('GameSession: incremental play-time persist failed', ['error' => $e->getMessage()]);
        }
    }

    /**
     * End game session and record performance
     */
    public function endSession(string $sessionId): array
    {
        $state = Cache::get($sessionId);

        if (! $state) {
            throw new \Exception('Session not found');
        }

        $state['game_over'] = true;
        $state['ended_at'] = now()->toISOString();

        // Calculate final statistics
        $totalTime = array_sum($state['question_times']);
        $avgTime = ! empty($state['question_times'])
            ? $totalTime / count($state['question_times'])
            : 0.0;
        $fastestTime = ! empty($state['question_times']) ? min($state['question_times']) : null;
        $slowestTime = ! empty($state['question_times']) ? max($state['question_times']) : null;

        // Record performance in database. The student dashboard reads
        // student_play_hours by SIS student number (User.username for real QU
        // students), so we write with the same identifier — otherwise the
        // "ساعات الدراسة اليوم" widget never sees a match. Fall back to uuid
        // only when username isn't set.
        try {
            $authUser = auth()->user();
            $studentId = $authUser?->username
                ?? $authUser?->uuid
                ?? session('student_id');

            if ($studentId) {
                StudentQuizPerformance::recordSession([
                    'student_id' => $studentId,
                    'course_code' => $state['course_code'],
                    'attachment_key' => $state['attachment_key'],
                    'session_id' => $sessionId,
                    'total_questions' => $state['total_questions'],
                    'correct_answers' => $state['correct_answers'],
                    'wrong_answers' => $state['wrong_answers'],
                    'lives_remaining' => $state['lives'],
                    'total_time' => $totalTime,
                    'avg_answer_time' => $avgTime,
                    'fastest_answer' => $fastestTime,
                    'slowest_answer' => $slowestTime,
                    'starting_difficulty' => $state['starting_difficulty'],
                    'ending_difficulty' => $state['current_difficulty'],
                    'difficulty_changes' => $state['difficulty_changes'],
                    'questions_answered' => $state['questions_answered'],
                ]);

                // Persist play minutes so the admin dashboard's "ساعات اللعب"
                // counter reflects this session. $totalTime is in seconds;
                // round up so even a sub-minute play registers a minute.
                // Mid-session writes already persisted whole minutes via
                // persistIncrementalPlayMinutes; only write the remainder so
                // the total isn't double-counted.
                $finalMinutes = max(1, (int) ceil($totalTime / 60));
                $alreadyPersisted = (int) ($state['persisted_minutes'] ?? 0);
                $delta = $finalMinutes - $alreadyPersisted;
                if ($delta > 0) {
                    StudentPlayHour::addPlayTime($studentId, $delta);
                }
            }
        } catch (\Exception $e) {
            Log::error('GameSession: Failed to record performance', ['error' => $e->getMessage()]);
        }

        // Clear session from cache
        Cache::forget($sessionId);

        return [
            'final_score' => $state['score'],
            'total_questions' => $state['total_questions'],
            'correct_answers' => $state['correct_answers'],
            'wrong_answers' => $state['wrong_answers'],
            'lives_remaining' => $state['lives'],
            'total_time' => $totalTime,
            'avg_time' => $avgTime,
            'ending_difficulty' => $state['current_difficulty'],
            'victory' => $state['lives'] > 0,
        ];
    }

    /**
     * Validate game action (for anti-cheat)
     */
    public function validateAction(string $sessionId, string $actionType, array $data): array
    {
        $state = Cache::get($sessionId);

        if (! $state) {
            throw new \Exception('Session not found');
        }

        // Basic action validation
        $valid = match ($actionType) {
            'jump' => $this->validateJump($data),
            'move' => $this->validateMove($data),
            'collision' => $this->validateCollision($data),
            default => false,
        };

        return ['valid' => $valid, 'action_type' => $actionType];
    }

    // =========================================
    // Private Helper Methods
    // =========================================

    /**
     * Load questions for the game with caching and performance timing
     */
    private function loadQuestions(string $courseCode, ?string $attachmentKey): array
    {
        $startTime = microtime(true);
        $source = 'fallback';

        // Generate cache key for question pool
        $cacheKey = $this->getQuestionPoolCacheKey($courseCode, $attachmentKey);

        // Try to load from cache first (fastest)
        $cachedQuestions = Cache::get($cacheKey);
        if ($cachedQuestions) {
            $elapsed = round((microtime(true) - $startTime) * 1000, 2);
            Log::info('GameSession: Questions loaded from cache', [
                'source' => 'cache',
                'elapsed_ms' => $elapsed,
                'cache_key' => $cacheKey,
            ]);

            return $cachedQuestions;
        }

        // Try to load from database
        if ($attachmentKey && QuizQuestion::hasQuestionsForAttachment($attachmentKey)) {
            $questions = QuizQuestion::getAllQuestionsGrouped($attachmentKey, self::QUESTIONS_PER_DIFFICULTY);
            $source = 'database';

            // Cache the questions for future requests
            if (! empty($questions['easy']) || ! empty($questions['medium']) || ! empty($questions['hard'])) {
                Cache::put($cacheKey, $questions, self::QUESTION_POOL_CACHE_TTL);
            }

            $elapsed = round((microtime(true) - $startTime) * 1000, 2);
            Log::info('GameSession: Questions loaded from database', [
                'source' => $source,
                'elapsed_ms' => $elapsed,
                'attachment_key' => $attachmentKey,
            ]);

            return $questions;
        }

        // Try session storage
        $sessionQuestions = session("quiz.$courseCode.grouped_questions", []);
        if (! empty($sessionQuestions)) {
            $source = 'session';

            // Cache the session questions for future requests
            Cache::put($cacheKey, $sessionQuestions, self::QUESTION_POOL_CACHE_TTL);

            $elapsed = round((microtime(true) - $startTime) * 1000, 2);
            Log::info('GameSession: Questions loaded from session', [
                'source' => $source,
                'elapsed_ms' => $elapsed,
                'course_code' => $courseCode,
            ]);

            return $sessionQuestions;
        }

        // Fallback questions
        $fallbackQuestions = $this->getFallbackQuestions();
        $elapsed = round((microtime(true) - $startTime) * 1000, 2);
        Log::info('GameSession: Using fallback questions', [
            'source' => $source,
            'elapsed_ms' => $elapsed,
        ]);

        return $fallbackQuestions;
    }

    /**
     * Generate cache key for question pool
     */
    private function getQuestionPoolCacheKey(string $courseCode, ?string $attachmentKey): string
    {
        if ($attachmentKey) {
            return "game_questions:{$courseCode}:{$attachmentKey}";
        }

        return "game_questions:{$courseCode}:session";
    }

    // =========================================
    // Adaptive Difficulty Methods
    // =========================================

    /**
     * Pick the next question's difficulty using a signed streak counter.
     *
     *   streak >= +ESCALATE_STREAK  →  bump up   (easy → medium → hard)
     *   streak <= -DEMOTE_STREAK    →  bump down (hard → medium → easy)
     *   lives  <= LIVES_STRUGGLING  →  bump down (safety net regardless of streak)
     *
     * The caller is expected to reset the streak to 0 when the difficulty
     * actually changes, so the player has to earn the next jump from
     * scratch instead of bouncing across levels.
     */
    private function pickNextDifficulty(array $state): string
    {
        $current = $state['current_difficulty'] ?? self::STARTING_DIFFICULTY;
        $streak = (int) ($state['streak'] ?? 0);
        $lives = (int) ($state['lives'] ?? 3);

        // No prior question — first question is always at the starting level.
        if (empty($state['question_times'])) {
            return self::STARTING_DIFFICULTY;
        }

        $levels = ['easy', 'medium', 'hard'];
        $idx = array_search($current, $levels, true);
        if ($idx === false) {
            $idx = 0;
        }

        // Lives safety net: low lives always nudges down, regardless of streak.
        if ($lives <= self::LIVES_STRUGGLING_THRESHOLD && $idx > 0) {
            return $levels[$idx - 1];
        }

        if ($streak >= self::ESCALATE_STREAK && $idx < 2) {
            return $levels[$idx + 1];
        }
        if ($streak <= -self::DEMOTE_STREAK && $idx > 0) {
            return $levels[$idx - 1];
        }

        return $current;
    }

    /**
     * Update the signed streak after an answer. Correct + within
     * FAST_ANSWER_THRESHOLD seconds increments toward +; everything else
     * (wrong, slow, or timeout) decrements toward -. The sign flips clean
     * on direction change so a single mistake after two correct streaks
     * lands at -1, not -3.
     */
    private function updateStreak(int $current, bool $correct, float $timeTaken): int
    {
        $fastEnough = $timeTaken < self::FAST_ANSWER_THRESHOLD;

        if ($correct && $fastEnough) {
            return $current >= 0 ? $current + 1 : 1;
        }

        return $current <= 0 ? $current - 1 : -1;
    }

    /**
     * Select and add next question to the queue based on current difficulty
     */
    private function selectAndAddNextQuestion(array $state): array
    {
        $targetDifficulty = $state['current_difficulty'];
        $pools = $state['question_pools'];

        // Try to get a question from the target difficulty pool
        $question = null;
        $usedDifficulty = $targetDifficulty;

        if (! empty($pools[$targetDifficulty])) {
            $question = array_shift($pools[$targetDifficulty]);
            $state['question_pools'][$targetDifficulty] = $pools[$targetDifficulty];
        } else {
            // Fallback to adjacent difficulty if target pool is empty
            $fallbackOrder = match ($targetDifficulty) {
                'easy' => ['medium', 'hard'],
                'medium' => ['easy', 'hard'],
                'hard' => ['medium', 'easy'],
                default => ['medium', 'easy', 'hard'],
            };

            foreach ($fallbackOrder as $fallbackDifficulty) {
                if (! empty($pools[$fallbackDifficulty])) {
                    $question = array_shift($pools[$fallbackDifficulty]);
                    $state['question_pools'][$fallbackDifficulty] = $pools[$fallbackDifficulty];
                    $usedDifficulty = $fallbackDifficulty;

                    Log::info('GameSession: Using fallback difficulty', [
                        'requested' => $targetDifficulty,
                        'used' => $usedDifficulty,
                    ]);
                    break;
                }
            }
        }

        if ($question) {
            // Ensure the question has the correct difficulty tag
            $question['difficulty'] = $question['difficulty'] ?? $usedDifficulty;
            $state['question_queue'][] = $question;
            $state['questions_served']++;

            Log::debug('GameSession: Added question to queue', [
                'difficulty' => $usedDifficulty,
                'queue_size' => count($state['question_queue']),
                'remaining_pools' => [
                    'easy' => count($state['question_pools']['easy']),
                    'medium' => count($state['question_pools']['medium']),
                    'hard' => count($state['question_pools']['hard']),
                ],
            ]);
        }

        return $state;
    }

    /**
     * Validate jump action
     */
    private function validateJump(array $data): bool
    {
        // Basic validation - ensure jump velocity is reasonable
        $velocity = $data['velocity'] ?? 0;

        return $velocity >= 0 && $velocity <= 25;
    }

    /**
     * Validate move action
     */
    private function validateMove(array $data): bool
    {
        // Basic validation - ensure move speed is reasonable
        $speed = $data['speed'] ?? 0;

        return $speed >= 0 && $speed <= 20;
    }

    /**
     * Validate collision detection
     */
    private function validateCollision(array $data): bool
    {
        // Basic validation - ensure collision bounds are valid
        return isset($data['x'], $data['y'], $data['width'], $data['height']);
    }

    /**
     * Get fallback questions when no questions available
     */
    private function getFallbackQuestions(): array
    {
        return [
            'easy' => [
                ['question' => 'ما نتيجة ٢ + ٢ ؟', 'options' => ['٣', '٤', '٥', '٦'], 'correctIndex' => 1, 'difficulty' => 'easy'],
                ['question' => 'ما نتيجة ٥ + ٣ ؟', 'options' => ['٦', '٧', '٨', '٩'], 'correctIndex' => 2, 'difficulty' => 'easy'],
                ['question' => 'ما نتيجة ١ + ١ ؟', 'options' => ['١', '٢', '٣', '٤'], 'correctIndex' => 1, 'difficulty' => 'easy'],
                ['question' => 'ما نتيجة ٣ + ٤ ؟', 'options' => ['٥', '٦', '٧', '٨'], 'correctIndex' => 2, 'difficulty' => 'easy'],
                ['question' => 'ما نتيجة ٦ - ٢ ؟', 'options' => ['٢', '٣', '٤', '٥'], 'correctIndex' => 2, 'difficulty' => 'easy'],
                ['question' => 'ما نتيجة ٩ - ٥ ؟', 'options' => ['٣', '٤', '٥', '٦'], 'correctIndex' => 1, 'difficulty' => 'easy'],
            ],
            'medium' => [
                ['question' => 'ما نتيجة ٧ × ٨ ؟', 'options' => ['٥٤', '٥٦', '٥٨', '٦٠'], 'correctIndex' => 1, 'difficulty' => 'medium'],
                ['question' => 'ما نتيجة ٩ × ٦ ؟', 'options' => ['٥٢', '٥٤', '٥٦', '٥٨'], 'correctIndex' => 1, 'difficulty' => 'medium'],
                ['question' => 'ما نتيجة ١٢ × ٥ ؟', 'options' => ['٥٠', '٥٥', '٦٠', '٦٥'], 'correctIndex' => 2, 'difficulty' => 'medium'],
                ['question' => 'ما نتيجة ١٥ × ٤ ؟', 'options' => ['٥٠', '٥٥', '٦٠', '٦٥'], 'correctIndex' => 2, 'difficulty' => 'medium'],
                ['question' => 'ما نتيجة ٨ × ٧ ؟', 'options' => ['٥٤', '٥٦', '٥٨', '٦٠'], 'correctIndex' => 1, 'difficulty' => 'medium'],
                ['question' => 'ما نتيجة ١١ × ٣ ؟', 'options' => ['٣٠', '٣٣', '٣٦', '٣٩'], 'correctIndex' => 1, 'difficulty' => 'medium'],
            ],
            'hard' => [
                ['question' => 'ما الجذر التربيعي لـ ١٤٤ ؟', 'options' => ['١٠', '١١', '١٢', '١٣'], 'correctIndex' => 2, 'difficulty' => 'hard'],
                ['question' => 'ما الجذر التربيعي لـ ٨١ ؟', 'options' => ['٧', '٨', '٩', '١٠'], 'correctIndex' => 2, 'difficulty' => 'hard'],
                ['question' => 'ما نتيجة ١٥² ؟', 'options' => ['٢١٥', '٢٢٥', '٢٣٥', '٢٤٥'], 'correctIndex' => 1, 'difficulty' => 'hard'],
                ['question' => 'ما نتيجة ١٣² ؟', 'options' => ['١٥٩', '١٦٩', '١٧٩', '١٨٩'], 'correctIndex' => 1, 'difficulty' => 'hard'],
                ['question' => 'ما الجذر التربيعي لـ ١٩٦ ؟', 'options' => ['١٢', '١٣', '١٤', '١٥'], 'correctIndex' => 2, 'difficulty' => 'hard'],
                ['question' => 'ما نتيجة ٢٥ × ٢٥ ؟', 'options' => ['٦٠٠', '٦٢٥', '٦٥٠', '٦٧٥'], 'correctIndex' => 1, 'difficulty' => 'hard'],
            ],
        ];
    }
}
