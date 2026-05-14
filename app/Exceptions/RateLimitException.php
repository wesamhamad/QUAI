<?php

namespace App\Exceptions;

class RateLimitException extends OllamaException
{
    public function __construct(string $message = 'Rate limit exceeded')
    {
        parent::__construct($message, 429, 'rate_limit_error');
    }
}
