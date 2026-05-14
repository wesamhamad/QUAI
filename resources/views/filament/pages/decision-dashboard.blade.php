<x-filament-panels::page>
    @include('q-decision._dashboard-styles')

    {{-- Quarter selector --}}
    <div class="ai-quarters">
        <span class="lbl">عرض بيانات الربع:</span>
        @foreach ($quarters as $key => $q)
            <button type="button" wire:click="setQuarter('{{ $key }}')"
                    class="ai-quarter-tab {{ $activeQuarter === $key ? 'active' : '' }}">
                <span class="qt">{{ $q['label'] }}</span>
                <span class="qr">{{ $q['range'] }}</span>
            </button>
        @endforeach
                 <span class="demo-flag">بيانات تجريبية </span>

    </div>

    @if (!empty($section['subtitle']))
        <p style="font-size:.85rem;color:#6b7280;margin:-.5rem 0 0;">{{ $section['subtitle'] }}</p>
    @endif

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
                <div class="ai-chart-canvas-wrap"
                     wire:key="chart-{{ $chart['id'] }}-{{ $activeQuarter }}"
                     x-data="{ cfg: @js($chart) }"
                     x-init="$nextTick(() => window.qdRenderChart($refs.cv, cfg))">
                    <canvas x-ref="cv"></canvas>
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
            <span class="lbl">توصيات الذكاء الاصطناعي</span>
            <span class="cnt">{{ count($section['recommendations']) }} توصية</span>
        </div>
        @include('q-decision._rec-cards', ['recommendations' => $section['recommendations']])
    @endif

    @assets
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
        <script>
            window.qdRenderChart = function (canvas, cfg) {
                if (typeof Chart === 'undefined') { setTimeout(function () { window.qdRenderChart(canvas, cfg); }, 60); return; }
                if (canvas.__qdChart) { canvas.__qdChart.destroy(); }
                var type = cfg.type,
                    isH = type === 'horizontalBar', isS = type === 'stackedBar',
                    isC = type === 'doughnut' || type === 'pie', isR = type === 'radar';
                var opts = {
                    responsive: true, maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: isC || isR || (cfg.data.datasets && cfg.data.datasets.length > 1),
                            position: isC ? 'bottom' : 'top',
                            labels: { boxWidth: 12, padding: 12, font: { size: 11 } }
                        },
                        tooltip: { rtl: true }
                    }
                };
                if (isC) {
                    opts.cutout = type === 'doughnut' ? '60%' : 0;
                } else if (isR) {
                    opts.scales = { r: { ticks: { display: false }, pointLabels: { font: { size: 10 } } } };
                } else {
                    opts.indexAxis = isH ? 'y' : 'x';
                    opts.scales = {
                        x: { stacked: isS, grid: { display: !isH, color: '#f3f4f6' }, ticks: { font: { size: 10 } } },
                        y: { stacked: isS, grid: { display: isH, color: '#f3f4f6' }, beginAtZero: true, ticks: { font: { size: 10 } } }
                    };
                }
                var t = (type === 'horizontalBar' || type === 'stackedBar') ? 'bar' : type;
                canvas.__qdChart = new Chart(canvas, { type: t, data: cfg.data, options: opts });
            };
        </script>
    @endassets
</x-filament-panels::page>
