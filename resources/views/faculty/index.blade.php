@extends('layouts.dashboard')

@section('title', __('messages.faculty_students_page_title'))
@section('page-title', __('messages.nav_students'))

@push('styles')
<style>
    .fac-hero { padding: var(--q-space-6); margin-bottom: var(--q-space-6); background: linear-gradient(135deg, #14573A 0%, #1B8354 100%); color: #fff; border-radius: var(--q-radius-2xl); }
    .fac-hero h1 { margin: 0 0 var(--q-space-2) 0; font-size: var(--q-font-2xl); font-weight: 800; }
    .fac-hero p  { margin: 0; opacity: .9; }

    .fac-search { margin-bottom: var(--q-space-5); display: flex; flex-wrap: wrap; gap: var(--q-space-2); align-items: stretch; }
    .fac-search input { flex: 1 1 220px; min-width: 0; padding: var(--q-space-3) var(--q-space-4); border: 1px solid var(--q-border-color); border-radius: var(--q-radius-lg); font-size: var(--q-font-base); background: var(--q-card-bg); color: var(--q-text); }

    .fac-table-wrap { padding: 0; overflow-x: auto; }
    .fac-table { width: 100%; border-collapse: collapse; font-size: var(--q-font-sm); }
    .fac-table thead { background: #F1F5F2; }
    .fac-table thead th { padding: var(--q-space-3) var(--q-space-4); text-align: start; font-weight: 700; color: var(--q-text-primary); }
    .fac-table tbody tr { border-top: 1px solid var(--q-border-color); }
    .fac-table td { padding: var(--q-space-3) var(--q-space-4); }
    .fac-table td.is-id { font-family: monospace; }
    .fac-table td.is-name { font-weight: 600; }
    .fac-table td.is-gpa  { font-weight: 600; color: #14573A; }
    .fac-table td.is-action { text-align: end; white-space: nowrap; }
    .fac-table .fac-empty { padding: var(--q-space-6); text-align: center; color: var(--q-text-secondary); }

    /* Mobile (≤ 640px): collapse the table into stacked cards so it fits any
       width without horizontal scrolling. Each cell gets a label via a CSS
       custom property that we set from data-label attributes. */
    @media (max-width: 640px) {
        .fac-table thead { display: none; }
        .fac-table, .fac-table tbody, .fac-table tr, .fac-table td { display: block; width: 100%; }
        .fac-table tr {
            border: 1px solid var(--q-border-color);
            border-radius: var(--q-radius-lg);
            padding: var(--q-space-3);
            margin: var(--q-space-3);
            background: var(--q-card-bg);
        }
        .fac-table tbody tr + tr { border-top: 1px solid var(--q-border-color); }
        .fac-table td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: var(--q-space-3);
            padding: 6px 0;
            border: none;
            text-align: end;
        }
        .fac-table td::before {
            content: attr(data-label);
            font-weight: 600;
            color: var(--q-text-secondary);
            font-size: var(--q-font-xs);
            text-align: start;
            flex-shrink: 0;
        }
        .fac-table td.is-action { justify-content: stretch; padding-top: var(--q-space-3); }
        .fac-table td.is-action::before { display: none; }
        .fac-table td.is-action .q-btn { width: 100%; text-align: center; }
        .fac-table .fac-empty { text-align: center; }
        .fac-table .fac-empty::before { display: none; }
        .fac-hero { padding: var(--q-space-5); }
        .fac-hero h1 { font-size: var(--q-font-xl); }
    }
</style>
@endpush

@section('content')
@php
    $__isEn = app()->getLocale() === 'en';
    $pick = fn (array $row, string $arKey, string $enKey) => $__isEn
        ? ($row[$enKey] ?? $row[$arKey] ?? '')
        : ($row[$arKey] ?? $row[$enKey] ?? '');
@endphp
<div style="max-width: var(--q-content-max); margin: 0 auto;">

    <div class="q-card fac-hero">
        <h1>{{ __('messages.faculty_students_hero_title') }}</h1>
        <p>{{ __('messages.faculty_students_hero_desc') }}</p>
    </div>

    <form method="get" action="{{ route('faculty.students') }}" class="fac-search">
        <input
            type="text"
            name="q"
            value="{{ $query }}"
            placeholder="{{ __('messages.faculty_students_search_placeholder') }}">
        <button type="submit" class="q-btn q-btn-primary" style="padding: var(--q-space-3) var(--q-space-5);">{{ __('messages.search') }}</button>
        @if($query !== '')
            <a href="{{ route('faculty.students') }}" class="q-btn" style="padding: var(--q-space-3) var(--q-space-5); background: var(--q-card-bg); border: 1px solid var(--q-border-color);">{{ __('messages.clear') }}</a>
        @endif
    </form>

    <div class="q-card fac-table-wrap">
        <table class="fac-table">
            <thead>
                <tr>
                    <th>{{ __('messages.student_id') }}</th>
                    <th>{{ __('messages.name') }}</th>
                    <th>{{ __('messages.college') }}</th>
                    <th>{{ __('messages.major_col') }}</th>
                    <th>{{ __('messages.gpa') }}</th>
                    <th>{{ __('messages.faculty_level_col') }}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
            @forelse($students as $s)
                <tr>
                    <td class="is-id"   data-label="{{ __('messages.student_id') }}" dir="ltr">{{ $s['student_id'] }}</td>
                    <td class="is-name" data-label="{{ __('messages.name') }}">{{ $pick($s, 'name', 'name_en') }}</td>
                    <td data-label="{{ __('messages.college') }}">{{ $pick($s, 'faculty', 'faculty_en') }}</td>
                    <td data-label="{{ __('messages.major_col') }}">{{ $pick($s, 'major', 'major_en') }}</td>
                    <td class="is-gpa" data-label="{{ __('messages.gpa') }}" dir="ltr">{{ number_format($s['gpa'], 2) }}</td>
                    <td data-label="{{ __('messages.faculty_level_col') }}" dir="ltr">{{ $s['level'] }}</td>
                    <td class="is-action">
                        <a href="{{ route('faculty.students.show', $s['student_id']) }}"
                           class="q-btn q-btn-primary"
                           style="padding: 6px 14px; font-size: var(--q-font-xs); text-decoration: none;">
                            {{ __('messages.faculty_view_data') }}
                        </a>
                    </td>
                </tr>
            @empty
                <tr><td colspan="7" class="fac-empty">{{ __('messages.faculty_no_search_results') }}</td></tr>
            @endforelse
            </tbody>
        </table>
    </div>

    <p style="margin-top: var(--q-space-4); font-size: var(--q-font-xs); color: var(--q-text-secondary);">
        {{ __('messages.faculty_demo_data_notice') }}
    </p>
</div>
@endsection
