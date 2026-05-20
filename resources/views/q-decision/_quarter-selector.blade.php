{{-- Quarter selector — works on any Q-Decision page (keeps current route + params). --}}
@php
    $__routeName = \Illuminate\Support\Facades\Route::currentRouteName() ?: 'q-decision.recommendations';
    $__routeParams = request()->route() ? request()->route()->parameters() : [];
@endphp
<div class="ai-quarters">
    <span class="lbl">{{ __('messages.q_decision_view_quarter_data') }}</span>
    @foreach ($quarters as $key => $q)
        <a href="{{ route($__routeName, array_merge($__routeParams, ['q' => $key])) }}"
           class="ai-quarter-tab {{ $activeQuarter === $key ? 'active' : '' }}">
            <span class="qt">{{ $q['label'] }}</span>
            <span class="qr">{{ $q['range'] }}</span>
        </a>
    @endforeach
             <span class="demo-flag">{{ __('messages.q_decision_demo_data') }} </span>

</div>
