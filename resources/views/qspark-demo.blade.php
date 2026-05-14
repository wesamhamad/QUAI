@extends('layouts.dashboard')

@section('title', 'Q SPARK — منصة التعلم والتجربة الأكاديمية')
@section('page-title', 'Q SPARK')

{{-- Use a full-bleed content area so the iframe can fill the available space
     below QUAI's topbar without the default q-content padding. --}}
@section('content-class', 'q-content q-content--flush')

@section('content')
@php
    // $qsparkUrl, $qsparkRole, $qsparkBaseUrl come from the route closure in
    // routes/web.php — they resolve to /dev/{role} on the standalone QSPARK
    // app (./QSPARK on :8001) so the iframe auto-signs the user in.
@endphp

<div class="qspark-embed">
    <header class="qspark-embed__bar">
        <div class="qspark-embed__title">
            <span class="qspark-embed__badge">Q SPARK</span>
            <span class="qspark-embed__role">
                {{ __('الجلسة الحالية:') }} <strong>{{ $qsparkRole }}</strong>
            </span>
        </div>
        <div class="qspark-embed__actions">
            <button type="button" class="qspark-embed__btn" id="qsparkReload" title="إعادة تحميل">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12a9 9 0 11-3-6.7L21 8"/><path d="M21 3v5h-5"/>
                </svg>
                إعادة تحميل
            </button>
            <a href="{{ $qsparkUrl }}" target="_blank" rel="noopener" class="qspark-embed__btn qspark-embed__btn--ghost" title="فتح في نافذة جديدة">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/>
                </svg>
                فتح في نافذة جديدة
            </a>
        </div>
    </header>

    @if(!empty($qsparkSections))
        {{-- Role-aware section tabs. Each link re-renders the wrapper with a
             different ?section= so the iframe lands directly on the chosen
             QSPARK page (via /dev/{role}?next=...). --}}
        <nav class="qspark-embed__tabs" aria-label="QSPARK sections">
            @foreach($qsparkSections as $key => $section)
                <a
                    href="{{ route('qspark-demo', ['section' => $key]) }}"
                    class="qspark-embed__tab @if($qsparkActiveSection === $key) is-active @endif"
                >{{ $section['label'] }}</a>
            @endforeach
        </nav>
    @endif

    <iframe
        id="qsparkFrame"
        src="{{ $qsparkUrl }}"
        title="Q SPARK Demo"
        class="qspark-embed__frame"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        allow="clipboard-read; clipboard-write; fullscreen"
    ></iframe>
</div>

@push('styles')
<style>
    .q-content--flush { padding: 0 !important; }
    .qspark-embed {
        display: flex;
        flex-direction: column;
        height: calc(100vh - var(--q-topbar-height, 64px));
        min-height: 600px;
        background: var(--q-bg-secondary, #f5f6f8);
    }
    .qspark-embed__bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--q-space-3, 12px);
        padding: var(--q-space-3, 12px) var(--q-space-5, 20px);
        background: var(--q-bg-primary, #fff);
        border-bottom: 1px solid var(--q-border-color, #e5e7eb);
        flex-wrap: wrap;
    }
    .qspark-embed__title {
        display: flex;
        align-items: center;
        gap: var(--q-space-3, 12px);
        font-size: var(--q-font-sm, 0.875rem);
        color: var(--q-text-secondary, #4b5563);
    }
    .qspark-embed__badge {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: 999px;
        background: linear-gradient(135deg, var(--q-primary, #14573A) 0%, var(--q-secondary-dark, #1B8354) 100%);
        color: #fff;
        font-weight: 700;
        font-size: 0.75rem;
        letter-spacing: 0.02em;
    }
    .qspark-embed__role strong { color: var(--q-text-primary, #111); }
    .qspark-embed__actions { display: flex; gap: var(--q-space-2, 8px); }
    .qspark-embed__btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 8px;
        border: 1px solid var(--q-border-color, #e5e7eb);
        background: var(--q-primary, #14573A);
        color: #fff;
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        text-decoration: none;
        transition: filter 0.15s ease;
    }
    .qspark-embed__btn:hover { filter: brightness(0.95); }
    .qspark-embed__btn--ghost {
        background: transparent;
        color: var(--q-text-primary, #111);
    }
    .qspark-embed__tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 8px var(--q-space-5, 20px);
        background: var(--q-bg-primary, #fff);
        border-bottom: 1px solid var(--q-border-color, #e5e7eb);
        overflow-x: auto;
    }
    .qspark-embed__tab {
        display: inline-flex;
        align-items: center;
        padding: 6px 14px;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--q-text-secondary, #4b5563);
        text-decoration: none;
        white-space: nowrap;
        transition: background 0.15s ease, color 0.15s ease;
    }
    .qspark-embed__tab:hover {
        background: var(--q-bg-secondary, #f5f6f8);
        color: var(--q-text-primary, #111);
    }
    .qspark-embed__tab.is-active {
        background: linear-gradient(135deg, var(--q-primary, #14573A) 0%, var(--q-secondary-dark, #1B8354) 100%);
        color: #fff;
    }
    .qspark-embed__frame {
        flex: 1;
        width: 100%;
        border: 0;
        background: #fff;
    }
</style>
@endpush

@push('scripts')
<script>
    (function() {
        var frame = document.getElementById('qsparkFrame');
        var reload = document.getElementById('qsparkReload');
        if (reload && frame) {
            reload.addEventListener('click', function() {
                // Reset to the canonical entry URL so a stale inner-iframe state
                // can be recovered to the role-matched login route.
                frame.src = @json($qsparkUrl);
            });
        }
    })();
</script>
@endpush
@endsection
