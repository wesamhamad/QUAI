<?php

namespace App\QSpark\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Is this Blackboard file a chapter a quiz can be built from?
 *
 * A course shell carries more than lectures: grade sheets, the syllabus, the
 * welcome message, exam timetables, announcements, vocabulary lists. A quiz
 * generated from a grade sheet is nonsense, so the first time a student
 * presses «اختبار» on a file it is screened once, the verdict is kept, and a
 * file that is not a chapter is marked hidden with the reason shown to the
 * student. The verdict is remembered per attachment, so the question is
 * asked once per file, never once per student.
 *
 * With an OpenAI key the title (and the file name) are judged by the model;
 * without one a keyword screen does the same job on the names alone.
 */
class QuizContentScreener
{
    private const CACHE_PREFIX = 'quiz-screen:';

    /** Names that are never a chapter, whatever else they contain. */
    private const NOT_CHAPTER = [
        // grades / results
        'درجات', 'الدرجات', 'نتائج', 'النتائج', 'grade', 'grades', 'marks', 'result', 'results', 'score',
        // syllabus / course info / policy
        'منهجية', 'توصيف', 'خطة المقرر', 'معلومات المقرر', 'course info', 'syllabus', 'course outline', 'policy', 'policies', 'rubric',
        // welcome / intro / announcements
        'ترحيب', 'رسالة', 'مقدمة المقرر', 'welcome', 'announcement', 'إعلان', 'تنبيه', 'اعلان',
        // schedule / calendar / rooms
        'جدول', 'تقويم', 'calendar', 'schedule', 'timetable', 'القاعة', 'room', 'مواعيد',
        // exams admin
        'الاختبارات الفصلية', 'اختبار فصلي', 'exam dates', 'ملاحظات الإختبار', 'ملاحظات الاختبار', 'exam notes', 'تعليمات الاختبار',
        // glossaries / references / support
        'مصطلحات', 'vocabular', 'glossary', 'مصادر التعلم', 'learning resources', 'معلومات المدرس', 'teacher', 'instructor', 'ساعد', 'الأدلة الإرشادية', 'support', 'guide',
        // placeholders
        'ultradocumentbody', 'مستند جديد', 'untitled',
    ];

    /** @return array{chapter: bool, reason: string, reason_en: string, source: string, screened_at: string} */
    public function screen(string $attachmentKey, string $title, string $fileName = '', string $courseCode = ''): array
    {
        $cached = $this->verdict($attachmentKey);
        if ($cached !== null) {
            return $cached;
        }

        $verdict = $this->byModel($title, $fileName, $courseCode) ?? $this->byKeywords($title, $fileName);
        $verdict['screened_at'] = now()->toDateTimeString();
        Cache::forever(self::CACHE_PREFIX.$attachmentKey, $verdict);

        return $verdict;
    }

    /** The stored verdict for a file, or null when it was never screened. */
    public function verdict(string $attachmentKey): ?array
    {
        $v = Cache::get(self::CACHE_PREFIX.$attachmentKey);

        return is_array($v) ? $v : null;
    }

    public function forget(string $attachmentKey): void
    {
        Cache::forget(self::CACHE_PREFIX.$attachmentKey);
    }

    /** @return array{chapter: bool, reason: string, reason_en: string, source: string} */
    private function byKeywords(string $title, string $fileName): array
    {
        $text = mb_strtolower(trim($title.' '.$fileName));
        foreach (self::NOT_CHAPTER as $needle) {
            if (str_contains($text, mb_strtolower($needle))) {
                return [
                    'chapter' => false,
                    'reason' => 'هذا الملف ليس فصلاً من المقرر ('.$this->kindFor($needle).')، فلا يُبنى منه اختبار.',
                    'reason_en' => 'This file is not a course chapter ('.$this->kindForEn($needle).'), so no quiz is built from it.',
                    'source' => 'rules',
                ];
            }
        }

        return [
            'chapter' => true,
            'reason' => 'ملف محتوى دراسي — صالح لبناء اختبار.',
            'reason_en' => 'Course material — a quiz can be built from it.',
            'source' => 'rules',
        ];
    }

    private function kindFor(string $needle): string
    {
        $n = mb_strtolower($needle);

        return match (true) {
            str_contains($n, 'درج') || str_contains($n, 'نتائج') || str_contains($n, 'grade') || str_contains($n, 'mark') || str_contains($n, 'result') || str_contains($n, 'score') => 'كشف درجات أو نتائج',
            str_contains($n, 'منهج') || str_contains($n, 'توصيف') || str_contains($n, 'خطة') || str_contains($n, 'معلومات المقرر') || str_contains($n, 'syllabus') || str_contains($n, 'course info') || str_contains($n, 'outline') || str_contains($n, 'polic') || str_contains($n, 'rubric') => 'توصيف أو خطة المقرر',
            str_contains($n, 'ترحيب') || str_contains($n, 'رسالة') || str_contains($n, 'مقدمة') || str_contains($n, 'welcome') || str_contains($n, 'announce') || str_contains($n, 'علان') || str_contains($n, 'تنبيه') => 'رسالة أو إعلان',
            str_contains($n, 'جدول') || str_contains($n, 'تقويم') || str_contains($n, 'calendar') || str_contains($n, 'schedule') || str_contains($n, 'timetable') || str_contains($n, 'قاعة') || str_contains($n, 'room') || str_contains($n, 'مواعيد') => 'جدول أو مواعيد',
            str_contains($n, 'اختبار') || str_contains($n, 'exam') => 'تعليمات أو مواعيد اختبار',
            str_contains($n, 'مصطلح') || str_contains($n, 'vocab') || str_contains($n, 'glossary') => 'قائمة مصطلحات',
            default => 'معلومات عامة عن المقرر',
        };
    }

    private function kindForEn(string $needle): string
    {
        return match ($this->kindFor($needle)) {
            'كشف درجات أو نتائج' => 'a grade or results sheet',
            'توصيف أو خطة المقرر' => 'the course syllabus or outline',
            'رسالة أو إعلان' => 'a message or announcement',
            'جدول أو مواعيد' => 'a schedule or dates',
            'تعليمات أو مواعيد اختبار' => 'exam instructions or dates',
            'قائمة مصطلحات' => 'a vocabulary list',
            default => 'general course information',
        };
    }

    /**
     * The model's verdict, when an OpenAI key is configured. Null on any
     * failure so the keyword screen decides instead of blocking the student.
     *
     * @return array{chapter: bool, reason: string, reason_en: string, source: string}|null
     */
    private function byModel(string $title, string $fileName, string $courseCode): ?array
    {
        $key = (string) config('services.openai.api_key', '');
        if ($key === '' || config('app.demo_mode')) {
            return null;
        }
        try {
            $response = Http::withToken($key)->timeout(20)->post('https://api.openai.com/v1/chat/completions', [
                'model' => (string) config('services.openai.model', 'gpt-4o-mini'),
                'temperature' => 0,
                'response_format' => ['type' => 'json_object'],
                'messages' => [
                    ['role' => 'system', 'content' => 'You screen Blackboard course files before a quiz is generated from them. A file is a CHAPTER when it carries teachable course content: lecture slides, a chapter, a topic, a worked example, exercises with solutions, a textbook section. It is NOT a chapter when it is administrative: grade sheets, results, syllabus, course info, welcome messages, announcements, schedules, exam dates or instructions, vocabulary lists, teacher info, support guides. Answer JSON: {"chapter": true|false, "reason_ar": "<one sentence in Arabic for the student>", "reason_en": "<one sentence in English>"}.'],
                    ['role' => 'user', 'content' => "Course: {$courseCode}\nTitle: {$title}\nFile name: {$fileName}"],
                ],
            ]);
            if (! $response->successful()) {
                return null;
            }
            $json = json_decode((string) ($response->json('choices.0.message.content') ?? ''), true);
            if (! is_array($json) || ! array_key_exists('chapter', $json)) {
                return null;
            }

            return [
                'chapter' => (bool) $json['chapter'],
                'reason' => (string) ($json['reason_ar'] ?? ''),
                'reason_en' => (string) ($json['reason_en'] ?? ''),
                'source' => 'model',
            ];
        } catch (\Throwable $e) {
            Log::warning('QuizContentScreener: model call failed', ['error' => $e->getMessage()]);

            return null;
        }
    }
}
