{{-- ===== QUAI Language Switcher =====
     AR / EN pill toggle that mirrors the QSpark switcher visual style but
     uses QUAI's CSS variables so it adapts to light/dark themes. Posts to
     /lang/{locale} to persist the choice in the session and then reloads
     so server-rendered translations refresh. --}}
@php($__locale = app()->getLocale())
<div class="q-lang-switcher" role="group" aria-label="Language switcher">
    <button type="button"
            class="q-lang-btn {{ $__locale === 'ar' ? 'active' : '' }}"
            data-locale="ar"
            onclick="window.quaiSwitchLanguage && window.quaiSwitchLanguage('ar')"
            aria-pressed="{{ $__locale === 'ar' ? 'true' : 'false' }}">AR</button>
    <button type="button"
            class="q-lang-btn {{ $__locale === 'en' ? 'active' : '' }}"
            data-locale="en"
            onclick="window.quaiSwitchLanguage && window.quaiSwitchLanguage('en')"
            aria-pressed="{{ $__locale === 'en' ? 'true' : 'false' }}">EN</button>
</div>

<style>
    .q-lang-switcher {
        display: inline-flex;
        align-items: center;
        background: var(--q-bg-secondary, #F1F5F2);
        border: 1px solid var(--q-border, #E5E7EB);
        border-radius: 999px;
        padding: 2px;
        gap: 2px;
        flex-shrink: 0;
    }
    .q-lang-btn {
        appearance: none;
        border: 0;
        background: transparent;
        color: var(--q-text-muted, #6B7280);
        font-size: 0.75rem;
        font-weight: 700;
        line-height: 1;
        padding: 6px 10px;
        border-radius: 999px;
        cursor: pointer;
        letter-spacing: 0.04em;
        transition: background var(--q-transition-fast, 0.15s ease), color var(--q-transition-fast, 0.15s ease);
    }
    .q-lang-btn:hover { color: var(--q-text, #111827); }
    .q-lang-btn.active {
        background: var(--q-primary, #25935F);
        color: #fff;
    }
    .q-lang-btn:disabled { opacity: 0.6; cursor: wait; }
    @media (max-width: 480px) {
        .q-lang-switcher { padding: 1px; }
        .q-lang-btn { padding: 5px 8px; font-size: 0.7rem; }
    }
</style>

<script>
(function(){
    if (window.quaiSwitchLanguage) return;

    window.quaiSwitchLanguage = function(locale){
        if (locale !== 'ar' && locale !== 'en') return;
        if (document.documentElement.lang === locale) return;

        // Disable buttons during request to prevent double-clicks.
        var buttons = document.querySelectorAll('.q-lang-btn');
        buttons.forEach(function(b){ b.disabled = true; });

        var token = document.querySelector('meta[name="csrf-token"]');
        var headers = { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' };
        if (token) headers['X-CSRF-TOKEN'] = token.getAttribute('content');

        fetch('/lang/' + locale, { method: 'POST', headers: headers, credentials: 'same-origin' })
            .then(function(){
                // Reload so server-rendered Blade strings reflect the new locale.
                // Preserve the current scroll position via the session.
                window.location.reload();
            })
            .catch(function(){
                buttons.forEach(function(b){ b.disabled = false; });
            });
    };
})();
</script>
