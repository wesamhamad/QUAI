{{-- Renders a grid of AI recommendation cards. Expects: $recommendations, $priorityMeta --}}
@if (count($recommendations) === 0)
    <div class="ai-empty">لا توجد توصيات قابلة للتنفيذ في هذه اللوحة حالياً — البيانات ضمن المعدّل المتوقع.</div>
@else
    <div class="ai-recs">
        @foreach ($recommendations as $rec)
            @php $pm = $priorityMeta[$rec['priority']] ?? $priorityMeta['strategic']; @endphp
            <article class="ai-rec {{ empty($rec['quote']) ? '' : 'has-quote' }}">
                <div class="ai-rec-head">
                    @if (! empty($rec['quote']))
                        <span class="voice-tag">
                            <span class="pulse"></span>
                            مرشح بواسطة الذكاء الاصطناعي · صوت طالب
                        </span>
                    @else
                        <span class="ai-rec-tag" style="background: {{ $pm['bg'] }}; color: {{ $pm['color'] }};">
                            {{ $pm['label'] }}
                        </span>
                    @endif
                    @if (! empty($rec['metric']))
                        <span class="ai-rec-metric">{{ $rec['metric'] }}</span>
                    @endif
                </div>

                <h3>{{ $rec['title'] }}</h3>

                @if (! empty($rec['quote']))
                    <div class="quote-card">
                        <div class="qc-head">
                            <span class="qc-status">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                بانتظار التنفيذ
                            </span>
                        </div>
                        <div class="qc-body">{{ $rec['quote']['body'] }}</div>
                        <div class="qc-foot">
                            <span class="qc-reacts">
                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                                </svg>
                                {{ number_format($rec['quote']['reactions']) }}
                            </span>
                            <span>
                                <span class="qc-author">{{ $rec['quote']['author'] }}</span>
                                @if (! empty($rec['quote']['date']))· {{ $rec['quote']['date'] }}@endif
                            </span>
                        </div>
                    </div>
                @endif

                <div class="field"><strong>الملاحظة</strong> {{ $rec['observation'] }}</div>
                <div class="field"><strong>التوصية</strong> {{ $rec['action'] }}</div>
                <div class="field"><strong>الأثر المتوقع</strong> {{ $rec['impact'] }}</div>
            </article>
        @endforeach
    </div>
@endif
