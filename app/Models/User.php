<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'username',
        'password',
        'employee_id',
        'student_id',
        'university_api_token',
        'university_api_token_expires_at',
        'identity',
        'mobile',
        'user_type',
        'sdaia_policy_accepted_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'university_api_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'sdaia_policy_accepted_at' => 'datetime',
            'university_api_token_expires_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->can('access_admin_panel');
    }

    public function hasAcceptedSdaiaPolicy(): bool
    {
        return $this->sdaia_policy_accepted_at !== null;
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole('Super Admin');
    }

    public function isAdmin(): bool
    {
        return $this->hasAnyRole(['Super Admin', 'Admin']);
    }

    public function isFaculty(): bool
    {
        return $this->hasAnyRole(['Faculty', 'Admin', 'Super Admin']);
    }

    public function isStudent(): bool
    {
        return $this->user_type === 'student' || !empty($this->student_id);
    }

    /**
     * The name to show in the UI — the full name with the family (last) name
     * dropped. The QU demo addresses faculty/students by their given name(s)
     * only, never the tribe/family name. Falls back to the full name when
     * there is just a single token.
     */
    public function displayName(): string
    {
        $name = trim($this->name ?? '');

        if ($name === '') {
            return '';
        }

        $parts = preg_split('/\s+/', $name);

        return \count($parts) > 1
            ? implode(' ', \array_slice($parts, 0, -1))
            : $name;
    }
}
