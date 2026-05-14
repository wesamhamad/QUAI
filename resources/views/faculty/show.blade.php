@extends('layouts.dashboard')

@section('title', $student['name'] . ' — عرض هيئة التدريس')
@section('page-title', 'عرض الطالب: ' . $student['name'])

@push('styles')
<style>
    .fac-hero { background: linear-gradient(135deg,#14573A 0%, #1B8354 100%); color:#fff; border-radius: var(--q-radius-2xl); padding: var(--q-space-6); margin-bottom: var(--q-space-5); }
    .fac-hero h1 { margin:0 0 var(--q-space-2) 0; font-size: var(--q-font-2xl); font-weight:800; }
    .fac-hero-meta { display:flex; gap: var(--q-space-4); flex-wrap: wrap; opacity:.95; font-size: var(--q-font-sm); }
    .fac-hero-meta span strong { font-weight:700; margin-inline-start: 4px; }
    .fac-tabs { display:flex; gap: var(--q-space-2); border-bottom: 1px solid var(--q-border-color); margin-bottom: var(--q-space-4); }
    .fac-tab { padding: var(--q-space-3) var(--q-space-5); border:none; background:transparent; cursor:pointer; font-weight:600; color: var(--q-text-secondary); border-bottom: 3px solid transparent; font-size: var(--q-font-base); text-decoration:none; }
    .fac-tab.active { color:#14573A; border-bottom-color:#14573A; }
    .fac-tab:hover { color:#14573A; }
    .fac-frame-wrap { background:#fff; border:1px solid var(--q-border-color); border-radius: var(--q-radius-xl); overflow:hidden; }
    .fac-frame { width:100%; height: calc(100vh - 320px); min-height: 600px; border:0; display:block; }
    .fac-open-newtab { font-size: var(--q-font-xs); color: var(--q-text-secondary); margin-top: var(--q-space-2); display:inline-block; }
</style>
@endpush

@section('content')
<div style="max-width: var(--q-content-max); margin: 0 auto;">

    <a href="{{ route('faculty.students') }}" style="display:inline-flex; align-items:center; gap:6px; color: var(--q-text-secondary); text-decoration:none; margin-bottom: var(--q-space-3); font-size: var(--q-font-sm);">
        ← العودة لقائمة الطلاب
    </a>

    <div class="fac-hero">
        <h1>{{ $student['name'] }}</h1>
        <div class="fac-hero-meta">
            <span dir="ltr">رقم الطالب: <strong>{{ $student['student_id'] }}</strong></span>
            <span>الكلية: <strong>{{ $student['faculty'] }}</strong></span>
            <span>التخصص: <strong>{{ $student['major'] }}</strong></span>
            <span>المعدل: <strong>{{ number_format($student['gpa'], 2) }}</strong></span>
            <span>المستوى: <strong>{{ $student['level'] }}</strong></span>
        </div>
    </div>

    <nav class="fac-tabs" aria-label="بيانات الطالب">
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
            title="{{ $tabs[$tab]['label'] }} — {{ $student['name'] }}"
            loading="lazy"></iframe>
    </div>

    <a href="{{ $tabs[$tab]['url'] }}" target="_blank" rel="noopener" class="fac-open-newtab">
        فتح في تبويب جديد ↗
    </a>
</div>
@endsection
