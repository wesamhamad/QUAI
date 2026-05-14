<?php

namespace App\QSpark\Http\Controllers;

use App\QSpark\Models\DailyVisit;
use App\QSpark\Models\User;
use App\QSpark\Support\DemoStudents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

/**
 * Demo / dev login. Two entry points:
 *  - GET  /dev/{role}  → one-click sign-in as a pre-seeded admin/faculty/student
 *  - POST /login       → username + password against the User table
 *
 * Both are enabled when APP_ENV=local OR DEMO_MODE=true.
 */
class LocalLoginController extends Controller
{
    public function quickLogin(string $role = 'student', Request $request = null)
    {
        if (! $this->isDemoOrLocal()) {
            abort(404);
        }
        if (! \in_array($role, ['student', 'faculty', 'admin'], true)) {
            $role = 'student';
        }

        // Honour a ?next=/some/path hint so the QUAI iframe wrapper can deep-link
        // into a specific QSPARK section after auto-login. Restricted to safe
        // local paths to prevent open-redirects.
        $next = $request ? (string) $request->query('next', '') : (string) request()->query('next', '');
        $next = $this->sanitizeNextPath($next);

        Auth::logout();

        $username = "demo_{$role}";
        $user = User::firstOrCreate(
            ['username' => $username],
            array_merge($this->seedDataFor($role, $username), [
                'password' => Hash::make(config('app.demo_password', 'demo1234')),
            ])
        );

        if ($user->role !== $role) {
            $user->role = $role;
            $user->save();
        }

        Auth::login($user, remember: true);
        // Placeholder token so controllers that gate on session('qspark_token')
        // proceed past their early-return and hit the fixture fallback path.
        session(['qspark_token' => 'demo-token']);
        session()->save();

        try {
            DailyVisit::incrementToday();
        } catch (\Throwable $e) {
            Log::warning('Demo quick-login: failed to increment daily visits', ['error' => $e->getMessage()]);
        }

        Log::info('Demo quick-login', ['username' => $user->username, 'role' => $role, 'next' => $next ?: null]);

        if ($next !== '') {
            return redirect($next);
        }

        return $this->redirectForRole($role);
    }

    /**
     * Only allow same-origin, single-leading-slash paths. Rejects protocol-relative
     * (`//evil.com`), schemed URLs, and anything resembling a host.
     */
    private function sanitizeNextPath(string $next): string
    {
        if ($next === '' || $next[0] !== '/' || str_starts_with($next, '//')) {
            return '';
        }
        if (preg_match('#^/[a-zA-Z0-9_\-/]+(\?[a-zA-Z0-9_\-=&%./]*)?$#', $next) !== 1) {
            return '';
        }
        return $next;
    }

    public function demoLogin(Request $request)
    {
        if (! $this->isDemoOrLocal()) {
            abort(404);
        }

        $data = $request->validate([
            'username' => ['required', 'string', 'max:191'],
            'password' => ['required', 'string', 'max:191'],
        ]);

        $user = User::where('username', $data['username'])
            ->orWhere('email', $data['username'])
            ->first();

        if (! $user || ! $user->password || ! Hash::check($data['password'], $user->password)) {
            return back()
                ->withInput($request->only('username'))
                ->withErrors(['username' => 'Invalid username or password.']);
        }

        Auth::login($user, remember: true);
        $request->session()->regenerate();
        session(['qspark_token' => 'demo-token']);
        session()->save();

        try {
            DailyVisit::incrementToday();
        } catch (\Throwable $e) {
            Log::warning('Demo login: failed to increment daily visits', ['error' => $e->getMessage()]);
        }

        return $this->redirectForRole($user->role ?? 'student');
    }

    /**
     * Demo only: switch which student persona the student dashboard is
     * rendered as. Stores the choice in the session; StudentFixture merges
     * the matching persona over the base fixture on the next request.
     */
    public function switchStudent(string $id)
    {
        if (! $this->isDemoOrLocal()) {
            abort(404);
        }

        if (DemoStudents::has($id)) {
            session([DemoStudents::SESSION_KEY => $id]);
            session()->save();
            // Dashboard data is cached by token + user id, but the demo token
            // and user are constant — flush so the new persona shows at once.
            Cache::flush();
            Log::info('Demo: switched student persona', ['student_id' => $id]);
        }

        return redirect()->route('qspark.dashboard.student');
    }

    private function isDemoOrLocal(): bool
    {
        return config('app.demo_mode') === true || config('app.env') === 'local';
    }

    private function redirectForRole(string $role)
    {
        return match ($role) {
            'admin'   => redirect()->route('qspark.admin.dashboard'),
            'faculty' => redirect()->route('qspark.faculty.dashboard'),
            default   => redirect()->route('qspark.dashboard.student'),
        };
    }

    private function seedDataFor(string $role, string $username): array
    {
        $base = [
            'email' => "{$username}@demo.qspark.test",
            'uuid' => $username,
            'role' => $role,
            'is_active' => true,
            'preferred_language' => 'en',
        ];

        return match ($role) {
            'admin' => [...$base,
                'name' => 'System Admin',
                'arabic_full_name' => 'مسؤول النظام',
                'english_full_name' => 'System Admin',
                'arabic_first_name' => 'مسؤول',
                'arabic_family_name' => 'النظام',
                'english_first_name' => 'System',
                'english_family_name' => 'Admin',
            ],
            'faculty' => [...$base,
                'name' => 'Faculty Member',
                'arabic_full_name' => 'عضو هيئة التدريس',
                'english_full_name' => 'Faculty Member',
                'arabic_first_name' => 'عضو',
                'arabic_family_name' => 'هيئة التدريس',
                'english_first_name' => 'Faculty',
                'english_family_name' => 'Member',
            ],
            default => [...$base,
                'name' => 'Test Student',
                'arabic_full_name' => 'طالب تجريبي',
                'english_full_name' => 'Test Student',
                'arabic_first_name' => 'طالب',
                'arabic_family_name' => 'تجريبي',
                'english_first_name' => 'Test',
                'english_family_name' => 'Student',
            ],
        };
    }
}
