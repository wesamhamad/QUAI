<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Q SPARK - Welcome</title>
  <meta name="color-scheme" content="light dark">

  <!-- Font: Tajawal -->
  <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
  <link href="https://fonts.bunny.net/css?family=tajawal:400,500,600,700" rel="stylesheet">

  <style>
    /* ---------- Design Tokens ---------- */
    :root{
      --bg:          246 248 255;         /* light */
      --fg:          23  27  36;
      --muted:       100 116 139;
      --brand:       13  148 136;         /* teal-600 */
      --brand-2:     20  184 166;         /* teal-500 */
      --accent:      59  130 246;         /* blue-500 */
      --surface:     255 255 255 / .6;
      --border:      15  23  42 / .06;    /* slate-900/6% */
      --ring:        59  130 246 / .35;

      --radius-xl:   20px;
      --radius-2xl:  24px;
      --shadow-lg:   0 20px 50px rgba(2,6,23,.10);
      --shadow-sm:   0 6px 18px rgba(2,6,23,.08);
      --blur:        16px;
      --trans:       200ms cubic-bezier(.2,.8,.2,1);
    }

    @media (prefers-color-scheme: dark){
      :root{
        --bg:      10 12 17;       /* dark */
        --fg:      226 232 240;
        --muted:   148 163 184;
        --surface: 8  12 20 / .35;
        --border:  203 213 225 / .08;
        --ring:    94 234 212 / .28;
        --shadow-lg: 0 20px 50px rgba(0,0,0,.35);
        --shadow-sm: 0 8px 20px rgba(0,0,0,.28);
      }
    }

    *{box-sizing:border-box}
    html,body{height:100%}
    body {
    margin: 0;
    font-family: 'Tajawal', sans-serif;
    background: linear-gradient(135deg, #eef4ff 0%, #ffffff 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1f2937;
  }

    /* Animated background blobs */
    .blob{
      position:fixed; inset:auto auto -120px -120px;
      width:360px; height:360px;
      background:radial-gradient(circle at 30% 30%, rgba(20,184,166,.70), transparent 60%);
      filter:blur(45px);
      opacity:.6;
      border-radius:50%;
      animation: float1 16s ease-in-out infinite;
      pointer-events:none;
      transform:translateZ(0);
    }
    .blob.b2{
      inset:-120px -120px auto auto;
      background:radial-gradient(circle at 70% 70%, rgba(59,130,246,.55), transparent 60%);
      animation: float2 18s ease-in-out infinite;
    }
    @keyframes float1{
      0%,100%{ transform:translate(-10px, 0) scale(1) }
      50%    { transform:translate( 20px,-10px) scale(1.05) }
    }
    @keyframes float2{
      0%,100%{ transform:translate( 10px, 0) scale(1) }
      50%    { transform:translate(-20px, 15px) scale(1.08) }
    }

    /* Page container */
    .page{ width:100%; max-width:520px; padding:28px; }

    /* Language + Theme controls */
    .controls{
      position:fixed; 
      top:20px; 
      inset-inline-end:20px; 
      display:flex; 
      gap:10px; 
      z-index:20;
    }
    .pill{
      display:flex; 
      align-items:center; 
      gap:6px;
      background:#ffffff;              /* White background */
      border:1px solid #e5e7eb;        /* Light gray border */
      border-radius:999px; 
      padding:6px;
      box-shadow:0 4px 12px rgba(0,0,0,.08);
    }
    .btn{
      border:0; 
      background:transparent; 
      padding:8px 14px; 
      border-radius:999px; 
      cursor:pointer;
      font-weight:700; 
      color:#000000;                   /* Black text */
      transition: transform .12s ease, background .2s ease, color .2s ease, box-shadow .2s ease;
    }

    .btn[aria-pressed="true"]{
      background:#eef4ff;              /* Soft highlight when active */
      color:#000000;                   /* Black text stays */
      box-shadow:inset 0 0 0 1px #c7d2fe;
    }
    .btn[aria-pressed="true"]{ background:rgb(239, 246, 255); color:rgb(30 41 59); box-shadow:inset 0 0 0 1px rgb(191 219 254) }
    @media (prefers-color-scheme: dark){
      .btn[aria-pressed="true"]{ background:rgb(157, 175, 204); color:rgb(226 232 240); box-shadow:inset 0 0 0 1px rgb(157, 175, 204) }
    }
    .icon-btn{ display:inline-flex; align-items:center; gap:8px }

    /* Header */
    .hero{
      text-align:center; margin-block-end:26px;
      transform:translateY(0); animation: fadeUp .6s ease .05s both;
    }
    @keyframes fadeUp{ from{ opacity:0; transform:translateY(6px)} to{ opacity:1; transform:translateY(0)} }
    .logo{
      width:90px; height:90px; border-radius:22px; display:block; margin:0 auto 14px; box-shadow:var(--shadow-sm);
    }
    h1{ margin:0 0 6px; font-size:34px; font-weight:800; letter-spacing:.2px }
    .subtitle{ margin:0; color:rgb(var(--muted)); font-size:15px }

    /* Card (glassmorphism) */
    .card{
      background:rgba(var(--surface));
      border:1px solid rgba(var(--border));
      border-radius:var(--radius-2xl);
      padding:28px;
      box-shadow:var(--shadow-lg);
      backdrop-filter:blur(var(--blur));
      transform:translateY(0); animation: fadeUp .6s ease .12s both;
    }
    .info{
      background:linear-gradient(180deg, rgb(239 246 255 / .75), rgb(239 246 255 / .55));
      border:1px solid rgb(191 219 254 / .8);
      color:rgb(29 78 216);
      border-radius:16px;
      padding:12px 14px;
      font-size:14px;
      text-align:center;
      margin-bottom:18px;
    }
    @media (prefers-color-scheme: dark){
      .info{ background:linear-gradient(180deg, rgb(15 23 42 / .45), rgb(15 23 42 / .35)); border-color: rgb(51 65 85 / .65); color:rgb(165 243 252) }
    }

    /* Button */
    .cta{
      --g1: rgb(var(--brand));
      --g2: rgb(var(--brand-2));
      position:relative;
      display:flex; align-items:center; justify-content:center; gap:10px; width:100%;
      padding:14px 18px; border-radius:16px; border:none; cursor:pointer; text-decoration:none;
      color:white; font-weight:800; letter-spacing:.2px; font-size:15px;
      background:linear-gradient(90deg, var(--g1), var(--g2));
      box-shadow:0 16px 40px rgba(13,148,136,.35);
      transition: transform 140ms ease, filter var(--trans), box-shadow var(--trans);
      overflow:hidden;
    }
    .cta:hover{ filter:saturate(1.05) brightness(1.05); box-shadow:0 20px 48px rgba(13,148,136,.45) }
    .cta:active{ transform:translateY(1px) scale(.995) }
    .cta svg{ width:20px; height:20px }

    /* Button sheen effect */
    .cta::before{
      content:""; position:absolute; inset:-120% -30% auto -30%; height:300%;
      transform:rotate(18deg);
      background:linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
      animation: sheen 3.5s ease-in-out infinite;
      pointer-events:none;
    }
    @keyframes sheen{ 0%{ transform:translateX(-60%) rotate(18deg)} 100%{ transform:translateX(60%) rotate(18deg)} }

    .note{ margin-top:14px; color:rgb(var(--muted)); font-size:14px; text-align:center }

    /* Footer */
    .footer{ margin-top:24px; text-align:center; color:rgb(var(--muted)); font-size:13px }

    /* RTL helpers */
    [dir="rtl"] .controls{ inset-inline-end:auto; inset-inline-start:20px }
    [dir="rtl"] .pill{ direction:ltr }

    /* Reduced motion */
    @media (prefers-reduced-motion: reduce){
      .blob,.cta::before{ animation:none }
    }
  </style>
  <style>
    body {
      margin: 0;
      font-family: 'Tajawal', sans-serif;
      background: linear-gradient(135deg, #eef4ff 0%, #ffffff 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1f2937;
    }
  
    .page { width: 100%; max-width: 500px; padding: 24px; }
  
    .card {
      background: #ffffff;
      border-radius: 20px;
      padding: 28px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
    }
  
    .info {
      background: #eef4ff;
      border: 1px solid #dbeafe;
      color: #1d4ed8;
      border-radius: 14px;
      padding: 12px;
      text-align: center;
      margin-bottom: 18px;
      font-size: 14px;
    }
  
    .cta {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 14px 18px;
      border-radius: 14px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      color: white;
      background: linear-gradient(90deg, #14b8a6, #0d9488);
      box-shadow: 0 10px 25px rgba(20, 184, 166, 0.25);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 35px rgba(20, 184, 166, 0.35);
    }
  </style>
</head>
<body>
  <!-- Decorative animated blobs -->
  <div class="blob" aria-hidden="true"></div>
  <div class="blob b2" aria-hidden="true"></div>

  <!-- Controls: Language + (optional) Theme toggle -->
  <div class="controls">
    <div class="pill" role="group" aria-label="Language switcher">
      <button id="btn-ar" class="btn" type="button" data-locale="ar" aria-pressed="false">العربية</button>
      <button id="btn-en" class="btn" type="button" data-locale="en" aria-pressed="true">English</button>
    </div>
  </div>

  <main class="page">
    <header class="hero">
      <img class="logo" src="https://www.qu.edu.sa/wp-content/uploads/2025/02/qu_icon.webp" alt="Qassim University logo" decoding="async" fetchpriority="high">
      <h1 id="brand">Q SPARK</h1>
      <p class="subtitle" data-translate="platform_subtitle">Smart Learning Platform</p>
    </header>

    <section class="card" aria-labelledby="card-title">
        @if (config('app.demo_mode'))
          <div class="info" data-translate="login_info" style="background:#fff7ed;border-color:#fed7aa;color:#9a3412;">
            🧪 Demo sandbox — fictional data, no real authentication
          </div>
        @else
          <div class="info" data-translate="login_info">
            Login is now available only through MyQU
          </div>
        @endif

        <a id="login-link" class="cta" href="{{ route('login') }}" rel="nofollow">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false">
            <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span data-translate="login_with_myqu">{{ config('app.demo_mode') ? 'Enter Demo' : 'Login with MyQU' }}</span>
        </a>

        <p class="note" data-translate="login_instructions">
          {{ config('app.demo_mode') ? 'Sign in as student, faculty, or admin with one click' : 'Use your MyQU credentials to access the platform' }}
        </p>
    </section>

    <footer class="footer">
      <span>&copy; <span id="year"></span> Qassim University - Q SPARK</span>
    </footer>
  </main>

  <script>
    // --- i18n dictionary ---
    const translations = {
      ar: {
        platform_subtitle: 'منصة التعلم الذكية',
        login_info: 'تسجيل الدخول الآن متاح فقط عن طريق MyQU',
        login_with_myqu: 'تسجيل الدخول عن طريق MyQU',
        login_instructions: 'استخدم بيانات اعتماد MyQU الخاصة بك للوصول إلى المنصة',
        title: 'Q SPARK - مرحبًا'
      },
      en: {
        platform_subtitle: 'Smart Learning Platform',
        login_info: 'Login is now available only through MyQU',
        login_with_myqu: 'Login with MyQU',
        login_instructions: 'Use your MyQU credentials to access the platform',
        title: 'Q SPARK - Welcome'
      }
    };

    function detectLocale(){
      const stored = localStorage.getItem('locale');
      if(stored) return stored;
      const nav = (navigator.language || 'en').toLowerCase();
      return nav.startsWith('ar') ? 'ar' : 'en';
    }

    function applyLocale(locale){
      const dict = translations[locale] || translations.en;
      document.documentElement.lang = locale;
      document.documentElement.dir  = (locale === 'ar') ? 'rtl' : 'ltr';
      document.title = dict.title;
      document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if(dict[key]) el.textContent = dict[key];
      });
      document.getElementById('btn-ar').setAttribute('aria-pressed', String(locale==='ar'));
      document.getElementById('btn-en').setAttribute('aria-pressed', String(locale==='en'));
    }

    // Build SAML login URL from host
    function getSamlBase(){
      const host = (location.host || '').toLowerCase();
      return host.includes('qspark-test') ? 'https://qspark-test.qu.edu.sa' : 'https://qspark.qu.edu.sa';
    }
    function setLoginHref(){
      // const link = document.getElementById('login-link');
      // link.setAttribute('href', getSamlBase() + '/saml/login?uuid=myqu');
    }

    // Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Init
    const initialLocale = detectLocale();
    applyLocale(initialLocale);
    setLoginHref();

    // Events
    document.getElementById('btn-ar').addEventListener('click', () => {
      localStorage.setItem('locale','ar');
      applyLocale('ar');
    });
    document.getElementById('btn-en').addEventListener('click', () => {
      localStorage.setItem('locale','en');
      applyLocale('en');
    });
  </script>
</body>
</html>
