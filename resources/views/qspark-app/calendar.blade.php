@extends('qspark::layouts.app')

@section('title', __('messages.calendar') . ' - Q SPARK')

@section('content')
<div class="p-4 sm:p-6">
  <div class="bg-white rounded-lg shadow-lg w-full">
    <div class="header flex flex-col sm:flex-row sm:justify-between gap-3 border-b p-4 sm:items-center bg-gray-50 rounded-t-lg">
      <form method="GET" action="{{ route('qspark.calendar.index') }}" class="flex flex-wrap items-center gap-3">
        <select name="view" onchange="this.form.submit()" class="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 min-w-[140px]">
          <option value="weekly" {{ request('view') == 'weekly' ? 'selected' : '' }} data-translate="weekly_schedule">{{ __('messages.weekly_schedule') }}</option>
          <option value="monthly" {{ request('view','monthly') == 'monthly' ? 'selected' : '' }} data-translate="monthly_calendar">{{ __('messages.monthly_calendar') }}</option>
        </select>
        <select name="month" onchange="this.form.submit()" class="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 min-w-[120px]">
          @for ($m = 1; $m <= 12; $m++)
            <option value="{{ $m }}" {{ $m == $month ? 'selected' : '' }}>
              {{ \Carbon\Carbon::create()->month($m)->locale(app()->getLocale())->translatedFormat('F') }}
            </option>
          @endfor
        </select>
        <select name="year" onchange="this.form.submit()" class="border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 min-w-[100px]">
          @for ($y = now()->year; $y <= now()->year + 10; $y++)
            <option value="{{ $y }}" {{ $y == $year ? 'selected' : '' }}>{{ $y }}</option>
          @endfor
        </select>
      </form>

      <span class="text-xl font-bold text-gray-800">
        {{ \Carbon\Carbon::create($year, $month)->locale(app()->getLocale())->translatedFormat('F Y') }}
      </span>
    </div>

    @if (request('view','monthly') == 'weekly')
      <div class="relative w-full overflow-x-auto">
        <div class="grid grid-cols-8 border-t border-l relative min-w-[1200px]" style="height: calc(13 * 80px + 40px);">
          
          <!-- Days header row -->
          <div class="border-r border-b bg-gray-100 h-10 flex items-center justify-center font-bold min-w-[80px]"></div>
          @foreach (['sunday','monday','tuesday','wednesday','thursday','friday','saturday'] as $dayKey)
            <div class="border-r border-b bg-gray-100 h-10 flex items-center justify-center font-bold min-w-[150px]" data-translate="{{ $dayKey }}">{{ __('messages.' . $dayKey) }}</div>
          @endforeach

          <!-- Time column -->
          <div class="border-r border-b min-w-[80px]">
            @for ($hour = 8; $hour <= 20; $hour++)
              <div class="h-20 flex items-center justify-center font-bold border-b en-numbers">{{ $hour }}:00</div>
            @endfor
          </div>

          <!-- Days columns with lectures -->
          @php
            $dayMapping = [
              'sunday' => 'الأحد',
              'monday' => 'الاثنين', 
              'tuesday' => 'الثلاثاء',
              'wednesday' => 'الأربعاء',
              'thursday' => 'الخميس',
              'friday' => 'الجمعة',
              'saturday' => 'السبت'
            ];
          @endphp
          @foreach (['sunday','monday','tuesday','wednesday','thursday','friday','saturday'] as $dayKey)
            <div class="relative border-r border-b min-w-[150px]">
              @for ($hour = 8; $hour <= 20; $hour++)
                <div class="h-20 border-b"></div>
              @endfor

              @foreach ($lectures as $lecture)
                @if ($lecture['day'] == $dayMapping[$dayKey])
                  @php
                    $start = intval(substr($lecture['start'],0,2)) + intval(substr($lecture['start'],3,2))/60;
                    $end = intval(substr($lecture['end'],0,2)) + intval(substr($lecture['end'],3,2))/60;
                    $duration = ($end - $start);
                    $top = (($start - 8) * 80) + 40;
                    $height = max(($duration * 80), 100); // Minimum height of 100px
                    
                    // Only show lectures that fit within the visible time range
                    $isVisible = $start >= 8 && $start <= 20 && $end <= 20;
                  @endphp
                  @if ($isVisible)
                    <div class="absolute left-1 right-1" style="top: {{ $top }}px; height: {{ $height }}px;">
                      <div class="bg-dga-primary-500 text-white rounded p-2 text-[10px] h-full overflow-hidden flex flex-col">
                        <!-- Main content area with fixed proportions -->
                        <div class="flex-1 flex flex-col justify-center space-y-0.5 min-h-0">
                          @if(!empty($lecture['course_name']))
                            <div class="font-semibold leading-tight text-center break-words">{{ $lecture['course_name'] }}</div>
                          @else
                            <div class="font-semibold leading-tight text-center text-purple-200">Course Name N/A</div>
                          @endif
                          
                          @if(!empty($lecture['course_code']))
                            <div class="font-semibold leading-tight text-center">{{ $lecture['course_code'] }}</div>
                          @else
                            <div class="font-semibold leading-tight text-center text-purple-200">Code N/A</div>
                          @endif
                          
                          @if(!empty($lecture['section_seq']))
                            <div class="leading-tight text-center opacity-90">{{ $lecture['section_seq'] }}</div>
                          @endif
                          
                          @if(!empty($lecture['activity_desc']))
                            <div class="leading-tight text-center opacity-90" dir="auto">{{ $sisLabel($lecture['activity_desc']) }}</div>
                          @endif
                        </div>
                        
                        <!-- Time display - always at bottom -->
                        <div class="mt-1 pt-1 border-t border-dga-primary-400 border-opacity-30">
                          <div class="en-numbers font-medium text-center text-[9px]">{{ $lecture['start'] }} - {{ $lecture['end'] }}</div>
                        </div>
                      </div>
                    </div>
                  @endif
                @endif
              @endforeach

            </div>
          @endforeach

        </div>
      </div>

    @else
      <div class="w-full overflow-x-auto">
      <table class="w-full min-w-[640px]">
        <thead>
          <tr>
            @foreach (['sunday','monday','tuesday','wednesday','thursday','friday','saturday'] as $dayKey)
              <th class="p-2 border-r h-10 xl:w-40 text-xs" data-translate="{{ $dayKey }}">{{ __('messages.' . $dayKey) }}</th>
            @endforeach
          </tr>
        </thead>
        <tbody>
          @php
            $daysInMonth = \Carbon\Carbon::create($year, $month)->daysInMonth;
            $startDayOfWeek = \Carbon\Carbon::create($year, $month, 1)->dayOfWeekIso % 7;
            $dayCounter = 1 - $startDayOfWeek;
          @endphp

          @for ($week = 0; $week < 6; $week++)
            <tr class="text-center h-20">
              @for ($day = 0; $day < 7; $day++)
                <td class="border p-1 h-40 xl:w-40 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                  <div class="flex flex-col h-40 mx-auto overflow-hidden">
                    <div class="top h-5 w-full">
                      @if ($dayCounter >= 1 && $dayCounter <= $daysInMonth)
                        <span class="text-gray-500 en-numbers">{{ $dayCounter }}</span>
                      @endif
                    </div>

                    <div class="bottom flex-grow h-30 py-1 w-full cursor-pointer">
                      @foreach ($exams as $exam)
                        @php
                          $examDate = $exam['exam']['exam_date'];
                        @endphp
                        @if ($examDate && $examDate !== '-' && \Carbon\Carbon::parse($examDate)->day == $dayCounter && \Carbon\Carbon::parse($examDate)->month == $month)
                          <div class="bg-dga-primary-500 text-white rounded p-1 text-xs mb-1">
                            {{ $exam['course_code'] }} {{ $exam['course_name'] }}<br>
                            <span class="en-numbers">{{ $exam['exam']['start_time'] }} - {{ $exam['exam']['end_time'] }}</span>
                          </div>
                        @endif
                      @endforeach
                    </div>
                  </div>
                </td>
                @php $dayCounter++; @endphp
              @endfor
            </tr>
          @endfor
        </tbody>
      </table>
      </div>
    @endif

  </div>
</div>
@endsection
