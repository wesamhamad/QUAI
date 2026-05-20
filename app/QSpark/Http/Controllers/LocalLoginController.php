<?php

namespace App\QSpark\Http\Controllers;

use App\QSpark\Models\DailyVisit;
use App\QSpark\Models\User;
use App\QSpark\Support\DemoStudents;
use Illuminate\Http\RedirectResponse;
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

        // Align the QSPARK student persona with the QUAI shell user. The shell
        // (web guard) authenticates the real demo user (e.g. student.1517 →
        // student_id 443211517), but QSPARK's iframe always signs in the shared
        // `demo_student` account on the qspark guard — so without this the
        // dashboard would render the previous persona's profile from session
        // or the default. Resolve the persona from the shell user and reset
        // the cached dashboard data whenever it changes.
        if ($role === 'student') {
            $shellUser = Auth::guard('web')->user();
            $shellStudentId = $shellUser?->student_id ? (string) $shellUser->student_id : '';
            if ($shellStudentId !== '' && DemoStudents::has($shellStudentId)) {
                $currentPersona = (string) session(DemoStudents::SESSION_KEY, '');
                if ($currentPersona !== $shellStudentId) {
                    session([DemoStudents::SESSION_KEY => $shellStudentId]);
                    Cache::flush();
                    Log::info('Demo quick-login: bound QSPARK persona to shell user', [
                        'shell_username' => $shellUser->username ?? null,
                        'student_id' => $shellStudentId,
                    ]);
                }
            }
        }

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
            // qspark connection may not be writable on the demo host; the
            // counter isn't critical for the demo, so swallow at debug level.
            Log::debug('Demo quick-login: skipped daily visit increment', ['error' => $e->getMessage()]);
        }

        Log::info('Demo quick-login', ['username' => $user->username, 'role' => $role, 'next' => $next ?: null]);

        // Use a relative Location header so the browser keeps the iframe on
        // whatever origin loaded the demo (e.g. ai.qu.sa) instead of being
        // redirected to the host Laravel's URL generator computes from
        // APP_URL/forwarded headers (which on shared deployments resolves to
        // quailab.dev and is then blocked cross-origin by the iframe).
        if ($next !== '') {
            return new RedirectResponse($next);
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
            // qspark connection may not be writable on the demo host; the
            // counter isn't critical for the demo, so swallow at debug level.
            Log::debug('Demo login: skipped daily visit increment', ['error' => $e->getMessage()]);
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

        return new RedirectResponse(route('qspark.dashboard.student', [], false));
    }

    private function isDemoOrLocal(): bool
    {
        return config('app.demo_mode') === true || config('app.env') === 'local';
    }

    private function redirectForRole(string $role): RedirectResponse
    {
        // `route(name, [], false)` returns a root-relative path (e.g.
        // "/qspark/admin/dashboard"). Wrapping it directly in a
        // RedirectResponse keeps the Location header relative so the iframe
        // follows the 302 on its current origin instead of being pinned to
        // the URL generator's computed host.
        $path = match ($role) {
            'admin'   => route('qspark.admin.dashboard', [], false),
            'faculty' => route('qspark.faculty.dashboard', [], false),
            default   => route('qspark.dashboard.student', [], false),
        };

        return new RedirectResponse($path);
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
