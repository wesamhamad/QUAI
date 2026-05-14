<?php

namespace App\Exceptions;

class ValidationException extends OllamaException
{
    protected array $errors;

    public function __construct(string $message = 'Validation failed', array $errors = [])
    {
        parent::__construct($message, 422, 'validation_error');
        $this->errors = $errors;
    }

    public function render(): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'error' => [
                'message' => $this->message,
                'type' => $this->errorType,
                'code' => $this->statusCode,
                'errors' => $this->errors,
            ],
        ], $this->statusCode);
    }
}
