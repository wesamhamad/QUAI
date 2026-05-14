<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Q SPARK - Demo Login</title>
  <link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
  <link href="https://fonts.bunny.net/css?family=tajawal:400,500,600,700" rel="stylesheet">
  <style>
    *{box-sizing:border-box}
    html,body{height:100%;margin:0;font-family:'Tajawal',sans-serif;background:linear-gradient(135deg,#eef4ff 0%,#ffffff 100%);color:#1f2937;display:flex;align-items:center;justify-content:center}
    .page{width:100%;max-width:520px;padding:24px}
    .hero{text-align:center;margin-bottom:22px}
    .logo{width:90px;height:90px;border-radius:22px;display:block;margin:0 auto 12px;box-shadow:0 6px 18px rgba(2,6,23,.08)}
    h1{margin:0 0 6px;font-size:32px;font-weight:800}
    .subtitle{margin:0;color:#64748b;font-size:14px}
    .card{background:#fff;border-radius:20px;padding:26px;box-shadow:0 12px 30px rgba(0,0,0,.08)}
    .info{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:12px;padding:10px 14px;font-size:13px;text-align:center;margin-bottom:18px}
    .role-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px}
    .role{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border:1px solid #e5e7eb;border-radius:14px;text-decoration:none;color:#0f172a;background:#f8fafc;font-weight:700;font-size:13px;transition:transform .12s ease,box-shadow .2s ease,border-color .2s ease}
    .role:hover{transform:translateY(-2px);border-color:#14b8a6;box-shadow:0 8px 20px rgba(20,184,166,.18)}
    .role .emoji{font-size:24px}
    .divider{display:flex;align-items:center;gap:10px;color:#94a3b8;font-size:12px;margin:14px 0}
    .divider::before,.divider::after{content:"";flex:1;height:1px;background:#e5e7eb}
    label{display:block;font-size:13px;font-weight:600;color:#334155;margin-bottom:6px}
    input{width:100%;padding:11px 13px;border:1px solid #e5e7eb;border-radius:12px;font-size:14px;font-family:inherit;outline:none;transition:border-color .15s ease,box-shadow .15s ease}
    input:focus{border-color:#14b8a6;box-shadow:0 0 0 4px rgba(20,184,166,.15)}
    .field{margin-bottom:12px}
    .cta{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:13px 18px;border-radius:14px;border:none;cursor:pointer;font-weight:800;font-size:15px;color:white;background:linear-gradient(90deg,#14b8a6,#0d9488);box-shadow:0 10px 25px rgba(20,184,166,.25);transition:transform .12s ease,box-shadow .2s ease;font-family:inherit}
    .cta:hover{transform:translateY(-1px);box-shadow:0 14px 30px rgba(20,184,166,.35)}
    .error{background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:10px;padding:8px 12px;font-size:13px;margin-bottom:12px}
    .hint{margin-top:14px;color:#64748b;font-size:12px;text-align:center;line-height:1.6}
    .hint code{background:#f1f5f9;padding:1px 6px;border-radius:6px;font-size:12px;color:#0f172a}
    .footer{margin-top:18px;text-align:center;color:#94a3b8;font-size:12px}
  </style>
</head>
<body>
  <main class="page">
    <header class="hero">
      <img class="logo" src="https://www.qu.edu.sa/wp-content/uploads/2025/02/qu_icon.webp" alt="Q SPARK">
      <h1>Q SPARK</h1>
      <p class="subtitle">Demo Sandbox — dummy data, no real authentication</p>
    </header>

    <section class="card">
      <div class="info">🧪 Demo Mode — all data is fictional</div>

      <p style="font-size:13px;font-weight:600;color:#334155;margin:0 0 10px">Sign in with one click</p>
      <div class="role-grid">
        <a class="role" href="{{ route('qspark.dev.login', ['role' => 'student']) }}">
          <span class="emoji">🎓</span><span>Student</span>
        </a>
        <a class="role" href="{{ route('qspark.dev.login', ['role' => 'faculty']) }}">
          <span class="emoji">👩‍🏫</span><span>Faculty</span>
        </a>
        <a class="role" href="{{ route('qspark.dev.login', ['role' => 'admin']) }}">
          <span class="emoji">🛠️</span><span>Admin</span>
        </a>
      </div>

      <div class="divider">or sign in with username / password</div>

      @if ($errors->any())
        <div class="error">{{ $errors->first() }}</div>
      @endif

      <form method="POST" action="{{ route('qspark.login.attempt') }}" autocomplete="off">
        @csrf
        <div class="field">
          <label for="username">Username or email</label>
          <input id="username" name="username" type="text" required value="{{ old('username') }}" placeholder="demo_student">
        </div>
        <div class="field">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" required placeholder="demo1234">
        </div>
        <button class="cta" type="submit">Sign in</button>
      </form>

      <p class="hint">
        All demo users share the password <code>{{ config('app.demo_password', 'demo1234') }}</code>.<br>
        Try <code>demo_student</code>, <code>demo_faculty</code>, or <code>demo_admin</code>.
      </p>
    </section>

    <footer class="footer">
      &copy; {{ date('Y') }} Q SPARK — Demo build
    </footer>
  </main>
</body>
</html>
