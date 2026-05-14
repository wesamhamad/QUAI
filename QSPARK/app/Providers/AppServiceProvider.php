<?php

namespace App\Providers;


use Illuminate\Support\Facades\Event;
use App\Listeners\SamlLoginListener;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Slides\Saml2\Events\SignedIn;
use Illuminate\Support\ServiceProvider;
use App\Models\User;


class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // Force HTTPS in production and staging
        if (config('app.env') === 'production' || config('app.env') === 'staging') {
            URL::forceScheme('https');
        }

        // Sub-path awareness. In production QSPARK is mounted under a path of
        // the shared domain (APP_URL=https://quailab.dev/qspark) behind the
        // QUAI nginx vhost — see deploy/nginx/quailab.dev.conf. When APP_URL
        // carries a path, force it as the root URL so route(), url(), asset()
        // and even redirect('/') stay inside /qspark instead of escaping to
        // the parent QUAI app. Locally APP_URL has no path, so this is a no-op.
        $appUrl = (string) config('app.url');
        $basePath = parse_url($appUrl, PHP_URL_PATH);
        if ($basePath !== null && trim($basePath, '/') !== '') {
            URL::forceRootUrl($appUrl);
        }

        // Remove this line - use EventServiceProvider instead
        // Event::listen(SignedIn::class, SamlLoginListener::class);

        // Share user names with all views so header shows consistently across pages
        View::composer('*', function ($view) {
            try {
                $data = $view->getData();
                // If controller already provided names, don't override
                if (isset($data['studentArabicName']) && $data['studentArabicName'] !== null) {
                    return;
                }

                $user = Auth::user();

                // For Admin and Faculty: get name from database (use 'name' column)
                if ($user && ($user->isAdmin() || $user->isFaculty())) {
                    // Use the 'name' column directly as primary source
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
                    // Try to get from logged-in user if available
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
                        $baseUrl = match(config('app.env')) {
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
                        Log::warning('View composer: Exception fetching profile', ['error' => $e->getMessage()]);
                    }
                    return [
                        'studentArabicName' => null,
                        'studentEnglishName' => null,
                    ];
                });

                $view->with($names);
            } catch (\Throwable $e) {
                Log::debug('View composer error', ['error' => $e->getMessage()]);
            }
        });
    }
}
