@extends('qspark::layouts.app')

@section('title', __('messages.recommendations_title') . ' - Q SPARK')

@php
// Helper function to get bilingual content
function getBilingualContent($data, $locale = null) {
    if (!$data) return [];

    $locale = $locale ?? app()->getLocale();

    // If data has 'ar' and 'en' keys, it's bilingual
    if (is_array($data) && isset($data['ar']) && isset($data['en'])) {
        return $data[$locale] ?? $data['ar'] ?? [];
    }

    // Otherwise return as is
    return $data;
}
@endphp

@push('styles')
<style>
/* Timeline Interactive Animation */
.timeline-step {
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-step.active {
  opacity: 1;
  transform: translateX(0);
}

.timeline-step:hover {
  transform: scale(1.02);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.timeline-connector {
  height: 0;
  transition: height 0.6s ease-in-out;
}

.timeline-connector.active {
  height: 100%;
}

.timeline-number {
  transform: scale(0);
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 10;
  position: relative;
}

.timeline-number.active {
  transform: scale(1);
}

/* Pulse animation for active step */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(37, 147, 95, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(37, 147, 95, 0);
  }
}

.timeline-step.current {
  animation: pulse-glow 2s infinite;
}
</style>
@endpush

@section('content')
<div class="p-6 space-y-6">
  <!-- AI Badge Notice -->
  <div class="bg-gradient-to-r from-dga-primary-600 via-dga-primary-600 to-dga-primary-600 rounded-2xl p-6 shadow-xl text-white">
    <div class="flex items-center gap-4">
      <div class="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
        <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-2xl font-bold" data-translate="ai_powered_recommendations">🤖 {{ __('messages.ai_powered_recommendations') }}</h3>
          <span class="bg-white/30 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold">QU AI</span>
        </div>
        <p class="text-white/90 leading-relaxed">
          <span data-translate="ai_badge_description">{{ __('messages.ai_badge_description') }}</span> (<span class="number">{{ $gpa ?? '—' }}</span>),
          <span data-translate="ai_badge_description_2">{{ __('messages.ai_badge_description_2') }}</span> (<span class="number">{{ $attendanceRate ?? '—' }}%</span>),
          <span data-translate="ai_badge_description_3">{{ __('messages.ai_badge_description_3') }}</span>
        </p>
      </div>
    </div>
  </div>

  <!-- Header -->
  <div class="flex justify-between items-center flex-wrap gap-4">
    <div>
      <h2 class="text-3xl font-extrabold text-gray-800" data-translate="comprehensive_success_plan"> {{ __('messages.comprehensive_success_plan') }}</h2>
      <p class="text-gray-600 mt-1">{{ $month }}</p>
    </div>
    <div class="flex gap-4 flex-wrap">
      <div class="bg-[#DFF6E7] rounded-xl p-4 text-center min-w-[120px]">
        <div class="text-sm text-gray-600" data-translate="current_gpa">{{ __('messages.current_gpa') }}</div>
        <div class="text-2xl font-bold text-[#54C08A] number">{{ $gpa ?? '—' }}</div>
      </div>
      @if($recommendation && $recommendation->predicted_gpa)
      <div class="bg-[#DFF6E7] rounded-xl p-4 text-center min-w-[120px]">
        <div class="text-sm text-gray-600" data-translate="predicted_gpa">{{ __('messages.predicted_gpa') }}</div>
        <div class="text-2xl font-bold text-[#54C08A] number">{{ number_format($recommendation->predicted_gpa, 2) }}</div>
      </div>
      @endif
      <div class="bg-[#DFF6E7] rounded-xl p-4 text-center min-w-[120px]">
        <div class="text-sm text-gray-600" data-translate="attendance_percentage">{{ __('messages.attendance_percentage') }}</div>
        <div class="text-2xl font-bold text-[#25935F] number">{{ $attendanceRate ?? '—' }}%</div>
      </div>
    </div>
  </div>

  <!-- Strengths & Weaknesses Analysis -->
  @if($recommendation && (count($recommendation->strengths ?? []) > 0 || count($recommendation->weaknesses ?? []) > 0))
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Strengths -->
    @if(count($recommendation->strengths ?? []) > 0)
    <div class="bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-2xl p-6 shadow-lg border-2 border-green-200">
      <div class="flex items-center gap-3 mb-4">
        <div class="bg-green-500 p-3 rounded-full">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-green-800" data-translate="strengths">💪 {{ __('messages.strengths') }}</h3>
      </div>
      <div class="space-y-3">
        @foreach($recommendation->strengths as $strength)
          <div class="flex gap-3 p-4 bg-white rounded-xl shadow-sm">
            <span class="text-green-500 text-xl">✓</span>
            <p class="text-gray-700 leading-relaxed">{{ $strength }}</p>
          </div>
        @endforeach
      </div>
    </div>
    @endif

    <!-- Weaknesses -->
    @if(count($recommendation->weaknesses ?? []) > 0)
    <div class="bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-2xl p-6 shadow-lg border-2 border-dga-primary-200">
      <div class="flex items-center gap-3 mb-4">
        <div class="bg-dga-primary-500 p-3 rounded-full">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
        </div>
        <h3 class="text-2xl font-bold text-dga-primary-800" data-translate="improvement_points">🎯 {{ __('messages.improvement_points') }}</h3>
      </div>
      <div class="space-y-3">
        @foreach($recommendation->weaknesses as $weakness)
          <div class="flex gap-3 p-4 bg-white rounded-xl shadow-sm">
            <span class="text-dga-primary-500 text-xl">!</span>
            <p class="text-gray-700 leading-relaxed">{{ $weakness }}</p>
          </div>
        @endforeach
      </div>
    </div>
    @endif
  </div>
  @endif

  <!-- Professional Certifications & Internships Card -->
  <div class="bg-gradient-to-br from-dga-primary-50 via-dga-primary-50 to-dga-primary-50 rounded-2xl p-8 shadow-xl border-2 border-dga-primary-200">
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-gradient-to-r from-dga-primary-600 to-dga-primary-600 p-3 rounded-full">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
        </svg>
      </div>
      <div>
        <h3 class="text-2xl font-bold text-gray-800">🎓 {{ __('messages.career_dev_title') }}</h3>
        <p class="text-sm text-dga-primary-600 font-semibold mt-1">{{ __('messages.career_dev_for_major') }}: {{ $majorName ?? __('messages.your_major') }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Professional Certifications -->
      <div class="bg-white rounded-xl p-6 shadow-lg">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-3xl">🏅</span>
          <h4 class="text-xl font-bold text-dga-primary-800">{{ __('messages.certifications_title') }}</h4>
        </div>
        <div class="space-y-3">
          @foreach($certifications as $cert)
          <div class="flex gap-3 p-3 bg-gradient-to-r from-dga-primary-50 to-dga-primary-50 rounded-lg hover:shadow-md transition">
            <span class="text-2xl">🎓</span>
            <p class="text-sm text-gray-700 leading-relaxed">
              <span class="font-semibold text-dga-primary-900">{{ $cert['title'] }}</span><br>
              <span class="text-xs text-gray-600">{{ $cert['provider'] }}</span>
            </p>
          </div>
          @endforeach
        </div>
      </div>

      <!-- Internship Opportunities -->
      <div class="bg-white rounded-xl p-6 shadow-lg">
        <div class="flex items-center gap-2 mb-4">
          <span class="text-3xl">💼</span>
          <h4 class="text-xl font-bold text-dga-primary-800">{{ __('messages.internships_saudi_market_title') }}</h4>
        </div>
        <div class="space-y-3">
          @foreach($internships as $internship)
          <div class="flex gap-3 p-3 bg-gradient-to-r from-dga-primary-50 to-dga-primary-50 rounded-lg hover:shadow-md transition">
            <span class="text-2xl">💼</span>
            <p class="text-sm text-gray-700 leading-relaxed">
              <span class="font-semibold text-dga-primary-900">{{ $internship['title'] }}</span><br>
              <span class="text-xs text-gray-600">{{ $internship['company'] }} - {{ $internship['duration'] }}</span>
            </p>
          </div>
          @endforeach
        </div>
      </div>
    </div>

    <!-- Additional Info -->
    <div class="mt-6 p-4 bg-white rounded-xl border-2 border-dga-primary-200">
      <div class="flex items-start gap-3">
        <span class="text-2xl">💡</span>
        <div>
          <p class="text-sm text-gray-700 leading-relaxed">
            <span class="font-semibold text-dga-primary-900">{{ __('messages.important_tip') }}:</span>
            {{ __('messages.career_dev_advice') }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <!-- Timeline Roadmap -->
  @if($recommendation && isset($recommendation->timeline_roadmap) && count($recommendation->timeline_roadmap) > 0)
  <div class="bg-white rounded-2xl p-6 shadow-lg">
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-gradient-to-r from-dga-primary-600 to-dga-primary-600 p-3 rounded-full">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-800" data-translate="timeline_roadmap">🗓️ {{ __('messages.timeline_roadmap') }}</h3>
    </div>

    <div class="relative">
      <!-- Timeline Line -->
      <div class="absolute right-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-dga-primary-500 to-dga-primary-600 hidden lg:block"></div>

      <div class="space-y-8">
        <!-- One Week -->
        @if(isset($recommendation->timeline_roadmap['one_week']))
        <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div class="lg:text-left order-1 lg:order-1">
            <div class="timeline-step bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-xl p-6 border-2 border-dga-primary-300 hover:shadow-xl transition cursor-pointer">
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-dga-primary-600 text-white px-4 py-2 rounded-full font-bold text-sm" data-rec-translate="one_week_period">{{ __('messages.one_week_plan') }}</div>
                <h4 class="text-xl font-bold text-dga-primary-800">{{ $recommendation->timeline_roadmap['one_week']['title'] ?? __('messages.one_week_plan') }}</h4>
              </div>
              <div class="space-y-3">
                <div>
                  <p class="text-sm font-semibold text-gray-700 mb-2" data-rec-translate="goals_label">{{ __('messages.goals') }}:</p>
                  <ul class="space-y-2">
                    @foreach(getBilingualContent($recommendation->timeline_roadmap['one_week']['goals'] ?? []) as $goal)
                      <li class="flex gap-2 items-start">
                        <span class="text-dga-primary-600 mt-1">✓</span>
                        <span class="text-sm text-gray-700">{{ $goal }}</span>
                      </li>
                    @endforeach
                  </ul>
                </div>
                @php $focusAreas = getBilingualContent($recommendation->timeline_roadmap['one_week']['focus_areas'] ?? []); @endphp
                @if(count($focusAreas) > 0)
                  <div class="flex flex-wrap gap-2 mt-3">
                    @foreach($focusAreas as $area)
                      <span class="bg-dga-primary-100 text-dga-primary-800 px-3 py-1 rounded-full text-xs font-semibold">{{ $area }}</span>
                    @endforeach
                  </div>
                @endif
              </div>
            </div>
          </div>
          <div class="hidden lg:block order-2"></div>
          <div class="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 hidden lg:block">
            <div class="timeline-number w-12 h-12 bg-dga-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">1</div>
          </div>
        </div>
        @endif

        <!-- One Month -->
        @if(isset($recommendation->timeline_roadmap['one_month']))
        <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div class="hidden lg:block order-1"></div>
          <div class="lg:text-right order-2 lg:order-2">
            <div class="timeline-step bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-xl p-6 border-2 border-dga-primary-300 hover:shadow-xl transition cursor-pointer">
              <div class="flex items-center gap-3 mb-4 lg:flex-row-reverse">
                <div class="bg-dga-primary-600 text-white px-4 py-2 rounded-full font-bold text-sm" data-rec-translate="one_month_period">{{ __('messages.one_month_plan') }}</div>
                <h4 class="text-xl font-bold text-dga-primary-800">{{ $recommendation->timeline_roadmap['one_month']['title'] ?? __('messages.one_month_plan') }}</h4>
              </div>
              <div class="space-y-3">
                <div>
                  <p class="text-sm font-semibold text-gray-700 mb-2" data-rec-translate="goals_label">{{ __('messages.goals') }}:</p>
                  <ul class="space-y-2">
                    @foreach($recommendation->timeline_roadmap['one_month']['goals'] ?? [] as $goal)
                      <li class="flex gap-2 items-start lg:flex-row-reverse lg:text-right">
                        <span class="text-dga-primary-600 mt-1">✓</span>
                        <span class="text-sm text-gray-700">{{ $goal }}</span>
                      </li>
                    @endforeach
                  </ul>
                </div>
                @if(isset($recommendation->timeline_roadmap['one_month']['focus_areas']))
                  <div class="flex flex-wrap gap-2 mt-3 lg:justify-end">
                    @foreach($recommendation->timeline_roadmap['one_month']['focus_areas'] as $area)
                      <span class="bg-dga-primary-100 text-dga-primary-800 px-3 py-1 rounded-full text-xs font-semibold">{{ $area }}</span>
                    @endforeach
                  </div>
                @endif
              </div>
            </div>
          </div>
          <div class="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 hidden lg:block">
            <div class="timeline-number w-12 h-12 bg-dga-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">2</div>
          </div>
         </div>
        @endif

        <!-- Six Months -->
        @if(isset($recommendation->timeline_roadmap['six_months']))
        <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div class="lg:text-left order-1 lg:order-1">
            <div class="timeline-step bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-xl p-6 border-2 border-dga-primary-300 hover:shadow-xl transition cursor-pointer">
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-dga-primary-600 text-white px-4 py-2 rounded-full font-bold text-sm" data-rec-translate="six_months_period">{{ __('messages.six_months_plan') }}</div>
                <h4 class="text-xl font-bold text-dga-primary-800">{{ $recommendation->timeline_roadmap['six_months']['title'] ?? __('messages.six_months_plan') }}</h4>
              </div>
              <div class="space-y-3">
                <div>
                  <p class="text-sm font-semibold text-gray-700 mb-2" data-rec-translate="goals_label">{{ __('messages.goals') }}:</p>
                  <ul class="space-y-2">
                    @foreach($recommendation->timeline_roadmap['six_months']['goals'] ?? [] as $goal)
                      <li class="flex gap-2 items-start">
                        <span class="text-dga-primary-600 mt-1">✓</span>
                        <span class="text-sm text-gray-700">{{ $goal }}</span>
                      </li>
                    @endforeach
                  </ul>
                </div>
                @if(isset($recommendation->timeline_roadmap['six_months']['focus_areas']))
                  <div class="flex flex-wrap gap-2 mt-3">
                    @foreach($recommendation->timeline_roadmap['six_months']['focus_areas'] as $area)
                      <span class="bg-dga-primary-100 text-dga-primary-800 px-3 py-1 rounded-full text-xs font-semibold">{{ $area }}</span>
                    @endforeach
                  </div>
                @endif
              </div>
            </div>
          </div>
          <div class="hidden lg:block order-2"></div>
          <div class="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 hidden lg:block">
            <div class="timeline-number w-12 h-12 bg-dga-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">3</div>
          </div>
          </div>
        @endif

        <!-- One Year -->
        @if(isset($recommendation->timeline_roadmap['one_year']))
        <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div class="hidden lg:block order-1"></div>
          <div class="lg:text-right order-2 lg:order-2">
            <div class="timeline-step bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-xl p-6 border-2 border-dga-primary-300 hover:shadow-xl transition cursor-pointer">
              <div class="flex items-center gap-3 mb-4 lg:flex-row-reverse">
                <div class="bg-dga-primary-600 text-white px-4 py-2 rounded-full font-bold text-sm" data-rec-translate="one_year_period">{{ __('messages.one_year_plan') }}</div>
                <h4 class="text-xl font-bold text-dga-primary-800">{{ $recommendation->timeline_roadmap['one_year']['title'] ?? __('messages.one_year_plan') }}</h4>
              </div>
              <div class="space-y-3">
                <div>
                  <p class="text-sm font-semibold text-gray-700 mb-2" data-rec-translate="goals_label">{{ __('messages.goals') }}:</p>
                  <ul class="space-y-2">
                    @foreach($recommendation->timeline_roadmap['one_year']['goals'] ?? [] as $goal)
                      <li class="flex gap-2 items-start lg:flex-row-reverse lg:text-right">
                        <span class="text-dga-primary-600 mt-1">✓</span>
                        <span class="text-sm text-gray-700">{{ $goal }}</span>
                      </li>
                    @endforeach
                  </ul>
                </div>
                @if(isset($recommendation->timeline_roadmap['one_year']['focus_areas']))
                  <div class="flex flex-wrap gap-2 mt-3 lg:justify-end">
                    @foreach($recommendation->timeline_roadmap['one_year']['focus_areas'] as $area)
                      <span class="bg-dga-primary-100 text-dga-primary-800 px-3 py-1 rounded-full text-xs font-semibold">{{ $area }}</span>
                    @endforeach
                  </div>
                @endif
              </div>
            </div>
          </div>
          <div class="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 hidden lg:block">
            <div class="timeline-number w-12 h-12 bg-dga-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">4</div>
          </div>
          </div>
        @endif

        <!-- Pre-Graduation -->
        @if(isset($recommendation->timeline_roadmap['pre_graduation']))
        <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <div class="lg:text-left order-1 lg:order-1">
            <div class="timeline-step bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-xl p-6 border-2 border-dga-primary-300 hover:shadow-xl transition cursor-pointer">
              <div class="flex items-center gap-3 mb-4">
                <div class="bg-gradient-to-r from-dga-primary-600 to-dga-primary-600 text-white px-4 py-2 rounded-full font-bold text-sm" data-rec-translate="pre_graduation_period">{{ __('messages.pre_graduation_plan') }}</div>
                <h4 class="text-xl font-bold text-dga-primary-800">{{ $recommendation->timeline_roadmap['pre_graduation']['title'] ?? __('messages.pre_graduation_plan') }}</h4>
              </div>
              <div class="space-y-3">
                <div>
                  <p class="text-sm font-semibold text-gray-700 mb-2" data-rec-translate="goals_label">{{ __('messages.goals') }}:</p>
                  <ul class="space-y-2">
                    @php
                      $goals = $recommendation->timeline_roadmap['pre_graduation']['goals'] ?? [];
                      // Handle bilingual format
                      if (is_array($goals) && isset($goals['ar']) && isset($goals['en'])) {
                        $goals = $goals[app()->getLocale()] ?? $goals['ar'];
                      }
                    @endphp
                    @foreach($goals as $goal)
                      <li class="flex gap-2 items-start">
                        <span class="text-dga-primary-600 mt-1">✓</span>
                        <span class="text-sm text-gray-700">{{ $goal }}</span>
                      </li>
                    @endforeach
                  </ul>
                </div>
                @php
                  $focusAreas = $recommendation->timeline_roadmap['pre_graduation']['focus_areas'] ?? null;
                  // Handle bilingual format
                  if (is_array($focusAreas) && isset($focusAreas['ar']) && isset($focusAreas['en'])) {
                    $focusAreas = $focusAreas[app()->getLocale()] ?? $focusAreas['ar'];
                  }
                @endphp
                @if($focusAreas && is_array($focusAreas) && count($focusAreas) > 0)
                  <div class="flex flex-wrap gap-2 mt-3">
                    @foreach($focusAreas as $area)
                      <span class="bg-dga-primary-100 text-dga-primary-800 px-3 py-1 rounded-full text-xs font-semibold">{{ $area }}</span>
                    @endforeach
                  </div>
                @endif


              </div>
            </div>
          </div>
          <div class="hidden lg:block order-2"></div>
          <div class="absolute right-1/2 top-1/2 transform translate-x-1/2 -translate-y-1/2 hidden lg:block">
            <div class="timeline-number w-12 h-12 bg-gradient-to-r from-dga-primary-600 to-dga-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">🎓</div>
          </div>
        </div>
        @endif

      </div>
    </div>
  </div>
  @endif

  <!-- Learning Paths -->
  @if($recommendation && count($recommendation->learning_paths ?? []) > 0)
  <div class="bg-white rounded-2xl p-6 shadow-lg">
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-dga-primary-600 p-3 rounded-full">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-800" data-translate="learning_paths">🛤️ {{ __('messages.learning_paths') }}</h3>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      @foreach($recommendation->learning_paths as $path)
        <div class="bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-xl p-6 border-2 border-dga-primary-200">
          <h4 class="text-xl font-bold text-dga-primary-800 mb-2">{{ $path['title'] ?? __('messages.path') }}</h4>
          <p class="text-gray-600 mb-3">{{ $path['description'] ?? '' }}</p>
          @if(isset($path['duration']))
            <div class="flex items-center gap-2 mb-4 text-sm text-dga-primary-600">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
              </svg>
              <span><span data-rec-translate="duration_label">{{ __('messages.duration') }}</span>: {{ $path['duration'] }}</span>
            </div>
          @endif
          @if(isset($path['steps']) && count($path['steps']) > 0)
            <div class="space-y-2">
              @foreach($path['steps'] as $index => $step)
                <div class="flex gap-3 items-start">
                  <div class="flex-shrink-0 w-6 h-6 bg-dga-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {{ $index + 1 }}
                  </div>
                  <p class="text-sm text-gray-700">{{ $step }}</p>
                </div>
              @endforeach
            </div>
          @endif
        </div>
      @endforeach
    </div>
  </div>
  @endif

  <!-- Weekly Plans -->
  @if($recommendation && count($recommendation->weekly_plans ?? []) > 0)
  <div class="bg-white rounded-2xl p-6 shadow-lg">
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-dga-primary-600 p-3 rounded-full">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-800" data-translate="weekly_plans">📅 {{ __('messages.weekly_plans') }}</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      @foreach($recommendation->weekly_plans as $plan)
        <div class="bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-xl p-5 border-2 border-dga-primary-200 hover:shadow-lg transition">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-lg font-bold text-dga-primary-800"><span data-rec-translate="week_label">{{ __('messages.week') }}</span> <span class="number">{{ $plan['week'] ?? '' }}</span></h4>
            @if(isset($plan['expected_hours']))
              <span class="bg-dga-primary-600 text-white text-xs px-2 py-1 rounded-full number">{{ $plan['expected_hours'] }}<span data-rec-translate="hours">{{ __('messages.hours') }}</span></span>
            @endif
          </div>
          @if(isset($plan['focus']))
            <p class="text-sm font-semibold text-dga-primary-700 mb-3">🎯 {{ $plan['focus'] }}</p>
          @endif
          @if(isset($plan['tasks']) && count($plan['tasks']) > 0)
            <div class="space-y-2">
              @foreach($plan['tasks'] as $task)
                <div class="flex gap-2 items-start">
                  <span class="text-dga-primary-500 mt-1">•</span>
                  <p class="text-xs text-gray-700">{{ $task }}</p>
                </div>
              @endforeach
            </div>
          @endif
        </div>
      @endforeach
    </div>
  </div>
  @endif

  <!-- Goals -->
  @if($recommendation && count($recommendation->goals ?? []) > 0)
  <div class="bg-white rounded-2xl p-6 shadow-lg">
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-dga-primary-600 p-3 rounded-full">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-800" data-translate="smart_goals">🎯 {{ __('messages.smart_goals') }}</h3>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      @foreach($recommendation->goals as $goal)
        <div class="bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-xl p-6 border-2 border-dga-primary-200">
          <div class="flex items-start justify-between mb-3">
            <div>
              <span class="bg-dga-primary-600 text-white text-xs px-2 py-1 rounded-full">{{ $goal['type'] ?? 'monthly' }}</span>
              <span class="bg-dga-primary-600 text-white text-xs px-2 py-1 rounded-full mr-2">{{ $goal['category'] ?? 'academic' }}</span>
            </div>
            @if(isset($goal['target_value']))
              <div class="text-right">
                <div class="text-xs text-gray-600">{{ __('messages.goal') }}</div>
                <div class="text-lg font-bold text-dga-primary-700">{{ $goal['target_value'] }}</div>
              </div>
            @endif
          </div>
          <h4 class="text-lg font-bold text-dga-primary-800 mb-2">{{ $goal['description'] ?? '' }}</h4>
          @if(isset($goal['timeline']))
            <p class="text-sm text-gray-600 mb-3">⏰ {{ $goal['timeline'] }}</p>
          @endif
          @if(isset($goal['action_steps']) && count($goal['action_steps']) > 0)
            <div class="mt-4">
              <p class="text-sm font-semibold text-gray-700 mb-2">{{ __('messages.action_steps') }}:</p>
              <div class="space-y-2">
                @foreach($goal['action_steps'] as $step)
                  <div class="flex gap-2 items-start">
                    <span class="text-dga-primary-500 mt-1">✓</span>
                    <p class="text-sm text-gray-700">{{ $step }}</p>
                  </div>
                @endforeach
              </div>
            </div>
          @endif
        </div>
      @endforeach
    </div>
  </div>
  @endif

  <!-- Improvement Areas -->
  @if($recommendation && count($recommendation->improvement_areas ?? []) > 0)
  <div class="bg-white rounded-2xl p-6 shadow-lg">
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-dga-primary-600 p-3 rounded-full">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-800" data-translate="improvement_areas">⚡ {{ __('messages.improvement_areas') }}</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      @foreach($recommendation->improvement_areas as $area)
        <div class="bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-xl p-5 border-2 border-dga-primary-200 hover:shadow-lg transition">
          <div class="flex gap-3 items-start">
            <span class="text-dga-primary-600 text-2xl">⚡</span>
            <p class="text-gray-700 leading-relaxed">{{ $area }}</p>
          </div>
        </div>
      @endforeach
    </div>
  </div>
  @endif

  <!-- Recommended Resources -->
  @if($recommendation && count($recommendation->recommended_resources ?? []) > 0)
  <div class="bg-white rounded-2xl p-6 shadow-lg">
    <div class="flex items-center gap-3 mb-6">
      <div class="bg-dga-primary-600 p-3 rounded-full">
        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <h3 class="text-2xl font-bold text-gray-800" data-translate="recommended_resources">  {{ __('messages.recommended_resources') }}</h3>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      @foreach($recommendation->recommended_resources as $resource)
        <div class="bg-gradient-to-br from-dga-primary-50 to-dga-primary-50 rounded-xl p-5 border-2 border-dga-primary-200 hover:shadow-lg transition">
          <div class="flex items-center gap-2 mb-3">
            @if(($resource['type'] ?? '') == 'video')
              <span class="text-2xl">🎥</span>
            @elseif(($resource['type'] ?? '') == 'book')
              <span class="text-2xl">📖</span>
            @elseif(($resource['type'] ?? '') == 'app')
              <span class="text-2xl">📱</span>
            @else
              <span class="text-2xl">🔗</span>
            @endif
            <span class="bg-dga-primary-600 text-white text-xs px-2 py-1 rounded-full">{{ $resource['type'] ?? 'resource' }}</span>
          </div>
          <h4 class="text-md font-bold text-dga-primary-800 mb-2">{{ $resource['title'] ?? '' }}</h4>
          <p class="text-sm text-gray-600 mb-3">{{ $resource['description'] ?? '' }}</p>
          @if(isset($resource['link']))
            <p class="text-xs text-dga-primary-600 truncate">🔗 {{ $resource['link'] }}</p>
          @endif
        </div>
      @endforeach
    </div>
  </div>
  @endif

 

</div>

@push('scripts')
<script src="{{ asset('js/recommendations-i18n.js') }}"></script>
<script>
// Timeline Interactive Animation
document.addEventListener('DOMContentLoaded', function() {
  const timelineSteps = document.querySelectorAll('.timeline-step');
  const timelineConnectors = document.querySelectorAll('.timeline-connector');
  const timelineNumbers = document.querySelectorAll('.timeline-number');

  // Intersection Observer for scroll-based animation
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = Array.from(timelineSteps).indexOf(entry.target);

        // Animate step
        setTimeout(() => {
          entry.target.classList.add('active');

          // Animate number
          if (timelineNumbers[index]) {
            timelineNumbers[index].classList.add('active');
          }

          // Animate connector
          if (timelineConnectors[index]) {
            setTimeout(() => {
              timelineConnectors[index].classList.add('active');
            }, 300);
          }
        }, index * 150); // Stagger animation
      }
    });
  }, observerOptions);

  // Observe all timeline steps
  timelineSteps.forEach(step => {
    observer.observe(step);
  });

  // Click to expand/collapse timeline step
  timelineSteps.forEach((step, index) => {
    step.addEventListener('click', function() {
      // Remove 'current' class from all steps
      timelineSteps.forEach(s => s.classList.remove('current'));

      // Add 'current' class to clicked step
      this.classList.add('current');

      // Smooth scroll to step
      this.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
});
</script>
@endpush
@endsection
