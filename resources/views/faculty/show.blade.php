@extends('layouts.dashboard')

@php
    $__isEn       = app()->getLocale() === 'en';
    $studentName  = $__isEn ? ($student['name_en']    ?? $student['name'])    : $student['name'];
    $studentMajor = $__isEn ? ($student['major_en']   ?? $student['major'])   : $student['major'];
    $studentCollg = $__isEn ? ($student['faculty_en'] ?? $student['faculty']) : $student['faculty'];
@endphp

@section('title', $studentName . ' — ' . __('messages.nav_students'))
@section('page-title', __('messages.faculty_view_student') . ': ' . $studentName)

@push('styles')
<style>
    .fac-hero { background: linear-gradient(135deg,#14573A 0%, #1B8354 100%); color:#fff; border-radius: var(--q-radius-2xl); padding: var(--q-space-6); margin-bottom: var(--q-space-5); }
    .fac-hero h1 { margin:0 0 var(--q-space-2) 0; font-size: var(--q-font-2xl); font-weight:800; word-break: break-word; }
    .fac-hero-meta { display:flex; gap: var(--q-space-4); flex-wrap: wrap; opacity:.95; font-size: var(--q-font-sm); }
    .fac-hero-meta span strong { font-weight:700; margin-inline-start: 4px; }
    .fac-back { display:inline-flex; align-items:center; gap:6px; color: var(--q-text-secondary); text-decoration:none; margin-bottom: var(--q-space-3); font-size: var(--q-font-sm); }
    .fac-back-icon { display:inline-block; }
    /* Mirror the back-arrow under RTL via a transform so we don't need to
       maintain two glyphs (LTR shows ←, RTL shows the same character flipped). */
    [dir="rtl"] .fac-back-icon { transform: scaleX(-1); }
    .fac-tabs { display:flex; gap: var(--q-space-2); border-bottom: 1px solid var(--q-border-color); margin-bottom: var(--q-space-4); overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .fac-tabs::-webkit-scrollbar { display: none; }
    .fac-tab { padding: var(--q-space-3) var(--q-space-5); border:none; background:transparent; cursor:pointer; font-weight:600; color: var(--q-text-secondary); border-bottom: 3px solid transparent; font-size: var(--q-font-base); text-decoration:none; white-space: nowrap; flex-shrink: 0; }
    .fac-tab.active { color:#14573A; border-bottom-color:#14573A; }
    .fac-tab:hover { color:#14573A; }
    .fac-frame-wrap { background:#fff; border:1px solid var(--q-border-color); border-radius: var(--q-radius-xl); overflow:hidden; }
    .fac-frame { width:100%; height: calc(100vh - 320px); min-height: 600px; border:0; display:block; }
    @media (max-width: 768px) {
        .fac-hero { padding: var(--q-space-5); }
        .fac-hero h1 { font-size: var(--q-font-xl); }
        .fac-hero-meta { gap: var(--q-space-2) var(--q-space-3); font-size: var(--q-font-xs); }
        .fac-tab { padding: var(--q-space-3) var(--q-space-4); font-size: var(--q-font-sm); }
        .fac-frame { height: calc(100vh - 260px); min-height: 460px; }
    }
    @media (max-width: 480px) {
        .fac-hero { padding: var(--q-space-4); }
        .fac-hero-meta { flex-direction: column; gap: 4px; }
    }
    .fac-open-newtab { font-size: var(--q-font-xs); color: var(--q-text-secondary); margin-top: var(--q-space-2); display:inline-block; }
</style>
@endpush

@section('content')
<div style="max-width: var(--q-content-max); margin: 0 auto;">

    <a href="{{ route('faculty.students') }}" class="fac-back">
        <span class="fac-back-icon" aria-hidden="true">←</span>
        {{ __('messages.faculty_back_to_students_list') }}
    </a>

    <div class="fac-hero">
        <h1>{{ $studentName }}</h1>
        <div class="fac-hero-meta">
            <span dir="ltr">{{ __('messages.student_id') }}: <strong>{{ $student['student_id'] }}</strong></span>
            <span>{{ __('messages.college') }}: <strong>{{ $studentCollg }}</strong></span>
            <span>{{ __('messages.major_col') }}: <strong>{{ $studentMajor }}</strong></span>
            <span>{{ __('messages.gpa') }}: <strong>{{ number_format($student['gpa'], 2) }}</strong></span>
            <span>{{ __('messages.faculty_level_col') }}: <strong>{{ $student['level'] }}</strong></span>
        </div>
    </div>

    <nav class="fac-tabs" aria-label="{{ __('messages.faculty_student_data') }}">
        @foreach($tabs as $key => $info)
            <a href="{{ route('faculty.students.show', ['studentId' => $student['student_id'], 'tab' => $key]) }}"
               class="fac-tab {{ $tab === $key ? 'active' : '' }}">
                {{ $info['label'] }}
            </a>
        @endforeach
    </nav>

    <div class="fac-frame-wrap">
        <iframe
            src="{{ $tabs[$tab]['url'] }}"
            class="fac-frame"
            title="{{ $tabs[$tab]['label'] }} — {{ $studentName }}"
            loading="lazy"></iframe>
    </div>

    <a href="{{ $tabs[$tab]['url'] }}" target="_blank" rel="noopener" class="fac-open-newtab">
        {{ __('messages.faculty_open_in_new_tab') }} ↗
    </a>
</div>
@endsection
