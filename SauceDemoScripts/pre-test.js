#!/usr/bin/env node
/**
 * pre-test.js
 * Launches Chrome, navigates to the target site, auto-logs in using
 * credentials from .env if available, then saves browser state to
 * auth.json for use by Playwright tests.
 *
 * Run once before your tests: node pre-test.js
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');

// ── Config ────────────────────────────────────────────────────────────────────
const AUTH_FILE = 'auth.json';

// Read all key=value pairs from .env
function loadEnvFile() {
  const result = {};
  try {
    for (const line of fs.readFileSync('.env', 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const k = trimmed.slice(0, eq).trim();
      const v = trimmed.slice(eq + 1).trim();
      if (k && v) result[k] = v;
    }
  } catch {}
  return result;
}

// Find a credential value by checking multiple candidate key names
function findCred(env, candidates) {
  for (const key of Object.keys(env)) {
    if (candidates.some((c) => key.toUpperCase().includes(c))) return env[key];
  }
  return null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function isLoginPage(url, content) {
  return (
    /login|signin|sign-in|\/auth\b|authenticate/i.test(url) ||
    /type="password"|name="password"|forgot.?password|create.?account/i.test(content)
  );
}

// Try to fill email/username + password and submit, returns true on success
async function tryAutoLogin(page, username, password, loginUrl) {
  try {
    // Fill email / username field
    const userSelectors = [
      'input[type="email"]',
      'input[name="email"]',
      'input[name="username"]',
      'input[name="user"]',
      'input[id*="email"]',
      'input[id*="username"]',
      'input[id*="user"]',
    ];
    let filled = false;
    for (const sel of userSelectors) {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 2000 }).catch(() => false)) {
        await el.fill(username);
        filled = true;
        break;
      }
    }
    if (!filled) return false;

    // Some multi-step flows (e.g. Google) need "Next" before the password field appears
    const nextBtn = page.locator('button:has-text("Next"), button[jsname="LgbsSe"], input[type="submit"]').first();
    if (await nextBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(1500);
    }

    // Fill password field
    const passEl = page.locator('input[type="password"]').first();
    if (!await passEl.isVisible({ timeout: 5000 }).catch(() => false)) return false;
    await passEl.fill(password);

    // Submit
    const submitBtn = page.locator('button[type="submit"], input[type="submit"], button:has-text("Sign in"), button:has-text("Log in"), button:has-text("Next")').first();
    if (await submitBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await submitBtn.click();
    } else {
      await passEl.press('Enter');
    }

    // Wait for navigation away from the login page (up to 15s)
    await page.waitForURL((url) => !isLoginPage(url.toString(), ''), { timeout: 15000 }).catch(() => {});
    const landed = page.url();
    if (isLoginPage(landed, '')) return false;

    console.log('OK    Auto-login succeeded. Landed at: ' + landed);
    return true;
  } catch (err) {
    console.log('WARN  Auto-login attempt failed: ' + err.message);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('');
  console.log('==================================================');
  console.log('  Playwright Browser Setup');
  console.log('==================================================');
  console.log('');

  const env = loadEnvFile();
  const baseUrl = env.BASE_URL || process.env.BASE_URL || '';
  const loginUrl = env.LOGIN_URL || baseUrl;
  const username = findCred(env, ['EMAIL', 'USERNAME', 'USER', 'LOGIN']);
  const password = findCred(env, ['PASSWORD', 'PASS', 'SECRET']);

  if (!baseUrl) {
    console.log('INFO  No BASE_URL in .env — add BASE_URL=https://yoursite.com to .env');
    console.log('      Continuing without navigation...');
  }

  const browser = await chromium.launch({ headless: false, args: ['--no-first-run', '--no-default-browser-check'] });
  const context = await browser.newContext();
  const page    = await context.newPage();
  console.log('OK    Chrome launched');

  if (baseUrl) {
    const target = loginUrl || baseUrl;
    console.log('...   Navigating to ' + target + '...');
    try {
      await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 30000 });
      console.log('OK    Page loaded: ' + page.url());
    } catch (err) {
      console.log('WARN  Navigation failed: ' + err.message);
    }

    const currentUrl = page.url();
    const pageContent = await page.content().catch(() => '');
    const needsLogin = isLoginPage(currentUrl, pageContent);

    if (needsLogin) {
      if (username && password) {
        console.log('...   Login page detected — attempting auto-login with .env credentials...');
        const ok = await tryAutoLogin(page, username, password, currentUrl);
        if (!ok) {
          console.log('WARN  Auto-login did not complete — continuing anyway.');
        }
      } else {
        console.log('INFO  Login page detected — no credentials found in .env.');
        console.log('      Add LOGIN_URL, EMAIL/USERNAME, PASSWORD to .env to enable auto-login.');
        console.log('      Continuing without login...');
      }
    } else {
      console.log('OK    No login required — already authenticated or public page');
    }
  }

  console.log('...   Saving browser state to ' + AUTH_FILE + '...');
  await context.storageState({ path: AUTH_FILE });
  console.log('OK    Auth state saved — Playwright tests will reuse this session');
  console.log('');

  await browser.close().catch(() => {});
}

main().catch((err) => {
  console.error('ERROR ' + err.message);
  process.exit(1);
});
