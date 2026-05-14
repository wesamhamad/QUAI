@extends('layouts.app')

@section('title', __('messages.blackboard_grades') . ' - Q SPARK')

@section('content')
<div class="p-6 space-y-6">
  <!-- Title -->
  <div class="flex justify-between items-center">
    <h2 class="text-3xl font-extrabold" data-translate="blackboard_grades">{{ __('messages.blackboard_grades') }}</h2>
    <a href="{{ route('dashboard.student') }}" class="bg-dga-primary-500 text-white px-4 py-2 rounded-lg hover:bg-dga-primary-600">
      {{ __('messages.back_to_dashboard') }}
    </a>
  </div>

  <!-- Student Info -->
  @if(isset($studentProfile) && !empty($studentProfile))
    <div class="bg-white rounded-2xl p-6 shadow">
      <h3 class="font-bold text-xl mb-4">{{ __('messages.student_info') }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <span class="text-gray-600">{{ __('messages.name') }}:</span>
          <span class="font-semibold">{{ $studentProfile['name'] ?? __('messages.not_available') }}</span>
        </div>
        <div>
          <span class="text-gray-600">{{ __('messages.student_id') }}:</span>
          <span class="font-semibold en-numbers">{{ $studentProfile['id'] ?? $studentProfile['student_id'] ?? __('messages.not_available') }}</span>
        </div>
        <div>
          <span class="text-gray-600">{{ __('messages.gpa') }}:</span>
          <span class="font-semibold en-numbers">{{ $studentProfile['academic']['last_recorded_gpa'] ?? __('messages.not_available') }}</span>
        </div>
      </div>
    </div>
  @endif

  <!-- Courses with Grades -->
  @if(isset($courses) && !empty($courses))
    @foreach($courses as $course)
      <div class="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition-shadow">
        <!-- Course Header -->
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-bold text-2xl text-dga-primary-600 mb-2">{{ $course['course_name'] }}</h3>
            <div class="flex gap-4 text-sm text-gray-600">
              <span>
                <span class="font-semibold" data-translate="course_code">{{ __('messages.course_code') }}:</span>
                <span class="en-numbers">{{ $course['course_code'] }}</span>
              </span>
              @if($course['last_accessed'])
                <span>
                  <span class="font-semibold" data-translate="last_accessed">{{ __('messages.last_accessed') }}:</span>
                  <span class="en-numbers">{{ \Carbon\Carbon::parse($course['last_accessed'])->format('Y-m-d') }}</span>
                </span>
              @endif
            </div>
          </div>
        </div>

        <!-- Grades Table -->
        @if(!empty($course['grades']))
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase" data-translate="grade_item">
                    {{ __('messages.grade_item') }}
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase" data-translate="score">
                    {{ __('messages.score') }}
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase" data-translate="possible">
                    {{ __('messages.possible') }}
                  </th>
                  <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase" data-translate="percentage">
                    {{ __('messages.percentage') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                @foreach($course['grades'] as $gradeItem)
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-sm text-gray-900">
                      {{ $gradeItem['name'] ?? $gradeItem['title'] ?? 'N/A' }}
                    </td>
                    <td class="px-6 py-4 text-center text-sm">
                      <span class="font-semibold en-numbers text-dga-primary-600">
                        {{ $gradeItem['score'] ?? $gradeItem['grade'] ?? '-' }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-center text-sm en-numbers text-gray-600">
                      {{ $gradeItem['possible'] ?? $gradeItem['max_grade'] ?? '-' }}
                    </td>
                    <td class="px-6 py-4 text-center text-sm">
                      @php
                        $score = $gradeItem['score'] ?? $gradeItem['grade'] ?? 0;
                        $possible = $gradeItem['possible'] ?? $gradeItem['max_grade'] ?? 1;
                        $percentage = $possible > 0 ? round(($score / $possible) * 100, 1) : 0;
                      @endphp
                      <span class="px-3 py-1 rounded-full text-white font-semibold en-numbers
                        @if($percentage >= 90) bg-green-500
                        @elseif($percentage >= 80) bg-dga-primary-500
                        @elseif($percentage >= 70) bg-dga-primary-500
                        @elseif($percentage >= 60) bg-dga-primary-500
                        @else bg-red-500
                        @endif
                      ">
                        {{ $percentage }}%
                      </span>
                    </td>
                  </tr>
                @endforeach
              </tbody>
            </table>
          </div>
        @else
          <div class="text-center py-8 text-gray-500">
            <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <p data-translate="no_grades_available">{{ __('messages.no_grades_available') }}</p>
          </div>
        @endif
      </div>
    @endforeach
  @else
    <div class="bg-white rounded-2xl p-6 shadow text-center">
      <svg class="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
      </svg>
      <p class="text-gray-500 text-lg" data-translate="no_grades_available">{{ __('messages.no_grades_available') }}</p>
    </div>
  @endif
</div>
@endsection

