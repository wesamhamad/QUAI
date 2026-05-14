<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudentPlayHour;
use Illuminate\Support\Facades\Log;
use App\Models\Student;

class PlayTimeController extends Controller
{
    public function recordPlayTime(Request $request)
    {
        $request->validate([
            'student_id' => 'required|string',
            'minutes' => 'required|integer|min:1|max:120'
        ]);

        try {
            Log::info('Recording play time', [
                'student_id' => $request->student_id,
                'minutes' => $request->minutes
            ]);

            // Record in StudentPlayHour
            $result = StudentPlayHour::addPlayTime(
                $request->student_id,
                $request->minutes
            );

            // Update total study hours in Student model
            $student = Student::where('student_id', $request->student_id)->first();
            if ($student) {
                $student->addStudyHours($request->minutes);
            }

            Log::info('Play time recorded successfully', ['result' => $result]);

            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            Log::error('Failed to record play time: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }
}
