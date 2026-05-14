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

    <p style="font-size:.88rem;color:#6b7280;margin:-.5rem 0 0;">
        توصيات قابلة للتنفيذ مشتقة من لوحات المؤشرات الست — مصنّفة إلى ثلاث طبقات أولوية.
    </p>

    {{-- Priority legend --}}
    <div class="ai-kpis" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        @foreach ($priorityMeta as $key => $pmeta)
            <div class="ai-kpi">
                <div class="k-label" style="display:flex;align-items:center;gap:.4rem;">
                    <span style="width:.7rem;height:.7rem;border-radius:4px;background:{{ $pmeta['color'] }};"></span>
                    {{ $pmeta['label'] }}
                </div>
                <div class="k-hint" style="color:#6b7280;margin-top:.5rem;">{{ $pmeta['description'] }}</div>
            </div>
        @endforeach
    </div>

    @foreach ($sections as $section)
        <div class="fi-section" id="ai-{{ $section['id'] }}">
            <div class="fi-section-head">
                <span class="dot" style="background: {{ $section['accent'] }};"></span>
                <h2>{{ $section['dashboard'] }}</h2>
                <span class="count">{{ count($section['recommendations']) }} توصية</span>
            </div>
            @include('q-decision._rec-cards', ['recommendations' => $section['recommendations']])
        </div>
    @endforeach
</x-filament-panels::page>
