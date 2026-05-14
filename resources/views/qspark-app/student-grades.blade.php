@extends('qspark::layouts.app')

@section('title', __('messages.student_grades_page_title'))

@section('content')
<div class="p-4 sm:p-6 space-y-6">
  <!-- Title -->
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
    <h2 class="text-2xl sm:text-3xl font-extrabold">{{ __('messages.student_grades_title') }}</h2>
    <div class="flex flex-wrap gap-2 sm:gap-3">
      <a href="{{ route('qspark.dashboard.student.blackboard.grades') }}" class="bg-green-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2 text-sm sm:text-base">
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
        </svg>
        <span data-translate="course_grades">{{ __('messages.course_grades') }}</span>
      </a>
      <a href="{{ route('qspark.dashboard.student') }}" class="bg-dga-primary-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-dga-primary-600 text-sm sm:text-base">
        {{ __('messages.back_to_dashboard') }}
      </a>
    </div>
  </div>

  @if(isset($error))
    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {{ $error }}
    </div>
  @endif

  <!-- Student Info -->
  @if(isset($studentProfile) && !empty($studentProfile))
    <div class="bg-white rounded-2xl p-6 shadow">
      <h3 class="font-bold text-xl mb-4">{{ __('messages.student_info_title') }}</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <span class="text-gray-600">{{ __('messages.name_label_colon') }}</span>
          <span class="font-semibold">{{ $studentProfile['name'] ?? __('messages.not_available') }}</span>
        </div>
        <div>
          <span class="text-gray-600">{{ __('messages.student_id_label_colon') }}</span>
          <span class="font-semibold">{{ $studentProfile['id'] ?? $studentProfile['student_id'] ?? __('messages.not_available') }}</span>
        </div>
        <div>
          <span class="text-gray-600">{{ __('messages.cumulative_gpa_label_colon') }}</span>
          <span class="font-semibold">{{ $studentProfile['academic']['last_recorded_gpa'] ?? __('messages.not_available') }}</span>
        </div>
      </div>
    </div>
  @endif

  <!-- Courses by Category -->
  @if(isset($groupedCourses) && !empty($groupedCourses))
    @foreach($groupedCourses as $categoryName => $groupTypes)
      <div class="bg-white rounded-2xl p-6 shadow">
        <h3 class="font-bold text-2xl mb-4 text-dga-primary-600">{{ $categoryName }}</h3>
        
        @foreach($groupTypes as $groupTypeName => $courses)
          <div class="mb-6">
            <h4 class="font-semibold text-lg mb-3 text-gray-700">{{ $groupTypeName }}</h4>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ __('messages.course_code_col') }}</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ __('messages.course_name_col') }}</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ __('messages.semester_col') }}</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ __('messages.grade_col') }}</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  @foreach($courses as $course)
                    <tr class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ $course->course_code ?? __('messages.not_available') }}
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-900">
                        {{ $course->course_name ?? __('messages.not_available') }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ $course->semester ?? __('messages.not_available') }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                        {{ $course->letter_grade ?? __('messages.not_available') }}
                      </td>
                    </tr>
                  @endforeach
                </tbody>
              </table>
            </div>
          </div>
        @endforeach
      </div>
    @endforeach
  @else
    <div class="bg-white rounded-2xl p-6 shadow text-center">
      <p class="text-gray-500">{{ __('messages.no_data_available') }}</p>
    </div>
  @endif

  <!-- All Courses Table (Alternative View) -->
  @if(isset($courses) && !empty($courses) && count($courses) > 0)
    <div class="bg-white rounded-2xl p-6 shadow">
      <h3 class="font-bold text-2xl mb-4">{{ __('messages.all_courses') }}</h3>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ __('messages.course_code_col') }}</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ __('messages.course_name_col') }}</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ __('messages.faculty_col') }}</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ __('messages.major_col') }}</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ __('messages.course_category_col') }}</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ __('messages.course_type_col') }}</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ __('messages.semester_col_short') }}</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">{{ __('messages.grade_col') }}</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @foreach($courses as $course)
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">{{ $course->course_code ?? __('messages.not_available') }}</td>
                <td class="px-6 py-4 text-sm">{{ $course->course_name ?? __('messages.not_available') }}</td>
                <td class="px-6 py-4 text-sm">{{ $course->faculty_name ?? __('messages.not_available') }}</td>
                <td class="px-6 py-4 text-sm">{{ $course->major_name ?? __('messages.not_available') }}</td>
                <td class="px-6 py-4 text-sm">{{ $course->category_name ?? __('messages.not_available') }}</td>
                <td class="px-6 py-4 text-sm">{{ $course->group_type_name ?? __('messages.not_available') }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">{{ $course->semester ?? __('messages.not_available') }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold">{{ $course->letter_grade ?? __('messages.not_available') }}</td>
              </tr>
            @endforeach
          </tbody>
        </table>
      </div>
    </div>
  @endif
</div>
@endsection

