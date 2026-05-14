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
