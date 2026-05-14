<?php

namespace App\QSpark\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class DailyVisit extends QSparkModel
{
    protected $fillable = [
        'visit_date',
        'visits_count',
    ];

    protected $casts = [
        'visit_date' => 'date',
    ];

    public static function incrementToday()
    {
        // firstOrCreate then increment(): a bare `visits_count + 1` expression
        // is invalid in the INSERT path (the column has no value yet), so split
        // the create (seed at 0) from the atomic UPDATE ... SET col = col + 1.
        $record = static::firstOrCreate(
            ['visit_date' => Carbon::today()],
            ['visits_count' => 0]
        );

        $record->increment('visits_count');

        return $record;
    }

    public static function getVisitsForDateRange($startDate, $endDate)
    {
        return static::whereBetween('visit_date', [$startDate, $endDate])
            ->orderBy('visit_date')
            ->get();
    }

    public static function getTodayVisits()
    {
        $today = Carbon::today();
        $record = static::where('visit_date', $today)->first();
        return $record ? $record->visits_count : 0;
    }

    public static function getWeekVisits()
    {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        return static::whereBetween('visit_date', [$startOfWeek, $endOfWeek])
            ->sum('visits_count');
    }

    public static function getMonthVisits()
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();

        return static::whereBetween('visit_date', [$startOfMonth, $endOfMonth])
            ->sum('visits_count');
    }
}