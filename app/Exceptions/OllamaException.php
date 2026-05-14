<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

class OllamaException extends Exception
{
    protected $statusCode;
    protected $errorType;

    public function __construct(
        string $message = '',
        int $statusCode = 500,
        string $errorType = 'api_error',
        ?\Throwable $previous = null
    ) {
        parent::__construct($message, 0, $previous);
        $this->statusCode = $statusCode;
        $this->errorType = $errorType;
    }

    public function render(): JsonResponse
    {
        return response()->json([
            'error' => [
                'message' => $this->message,
                'type' => $this->errorType,
                'code' => $this->statusCode,
            ],
        ], $this->statusCode);
    }

    public function getStatusCode(): int
    {
        return $this->statusCode;
    }

    public function getErrorType(): string
    {
        return $this->errorType;
    }
}
