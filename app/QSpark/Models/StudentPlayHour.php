<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class StudentPlayHour extends QSparkModel
{
    protected $fillable = [
        'student_id',
        'play_date',
        'minutes_played',
    ];

    protected $casts = [
        'play_date' => 'date',
    ];

    public static function addPlayTime($studentId, $minutes)
    {
        // firstOrCreate then increment(): a bare `minutes_played + N` expression
        // is invalid in the INSERT path, and increment()'s amount is bound as a
        // parameter so $minutes is never interpolated into raw SQL.
        $record = static::firstOrCreate(
            [
                'student_id' => $studentId,
                'play_date' => Carbon::today('Asia/Riyadh'),
            ],
            ['minutes_played' => 0]
        );

        $record->increment('minutes_played', $minutes);

        return $record;
    }

    public static function getTodayMinutes($studentId)
    {
        $today = Carbon::today('Asia/Riyadh');

        $record = static::where('student_id', $studentId)
            ->where('play_date', $today)
            ->first();

        return $record ? (int) $record->minutes_played : 0;
    }
}