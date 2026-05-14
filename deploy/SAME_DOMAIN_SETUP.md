# Serving QSPARK on the same domain as QUAI

## What this is

QUAI's `/qspark-demo` page embeds the **QSPARK** app in an `<iframe>`. QSPARK is
a **separate Laravel application** that lives in `./QSPARK/` — its own
`composer.json`, `vendor/`, database, routes, and `public/`.

We did **not** merge the two codebases. A real code merge would mean reconciling
two `users` tables, two RBAC systems (QUAI uses Spatie + filament-shield, QSPARK
has its own `roles`/`permissions` tables), and two auth stacks (QUAI SSO vs
`aacotroneo/laravel-saml2`) — a multi-day, high-risk re-architecture.

Instead the two apps stay independent and are joined **only at the web-server
layer**: nginx serves them under one domain.

```
https://quailab.dev/            -> QUAI    (this repo's public/)
https://quailab.dev/qspark/...  -> QSPARK  (QSPARK/public/)
```

Because QSPARK is now under the **same origin** as the page that frames it, the
browser no longer shows "refused to connect", and there is no second
domain / TLS cert / app server to operate.

## Why it was broken before

| Symptom (from the prod screenshots) | Cause |
|---|---|
| `admin` request → **404** | `QSPARK_DEMO_URL` pointed at `https://quailab.dev`, which **is** QUAI — QUAI has no `/dev/{role}` route, so the iframe fell through to a 404. |
| iframe → **"quailab.dev refused to connect"** | The framed response carried `X-Frame-Options: DENY` (no allow-list for the parent origin). |

## The moving parts

### 1. nginx — [`deploy/nginx/quailab.dev.conf`](nginx/quailab.dev.conf)

One server block. QUAI is the default app at `/`. QSPARK is mounted at `/qspark`
via an `alias` to `QSPARK/public`, with a nested PHP location that sets:

```nginx
fastcgi_param SCRIPT_NAME /qspark/index.php;
```

That single line is what makes Laravel-in-a-subdirectory work: the router
**strips** `/qspark` when matching routes, and `url()` / `route()` / `asset()`
**re-add** it.

> **Contract for any other web server / host:** requests to `/qspark/*` must be
> served by `QSPARK/public/index.php` with `SCRIPT_NAME = /qspark/index.php`, and
> static files under `/qspark/*` served from `QSPARK/public/`. On Laravel Cloud
> (one app per deployment) this path-mounting isn't possible without a proxy in
> front — there you'd fall back to a dedicated subdomain instead.

Deploy it:

```bash
sudo cp deploy/nginx/quailab.dev.conf /etc/nginx/sites-available/quailab.dev
sudo ln -sf /etc/nginx/sites-available/quailab.dev /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Adjust `set $app_root`, the TLS cert paths, and the `php-fpm.sock` path to your
server.

### 2. QSPARK — sub-path awareness

- **`QSPARK/app/Providers/AppServiceProvider.php`** — when `APP_URL` carries a
  path (e.g. `https://quailab.dev/qspark`), it calls `URL::forceRootUrl()` so
  every generated link — including `redirect('/')` — stays inside `/qspark`.
  When `APP_URL` has no path (local dev) it's a no-op.
- **`QSPARK/app/Http/Middleware/AllowEmbedding.php`** (registered in
  `QSPARK/bootstrap/app.php`) — emits `Content-Security-Policy: frame-ancestors
  'self' …` and removes `X-Frame-Options`, so the same-origin iframe is allowed.
  `'self'` is always included; `QSPARK_FRAME_ANCESTORS` only adds *extra*
  (cross-origin) origins.

### 3. Environment variables

**Production — QUAI `.env`:**
```env
QSPARK_DEMO_URL=https://quailab.dev/qspark
```

**Production — QSPARK `.env`:**
```env
APP_URL=https://quailab.dev/qspark
QSPARK_FRAME_ANCESTORS=          # empty — same origin, 'self' is enough
SESSION_COOKIE=qspark_session    # distinct from QUAI's cookie
SESSION_PATH=/qspark
SESSION_SAME_SITE=lax
SESSION_SECURE_COOKIE=true
```

After editing, on the server:
```bash
php artisan config:clear && php artisan config:cache   # in BOTH apps
```

## Local development

`php artisan serve` can only host one app per port, so locally the two apps stay
on **separate ports** (cross-origin) — the nginx path-mount is production-only.

```bash
# terminal 1 — QUAI
php artisan serve --port=8077

# terminal 2 — QSPARK
cd QSPARK && php artisan serve --port=8001
```

Local `.env` values (already set in the repo's working `.env` files):

| | QUAI `.env` | QSPARK `.env` |
|---|---|---|
| `APP_URL` | `http://localhost:8077` | `http://127.0.0.1:8001` |
| `QSPARK_DEMO_URL` | `http://127.0.0.1:8001` | — |
| `QSPARK_FRAME_ANCESTORS` | — | `http://127.0.0.1:8077 http://localhost:8077` |

Because local dev is cross-origin, QSPARK's session cookie still needs
`SESSION_SAME_SITE=none` + `SESSION_SECURE_COOKIE=true` (browsers treat
`localhost`/`127.0.0.1` as a secure context, so this works over plain HTTP).

## Verifying

```bash
# QSPARK reachable under the sub-path
curl -I https://quailab.dev/qspark/dev/admin        # 200 / 302, not 404

# Framing is allowed (CSP present, no X-Frame-Options: DENY)
curl -sI https://quailab.dev/qspark | grep -i -E 'content-security-policy|x-frame'

# QUAI still answers at the root
curl -I https://quailab.dev/
```

Then open `https://quailab.dev/qspark-demo` — the iframe should load the QSPARK
UI inline instead of "refused to connect".
