@extends('qspark::layouts.app')

@section('title', __('messages.faculty_reports_page_title'))

@section('content')
@php
    $gpaTotal = $reports['gpa_trends']->sum('count');
    $attendanceTotal = $reports['attendance_trends']->sum('count');
    $gpaMax = $reports['gpa_trends']->max('count') ?: 1;
    $attendanceMax = $reports['attendance_trends']->max('count') ?: 1;

    $gpaBand = function ($range) {
        $r = (float) $range;
        if ($r >= 4.5) return ['label' => __('messages.gpa_band_excellent'), 'bar' => 'bg-green-500', 'tag' => 'bg-green-50 text-green-700'];
        if ($r >= 3.75) return ['label' => __('messages.gpa_band_very_good'), 'bar' => 'bg-dga-primary-500', 'tag' => 'bg-dga-primary-50 text-dga-primary-700'];
        if ($r >= 2.75) return ['label' => __('messages.gpa_band_good'), 'bar' => 'bg-dga-primary-500', 'tag' => 'bg-dga-primary-50 text-dga-primary-700'];
        if ($r >= 2.0) return ['label' => __('messages.gpa_band_pass'), 'bar' => 'bg-dga-primary-500', 'tag' => 'bg-dga-primary-50 text-dga-primary-700'];
        return ['label' => __('messages.gpa_band_weak'), 'bar' => 'bg-red-500', 'tag' => 'bg-red-50 text-red-700'];
    };

    $attendanceBand = function ($range) {
        $r = (int) $range;
        if ($r >= 90) return ['label' => __('messages.attendance_band_excellent'), 'bar' => 'bg-green-500'];
        if ($r >= 75) return ['label' => __('messages.attendance_band_good'), 'bar' => 'bg-dga-primary-500'];
        if ($r >= 60) return ['label' => __('messages.attendance_band_average'), 'bar' => 'bg-dga-primary-500'];
        return ['label' => __('messages.attendance_band_low'), 'bar' => 'bg-red-500'];
    };
@endphp

<div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-3xl font-extrabold">{{ __('messages.faculty_reports_title') }}</h2>
        <span class="text-sm text-gray-500">{{ __('messages.reports_total_students') }} <span class="number font-bold">{{ number_format($gpaTotal) }}</span></span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-2xl shadow p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold">{{ __('messages.gpa_distribution_title') }}</h3>
                <span class="text-xs text-gray-500 number">{{ $reports['gpa_trends']->count() }} {{ __('messages.category_unit') }}</span>
            </div>

            <div class="space-y-2 max-h-[480px] overflow-y-auto pr-2">
                @forelse($reports['gpa_trends'] as $row)
                    @php
                        $band = $gpaBand($row->gpa_range);
                        $width = $gpaMax > 0 ? ($row->count / $gpaMax) * 100 : 0;
                        $pct = $gpaTotal > 0 ? ($row->count / $gpaTotal) * 100 : 0;
                    @endphp
                    <div>
                        <div class="flex items-center justify-between text-sm mb-1">
                            <div class="flex items-center gap-2">
                                <span class="font-bold number text-gray-800">{{ $row->gpa_range }}</span>
                                <span class="text-xs px-2 py-0.5 rounded-full {{ $band['tag'] }}">{{ $band['label'] }}</span>
                            </div>
                            <div class="text-gray-600">
                                <span class="number font-semibold">{{ number_format($row->count) }}</span>
                                <span class="text-xs text-gray-400 number">({{ number_format($pct, 1) }}%)</span>
                            </div>
                        </div>
                        <div class="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full {{ $band['bar'] }} rounded-full transition-all" style="width: {{ $width }}%"></div>
                        </div>
                    </div>
                @empty
                    <p class="text-center text-gray-500 py-8">{{ __('messages.no_data') }}</p>
                @endforelse
            </div>
        </div>

        <div class="bg-white rounded-2xl shadow p-6">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold">{{ __('messages.attendance_distribution_title') }}</h3>
                <span class="text-xs text-gray-500 number">{{ $reports['attendance_trends']->count() }} {{ __('messages.category_unit') }}</span>
            </div>

            <div class="space-y-3">
                @forelse($reports['attendance_trends'] as $row)
                    @php
                        $band = $attendanceBand($row->attendance_range);
                        $width = $attendanceMax > 0 ? ($row->count / $attendanceMax) * 100 : 0;
                        $pct = $attendanceTotal > 0 ? ($row->count / $attendanceTotal) * 100 : 0;
                    @endphp
                    <div>
                        <div class="flex items-center justify-between text-sm mb-1">
                            <div class="flex items-center gap-2">
                                <span class="font-bold text-gray-800"><span class="number">{{ $row->attendance_range }}</span>%</span>
                                <span class="text-xs text-gray-500">{{ $band['label'] }}</span>
                            </div>
                            <div class="text-gray-600">
                                <span class="number font-semibold">{{ number_format($row->count) }}</span>
                                <span class="text-xs text-gray-400 number">({{ number_format($pct, 1) }}%)</span>
                            </div>
                        </div>
                        <div class="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div class="h-full {{ $band['bar'] }} rounded-full transition-all" style="width: {{ $width }}%"></div>
                        </div>
                    </div>
                @empty
                    <p class="text-center text-gray-500 py-8">{{ __('messages.no_data') }}</p>
                @endforelse
            </div>
        </div>
    </div>
</div>
@endsection
