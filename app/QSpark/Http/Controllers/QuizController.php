<?php

namespace App\QSpark\Http\Controllers;

use App\QSpark\Models\AiGeneratedQuestion;
use App\QSpark\Models\QuizQuestion;
use App\QSpark\Models\StudentQuizPerformance;
use App\QSpark\Services\OpenAiQuizGenerator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class QuizController extends Controller
{
    /**
     * Server-side endpoint called from the “Quiz” button.
     * Body: { quiz_url: ".../generate-quiz", course_code: "ACCT241" }
     *
     * Flow:
     *   0. DB cache hit on attachment_key → return immediately
     *   1. Direct OpenAI generation (slide download → upload → 3 parallel buckets)
     *   2. On generation failure → fall back to questions already stored in the DB
     *      (same course preferred, otherwise any course). Fallback questions carry
     *      their real correct_index from the original successful generation.
     */
    public function generateQuizFromFile(Request $request)
    {
        set_time_limit(300);

        $token = Session::get('qspark_token');
        $quizUrl = $request->input('quiz_url');
        $courseCode = $request->input('course_code');
        $lang = $request->input('lang');

        if (! $token) {
            return response()->json(['success' => false, 'message' => __('messages.auth_token_not_found')], 401);
        }
        if (! $quizUrl || ! $courseCode) {
            return response()->json(['success' => false, 'message' => 'Missing required parameters: quiz_url and course_code'], 400);
        }

        try {
            $attachmentKey = $this->extractAttachmentKeyFromUrl($quizUrl);

            Log::info('QUIZ: checking for cached questions', ['attachment_key' => $attachmentKey, 'course' => $courseCode]);

            // STEP 0: cache hit on this exact attachment
            if ($attachmentKey && QuizQuestion::hasQuestionsForAttachment($attachmentKey)) {
                $groupedQuestions = QuizQuestion::getAllQuestionsGrouped($attachmentKey, 6);
                $totalCount = count($groupedQuestions['easy']) + count($groupedQuestions['medium']) + count($groupedQuestions['hard']);

                if ($totalCount > 0) {
                    Session::put("quiz.$courseCode.grouped_questions", $groupedQuestions);
                    Session::put("quiz.$courseCode.attachment_key", $attachmentKey);
                    Session::put("quiz.$courseCode.courseCode", $courseCode);
                    Session::put("quiz.$courseCode.starting_difficulty", 'easy');

                    Log::info('QUIZ: using cached grouped questions', [
                        'easy_count' => count($groupedQuestions['easy']),
                        'medium_count' => count($groupedQuestions['medium']),
                        'hard_count' => count($groupedQuestions['hard']),
                        'total' => $totalCount,
                    ]);

                    return response()->json([
                        'success' => true,
                        'questions_count' => $totalCount,
                        'from_cache' => true,
                        'difficulty' => 'easy',
                        'redirect_url' => "/courses/{$courseCode}/quiz",
                    ]);
                }
            }

            // STEP 1: direct OpenAI generation
            $direct = $this->generateViaOpenAiDirect($quizUrl, $token, $courseCode, $attachmentKey, $lang);
            if ($direct !== null) {
                return $direct;
            }

            // STEP 2: DB fallback (real questions with real answers)
            Log::warning('QUIZ: direct OpenAI failed; falling back to DB questions', ['course' => $courseCode]);
            $fallback = $this->fallbackFromDb($courseCode);

            if (empty($fallback)) {
                Log::error('QUIZ: no DB questions available for fallback', ['course' => $courseCode]);

                return response()->json([
                    'success' => false,
                    'message' => __('messages.quiz_generator_maintenance'),
                ], 503);
            }

            $grouped = $this->groupQuestionsByDifficulty($fallback);
            $totalCount = count($grouped['easy']) + count($grouped['medium']) + count($grouped['hard']);

            // Note: NOT persisting fallback under $attachmentKey — we want generation
            // to be retried next time the user clicks Quiz on this file.
            Session::put("quiz.$courseCode.grouped_questions", $grouped);
            Session::put("quiz.$courseCode.attachment_key", $attachmentKey);
            Session::put("quiz.$courseCode.courseCode", $courseCode);
            Session::put("quiz.$courseCode.starting_difficulty", 'easy');

            Log::info('QUIZ: using DB fallback questions', [
                'easy_count' => count($grouped['easy']),
                'medium_count' => count($grouped['medium']),
                'hard_count' => count($grouped['hard']),
                'total' => $totalCount,
                'course' => $courseCode,
            ]);

            return response()->json([
                'success' => true,
                'questions_count' => $totalCount,
                'redirect_url' => "/courses/{$courseCode}/quiz",
                'source' => 'db-fallback',
            ]);
        } catch (\Throwable $e) {
            Log::error('QUIZ: fatal error', [
                'msg' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'success' => false,
                'message' => __('messages.quiz_generator_maintenance'),
            ], 500);
        }
    }

    /**
     * Pull a pool of real questions out of the database to use when live
     * generation fails. Same-course questions first; if none, any course's
     * questions. These already carry their original correct_index from a
     * prior successful generation.
     */
    private function fallbackFromDb(string $courseCode): array
    {
        $rows = QuizQuestion::byCourse($courseCode)
            ->inRandomOrder()
            ->limit(60)
            ->get();

        if ($rows->isEmpty()) {
            $rows = QuizQuestion::inRandomOrder()->limit(60)->get();
        }

        return $rows->map(fn ($q) => [
            'question' => $q->question,
            'options' => $q->options,
            'correctIndex' => (int) $q->correct_index,
            'difficulty' => $q->difficulty ?: 'medium',
            'type' => $q->type ?: 'enemy',
        ])->all();
    }

    /**
     * Direct OpenAI generation: download slide from QU API, hand to OpenAI,
     * store + redirect. Returns a JsonResponse on success, or null on failure
     * so the caller can fall back to DB-stored questions.
     */
    private function generateViaOpenAiDirect(string $quizUrl, string $token, string $courseCode, ?string $attachmentKey, ?string $lang)
    {
        try {
            // QU upstream URL convention: .../{attachments|ultra-files}/{id}/generate-quiz → .../{attachments|ultra-files}/{id}/download
            $slideUrl = preg_replace('#/generate-quiz/?$#', '/download', $quizUrl);
            if ($slideUrl === $quizUrl) {
                Log::warning('QUIZ direct: could not derive download URL', ['url' => $quizUrl]);

                return null;
            }

            $generator = OpenAiQuizGenerator::fromConfig();
            $allQuestions = $generator->generateFromSlideUrl($slideUrl, $token, $lang, $attachmentKey);

            if (empty($allQuestions)) {
                Log::warning('QUIZ direct: OpenAI returned no questions', [
                    'course' => $courseCode,
                    'attachment_key' => $attachmentKey,
                    'slide_url' => $slideUrl,
                ]);

                return null;
            }

            if ($attachmentKey) {
                $metadata = ['course_code' => $courseCode, 'thread_id' => 'openai-direct'];
                $keyParts = explode('_', $attachmentKey);
                if (count($keyParts) >= 3) {
                    $metadata['course_id'] = $keyParts[0];
                    $metadata['content_id'] = $keyParts[1];
                    $metadata['attachment_id'] = $keyParts[2];
                }
                QuizQuestion::storeQuestions($allQuestions, $attachmentKey, $metadata);
            }

            $grouped = $this->groupQuestionsByDifficulty($allQuestions);
            $totalCount = count($grouped['easy']) + count($grouped['medium']) + count($grouped['hard']);

            Session::put("quiz.$courseCode.grouped_questions", $grouped);
            Session::put("quiz.$courseCode.attachment_key", $attachmentKey);
            Session::put("quiz.$courseCode.courseCode", $courseCode);
            Session::put("quiz.$courseCode.starting_difficulty", 'easy');

            $this->logAiGeneration($courseCode, count($allQuestions), 'openai-direct');

            Log::info('QUIZ direct: success', [
                'course' => $courseCode,
                'attachment_key' => $attachmentKey,
                'total' => $totalCount,
            ]);

            return response()->json([
                'success' => true,
                'questions_count' => $totalCount,
                'redirect_url' => "/courses/{$courseCode}/quiz",
                'source' => 'openai-direct',
            ]);
        } catch (\Throwable $e) {
            Log::error('QUIZ direct: error', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'course' => $courseCode,
                'attachment_key' => $attachmentKey,
                'quiz_url' => $quizUrl,
            ]);

            return null;
        }
    }

    private function logAiGeneration(string $courseCode, int $count, string $threadId): void
    {
        try {
            $user = auth()->user();
            $instructorId = null;
            $studentId = null;
            if ($user) {
                if (method_exists($user, 'isFaculty') && $user->isFaculty()) {
                    $instructorId = $user->employee_id ?? $user->uuid;
                } else {
                    $studentId = $user->uuid ?? null;
                }
            }
            AiGeneratedQuestion::recordGeneration($instructorId, $studentId, null, $courseCode, $count, $threadId);
        } catch (\Throwable $e) {
            Log::warning('QUIZ: failed to record AI generation', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Extract attachment key from quiz URL
     * URL format: .../courses/{courseId}/contents/{contentId}/attachments/{attachmentId}/generate-quiz
     */
    private function extractAttachmentKeyFromUrl(string $url): ?string
    {
        if (preg_match('/courses\/([^\/]+)\/contents\/([^\/]+)\/attachments\/([^\/]+)/', $url, $matches)) {
            return "{$matches[1]}_{$matches[2]}_{$matches[3]}";
        }

        return null;
    }

    /**
     * Group all questions by difficulty for adaptive gameplay
     */
    private function groupQuestionsByDifficulty(array $allQuestions, int $perDifficulty = 6): array
    {
        $byDifficulty = [
            'easy' => [],
            'medium' => [],
            'hard' => [],
        ];

        foreach ($allQuestions as $q) {
            $diff = $q['difficulty'] ?? 'medium';
            if (isset($byDifficulty[$diff])) {
                $byDifficulty[$diff][] = $q;
            } else {
                $byDifficulty['medium'][] = $q;
            }
        }

        // Shuffle each difficulty pool and limit to perDifficulty
        foreach ($byDifficulty as $diff => &$pool) {
            shuffle($pool);
            $pool = array_slice($pool, 0, $perDifficulty);
        }

        return $byDifficulty;
    }

    /**
     * Select adaptive questions based on difficulty (legacy method, kept for compatibility)
     */
    private function selectAdaptiveQuestions(array $allQuestions, string $difficulty, int $count = 5): array
    {
        $byDifficulty = [
            'easy' => [],
            'medium' => [],
            'hard' => [],
        ];

        foreach ($allQuestions as $q) {
            $diff = $q['difficulty'] ?? 'medium';
            if (isset($byDifficulty[$diff])) {
                $byDifficulty[$diff][] = $q;
            } else {
                $byDifficulty['medium'][] = $q;
            }
        }

        // Shuffle each difficulty pool
        foreach ($byDifficulty as &$pool) {
            shuffle($pool);
        }

        $selected = [];

        // Strategy based on recommended difficulty:
        // - easy: 3 easy, 2 medium
        // - medium: 1 easy, 3 medium, 1 hard
        // - hard: 2 medium, 3 hard
        $distribution = match ($difficulty) {
            'easy' => ['easy' => 3, 'medium' => 2, 'hard' => 0],
            'hard' => ['easy' => 0, 'medium' => 2, 'hard' => 3],
            default => ['easy' => 1, 'medium' => 3, 'hard' => 1],
        };

        foreach ($distribution as $diff => $needed) {
            $available = array_splice($byDifficulty[$diff], 0, $needed);
            $selected = array_merge($selected, $available);
        }

        // If we don't have enough, fill from any remaining
        if (count($selected) < $count) {
            $remaining = array_merge($byDifficulty['easy'], $byDifficulty['medium'], $byDifficulty['hard']);
            shuffle($remaining);
            $needed = $count - count($selected);
            $selected = array_merge($selected, array_slice($remaining, 0, $needed));
        }

        // Shuffle final selection and return
        shuffle($selected);

        return array_slice($selected, 0, $count);
    }

    /**
     * Record quiz performance and return next question
     */
    public function recordPerformance(Request $request)
    {
        $studentId = auth()->user()?->uuid ?? session('student_id');

        if (! $studentId) {
            return response()->json(['success' => false, 'message' => 'Not authenticated'], 401);
        }

        try {
            $performance = StudentQuizPerformance::recordSession([
                'student_id' => $studentId,
                'course_code' => $request->input('course_code'),
                'attachment_key' => $request->input('attachment_key'),
                'session_id' => $request->input('session_id'),
                'total_questions' => $request->input('total_questions', 5),
                'correct_answers' => $request->input('correct_answers', 0),
                'wrong_answers' => $request->input('wrong_answers', 0),
                'lives_remaining' => $request->input('lives_remaining', 0),
                'total_time' => $request->input('total_time', 0),
                'avg_answer_time' => $request->input('avg_answer_time', 0),
                'fastest_answer' => $request->input('fastest_answer'),
                'slowest_answer' => $request->input('slowest_answer'),
                'starting_difficulty' => $request->input('starting_difficulty', 'medium'),
                'ending_difficulty' => $request->input('ending_difficulty', 'medium'),
                'difficulty_changes' => $request->input('difficulty_changes', []),
                'questions_answered' => $request->input('questions_answered', []),
            ]);

            return response()->json([
                'success' => true,
                'performance_score' => $performance->performance_score,
                'recommended_difficulty' => $performance->recommended_difficulty,
            ]);
        } catch (\Exception $e) {
            Log::error('QUIZ: failed to record performance', ['error' => $e->getMessage()]);

            return response()->json(['success' => false, 'message' => 'Failed to record performance'], 500);
        }
    }

    /**
     * Get next adaptive question during gameplay
     */
    public function getNextQuestion(Request $request)
    {
        $courseCode = $request->input('course_code');
        $attachmentKey = $request->input('attachment_key');
        $currentDifficulty = $request->input('current_difficulty', 'medium');
        $answeredIds = $request->input('answered_ids', []);
        $lives = $request->input('lives', 3);
        $avgTime = $request->input('avg_time', 15);

        // Adjust difficulty based on current performance
        $newDifficulty = $this->calculateNextDifficulty($currentDifficulty, $lives, $avgTime);

        // Get next question from DB
        $questions = QuizQuestion::getAdaptiveQuestions($attachmentKey, $newDifficulty, 1, $answeredIds);

        if (empty($questions)) {
            return response()->json([
                'success' => false,
                'message' => 'No more questions available',
            ]);
        }

        return response()->json([
            'success' => true,
            'question' => $questions[0],
            'new_difficulty' => $newDifficulty,
        ]);
    }

    /**
     * Calculate next difficulty based on performance
     */
    private function calculateNextDifficulty(string $currentDifficulty, int $lives, float $avgTime): string
    {
        // Lives: 3 = doing great, 2 = okay, 1 = struggling, 0 = game over
        // Time: < 10s = fast, 10-20s = normal, > 20s = slow

        $score = 0;

        // Lives factor (0-50 points)
        $score += ($lives / 3) * 50;

        // Speed factor (0-50 points)
        if ($avgTime < 10) {
            $score += 50;
        } elseif ($avgTime < 15) {
            $score += 35;
        } elseif ($avgTime < 20) {
            $score += 20;
        } else {
            $score += 10;
        }

        // Determine difficulty change
        if ($score >= 70) {
            // Doing great, increase difficulty
            return match ($currentDifficulty) {
                'easy' => 'medium',
                'medium' => 'hard',
                default => 'hard',
            };
        } elseif ($score < 40) {
            // Struggling, decrease difficulty
            return match ($currentDifficulty) {
                'hard' => 'medium',
                'medium' => 'easy',
                default => 'easy',
            };
        }

        // Keep same difficulty
        return $currentDifficulty;
    }

    /**
     * Export quiz questions to Word format for students
     * Only allows export once per attachment
     */
    public function exportQuestionsForStudent(Request $request)
    {
        $studentId = auth()->user()?->uuid ?? session('student_id');
        $courseCode = $request->input('course_code');
        $attachmentKey = $request->input('attachment_key');

        if (! $studentId) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح. يرجى تسجيل الدخول.',
            ], 401);
        }

        if (! $attachmentKey || ! $courseCode) {
            return response()->json([
                'success' => false,
                'message' => 'معلومات ناقصة. يرجى المحاولة مرة أخرى.',
            ], 400);
        }

        // Check if already exported
        if (\App\QSpark\Models\StudentQuizExport::hasExported($studentId, $attachmentKey)) {
            return response()->json([
                'success' => false,
                'message' => 'تم تصدير أسئلة هذا الملف مسبقاً. يُسمح بالتصدير مرة واحدة فقط.',
                'already_exported' => true,
            ], 400);
        }

        // Get questions for this attachment
        $questions = QuizQuestion::byAttachment($attachmentKey)
            ->orderBy('difficulty')
            ->get();

        if ($questions->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'لا توجد أسئلة متاحة للتصدير. يرجى إنشاء الاختبار أولاً.',
            ], 400);
        }

        // Generate Word document content
        $htmlContent = $this->generateStudentWordContent($questions, $courseCode);

        // Record the export
        \App\QSpark\Models\StudentQuizExport::recordExport(
            $studentId,
            $courseCode,
            $attachmentKey,
            $questions->count(),
            'word'
        );

        Log::info('QUIZ: student exported questions', [
            'student_id' => $studentId,
            'course_code' => $courseCode,
            'attachment_key' => $attachmentKey,
            'questions_count' => $questions->count(),
        ]);

        // Return as downloadable Word file
        $fileName = "quiz_{$courseCode}_".date('Y-m-d_His').'.doc';

        return response($htmlContent)
            ->header('Content-Type', 'application/msword')
            ->header('Content-Disposition', "attachment; filename=\"{$fileName}\"")
            ->header('Cache-Control', 'max-age=0');
    }

    /**
     * Check if student can export questions (hasn't exported before)
     */
    public function checkExportStatus(Request $request)
    {
        $studentId = auth()->user()?->uuid ?? session('student_id');
        $attachmentKey = $request->input('attachment_key');

        if (! $studentId || ! $attachmentKey) {
            return response()->json([
                'can_export' => false,
                'message' => 'معلومات ناقصة',
            ]);
        }

        $hasExported = \App\QSpark\Models\StudentQuizExport::hasExported($studentId, $attachmentKey);
        $hasQuestions = QuizQuestion::hasQuestionsForAttachment($attachmentKey);

        return response()->json([
            'can_export' => ! $hasExported && $hasQuestions,
            'has_exported' => $hasExported,
            'has_questions' => $hasQuestions,
        ]);
    }

    /**
     * Generate Word document content for student export (without answers)
     */
    private function generateStudentWordContent($questions, string $courseCode): string
    {
        $html = '<!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <style>
                body { font-family: "Traditional Arabic", "Simplified Arabic", Arial, sans-serif; direction: rtl; }
                .header { text-align: center; margin-bottom: 30px; }
                .question { margin-bottom: 25px; page-break-inside: avoid; }
                .question-text { font-weight: bold; margin-bottom: 10px; font-size: 14pt; }
                .options { margin-right: 20px; }
                .option { margin: 5px 0; font-size: 12pt; }
                .difficulty { color: #666; font-size: 10pt; margin-top: 5px; }
                hr { border: none; border-top: 1px dashed #ccc; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>أسئلة المقرر: '.htmlspecialchars($courseCode).'</h1>
                <p>تاريخ التصدير: '.date('Y-m-d H:i').'</p>
                <p>عدد الأسئلة: '.$questions->count().'</p>
            </div>';

        $questionNum = 1;
        foreach ($questions as $q) {
            $difficultyAr = match ($q->difficulty) {
                'easy' => 'سهل',
                'medium' => 'متوسط',
                'hard' => 'صعب',
                default => 'متوسط',
            };

            $html .= '<div class="question">';
            $html .= '<div class="question-text">'.$questionNum.'. '.htmlspecialchars($q->question).'</div>';
            $html .= '<div class="options">';

            $letters = ['أ', 'ب', 'ج', 'د'];
            foreach ($q->options as $idx => $option) {
                $letter = $letters[$idx] ?? ($idx + 1);
                $html .= '<div class="option">'.$letter.') '.htmlspecialchars($option).'</div>';
            }

            $html .= '</div>';
            $html .= '<div class="difficulty">المستوى: '.$difficultyAr.'</div>';
            $html .= '</div>';

            if ($questionNum < $questions->count()) {
                $html .= '<hr>';
            }

            $questionNum++;
        }

        $html .= '</body></html>';

        return $html;
    }
}
