<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\DemoData;
use Illuminate\Http\Request;

class QSparkController extends Controller
{
    /** Server-rendered QSpark hub: stats, courses, paths, projects, achievements. */
    public function index(Request $request)
    {
        $user = $request->user();

        // Faculty/Admin can preview any student's hub via ?student_id=...
        $impersonate = $request->query('student_id');
        if (is_string($impersonate) && $impersonate !== ''
            && $user instanceof User
            && $user->hasAnyRole(['Faculty', 'Admin', 'Super Admin'])) {
            $studentId = $impersonate;
        } else {
            $studentId = ($user instanceof User ? $user->student_id : null) ?: '443211517';
        }

        return view('qspark.index', [
            'studentId'    => $studentId,
            'stats'        => DemoData::qsparkStats($studentId),
            'courses'      => DemoData::qsparkCourses($studentId),
            'paths'        => DemoData::qsparkPaths($studentId),
            'projects'     => DemoData::qsparkProjects($studentId),
            'achievements' => DemoData::qsparkAchievements($studentId),
            'sessions'     => DemoData::qsparkLiveSessions($studentId),
        ]);
    }
}
