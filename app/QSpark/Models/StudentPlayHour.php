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
        $today = Carbon::today('Asia/Riyadh');

        return static::updateOrCreate(
            [
                'student_id' => $studentId,
                'play_date' => $today
            ],
            [
                'minutes_played' => \DB::raw("minutes_played + {$minutes}")
            ]
        );
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