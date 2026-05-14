@extends('layouts.dashboard')

@section('title', 'توصيات الذكاء الاصطناعي - QUAI')
@section('page-title', 'توصيات الذكاء الاصطناعي')

@push('styles')
    @include('q-decision._dashboard-styles')
@endpush

@section('content')
<div class="ai-page">
    <div class="ai-hero">
        <span class="ai-tag">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l1.5 4.5L19 9l-4.5 1.5L13 15l-1.5-4.5L7 9l4.5-1.5L13 3z"/>
            </svg>
            AI INSIGHTS · توصيات مشتقة من بيانات اللوحات
        </span>
        <h1>توصيات الذكاء الاصطناعي</h1>
        <p>توصيات قابلة للتنفيذ مشتقة من لوحات المؤشرات الست. تنقسم إلى ثلاث طبقات:
            <strong style="color:#fca5a5">عاجل</strong> ·
            <strong style="color:#fbbf24">استباقي</strong> ·
            <strong style="color:#86efac">استراتيجي</strong>.
        </p>
    </div>

    @include('q-decision._quarter-selector')

    <div class="ai-priority-legend">
        @foreach ($priorityMeta as $key => $pmeta)
            <div class="item">
                <span class="swatch" style="background: {{ $pmeta['color'] }};"></span>
                <span><strong>{{ $pmeta['label'] }}</strong> — {{ $pmeta['description'] }}</span>
            </div>
        @endforeach
    </div>

    @foreach ($sections as $section)
        <section class="ai-section" id="ai-{{ $section['id'] }}">
            <div class="ai-section-head">
                <div class="ai-section-icon" style="background: {{ $section['accent'] }};">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                </div>
                <div class="ai-section-meta">
                    <span class="dash-tag">المصدر: {{ $section['dashboard'] }}</span>
                    <h2>{{ $section['dashboard'] }}</h2>
                    <div class="subtitle">{{ $section['subtitle'] }}</div>
                </div>
                <span class="ai-section-count">{{ count($section['recommendations']) }} توصية</span>
            </div>
            @include('q-decision._rec-cards', ['recommendations' => $section['recommendations']])
        </section>
    @endforeach
</div>
@endsection
