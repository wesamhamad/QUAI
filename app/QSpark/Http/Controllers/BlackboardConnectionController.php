<?php

namespace App\QSpark\Http\Controllers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use App\QSpark\Services\BlackboardLearnApiService;

/**
 * BlackboardConnectionController
 *
 * Handles OAuth 2.0 authentication with Blackboard Learn API.
 * Uses client credentials flow for server-to-server communication.
 */
class BlackboardConnectionController extends Controller
{
    private string $baseUrl;
    private string $tokenUrl;
    private string $clientId;
    private string $clientSecret;
    private int $timeout;

    public function __construct()
    {
        // Use config values with env fallbacks
        $this->baseUrl = config('services.blackboard.base_url', env('BLACKBOARD_BASE_URL', 'https://qu.blackboard.com'));
        $this->tokenUrl = config('services.blackboard.token_url')
            ?? env('BLACKBOARD_TOKEN_URL', $this->baseUrl . '/learn/api/public/v1/oauth2/token');
        $this->clientId = config('services.blackboard.client_id', env('BLACKBOARD_CLIENT_ID', ''));
        $this->clientSecret = config('services.blackboard.client_secret', env('BLACKBOARD_CLIENT_SECRET', ''));
        $this->timeout = (int) config('services.blackboard.timeout', 30);
    }

    /**
     * Get OAuth 2.0 access token using client credentials flow
     * Token is cached for its lifetime minus a 5-minute buffer
     *
     * @return string|null
     */
    public function getToken(): ?string
    {
        $cacheKey = 'blackboard_token';

        // Check cache first
        if (Cache::has($cacheKey)) {
            Log::debug('Using cached Blackboard token');
            return Cache::get($cacheKey);
        }

        // Validate credentials are configured
        if (empty($this->clientId) || empty($this->clientSecret)) {
            Log::error('Blackboard API credentials not configured', [
                'has_client_id' => !empty($this->clientId),
                'has_client_secret' => !empty($this->clientSecret),
            ]);
            return null;
        }

        Log::info('Requesting new Blackboard token', [
            'token_url' => $this->tokenUrl,
        ]);

        try {
            $response = Http::asForm()
                ->timeout($this->timeout)
                ->withBasicAuth($this->clientId, $this->clientSecret)
                ->post($this->tokenUrl, [
                    'grant_type' => 'client_credentials',
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $token = $data['access_token'] ?? null;
                $expiresIn = $data['expires_in'] ?? 3600;
                $tokenType = $data['token_type'] ?? 'Bearer';

                if ($token) {
                    // Store in cache for the duration minus a buffer (5 min)
                    $cacheDuration = max($expiresIn - 300, 60);
                    Cache::put($cacheKey, $token, now()->addSeconds($cacheDuration));

                    Log::info('Blackboard token obtained successfully', [
                        'token_type' => $tokenType,
                        'expires_in' => $expiresIn,
                        'cache_duration' => $cacheDuration,
                    ]);

                    return $token;
                }

                Log::error('Blackboard token response missing access_token');
            } else {
                Log::error('Blackboard token request failed', [
                    'status' => $response->status(),
                    'body' => substr($response->body(), 0, 500),
                ]);
            }
        } catch (\Throwable $e) {
            Log::error('Exception getting Blackboard token', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
        }

        return null;
    }

    /**
     * Refresh the cached token by forcing a new token request
     *
     * @return string|null
     */
    public function refreshToken(): ?string
    {
        Cache::forget('blackboard_token');
        return $this->getToken();
    }

    /**
     * Check if the connection to Blackboard is healthy
     *
     * @return array
     */
    public function checkConnection(): array
    {
        $token = $this->getToken();

        if (!$token) {
            return [
                'connected' => false,
                'error' => 'Unable to obtain access token',
                'configured' => !empty($this->clientId) && !empty($this->clientSecret),
            ];
        }

        // Try a simple API call to verify the token works
        try {
            $apiService = new BlackboardLearnApiService();
            $courses = $apiService->getCourses(['limit' => 1]);

            return [
                'connected' => true,
                'token_valid' => true,
                'api_accessible' => $courses !== null,
            ];
        } catch (\Throwable $e) {
            return [
                'connected' => true,
                'token_valid' => true,
                'api_accessible' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get connection status as JSON response
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function status(): \Illuminate\Http\JsonResponse
    {
        $status = $this->checkConnection();
        $httpStatus = $status['connected'] ? 200 : 503;

        return response()->json([
            'success' => $status['connected'],
            'data' => $status,
        ], $httpStatus);
    }
}