@extends('qspark::layouts.app')

@section('title', __('messages.dashboard') . ' - Q SPARK')

@push('styles')
<style>
  /* Chat message styling for AI responses */
  .chat-content {
    direction: rtl;
    text-align: right;
  }

  .chat-content p {
    margin: 0;
    line-height: 1.6;
  }

  .chat-content p + p {
    margin-top: 0.5rem;
  }

  .chat-content strong {
    font-weight: 700;
    color: inherit;
  }

  .chat-content em {
    font-style: italic;
  }

  .chat-content .chat-list {
    margin: 0.5rem 0;
    padding-right: 1.25rem;
    padding-left: 0;
  }

  .chat-content ul.chat-list {
    list-style-type: disc;
  }

  .chat-content ol.chat-list {
    list-style-type: decimal;
  }

  .chat-content .chat-list li {
    margin: 0.25rem 0;
    line-height: 1.5;
  }

  .chat-content br {
    display: block;
    content: "";
    margin-top: 0.5rem;
  }

  /* User message styling */
  .bg-green-500 .text-sm {
    direction: rtl;
    text-align: right;
  }

  /* AI message bubble */
  .ai-message {
    color: #384250;
  }

  /* Emoji support */
  .chat-content {
    font-family: 'Segoe UI Emoji', 'Apple Color Emoji', 'Noto Color Emoji', system-ui, sans-serif;
  }
</style>
@endpush

@section('content')
<div class="p-4 sm:p-6 space-y-6">
  <!-- Title -->
  @cache('dashboard_title', 60)
	  <div class="flex justify-between items-center">
	    <h2 class="text-2xl sm:text-3xl font-extrabold" data-translate="dashboard">{{ __('messages.dashboard') }}</h2>
	  </div>
  @endcache

  <!-- Top Row -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
    <!-- Attendance -->
    <div class="bg-[#DFF6E7] rounded-2xl p-4">
      <div class="flex items-center gap-2">
        <div class="bg-[#25935F] p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 4v16h18V4H3zM7 8h10v2H7V8zM7 12h7v2H7v-2z" />
          </svg>
        </div>
        <div class="text-sm font-semibold" data-translate="attendance_rate">{{ __('messages.attendance_rate') }}</div>
      </div>
      <div class="text-3xl font-extrabold number">{{ $attendanceRate }} %</div>
      <div class="flex flex-wrap gap-2 mt-2">
      @foreach($attendanceDetails as $detail)
        <span class="bg-[#25935F] text-white text-xs py-1 px-2 rounded-full"> %{{ $detail['course'] }}: {{ $detail['rate'] }} </span>
      @endforeach
      </div>
    </div>

    <!-- GPA -->
    <div class="bg-[#DFF6E7] rounded-2xl p-4">
      <div class="flex items-center gap-2">
        <div class="bg-[#54C08A] p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM12 9.5L4.5 7 12 3l7.5 4L12 9.5zM2 17l10 5 10-5v-2l-10 5-10-5v2z" />
          </svg>
        </div>
        <div class="text-sm font-semibold" data-translate="cumulative_average">{{ __('messages.cumulative_average') }}</div>
      </div>
      <div class="text-3xl font-extrabold number"> {{ $gpa ?? '—' }} / 5</div>
      <div class="w-full bg-white rounded-full h-2 mt-2">
        <div class="bg-[#54C08A] h-2 rounded-full w-[70%]"></div>
      </div>
    </div>

    <!-- Tasks -->
    <div class="bg-[#DFF6E7] rounded-2xl p-4">
      <div class="flex items-center gap-2">
        <div class="bg-[#25935F] p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12V5c0-1.1-.9-2-2-2z" />
          </svg>
        </div>
        <div class="text-sm font-semibold" data-translate="nearest_final_exam">{{ __('messages.nearest_final_exam') }}</div>
      </div>  

      @if($nearestExam)
        <div class="text-3xl font-extrabold mt-2">
        {{ intval($nearestExam['days_left']) }} {{ __('messages.days') }}
          
        </div>
       
      @else
        <div class="text-sm text-gray-500 mt-2">{{ __('messages.no_upcoming_exam') }}</div>
      @endif

      <div class="mt-4">
  <div class="flex flex-wrap gap-2">
    @if($nearestExam)
      <span class="bg-[#88D8AD] text-white text-xs py-1 px-2 rounded-full" dir="auto">
        {{ $courseLabel($nearestExam['course_code'] ?? '', $nearestExam['course'] ?? '') }} : {{ intval($nearestExam['days_left']) }} {{ __('messages.days') }}
      </span>
    @endif

    @forelse ($nextTwoExams as $exam)
      <span class="bg-[#88D8AD] text-white text-xs py-1 px-2 rounded-full" dir="auto">
        {{ $courseLabel($exam['course_code'] ?? '', $exam['course'] ?? '') }} : {{ intval($exam['days_left']) }} {{ __('messages.days') }}
      </span>
    @empty
      <span class="text-xs text-gray-500">{{ __('messages.no_upcoming_exams') }}</span>
    @endforelse
  </div>
</div>
    </div>
    



    <!-- Study Minutes Today -->
    @php
        $hasPlayedToday = ($todayPlayMinutes ?? 0) > 0;
        $displayMinutes = $hasPlayedToday ? (int) $todayPlayMinutes : 30;
        $displayPercentage = $hasPlayedToday ? (int) ($playMinutesPercentage ?? 0) : 25;
    @endphp
    <div class="bg-white rounded-2xl p-5 ring-1 ring-dga-primary-200 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="bg-dga-primary-700 p-2 rounded-full">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8V4l8 8-8 8v-4H4V8z" />
            </svg>
          </div>
          <div class="text-sm font-semibold text-dga-primary-900" data-translate="study_hours_today">{{ __('messages.study_hours_today') }}</div>
        </div>
        <span class="text-xs font-semibold text-dga-primary-700 bg-dga-primary-50 px-2 py-1 rounded-full">{{ $displayPercentage }}%</span>
      </div>
      <div class="number text-dga-primary-900 mt-3 leading-tight space-y-0.5">
        <div class="text-3xl font-extrabold">
          {{ $displayMinutes }} <span class="text-dga-primary-700 font-semibold text-2xl" data-translate="minutes">{{ __('messages.minutes') }}</span>
        </div>
      </div>
      <div class="w-full bg-dga-primary-100 rounded-full h-2.5 mt-4 overflow-hidden">
        <div class="bg-dga-primary-700 h-2.5 rounded-full transition-all" style="width: {{ $displayPercentage }}%"></div>
      </div>
    </div>
    <script>
      (function () {
        const todayPlayMinutes = @json($todayPlayMinutes ?? 0);
        const playMinutesPercentage = @json($playMinutesPercentage ?? 0);
        console.log('[study_minutes_today]', {
          todayPlayMinutes,
          playMinutesPercentage,
          hasPlayedToday: todayPlayMinutes > 0,
          displayedMinutes: todayPlayMinutes > 0 ? todayPlayMinutes : 30,
          displayedPercentage: todayPlayMinutes > 0 ? Math.floor(playMinutesPercentage) : 25,
        });
      })();
    </script>
  </div>

  <!-- 3 Columns -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
    <!-- Column 1 -->
    <div class="space-y-6">
      @php
// بيانات ثابتة ليوم الاثنين
$mondayStatic = [
    [
        'course_name' => __('messages.cost_accounting'),
        'activity_desc' => __('messages.theoretical'),
        'start' => '10:00',
        'end' => '11:40',
    ],
    [
        'course_name' => __('messages.operations_management'),
        'activity_desc' => __('messages.theoretical'),
        'start' => '12:00',
        'end' => '13:40',
    ],
];
// احصل على اليوم الحالي (بالإنجليزي)
$todayName = \Carbon\Carbon::now()->locale('en')->format('l'); // "Thursday", "Monday", ...
@endphp

<div class="space-y-6">
    <div class="bg-white rounded-2xl p-6 shadow">
        <h3 class="font-bold text-xl mb-6" data-translate="today_classes">{{ __('messages.today_classes') }}</h3>
        <div class="space-y-4">
            @if ($todayName == 'Friday' || $todayName == 'Saturday')
                {{-- عطلة نهاية الأسبوع --}}
                <div class="text-center py-8">
                    <div class="mb-4">
                        <svg class="w-16 h-16 mx-auto text-dga-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <p class="text-lg font-semibold text-gray-700 mb-2" data-translate="weekend">{{ __('messages.weekend') }}</p>
                    <p class="text-gray-500" data-translate="no_classes_today">{{ __('messages.no_classes_today') }}</p>
                </div>
            @elseif ($todayName == 'Thursday' && empty($todayClasses))
                {{-- إذا اليوم خميس ومافيه بيانات، أعرض بيانات الاثنين الثابتة --}}
                @foreach ($mondayStatic as $index => $class)
                    @php
                        $badgeColors = ['bg-dga-primary-100 text-dga-primary-700', 'bg-dga-primary-100 text-dga-primary-700', 'bg-dga-primary-100 text-dga-primary-700', 'bg-green-100 text-green-700'];
                        $dotColors = ['bg-dga-primary-500', 'bg-dga-primary-500', 'bg-dga-primary-500', 'bg-green-500'];
                        $badgeColor = $badgeColors[$index % count($badgeColors)];
                        $dotColor = $dotColors[$index % count($dotColors)];
                    @endphp
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">
                            <span class="w-3 h-3 {{ $dotColor }} rounded-full"></span>
                            <div>
                                <p class="text-gray-800 font-medium" dir="auto">{{ $courseLabel($class['course_code'] ?? '', $class['course_name'] ?? '') }}</p>
                                <p class="text-gray-500 text-sm time">{{ $class['start'] }} - {{ $class['end'] }}</p>
                            </div>
                        </div>
                        <span class="text-xs px-3 py-1 rounded-full {{ $badgeColor }}" dir="auto">{{ $sisLabel($class['activity_desc'] ?? '') }}</span>
                    </div>
                @endforeach
            @else
                {{-- الأيام الأخرى: بيانات اليوم (أو رسالة لا توجد محاضرات) --}}
                @forelse ($todayClasses as $index => $class)
                    @php
                        $badgeColors = ['bg-dga-primary-100 text-dga-primary-700', 'bg-dga-primary-100 text-dga-primary-700', 'bg-dga-primary-100 text-dga-primary-700', 'bg-green-100 text-green-700'];
                        $dotColors = ['bg-dga-primary-500', 'bg-dga-primary-500', 'bg-dga-primary-500', 'bg-green-500'];
                        $badgeColor = $badgeColors[$index % count($badgeColors)];
                        $dotColor = $dotColors[$index % count($dotColors)];
                    @endphp
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-4 rtl:space-x-reverse">
                            <span class="w-3 h-3 {{ $dotColor }} rounded-full"></span>
                            <div>
                                <p class="text-gray-800 font-medium" dir="auto">{{ $courseLabel($class['course_code'] ?? '', $class['course_name'] ?? '') }}</p>
                                <p class="text-gray-500 text-sm time">{{ $class['start'] }} - {{ $class['end'] }}</p>
                            </div>
                        </div>
                        <span class="text-xs px-3 py-1 rounded-full {{ $badgeColor }}" dir="auto">{{ $sisLabel($class['activity_desc'] ?? '') }}</span>
                    </div>
                @empty
                    <div class="text-center py-8">
                        <p class="text-gray-500" data-translate="no_classes_today">{{ __('messages.no_classes_today') }}</p>
                    </div>
                @endforelse
            @endif
        </div>
    </div>
</div>

      <!-- قائمة المهام -->
      <div class="bg-white rounded-2xl p-4 shadow">
        <h3 class="font-bold mb-4" data-translate="task_list">{{ __('messages.task_list') }}</h3>
        <div class="max-h-80 overflow-y-auto space-y-3 pr-2">
          @php
            $validExams = collect($finalExamsCourses)->filter(function($exam) {
              $examDetails = $exam['exam'];
              return isset($examDetails['exam_date']) && 
                     $examDetails['exam_date'] !== '-' && 
                     !str_contains($examDetails['exam_period'], 'There is no entered date');
            });
          @endphp

          @forelse ($validExams as $exam)
            @php
              $examDetails = $exam['exam'];
              $examDate = \Carbon\Carbon::parse($examDetails['exam_date'], 'Asia/Riyadh');
              $daysLeft = \Carbon\Carbon::now('Asia/Riyadh')->diffInDays($examDate, false);
              
              // Color based on urgency
              if ($daysLeft <= 1) {
                $textColor = 'text-red-500';
              } elseif ($daysLeft <= 7) {
                $textColor = 'text-dga-primary-500';
              } else {
                $textColor = 'text-green-500';
              }
            @endphp
            
            <div class="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
              <div class="flex items-center gap-3">
                <input type="checkbox" class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2" 
                       onchange="toggleTaskComplete(this)">
                <span class="task-text">{{ $exam['course_code'] }} <span data-translate="exam">{{ __('messages.exam') }}</span></span>
              </div>
              @if ($daysLeft >= 0)
                <span class="{{ $textColor }} task-date">
                  <span data-translate="due_in">{{ __('messages.due_in') }}</span> 
                  {{ intval($daysLeft) }} 
                  <span data-translate="days">{{ __('messages.days') }}</span>
                </span>
              @endif
            </div>
          @empty
            <div class="flex justify-center items-center bg-gray-100 p-3 rounded-lg">
              <span class="text-gray-500">{{ __('messages.no_upcoming_exams') }}</span>
            </div>
          @endforelse
        </div>
      </div>

      <script>
      function toggleTaskComplete(checkbox) {
        const taskItem = checkbox.closest('.flex');
        const taskText = taskItem.querySelector('.task-text');
        const taskDate = taskItem.querySelector('.task-date');

        if (checkbox.checked) {
          taskText.classList.add('line-through', 'text-gray-500');
          if (taskDate) taskDate.classList.add('line-through', 'text-gray-400');
          taskItem.classList.add('opacity-60');
        } else {
          taskText.classList.remove('line-through', 'text-gray-500');
          if (taskDate) taskDate.classList.remove('line-through', 'text-gray-400');
          taskItem.classList.remove('opacity-60');
        }
      }
      </script>

      <!-- Final Exams -->
      <div class="bg-white rounded-2xl p-6 shadow">
        <h3 class="font-bold text-xl mb-4" data-translate="final_exams">{{ __('messages.final_exams') }}</h3>

        <div class="max-h-80 overflow-y-auto space-y-3 pr-2">
          @php
            $dotColors = ['bg-dga-primary-500', 'bg-dga-primary-500', 'bg-dga-primary-500', 'bg-green-500'];
          @endphp

          @forelse ($finalExamsCourses as $index => $exam)
            @php
              $dotColor = $dotColors[$index % count($dotColors)];
              $examDetails = $exam['exam'];
              $hasExamDate = isset($examDetails['exam_date']) && $examDetails['exam_date'] !== '-' && !str_contains($examDetails['exam_period'], 'There is no entered date');
            @endphp

            <div class="flex items-start justify-between border-b pb-2 last:border-b-0">
              <div class="flex items-start space-x-3 rtl:space-x-reverse">
                <span class="w-3 h-3 mt-1 {{ $dotColor }} rounded-full"></span>
                <div>
                  <p class="text-gray-800 font-medium" dir="auto">{{ $exam['course_code'] }} - {{ $courseLabel($exam['course_code'] ?? '', $exam['course_name'] ?? '') }}</p>
                  <p class="text-gray-500 text-xs" dir="auto">{{ $sisLabel($exam['activity']['name'] ?? '') }}</p>
                </div>
              </div>

              <div class="text-xs text-gray-700 text-right space-y-1">
                @if ($hasExamDate)
                  <div>
                    <span class="font-semibold">{{ __('messages.date') }}:</span>
                    <span>{{ $examDetails['exam_date_hijrah'] }}</span>
                  </div>
                  <div>
                    <span class="font-semibold">{{ __('messages.time') }}:</span>
                    <span>{{ $examDetails['start_time'] }} - {{ $examDetails['end_time'] }}</span>
                  </div>
                  <div>
                    <span class="font-semibold">{{ __('messages.location') }}:</span>
                    <span dir="auto">{{ $sisLabel($examDetails['campus_name'] ?? '') }}</span>
                  </div>
                @else
                  <p class="text-gray-400">{{ __('messages.no_final_exam_entered') }}</p>
                @endif
              </div>
            </div>

          @empty
            <p class="text-gray-500 text-center">{{ __('messages.no_final_exams') }}</p>
          @endforelse
        </div>
      </div>

    </div>

    <!-- Column 2 -->
    <div class="space-y-6">
      <!-- المساعد الذكي -->
      <div class="bg-white rounded-2xl p-4 shadow text-center">
        <img src="{{ asset('game/images/waving_character_transparent.png') }}" alt="Character" class="w-48 h-60 mx-auto mb-4 object-contain">
        @php
          // Greet by the locale-appropriate name, falling back to the other
          // language when one side is missing so a single-language profile
          // never renders an empty greeting.
          $greetingName = app()->getLocale() === 'en'
            ? (($studentEnglishName ?? null) ?: ($studentArabicName ?? ''))
            : (($studentArabicName ?? null) ?: ($studentEnglishName ?? ''));
        @endphp
        @if($timePeriod === 'AM')
          <h3 class="font-bold text-lg mb-2">{{ __('messages.good_morning') }}, <span dir="auto">{{ $greetingName }}</span>!</h3>
        @else
          <h3 class="font-bold text-lg mb-2">{{ __('messages.good_evening') }}, <span dir="auto">{{ $greetingName }}</span>!</h3>
        @endif

        @if($gender === 'Female')
          <p class="text-sm text-gray-500 mb-4">{{ __('messages.are_you_ready_female') }}</p>
        @else
          <p class="text-sm text-gray-500 mb-4">{{ __('messages.are_you_ready') }}</p>
        @endif

        <a href="{{ route('qspark.dashboard.student.chat') }}" class="w-full bg-dga-primary-500 hover:bg-dga-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          {{ __('messages.chat_with_ai') }}
        </a>
      </div>

      <!-- Attendance Reminder -->
      <div class="bg-white rounded-2xl p-4 shadow text-center h-[180px] flex flex-col justify-center">
        @if($nextLecture)
          <div class="bg-red-100 text-red-600 text-sm p-3 rounded-lg">
            <div class="font-semibold mb-1">{{ __('messages.attendance_reminder') }}</div>
            <div class="font-bold">{{ $nextLecture['course_code'] }}</div>
            <div class="text-xs mt-1">
              {{ $nextLecture['day_name'] }} - {{ $nextLecture['start_time'] }}
              @if($nextLecture['room'])
                - {{ __('messages.room') }} {{ $nextLecture['room'] }}
              @endif
            </div>
          </div>
        @else
          <div class="bg-gray-100 text-gray-600 text-sm p-3 rounded-lg">
            {{ __('messages.no_upcoming_lectures') }}
          </div>
        @endif
      </div>

      <!-- حالة اللعبة -->
      @php
        $maxAttempts     = $maxAttempts     ?? 3;
        $displayAttempts = ($gameAttempts ?? 0) > 0 ? (int) $gameAttempts : 1;
        $displayPoints   = ($gamePoints   ?? 0) > 0 ? (int) $gamePoints   : 400;
        $displayStreak   = (int) ($consecutiveDays ?? 0);
      @endphp
      <div class="bg-white rounded-2xl p-4 shadow text-center h-[180px] flex flex-col">
        <h3 class="font-bold text-lg mb-4" data-translate="game_status">{{ __('messages.game_status') }}</h3>
        <div class="flex justify-around flex-1 items-center">
          <div>
            <div class="bg-[#FEDF89] text-dga-primary-600 text-2xl font-bold rounded-lg px-4 py-2 number">{{ $displayAttempts }}/{{ $maxAttempts }}</div>
            <div class="text-sm text-gray-500 mt-1" data-translate="attempts">{{ __('messages.attempts') }}</div>
          </div>
          <div>
            <div class="bg-[#B8EACB] text-green-600 text-2xl font-bold rounded-lg px-4 py-2 number">{{ number_format($displayPoints) }}</div>
            <div class="text-sm text-gray-500 mt-1" data-translate="points">{{ __('messages.points') }}</div>
          </div>
          <div>
            <div class="bg-[#FECDCA] text-red-600 text-2xl font-bold rounded-lg px-4 py-2 number">{{ $displayStreak }} <span data-translate="days">{{ __('messages.days') }}</span></div>
            <div class="text-sm text-gray-500 mt-1" data-translate="consecutive_days">{{ __('messages.consecutive_days') }}</div>
          </div>
        </div>
      </div>

    </div>

    <!-- Column 3 -->
    <div class="space-y-6">
      <div class="bg-white rounded-2xl p-6 shadow">
        <h3 class="font-bold text-xl mb-6" data-translate="absence_rate_per_course">{{ __('messages.absence_rate_per_course') }}</h3>

        <div class="space-y-6">
          @php
            $progressColors = ['#54C08A', '#54C08A', '#54C08A'];
          @endphp

          @forelse ($attendanceDetails as $index => $detail)
            @php
              $absencePercent = round(100 - $detail['rate'], 2);
              $color = $progressColors[$index % count($progressColors)];
              if ($absencePercent >= 25) {
                $color = '#54C08A'; // orange warning
              }
              $percentOfMax = ($absencePercent / 25) * 100;
            @endphp

            <div x-data="{ percent: 0 }" x-init="setTimeout(() => percent = {{ $percentOfMax }}, 200)">
              <div class="flex justify-between items-center text-base font-semibold text-gray-800 mb-1">
                <span>{{ $detail['course'] }}</span>
                <div class="flex flex-col items-end">
                  <span class="percentage">{{ number_format($absencePercent, 2) }}%</span>
                  <span class="text-xs text-gray-500">{{ __('messages.of_25') }}</span>
                </div>
              </div>
              <div class="bg-gray-200 h-3 rounded-full overflow-hidden">
                <div
                  class="h-3 rounded-full transition-all duration-1000"
                  :style="`width: ${percent > 100 ? 100 : percent}%; background-color: {{ $color }}`">
                </div>
              </div>
            </div>
          @empty
            <p class="text-sm text-gray-500 text-center py-4">{{ __('messages.no_absence_data') }}</p>
          @endforelse
        </div>

        <h4 class="font-bold text-xl mt-8 mb-4" data-translate="absence_details">{{ __('messages.absence_details') }}</h4>

        <div x-data="{ showAll: false }" class="h-[280px] overflow-y-auto border border-gray-200 rounded-xl">
          <table class="min-w-full text-sm text-gray-700">
            <thead class="bg-gray-100 text-gray-800 sticky top-0 z-10">
              <tr>
                <th class="py-3 px-4 text-center w-16" data-translate="excused">{{ __('messages.excused') }}</th>
                <th class="py-3 px-4 text-right w-32" data-translate="date">{{ __('messages.date') }}</th>
                <th class="py-3 px-4 text-right w-20" data-translate="day">{{ __('messages.day') }}</th>
                <th class="py-3 px-4 text-right w-24" data-translate="course">{{ __('messages.course') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              @php
                $absenceRows = [];
                foreach ($absences as $course) {
                  foreach (($course['absences'] ?? []) as $absence) {
                    $absenceRows[] = ['course' => $course['cource_code'] ?? '', 'absence' => $absence];
                  }
                }
              @endphp
              @forelse ($absenceRows as $row)
                <tr class="hover:bg-gray-50 transition">
                  <td class="py-3 px-4 text-center w-16">
                    @if (($row['absence']['absence_excused'] ?? '0') == "1")
                      <span class="text-green-500 text-lg font-bold">✔️</span>
                    @else
                      <span class="text-red-500 text-lg font-bold">❌</span>
                    @endif
                  </td>
                  <td class="py-3 px-4 text-right date w-32">{{ \Carbon\Carbon::parse($row['absence']['absence_date'])->format('Y-m-d') }}</td>
                  <td class="py-3 px-4 text-right w-20">{{ $row['absence']['absence_day'] }}</td>
                  <td class="py-3 px-4 font-medium text-right w-24">{{ $row['course'] }}</td>
                </tr>
              @empty
                <tr>
                  <td colspan="4" class="text-center py-4 text-gray-500">{{ __('messages.no_absence_data') }}</td>
                </tr>
              @endforelse
            </tbody>
          </table>
        </div>

        <h4 class="font-bold text-xl mt-8 mb-4">{{ __('messages.absence_distribution') }}</h4>
        <div class="flex justify-around items-end h-48 bg-gray-50 rounded-xl p-4 border border-gray-200">
          @php
            $dayNames = [
                __('messages.sunday'),
                __('messages.monday'),
                __('messages.tuesday'),
                __('messages.wednesday'),
                __('messages.thursday')
            ];

            // If no real data, use dummy counts
            if (empty($absences)) {
                $dayCounts = [0, 3, 2, 4, 1]; // Dummy data matching screenshot
            } else {
                $dayCounts = [0, 0, 0, 0, 0];
                foreach ($absences as $course) {
                    foreach ($course['absences'] as $absence) {
                        $dayIndex = intval($absence['absence_day']);
                        if ($dayIndex >= 1 && $dayIndex <= 5) {
                            $dayCounts[$dayIndex - 1]++;
                        }
                    }
                }
            }

            $barColors = ['#54C08A','#54C08A','#54C08A','#54C08A','#54C08A'];
            $maxCount = max($dayCounts) > 0 ? max($dayCounts) : 1;
          @endphp

          @foreach ($dayCounts as $index => $count)
            @php
              // Calculate height as percentage of max height (140px)
              $height = ($count > 0) ? ($count / $maxCount * 140) : 4;
            @endphp
            <div class="flex flex-col items-center gap-2">
              <div
                class="w-12 rounded-t transition-all duration-500"
                style="
                  height: {{ $height }}px;
                  background-color: {{ ($count > 0) ? $barColors[$index] : '#E5E7EB' }};
                ">
              </div>
              <span class="text-xs text-gray-700 font-medium">{{ $dayNames[$index] }}</span>
            </div>
          @endforeach
        </div>
      </div>
    </div>


</div>

<!-- AI Chat Modal -->
<div id="chatModal" class="fixed inset-0 z-50 hidden">
  <!-- Backdrop -->
  <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" id="chatBackdrop"></div>

  <!-- Modal Content -->
  <div class="absolute inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-dga-primary-500 to-dga-primary-600 text-white p-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div>
          <h3 class="font-bold text-lg">{{ __('messages.ai_assistant') }}</h3>
          <p class="text-xs text-blue-100">{{ __('messages.chat_welcome') }}</p>
        </div>
      </div>
      <button id="closeChatModal" class="p-2 hover:bg-white/20 rounded-full transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Chat Messages -->
    <div id="chatMessages" class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      <!-- Welcome message -->
      <div class="flex gap-3">
        <div class="w-8 h-8 bg-dga-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
        </div>
        <div class="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm max-w-[80%]">
          <p class="text-gray-700 text-sm">{{ __('messages.chat_welcome') }}</p>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 bg-white border-t">
      <form id="chatForm" class="flex gap-2">
        <input
          type="text"
          id="chatInput"
          placeholder="{{ __('messages.type_your_message') }}"
          class="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          autocomplete="off"
        >
        <button
          type="submit"
          id="sendButton"
          class="px-6 py-3 bg-dga-primary-500 hover:bg-dga-primary-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>{{ __('messages.send') }}</span>
          <svg class="w-5 h-5 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </form>
    </div>
  </div>
</div>
@endsection

@push('scripts')
<script>
document.addEventListener('DOMContentLoaded', function() {
  const chatModal = document.getElementById('chatModal');
  const openBtn = document.getElementById('openChatModal');
  const closeBtn = document.getElementById('closeChatModal');
  const backdrop = document.getElementById('chatBackdrop');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');
  const sendButton = document.getElementById('sendButton');

  // Generate a unique thread ID for this session
  let threadId = 'thread_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  let isWaiting = false;

  // Open modal
  openBtn?.addEventListener('click', function() {
    chatModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    chatInput.focus();
  });

  // Close modal
  function closeModal() {
    chatModal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  closeBtn?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !chatModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Add message to chat
  function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex gap-3' + (isUser ? ' flex-row-reverse' : '');

    const avatar = document.createElement('div');
    avatar.className = 'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ' +
      (isUser ? 'bg-green-500' : 'bg-dga-primary-500');
    avatar.innerHTML = isUser
      ? '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>'
      : '<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>';

    const bubble = document.createElement('div');
    bubble.className = 'rounded-2xl p-3 shadow-sm max-w-[80%] chat-message-bubble ' +
      (isUser ? 'bg-green-500 text-white rounded-tr-none' : 'bg-white rounded-tl-none ai-message');

    // For user messages, escape HTML. For AI messages, render HTML (already sanitized server-side)
    if (isUser) {
      bubble.innerHTML = '<div class="text-sm">' + escapeHtml(content) + '</div>';
    } else {
      bubble.innerHTML = '<div class="text-sm chat-content">' + content + '</div>';
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return bubble;
  }

  // Add loading indicator
  function addLoadingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'flex gap-3';
    messageDiv.id = 'loadingIndicator';

    messageDiv.innerHTML = `
      <div class="w-8 h-8 bg-dga-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
        </svg>
      </div>
      <div class="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm">
        <div class="flex items-center gap-2">
          <div class="flex gap-1">
            <span class="w-2 h-2 bg-dga-primary-500 rounded-full animate-bounce" style="animation-delay: 0ms"></span>
            <span class="w-2 h-2 bg-dga-primary-500 rounded-full animate-bounce" style="animation-delay: 150ms"></span>
            <span class="w-2 h-2 bg-dga-primary-500 rounded-full animate-bounce" style="animation-delay: 300ms"></span>
          </div>
          <span class="text-sm text-gray-500">{{ __('messages.chat_loading') }}</span>
        </div>
      </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Remove loading indicator
  function removeLoadingIndicator() {
    const indicator = document.getElementById('loadingIndicator');
    if (indicator) indicator.remove();
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Conversation history for context
  let conversationHistory = [];

  // Send message
  chatForm?.addEventListener('submit', async function(e) {
    e.preventDefault();

    const message = chatInput.value.trim();
    if (!message || isWaiting) return;

    // Add user message
    addMessage(message, true);
    conversationHistory.push({ text: message, isUser: true });
    chatInput.value = '';

    // Disable input while waiting
    isWaiting = true;
    sendButton.disabled = true;
    chatInput.disabled = true;

    // Show loading indicator
    addLoadingIndicator();

    try {
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

      // Send message to Gemini API
      const response = await fetch('{{ route("qspark.dashboard.student.chat.send") }}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          thread_id: threadId,
          message: message,
          history: conversationHistory.slice(-10) // Send last 10 messages for context
        })
      });

      const data = await response.json();

      removeLoadingIndicator();

      if (response.ok && data.success && data.response) {
        // Direct response from Gemini - no polling needed
        addMessage(data.response);
        conversationHistory.push({ text: data.response, isUser: false });
      } else {
        addMessage(data.error || '{{ __("messages.chat_error") }}');
      }
    } catch (error) {
      console.error('Chat error:', error);
      removeLoadingIndicator();
      addMessage('{{ __("messages.chat_error") }}');
    } finally {
      isWaiting = false;
      sendButton.disabled = false;
      chatInput.disabled = false;
      chatInput.focus();
    }
  });
});
</script>
@endpush
