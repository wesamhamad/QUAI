@extends('layouts.dashboard')

@section('title', 'QSpark - QUAI')
@section('page-title', 'QSpark')

@section('content')
@php
    // Icon helpers — keep stat/achievement icons readable in markup below.
    $statIcons = [
        'book'  => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14z"/>',
        'lab'   => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v6l-5 9a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 18l-5-9V3"/>',
        'clock' => '<circle cx="12" cy="12" r="9" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 7v5l3 3"/>',
        'medal' => '<circle cx="12" cy="15" r="5" stroke-width="2"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11 5 3h14l-3 8"/>',
    ];
    $achIcons = [
        'star'   => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
        'trend'  => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 17l6-6 4 4 8-8M14 7h7v7"/>',
        'fire'   => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2s4 4 4 8a4 4 0 1 1-8 0c0-2 2-3 2-5s2 1 2-3z"/>',
        'trophy' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>',
        'users'  => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    ];
    $toneMap = [
        'green'  => ['bg' => 'rgba(37,147,95,0.10)',  'fg' => 'var(--q-primary)'],
        'purple' => ['bg' => 'rgba(107,70,193,0.10)', 'fg' => '#6B46C1'],
        'amber'  => ['bg' => 'rgba(217,119,6,0.12)',  'fg' => '#D97706'],
        'gray'   => ['bg' => 'rgba(100,116,139,0.12)','fg' => '#64748B'],
    ];
@endphp

<div class="q-fade-in qs-page" style="max-width: var(--q-content-max); margin: 0 auto;">

    {{-- Hero --}}
    <div class="qs-hero" style="background: linear-gradient(135deg, var(--q-primary) 0%, var(--q-secondary-dark) 100%); border-radius: var(--q-radius-2xl); padding: var(--q-space-7); margin-bottom: var(--q-space-6); color: white; box-shadow: var(--q-shadow-md);">
        <div style="display: flex; align-items: center; gap: var(--q-space-5); flex-wrap: wrap;">
            <div style="width: 72px; height: 72px; background: rgba(255,255,255,0.18); border-radius: var(--q-radius-xl); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(8px); font-weight: 800; font-size: 1.8rem;">
                <sup style="font-size: 1rem;">+</sup>Q
            </div>
            <div style="flex: 1; min-width: 240px;">
                <p style="font-size: var(--q-font-sm); color: rgba(255,255,255,0.85); margin: 0 0 6px 0; font-weight: 600;">منصة التعلم والتجربة الأكاديمية</p>
                <h1 style="font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.02em;">+QSpark</h1>
                <p style="font-size: var(--q-font-base); color: rgba(255,255,255,0.92); margin: 0; max-width: 620px;">
                    محتوى تعليمي ذكي، مختبرات تفاعلية، مسارات تعلم، ومشاريع تطبيقية تربط مهاراتك بسوق العمل.
                </p>
            </div>
        </div>
    </div>

    {{-- KPI stats --}}
    <div class="qs-kpis" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--q-space-4); margin-bottom: var(--q-space-6);">
        @foreach($stats as $s)
        <div class="q-card" style="padding: var(--q-space-5); display: flex; align-items: center; gap: var(--q-space-4);">
            <div style="width: 48px; height: 48px; border-radius: var(--q-radius-lg); background: rgba(37,147,95,0.10); display: flex; align-items: center; justify-content: center; color: var(--q-primary);">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">{!! $statIcons[$s['icon']] ?? $statIcons['book'] !!}</svg>
            </div>
            <div>
                <div style="font-size: var(--q-font-2xl); font-weight: 800; color: var(--q-text-primary); line-height: 1;">{{ $s['value'] }}</div>
                <div style="font-size: var(--q-font-sm); color: var(--q-text-secondary); margin-top: 4px;">{{ $s['label'] }}</div>
            </div>
        </div>
        @endforeach
    </div>

    {{-- Featured Courses --}}
    <section class="q-card" style="padding: var(--q-space-6); margin-bottom: var(--q-space-6);">
        <header style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--q-space-5); flex-wrap: wrap; gap: var(--q-space-3);">
            <div>
                <h2 style="margin: 0; font-size: var(--q-font-xl); font-weight: 800; color: var(--q-text-primary);">المقررات المميزة</h2>
                <p style="margin: 4px 0 0 0; font-size: var(--q-font-sm); color: var(--q-text-secondary);">مقررات تفاعلية بمحتوى مرئي وتطبيقات عملية.</p>
            </div>
            <span style="font-size: var(--q-font-xs); font-weight: 700; padding: 6px 12px; border-radius: 999px; background: rgba(37,147,95,0.10); color: var(--q-primary);">{{ count($courses) }} مقررات</span>
        </header>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--q-space-4);">
            @foreach($courses as $c)
            @php($t = $toneMap[$c['tone']] ?? $toneMap['green'])
            <article id="course-{{ $c['code'] }}" style="scroll-margin-top: var(--q-space-6); border: 1px solid var(--q-border-color); border-radius: var(--q-radius-xl); padding: var(--q-space-4); display: flex; flex-direction: column; gap: var(--q-space-3); background: var(--q-surface);">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                    <span style="font-size: var(--q-font-xs); font-weight: 700; padding: 4px 10px; border-radius: 999px; background: {{ $t['bg'] }}; color: {{ $t['fg'] }};">{{ $c['category'] }}</span>
                    <span style="font-size: var(--q-font-xs); color: var(--q-text-secondary); font-weight: 600;">{{ $c['code'] }}</span>
                </div>
                <h3 style="margin: 0; font-size: var(--q-font-base); font-weight: 700; color: var(--q-text-primary); line-height: 1.4;">{{ $c['title'] }}</h3>
                <div style="display: flex; gap: var(--q-space-3); font-size: var(--q-font-xs); color: var(--q-text-secondary); flex-wrap: wrap;">
                    <span>📘 {{ $c['level'] }}</span>
                    <span>⏱ {{ $c['hours'] }} ساعة</span>
                    <span>⭐ {{ $c['rating'] }}</span>
                    <span>👥 {{ number_format($c['enrolled']) }}</span>
                </div>
                <div>
                    <div style="display: flex; justify-content: space-between; font-size: var(--q-font-xs); color: var(--q-text-secondary); margin-bottom: 4px;">
                        <span>التقدم</span><span style="font-weight: 700; color: {{ $t['fg'] }};">{{ $c['progress'] }}%</span>
                    </div>
                    <div style="height: 8px; border-radius: 999px; background: var(--q-border-color); overflow: hidden;">
                        <div style="height: 100%; width: {{ $c['progress'] }}%; background: {{ $t['fg'] }}; border-radius: 999px;"></div>
                    </div>
                </div>
            </article>
            @endforeach
        </div>
    </section>

    {{-- Learning Paths --}}
    <section class="q-card" style="padding: var(--q-space-6); margin-bottom: var(--q-space-6);">
        <header style="margin-bottom: var(--q-space-5);">
            <h2 style="margin: 0; font-size: var(--q-font-xl); font-weight: 800; color: var(--q-text-primary);">مسارات التعلم</h2>
            <p style="margin: 4px 0 0 0; font-size: var(--q-font-sm); color: var(--q-text-secondary);">مسارات متكاملة تقودك من المبتدئ إلى المحترف.</p>
        </header>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--q-space-4);">
            @foreach($paths as $p)
            <article style="border: 1px solid var(--q-border-color); border-radius: var(--q-radius-xl); padding: var(--q-space-5); background: var(--q-surface);">
                <h3 style="margin: 0 0 6px 0; font-size: var(--q-font-lg); font-weight: 800; color: var(--q-text-primary);">{{ $p['title'] }}</h3>
                <p style="margin: 0 0 var(--q-space-3) 0; font-size: var(--q-font-sm); color: var(--q-text-secondary); line-height: 1.6;">{{ $p['desc'] }}</p>
                <div style="display: flex; gap: var(--q-space-3); font-size: var(--q-font-xs); color: var(--q-text-secondary); margin-bottom: var(--q-space-3); flex-wrap: wrap;">
                    <span>📚 {{ $p['courses'] }} مقررات</span>
                    <span>⏱ {{ $p['hours'] }} ساعة</span>
                    <span>👥 {{ number_format($p['students']) }} طالب</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: var(--q-font-xs); color: var(--q-text-secondary); margin-bottom: 4px;">
                    <span>إكمال المسار</span><span style="font-weight: 700; color: var(--q-primary);">{{ $p['progress'] }}%</span>
                </div>
                <div style="height: 8px; border-radius: 999px; background: var(--q-border-color); overflow: hidden;">
                    <div style="height: 100%; width: {{ $p['progress'] }}%; background: var(--q-primary); border-radius: 999px;"></div>
                </div>
            </article>
            @endforeach
        </div>
    </section>

    {{-- Projects --}}
    <section class="q-card" style="padding: var(--q-space-6); margin-bottom: var(--q-space-6);">
        <header style="margin-bottom: var(--q-space-5);">
            <h2 style="margin: 0; font-size: var(--q-font-xl); font-weight: 800; color: var(--q-text-primary);">مشاريعك التطبيقية</h2>
            <p style="margin: 4px 0 0 0; font-size: var(--q-font-sm); color: var(--q-text-secondary);">مشاريع عملية تثبت كفاءاتك للجهات التوظيفية.</p>
        </header>
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: var(--q-font-sm);">
                <thead>
                    <tr style="text-align: start; color: var(--q-text-secondary); font-size: var(--q-font-xs); font-weight: 700;">
                        <th style="padding: 10px 12px; border-bottom: 1px solid var(--q-border-color);">المشروع</th>
                        <th style="padding: 10px 12px; border-bottom: 1px solid var(--q-border-color);">التقنية</th>
                        <th style="padding: 10px 12px; border-bottom: 1px solid var(--q-border-color);">الحالة</th>
                        <th style="padding: 10px 12px; border-bottom: 1px solid var(--q-border-color);">تاريخ التسليم</th>
                        <th style="padding: 10px 12px; border-bottom: 1px solid var(--q-border-color);">الدرجة</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($projects as $p)
                    @php($t = $toneMap[$p['tone']] ?? $toneMap['gray'])
                    <tr>
                        <td style="padding: 12px; border-bottom: 1px solid var(--q-border-color); font-weight: 600; color: var(--q-text-primary);">{{ $p['title'] }}</td>
                        <td style="padding: 12px; border-bottom: 1px solid var(--q-border-color); color: var(--q-text-secondary);">{{ $p['tech'] }}</td>
                        <td style="padding: 12px; border-bottom: 1px solid var(--q-border-color);">
                            <span style="font-size: var(--q-font-xs); font-weight: 700; padding: 4px 10px; border-radius: 999px; background: {{ $t['bg'] }}; color: {{ $t['fg'] }};">{{ $p['status'] }}</span>
                        </td>
                        <td style="padding: 12px; border-bottom: 1px solid var(--q-border-color); color: var(--q-text-secondary); font-variant-numeric: tabular-nums;">{{ $p['due'] }}</td>
                        <td style="padding: 12px; border-bottom: 1px solid var(--q-border-color); font-weight: 700; color: var(--q-text-primary);">{{ $p['score'] !== null ? $p['score'] : '—' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </section>

    {{-- Two-column: Achievements + Live Sessions --}}
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--q-space-5); margin-bottom: var(--q-space-6);">

        {{-- Achievements --}}
        <section class="q-card" style="padding: var(--q-space-6);">
            <header style="margin-bottom: var(--q-space-4);">
                <h2 style="margin: 0; font-size: var(--q-font-lg); font-weight: 800; color: var(--q-text-primary);">شارات وإنجازات</h2>
                <p style="margin: 4px 0 0 0; font-size: var(--q-font-sm); color: var(--q-text-secondary);">ما حصدته من منجزات خلال رحلتك.</p>
            </header>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--q-space-3);">
                @foreach($achievements as $a)
                <div style="border: 1px solid var(--q-border-color); border-radius: var(--q-radius-lg); padding: var(--q-space-3); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 6px; background: var(--q-surface);">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(37,147,95,0.10); display: flex; align-items: center; justify-content: center; color: var(--q-primary);">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">{!! $achIcons[$a['icon']] ?? $achIcons['star'] !!}</svg>
                    </div>
                    <div style="font-size: var(--q-font-sm); font-weight: 700; color: var(--q-text-primary);">{{ $a['title'] }}</div>
                    <div style="font-size: var(--q-font-xs); color: var(--q-text-secondary); line-height: 1.5;">{{ $a['desc'] }}</div>
                    <div style="font-size: 10px; color: var(--q-text-secondary); margin-top: 2px; font-variant-numeric: tabular-nums;">{{ $a['awarded'] }}</div>
                </div>
                @endforeach
            </div>
        </section>

        {{-- Live Sessions --}}
        <section class="q-card" style="padding: var(--q-space-6);">
            <header style="margin-bottom: var(--q-space-4);">
                <h2 style="margin: 0; font-size: var(--q-font-lg); font-weight: 800; color: var(--q-text-primary);">جلسات قادمة</h2>
                <p style="margin: 4px 0 0 0; font-size: var(--q-font-sm); color: var(--q-text-secondary);">ورش وجلسات Q&A مباشرة مع مدربين معتمدين.</p>
            </header>
            <ul style="list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--q-space-3);">
                @foreach($sessions as $s)
                <li style="border: 1px solid var(--q-border-color); border-radius: var(--q-radius-lg); padding: var(--q-space-3) var(--q-space-4); background: var(--q-surface);">
                    <div style="display: flex; justify-content: space-between; align-items: start; gap: var(--q-space-3); flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 180px;">
                            <div style="font-size: var(--q-font-sm); font-weight: 700; color: var(--q-text-primary); margin-bottom: 4px;">{{ $s['title'] }}</div>
                            <div style="font-size: var(--q-font-xs); color: var(--q-text-secondary);">{{ $s['speaker'] }} · {{ $s['duration'] }}</div>
                        </div>
                        <div style="text-align: end;">
                            <div style="font-size: var(--q-font-sm); font-weight: 700; color: var(--q-primary); font-variant-numeric: tabular-nums;">{{ $s['date'] }}</div>
                            <div style="font-size: var(--q-font-xs); color: var(--q-text-secondary);">{{ $s['time'] }} · {{ $s['seats'] }} مقعد</div>
                        </div>
                    </div>
                </li>
                @endforeach
            </ul>
        </section>

    </div>

</div>
@endsection
