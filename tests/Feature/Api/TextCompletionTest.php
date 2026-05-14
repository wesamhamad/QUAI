<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Services\OllamaService;

class TextCompletionTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        config(['quai.allowed_ips' => []]);
    }

    public function test_text_completion_requires_prompt(): void
    {
        $response = $this->postJson('/api/v1/completions', []);

        $response->assertStatus(422)
            ->assertJson([
                'error' => [
                    'type' => 'invalid_request_error',
                    'code' => 422,
                ]
            ]);
    }

    public function test_text_completion_validates_prompt_length(): void
    {
        $response = $this->postJson('/api/v1/completions', [
            'prompt' => str_repeat('a', 40000) // exceeds max length
        ]);

        $response->assertStatus(422);
    }

    public function test_successful_text_completion_with_mock(): void
    {
        $this->mock(OllamaService::class, function ($mock) {
            $mock->shouldReceive('completion')
                ->once()
                ->andReturn([
                    'id' => 'cmpl-test',
                    'object' => 'text_completion',
                    'created' => time(),
                    'model' => 'iKhalid/ALLaM:7b',
                    'choices' => [
                        [
                            'text' => 'كان يا ما كان...',
                            'index' => 0,
                            'finish_reason' => 'stop'
                        ]
                    ]
                ]);
        });

        $response = $this->postJson('/api/v1/completions', [
            'prompt' => 'اكتب قصة'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'object',
                'created',
                'model',
                'choices'
            ]);
    }
}
