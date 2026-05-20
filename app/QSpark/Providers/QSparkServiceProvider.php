<?php

namespace App\QSpark\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

/**
 * Service provider for the merged QSPARK app (formerly QSPARK's AppServiceProvider).
 * Registers the `qspark::` view namespace and the QSPARK header view composer.
 */
class QSparkServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Force HTTPS in production and staging.
        if (config('app.env') === 'production' || config('app.env') === 'staging') {
            URL::forceScheme('https');
        }

        // QSPARK blade views live under resources/views/qspark-app and are
        // referenced as qspark::* so they never collide with QUAI's views.
        View::addNamespace('qspark', resource_path('views/qspark-app'));

        // Course code → English name map, built from the demo fixture's
        // academic plan section so the dashboard / final-exams / timetable
        // cards can render English course names when the UI is in English.
        // Cached per-request (the closure result is captured by reference).
        // Static fallback map for demo course codes that aren't present in the
        // fixture JSON's course_name_en fields. Keeps the grades / courses
        // pages fully localized in EN even when the upstream data only carries
        // the Arabic name. Codes are normalised (whitespace collapsed) before
        // lookup so 'MIS 110' and 'MIS  110' both resolve.
        $staticCourseEnFallback = [
            'ACCT120' => 'Principles of Financial Accounting',
            'ACCT231' => 'Principles of Managerial Accounting',
            'ACCT240' => 'Intermediate Accounting I',
            'ACCT241' => 'Cost Accounting',
            'ACCT350' => 'Intermediate Accounting II',
            'ACCT353' => 'Accounting Information Systems',
            'ACCT354' => 'Governmental and Non-Profit Accounting',
            'ACCT355' => 'Zakat and Tax Accounting',
            'ARAB101' => 'Arabic Language Skills',
            'ARAB106' => 'Reading Skill I',
            'ARAB107' => 'Writing Skill I (Spelling)',
            'ARAB108' => 'Writing Skill II (Functional Writing)',
            'ARAB118' => 'Speaking Skill I',
            'ARAB140' => 'Listening and Comprehension Skill',
            'BUS001'  => 'Entrepreneurship',
            'BUS111'  => 'Principles of Management and Organization',
            'BUS231'  => 'Managerial Communications',
            'BUS240'  => 'Organizational Behavior',
            'ECON110' => 'Principles of Microeconomics',
            'ECON120' => 'Principles of Macroeconomics',
            'FIN230'  => 'Principles of Finance',
            'IC101'   => 'Introduction to Islamic Culture',
            'IC102'   => 'Islam and Society Building',
            'IC103'   => 'The Economic System in Islam',
            'ISPM356' => 'Saudi Commercial Law',
            'MATH111' => 'Mathematics in Social Sciences I',
            'MATH122' => 'Mathematics in Social Sciences II',
            'MIS110'  => 'Introduction to Technology',
            'MIS231'  => 'Introduction to Computer Applications',
            'MIS242'  => 'Introduction to Management Information Systems',
            'MKTG120' => 'Principles of Marketing',
            'POM241'  => 'Operations Management',
            'PSYCH101'=> 'Thinking Skills and Learning Methods',
            'QUN003'  => 'Principles of Quantitative Analysis I',
            'QUN004'  => 'Principles of Quantitative Analysis II',
            'SKL002'  => 'University Skills',
            'STAT124' => 'Statistics in Economics and Management I',
            'STAT235' => 'Statistics in Economics and Management II',
        ];

        $normaliseCode = static function (string $code): string {
            return preg_replace('/\s+/u', '', $code) ?? $code;
        };

        $courseEnNames = null;
        $loadCourseEnNames = static function () use (&$courseEnNames, $normaliseCode): array {
            if ($courseEnNames !== null) {
                return $courseEnNames;
            }
            $courseEnNames = [];
            $file = base_path('resources/fixtures/student_demo.json');
            if (! is_file($file)) {
                return $courseEnNames;
            }
            $json = json_decode((string) file_get_contents($file), true);
            $walk = function ($node) use (&$walk, &$courseEnNames, $normaliseCode) {
                if (! is_array($node)) {
                    return;
                }
                $code = $node['course_code'] ?? $node['cource_code'] ?? null;
                $en   = $node['course_name_en'] ?? $node['cource_name_en'] ?? null;
                if ($code && $en) {
                    $key = $normaliseCode((string) $code);
                    if (! isset($courseEnNames[$key])) {
                        $courseEnNames[$key] = $en;
                    }
                }
                foreach ($node as $child) {
                    if (is_array($child)) {
                        $walk($child);
                    }
                }
            };
            $walk(is_array($json) ? $json : []);
            return $courseEnNames;
        };

        // Course-name view helper. Returns the English name from the fixture
        // (or the static fallback map) when the UI locale is English and a
        // mapping exists for the code; otherwise returns the supplied Arabic
        // name unchanged so AR users and unknown courses still see something
        // readable.
        View::share('courseLabel', static function (?string $code, ?string $arabicName) use ($loadCourseEnNames, $staticCourseEnFallback, $normaliseCode): string {
            $ar = trim((string) $arabicName);
            $code = trim((string) $code);
            if (app()->getLocale() !== 'en') {
                return $ar;
            }
            $key = $normaliseCode($code);
            $map = $loadCourseEnNames();
            return $map[$key] ?? $staticCourseEnFallback[$key] ?? $ar;
        });

        // Translator for SIS-sourced Arabic strings (activity types, campus
        // names, semester labels, ...) that are returned from the API in
        // Arabic regardless of UI locale. Shared with every qspark:: view so
        // blade can do {{ $sisLabel($value) }} without each view rebuilding a
        // mapping. On the Arabic locale the input is returned untouched.
        View::share('sisLabel', static function (?string $value): string {
            $value = trim((string) $value);
            if ($value === '') {
                return '';
            }
            if (app()->getLocale() !== 'en') {
                return $value;
            }

            // Exact-match lookups for known SIS labels.
            $exact = [
                'نظري' => __('messages.theoretical'),
                'تدريب' => __('messages.training'),
                'عملي' => __('messages.practical'),
                'مقر الجامعة الرئيس طالبات' => __('messages.main_campus_female'),
                'مقر الجامعة الرئيس طلاب' => __('messages.main_campus_male'),
                'مقر الجامعة الرئيس - طالبات' => __('messages.main_campus_female'),
                'مقر الجامعة الرئيس - طلاب' => __('messages.main_campus_male'),
                'غير محدد' => __('messages.not_specified'),
                'المقررات' => __('messages.sis_courses'),
            ];
            if (isset($exact[$value])) {
                return $exact[$value];
            }

            // Pattern matches for SIS-generated headings like
            // "الفصل الدراسي 461" / "المعدل الفصلي: 4.32".
            if (preg_match('/^الفصل الدراسي\s+(.+)$/u', $value, $m)) {
                return __('messages.sis_semester').' '.$m[1];
            }
            if (preg_match('/^المعدل الفصلي\s*[:\-]?\s*(.+)$/u', $value, $m)) {
                return __('messages.sis_semester_gpa').': '.$m[1];
            }

            return $value;
        });

        // Share user names with QSPARK views only (scoped to qspark::* so QUAI
        // views are never touched) so the QSPARK header renders consistently.
        View::composer('qspark::*', function ($view) {
            try {
                $data = $view->getData();
                if (isset($data['studentArabicName']) && $data['studentArabicName'] !== null) {
                    return;
                }

                $user = Auth::guard('qspark')->user();

                // For Admin and Faculty: get name from database (use 'name' column)
                if ($user && ($user->isAdmin() || $user->isFaculty())) {
                    $displayName = $user->name;

                    $view->with([
                        'studentArabicName' => $displayName ?: 'مستخدم',
                        'studentEnglishName' => $displayName ?: 'User',
                    ]);
                    return;
                }

                // For Students: fetch from API
                $token = session('qspark_token');
                if (empty($token)) {
                    if ($user) {
                        $arabicName = $user->arabic_full_name ?: $user->getFullArabicName();
                        $englishName = $user->english_full_name ?: $user->getFullEnglishName();
                        if ($arabicName || $englishName) {
                            $view->with([
                                'studentArabicName' => $arabicName ?: $englishName,
                                'studentEnglishName' => $englishName ?: $arabicName,
                            ]);
                            return;
                        }
                    }
                    return;
                }

                $cacheKey = 'student_profile_names_' . md5($token);
                $names = Cache::remember($cacheKey, 1800, function () use ($token) {
                    try {
                        $baseUrl = match (config('app.env')) {
                            'local' => env('QU_API_URL', 'http://127.0.0.1:8001'),
                            'production' => 'https://api.qu.edu.sa',
                            default => 'https://api-test.qu.edu.sa',
                        };
                        $apiUrl = $baseUrl . '/api/v3/me';

                        $resp = Http::timeout(15)
                            ->withHeaders([
                                'Authorization' => 'Bearer ' . $token,
                                'Accept' => 'application/json',
                            ])
                            ->get($apiUrl);

                        if ($resp->successful()) {
                            $profile = $resp->json();
                            $studentProfile = $profile['data']['profile'] ?? null;

                            if ($studentProfile) {
                                return [
                                    'studentArabicName' => $studentProfile['name'] ?? null,
                                    'studentEnglishName' => $studentProfile['name_en'] ?? null,
                                ];
                            }
                        }
                    } catch (\Throwable $e) {
                        Log::warning('QSPARK view composer: exception fetching profile', ['error' => $e->getMessage()]);
                    }

                    return [
                        'studentArabicName' => null,
                        'studentEnglishName' => null,
                    ];
                });

                $view->with($names);
            } catch (\Throwable $e) {
                Log::debug('QSPARK view composer error', ['error' => $e->getMessage()]);
            }
        });
    }
}
