<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\DemoData;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * QMentor chatbot — demo build.
 *
 * The SPA's useSmartAdvisor hook calls /api/v1/smart-advisor/*. In the real
 * product these endpoints proxied an LLM; here every response is served from
 * {@see DemoData} so the chatbot works without any sidecar service.
 *
 * The production model is the fine-tuned ALLaM assistant hosted on Hugging Face:
 * https://huggingface.co/wesam3/qu-llm-assistant-allam — in this demo build the
 * conversations, history, and streamed answers are all canned dummy data so the
 * chat feature can be understood end-to-end without that model running.
 */
class SmartAdvisorController extends Controller
{
    /** Resolve which student's chat history/answers to serve. */
    private function resolveStudentId(Request $request): string
    {
        $impersonate = $request->query('as') ?: $request->input('as');
        if (is_string($impersonate) && $impersonate !== '') {
            $user = Auth::user();
            if ($user instanceof User && $user->hasAnyRole(['Faculty', 'Admin', 'Super Admin'])) {
                return $impersonate;
            }
        }
        $user = Auth::user();
        if ($user instanceof User && !empty($user->student_id)) {
            return $user->student_id;
        }
        return DemoData::students()[0]['student_id'];
    }

    public function conversations(Request $r): JsonResponse
    {
        return response()->json([
            'conversations' => DemoData::chatbotConversations($this->resolveStudentId($r)),
            'source' => 'api',
        ]);
    }

    public function history(Request $r, string $conversationId): JsonResponse
    {
        return response()->json([
            'messages' => DemoData::chatbotHistory($conversationId, $this->resolveStudentId($r)),
            'source'   => 'api',
        ]);
    }

    public function archive(Request $r, string $conversationId): JsonResponse
    {
        // Demo build is read-only — pretend the archive succeeded.
        return response()->json(['ok' => true]);
    }

    public function escalate(Request $r): JsonResponse
    {
        return response()->json([
            'ok' => true,
            'ticket_id' => 'TCK-' . strtoupper(substr(md5((string) microtime(true)), 0, 8)),
        ]);
    }

    /**
     * Stream a canned answer using Server-Sent Events. The SPA reads chunks
     * shaped like {"content": "...", "done": false} and a final
     * {"content": "", "done": true}. Picking the answer is keyword-based
     * over the dummy answer bank in {@see DemoData::chatbotAnswer()}.
     */
    public function chatStream(Request $r): StreamedResponse
    {
        $message = (string) $r->input('message', '');
        $studentId = $this->resolveStudentId($r);
        $reply = DemoData::chatbotAnswer($message, $studentId);

        return new StreamedResponse(function () use ($reply) {
            // Stream the reply in word-sized chunks to mimic LLM streaming.
            $words = preg_split('/(\s+)/u', $reply, -1, PREG_SPLIT_DELIM_CAPTURE) ?: [];
            $buffer = '';
            $flushEvery = 3;
            $i = 0;
            foreach ($words as $w) {
                $buffer .= $w;
                $i++;
                if ($i % $flushEvery === 0) {
                    echo 'data: ' . json_encode(['content' => $buffer, 'done' => false], JSON_UNESCAPED_UNICODE) . "\n\n";
                    @ob_flush();
                    @flush();
                    $buffer = '';
                    usleep(35000);
                }
            }
            if ($buffer !== '') {
                echo 'data: ' . json_encode(['content' => $buffer, 'done' => false], JSON_UNESCAPED_UNICODE) . "\n\n";
            }
            echo 'data: ' . json_encode(['content' => '', 'done' => true], JSON_UNESCAPED_UNICODE) . "\n\n";
            echo "data: [DONE]\n\n";
            @ob_flush();
            @flush();
        }, 200, [
            'Content-Type'      => 'text/event-stream',
            'Cache-Control'     => 'no-cache, no-transform',
            'X-Accel-Buffering' => 'no',
            'Connection'        => 'keep-alive',
        ]);
    }
}
