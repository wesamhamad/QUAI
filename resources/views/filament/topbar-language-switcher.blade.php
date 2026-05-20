{{-- ===== Filament Topbar — Language Switcher slot =====
     Reuses the QUAI shell partial so the AR/EN pill, CSS variables, and
     /lang/{locale} JS toggle stay in sync with the rest of the app.
     The wrapper adds a bit of inline-end margin so the pill doesn't crowd
     the Filament user-menu trigger. --}}
<div style="display:inline-flex; align-items:center; margin-inline-end: .5rem;">
    @include('layouts.partials.language-switcher')
</div>
