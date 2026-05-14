@extends('layouts.app')

@section('title', __('Usage Dashboard') . ' - Q SPARK')

@php
  // Dummy data fallbacks for Layan (ليان حمد الجريش) - Top #3 student over 6 months
  // All values are consistent with Master Data Sheet for a 6-month semester period
  $dummyTotalVisits = 812;     // إجمالي الزيارات - matches admin dashboard Top 3 Students
  $dummyQuizPoints = 24500;    // إجمالي نقاط اللعب - 6 months (~130 points/day)
  $dummyAvgDailyVisits = 5;    // متوسط الزيارات اليومية (812 ÷ 180 days ≈ 4.5)
  $dummyTotalRequests = 142;   // إجمالي الطلبات - homework + tasks over 6 months
  $dummyStudentRank = 3;       // الترتيب - Top 3 in university
  $dummyStudentsCount = 10000; // إجمالي الطلاب في الجامعة
  $dummyAcademicImprovement = [
    'improvement_rate' => 2.32,  // نسبة التحسن: +2.32%
    'before_gpa' => 4.75,        // المعدل السابق
    'after_gpa' => 4.86,         // المعدل التراكمي
    'current_semester' => '462',
    'status' => 'success'
  ];
  $dummyActivityCompletionRate = 85.5;  // High completion for Top 3 student
  $dummyAverageDailyVisits = 3;  // Class average (lower than Layan for Top 3 student)

  // Quiz game dummy values - Layan (Top 3) should be HIGHER than class average
  $dummyQuizClassAvg = 175;   // متوسط الصف (between 150-200)
  $dummyQuizStudentAvg = 380; // أدائك (Layan's performance - between 300-450)

  // Daily visits chart dummy values - Layan should be HIGHER than average
  $dummyDailyVisitsAvg = 3;   // متوسط الطلاب (2-3 visits per day)
  $dummyStudentVisitsAvg = 5; // زياراتك (Layan's visits - 4-8 per day)

  // Use real data if available, otherwise use dummy data
  $displayTotalVisits = ($totalStudentVisits ?? 0) > 0 ? $totalStudentVisits : $dummyTotalVisits;
  $displayQuizPoints = ($totalStudentQuizPoints ?? 0) > 0 ? $totalStudentQuizPoints : $dummyQuizPoints;
  $displayAvgDailyVisits = ($averageStudentVisits ?? 0) > 0 ? $averageStudentVisits : $dummyAvgDailyVisits;
  $displayTotalRequests = ($totalStudentRequests ?? 0) > 0 ? $totalStudentRequests : $dummyTotalRequests;
  $displayStudentRank = ($studentRank ?? 0) > 0 ? $studentRank : $dummyStudentRank;
  $displayStudentsCount = ($studentsCount ?? 0) > 0 ? $studentsCount : $dummyStudentsCount;
  $displayAcademicImprovement = (isset($academicImprovement['status']) && $academicImprovement['status'] === 'success') ? $academicImprovement : $dummyAcademicImprovement;
  $displayActivityCompletionRate = ($activityCompletionRate ?? 0) > 0 ? $activityCompletionRate : $dummyActivityCompletionRate;
  $displayAverageDailyVisits = ($averageDailyVisits ?? 0) > 0 ? $averageDailyVisits : $dummyAverageDailyVisits;

  // Quiz chart averages - always show realistic values
  $quizClassAvgValue = (isset($quizAverage) && is_array($quizAverage) && count($quizAverage) > 0 && array_sum($quizAverage) > 0)
    ? array_sum($quizAverage) / count($quizAverage)
    : $dummyQuizClassAvg;
  $quizStudentAvgValue = (isset($quizStudent) && is_array($quizStudent) && count($quizStudent) > 0 && array_sum($quizStudent) > 0)
    ? array_sum($quizStudent) / count($quizStudent)
    : $dummyQuizStudentAvg;

  // Daily visits chart averages
  $displayDailyVisitsAvg = (isset($dailyVisits) && is_array($dailyVisits) && count($dailyVisits) > 0 && array_sum($dailyVisits) > 0)
    ? round(array_sum($dailyVisits) / count($dailyVisits))
    : $dummyDailyVisitsAvg;
  $displayStudentVisitsAvg = (isset($studentVisits) && is_array($studentVisits) && count($studentVisits) > 0 && array_sum($studentVisits) > 0)
    ? round(array_sum($studentVisits) / count($studentVisits))
    : $dummyStudentVisitsAvg;
@endphp

@section('content')
<div class="p-6 space-y-6">
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-extrabold" data-translate="usage_dashboard">{{ __('messages.usage_dashboard') }}</h2>

    <div class="hidden md:flex items-center gap-3">
      <div class="bg-white rounded-xl shadow px-4 py-2 text-center">
        <div class="text-xs text-gray-500">{{ __('messages.your_rank') }}</div>
        <div class="font-bold en-numbers">
          #{{ $displayStudentRank }} / {{ $displayStudentsCount }}
        </div>
      </div>
      <div class="bg-blue-50 text-blue-700 rounded-xl px-4 py-2 text-center">
        <div class="text-xs">{{ __('messages.top_label') }}</div>
        @php
          $rank = (int)$displayStudentRank;
          $total = max(1,(int)$displayStudentsCount);
          $percentile = $rank>0 ? round(($rank/$total)*100) : 0;
        @endphp
        <div class="font-bold en-numbers">{{ 100 - $percentile }}%</div>
      </div>
    </div>

    <form method="GET" action="{{ route('usage.dashboard') }}" class="flex gap-2 items-center" dir="ltr">
      <input type="date" name="start_date" value="{{ $startDate }}" class="px-3 py-2 border rounded-lg" placeholder="{{ __('messages.usage_from_date_placeholder') }}">
      <span data-translate="to">{{ __('messages.to') }}</span>
      <input type="date" name="end_date" value="{{ $endDate }}" class="px-3 py-2 border rounded-lg" placeholder="{{ __('messages.usage_to_date_placeholder') }}">
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" data-translate="update">{{ __('messages.update') }}</button>
    </form>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Metric 1: Total Student Visits -->
    <div class="bg-[#D1E4FF] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-[#5B8DEF] p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/></svg>
        </div>
        <div class="flex-1">
          <div class="font-bold text-gray-800" style="font-size: 15px;">{{ __('messages.total_visits') }}</div>
        </div>
      </div>
      <div class="text-3xl font-extrabold text-[#5B8DEF] en-numbers">{{ number_format($displayTotalVisits) }}</div>
      <p class="text-xs text-gray-500 mt-2">
        <span>{{ __('messages.from') }}</span>
        <span class="en-numbers font-semibold">{{ $startDate }}</span>
        <span>{{ __('messages.to') }}</span>
        <span class="en-numbers font-semibold">{{ $endDate }}</span>
      </p>
    </div>

    <!-- Metric 2: Total Student Quiz Points -->
    <div class="bg-[#FFE3CC] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-[#FF9F40] p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <div class="flex-1">
          <div class="font-bold text-gray-800" style="font-size: 15px;">{{ __('messages.total_quiz_points') }}</div>
        </div>
      </div>
      <div class="text-3xl font-extrabold text-[#FF9F40] en-numbers">{{ number_format($displayQuizPoints) }}</div>
      <p class="text-xs text-gray-500 mt-2">
        <span>{{ __('messages.from') }}</span>
        <span class="en-numbers font-semibold">{{ $startDate }}</span>
        <span>{{ __('messages.to') }}</span>
        <span class="en-numbers font-semibold">{{ $endDate }}</span>
      </p>
    </div>

    <!-- Metric 3: Average Daily Student Visits -->
    <div class="bg-[#E4E0FF] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-[#5A50D5] p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/></svg>
        </div>
        <div class="flex-1">
          <div class="font-bold text-gray-800" style="font-size: 15px;">{{ __('messages.avg_daily_visits') }}</div>
        </div>
      </div>
      <div class="text-3xl font-extrabold text-[#5A50D5] en-numbers">{{ $displayAvgDailyVisits }}</div>
      <p class="text-xs text-gray-500 mt-2">
        <span>{{ __('messages.from') }}</span>
        <span class="en-numbers font-semibold">{{ $startDate }}</span>
        <span>{{ __('messages.to') }}</span>
        <span class="en-numbers font-semibold">{{ $endDate }}</span>
      </p>
    </div>

    <!-- Metric 4: Total Student Requests -->
    <div class="bg-[#C0EFF2] rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-[#26B9C3] p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
        </div>
        <div class="flex-1">
          <div class="font-bold text-gray-800" style="font-size: 15px;">{{ __('messages.total_requests') }}</div>
        </div>
      </div>
      <div class="text-3xl font-extrabold text-[#26B9C3] en-numbers">{{ number_format($displayTotalRequests) }}</div>
      <p class="text-xs text-gray-500 mt-2">
        <span>{{ __('messages.from') }}</span>
        <span class="en-numbers font-semibold">{{ $startDate }}</span>
        <span>{{ __('messages.to') }}</span>
        <span class="en-numbers font-semibold">{{ $endDate }}</span>
      </p>
    </div>
  </div>

  <!-- New Metrics Row -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Academic Improvement Rate -->
    <div class="bg-gradient-to-br from-[#66BB6A] via-[#4CAF50] to-[#388E3C] rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300">
      <div class="flex items-center gap-3 mb-4">
        <div class="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="flex-1 flex items-center gap-2">
          <div>
            <div class="font-bold text-white text-base" data-translate="academic_improvement">{{ __('messages.academic_improvement') }}</div>
            <div class="text-xs text-white/80 mt-0.5" data-translate="semester_performance_comparison">{{ __('messages.semester_performance_comparison') }}</div>
          </div>
          <!-- Info Icon -->
          <div class="relative group">
            <svg class="w-4 h-4 text-white/70 hover:text-white cursor-help transition-colors" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <div class="hidden group-hover:block absolute z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl -top-2 left-6">
              <div class="font-semibold mb-1">{{ __('messages.academic_improvement_tooltip_title') }}</div>
              <p>{{ __('messages.academic_improvement_tooltip_desc') }}</p>
              <div class="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-3"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Improvement Rate -->
      <div class="text-center mb-4">
        <div class="text-4xl font-extrabold en-numbers mb-1">
          @if($displayAcademicImprovement['improvement_rate'] > 0)
            <span class="text-white">+{{ number_format($displayAcademicImprovement['improvement_rate'], 2) }}%</span>
          @elseif($displayAcademicImprovement['improvement_rate'] < 0)
            <span class="text-red-200">{{ number_format($displayAcademicImprovement['improvement_rate'], 2) }}%</span>
          @else
            <span class="text-white/80">{{ number_format($displayAcademicImprovement['improvement_rate'], 2) }}%</span>
          @endif
        </div>
        <div class="text-xs text-white/80 font-medium">{{ __('messages.improvement_rate') }}</div>
      </div>

      <!-- GPA Comparison -->
      <div class="bg-white/25 backdrop-blur-sm rounded-xl p-3 space-y-2">
        <!-- Previous GPA (last_recorded_gpa) -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-white"></div>
            <span class="text-sm text-white font-medium">{{ __('messages.previous_gpa') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-white en-numbers">{{ number_format($displayAcademicImprovement['before_gpa'], 2) }}</span>
          </div>
        </div>

        <!-- Arrow Indicator -->
        <div class="flex justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clip-rule="evenodd"/>
          </svg>
        </div>

        <!-- Current Cumulative GPA -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-yellow-300"></div>
            <span class="text-sm text-white font-medium">{{ __('messages.cumulative_gpa') }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-lg font-bold text-yellow-200 en-numbers">{{ number_format($displayAcademicImprovement['after_gpa'], 2) }}</span>
          </div>
        </div>

        <!-- Difference -->
        <div class="pt-2 border-t border-white/30">
          <div class="flex items-center justify-between">
            <span class="text-xs text-white/80">{{ __('messages.difference') }}</span>
            <span class="text-sm font-bold en-numbers text-white">
              @if($displayAcademicImprovement['improvement_rate'] > 0)
                +{{ number_format($displayAcademicImprovement['after_gpa'] - $displayAcademicImprovement['before_gpa'], 2) }}
              @else
                {{ number_format($displayAcademicImprovement['after_gpa'] - $displayAcademicImprovement['before_gpa'], 2) }}
              @endif
            </span>
          </div>
        </div>
      </div>

      <!-- Performance Indicator -->
      <div class="mt-3 text-center">
        @if($displayAcademicImprovement['improvement_rate'] > 0)
          <span class="inline-flex items-center gap-1 text-xs font-semibold text-green-800 bg-white/90 px-3 py-1 rounded-full shadow-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            {{ __('messages.performance_improved') }}
          </span>
        @elseif($displayAcademicImprovement['improvement_rate'] < 0)
          <span class="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-white/90 px-3 py-1 rounded-full shadow-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {{ __('messages.performance_needs_improvement') }}
          </span>
        @else
          <span class="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-white/90 px-3 py-1 rounded-full shadow-sm">
            {{ __('messages.performance_stable') }}
          </span>
        @endif
      </div>
    </div>

    <!-- Activity Completion Rate -->
    <div class="bg-gradient-to-br from-[#FFA726] via-[#FF9800] to-[#F57C00] rounded-2xl p-5 shadow-md hover:shadow-xl transition-all duration-300">
      <div class="flex items-center gap-3 mb-4">
        <div class="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="flex-1 flex items-center gap-2">
          <div>
            <div class="font-bold text-white text-base" data-translate="activity_completion">{{ __('messages.activity_completion') }}</div>
            <div class="text-xs text-white/80 mt-0.5">{{ __('messages.activity_completion_subtitle') }}</div>
          </div>
          <!-- Info Icon -->
          <div class="relative group">
            <svg class="w-4 h-4 text-white/70 hover:text-white cursor-help transition-colors" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <div class="hidden group-hover:block absolute z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl -top-2 left-6">
              <div class="font-semibold mb-1">{{ __('messages.activity_completion_tooltip_title') }}</div>
              <p>{{ __('messages.activity_completion_tooltip_desc') }}</p>
              <div class="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-3"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Completion Percentage -->
      <div class="text-center mb-4">
        <div class="text-4xl font-extrabold text-white en-numbers mb-1">
          {{ number_format($displayActivityCompletionRate, 1) }}%
        </div>
        <div class="text-xs text-white/80 font-medium">{{ __('messages.completion_rate') }}</div>
      </div>

      <!-- Progress Bar -->
      <div class="mb-4">
        <div class="w-full bg-white/30 rounded-full h-3 shadow-inner">
          <div class="bg-white h-3 rounded-full transition-all duration-500 shadow-sm" style="width: {{ min($displayActivityCompletionRate, 100) }}%"></div>
        </div>
      </div>

      <!-- Activity Details -->
      <div class="bg-white/25 backdrop-blur-sm rounded-xl p-3 space-y-2">
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            <span class="text-white font-medium">{{ __('messages.game_attempts') }}</span>
          </div>
          <span class="text-white font-bold en-numbers">{{ $displayActivityCompletionRate >= 50 ? '✓' : '○' }}</span>
        </div>

        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"/>
            </svg>
            <span class="text-white font-medium">{{ __('messages.study_hours') }}</span>
          </div>
          <span class="text-white font-bold en-numbers">{{ $displayActivityCompletionRate >= 50 ? '✓' : '○' }}</span>
        </div>
      </div>

      <!-- Status Badge -->
      <div class="mt-3 text-center">
        @if($displayActivityCompletionRate >= 80)
          <span class="inline-flex items-center gap-1 text-xs font-semibold text-green-800 bg-white/90 px-3 py-1 rounded-full shadow-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            {{ __('messages.excellent_keep_going') }}
          </span>
        @elseif($displayActivityCompletionRate >= 50)
          <span class="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 bg-white/90 px-3 py-1 rounded-full shadow-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            {{ __('messages.good_can_improve') }}
          </span>
        @else
          <span class="inline-flex items-center gap-1 text-xs font-semibold text-orange-800 bg-white/90 px-3 py-1 rounded-full shadow-sm">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            {{ __('messages.needs_more_activity') }}
          </span>
        @endif
      </div>
    </div>

  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Daily Visits Chart -->
    <div class="bg-white rounded-2xl p-6 shadow-lg">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div>
            <h3 class="font-bold text-xl text-gray-800">{{ __('messages.daily_visits') }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ __('messages.platform_daily_visits') }}</p>
          </div>
          <!-- Info Icon -->
          <div class="relative group">
            <svg class="w-5 h-5 text-gray-400 hover:text-blue-500 cursor-help transition-colors" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <div class="hidden group-hover:block absolute z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl -top-2 left-6">
              <div class="font-semibold mb-1">{{ __('messages.daily_visits_tooltip_title') }}</div>
              <p>{{ __('messages.daily_visits_tooltip_desc') }}</p>
              <div class="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-3"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="inline-flex items-center gap-1.5 bg-purple-50 px-2.5 py-1.5 rounded-lg">
            <span class="w-3 h-3 rounded-full bg-purple-500"></span>
            <span class="font-medium text-purple-700">{{ __('messages.students_average') }}</span>
          </span>
          <span class="inline-flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded-lg">
            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
            <span class="font-medium text-blue-700">{{ __('messages.you') }}</span>
          </span>
        </div>
      </div>
      <div class="relative h-72">
        <canvas id="requestsChart" class="w-full h-full"></canvas>
        <div id="requestsTooltip" class="hidden absolute z-10 rounded-lg bg-white/95 shadow-lg ring-1 ring-black/5 px-3 py-2 text-sm"></div>
      </div>
      <!-- Comparison Stats -->
      <div class="mt-4 grid grid-cols-2 gap-3">
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-gray-600 mb-1">{{ __('messages.students_average') }}</div>
              <div class="text-lg font-bold text-purple-600 en-numbers">{{ number_format($displayDailyVisitsAvg, 0) }}</div>
            </div>
            <svg class="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
          </div>
        </div>
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-gray-600 mb-1">{{ __('messages.your_visits') }}</div>
              <div class="text-lg font-bold text-blue-600 en-numbers">{{ number_format($displayStudentVisitsAvg, 0) }}</div>
            </div>
            <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Daily Quiz Game Chart -->
    <div class="bg-white rounded-2xl p-6 shadow-lg">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <div>
            <h3 class="font-bold text-xl text-gray-800" data-translate="daily_quiz_game">{{ __('messages.daily_quiz_game') }}</h3>
            <p class="text-xs text-gray-500 mt-1" data-translate="compare_performance_with_class">{{ __('messages.compare_performance_with_class') }}</p>
          </div>
          <!-- Info Icon -->
          <div class="relative group">
            <svg class="w-5 h-5 text-gray-400 hover:text-emerald-500 cursor-help transition-colors" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>
            <div class="hidden group-hover:block absolute z-50 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl -top-2 left-6">
              <div class="font-semibold mb-1">{{ __('messages.quiz_game_tooltip_title') }}</div>
              <p>{{ __('messages.quiz_game_tooltip_desc') }}</p>
              <div class="absolute w-2 h-2 bg-gray-900 transform rotate-45 -left-1 top-3"></div>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="inline-flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1.5 rounded-lg">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span class="font-medium text-emerald-700">{{ __('messages.class_average') }}</span>
          </span>
          <span class="inline-flex items-center gap-1.5 bg-blue-50 px-2.5 py-1.5 rounded-lg">
            <span class="w-3 h-3 rounded-full bg-blue-500"></span>
            <span class="font-medium text-blue-700">{{ __('messages.you') }}</span>
          </span>
        </div>
      </div>
      <div class="relative h-72">
        <canvas id="quizChart" class="w-full h-full"></canvas>
        <div id="quizTooltip" class="hidden absolute z-10 rounded-lg bg-white/95 shadow-lg ring-1 ring-black/5 px-3 py-2 text-sm"></div>
      </div>
      <!-- Comparison Stats -->
      <div class="mt-4 grid grid-cols-2 gap-3">
        <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-gray-600 mb-1">{{ __('messages.class_average') }}</div>
              <div class="text-lg font-bold text-emerald-600 en-numbers">{{ number_format($quizClassAvgValue) }}</div>
            </div>
            <svg class="w-8 h-8 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
          </div>
        </div>
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-xs text-gray-600 mb-1">{{ __('messages.your_performance') }}</div>
              <div class="text-lg font-bold text-blue-600 en-numbers">{{ number_format($quizStudentAvgValue) }}</div>
            </div>
            <svg class="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', () => {
  // Dummy data for charts when real data is empty - realistic and consistent values
  // Using current week dates for realistic display
  const today = new Date();
  const dummyDates = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dummyDates.push(d.toISOString().split('T')[0]);
  }

  // Daily visits - متوسط الطلاب (all students average per day)
  // Average should be around 3 (2-3 visits) - Layan is Top 3 so class average is lower
  const dummyVisits = [2, 3, 3, 2, 4, 3, 2];  // avg ~3

  // Student's own visits - زياراتك (Layan's visits)
  // Average should be 5 (4-8 visits per day) - Layan is Top 3 so she visits more
  const dummyStudentVisits = [5, 7, 4, 8, 6, 5, 6];  // avg ~5-6

  // Quiz game - أدائك (Layan's performance) - Top 3 student
  // Average should be around 380 (between 300-450) - Layan outperforms the class
  const dummyQuizStudent = [320, 410, 350, 440, 380, 360, 400];  // avg ~380

  // Quiz game - متوسط الصف (class average) - LOWER than Layan per user preference
  // Average should be around 175 (between 150-200)
  const dummyQuizAverage = [160, 185, 170, 195, 165, 180, 175];  // avg ~175

  let rawDates = @json($dates ?? []);
  let visits = (@json($dailyVisits ?? []) || []).map(Number);
  let studentVisitsData = (@json($studentVisits ?? []) || []).map(Number);
  let studentQuiz = (@json($quizStudent ?? $tokens ?? []) || []).map(Number);
  let avgQuiz = (@json($quizAverage ?? $dailyVisits ?? []) || []).map(Number);

  // Use dummy data if real data is empty or all zeros
  const hasRealData = (arr) => arr.length > 0 && arr.some(v => v > 0);

  if (!hasRealData(visits) || rawDates.length === 0) {
    rawDates = dummyDates;
    visits = dummyVisits;
    studentVisitsData = dummyStudentVisits;
  }

  if (!hasRealData(studentQuiz)) {
    studentQuiz = dummyQuizStudent;
  }

  if (!hasRealData(avgQuiz)) {
    avgQuiz = dummyQuizAverage;
  }

  const labels = rawDates.map(d => {
    const date = new Date(`${d}T00:00:00`);
    const ar = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
    const en = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return '{{ app()->getLocale() }}' === 'ar' ? ar[date.getDay()] : en[date.getDay()];
  });

  const fmt = (n) => {
    const v = Number(n)||0;
    if (v >= 1e9) return (v/1e9).toFixed(1).replace(/\.0$/,'')+'B';
    if (v >= 1e6) return (v/1e6).toFixed(1).replace(/\.0$/,'')+'M';
    if (v >= 1e3) return (v/1e3).toFixed(1).replace(/\.0$/,'')+'K';
    return v.toLocaleString();
  };

  function setupCanvas(canvas){
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.max(300, rect.width * dpr);
    canvas.height = Math.max(220, rect.height * dpr);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr,0,0,dpr,0,0);
    return { ctx, w: rect.width, h: rect.height };
  }

  function frame(ctx, w, h, pad=50){
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, 12);
    ctx.lineTo(pad, h - pad);
    ctx.lineTo(w - 12, h - pad);
    ctx.stroke();
    return { left: pad, top: 12, right: w - 12, bottom: h - pad };
  }

  function drawGridY(ctx, area, max, ticks=5){
    const {left, right, top, bottom} = area;
    ctx.font = '12px ui-sans-serif, system-ui';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for(let i=0;i<=ticks;i++){
      const y = bottom - (bottom - top) * (i/ticks);
      const v = Math.round(max * i / ticks);
      ctx.fillStyle = '#6b7280';
      ctx.fillText(fmt(v), left - 8, y);
      ctx.strokeStyle = '#f3f4f6';
      ctx.beginPath(); ctx.moveTo(left, y); ctx.lineTo(right, y); ctx.stroke();
    }
  }

  function drawLabelsX(ctx, area, labels){
    const {left, right, bottom} = area;
    const step = (right - left) / Math.max(1, labels.length);
    ctx.font = '12px ui-sans-serif, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#6b7280';
    const skip = Math.ceil(labels.length / 8);
    labels.forEach((t,i)=>{ if(i%skip===0) ctx.fillText(t, left + step*(i+.5), bottom + 6); });
  }

  function niceMax(v){
    if (!isFinite(v) || v<=0) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v)));
    return Math.ceil(v/p)*p;
  }

  function createTooltip(el){
    return {
      show(x,y,html){ el.style.transform = 'translate(-50%,-110%)'; el.style.left = x+'px'; el.style.top = y+'px'; el.innerHTML = html; el.classList.remove('hidden'); },
      hide(){ el.classList.add('hidden'); }
    }
  }

  function barChart(canvas, tooltipEl, labels, data, color='rgba(59,130,246,0.75)', stroke='rgba(59,130,246,1)'){
    const {ctx,w,h} = setupCanvas(canvas);
    const area = frame(ctx,w,h,50);
    const max = niceMax(Math.max(...data,1));
    drawGridY(ctx,area,max,5);
    drawLabelsX(ctx,area,labels);

    const pw = area.right - area.left;
    const n = Math.max(1,data.length);
    const gap = 8;
    const bw = Math.max(6,(pw/n)-gap);

    const bars = [];
    ctx.fillStyle = color;
    ctx.strokeStyle = stroke;
    data.forEach((v,i)=>{
      const x = area.left + i*(bw+gap);
      const y = area.bottom - (v/max)*(area.bottom-area.top);
      const hBar = area.bottom - y;
      ctx.fillRect(x,y,bw,hBar);
      ctx.strokeRect(x,y,bw,hBar);
      bars.push({x,y,w:bw,h:hBar,label:labels[i]||'',value:v});
    });

    const tip = createTooltip(tooltipEl);

    canvas.addEventListener('mousemove', (e)=>{
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;

      let hit = null;
      for(const b of bars){
        if(mx>=b.x && mx<=b.x+b.w && my>=b.y && my<=b.y+b.h){ hit=b; break; }
      }

      ctx.clearRect(0,0,w,h);
      frame(ctx,w,h,50);
      drawGridY(ctx,area,max,5);
      drawLabelsX(ctx,area,labels);
      data.forEach((v,i)=>{
        const b = bars[i];
        ctx.fillStyle = hit===b ? 'rgba(59,130,246,0.95)' : color;
        ctx.strokeStyle = hit===b ? '#2563eb' : stroke;
        ctx.fillRect(b.x,b.y,b.w,b.h);
        ctx.strokeRect(b.x,b.y,b.w,b.h);
      });

      if(hit){
        tip.show(hit.x+hit.w/2, hit.y, `<div class="font-semibold">${hit.label}</div><div class="text-blue-600">{{ __('messages.daily_visits') }}: <span class="en-numbers">${fmt(hit.value)}</span></div>`);
      }else{
        tip.hide();
      }
    });
    canvas.addEventListener('mouseleave', ()=> tip.hide());
  }

  function compareLineChart(canvas, tooltipEl, labels, dataA, dataB, colorA='#10b981', colorB='#3b82f6'){
    const {ctx,w,h} = setupCanvas(canvas);
    const area = frame(ctx,w,h,50);
    const max = niceMax(Math.max(...dataA, ...dataB, 1));
    drawGridY(ctx,area,max,5);
    drawLabelsX(ctx,area,labels);

    const toX = i => area.left + (area.right-area.left) * (i/Math.max(1,labels.length-1));
    const toY = v => area.bottom - (v/max)*(area.bottom-area.top);

    const A = dataA.map((v,i)=>({x:toX(i), y:toY(v), v, label:labels[i]||''}));
    const B = dataB.map((v,i)=>({x:toX(i), y:toY(v), v, label:labels[i]||''}));

    function render(active=-1){
      ctx.clearRect(0,0,w,h);
      frame(ctx,w,h,50);
      drawGridY(ctx,area,max,5);
      drawLabelsX(ctx,area,labels);

      const drawSeries = (pts, color, fill=false, lineWidth=3, dotSize=4) =>{
        ctx.beginPath();
        pts.forEach((p,i)=> i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        if(fill){
          ctx.lineTo(area.right, area.bottom);
          ctx.lineTo(area.left, area.bottom);
          ctx.closePath();
          // Create gradient fill
          const gradient = ctx.createLinearGradient(0, area.top, 0, area.bottom);
          gradient.addColorStop(0, color.replace('1)', '0.3)').replace('rgb', 'rgba'));
          gradient.addColorStop(1, color.replace('1)', '0.05)').replace('rgb', 'rgba'));
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        pts.forEach((p,i)=>{
          ctx.beginPath();
          // Draw outer ring for active point
          if(i===active){
            ctx.fillStyle = color.replace('1)', '0.3)').replace('rgb', 'rgba');
            ctx.arc(p.x, p.y, dotSize + 4, 0, Math.PI*2);
            ctx.fill();
          }
          // Draw main dot
          ctx.beginPath();
          ctx.fillStyle = '#ffffff';
          ctx.arc(p.x, p.y, i===active ? dotSize + 1 : dotSize, 0, Math.PI*2);
          ctx.fill();
          ctx.strokeStyle = color;
          ctx.lineWidth = i===active ? 3 : 2;
          ctx.stroke();
        });
      };

      // Draw student line (blue) with fill
      drawSeries(B, colorB, true, 3, 4);
      // Draw class average line (green) on top
      drawSeries(A, colorA, false, 3, 4);

      if(active>-1){
        const px = A[active]?.x ?? B[active].x;
        // Draw vertical line at hover point
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6,4]);
        ctx.beginPath();
        ctx.moveTo(px, area.top);
        ctx.lineTo(px, area.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    render();

    const tip = createTooltip(tooltipEl);

    canvas.addEventListener('mousemove',(e)=>{
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      let idx = 0, best = Infinity;
      A.forEach((p,i)=>{ const d = Math.abs(mx-p.x); if(d<best){ best=d; idx=i; }});
      if(best<=30){
        render(idx);
        const a = A[idx], b = B[idx];
        const diff = b.v - a.v;
        const diffPercent = a.v > 0 ? ((diff / a.v) * 100).toFixed(1) : 0;
        const diffColor = diff >= 0 ? 'text-green-600' : 'text-red-600';
        const diffIcon = diff >= 0 ? '↑' : '↓';

        tip.show(a.x, Math.min(a.y,b.y) - 10,
          `<div class="font-bold text-gray-800 mb-2 pb-2 border-b border-gray-200">${a.label}</div>
           <div class="space-y-1">
             <div class="flex items-center justify-between gap-4">
               <span class="text-emerald-600 font-medium">{{ __('messages.class_average_label') }}</span>
               <span class="en-numbers font-bold text-emerald-700">${fmt(a.v)}</span>
             </div>
             <div class="flex items-center justify-between gap-4">
               <span class="text-blue-600 font-medium">{{ __('messages.you_label') }}</span>
               <span class="en-numbers font-bold text-blue-700">${fmt(b?.v ?? 0)}</span>
             </div>
             <div class="flex items-center justify-between gap-4 pt-1 border-t border-gray-100">
               <span class="text-gray-600 text-xs">{{ __('messages.difference') }}</span>
               <span class="en-numbers font-bold ${diffColor}">${diffIcon} ${Math.abs(diffPercent)}%</span>
             </div>
           </div>`
        );
      }else{
        render(-1);
        tip.hide();
      }
    });
    canvas.addEventListener('mouseleave',()=>{ render(-1); tip.hide(); });
  }

  const rc = document.getElementById('requestsChart');
  const qc = document.getElementById('quizChart');
  const rTip = document.getElementById('requestsTooltip');
  const qTip = document.getElementById('quizTooltip');

  // Use compareLineChart for Daily Visits to show student vs average
  if (rc) compareLineChart(rc, rTip, labels, visits, studentVisitsData, '#9333ea', '#3b82f6');
  if (qc) compareLineChart(qc, qTip, labels, avgQuiz, studentQuiz);
});
</script>
@endpush