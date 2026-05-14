<?php

namespace App\Listeners;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Aacotroneo\Saml2\Events\Saml2LogoutEvent;

class SamlLogoutListener
{
    public function handle(Saml2LogoutEvent $event): void
    {
        Log::info("SAML Logout Handler Started", [
            'session_id' => session()->getId(),
            'authenticated_before' => auth()->check(),
            'user' => auth()->user()?->username,
        ]);

        // Logout the user
        Auth::logout();
        
        // Clear all session data
        Session::flush();
        Session::regenerate();
        
        // Manually save session to ensure logout persists
        Session::save();
        
        Log::info('User logged out successfully via SAML', [
            'session_id_after' => session()->getId(),
            'authenticated_after' => auth()->check(),
        ]);
    }
}