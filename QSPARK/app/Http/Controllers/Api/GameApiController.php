<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StartGameRequest;
use App\Http\Requests\Api\SubmitAnswerRequest;
use App\Http\Requests\Api\TimeoutRequest;
use App\Models\StudentPlayHour;
use App\Services\GameSessionService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class GameApiController extends Controller
{
    protected GameSessionService $gameService;

    public function __construct(GameSessionService $gameService)
    {
        $this->gameService = $gameService;
    }

    /**
     * Start a new game session
     * POST /api/game/start
     */
    public function start(StartGameRequest $request): JsonResponse
    {
        try {
            $session = $this->gameService->startSession(
                $request->input('course_code'),
                $request->input('attachment_key')
            );

            return response()->json([
                'success' => true,
                'data' => $session,
            ]);
        } catch (\Exception $e) {
            Log::error('GameAPI: Failed to start game', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to start game session',
            ], 500);
        }
    }

    /**
     * Get current game state
     * GET /api/game/{sessionId}/state
     */
    public function getState(string $sessionId): JsonResponse
    {
        try {
            $state = $this->gameService->getSessionState($sessionId);

            if (!$state) {
                return response()->json([
                    'success' => false,
                    'message' => 'Game session not found',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $state,
            ]);
        } catch (\Exception $e) {
            Log::error('GameAPI: Failed to get state', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get game state',
            ], 500);
        }
    }

    /**
     * Get next question based on adaptive difficulty
     * GET /api/game/{sessionId}/question
     */
    public function getQuestion(string $sessionId): JsonResponse
    {
        try {
            $result = $this->gameService->getNextQuestion($sessionId);

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'game_over' => $result['game_over'] ?? false,
                    'message' => $result['message'] ?? 'Failed to get question',
                ], $result['game_over'] ?? false ? 200 : 404);
            }

            // Format response for frontend compatibility
            return response()->json([
                'success' => true,
                'data' => [
                    'question' => $result['question'],
                    'current_index' => $result['question']['question_number'] - 1,
                    'lives' => $result['game_state']['lives'],
                    'score' => $result['game_state']['score'],
                    'total_questions' => $result['question']['total_questions'],
                    'current_difficulty' => $result['game_state']['current_difficulty'],
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('GameAPI: Failed to get question', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to get question',
            ], 500);
        }
    }

    /**
     * Submit an answer and get result
     * POST /api/game/{sessionId}/answer
     */
    public function submitAnswer(string $sessionId, SubmitAnswerRequest $request): JsonResponse
    {
        try {
            $result = $this->gameService->processAnswer(
                $sessionId,
                $request->input('question_id'),
                $request->input('answer_index'),
                $request->input('time_taken')
            );

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            Log::error('GameAPI: Failed to process answer', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to process answer',
            ], 500);
        }
    }

    /**
     * Handle question timeout
     * POST /api/game/{sessionId}/timeout
     */
    public function handleTimeout(string $sessionId, TimeoutRequest $request): JsonResponse
    {
        try {
            $result = $this->gameService->handleTimeout(
                $sessionId,
                $request->input('question_id')
            );

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            Log::error('GameAPI: Failed to handle timeout', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to handle timeout',
            ], 500);
        }
    }

    /**
     * Get the authenticated student's accumulated play minutes for today.
     * GET /api/game/today-minutes
     */
    public function todayMinutes(): JsonResponse
    {
        $authUser = auth()->user();
        $studentId = $authUser?->username
            ?? $authUser?->uuid
            ?? session('student_id');
        $minutes = $studentId ? StudentPlayHour::getTodayMinutes($studentId) : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'student_id' => $studentId,
                'today_play_minutes' => $minutes,
                'today_play_percentage' => min(($minutes / 60) * 100, 100),
            ],
        ]);
    }

    /**
     * End game session and get final results
     * POST /api/game/{sessionId}/end
     */
    public function endGame(string $sessionId): JsonResponse
    {
        try {
            $result = $this->gameService->endSession($sessionId);

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            Log::error('GameAPI: Failed to end game', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to end game',
            ], 500);
        }
    }

    /**
     * Validate a move/action in the game
     * POST /api/game/{sessionId}/validate-action
     */
    public function validateAction(string $sessionId, Request $request): JsonResponse
    {
        $request->validate([
            'action_type' => 'required|string|in:jump,move,collision',
            'data' => 'required|array',
        ]);

        try {
            $result = $this->gameService->validateAction(
                $sessionId,
                $request->input('action_type'),
                $request->input('data')
            );

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            Log::error('GameAPI: Failed to validate action', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to validate action',
            ], 500);
        }
    }
}

