<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizStreak extends QSparkModel
{
    protected $fillable = [
        'user_id',
        'current_streak',
        'longest_streak',
        'last_played_on',
    ];

    protected $casts = [
        'last_played_on' => 'date',
        'current_streak' => 'integer',
        'longest_streak' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
