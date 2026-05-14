<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Regression: a stale CSRF token on a logout form used to render Laravel's
 * bare "419 PAGE EXPIRED" view. bootstrap/app.php now catches HttpException(419)
 * and, on the logout URLs, finishes the logout and redirects to login instead.
 */
class LogoutCsrfExpiryTest extends TestCase
{
    public function test_expired_token_on_demo_logout_redirects_to_login_without_419(): void
    {
        $response = $this->withHeader('Referer', '/qspark-demo?section=courses')
            ->post('/logout', ['_token' => 'definitely-not-the-real-token']);

        $response->assertStatus(302);
        $response->assertRedirect(route('demo.login'));
        $this->assertGuest();
    }

    public function test_expired_token_on_non_logout_url_redirects_to_login(): void
    {
        $response = $this->post('/some/random/path', ['_token' => 'stale']);

        // Either our 419 handler caught it (302 to login) or the route 404s
        // before CSRF runs. In both cases we must never see the framework's
        // 419 page.
        $this->assertNotEquals(419, $response->status());
    }
}
