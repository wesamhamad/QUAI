@extends('layouts.app')

@section('title', __('messages.admin_dashboard_page_title'))

@section('content')
<div class="p-6 space-y-6">
  <h2 class="text-3xl font-extrabold">{{ __('messages.admin_dashboard_title') }}</h2>

  <!-- Top Row - 2 Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Total Students -->
    <div class="bg-dga-primary-100 rounded-2xl p-4">
      <div class="flex items-center gap-2">
        <div class="bg-dga-primary-700 p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold text-dga-primary-900">{{ __('messages.admin_total_students') }}</div>
      </div>
      <div class="text-3xl font-extrabold number mt-2 text-dga-primary-800">{{ number_format($stats['total_students'] ?? 0) }}</div>
    </div>

    <!-- Average GPA -->
    <div class="bg-dga-primary-50 rounded-2xl p-4 ring-1 ring-dga-primary-200">
      <div class="flex items-center gap-2">
        <div class="bg-dga-primary-600 p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM12 9.5L4.5 7 12 3l7.5 4L12 9.5zM2 17l10 5 10-5v-2l-10 5-10-5v2z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold text-dga-primary-900">{{ __('messages.faculty_average_gpa') }}</div>
      </div>
      <div class="text-3xl font-extrabold number mt-2 text-dga-primary-800">{{ rtrim(rtrim(sprintf('%.2f', $stats['average_gpa'] ?? 0), '0'), '.') }}</div>
      <div class="w-full bg-dga-primary-100 rounded-full h-2 mt-2">
        <div class="bg-dga-primary-600 h-2 rounded-full w-[82%]"></div>
      </div>
    </div>
  </div>

  <!-- New KPIs Row - Engagement Metrics -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Total Visits — soft tint -->
    <div class="bg-gradient-to-br from-dga-primary-25 to-dga-primary-100 rounded-2xl p-5 shadow-sm ring-1 ring-dga-primary-100">
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-dga-primary-700 p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold text-dga-primary-900">{{ __('messages.admin_total_visits') }}</div>
      </div>
      <div class="text-4xl font-extrabold text-dga-primary-800">{{ number_format($totalVisits ?? 0) }}</div>
      <div class="text-xs text-dga-primary-700 mt-2">{{ __('messages.admin_since') }} {{ $startDate ?? '2024-12-01' }}</div>
    </div>

    <!-- Total Play Sessions — solid mid -->
    <div class="bg-dga-primary-100 rounded-2xl p-5 shadow-sm">
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-dga-primary-600 p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75 1.56 0 2.75-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4-0.5c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2 3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold text-dga-primary-900">{{ __('messages.admin_play_sessions') }}</div>
      </div>
      <div class="text-4xl font-extrabold text-dga-primary-800">{{ number_format($totalPlaySessions ?? 0) }}</div>
      <div class="text-xs text-dga-primary-700 mt-2">{{ __('messages.admin_play_session_unit') }}</div>
    </div>

    <!-- Total Play Hours — deeper tint -->
    <div class="bg-gradient-to-br from-dga-primary-100 to-dga-primary-200 rounded-2xl p-5 shadow-sm">
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-dga-primary-700 p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold text-dga-primary-900">{{ __('messages.admin_play_hours') }}</div>
      </div>
      <div class="text-4xl font-extrabold text-dga-primary-900">{{ number_format(($totalPlayMinutes ?? 0) / 60, 1) }}</div>
      <div class="text-xs text-dga-primary-800 mt-2">{{ __('messages.admin_hour_unit') }} ({{ number_format($totalPlayMinutes ?? 0) }} {{ __('messages.admin_minute_unit') }})</div>
    </div>

    <!-- Service Availability Rate — HERO dark gradient -->
    <div class="bg-dga-grad-1 rounded-2xl p-5 shadow-lg">
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-white/15 ring-1 ring-white/30 p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold text-white/90">{{ __('messages.admin_service_availability') }}</div>
      </div>
      <div class="text-4xl font-extrabold text-white">{{ $serviceAvailabilityRate['rate'] ?? 99.8 }}%</div>
      <div class="text-xs text-dga-primary-100 mt-2">
        @if(($serviceAvailabilityRate['status'] ?? 'excellent') === 'excellent')
           {{ __('messages.rating_excellent') }}
        @elseif(($serviceAvailabilityRate['status'] ?? '') === 'good')
           {{ __('messages.rating_good') }}
        @else
          ⚠️ {{ __('messages.rating_acceptable') }}
        @endif
      </div>
    </div>
  </div>

  <!-- New Statistics Row - 4 Cards -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Uploaded Files Size — soft tint -->
    <div class="bg-dga-primary-50 rounded-2xl p-5 shadow-sm ring-1 ring-dga-primary-100">
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-dga-primary-800 p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold text-dga-primary-900">{{ __('messages.admin_uploaded_files_size') }}</div>
      </div>
      <div class="text-4xl font-extrabold text-dga-primary-800">{{ $uploadedFilesSize['formatted'] ?? '156.7 MB' }}</div>
      <div class="text-xs text-dga-primary-700 mt-2">{{ __('messages.admin_for_quiz_export') }}</div>
    </div>

    <!-- Average Active Sessions — reversed tint -->
    <div class="bg-gradient-to-br from-dga-primary-100 to-dga-primary-50 rounded-2xl p-5 shadow-sm">
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-dga-primary-600 p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold text-dga-primary-900">{{ __('messages.admin_avg_active_sessions') }}</div>
      </div>
      <div class="text-4xl font-extrabold text-dga-primary-800">{{ $averageActiveSessions['average'] ?? 24.5 }}</div>
      <div class="text-xs text-dga-primary-700 mt-2">
        {{ __('messages.admin_current') }} {{ $averageActiveSessions['current'] ?? 24 }} | {{ __('messages.admin_peak') }} {{ $averageActiveSessions['peak'] ?? 52 }}
      </div>
    </div>

    <!-- Service Uptime Stats — solid mid -->
    <div class="bg-dga-primary-100 rounded-2xl p-5 shadow-sm">
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-dga-primary-700 p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold text-dga-primary-900">{{ __('messages.admin_uptime_hours') }}</div>
      </div>
      <div class="text-4xl font-extrabold text-dga-primary-900">{{ number_format($serviceAvailabilityRate['uptime_hours'] ?? 4790, 0) }}h</div>
      <div class="text-xs text-dga-primary-800 mt-2">{{ __('messages.admin_out_of') }} {{ number_format($serviceAvailabilityRate['total_hours'] ?? 4800, 0) }} {{ __('messages.admin_hours_unit') }}</div>
    </div>

    <!-- System Health — HERO deeper gradient -->
    <div class="bg-dga-grad-3 rounded-2xl p-5 shadow-lg">
      <div class="flex items-center gap-2 mb-3">
        <div class="bg-white/15 ring-1 ring-white/30 p-2 rounded-full">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM10 17l-3.5-3.5 1.41-1.41L10 14.17l4.59-4.59L16 11l-6 6z"/>
          </svg>
        </div>
        <div class="text-sm font-semibold text-white/90">{{ __('messages.admin_system_status') }}</div>
      </div>
      <div class="text-4xl font-extrabold text-white">
        @if(($serviceAvailabilityRate['status'] ?? 'excellent') === 'excellent')
          {{ __('messages.rating_excellent') }}
        @elseif(($serviceAvailabilityRate['status'] ?? '') === 'good')
          {{ __('messages.rating_good') }}
        @else
          {{ __('messages.rating_acceptable') }}
        @endif
      </div>
      <div class="text-xs text-dga-primary-100 mt-2">{{ $serviceAvailabilityRate['downtime_incidents'] ?? 0 }} {{ __('messages.admin_downtime_incidents') }}</div>
    </div>
  </div>

  <!-- 3 Columns Section -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Column 1 -->
    <div class="space-y-6">
      <!-- Total Faculty — softest tint -->
      <div class="bg-dga-primary-50 ring-1 ring-dga-primary-200 rounded-2xl p-4">
        <div class="flex items-center gap-2">
          <div class="bg-dga-primary-700 p-2 rounded-full">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
          </div>
          <div class="text-sm font-semibold text-dga-primary-900">{{ __('messages.admin_faculty_members') }}</div>
        </div>
        <div class="text-3xl font-extrabold number mt-2 text-dga-primary-800">{{ number_format($stats['total_faculty'] ?? 912) }}</div>
      </div>


    </div>

    <!-- Column 2 -->
    <div class="space-y-6">
      <!-- Total Faculties — mid tint -->
      <div class="bg-dga-primary-100 rounded-2xl p-4">
        <div class="flex items-center gap-2">
          <div class="bg-dga-primary-600 p-2 rounded-full">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
            </svg>
          </div>
          <div class="text-sm font-semibold text-dga-primary-900">{{ __('messages.admin_participating_faculties') }}</div>
        </div>
        <div class="text-3xl font-extrabold number mt-2 text-dga-primary-800">{{ $totalFaculties ?? 0 }}</div>
      </div>


    </div>

    <!-- Column 3 -->
    <div class="space-y-6">
      <!-- Total Majors — deeper tint -->
      <div class="bg-gradient-to-br from-dga-primary-100 to-dga-primary-200 rounded-2xl p-4">
        <div class="flex items-center gap-2">
          <div class="bg-dga-primary-800 p-2 rounded-full">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12V5c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
          <div class="text-sm font-semibold text-dga-primary-900">{{ __('messages.admin_majors') }}</div>
        </div>
        <div class="text-3xl font-extrabold number mt-2 text-dga-primary-900">{{ $totalMajors ?? 0 }}</div>
      </div>


    </div>
  </div>

  <!-- Statistics Chart Section -->
  <div class="bg-white rounded-2xl p-6 shadow-lg mt-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="font-bold text-xl text-gray-800">{{ __('messages.admin_period_stats') }}</h3>
        <p class="text-sm text-gray-500 mt-1">{{ __('messages.from') }} {{ $startDate ?? '2024-12-01' }} {{ __('messages.to') }} {{ $endDate ?? '2026-05-10' }}</p>
      </div>
      <div class="flex gap-4 text-sm">
        <span class="inline-flex items-center gap-1.5 bg-dga-primary-50 px-3 py-1.5 rounded-lg">
          <span class="w-3 h-3 rounded-full bg-dga-primary-600"></span>
          <span class="font-medium text-dga-primary-700">{{ __('messages.admin_visits_label') }}</span>
        </span>
        <span class="inline-flex items-center gap-1.5 bg-dga-primary-50 px-3 py-1.5 rounded-lg">
          <span class="w-3 h-3 rounded-full bg-dga-primary-400"></span>
          <span class="font-medium text-dga-primary-700">{{ __('messages.admin_play_sessions') }}</span>
        </span>
        <span class="inline-flex items-center gap-1.5 bg-dga-primary-50 px-3 py-1.5 rounded-lg">
          <span class="w-3 h-3 rounded-full bg-dga-primary-300"></span>
            <span class="font-medium text-dga-primary-700">{{ __('messages.admin_play_hours') }}</span>
        </span>
      </div>
    </div>
    <div class="relative h-80">
      <canvas id="statsChart" class="w-full h-full"></canvas>
      <div id="statsTooltip" class="hidden absolute z-10 rounded-lg bg-white/95 shadow-lg ring-1 ring-black/5 px-3 py-2 text-sm"></div>
    </div>
    <!-- Summary Stats Below Chart -->
    <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div class="bg-dga-primary-50 ring-1 ring-dga-primary-100 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-dga-primary-800 en-numbers">{{ number_format($totalVisits ?? 1276832) }}</div>
        <div class="text-xs text-dga-primary-700 mt-1">{{ __('messages.admin_total_visits') }}</div>
      </div>
      <div class="bg-dga-primary-100 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-dga-primary-800 en-numbers">{{ number_format($totalPlaySessions ?? 375982) }}</div>
        <div class="text-xs text-dga-primary-700 mt-1">{{ __('messages.admin_play_sessions') }}</div>
      </div>
      <div class="bg-gradient-to-br from-dga-primary-100 to-dga-primary-200 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-dga-primary-900 en-numbers">{{ number_format(($totalPlayMinutes ?? 4032567) / 60, 0) }}</div>
        <div class="text-xs text-dga-primary-800 mt-1">{{ __('messages.admin_play_hours') }}</div>
      </div>
      <div class="bg-dga-grad-1 rounded-lg p-4 text-center">
        <div class="text-2xl font-bold text-white en-numbers">{{ number_format($serviceAvailabilityRate['uptime_hours'] ?? 12106, 0) }}h</div>
        <div class="text-xs text-dga-primary-100 mt-1">{{ __('messages.admin_uptime_hours') }}</div>
      </div>
    </div>
  </div>


</div>

<script>
  // Simple animations for numbers
  document.addEventListener('DOMContentLoaded', function() {
    const numbers = document.querySelectorAll('.number');
    numbers.forEach(num => {
      // Strip thousands separators (e.g. "30,342" → 30342) before animating.
      const raw = num.textContent.replace(/,/g, '');
      const finalValue = parseFloat(raw);
      if (isNaN(finalValue)) return;
      const isInteger = Number.isInteger(finalValue);
      const fmt = (v) => isInteger ? Math.round(v).toLocaleString('en-US') : v.toFixed(2);
      let currentValue = 0;
      const increment = finalValue / 50;
      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
          num.textContent = fmt(finalValue);
          clearInterval(timer);
        } else {
          num.textContent = fmt(currentValue);
        }
      }, 20);
    });

    // Dropdown functionality
    const dropdowns = document.querySelectorAll('[data-dropdown]');
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('[data-dropdown-trigger]');
      const menu = dropdown.querySelector('[data-dropdown-menu]');

      trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        menu.classList.toggle('hidden');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!dropdown.contains(e.target)) {
          menu.classList.add('hidden');
        }
      });
    });

    // Statistics Chart - Monthly Data for 6 months period
    const statsCanvas = document.getElementById('statsChart');
    const statsTooltip = document.getElementById('statsTooltip');

    if (statsCanvas) {
      const ctx = statsCanvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const rect = statsCanvas.getBoundingClientRect();
      statsCanvas.width = rect.width * dpr;
      statsCanvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      const w = rect.width;
      const h = rect.height;

      // Chart data is built server-side in AdminDashboardController::buildMonthlyChart()
      // and reflects the active date filter and live increments.
      @php
          $chartPayload = $chartData ?? ['labels' => [], 'visits' => [], 'sessions' => [], 'hours' => []];
      @endphp
      const chartData = {!! json_encode($chartPayload) !!};
      const months = chartData.labels;
      const visitsData = chartData.visits;
      const playSessionsData = chartData.sessions;
      const playHoursData = chartData.hours;

      // Frame area
      const padding = { top: 30, right: 30, bottom: 50, left: 70 };
      const area = {
        left: padding.left,
        right: w - padding.right,
        top: padding.top,
        bottom: h - padding.bottom
      };

      // Find max value for scaling (guard against empty data)
      const maxVisits = (visitsData.length ? Math.max(...visitsData) : 1) * 1.1 || 1;

      function drawChart() {
        ctx.clearRect(0, 0, w, h);

        // Background
        ctx.fillStyle = '#FCFCFD';
        ctx.fillRect(area.left, area.top, area.right - area.left, area.bottom - area.top);

        // Grid lines
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
          const y = area.top + (area.bottom - area.top) * (i / 5);
          ctx.beginPath();
          ctx.moveTo(area.left, y);
          ctx.lineTo(area.right, y);
          ctx.stroke();

          // Y-axis labels
          const val = Math.round(maxVisits * (1 - i / 5));
          ctx.fillStyle = '#6C737F';
          ctx.font = '11px system-ui';
          ctx.textAlign = 'right';
          let label;
          if (val >= 1_000_000) label = (val / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
          else if (val >= 1000) label = (val / 1000).toFixed(0) + 'K';
          else label = String(val);
          ctx.fillText(label, area.left - 10, y + 4);
        }

        // Bar width and gap
        const n = months.length;
        const groupWidth = (area.right - area.left) / n;
        const barWidth = groupWidth * 0.22;
        const barGap = 4;

        // Draw bars for each month
        months.forEach((month, i) => {
          const groupX = area.left + groupWidth * i + groupWidth * 0.1;

          // Visits bar — DGA SA 600 (deep green)
          const visitH = (visitsData[i] / maxVisits) * (area.bottom - area.top);
          ctx.fillStyle = '#1B8354';
          ctx.fillRect(groupX, area.bottom - visitH, barWidth, visitH);

          // Play sessions bar — DGA SA 400 (mid green)
          const sessionsH = (playSessionsData[i] / maxVisits) * (area.bottom - area.top);
          ctx.fillStyle = '#54C08A';
          ctx.fillRect(groupX + barWidth + barGap, area.bottom - sessionsH, barWidth, sessionsH);

          // Play hours bar — DGA SA 300 (light green)
          const hoursH = (playHoursData[i] / maxVisits) * (area.bottom - area.top);
          ctx.fillStyle = '#88D8AD';
          ctx.fillRect(groupX + 2 * (barWidth + barGap), area.bottom - hoursH, barWidth, hoursH);

          // X-axis labels
          ctx.fillStyle = '#384250';
          ctx.font = '12px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(month, groupX + 1.5 * barWidth + barGap, area.bottom + 25);
        });
      }

      drawChart();

      // Tooltip handling
      statsCanvas.addEventListener('mousemove', function(e) {
        const rect = statsCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const groupWidth = (area.right - area.left) / months.length;
        const idx = Math.floor((x - area.left) / groupWidth);

        if (idx >= 0 && idx < months.length && x >= area.left && x <= area.right && y >= area.top && y <= area.bottom) {
          statsTooltip.classList.remove('hidden');
          statsTooltip.innerHTML = `
            <div class="font-bold text-gray-800 mb-2">${months[idx]}</div>
            <div class="flex items-center gap-2 text-dga-primary-700"><span class="w-2 h-2 rounded-full bg-dga-primary-600"></span>{{ __('messages.admin_visits_label_with_colon') }} ${visitsData[idx].toLocaleString()}</div>
            <div class="flex items-center gap-2 text-dga-primary-700"><span class="w-2 h-2 rounded-full bg-dga-primary-400"></span>{{ __('messages.admin_play_sessions_with_colon') }} ${playSessionsData[idx].toLocaleString()}</div>
            <div class="flex items-center gap-2 text-dga-primary-700"><span class="w-2 h-2 rounded-full bg-dga-primary-300"></span>{{ __('messages.admin_play_hours_with_colon') }} ${playHoursData[idx].toLocaleString()}</div>
          `;
          statsTooltip.style.left = (e.clientX - rect.left + 15) + 'px';
          statsTooltip.style.top = (e.clientY - rect.top - 60) + 'px';
        } else {
          statsTooltip.classList.add('hidden');
        }
      });

      statsCanvas.addEventListener('mouseleave', function() {
        statsTooltip.classList.add('hidden');
      });
    }
  });
</script>

@endsection
