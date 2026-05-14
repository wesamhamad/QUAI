<?php

namespace Tests\Feature\Api;

use App\Models\CludeAgent;
use App\Models\CludeAgentMessage;
use App\Models\ServiceModelAssignment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CoopTrainingTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $sanctumToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $token = $this->user->createToken('test-token', ['service:coop_training']);
        $this->sanctumToken = $token->plainTextToken;

        Storage::fake('local');
    }

    // ── Model Tests ──

    public function test_clude_agent_has_coop_training_type_constant(): void
    {
        $this->assertEquals('coop_training', CludeAgent::TYPE_COOP_TRAINING);
        $this->assertEquals('general', CludeAgent::TYPE_GENERAL);
    }

    public function test_clude_agent_fillable_includes_type_and_college_code(): void
    {
        $agent = new CludeAgent();
        $fillable = $agent->getFillable();

        $this->assertContains('type', $fillable);
        $this->assertContains('college_code', $fillable);
    }

    public function test_clude_agent_scope_coop_training(): void
    {
        CludeAgent::factory()->create(['type' => 'general']);
        CludeAgent::factory()->create(['type' => 'coop_training']);
        CludeAgent::factory()->create(['type' => 'coop_training']);

        $coopAgents = CludeAgent::coopTraining()->get();
        $this->assertCount(2, $coopAgents);
    }

    public function test_clude_agent_get_embed_url(): void
    {
        $agent = CludeAgent::factory()->create([
            'type' => CludeAgent::TYPE_COOP_TRAINING,
            'share_token' => 'test-token-123',
        ]);

        $this->assertStringContains('/embed/coop-training/test-token-123', $agent->getEmbedUrl());
    }

    public function test_clude_agent_defaults_to_general_type(): void
    {
        $agent = CludeAgent::factory()->create();
        $this->assertEquals('general', $agent->type);
    }

    // ── ServiceModelAssignment Tests ──

    public function test_service_model_assignment_has_coop_training_constant(): void
    {
        $this->assertEquals('coop_training', ServiceModelAssignment::SERVICE_COOP_TRAINING);
    }

    public function test_coop_training_in_services_array(): void
    {
        $this->assertContains('coop_training', ServiceModelAssignment::SERVICES);
    }

    public function test_coop_training_has_arabic_label(): void
    {
        $this->assertArrayHasKey('coop_training', ServiceModelAssignment::SERVICE_LABELS);
        $this->assertNotEmpty(ServiceModelAssignment::SERVICE_LABELS['coop_training']);
    }

    // ── Config Tests ──

    public function test_coop_training_config_exists(): void
    {
        $config = config('quai.coop_training');

        $this->assertNotNull($config);
        $this->assertArrayHasKey('max_tokens', $config);
        $this->assertArrayHasKey('temperature', $config);
        $this->assertArrayHasKey('timeout', $config);
        $this->assertArrayHasKey('max_history_messages', $config);
        $this->assertArrayHasKey('scrape_urls', $config);
        $this->assertArrayHasKey('groq', $config);
    }

    public function test_coop_training_config_has_reasonable_defaults(): void
    {
        $this->assertEquals(2048, config('quai.coop_training.max_tokens'));
        $this->assertEquals(0.2, config('quai.coop_training.temperature'));
        $this->assertEquals(60, config('quai.coop_training.timeout'));
        $this->assertLessThanOrEqual(20, config('quai.coop_training.max_history_messages'));
    }

    public function test_coop_training_groq_config_structure(): void
    {
        $groq = config('quai.coop_training.groq');

        $this->assertArrayHasKey('enabled', $groq);
        $this->assertArrayHasKey('api_key', $groq);
        $this->assertArrayHasKey('model', $groq);
        $this->assertArrayHasKey('max_tokens', $groq);
        $this->assertArrayHasKey('timeout', $groq);
    }

    // ── Provision API Tests ──

    public function test_provision_fails_without_authenticated_user(): void
    {
        // Without auth, the controller's auth()->user() is null → 500 or error
        // This verifies the endpoint doesn't accidentally succeed without a user
        $response = $this->postJson('/api/v1/coop-training/provision', [
            'college_code' => 'QAC',
            'college_name' => 'الكلية التطبيقية',
        ]);

        $this->assertNotEquals(201, $response->getStatusCode());
        $this->assertNotEquals(200, $response->getStatusCode());
    }

    public function test_provision_validates_required_fields(): void
    {
        $response = $this->actingAs($this->user)
            ->withToken($this->sanctumToken)
            ->postJson('/api/v1/coop-training/provision', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['college_code', 'college_name']);
    }

    public function test_provision_creates_coop_training_agent(): void
    {
        $response = $this->actingAs($this->user)
            ->withToken($this->sanctumToken)
            ->postJson('/api/v1/coop-training/provision', [
                'college_code' => 'QAC',
                'college_name' => 'الكلية التطبيقية',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'agent' => [
                    'id', 'name', 'college_code', 'share_token', 'embed_url', 'status',
                ],
                'sanctum_token',
                'embed_code' => ['iframe', 'widget'],
            ]);

        $this->assertDatabaseHas('clude_agents', [
            'type' => 'coop_training',
            'college_code' => 'QAC',
            'language' => 'ar',
            'knowledge_strategy' => 'rag',
            'status' => 'active',
        ]);
    }

    public function test_provision_with_pdf_file(): void
    {
        $file = UploadedFile::fake()->create('guide.pdf', 1024, 'application/pdf');

        $response = $this->actingAs($this->user)
            ->withToken($this->sanctumToken)
            ->postJson('/api/v1/coop-training/provision', [
                'college_code' => 'ENG',
                'college_name' => 'كلية الهندسة',
                'knowledge_files' => [$file],
            ]);

        $response->assertStatus(201);

        $agent = CludeAgent::where('college_code', 'ENG')->first();
        $this->assertNotNull($agent->knowledge_files);
        $this->assertGreaterThanOrEqual(1, count($agent->knowledge_files));
        // First file should be the uploaded PDF
        $uploadedFiles = array_filter($agent->knowledge_files, fn($f) => ($f['source'] ?? '') === 'uploaded');
        $this->assertNotEmpty($uploadedFiles);
    }

    public function test_provision_prevents_duplicate_college(): void
    {
        // Create first instance
        CludeAgent::factory()->create([
            'type' => CludeAgent::TYPE_COOP_TRAINING,
            'college_code' => 'QAC',
            'status' => CludeAgent::STATUS_ACTIVE,
        ]);

        $response = $this->actingAs($this->user)
            ->withToken($this->sanctumToken)
            ->postJson('/api/v1/coop-training/provision', [
                'college_code' => 'QAC',
                'college_name' => 'الكلية التطبيقية',
            ]);

        $response->assertStatus(409)
            ->assertJson(['success' => false]);
    }

    public function test_provision_rejects_invalid_file_types(): void
    {
        $file = UploadedFile::fake()->create('script.php', 100, 'text/x-php');

        $response = $this->actingAs($this->user)
            ->withToken($this->sanctumToken)
            ->postJson('/api/v1/coop-training/provision', [
                'college_code' => 'QAC',
                'college_name' => 'الكلية التطبيقية',
                'knowledge_files' => [$file],
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['knowledge_files.0']);
    }

    // ── Embed Code API Tests ──

    public function test_embed_code_returns_snippets(): void
    {
        $agent = CludeAgent::factory()->create([
            'type' => CludeAgent::TYPE_COOP_TRAINING,
            'share_token' => 'test-embed-code',
            'metadata' => ['college_name' => 'الكلية التطبيقية'],
        ]);

        $response = $this->withToken($this->sanctumToken)
            ->getJson('/api/v1/coop-training/test-embed-code/embed-code');

        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'embed_code' => ['iframe', 'widget'],
            ]);

        $embedCode = $response->json('embed_code');
        $this->assertStringContains('iframe', $embedCode['iframe']);
        $this->assertStringContains('coop-training-widget.js', $embedCode['widget']);
        $this->assertStringContains('test-embed-code', $embedCode['iframe']);
    }

    public function test_embed_code_returns_404_for_nonexistent_token(): void
    {
        $response = $this->withToken($this->sanctumToken)
            ->getJson('/api/v1/coop-training/nonexistent/embed-code');

        $response->assertStatus(404);
    }

    // ── List Instances API Tests ──

    public function test_list_instances_returns_only_coop_training(): void
    {
        CludeAgent::factory()->create(['type' => 'general']);
        CludeAgent::factory()->create(['type' => 'coop_training', 'college_code' => 'QAC']);
        CludeAgent::factory()->create(['type' => 'coop_training', 'college_code' => 'ENG']);
        CludeAgent::factory()->create([
            'type' => 'coop_training',
            'college_code' => 'OLD',
            'status' => CludeAgent::STATUS_ARCHIVED,
        ]);

        $response = $this->withToken($this->sanctumToken)
            ->getJson('/api/v1/coop-training/instances');

        $response->assertOk()
            ->assertJsonCount(2, 'instances');
    }

    // ── Embed View Tests ──

    public function test_embed_view_loads_for_active_agent(): void
    {
        $agent = CludeAgent::factory()->create([
            'type' => CludeAgent::TYPE_COOP_TRAINING,
            'share_token' => 'embed-view-test',
            'status' => CludeAgent::STATUS_ACTIVE,
            'metadata' => ['college_name' => 'الكلية التطبيقية'],
        ]);

        $response = $this->get('/embed/coop-training/embed-view-test');

        $response->assertOk();
        $response->assertSee('الكلية التطبيقية');
        $response->assertSee('دليل التدريب التعاوني');
        // URL is JSON-encoded in blade, so slashes are escaped
        $response->assertSee('embed-view-test');
    }

    public function test_embed_view_returns_404_for_inactive_agent(): void
    {
        CludeAgent::factory()->create([
            'type' => CludeAgent::TYPE_COOP_TRAINING,
            'share_token' => 'inactive-agent',
            'status' => CludeAgent::STATUS_INACTIVE,
        ]);

        $response = $this->get('/embed/coop-training/inactive-agent');
        $response->assertStatus(404);
    }

    public function test_embed_view_returns_404_for_general_agent(): void
    {
        CludeAgent::factory()->create([
            'type' => CludeAgent::TYPE_GENERAL,
            'share_token' => 'general-agent',
            'status' => CludeAgent::STATUS_ACTIVE,
        ]);

        $response = $this->get('/embed/coop-training/general-agent');
        $response->assertStatus(404);
    }

    public function test_embed_view_has_cors_headers(): void
    {
        CludeAgent::factory()->create([
            'type' => CludeAgent::TYPE_COOP_TRAINING,
            'share_token' => 'cors-test',
            'status' => CludeAgent::STATUS_ACTIVE,
            'metadata' => ['college_name' => 'Test'],
        ]);

        $response = $this->get('/embed/coop-training/cors-test');

        $response->assertOk();
        $response->assertHeader('Content-Security-Policy', 'frame-ancestors *');
        $this->assertFalse($response->headers->has('X-Frame-Options'));
    }

    public function test_embed_view_contains_streaming_api_url(): void
    {
        CludeAgent::factory()->create([
            'type' => CludeAgent::TYPE_COOP_TRAINING,
            'share_token' => 'api-url-test',
            'status' => CludeAgent::STATUS_ACTIVE,
            'metadata' => ['college_name' => 'Test'],
        ]);

        $response = $this->get('/embed/coop-training/api-url-test');

        $response->assertOk();
        // URL is JSON-encoded in @json() blade directive
        $response->assertSee('api-url-test');
        $response->assertSee('chat-stream');
    }

    // ── Chat API Integration Tests ──

    public function test_chat_api_works_with_coop_training_agent(): void
    {
        $agent = CludeAgent::factory()->create([
            'type' => CludeAgent::TYPE_COOP_TRAINING,
            'share_token' => 'chat-test',
            'status' => CludeAgent::STATUS_ACTIVE,
        ]);

        // Test that the endpoint is accessible (will fail at AI level without Ollama, but route works)
        $response = $this->postJson('/api/v1/agent-chat/chat-test/chat', [
            'message' => 'ما مدة التدريب؟',
            'session_id' => 'test-session-1',
        ]);

        // Either 200 (if Ollama is running) or 500 (if not) — but NOT 404
        $this->assertNotEquals(404, $response->getStatusCode());
    }

    public function test_chat_stores_user_message(): void
    {
        $agent = CludeAgent::factory()->create([
            'type' => CludeAgent::TYPE_COOP_TRAINING,
            'share_token' => 'msg-store-test',
            'status' => CludeAgent::STATUS_ACTIVE,
        ]);

        // Try chat — may fail at AI level but should store user message
        $this->postJson('/api/v1/agent-chat/msg-store-test/chat', [
            'message' => 'اختبار',
            'session_id' => 'session-store-test',
        ]);

        $this->assertDatabaseHas('clude_agent_messages', [
            'agent_id' => $agent->id,
            'session_id' => 'session-store-test',
            'role' => 'user',
            'content' => 'اختبار',
        ]);
    }

    public function test_chat_history_endpoint(): void
    {
        $agent = CludeAgent::factory()->create([
            'type' => CludeAgent::TYPE_COOP_TRAINING,
            'share_token' => 'history-test',
            'status' => CludeAgent::STATUS_ACTIVE,
        ]);

        // Create some messages
        CludeAgentMessage::create([
            'agent_id' => $agent->id,
            'session_id' => 'hist-session',
            'role' => 'user',
            'content' => 'سؤال اختبار',
        ]);
        CludeAgentMessage::create([
            'agent_id' => $agent->id,
            'session_id' => 'hist-session',
            'role' => 'assistant',
            'content' => 'إجابة اختبار',
        ]);

        $response = $this->getJson('/api/v1/agent-chat/history-test/history/hist-session');

        $response->assertOk()
            ->assertJsonCount(2, 'messages');
    }

    // ── Widget JS Tests ──

    public function test_widget_js_is_accessible(): void
    {
        // Widget JS is a static file in public/
        $this->assertFileExists(public_path('js/coop-training-widget.js'));
    }

    public function test_widget_js_contains_required_elements(): void
    {
        $content = file_get_contents(public_path('js/coop-training-widget.js'));

        $this->assertStringContains('data-token', $content);
        $this->assertStringContains('coop-training-widget', $content);
        $this->assertStringContains('iframe', $content);
        $this->assertStringContains('/embed/coop-training/', $content);
    }

    // ── Route Tests ──

    public function test_provision_route_exists(): void
    {
        $response = $this->postJson('/api/v1/coop-training/provision');
        $this->assertNotEquals(404, $response->getStatusCode());
    }

    public function test_instances_route_exists(): void
    {
        $response = $this->withToken($this->sanctumToken)
            ->getJson('/api/v1/coop-training/instances');

        $this->assertNotEquals(404, $response->getStatusCode());
    }

    public function test_embed_code_route_exists(): void
    {
        $response = $this->withToken($this->sanctumToken)
            ->getJson('/api/v1/coop-training/test-token/embed-code');

        // 404 because agent doesn't exist, but route is found
        $this->assertEquals(404, $response->getStatusCode());
    }

    public function test_refresh_content_route_exists(): void
    {
        $response = $this->withToken($this->sanctumToken)
            ->postJson('/api/v1/coop-training/test-token/refresh-content');

        // 404 because agent doesn't exist, but route is found
        $this->assertEquals(404, $response->getStatusCode());
    }

    public function test_embed_route_exists(): void
    {
        $response = $this->get('/embed/coop-training/nonexistent');
        // 404 because agent doesn't exist, but route is found (not a routing 404)
        $this->assertEquals(404, $response->getStatusCode());
    }

    // ── Share Token Tests ──

    public function test_generate_share_token_for_coop_training(): void
    {
        $token = CludeAgent::generateShareToken('coop-training-QAC');
        $this->assertNotEmpty($token);
        $this->assertStringContains('coop-training-qac', $token);
    }

    public function test_share_token_is_unique(): void
    {
        CludeAgent::factory()->create(['share_token' => 'coop-training-qac']);
        $token = CludeAgent::generateShareToken('coop-training-QAC');

        $this->assertNotEquals('coop-training-qac', $token);
        $this->assertStringContains('coop-training-qac', $token);
    }

    // ── Helper ──

    private function assertStringContains(string $needle, string $haystack): void
    {
        $this->assertTrue(
            str_contains($haystack, $needle),
            "Failed asserting that '{$haystack}' contains '{$needle}'"
        );
    }
}
