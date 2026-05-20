@extends('layouts.dashboard')

@section('title', __('messages.nav_digital_advisor') . ' - QUAI')
@section('page-title', 'QU Agent')

@push('styles')
<style>
    .agent-form {
        background: var(--q-card-bg, #fff);
        border-radius: 20px;
        border: 1px solid var(--q-border-color, #e5e7eb);
        box-shadow: var(--q-card-shadow, 0 1px 3px rgba(0,0,0,0.05));
    }
    .agent-form .form-body { padding: 1.5rem 1.75rem; }

    .strategy-toggle,
    .language-toggle {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
    }

    .toggle-option {
        position: relative;
        padding: 1rem;
        border: 2px solid var(--q-border-color, #e5e7eb);
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--q-bg-secondary, #fafafa);
    }
    .toggle-option:hover { border-color: var(--q-primary, #006C35); }
    .toggle-option.selected {
        border-color: var(--q-primary, #006C35);
        background: rgba(0, 108, 53, 0.08);
    }
    .toggle-option input[type="radio"] { position: absolute; opacity: 0; pointer-events: none; }
    .toggle-option-title { font-weight: 600; color: var(--q-text-primary, #0f172a); font-size: 0.9375rem; margin-bottom: 0.25rem; }
    .toggle-option-desc { font-size: 0.8125rem; color: var(--q-text-secondary, #64748b); line-height: 1.5; }
    .toggle-option-badge { display: inline-block; padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.6875rem; font-weight: 600; margin-top: 0.5rem; }
    .badge-green { background: rgba(0, 108, 53, 0.1); color: var(--q-primary, #006C35); }
    .badge-blue  { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }

    .bp-checkboxes { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .bp-checkbox {
        display: flex; align-items: flex-start; gap: 0.625rem;
        padding: 0.875rem;
        border: 1px solid var(--q-border-color, #e5e7eb);
        border-radius: 10px;
        background: var(--q-bg-secondary, #fafafa);
        cursor: pointer; transition: all 0.2s ease;
    }
    .bp-checkbox:hover { border-color: var(--q-primary, #006C35); }
    .bp-checkbox input[type="checkbox"] {
        width: 18px; height: 18px; margin-top: 2px;
        accent-color: var(--q-primary, #006C35);
        flex-shrink: 0;
    }
    .bp-checkbox-label { font-weight: 500; color: var(--q-text-primary, #0f172a); font-size: 0.875rem; }
    .bp-checkbox-desc { font-size: 0.75rem; color: var(--q-text-secondary, #64748b); margin-top: 0.125rem; }

    .agents-list { margin-top: 2rem; }
    .agents-list-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
    .agents-list-title { font-size: 1.125rem; font-weight: 700; color: var(--q-text-primary, #0f172a); }
    .agents-list-count { font-size: 0.8125rem; color: var(--q-text-secondary, #64748b); }

    .agent-card {
        background: var(--q-card-bg, #fff);
        border: 1px solid var(--q-border-color, #e5e7eb);
        border-radius: 14px;
        padding: 1.25rem;
        margin-bottom: 0.75rem;
        transition: all 0.2s ease;
    }
    .agent-card:hover { border-color: var(--q-primary, #006C35); box-shadow: 0 2px 8px rgba(0, 108, 53, 0.08); }
    .agent-card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
    .agent-card-name { font-weight: 700; font-size: 1rem; color: var(--q-text-primary, #0f172a); }
    .agent-card-badges { display: flex; gap: 0.375rem; flex-wrap: wrap; }
    .agent-badge { padding: 0.125rem 0.5rem; border-radius: 9999px; font-size: 0.6875rem; font-weight: 600; }
    .agent-card-role { font-size: 0.875rem; color: var(--q-text-secondary, #64748b); margin-bottom: 0.75rem; line-height: 1.6; }
    .agent-card-url {
        display: flex; align-items: center; gap: 0.5rem;
        padding: 0.625rem 0.875rem;
        background: var(--q-bg-secondary, #f8fafc);
        border-radius: 8px;
        margin-bottom: 0.75rem;
    }
    .agent-card-url-text { flex: 1; font-size: 0.8125rem; color: var(--q-text-secondary, #64748b); font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; direction: ltr; text-align: left; }

    .btn-copy {
        display: inline-flex; align-items: center; gap: 0.375rem;
        padding: 0.375rem 0.75rem;
        border: 1px solid var(--q-border-color, #e5e7eb);
        border-radius: 6px;
        background: var(--q-card-bg, #fff);
        color: var(--q-text-secondary, #64748b);
        font-size: 0.75rem; cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit; flex-shrink: 0;
    }
    .btn-copy:hover { border-color: var(--q-primary, #006C35); color: var(--q-primary, #006C35); }
    .btn-copy.copied { border-color: #10b981; color: #10b981; }

    .agent-card-actions { display: flex; gap: 0.5rem; }
    .btn-agent-action {
        padding: 0.375rem 0.75rem;
        border: 1px solid var(--q-border-color, #e5e7eb);
        border-radius: 6px;
        background: var(--q-card-bg, #fff);
        color: var(--q-text-secondary, #64748b);
        font-size: 0.75rem; cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
        text-decoration: none;
    }
    .btn-agent-action:hover { border-color: var(--q-primary, #006C35); color: var(--q-primary, #006C35); }
    .btn-agent-action.danger:hover { border-color: #EF4444; color: #EF4444; }

    .rag-files-section { display: block; margin-top: 0.75rem; transition: all 0.3s ease; }
    .rag-files-section.hidden { display: none; }

    .web-search-toggle {
        display: flex; align-items: center; justify-content: space-between;
        padding: 1rem 1.25rem;
        background: var(--q-bg-secondary, #fafafa);
        border: 2px solid var(--q-border-color, #e5e7eb);
        border-radius: 12px;
        cursor: pointer; transition: all 0.2s ease;
    }
    .web-search-toggle:hover { border-color: var(--q-primary, #006C35); }
    .web-search-toggle.active { border-color: var(--q-primary, #006C35); background: rgba(0, 108, 53, 0.05); }
    .web-search-toggle-info { display: flex; align-items: center; gap: 0.75rem; }
    .web-search-toggle-icon {
        width: 40px; height: 40px; border-radius: 10px;
        background: rgba(59, 130, 246, 0.1);
        display: flex; align-items: center; justify-content: center;
        color: #3B82F6; flex-shrink: 0;
    }
    .web-search-toggle.active .web-search-toggle-icon { background: rgba(0, 108, 53, 0.1); color: var(--q-primary, #006C35); }
    .web-search-toggle-text { display: flex; flex-direction: column; gap: 0.125rem; }
    .web-search-toggle-title { font-weight: 600; color: var(--q-text-primary, #0f172a); font-size: 0.9375rem; }
    .web-search-toggle-desc { font-size: 0.8125rem; color: var(--q-text-secondary, #64748b); line-height: 1.4; }

    .switch-track { width: 44px; height: 24px; background: var(--q-border-color, #d1d5db); border-radius: 12px; position: relative; transition: background 0.2s; flex-shrink: 0; }
    .web-search-toggle.active .switch-track { background: var(--q-primary, #006C35); }
    .switch-thumb { width: 20px; height: 20px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
    .web-search-toggle.active .switch-thumb { transform: translateX(20px); }

    .agents-empty { text-align: center; padding: 2rem; color: var(--q-text-secondary, #64748b); }
    .agents-empty svg { width: 48px; height: 48px; margin: 0 auto 1rem; opacity: 0.5; }

    .success-message { display: none; padding: 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 10px; color: #059669; margin-bottom: 1.5rem; text-align: center; }
    .success-message.visible { display: block; }

    /* --- Demo chat modal --- */
    .chat-modal-overlay {
        display: none;
        position: fixed; inset: 0; z-index: 1000;
        background: rgba(15, 23, 42, 0.55);
        align-items: center; justify-content: center;
        padding: 1.5rem;
    }
    .chat-modal-overlay.visible { display: flex; }
    .chat-modal {
        background: var(--q-card-bg, #fff);
        border-radius: 18px;
        width: 100%; max-width: 640px;
        max-height: 85vh;
        display: flex; flex-direction: column;
        overflow: hidden;
        box-shadow: 0 20px 50px rgba(0,0,0,0.25);
    }
    .chat-modal-header {
        display: flex; align-items: center; gap: 0.75rem;
        padding: 1rem 1.25rem;
        border-bottom: 1px solid var(--q-border-color, #e5e7eb);
        background: var(--q-bg-secondary, #fafafa);
    }
    .chat-modal-avatar {
        width: 40px; height: 40px; border-radius: 10px;
        background: rgba(0, 108, 53, 0.1); color: var(--q-primary, #006C35);
        display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .chat-modal-title { font-weight: 700; font-size: 0.9375rem; color: var(--q-text-primary, #0f172a); }
    .chat-modal-sub { font-size: 0.75rem; color: var(--q-text-secondary, #64748b); margin-top: 0.125rem; }
    .chat-modal-close {
        margin-inline-start: auto;
        width: 32px; height: 32px; border-radius: 8px;
        border: 1px solid var(--q-border-color, #e5e7eb);
        background: var(--q-card-bg, #fff); cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        color: var(--q-text-secondary, #64748b);
    }
    .chat-modal-close:hover { border-color: #EF4444; color: #EF4444; }
    .chat-modal-body {
        padding: 1.25rem; overflow-y: auto; flex: 1;
        display: flex; flex-direction: column; gap: 1rem;
        background: var(--q-bg, #fff);
    }
    .chat-day-divider {
        text-align: center; font-size: 0.6875rem; color: var(--q-text-secondary, #94a3b8);
        margin: 0.25rem 0;
    }
    .chat-msg { display: flex; flex-direction: column; max-width: 82%; }
    .chat-msg.user { align-self: flex-start; align-items: flex-start; }
    .chat-msg.bot  { align-self: flex-end; align-items: flex-end; }
    .chat-bubble {
        padding: 0.75rem 0.9375rem; border-radius: 14px;
        font-size: 0.875rem; line-height: 1.7; white-space: pre-line;
    }
    .chat-msg.user .chat-bubble {
        background: var(--q-primary, #006C35); color: #fff;
        border-bottom-right-radius: 4px;
    }
    .chat-msg.bot .chat-bubble {
        background: var(--q-bg-secondary, #f1f5f9); color: var(--q-text-primary, #0f172a);
        border-bottom-left-radius: 4px;
    }
    .chat-msg-meta { font-size: 0.6875rem; color: var(--q-text-secondary, #94a3b8); margin-top: 0.25rem; }
    .chat-sources {
        display: flex; flex-wrap: wrap; gap: 0.375rem; margin-top: 0.5rem;
    }
    .chat-source-chip {
        display: inline-flex; align-items: center; gap: 0.25rem;
        padding: 0.1875rem 0.5rem; border-radius: 9999px;
        background: rgba(0, 108, 53, 0.08); color: var(--q-primary, #006C35);
        font-size: 0.6875rem; font-weight: 600;
    }
    .chat-modal-footer {
        padding: 0.875rem 1.25rem;
        border-top: 1px solid var(--q-border-color, #e5e7eb);
        background: var(--q-bg-secondary, #fafafa);
    }
    .chat-input-fake {
        display: flex; align-items: center; gap: 0.5rem;
        padding: 0.625rem 0.875rem;
        border: 1px solid var(--q-border-color, #e5e7eb);
        border-radius: 10px; background: var(--q-card-bg, #fff);
        color: var(--q-text-secondary, #94a3b8); font-size: 0.8125rem;
    }
    .chat-input-fake .send-btn {
        margin-inline-start: auto;
        width: 30px; height: 30px; border-radius: 8px;
        background: var(--q-border-color, #e5e7eb);
        display: flex; align-items: center; justify-content: center;
        color: #fff; flex-shrink: 0;
    }
    .chat-demo-note { font-size: 0.6875rem; color: var(--q-text-secondary, #94a3b8); text-align: center; margin-top: 0.5rem; }
    .chat-empty { text-align: center; color: var(--q-text-secondary, #94a3b8); padding: 2rem 1rem; font-size: 0.875rem; }

    /* ───── Responsive: tablets ───── */
    @media (max-width: 1024px) {
        .agent-form .form-body { padding: 1.25rem 1.35rem; }
    }

    /* ───── Responsive: small tablets / large phones ───── */
    @media (max-width: 768px) {
        .agent-card-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
        .agent-card-url { flex-wrap: wrap; gap: 0.4rem; }
        .agent-card-url-text { width: 100%; flex: 1 1 100%; }
        .btn-copy { flex: 0 0 auto; }
        .web-search-toggle { flex-wrap: wrap; gap: 0.75rem; }
        .web-search-toggle-info { min-width: 0; flex: 1 1 auto; }
    }

    /* ───── Responsive: phones ───── */
    @media (max-width: 640px) {
        .bp-checkboxes,
        .strategy-toggle,
        .language-toggle { grid-template-columns: 1fr; }

        /* Page header: stack the icon / text / provider badge vertically so the
           flex row can't grow wider than the rounded card and get clipped by
           its overflow:hidden. !important overrides the inline align-items /
           gap / padding set on the element. */
        .q-page-header {
            flex-direction: column;
            align-items: stretch !important;
            gap: var(--q-space-3) !important;
            padding: var(--q-space-5) !important;
        }
        .q-page-header > div { min-width: 0; }

        /* Tighten the form padding so fields get more usable width on phones. */
        .agent-form .form-body { padding: 1.25rem 1rem; }

        .agents-list-header { flex-wrap: wrap; gap: 0.4rem; }
        .agent-card { padding: 1rem; }
        .agent-card-actions { flex-wrap: wrap; }
        .agent-card-actions .btn-agent-action { flex: 1 1 calc(50% - 0.25rem); text-align: center; }
        .agent-card-badges { gap: 0.25rem; }
        .agent-badge { font-size: 0.65rem; padding: 0.1rem 0.45rem; }

        /* Chat modal sits flush on small screens */
        .chat-modal-overlay { padding: 0.75rem; }
        .chat-modal { max-height: 92vh; border-radius: 14px; }
        .chat-modal-header { padding: 0.85rem 1rem; }
        .chat-modal-body { padding: 1rem; gap: 0.85rem; }
        .chat-modal-footer { padding: 0.75rem 1rem; }
        .chat-msg { max-width: 92%; }
        .chat-bubble { font-size: 0.85rem; line-height: 1.65; }

        /* File upload — give more space to the file name on phones */
        .uploaded-file-name { max-width: 60vw; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    }

    /* Extra-small phones (≤360px) */
    @media (max-width: 360px) {
        .agent-form .form-body { padding: 1rem 0.85rem; }
        .agent-card { padding: 0.9rem; }
        .agent-card-name { font-size: 0.95rem; }
    }
</style>
@endpush

@section('content')
<div class="q-fade-in" style="max-width: 1100px; margin: 0 auto; padding: var(--q-space-4);" dir="rtl">

    {{-- Page Header --}}
    <div class="q-card" style="background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%); border: none; margin-bottom: var(--q-space-6); overflow: hidden;">
        <div class="q-page-header" style="padding: var(--q-space-6) var(--q-space-8); display: flex; align-items: center; gap: var(--q-space-5); flex-wrap: wrap;">
            <div class="q-page-header-icon" style="width: 56px; height: 56px; background: rgba(255,255,255,0.15); border-radius: var(--q-radius-xl, 16px); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg style="width: 28px; height: 28px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
            </div>
            <div style="flex: 1;">
                <h2 style="font-size: 1.5rem; font-weight: 800; color: white; margin: 0 0 0.25rem 0;">QU Agent</h2>
                <p style="font-size: 0.875rem; color: rgba(255,255,255,0.85); margin: 0;">{{ __('messages.qu_agent_hero_desc') }}</p>
            </div>
            <div style="font-size: 0.75rem; color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.12); padding: 0.4rem 0.75rem; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.18);">
                {{ __('messages.qu_agent_provider_label') }}: {{ $providerName }}
            </div>
        </div>
    </div>

    <div class="agent-form">
        <div class="form-body">
            <div id="agentSuccessMessage" class="success-message">
                {{ __('messages.qu_agent_created_success') }}
            </div>

            <form id="agentForm">
                <div class="form-group">
                    <label class="form-label">{{ __('messages.qu_agent_name_label') }}</label>
                    <input type="text" id="agentName" class="form-input" placeholder="{{ __('messages.qu_agent_name_placeholder') }}" required>
                    <p class="form-hint">{{ __('messages.qu_agent_name_hint') }}</p>
                </div>

                <div class="form-group">
                    <label class="form-label">{{ __('messages.qu_agent_role_label') }}</label>
                    <input type="text" id="agentRole" class="form-input" placeholder="{{ __('messages.qu_agent_role_placeholder') }}" required>
                    <p class="form-hint">{{ __('messages.qu_agent_role_hint') }}</p>
                </div>

                <div class="form-group">
                    <label class="form-label">{{ __('messages.qu_agent_strategy_label') }}</label>
                    <div class="strategy-toggle">
                        <label class="toggle-option selected" data-value="rag">
                            <input type="radio" name="strategy" value="rag" checked>
                            <div class="toggle-option-title">RAG</div>
                            <div class="toggle-option-desc">{{ __('messages.qu_agent_rag_desc') }}</div>
                            <span class="toggle-option-badge badge-green">{{ __('messages.qu_agent_recommended') }}</span>
                        </label>
                        <label class="toggle-option" data-value="fine_tuning">
                            <input type="radio" name="strategy" value="fine_tuning">
                            <div class="toggle-option-title">Fine-tuning</div>
                            <div class="toggle-option-desc">{{ __('messages.qu_agent_fine_tuning_desc') }}</div>
                            <span class="toggle-option-badge badge-blue">{{ __('messages.qu_agent_advanced') }}</span>
                        </label>
                    </div>
                </div>

                <div class="form-group" id="ragFilesGroup">
                    <label class="form-label">
                        {{ __('messages.qu_agent_knowledge_files_label') }}
                        <span class="form-label-optional">({{ __('messages.qu_agent_knowledge_files_sub') }})</span>
                    </label>
                    <div class="rag-files-section" id="ragFilesSection">
                        <div class="file-upload-area" id="agentFileUploadArea">
                            <input type="file" id="agentFileInput" multiple accept=".txt,.pdf,.doc,.docx,.csv,.json,.md" style="display: none;">
                            <svg class="file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p class="file-upload-text">{!! __('messages.qu_agent_file_upload_text') !!}</p>
                            <p class="file-upload-hint">{{ __('messages.qu_agent_file_upload_hint') }}</p>
                        </div>
                        <div id="agentUploadedFiles" class="uploaded-files"></div>
                        <p class="form-hint">{{ __('messages.qu_agent_file_upload_form_hint') }}</p>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">{{ __('messages.qu_agent_language_label') }}</label>
                    <div class="language-toggle">
                        <label class="toggle-option selected" data-value="ar">
                            <input type="radio" name="language" value="ar" checked>
                            <div class="toggle-option-title">{{ __('messages.qu_agent_language_arabic') }}</div>
                            <div class="toggle-option-desc">{{ __('messages.qu_agent_qu_llm_desc_ar') }}</div>
                            <span class="toggle-option-badge badge-green">QU LLM</span>
                        </label>
                        <label class="toggle-option" data-value="en">
                            <input type="radio" name="language" value="en">
                            <div class="toggle-option-title">English</div>
                            <div class="toggle-option-desc">{{ __('messages.qu_agent_qu_llm_desc_en') }}</div>
                            <span class="toggle-option-badge badge-green">QU LLM</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">{{ __('messages.qu_agent_best_practices') }}</label>
                    <p class="form-hint" style="margin-bottom: 0.75rem;">{{ __('messages.qu_agent_best_practices_hint') }}</p>
                    <div class="bp-checkboxes">
                        <label class="bp-checkbox">
                            <input type="checkbox" id="bpDataIsolation" checked>
                            <div>
                                <div class="bp-checkbox-label">{{ __('messages.qu_agent_bp_data_isolation') }}</div>
                                <div class="bp-checkbox-desc">{{ __('messages.qu_agent_bp_data_isolation_desc') }}</div>
                            </div>
                        </label>
                        <label class="bp-checkbox">
                            <input type="checkbox" id="bpNoHallucination" checked>
                            <div>
                                <div class="bp-checkbox-label">{{ __('messages.qu_agent_bp_no_hallucination') }}</div>
                                <div class="bp-checkbox-desc">{{ __('messages.qu_agent_bp_no_hallucination_desc') }}</div>
                            </div>
                        </label>
                        <label class="bp-checkbox">
                            <input type="checkbox" id="bpPromptGovernance" checked>
                            <div>
                                <div class="bp-checkbox-label">{{ __('messages.qu_agent_bp_prompt_governance') }}</div>
                                <div class="bp-checkbox-desc">{{ __('messages.qu_agent_bp_prompt_governance_desc') }}</div>
                            </div>
                        </label>
                        <label class="bp-checkbox">
                            <input type="checkbox" id="bpSecurity" checked>
                            <div>
                                <div class="bp-checkbox-label">{{ __('messages.qu_agent_bp_security') }}</div>
                                <div class="bp-checkbox-desc">{{ __('messages.qu_agent_bp_security_desc') }}</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">{{ __('messages.qu_agent_web_search_label') }}</label>
                    <div class="web-search-toggle" id="webSearchToggle">
                        <div class="web-search-toggle-info">
                            <div class="web-search-toggle-icon">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </div>
                            <div class="web-search-toggle-text">
                                <div class="web-search-toggle-title">{{ __('messages.qu_agent_web_search_enable') }}</div>
                                <div class="web-search-toggle-desc">{{ __('messages.qu_agent_web_search_desc') }}</div>
                            </div>
                        </div>
                        <div class="switch-track"><div class="switch-thumb"></div></div>
                    </div>
                    <input type="hidden" id="webSearchEnabled" value="0">
                </div>

                <button type="submit" id="btnCreateAgent" class="btn-generate">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    {{ __('messages.qu_agent_create_button') }}
                </button>
            </form>
        </div>
    </div>

    <div class="agents-list" id="agentsListSection">
        <div class="agents-list-header">
            <div class="agents-list-title">{{ __('messages.qu_agent_list_title') }}</div>
            <div class="agents-list-count" id="agentsCount"></div>
        </div>
        <div id="agentsList">
            <div class="agents-empty" id="agentsEmpty">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <p>{{ __('messages.qu_agent_list_empty') }}</p>
            </div>
        </div>
    </div>

    <div class="loading-overlay" id="agentLoading">
        <div class="loading-card">
            <div class="loading-spinner"></div>
            <p style="color: var(--q-text-primary, #0f172a); font-weight: 600;">{{ __('messages.qu_agent_creating') }}</p>
            <p style="color: var(--q-text-secondary, #64748b); font-size: 0.875rem; margin-top: 0.5rem;">{{ __('messages.qu_agent_please_wait') }}</p>
        </div>
    </div>

    {{-- Demo chat modal --}}
    <div class="chat-modal-overlay" id="chatModalOverlay">
        <div class="chat-modal" dir="rtl">
            <div class="chat-modal-header">
                <div class="chat-modal-avatar">
                    <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z"/>
                    </svg>
                </div>
                <div>
                    <div class="chat-modal-title" id="chatModalTitle">{{ __('messages.qu_agent_chat_title') }}</div>
                    <div class="chat-modal-sub" id="chatModalSub"></div>
                </div>
                <button type="button" class="chat-modal-close" onclick="closeAgentChat()" title="{{ __('messages.close') }}">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
            <div class="chat-modal-body" id="chatModalBody"></div>
            <div class="chat-modal-footer">
                <div class="chat-input-fake">
                    <span>{{ __('messages.qu_agent_chat_placeholder') }}</span>
                    <span class="send-btn">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                    </span>
                </div>
                <div class="chat-demo-note">{{ __('messages.qu_agent_chat_demo_note') }}</div>
            </div>
        </div>
    </div>
</div>

<script>
(function() {
    // Demo-only: in-memory agent list seeded from the controller. No API calls.
    const seed = @json($demoAgents);
    // Locale-aware labels for runtime-rendered HTML.
    const daI18n = {
        unsupported_type: @json(__('messages.agent_unsupported_file_type')),
        supported_types:  @json(__('messages.agent_supported_types')),
        file_too_large:   @json(__('messages.agent_file_too_large')),
        remove:           @json(__('messages.agent_remove')),
        count_suffix:     @json(__('messages.agent_count_suffix')),
        lang_ar:          @json(__('messages.agent_lang_ar')),
        lang_en:          @json(__('messages.agent_lang_en')),
        files_suffix:     @json(__('messages.agent_files_suffix')),
        web_search:       @json(__('messages.agent_web_search')),
        copy_link:        @json(__('messages.agent_copy_link')),
        link_copied:      @json(__('messages.agent_link_copied')),
        open_chat:        @json(__('messages.agent_open_chat')),
        archive:          @json(__('messages.agent_archive')),
        confirm_archive:  @json(__('messages.agent_confirm_archive')),
    };
    let agents = seed.map((a, i) => ({
        id: 'demo-' + (i + 1),
        name: a.name,
        role: a.role,
        knowledge_strategy: a.strategy,
        language: a.language,
        files_count: a.files ?? 0,
        web_search_enabled: false,
        share_url: window.location.origin + '/agent/demo-' + (i + 1),
        created_at: a.created_at,
    }));
    let agentFiles = [];

    const webSearchToggle = document.getElementById('webSearchToggle');
    const webSearchInput  = document.getElementById('webSearchEnabled');
    webSearchToggle.addEventListener('click', () => {
        const isActive = webSearchToggle.classList.toggle('active');
        webSearchInput.value = isActive ? '1' : '0';
    });

    document.querySelectorAll('.strategy-toggle .toggle-option, .language-toggle .toggle-option').forEach(option => {
        option.addEventListener('click', () => {
            const parent = option.closest('.strategy-toggle, .language-toggle');
            parent.querySelectorAll('.toggle-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            option.querySelector('input[type="radio"]').checked = true;
            if (parent.classList.contains('strategy-toggle')) toggleRagFilesSection();
        });
    });

    function toggleRagFilesSection() {
        const strategy = document.querySelector('input[name="strategy"]:checked').value;
        document.getElementById('ragFilesGroup').style.display = strategy === 'rag' ? 'block' : 'none';
    }

    const fileUploadArea = document.getElementById('agentFileUploadArea');
    const fileInput      = document.getElementById('agentFileInput');
    const uploadedFilesContainer = document.getElementById('agentUploadedFiles');
    const allowedExtensions = ['txt', 'pdf', 'doc', 'docx', 'csv', 'json', 'md'];
    const maxFileSize = 10 * 1024 * 1024;

    fileUploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => { handleFiles(e.target.files); fileInput.value = ''; });
    fileUploadArea.addEventListener('dragover',  (e) => { e.preventDefault(); fileUploadArea.classList.add('dragover'); });
    fileUploadArea.addEventListener('dragleave', () => fileUploadArea.classList.remove('dragover'));
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    function handleFiles(fileList) {
        Array.from(fileList).forEach(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(ext)) {
                alert(`${daI18n.unsupported_type} .${ext}\n${daI18n.supported_types} ${allowedExtensions.join(', ')}`);
                return;
            }
            if (file.size > maxFileSize) { alert(daI18n.file_too_large.replace('%s', file.name)); return; }
            if (agentFiles.some(f => f.name === file.name && f.size === file.size)) return;
            agentFiles.push(file);
        });
        renderUploadedFiles();
    }

    function renderUploadedFiles() {
        if (agentFiles.length === 0) { uploadedFilesContainer.innerHTML = ''; return; }
        uploadedFilesContainer.innerHTML = agentFiles.map((file, index) => {
            const sizeLabel = file.size > 1024 * 1024
                ? (file.size / (1024 * 1024)).toFixed(1) + ' MB'
                : (file.size / 1024).toFixed(1) + ' KB';
            return `
                <div class="uploaded-file">
                    <div class="uploaded-file-icon">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                    </div>
                    <div class="uploaded-file-info">
                        <div class="uploaded-file-name">${escapeHtml(file.name)}</div>
                        <div class="uploaded-file-size">${sizeLabel}</div>
                    </div>
                    <button type="button" class="uploaded-file-remove" onclick="removeAgentFile(${index})" title="${daI18n.remove}">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>`;
        }).join('');
    }
    window.removeAgentFile = function(index) { agentFiles.splice(index, 1); renderUploadedFiles(); };

    function renderAgentsList() {
        const listEl  = document.getElementById('agentsList');
        const countEl = document.getElementById('agentsCount');
        const emptyEl = document.getElementById('agentsEmpty');

        if (agents.length === 0) {
            listEl.innerHTML = '';
            listEl.appendChild(emptyEl);
            emptyEl.style.display = 'block';
            countEl.textContent = '';
            return;
        }
        countEl.textContent = agents.length + ' ' + daI18n.count_suffix;
        listEl.innerHTML = agents.map(agent => {
            const langBadgeClass = agent.language === 'ar' ? 'badge-green' : 'badge-blue';
            const langLabel      = agent.language === 'ar' ? daI18n.lang_ar : daI18n.lang_en;
            const strategyLabel  = agent.knowledge_strategy === 'rag' ? 'RAG' : 'Fine-tuning';
            const filesBadge     = agent.files_count > 0
                ? `<span class="agent-badge badge-blue">${agent.files_count} ${daI18n.files_suffix}</span>` : '';
            const webSearchBadge = agent.web_search_enabled
                ? `<span class="agent-badge" style="background:rgba(59,130,246,0.1);color:#3B82F6;">${daI18n.web_search}</span>` : '';
            return `
                <div class="agent-card" data-agent-id="${agent.id}">
                    <div class="agent-card-header">
                        <div class="agent-card-name">${escapeHtml(agent.name)}</div>
                        <div class="agent-card-badges">
                            <span class="agent-badge ${langBadgeClass}">${langLabel}</span>
                            <span class="agent-badge badge-green">${strategyLabel}</span>
                            ${filesBadge}
                            ${webSearchBadge}
                        </div>
                    </div>
                    <div class="agent-card-role">${escapeHtml(agent.role)}</div>
                    <div class="agent-card-url">
                        <span class="agent-card-url-text">${escapeHtml(agent.share_url)}</span>
                        <button type="button" class="btn-copy" onclick="copyAgentUrl('${escapeHtml(agent.share_url)}', this)">
                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                            </svg>
                            ${daI18n.copy_link}
                        </button>
                    </div>
                    <div class="agent-card-actions">
                        <button type="button" class="btn-agent-action" onclick="openAgentChat('${agent.id}')">
                            ${daI18n.open_chat}
                        </button>
                        <button type="button" class="btn-agent-action danger" onclick="archiveAgent('${agent.id}')">${daI18n.archive}</button>
                    </div>
                </div>`;
        }).join('');
    }

    document.getElementById('agentForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const loading = document.getElementById('agentLoading');
        const btn     = document.getElementById('btnCreateAgent');
        const successMsg = document.getElementById('agentSuccessMessage');
        btn.disabled = true;
        loading.classList.add('visible');
        successMsg.classList.remove('visible');

        setTimeout(() => {
            const id = 'demo-' + (agents.length + 1) + '-' + Date.now().toString(36);
            agents.unshift({
                id,
                name: document.getElementById('agentName').value.trim(),
                role: document.getElementById('agentRole').value.trim(),
                knowledge_strategy: document.querySelector('input[name="strategy"]:checked').value,
                language: document.querySelector('input[name="language"]:checked').value,
                files_count: agentFiles.length,
                web_search_enabled: document.getElementById('webSearchEnabled').value === '1',
                share_url: window.location.origin + '/agent/' + id,
                created_at: new Date().toISOString().slice(0, 10),
            });

            document.getElementById('agentForm').reset();
            document.querySelector('.strategy-toggle .toggle-option[data-value="rag"]').classList.add('selected');
            document.querySelector('.strategy-toggle .toggle-option[data-value="fine_tuning"]').classList.remove('selected');
            document.querySelector('.language-toggle .toggle-option[data-value="ar"]').classList.add('selected');
            document.querySelector('.language-toggle .toggle-option[data-value="en"]').classList.remove('selected');
            document.querySelector('input[name="strategy"][value="rag"]').checked = true;
            document.querySelector('input[name="language"][value="ar"]').checked = true;
            webSearchToggle.classList.remove('active');
            webSearchInput.value = '0';
            agentFiles = [];
            renderUploadedFiles();
            toggleRagFilesSection();

            renderAgentsList();
            successMsg.classList.add('visible');
            btn.disabled = false;
            loading.classList.remove('visible');
            setTimeout(() => successMsg.classList.remove('visible'), 5000);
        }, 800);
    });

    window.copyAgentUrl = function(url, btn) {
        navigator.clipboard.writeText(url).then(() => {
            const originalText = btn.innerHTML;
            btn.classList.add('copied');
            btn.innerHTML = `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> ${daI18n.link_copied}`;
            setTimeout(() => { btn.innerHTML = originalText; btn.classList.remove('copied'); }, 2000);
        });
    };

    window.archiveAgent = function(agentId) {
        if (!confirm(daI18n.confirm_archive)) return;
        agents = agents.filter(a => a.id !== agentId);
        renderAgentsList();
    };

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = String(str ?? '');
        return div.innerHTML;
    }

    // --- Demo chat history (sample conversation so users understand the experience) ---
    // Two parallel scripts; we pick one based on the active UI locale so the modal
    // makes sense whether the visitor is browsing in Arabic or English.
    @php
        $chatHistoryEn = [
            'demo-1' => [
                'day' => 'Sunday, 11 May 2026',
                'messages' => [
                    ['role' => 'user', 'time' => '10:12 AM',
                     'text' => 'Hello, what is the teaching load (in hours) for a faculty member at the associate professor rank?'],
                    ['role' => 'bot', 'time' => '10:12 AM',
                     'text' => "Hello. According to the bylaws governing Saudi university staff, the minimum teaching load for an associate professor is 10 hours per week.\nThe department council may reduce it to 8 hours for those assigned to approved administrative or supervisory duties.",
                     'sources' => ['Staff Affairs Bylaw — Article 41', 'Teaching Load Guide 1447']],
                    ['role' => 'user', 'time' => '10:14 AM',
                     'text' => 'What is the duration of a sabbatical leave and the conditions to apply for it?'],
                    ['role' => 'bot', 'time' => '10:14 AM',
                     'text' => "A sabbatical leave lasts one year, extendable by one additional semester subject to university council approval.\nKey conditions:\n• At least three years of service after appointment or promotion.\n• Submission of a research plan approved by the department and college councils.\n• No sabbatical leave granted in the preceding three years.",
                     'sources' => ['Staff Affairs Bylaw — Article 63', 'Sabbatical Leave Guide']],
                    ['role' => 'user', 'time' => '10:17 AM',
                     'text' => 'Can I combine sabbatical leave and scholarly leave in the same year?'],
                    ['role' => 'bot', 'time' => '10:17 AM',
                     'text' => "No, they cannot be combined in the same period. Scholarly leave is granted inside the university to complete a defined research project without falling below the minimum teaching load, while sabbatical leave requires full release from work.\nYou may apply for scholarly leave in a later year, after returning to active service from sabbatical.",
                     'sources' => ['Staff Affairs Bylaw — Article 65']],
                    ['role' => 'user', 'time' => '10:19 AM',
                     'text' => 'Excellent, thank you very much.'],
                    ['role' => 'bot', 'time' => '10:19 AM',
                     'text' => "You are welcome — happy to help. If you need any further clarification about the regulations or application procedures, I am available."],
                ],
            ],
        ];
        $chatHistoryAr = [
            'demo-1' => [
                'day' => 'الأحد 11 مايو 2026',
                'messages' => [
                    ['role' => 'user', 'time' => '10:12 ص',
                     'text' => 'السلام عليكم، كم عدد ساعات العبء التدريسي لعضو هيئة التدريس برتبة أستاذ مشارك؟'],
                    ['role' => 'bot', 'time' => '10:12 ص',
                     'text' => "وعليكم السلام. وفقاً للائحة تنظيم شؤون منسوبي الجامعات السعوديين، يبلغ الحد الأدنى للعبء التدريسي لعضو هيئة التدريس برتبة أستاذ مشارك ١٠ ساعات أسبوعياً.\nويجوز لمجلس القسم تخفيضه إلى ٨ ساعات لمن يكلَّف بأعمال إدارية أو إشرافية معتمدة.",
                     'sources' => ['لائحة شؤون المنسوبين — مادة ٤١', 'دليل الأعباء التدريسية ١٤٤٧']],
                    ['role' => 'user', 'time' => '10:14 ص',
                     'text' => 'وما هي مدة الإجازة العلمية وشروط التقدم لها؟'],
                    ['role' => 'bot', 'time' => '10:14 ص',
                     'text' => "مدة الإجازة العلمية سنة قابلة للتمديد فصلاً دراسياً واحداً بموافقة مجلس الجامعة.\nأبرز الشروط:\n• أمضى عضو هيئة التدريس ثلاث سنوات على الأقل في الخدمة بعد التعيين أو الترقية.\n• تقديم خطة بحثية معتمدة من مجلس القسم والكلية.\n• ألا يكون قد حصل على إجازة علمية خلال السنوات الثلاث السابقة.",
                     'sources' => ['لائحة شؤون المنسوبين — مادة ٦٣', 'دليل الإجازات العلمية']],
                    ['role' => 'user', 'time' => '10:17 ص',
                     'text' => 'هل يمكنني الجمع بين الإجازة العلمية والتفرغ العلمي في نفس العام؟'],
                    ['role' => 'bot', 'time' => '10:17 ص',
                     'text' => "لا يمكن الجمع بينهما في نفس الفترة. التفرغ العلمي يُمنح داخل الجامعة لإنجاز بحث محدد دون الإخلال بالحد الأدنى من العبء، بينما الإجازة العلمية تتطلب التفرغ الكامل خارج العمل.\nيمكن التقدم للتفرغ العلمي في عام لاحق بعد انتهاء الإجازة العلمية وعودتك للخدمة الفعلية.",
                     'sources' => ['لائحة شؤون المنسوبين — مادة ٦٥']],
                    ['role' => 'user', 'time' => '10:19 ص',
                     'text' => 'ممتاز، شكراً جزيلاً.'],
                    ['role' => 'bot', 'time' => '10:19 ص',
                     'text' => 'العفو، سعدت بخدمتك. إن احتجت أي توضيح إضافي حول اللوائح أو إجراءات التقديم فأنا متاح.'],
                ],
            ],
        ];
        $chatHistoryData = app()->getLocale() === 'en' ? $chatHistoryEn : $chatHistoryAr;
    @endphp
    const chatHistory = @json($chatHistoryData);

    const overlay = document.getElementById('chatModalOverlay');

    window.openAgentChat = function(agentId) {
        const agent = agents.find(a => a.id === agentId);
        if (!agent) return;
        const history = chatHistory[agentId];

        document.getElementById('chatModalTitle').textContent = agent.name;
        document.getElementById('chatModalSub').textContent = agent.role;

        const body = document.getElementById('chatModalBody');
        if (!history || !history.messages.length) {
            body.innerHTML = `<div class="chat-empty">{!! __('messages.agent_chat_empty') !!}</div>`;
        } else {
            const rows = history.messages.map(m => {
                const sources = (m.sources && m.sources.length)
                    ? `<div class="chat-sources">${m.sources.map(s => `
                        <span class="chat-source-chip">
                            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/></svg>
                            ${escapeHtml(s)}
                        </span>`).join('')}</div>`
                    : '';
                return `
                    <div class="chat-msg ${m.role === 'user' ? 'user' : 'bot'}">
                        <div class="chat-bubble">${escapeHtml(m.text)}</div>
                        ${sources}
                        <div class="chat-msg-meta">${escapeHtml(m.time)}</div>
                    </div>`;
            }).join('');
            body.innerHTML = `<div class="chat-day-divider">${escapeHtml(history.day)}</div>${rows}`;
        }

        overlay.classList.add('visible');
        body.scrollTop = body.scrollHeight;
    };

    window.closeAgentChat = function() {
        overlay.classList.remove('visible');
    };

    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeAgentChat(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAgentChat(); });

    renderAgentsList();
})();
</script>
@endsection