// Smoke test: logs in as each demo user, walks every page, captures
// HTTP status, JS console errors, and uncaught page errors.
import puppeteer from 'puppeteer';

// Defaults to the local dev server; in production it targets https://quailab.dev.
// Override explicitly with SMOKE_BASE_URL if needed.
const BASE = process.env.SMOKE_BASE_URL
    || (process.env.APP_ENV === 'production' ? 'https://quailab.dev' : 'http://localhost:8077');

// Each page entry is either a string (expect 2xx) or {url, expectStatus} for negative checks.
const USERS = [
    { role: 'admin',   username: 'admin',         pages: ['/', '/qmentor', '/qspark', '/qspark-plus', '/digital-record', '/faculty/students', '/faculty/students/443211517', '/q-decision/self-report', '/q-decision/digital-advisor', '/admin'] },
    { role: 'faculty', username: 'faculty',       pages: ['/', '/qmentor', '/qspark', '/qspark-plus', '/digital-record', '/faculty/students', '/faculty/students/443211517', { url: '/q-decision/self-report', expectStatus: 403 }, { url: '/q-decision/digital-advisor', expectStatus: 403 }] },
    { role: 'student', username: 'student.1517',  pages: ['/', '/qmentor', '/qspark', '/qspark-plus', '/digital-record', { url: '/q-decision/self-report', expectStatus: 403 }, { url: '/q-decision/digital-advisor', expectStatus: 403 }] },
];

async function quickLogin(page, username) {
    await page.goto(`${BASE}/login`, { waitUntil: 'domcontentloaded' });
    const token = await page.$eval('input[name="_token"]', el => el.value);
    await page.evaluate(({ username, token, base }) => {
        const f = document.createElement('form');
        f.method = 'POST';
        f.action = `${base}/demo-login/${username}`;
        f.innerHTML = `<input name="_token" value="${token}">`;
        document.body.appendChild(f);
        f.submit();
    }, { username, token, base: BASE });
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
}

async function probe(browser, role, username, urls) {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    const results = [];
    await quickLogin(page, username);

    for (const entry of urls) {
        const url = typeof entry === 'string' ? entry : entry.url;
        const expectStatus = typeof entry === 'string' ? null : entry.expectStatus;
        const errs = [];
        const onConsole = (msg) => { if (msg.type() === 'error') errs.push(`console: ${msg.text().slice(0, 200)}`); };
        const onPageErr = (err) => errs.push(`pageerror: ${String(err).slice(0, 200)}`);
        const onFailed = (req) => { const t = req.resourceType(); if (t === 'document' || t === 'script' || t === 'xhr' || t === 'fetch') errs.push(`netfail: [${t}] ${req.url().slice(0, 120)}`); };
        page.on('console', onConsole);
        page.on('pageerror', onPageErr);
        page.on('requestfailed', onFailed);

        let status = 0, finalUrl = '', bodyEmpty = false;
        try {
            const resp = await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle2', timeout: 15000 });
            status = resp ? resp.status() : 0;
            finalUrl = page.url();
            // Heuristic: blank page → #qmentor-app empty for SPA routes, or body text very short.
            await new Promise(r => setTimeout(r, 800));
            bodyEmpty = await page.evaluate(() => {
                const root = document.getElementById('qmentor-app');
                if (root) return root.innerHTML.trim().length < 50;
                return (document.body?.innerText || '').trim().length < 30;
            });
        } catch (e) {
            errs.push(`nav: ${String(e).slice(0, 200)}`);
        }

        page.off('console', onConsole);
        page.off('pageerror', onPageErr);
        page.off('requestfailed', onFailed);

        results.push({ role, url, status, finalUrl, bodyEmpty, errs, expectStatus });
    }
    await ctx.close();
    return results;
}

(async () => {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const all = [];
    for (const u of USERS) {
        try {
            const r = await probe(browser, u.role, u.username, u.pages);
            all.push(...r);
        } catch (e) {
            all.push({ role: u.role, url: '(login)', status: 0, errs: [String(e).slice(0, 200)] });
        }
    }
    await browser.close();

    let bad = 0;
    for (const r of all) {
        const empty = r.bodyEmpty ? ' EMPTY' : '';
        let ok;
        if (r.expectStatus) {
            // Negative check: status matches and no JS-level crashes. Ignore the browser's
            // own "Failed to load resource: … 4xx" console line that mirrors the HTTP status.
            const realErrs = r.errs.filter(e => !(e.startsWith('console:') && e.includes('Failed to load resource')));
            ok = r.status === r.expectStatus && !realErrs.some(e => e.startsWith('pageerror'));
        } else {
            ok = r.status >= 200 && r.status < 400 && !r.bodyEmpty && r.errs.length === 0;
        }
        const tag = ok ? 'OK' : 'BAD';
        if (!ok) bad++;
        const expect = r.expectStatus ? ` (expect ${r.expectStatus})` : '';
        console.log(`[${tag}] ${r.role.padEnd(7)} ${String(r.status).padEnd(3)} ${r.url.padEnd(40)}${empty}${expect}`);
        for (const e of r.errs) console.log(`        └─ ${e}`);
    }
    console.log(`\n${bad === 0 ? 'ALL GOOD' : bad + ' failures'}`);
    process.exit(bad === 0 ? 0 : 1);
})();
