<?php

namespace Tests\Unit;

use App\Models\CludeAgent;
use App\Models\ServiceModelAssignment;
use App\Services\WebScraperService;
use Tests\TestCase;

class CoopTrainingUnitTest extends TestCase
{
    // ── WebScraperService Tests ──

    public function test_web_scraper_service_can_be_instantiated(): void
    {
        $scraper = app(WebScraperService::class);
        $this->assertInstanceOf(WebScraperService::class, $scraper);
    }

    public function test_web_scraper_returns_string(): void
    {
        $scraper = new WebScraperService();
        $result = $scraper->scrapeUrl('https://example.com', 15000);
        $this->assertIsString($result);
    }

    public function test_web_scraper_returns_empty_for_invalid_url(): void
    {
        $scraper = new WebScraperService();
        $result = $scraper->scrapeUrl('https://nonexistent.invalid.test', 5000);
        $this->assertEmpty($result);
    }

    public function test_web_scraper_scrape_multiple_combines_content(): void
    {
        $scraper = new WebScraperService();
        $result = $scraper->scrapeMultiple(['https://example.com']);
        $this->assertIsString($result);
    }

    public function test_web_scraper_with_links_returns_array(): void
    {
        $scraper = new WebScraperService();
        $result = $scraper->scrapeUrlWithLinks('https://example.com', 15000);
        $this->assertIsArray($result);
        $this->assertArrayHasKey('text', $result);
        $this->assertArrayHasKey('links', $result);
    }

    // ── CludeAgent Type Constants ──

    public function test_type_constants_are_distinct(): void
    {
        $this->assertNotEquals(CludeAgent::TYPE_GENERAL, CludeAgent::TYPE_COOP_TRAINING);
    }

    // ── ServiceModelAssignment Completeness ──

    public function test_all_services_have_labels(): void
    {
        foreach (ServiceModelAssignment::SERVICES as $service) {
            $this->assertArrayHasKey(
                $service,
                ServiceModelAssignment::SERVICE_LABELS,
                "Service '{$service}' is missing a label"
            );
        }
    }

    // ── CludeAgentService resolveServiceType Logic ──

    public function test_coop_training_agent_uses_correct_service_type(): void
    {
        // Use reflection to test private method
        $service = app(\App\Services\CludeAgentService::class);
        $method = new \ReflectionMethod($service, 'resolveServiceType');
        $method->setAccessible(true);

        $coopAgent = new CludeAgent();
        $coopAgent->type = CludeAgent::TYPE_COOP_TRAINING;

        $generalAgent = new CludeAgent();
        $generalAgent->type = CludeAgent::TYPE_GENERAL;

        $this->assertEquals(
            ServiceModelAssignment::SERVICE_COOP_TRAINING,
            $method->invoke($service, $coopAgent)
        );

        $this->assertEquals(
            ServiceModelAssignment::SERVICE_QU_AGENT,
            $method->invoke($service, $generalAgent)
        );
    }

    public function test_coop_training_model_options_include_reduced_tokens(): void
    {
        $service = app(\App\Services\CludeAgentService::class);
        $method = new \ReflectionMethod($service, 'resolveModelOptions');
        $method->setAccessible(true);

        $agent = new CludeAgent();
        $agent->type = CludeAgent::TYPE_COOP_TRAINING;
        $agent->model = 'test-model';

        $options = $method->invoke($service, $agent);

        $this->assertArrayHasKey('max_tokens', $options);
        $this->assertLessThanOrEqual(2048, $options['max_tokens']);
        $this->assertArrayHasKey('temperature', $options);
        $this->assertLessThanOrEqual(0.3, $options['temperature']);
    }

    public function test_general_agent_model_options_only_has_model(): void
    {
        $service = app(\App\Services\CludeAgentService::class);
        $method = new \ReflectionMethod($service, 'resolveModelOptions');
        $method->setAccessible(true);

        $agent = new CludeAgent();
        $agent->type = CludeAgent::TYPE_GENERAL;
        $agent->model = 'test-model';

        $options = $method->invoke($service, $agent);

        $this->assertEquals(['model' => 'test-model'], $options);
    }

    // ── EmbedCorsHeaders Middleware ──

    public function test_embed_cors_middleware_sets_headers(): void
    {
        $middleware = new \App\Http\Middleware\EmbedCorsHeaders();
        $request = \Illuminate\Http\Request::create('/test');

        $response = $middleware->handle($request, function () {
            return response('OK');
        });

        $this->assertEquals('frame-ancestors *', $response->headers->get('Content-Security-Policy'));
        $this->assertEquals('*', $response->headers->get('Access-Control-Allow-Origin'));
        $this->assertNull($response->headers->get('X-Frame-Options'));
    }
}
