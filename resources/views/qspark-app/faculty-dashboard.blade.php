@extends('qspark::layouts.app')

@section('title', __('messages.faculty_dashboard_page_title'))

@section('content')
<div class="p-6 space-y-6">
  <!-- Title -->
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-extrabold">{{ __('messages.faculty_dashboard_title') }}</h2>
  </div>

  <!-- Top Row - Statistics Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Students -->
    <div class="bg-[#DFF6E7] rounded-2xl p-4">
      <div class="flex items-center gap-2">
        <div class="bg-[#25935F] p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold">{{ __('messages.faculty_total_students') }}</div>
      </div>
      <div class="text-3xl font-extrabold number">{{ $stats['total_students'] }}</div>
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="bg-[#25935F] text-white text-xs py-1 px-2 rounded-full">{{ __('messages.faculty_active_student') }}</span>
      </div>
    </div>

    <!-- Average GPA -->
    <div class="bg-[#DFF6E7] rounded-2xl p-4">
      <div class="flex items-center gap-2">
        <div class="bg-[#54C08A] p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM12 9.5L4.5 7 12 3l7.5 4L12 9.5zM2 17l10 5 10-5v-2l-10 5-10-5v2z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold">{{ __('messages.faculty_average_gpa') }}</div>
      </div>
      <div class="text-3xl font-extrabold number">{{ number_format($stats['average_gpa'], 2) }} / 5</div>
      <div class="w-full bg-white rounded-full h-2 mt-2">
        <div class="bg-[#54C08A] h-2 rounded-full" style="width: {{ ($stats['average_gpa'] / 5 * 100) }}%"></div>
      </div>
    </div>

    <!-- Average Attendance -->
    <div class="bg-[#DFF6E7] rounded-2xl p-4">
      <div class="flex items-center gap-2">
        <div class="bg-[#25935F] p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold">{{ __('messages.faculty_average_attendance') }}</div>
      </div>
      <div class="text-3xl font-extrabold number">{{ number_format($stats['average_attendance'], 1) }} %</div>
      <div class="flex flex-wrap gap-2 mt-2">
        <span class="bg-[#88D8AD] text-white text-xs py-1 px-2 rounded-full">{{ __('messages.attendance_percentage_label') }}</span>
      </div>
    </div>

    <!-- At Risk Students -->
    <div class="bg-[#FECDCA] rounded-2xl p-4">
      <div class="flex items-center gap-2">
        <div class="bg-[#F04438] p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold">{{ __('messages.faculty_students_at_risk') }}</div>
      </div>
      <div class="text-3xl font-extrabold number">{{ $stats['students_at_risk'] }}</div>
      <div class="w-full bg-white rounded-full h-2 mt-2">
        <div class="bg-[#F04438] h-2 rounded-full" style="width: {{ $stats['total_students'] > 0 ? ($stats['students_at_risk'] / $stats['total_students'] * 100) : 0 }}%"></div>
      </div>
    </div>
  </div>

  <!-- Faculty Courses from Oracle -->
  @if(!empty($facultyCourses))
  <div class="bg-white rounded-2xl p-6 shadow">
    <h3 class="font-bold text-xl mb-6">{{ __('messages.faculty_courses_section') }}</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      @foreach($facultyCourses as $course)
        <div class="bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-xl p-4 border border-dga-primary-200 hover:shadow-md transition">
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h4 class="font-bold text-gray-800 text-sm mb-1">{{ $course->course_code ?? 'N/A' }}</h4>
              <p class="text-xs text-gray-600 line-clamp-2">{{ $course->course_name ?? __('messages.not_available') }}</p>
            </div>
            <div class="text-center">
              <div class="bg-dga-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {{ $course->total_students ?? 0 }}
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ __('messages.student_word') }}</p>
            </div>
          </div>

          <!-- Sections and Activities -->
          <div class="space-y-1.5 mt-3 pt-3 border-t border-blue-100">
            @foreach($course->sections as $section)
              <div class="flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5v-2l-10 5-10-5v2z"/>
                  </svg>
                  <span class="text-gray-600">{{ $section['activity_name'] ?? __('messages.activity') }}</span>
                  <span class="text-gray-400">•</span>
                  <span class="text-gray-500">{{ __('messages.section_label') }} {{ $section['section'] ?? 'N/A' }}</span>
                </div>
                <span class="bg-dga-primary-100 text-dga-primary-700 font-semibold px-2 py-0.5 rounded">
                  {{ $section['student_count'] ?? 0 }} {{ __('messages.student_word') }}
                </span>
              </div>
            @endforeach
          </div>
        </div>
      @endforeach
    </div>
  </div>
  @endif

  <!-- NEW: Faculty-Specific Metrics -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- Engagement Level -->
    <div class="bg-[#DFF6E7] rounded-2xl p-6 shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="bg-[#25935F] p-3 rounded-full">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800">{{ __('messages.engagement_level') }}</h3>
        </div>
        <button class="info-icon bg-[#25935F]/10 hover:bg-[#25935F]/20 rounded-full p-2 transition"
                data-tooltip="{{ __('messages.engagement_level_tooltip') }}">
          <svg class="w-5 h-5 text-[#25935F]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </button>
      </div>
      <div class="text-4xl font-extrabold mb-2 text-gray-800 number">{{ $engagementLevel['score'] }}%</div>
      <div class="text-sm text-gray-600 mb-3">{{ $engagementLevel['level'] }}</div>
      <div class="w-full bg-white rounded-full h-3">
        <div class="bg-[#88D8AD] h-3 rounded-full transition-all duration-500" style="width: {{ $engagementLevel['score'] }}%"></div>
      </div>
      <div class="mt-4 text-xs text-gray-600 space-y-1">
        <div class="flex justify-between">
          <span>{{ __('messages.questions_generated_count') }}</span>
          <span class="font-bold text-gray-800 number">{{ $engagementLevel['questions_generated'] }}</span>
        </div>

      </div>
    </div>

    <!-- Suggested Improvement Plans -->
    <div class="bg-[#DFF6E7] rounded-2xl p-6 shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="bg-[#25935F] p-3 rounded-full">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800">{{ __('messages.improvement_suggestions') }}</h3>
        </div>
        <button class="info-icon bg-[#25935F]/10 hover:bg-[#25935F]/20 rounded-full p-2 transition"
                data-tooltip="{{ __('messages.improvement_suggestions_tooltip') }}">
          <svg class="w-5 h-5 text-[#25935F]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </button>
      </div>
      <div class="text-4xl font-extrabold mb-1 text-gray-800 number">{{ number_format($totalQuestionsGenerated) }}</div>
      <div class="text-sm text-gray-600 mb-4">{{ __('messages.suggested_question') }}</div>
      <div class="mt-4 space-y-2">
        <div class="flex justify-between text-sm bg-white rounded-lg p-2">
          <span class="text-gray-600">{{ __('messages.time_saved') }}</span>
          <span class="font-bold text-gray-800 number">{{ number_format($totalQuestionsGenerated * 5) }} {{ __('messages.minutes_unit') }}</span>
        </div>
        <div class="flex justify-between text-sm bg-white rounded-lg p-2">
          <span class="text-gray-600">{{ __('messages.efficiency') }}</span>
          <span class="font-bold text-dga-primary-600">{{ __('messages.high_efficiency') }}</span>
        </div>
      </div>
    </div>

    <!-- Weak Areas -->
    <div class="bg-[#DFF6E7] rounded-2xl p-6 shadow">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="bg-[#54C08A] p-3 rounded-full">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800">{{ __('messages.remedial_plan_suggestion') }}</h3>
        </div>
        <button class="info-icon bg-[#54C08A]/10 hover:bg-[#54C08A]/20 rounded-full p-2 transition"
                data-tooltip="{{ __('messages.remedial_plan_tooltip') }}">
          <svg class="w-5 h-5 text-[#54C08A]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
          </svg>
        </button>
      </div>
      <div class="space-y-3 max-h-64 overflow-y-auto">
        @forelse($weakAreas as $index => $area)
          <div class="bg-white rounded-lg p-3 border border-orange-100 hover:shadow-md transition-all">
            <div class="flex justify-between items-start mb-2">
              <div class="text-sm font-semibold flex-1 text-gray-800">{{ $area['area'] }}</div>
              <span class="bg-[#54C08A] text-white text-xs px-2 py-1 rounded-full number">{{ $area['error_rate'] }}%</span>
            </div>
            <div class="w-full bg-dga-primary-100 rounded-full h-2 mb-2">
              <div class="bg-[#54C08A] h-2 rounded-full" style="width: {{ $area['error_rate'] }}%"></div>
            </div>
            <div class="flex justify-between items-center">
              <div class="text-xs text-gray-600">
                <span class="number">{{ $area['students_affected'] }}</span> {{ __('messages.students_affected') }}
              </div>
              <button onclick="getAISuggestions('{{ addslashes($area['area']) }}', {{ $area['error_rate'] }}, {{ $area['students_affected'] }})"
                      class="group flex items-center gap-2 bg-gradient-to-r from-dga-primary-500 to-dga-primary-500 hover:from-dga-primary-600 hover:to-dga-primary-600 text-white text-xs px-3 py-1.5 rounded-lg transition-all shadow-sm hover:shadow-md">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
                <span class="font-medium">{{ __('messages.remedial_plan_button') }}</span>
              </button>
            </div>
          </div>
        @empty
          <div class="text-center text-sm text-gray-500 py-4">
            {{ __('messages.no_sufficient_data') }}
          </div>
        @endforelse
      </div>
    </div>
  </div>

  <!-- Secondary metrics -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
    <!-- Top Students -->
    <div class="bg-white rounded-2xl p-6 shadow">
      <h3 class="font-bold text-xl mb-6">{{ __('messages.top_students') }}</h3>
      <div class="space-y-4">
        @forelse($topStudents as $index => $student)
          @if($index < 3)
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4 rtl:space-x-reverse">
              <div class="flex items-center justify-center w-8 h-8 rounded-full
                @if($index === 0) bg-dga-primary-100 text-dga-primary-600
                @elseif($index === 1) bg-gray-100 text-gray-600
                @else bg-dga-primary-100 text-dga-primary-600
                @endif font-bold">
                {{ $index + 1 }}
              </div>
              <div>
                <p class="text-gray-800 font-medium">{{ $student->student_name ?? __('messages.not_available') }}</p>
                <p class="text-gray-500 text-sm">{{ __('messages.gpa_label_short') }} <span class="number">{{ rtrim(rtrim(sprintf('%.2f', $student->last_recorded_gpa ?? 0), '0'), '.') }}</span></p>
                <p class="text-gray-400 text-xs">{{ $student->course_code ?? '' }} - {{ $student->course_name ?? '' }}</p>
              </div>
            </div>
            @if($index === 0)
              <span class="text-2xl">🥇</span>
            @elseif($index === 1)
              <span class="text-2xl">🥈</span>
            @else
              <span class="text-2xl">🥉</span>
            @endif
          </div>
          @endif
        @empty
          <div class="text-center py-8">
            <p class="text-gray-500">{{ __('messages.no_students') }}</p>
          </div>
        @endforelse
      </div>
    </div>

    <!-- GPA + Attendance Distribution -->
    <div class="space-y-6">
      <div class="bg-white rounded-2xl p-6 shadow">
        <h3 class="font-bold text-xl mb-6">{{ __('messages.gpa_distribution') }}</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <span class="text-gray-700">{{ __('messages.gpa_excellent') }}</span>
            <span class="font-bold text-green-600 number">{{ $gpaDistribution['excellent'] }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-dga-primary-50 rounded-xl">
            <span class="text-gray-700">{{ __('messages.gpa_very_good') }}</span>
            <span class="font-bold text-dga-primary-600 number">{{ $gpaDistribution['very_good'] }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-dga-primary-50 rounded-xl">
            <span class="text-gray-700">{{ __('messages.gpa_good') }}</span>
            <span class="font-bold text-dga-primary-600 number">{{ $gpaDistribution['good'] }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-dga-primary-50 rounded-xl">
            <span class="text-gray-700">{{ __('messages.gpa_pass') }}</span>
            <span class="font-bold text-dga-primary-600 number">{{ $gpaDistribution['pass'] }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-red-50 rounded-xl">
            <span class="text-gray-700">{{ __('messages.gpa_fail') }}</span>
            <span class="font-bold text-red-600 number">{{ $gpaDistribution['fail'] }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl p-6 shadow">
        <h3 class="font-bold text-xl mb-6">{{ __('messages.attendance_distribution') }}</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3 bg-green-50 rounded-xl">
            <span class="text-gray-700">{{ __('messages.attendance_excellent') }}</span>
            <span class="font-bold text-green-600 number">{{ $attendanceDistribution['excellent'] }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-dga-primary-50 rounded-xl">
            <span class="text-gray-700">{{ __('messages.attendance_good') }}</span>
            <span class="font-bold text-dga-primary-600 number">{{ $attendanceDistribution['good'] }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-dga-primary-50 rounded-xl">
            <span class="text-gray-700">{{ __('messages.attendance_warning_range') }}</span>
            <span class="font-bold text-dga-primary-600 number">{{ $attendanceDistribution['warning'] }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-red-50 rounded-xl">
            <span class="text-gray-700">{{ __('messages.attendance_critical') }}</span>
            <span class="font-bold text-red-600 number">{{ $attendanceDistribution['critical'] }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions + Faculty Info -->
    <div class="space-y-6">
      <div class="bg-white rounded-2xl p-6 shadow">
        <h3 class="font-bold text-xl mb-6">{{ __('messages.quick_actions') }}</h3>
        <div class="space-y-3">
          <a href="{{ route('qspark.faculty.courses') }}" class="block w-full bg-dga-primary-500 text-white text-center py-3 rounded-xl hover:bg-dga-primary-600 transition flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            {{ __('messages.my_courses_blackboard') }}
          </a>
          <a href="{{ route('qspark.faculty.students') }}" class="block w-full bg-green-500 text-white text-center py-3 rounded-xl hover:bg-green-600 transition">
            {{ __('messages.student_list') }}
          </a>
          <a href="{{ route('qspark.faculty.reports') }}" class="block w-full bg-dga-primary-500 text-white text-center py-3 rounded-xl hover:bg-dga-primary-600 transition">
            {{ __('messages.reports') }}
          </a>
        </div>
      </div>

      <div class="bg-gradient-to-br from-dga-primary-500 to-dga-primary-500 rounded-2xl p-6 shadow text-white">
        <h3 class="font-bold text-xl mb-4">{{ __('messages.faculty_info') }}</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-green-100">{{ __('messages.name') }}</span>
            <span class="font-bold">{{ auth()->user()->name }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-green-100">{{ __('messages.email') }}</span>
            <span class="font-bold text-sm">{{ auth()->user()->email }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-green-100">{{ __('messages.semester') }}</span>
            <span class="font-bold number">{{ $currentSemester ?? __('messages.not_available') }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-green-100">{{ __('messages.courses_count') }}</span>
            <span class="font-bold number">{{ $stats['total_courses'] }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-green-100">{{ __('messages.students_count') }}</span>
            <span class="font-bold number">{{ $stats['total_students'] }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Students at Risk - full width -->
  <div class="bg-white rounded-2xl p-6 shadow">
    <div class="flex items-center justify-between mb-6">
      <h3 class="font-bold text-xl text-red-600">{{ __('messages.faculty_students_at_risk') }}</h3>
      <span class="bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded-full">
        {{ count($studentsAtRisk) }} {{ __('messages.student_word') }}
      </span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      @forelse($studentsAtRisk as $index => $student)
        @if($index < 12)
        <div class="p-4 rounded-xl border-2 transition hover:shadow-md
          @if($student->risk_reason === 'both') bg-red-100 border-red-400
          @elseif($student->risk_reason === 'low_gpa') bg-dga-primary-50 border-dga-primary-300
          @else bg-dga-primary-50 border-dga-primary-300
          @endif">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <p class="font-bold text-gray-800">{{ $student->student_name ?? __('messages.not_available') }}</p>
                @if($student->risk_reason === 'both')
                  <span class="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">{{ __('messages.risk_double') }}</span>
                @elseif($student->risk_reason === 'low_gpa')
                  <span class="bg-dga-primary-600 text-white text-xs px-2 py-0.5 rounded-full">{{ __('messages.risk_low_gpa') }}</span>
                @else
                  <span class="bg-dga-primary-600 text-white text-xs px-2 py-0.5 rounded-full">{{ __('messages.risk_high_absence') }}</span>
                @endif
              </div>
              <p class="text-sm text-gray-600 mb-2">
                <span class="font-medium">{{ $student->course_code ?? '' }}</span> - {{ $student->course_name ?? '' }}
              </p>
              <div class="flex gap-4 text-sm">
                @if($student->last_recorded_gpa !== null)
                  <div class="flex items-center gap-1">
                    <span class="text-gray-500">{{ __('messages.gpa_label_short') }}</span>
                    <span class="font-bold number
                      @if($student->last_recorded_gpa < 3.0) text-red-600
                      @else text-gray-700
                      @endif">
                      {{ rtrim(rtrim(sprintf('%.2f', $student->last_recorded_gpa), '0'), '.') }}
                    </span>
                  </div>
                @endif
                @if($student->attendance_percent !== null)
                  <div class="flex items-center gap-1">
                    <span class="text-gray-500">{{ __('messages.attendance_label_short') }}</span>
                    <span class="font-bold number
                      @if($student->attendance_percent < 75) text-red-600
                      @else text-gray-700
                      @endif">
                      {{ number_format($student->attendance_percent, 1) }}%
                    </span>
                  </div>
                @endif
                @if($student->absence_percent !== null)
                  <div class="flex items-center gap-1">
                    <span class="text-gray-500">{{ __('messages.absence_label_short') }}</span>
                    <span class="font-bold number text-red-600">
                      {{ number_format($student->absence_percent, 1) }}%
                    </span>
                  </div>
                @endif
              </div>
            </div>
            <div class="text-right">
              <span class="text-2xl">
                @if($student->risk_reason === 'both') ⚠️
                @elseif($student->risk_reason === 'low_gpa') 📉
                @else 📅
                @endif
              </span>
            </div>
          </div>
        </div>
        @endif
      @empty
        <div class="col-span-full text-center py-8">
          <p class="text-green-600 font-medium">✅ {{ __('messages.no_students_at_risk') }}</p>
          <p class="text-gray-500 text-sm mt-2">{{ __('messages.all_students_doing_well') }}</p>
        </div>
      @endforelse
    </div>
    @if(count($studentsAtRisk) > 12)
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-500">
          {{ __('messages.additional_students_at_risk_prefix') }} {{ count($studentsAtRisk) - 12 }} {{ __('messages.additional_students_at_risk_suffix') }}
        </p>
      </div>
    @endif
  </div>
</div>

<style>
  /* Tooltip styles for info icons */
  .info-icon {
    position: relative;
    cursor: help;
  }

  .info-icon::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: 100%;
    right: 50%;
    transform: translateX(50%);
    margin-bottom: 8px;
    padding: 8px 12px;
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    font-size: 0.75rem;
    line-height: 1.4;
    border-radius: 6px;
    white-space: normal;
    width: 250px;
    text-align: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
    pointer-events: none;
    z-index: 1000;
  }

  .info-icon::before {
    content: '';
    position: absolute;
    bottom: 100%;
    right: 50%;
    transform: translateX(50%);
    margin-bottom: 2px;
    border: 6px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
    z-index: 1000;
  }

  .info-icon:hover::after,
  .info-icon:hover::before {
    opacity: 1;
    visibility: visible;
  }

  /* Smooth animations for cards */
  .bg-gradient-to-br {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }

  .bg-gradient-to-br:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }

  /* Custom scrollbar for weak areas */
  .max-h-48::-webkit-scrollbar {
    width: 6px;
  }

  .max-h-48::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  .max-h-48::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }

  .max-h-48::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.5);
  }
</style>

<!-- AI Suggestions Modal -->
<div id="aiSuggestionsModal" class="hidden" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: none; align-items: flex-start; justify-content: center; padding: 20px; padding-top: 80px; overflow-y: auto;">
  <div style="background: white; border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-width: 600px; width: 100%; margin-bottom: 20px;">
    <!-- Modal Header -->
    <div style="background: linear-gradient(to right, #25935F, #1B8354); padding: 16px; color: white; border-radius: 16px 16px 0 0;">
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="background: rgba(255,255,255,0.2); padding: 8px; border-radius: 50%;">
            <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <div>
            <h3 style="font-size: 18px; font-weight: bold; margin: 0;">{{ __('messages.remedial_plans_modal_title') }}</h3>
            <p id="modalAreaName" style="color: #B8EACB; font-size: 12px; margin: 4px 0 0 0;"></p>
          </div>
        </div>
        <button onclick="closeAIModal()" style="background: rgba(255,255,255,0.2); padding: 6px; border-radius: 50%; border: none; cursor: pointer; color: white;">
          <svg style="width: 20px; height: 20px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Modal Body -->
    <div id="aiSuggestionsContent" style="padding: 16px; max-height: 60vh; overflow-y: auto;">
      <!-- Loading State -->
      <div id="aiLoadingState" style="text-align: center; padding: 24px 0;">
        <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #25935F; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <p style="margin-top: 12px; color: #666; font-size: 14px;">{{ __('messages.analyzing_data') }}</p>
      </div>

      <!-- Suggestions Content -->
      <div id="aiSuggestionsResult" class="hidden" style="display: none;"></div>
    </div>
  </div>
</div>
<style>
@keyframes spin { to { transform: rotate(360deg); } }
</style>

<script>
  // Add smooth number counting animation
  document.addEventListener('DOMContentLoaded', function() {
    const numberElements = document.querySelectorAll('.number');

    numberElements.forEach(el => {
      const text = el.textContent.trim();
      // Only animate if it's a pure number
      if (/^\d+(\.\d+)?$/.test(text)) {
        const finalValue = parseFloat(text);
        const duration = 1000; // 1 second
        const steps = 30;
        const increment = finalValue / steps;
        let current = 0;
        let step = 0;

        const timer = setInterval(() => {
          step++;
          current += increment;

          if (step >= steps) {
            el.textContent = finalValue % 1 === 0 ? finalValue : finalValue.toFixed(1);
            clearInterval(timer);
          } else {
            el.textContent = current % 1 === 0 ? Math.floor(current) : current.toFixed(1);
          }
        }, duration / steps);
      }
    });
  });

  // AI Suggestions Functions
  function getAISuggestions(areaName, errorRate, studentsAffected) {
    const modal = document.getElementById('aiSuggestionsModal');
    const loadingState = document.getElementById('aiLoadingState');
    const suggestionsResult = document.getElementById('aiSuggestionsResult');
    const modalAreaName = document.getElementById('modalAreaName');

    // Show modal
    modal.style.display = 'flex';
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Reset states
    loadingState.style.display = 'block';
    suggestionsResult.style.display = 'none';
    modalAreaName.textContent = areaName;

    // Call AI API
    fetch('{{ route("qspark.faculty.ai-suggestions") }}', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': '{{ csrf_token() }}'
      },
      body: JSON.stringify({
        area: areaName,
        error_rate: errorRate,
        students_affected: studentsAffected
      })
    })
    .then(response => response.json())
    .then(data => {
      loadingState.style.display = 'none';
      suggestionsResult.style.display = 'block';

      if (data.success) {
        renderSuggestions(data.suggestions);
      } else {
        suggestionsResult.innerHTML = `
          <div style="text-align: center; padding: 32px 0; color: #F04438;">
            <svg style="width: 48px; height: 48px; margin: 0 auto 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p>{{ __('messages.error_generating_suggestions') }}</p>
            <p style="font-size: 14px; color: #666; margin-top: 8px;">${data.message || '{{ __('messages.please_try_again') }}'}</p>
          </div>
        `;
      }
    })
    .catch(error => {
      loadingState.style.display = 'none';
      suggestionsResult.style.display = 'block';
      suggestionsResult.innerHTML = `
        <div style="text-align: center; padding: 32px 0; color: #F04438;">
          <p>{{ __('messages.connection_error') }}</p>
        </div>
      `;
    });
  }

  function renderSuggestions(suggestions) {
    const container = document.getElementById('aiSuggestionsResult');

    let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';

    // Teaching Methods
    if (suggestions.teaching_methods && suggestions.teaching_methods.length > 0) {
      html += `
        <div style="background: #F3FCF6; border-radius: 8px; padding: 12px; border: 1px solid #B8EACB;">
          <h4 style="font-weight: bold; color: #14573A; font-size: 14px; margin: 0 0 8px 0;">  {{ __('messages.teaching_methods_title') }}</h4>
          <ul style="margin: 0; padding: 0; list-style: none; font-size: 13px;">
            ${suggestions.teaching_methods.map(method => `
              <li style="display: flex; align-items: flex-start; gap: 8px; color: #384250; margin-bottom: 4px;">
                <span style="color: #25935F;">•</span>
                <span>${method}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    // Activities
    if (suggestions.activities && suggestions.activities.length > 0) {
      html += `
        <div style="background: #ECFDF3; border-radius: 8px; padding: 12px; border: 1px solid #ABEFC6;">
          <h4 style="font-weight: bold; color: #085D3A; font-size: 14px; margin: 0 0 8px 0;">🎯 {{ __('messages.interactive_activities_title') }}</h4>
          <ul style="margin: 0; padding: 0; list-style: none; font-size: 13px;">
            ${suggestions.activities.map(activity => `
              <li style="display: flex; align-items: flex-start; gap: 8px; color: #384250; margin-bottom: 4px;">
                <span style="color: #17B26A;">•</span>
                <span>${activity}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    // Assessments
    if (suggestions.assessments && suggestions.assessments.length > 0) {
      html += `
        <div style="background: #F3FCF6; border-radius: 8px; padding: 12px; border: 1px solid #B8EACB;">
          <h4 style="font-weight: bold; color: #14573A; font-size: 14px; margin: 0 0 8px 0;">✅ {{ __('messages.assessment_methods_title') }}</h4>
          <ul style="margin: 0; padding: 0; list-style: none; font-size: 13px;">
            ${suggestions.assessments.map(assessment => `
              <li style="display: flex; align-items: flex-start; gap: 8px; color: #384250; margin-bottom: 4px;">
                <span style="color: #54C08A;">•</span>
                <span>${assessment}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    // Resources (Books & Websites)
    if (suggestions.resources && suggestions.resources.length > 0) {
      html += `
        <div style="background: #FFFCF5; border-radius: 8px; padding: 12px; border: 1px solid #FEDF89;">
          <h4 style="font-weight: bold; color: #93370D; font-size: 14px; margin: 0 0 8px 0;">📖 {{ __('messages.reference_books_websites_title') }}</h4>
          <ul style="margin: 0; padding: 0; list-style: none; font-size: 13px;">
            ${suggestions.resources.map(resource => `
              <li style="display: flex; align-items: flex-start; gap: 8px; color: #384250; margin-bottom: 4px;">
                <span style="color: #F79009;">•</span>
                <span>${resource}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    // YouTube Videos
    if (suggestions.youtube_videos && suggestions.youtube_videos.length > 0) {
      html += `
        <div style="background: #FEF3F2; border-radius: 8px; padding: 12px; border: 1px solid #FECDCA;">
          <h4 style="font-weight: bold; color: #912018; font-size: 14px; margin: 0 0 8px 0;">🎬 {{ __('messages.youtube_channels_videos_title') }}</h4>
          <ul style="margin: 0; padding: 0; list-style: none; font-size: 13px;">
            ${suggestions.youtube_videos.map(video => `
              <li style="display: flex; align-items: flex-start; gap: 8px; color: #384250; margin-bottom: 4px;">
                <span style="color: #F04438;">▶</span>
                <span>${video}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    // Online Platforms
    if (suggestions.online_platforms && suggestions.online_platforms.length > 0) {
      html += `
        <div style="background: #F3FCF6; border-radius: 8px; padding: 12px; border: 1px solid #B8EACB;">
          <h4 style="font-weight: bold; color: #14573A; font-size: 14px; margin: 0 0 8px 0;">🌐 {{ __('messages.online_learning_platforms_title') }}</h4>
          <ul style="margin: 0; padding: 0; list-style: none; font-size: 13px;">
            ${suggestions.online_platforms.map(platform => `
              <li style="display: flex; align-items: flex-start; gap: 8px; color: #384250; margin-bottom: 4px;">
                <span style="color: #25935F;">🔗</span>
                <span>${platform}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }

    html += '</div>';
    container.innerHTML = html;
  }

  function closeAIModal() {
    const modal = document.getElementById('aiSuggestionsModal');
    modal.style.display = 'none';
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // Close modal on backdrop click
  document.getElementById('aiSuggestionsModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
      closeAIModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAIModal();
    }
  });
</script>
@endsection

