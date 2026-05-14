<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizScore extends QSparkModel
{
    protected $fillable = [
        'user_id',
        'course_id',
        'attachment_id',
        'thread_id',
        'score',
        'correct_count',
        'total_count',
        'streak_max',
        'time_taken_ms',
        'played_at',
    ];

    protected $casts = [
        'played_at' => 'datetime',
        'score' => 'integer',
        'correct_count' => 'integer',
        'total_count' => 'integer',
        'streak_max' => 'integer',
        'time_taken_ms' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
