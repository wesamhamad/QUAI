<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class StudentGoalProgress extends Model
{
    protected $table = 'student_goal_progress';

    protected $fillable = [
        'student_id',
        'recommendation_id',
        'goal_type',
        'goal_category',
        'goal_description',
        'target_value',
        'current_value',
        'completion_percentage',
        'status',
        'start_date',
        'target_date',
        'completed_date',
        'notes',
    ];

    protected $casts = [
        'target_value' => 'decimal:2',
        'current_value' => 'decimal:2',
        'start_date' => 'date',
        'target_date' => 'date',
        'completed_date' => 'date',
    ];

    /**
     * Get the recommendation associated with this goal
     */
    public function recommendation()
    {
        return $this->belongsTo(StudentMonthlyRecommendation::class, 'recommendation_id');
    }

    /**
     * Get the student associated with this goal
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id', 'student_id');
    }

    /**
     * Update progress based on current value
     */
    public function updateProgress($currentValue)
    {
        $this->current_value = $currentValue;
        
        if ($this->target_value > 0) {
            $this->completion_percentage = min(100, ($currentValue / $this->target_value) * 100);
        }
        
        // Update status based on completion
        if ($this->completion_percentage >= 100) {
            $this->status = 'completed';
            $this->completed_date = Carbon::now('Asia/Riyadh');
        } elseif ($this->completion_percentage > 0) {
            $this->status = 'in_progress';
        }
        
        $this->save();
    }

    /**
     * Get active goals for a student
     */
    public static function getActiveGoals($studentId)
    {
        return self::where('student_id', $studentId)
            ->whereIn('status', ['not_started', 'in_progress'])
            ->where('target_date', '>=', Carbon::now('Asia/Riyadh'))
            ->orderBy('target_date')
            ->get();
    }

    /**
     * Get completed goals for a student
     */
    public static function getCompletedGoals($studentId)
    {
        return self::where('student_id', $studentId)
            ->where('status', 'completed')
            ->orderBy('completed_date', 'desc')
            ->get();
    }
}

