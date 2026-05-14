<!DOCTYPE html>
<html lang="ar" dir="rtl" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>سياسة استخدام الذكاء الاصطناعي - QUAI</title>
    <script>(function(){var t=localStorage.getItem('quai-theme');if(t)document.documentElement.setAttribute('data-theme',t);})();</script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
            --bg: #f0f4f0;
            --card-bg: #ffffff;
            --text: #1a1a1a;
            --text-sec: #555;
            --text-muted: #999;
            --border: #e5e7eb;
            --bg-sec: #f8f9fa;
            --green: #1B8354;
            --green-light: #22A068;
            --green-dark: #0F5C3A;
            --red: #DC2626;
            --red-hover: #B91C1C;
        }

        [data-theme="dark"] {
            --bg: #0f0f0f;
            --card-bg: #1e1e1e;
            --text: #e0e0e0;
            --text-sec: #aaa;
            --text-muted: #666;
            --border: #333;
            --bg-sec: #252525;
        }

        body {
            font-family: 'IBM Plex Sans Arabic', sans-serif;
            background: var(--bg);
            color: var(--text);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            line-height: 1.6;
        }

        .page-wrapper {
            width: 100%;
            max-width: 640px;
        }

        /* Logo Area */
        .logo-area {
            text-align: center;
            margin-bottom: 24px;
        }

        .logo-mark {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 56px;
            height: 56px;
            background: linear-gradient(135deg, var(--green), var(--green-dark));
            border-radius: 16px;
            color: white;
            font-size: 1.6rem;
            font-weight: 800;
            box-shadow: 0 8px 24px rgba(0, 108, 53, 0.25);
            margin-bottom: 12px;
        }

        .logo-title {
            font-size: 1rem;
            color: var(--text-muted);
            font-weight: 500;
        }

        /* Card */
        .policy-card {
            background: var(--card-bg);
            border-radius: 20px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04);
            overflow: hidden;
        }

        [data-theme="dark"] .policy-card {
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05);
        }

        /* Header */
        .policy-header {
            padding: 32px 32px 24px;
            text-align: center;
            background: linear-gradient(135deg, var(--green) 0%, var(--green-dark) 100%);
            color: white;
            position: relative;
            overflow: hidden;
        }

        .policy-header::before {
            content: '';
            position: absolute;
            top: -40px;
            left: -40px;
            width: 140px;
            height: 140px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.06);
        }

        .policy-header::after {
            content: '';
            position: absolute;
            bottom: -50px;
            right: -30px;
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.04);
        }

        .header-icon {
            position: relative;
            z-index: 1;
            margin-bottom: 12px;
        }

        .header-icon svg {
            filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
        }

        .policy-header h1 {
            font-size: 1.4rem;
            font-weight: 700;
            margin: 0;
            position: relative;
            z-index: 1;
        }

        .policy-header p {
            font-size: 0.82rem;
            opacity: 0.7;
            margin: 6px 0 0;
            position: relative;
            z-index: 1;
            letter-spacing: 0.3px;
        }

        /* Content */
        .policy-body {
            padding: 24px 28px;
            max-height: 50vh;
            overflow-y: auto;
        }

        .policy-body::-webkit-scrollbar { width: 5px; }
        .policy-body::-webkit-scrollbar-track { background: transparent; }
        .policy-body::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.12); border-radius: 3px; }
        [data-theme="dark"] .policy-body::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.12); }

        .policy-intro {
            font-size: 0.88rem;
            color: var(--text-sec);
            line-height: 1.8;
            margin-bottom: 20px;
            padding: 14px 18px;
            background: var(--bg-sec);
            border-radius: 12px;
            border-right: 3px solid var(--green);
        }

        .principle {
            margin-bottom: 18px;
        }

        .principle-head {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
        }

        .principle-num {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            min-width: 28px;
            border-radius: 50%;
            background: linear-gradient(135deg, var(--green), var(--green-light));
            color: white;
            font-size: 0.78rem;
            font-weight: 700;
            box-shadow: 0 2px 8px rgba(0, 108, 53, 0.2);
        }

        .principle-head h3 {
            font-size: 0.98rem;
            font-weight: 700;
            color: var(--text);
            margin: 0;
        }

        .principle ul {
            margin: 0;
            padding-right: 38px;
            padding-left: 0;
            list-style: none;
        }

        .principle ul li {
            position: relative;
            font-size: 0.84rem;
            color: var(--text-sec);
            line-height: 1.8;
            padding-right: 16px;
            margin-bottom: 3px;
        }

        .principle ul li::before {
            content: '';
            position: absolute;
            right: 0;
            top: 0.7em;
            width: 5px;
            height: 5px;
            border-radius: 50%;
            background: var(--green-light);
        }

        /* English summary */
        .en-summary {
            border-top: 1px solid var(--border);
            padding-top: 16px;
            margin-top: 16px;
        }

        .en-summary h4 {
            font-size: 0.82rem;
            font-weight: 600;
            color: var(--text-muted);
            margin: 0 0 6px;
            text-align: left;
            direction: ltr;
        }

        .en-summary p {
            font-size: 0.8rem;
            color: var(--text-muted);
            line-height: 1.8;
            text-align: left;
            direction: ltr;
            margin: 0;
        }

        /* Footer */
        .policy-footer {
            padding: 20px 28px 24px;
            border-top: 1px solid var(--border);
            background: var(--bg-sec);
        }

        .checkbox-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            cursor: pointer;
            font-size: 0.88rem;
            color: var(--text);
            line-height: 1.5;
            user-select: none;
            margin-bottom: 16px;
        }

        .checkbox-row input { display: none; }

        .custom-check {
            width: 22px;
            height: 22px;
            min-width: 22px;
            border: 2px solid var(--border);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 2px;
            transition: all 0.2s ease;
            background: var(--card-bg);
        }

        .checkbox-row:hover .custom-check { border-color: var(--green); }

        .checkbox-row input:checked + .custom-check {
            background: var(--green);
            border-color: var(--green);
            box-shadow: 0 2px 8px rgba(0, 108, 53, 0.3);
        }

        .checkbox-row input:checked + .custom-check::after {
            content: '';
            width: 6px;
            height: 11px;
            border: solid white;
            border-width: 0 2.5px 2.5px 0;
            transform: rotate(45deg);
            margin-top: -2px;
        }

        .checkbox-en {
            display: block;
            font-size: 0.72rem;
            color: var(--text-muted);
            margin-top: 2px;
        }

        .btn-row {
            display: flex;
            gap: 12px;
        }

        .btn-accept {
            flex: 1;
            padding: 13px 24px;
            font-size: 1rem;
            font-weight: 700;
            font-family: 'IBM Plex Sans Arabic', sans-serif;
            background: linear-gradient(135deg, var(--green), var(--green-light));
            color: white;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 4px 14px rgba(0, 108, 53, 0.25);
        }

        .btn-accept:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(0, 108, 53, 0.35);
        }

        .btn-accept:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .btn-reject {
            padding: 13px 20px;
            font-size: 0.9rem;
            font-weight: 600;
            font-family: 'IBM Plex Sans Arabic', sans-serif;
            background: transparent;
            color: var(--red);
            border: 2px solid var(--red);
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .btn-reject:hover {
            background: var(--red);
            color: white;
        }

        .btn-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2.5px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Reject confirmation */
        .reject-warning {
            display: none;
            margin-top: 16px;
            padding: 14px 18px;
            background: #FEF2F2;
            border: 1px solid #FECACA;
            border-radius: 12px;
            color: #991B1B;
            font-size: 0.85rem;
            line-height: 1.7;
            animation: fadeIn 0.2s ease;
        }

        [data-theme="dark"] .reject-warning {
            background: rgba(220, 38, 38, 0.1);
            border-color: rgba(220, 38, 38, 0.25);
            color: #FCA5A5;
        }

        .reject-warning.visible { display: block; }

        .reject-warning strong { display: block; margin-bottom: 4px; }

        .reject-btns {
            display: flex;
            gap: 10px;
            margin-top: 12px;
        }

        .reject-confirm-btn {
            padding: 8px 18px;
            font-size: 0.85rem;
            font-weight: 600;
            font-family: 'IBM Plex Sans Arabic', sans-serif;
            background: var(--red);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: background 0.2s;
        }

        .reject-confirm-btn:hover { background: var(--red-hover); }

        .reject-cancel-btn {
            padding: 8px 18px;
            font-size: 0.85rem;
            font-weight: 600;
            font-family: 'IBM Plex Sans Arabic', sans-serif;
            background: transparent;
            color: var(--text-sec);
            border: 1px solid var(--border);
            border-radius: 8px;
            cursor: pointer;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Page animation */
        .page-wrapper {
            animation: pageIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes pageIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
            body { padding: 12px; }
            .policy-header { padding: 24px 20px 18px; }
            .policy-header h1 { font-size: 1.2rem; }
            .policy-body { padding: 18px 20px; max-height: 45vh; }
            .policy-footer { padding: 16px 20px 20px; }
            .btn-row { flex-direction: column; }
            .principle ul { padding-right: 32px; }
        }
    </style>
</head>
<body>
    <div class="page-wrapper">
        {{-- Logo --}}
        <div class="logo-area">
            <div class="logo-mark">Q</div>
            <div class="logo-title">QUAI - جامعة القصيم</div>
        </div>

        {{-- Card --}}
        <div class="policy-card">
            {{-- Header --}}
            <div class="policy-header">
                <div class="header-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path d="M9 12l2 2 4-4"/>
                    </svg>
                </div>
                <h1>سياسة استخدام الذكاء الاصطناعي</h1>
                <p>AI Usage Policy - SDAIA Ethics Framework</p>
            </div>

            {{-- Body --}}
            <div class="policy-body">
                <p class="policy-intro">
                    وفقاً لإطار أخلاقيات الذكاء الاصطناعي الصادر عن الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)، يجب قراءة والموافقة على المبادئ التالية قبل استخدام المنصة:
                </p>

                <div class="principle">
                    <div class="principle-head">
                        <span class="principle-num">1</span>
                        <h3>الشفافية والإفصاح</h3>
                    </div>
                    <ul>
                        <li>المحتوى المُنشأ بواسطة الذكاء الاصطناعي قد لا يكون دقيقاً بالكامل</li>
                        <li>يجب التحقق من المعلومات المهمة من مصادر موثوقة</li>
                        <li>عدم تقديم مخرجات الذكاء الاصطناعي على أنها عمل بشري أصلي</li>
                    </ul>
                </div>

                <div class="principle">
                    <div class="principle-head">
                        <span class="principle-num">2</span>
                        <h3>الخصوصية وحماية البيانات</h3>
                    </div>
                    <ul>
                        <li>عدم إدخال بيانات شخصية حساسة (أرقام هوية، سجلات طبية، بيانات مالية)</li>
                        <li>عدم مشاركة معلومات سرية للجامعة أو الطلاب</li>
                        <li>الالتزام بنظام حماية البيانات الشخصية السعودي</li>
                    </ul>
                </div>

                <div class="principle">
                    <div class="principle-head">
                        <span class="principle-num">3</span>
                        <h3>العدالة وعدم التحيز</h3>
                    </div>
                    <ul>
                        <li>عدم استخدام المنصة لإنشاء محتوى تمييزي أو متحيز</li>
                        <li>الإبلاغ عن أي مخرجات متحيزة تُلاحظ</li>
                    </ul>
                </div>

                <div class="principle">
                    <div class="principle-head">
                        <span class="principle-num">4</span>
                        <h3>المسؤولية والمساءلة</h3>
                    </div>
                    <ul>
                        <li>المستخدم مسؤول عن كيفية استخدام المخرجات</li>
                        <li>عدم استخدام المنصة لأغراض ضارة أو غير أخلاقية أو غير قانونية</li>
                    </ul>
                </div>

                <div class="principle">
                    <div class="principle-head">
                        <span class="principle-num">5</span>
                        <h3>الأمان والسلامة</h3>
                    </div>
                    <ul>
                        <li>عدم محاولة توليد محتوى عنيف أو متطرف أو غير أخلاقي</li>
                        <li>عدم استخدام المنصة لانتهاك حقوق الملكية الفكرية</li>
                        <li>الإبلاغ عن أي ثغرات أمنية</li>
                    </ul>
                </div>

                <div class="principle">
                    <div class="principle-head">
                        <span class="principle-num">6</span>
                        <h3>الامتثال للأنظمة السعودية</h3>
                    </div>
                    <ul>
                        <li>الالتزام بالأنظمة واللوائح السعودية في استخدام المنصة</li>
                        <li>احترام القيم والثقافة والهوية الوطنية</li>
                    </ul>
                </div>

                <div class="en-summary">
                    <h4>Summary (English)</h4>
                    <p>
                        By using this platform, you agree to comply with SDAIA's AI ethics framework:
                        verify AI outputs before use, never input sensitive personal data,
                        do not generate discriminatory or harmful content, take responsibility for
                        how you use AI outputs, and comply with Saudi regulations and cultural values.
                    </p>
                </div>
            </div>

            {{-- Footer --}}
            <div class="policy-footer">
                <label class="checkbox-row" id="checkboxLabel">
                    <input type="checkbox" id="policyCheck">
                    <span class="custom-check"></span>
                    <span>
                        لقد قرأت وأوافق على سياسة استخدام الذكاء الاصطناعي
                        <small class="checkbox-en">I have read and agree to the AI usage policy</small>
                    </span>
                </label>

                <div class="btn-row">
                    <button id="acceptBtn" class="btn-accept" disabled>قبول والمتابعة</button>
                    <button id="rejectBtn" class="btn-reject">رفض</button>
                </div>

                {{-- Reject confirmation --}}
                <div class="reject-warning" id="rejectWarning">
                    <strong>تنبيه: رفض السياسة يعني عدم إمكانية استخدام المنصة</strong>
                    سيتم تسجيل خروجك من المنصة. يمكنك تسجيل الدخول مرة أخرى وقبول السياسة لاحقاً.
                    <div class="reject-btns">
                        <button id="rejectConfirmBtn" class="reject-confirm-btn">تأكيد الرفض وتسجيل الخروج</button>
                        <button id="rejectCancelBtn" class="reject-cancel-btn">إلغاء</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
    (function() {
        var checkbox = document.getElementById('policyCheck');
        var acceptBtn = document.getElementById('acceptBtn');
        var rejectBtn = document.getElementById('rejectBtn');
        var rejectWarning = document.getElementById('rejectWarning');
        var rejectConfirmBtn = document.getElementById('rejectConfirmBtn');
        var rejectCancelBtn = document.getElementById('rejectCancelBtn');

        // Toggle accept button
        checkbox.addEventListener('change', function() {
            acceptBtn.disabled = !this.checked;
            if (this.checked) rejectWarning.classList.remove('visible');
        });

        // Accept
        acceptBtn.addEventListener('click', async function() {
            if (!checkbox.checked) return;
            acceptBtn.disabled = true;
            acceptBtn.innerHTML = '<span class="btn-spinner"></span>';

            try {
                var csrf = document.querySelector('meta[name="csrf-token"]');
                var res = await fetch('/api/v1/sdaia-policy/accept', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': csrf ? csrf.content : '',
                    },
                });

                if (res.ok) {
                    window.location.href = '/';
                } else {
                    throw new Error('Failed');
                }
            } catch (e) {
                acceptBtn.disabled = false;
                acceptBtn.textContent = 'قبول والمتابعة';
                alert('حدث خطأ. يرجى المحاولة مرة أخرى.');
            }
        });

        // Reject - show warning
        rejectBtn.addEventListener('click', function() {
            rejectWarning.classList.add('visible');
        });

        // Cancel reject
        rejectCancelBtn.addEventListener('click', function() {
            rejectWarning.classList.remove('visible');
        });

        // Confirm reject - logout
        rejectConfirmBtn.addEventListener('click', function() {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '{{ route("demo.logout") }}';
            const token = document.createElement('input');
            token.type = 'hidden';
            token.name = '_token';
            token.value = '{{ csrf_token() }}';
            form.appendChild(token);
            document.body.appendChild(form);
            form.submit();
        });

        // Block back button / navigation
        history.pushState(null, '', location.href);
        window.addEventListener('popstate', function() {
            history.pushState(null, '', location.href);
        });
    })();
    </script>
</body>
</html>
