@extends('layouts.dashboard')

@section('title', 'سجلك الرقمي — طلاب الكلية')
@section('page-title', 'سجلك الرقمي')

@section('content')
<div class="dr-page" style="max-width: var(--q-content-max); margin: 0 auto;">

    <div class="q-card dr-hero" style="padding: var(--q-space-6); margin-bottom: var(--q-space-6); background: linear-gradient(135deg, #14573A 0%, #1B8354 100%); color: #fff; border-radius: var(--q-radius-2xl);">
        <h1 style="margin:0 0 var(--q-space-2) 0; font-size: var(--q-font-2xl); font-weight: 800;">السجل الرقمي للطلاب</h1>
        <p style="margin:0; opacity:.9;">اختر طالبًا لاستعراض سجله الرقمي وتحليل مهاراته مقابل سوق العمل.</p>
    </div>

    <form method="get" action="{{ route('digital-record.index') }}" class="dr-search" style="margin-bottom: var(--q-space-5); display: flex; flex-wrap: wrap; gap: var(--q-space-2); align-items: stretch;">
        <input
            type="text"
            name="q"
            value="{{ $query }}"
            placeholder="ابحث بالاسم أو رقم الطالب أو التخصص..."
            style="flex: 1 1 200px; min-width: 0; padding: var(--q-space-3) var(--q-space-4); border: 1px solid var(--q-border-color); border-radius: var(--q-radius-lg); font-size: var(--q-font-base);">
        <button type="submit" class="q-btn q-btn-primary" style="padding: var(--q-space-3) var(--q-space-5);">بحث</button>
        @if($query !== '')
            <a href="{{ route('digital-record.index') }}" class="q-btn" style="padding: var(--q-space-3) var(--q-space-5); background: var(--q-card-bg); border: 1px solid var(--q-border-color);">مسح</a>
        @endif
    </form>

    <div class="q-card dr-table-wrap" style="padding: 0; overflow-x: auto;">
        <table class="dr-table" style="width:100%; min-width: 640px; border-collapse: collapse; font-size: var(--q-font-sm);">
            <thead style="background: #F1F5F2;">
                <tr style="text-align: right;">
                    <th style="padding: var(--q-space-3) var(--q-space-4);">رقم الطالب</th>
                    <th style="padding: var(--q-space-3) var(--q-space-4);">الاسم</th>
                    <th style="padding: var(--q-space-3) var(--q-space-4);">الكلية</th>
                    <th style="padding: var(--q-space-3) var(--q-space-4);">التخصص</th>
                    <th style="padding: var(--q-space-3) var(--q-space-4);">المعدل</th>
                    <th style="padding: var(--q-space-3) var(--q-space-4);">المستوى</th>
                    <th style="padding: var(--q-space-3) var(--q-space-4);"></th>
                </tr>
            </thead>
            <tbody>
            @forelse($students as $s)
                <tr style="border-top: 1px solid var(--q-border-color);">
                    <td data-label="رقم الطالب" style="padding: var(--q-space-3) var(--q-space-4); font-family: monospace;" dir="ltr">{{ $s['student_id'] }}</td>
                    <td data-label="الاسم" style="padding: var(--q-space-3) var(--q-space-4); font-weight: 600;">{{ $s['name'] }}</td>
                    <td data-label="الكلية" style="padding: var(--q-space-3) var(--q-space-4);">{{ $s['faculty'] }}</td>
                    <td data-label="التخصص" style="padding: var(--q-space-3) var(--q-space-4);">{{ $s['major'] }}</td>
                    <td data-label="المعدل" style="padding: var(--q-space-3) var(--q-space-4); font-weight: 600; color: #14573A;">{{ number_format($s['gpa'], 2) }}</td>
                    <td data-label="المستوى" style="padding: var(--q-space-3) var(--q-space-4);">{{ $s['level'] }}</td>
                    <td data-action="1" style="padding: var(--q-space-3) var(--q-space-4); text-align: left;">
                        <a href="{{ route('digital-record.index', ['student_id' => $s['student_id']]) }}"
                           class="q-btn q-btn-primary"
                           style="padding: 6px 14px; font-size: var(--q-font-xs); text-decoration: none;">
                            عرض السجل الرقمي
                        </a>
                    </td>
                </tr>
            @empty
                <tr><td colspan="7" style="padding: var(--q-space-6); text-align: center; color: var(--q-text-secondary);">لا توجد نتائج للبحث.</td></tr>
            @endforelse
            </tbody>
        </table>
    </div>

    <p style="margin-top: var(--q-space-4); font-size: var(--q-font-xs); color: var(--q-text-secondary);">
        البيانات المعروضة بيانات تجريبية ثابتة للعرض فقط (لا يتم استدعاء أي خدمة خارجية).
    </p>
</div>
@endsection

@push('styles')
<style>
    @media (max-width: 640px) {
        .dr-hero { padding: var(--q-space-5) !important; }
        .dr-hero h1 { font-size: var(--q-font-xl) !important; }
        .dr-hero p { font-size: var(--q-font-sm) !important; }

        .dr-table-wrap { overflow-x: visible !important; }
        .dr-table { min-width: 0 !important; display: block !important; }
        .dr-table thead { display: none !important; }
        .dr-table tbody, .dr-table tr { display: block !important; width: 100% !important; }
        .dr-table tr { padding: var(--q-space-3) var(--q-space-4) !important; }
        .dr-table tr + tr { border-top: 1px solid var(--q-border-color) !important; }
        .dr-table td {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: var(--q-space-3) !important;
            padding: var(--q-space-1) 0 !important;
            text-align: right !important;
            border: none !important;
        }
        .dr-table td::before {
            content: attr(data-label);
            font-weight: 600;
            color: var(--q-text-secondary);
            font-size: var(--q-font-xs);
            flex-shrink: 0;
        }
        .dr-table td[data-action] {
            padding-top: var(--q-space-3) !important;
            justify-content: stretch !important;
        }
        .dr-table td[data-action]::before { content: none; }
        .dr-table td[data-action] a { width: 100%; text-align: center; }
    }
</style>
@endpush
