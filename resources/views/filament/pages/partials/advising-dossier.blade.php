{{--
    ملف الطالب — اللوح المنزلق الذي يجيب «ما الذي فعله النظام لهذا الطالب؟».

    Rendered only when a dossier is open. Everything here was already authorized
    in AdvisingBoardData::dossier() — a refused or unknown id arrives as the
    same found=false shape, so this partial never has to know why.

    Expects: $dossier (array), $fmt (int formatter), $sev (severity → pill class).
--}}
@php
    // لون كل قناة — البريد أزرق، المنصة بنفسجي، Teams برتقالي، والنظام رمادي.
    // Channel, not type, carries the color: two emails to two people are the
    // same kind of act, and the type is already named by its icon and label.
    $channelColor = [
        \App\Models\AdvisingAction::CHANNEL_EMAIL => 'var(--s2)',
        \App\Models\AdvisingAction::CHANNEL_PLATFORM => 'var(--s4)',
        \App\Models\AdvisingAction::CHANNEL_TEAMS => 'var(--s3)',
        \App\Models\AdvisingAction::CHANNEL_SYSTEM => 'var(--muted)',
    ];

    $typeIcon = [
        \App\Models\AdvisingAction::TYPE_SCHEDULED => 'heroicon-o-calendar',
        \App\Models\AdvisingAction::TYPE_TEAMS_CREATED => 'heroicon-o-video-camera',
        \App\Models\AdvisingAction::TYPE_EMAIL_STUDENT => 'heroicon-o-envelope',
        \App\Models\AdvisingAction::TYPE_EMAIL_ADVISOR => 'heroicon-o-envelope',
        \App\Models\AdvisingAction::TYPE_PLATFORM_NOTIFICATION => 'heroicon-o-bell',
        \App\Models\AdvisingAction::TYPE_RESCHEDULED => 'heroicon-o-arrow-path',
        \App\Models\AdvisingAction::TYPE_CANCELLED => 'heroicon-o-x-mark',
        \App\Models\AdvisingAction::TYPE_HELD => 'heroicon-o-check',
        \App\Models\AdvisingAction::TYPE_NO_SHOW => 'heroicon-o-user-minus',
        \App\Models\AdvisingAction::TYPE_OUTCOME_MEASURED => 'heroicon-o-chart-bar',
    ];

    // «تم» يُكتب مثل «فشل»: إخفاء النجاح وإظهار الفشل وحده يقلب القراءة.
    $statusPill = [
        \App\Models\AdvisingAction::STATUS_DONE => ['on', 'تم'],
        \App\Models\AdvisingAction::STATUS_FAILED => ['bad', 'فشل'],
        \App\Models\AdvisingAction::STATUS_SKIPPED => ['muted', 'تخطّي'],
    ];
@endphp

<div class="pa-overlay" wire:click="closeDossier" aria-hidden="true"></div>

<aside class="pa-drawer" role="dialog" aria-modal="true" aria-label="ملف الطالب"
       x-data
       x-on:keydown.escape.window="$wire.closeDossier()"
       x-init="$nextTick(() => $el.querySelector('.pa-x')?.focus())">
    <div class="drawer-head">
        <div>
            @if ($dossier['found'])
                <h3>{{ $dossier['student']['name'] ?: 'بلا اسم مسجّل' }}</h3>
                <div class="pa-code">{{ $dossier['student']['id'] }}</div>
            @else
                <h3>ملف غير متاح</h3>
            @endif
        </div>
        <button type="button" class="pa-x" wire:click="closeDossier" aria-label="إغلاق الملف">✕</button>
    </div>

    @if (! $dossier['found'])
        <div class="drawer-sec">
            {{-- صياغة واحدة للمرفوض وغير الموجود: من يجرّب أرقاماً لا يتعلم من الفرق --}}
            <p class="drawer-empty">{{ $dossier['reason'] }}</p>
        </div>
    @else
        @php $student = $dossier['student']; @endphp

        <div class="drawer-sec">
            <div class="dcard">
                <div><strong style="font-weight:800;">المرشد:</strong>
                    {{ $student['advisor_name'] ?: ($student['advisor_employee_id'] ?: 'غير محدّد') }}
                    @if ($student['advisor_name'] && $student['advisor_employee_id'])
                        <span class="pa-code">{{ $student['advisor_employee_id'] }}</span>
                    @endif
                </div>
                <div class="dmeta">
                    {{ $student['faculty'] ?: 'كلية غير مسجّلة' }}{{ $student['major'] ? ' · '.$student['major'] : '' }}
                </div>
                @unless ($student['advisor_schedulable'])
                    <div style="margin-top: 0.35rem;">
                        <span class="pill off">مرشد لم يدخل — لا جدولة</span>
                    </div>
                @endunless
            </div>
        </div>

        <div class="drawer-sec">
            <h4>الإشارات ({{ $fmt(count($dossier['signals'])) }})</h4>
            @if ($dossier['signals'] === [])
                <p class="drawer-empty">لا إشارات مسجّلة لهذا الطالب في هذا الفصل.</p>
            @else
                @foreach ($dossier['signals'] as $i => $signal)
                    <div class="dcard" wire:key="dsig-{{ $i }}">
                        <span class="pa-code">{{ $signal['code'] }}</span>
                        <strong style="font-weight:800;">{{ $signal['label'] }}</strong>
                        <span class="pill {{ $sev($signal['severity']) }}">{{ $signal['severity_label'] }}</span>
                        @if ($signal['resolved'])
                            <span class="pill on">أُغلقت{{ $signal['resolution'] ? ' — '.$signal['resolution'] : '' }}</span>
                        @endif
                        @if ($signal['demo'] ?? false)
                            <span class="pill" title="إشارة مشتقّة من رصد الفصل الجاري على هذا الخادم — الفصل نفسه لم يُمسح بعد">تجريبي</span>
                        @endif
                        <div class="dmeta">رُصدت {{ $signal['detected_at'] ?: '—' }}</div>
                        {{-- الجملة نفسها التي تحملها البطاقة، كلمةً بكلمة — رأيان في
                             ملفٍ واحد يجعلان القارئ يشكّ في كليهما --}}
                        <div style="margin-top: 0.35rem; font-size: 0.8rem; font-weight: 700; line-height: 1.7; color: var(--ink);">
                            {{ $signal['summary']['headline'] }}
                        </div>
                        @if ($signal['summary']['details'] !== [])
                            <div class="sig-det" style="margin: 0.4rem 0 0;">
                                @foreach ($signal['summary']['details'] as $row)
                                    <div class="row">
                                        <span class="k">
                                            @if ($row['code'])
                                                <span class="pa-code">{{ $row['code'] }}</span>
                                            @endif
                                            {{ $row['label'] }}
                                        </span>
                                        @if ($row['value'] !== '')
                                            <span class="val">{{ $row['value'] }}</span>
                                        @endif
                                    </div>
                                @endforeach
                            </div>
                        @endif
                    </div>
                @endforeach
            @endif
        </div>

        <div class="drawer-sec">
            <h4>المواعيد ({{ $fmt(count($dossier['appointments'])) }})</h4>
            @if ($dossier['appointments'] === [])
                <p class="drawer-empty">
                    لم يُحجز موعد لهذا الطالب في هذا الفصل بعد.
                    @unless ($student['advisor_schedulable'])
                        مرشده معروف بمفتاح مؤقت فلا جدول له يُطابق — يُحل ذلك فور دخول المرشد.
                    @endunless
                </p>
            @else
                @foreach ($dossier['appointments'] as $ap)
                    <div class="dcard" wire:key="dapt-{{ $ap['id'] }}">
                        <strong style="font-weight:800; font-variant-numeric: tabular-nums;">
                            {{ $ap['day_label'] }} {{ $ap['date'] }} · {{ $ap['time'] }}–{{ $ap['ends'] }}
                        </strong>
                        <span class="pill {{ $ap['held'] ? 'on' : ($ap['dispatched'] ? 'on' : 'muted') }}">{{ $ap['status_label'] }}</span>
                        <div class="dmeta">{{ $ap['mode_label'] }}{{ $ap['location'] ? ' · '.$ap['location'] : '' }} · {{ $ap['origin_label'] }}</div>
                        <div class="dmeta"><strong style="font-weight:700; color:var(--ink);">لماذا هذا الوقت:</strong> {{ $ap['slot_reason'] ?: 'لم يُسجَّل سبب مع هذا الموعد.' }}</div>
                        <div class="dmeta">
                            @if ($ap['dispatched'])
                                أُرسل {{ $ap['dispatched_at'] }}
                            @else
                                محسوب فقط — لم يُرسل بعد
                            @endif
                            @if ($ap['held'])
                                · انعقد {{ $ap['held_at'] ?: '' }}
                            @endif
                        </div>
                    </div>
                @endforeach
            @endif
        </div>

        <div class="drawer-sec">
            <h4>سجل الإجراءات ({{ $fmt(count($dossier['actions'])) }})</h4>
            @if (! $dossier['actions_available'])
                <p class="drawer-empty">
                    سجل الإجراءات غير منشأ على هذه النسخة — شغّل
                    <span class="pa-code">php artisan migrate</span>.
                    الفراغ هنا نقص جدول لا دليل على أن النظام لم يفعل شيئاً.
                </p>
            @elseif ($dossier['actions'] === [])
                <p class="drawer-empty">لم تُسجَّل إجراءات لهذا الطالب بعد.</p>
            @else
                <ol class="tl">
                    @foreach ($dossier['actions'] as $i => $action)
                        <li class="tl-item {{ $action['status'] === \App\Models\AdvisingAction::STATUS_FAILED ? 'failed' : '' }}" wire:key="dact-{{ $i }}">
                            <span class="tl-dot" style="--tlc: {{ $channelColor[$action['channel']] ?? 'var(--muted)' }};" aria-hidden="true">
                                {{ svg($typeIcon[$action['type']] ?? 'heroicon-o-bolt') }}
                            </span>
                            @php [$pillClass, $pillLabel] = $statusPill[$action['status']] ?? ['muted', $action['status']]; @endphp
                            <div class="tl-head">
                                {{ $action['label'] }}
                                <span class="pill {{ $pillClass }}">{{ $pillLabel }}</span>
                            </div>
                            <div class="tl-meta">
                                @if ($action['recipient'])
                                    إلى <span class="pa-code">{{ $action['recipient'] }}</span> ·
                                @endif
                                {{ $action['performed_human'] }} — {{ $action['performed_at'] }}
                            </div>
                            @if ($action['detail'])
                                <div class="tl-detail">{{ $action['detail'] }}</div>
                            @endif
                        </li>
                    @endforeach
                </ol>
            @endif
        </div>

        @if ($dossier['outcome'] !== null)
            @php $o = $dossier['outcome']; @endphp
            <div class="drawer-sec">
                <h4>الأثر</h4>
                <div class="dcard">
                    @if ($o['gpa_before'] !== null && $o['gpa_after'] !== null)
                        <div class="tl-head" style="font-variant-numeric: tabular-nums;">
                            المعدل قبل: {{ number_format($o['gpa_before'], 2) }} · بعد: {{ number_format($o['gpa_after'], 2) }}
                            <span style="color: {{ $o['delta'] > 0 ? 'var(--ok)' : ($o['delta'] < 0 ? 'var(--bad)' : 'var(--muted)') }};">
                                {{ $o['delta'] > 0 ? '↑' : ($o['delta'] < 0 ? '↓' : '=') }}
                                {{ ($o['delta'] > 0 ? '+' : '').$o['delta'] }}
                            </span>
                        </div>
                    @else
                        <div class="dmeta">لا معدلان مسجّلان قبل اللقاء وبعده.</div>
                    @endif
                    <div style="margin-top: 0.4rem;">
                        @if ($o['signal_resolved'])
                            <span class="pill on">زال سبب الإشارة</span>
                        @else
                            <span class="pill muted">الإشارة ما تزال مفتوحة</span>
                        @endif
                        @if ($o['registered_after'])
                            <span class="pill on">سجّل بعد اللقاء</span>
                        @endif
                    </div>
                    <div class="dmeta">قِيس في {{ $o['measured_at'] ?: '—' }}</div>
                </div>
            </div>
        @endif
    @endif
</aside>
