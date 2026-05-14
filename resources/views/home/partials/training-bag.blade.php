<style>
    .training-form {
        background: var(--q-card-bg);
        border-radius: 20px;
        border: 1px solid var(--q-border);
        box-shadow: var(--q-card-shadow);
    }

    /* ═══════════════════════════════════════════
       Wizard Progress Bar
       ═══════════════════════════════════════════ */
    .wizard-progress {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem 2rem;
        border-bottom: 1px solid var(--q-border);
        background: var(--q-bg-secondary);
        gap: 0;
        position: relative;
    }

    .wizard-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 1;
        cursor: pointer;
        flex-shrink: 0;
    }

    .wizard-step-circle {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: var(--q-bg);
        border: 2px solid var(--q-border);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.875rem;
        color: var(--q-text-muted);
        transition: all 0.35s ease;
        position: relative;
    }

    .wizard-step.active .wizard-step-circle {
        border-color: var(--q-primary);
        background: var(--q-primary);
        color: white;
        box-shadow: 0 0 0 4px rgba(0, 108, 53, 0.15);
        transform: scale(1.1);
    }

    .wizard-step.completed .wizard-step-circle {
        border-color: var(--q-primary);
        background: var(--q-primary);
        color: white;
    }

    .wizard-step-label {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--q-text-muted);
        margin-top: 0.5rem;
        white-space: nowrap;
        transition: color 0.3s ease;
    }

    .wizard-step.active .wizard-step-label {
        color: var(--q-primary);
        font-weight: 600;
    }

    .wizard-step.completed .wizard-step-label {
        color: var(--q-primary);
    }

    .wizard-connector {
        flex: 1;
        height: 2px;
        background: var(--q-border);
        margin: 0 0.5rem;
        margin-bottom: 1.25rem;
        transition: background 0.35s ease;
        min-width: 30px;
    }

    .wizard-connector.filled {
        background: var(--q-primary);
    }

    /* ═══════════════════════════════════════════
       Wizard Steps
       ═══════════════════════════════════════════ */
    .form-step {
        display: none;
        animation: wizardFadeIn 0.35s ease;
    }

    .form-step.active {
        display: block;
    }

    @keyframes wizardFadeIn {
        from { opacity: 0; transform: translateY(12px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .step-header {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--q-border);
    }

    .step-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--q-text);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .step-subtitle {
        font-size: 0.875rem;
        color: var(--q-text-muted);
        margin-top: 0.25rem;
    }

    /* Step Navigation Buttons */
    .step-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--q-border);
    }

    .btn-step {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 12px;
        font-size: 0.9375rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: 'IBM Plex Sans Arabic', sans-serif;
        border: 2px solid transparent;
    }

    .btn-step:active {
        transform: scale(0.97);
    }

    .btn-step-prev {
        background: var(--q-bg);
        border-color: var(--q-border);
        color: var(--q-text-secondary);
    }

    .btn-step-prev:hover {
        background: var(--q-bg-tertiary);
        border-color: var(--q-text-muted);
    }

    .btn-step-next {
        background: linear-gradient(135deg, #1B8354 0%, #22A068 100%);
        color: white;
    }

    .btn-step-next:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 16px rgba(27, 94, 32, 0.25);
    }

    .btn-step svg {
        width: 1.125rem;
        height: 1.125rem;
    }

    /* ═══════════════════════════════════════════
       Review Step
       ═══════════════════════════════════════════ */
    .review-card {
        background: var(--q-bg-secondary);
        border: 1px solid var(--q-border);
        border-radius: 14px;
        overflow: hidden;
        margin-bottom: 1rem;
    }

    .review-card-header {
        padding: 0.75rem 1rem;
        background: var(--q-bg-tertiary);
        border-bottom: 1px solid var(--q-border);
        font-weight: 600;
        font-size: 0.875rem;
        color: var(--q-text);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .review-card-header button {
        background: none;
        border: none;
        color: var(--q-primary);
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        font-family: 'IBM Plex Sans Arabic', sans-serif;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .review-card-header button:hover {
        text-decoration: underline;
    }

    .review-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0;
    }

    .review-item {
        padding: 0.875rem 1rem;
        border-bottom: 1px solid var(--q-border);
    }

    .review-item:last-child,
    .review-item:nth-last-child(2):nth-child(odd) + .review-item {
        border-bottom: none;
    }

    .review-item.full-width {
        grid-column: 1 / -1;
    }

    .review-item-label {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--q-text-muted);
        margin-bottom: 0.25rem;
        text-transform: uppercase;
        letter-spacing: 0.03em;
    }

    .review-item-value {
        font-size: 0.9375rem;
        color: var(--q-text);
        font-weight: 500;
    }

    .review-objectives {
        display: flex;
        flex-wrap: wrap;
        gap: 0.375rem;
        margin-top: 0.25rem;
    }

    .review-objective-tag {
        display: inline-block;
        padding: 0.25rem 0.625rem;
        background: rgba(0, 108, 53, 0.1);
        color: var(--q-primary);
        border-radius: 9999px;
        font-size: 0.8125rem;
    }

    .review-files-list {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin-top: 0.25rem;
    }

    .review-file-item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: 0.8125rem;
        color: var(--q-text-secondary);
    }

    /* ═══════════════════════════════════════════
       Auto-Save Draft Banner
       ═══════════════════════════════════════════ */
    .draft-banner {
        display: none;
        align-items: center;
        gap: 0.75rem;
        padding: 0.875rem 1.25rem;
        background: #FEF3C7;
        border-bottom: 1px solid #F59E0B;
        color: #92400E;
        font-size: 0.875rem;
        animation: wizardFadeIn 0.3s ease;
    }

    .draft-banner.visible {
        display: flex;
    }

    .draft-banner-icon {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        color: #F59E0B;
    }

    .draft-banner-text {
        flex: 1;
    }

    .draft-banner-actions {
        display: flex;
        gap: 0.5rem;
        flex-shrink: 0;
    }

    .draft-banner-btn {
        padding: 0.375rem 0.875rem;
        border-radius: 8px;
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        border: none;
        font-family: 'IBM Plex Sans Arabic', sans-serif;
        transition: all 0.2s ease;
    }

    .draft-banner-btn.apply {
        background: #F59E0B;
        color: white;
    }

    .draft-banner-btn.apply:hover {
        background: #D97706;
    }

    .draft-banner-btn.dismiss {
        background: transparent;
        color: #92400E;
        border: 1px solid #D97706;
    }

    .draft-banner-btn.dismiss:hover {
        background: rgba(217, 119, 6, 0.1);
    }

    .output-section {
        margin-top: 2rem;
        display: none;
    }

    .output-section.visible {
        display: block;
    }

    .output-card {
        background: var(--q-card-bg);
        border-radius: 16px;
        border: 1px solid var(--q-border);
        overflow: hidden;
    }

    .output-header {
        background: var(--q-bg-tertiary);
        padding: 1rem 1.5rem;
        display: flex;
        align-items: center;
        justify-content: between;
        border-bottom: 1px solid var(--q-border);
    }

    .output-title {
        font-weight: 600;
        color: var(--q-text);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .output-body {
        padding: 1.5rem;
        max-height: 500px;
        overflow-y: auto;
    }

    .output-content {
        white-space: pre-wrap;
        line-height: 1.8;
        color: var(--q-text);
    }

    .output-actions {
        display: flex;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--q-border);
        background: var(--q-bg-secondary);
    }

    .btn-action {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.625rem 1rem;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid var(--q-border);
        background: var(--q-bg);
        color: var(--q-text);
        font-family: 'IBM Plex Sans Arabic', sans-serif;
    }

    .btn-action:hover {
        background: var(--q-bg-tertiary);
    }

    .btn-action.primary {
        background: var(--q-primary);
        color: white;
        border-color: var(--q-primary);
    }

    .btn-action.primary:hover {
        background: var(--q-primary-dark);
    }

    /* Share Section */
    .share-section {
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--q-border);
        background: var(--q-bg-secondary);
    }

    .share-bar {
        display: flex;
        align-items: center;
        gap: 8px;
        background: var(--q-bg);
        border: 2px solid var(--q-secondary);
        border-radius: 10px;
        padding: 6px 6px 6px 14px;
    }

    .share-url-input {
        flex: 1;
        border: none;
        outline: none;
        font-family: var(--q-font-family);
        font-size: 13px;
        color: var(--q-secondary);
        background: transparent;
        direction: ltr;
        text-align: left;
    }

    .share-copy-btn, .share-open-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        font-family: var(--q-font-family);
        transition: all 0.2s;
        white-space: nowrap;
        text-decoration: none;
    }

    .share-copy-btn {
        background: var(--q-secondary);
        color: white;
    }

    .share-copy-btn:hover {
        background: var(--q-secondary-dark);
    }

    .share-open-btn {
        background: rgba(0, 108, 53, 0.1);
        color: var(--q-secondary);
    }

    .share-open-btn:hover {
        background: rgba(0, 108, 53, 0.2);
    }

    /* ═══════════════════════════════════════════
       Loading Animated Steps (training-bag specific)
       ═══════════════════════════════════════════ */
    .loading-header-icon {
        width: 64px;
        height: 64px;
        background: linear-gradient(135deg, #1B8354, #22A068);
        border-radius: 50%;
        margin: 0 auto 1.25rem;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: loadingPulse 2s ease-in-out infinite;
    }

    .loading-header-icon svg {
        width: 32px;
        height: 32px;
        color: white;
    }

    @keyframes loadingPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(30, 94, 32, 0.3); }
        50% { box-shadow: 0 0 0 12px rgba(30, 94, 32, 0); }
    }

    .loading-title {
        font-size: 1.125rem;
        font-weight: 700;
        color: var(--q-text);
        margin-bottom: 0.375rem;
    }

    .loading-subtitle {
        font-size: 0.8125rem;
        color: var(--q-text-muted);
        margin-bottom: 1.75rem;
    }

    .loading-steps {
        text-align: right;
        display: flex;
        flex-direction: column;
        gap: 0.625rem;
    }

    .loading-step {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.625rem 0.875rem;
        border-radius: 10px;
        transition: all 0.3s ease;
        background: transparent;
    }

    .loading-step.active {
        background: rgba(0, 108, 53, 0.06);
    }

    .loading-step.completed {
        background: rgba(0, 108, 53, 0.04);
    }

    .loading-step-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid var(--q-border);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: all 0.3s ease;
    }

    .loading-step.active .loading-step-icon {
        border-color: var(--q-primary);
        background: var(--q-primary);
        animation: stepPulse 1.5s ease-in-out infinite;
    }

    .loading-step.completed .loading-step-icon {
        border-color: var(--q-primary);
        background: var(--q-primary);
    }

    .loading-step-icon svg {
        width: 12px;
        height: 12px;
        color: white;
        display: none;
    }

    .loading-step.completed .loading-step-icon svg {
        display: block;
    }

    @keyframes stepPulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(0, 108, 53, 0.3); }
        50% { box-shadow: 0 0 0 6px rgba(0, 108, 53, 0); }
    }

    .loading-step-label {
        font-size: 0.875rem;
        color: var(--q-text-muted);
        transition: all 0.3s ease;
    }

    .loading-step.active .loading-step-label {
        color: var(--q-text);
        font-weight: 600;
    }

    .loading-step.completed .loading-step-label {
        color: var(--q-primary);
    }

    .loading-progress {
        margin-top: 1.5rem;
        height: 4px;
        background: var(--q-border);
        border-radius: 2px;
        overflow: hidden;
    }

    .loading-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #1B8354, #2EBD7A);
        border-radius: 2px;
        width: 0%;
        transition: width 0.5s ease;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }

    .duration-select {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
    }

    .duration-option {
        padding: 0.75rem;
        border: 2px solid var(--q-border);
        border-radius: 10px;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease;
        background: var(--q-bg);
    }

    .duration-option:hover {
        border-color: var(--q-primary);
    }

    .duration-option.selected {
        border-color: var(--q-primary);
        background: rgba(0, 108, 53, 0.1);
    }

    .duration-value {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--q-primary);
    }

    .duration-label {
        font-size: 0.75rem;
        color: var(--q-text-secondary);
    }

    .objectives-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .objective-tag {
        display: inline-flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.375rem 0.75rem;
        background: rgba(0, 108, 53, 0.1);
        color: var(--q-primary);
        border-radius: 9999px;
        font-size: 0.875rem;
    }

    .objective-tag button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
    }

    .objective-tag button:hover {
        opacity: 1;
    }

    /* ═══════════════════════════════════════════
       Responsive
       ═══════════════════════════════════════════ */
    @media (max-width: 640px) {
        .wizard-progress {
            padding: 1rem;
        }
        .wizard-step-label {
            font-size: 0.625rem;
        }
        .wizard-step-circle {
            width: 32px;
            height: 32px;
            font-size: 0.75rem;
        }
        .review-grid {
            grid-template-columns: 1fr;
        }
        .step-nav {
            flex-direction: column-reverse;
            gap: 0.75rem;
        }
        .btn-step {
            width: 100%;
            justify-content: center;
        }
        .loading-card {
            padding: 1.5rem;
        }
    }

    /* SDAIA Moderation Alert */
    .tb-moderation-alert {
        display: flex;
        align-items: flex-start;
        gap: var(--q-space-3, 0.75rem);
        padding: var(--q-space-4, 1rem) var(--q-space-5, 1.25rem);
        background: var(--q-warning-light, #FEF3C7);
        border: 1px solid var(--q-warning, #F59E0B);
        border-radius: var(--q-radius-xl, 1rem);
        margin-bottom: var(--q-space-4, 1rem);
        animation: fadeIn 0.3s ease;
        color: #92400E;
        direction: rtl;
    }

    .tb-moderation-alert strong {
        display: block;
        font-size: var(--q-font-sm, 0.875rem);
        margin-bottom: var(--q-space-1, 0.25rem);
    }

    .tb-moderation-alert p {
        font-size: var(--q-font-sm, 0.875rem);
        margin: 0;
        line-height: 1.6;
    }

    [data-theme="dark"] .tb-moderation-alert {
        background: rgba(245, 158, 11, 0.12);
        border-color: rgba(245, 158, 11, 0.3);
        color: #FCD34D;
    }
</style>

<div class="training-form">
    <!-- Draft Restore Banner -->
    <div id="draftBanner" class="draft-banner">
        <svg class="draft-banner-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <span class="draft-banner-text">لديك مسودة محفوظة سابقا. هل تريد استعادتها؟</span>
        <div class="draft-banner-actions">
            <button class="draft-banner-btn apply" onclick="applyDraft()">استعادة</button>
            <button class="draft-banner-btn dismiss" onclick="dismissDraft()">تجاهل</button>
        </div>
    </div>

    <!-- Wizard Progress -->
    <div class="wizard-progress">
        <div class="wizard-step active" data-step="1" onclick="goToStepClick(1)">
            <div class="wizard-step-circle">1</div>
            <div class="wizard-step-label">المعلومات الأساسية</div>
        </div>
        <div class="wizard-connector" id="connector1"></div>
        <div class="wizard-step" data-step="2" onclick="goToStepClick(2)">
            <div class="wizard-step-circle">2</div>
            <div class="wizard-step-label">الإعدادات</div>
        </div>
        <div class="wizard-connector" id="connector2"></div>
        <div class="wizard-step" data-step="3" onclick="goToStepClick(3)">
            <div class="wizard-step-circle">3</div>
            <div class="wizard-step-label">المحتوى</div>
        </div>
        <div class="wizard-connector" id="connector3"></div>
        <div class="wizard-step" data-step="4" onclick="goToStepClick(4)">
            <div class="wizard-step-circle">4</div>
            <div class="wizard-step-label">المراجعة</div>
        </div>
    </div>

    <div class="form-body">
        <form id="trainingForm">
            <!-- ═══════════════ Step 1: Basic Info ═══════════════ -->
            <div class="form-step active" id="step1">
                <div class="step-header">
                    <div class="step-title">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--q-primary);">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        المعلومات الأساسية
                    </div>
                    <p class="step-subtitle">أدخل العنوان والوصف للدورة التدريبية</p>
                </div>

                <!-- عنوان الدورة -->
                <div class="form-group">
                    <label class="form-label">عنوان الدورة التدريبية</label>
                    <input type="text" id="courseTitle" class="form-input" placeholder="مثال: مهارات التواصل الفعال في بيئة العمل" required>
                    <p class="form-hint">اختر عنوانا واضحا ومحددا للدورة</p>
                    <p class="form-error" id="titleError">يرجى إدخال عنوان الدورة التدريبية</p>
                </div>

                <!-- وصف الدورة -->
                <div class="form-group">
                    <label class="form-label">وصف الدورة</label>
                    <textarea id="courseDescription" class="form-textarea" placeholder="اكتب وصفا موجزا للدورة التدريبية يوضح محتواها وفائدتها للمتدربين..." required></textarea>
                    <p class="form-error" id="descError">يرجى كتابة وصف للدورة التدريبية</p>
                </div>

                <div class="step-nav">
                    <div></div>
                    <button type="button" class="btn-step btn-step-next" onclick="nextStep()">
                        التالي
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- ═══════════════ Step 2: Configuration ═══════════════ -->
            <div class="form-step" id="step2">
                <div class="step-header">
                    <div class="step-title">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--q-primary);">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        إعدادات الدورة
                    </div>
                    <p class="step-subtitle">حدد الفئة المستهدفة ومدة الدورة واللغة</p>
                </div>

                <!-- الفئة المستهدفة -->
                <div class="form-group">
                    <label class="form-label">الفئة المستهدفة</label>
                    <select id="targetAudience" class="form-select" required>
                        <option value="">اختر الفئة المستهدفة</option>
                        <option value="employees">موظفين</option>
                        <option value="managers">مدراء وقادة</option>
                        <option value="students">طلاب جامعيين</option>
                        <option value="teachers">معلمين ومدربين</option>
                        <option value="entrepreneurs">رواد أعمال</option>
                        <option value="general">جمهور عام</option>
                    </select>
                    <p class="form-error" id="audienceError">يرجى اختيار الفئة المستهدفة</p>
                </div>

                <!-- مدة الدورة -->
                <div class="form-group">
                    <label class="form-label">مدة الدورة</label>
                    <div class="duration-select">
                        <div class="duration-option" data-value="2">
                            <div class="duration-value">2</div>
                            <div class="duration-label">ساعتان</div>
                        </div>
                        <div class="duration-option" data-value="4">
                            <div class="duration-value">4</div>
                            <div class="duration-label">ساعات</div>
                        </div>
                        <div class="duration-option selected" data-value="6">
                            <div class="duration-value">6</div>
                            <div class="duration-label">ساعات</div>
                        </div>
                        <div class="duration-option" data-value="8">
                            <div class="duration-value">8</div>
                            <div class="duration-label">ساعات</div>
                        </div>
                        <div class="duration-option" data-value="12">
                            <div class="duration-value">12</div>
                            <div class="duration-label">ساعة</div>
                        </div>
                    </div>
                    <input type="hidden" id="courseDuration" value="6">
                </div>

                <!-- اللغة -->
                <div class="form-group">
                    <label class="form-label">لغة المحتوى</label>
                    <select id="contentLanguage" class="form-select">
                        <option value="ar" selected>العربية</option>
                        <option value="en">الإنجليزية</option>
                        <option value="ar-en">ثنائي اللغة</option>
                    </select>
                </div>

                <!-- التصنيف -->
                <div class="form-group">
                    <label class="form-label">التصنيف <span class="form-label-optional">(اختياري)</span></label>
                    <select id="courseCategory" class="form-select">
                        <option value="">بدون تصنيف</option>
                        <option value="technology">التقنية</option>
                        <option value="management">الإدارة</option>
                        <option value="education">التعليم</option>
                        <option value="science">العلوم</option>
                        <option value="language">اللغات</option>
                        <option value="health">الصحة</option>
                        <option value="arts">الفنون</option>
                        <option value="other">أخرى</option>
                    </select>
                </div>

                <!-- مستوى الصعوبة -->
                <div class="form-group">
                    <label class="form-label">مستوى الصعوبة <span class="form-label-optional">(اختياري)</span></label>
                    <select id="courseDifficulty" class="form-select">
                        <option value="">بدون تحديد</option>
                        <option value="beginner">مبتدئ</option>
                        <option value="intermediate">متوسط</option>
                        <option value="advanced">متقدم</option>
                    </select>
                </div>

                <div class="step-nav">
                    <button type="button" class="btn-step btn-step-prev" onclick="prevStep()">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                        السابق
                    </button>
                    <button type="button" class="btn-step btn-step-next" onclick="nextStep()">
                        التالي
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- ═══════════════ Step 3: Content ═══════════════ -->
            <div class="form-step" id="step3">
                <div class="step-header">
                    <div class="step-title">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--q-primary);">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                        المحتوى والملفات
                    </div>
                    <p class="step-subtitle">حدد أهداف الدورة وأرفق الملفات الداعمة</p>
                </div>

                <!-- الأهداف التدريبية -->
                <div class="form-group">
                    <label class="form-label">الأهداف التدريبية</label>
                    <div class="flex gap-2">
                        <input type="text" id="objectiveInput" class="form-input flex-1" placeholder="أدخل هدفا تدريبيا واضغط إضافة">
                        <button type="button" id="addObjective" class="btn-action primary" style="white-space: nowrap;">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            إضافة
                        </button>
                    </div>
                    <div id="objectivesList" class="objectives-list"></div>
                    <p class="form-hint">أضف 3-5 أهداف تدريبية واضحة وقابلة للقياس</p>
                    <p class="form-error" id="objectivesError">يرجى إضافة هدف تدريبي واحد على الأقل</p>
                </div>

                <!-- الملفات الداعمة -->
                <div class="form-group">
                    <label class="form-label">
                        ملفات داعمة
                        <span class="form-label-optional">(اختياري)</span>
                    </label>
                    <div class="file-upload-area" id="fileUploadArea">
                        <input type="file" id="fileInput" multiple accept=".txt,.pdf,.doc,.docx,.ppt,.pptx" style="display: none;">
                        <svg class="file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                        </svg>
                        <p class="file-upload-text">
                            <strong>اضغط لرفع الملفات</strong> أو اسحب وأفلت هنا
                        </p>
                        <p class="file-upload-hint">TXT, PDF, Word, PowerPoint - بحد أقصى 10MB لكل ملف</p>
                    </div>
                    <div id="uploadedFiles" class="uploaded-files"></div>
                    <p class="form-hint">ارفع ملفات مرجعية لإثراء محتوى الحقيبة التدريبية</p>
                </div>

                <div class="step-nav">
                    <button type="button" class="btn-step btn-step-prev" onclick="prevStep()">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                        السابق
                    </button>
                    <button type="button" class="btn-step btn-step-next" onclick="nextStep()">
                        المراجعة والتوليد
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- ═══════════════ Step 4: Review & Generate ═══════════════ -->
            <div class="form-step" id="step4">
                <div class="step-header">
                    <div class="step-title">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--q-primary);">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        مراجعة وتوليد
                    </div>
                    <p class="step-subtitle">تأكد من صحة البيانات قبل بدء التوليد</p>
                </div>

                <div id="reviewContent">
                    <!-- Dynamically populated -->
                </div>

                <!-- زر التوليد -->
                <button type="submit" id="generateBtn" class="btn-generate" style="margin-top: 1.5rem;">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                    توليد الحقيبة التدريبية
                </button>

                <div class="step-nav" style="border-top: none; margin-top: 1rem; padding-top: 0;">
                    <button type="button" class="btn-step btn-step-prev" onclick="prevStep()">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                        </svg>
                        العودة للتعديل
                    </button>
                    <div></div>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- Output Section -->
<div id="outputSection" class="output-section">
    <div class="output-card">
        {{-- Success State: Course Created --}}
        <div id="successState" style="padding: 0;">
            {{-- Hero Banner --}}
            <div style="background:linear-gradient(135deg, #1B8354 0%, #22A068 50%, #22A068 100%);padding:40px 32px;text-align:center;position:relative;overflow:hidden;">
                <div style="position:absolute;inset:0;background:url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22><circle cx=%2240%22 cy=%2240%22 r=%2232%22 fill=%22none%22 stroke=%22rgba(255,255,255,0.05)%22 stroke-width=%222%22/></svg>') repeat;opacity:0.5;"></div>
                <div style="position:relative;z-index:1;">
                    <div style="width:72px;height:72px;background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;border:2px solid rgba(255,255,255,0.2);">
                        <svg width="36" height="36" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <h3 style="font-size:24px;font-weight:800;color:white;margin:0 0 6px;">🎉 تم إنشاء الدورة التدريبية بنجاح!</h3>
                    <p style="font-size:14px;color:rgba(255,255,255,0.8);margin:0;">الدورة جاهزة للعرض والمشاركة</p>
                </div>
            </div>

            {{-- Content Stats --}}
            <div id="contentStats" style="display:flex;gap:12px;padding:20px 24px;background:var(--q-bg-secondary);border-bottom:1px solid var(--q-border);flex-wrap:wrap;justify-content:center;">
            </div>

            {{-- Action Buttons --}}
            <div style="padding:24px;text-align:center;">
                <div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-bottom:20px;">
                    <a id="shareOpenBtn" href="#" target="_blank" style="text-decoration:none;display:inline-flex;align-items:center;gap:8px;padding:14px 32px;border-radius:14px;font-size:16px;font-weight:700;background:linear-gradient(135deg,#1B8354,#22A068);color:white;transition:all 0.25s cubic-bezier(0.16,1,0.3,1);box-shadow:0 4px 16px rgba(27,94,32,0.3);">
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                        فتح الدورة التفاعلية
                    </a>
                    <button onclick="downloadPptx()" id="downloadPptxBtn" style="display:inline-flex;align-items:center;gap:8px;padding:14px 24px;border-radius:14px;font-size:14px;font-weight:700;background:var(--q-card-bg);border:1.5px solid var(--q-card-border);color:var(--q-text-primary);cursor:pointer;transition:all 0.2s;">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                        تحميل PPTX
                    </button>
                    <button onclick="resetForm()" style="display:inline-flex;align-items:center;gap:8px;padding:14px 24px;border-radius:14px;font-size:14px;font-weight:700;background:var(--q-card-bg);border:1.5px solid var(--q-card-border);color:var(--q-text-primary);cursor:pointer;transition:all 0.2s;">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        إنشاء دورة جديدة
                    </button>
                </div>

                {{-- Share URL --}}
                <div id="shareSection" class="share-section" style="display:none;max-width:500px;margin:0 auto;">
                    <div style="display:flex;align-items:center;gap:8px;background:var(--q-gray-50);padding:10px 14px;border-radius:10px;border:1px solid var(--q-card-border);">
                        <input type="text" id="shareUrl" readonly style="flex:1;border:none;background:transparent;font-size:13px;color:var(--q-text-secondary);outline:none;font-family:monospace;" />
                        <button onclick="copyShareUrl()" id="shareCopyBtn" style="background:var(--q-primary);color:white;border:none;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;white-space:nowrap;font-family:inherit;">
                            نسخ الرابط
                        </button>
                    </div>
                    <div id="videoSearchStatus" style="display:none;margin-top:8px;font-size:13px;color:#1B8354;align-items:center;gap:6px;">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="animation:spin 1s linear infinite;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                        جاري البحث عن فيديوهات تعليمية...
                    </div>
                </div>
            </div>

            {{-- Chapters Preview --}}
            <div id="chaptersPreview" style="display:none;padding:0 24px 24px;">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
                    <div style="width:32px;height:32px;background:linear-gradient(135deg,#1B8354,#2EBD7A);border-radius:8px;display:flex;align-items:center;justify-content:center;color:white;font-size:16px;">📋</div>
                    <h4 style="font-size:16px;font-weight:700;color:var(--q-text-primary);margin:0;">فهرس الفصول</h4>
                </div>
                <div id="chaptersGrid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;"></div>
            </div>
        </div>

        {{-- Hidden: raw content for copy/download functions --}}
        <div id="outputContent" class="output-content" style="display:none;"></div>
    </div>
</div>

<!-- Loading Overlay — Animated Steps -->
<div id="loadingOverlay" class="loading-overlay">
    <div class="loading-card">
        <div class="loading-header-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
        </div>
        <div class="loading-title">جاري إنشاء الدورة التدريبية</div>
        <p class="loading-subtitle">يتم الآن معالجة طلبك وإنشاء محتوى شامل ومفصل</p>

        <div class="loading-steps">
            <div class="loading-step active" data-loading-step="0">
                <div class="loading-step-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span class="loading-step-label">تحليل المتطلبات والأهداف</span>
            </div>
            <div class="loading-step" data-loading-step="1">
                <div class="loading-step-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span class="loading-step-label">إنشاء هيكل الدورة والفصول</span>
            </div>
            <div class="loading-step" data-loading-step="2">
                <div class="loading-step-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span class="loading-step-label">كتابة المحتوى التفصيلي</span>
            </div>
            <div class="loading-step" data-loading-step="3">
                <div class="loading-step-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span class="loading-step-label">إنشاء الاختبارات التفاعلية</span>
            </div>
            <div class="loading-step" data-loading-step="4">
                <div class="loading-step-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span class="loading-step-label">المراجعة النهائية والتنسيق</span>
            </div>
        </div>

        <div class="loading-progress">
            <div class="loading-progress-bar" id="loadingProgressBar"></div>
        </div>
    </div>
</div>

<script>
// ═══════════════════════════════════════════
// Training Bag Form Handler — Multi-Step Wizard
// ═══════════════════════════════════════════

const trainingForm = document.getElementById('trainingForm');
const objectiveInput = document.getElementById('objectiveInput');
const addObjectiveBtn = document.getElementById('addObjective');
const objectivesList = document.getElementById('objectivesList');
const durationOptions = document.querySelectorAll('.duration-option');
const courseDurationInput = document.getElementById('courseDuration');
const outputSection = document.getElementById('outputSection');
const outputContent = document.getElementById('outputContent');
const loadingOverlay = document.getElementById('loadingOverlay');
const generateBtn = document.getElementById('generateBtn');

// File Upload Elements
const fileUploadArea = document.getElementById('fileUploadArea');
const fileInput = document.getElementById('fileInput');
const uploadedFilesContainer = document.getElementById('uploadedFiles');

let objectives = [];
let uploadedFiles = [];
let fileContents = [];
let lastGeneratedContent = '';
let lastFormData = {};
let currentStep = 1;
const totalSteps = 4;
let draftSaveTimer = null;
let loadingStepTimer = null;

// ═══════════════════════════════════════════
// Wizard Navigation
// ═══════════════════════════════════════════

function goToStep(step) {
    if (step < 1 || step > totalSteps) return;

    // Hide current step
    document.getElementById('step' + currentStep).classList.remove('active');

    // Show target step
    currentStep = step;
    document.getElementById('step' + currentStep).classList.add('active');

    // Update progress indicators
    updateWizardProgress();

    // If going to review step, build the review
    if (currentStep === 4) {
        buildReview();
    }

    // Auto-save draft
    saveDraft();
}

function nextStep() {
    if (!validateStep(currentStep)) return;
    goToStep(currentStep + 1);
}

function prevStep() {
    goToStep(currentStep - 1);
}

function goToStepClick(step) {
    // Only allow clicking on completed steps or the next step
    if (step < currentStep) {
        goToStep(step);
    } else if (step === currentStep + 1) {
        nextStep();
    }
}

function updateWizardProgress() {
    const steps = document.querySelectorAll('.wizard-step');
    const connectors = document.querySelectorAll('.wizard-connector');

    steps.forEach((el, i) => {
        const stepNum = i + 1;
        el.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
            el.classList.add('active');
        } else if (stepNum < currentStep) {
            el.classList.add('completed');
            // Replace number with checkmark for completed steps
            el.querySelector('.wizard-step-circle').innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>';
        } else {
            el.querySelector('.wizard-step-circle').textContent = stepNum;
        }
    });

    connectors.forEach((el, i) => {
        if (i + 1 < currentStep) {
            el.classList.add('filled');
        } else {
            el.classList.remove('filled');
        }
    });
}

// ═══════════════════════════════════════════
// Step Validation
// ═══════════════════════════════════════════

function validateStep(step) {
    clearErrors();

    if (step === 1) {
        let valid = true;
        const title = document.getElementById('courseTitle').value.trim();
        const desc = document.getElementById('courseDescription').value.trim();

        if (!title) {
            showError('courseTitle', 'titleError');
            valid = false;
        }
        if (!desc) {
            showError('courseDescription', 'descError');
            valid = false;
        }
        return valid;
    }

    if (step === 2) {
        let valid = true;
        const audience = document.getElementById('targetAudience').value;
        if (!audience) {
            showError('targetAudience', 'audienceError');
            valid = false;
        }
        return valid;
    }

    if (step === 3) {
        if (objectives.length < 1) {
            document.getElementById('objectivesError').classList.add('visible');
            return false;
        }
        return true;
    }

    return true;
}

function showError(inputId, errorId) {
    document.getElementById(inputId).classList.add('input-error');
    document.getElementById(errorId).classList.add('visible');
}

function clearErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.form-error').forEach(el => el.classList.remove('visible'));
}

// Clear errors on input
document.querySelectorAll('.form-input, .form-textarea, .form-select').forEach(el => {
    el.addEventListener('input', () => {
        el.classList.remove('input-error');
        const errorEl = el.closest('.form-group')?.querySelector('.form-error');
        if (errorEl) errorEl.classList.remove('visible');
        debounceSaveDraft();
    });
});

// ═══════════════════════════════════════════
// Review Step Builder
// ═══════════════════════════════════════════

function buildReview() {
    const title = document.getElementById('courseTitle').value.trim();
    const desc = document.getElementById('courseDescription').value.trim();
    const audience = document.getElementById('targetAudience');
    const audienceText = audience.options[audience.selectedIndex]?.text || '';
    const duration = courseDurationInput.value;
    const language = document.getElementById('contentLanguage');
    const languageText = language.options[language.selectedIndex]?.text || '';

    const durationLabels = { '2': 'ساعتان', '4': '4 ساعات', '6': '6 ساعات', '8': '8 ساعات', '12': '12 ساعة' };

    let html = '';

    // Basic Info Card
    html += `
        <div class="review-card">
            <div class="review-card-header">
                <span>المعلومات الأساسية</span>
                <button type="button" onclick="goToStep(1)">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    تعديل
                </button>
            </div>
            <div class="review-grid">
                <div class="review-item full-width">
                    <div class="review-item-label">العنوان</div>
                    <div class="review-item-value">${escapeHtml(title)}</div>
                </div>
                <div class="review-item full-width">
                    <div class="review-item-label">الوصف</div>
                    <div class="review-item-value" style="font-size: 0.8125rem; color: var(--q-text-secondary);">${escapeHtml(desc)}</div>
                </div>
            </div>
        </div>
    `;

    // Settings Card
    html += `
        <div class="review-card">
            <div class="review-card-header">
                <span>إعدادات الدورة</span>
                <button type="button" onclick="goToStep(2)">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    تعديل
                </button>
            </div>
            <div class="review-grid">
                <div class="review-item">
                    <div class="review-item-label">الفئة المستهدفة</div>
                    <div class="review-item-value">${escapeHtml(audienceText)}</div>
                </div>
                <div class="review-item">
                    <div class="review-item-label">المدة</div>
                    <div class="review-item-value">${durationLabels[duration] || duration + ' أيام'}</div>
                </div>
                <div class="review-item">
                    <div class="review-item-label">اللغة</div>
                    <div class="review-item-value">${escapeHtml(languageText)}</div>
                </div>
            </div>
        </div>
    `;

    // Content Card
    html += `
        <div class="review-card">
            <div class="review-card-header">
                <span>المحتوى والملفات</span>
                <button type="button" onclick="goToStep(3)">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                    تعديل
                </button>
            </div>
            <div class="review-grid">
                <div class="review-item full-width">
                    <div class="review-item-label">الأهداف التدريبية (${objectives.length})</div>
                    <div class="review-objectives">
                        ${objectives.map(o => `<span class="review-objective-tag">${escapeHtml(o)}</span>`).join('')}
                    </div>
                </div>
                ${uploadedFiles.length > 0 ? `
                <div class="review-item full-width">
                    <div class="review-item-label">الملفات المرفقة (${uploadedFiles.length})</div>
                    <div class="review-files-list">
                        ${uploadedFiles.map(f => `
                            <div class="review-file-item">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="color: var(--q-primary);"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                ${escapeHtml(f.name)} <span style="color: var(--q-text-muted);">(${formatFileSize(f.size)})</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;

    document.getElementById('reviewContent').innerHTML = html;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ═══════════════════════════════════════════
// Auto-Save Drafts
// ═══════════════════════════════════════════

const DRAFT_KEY = 'quai-training-draft';
const DRAFT_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

function debounceSaveDraft() {
    if (draftSaveTimer) clearTimeout(draftSaveTimer);
    draftSaveTimer = setTimeout(saveDraft, 1000);
}

function saveDraft() {
    const draft = {
        title: document.getElementById('courseTitle').value,
        description: document.getElementById('courseDescription').value,
        audience: document.getElementById('targetAudience').value,
        duration: courseDurationInput.value,
        language: document.getElementById('contentLanguage').value,
        objectives: objectives,
        currentStep: currentStep,
        savedAt: Date.now()
    };
    try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch (e) { /* localStorage full or unavailable */ }
}

function restoreDraft() {
    try {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (!saved) return;

        const draft = JSON.parse(saved);
        if (Date.now() - draft.savedAt > DRAFT_MAX_AGE) {
            localStorage.removeItem(DRAFT_KEY);
            return;
        }

        // Check if draft has meaningful content
        if (!draft.title && !draft.description && (!draft.objectives || draft.objectives.length === 0)) {
            return;
        }

        // Show restore banner
        document.getElementById('draftBanner').classList.add('visible');
    } catch (e) { /* parse error */ }
}

function applyDraft() {
    try {
        const saved = localStorage.getItem(DRAFT_KEY);
        if (!saved) return;

        const draft = JSON.parse(saved);

        if (draft.title) document.getElementById('courseTitle').value = draft.title;
        if (draft.description) document.getElementById('courseDescription').value = draft.description;
        if (draft.audience) document.getElementById('targetAudience').value = draft.audience;
        if (draft.duration) {
            courseDurationInput.value = draft.duration;
            durationOptions.forEach(o => {
                o.classList.toggle('selected', o.dataset.value === draft.duration);
            });
        }
        if (draft.language) document.getElementById('contentLanguage').value = draft.language;
        if (draft.objectives && draft.objectives.length) {
            objectives = draft.objectives;
            renderObjectives();
        }

        // Navigate to the saved step
        if (draft.currentStep && draft.currentStep > 1) {
            goToStep(draft.currentStep);
        }
    } catch (e) { /* parse error */ }

    dismissDraft();
}

function dismissDraft() {
    document.getElementById('draftBanner').classList.remove('visible');
    localStorage.removeItem(DRAFT_KEY);
}

// Check for drafts on load
restoreDraft();

// ═══════════════════════════════════════════
// Duration Selection
// ═══════════════════════════════════════════

durationOptions.forEach(option => {
    option.addEventListener('click', () => {
        durationOptions.forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        courseDurationInput.value = option.dataset.value;
        debounceSaveDraft();
    });
});

// ═══════════════════════════════════════════
// Objectives
// ═══════════════════════════════════════════

function addObjective() {
    const value = objectiveInput.value.trim();
    if (value && objectives.length < 10) {
        objectives.push(value);
        renderObjectives();
        objectiveInput.value = '';
        // Clear error if present
        document.getElementById('objectivesError').classList.remove('visible');
        debounceSaveDraft();
    }
}

addObjectiveBtn.addEventListener('click', addObjective);
objectiveInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addObjective();
    }
});

function removeObjective(index) {
    objectives.splice(index, 1);
    renderObjectives();
    debounceSaveDraft();
}

function renderObjectives() {
    objectivesList.innerHTML = objectives.map((obj, i) => `
        <span class="objective-tag">
            ${obj}
            <button type="button" onclick="removeObjective(${i})">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </span>
    `).join('');
}

// ═══════════════════════════════════════════
// File Upload Handlers
// ═══════════════════════════════════════════

fileUploadArea.addEventListener('click', () => fileInput.click());

fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    for (const file of files) {
        if (file.size > 10 * 1024 * 1024) {
            alert(`الملف ${file.name} أكبر من 10MB`);
            continue;
        }

        uploadedFiles.push(file);

        if (file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = (e) => {
                fileContents.push({
                    name: file.name,
                    content: e.target.result
                });
            };
            reader.readAsText(file);
        } else {
            fileContents.push({
                name: file.name,
                content: `[ملف مرفق: ${file.name}]`
            });
        }
    }

    renderUploadedFiles();
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    fileContents.splice(index, 1);
    renderUploadedFiles();
}

function renderUploadedFiles() {
    uploadedFilesContainer.innerHTML = uploadedFiles.map((file, i) => `
        <div class="uploaded-file">
            <div class="uploaded-file-icon">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
            </div>
            <div class="uploaded-file-info">
                <div class="uploaded-file-name">${file.name}</div>
                <div class="uploaded-file-size">${formatFileSize(file.size)}</div>
            </div>
            <button type="button" class="uploaded-file-remove" onclick="removeFile(${i})">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    `).join('');
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// ═══════════════════════════════════════════
// Loading Steps Animation
// ═══════════════════════════════════════════

let currentLoadingStep = 0;
const loadingStepCount = 5;
const loadingStepInterval = 15000; // 15s per step

function startLoadingAnimation() {
    currentLoadingStep = 0;
    updateLoadingSteps();

    loadingStepTimer = setInterval(() => {
        if (currentLoadingStep < loadingStepCount - 1) {
            currentLoadingStep++;
            updateLoadingSteps();
        }
    }, loadingStepInterval);
}

function stopLoadingAnimation() {
    if (loadingStepTimer) {
        clearInterval(loadingStepTimer);
        loadingStepTimer = null;
    }
    // Reset all loading steps
    document.querySelectorAll('.loading-step').forEach(el => {
        el.classList.remove('active', 'completed');
    });
    document.getElementById('loadingProgressBar').style.width = '0%';
}

function updateLoadingSteps() {
    const steps = document.querySelectorAll('.loading-step');
    steps.forEach((el, i) => {
        el.classList.remove('active', 'completed');
        if (i < currentLoadingStep) {
            el.classList.add('completed');
        } else if (i === currentLoadingStep) {
            el.classList.add('active');
        }
    });

    // Update progress bar
    const progress = ((currentLoadingStep + 1) / loadingStepCount) * 100;
    document.getElementById('loadingProgressBar').style.width = progress + '%';
}

// ═══════════════════════════════════════════
// Form Submission
// ═══════════════════════════════════════════

trainingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (objectives.length < 1) {
        alert('يرجى إضافة هدف تدريبي واحد على الأقل');
        return;
    }

    // Build FormData for multipart upload (so files are actually sent to server)
    const formDataObj = new FormData();
    formDataObj.append('title', document.getElementById('courseTitle').value);
    formDataObj.append('description', document.getElementById('courseDescription').value);
    formDataObj.append('targetAudience', document.getElementById('targetAudience').value);
    formDataObj.append('duration', courseDurationInput.value);
    formDataObj.append('language', document.getElementById('contentLanguage').value);
    objectives.forEach((obj, i) => formDataObj.append(`objectives[${i}]`, obj));

    // Attach actual files for server-side extraction (PDF, Word, PPTX)
    uploadedFiles.forEach(file => {
        formDataObj.append('supportingFiles[]', file);
    });

    // Also send client-side TXT content as fallback
    const txtContents = fileContents.filter(f => !f.content.startsWith('[ملف مرفق:'));
    if (txtContents.length > 0) {
        const combinedTxt = txtContents.map(f => `### ${f.name}\n${f.content}`).join('\n\n---\n\n');
        formDataObj.append('fileContents', combinedTxt);
    }

    // Keep a plain object for downstream use (save, PPTX download, etc.)
    const formData = {
        title: document.getElementById('courseTitle').value,
        description: document.getElementById('courseDescription').value,
        targetAudience: document.getElementById('targetAudience').value,
        duration: courseDurationInput.value,
        objectives: objectives,
        language: document.getElementById('contentLanguage').value,
    };

    loadingOverlay.classList.add('visible');
    generateBtn.disabled = true;
    startLoadingAnimation();

    const controller = new AbortController();
    // Chapter-by-chapter generation: 6-10 AI calls, each up to 300s + outline
    const timeoutId = setTimeout(() => controller.abort(), 3600000); // 60 minutes max

    try {
        const response = await fetch('/api/training-bag/generate', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
            },
            body: formDataObj,
            signal: controller.signal
        });

        let data;
        try {
            data = await response.json();
        } catch (parseError) {
            console.error('Failed to parse response:', parseError);
            throw new Error('فشل في قراءة الاستجابة من الخادم. قد يكون الطلب قد انتهت مهلته.');
        }

        if (!response.ok) {
            const errorMsg = data.message || data.error?.message || 'فشل في توليد الحقيبة التدريبية';
            const isModeration = data.moderation === true || data.error?.type === 'content_moderation';
            console.error('Server error:', data);
            if (isModeration) {
                throw new Error('SDAIA_MODERATION:' + errorMsg);
            }
            throw new Error(errorMsg);
        }

        lastGeneratedContent = data.content || data;
        lastFormData = formData;

        // Store raw content in hidden div for potential copy/download
        outputContent.textContent = typeof lastGeneratedContent === 'string' ? lastGeneratedContent : JSON.stringify(lastGeneratedContent, null, 2);
        outputSection.classList.add('visible');

        // Build content stats and chapters preview
        buildContentPreview(lastGeneratedContent);

        saveAndGetShareUrl(formData, lastGeneratedContent);

        // Clear draft after successful generation
        localStorage.removeItem(DRAFT_KEY);

        outputSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        console.error('Error:', error);

        if (error.message.startsWith('SDAIA_MODERATION:')) {
            const msg = error.message.replace('SDAIA_MODERATION:', '');
            showModerationAlert(msg);
        } else {
            let errorMessage = 'حدث خطأ: ' + error.message;
            if (error.name === 'AbortError') {
                errorMessage = 'انتهت مهلة توليد الحقيبة التدريبية. يرجى المحاولة مرة أخرى. توليد الفصول يستغرق عدة دقائق.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'حدث خطأ في الاتصال بالخادم. يرجى التحقق من أن الخادم يعمل والمحاولة مرة أخرى.';
            }
            alert(errorMessage);
        }
    } finally {
        clearTimeout(timeoutId);
        loadingOverlay.classList.remove('visible');
        generateBtn.disabled = false;
        stopLoadingAnimation();
    }
});

async function downloadPptx() {
    if (!lastGeneratedContent || !lastFormData.title) {
        alert('يرجى توليد الحقيبة التدريبية أولاً');
        return;
    }

    const downloadBtn = document.getElementById('downloadPptxBtn');
    const originalText = downloadBtn.innerHTML;

    try {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `
            <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            جاري التحميل...
        `;

        const response = await fetch('/api/training-bag/download-pptx', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/octet-stream',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
            },
            body: JSON.stringify({
                title: lastFormData.title,
                description: lastFormData.description,
                targetAudience: lastFormData.targetAudience,
                duration: lastFormData.duration,
                objectives: lastFormData.objectives,
                language: lastFormData.language,
                content: lastGeneratedContent
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'فشل في تحميل ملف العرض التقديمي');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${lastFormData.title}_${new Date().toISOString().split('T')[0]}.pptx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Error downloading PPTX:', error);
        alert('حدث خطأ أثناء تحميل ملف العرض التقديمي: ' + error.message);
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = originalText;
    }
}

async function saveAndGetShareUrl(formData, content) {
    try {
        const response = await fetch('/api/training-bag/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
            },
            body: JSON.stringify({
                title: formData.title,
                description: formData.description,
                targetAudience: formData.targetAudience,
                duration: formData.duration,
                objectives: formData.objectives,
                language: formData.language,
                content: content,
                category: document.getElementById('courseCategory')?.value || null,
                difficulty_level: document.getElementById('courseDifficulty')?.value || null
            })
        });

        const data = await response.json();

        if (response.ok && data.share_url) {
            document.getElementById('shareUrl').value = data.share_url;
            document.getElementById('shareOpenBtn').href = data.share_url;
            document.getElementById('shareSection').style.display = 'block';

            // Videos will be auto-fetched when the interactive course view loads
            // Open the course view immediately
            window.open(data.share_url, '_blank');
        }
    } catch (error) {
        console.error('Failed to save training bag:', error);
    }
}

async function searchVideosForBag(bagId) {
    try {
        const videoStatus = document.getElementById('videoSearchStatus');
        if (videoStatus) videoStatus.style.display = 'block';

        await fetch(`/api/training-bag/${bagId}/search-videos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
            }
        });

        if (videoStatus) {
            videoStatus.textContent = '{{ __("تم العثور على فيديوهات تعليمية ذات صلة") }}';
            setTimeout(() => videoStatus.style.display = 'none', 3000);
        }
    } catch (error) {
        console.debug('Video search failed (non-critical):', error);
        const videoStatus = document.getElementById('videoSearchStatus');
        if (videoStatus) videoStatus.style.display = 'none';
    }
}

function copyShareUrl() {
    const shareUrlInput = document.getElementById('shareUrl');
    const copyBtn = document.getElementById('shareCopyBtn');

    navigator.clipboard.writeText(shareUrlInput.value).then(() => {
        const originalHTML = copyBtn.innerHTML;
        copyBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            تم النسخ!
        `;
        setTimeout(() => { copyBtn.innerHTML = originalHTML; }, 2000);
    });
}

function resetForm() {
    trainingForm.reset();
    objectives = [];
    uploadedFiles = [];
    fileContents = [];
    lastGeneratedContent = '';
    lastFormData = {};
    renderObjectives();
    renderUploadedFiles();
    outputSection.classList.remove('visible');
    document.getElementById('shareSection').style.display = 'none';
    document.getElementById('shareUrl').value = '';

    // Reset duration selection
    durationOptions.forEach(o => o.classList.remove('selected'));
    document.querySelector('.duration-option[data-value="6"]').classList.add('selected');
    courseDurationInput.value = '6';

    // Reset wizard to step 1
    goToStep(1);

    // Clear draft
    localStorage.removeItem(DRAFT_KEY);

    // Scroll to top of form
    document.querySelector('.training-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Build content preview with stats and chapter cards
function buildContentPreview(content) {
    if (!content || typeof content !== 'string') return;

    // Extract chapters from markdown
    const chapterMatches = content.match(/^## .+$/gm) || [];
    const quizCount = (content.match(/\[QUIZ\]/g) || []).length;
    const wordCount = content.replace(/[^\u0600-\u06FFa-zA-Z\s]/g, ' ').split(/\s+/).filter(Boolean).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Build stats
    const statsEl = document.getElementById('contentStats');
    if (statsEl) {
        const stats = [
            { icon: '📚', label: 'الفصول', value: chapterMatches.length },
            { icon: '📝', label: 'الاختبارات', value: quizCount },
            { icon: '📖', label: 'الكلمات', value: wordCount.toLocaleString('ar-SA') },
            { icon: '⏱️', label: 'وقت القراءة', value: readingTime + ' دقيقة' },
        ];
        statsEl.innerHTML = stats.map(s => `
            <div style="flex:1;min-width:120px;text-align:center;background:var(--q-card-bg);padding:14px 12px;border-radius:12px;border:1px solid var(--q-border);">
                <div style="font-size:24px;margin-bottom:4px;">${s.icon}</div>
                <div style="font-size:20px;font-weight:800;color:var(--q-primary);">${s.value}</div>
                <div style="font-size:12px;color:var(--q-text-muted);font-weight:600;">${s.label}</div>
            </div>
        `).join('');
    }

    // Build chapters preview grid
    if (chapterMatches.length > 0) {
        const previewEl = document.getElementById('chaptersPreview');
        const gridEl = document.getElementById('chaptersGrid');
        if (previewEl && gridEl) {
            gridEl.innerHTML = chapterMatches.map((ch, i) => {
                const title = ch.replace(/^##\s*/, '').replace(/\*\*/g, '');
                return `
                    <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--q-card-bg);border:1px solid var(--q-border);border-radius:12px;transition:all 0.2s;">
                        <div style="width:36px;height:36px;background:linear-gradient(135deg,#1B8354,#2EBD7A);border-radius:10px;display:flex;align-items:center;justify-content:center;color:white;font-weight:800;font-size:14px;flex-shrink:0;">${i + 1}</div>
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:14px;font-weight:700;color:var(--q-text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${title}</div>
                            <div style="font-size:12px;color:var(--q-text-muted);margin-top:2px;">الفصل ${i + 1}</div>
                        </div>
                        <div style="color:#2EBD7A;font-size:16px;">✓</div>
                    </div>`;
            }).join('');
            previewEl.style.display = 'block';
        }
    }
}

// SDAIA Content Moderation Alert
function showModerationAlert(message) {
    // Remove any existing alert
    document.querySelector('.tb-moderation-alert')?.remove();

    const alertEl = document.createElement('div');
    alertEl.className = 'tb-moderation-alert';
    alertEl.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px;">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div>
            <strong>تنبيه - سياسة سدايا</strong>
            <p>${message}</p>
        </div>
        <button onclick="this.closest('.tb-moderation-alert').remove()" style="background:none;border:none;cursor:pointer;padding:4px;color:inherit;opacity:0.6;font-size:18px;">&times;</button>
    `;
    // Insert before the form
    const form = document.querySelector('.training-form');
    if (form) {
        form.parentNode.insertBefore(alertEl, form);
        alertEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
</script>
