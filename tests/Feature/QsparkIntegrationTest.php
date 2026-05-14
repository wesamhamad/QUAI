<?php

namespace Tests\Feature;

use Tests\TestCase;

class QsparkIntegrationTest extends TestCase
{
    public function test_qspark_subapp_directory_is_present(): void
    {
        $this->assertDirectoryExists(base_path('QSPARK'));
        $this->assertFileExists(base_path('QSPARK/artisan'));
        $this->assertFileExists(base_path('QSPARK/.env'));
        $this->assertFileExists(base_path('QSPARK/database/database.sqlite'));
        $this->assertFileExists(base_path('QSPARK/routes/web.php'));
    }

    public function test_qspark_demo_url_is_configured(): void
    {
        $this->assertSame(
            'http://127.0.0.1:8001',
            config('quai.qspark_demo_url'),
            'config/quai.php must publish qspark_demo_url for the home-page card.'
        );
    }

    public function test_home_view_renders_role_based_qspark_card(): void
    {
        $bladePath = resource_path('views/home/index.blade.php');
        $this->assertFileExists($bladePath);

        $blade = file_get_contents($bladePath);

        $this->assertStringContainsString(
            "config('quai.qspark_demo_url'",
            $blade,
            'The home view must read the QSPARK base URL from config.'
        );
        $this->assertStringContainsString(
            "/dev/' . \$qsparkRole",
            $blade,
            'The QSPARK card must deep-link into QSPARK\'s /dev/{role} quick-login route.'
        );
        $this->assertStringContainsString(
            "route('qspark-demo')",
            $blade,
            'The QSpark card must link into QUAI\'s internal /qspark-demo iframe wrapper.'
        );
        $this->assertStringNotContainsString(
            'target="_blank"',
            $blade,
            'The QSpark card must stay inside QUAI\'s shell (no new tab) so the embed renders inline.'
        );
        $this->assertStringContainsString(
            'منصة التعلم والتجربة الأكاديمية',
            $blade,
            'The unified QSpark card title must be present on the home page.'
        );
        // Old in-app /qspark card has been retired in favour of the standalone QSPARK demo.
        $this->assertStringNotContainsString(
            "route('qspark.index')",
            $blade,
            'The legacy in-app QSpark card linking to route("qspark.index") must be removed.'
        );
    }

    public function test_qspark_demo_iframe_wrapper_route_and_view_exist(): void
    {
        $routes = file_get_contents(base_path('routes/web.php'));
        $this->assertStringContainsString(
            "->name('qspark-demo')",
            $routes,
            'routes/web.php must define a named qspark-demo route hosting the iframe wrapper.'
        );
        $this->assertStringContainsString(
            "view('qspark-demo'",
            $routes,
            'qspark-demo route must render the resources/views/qspark-demo.blade.php wrapper.'
        );

        $viewPath = resource_path('views/qspark-demo.blade.php');
        $this->assertFileExists($viewPath);
        $view = file_get_contents($viewPath);
        $this->assertStringContainsString('@extends(\'layouts.dashboard\')', $view);
        $this->assertStringContainsString('<iframe', $view);
        $this->assertStringContainsString('src="{{ $qsparkUrl }}"', $view);
        $this->assertStringContainsString('qsparkSections', $view);
        $this->assertStringContainsString('qspark-embed__tabs', $view);
    }

    public function test_qspark_demo_route_exposes_role_specific_sections(): void
    {
        $routes = file_get_contents(base_path('routes/web.php'));

        // Admin section paths must be present so admins can deep-link into QSPARK's
        // admin pages (dashboard / users / roles / permissions) from inside the iframe.
        foreach (['/admin/dashboard', '/admin/users', '/admin/roles', '/admin/permissions'] as $path) {
            $this->assertStringContainsString($path, $routes, "admin section path {$path} missing from qspark-demo route.");
        }

        // Faculty section paths must be present (dashboard / courses / students / reports).
        foreach (['/faculty/dashboard', '/faculty/courses', '/faculty/students', '/faculty/reports'] as $path) {
            $this->assertStringContainsString($path, $routes, "faculty section path {$path} missing from qspark-demo route.");
        }

        // Student section paths must be present (main dashboard plus the major sub-pages).
        foreach (['/dashboard-student', '/dashboard-student/grades', '/dashboard-student/courses', '/dashboard-student/recommendations', '/dashboard-student/chat'] as $path) {
            $this->assertStringContainsString($path, $routes, "student section path {$path} missing from qspark-demo route.");
        }

        // The wrapper must build the iframe URL as /dev/{role}?next=... so QSPARK
        // can land the user directly on the chosen section after auto-login.
        $this->assertStringContainsString("'/dev/' . \$qsparkRole", $routes);
        $this->assertStringContainsString("'?next=' . rawurlencode(\$nextPath)", $routes);
    }

    public function test_qspark_quick_login_honours_next_query_for_deep_links(): void
    {
        $controller = file_get_contents(base_path('QSPARK/app/Http/Controllers/LocalLoginController.php'));

        $this->assertStringContainsString(
            "query('next'",
            $controller,
            'LocalLoginController::quickLogin must read the ?next= query so the QUAI wrapper can deep-link.'
        );
        $this->assertStringContainsString(
            'sanitizeNextPath',
            $controller,
            'QSPARK must sanitize the ?next= path to block open-redirects to external hosts.'
        );
        $this->assertStringContainsString(
            'return redirect($next);',
            $controller,
            'QSPARK quickLogin must redirect to the sanitized next path when one is supplied.'
        );
    }

    public function test_qspark_middleware_allows_quai_to_embed_via_csp(): void
    {
        $middleware = file_get_contents(base_path('QSPARK/app/Http/Middleware/PerformanceOptimizationMiddleware.php'));
        $this->assertStringContainsString(
            'QSPARK_FRAME_ANCESTORS',
            $middleware,
            'QSPARK middleware must read QSPARK_FRAME_ANCESTORS from env so QUAI can embed it.'
        );
        $this->assertStringContainsString(
            'frame-ancestors',
            $middleware,
            'QSPARK middleware must emit a CSP frame-ancestors directive when embedding is enabled.'
        );

        $env = file_get_contents(base_path('QSPARK/.env'));
        $this->assertStringContainsString('QSPARK_FRAME_ANCESTORS=', $env);
        $this->assertStringContainsString('http://127.0.0.1:8007', $env);
        $this->assertStringContainsString('SESSION_SAME_SITE=none', $env);
        $this->assertStringContainsString('SESSION_SECURE_COOKIE=true', $env);
    }

    public function test_home_view_maps_admin_faculty_student_to_qspark_roles(): void
    {
        $blade = file_get_contents(resource_path('views/home/index.blade.php'));

        $this->assertStringContainsString(
            "\$qsparkRole = \$isAdmin ? 'admin' : (\$isFaculty ? 'faculty' : 'student');",
            $blade,
            'QUAI role must be mapped onto QSPARK\'s admin|faculty|student demo personas.'
        );
    }

    public function test_qspark_routes_expose_dev_quick_login(): void
    {
        $routes = file_get_contents(base_path('QSPARK/routes/web.php'));

        $this->assertStringContainsString(
            "/dev/{role?}",
            $routes,
            'QSPARK must expose the /dev/{role} quick-login route the home card depends on.'
        );
        $this->assertStringContainsString(
            "'role', 'student|faculty|admin'",
            $routes,
            'QSPARK /dev route must accept the three demo roles QUAI maps onto.'
        );
    }

    public function test_start_servers_script_boots_qspark_on_8001(): void
    {
        $script = file_get_contents(base_path('start-servers.sh'));

        $this->assertStringContainsString('start_qspark', $script);
        $this->assertStringContainsString('QSPARK_PATH', $script);
        $this->assertStringContainsString('--port=8001', $script);
        $this->assertStringContainsString('QSPARK_PID', $script);
    }
}
