<?php

namespace App\QSpark\Support;

use Illuminate\Support\Facades\Log;

/**
 * Read-only fallback fixture mirroring a real student's API responses.
 *
 * When an upstream call to api.qu.edu.sa fails (any error: 4xx, 5xx, network, timeout)
 * the relevant slice of resources/fixtures/student_layan.json is returned so the
 * student-facing pages still render with sample data instead of breaking.
 */
class StudentFixture
{
    private static ?array $bundle = null;

    public static function load(): array
    {
        if (self::$bundle !== null) {
            return self::$bundle;
        }

        // Prefer the sanitized demo fixture; fall back to legacy if present.
        $candidates = [
            base_path('resources/fixtures/student_demo.json'),
            base_path('resources/fixtures/student_layan.json'),
        ];
        $file = null;
        foreach ($candidates as $candidate) {
            if (is_file($candidate)) {
                $file = $candidate;
                break;
            }
        }
        if ($file === null) {
            self::$bundle = [];
            return self::$bundle;
        }

        $data = json_decode((string) file_get_contents($file), true);
        self::$bundle = is_array($data) ? $data : [];
        return self::$bundle;
    }

    /**
     * Map an upstream API path to the matching fixture slice.
     * Accepts both bare paths ("/time-table") and absolute URLs.
     */
    public static function forEndpoint(string $endpoint): ?array
    {
        $bundle = self::load();
        $path = parse_url($endpoint, PHP_URL_PATH) ?: $endpoint;
        $path = '/' . ltrim($path, '/');

        $map = [
            '/api/v3/me'                              => 'profile',
            '/me'                                     => 'profile',
            '/student/courses'                        => 'courses',
            '/api/v2/student/courses'                 => 'courses',
            '/time-table'                             => 'timetable',
            '/api/v2/time-table'                      => 'timetable',
            '/absences-with-details'                  => 'absences',
            '/api/v2/absences-with-details'           => 'absences',
            '/final-exams'                            => 'final_exams',
            '/api/v2/final-exams'                     => 'final_exams',
            '/academic-advisor'                       => 'academic_advisor',
            '/api/v2/academic-advisor'                => 'academic_advisor',
            '/rewards'                                => 'rewards',
            '/api/v2/rewards'                         => 'rewards',
            '/student-academic-transactions'          => 'academic_transactions',
            '/api/v2/student-academic-transactions'   => 'academic_transactions',
        ];

        if (isset($map[$path])) {
            // The profile slice is persona-aware so the "switch student"
            // feature can view the dashboard as any demo student.
            if ($map[$path] === 'profile') {
                return self::profile();
            }

            return $bundle[$map[$path]] ?? null;
        }

        if (preg_match('#/blackboard/courses/([^/]+)/contents/?$#', $path, $m)) {
            $ext = $m[1];
            return $bundle['blackboard']['contents_by_external_id'][$ext] ?? null;
        }

        return null;
    }

    /**
     * Student profile, with the active demo persona's identity + headline
     * academic numbers merged on top of the base fixture. Lets the demo
     * "switch student" without a separate fixture bundle per persona.
     */
    public static function profile(): ?array
    {
        $profile = self::load()['profile'] ?? null;
        if ($profile === null) {
            return null;
        }

        $override = DemoStudents::currentProfileOverride();
        if ($override !== [] && isset($profile['data']['profile'])) {
            $profile['data']['profile'] = array_replace_recursive(
                $profile['data']['profile'],
                $override
            );
        }

        return $profile;
    }

    public static function courses(): ?array               { return self::load()['courses'] ?? null; }
    public static function timetable(): ?array             { return self::load()['timetable'] ?? null; }
    public static function absences(): ?array              { return self::load()['absences'] ?? null; }
    public static function finalExams(): ?array            { return self::load()['final_exams'] ?? null; }
    public static function academicAdvisor(): ?array       { return self::load()['academic_advisor'] ?? null; }
    public static function rewards(): ?array               { return self::load()['rewards'] ?? null; }
    public static function academicTransactions(): ?array  { return self::load()['academic_transactions'] ?? null; }

    public static function blackboardContents(string $externalId): ?array
    {
        return self::load()['blackboard']['contents_by_external_id'][$externalId] ?? null;
    }

    public static function logServed(string $context, string $endpoint): void
    {
        Log::info('StudentFixture: served fallback', [
            'context' => $context,
            'endpoint' => $endpoint,
        ]);
    }
}
