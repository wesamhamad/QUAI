{{--
    شريط الترقيم — one component for both long lists.

    Expects: $pg (items/total/page/per_page/last_page), $anchor (id of the grid
    to scroll back to), $unit (Arabic noun for the range line), $fmt.

    Direction: the page is RTL, so «التالي» sits on the left and its arrow
    points LEFT — a right-pointing "next" here would point at the previous page.
    Disabled ends carry aria-disabled and are real <button>s so focus order does
    not jump when the reader reaches the last page.
--}}
@php
    $from = $pg['total'] === 0 ? 0 : (($pg['page'] - 1) * $pg['per_page']) + 1;
    $to = min($pg['total'], $pg['page'] * $pg['per_page']);
    $atStart = $pg['page'] <= 1;
    $atEnd = $pg['page'] >= $pg['last_page'];
    $scroll = "\$nextTick(() => { const el = document.getElementById('{$anchor}'); if (el) el.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); })";
@endphp
<nav class="pager {{ $pos }}" aria-label="ترقيم {{ $unit }}" wire:key="pager-{{ $anchor }}-{{ $pos }}">
    <span class="pager-range">
        <b>{{ $fmt($from) }}–{{ $fmt($to) }}</b> من {{ $fmt($pg['total']) }} {{ $unit }}
        @if ($pg['last_page'] > 1)
            <span class="pager-pages">· صفحة {{ $fmt($pg['page']) }} من {{ $fmt($pg['last_page']) }}</span>
        @endif
    </span>

    <span class="pager-ctl">
        <label class="sr-only" for="pager-per-{{ $anchor }}-{{ $pos }}">عدد البطاقات في الصفحة</label>
        <select id="pager-per-{{ $anchor }}-{{ $pos }}" class="pa-select pager-per" wire:model.live="perPage" aria-label="عدد البطاقات في الصفحة">
            @foreach ($this->perPageOptions() as $n)
                <option value="{{ $n }}" @selected($n === $this->perPage)>{{ $fmt($n) }} في الصفحة</option>
            @endforeach
        </select>

        <span class="pager-btns" role="group" aria-label="التنقّل بين الصفحات">
            <button type="button" class="pager-btn"
                    wire:click="previousPage" x-on:click="{{ $scroll }}"
                    aria-label="الصفحة السابقة" aria-disabled="{{ $atStart ? 'true' : 'false' }}"
                    @disabled($atStart)>
                {{-- RTL: previous is to the right, so the chevron points right --}}
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M8 5l5 5-5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button type="button" class="pager-btn"
                    wire:click="nextPage" x-on:click="{{ $scroll }}"
                    aria-label="الصفحة التالية" aria-disabled="{{ $atEnd ? 'true' : 'false' }}"
                    @disabled($atEnd)>
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12 5l-5 5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </span>
    </span>
</nav>
