<!doctype html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>تسجيل الدخول — QUAI | جامعة القصيم</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: { extend: { colors: {
                'dga-sa': { 50:'#F3FCF6', 100:'#DFF6E7', 200:'#B8EACB', 300:'#88D8AD', 400:'#54C08A', 500:'#25935F', 600:'#1B8354', 700:'#166A45', 800:'#14573A', 900:'#104631' },
                'dga-gold': { 100:'#FCF3BD', 500:'#F5BD02', 600:'#DBA102' }
            } } }
        };
    </script>
    <style>body { font-family: 'Tajawal', system-ui, sans-serif; }</style>
</head>
<body class="min-h-screen flex bg-gray-50">

    {{-- Brand hero (right side in RTL) --}}
    <section class="hidden md:flex flex-col justify-center w-1/2 p-12 relative overflow-hidden"
             style="background: linear-gradient(135deg, #25935F 0%, #14573A 100%); color: white;">
        <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5"></div>
        <div class="absolute -bottom-32 left-20 w-96 h-96 rounded-full bg-white/5"></div>

        <div class="relative z-10 max-w-md mx-auto">
            <div class="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-8">
                <span class="text-5xl font-black tracking-tighter">Q</span>
            </div>
            <h1 class="text-5xl font-black mb-2 leading-tight">QUAI</h1>
            <p class="text-xl font-medium mb-2 opacity-95">منصة الذكاء الاصطناعي</p>
            <p class="text-base opacity-80 mb-10">جامعة القصيم · Qassim University</p>

            <p class="text-lg opacity-90 leading-relaxed mb-8">
                تسجيل دخول موحّد عبر <strong class="text-white">MyQU</strong>.
                ادخل ببياناتك الجامعية واصل لجميع التطبيقات الذكية في منظومة واحدة.
            </p>

            <div class="space-y-3">
                <div class="flex items-center gap-3 text-sm">
                    <span class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                    </span>
                    <span class="opacity-90">حماية كاملة عبر بروتوكول SAML SSO</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                    <span class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
                    </span>
                    <span class="opacity-90">QSpark · QMentor · QUBI · QU Agent · سجلك الرقمي</span>
                </div>
                <div class="flex items-center gap-3 text-sm">
                    <span class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/></svg>
                    </span>
                    <span class="opacity-90">واجهة موحدة لجميع منسوبي الجامعة</span>
                </div>
            </div>
        </div>
    </section>

    {{-- Form (left side in RTL) --}}
    <section class="flex-1 flex items-center justify-center p-6">
        <form method="POST" action="{{ route('demo.login.attempt') }}" autocomplete="off"
              class="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100">
            @csrf

            <div class="flex justify-center mb-6 md:hidden">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-3xl font-black"
                     style="background: linear-gradient(135deg, #25935F 0%, #166A45 100%);">Q</div>
            </div>

            <div class="text-center mb-6">
                <div class="inline-flex items-center gap-2 text-xs text-dga-sa-700 bg-dga-sa-50 px-3 py-1 rounded-full mb-3">
                    <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                    <span>الدخول عبر MyQU SSO</span>
                </div>
                <h2 class="text-2xl font-extrabold text-gray-900 mb-1">تسجيل الدخول</h2>
                <p class="text-sm text-gray-500">أدخل بيانات حسابك الجامعي للمتابعة</p>
            </div>

            @if ($errors->any())
                <div class="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                    ❌ {{ $errors->first() }}
                </div>
            @endif

            <div class="mb-4">
                <label class="block text-sm font-semibold text-gray-700 mb-2">اسم المستخدم</label>
                <div class="relative">
                    <input type="text" id="login" name="login" required autofocus dir="ltr"
                           value="{{ old('login') }}"
                           placeholder="student / faculty / admin"
                           class="w-full px-4 py-3 pr-11 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dga-sa-500 focus:ring-2 focus:ring-dga-sa-100 transition">
                    <svg class="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                </div>
            </div>

            <div class="mb-3">
                <label class="block text-sm font-semibold text-gray-700 mb-2">كلمة المرور</label>
                <div class="relative">
                    <input type="password" id="password" name="password" required dir="ltr" placeholder="••••••••"
                           class="w-full px-4 py-3 pr-11 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-dga-sa-500 focus:ring-2 focus:ring-dga-sa-100 transition">
                    <svg class="w-5 h-5 text-gray-400 absolute top-1/2 right-3 -translate-y-1/2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                    </svg>
                </div>
            </div>

            <div class="flex justify-between items-center text-sm mb-5">
                <label class="flex items-center gap-2 text-gray-600 cursor-pointer">
                    <input type="checkbox" name="remember" class="w-4 h-4 rounded text-dga-sa-500 focus:ring-dga-sa-500"> تذكرني
                </label>
                <a href="#" class="text-dga-sa-600 hover:text-dga-sa-700 font-medium"
                   onclick="event.preventDefault();alert('عرض تجريبي');">نسيت كلمة المرور؟</a>
            </div>

            <button type="submit"
                    class="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2"
                    style="background: linear-gradient(135deg, #25935F 0%, #166A45 100%);">
                تسجيل الدخول
                <svg class="w-4 h-4 -mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
            </button>

            <div class="mt-6 p-4 bg-dga-sa-50 border border-dga-sa-200 border-dashed rounded-xl">
                <div class="flex justify-between items-center mb-2">
                    <strong class="text-xs font-bold text-dga-sa-700">🧪 حسابات تجريبية</strong>
                    <span class="text-[10px] text-gray-500">انقر لتسجيل دخول مباشر</span>
                </div>
                <div class="space-y-1.5">
                    @foreach ($accounts as $acc)
                        <button type="button"
                                onclick="document.getElementById('quick-{{ $loop->index }}').submit();"
                                class="w-full flex items-center justify-between bg-white hover:bg-dga-sa-100 px-3 py-2 rounded-lg text-xs transition cursor-pointer text-right border border-transparent hover:border-dga-sa-300">
                            <span class="text-gray-500 font-mono" dir="ltr">{{ $acc['username'] }}</span>
                            <span class="text-gray-700">{{ $acc['label'] }} · {{ $acc['role'] }}</span>
                        </button>
                    @endforeach
                </div>
                <p class="text-[10px] text-gray-500 mt-3 text-center leading-relaxed">
                    كلمة المرور الافتراضية للحسابات اليدوية: <span class="font-mono">password</span>
                </p>
            </div>

            <p class="text-[11px] text-gray-400 mt-5 text-center leading-relaxed">
                هذه نسخة عرض ببيانات وهمية بالكامل. لا تمثل أشخاصًا أو حالات حقيقية.
            </p>
        </form>

        {{-- Hidden POST forms for quick-login (so CSRF + POST are preserved) --}}
        @foreach ($accounts as $acc)
            <form id="quick-{{ $loop->index }}" method="POST" action="{{ route('demo.login.quick', $acc['username']) }}" class="hidden">
                @csrf
            </form>
        @endforeach
    </section>
</body>
</html>
