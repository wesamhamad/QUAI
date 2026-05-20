@extends('layouts.dashboard')

@section('title', $meta['title'] . ' - QUAI')
@section('page-title', $meta['title'])
@section('content-class', 'q-content fi-bg')

@push('styles')
    @include('q-decision._dashboard-styles')
@endpush

@section('content')
<div class="ai-page">
    <div class="fi-header">
        <h1>{{ $meta['title'] }}</h1>
        <p>{{ $section['subtitle'] ?? __('messages.q_decision_dashboard_subtitle') }}</p>
    </div>

    @include('q-decision._quarter-selector')

    {{-- Stats overview --}}
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
    @endif

    {{-- AI recommendations for this dashboard --}}
    @if ($section)
        <div class="ai-recs-head">
            <span class="dot"></span>
            <span class="lbl">{{ __('messages.q_decision_ai_recommendations') }}</span>
            <span class="cnt">{{ count($section['recommendations']) }} {{ __('messages.q_decision_recommendation_unit') }}</span>
        </div>
        @include('q-decision._rec-cards', ['recommendations' => $section['recommendations']])
    @endif
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
    Chart.defaults.color = '#6b7280';

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
                    labels: { boxWidth: 12, padding: 12, font: { size: 11 } }
                },
                tooltip: { rtl: true, bodyFont: { size: 11 }, titleFont: { size: 11 } }
            }
        };

        if (isCircular) {
            opts.cutout = type === 'doughnut' ? '60%' : 0;
        } else if (isRadar) {
            opts.scales = { r: { ticks: { display: false }, pointLabels: { font: { size: 10 } } } };
        } else {
            opts.indexAxis = isHorizontal ? 'y' : 'x';
            opts.scales = {
                x: { stacked: isStacked, grid: { display: !isHorizontal, color: '#f3f4f6' }, ticks: { font: { size: 10 } } },
                y: { stacked: isStacked, grid: { display: isHorizontal, color: '#f3f4f6' }, beginAtZero: true, ticks: { font: { size: 10 } } }
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
