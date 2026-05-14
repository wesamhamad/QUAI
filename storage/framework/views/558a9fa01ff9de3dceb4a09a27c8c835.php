
<style>
    .q-page-loader {
        position: fixed; inset: 0; z-index: 10000;
        display: flex; align-items: center; justify-content: center;
        background: rgba(232, 245, 233, 0.72);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        opacity: 1;
        transition: opacity .25s ease;
    }
    .q-page-loader[hidden] { display: none; }
    .q-page-loader.is-leaving { opacity: 0; pointer-events: none; }

    .q-page-loader__card {
        display: flex; align-items: center; gap: 14px;
        padding: 16px 22px;
        background: #F1F8E9;
        border: 1px solid #C8E6C9;
        border-radius: var(--q-radius-2xl, 20px);
        box-shadow: 0 14px 40px -16px rgba(46, 125, 50, 0.35);
        color: #1B5E20;
        font-family: inherit;
    }
    .q-page-loader__spinner {
        width: 28px; height: 28px; flex-shrink: 0;
        border-radius: 50%;
        border: 3px solid #C8E6C9;
        border-top-color: #43A047;
        animation: q-page-loader-spin 0.9s linear infinite;
    }
    @keyframes q-page-loader-spin { to { transform: rotate(360deg); } }

    .q-page-loader__text {
        font-size: 14px; font-weight: 700; line-height: 1.3;
    }
    .q-page-loader__hint {
        font-size: 11px; font-weight: 500; color: #2E7D32; margin-top: 2px;
    }
</style>

<div class="q-page-loader" id="qPageLoader" role="status" aria-live="polite" aria-label="جاري التحميل">
    <div class="q-page-loader__card">
        <div class="q-page-loader__spinner" aria-hidden="true"></div>
        <div>
            <div class="q-page-loader__text">جاري تحميل الصفحة…</div>
            <div class="q-page-loader__hint">يرجى الانتظار قليلاً</div>
        </div>
    </div>
</div>

<script>
(function () {
    var loader = document.getElementById('qPageLoader');
    if (!loader) return;

    var hideTimer = null;

    function hide() {
        if (!loader || loader.hasAttribute('hidden')) return;
        loader.classList.add('is-leaving');
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(function () {
            loader.setAttribute('hidden', '');
            loader.classList.remove('is-leaving');
        }, 280);
    }

    function show() {
        if (!loader) return;
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        loader.removeAttribute('hidden');
        loader.classList.remove('is-leaving');
    }

    // Hide once the page is fully loaded.
    if (document.readyState === 'complete') {
        // Tiny delay to avoid a jarring flash on already-cached pages.
        setTimeout(hide, 120);
    } else {
        window.addEventListener('load', function () { setTimeout(hide, 120); }, { once: true });
    }

    // Re-show on internal navigation (same-origin GET link clicks).
    document.addEventListener('click', function (e) {
        var link = e.target && e.target.closest ? e.target.closest('a[href]') : null;
        if (!link) return;
        var href = link.getAttribute('href') || '';
        if (!href || href.charAt(0) === '#') return;
        if (link.target === '_blank' || link.hasAttribute('download')) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
        // Skip javascript:, mailto:, tel: and explicit cross-origin links.
        if (/^(javascript:|mailto:|tel:)/i.test(href)) return;
        try {
            var url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin) return;
        } catch (_) { return; }
        show();
    }, true);

    // Re-show on form submissions (POST/GET navigations).
    document.addEventListener('submit', function (e) {
        var form = e.target;
        if (!form || form.tagName !== 'FORM') return;
        if (form.target === '_blank') return;
        show();
    }, true);

    // BFCache restore: ensure loader is hidden when returning via back/forward.
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) hide();
    });
})();
</script>
<?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/layouts/partials/page-loader.blade.php ENDPATH**/ ?>