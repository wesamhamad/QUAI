@php
  $principles = (array) __('messages.terms_principles');
@endphp

<div id="termsModal" class="qs-terms-modal" role="dialog" aria-modal="true" aria-labelledby="termsModalTitle">
  <div class="qs-terms-wrapper">
    {{-- Logo --}}
    <div class="qs-terms-logo">
      <div class="qs-terms-logo-mark">Q</div>
      <div class="qs-terms-logo-title">{{ __('messages.terms_qu_subtitle') }}</div>
    </div>

    {{-- Card --}}
    <div class="qs-terms-card">
      {{-- Header --}}
      <div class="qs-terms-header">
        <div class="qs-terms-header-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
        </div>
        <h1 id="termsModalTitle">{{ __('messages.terms_modal_title') }}</h1>
        <p>{{ __('messages.terms_modal_subtitle') }}</p>
        <button id="termsModalCloseX" type="button" class="qs-terms-close-x hidden" aria-label="{{ __('messages.terms_close_button') }}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      {{-- Body --}}
      <div class="qs-terms-body">
        <p class="qs-terms-intro">{{ __('messages.terms_modal_intro') }}</p>

        @foreach($principles as $i => $principle)
          <div class="qs-terms-principle">
            <div class="qs-terms-principle-head">
              <span class="qs-terms-principle-num">{{ $i + 1 }}</span>
              <h3>{{ $principle['title'] }}</h3>
            </div>
            <ul>
              @foreach($principle['bullets'] as $bullet)
                <li>{{ $bullet }}</li>
              @endforeach
            </ul>
          </div>
        @endforeach

        <div class="qs-terms-en-summary">
          <h4>{{ __('messages.terms_en_summary_title') }}</h4>
          <p>{{ __('messages.terms_en_summary_body') }}</p>
        </div>
      </div>

      {{-- Footer --}}
      <div class="qs-terms-footer">
        <label class="qs-terms-checkbox-row" id="termsCheckboxLabel">
          <input type="checkbox" id="termsPolicyCheck">
          <span class="qs-terms-custom-check"></span>
          <span>
            {{ __('messages.terms_checkbox_label') }}
            <small class="qs-terms-checkbox-en">{{ __('messages.terms_checkbox_label_en') }}</small>
          </span>
        </label>

        <div class="qs-terms-btn-row">
          <button id="termsAcceptBtn" type="button" class="qs-terms-btn-accept" disabled>{{ __('messages.terms_accept_button') }}</button>
          <button id="termsRejectBtn" type="button" class="qs-terms-btn-reject">{{ __('messages.terms_reject_button') }}</button>
          <button id="termsCloseBtn" type="button" class="qs-terms-btn-close hidden">{{ __('messages.terms_close_button') }}</button>
        </div>

        <div class="qs-terms-reject-warning" id="termsRejectWarning">
          <strong>{{ __('messages.terms_reject_warning_title') }}</strong>
          {{ __('messages.terms_reject_warning_body') }}
          <div class="qs-terms-reject-btns">
            <button id="termsRejectConfirmBtn" type="button" class="qs-terms-reject-confirm-btn">{{ __('messages.terms_reject_confirm') }}</button>
            <button id="termsRejectCancelBtn" type="button" class="qs-terms-reject-cancel-btn">{{ __('messages.terms_reject_cancel') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* SDAIA-style policy modal — adapted from QUAI's sdaia-policy page */
  .qs-terms-modal {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    overflow-y: auto;
    font-family: 'IBM Plex Sans Arabic', system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  }
  .qs-terms-modal.is-open { display: flex; }

  .qs-terms-modal .qs-terms-wrapper {
    width: 100%;
    max-width: 640px;
    margin: auto;
    animation: qsTermsIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes qsTermsIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

  .qs-terms-modal .qs-terms-logo { text-align: center; margin-bottom: 20px; }
  .qs-terms-modal .qs-terms-logo-mark {
    display: inline-flex; align-items: center; justify-content: center;
    width: 56px; height: 56px;
    background: linear-gradient(135deg, #1B8354, #0F5C3A);
    border-radius: 16px;
    color: #fff; font-size: 1.6rem; font-weight: 800;
    box-shadow: 0 8px 24px rgba(27, 131, 84, 0.25);
    margin-bottom: 10px;
  }
  .qs-terms-modal .qs-terms-logo-title { font-size: 0.95rem; color: rgba(255,255,255,0.85); font-weight: 500; }

  .qs-terms-modal .qs-terms-card {
    background: #fff;
    border-radius: 20px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.04);
    overflow: hidden;
  }

  .qs-terms-modal .qs-terms-header {
    padding: 30px 32px 22px;
    text-align: center;
    background: linear-gradient(135deg, #1B8354 0%, #0F5C3A 100%);
    color: #fff;
    position: relative;
    overflow: hidden;
  }
  .qs-terms-modal .qs-terms-header::before { content:''; position:absolute; top:-40px; left:-40px; width:140px; height:140px; border-radius:50%; background:rgba(255,255,255,0.06); }
  .qs-terms-modal .qs-terms-header::after  { content:''; position:absolute; bottom:-50px; right:-30px; width:120px; height:120px; border-radius:50%; background:rgba(255,255,255,0.04); }
  .qs-terms-modal .qs-terms-header-icon { position: relative; z-index: 1; margin-bottom: 10px; }
  .qs-terms-modal .qs-terms-header-icon svg { filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2)); }
  .qs-terms-modal .qs-terms-header h1 { font-size: 1.35rem; font-weight: 700; margin: 0; position: relative; z-index: 1; }
  .qs-terms-modal .qs-terms-header p  { font-size: 0.8rem; opacity: 0.75; margin: 6px 0 0; position: relative; z-index: 1; letter-spacing: 0.3px; }

  .qs-terms-modal .qs-terms-close-x {
    position: absolute; top: 14px; inset-inline-end: 14px; z-index: 2;
    width: 32px; height: 32px;
    background: rgba(255,255,255,0.15);
    border: none; border-radius: 50%;
    color: #fff; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .qs-terms-modal .qs-terms-close-x:hover { background: rgba(255,255,255,0.28); }

  .qs-terms-modal .qs-terms-body {
    padding: 22px 28px;
    max-height: 50vh;
    overflow-y: auto;
    color: #1a1a1a;
  }
  .qs-terms-modal .qs-terms-body::-webkit-scrollbar { width: 5px; }
  .qs-terms-modal .qs-terms-body::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 3px; }

  .qs-terms-modal .qs-terms-intro {
    font-size: 0.88rem; color: #555; line-height: 1.8;
    margin-bottom: 18px;
    padding: 14px 18px;
    background: #f8f9fa;
    border-radius: 12px;
    border-inline-end: 3px solid #1B8354;
  }

  .qs-terms-modal .qs-terms-principle { margin-bottom: 18px; }
  .qs-terms-modal .qs-terms-principle-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .qs-terms-modal .qs-terms-principle-num {
    display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px; min-width: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1B8354, #22A068);
    color: #fff; font-size: 0.78rem; font-weight: 700;
    box-shadow: 0 2px 8px rgba(27, 131, 84, 0.2);
  }
  .qs-terms-modal .qs-terms-principle-head h3 { font-size: 0.98rem; font-weight: 700; color: #1a1a1a; margin: 0; }
  .qs-terms-modal .qs-terms-principle ul { margin: 0; padding-inline-start: 38px; padding-inline-end: 0; list-style: none; }
  .qs-terms-modal .qs-terms-principle ul li {
    position: relative;
    font-size: 0.84rem; color: #555; line-height: 1.8;
    padding-inline-start: 16px; margin-bottom: 3px;
  }
  .qs-terms-modal .qs-terms-principle ul li::before {
    content: ''; position: absolute; inset-inline-start: 0; top: 0.7em;
    width: 5px; height: 5px; border-radius: 50%; background: #22A068;
  }

  .qs-terms-modal .qs-terms-en-summary { border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 16px; }
  .qs-terms-modal .qs-terms-en-summary h4 { font-size: 0.82rem; font-weight: 600; color: #999; margin: 0 0 6px; text-align: left; direction: ltr; }
  .qs-terms-modal .qs-terms-en-summary p  { font-size: 0.8rem; color: #999; line-height: 1.8; text-align: left; direction: ltr; margin: 0; }

  .qs-terms-modal .qs-terms-footer { padding: 18px 28px 22px; border-top: 1px solid #e5e7eb; background: #f8f9fa; }
  .qs-terms-modal .qs-terms-checkbox-row {
    display: flex; align-items: flex-start; gap: 12px;
    cursor: pointer; user-select: none;
    font-size: 0.88rem; color: #1a1a1a; line-height: 1.5;
    margin-bottom: 16px;
  }
  .qs-terms-modal .qs-terms-checkbox-row input { display: none; }
  .qs-terms-modal .qs-terms-custom-check {
    width: 22px; height: 22px; min-width: 22px;
    border: 2px solid #e5e7eb; border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    margin-top: 2px; transition: all 0.2s ease;
    background: #fff;
  }
  .qs-terms-modal .qs-terms-checkbox-row:hover .qs-terms-custom-check { border-color: #1B8354; }
  .qs-terms-modal .qs-terms-checkbox-row input:checked + .qs-terms-custom-check {
    background: #1B8354; border-color: #1B8354;
    box-shadow: 0 2px 8px rgba(27, 131, 84, 0.3);
  }
  .qs-terms-modal .qs-terms-checkbox-row input:checked + .qs-terms-custom-check::after {
    content: ''; width: 6px; height: 11px;
    border: solid #fff; border-width: 0 2.5px 2.5px 0;
    transform: rotate(45deg); margin-top: -2px;
  }
  .qs-terms-modal .qs-terms-checkbox-en { display: block; font-size: 0.72rem; color: #999; margin-top: 2px; }

  .qs-terms-modal .qs-terms-btn-row { display: flex; gap: 12px; }
  .qs-terms-modal .qs-terms-btn-accept {
    flex: 1;
    padding: 13px 24px;
    font-size: 1rem; font-weight: 700;
    font-family: inherit;
    background: linear-gradient(135deg, #1B8354, #22A068);
    color: #fff; border: none; border-radius: 12px;
    cursor: pointer; transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(27, 131, 84, 0.25);
  }
  .qs-terms-modal .qs-terms-btn-accept:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(27, 131, 84, 0.35);
  }
  .qs-terms-modal .qs-terms-btn-accept:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

  .qs-terms-modal .qs-terms-btn-reject {
    padding: 13px 20px;
    font-size: 0.9rem; font-weight: 600;
    font-family: inherit;
    background: transparent; color: #DC2626;
    border: 2px solid #DC2626; border-radius: 12px;
    cursor: pointer; transition: all 0.2s ease;
  }
  .qs-terms-modal .qs-terms-btn-reject:hover { background: #DC2626; color: #fff; }

  .qs-terms-modal .qs-terms-btn-close {
    flex: 1;
    padding: 13px 24px;
    font-size: 0.95rem; font-weight: 600;
    font-family: inherit;
    background: #fff; color: #555;
    border: 1px solid #e5e7eb; border-radius: 12px;
    cursor: pointer; transition: background 0.2s;
  }
  .qs-terms-modal .qs-terms-btn-close:hover { background: #f1f3f4; }

  .qs-terms-modal .qs-terms-reject-warning {
    display: none;
    margin-top: 16px;
    padding: 14px 18px;
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 12px;
    color: #991B1B;
    font-size: 0.85rem; line-height: 1.7;
    animation: qsTermsFadeIn 0.2s ease;
  }
  .qs-terms-modal .qs-terms-reject-warning.is-visible { display: block; }
  .qs-terms-modal .qs-terms-reject-warning strong { display: block; margin-bottom: 4px; }
  @keyframes qsTermsFadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

  .qs-terms-modal .qs-terms-reject-btns { display: flex; gap: 10px; margin-top: 12px; }
  .qs-terms-modal .qs-terms-reject-confirm-btn {
    padding: 8px 18px; font-size: 0.85rem; font-weight: 600;
    font-family: inherit;
    background: #DC2626; color: #fff;
    border: none; border-radius: 8px; cursor: pointer;
    transition: background 0.2s;
  }
  .qs-terms-modal .qs-terms-reject-confirm-btn:hover { background: #B91C1C; }
  .qs-terms-modal .qs-terms-reject-cancel-btn {
    padding: 8px 18px; font-size: 0.85rem; font-weight: 600;
    font-family: inherit;
    background: transparent; color: #555;
    border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer;
  }

  .qs-terms-modal .hidden { display: none !important; }

  @media (max-width: 640px) {
    .qs-terms-modal { padding: 12px; }
    .qs-terms-modal .qs-terms-header { padding: 24px 20px 18px; }
    .qs-terms-modal .qs-terms-header h1 { font-size: 1.15rem; }
    .qs-terms-modal .qs-terms-body { padding: 18px 20px; max-height: 45vh; }
    .qs-terms-modal .qs-terms-footer { padding: 16px 20px 20px; }
    .qs-terms-modal .qs-terms-btn-row { flex-direction: column; }
    .qs-terms-modal .qs-terms-principle ul { padding-inline-start: 32px; }
  }
</style>

<script>
(function () {
  var STORAGE_KEY = 'qsprk_terms_accepted_v1';
  var LOGOUT_URL = '{{ route('logout') }}';

  var modal = document.getElementById('termsModal');
  var checkbox = document.getElementById('termsPolicyCheck');
  var acceptBtn = document.getElementById('termsAcceptBtn');
  var rejectBtn = document.getElementById('termsRejectBtn');
  var closeBtn = document.getElementById('termsCloseBtn');
  var closeX = document.getElementById('termsModalCloseX');
  var rejectWarning = document.getElementById('termsRejectWarning');
  var rejectConfirmBtn = document.getElementById('termsRejectConfirmBtn');
  var rejectCancelBtn = document.getElementById('termsRejectCancelBtn');

  var checkboxLabel = document.getElementById('termsCheckboxLabel');

  function setMode(mode) {
    if (mode === 'view') {
      checkboxLabel.classList.add('hidden');
      acceptBtn.classList.add('hidden');
      rejectBtn.classList.add('hidden');
      closeBtn.classList.remove('hidden');
      closeX.classList.remove('hidden');
    } else {
      checkboxLabel.classList.remove('hidden');
      acceptBtn.classList.remove('hidden');
      rejectBtn.classList.remove('hidden');
      closeBtn.classList.add('hidden');
      closeX.classList.add('hidden');
    }
  }

  function show(mode) { setMode(mode || 'view'); modal.classList.add('is-open'); }
  function hide() { modal.classList.remove('is-open'); rejectWarning.classList.remove('is-visible'); }

  checkbox.addEventListener('change', function () {
    acceptBtn.disabled = !this.checked;
    if (this.checked) rejectWarning.classList.remove('is-visible');
  });

  acceptBtn.addEventListener('click', function () {
    if (!checkbox.checked) return;
    try { localStorage.setItem(STORAGE_KEY, new Date().toISOString()); } catch (e) {}
    hide();
  });

  rejectBtn.addEventListener('click', function () { rejectWarning.classList.add('is-visible'); });
  rejectCancelBtn.addEventListener('click', function () { rejectWarning.classList.remove('is-visible'); });
  rejectConfirmBtn.addEventListener('click', function () { window.location.href = LOGOUT_URL; });

  closeBtn.addEventListener('click', hide);
  closeX.addEventListener('click', hide);

  window.openTermsModal = function (mode) { show(mode || 'view'); };

  var accepted = null;
  try { accepted = localStorage.getItem(STORAGE_KEY); } catch (e) {}
  if (!accepted) show('agree');
})();
</script>
