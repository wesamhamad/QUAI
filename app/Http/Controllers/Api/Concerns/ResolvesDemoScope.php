<?php

namespace App\Http\Controllers\Api\Concerns;

use App\Models\User;
use App\Support\DemoCohort;
use App\Support\DemoData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

/**
 * Who is asking, and what they may see — the demo build's answer to the
 * live platform's AdviseeDirectory / TaughtRoster / super-admin checks.
 *
 *   admin    — the demo «admin» account (role Admin or Super Admin): everything.
 *   faculty  — the demo «faculty» account: advises and teaches as DemoCohort::DEMO_INSTRUCTOR_ID.
 *   student  — a student account, or anyone impersonating one via ?as=<id>.
 */
trait ResolvesDemoScope
{
    private const FEATURED_STUDENT_IDS = ['443211517', '443100021', '443100022'];

    protected function viewer(): ?User
    {
        $u = Auth::user();

        return $u instanceof User ? $u : null;
    }

    protected function isAdminViewer(?User $u): bool
    {
        return $u !== null && $u->isAdmin();
    }

    /** A faculty member who is not the admin and not a student. */
    protected function isFacultyViewer(?User $u): bool
    {
        return $u !== null && ! $u->isAdmin() && $u->hasRole('Faculty') && ! $u->isStudent();
    }

    /** The employee id the faculty account advises/teaches as (the admin has no caseload of their own). */
    protected function advisorIdFor(?User $u): ?string
    {
        if ($u === null) {
            return null;
        }

        return $this->isFacultyViewer($u) || $this->isAdminViewer($u) ? DemoCohort::DEMO_INSTRUCTOR_ID : null;
    }

    /** @return array<int, string> the ids a viewer may read (admin: everyone). */
    protected function readableIds(?User $u): array
    {
        if ($u === null) {
            return [];
        }
        if ($this->isAdminViewer($u)) {
            return DemoCohort::ids();
        }
        if ($this->isFacultyViewer($u)) {
            return array_values(array_unique(array_merge(
                DemoCohort::adviseeIds(DemoCohort::DEMO_INSTRUCTOR_ID),
                array_keys(DemoCohort::taughtSections(DemoCohort::DEMO_INSTRUCTOR_ID)),
            )));
        }
        $own = $this->ownStudentId($u);

        return $own ? [$own] : [];
    }

    protected function mayRead(?User $u, string $studentId): bool
    {
        return in_array($studentId, $this->readableIds($u), true);
    }

    /**
     * The student a student-facing endpoint is about: ?as=<id> for anyone who
     * may impersonate (or a featured case for everybody), else the caller's
     * own id, else the demo student for the admin previewing the student seat.
     */
    protected function studentIdFor(Request $request, ?User $u): ?string
    {
        $as = $request->query('as');
        if (is_string($as) && $as !== '') {
            if ($this->isAdminViewer($u) || $this->isFacultyViewer($u) || in_array($as, self::FEATURED_STUDENT_IDS, true)) {
                return $as;
            }
        }
        if ($own = $this->ownStudentId($u)) {
            return $own;
        }

        return $u !== null && ($this->isAdminViewer($u)) ? (string) config('quai.qmentor.demo_student_id', DemoData::students()[0]['student_id']) : null;
    }

    protected function ownStudentId(?User $u): ?string
    {
        return $u !== null && ! empty($u->student_id) ? (string) $u->student_id : null;
    }

    // ── Per-user demo state (what the viewer changed in this build) ────────

    protected function stateKey(?User $u, string $what): string
    {
        return 'qmentor-demo:'.($u?->id ?? 'guest').':'.$what;
    }

    /** @return array<mixed> */
    protected function stateGet(?User $u, string $what, array $default = []): array
    {
        $v = Cache::get($this->stateKey($u, $what));

        return is_array($v) ? $v : $default;
    }

    protected function statePut(?User $u, string $what, array $value): void
    {
        Cache::put($this->stateKey($u, $what), $value, now()->addDays(7));
    }
}
