@extends('layouts.dashboard')

@section('title', __('messages.app_title_default'))
@section('page-title', __('messages.nav_home'))

@section('content')
@php
    $user = auth()->user();
    $isFaculty = $user && method_exists($user, 'hasAnyRole') && $user->hasAnyRole(['Faculty', 'Admin', 'Super Admin']);
    $isAdmin = $user && method_exists($user, 'hasAnyRole') && $user->hasAnyRole(['Admin', 'Super Admin']);
    // In demo mode every authenticated user sees all three apps; faculty also
    // gets a "Students" card on top to switch into any student's data.
    $showQMentor = true;
    $showDigitalRecord = true;
    $showQSparkSystem = true;
    $showQDecisionSystem = $isAdmin;

    // Map the QUAI session role onto the merged QSPARK app's demo persona; the
    // /qspark-demo wrapper deep-links the iframe into /qspark/dev/{role} so the
    // user is quick-logged-in with the matching role.
    $qsparkRole = $isAdmin ? 'admin' : ($isFaculty ? 'faculty' : 'student');
@endphp

<div class="q-fade-in q-home" style="max-width: var(--q-content-max); margin: 0 auto;">

    {{-- Hero Banner --}}
    <div class="q-hero-banner" style="background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary-dark) 100%); border-radius: var(--q-radius-2xl); margin-bottom: var(--q-space-8); overflow: hidden; position: relative; box-shadow: var(--q-shadow-md);">
        <div style="padding: var(--q-space-8); position: relative; z-index: 2; display: flex; align-items: center; gap: var(--q-space-6); flex-wrap: wrap;">
            <div class="q-hero-logo" style="width: 96px; height: 96px; background: rgba(255,255,255,0.18); border-radius: var(--q-radius-2xl); display: flex; align-items: center; justify-content: center; font-size: 3rem; font-weight: 800; color: white; flex-shrink: 0; backdrop-filter: blur(8px); letter-spacing: -0.05em;">
                Q
            </div>
            <div style="flex: 1; min-width: 240px;">
                <h1 style="font-size: clamp(2rem, 4vw, 3rem); font-weight: 800; color: white; margin: 0 0 var(--q-space-2) 0; line-height: 1.1; letter-spacing: -0.02em;">QUAI</h1>
                <p style="font-size: var(--q-font-base); color: rgba(255,255,255,0.92); margin: 0; line-height: var(--q-line-height); max-width: 540px;">
                    {!! __('messages.home_hero_tagline') !!}
                </p>
            </div>
            {{-- AI Brain Illustration (decorative) --}}
            <div class="q-hero-art" aria-hidden="true" style="flex-shrink: 0; opacity: 0.85;">
                
            </div>
        </div>
        {{-- Decorative circles --}}
        <div style="position: absolute; top: -40px; left: -40px; width: 160px; height: 160px; background: rgba(255,255,255,0.06); border-radius: 50%; z-index: 1;"></div>
        <div style="position: absolute; bottom: -60px; left: 40%; width: 200px; height: 200px; background: rgba(255,255,255,0.04); border-radius: 50%; z-index: 1;"></div>
    </div>

    @if($isFaculty)
    {{-- Faculty quick-access card --}}
    <a href="{{ route('faculty.students') }}" class="q-card" style="display:flex; align-items:center; gap: var(--q-space-4); padding: var(--q-space-5); margin-bottom: var(--q-space-6); text-decoration:none; color:inherit; border: 2px solid rgba(37,147,95,0.25);">
        <div style="width:56px; height:56px; border-radius: var(--q-radius-xl); background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary-dark) 100%); display:flex; align-items:center; justify-content:center; color:#fff;">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        </div>
        <div style="flex:1;">
            <div style="font-weight:800; font-size: var(--q-font-lg); color: var(--q-text-primary);">{{ __('messages.faculty_view_students_title') }}</div>
            <div style="font-size: var(--q-font-sm); color: var(--q-text-secondary);">{{ __('messages.faculty_view_students_desc') }}</div>
        </div>
        <div style="color: var(--q-primary); font-weight:700;">{{ app()->getLocale() === 'ar' ? '←' : '→' }}</div>
    </a>
    @endif

    {{-- Systems Grid \u2014 two columns when both systems are visible (admin), one column otherwise. --}}
    <div class="q-systems-grid" data-cols="{{ $showQSparkSystem && $showQDecisionSystem ? '2' : '1' }}" style="display: grid; grid-template-columns: {{ $showQSparkSystem && $showQDecisionSystem ? 'repeat(2, minmax(0, 1fr))' : '1fr' }}; gap: var(--q-space-6); margin-bottom: var(--q-space-8); align-items: stretch;">

        @if($showQSparkSystem)
        {{-- QSpark+ System Card --}}
        <section class="q-card q-system-card" style="padding: var(--q-space-6); display: flex; flex-direction: column; gap: var(--q-space-5);">
            <a href="/qspark-plus" class="q-system-header-link">
                <header style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--q-space-3); padding-bottom: var(--q-space-4); border-bottom: 1px solid var(--q-border-color);">
                    <div style="width: 56px; height: 56px; background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary-dark) 100%); border-radius: var(--q-radius-xl); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: white; font-weight: 800; font-size: 1.5rem;">
                    <sup style="font-size: 0.85rem;">+</sup>Q
                    </div>
                    <div>
                        <p style="font-size: var(--q-font-sm); color: var(--q-primary); font-weight: 600; margin: 0 0 var(--q-space-1) 0;">{{ __('messages.academic_system') }}</p>
                        <h2 style="font-size: var(--q-font-xl); font-weight: 800; color: var(--q-text-primary); margin: 0;">{{ app()->getLocale() === 'ar' ? '+QSpark' : 'QSpark+' }}</h2>
                    </div>
                </header>
            </a>

            <div class="q-sub-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--q-space-4);">

                @if($showQMentor)
                <a href="/qmentor?tab=advisor&solo=1" class="q-sub-card" data-tone="green">
                    <div class="q-sub-card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: var(--q-primary);">
                            <circle cx="10" cy="7" r="3.2"/>
                            <path d="M3.5 20 C3.5 16.4 6.4 13.8 10 13.8 C13.6 13.8 16.5 16.4 16.5 20"/>
                            <path d="M18.5 4 L19.2 5.6 L20.8 6.3 L19.2 7 L18.5 8.6 L17.8 7 L16.2 6.3 L17.8 5.6 Z" fill="currentColor" stroke="none"/>
                            <circle cx="20" cy="11" r="0.9" fill="currentColor" stroke="none"/>
                            <circle cx="22" cy="14" r="0.7" fill="currentColor" stroke="none"/>
                        </svg>
                    </div>
                    <div class="q-sub-card-title">{{ __('messages.qmentor_title') }}</div>
                    <div class="q-sub-card-subtitle">QMentor</div>
                    <p class="q-sub-card-desc">
                        {{ __('messages.qmentor_desc') }}
                    </p>
                </a>
                @endif

                @if($showDigitalRecord)
                <a href="{{ route('digital-record.index') }}" class="q-sub-card" data-tone="green">
                    <div class="q-sub-card-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--q-primary);">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="9" y1="13" x2="15" y2="13"/>
                            <line x1="9" y1="17" x2="15" y2="17"/>
                        </svg>
                    </div>
                    <div class="q-sub-card-title">{{ __('messages.nav_digital_record') }}</div>
                    <div class="q-sub-card-subtitle">{{ __('messages.digital_record_subtitle') }}</div>
                    <p class="q-sub-card-desc">
                        {{ __('messages.digital_record_desc') }}
                    </p>
                </a>
                @endif

                {{-- منصة التعلم والتجربة الأكاديمية — the standalone Q SPARK Laravel
                     sub-app (./QSPARK on :8001) is hosted inline inside QUAI's shell at
                     /qspark-demo. That wrapper view deep-links into QSPARK's /dev/{role}
                     route so the iframe auto-authenticates the user with the matching
                     persona (admin/faculty/student). --}}
                <a href="{{ route('qspark-demo') }}" class="q-sub-card" data-tone="green">
                    <div class="q-sub-card-icon" style="position: relative;">
                        <span style="font-weight: 800; font-size: 1.25rem; color: var(--q-primary); line-height: 1;">Q</span>
                        <svg width="11" height="13" viewBox="0 0 24 24" fill="var(--q-primary)" stroke="var(--q-primary)" stroke-width="1.5" stroke-linejoin="round" style="position: absolute; top: 4px; inset-inline-end: 4px;">
                            <path d="M13 2 L4 14 h7 l-2 8 9-12 h-7 z"/>
                        </svg>
                    </div>
                    <div class="q-sub-card-title">{{ __('messages.qspark_card_title') }}</div>
                    <div class="q-sub-card-subtitle">QSpark</div>
                    <p class="q-sub-card-desc">
                        {{ __('messages.qspark_card_desc') }}
                        {{ __('messages.qspark_card_role_hint', ['role' => $qsparkRole]) }}
                    </p>
                </a>

            </div>
        </section>
        @endif

        @if($showQDecisionSystem)
        {{-- Q Decision Support System Card (Admin only) --}}
        <section class="q-card q-system-card" style="padding: var(--q-space-6); display: flex; flex-direction: column; gap: var(--q-space-5);">
            <header style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--q-space-3); padding-bottom: var(--q-space-4); border-bottom: 1px solid var(--q-border-color);">
                <div style="width: 56px; height: 56px; background: linear-gradient(135deg, #6B46C1 0%, #4C2A8F 100%); border-radius: var(--q-radius-xl); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: white;">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 3v18h18"/>
                        <path d="M7 14l4-4 4 4 5-5"/>
                        <circle cx="11" cy="10" r="1.2" fill="currentColor"/>
                        <circle cx="15" cy="14" r="1.2" fill="currentColor"/>
                    </svg>
                </div>
                <div>
                    <p style="font-size: var(--q-font-sm); color: #6B46C1; font-weight: 600; margin: 0 0 var(--q-space-1) 0;">{{ __('messages.admin_system') }}</p>
                    <h2 style="font-size: var(--q-font-xl); font-weight: 800; color: var(--q-text-primary); margin: 0;">Q Decision Support System</h2>
                </div>
            </header>

            <div class="q-sub-cards" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--q-space-4);">
                <a href="{{ route('q-decision.self-report') }}" class="q-sub-card" data-tone="purple">
                    <div class="q-sub-card-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: #6B46C1;">
                            <rect x="3" y="4" width="18" height="16" rx="2"/>
                            <path d="M7 12l3 3 7-7"/>
                            <path d="M7 18h4"/>
                        </svg>
                    </div>
                    <div class="q-sub-card-title">{{ __('messages.self_report_title') }}</div>
                    <div class="q-sub-card-subtitle">Self-Report Dashboard</div>
                    <p class="q-sub-card-desc">
                        {{ __('messages.self_report_desc') }}
                    </p>
                </a>

                <a href="{{ route('q-decision.digital-advisor') }}" class="q-sub-card" data-tone="purple">
                    <div class="q-sub-card-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="color: #6B46C1;">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                            <circle cx="9" cy="12" r="0.9" fill="currentColor"/>
                            <circle cx="12" cy="12" r="0.9" fill="currentColor"/>
                            <circle cx="15" cy="12" r="0.9" fill="currentColor"/>
                        </svg>
                    </div>
                    <div class="q-sub-card-title">{{ __('messages.nav_digital_advisor') }}</div>
                    <div class="q-sub-card-subtitle">Digital Advisor</div>
                    <p class="q-sub-card-desc">
                        {{ __('messages.digital_advisor_desc') }}
                    </p>
                </a>
            </div>
        </section>
        @endif

    </div>

    {{-- Stats Row --}}
    <div class="q-stats-row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--q-space-5);">
        <div class="q-card" style="padding: var(--q-space-5); display: flex; align-items: center; gap: var(--q-space-4);">
            <div style="flex-shrink: 0;">
                <div style="font-size: var(--q-font-3xl); font-weight: 800; color: var(--q-primary); line-height: 1;">24/7</div>
                <div style="font-size: var(--q-font-sm); color: var(--q-text-secondary); margin-top: var(--q-space-1);">{{ __('messages.available_24_7') }}</div>
            </div>
            <div style="margin-inline-start: auto; width: 48px; height: 48px; background: var(--q-primary-bg, rgba(37,147,95,0.08)); border-radius: var(--q-radius-xl); display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--q-primary);">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                </svg>
            </div>
        </div>

        <div class="q-card" style="padding: var(--q-space-5); display: flex; align-items: center; gap: var(--q-space-4);">
            <div style="flex-shrink: 0;">
                <div style="font-size: var(--q-font-lg); font-weight: 700; color: var(--q-text-primary); line-height: 1.2;">{{ __('messages.integrated_ai_apps') }}</div>
                <div style="font-size: var(--q-font-sm); color: var(--q-text-secondary); margin-top: var(--q-space-1);">{{ __('messages.unified_university_system') }}</div>
            </div>
            <div style="margin-inline-start: auto; width: 48px; height: 48px; background: var(--q-primary-bg, rgba(37,147,95,0.08)); border-radius: var(--q-radius-xl); display: flex; align-items: center; justify-content: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--q-primary);">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
            </div>
        </div>
    </div>

</div>

<style>
    .q-home .q-sub-card {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: var(--q-space-2);
        padding: var(--q-space-5);
        background: var(--q-card-bg);
        border: 2px solid rgba(37,147,95,0.18);
        border-radius: var(--q-radius-xl);
        text-decoration: none;
        color: inherit;
        box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease, background 0.18s ease;
        cursor: pointer;
    }
    .q-home .q-sub-card[data-tone="purple"] {
        border-color: rgba(107,70,193,0.20);
    }
    .q-home .q-sub-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 24px rgba(37,147,95,0.18);
        border-color: var(--q-primary);
        background: rgba(37,147,95,0.04);
    }
    .q-home .q-sub-card[data-tone="purple"]:hover {
        border-color: #6B46C1;
        box-shadow: 0 10px 24px rgba(107,70,193,0.18);
        background: rgba(107,70,193,0.04);
    }
    .q-home .q-sub-card:focus-visible {
        outline: 3px solid var(--q-primary);
        outline-offset: 2px;
    }
    .q-home .q-sub-card[data-tone="purple"]:focus-visible {
        outline-color: #6B46C1;
    }
    .q-home .q-sub-card-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--q-radius-lg);
        background: rgba(37,147,95,0.10);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: var(--q-space-2);
    }
    .q-home .q-sub-card[data-tone="purple"] .q-sub-card-icon {
        background: rgba(107,70,193,0.10);
    }
    .q-home .q-sub-card-title {
        font-size: var(--q-font-lg);
        font-weight: 700;
        color: var(--q-text-primary);
    }
    .q-home .q-sub-card-subtitle {
        font-size: var(--q-font-xs);
        color: var(--q-text-secondary);
        margin-bottom: var(--q-space-2);
    }
    .q-home .q-sub-card-desc {
        font-size: var(--q-font-sm);
        color: var(--q-text-secondary);
        line-height: var(--q-line-height);
        margin: 0;
    }
    .q-home .q-system-header-link {
        display: block;
        text-decoration: none;
        color: inherit;
        border-radius: var(--q-radius-xl);
        transition: background 0.18s ease, transform 0.18s ease;
    }
    .q-home .q-system-header-link:hover {
        background: rgba(37,147,95,0.04);
        transform: translateY(-1px);
    }
    .q-home .q-system-header-link:focus-visible {
        outline: 3px solid var(--q-primary);
        outline-offset: 2px;
    }

    @media (max-width: 1100px) {
        .q-home .q-systems-grid[data-cols="2"] {
            grid-template-columns: 1fr !important;
        }
    }
    @media (max-width: 900px) {
        .q-home .q-systems-grid {
            grid-template-columns: 1fr !important;
        }
        .q-home .q-hero-art {
            display: none;
        }
    }
</style>
@endsection
