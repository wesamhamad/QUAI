<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureSdaiaPolicyAccepted
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        if ($user && !$user->hasAcceptedSdaiaPolicy()) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json([
                    'error' => [
                        'message' => 'يجب قبول سياسة استخدام الذكاء الاصطناعي (سدايا) قبل استخدام المنصة',
                        'message_en' => 'You must accept the SDAIA AI usage policy before using the platform',
                        'type' => 'sdaia_policy_required',
                    ],
                ], 403);
            }

            return redirect()->route('sdaia.policy');
        }

        return $next($request);
    }
}
