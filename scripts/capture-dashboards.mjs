#!/usr/bin/env node
/**
 * Captures screenshots of the 4 admin dashboards for report embedding.
 *
 * Usage:
 *   node scripts/capture-dashboards.mjs <token> <outputDir> [baseUrl]
 *
 * Requires: puppeteer (already in node_modules)
 */

import puppeteer from 'puppeteer';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const [,, token, outputDir, baseUrl = 'http://localhost:8007'] = process.argv;

if (!token || !outputDir) {
    console.error('Usage: node capture-dashboards.mjs <token> <outputDir> [baseUrl]');
    process.exit(1);
}

if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
}

const dashboards = [
    { slug: 'complaints-dashboard', file: 'complaints.png' },
    { slug: 'reviews-dashboard', file: 'reviews.png' },
    { slug: 'service-tasks-dashboard', file: 'service-tasks.png' },
    { slug: 'service-evaluations-dashboard', file: 'service-evaluations.png' },
];

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });

    // Step 1: Auto-login via dev route
    console.log('🔐 Logging in...');
    const loginUrl = `${baseUrl}/dev/auto-login/${token}`;
    const loginResp = await page.goto(loginUrl, { waitUntil: 'networkidle0', timeout: 15000 });
    if (!loginResp || loginResp.status() !== 200) {
        console.error(`❌ Login failed with status ${loginResp?.status()}`);
        await browser.close();
        process.exit(1);
    }
    console.log('✅ Logged in');

    // Step 2: Capture each dashboard
    for (const { slug, file } of dashboards) {
        const url = `${baseUrl}/admin/${slug}`;
        console.log(`📸 Capturing ${slug}...`);

        try {
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
            // Wait for charts/widgets to render
            await new Promise(r => setTimeout(r, 3000));

            const filePath = join(outputDir, file);
            await page.screenshot({ path: filePath, fullPage: true });
            console.log(`   ✅ Saved: ${filePath}`);
        } catch (err) {
            console.error(`   ❌ Failed to capture ${slug}: ${err.message}`);
        }
    }

    await browser.close();
    console.log('🎉 Done');
})();
