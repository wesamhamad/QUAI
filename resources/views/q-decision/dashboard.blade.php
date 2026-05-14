@extends('layouts.dashboard')

@section('title', $meta['title'] . ' - QUAI')
@section('page-title', $meta['title'])

@push('styles')
    @include('q-decision._dashboard-styles')
@endpush

@section('content')
<div class="ai-page">
    <div class="ai-hero">
        <span class="ai-tag">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 13h2l2 5 4-13 3 8 2-4h5"/>
            </svg>
            لوحة مؤشرات · {{ $quarters[$activeQuarter]['label'] }} {{ $quarters[$activeQuarter]['range'] }}
        </span>
        <h1>{{ $meta['title'] }}</h1>
        <p>{{ $section['subtitle'] ?? 'لوحة مؤشرات تفاعلية — اختر الربع لعرض بياناته.' }}</p>
    </div>

    @include('q-decision._quarter-selector')

    <section class="ai-section">
        <div class="ai-section-head">
            <div class="ai-section-icon" style="background: {{ $meta['accent'] }};">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="{{ $meta['icon'] }}"/>
                </svg>
            </div>
            <div class="ai-section-meta">
                <span class="dash-tag">لوحة مؤشرات</span>
                <h2>{{ $meta['title'] }}</h2>
                <div class="subtitle">{{ $section['subtitle'] ?? '' }}</div>
            </div>
            <span class="ai-section-q">{{ $quarters[$activeQuarter]['label'] }} · {{ $quarters[$activeQuarter]['range'] }}</span>
        </div>

        {{-- KPI cards --}}
        <div class="ai-kpis">
            @foreach ($data['kpis'] as $kpi)
                <div class="ai-kpi kpi-{{ $kpi['tone'] }}">
                    <div class="k-label">{{ $kpi['label'] }}</div>
                    <div class="k-value">{{ $kpi['value'] }}@if(!empty($kpi['unit']))<span class="k-unit">{{ $kpi['unit'] }}</span>@endif</div>
                    <div class="k-hint">{{ $kpi['hint'] }}</div>
                </div>
            @endforeach
        </div>

        {{-- Charts --}}
        <div class="ai-charts">
            @foreach ($data['charts'] as $chart)
                <div class="ai-chart-card {{ !empty($chart['full']) ? 'full' : '' }}">
                    <h4>{{ $chart['title'] }}</h4>
                    @if (!empty($chart['subtitle']))<div class="c-sub">{{ $chart['subtitle'] }}</div>@endif
                    <div class="ai-chart-canvas-wrap">
                        <canvas id="chart-{{ $chart['id'] }}"></canvas>
                    </div>
                </div>
            @endforeach
        </div>

        {{-- Data table --}}
        @if (!empty($data['table']))
            <div class="ai-table-wrap">
                <div class="ai-table-card">
                    <div class="t-head">{{ $data['table']['title'] }}</div>
                    <table class="ai-table">
                        <thead>
                            <tr>
                                @foreach ($data['table']['columns'] as $col)
                                    <th>{{ $col }}</th>
                                @endforeach
                            </tr>
                        </thead>
                        <tbody>
                            @foreach ($data['table']['rows'] as $row)
                                <tr>
                                    @foreach ($row as $cell)
                                        <td>{{ $cell }}</td>
                                    @endforeach
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        @endif

        {{-- AI recommendations for this dashboard --}}
        @if ($section)
            <div class="ai-recs-head">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span class="lbl">توصيات الذكاء الاصطناعي</span>
                <span class="cnt">{{ count($section['recommendations']) }} توصية</span>
            </div>
            @include('q-decision._rec-cards', ['recommendations' => $section['recommendations']])
        @endif
    </section>
</div>
@endsection

@push('scripts')
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<script>
(function () {
    var configs = @json($data['charts'], JSON_UNESCAPED_UNICODE);
    if (typeof Chart === 'undefined') return;

    Chart.defaults.font.family = "'IBM Plex Sans Arabic', sans-serif";
    Chart.defaults.font.size = 11;
    Chart.defaults.color = '#64748b';

    function buildOptions(cfg) {
        var type = cfg.type;
        var isHorizontal = type === 'horizontalBar';
        var isStacked = type === 'stackedBar';
        var isCircular = type === 'doughnut' || type === 'pie';
        var isRadar = type === 'radar';

        var opts = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: isCircular || isRadar || (cfg.data.datasets && cfg.data.datasets.length > 1),
                    position: isCircular ? 'bottom' : 'top',
                    labels: { boxWidth: 12, padding: 10, font: { size: 10 } }
                },
                tooltip: { rtl: true, bodyFont: { size: 11 }, titleFont: { size: 11 } }
            }
        };

        if (isCircular) {
            opts.cutout = type === 'doughnut' ? '58%' : 0;
        } else if (isRadar) {
            opts.scales = { r: { ticks: { display: false }, pointLabels: { font: { size: 10 } } } };
        } else {
            opts.indexAxis = isHorizontal ? 'y' : 'x';
            opts.scales = {
                x: { stacked: isStacked, grid: { display: !isHorizontal, color: '#f1f5f9' }, ticks: { font: { size: 10 } } },
                y: { stacked: isStacked, grid: { display: isHorizontal, color: '#f1f5f9' }, beginAtZero: true, ticks: { font: { size: 10 } } }
            };
        }
        return opts;
    }

    function chartType(t) {
        if (t === 'horizontalBar' || t === 'stackedBar') return 'bar';
        return t;
    }

    configs.forEach(function (cfg) {
        var el = document.getElementById('chart-' + cfg.id);
        if (!el) return;
        try {
            new Chart(el, { type: chartType(cfg.type), data: cfg.data, options: buildOptions(cfg) });
        } catch (e) {
            console.error('chart init failed: ' + cfg.id, e);
        }
    });
})();
</script>
@endpush
