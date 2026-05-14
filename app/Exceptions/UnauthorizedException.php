<?php

namespace App\Exceptions;

class UnauthorizedException extends OllamaException
{
    public function __construct(string $message = 'IP address not allowed')
    {
        parent::__construct($message, 403, 'unauthorized_error');
    }
}
