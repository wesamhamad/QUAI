{{--
    نافذة الموعد — «ما الذي جرى في هذا اللقاء؟».

    The card on the board says only when, who, and whether it happened. This
    window carries the rest: the meeting minutes, the recommendations that came
    out of it, the measured outcome, and the reason the engine picked this
    quarter-hour. Rendered only while an appointment is open; the refusal shape
    (found=false) is the same for out-of-scope and non-existent ids.

    Expects: $appt (array from AdvisingBoardData::appointment()), $fmt.
--}}
@php
    $found = (bool) ($appt['found'] ?? false);
    $held = $found && ($appt['held'] ?? false);
    $out = $found ? ($appt['outcome'] ?? null) : null;
    $recs = $found ? ($appt['recommendations'] ?? []) : [];
@endphp

<div class="pa-overlay" wire:click="closeAppointment" aria-hidden="true"></div>

<div class="pa-modal-wrap">
    <section class="pa-modal" role="dialog" aria-modal="true" aria-label="تفاصيل الموعد"
             x-data
             x-on:keydown.escape.window="$wire.closeAppointment()"
             x-init="$nextTick(() => $el.querySelector('.pa-x')?.focus())">
        <div class="drawer-head">
            <div style="min-width:0;">
                @if ($found)
                    <h3>{{ $held ? 'محضر الاجتماع والتوصيات' : 'تفاصيل الموعد' }}</h3>
                    <div class="mhead-sub">
                        {{ $appt['student_name'] ?: 'بلا اسم مسجّل' }}
                        · <span class="pa-code">{{ $appt['student_id'] }}</span>
                        · {{ $appt['trigger_label'] }}
                    </div>
                @else
                    <h3>موعد غير متاح</h3>
                @endif
            </div>
            <button type="button" class="pa-x" wire:click="closeAppointment" aria-label="إغلاق">✕</button>
        </div>

        @if (! $found)
            <div class="drawer-sec">
                <p class="drawer-empty">{{ $appt['reason'] }}</p>
            </div>
        @else
            {{-- ── متى ومع من ── --}}
            <div class="drawer-sec">
                <div class="m-time">
                    <span class="day">{{ $appt['day_label'] }}</span>
                    <span class="clock">{{ $appt['time'] }}–{{ $appt['ends'] }}</span>
                    <span class="date">{{ $appt['date'] }}</span>
                    @if ($held)
                        <span class="pill on">انتهى — انعقد {{ $appt['held_at'] }}</span>
                    @elseif ($appt['dispatched'])
                        <span class="pill on">أُرسل {{ $appt['dispatched_at'] }} — لم ينعقد بعد</span>
                    @else
                        <span class="pill muted">مجدول — لم يُرسل</span>
                    @endif
                </div>
                <dl class="m-grid">
                    <div>
                        <dt>المرشد</dt>
                        <dd>{{ $appt['advisor_name'] ?: $appt['advisor_employee_id'] }}
                            @if ($appt['advisor_name'])
                                <span class="pa-code" style="font-weight:400;">{{ $appt['advisor_employee_id'] }}</span>
                            @endif
                        </dd>
                    </div>
                    <div>
                        <dt>الطريقة</dt>
                        <dd>{{ $appt['mode_label'] }}{{ $appt['location'] ? ' · '.$appt['location'] : '' }}</dd>
                    </div>
                    <div>
                        <dt>المدة</dt>
                        <dd>{{ $appt['duration'] !== null ? $fmt($appt['duration']).' دقيقة' : '—' }}</dd>
                    </div>
                    <div>
                        <dt>المصدر</dt>
                        <dd>{{ $appt['origin_label'] }}</dd>
                    </div>
                    @if ($appt['join_url'])
                        <div>
                            <dt>رابط اللقاء</dt>
                            <dd><a href="{{ $appt['join_url'] }}" target="_blank" rel="noopener" style="color:var(--ok);">Teams ↗</a></dd>
                        </div>
                    @endif
                </dl>
            </div>

            {{-- ── محضر الاجتماع ── --}}
            <div class="drawer-sec">
                <h4>محضر الاجتماع</h4>
                @if ($appt['minutes'])
                    <p class="m-minutes">{{ $appt['minutes'] }}</p>
                @elseif ($held)
                    <p class="m-pending">انعقد اللقاء ولم يُدوَّن محضره بعد. يُكتب المحضر من المرشد بعد اللقاء ويظهر هنا فور حفظه.</p>
                @else
                    <p class="m-pending">لا محضر بعد — يُكتب المحضر بعد انعقاد اللقاء.</p>
                @endif
            </div>

            {{-- ── المخرجات كتوصيات ── --}}
            <div class="drawer-sec">
                <h4>المخرجات — التوصيات</h4>
                @if ($recs !== [])
                    <ol class="m-recs">
                        @foreach ($recs as $rec)
                            <li>{{ $rec }}</li>
                        @endforeach
                    </ol>
                @elseif ($held)
                    <p class="m-pending">لم تُسجَّل توصيات لهذا اللقاء بعد.</p>
                @else
                    <p class="m-pending">التوصيات تُسجَّل مع المحضر بعد انعقاد اللقاء.</p>
                @endif
            </div>

            {{-- ── الأثر المقيس ── --}}
            @if ($out !== null)
                <div class="drawer-sec">
                    <h4>الأثر المقيس <span class="pill muted" style="margin-inline-start:0.35rem;">قيس {{ $out['measured_at'] }}</span></h4>
                    <div class="m-outs">
                        <div class="m-out">
                            <div class="l">المعدل قبل</div>
                            <div class="v">{{ $out['gpa_before'] !== null ? number_format((float) $out['gpa_before'], 2) : '—' }}</div>
                        </div>
                        <div class="m-out">
                            <div class="l">المعدل بعد</div>
                            <div class="v">{{ $out['gpa_after'] !== null ? number_format((float) $out['gpa_after'], 2) : '—' }}</div>
                        </div>
                        <div class="m-out">
                            <div class="l">الفرق</div>
                            @php $d = $out['delta']; @endphp
                            <div class="v {{ $d === null ? '' : ($d > 0 ? 'up' : ($d < 0 ? 'down' : '')) }}">
                                {{ $d === null ? '—' : (($d > 0 ? '+' : '').number_format((float) $d, 2)) }}
                            </div>
                        </div>
                        <div class="m-out">
                            <div class="l">الإشارة</div>
                            <div class="v {{ $out['signal_resolved'] ? 'up' : '' }}">{{ $out['signal_resolved'] ? 'أُغلقت' : 'ما زالت مفتوحة' }}</div>
                        </div>
                    </div>
                    @if ($out['note'])
                        <div class="dmeta" style="margin-top:0.45rem;">{{ $out['note'] }}</div>
                    @endif
                </div>
            @endif

            {{-- ── لماذا هذا الوقت ── --}}
            <div class="drawer-sec">
                <h4>لماذا هذا الوقت</h4>
                <div class="ac-why {{ $appt['slot_reason'] ? '' : 'none' }}">
                    {{ $appt['slot_reason'] ?: 'لم يُسجَّل سبب مع هذا الموعد.' }}
                    @if ($appt['slot_score'])
                        <span class="pill muted">ترجيح {{ $appt['slot_score'] }}</span>
                    @endif
                </div>
            </div>

            <div class="drawer-sec m-foot">
                <span class="dmeta" style="margin:0;">الإجراءات الكاملة والخط الزمني في ملف الطالب.</span>
                <button type="button" class="rowbtn primary"
                        wire:click="openDossierFromAppointment('{{ $appt['student_id'] }}')">فتح ملف الطالب</button>
            </div>
        @endif
    </section>
</div>
