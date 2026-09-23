{{--
    أعداد الفصل من نظام SIS — a single request to qu-api v1/advising/summary.

    University-wide (or one faculty's) counts of students straight from the
    source tables — NOT the signals this board raised for the caseload in
    scope. Labelled as such so nobody reads 26,743 as «our students».

    Expects: $sis (AdvisingBoardData::sisSummary()), $fmt, $semester.
--}}
<section class="pa-card sis" aria-label="أعداد الفصل من نظام SIS">
    <div class="pa-card-head sis-head">
        <div>
            <h3>أعداد الفصل {{ $semester }} من نظام SIS</h3>
            <p>
                عدد الطلاب على مستوى الجامعة كما هو في المصدر — طلب واحد، لا مسح.
                @if ($sis['ok'] && $sis['as_of'])
                    <span class="pa-code">{{ \Illuminate\Support\Str::of($sis['as_of'])->substr(0, 16)->replace('T', ' ') }}</span>
                @endif
            </p>
        </div>
        @if ($sis['ok'])
            <span class="pill on">{{ $fmt($sis['students']) }} طالباً في السجل</span>
        @endif
    </div>
    <div class="pa-card-body">
        @if (! $sis['ok'])
            <div class="pa-empty" style="text-align:start; padding:0.8rem 0.6rem;">
                <strong style="color:var(--warn);">غير متاح</strong> — {{ $sis['reason'] }}
            </div>
        @else
            <div class="sis-grid">
                @foreach ($sis['tiles'] as $tile)
                    <div class="sis-tile" wire:key="sis-{{ $tile['key'] }}">
                        <div class="v">{{ $fmt($tile['value']) }}</div>
                        <div class="l">{{ $tile['label'] }}</div>
                        <div class="h">{{ $tile['hint'] }}</div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</section>
