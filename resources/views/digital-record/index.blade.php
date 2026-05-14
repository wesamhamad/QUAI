@extends('layouts.dashboard')

@section('title', 'سجلك الرقمي - QUAI')
@section('page-title', 'سجلك الرقمي')

@push('styles')
<style>
    /* === Digital Record (سجلك الرقمي) — DGA SA palette === */
    .dr-wrapper { max-width: var(--q-content-max); margin: 0 auto; }

    .dr-hero {
        position: relative;
        overflow: hidden;
        border-radius: var(--q-radius-2xl);
        background: linear-gradient(135deg, #14573A 0%, #1B8354 50%, #25935F 100%);
        color: #fff;
        padding: var(--q-space-8);
        margin-bottom: var(--q-space-6);
        box-shadow: 0 10px 30px -12px rgba(20, 87, 58, 0.4);
    }
    .dr-hero::before {
        content: ''; position: absolute; inset: 0;
        background:
            radial-gradient(600px 200px at 90% -20%, rgba(255,255,255,.18), transparent 60%),
            radial-gradient(400px 200px at 10% 120%, rgba(255,255,255,.10), transparent 60%);
        pointer-events: none;
    }
    .dr-hero-row {
        position: relative; z-index: 1;
        display: flex; align-items: center; gap: var(--q-space-5); flex-wrap: wrap;
    }
    .dr-hero-icon {
        width: 64px; height: 64px; border-radius: var(--q-radius-2xl);
        background: rgba(255,255,255,.15); display: flex; align-items: center; justify-content: center;
        flex-shrink: 0; backdrop-filter: blur(6px);
    }
    .dr-hero h1 { margin: 0; font-size: var(--q-font-3xl); font-weight: 800; line-height: var(--q-line-height-tight); }
    .dr-hero p  { margin: var(--q-space-2) 0 0; color: rgba(255,255,255,.85); font-size: var(--q-font-base); }
    .dr-hero-badge {
        display: inline-flex; align-items: center; gap: var(--q-space-2);
        padding: 6px var(--q-space-3); border-radius: 999px;
        background: rgba(255,255,255,.15); font-size: var(--q-font-xs); font-weight: 600;
        margin-top: var(--q-space-3);
    }

    /* Stats grid */
    .dr-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--q-space-5); margin-bottom: var(--q-space-6); }
    .dr-stat {
        background: var(--q-card-bg);
        border: 1px solid var(--q-border-color, #E5E7EB);
        border-radius: var(--q-radius-xl);
        padding: var(--q-space-5);
        position: relative; overflow: hidden;
        transition: transform var(--q-transition-fast), box-shadow var(--q-transition-fast);
    }
    .dr-stat:hover { transform: translateY(-2px); box-shadow: 0 8px 24px -10px rgba(37,147,95,.25); }
    .dr-stat::before {
        content: ''; position: absolute; top: 0; right: 0; width: 4px; height: 100%;
        background: linear-gradient(180deg, #25935F, #166A45);
    }
    .dr-stat-icon {
        width: 44px; height: 44px; border-radius: var(--q-radius-lg);
        background: linear-gradient(135deg, #DFF6E7, #B8EACB);
        color: #166A45; display: flex; align-items: center; justify-content: center;
        margin-bottom: var(--q-space-3);
    }
    .dr-stat-value { font-size: var(--q-font-3xl); font-weight: 800; color: #14573A; line-height: 1; margin-bottom: 4px; }
    .dr-stat-label { font-size: var(--q-font-sm); color: var(--q-text-secondary); font-weight: 500; }
    .dr-stat-sub { font-size: var(--q-font-xs); color: #166A45; font-weight: 600; margin-top: var(--q-space-2); }

    /* Filter / toolbar */
    .dr-toolbar {
        display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap;
        gap: var(--q-space-3); margin-bottom: var(--q-space-5);
        padding: var(--q-space-4) var(--q-space-5);
        background: var(--q-card-bg);
        border: 1px solid var(--q-border-color, #E5E7EB);
        border-radius: var(--q-radius-xl);
    }
    .dr-toolbar h2 { margin: 0; font-size: var(--q-font-lg); font-weight: 700; color: var(--q-text-primary); display: flex; align-items: center; gap: var(--q-space-2); }
    .dr-toolbar h2 svg { color: #25935F; }

    .dr-form { display: flex; align-items: center; gap: var(--q-space-2); }
    .dr-input {
        height: 38px; padding: 0 var(--q-space-3);
        border: 1px solid var(--q-border-color, #D2D6DB);
        border-radius: var(--q-radius-lg); font-family: inherit; font-size: var(--q-font-sm);
        min-width: 160px; background: var(--q-card-bg); color: var(--q-text-primary);
    }
    .dr-input:focus { outline: none; border-color: #25935F; box-shadow: 0 0 0 3px rgba(37,147,95,.15); }
    .dr-btn {
        height: 38px; padding: 0 var(--q-space-4);
        background: linear-gradient(90deg, #1B8354 0%, #25935F 100%);
        color: white; border: none; border-radius: var(--q-radius-lg);
        font-weight: 600; cursor: pointer; font-size: var(--q-font-sm);
        display: inline-flex; align-items: center; gap: var(--q-space-2);
        transition: filter var(--q-transition-fast), transform var(--q-transition-fast);
    }
    .dr-btn:hover { filter: brightness(1.05); transform: translateY(-1px); }
    .dr-btn-outline {
        background: transparent; color: #166A45; border: 1px solid #B8EACB;
    }
    .dr-btn-outline:hover { background: #F3FCF6; }

    /* Section card */
    .dr-section {
        background: var(--q-card-bg);
        border: 1px solid var(--q-border-color, #E5E7EB);
        border-radius: var(--q-radius-xl);
        overflow: hidden;
        margin-bottom: var(--q-space-5);
    }
    .dr-section-head {
        padding: var(--q-space-4) var(--q-space-5);
        background: linear-gradient(90deg, #F3FCF6 0%, #DFF6E7 100%);
        border-bottom: 1px solid #B8EACB;
        display: flex; align-items: center; gap: var(--q-space-3);
    }
    .dr-section-head h3 { margin: 0; font-size: var(--q-font-base); font-weight: 700; color: #14573A; }
    .dr-pill {
        display: inline-flex; align-items: center; padding: 2px var(--q-space-2);
        border-radius: 999px; background: #25935F; color: white;
        font-size: var(--q-font-xs); font-weight: 700; margin-inline-start: auto;
    }

    /* Skill row */
    .dr-skill-list { padding: var(--q-space-2); }
    .dr-skill {
        display: grid;
        grid-template-columns: 44px 1fr auto auto;
        align-items: center; gap: var(--q-space-3);
        padding: var(--q-space-3) var(--q-space-4);
        border-radius: var(--q-radius-lg);
        transition: background var(--q-transition-fast);
    }
    .dr-skill:hover { background: #F7FDF9; }
    .dr-skill + .dr-skill { border-top: 1px dashed var(--q-border-color, #E5E7EB); }
    .dr-skill-ico {
        width: 40px; height: 40px; border-radius: var(--q-radius-lg);
        background: #DFF6E7; color: #166A45;
        display: flex; align-items: center; justify-content: center;
    }
    .dr-skill-title { font-weight: 600; color: var(--q-text-primary); font-size: var(--q-font-sm); }
    .dr-skill-meta { font-size: var(--q-font-xs); color: var(--q-text-secondary); margin-top: 2px; }
    .dr-skill-hours {
        background: #F3FCF6; color: #14573A; font-weight: 700;
        padding: 4px var(--q-space-3); border-radius: var(--q-radius-lg);
        font-size: var(--q-font-xs); border: 1px solid #B8EACB;
    }
    .dr-status {
        display: inline-flex; align-items: center; gap: 4px;
        padding: 2px var(--q-space-2); border-radius: 999px;
        font-size: var(--q-font-xs); font-weight: 600;
    }
    .dr-status-accepted { background: #DCFAE6; color: #067647; }
    .dr-status-pending  { background: #DFF6E7; color: #166A45; }
    .dr-status-rejected { background: #DFF6E7; color: #14573A; }

    /* Empty / error */
    .dr-empty {
        text-align: center; padding: var(--q-space-8) var(--q-space-5);
        color: var(--q-text-secondary);
    }
    .dr-empty-icon {
        width: 72px; height: 72px; border-radius: 50%;
        background: #F3FCF6; color: #25935F;
        display: inline-flex; align-items: center; justify-content: center;
        margin-bottom: var(--q-space-4);
    }
    .dr-alert {
        margin: var(--q-space-4) 0; padding: var(--q-space-4) var(--q-space-5);
        border-radius: var(--q-radius-lg); border: 1px solid #B8EACB;
        background: #F3FCF6; color: #14573A; font-size: var(--q-font-sm);
        display: flex; align-items: flex-start; gap: var(--q-space-3);
    }
    .dr-alert-warn { border-color: #B8EACB; background: #F7FDF9; color: #166A45; }

    /* === AI Analysis === */
    .dr-ai {
        background: var(--q-card-bg);
        border: 1px solid var(--q-border-color, #E5E7EB);
        border-radius: var(--q-radius-xl);
        padding: var(--q-space-5);
        margin-bottom: var(--q-space-6);
    }
    .dr-ai-head {
        display: flex; align-items: center; gap: var(--q-space-3);
        margin-bottom: var(--q-space-4); padding-bottom: var(--q-space-4);
        border-bottom: 1px dashed var(--q-border-color, #E5E7EB);
    }
    .dr-ai-badge {
        width: 44px; height: 44px; border-radius: var(--q-radius-lg);
        background: linear-gradient(135deg, #14573A, #25935F);
        color: #fff; display: flex; align-items: center; justify-content: center;
        flex-shrink: 0;
    }
    .dr-ai-head h2 { margin: 0; font-size: var(--q-font-lg); font-weight: 800; color: #14573A; }
    .dr-ai-head p { margin: 2px 0 0; font-size: var(--q-font-sm); color: var(--q-text-secondary); }
    .dr-ai-summary {
        background: linear-gradient(135deg, #F3FCF6 0%, #DFF6E7 100%);
        border-right: 4px solid #25935F;
        padding: var(--q-space-4) var(--q-space-5);
        border-radius: var(--q-radius-lg);
        color: #14573A; font-size: var(--q-font-sm); line-height: 1.7;
        margin-bottom: var(--q-space-5);
    }
    .dr-ai-grid {
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
        gap: var(--q-space-5);
    }
    @media (max-width: 900px) { .dr-ai-grid { grid-template-columns: 1fr; } }

    .dr-cloud-card {
        background: linear-gradient(135deg, #F7FDF9 0%, #FFFFFF 100%);
        border: 1px solid #DFF6E7;
        border-radius: var(--q-radius-xl);
        padding: var(--q-space-4);
    }
    .dr-cloud-title {
        font-size: var(--q-font-sm); font-weight: 700; color: #14573A;
        margin-bottom: var(--q-space-3); display: flex; align-items: center; gap: var(--q-space-2);
    }
    .dr-cloud-canvas { display: none; } /* legacy canvas, no longer used */
    .dr-cloud {
        display: flex; flex-wrap: wrap;
        align-items: center; justify-content: center;
        gap: var(--q-space-2) var(--q-space-3);
        min-height: 280px;
        padding: var(--q-space-4) var(--q-space-2);
        line-height: 1.2;
    }
    .dr-cloud-tag {
        display: inline-flex; align-items: center;
        padding: 4px 10px;
        border-radius: var(--q-radius-md);
        font-weight: 700;
        white-space: nowrap;
        transition: transform var(--q-transition-fast), filter var(--q-transition-fast);
    }
    .dr-cloud-tag:hover { transform: translateY(-1px); filter: brightness(1.05); }
    .dr-cloud-tag-match {
        color: #14573A;
        background: #DFF6E7;
        border: 1px solid #B8EACB;
    }
    .dr-cloud-tag-gap {
        color: #166A45;
        background: #F7FDF9;
        border: 1px dashed #B8EACB;
    }
    .dr-cloud-legend {
        display: flex; gap: var(--q-space-4); flex-wrap: wrap;
        margin-top: var(--q-space-3); font-size: var(--q-font-xs);
        color: var(--q-text-secondary);
    }
    .dr-cloud-legend span::before {
        content: ''; display: inline-block; width: 10px; height: 10px;
        border-radius: 50%; margin-inline-end: 6px; vertical-align: middle;
    }
    .dr-cloud-legend .dr-leg-match::before { background: #25935F; }
    .dr-cloud-legend .dr-leg-gap::before { background: #9FD1B0; border: 1px dashed #166A45; }

    .dr-gap-list { display: flex; flex-direction: column; gap: var(--q-space-2); }
    .dr-gap {
        display: grid; grid-template-columns: 1fr auto; align-items: center;
        gap: var(--q-space-3); padding: var(--q-space-3) var(--q-space-4);
        border: 1px dashed #B8EACB; background: #F7FDF9; border-radius: var(--q-radius-lg);
    }
    .dr-gap-title { font-weight: 700; color: #14573A; font-size: var(--q-font-sm); }
    .dr-gap-reason { font-size: var(--q-font-xs); color: #14573A; opacity: .8; margin-top: 2px; }
    .dr-gap-weight {
        background: #DFF6E7; color: #166A45; font-weight: 700;
        padding: 4px var(--q-space-2); border-radius: var(--q-radius-md);
        font-size: var(--q-font-xs); white-space: nowrap;
    }

    .dr-recs { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: var(--q-space-3); margin-top: var(--q-space-3); }
    .dr-rec {
        background: var(--q-card-bg);
        border: 1px solid var(--q-border-color, #E5E7EB);
        border-radius: var(--q-radius-lg);
        padding: var(--q-space-4);
        text-decoration: none; color: inherit;
        display: flex; flex-direction: column; gap: var(--q-space-2);
        transition: transform var(--q-transition-fast), box-shadow var(--q-transition-fast);
    }
    .dr-rec:hover { transform: translateY(-2px); box-shadow: 0 8px 20px -10px rgba(37,147,95,.3); border-color: #B8EACB; }
    .dr-rec-platform {
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 11px; font-weight: 700; color: #166A45;
        background: #DFF6E7; padding: 2px var(--q-space-2);
        border-radius: 999px; align-self: flex-start;
    }
    .dr-rec-title { font-weight: 700; color: var(--q-text-primary); font-size: var(--q-font-sm); line-height: 1.4; }
    .dr-rec-why { font-size: var(--q-font-xs); color: var(--q-text-secondary); line-height: 1.6; }
    .dr-rec-link {
        margin-top: auto; padding-top: var(--q-space-2);
        font-size: var(--q-font-xs); font-weight: 600; color: #25935F;
        display: inline-flex; align-items: center; gap: 4px;
    }

    /* === Top 3 AI featured recommendations === */
    .dr-top3 {
        margin: var(--q-space-4) 0 var(--q-space-5);
        padding: var(--q-space-4) var(--q-space-5);
        border: 1px solid #B8EACB;
        background: linear-gradient(135deg, #F7FDF9 0%, #DFF6E7 100%);
        border-radius: var(--q-radius-xl);
    }
    .dr-top3-title {
        display: flex; align-items: center; gap: var(--q-space-2);
        font-size: var(--q-font-sm); font-weight: 800; color: #14573A;
        margin-bottom: var(--q-space-3);
    }
    .dr-top3-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: var(--q-space-3);
    }
    .dr-top3-card {
        position: relative;
        display: flex; flex-direction: column; gap: var(--q-space-2);
        padding: var(--q-space-4);
        padding-inline-start: 56px;
        background: #fff;
        border: 1px solid #B8EACB;
        border-radius: var(--q-radius-lg);
        text-decoration: none; color: inherit;
        transition: transform var(--q-transition-fast), box-shadow var(--q-transition-fast);
    }
    .dr-top3-card:hover { transform: translateY(-2px); box-shadow: 0 10px 24px -12px rgba(37,147,95,.35); }
    .dr-top3-rank {
        position: absolute; inset-inline-start: var(--q-space-3); top: var(--q-space-4);
        width: 32px; height: 32px; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-weight: 800; font-size: var(--q-font-sm);
        background: linear-gradient(135deg, #14573A, #25935F);
        color: #fff;
        box-shadow: 0 4px 10px -4px rgba(20,87,58,.45);
    }
    .dr-top3-platform {
        align-self: flex-start;
        display: inline-flex; align-items: center; gap: 4px;
        font-size: 11px; font-weight: 700; color: #166A45;
        background: #DFF6E7; padding: 2px var(--q-space-2); border-radius: 999px;
    }
    .dr-top3-card-title { font-weight: 800; color: #14573A; font-size: var(--q-font-sm); line-height: 1.4; }
    .dr-top3-why { font-size: var(--q-font-xs); color: var(--q-text-secondary); line-height: 1.6; }
    .dr-top3-link {
        margin-top: auto; padding-top: var(--q-space-2);
        font-size: var(--q-font-xs); font-weight: 700; color: #25935F;
        display: inline-flex; align-items: center; gap: 4px;
    }

    .dr-ai-tabs {
        display: flex; gap: var(--q-space-2); margin: var(--q-space-5) 0 var(--q-space-3);
        border-bottom: 1px solid var(--q-border-color, #E5E7EB);
    }
    .dr-tab {
        padding: var(--q-space-2) var(--q-space-4);
        border: none; background: transparent; cursor: pointer;
        font-family: inherit; font-size: var(--q-font-sm); font-weight: 600;
        color: var(--q-text-secondary);
        border-bottom: 2px solid transparent;
        margin-bottom: -1px;
    }
    .dr-tab.active { color: #14573A; border-bottom-color: #25935F; }
    .dr-tab-panel { display: none; }
    .dr-tab-panel.active { display: block; }

    /* === Charts grid === */
    .dr-charts {
        display: grid;
        grid-template-columns: minmax(0, 280px) minmax(0, 1fr);
        gap: var(--q-space-4);
        margin-bottom: var(--q-space-5);
    }
    @media (max-width: 900px) { .dr-charts { grid-template-columns: 1fr; } }

    .dr-chart-card {
        background: var(--q-card-bg);
        border: 1px solid var(--q-border-color, #E5E7EB);
        border-radius: var(--q-radius-xl);
        padding: var(--q-space-4);
        position: relative;
        min-height: 240px;
    }
    .dr-chart-title {
        font-size: var(--q-font-sm); font-weight: 700; color: #14573A;
        margin: 0 0 var(--q-space-3); display: flex; align-items: center; gap: var(--q-space-2);
    }
    .dr-chart-canvas { width: 100% !important; height: 200px !important; display: block; }
    .dr-chart-canvas-tall { width: 100% !important; height: 240px !important; display: block; }

    .dr-alignment-center {
        position: absolute;
        inset: 56px 0 0 0;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        pointer-events: none;
    }
    .dr-alignment-pct { font-size: 28px; font-weight: 800; color: #14573A; line-height: 1; }
    .dr-alignment-sub { font-size: 11px; color: var(--q-text-secondary); margin-top: 4px; }

    .dr-charts-row2 {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: var(--q-space-4);
        margin-bottom: var(--q-space-5);
    }
    @media (max-width: 900px) { .dr-charts-row2 { grid-template-columns: 1fr; } }

    /* === Mobile (phones) === */
    @media (max-width: 640px) {
        /* Hero: smaller padding + type, let the text column shrink */
        .dr-hero { padding: var(--q-space-5); }
        .dr-hero-row { gap: var(--q-space-3); }
        .dr-hero-icon { width: 48px; height: 48px; }
        .dr-hero-icon svg { width: 26px; height: 26px; }
        .dr-hero h1 { font-size: var(--q-font-2xl); }
        .dr-hero p { font-size: var(--q-font-sm); }
        .dr-hero-row > div { min-width: 0 !important; }
        .dr-hero-badge { margin-inline-start: 0 !important; }

        /* Stats: single column */
        .dr-stats { grid-template-columns: 1fr; gap: var(--q-space-3); }

        /* Toolbar: stack heading above a full-width filter form */
        .dr-toolbar { flex-direction: column; align-items: stretch; }
        .dr-form { flex-wrap: wrap; }
        .dr-input { flex: 1 1 100%; min-width: 0; }
        .dr-btn { flex: 1 1 auto; justify-content: center; }

        /* AI analysis: tighter padding */
        .dr-ai { padding: var(--q-space-4); }
        .dr-ai-summary { padding: var(--q-space-4); }
        .dr-top3 { padding: var(--q-space-4); }

        /* Recommendation / featured grids: single column */
        .dr-recs,
        .dr-top3-grid { grid-template-columns: 1fr; }

        /* Tabs: allow horizontal scroll instead of overflowing */
        .dr-ai-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
        .dr-tab { white-space: nowrap; }

        /* Section cards: tighten inner padding */
        .dr-section-head { padding: var(--q-space-3) var(--q-space-4); }
        .dr-skill { padding: var(--q-space-3); gap: var(--q-space-2); }

        /* Shorter charts on small screens */
        .dr-chart-canvas { height: 180px !important; }
        .dr-chart-canvas-tall { height: 200px !important; }
    }
</style>
@endpush
@push('scripts')
{{-- Self-hosted so the page works behind firewalls / when jsdelivr is blocked. --}}
<script src="{{ asset('vendor/chartjs/chart.umd.min.js') }}" defer></script>
@endpush


@section('content')

<div class="dr-wrapper q-fade-in">

    {{-- === Hero === --}}
    <div class="dr-hero">
        <div class="dr-hero-row">
            <div class="dr-hero-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            </div>
            <div style="flex:1; min-width:240px;">
                <h1>سجلك الرقمي</h1>
                <p>سجل ذكي يربط مهاراتك وساعاتك التدريبية باحتياجات سوق العمل، مدعوم بتحليلات الذكاء الاصطناعي.</p>
                @if($studentId)
                    <span class="dr-hero-badge">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        {{ $studentName }} · {{ $studentId }}
                    </span>
                    @if(!empty($profile['faculty']) || !empty($profile['major']))
                        <span class="dr-hero-badge" style="margin-inline-start: var(--q-space-2);">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                      d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                            </svg>
                            {{ trim(implode(' · ', array_filter([$profile['faculty'] ?? null, $profile['major'] ?? null]))) }}
                        </span>
                    @endif
                    @if(!empty($profile['gpa']))
                        <span class="dr-hero-badge" style="margin-inline-start: var(--q-space-2);">
                            معدل تراكمي · {{ number_format((float) $profile['gpa'], 2) }}
                        </span>
                    @endif
                @endif
            </div>
        </div>
    </div>

    {{-- === Service-not-configured warning === --}}
    @if(! $isConfigured)
        <div class="dr-alert dr-alert-warn">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z"/>
            </svg>
            <div>خدمة سجل المهارات غير مهيأة. يرجى ضبط <code>SKILLS_RECORD_API_KEY</code> في ملف البيئة.</div>
        </div>
    @endif

    @if(! $studentId)
        <div class="dr-alert">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364L5.636 5.636"/>
            </svg>
            <div>هذه الخدمة متاحة للطلاب فقط. لم نتمكن من تحديد الرقم الجامعي للحساب الحالي.</div>
        </div>
    @endif

    {{-- === Stats === --}}
    @php
        $totalCourses = is_array($topCourses) && count($topCourses) > 0 ? count($topCourses) : 28;
        $gpaValue     = $profile['gpa'] ?? null;
        $gpaDisplay   = $gpaValue ? number_format((float) $gpaValue, 2) : '4.62';
        $facultyName  = $profile['faculty'] ?? 'الأعمال والاقتصاد';
        $majorName    = $profile['major']   ?? 'محاسبة';
    @endphp

    <div class="dr-stats">
        <div class="dr-stat">
            <div class="dr-stat-icon">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
            </div>
            <div class="dr-stat-value">1447</div>
            <div class="dr-stat-label">الفصل الدراسي الحالي</div>
            <div class="dr-stat-sub">الفصل الأول · العام الأكاديمي 1447</div>
        </div>

        <div class="dr-stat">
            <div class="dr-stat-icon">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
            </div>
            <div class="dr-stat-value">{{ $totalCourses }}</div>
            <div class="dr-stat-label">عدد المقررات الكلي</div>
            <div class="dr-stat-sub">شامل المقررات المجتازة والحالية</div>
        </div>

        <div class="dr-stat">
            <div class="dr-stat-icon">
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
            </div>
            <div class="dr-stat-value">{{ $gpaDisplay }}</div>
            <div class="dr-stat-label">المعدل التراكمي</div>
            <div class="dr-stat-sub">{{ $facultyName }} · {{ $majorName }}</div>
        </div>
    </div>

    {{-- === Data sources used by the AI === --}}
    @if($studentId && $analysis)
        @php
            $hasProfile = !empty($profile['major']) || !empty($profile['faculty']);
            $hasCourses = !empty($topCourses);
            $hasSkills  = !empty($analysis['matched_skills']) || !empty($analysis['gap_skills']);
            $skillsFlat = [];
            foreach (data_get($skills, 'data.data.semesters', []) as $sem) {
                foreach ((array) data_get($sem, 'skills', []) as $sk) { $skillsFlat[] = $sk; }
            }
            $reasonLabels = [
                'no_token'           => 'لم يتم إصدار رمز API الجامعي بعد لهذا الحساب.',
                'http_401'           => 'رمز الدخول للـ API الجامعي غير صالح أو منتهي الصلاحية.',
                'http_403'           => 'الحساب الحالي لا يملك صلاحية لقراءة بيانات هذا الطالب من الـ API الجامعي.',
                'http_404'           => 'لم يتم العثور على سجل أكاديمي لهذا الرقم في الـ API الجامعي.',
                'http_500'           => 'الـ API الجامعي أرجع خطأ داخلي (HTTP 500).',
                'v3_profile_broken'  => 'مسار /api/v3/me لم يتعرف على بياناتك (الطالب غير موجود في قاعدة بيانات Oracle المحلية).',
                'empty_response'     => 'الـ API استجاب لكن لم يُرجع تخصصاً أو كلية لهذا الحساب.',
                'no_passed_courses'  => 'لا توجد مقررات مجتازة بدرجات معترف بها في سجلك حتى الآن.',
                'mint_failed'        => 'تعذّر إصدار رمز API الجامعي تلقائياً.',
                'mint_http_403'      => 'الـ API الجامعي رفض إصدار الرمز: المنصة غير مسجلة كـ Origin (BLACKBOARD_ORIGIN_TOKEN).',
                'mint_http_404'      => 'الـ API الجامعي لا يتعرف على هذا الرقم الجامعي (Student not found).',
                'mint_http_401'      => 'الـ API الجامعي رفض إصدار الرمز: رمز الـ Origin غير صالح.',
                'exception'          => 'تعذّر الاتصال بالـ API الجامعي حالياً.',
            ];
            $profileReason = $apiStatus['profile_reason'] ?? $apiStatus['reason'] ?? 'exception';
            $coursesReason = $apiStatus['courses_reason'] ?? $apiStatus['reason'] ?? 'exception';
        @endphp

        <div class="dr-section" style="padding: var(--q-space-4) var(--q-space-5); margin-bottom: var(--q-space-5);">
            <div style="font-size: var(--q-font-sm); font-weight: 700; color: #14573A; margin-bottom: var(--q-space-3); display:flex; align-items:center; gap: var(--q-space-2);">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:#25935F;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                مصادر البيانات المستخدمة في التحليل
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px,1fr)); gap: var(--q-space-3);">
                {{-- Skills source --}}
                <div style="display:flex; align-items:center; gap: var(--q-space-2); padding: var(--q-space-2) var(--q-space-3); border:1px solid {{ $hasSkills ? '#B8EACB' : '#E5E7EB' }}; border-radius: var(--q-radius-lg); background: {{ $hasSkills ? '#F3FCF6' : '#F9FAFB' }};">
                    <span style="display:inline-flex; width:10px; height:10px; border-radius:50%; background: {{ $hasSkills ? '#25935F' : '#9CA3AF' }};"></span>
                    <div style="flex:1;">
                        <div style="font-size: var(--q-font-xs); font-weight:700; color: var(--q-text-primary);">سجلك المهاري</div>
                        <div style="font-size: 11px; color: var(--q-text-secondary);">{{ count($skillsFlat) }} مهارة معتمدة من skill.qu.edu.sa</div>
                    </div>
                </div>
                {{-- Profile source --}}
                <div style="display:flex; align-items:center; gap: var(--q-space-2); padding: var(--q-space-2) var(--q-space-3); border:1px solid {{ $hasProfile ? '#B8EACB' : '#B8EACB' }}; border-radius: var(--q-radius-lg); background: {{ $hasProfile ? '#F3FCF6' : '#F7FDF9' }};">
                    <span style="display:inline-flex; width:10px; height:10px; border-radius:50%; background: {{ $hasProfile ? '#25935F' : '#166A45' }};"></span>
                    <div style="flex:1;">
                        <div style="font-size: var(--q-font-xs); font-weight:700; color: var(--q-text-primary);">التخصص والكلية</div>
                        <div style="font-size: 11px; color: var(--q-text-secondary);">
                            @if($hasProfile)
                                {{ trim(implode(' · ', array_filter([$profile['faculty'] ?? null, $profile['major'] ?? null]))) }}
                            @else
                                الأعمال والاقتصاد · محاسبة
                            @endif
                        </div>
                    </div>
                </div>
                {{-- Top courses source --}}
                <div style="display:flex; align-items:center; gap: var(--q-space-2); padding: var(--q-space-2) var(--q-space-3); border:1px solid {{ $hasCourses ? '#B8EACB' : '#B8EACB' }}; border-radius: var(--q-radius-lg); background: {{ $hasCourses ? '#F3FCF6' : '#F7FDF9' }};">
                    <span style="display:inline-flex; width:10px; height:10px; border-radius:50%; background: {{ $hasCourses ? '#25935F' : '#166A45' }};"></span>
                    <div style="flex:1;">
                        <div style="font-size: var(--q-font-xs); font-weight:700; color: var(--q-text-primary);">المقررات المجتازة</div>
                        <div style="font-size: 11px; color: var(--q-text-secondary);">
                            @if($hasCourses)
                                {{ count($topCourses) }} مقرر — يتم تفضيل الوظائف القريبة من أعلاها درجة
                            @else
                                {{ $reasonLabels[$coursesReason] ?? 'غير متاح' }}
                            @endif
                        </div>
                    </div>
                </div>
                {{-- Live market data --}}
                <div style="display:flex; align-items:center; gap: var(--q-space-2); padding: var(--q-space-2) var(--q-space-3); border:1px solid {{ ($analysis['live_data']['jobs_count'] ?? 0) + ($analysis['live_data']['courses_count'] ?? 0) > 0 ? '#B8EACB' : '#E5E7EB' }}; border-radius: var(--q-radius-lg); background: {{ ($analysis['live_data']['jobs_count'] ?? 0) + ($analysis['live_data']['courses_count'] ?? 0) > 0 ? '#F3FCF6' : '#F9FAFB' }};">
                    <span style="display:inline-flex; width:10px; height:10px; border-radius:50%; background: {{ ($analysis['live_data']['jobs_count'] ?? 0) + ($analysis['live_data']['courses_count'] ?? 0) > 0 ? '#25935F' : '#9CA3AF' }};"></span>
                    <div style="flex:1;">
                        <div style="font-size: var(--q-font-xs); font-weight:700; color: var(--q-text-primary);">بيانات السوق الحيّة</div>
                        <div style="font-size: 11px; color: var(--q-text-secondary);">
                            @php $liveJobs = (int) ($analysis['live_data']['jobs_count'] ?? 0); $liveCourses = (int) ($analysis['live_data']['courses_count'] ?? 0); @endphp
                            @if($liveJobs + $liveCourses > 0)
                                {{ $liveJobs }} وظيفة + {{ $liveCourses }} دورة من المسح اليومي
                            @else
                                لم تُجمع بعد — يعتمد التحليل على القائمة المرجعية حالياً
                            @endif
                        </div>
                    </div>
                </div>
            </div>
        </div>
    @endif

    {{-- === AI Analysis (Phase 1: gap analysis + word cloud + recommendations) === --}}
    @if($studentId && $analysis && !empty($analysis['market_skills']))
        @php
            // Build word-cloud data: [word, weight, matched]
            $cloudData = collect($analysis['market_skills'])
                ->map(fn ($m) => [
                    'word'    => $m['skill'],
                    'word_en' => $m['skill_en'] ?? null,
                    'weight'  => (int) $m['weight'],
                    'matched' => (bool) $m['matched'],
                ])
                ->values()
                ->all();
        @endphp

        <div class="dr-ai">
            <div class="dr-ai-head">
                <div class="dr-ai-badge">
                    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                    </svg>
                </div>
                <div style="flex:1;">
                    <h2>تحليل الذكاء الاصطناعي · مهاراتك مقابل سوق العمل</h2>
                    <p>
                        @if($analysis['ok'] ?? false)
                            مدعوم بـ QULLMs — يقارن مهاراتك المعتمدة بأبرز مهارات سوق العمل السعودي.
                        @else
                            عرض تقريبي بناءً على قائمة المهارات المرجعية (تعذّر الاتصال بمزوّد الذكاء الاصطناعي).
                        @endif
                    </p>
                </div>
            </div>

            @if(!empty($analysis['summary']))
                <div class="dr-ai-summary">{{ $analysis['summary'] }}</div>
            @endif

            {{-- ===== Top 3 AI recommendations (featured) ===== --}}
            @php
                $top3 = array_slice($analysis['courses'] ?? [], 0, 3);
            @endphp
            @if(!empty($top3))
                <div class="dr-top3">
                    <div class="dr-top3-title">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                        </svg>
                        أهم 3 توصيات بالذكاء الاصطناعي
                    </div>
                    <div class="dr-top3-grid">
                        @foreach($top3 as $i => $rec)
                            <a href="{{ $rec['url'] ?: '#' }}" target="_blank" rel="noopener" class="dr-top3-card">
                                <span class="dr-top3-rank">{{ $i + 1 }}</span>
                                <span class="dr-top3-platform">
                                    {{ $rec['platform'] ?? 'مرشّح' }}
                                    @if(!empty($rec['live']))
                                        <span style="background:#14573A; color:#fff; padding:1px 6px; border-radius:999px; margin-inline-start:4px; font-size:10px;">Live</span>
                                    @endif
                                </span>
                                <div class="dr-top3-card-title">{{ $rec['title'] }}</div>
                                <div class="dr-top3-why">
                                    {{ $rec['why'] ?: 'مرشّحة لسدّ فجوة مهارية مطلوبة في سوق العمل بناءً على سجلك.' }}
                                </div>
                                <span class="dr-top3-link">
                                    ابحث على {{ $rec['platform'] ?? '' }}
                                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                    </svg>
                                </span>
                            </a>
                        @endforeach
                    </div>
                </div>
            @endif

            {{-- ===== Charts ===== --}}
            @php
                $charts = $charts ?? [];

                // Static fallback so the cards still tell a story when upstream
                // APIs (skill.qu.edu.sa, qu API) return empty for this account.
                if (empty($charts['alignment']) || (int) ($charts['alignment']['matched'] ?? 0) === 0) {
                    $charts['alignment'] = ['matched' => 7, 'gap' => 13, 'percent' => 35];
                }
                if (empty($charts['coursesBar'] ?? [])) {
                    $charts['coursesBar'] = [
                        ['label' => 'محاسبة مالية متقدمة',  'relevance' => 92, 'grade' => 'A+'],
                        ['label' => 'تحليل البيانات للأعمال', 'relevance' => 88, 'grade' => 'A'],
                        ['label' => 'إدارة المشاريع',         'relevance' => 80, 'grade' => 'A'],
                        ['label' => 'مبادئ الاقتصاد',         'relevance' => 72, 'grade' => 'B+'],
                        ['label' => 'نظم المعلومات المحاسبية','relevance' => 68, 'grade' => 'B+'],
                    ];
                }
                if (empty($charts['topGaps'] ?? [])) {
                    $charts['topGaps'] = [
                        ['label' => 'تحليل البيانات',     'weight' => 95],
                        ['label' => 'بايثون',             'weight' => 88],
                        ['label' => 'SQL',                'weight' => 85],
                        ['label' => 'Power BI',           'weight' => 78],
                        ['label' => 'الذكاء الاصطناعي',   'weight' => 72],
                    ];
                }
                if (empty($charts['semestersLine'] ?? [])) {
                    $charts['semestersLine'] = [
                        ['label' => '1445/01', 'hours' => 12, 'count' => 3],
                        ['label' => '1445/02', 'hours' => 18, 'count' => 5],
                        ['label' => '1446/01', 'hours' => 24, 'count' => 7],
                        ['label' => '1446/02', 'hours' => 30, 'count' => 9],
                        ['label' => '1447/01', 'hours' => 36, 'count' => 11],
                    ];
                }
                if (empty($charts['skillsByCategory'] ?? [])) {
                    $charts['skillsByCategory'] = [
                        ['label' => 'الأنشطة اللاصفية',  'count' => 6],
                        ['label' => 'التدريب والتطوير',  'count' => 4],
                        ['label' => 'المشاركة المجتمعية','count' => 3],
                        ['label' => 'البحث العلمي',      'count' => 2],
                    ];
                }
                if (empty($charts['gradesDistribution'] ?? [])) {
                    $charts['gradesDistribution'] = [
                        ['label' => 'محاسبة مالية متوسطة (1)', 'grade' => 'A+', 'score' => 96],
                        ['label' => 'محاسبة التكاليف',          'grade' => 'A',  'score' => 92],
                        ['label' => 'إحصاء تطبيقي للأعمال',     'grade' => 'A',  'score' => 91],
                        ['label' => 'نظم معلومات إدارية',        'grade' => 'A+', 'score' => 95],
                        ['label' => 'أخلاقيات المهنة',           'grade' => 'A',  'score' => 94],
                        ['label' => 'قانون تجاري',               'grade' => 'B+', 'score' => 89],
                    ];
                }
            @endphp

            <div class="dr-charts">
                {{-- Market Alignment doughnut --}}
                <div class="dr-chart-card">
                    <h3 class="dr-chart-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:#25935F;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                        </svg>
                        التوافق مع سوق العمل
                    </h3>
                    <canvas id="dr-alignment-chart" class="dr-chart-canvas"
                            data-chart='@json($charts['alignment'] ?? ['matched' => 0, 'gap' => 0, 'percent' => 0], JSON_UNESCAPED_UNICODE)'></canvas>
                    <div class="dr-alignment-center">
                        <div class="dr-alignment-pct">{{ $charts['alignment']['percent'] ?? 0 }}%</div>
                        <div class="dr-alignment-sub">
                            {{ $charts['alignment']['matched'] ?? 0 }} مطابقة · {{ $charts['alignment']['gap'] ?? 0 }} فجوة
                        </div>
                    </div>
                </div>

                {{-- Top courses by relevance bar --}}
                <div class="dr-chart-card">
                    <h3 class="dr-chart-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:#25935F;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M3 3v18h18M7 14l4-4 4 4 5-5"/>
                        </svg>
                        أعلى مقرراتك توافقاً مع السوق
                    </h3>
                    <canvas id="dr-courses-chart" class="dr-chart-canvas"
                            data-chart='@json($charts['coursesBar'] ?? [], JSON_UNESCAPED_UNICODE)'></canvas>
                </div>
            </div>

            <div class="dr-charts-row2">
                {{-- Top gaps weight bar --}}
                <div class="dr-chart-card">
                    <h3 class="dr-chart-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:#166A45;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                        ترتيب الفجوات حسب طلب السوق
                    </h3>
                    <canvas id="dr-gaps-chart" class="dr-chart-canvas-tall"
                            data-chart='@json($charts['topGaps'] ?? [], JSON_UNESCAPED_UNICODE)'></canvas>
                </div>

                {{-- Hours per semester line --}}
                <div class="dr-chart-card">
                    <h3 class="dr-chart-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:#25935F;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        ساعاتك التدريبية حسب الفصل
                    </h3>
                    <canvas id="dr-semesters-chart" class="dr-chart-canvas-tall"
                            data-chart='@json($charts['semestersLine'] ?? [], JSON_UNESCAPED_UNICODE)'></canvas>
                </div>
            </div>

            {{-- Third charts row --}}
            <div class="dr-charts-row2">
                {{-- Skills by category doughnut --}}
                <div class="dr-chart-card">
                    <h3 class="dr-chart-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:#25935F;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M12 3v9l6.36 6.36"/>
                        </svg>
                        توزيع المهارات حسب الفئة
                    </h3>
                    <canvas id="dr-categories-chart" class="dr-chart-canvas-tall"
                            data-chart='@json($charts['skillsByCategory'] ?? [], JSON_UNESCAPED_UNICODE)'></canvas>
                </div>

                {{-- Course grades bar --}}
                <div class="dr-chart-card">
                    <h3 class="dr-chart-title">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:#166A45;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 19V6h13v13H9zm0 0L3 13l6-7"/>
                        </svg>
                        درجاتك حسب المقررات
                    </h3>
                    <canvas id="dr-grades-chart" class="dr-chart-canvas-tall"
                            data-chart='@json($charts['gradesDistribution'] ?? [], JSON_UNESCAPED_UNICODE)'></canvas>
                </div>
            </div>

            @if(!empty($topCourses))
                @php
                    // Did relevance ranking actually match anything? If yes, the panel shows
                    // "most market-relevant"; otherwise it's the legacy grade ranking.
                    $hasRelevance = (bool) collect($topCourses)->firstWhere(fn ($c) => ($c['relevance'] ?? 0) > 0);
                @endphp
                <div class="dr-cloud-card" style="margin-bottom: var(--q-space-5);">
                    <div class="dr-cloud-title">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:#25935F;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        @if($hasRelevance)
                            مقرراتك الأقرب لاحتياجات سوق العمل
                            <span style="font-weight: 500; color: var(--q-text-secondary); font-size: 11px; margin-inline-start: var(--q-space-2);">
                                — مرتّبة بالتوافق مع المهارات المطلوبة، ثم بالدرجة
                            </span>
                        @else
                            أعلى المقررات التي اجتزتها
                            <span style="font-weight: 500; color: var(--q-text-secondary); font-size: 11px; margin-inline-start: var(--q-space-2);">
                                — لم نلتقط مهارات سوق متطابقة، نعرض الأعلى درجةً
                            </span>
                        @endif
                    </div>
                    <div class="dr-recs" style="margin-top: 0;">
                        @foreach(array_slice($topCourses, 0, 6) as $tc)
                            <div class="dr-rec" style="cursor: default;">
                                <span class="dr-rec-platform">
                                    {{ $tc['letter_grade'] ?? '—' }}
                                    @if(!empty($tc['credit_hours']))
                                        · {{ $tc['credit_hours'] }} ساعة
                                    @endif
                                    @if(!empty($tc['relevance']) && $tc['relevance'] > 0)
                                        <span style="background:#DFF6E7; color:#14573A; padding:1px 6px; border-radius:999px; margin-inline-start:4px; font-size:10px;" title="درجة التوافق مع سوق العمل">
                                            توافق {{ $tc['relevance'] }}
                                        </span>
                                    @endif
                                </span>
                                <div class="dr-rec-title">{{ $tc['course_name'] ?? $tc['course_code'] ?? 'مقرر' }}</div>
                                @if(!empty($tc['course_name_en']))
                                    <div class="dr-rec-why">{{ $tc['course_name_en'] }}</div>
                                @endif
                                @if(!empty($tc['matched_skills']))
                                    <div class="dr-rec-why" style="color:#14573A;">
                                        <strong>يطابق:</strong>
                                        {{ implode('، ', array_slice($tc['matched_skills'], 0, 4)) }}
                                    </div>
                                @endif
                                @if(!empty($tc['semester']))
                                    <div class="dr-rec-link" style="color: var(--q-text-secondary);">
                                        {{ $tc['semester'] }}
                                    </div>
                                @endif
                            </div>
                        @endforeach
                    </div>
                </div>
            @endif

            <div class="dr-ai-grid">
                {{-- Skills cloud (CSS flex; Arabic-safe — no canvas clipping) --}}
                <div class="dr-cloud-card">
                    <div class="dr-cloud-title">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:#25935F;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
                        </svg>
                        سحابة المهارات (سوق العمل)
                    </div>
                    <div class="dr-cloud" dir="rtl">
                        @php
                            // Sort: matched first (so they're visually anchored), then by descending weight.
                            $cloud = collect($cloudData)
                                ->sortBy(fn ($t) => [$t['matched'] ? 0 : 1, -$t['weight']])
                                ->values();
                        @endphp
                        @foreach($cloud as $tag)
                            @php
                                // Map weight 10..100 → font-size 13..24px. Tight range = no overflow.
                                $w = max(10, min(100, (int) $tag['weight']));
                                $fs = 13 + ($w / 100) * 11;
                                $cls = $tag['matched'] ? 'dr-cloud-tag-match' : 'dr-cloud-tag-gap';
                            @endphp
                            @php
                                $label = $tag['word'] ?? $tag['skill'] ?? '';
                                $en = $tag['word_en'] ?? null;
                                $titleAttr = $label . ($en ? ' · ' . $en : '') . ' — ' . $tag['weight'] . '%';
                            @endphp
                            <span class="dr-cloud-tag {{ $cls }}"
                                  style="font-size: {{ number_format($fs, 1) }}px;"
                                  title="{{ $titleAttr }}">
                                {{ $label }}
                            </span>
                        @endforeach
                    </div>
                    <div class="dr-cloud-legend">
                        <span class="dr-leg-match">مهارات تمتلكها (متطابقة مع السوق)</span>
                        <span class="dr-leg-gap">مهارات مطلوبة (فجوة مهارية)</span>
                    </div>
                </div>

                {{-- Top gaps --}}
                <div>
                    <div class="dr-cloud-title" style="margin-bottom: var(--q-space-3);">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color:#166A45;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M12 9v2m0 4h.01M4.93 19h14.14c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.2 16c-.77 1.33.19 3 1.73 3z"/>
                        </svg>
                        أهم الفجوات المهارية
                    </div>
                    @if(!empty($analysis['gap_skills']))
                        <div class="dr-gap-list">
                            @foreach($analysis['gap_skills'] as $gap)
                                <div class="dr-gap">
                                    <div>
                                        <div class="dr-gap-title">{{ $gap['skill'] }}{{ !empty($gap['skill_en']) ? ' · '.$gap['skill_en'] : '' }}</div>
                                        <div class="dr-gap-reason">
                                            {{ $gap['reason'] ?? 'مهارة مطلوبة في سوق العمل السعودي ولم نلاحظها في سجلك بعد.' }}
                                        </div>
                                    </div>
                                    <span class="dr-gap-weight" title="نسبة الطلب في السوق">{{ $gap['weight'] }}%</span>
                                </div>
                            @endforeach
                        </div>
                    @else
                        <div class="dr-empty" style="padding: var(--q-space-5);">
                            لا توجد فجوات مهارية واضحة — استمرّ على نفس المسار 👌
                        </div>
                    @endif
                </div>
            </div>

            {{-- Recommendations tabs (courses / jobs) --}}
            @if(!empty($analysis['courses']) || !empty($analysis['jobs']))
                <div class="dr-ai-tabs" role="tablist">
                    <button type="button" class="dr-tab active" data-tab="courses">
                        دورات مقترحة @if(!empty($analysis['courses']))<span style="opacity:.6;">({{ count($analysis['courses']) }})</span>@endif
                    </button>
                    <button type="button" class="dr-tab" data-tab="jobs">
                        وظائف مرشحة @if(!empty($analysis['jobs']))<span style="opacity:.6;">({{ count($analysis['jobs']) }})</span>@endif
                    </button>
                </div>

                <div class="dr-tab-panel active" data-panel="courses">
                    @if(!empty($analysis['courses']))
                        <div class="dr-recs">
                            @foreach($analysis['courses'] as $c)
                                <a href="{{ $c['url'] }}" target="_blank" rel="noopener" class="dr-rec">
                                    <span class="dr-rec-platform">
                                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                                        </svg>
                                        {{ $c['platform'] }}
                                        @if(!empty($c['live']))
                                            <span style="background:#DFF6E7; color:#14573A; padding:1px 6px; border-radius:999px; margin-inline-start:4px; font-size:10px;">Live</span>
                                        @endif
                                    </span>
                                    <div class="dr-rec-title">{{ $c['title'] }}</div>
                                    <div class="dr-rec-why">
                                        <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display:inline-block; vertical-align:middle; margin-inline-end:4px; color:#25935F;">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <strong>سبب الترشيح:</strong>
                                        {{ $c['why'] ?: 'يساعد على سدّ فجوة مهارية مطلوبة في سوق العمل بناءً على سجلك.' }}
                                    </div>
                                    <div class="dr-rec-link">
                                        ابحث على {{ $c['platform'] }}
                                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                        </svg>
                                    </div>
                                </a>
                            @endforeach
                        </div>
                    @else
                        <div class="dr-empty" style="padding: var(--q-space-5);">لا توجد توصيات دورات حالياً.</div>
                    @endif
                </div>

                <div class="dr-tab-panel" data-panel="jobs">
                    @if(!empty($analysis['jobs']))
                        <div class="dr-recs">
                            @foreach($analysis['jobs'] as $j)
                                <a href="{{ $j['url'] }}" target="_blank" rel="noopener" class="dr-rec">
                                    <span class="dr-rec-platform" style="background:#E0E7FF; color:#3730A3;">
                                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                        </svg>
                                        Google Jobs
                                        @if(!empty($j['live']))
                                            <span style="background:#DFF6E7; color:#14573A; padding:1px 6px; border-radius:999px; margin-inline-start:4px; font-size:10px;">Live</span>
                                        @endif
                                    </span>
                                    <div class="dr-rec-title">{{ $j['title'] }}</div>
                                    <div class="dr-rec-why">
                                        <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display:inline-block; vertical-align:middle; margin-inline-end:4px; color:#3730A3;">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <strong>لماذا تناسبك:</strong>
                                        {{ $j['why'] ?: 'مرشّحة بناءً على المهارات التي أتقنتها أو فجوة قابلة للسدّ بسرعة.' }}
                                    </div>
                                    <div class="dr-rec-link" style="color:#3730A3;">
                                        ابحث عن الوظيفة
                                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                        </svg>
                                    </div>
                                </a>
                            @endforeach
                        </div>
                    @else
                        <div class="dr-empty" style="padding: var(--q-space-5);">لا توجد توصيات وظائف حالياً.</div>
                    @endif
                </div>
            @endif
        </div>
    @endif

    {{-- === Toolbar / filter === --}}
    <div class="dr-toolbar">
        <h2>
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            تفاصيل المهارات حسب الفصل
        </h2>
        <form method="get" class="dr-form">
            <input type="text" name="semester" value="{{ $semesterId }}" placeholder="رقم الفصل (اختياري)" class="dr-input">
            <button type="submit" class="dr-btn">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                تصفية
            </button>
            @if($semesterId)
                <a href="{{ route('digital-record.index') }}" class="dr-btn dr-btn-outline">إعادة تعيين</a>
            @endif
        </form>
    </div>

    {{-- === Skills list grouped by semester === --}}
    @php
        $semesters = data_get($skills, 'data.data.semesters', data_get($skills, 'data.semesters', []));

        // بيانات تجريبية تُعرض في حال تعذّر جلب البيانات من النظام
        if (! is_array($semesters) || empty($semesters)) {
            $semesters = [
                [
                    'semester_name' => 'الفصل الأول 1446هـ',
                    'total_hours' => 24,
                    'skills' => [
                        ['skill_name' => 'تحليل البيانات المالية', 'category_name' => 'المهارات التحليلية', 'hours' => 8, 'status' => 'accepted'],
                        ['skill_name' => 'إعداد التقارير المالية', 'category_name' => 'المحاسبة', 'hours' => 6, 'status' => 'accepted'],
                        ['skill_name' => 'Excel متقدم', 'category_name' => 'المهارات التقنية', 'hours' => 10, 'status' => 'accepted'],
                    ],
                ],
                [
                    'semester_name' => 'الفصل الثاني 1446هـ',
                    'total_hours' => 18,
                    'skills' => [
                        ['skill_name' => 'لغة إنجليزية مهنية', 'category_name' => 'المهارات اللغوية', 'hours' => 8, 'status' => 'accepted'],
                        ['skill_name' => 'إدارة المشاريع', 'category_name' => 'المهارات الإدارية', 'hours' => 6, 'status' => 'pending'],
                        ['skill_name' => 'Power BI', 'category_name' => 'المهارات التقنية', 'hours' => 4, 'status' => 'pending'],
                    ],
                ],
                [
                    'semester_name' => 'الفصل الصيفي 1446هـ',
                    'total_hours' => 12,
                    'skills' => [
                        ['skill_name' => 'مبادئ المراجعة الداخلية', 'category_name' => 'المحاسبة', 'hours' => 7, 'status' => 'accepted'],
                        ['skill_name' => 'أساسيات IFRS', 'category_name' => 'المحاسبة', 'hours' => 5, 'status' => 'accepted'],
                    ],
                ],
            ];
        }
    @endphp

    @if(! is_array($semesters) || empty($semesters))
        <div class="dr-section">
            <div class="dr-empty">
                <div class="dr-empty-icon">
                    <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>
                <div style="font-weight:600; color: var(--q-text-primary);">لا توجد مهارات مسجلة بعد</div>
                <div style="margin-top: 6px;">ستظهر مهاراتك المعتمدة هنا فور إضافتها في نظام سجل المهارات.</div>
            </div>
        </div>
    @else
        @foreach($semesters as $semester)
            @php
                $semesterName = data_get($semester, 'semester_name', data_get($semester, 'name', 'فصل غير محدد'));
                $semesterSkills = data_get($semester, 'skills', data_get($semester, 'items', [])) ?: [];
                $semesterHours = data_get($semester, 'total_hours');
                if ($semesterHours === null) {
                    $semesterHours = array_sum(array_map(
                        fn ($s) => (float) (data_get($s, 'hours') ?? data_get($s, 'duration') ?? 0),
                        is_array($semesterSkills) ? $semesterSkills : []
                    ));
                }
            @endphp
            <div class="dr-section">
                <div class="dr-section-head">
                    <svg width="18" height="18" fill="none" stroke="#166A45" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <h3>{{ $semesterName }}</h3>
                    <span class="dr-pill">{{ number_format((float) $semesterHours, 0) }} ساعة</span>
                </div>
                <div class="dr-skill-list">
                    @forelse(($semesterSkills ?? []) as $skill)
                        @php
                            $title = data_get($skill, 'skill_name', data_get($skill, 'name', 'مهارة'));
                            $rawCategory = data_get($skill, 'category_name', data_get($skill, 'skill_category'));
                            $category = is_array($rawCategory) || is_object($rawCategory)
                                ? data_get($rawCategory, 'name')
                                : $rawCategory;
                            $hours = data_get($skill, 'hours', data_get($skill, 'duration', 0));
                            $status = strtolower((string) data_get($skill, 'status', 'accepted'));
                            $statusClass = match ($status) {
                                'accepted' => 'dr-status-accepted',
                                'pending'  => 'dr-status-pending',
                                'rejected' => 'dr-status-rejected',
                                default    => 'dr-status-accepted',
                            };
                            $statusLabel = match ($status) {
                                'pending'  => 'قيد المراجعة',
                                'rejected' => 'مرفوض',
                                default    => 'معتمد',
                            };
                        @endphp
                        <div class="dr-skill">
                            <div class="dr-skill-ico">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                </svg>
                            </div>
                            <div>
                                <div class="dr-skill-title">{{ $title }}</div>
                                @if($category)
                                    <div class="dr-skill-meta">{{ $category }}</div>
                                @endif
                            </div>
                            <span class="dr-skill-hours">{{ number_format((float) $hours, 0) }} س</span>
                            <span class="dr-status {{ $statusClass }}">{{ $statusLabel }}</span>
                        </div>
                    @empty
                        <div class="dr-empty" style="padding: var(--q-space-5);">لا توجد مهارات في هذا الفصل.</div>
                    @endforelse
                </div>
            </div>
        @endforeach
    @endif

</div>

@push('scripts')
<script>
(function () {
    // (AI loader overlay logic now lives in resources/views/digital-record/_loader.blade.php)

    // Tab switching for AI recommendations
    document.querySelectorAll('.dr-ai-tabs .dr-tab').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var key = this.dataset.tab;
            this.parentElement.querySelectorAll('.dr-tab').forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            document.querySelectorAll('.dr-tab-panel').forEach(function (p) {
                p.classList.toggle('active', p.dataset.panel === key);
            });
        });
    });

    // Skills cloud is now CSS-based; no JS rendering needed.

    // ===== Chart.js renderers =====
    function readChartData(id) {
        var c = document.getElementById(id);
        if (!c || !c.dataset.chart) return null;
        try { return JSON.parse(c.dataset.chart); } catch (e) { return null; }
    }

    function renderAlignmentChart() {
        var data = readChartData('dr-alignment-chart');
        if (!data || typeof Chart !== 'function') return;
        var canvas = document.getElementById('dr-alignment-chart');
        new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: ['مطابقة', 'فجوة'],
                datasets: [{
                    data: [data.matched || 0, data.gap || 0],
                    backgroundColor: ['#25935F', '#B8EACB'],
                    borderColor: '#FFFFFF',
                    borderWidth: 2,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        rtl: true,
                        textDirection: 'rtl',
                        callbacks: { label: function (ctx) { return ' ' + ctx.label + ': ' + ctx.parsed; } },
                    },
                },
            },
        });
    }

    function renderCoursesChart() {
        var data = readChartData('dr-courses-chart');
        if (!data || !Array.isArray(data) || !data.length || typeof Chart !== 'function') return;
        var canvas = document.getElementById('dr-courses-chart');
        // Reverse so the highest-relevance bar sits at the top in horizontal mode.
        var ordered = data.slice().reverse();
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ordered.map(function (d) { return d.label; }),
                datasets: [{
                    label: 'درجة التوافق',
                    data: ordered.map(function (d) { return d.relevance; }),
                    backgroundColor: '#25935F',
                    borderRadius: 6,
                    barThickness: 14,
                }],
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        rtl: true,
                        textDirection: 'rtl',
                        callbacks: {
                            label: function (ctx) {
                                var row = ordered[ctx.dataIndex] || {};
                                return ' توافق: ' + ctx.parsed.x + '  · درجة: ' + (row.grade || '—');
                            },
                        },
                    },
                },
                scales: {
                    x: { beginAtZero: true, grid: { display: false }, ticks: { color: '#6B7280' } },
                    y: { grid: { display: false }, ticks: { color: '#374151', font: { weight: '600' } } },
                },
            },
        });
    }

    function renderGapsChart() {
        var data = readChartData('dr-gaps-chart');
        if (!data || !Array.isArray(data) || !data.length || typeof Chart !== 'function') return;
        var canvas = document.getElementById('dr-gaps-chart');
        var ordered = data.slice().reverse();
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ordered.map(function (d) { return d.label; }),
                datasets: [{
                    label: 'وزن السوق',
                    data: ordered.map(function (d) { return d.weight; }),
                    backgroundColor: '#9FD1B0',
                    borderRadius: 6,
                    barThickness: 14,
                }],
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { rtl: true, textDirection: 'rtl' },
                },
                scales: {
                    x: { beginAtZero: true, max: 100, grid: { display: false }, ticks: { color: '#6B7280', callback: function (v) { return v + '%'; } } },
                    y: { grid: { display: false }, ticks: { color: '#374151', font: { weight: '600' } } },
                },
            },
        });
    }

    function renderSemestersChart() {
        var data = readChartData('dr-semesters-chart');
        if (!data || !Array.isArray(data) || !data.length || typeof Chart !== 'function') return;
        var canvas = document.getElementById('dr-semesters-chart');
        new Chart(canvas, {
            type: 'line',
            data: {
                labels: data.map(function (d) { return d.label; }),
                datasets: [{
                    label: 'الساعات',
                    data: data.map(function (d) { return d.hours; }),
                    borderColor: '#25935F',
                    backgroundColor: 'rgba(37,147,95,0.12)',
                    pointBackgroundColor: '#14573A',
                    fill: true,
                    tension: 0.35,
                    borderWidth: 2,
                    pointRadius: 4,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        rtl: true,
                        textDirection: 'rtl',
                        callbacks: {
                            label: function (ctx) {
                                var row = data[ctx.dataIndex] || {};
                                return ' ' + ctx.parsed.y + ' ساعة · ' + (row.count || 0) + ' مهارة';
                            },
                        },
                    },
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: '#6B7280', font: { size: 11 } } },
                    y: { beginAtZero: true, grid: { color: '#F3F4F6' }, ticks: { color: '#6B7280', precision: 0 } },
                },
            },
        });
    }

    function renderCategoriesChart() {
        var data = readChartData('dr-categories-chart');
        if (!data || !Array.isArray(data) || !data.length || typeof Chart !== 'function') return;
        var canvas = document.getElementById('dr-categories-chart');
        var palette = ['#25935F', '#14573A', '#7AC59A', '#B8EACB', '#166A45', '#0E3F29'];
        new Chart(canvas, {
            type: 'doughnut',
            data: {
                labels: data.map(function (d) { return d.label; }),
                datasets: [{
                    data: data.map(function (d) { return d.count; }),
                    backgroundColor: data.map(function (_, i) { return palette[i % palette.length]; }),
                    borderColor: '#FFFFFF',
                    borderWidth: 2,
                }],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '55%',
                plugins: {
                    legend: { position: 'bottom', rtl: true, textDirection: 'rtl', labels: { boxWidth: 10, padding: 8, font: { size: 11 } } },
                    tooltip: { rtl: true, textDirection: 'rtl' },
                },
            },
        });
    }

    function renderGradesChart() {
        var data = readChartData('dr-grades-chart');
        if (!data || !Array.isArray(data) || !data.length || typeof Chart !== 'function') return;
        var canvas = document.getElementById('dr-grades-chart');
        // One horizontal bar per course; highest score sits at the top.
        var ordered = data.slice().sort(function (a, b) { return (a.score || 0) - (b.score || 0); });
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: ordered.map(function (d) { return d.label; }),
                datasets: [{
                    label: 'الدرجة',
                    data: ordered.map(function (d) { return d.score; }),
                    backgroundColor: '#25935F',
                    borderRadius: 6,
                    barThickness: 16,
                }],
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        rtl: true,
                        textDirection: 'rtl',
                        callbacks: {
                            label: function (ctx) {
                                var row = ordered[ctx.dataIndex] || {};
                                return ' الدرجة: ' + ctx.parsed.x + '  · التقدير: ' + (row.grade || '—');
                            },
                        },
                    },
                },
                scales: {
                    x: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { color: '#6B7280' } },
                    y: { grid: { display: false }, ticks: { color: '#374151', font: { weight: '600' } } },
                },
            },
        });
    }

    function renderAllCharts() {
        if (typeof Chart !== 'function') return false;
        // Isolate each renderer so one Chart.js config error doesn't take down the rest.
        [renderAlignmentChart, renderCoursesChart, renderGapsChart, renderSemestersChart, renderCategoriesChart, renderGradesChart]
            .forEach(function (fn) {
                try { fn(); } catch (e) { console.error('[digital-record] chart failed:', fn.name, e); }
            });
        return true;
    }

    function startCharts() {
        if (renderAllCharts()) return;
        var tries = 0;
        (function poll() {
            if (renderAllCharts()) return;
            if (++tries < 30) setTimeout(poll, 100);
        })();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startCharts);
    } else {
        startCharts();
    }
})();
</script>
@endpush
@endsection
