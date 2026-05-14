@extends('layouts.app')

@section('title', __('messages.faculty_courses_page_title'))

@section('content')
<div class="p-6 max-w-7xl mx-auto">
  <!-- Page Title -->
  <div class="mb-8 flex items-center justify-between">
    <div>
      <h2 class="text-3xl font-extrabold text-gray-800">{{ __('messages.my_courses') }}</h2>
      <p class="text-gray-500 mt-1">{{ __('messages.semester_label_with_value') }} {{ $currentSemester ?? __('messages.undefined_value') }}</p>
    </div>
    <div class="flex items-center gap-4">
      <a href="{{ route('faculty.dashboard') }}" class="text-dga-primary-600 hover:text-dga-primary-800 flex items-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        {{ __('messages.back_to_dashboard') }}
      </a>
      <div class="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
          {{ $groupedCourses->count() }} {{ __('messages.course_unit_singular') }}
      </div>
    </div>
  </div>

  <!-- Courses Grid -->
  @if($groupedCourses->count() > 0)
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    @foreach($groupedCourses as $courseNo => $courseGroup)
      @php
        $firstCourse = $courseGroup->first();
        $sisCourse = $firstCourse['sis'];
        $hasBlackboard = $firstCourse['has_blackboard'];
        $attachmentsCount = count($firstCourse['attachments'] ?? []);
        $sectionsCount = $courseGroup->count();
      @endphp
      <div class="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
        <!-- Course Header -->
        <div class="bg-gradient-to-r from-dga-primary-500 to-dga-primary-600 p-4 text-white">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="font-bold text-lg mb-1">{{ $sisCourse->course_code ?? 'N/A' }}</h3>
              <p class="text-blue-100 text-sm line-clamp-2">{{ $sisCourse->course_name ?? __('messages.not_available') }}</p>
            </div>
            @if($hasBlackboard)
              <span class="bg-green-400 text-green-900 text-xs font-bold px-2 py-1 rounded-full">
                {{ __('messages.bb_connected') }}
              </span>
            @else
              <span class="bg-yellow-400 text-dga-primary-900 text-xs font-bold px-2 py-1 rounded-full">
                {{ __('messages.sis_only') }}
              </span>
            @endif
          </div>
        </div>

        <!-- Course Body -->
        <div class="p-4">
          <!-- Sections Info -->
          <div class="flex items-center gap-4 mb-4 text-sm">
            <div class="flex items-center gap-1 text-gray-600">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5v-2l-10 5-10-5v2z"/>
              </svg>
              <span>{{ $sectionsCount }} {{ __('messages.section_unit') }}</span>
            </div>
            @if($attachmentsCount > 0)
              <div class="flex items-center gap-1 text-dga-primary-600">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
                <span>{{ $attachmentsCount }} {{ __('messages.file_unit') }}</span>
              </div>
            @endif
          </div>

          <!-- Sections List -->
          <div class="space-y-2 mb-4">
            @foreach($courseGroup->take(3) as $item)
              <div class="flex items-center justify-between text-xs bg-gray-50 rounded-lg p-2">
                <div class="flex items-center gap-2">
                  <span class="text-gray-600">{{ $item['sis']->activity_name ?? __('messages.activity') }}</span>
                  <span class="text-gray-400">•</span>
                  <span class="text-gray-500">{{ __('messages.section_label') }} {{ $item['sis']->section ?? 'N/A' }}</span>
                </div>
              </div>
            @endforeach
            @if($courseGroup->count() > 3)
              <div class="text-xs text-gray-400 text-center">
                +{{ $courseGroup->count() - 3 }} {{ __('messages.other_sections_prefix') }}
              </div>
            @endif
          </div>

          <!-- Campus -->
          <div class="text-xs text-gray-500 mb-4">
            <span class="font-medium">{{ __('messages.campus_label_short') }}</span> {{ $sisCourse->campus_name ?? __('messages.undefined_value') }}
          </div>

          <!-- Action Button -->
          <a href="{{ route('faculty.courses.view', ['courseCode' => $sisCourse->course_code]) }}"
             class="block w-full text-center bg-gradient-to-r from-dga-primary-500 to-dga-primary-600 text-white py-2.5 rounded-xl font-medium hover:from-dga-primary-600 hover:to-dga-primary-700 transition-all duration-300 shadow-sm hover:shadow-md">
            {{ __('messages.view_details_content') }}
          </a>
        </div>
      </div>
    @endforeach
  </div>
  @else
  <!-- Empty State -->
  <div class="text-center py-20">
    <div class="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
      <svg class="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5v-2l-10 5-10-5v2z"/>
      </svg>
    </div>
    <h3 class="text-xl font-bold text-gray-700 mb-2">{{ __('messages.no_courses') }}</h3>
    <p class="text-gray-500">{{ __('messages.no_courses_for_semester') }}</p>
  </div>
  @endif
</div>
@endsection

