@extends('qspark::layouts.app')

@section('title', __('messages.student_courses') . ' - Q SPARK')

@php
    // Demo fallback: when no courses come from the API/fixture, render a fixed
    // dummy set so the /qspark-demo?section=courses iframe always has content
    // to showcase (cards + working "Take Quiz" button per course).
    if (empty($courses)) {
        // Locale-aware dummy course list so the demo iframe shows readable
        // content in the visitor's language.
        $__isEn = app()->getLocale() === 'en';
        $__theoretical = $__isEn ? 'Theoretical' : 'نظري';
        $__practical   = $__isEn ? 'Practical'   : 'عملي';
        $courses = [
            [
                'course_name'     => $__isEn ? 'Accounting Principles' : 'مبادئ المحاسبة',
                'course_code'     => 'ACCT241',
                'activity_desc'   => $__theoretical,
                'instructor_name' => $__isEn ? 'Dr. Abdullah Saad' : 'د. عبدالله سعد',
                'lastAccessed'    => now()->subDays(1)->format('Y-m-d H:i'),
                'numeric_id'      => 1,
            ],
            [
                'course_name'     => $__isEn ? 'Intermediate Accounting (2)' : 'المحاسبة المتوسطة (2)',
                'course_code'     => 'ACCT350',
                'activity_desc'   => $__theoretical,
                'instructor_name' => $__isEn ? 'Dr. Mohammed Maher' : 'د. محمد ماهر',
                'lastAccessed'    => now()->subDays(2)->format('Y-m-d H:i'),
                'numeric_id'      => 2,
            ],
            [
                'course_name'     => $__isEn ? 'Cost Accounting' : 'محاسبة التكاليف',
                'course_code'     => 'ACCT353',
                'activity_desc'   => $__theoretical,
                'instructor_name' => $__isEn ? 'Dr. Khalid Al-Otaibi' : 'د. خالد العتيبي',
                'lastAccessed'    => now()->subDays(3)->format('Y-m-d H:i'),
                'numeric_id'      => 3,
            ],
            [
                'course_name'     => $__isEn ? 'Accounting Information Systems' : 'نظم المعلومات المحاسبية',
                'course_code'     => 'ISPM356',
                'activity_desc'   => $__theoretical,
                'instructor_name' => $__isEn ? 'Dr. Mona Al-Suhli' : 'د. منى السهلي',
                'lastAccessed'    => now()->subDays(5)->format('Y-m-d H:i'),
                'numeric_id'      => 4,
            ],
            [
                'course_name'     => $__isEn ? 'Systems Analysis & Design' : 'تحليل وتصميم النظم',
                'course_code'     => 'IS357',
                'activity_desc'   => $__practical,
                'instructor_name' => $__isEn ? 'Dr. Sarah Abdullah' : 'د. سارة عبدالله',
                'lastAccessed'    => now()->subDays(6)->format('Y-m-d H:i'),
                'numeric_id'      => 5,
            ],
            [
                'course_name'     => $__isEn ? 'Project Management' : 'إدارة المشاريع',
                'course_code'     => 'MGT320',
                'activity_desc'   => $__theoretical,
                'instructor_name' => $__isEn ? 'Dr. Fahad Al-Anzi' : 'د. فهد العنزي',
                'lastAccessed'    => now()->subDays(7)->format('Y-m-d H:i'),
                'numeric_id'      => 6,
            ],
        ];
    }
@endphp

@section('content')
<div class="p-4 sm:p-6 max-w-7xl mx-auto">
  <!-- Page Title -->
  <div class="mb-6 sm:mb-10 flex items-center justify-between gap-2">
    <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-800" data-translate="student_courses">
      {{ __('messages.student_courses') }}
    </h2>
    <div id="coursesCount" class="text-sm text-gray-500 shrink-0">
        <span id="countNumber">{{ count($courses ?? []) }}</span> {{ __('messages.courses') }}
    </div>
  </div>

  <!-- Loading State -->
  <div id="loadingState" class="{{ count($courses ?? []) > 0 ? 'hidden' : '' }} flex flex-col items-center justify-center py-20">
    <div class="relative">
      <div class="w-16 h-16 border-4 border-dga-primary-200 rounded-full animate-pulse"></div>
      <div class="absolute top-0 left-0 w-16 h-16 border-4 border-purple-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
    <p class="mt-6 text-gray-600 font-medium animate-pulse">{{ __('messages.loading_courses') }}</p>
    <div class="mt-4 flex gap-1">
      <div class="w-2 h-2 bg-dga-primary-600 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
      <div class="w-2 h-2 bg-dga-primary-600 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
      <div class="w-2 h-2 bg-dga-primary-600 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
    </div>
  </div>

  <!-- Courses Grid -->
  <div id="coursesGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 {{ count($courses ?? []) == 0 ? 'hidden' : '' }}">
    @forelse ($courses as $course)
      <div class="group bg-white/80 backdrop-blur-lg border border-gray-100 rounded-3xl shadow-md hover:shadow-2xl transition transform hover:scale-[1.02] p-6 flex flex-col justify-between">
        <!-- Course Info -->
        <div>
          <h3 class="text-xl font-bold text-gray-900 group-hover:text-dga-primary-600 transition mb-2" dir="auto">
            {{ ($course['course_name'] ?? null)
                ? $courseLabel($course['course_code'] ?? ($course['courseId'] ?? ''), $course['course_name'])
                : ($course['courseId'] ?? __('messages.not_available')) }}
          </h3>
          <p class="text-gray-600 text-sm mb-1">
            <span data-translate="course_code">{{ __('messages.course_code') }}</span>:
            <span class="font-semibold">{{ $course['course_code'] ?? $course['courseId'] ?? 'N/A' }}</span>
          </p>
          @if (!empty($course['lastAccessed']))
            <p class="text-gray-500 text-xs">
              <span data-translate="last_access">{{ __('messages.last_access') }}</span>:
              {{ \Carbon\Carbon::parse($course['lastAccessed'])->format('d-m-Y H:i') }}
            </p>
          @endif
        </div>

        <!-- Instructor -->
        @if (!empty($course['instructor_name']))
          <div class="inline-flex items-center gap-2 mt-4 bg-dga-primary-50 text-dga-primary-700 px-3 py-1.5 rounded-full text-sm shadow-sm">
            <svg class="w-5 h-5 text-dga-primary-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.1 0-9.3 1.6-9.3 4.9v2.7h18.6v-2.7c0-3.3-6.2-4.9-9.3-4.9z"/>
            </svg>
            <span>{{ $course['instructor_name'] }}</span>
          </div>
        @else
          <p class="text-gray-400 italic text-sm mt-3" data-translate="instructor_not_available">
            {{ __('messages.instructor_not_available') }}
          </p>
        @endif

        <!-- Footer -->
        <div class="flex justify-between items-center mt-6">
          <span class="bg-green-100 text-green-600 text-xs py-1 px-4 rounded-full font-medium">
            {{ $course['activity_desc'] ?? __('messages.not_available') }}
          </span>
          <a href="{{ route('qspark.courses.show', ['id' => $course['numeric_id'] ?? ($loop->index + 1)]) }}"
             class="bg-gradient-to-r from-dga-primary-500 to-dga-primary-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow hover:from-dga-primary-600 hover:to-dga-primary-700 hover:shadow-lg transition">
            {{ __('messages.view_course') }}
          </a>
        </div>
      </div>
    @empty
      <div class="col-span-full text-center py-12">
        <p class="text-gray-500 text-lg">{{ __('messages.no_courses_found') }}</p>
      </div>
    @endforelse
  </div>
</div>

@if(count($courses ?? []) == 0)
<script>
document.addEventListener('DOMContentLoaded', function() {
  // If no courses loaded, try to fetch via AJAX
  fetch('{{ route("qspark.api.student.courses") }}', {
    headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
  })
  .then(r => r.json())
  .then(data => {
    if (data.courses && data.courses.length > 0) {
      location.reload();
    } else {
      document.getElementById('loadingState').innerHTML = `
        <div class="text-center py-12">
          <p class="text-gray-500 text-lg">{{ __('messages.no_courses_found') }}</p>
        </div>`;
    }
  })
  .catch(() => {
    document.getElementById('loadingState').innerHTML = `
      <div class="text-center py-12">
        <p class="text-gray-500 text-lg">{{ __('messages.no_courses_found') }}</p>
      </div>`;
  });
});
</script>
@endif
@endsection
