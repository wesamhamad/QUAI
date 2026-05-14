<?php

namespace Tests\Feature;

use App\QSpark\Http\Middleware\AllowEmbedding;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

/**
 * QSPARK is merged into QUAI as one app: its code lives under app/QSpark, its
 * routes (routes/qspark.php) are mounted under the /qspark URL prefix with the
 * `qspark.` route-name prefix, and it runs on its own `qspark` auth guard and
 * database connection. These tests lock in that wiring.
 */
class QsparkIntegrationTest extends TestCase
{
    public function test_qspark_routes_are_mounted_under_the_qspark_prefix(): void
    {
        foreach ([
            'qspark.login',
            'qspark.dev.login',
            'qspark.admin.dashboard',
            'qspark.faculty.dashboard',
            'qspark.dashboard.student',
        ] as $name) {
            $this->assertTrue(Route::has($name), "Route [{$name}] must be registered by the merged QSPARK app.");
            $this->assertStringStartsWith(
                'qspark',
                ltrim(Route::getRoutes()->getByName($name)->uri(), '/'),
                "Route [{$name}] must live under the /qspark URL prefix."
            );
        }
    }

    public function test_qspark_dev_route_accepts_the_three_demo_roles(): void
    {
        $route = Route::getRoutes()->getByName('qspark.dev.login');

        $this->assertNotNull($route);
        $this->assertSame('qspark/dev/{role?}', $route->uri());
        $this->assertSame('student|faculty|admin', $route->wheres['role'] ?? null);
    }

    public function test_qspark_service_providers_are_registered(): void
    {
        foreach ([
            \App\QSpark\Providers\QSparkServiceProvider::class,
            \App\QSpark\Providers\QSparkEventServiceProvider::class,
            \App\QSpark\Providers\ViewCacheServiceProvider::class,
        ] as $provider) {
            $this->assertNotEmpty(
                $this->app->getProviders($provider),
                "{$provider} must be registered in bootstrap/providers.php."
            );
        }
    }

    public function test_qspark_view_namespace_and_helpers_are_available(): void
    {
        $this->assertTrue(
            view()->exists('qspark::layouts.app'),
            'The qspark:: view namespace must point at resources/views/qspark-app.'
        );
        $this->assertTrue(function_exists('dashboardRedirectFor'));
        $this->assertTrue(function_exists('samlIdpForCurrentEnv'));

        $composer = json_decode(file_get_contents(base_path('composer.json')), true);
        $this->assertContains(
            'app/QSpark/Support/helpers.php',
            $composer['autoload']['files'] ?? [],
            'composer.json must autoload the QSPARK helpers file.'
        );
    }

    public function test_qspark_auth_guard_and_demo_mode_are_configured(): void
    {
        $this->assertSame('session', config('auth.guards.qspark.driver'));
        $this->assertSame('qspark_users', config('auth.guards.qspark.provider'));
        $this->assertSame(
            \App\QSpark\Models\User::class,
            config('auth.providers.qspark_users.model')
        );

        // demo_mode must resolve (config/app.php) — QSPARK reads it to skip SAML.
        $this->assertIsBool(config('app.demo_mode'));
    }

    public function test_qspark_uses_a_dedicated_database_connection(): void
    {
        $this->assertNotNull(
            config('database.connections.qspark'),
            'config/database.php must define the isolated `qspark` connection.'
        );

        // The connection-swap + guard-switch middleware must be wired into the
        // QSPARK route group (and the guard must run before Laravel's `auth`).
        $bootstrap = file_get_contents(base_path('bootstrap/app.php'));
        $this->assertStringContainsString(\App\QSpark\Http\Middleware\UseQSparkGuard::class . '::class', $bootstrap);
        $this->assertStringContainsString(\App\QSpark\Http\Middleware\UseQSparkConnection::class . '::class', $bootstrap);
        $this->assertStringContainsString('prependToPriorityList', $bootstrap);
    }

    public function test_allow_embedding_middleware_lets_quai_iframe_qspark(): void
    {
        $response = (new AllowEmbedding())->handle(
            Request::create('/qspark', 'GET'),
            fn () => new \Illuminate\Http\Response('ok')
        );

        $this->assertSame('SAMEORIGIN', $response->headers->get('X-Frame-Options'));
        $this->assertStringContainsString(
            "frame-ancestors 'self'",
            $response->headers->get('Content-Security-Policy'),
            'QSPARK responses must allow same-origin framing so the /qspark-demo wrapper works.'
        );
    }

    public function test_qspark_demo_iframe_wrapper_route_and_view_exist(): void
    {
        $this->assertTrue(Route::has('qspark-demo'), 'routes/web.php must keep the named qspark-demo wrapper route.');

        $routes = file_get_contents(base_path('routes/web.php'));
        $this->assertStringContainsString("view('qspark-demo'", $routes);
        // The wrapper is same-origin now — the iframe base comes from this app.
        $this->assertStringContainsString("url('/qspark')", $routes);
        $this->assertStringContainsString("'/dev/' . \$qsparkRole", $routes);
        $this->assertStringContainsString("'?next=' . rawurlencode(\$nextPath)", $routes);

        $viewPath = resource_path('views/qspark-demo.blade.php');
        $this->assertFileExists($viewPath);
        $view = file_get_contents($viewPath);
        $this->assertStringContainsString('<iframe', $view);
        $this->assertStringContainsString('src="{{ $qsparkUrl }}"', $view);
    }

    public function test_qspark_demo_route_exposes_role_specific_sections(): void
    {
        $routes = file_get_contents(base_path('routes/web.php'));

        foreach ([
            '/admin/dashboard', '/admin/users', '/admin/roles', '/admin/permissions',
            '/faculty/dashboard', '/faculty/courses', '/faculty/students', '/faculty/reports',
            '/dashboard-student', '/dashboard-student/grades', '/dashboard-student/courses',
            '/dashboard-student/recommendations', '/dashboard-student/chat',
        ] as $path) {
            $this->assertStringContainsString($path, $routes, "section path {$path} missing from the qspark-demo route.");
        }
    }

    public function test_home_view_maps_admin_faculty_student_to_qspark_roles(): void
    {
        $blade = file_get_contents(resource_path('views/home/index.blade.php'));

        $this->assertStringContainsString(
            "\$qsparkRole = \$isAdmin ? 'admin' : (\$isFaculty ? 'faculty' : 'student');",
            $blade,
            'The QUAI role must be mapped onto QSPARK\'s admin|faculty|student demo personas.'
        );
        $this->assertStringContainsString(
            "route('qspark-demo')",
            $blade,
            'The QSpark home card must link into QUAI\'s internal /qspark-demo iframe wrapper.'
        );
    }

    public function test_qspark_quick_login_honours_next_query_for_deep_links(): void
    {
        $controller = file_get_contents(base_path('app/QSpark/Http/Controllers/LocalLoginController.php'));

        $this->assertStringContainsString("query('next'", $controller);
        $this->assertStringContainsString('sanitizeNextPath', $controller);
        $this->assertStringContainsString('return redirect($next);', $controller);
    }
}
