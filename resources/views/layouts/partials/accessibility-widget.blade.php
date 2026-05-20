{{-- Floating accessibility & contact widget. Rendered on every page that
     extends layouts/dashboard.blade.php. Users can dismiss it; the choice is
     persisted in localStorage as `quai-a11y-hidden`. --}}
<div id="qA11yWidget" class="q-a11y" aria-label="{{ __('messages.a11y_widget_label') }}" hidden>
    <button type="button" class="q-a11y__btn" id="qA11yToggle"
            aria-label="{{ __('messages.a11y_open_panel') }}" aria-expanded="false" aria-controls="qA11yPanel">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="4" r="2"/>
            <path d="M19 8l-7 2-7-2"/>
            <path d="M12 10v5"/>
            <path d="M9 20l3-5 3 5"/>
        </svg>
    </button>
    <a class="q-a11y__btn" href="tel:+966163011111" aria-label="{{ __('messages.a11y_call_us') }} +966 16 301 1111">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
    </a>
    <a class="q-a11y__btn" href="https://www.qu.edu.sa/contact-us/" target="_blank" rel="noopener noreferrer" aria-label="{{ __('messages.a11y_email_us') }}">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2"/>
            <path d="M3 7l9 6 9-6"/>
        </svg>
    </a>
    <button type="button" class="q-a11y__close" id="qA11yClose" aria-label="{{ __('messages.a11y_hide_widget') }}">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18"/>
        </svg>
    </button>
</div>

<div id="qA11yPanel" class="q-a11y-panel" role="dialog" aria-label="{{ __('messages.a11y_panel_title') }}" hidden>
    <div class="q-a11y-panel__top">
        <button type="button" class="q-a11y-panel__icon" id="qA11yPanelClose" aria-label="{{ __('messages.close') }}" title="{{ __('messages.close') }}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
        <div class="q-a11y-panel__top-actions">
            <button type="button" class="q-a11y-panel__icon q-a11y-panel__icon--brand" data-a11y="speak-page" aria-label="{{ __('messages.a11y_text_to_speech') }}" title="{{ __('messages.a11y_text_to_speech') }}">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H3v6h3l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>
            </button>
            <button type="button" class="q-a11y-panel__icon" data-a11y="reset" aria-label="{{ __('messages.a11y_settings') }}" title="{{ __('messages.a11y_settings') }}">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
            </button>
            <button type="button" class="q-a11y-panel__icon" data-a11y="dark" aria-pressed="false" aria-label="{{ __('messages.a11y_dark_mode') }}" title="{{ __('messages.a11y_dark_mode') }}">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
        </div>
        <div class="q-a11y-panel__lang">
            <span>{{ __('messages.a11y_language') }}</span>
            <span class="q-a11y-panel__lang-dot"></span>
        </div>
    </div>
    <h3 class="q-a11y-panel__title">{{ __('messages.a11y_panel_title') }}</h3>
    <p class="q-a11y-panel__section">{{ __('messages.a11y_section_reading') }}</p>
    <div class="q-a11y-panel__grid">
        <button type="button" class="q-a11y-tile" data-a11y="line-spacing" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/><path d="M2 4v16M22 4v16"/></svg>
            <span>{{ __('messages.a11y_line_spacing') }}</span>
        </button>
        <button type="button" class="q-a11y-tile" data-a11y="text-align" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 10h10M4 14h16M4 18h10"/></svg>
            <span>{{ __('messages.a11y_text_align') }}</span>
        </button>
        <button type="button" class="q-a11y-tile" data-a11y="font-cycle" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><text x="4" y="17" font-size="14" font-family="serif" font-weight="700" fill="currentColor" stroke="none">T</text><path d="M14 8v8M11 11h6"/></svg>
            <span>{{ __('messages.a11y_text_size') }}</span>
        </button>
        <button type="button" class="q-a11y-tile" data-a11y="word-spacing" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><text x="2" y="16" font-size="10" font-family="sans-serif" font-weight="700" fill="currentColor" stroke="none">a</text><text x="14" y="16" font-size="10" font-family="sans-serif" font-weight="700" fill="currentColor" stroke="none">b</text><path d="M9 11v3M13 11v3"/></svg>
            <span>{{ __('messages.a11y_word_spacing') }}</span>
        </button>
        <button type="button" class="q-a11y-tile" data-a11y="letter-spacing" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><text x="3" y="16" font-size="10" font-family="sans-serif" font-weight="700" fill="currentColor" stroke="none">A V</text></svg>
            <span>{{ __('messages.a11y_letter_spacing') }}</span>
        </button>
        <button type="button" class="q-a11y-tile" data-a11y="readable-font" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><text x="3" y="17" font-size="13" font-family="sans-serif" font-weight="700" fill="currentColor" stroke="none">Aa</text></svg>
            <span>{{ __('messages.a11y_readable_font') }}</span>
        </button>
        <button type="button" class="q-a11y-tile" data-a11y="highlight-links" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
            <span>{{ __('messages.a11y_highlight_links') }}</span>
        </button>
        <button type="button" class="q-a11y-tile" data-a11y="highlight-headings" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><text x="4" y="17" font-size="14" font-family="sans-serif" font-weight="700" fill="currentColor" stroke="none">T</text></svg>
            <span>{{ __('messages.a11y_highlight_headings') }}</span>
        </button>
        <button type="button" class="q-a11y-tile" data-a11y="dyslexia-font" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><text x="2" y="17" font-size="13" font-family="serif" font-weight="700" fill="currentColor" stroke="none">Aa</text></svg>
            <span>{{ __('messages.a11y_dyslexia_font') }}</span>
        </button>
    </div>
    <p class="q-a11y-panel__section">{{ __('messages.a11y_section_visual') }}</p>
    <div class="q-a11y-panel__grid">
        <button type="button" class="q-a11y-tile" data-a11y="contrast" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3v18" fill="currentColor"/></svg>
            <span>{{ __('messages.a11y_high_contrast') }}</span>
        </button>
        <button type="button" class="q-a11y-tile" data-a11y="grayscale" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c-3 5-5 8-5 11a5 5 0 0 0 10 0c0-3-2-6-5-11z"/><path d="M7 8l10 8"/></svg>
            <span>{{ __('messages.a11y_grayscale') }}</span>
        </button>
        <button type="button" class="q-a11y-tile" data-a11y="saturation" aria-pressed="false">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/></svg>
            <span>{{ __('messages.a11y_saturation') }}</span>
        </button>
    </div>
    <div class="q-a11y-panel__foot">
        <button type="button" class="q-a11y-panel__foot-btn" id="qA11yPanelHide">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.77 19.77 0 0 1 4.22-5.16"/><path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a19.77 19.77 0 0 1-3.17 4.19"/><path d="M1 1l22 22"/></svg>
            <span>{{ __('messages.a11y_hide_widget') }}</span>
        </button>
        <button type="button" class="q-a11y-panel__foot-btn q-a11y-panel__foot-btn--primary" data-a11y="reset">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>
            <span>{{ __('messages.a11y_reset_all') }}</span>
        </button>
    </div>
</div>

<button type="button" id="qA11yRestore" class="q-a11y-restore" hidden aria-label="{{ __('messages.a11y_show_widget') }}">
    {{ __('messages.a11y_show_widget') }}
</button>

<style>
    .q-a11y{position:fixed;top:50%;inset-inline-end:14px;transform:translateY(-50%);z-index:9998;background:#fff;border-radius:28px;box-shadow:0 6px 22px rgba(0,0,0,.12),0 0 0 1px rgba(0,0,0,.04);padding:10px 6px;display:flex;flex-direction:column;align-items:center;gap:6px}
    .q-a11y__btn{width:44px;height:44px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:transparent;border:0;color:var(--q-primary,#25935F);cursor:pointer;text-decoration:none;transition:background .15s ease,transform .15s ease}
    .q-a11y__btn:hover,.q-a11y__btn:focus-visible{background:rgba(37,147,95,.10);outline:none}
    .q-a11y__btn:focus-visible{box-shadow:0 0 0 2px var(--q-primary,#25935F)}
    .q-a11y__close{margin-top:2px;width:22px;height:22px;border-radius:50%;border:0;background:#f1f5f9;color:#475569;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
    .q-a11y__close:hover{background:#e2e8f0;color:#0f172a}
    .q-a11y-restore{position:fixed;inset-inline-end:14px;bottom:14px;z-index:9998;background:var(--q-primary,#25935F);color:#fff;border:0;border-radius:999px;padding:8px 14px;font-size:13px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.18)}
    .q-a11y-restore:hover{filter:brightness(.95)}

    /* ===== Comprehensive panel ===== */
    .q-a11y-panel{position:fixed;top:0;inset-inline-start:0;height:100vh;width:340px;max-width:92vw;z-index:9999;background:#fff;box-shadow:0 10px 40px rgba(0,0,0,.18),0 0 0 1px rgba(0,0,0,.04);padding:14px 16px 16px;font-family:inherit;color:#0f172a;display:flex;flex-direction:column;gap:10px;overflow-y:auto}
    .q-a11y-panel__top{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-bottom:8px;border-bottom:1px solid #e2e8f0}
    .q-a11y-panel__top-actions{display:flex;align-items:center;gap:4px}
    .q-a11y-panel__icon{width:34px;height:34px;border-radius:50%;border:0;background:transparent;color:#334155;display:inline-flex;align-items:center;justify-content:center;cursor:pointer}
    .q-a11y-panel__icon:hover{background:#f1f5f9}
    .q-a11y-panel__icon--brand{background:var(--q-primary,#25935F);color:#fff}
    .q-a11y-panel__icon--brand:hover{background:var(--q-primary-dark,#1B8354)}
    .q-a11y-panel__icon[aria-pressed="true"]{background:var(--q-primary,#25935F);color:#fff}
    .q-a11y-panel__lang{display:inline-flex;align-items:center;gap:6px;font-size:13px;color:#334155}
    .q-a11y-panel__lang-dot{width:14px;height:14px;border-radius:50%;background:var(--q-primary,#25935F);display:inline-block}
    .q-a11y-panel__title{margin:6px 0 0;font-size:15px;font-weight:700;text-align:start;color:#0f172a}
    .q-a11y-panel__section{margin:6px 0 4px;font-size:12px;color:#64748b;text-align:start}
    .q-a11y-panel__grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    .q-a11y-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:10px 6px;min-height:84px;border:1px solid #e2e8f0;background:#f8fafc;border-radius:10px;cursor:pointer;color:#0f172a;text-align:center;transition:background .15s ease,border-color .15s ease,color .15s ease}
    .q-a11y-tile svg{width:24px;height:24px;color:var(--q-primary,#25935F);fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
    .q-a11y-tile span{font-size:11px;line-height:1.2;color:#334155}
    .q-a11y-tile:hover{background:#f1f5f9;border-color:#cbd5e1}
    .q-a11y-tile[aria-pressed="true"]{background:#DFF6E7;border-color:var(--q-primary,#25935F)}
    .q-a11y-tile[aria-pressed="true"] span{color:var(--q-primary-dark,#1B8354);font-weight:600}
    .q-a11y-panel__foot{margin-top:auto;padding-top:10px;border-top:1px solid #e2e8f0;display:flex;gap:8px}
    .q-a11y-panel__foot-btn{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:6px;background:#fff;border:1px solid var(--q-primary,#25935F);color:var(--q-primary,#25935F);border-radius:8px;padding:8px 10px;font-size:12px;font-weight:600;cursor:pointer}
    .q-a11y-panel__foot-btn:hover{background:#DFF6E7}
    .q-a11y-panel__foot-btn--primary{background:var(--q-primary,#25935F);color:#fff;border-color:var(--q-primary,#25935F)}
    .q-a11y-panel__foot-btn--primary:hover{background:var(--q-primary-dark,#1B8354)}

    /* ===== Effects applied to <html> via data-* attributes ===== */
    html[data-a11y-contrast="1"]{filter:contrast(1.35) saturate(1.2)}
    html[data-a11y-contrast="1"] body{background:#fff;color:#000}
    html[data-a11y-grayscale="1"]{filter:grayscale(1)}
    html[data-a11y-grayscale="1"][data-a11y-contrast="1"]{filter:grayscale(1) contrast(1.35)}
    html[data-a11y-saturation="1"]{filter:saturate(1.6)}
    html[data-a11y-line="1"] body, html[data-a11y-line="1"] body *{line-height:1.8!important}
    html[data-a11y-line="2"] body, html[data-a11y-line="2"] body *{line-height:2.2!important}
    html[data-a11y-line="3"] body, html[data-a11y-line="3"] body *{line-height:2.8!important}
    html[data-a11y-word="1"] body, html[data-a11y-word="1"] body *{word-spacing:.15em!important}
    html[data-a11y-word="2"] body, html[data-a11y-word="2"] body *{word-spacing:.3em!important}
    html[data-a11y-word="3"] body, html[data-a11y-word="3"] body *{word-spacing:.5em!important}
    html[data-a11y-letter="1"] body, html[data-a11y-letter="1"] body *{letter-spacing:.05em!important}
    html[data-a11y-letter="2"] body, html[data-a11y-letter="2"] body *{letter-spacing:.1em!important}
    html[data-a11y-letter="3"] body, html[data-a11y-letter="3"] body *{letter-spacing:.15em!important}
    html[data-a11y-align="left"] body p, html[data-a11y-align="left"] body li, html[data-a11y-align="left"] body td{text-align:left!important}
    html[data-a11y-align="center"] body p, html[data-a11y-align="center"] body li, html[data-a11y-align="center"] body td{text-align:center!important}
    html[data-a11y-align="right"] body p, html[data-a11y-align="right"] body li, html[data-a11y-align="right"] body td{text-align:right!important}
    html[data-a11y-align="justify"] body p, html[data-a11y-align="justify"] body li, html[data-a11y-align="justify"] body td{text-align:justify!important}
    html[data-a11y-links="1"] body a{text-decoration:underline!important;background:#FFF59D!important;color:#0F172A!important;padding:0 2px;border-radius:3px}
    html[data-a11y-headings="1"] body :is(h1,h2,h3,h4,h5,h6){outline:2px dashed var(--q-primary,#25935F);outline-offset:4px;background:rgba(37,147,95,.06)}
    html[data-a11y-readable="1"] body, html[data-a11y-readable="1"] body *{font-family:"Verdana","Tajawal","Helvetica","Arial",sans-serif!important}
    html[data-a11y-dyslexia="1"] body, html[data-a11y-dyslexia="1"] body *{font-family:"Comic Sans MS","Comic Sans","Tajawal","Verdana",sans-serif!important;letter-spacing:.04em!important}

    @media (max-width:640px){.q-a11y{inset-inline-end:8px;padding:6px 4px}.q-a11y__btn{width:38px;height:38px}.q-a11y-panel{width:88vw;padding:12px}.q-a11y-panel__grid{grid-template-columns:repeat(3,1fr);gap:6px}.q-a11y-tile{min-height:74px;padding:8px 4px}}
    @media print{.q-a11y,.q-a11y-panel,.q-a11y-restore{display:none!important}}
</style>

<script>
(function(){
    var K_HIDDEN='quai-a11y-hidden',K_STATE='quai-a11y-state';
    var widget=document.getElementById('qA11yWidget'),panel=document.getElementById('qA11yPanel'),restore=document.getElementById('qA11yRestore');
    if(!widget||!panel||!restore)return;
    var FONT_STEPS=[0,110,120,130,90];           // cycle: default → bigger → biggest → smaller
    var SPACING_STEPS=[0,1,2,3];                 // 0 = off, 1/2/3 = increasing
    var ALIGN_STEPS=['','left','center','right','justify'];
    var defaults={font:0,line:0,word:0,letter:0,align:'',links:0,headings:0,readable:0,dyslexia:0,contrast:0,grayscale:0,saturation:0,dark:0};
    var state=Object.assign({},defaults);
    try{var saved=JSON.parse(localStorage.getItem(K_STATE)||'{}');state=Object.assign(state,saved);}catch(e){}
    var html=document.documentElement;
    function persist(){try{localStorage.setItem(K_STATE,JSON.stringify(state));}catch(e){}}
    function setData(k,v){if(v){html.setAttribute('data-a11y-'+k,String(v));}else{html.removeAttribute('data-a11y-'+k);}}
    function setTile(key,active){var t=panel.querySelector('[data-a11y="'+key+'"]');if(t)t.setAttribute('aria-pressed',active?'true':'false');}
    function applyAll(){
        html.style.fontSize=state.font?(state.font+'%'):'';
        setData('line',state.line||'');setTile('line-spacing',!!state.line);
        setData('word',state.word||'');setTile('word-spacing',!!state.word);
        setData('letter',state.letter||'');setTile('letter-spacing',!!state.letter);
        setData('align',state.align||'');setTile('text-align',!!state.align);
        setData('links',state.links?'1':'');setTile('highlight-links',!!state.links);
        setData('headings',state.headings?'1':'');setTile('highlight-headings',!!state.headings);
        setData('readable',state.readable?'1':'');setTile('readable-font',!!state.readable);
        setData('dyslexia',state.dyslexia?'1':'');setTile('dyslexia-font',!!state.dyslexia);
        setData('contrast',state.contrast?'1':'');setTile('contrast',!!state.contrast);
        setData('grayscale',state.grayscale?'1':'');setTile('grayscale',!!state.grayscale);
        setData('saturation',state.saturation?'1':'');setTile('saturation',!!state.saturation);
        setTile('font-cycle',!!state.font);
        var darkBtn=panel.querySelector('[data-a11y="dark"]');if(darkBtn)darkBtn.setAttribute('aria-pressed',state.dark?'true':'false');
        if(state.dark){html.setAttribute('data-theme','dark');}else{if(html.getAttribute('data-theme')==='dark')html.removeAttribute('data-theme');}
    }
    function setHidden(h){try{localStorage.setItem(K_HIDDEN,h?'1':'0');}catch(e){}widget.hidden=h;if(h)panel.hidden=true;restore.hidden=!h;document.getElementById('qA11yToggle').setAttribute('aria-expanded','false');}
    function cycle(arr,cur){var i=arr.indexOf(cur);return arr[(i+1)%arr.length];}
    applyAll();
    setHidden(localStorage.getItem(K_HIDDEN)==='1');
    document.getElementById('qA11yToggle').addEventListener('click',function(e){e.preventDefault();var open=!panel.hidden;panel.hidden=open;this.setAttribute('aria-expanded',(!open).toString());});
    document.getElementById('qA11yPanelClose').addEventListener('click',function(){panel.hidden=true;document.getElementById('qA11yToggle').setAttribute('aria-expanded','false');});
    document.getElementById('qA11yClose').addEventListener('click',function(){setHidden(true);});
    document.getElementById('qA11yPanelHide').addEventListener('click',function(){setHidden(true);});
    restore.addEventListener('click',function(){setHidden(false);});
    document.addEventListener('click',function(e){if(panel.hidden)return;if(panel.contains(e.target))return;if(widget.contains(e.target))return;panel.hidden=true;document.getElementById('qA11yToggle').setAttribute('aria-expanded','false');});
    panel.addEventListener('click',function(e){
        var b=e.target.closest('[data-a11y]');if(!b)return;
        var a=b.getAttribute('data-a11y');
        if(a==='font-cycle'){state.font=cycle(FONT_STEPS,state.font);}
        else if(a==='line-spacing'){state.line=cycle(SPACING_STEPS,state.line);}
        else if(a==='word-spacing'){state.word=cycle(SPACING_STEPS,state.word);}
        else if(a==='letter-spacing'){state.letter=cycle(SPACING_STEPS,state.letter);}
        else if(a==='text-align'){state.align=cycle(ALIGN_STEPS,state.align);}
        else if(a==='highlight-links'){state.links=state.links?0:1;}
        else if(a==='highlight-headings'){state.headings=state.headings?0:1;}
        else if(a==='readable-font'){state.readable=state.readable?0:1;if(state.readable)state.dyslexia=0;}
        else if(a==='dyslexia-font'){state.dyslexia=state.dyslexia?0:1;if(state.dyslexia)state.readable=0;}
        else if(a==='contrast'){state.contrast=state.contrast?0:1;}
        else if(a==='grayscale'){state.grayscale=state.grayscale?0:1;}
        else if(a==='saturation'){state.saturation=state.saturation?0:1;}
        else if(a==='dark'){state.dark=state.dark?0:1;}
        else if(a==='speak-page'){var s=window.speechSynthesis;if(!s)return;if(s.speaking){s.cancel();return;}var sel=String(window.getSelection&&window.getSelection().toString()||'').trim();var txt=sel||(document.querySelector('main, [role=main], #main, .content')||document.body).innerText.slice(0,2000);var u=new SpeechSynthesisUtterance(txt);u.lang=document.documentElement.lang||'en';s.speak(u);return;}
        else if(a==='reset'){state=Object.assign({},defaults);if(window.speechSynthesis)window.speechSynthesis.cancel();}
        else{return;}
        persist();applyAll();
    });
})();
</script>
