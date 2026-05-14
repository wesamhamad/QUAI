<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class AdminFacultyCache extends Model
{
    protected $table = 'admin_faculty_caches';

    protected $fillable = [
        'instructor_id',
        'name_ar',
        'email',
        'faculty_no',
        'faculty_name',
        'dept_no',
        'dept_name',
        'rank_code',
        'rank_name',
        'last_synced_at',
    ];

    protected $casts = [
        'last_synced_at' => 'datetime',
    ];

    /**
     * Get all faculty members
     */
    public static function getAllFaculty()
    {
        return self::orderBy('faculty_no')
            ->orderBy('dept_no')
            ->orderBy('name_ar')
            ->get();
    }

    /**
     * Get faculty by college
     */
    public static function getByFaculty($facultyNo)
    {
        return self::where('faculty_no', $facultyNo)
            ->orderBy('dept_no')
            ->orderBy('name_ar')
            ->get();
    }

    /**
     * Get faculty by department
     */
    public static function getByDepartment($facultyNo, $deptNo)
    {
        return self::where('faculty_no', $facultyNo)
            ->where('dept_no', $deptNo)
            ->orderBy('name_ar')
            ->get();
    }

    /**
     * Sync faculty data from Oracle
     */
    public static function syncFromOracle($facultyData)
    {
        // Delete old data
        self::truncate();

        $now = Carbon::now();
        $insertData = [];

        foreach ($facultyData as $faculty) {
            $insertData[] = [
                'instructor_id' => $faculty->instructor_id ?? null,
                'name_ar' => $faculty->name_ar ?? null,
                'email' => $faculty->email ?? null,
                'faculty_no' => $faculty->faculty_no ?? null,
                'faculty_name' => $faculty->faculty_name ?? null,
                'dept_no' => $faculty->dept_no ?? null,
                'dept_name' => $faculty->dept_name ?? null,
                'rank_code' => $faculty->rank_code ?? null,
                'rank_name' => $faculty->rank_name ?? null,
                'last_synced_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        // Insert in chunks
        $chunkSize = 500;
        foreach (array_chunk($insertData, $chunkSize) as $chunk) {
            self::insert($chunk);
        }

        return count($insertData);
    }
}
