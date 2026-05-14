<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->trustProxies(at: '*');
        $middleware->web(append: [
            \App\Http\Middleware\SetLocale::class,
            \App\Http\Middleware\TrackDailyVisits::class,
            \App\Http\Middleware\DetectEmbeddedMode::class,
            // Emits CSP frame-ancestors so the QUAI shell can iframe QSPARK.
            \App\Http\Middleware\AllowEmbedding::class,
        ]);
        
        $middleware->validateCsrfTokens(except: [
            'livewire/*',
            'saml/*',
            'api/game/*', // Game API uses X-CSRF-TOKEN header instead
        ]);

        $middleware->alias([
            'cache.views' => \App\Http\Middleware\ViewCacheMiddleware::class,
            'role' => \App\Http\Middleware\CheckRole::class,
            'timeout' => \App\Http\Middleware\IncreaseExecutionTime::class,
        ]);

        $middleware->prependToGroup('web', [
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->expectsJson()) {
                if ($e instanceof NotFoundHttpException) {
                    return response()->json([
                        'success' => false,
                        'data' => [],
                        'message' => 'Resource not found',
                    ], 404);
                } elseif ($e instanceof AccessDeniedHttpException) {
                    return response()->json([
                        'success' => false,
                        'data' => [],
                        'message' => 'Access denied',
                    ], 403);
                } elseif ($e instanceof AuthenticationException) {
                    return response()->json([
                        'success' => false,
                        'data' => [],
                        'message' => 'Unauthenticated. Your token has expired or is invalid.',
                    ], 401);
                } elseif ($e instanceof UnauthorizedHttpException) {
                    return response()->json([
                        'success' => false,
                        'data' => [],
                        'message' => 'Unauthorized access',
                    ], 401);
                } else {
                    return response()->json([
                        'success' => false,
                        'data' => [],
                        'message' => $e->getMessage(),
                    ], 500);
                }
            }
        });
    })->create();
