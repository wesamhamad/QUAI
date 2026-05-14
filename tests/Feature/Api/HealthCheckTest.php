<?php

namespace Tests\Feature\Api;

use Tests\TestCase;

class HealthCheckTest extends TestCase
{
    public function test_health_check_endpoint_is_accessible(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'service',
                'version',
                'timestamp',
                'ollama' => [
                    'status'
                ],
                'config' => [
                    'model',
                    'base_url'
                ]
            ]);
    }

    public function test_health_check_returns_service_info(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertJson([
            'service' => 'QUAI',
            'version' => '1.0.0',
        ]);
    }
}
