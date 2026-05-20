@extends('layouts.dashboard')

@section('title', __('messages.qspark_platform_title'))
@section('page-title', 'Q SPARK')
@section('og-title', __('messages.qspark_platform_og_title'))

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
                {{ __('messages.current_session') }} <strong>{{ $qsparkRole }}</strong>
            </span>
        </div>
        <div class="qspark-embed__actions">
            <button type="button" class="qspark-embed__btn" id="qsparkReload" title="{{ __('messages.reload') }}" aria-label="{{ __('messages.reload') }}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 12a9 9 0 11-3-6.7L21 8"/><path d="M21 3v5h-5"/>
                </svg>
                <span class="qspark-embed__btn-label">{{ __('messages.reload') }}</span>
            </button>
            <a href="{{ $qsparkUrl }}" target="_blank" rel="noopener" class="qspark-embed__btn qspark-embed__btn--ghost" title="{{ __('messages.open_in_new_tab') }}" aria-label="{{ __('messages.open_in_new_tab') }}">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><path d="M15 3h6v6"/><path d="M10 14L21 3"/>
                </svg>
                <span class="qspark-embed__btn-label">{{ __('messages.open_in_new_tab') }}</span>
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

    <div class="qspark-embed__viewport">
        <div id="qsparkLoader" class="qspark-embed__loader" role="status" aria-live="polite">
            <div class="qspark-embed__spinner" aria-hidden="true"></div>
            <span class="qspark-embed__loader-text">{{ __('messages.loading') }}…</span>
        </div>
        <iframe
            id="qsparkFrame"
            src="{{ $qsparkUrl }}"
            title="Q SPARK Demo"
            class="qspark-embed__frame"
            referrerpolicy="no-referrer-when-downgrade"
            allow="clipboard-read; clipboard-write; fullscreen"
        ></iframe>
    </div>
</div>

@push('styles')
<style>
    .q-content--flush { padding: 0 !important; }
    .qspark-embed {
        display: flex;
        flex-direction: column;
        height: calc(100vh - var(--q-topbar-height, 64px));
        /* Use dynamic viewport height on supported browsers so the iframe doesn't
           overflow when iOS Safari's URL bar collapses/expands. */
        height: calc(100dvh - var(--q-topbar-height, 64px));
        min-height: 600px;
        max-width: 100%;
        overflow: hidden;
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
        min-width: 0;
    }
    .qspark-embed__title {
        display: flex;
        align-items: center;
        gap: var(--q-space-3, 12px);
        font-size: var(--q-font-sm, 0.875rem);
        color: var(--q-text-secondary, #4b5563);
        flex-wrap: wrap;
        min-width: 0;
        flex: 1 1 auto;
    }
    .qspark-embed__role {
        min-width: 0;
        overflow-wrap: anywhere;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
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
    .qspark-embed__actions {
        display: flex;
        gap: var(--q-space-2, 8px);
        flex-shrink: 0;
        flex-wrap: wrap;
        justify-content: flex-end;
    }
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
        white-space: nowrap;
    }
    .qspark-embed__btn:hover { filter: brightness(0.95); }
    .qspark-embed__btn--ghost {
        background: transparent;
        color: var(--q-text-primary, #111);
    }
    .qspark-embed__btn-label { display: inline; }
    .qspark-embed__tabs {
        display: flex;
        flex-wrap: nowrap;
        gap: 4px;
        padding: 8px var(--q-space-5, 20px);
        background: var(--q-bg-primary, #fff);
        border-bottom: 1px solid var(--q-border-color, #e5e7eb);
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        scrollbar-width: thin;
    }
    .qspark-embed__tabs::-webkit-scrollbar { height: 4px; }
    .qspark-embed__tabs::-webkit-scrollbar-thumb {
        background: var(--q-border-color, #e5e7eb);
        border-radius: 999px;
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
    .qspark-embed__viewport {
        position: relative;
        flex: 1;
        min-height: 0;
        background: #fff;
    }
    .qspark-embed__frame {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        border: 0;
        background: #fff;
    }
    .qspark-embed__loader {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        background: var(--q-bg-primary, #fff);
        color: var(--q-text-secondary, #4b5563);
        font-size: 0.875rem;
        font-weight: 600;
        z-index: 1;
        transition: opacity 0.2s ease;
    }
    .qspark-embed__loader.is-hidden {
        opacity: 0;
        pointer-events: none;
    }
    .qspark-embed__spinner {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 3px solid var(--q-border-color, #e5e7eb);
        border-top-color: var(--q-primary, #14573A);
        animation: qsparkSpin 0.8s linear infinite;
    }
    @keyframes qsparkSpin {
        to { transform: rotate(360deg); }
    }

    /* Tablet: lighter chrome so the iframe gets more vertical room. */
    @media (max-width: 1024px) {
        .qspark-embed__bar { padding: 10px 16px; }
        .qspark-embed__tabs { padding: 6px 12px; }
    }

    /* Mobile: tighter padding and smaller controls so the iframe gets more room. */
    @media (max-width: 640px) {
        .qspark-embed {
            height: calc(100vh - var(--q-topbar-height, 64px));
            height: calc(100dvh - var(--q-topbar-height, 64px));
            min-height: 0;
        }
        .qspark-embed__bar {
            padding: 8px 12px;
            gap: 8px;
            flex-wrap: nowrap;
        }
        .qspark-embed__title {
            font-size: 0.8125rem;
            gap: 8px;
            flex-wrap: nowrap;
            min-width: 0;
            overflow: hidden;
        }
        .qspark-embed__role {
            font-size: 0.75rem;
        }
        .qspark-embed__badge { padding: 3px 8px; font-size: 0.6875rem; }
        .qspark-embed__actions { gap: 6px; flex-wrap: nowrap; }
        .qspark-embed__btn { padding: 6px 8px; font-size: 0.75rem; }
        .qspark-embed__tabs {
            padding: 6px 10px;
            gap: 4px;
            flex-wrap: nowrap;
            -webkit-overflow-scrolling: touch;
        }
        .qspark-embed__tab { padding: 5px 10px; font-size: 0.8125rem; }
    }

    /* Small phones: collapse buttons to icon-only and hide secondary chrome
       text so the bar fits on one row without truncation. */
    @media (max-width: 480px) {
        .qspark-embed__bar { padding: 6px 10px; gap: 6px; }
        .qspark-embed__btn-label { display: none; }
        .qspark-embed__btn { padding: 6px; gap: 0; }
        .qspark-embed__btn svg { width: 18px; height: 18px; }
        .qspark-embed__role { font-size: 0.7rem; }
        .qspark-embed__badge { font-size: 0.65rem; padding: 2px 7px; }
    }

    /* Very small phones: drop the role text label entirely. */
    @media (max-width: 360px) {
        .qspark-embed__role { display: none; }
        .qspark-embed__tabs { padding: 6px 8px; }
        .qspark-embed__tab { padding: 4px 8px; font-size: 0.75rem; }
    }

    /* Landscape phones: hide tabs/bar text isn't needed; keep iframe usable. */
    @media (max-height: 480px) and (orientation: landscape) {
        .qspark-embed { min-height: 0; }
        .qspark-embed__bar { padding: 4px 10px; }
        .qspark-embed__tabs { padding: 4px 10px; }
    }
</style>
@endpush

@push('scripts')
<script>
    (function() {
        var frame = document.getElementById('qsparkFrame');
        var reload = document.getElementById('qsparkReload');
        var loader = document.getElementById('qsparkLoader');

        function showLoader() {
            if (loader) loader.classList.remove('is-hidden');
        }
        function hideLoader() {
            if (loader) loader.classList.add('is-hidden');
        }

        if (frame) {
            frame.addEventListener('load', hideLoader);
            // Safety net: hide the loader after a reasonable timeout even if the
            // iframe's load event never fires (e.g., blocked cross-origin nav).
            setTimeout(hideLoader, 8000);
        }

        if (reload && frame) {
            reload.addEventListener('click', function() {
                // Reset to the canonical entry URL so a stale inner-iframe state
                // can be recovered to the role-matched login route.
                showLoader();
                frame.src = @json($qsparkUrl);
            });
        }
    })();
</script>
@endpush
@endsection
