@extends('layouts.dashboard')

@section('title', __('messages.q_decision_recommendations_title') . ' - QUAI')
@section('page-title', __('messages.q_decision_recommendations_title'))
@section('content-class', 'q-content fi-bg')

@push('styles')
    @include('q-decision._dashboard-styles')
@endpush

@section('content')
<div class="ai-page">
    <div class="fi-header">
        <h1>{{ __('messages.q_decision_recommendations_title') }}</h1>
        <p>{{ __('messages.q_decision_recommendations_subtitle') }}</p>
    </div>

    @include('q-decision._quarter-selector')

    {{-- Priority legend --}}
    <div class="ai-kpis" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        @foreach ($priorityMeta as $key => $pmeta)
            <div class="ai-kpi">
                <div class="k-label" style="display:flex;align-items:center;gap:0.4rem;">
                    <span style="width:0.7rem;height:0.7rem;border-radius:4px;background:{{ $pmeta['color'] }};"></span>
                    {{ $pmeta['label'] }}
                </div>
                <div class="k-hint" style="color:#6b7280;margin-top:0.5rem;">{{ $pmeta['description'] }}</div>
            </div>
        @endforeach
    </div>

    @foreach ($sections as $section)
        <div class="fi-section" id="ai-{{ $section['id'] }}">
            <div class="fi-section-head">
                <span class="dot" style="background: {{ $section['accent'] }};"></span>
                <h2>{{ $section['dashboard'] }}</h2>
                <span class="count">{{ count($section['recommendations']) }} {{ __('messages.q_decision_recommendation_count') }}</span>
            </div>
            @include('q-decision._rec-cards', ['recommendations' => $section['recommendations']])
        </div>
    @endforeach
</div>
@endsection
