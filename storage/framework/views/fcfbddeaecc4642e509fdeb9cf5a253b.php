<?php $__env->startSection('title', 'المستشار الرقمي - QUAI'); ?>
<?php $__env->startSection('page-title', 'QU Agent'); ?>

<?php $__env->startPush('styles'); ?>
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

    @media (max-width: 640px) {
        .bp-checkboxes,
        .strategy-toggle,
        .language-toggle { grid-template-columns: 1fr; }
    }
</style>
<?php $__env->stopPush(); ?>

<?php $__env->startSection('content'); ?>
<div class="q-fade-in" style="max-width: 1100px; margin: 0 auto; padding: var(--q-space-4);" dir="rtl">

    
    <div class="q-card" style="background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%); border: none; margin-bottom: var(--q-space-6); overflow: hidden;">
        <div class="q-page-header" style="padding: var(--q-space-6) var(--q-space-8); display: flex; align-items: center; gap: var(--q-space-5); flex-wrap: wrap;">
            <div class="q-page-header-icon" style="width: 56px; height: 56px; background: rgba(255,255,255,0.15); border-radius: var(--q-radius-xl, 16px); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                <svg style="width: 28px; height: 28px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
            </div>
            <div style="flex: 1;">
                <h2 style="font-size: 1.5rem; font-weight: 800; color: white; margin: 0 0 0.25rem 0;">QU Agent</h2>
                <p style="font-size: 0.875rem; color: rgba(255,255,255,0.85); margin: 0;">أنشئ وكلاء ذكاء اصطناعي مخصصين بملفات معرفة خاصة وشارك رابطهم مع الآخرين</p>
            </div>
            <div style="font-size: 0.75rem; color: rgba(255,255,255,0.75); background: rgba(255,255,255,0.12); padding: 0.4rem 0.75rem; border-radius: 9999px; border: 1px solid rgba(255,255,255,0.18);">
                المزود: <?php echo e($providerName); ?>

            </div>
        </div>
    </div>

    <div class="agent-form">
        <div class="form-body">
            <div id="agentSuccessMessage" class="success-message">
                تم إنشاء الوكيل بنجاح! يمكنك مشاركة الرابط أدناه.
            </div>

            <form id="agentForm">
                <div class="form-group">
                    <label class="form-label">اسم الوكيل</label>
                    <input type="text" id="agentName" class="form-input" placeholder="مثال: مساعد عضو هيئة التدريس" required>
                    <p class="form-hint">اختر اسماً واضحاً يصف وظيفة الوكيل</p>
                </div>

                <div class="form-group">
                    <label class="form-label">دور الوكيل</label>
                    <input type="text" id="agentRole" class="form-input" placeholder="مثال: مساعد لوائح، مستشار سياسات، مساعد قبول وتسجيل" required>
                    <p class="form-hint">يتحكم الدور في أسلوب الاستجابة والأولويات وعمق التحليل</p>
                </div>

                <div class="form-group">
                    <label class="form-label">استراتيجية المعرفة</label>
                    <div class="strategy-toggle">
                        <label class="toggle-option selected" data-value="rag">
                            <input type="radio" name="strategy" value="rag" checked>
                            <div class="toggle-option-title">RAG</div>
                            <div class="toggle-option-desc">استرجاع معزز بالتوليد — مثالي للمعرفة الديناميكية والقابلة للتحقق</div>
                            <span class="toggle-option-badge badge-green">موصى به</span>
                        </label>
                        <label class="toggle-option" data-value="fine_tuning">
                            <input type="radio" name="strategy" value="fine_tuning">
                            <div class="toggle-option-title">Fine-tuning</div>
                            <div class="toggle-option-desc">ضبط دقيق — مثالي للسلوك المستقر والأنماط الخاصة بالمجال</div>
                            <span class="toggle-option-badge badge-blue">متقدم</span>
                        </label>
                    </div>
                </div>

                <div class="form-group" id="ragFilesGroup">
                    <label class="form-label">
                        ملفات المعرفة
                        <span class="form-label-optional">(مصادر بيانات الوكيل)</span>
                    </label>
                    <div class="rag-files-section" id="ragFilesSection">
                        <div class="file-upload-area" id="agentFileUploadArea">
                            <input type="file" id="agentFileInput" multiple accept=".txt,.pdf,.doc,.docx,.csv,.json,.md" style="display: none;">
                            <svg class="file-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                            </svg>
                            <p class="file-upload-text"><strong>اضغط لرفع الملفات</strong> أو اسحب وأفلت هنا</p>
                            <p class="file-upload-hint">TXT, PDF, Word, CSV, JSON, Markdown — بحد أقصى 10MB لكل ملف</p>
                        </div>
                        <div id="agentUploadedFiles" class="uploaded-files"></div>
                        <p class="form-hint">ارفع الملفات التي سيعتمد عليها الوكيل كمصدر معرفة للإجابة على الأسئلة</p>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">اللغة والنموذج</label>
                    <div class="language-toggle">
                        <label class="toggle-option selected" data-value="ar">
                            <input type="radio" name="language" value="ar" checked>
                            <div class="toggle-option-title">العربية</div>
                            <div class="toggle-option-desc">مساعد ذكي باللغة العربية لجامعة القصيم (QU LLM Assistant)، مدرَّب على البيانات العامة للجامعة — السياسات والأخبار والبرامج الأكاديمية واللوائح والخدمات الإدارية.</div>
                            <span class="toggle-option-badge badge-green">علام</span>
                        </label>
                        <label class="toggle-option" data-value="en">
                            <input type="radio" name="language" value="en">
                            <div class="toggle-option-title">English</div>
                            <div class="toggle-option-desc">Arabic-language AI assistant for Qassim University (QU LLM Assistant), trained on the university's own public data — policies, news, academic programs, regulations, and administrative services.</div>
                            <span class="toggle-option-badge badge-green">علام</span>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">أفضل الممارسات</label>
                    <p class="form-hint" style="margin-bottom: 0.75rem;">تأكد من تفعيل الممارسات التي تناسب حالة الاستخدام</p>
                    <div class="bp-checkboxes">
                        <label class="bp-checkbox">
                            <input type="checkbox" id="bpDataIsolation" checked>
                            <div>
                                <div class="bp-checkbox-label">عزل البيانات</div>
                                <div class="bp-checkbox-desc">الوكيل يجيب فقط من مصادر البيانات المحددة</div>
                            </div>
                        </label>
                        <label class="bp-checkbox">
                            <input type="checkbox" id="bpNoHallucination" checked>
                            <div>
                                <div class="bp-checkbox-label">منع الهلوسة</div>
                                <div class="bp-checkbox-desc">إذا لم تتوفر المعلومة، يوضح الوكيل ذلك صراحة</div>
                            </div>
                        </label>
                        <label class="bp-checkbox">
                            <input type="checkbox" id="bpPromptGovernance" checked>
                            <div>
                                <div class="bp-checkbox-label">حوكمة التعليمات</div>
                                <div class="bp-checkbox-desc">التعليمات والأدوار محمية وغير قابلة للكشف</div>
                            </div>
                        </label>
                        <label class="bp-checkbox">
                            <input type="checkbox" id="bpSecurity" checked>
                            <div>
                                <div class="bp-checkbox-label">الأمان</div>
                                <div class="bp-checkbox-desc">لا وصول لمعرفة خارجية إلا بتمكين صريح</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">البحث في الويب</label>
                    <div class="web-search-toggle" id="webSearchToggle">
                        <div class="web-search-toggle-info">
                            <div class="web-search-toggle-icon">
                                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </div>
                            <div class="web-search-toggle-text">
                                <div class="web-search-toggle-title">تمكين البحث في الويب</div>
                                <div class="web-search-toggle-desc">الوكيل سيبحث في الإنترنت (Google, Bing, ...) للإجابة على الأسئلة مع ذكر المصادر والروابط</div>
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
                    إنشاء الوكيل
                </button>
            </form>
        </div>
    </div>

    <div class="agents-list" id="agentsListSection">
        <div class="agents-list-header">
            <div class="agents-list-title">الوكلاء المُنشأون</div>
            <div class="agents-list-count" id="agentsCount"></div>
        </div>
        <div id="agentsList">
            <div class="agents-empty" id="agentsEmpty">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <p>لا يوجد وكلاء بعد. قم بإنشاء وكيلك الأول!</p>
            </div>
        </div>
    </div>

    <div class="loading-overlay" id="agentLoading">
        <div class="loading-card">
            <div class="loading-spinner"></div>
            <p style="color: var(--q-text-primary, #0f172a); font-weight: 600;">جاري إنشاء الوكيل...</p>
            <p style="color: var(--q-text-secondary, #64748b); font-size: 0.875rem; margin-top: 0.5rem;">يرجى الانتظار</p>
        </div>
    </div>
</div>

<script>
(function() {
    // Demo-only: in-memory agent list seeded from the controller. No API calls.
    const seed = <?php echo json_encode($demoAgents, 15, 512) ?>;
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
                alert(`نوع الملف غير مدعوم: .${ext}\nالأنواع المدعومة: ${allowedExtensions.join(', ')}`);
                return;
            }
            if (file.size > maxFileSize) { alert(`الملف "${file.name}" أكبر من 10MB`); return; }
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
                    <button type="button" class="uploaded-file-remove" onclick="removeAgentFile(${index})" title="إزالة">
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
        countEl.textContent = agents.length + ' وكيل';
        listEl.innerHTML = agents.map(agent => {
            const langBadgeClass = agent.language === 'ar' ? 'badge-green' : 'badge-blue';
            const langLabel      = agent.language === 'ar' ? 'عربي' : 'English';
            const strategyLabel  = agent.knowledge_strategy === 'rag' ? 'RAG' : 'Fine-tuning';
            const filesBadge     = agent.files_count > 0
                ? `<span class="agent-badge badge-blue">${agent.files_count} ملف</span>` : '';
            const webSearchBadge = agent.web_search_enabled
                ? '<span class="agent-badge" style="background:rgba(59,130,246,0.1);color:#3B82F6;">بحث ويب</span>' : '';
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
                            نسخ الرابط
                        </button>
                    </div>
                    <div class="agent-card-actions">
                        <button type="button" class="btn-agent-action" onclick="alert('وضع العرض التجريبي — المحادثة معطّلة في هذا الإصدار.')">
                            فتح المحادثة
                        </button>
                        <button type="button" class="btn-agent-action danger" onclick="archiveAgent('${agent.id}')">أرشفة</button>
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
            btn.innerHTML = `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg> تم النسخ`;
            setTimeout(() => { btn.innerHTML = originalText; btn.classList.remove('copied'); }, 2000);
        });
    };

    window.archiveAgent = function(agentId) {
        if (!confirm('هل أنت متأكد من أرشفة هذا الوكيل؟')) return;
        agents = agents.filter(a => a.id !== agentId);
        renderAgentsList();
    };

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = String(str ?? '');
        return div.innerHTML;
    }

    renderAgentsList();
})();
</script>
<?php $__env->stopSection(); ?>
<?php echo $__env->make('layouts.dashboard', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH /Users/wesam../Downloads/QU_Projects/QUAI-demo2/resources/views/q-decision/digital-advisor.blade.php ENDPATH**/ ?>