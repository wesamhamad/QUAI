<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Services\OllamaService;
use Mockery;

class ChatCompletionTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Disable IP whitelist for tests
        config(['quai.allowed_ips' => []]);
    }

    public function test_chat_completion_requires_messages(): void
    {
        $response = $this->postJson('/api/v1/chat/completions', []);

        $response->assertStatus(422)
            ->assertJson([
                'error' => [
                    'type' => 'invalid_request_error',
                    'code' => 422,
                ]
            ]);
    }

    public function test_chat_completion_validates_message_structure(): void
    {
        $response = $this->postJson('/api/v1/chat/completions', [
            'messages' => [
                ['role' => 'invalid_role', 'content' => 'test']
            ]
        ]);

        $response->assertStatus(422);
    }

    public function test_chat_completion_validates_required_fields(): void
    {
        $response = $this->postJson('/api/v1/chat/completions', [
            'messages' => [
                ['role' => 'user'] // missing content
            ]
        ]);

        $response->assertStatus(422);
    }

    public function test_chat_completion_validates_max_tokens_range(): void
    {
        $response = $this->postJson('/api/v1/chat/completions', [
            'messages' => [
                ['role' => 'user', 'content' => 'test']
            ],
            'max_tokens' => 10000 // exceeds maximum
        ]);

        $response->assertStatus(422);
    }

    public function test_chat_completion_validates_temperature_range(): void
    {
        $response = $this->postJson('/api/v1/chat/completions', [
            'messages' => [
                ['role' => 'user', 'content' => 'test']
            ],
            'temperature' => 3 // exceeds maximum
        ]);

        $response->assertStatus(422);
    }

    public function test_successful_chat_completion_with_mock(): void
    {
        // Mock OllamaService
        $this->mock(OllamaService::class, function ($mock) {
            $mock->shouldReceive('chatCompletion')
                ->once()
                ->andReturn([
                    'id' => 'chatcmpl-test',
                    'object' => 'chat.completion',
                    'created' => time(),
                    'model' => 'iKhalid/ALLaM:7b',
                    'choices' => [
                        [
                            'index' => 0,
                            'message' => [
                                'role' => 'assistant',
                                'content' => 'مرحباً!'
                            ],
                            'finish_reason' => 'stop'
                        ]
                    ],
                    'usage' => [
                        'prompt_tokens' => 10,
                        'completion_tokens' => 5,
                        'total_tokens' => 15
                    ]
                ]);
        });

        $response = $this->postJson('/api/v1/chat/completions', [
            'messages' => [
                ['role' => 'user', 'content' => 'مرحبا']
            ]
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'id',
                'object',
                'created',
                'model',
                'choices' => [
                    '*' => [
                        'index',
                        'message' => [
                            'role',
                            'content'
                        ],
                        'finish_reason'
                    ]
                ],
                'usage' => [
                    'prompt_tokens',
                    'completion_tokens',
                    'total_tokens'
                ]
            ]);
    }

    public function test_chat_completion_with_optional_parameters(): void
    {
        $this->mock(OllamaService::class, function ($mock) {
            $mock->shouldReceive('chatCompletion')
                ->once()
                ->with(
                    Mockery::type('array'),
                    Mockery::on(function ($options) {
                        return isset($options['max_tokens']) && $options['max_tokens'] === 1000 &&
                               isset($options['temperature']) && $options['temperature'] === 0.5 &&
                               isset($options['top_p']) && $options['top_p'] === 0.8;
                    })
                )
                ->andReturn([
                    'id' => 'chatcmpl-test',
                    'object' => 'chat.completion',
                    'choices' => [],
                    'usage' => []
                ]);
        });

        $response = $this->postJson('/api/v1/chat/completions', [
            'messages' => [
                ['role' => 'user', 'content' => 'test']
            ],
            'max_tokens' => 1000,
            'temperature' => 0.5,
            'top_p' => 0.8
        ]);

        $response->assertStatus(200);
    }
}
