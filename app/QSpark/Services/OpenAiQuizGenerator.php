<?php

namespace App\QSpark\Services;

use Illuminate\Http\Client\Pool;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAiQuizGenerator
{
    private const QUESTIONS_PER_DIFFICULTY = 6;

    private const MAX_PDF_BYTES = 25 * 1024 * 1024;

    public function __construct(
        private readonly string $apiKey,
        private readonly string $model = 'gpt-4.1-mini',
    ) {}

    public static function fromConfig(): self
    {
        $key = (string) config('services.openai.api_key');
        if ($key === '') {
            throw new \RuntimeException('OPENAI_API_KEY is not set');
        }

        return new self(
            apiKey: $key,
            model: (string) (config('services.openai.model') ?: 'gpt-4.1-mini'),
        );
    }

    /**
     * Generate 18 MCQs (6 easy / 6 medium / 6 hard) from a slide URL.
     *
     * When $attachmentKey is provided, the OpenAI file_id is cached for
     * {@see self::FILE_CACHE_TTL_SECONDS} so subsequent generations for the
     * same attachment skip the slide download + OpenAI upload step. The
     * file is NOT deleted from OpenAI while the cache entry is live; once
     * the cache expires it becomes orphaned (small cost) and the next call
     * re-uploads.
     */
    private const FILE_CACHE_TTL_SECONDS = 3600;

    public function generateFromSlideUrl(string $slideUrl, string $bearerToken, ?string $lang = null, ?string $attachmentKey = null): array
    {
        // Demo mode: synthesize a fixed bank of 18 MCQs (6 easy / 6 medium / 6 hard)
        // without contacting OpenAI.
        if (config('app.demo_mode')) {
            return $this->demoQuestionBank($lang);
        }

        $startedAt = microtime(true);
        Log::info('OpenAiQuizGenerator: start', [
            'slide_url' => $slideUrl,
            'lang' => $lang,
            'attachment_key' => $attachmentKey,
        ]);

        $cacheKey = $attachmentKey ? "openai_file:{$attachmentKey}" : null;
        $fileId = $cacheKey ? Cache::get($cacheKey) : null;
        $reusedFile = (bool) $fileId;

        if (! $fileId) {
            $fileId = $this->downloadAndUpload($slideUrl, $bearerToken, $startedAt);
            if ($cacheKey) {
                Cache::put($cacheKey, $fileId, self::FILE_CACHE_TTL_SECONDS);
            }
        } else {
            Log::info('OpenAiQuizGenerator: reusing cached OpenAI file_id', [
                'file_id' => $fileId,
                'attachment_key' => $attachmentKey,
            ]);
        }

        try {
            try {
                $questions = $this->generateAllBucketsParallel($fileId, $lang);
            } catch (\RuntimeException $e) {
                // If the cached file_id is stale (deleted on OpenAI's side or
                // expired beyond reach), evict it and re-upload once.
                if ($reusedFile && $cacheKey && $this->isStaleFileError($e)) {
                    Log::warning('OpenAiQuizGenerator: cached file_id stale; re-uploading', [
                        'attachment_key' => $attachmentKey,
                        'old_file_id' => $fileId,
                    ]);
                    Cache::forget($cacheKey);
                    $fileId = $this->downloadAndUpload($slideUrl, $bearerToken, $startedAt);
                    Cache::put($cacheKey, $fileId, self::FILE_CACHE_TTL_SECONDS);
                    $reusedFile = false;
                    $questions = $this->generateAllBucketsParallel($fileId, $lang);
                } else {
                    throw $e;
                }
            }

            Log::info('OpenAiQuizGenerator: done', [
                'count' => count($questions),
                'elapsed_ms' => (int) ((microtime(true) - $startedAt) * 1000),
                'reused_file' => $reusedFile,
            ]);

            return $questions;
        } finally {
            // Only delete when the caller did not opt into caching — cached
            // files must stay on OpenAI for the cache TTL.
            if (! $cacheKey) {
                $this->deleteFromOpenAi($fileId);
            }
        }
    }

    /**
     * Static MCQ bank used in demo mode so the quiz game has playable content
     * without contacting OpenAI. 6 easy / 6 medium / 6 hard.
     */
    private function demoQuestionBank(?string $lang): array
    {
        $isAr = ($lang === 'ar');
        $easy = [
            ['q' => $isAr ? 'ما هي وحدة قياس البيانات الأصغر؟' : 'What is the smallest unit of digital data?',
             'o' => ['Bit', 'Byte', 'Kilobyte', 'Megabyte'], 'c' => 0],
            ['q' => $isAr ? 'ماذا تعني CPU؟' : 'What does CPU stand for?',
             'o' => ['Central Process Utility', 'Central Processing Unit', 'Compute Power Unit', 'Computer Personal Unit'], 'c' => 1],
            ['q' => $isAr ? 'ما هي لغة الويب الأساسية؟' : 'Which language is the backbone of the web?',
             'o' => ['Python', 'C++', 'HTML', 'Swift'], 'c' => 2],
            ['q' => $isAr ? 'ما هو RAM؟' : 'What is RAM?',
             'o' => ['Permanent storage', 'Volatile memory', 'A processor', 'A network device'], 'c' => 1],
            ['q' => $isAr ? 'ما هو HTTP؟' : 'What does HTTP stand for?',
             'o' => ['HyperText Transfer Protocol', 'High Transfer Type Protocol', 'Hyper Tool Transfer Page', 'Host Type Transfer Page'], 'c' => 0],
            ['q' => $isAr ? 'أي مما يلي قاعدة بيانات؟' : 'Which of these is a database?',
             'o' => ['MySQL', 'Linux', 'Apache', 'Nginx'], 'c' => 0],
        ];
        $medium = [
            ['q' => $isAr ? 'ما هي درجة تعقيد البحث الثنائي؟' : 'Time complexity of binary search?',
             'o' => ['O(n)', 'O(n log n)', 'O(log n)', 'O(1)'], 'c' => 2],
            ['q' => $isAr ? 'ما الذي يحدث في طبقة الشبكة في OSI؟' : 'OSI network layer is responsible for?',
             'o' => ['Bit transmission', 'Routing', 'Encryption', 'Sessions'], 'c' => 1],
            ['q' => $isAr ? 'أي مما يلي ليس SQL DML؟' : 'Which is NOT a SQL DML statement?',
             'o' => ['SELECT', 'INSERT', 'CREATE', 'UPDATE'], 'c' => 2],
            ['q' => $isAr ? 'ما هو الفرق بين stack و queue؟' : 'Stack vs Queue ordering?',
             'o' => ['Both FIFO', 'Both LIFO', 'Stack LIFO, Queue FIFO', 'Stack FIFO, Queue LIFO'], 'c' => 2],
            ['q' => $isAr ? 'ما هو ACID في قواعد البيانات؟' : 'Which is NOT part of ACID?',
             'o' => ['Atomicity', 'Consistency', 'Isolation', 'Indexing'], 'c' => 3],
            ['q' => $isAr ? 'ما المنفذ الافتراضي لـ HTTPS؟' : 'Default HTTPS port?',
             'o' => ['80', '8080', '443', '22'], 'c' => 2],
        ];
        $hard = [
            ['q' => $isAr ? 'ما هو مبدأ Liskov في SOLID؟' : 'Liskov Substitution Principle states?',
             'o' => ['Subclasses must be interchangeable with their base', 'Avoid global state', 'Prefer composition over inheritance', 'Keep modules small'], 'c' => 0],
            ['q' => $isAr ? 'ما هي شجرة AVL؟' : 'An AVL tree guarantees?',
             'o' => ['Hash uniqueness', 'O(log n) height', 'Constant rebalance time', 'Linear traversal'], 'c' => 1],
            ['q' => $isAr ? 'أي مما يلي ليس خوارزمية فرز مستقرة؟' : 'Which sort is NOT stable?',
             'o' => ['Merge sort', 'Bubble sort', 'Quick sort', 'Insertion sort'], 'c' => 2],
            ['q' => $isAr ? 'ما الفرق بين TCP و UDP؟' : 'TCP differs from UDP because it is?',
             'o' => ['Connectionless', 'Unreliable', 'Connection-oriented', 'Broadcast-only'], 'c' => 2],
            ['q' => $isAr ? 'ما هو CAP theorem؟' : 'CAP theorem trades off?',
             'o' => ['Consistency, Availability, Partition tolerance', 'Caching, Atomicity, Performance', 'Concurrency, Authorization, Persistence', 'None'], 'c' => 0],
            ['q' => $isAr ? 'أي مما يلي NoSQL columnar؟' : 'Which database is columnar NoSQL?',
             'o' => ['MongoDB', 'Redis', 'Cassandra', 'PostgreSQL'], 'c' => 2],
        ];

        $out = [];
        foreach ([['easy', $easy], ['medium', $medium], ['hard', $hard]] as [$diff, $bank]) {
            foreach ($bank as $row) {
                $out[] = [
                    'question' => $row['q'],
                    'options' => $row['o'],
                    'correct_index' => $row['c'],
                    'difficulty' => $diff,
                ];
            }
        }
        return $out;
    }

    private function downloadAndUpload(string $slideUrl, string $bearerToken, float $startedAt): string
    {
        $pdfBytes = $this->downloadSlide($slideUrl, $bearerToken);
        Log::info('OpenAiQuizGenerator: slide downloaded', [
            'bytes' => strlen($pdfBytes),
            'elapsed_ms' => (int) ((microtime(true) - $startedAt) * 1000),
        ]);

        $fileId = $this->uploadToOpenAi($pdfBytes);
        Log::info('OpenAiQuizGenerator: file uploaded to OpenAI', [
            'file_id' => $fileId,
            'elapsed_ms' => (int) ((microtime(true) - $startedAt) * 1000),
        ]);

        return $fileId;
    }

    private function isStaleFileError(\Throwable $e): bool
    {
        $msg = $e->getMessage();

        return str_contains($msg, 'invalid_file') || str_contains($msg, 'HTTP 404');
    }

    private function downloadSlide(string $url, string $token): string
    {
        $res = Http::withToken($token)
            ->timeout(20)
            ->withOptions(['stream' => false])
            ->get($url);

        if (! $res->successful()) {
            throw new \RuntimeException("Slide download failed (HTTP {$res->status()})");
        }

        $body = $res->body();
        if (strlen($body) > self::MAX_PDF_BYTES) {
            throw new \RuntimeException('Slide exceeds 25MB limit');
        }

        return $body;
    }

    private function uploadToOpenAi(string $pdfBytes): string
    {
        $res = Http::withToken($this->apiKey)
            ->timeout(30)
            ->attach('file', $pdfBytes, 'slide.pdf')
            ->post('https://api.openai.com/v1/files', [
                'purpose' => 'user_data',
            ]);

        if (! $res->successful()) {
            Log::error('OpenAiQuizGenerator: file upload failed', [
                'status' => $res->status(),
                'body' => $res->body(),
            ]);
            throw new \RuntimeException("OpenAI file upload HTTP {$res->status()}");
        }

        $id = (string) $res->json('id');
        if ($id === '') {
            throw new \RuntimeException('OpenAI file upload returned no id');
        }

        return $id;
    }

    /**
     * Fire all 3 difficulty buckets at OpenAI in parallel from t=0.
     *
     * If any bucket comes back with `invalid_file` (a known race when the
     * file_id was uploaded moments earlier), that bucket alone is retried
     * once after a 1.5s pause. Wall-time on the happy path is the slowest
     * single bucket call (~10–15s) instead of warmup + parallel (~25–35s).
     */
    private function generateAllBucketsParallel(string $fileId, ?string $lang): array
    {
        $diffs = ['easy', 'medium', 'hard'];
        $responses = $this->poolBuckets($fileId, $lang, $diffs);

        $merged = [];
        $needRetry = [];

        foreach ($diffs as $diff) {
            $res = $responses[$diff] ?? null;
            if ($res instanceof Response && $res->successful()) {
                foreach ($this->parseBucket($this->extractOutputText($res), $diff) as $row) {
                    $merged[] = $row;
                }

                continue;
            }
            if ($res instanceof Response && $this->isInvalidFileError($res)) {
                $needRetry[] = $diff;

                continue;
            }
            $this->throwBucketError($diff, $res, 'first attempt');
        }

        if (! empty($needRetry)) {
            Log::warning('OpenAiQuizGenerator: invalid_file race, retrying buckets', [
                'buckets' => $needRetry,
                'file_id' => $fileId,
            ]);
            usleep(1_500_000);
            $retry = $this->poolBuckets($fileId, $lang, $needRetry);

            foreach ($needRetry as $diff) {
                $res = $retry[$diff] ?? null;
                if (! $res instanceof Response || ! $res->successful()) {
                    $this->throwBucketError($diff, $res, 'after retry');
                }
                foreach ($this->parseBucket($this->extractOutputText($res), $diff) as $row) {
                    $merged[] = $row;
                }
            }
        }

        return $merged;
    }

    private function poolBuckets(string $fileId, ?string $lang, array $diffs): array
    {
        $payloads = [];
        foreach ($diffs as $diff) {
            $payloads[$diff] = $this->buildBucketPayload($fileId, $lang, $diff);
        }

        return Http::pool(function (Pool $pool) use ($payloads) {
            $calls = [];
            foreach ($payloads as $diff => $body) {
                $calls[] = $pool->as($diff)
                    ->withToken($this->apiKey)
                    ->timeout(28)
                    ->acceptJson()
                    ->asJson()
                    ->post('https://api.openai.com/v1/responses', $body);
            }

            return $calls;
        });
    }

    private function throwBucketError(string $difficulty, $res, string $phase): void
    {
        $status = $res instanceof Response ? $res->status() : 'no-response';
        $body = $res instanceof Response ? $res->body() : (string) $res;
        $errorCode = $res instanceof Response ? (string) ($res->json('error.code') ?? '') : '';
        Log::error('OpenAiQuizGenerator: bucket call failed', [
            'difficulty' => $difficulty,
            'phase' => $phase,
            'status' => $status,
            'error_code' => $errorCode,
            'body' => $body,
        ]);
        $codePart = $errorCode !== '' ? " ({$errorCode})" : '';
        throw new \RuntimeException("OpenAI bucket {$difficulty} HTTP {$status}{$codePart}");
    }

    private function isInvalidFileError(Response $res): bool
    {
        if ($res->status() !== 400) {
            return false;
        }
        $code = (string) ($res->json('error.code') ?? '');

        return $code === 'invalid_file';
    }

    private function buildBucketPayload(string $fileId, ?string $lang, string $difficulty): array
    {
        $langInstruction = match ($lang) {
            'ar' => 'Write all questions and options in Arabic.',
            'en' => 'Write all questions and options in English.',
            default => 'Write the questions in the dominant language of the file content.',
        };

        $bucketBrief = match ($difficulty) {
            'easy' => 'EASY — recall / definitions, direct from the source.',
            'medium' => 'MEDIUM — application / comparison across concepts.',
            'hard' => 'HARD — analysis / synthesis / edge cases.',
        };

        $count = self::QUESTIONS_PER_DIFFICULTY;

        $instructions = <<<TXT
You are an expert quiz writer for university course material.
Read the entire attached file — it may contain text, images, scanned pages, diagrams, equations, or handwritten content. Treat all of these as valid course content.
Produce exactly {$count} multiple-choice questions at the {$bucketBrief}
Each question has exactly 4 options and one correct answer.
{$langInstruction}
Never write meta questions about the file format itself.
TXT;

        $schema = [
            'type' => 'object',
            'additionalProperties' => false,
            'required' => ['questions'],
            'properties' => [
                'questions' => [
                    'type' => 'array',
                    'minItems' => $count,
                    'maxItems' => $count,
                    'items' => [
                        'type' => 'object',
                        'additionalProperties' => false,
                        'required' => ['question', 'options', 'correct_index'],
                        'properties' => [
                            'question' => ['type' => 'string'],
                            'options' => [
                                'type' => 'array',
                                'minItems' => 4,
                                'maxItems' => 4,
                                'items' => ['type' => 'string'],
                            ],
                            'correct_index' => ['type' => 'integer', 'minimum' => 0, 'maximum' => 3],
                        ],
                    ],
                ],
            ],
        ];

        return [
            'model' => $this->model,
            'temperature' => 0.3,
            'instructions' => $instructions,
            'input' => [[
                'role' => 'user',
                'content' => [
                    ['type' => 'input_file', 'file_id' => $fileId],
                    ['type' => 'input_text', 'text' => "Generate the {$count} {$difficulty} quiz questions from the attached file."],
                ],
            ]],
            'text' => [
                'format' => [
                    'type' => 'json_schema',
                    'name' => "quiz_{$difficulty}",
                    'strict' => true,
                    'schema' => $schema,
                ],
            ],
        ];
    }

    private function extractOutputText(Response $res): string
    {
        $outputText = $res->json('output_text');
        if (is_string($outputText) && $outputText !== '') {
            return $outputText;
        }

        foreach ((array) $res->json('output') as $item) {
            if (($item['type'] ?? '') !== 'message') {
                continue;
            }
            foreach ($item['content'] ?? [] as $c) {
                if (($c['type'] ?? '') === 'output_text' && isset($c['text'])) {
                    return (string) $c['text'];
                }
            }
        }

        Log::error('OpenAiQuizGenerator: no output_text in Responses API reply', [
            'status' => $res->status(),
            'body' => mb_substr($res->body(), 0, 2000),
        ]);
        throw new \RuntimeException('OpenAI Responses API returned no output_text');
    }

    private function deleteFromOpenAi(string $fileId): void
    {
        try {
            Http::withToken($this->apiKey)
                ->timeout(10)
                ->delete("https://api.openai.com/v1/files/{$fileId}");
        } catch (\Throwable $e) {
            Log::warning('OpenAiQuizGenerator: file cleanup failed', [
                'file_id' => $fileId,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function parseBucket(string $rawJson, string $difficulty): array
    {
        $parsed = json_decode($rawJson, true);
        if (! is_array($parsed) || ! isset($parsed['questions']) || ! is_array($parsed['questions'])) {
            Log::error('OpenAiQuizGenerator: malformed JSON from OpenAI', [
                'difficulty' => $difficulty,
                'json_error' => json_last_error_msg(),
                'raw' => mb_substr($rawJson, 0, 2000),
            ]);
            throw new \RuntimeException("OpenAI returned malformed JSON for {$difficulty}");
        }

        $out = [];
        foreach ($parsed['questions'] as $r) {
            if (count($out) >= self::QUESTIONS_PER_DIFFICULTY) {
                break;
            }
            $out[] = [
                'question' => trim((string) ($r['question'] ?? '')),
                'options' => array_values(array_map('strval', $r['options'] ?? [])),
                'correctIndex' => (int) ($r['correct_index'] ?? 0),
                'difficulty' => $difficulty,
                'explanation' => '',
            ];
        }

        return $out;
    }
}
