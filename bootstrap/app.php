<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
        then: function (): void {
            // Merged QSPARK app. Its routes live under the /qspark URL prefix
            // and the `qspark.` route-name prefix. UseQSparkGuard makes the
            // `qspark` auth guard the default for the request and
            // UseQSparkConnection makes `qspark` the default DB connection, so
            // QSPARK's unqualified auth()/DB:: calls resolve against its own
            // User model and database. AllowEmbedding lets QUAI's /qspark-demo
            // page iframe these pages.
            Route::middleware([
                'web',
                \App\QSpark\Http\Middleware\UseQSparkGuard::class,
                \App\QSpark\Http\Middleware\UseQSparkConnection::class,
                \App\QSpark\Http\Middleware\SetLocale::class,
                \App\QSpark\Http\Middleware\TrackDailyVisits::class,
                \App\QSpark\Http\Middleware\DetectEmbeddedMode::class,
                \App\QSpark\Http\Middleware\AllowEmbedding::class,
            ])
                ->prefix('qspark')
                ->name('qspark.')
                ->group(base_path('routes/qspark.php'));

            Route::middleware([
                'api',
                \App\QSpark\Http\Middleware\UseQSparkGuard::class,
                \App\QSpark\Http\Middleware\UseQSparkConnection::class,
            ])
                ->prefix('qspark/api')
                ->name('qspark.api.')
                ->group(base_path('routes/qspark-api.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
            'sdaia.policy' => \App\Http\Middleware\EnsureSdaiaPolicyAccepted::class,

            // Merged QSPARK middleware aliases (referenced from routes/qspark.php).
            'qspark.role' => \App\QSpark\Http\Middleware\CheckRole::class,
            'qspark.cache.views' => \App\QSpark\Http\Middleware\ViewCacheMiddleware::class,
            'qspark.timeout' => \App\QSpark\Http\Middleware\IncreaseExecutionTime::class,
        ]);

        // UseQSparkGuard switches the default auth guard to `qspark`. It must run
        // before Laravel's `auth` middleware (Authenticate) — which the framework
        // pulls to a fixed priority slot — otherwise `auth` checks QUAI's `web`
        // guard and bounces authenticated QSPARK users to the login page. The
        // priority list keys `auth` by its contract, not the concrete class.
        $middleware->prependToPriorityList(
            before: \Illuminate\Contracts\Auth\Middleware\AuthenticatesRequests::class,
            prepend: \App\QSpark\Http\Middleware\UseQSparkGuard::class,
        );

        // SAML ACS and QSPARK's session-auth game API are hit by external/JS
        // callers that cannot carry a CSRF token cookie.
        $middleware->validateCsrfTokens(except: [
            'saml/*',
            'qspark/api/game/*',
        ]);

        // Redirect unauthenticated requests to the matching login form:
        // QSPARK routes to the QSPARK login, everything else to QUAI's.
        $middleware->redirectGuestsTo(fn (Request $request) => $request->is('qspark*')
            ? route('qspark.login')
            : route('demo.login'));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (TooManyRequestsHttpException $e, Request $request) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'error' => [
                        'message' => 'Rate limit exceeded. Please try again later.',
                        'type' => 'rate_limit_error',
                        'retry_after' => $e->getHeaders()['Retry-After'] ?? 60,
                    ],
                ], 429);
            }
        });

        // Expired CSRF tokens on the logout forms render Laravel's bare 419
        // page, which is confusing for users who only wanted to sign out.
        // Laravel's prepareException() wraps TokenMismatchException into an
        // HttpException(419) before render callbacks run, so we match on the
        // wrapper here. Treat a stale token on a logout URL as the logout
        // itself: drop the session and bounce to the matching login page.
        // For other URLs we redirect back to login with a flash so the user
        // can retry.
        $exceptions->render(function (HttpException $e, Request $request) {
            if ($e->getStatusCode() !== 419) {
                return null;
            }

            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'error' => [
                        'message' => 'Session expired. Please refresh and try again.',
                        'type' => 'token_mismatch',
                    ],
                ], 419);
            }

            $isQspark = $request->is('qspark*');
            $loginRoute = $isQspark ? 'qspark.login' : 'demo.login';
            $isLogout = $request->is('logout') || $request->is('qspark/logout');

            if ($isLogout) {
                try {
                    Auth::guard($isQspark ? 'qspark' : null)->logout();
                } catch (\Throwable $ignored) {
                }
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                return redirect()->route($loginRoute);
            }

            return redirect()->route($loginRoute)
                ->with('status', 'Your session expired. Please sign in again.');
        });
    })->create();
