<?php

namespace App\QSpark\Listeners;

use Aacotroneo\Saml2\Events\Saml2LoginEvent;
use App\QSpark\Models\DailyVisit;
use App\QSpark\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SamlLoginListener
{
    public function handle(Saml2LoginEvent $event): void
    {
        $samlUser = $event->getSaml2User();
        $messageId = $event->getSaml2Auth()->getLastMessageId();
        $attrs = $samlUser->getAttributes();

        Log::info('SAML response received', [
            'message_id' => $messageId,
            'name_id' => $samlUser->getNameId(),
            'session_index' => $samlUser->getSessionIndex(),
            'attributes' => $attrs,
        ]);

        $username = $attrs['username'][0] ?? null;
        $samlRoles = $attrs['roles'] ?? [];

        if (! $username) {
            Log::error('SAML login rejected: username attribute missing');

            return;
        }

        if (auth()->check() && auth()->user()->username === $username) {
            return;
        }

        $exists = DB::table('saml_message_ids')->where('message_id', $messageId)->exists();
        if ($exists) {
            Log::warning('SAML message ID already used, skipping', ['message_id' => $messageId]);

            return;
        }

        $role = $this->resolveRole($username, $samlRoles);
        if ($role === null) {
            Log::warning('SAML login rejected: unauthorized role', [
                'username' => $username,
                'saml_roles' => $samlRoles,
            ]);
            abort(403, 'Unauthorized: this account does not have access.');
        }

        DB::table('saml_message_ids')->insert([
            'message_id' => $messageId,
            'username' => $username,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $arabicFullName = $attrs['arabic_full_name'][0] ?? null;
        $englishFullName = $attrs['english_full_name'][0] ?? null;
        $displayName = ! empty(trim($arabicFullName ?? '')) ? $arabicFullName : $englishFullName;

        $user = User::updateOrCreate(['username' => $username], [
            'name' => $displayName,
            'uuid' => $attrs['uuid'][0] ?? null,
            'employee_id' => $attrs['employee_id'][0] ?? null,
            'identity' => $attrs['identity'][0] ?? null,
            'identity_type' => $attrs['identity_type'][0] ?? null,
            'arabic_first_name' => $attrs['arabic_first_name'][0] ?? null,
            'arabic_father_name' => $attrs['arabic_father_name'][0] ?? null,
            'arabic_grand_father_name' => $attrs['arabic_grand_father_name'][0] ?? null,
            'arabic_family_name' => $attrs['arabic_family_name'][0] ?? null,
            'arabic_full_name' => $arabicFullName,
            'english_first_name' => $attrs['english_first_name'][0] ?? null,
            'english_father_name' => $attrs['english_father_name'][0] ?? null,
            'english_grand_father_name' => $attrs['english_grand_father_name'][0] ?? null,
            'english_family_name' => $attrs['english_family_name'][0] ?? null,
            'english_full_name' => $englishFullName,
            'mobile' => $attrs['mobile'][0] ?? null,
            'email' => $attrs['email_address'][0] ?? null,
            'role' => $role,
            'saml_roles' => ! empty($samlRoles) ? json_encode($samlRoles) : null,
            'loggedin_via_nafath' => $attrs['loggedin_via_nafath'][0] ?? null,
        ]);

        Auth::login($user);

        try {
            DailyVisit::incrementToday();
        } catch (\Exception $e) {
            Log::warning('SAML login: failed to increment daily visits', ['error' => $e->getMessage()]);
        }

        session([
            'saml2_name_id' => $samlUser->getNameId(),
            'saml2_session_index' => $samlUser->getSessionIndex(),
            'saml_login_processed' => true,
            'login_timestamp' => now()->timestamp,
        ]);

        Log::info('SAML login', [
            'username' => $user->username,
            'user_id' => $user->id,
            'role' => $role,
            'saml_roles' => $samlRoles,
        ]);
    }

    private function resolveRole(string $username, array $samlRoles): ?string
    {
        $samlRoles = array_map('strtolower', $samlRoles);

        if (User::where('username', $username)->first()?->isAdmin()) {
            return 'admin';
        }

        if (array_intersect(['student', 'graduate-student'], $samlRoles)) {
            return 'student';
        }
        if (\in_array('instructor', $samlRoles, true)) {
            return 'faculty';
        }

        return null;
    }
}
