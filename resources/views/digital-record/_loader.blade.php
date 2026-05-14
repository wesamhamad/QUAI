{{-- AI loader overlay — shared between source pages (home/sidebar) and the destination digital-record page. --}}
<style>
    .dr-loader-overlay {
        position: fixed; inset: 0; z-index: 9999;
        display: none; align-items: center; justify-content: center;
        padding: var(--q-space-5, 24px);
        background: rgba(15, 32, 23, 0.55);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }
    .dr-loader-overlay.is-open  { display: flex; animation: dr-loader-fade-in 220ms ease-out; }
    .dr-loader-overlay.is-leaving { animation: dr-loader-fade-out 320ms ease-in forwards; }
    @keyframes dr-loader-fade-in  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes dr-loader-fade-out { from { opacity: 1; } to { opacity: 0; visibility: hidden; } }

    .dr-loader-card {
        width: 100%; max-width: 560px;
        background: var(--q-card-bg, #fff);
        border-radius: var(--q-radius-2xl, 24px);
        box-shadow: 0 24px 60px -20px rgba(20, 87, 58, 0.45);
        overflow: hidden;
        animation: dr-loader-pop 320ms cubic-bezier(.2,.9,.3,1.2);
    }
    @keyframes dr-loader-pop {
        from { opacity: 0; transform: translateY(12px) scale(.96); }
        to   { opacity: 1; transform: translateY(0)    scale(1); }
    }

    .dr-loader-head {
        display: flex; align-items: center; gap: var(--q-space-4, 16px);
        padding: var(--q-space-5, 24px) var(--q-space-5, 24px) var(--q-space-4, 16px);
        background: linear-gradient(135deg, #14573A 0%, #1B8354 60%, #25935F 100%);
        color: #fff;
    }
    .dr-loader-orb {
        flex-shrink: 0;
        width: 48px; height: 48px; border-radius: 50%;
        background: rgba(255,255,255,.18);
        display: flex; align-items: center; justify-content: center;
        position: relative;
    }
    .dr-loader-orb::after {
        content: ''; position: absolute; inset: -4px; border-radius: 50%;
        border: 2px solid rgba(255,255,255,.35);
        border-top-color: transparent;
        animation: dr-loader-spin 1.4s linear infinite;
    }
    @keyframes dr-loader-spin { to { transform: rotate(360deg); } }
    .dr-loader-head h2 { margin: 0; font-size: var(--q-font-lg, 18px); font-weight: 800; line-height: 1.3; }
    .dr-loader-head p  { margin: 4px 0 0; font-size: var(--q-font-xs, 12px); color: rgba(255,255,255,.85); }

    .dr-loader-steps { list-style: none; margin: 0; padding: var(--q-space-4, 16px) var(--q-space-5, 24px); display: flex; flex-direction: column; gap: var(--q-space-3, 12px); }
    .dr-loader-step {
        display: grid; grid-template-columns: 32px 1fr 22px;
        align-items: center; gap: var(--q-space-3, 12px);
        padding: 6px 0;
        opacity: .45;
        transition: opacity .25s ease;
    }
    .dr-loader-step[data-state="active"], .dr-loader-step[data-state="done"] { opacity: 1; }
    .dr-loader-step-ico {
        width: 32px; height: 32px; border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        background: #F3FCF6; color: #166A45;
        border: 1px solid #DFF6E7;
        transition: background .25s ease, color .25s ease, border-color .25s ease, transform .25s ease;
    }
    .dr-loader-step[data-state="active"] .dr-loader-step-ico {
        background: linear-gradient(135deg, #1B8354, #25935F);
        color: #fff; border-color: #166A45;
        transform: scale(1.06);
        box-shadow: 0 0 0 4px rgba(37,147,95,.15);
    }
    .dr-loader-step[data-state="done"] .dr-loader-step-ico {
        background: #DFF6E7; color: #166A45; border-color: #B8EACB;
    }
    .dr-loader-step-title { font-size: var(--q-font-sm, 14px); font-weight: 700; color: var(--q-text-primary, #111827); line-height: 1.3; }
    .dr-loader-step[data-state="active"] .dr-loader-step-title { color: #14573A; }
    .dr-loader-step-meta { font-size: 11px; color: var(--q-text-secondary, #6B7280); margin-top: 2px; }
    .dr-loader-step[data-state="active"] .dr-loader-step-meta::after {
        content: '';
        display: inline-block; vertical-align: middle;
        margin-inline-start: 6px;
        width: 18px; height: 6px;
        background-image: radial-gradient(circle, #25935F 2px, transparent 2.5px);
        background-size: 6px 6px;
        background-repeat: repeat-x;
        animation: dr-loader-dots 1s steps(3, end) infinite;
    }
    @keyframes dr-loader-dots {
        0%   { background-position: 0   0; opacity: .3; }
        33%  { opacity: .6; }
        66%  { opacity: 1; }
        100% { background-position: 18px 0; opacity: .3; }
    }
    .dr-loader-step-status { display: none; }

    .dr-loader-progress { height: 4px; background: #F3FCF6; position: relative; overflow: hidden; }
    .dr-loader-progress-bar {
        position: absolute; inset: 0 auto 0 0;
        width: 0%;
        background: linear-gradient(90deg, #1B8354, #25935F);
        transition: width .45s cubic-bezier(.4,0,.2,1);
    }
    [dir="rtl"] .dr-loader-progress-bar { inset: 0 0 0 auto; }

    .dr-loader-foot {
        display: flex; align-items: center; justify-content: space-between;
        gap: var(--q-space-3, 12px);
        padding: var(--q-space-3, 12px) var(--q-space-5, 24px) var(--q-space-4, 16px);
        background: #FAFCFB;
        border-top: 1px solid var(--q-border-color, #E5E7EB);
    }
    .dr-loader-hint { font-size: 11px; color: var(--q-text-secondary, #6B7280); display: inline-flex; align-items: center; gap: 6px; }
    .dr-loader-hint svg { color: #25935F; }
    .dr-loader-skip {
        background: transparent; border: 1px solid #B8EACB;
        color: #166A45; font-family: inherit; font-size: var(--q-font-xs, 12px); font-weight: 600;
        padding: 6px var(--q-space-3, 12px); border-radius: var(--q-radius-lg, 12px);
        cursor: pointer;
        transition: background .15s ease, color .15s ease;
    }
    .dr-loader-skip:hover { background: #F3FCF6; }

    body.dr-loading .dr-wrapper { animation: none; }
</style>

<div class="dr-loader-overlay" id="dr-loader" role="dialog" aria-modal="true" aria-labelledby="dr-loader-title" dir="rtl" aria-hidden="true">
    <div class="dr-loader-card">
        <div class="dr-loader-head">
            <div class="dr-loader-orb" aria-hidden="true">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
            </div>
            <div style="flex:1; min-width:0;">
                <h2 id="dr-loader-title">QULLMs يحضّر سجلك الرقمي</h2>
                <p>نقرأ بياناتك الجامعية ونقارنها لحظياً بسوق العمل السعودي…</p>
            </div>
        </div>

        <ol class="dr-loader-steps">
            <li class="dr-loader-step" data-state="active" data-step="0">
                <span class="dr-loader-step-ico" aria-hidden="true">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </span>
                <div>
                    <div class="dr-loader-step-title">جلب بياناتك من النظام الجامعي</div>
                    <div class="dr-loader-step-meta">الملف الشخصي، الكلية، التخصص، المعدل التراكمي</div>
                </div>
                <span class="dr-loader-step-status" aria-hidden="true">
                    <span class="dr-loader-pending"></span>
                    <span class="dr-loader-active"></span>
                    <span class="dr-loader-done"><svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></span>
                </span>
            </li>
            <li class="dr-loader-step" data-state="pending" data-step="1">
                <span class="dr-loader-step-ico" aria-hidden="true">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </span>
                <div>
                    <div class="dr-loader-step-title">تحليل مهاراتك المعتمدة</div>
                    <div class="dr-loader-step-meta">قراءة سجل المهارات وتصنيفها حسب الفصل</div>
                </div>
                <span class="dr-loader-step-status" aria-hidden="true">
                    <span class="dr-loader-pending"></span>
                    <span class="dr-loader-active"></span>
                    <span class="dr-loader-done"><svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></span>
                </span>
            </li>
            <li class="dr-loader-step" data-state="pending" data-step="2">
                <span class="dr-loader-step-ico" aria-hidden="true">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                </span>
                <div>
                    <div class="dr-loader-step-title">مسح متطلبات سوق العمل السعودي</div>
                    <div class="dr-loader-step-meta">جمع أبرز المهارات المطلوبة من البيانات الحيّة</div>
                </div>
                <span class="dr-loader-step-status" aria-hidden="true">
                    <span class="dr-loader-pending"></span>
                    <span class="dr-loader-active"></span>
                    <span class="dr-loader-done"><svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></span>
                </span>
            </li>
            <li class="dr-loader-step" data-state="pending" data-step="3">
                <span class="dr-loader-step-ico" aria-hidden="true">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </span>
                <div>
                    <div class="dr-loader-step-title">مطابقة الوظائف الأنسب لك</div>
                    <div class="dr-loader-step-meta">حساب التوافق مع تخصصك وأعلى مقرراتك درجةً</div>
                </div>
                <span class="dr-loader-step-status" aria-hidden="true">
                    <span class="dr-loader-pending"></span>
                    <span class="dr-loader-active"></span>
                    <span class="dr-loader-done"><svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></span>
                </span>
            </li>
            <li class="dr-loader-step" data-state="pending" data-step="4">
                <span class="dr-loader-step-ico" aria-hidden="true">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                </span>
                <div>
                    <div class="dr-loader-step-title">توليد توصياتك بالذكاء الاصطناعي</div>
                    <div class="dr-loader-step-meta">دورات ووظائف مرشّحة لسد الفجوات المهارية</div>
                </div>
                <span class="dr-loader-step-status" aria-hidden="true">
                    <span class="dr-loader-pending"></span>
                    <span class="dr-loader-active"></span>
                    <span class="dr-loader-done"><svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></span>
                </span>
            </li>
        </ol>

        <div class="dr-loader-progress" aria-hidden="true">
            <div class="dr-loader-progress-bar" id="dr-loader-progress-bar"></div>
        </div>

        <div class="dr-loader-foot">
            <span class="dr-loader-hint">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                مدعوم بـ QULLMs · تحليل لحظي
            </span>
            <button type="button" class="dr-loader-skip" id="dr-loader-skip">تخطي ومشاهدة السجل</button>
        </div>
    </div>
</div>

<script>
(function () {
    var DR_PATH = '/digital-record';
    var PENDING_KEY = 'dr_loader_pending';

    var loader = document.getElementById('dr-loader');
    if (!loader) return;

    var steps = Array.prototype.slice.call(loader.querySelectorAll('.dr-loader-step'));
    var bar = document.getElementById('dr-loader-progress-bar');
    var skipBtn = document.getElementById('dr-loader-skip');
    var idx = 0;
    var timer = null;
    var done = false;
    var running = false;
    var stepMs = 180;

    function setProgress(pct) { if (bar) bar.style.width = Math.max(0, Math.min(100, pct)) + '%'; }

    function resetSteps() {
        idx = 0; done = false;
        steps.forEach(function (el, i) { el.setAttribute('data-state', i === 0 ? 'active' : 'pending'); });
        setProgress(8);
    }

    function show(opts) {
        if (running && !done) return; // already running
        running = true;
        resetSteps();
        loader.classList.remove('is-leaving');
        loader.classList.add('is-open');
        loader.setAttribute('aria-hidden', 'false');
        document.body.classList.add('dr-loading');

        // Bridge overlay (source page during navigation): keep first step active —
        // the orb spinner + dot pulse already convey progress without faking advance.
        if (opts && opts.bridge) return;

        // Wrap-up: server-side fetch already finished and data is rendered, so
        // cascade through remaining steps quickly and dismiss.
        stepMs = (opts && typeof opts.stepMs === 'number') ? opts.stepMs : 180;
        if (timer) { clearTimeout(timer); }
        timer = setTimeout(advance, stepMs);
    }

    function advance() {
        if (done) return;
        if (idx < steps.length) {
            steps[idx].setAttribute('data-state', 'done');
            idx++;
        }
        if (idx < steps.length) {
            steps[idx].setAttribute('data-state', 'active');
            setProgress(((idx + 0.5) / steps.length) * 100);
            timer = setTimeout(advance, stepMs);
        } else {
            setProgress(100);
            timer = setTimeout(dismiss, 220);
        }
    }

    function dismiss() {
        if (done) return;
        done = true;
        if (timer) { clearTimeout(timer); timer = null; }
        loader.classList.add('is-leaving');
        document.body.classList.remove('dr-loading');
        setTimeout(function () {
            loader.classList.remove('is-open', 'is-leaving');
            loader.setAttribute('aria-hidden', 'true');
            running = false;
        }, 360);
    }

    if (skipBtn) skipBtn.addEventListener('click', dismiss);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && running && !done) dismiss();
    });

    // Expose for external trigger if needed.
    window.drShowLoader = show;

    // ===== Click intercept: show overlay immediately when navigating to /digital-record =====
    document.addEventListener('click', function (e) {
        var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!link) return;
        var href = link.getAttribute('href') || '';
        // Match exact path or path with query/fragment.
        if (href.indexOf(DR_PATH) === -1) return;
        // Skip new-tab / modified clicks — those don't navigate the current page.
        if (link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;

        try { sessionStorage.setItem(PENDING_KEY, '1'); } catch (_) {}
        // Bridge overlay on the source page — visible until the browser unloads.
        // Don't preventDefault — let navigation proceed normally.
        show({ bridge: true });
    }, true);

    // ===== On destination page load: only show if user navigated here from a click =====
    // Direct nav / refresh / filter changes already render with full data — no point
    // hiding it behind a fake loader. The pending flag is set by the click intercept
    // above, so its presence proves the user came from another page.
    var onDigitalRecord = window.location.pathname.replace(/\/+$/, '') === DR_PATH;
    if (onDigitalRecord) {
        var pending = false;
        try { pending = sessionStorage.getItem(PENDING_KEY) === '1'; } catch (_) {}
        if (pending) {
            try { sessionStorage.removeItem(PENDING_KEY); } catch (_) {}
            show();
        }
    }
})();
</script>
