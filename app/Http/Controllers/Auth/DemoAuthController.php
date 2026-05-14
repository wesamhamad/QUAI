<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class DemoAuthController extends Controller
{
    public function showLoginForm()
    {
        if (Auth::check()) {
            return redirect()->intended('/');
        }
        $accounts = $this->demoAccounts();
        return view('auth.demo-login', compact('accounts'));
    }

    public function login(Request $request)
    {
        $data = $request->validate([
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $login = trim($data['login']);
        $user = User::where('username', $login)
            ->orWhere('email', $login)
            ->first();

        if (! $user || ! Auth::attempt(
            ['email' => $user->email, 'password' => $data['password']],
            $request->boolean('remember')
        )) {
            throw ValidationException::withMessages([
                'login' => 'بيانات الدخول غير صحيحة.',
            ]);
        }

        $request->session()->regenerate();
        // Auto-accept SDAIA policy for demo users so the policy banner doesn't gate the panel.
        if (method_exists($user, 'hasAcceptedSdaiaPolicy') && ! $user->hasAcceptedSdaiaPolicy()) {
            $user->forceFill(['sdaia_policy_accepted_at' => now()])->save();
        }
        return redirect()->intended('/');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('demo.login');
    }

    /**
     * Shortcut "Login as ..." button: signs in a demo user without password
     * entry. Safe only because every demo password is the published default.
     */
    public function quickLogin(Request $request, string $username)
    {
        $user = User::where('username', $username)->firstOrFail();
        Auth::login($user, true);
        if (method_exists($user, 'hasAcceptedSdaiaPolicy') && ! $user->hasAcceptedSdaiaPolicy()) {
            $user->forceFill(['sdaia_policy_accepted_at' => now()])->save();
        }
        $request->session()->regenerate();
        return redirect('/');
    }

    private function demoAccounts(): array
    {
        return [
            [
                'role'     => 'Admin',
                'label'    => 'مدير',
                'desc'     => 'وصول كامل للوحة الإدارة وكل بيانات الطلاب',
                'username' => 'admin',
            ],
            [
                'role'     => 'Faculty',
                'label'    => 'عضو هيئة تدريس',
                'desc'     => 'استعراض بيانات أي طالب عبر QMentor و+QSpark والسجل الرقمي',
                'username' => 'faculty',
            ],
            [
                'role'     => 'Student',
                'label'    => 'طالب',
                'desc'     => 'عرض بيانات الطالب نفسه فقط',
                'username' => 'student.1517',
            ],
        ];
    }
}
