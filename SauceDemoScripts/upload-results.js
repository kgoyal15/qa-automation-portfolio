#!/usr/bin/env node
/**
 * upload-results.js
 * Reads Playwright JSON results and uploads them to Qaily.
 * Called automatically by run.bat / run.sh after npx playwright test.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.error('[upload] .env not found — skipping upload.');
    process.exit(0);
  }
  const env = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

function readResults() {
  const resultsPath = path.join(__dirname, 'playwright-report', 'results.json');
  if (!fs.existsSync(resultsPath)) {
    console.error('[upload] playwright-report/results.json not found — skipping upload.');
    console.error('[upload] Ensure playwright.config.ts has the JSON reporter enabled.');
    process.exit(0);
  }
  try {
    return JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  } catch (e) {
    console.error('[upload] Failed to parse results.json:', e.message);
    process.exit(0);
  }
}

function buildSummary(results) {
  const s = results.stats ?? {};
  return {
    total:       (s.expected ?? 0) + (s.unexpected ?? 0) + (s.skipped ?? 0) + (s.flaky ?? 0),
    passed:      s.expected   ?? 0,
    failed:      s.unexpected ?? 0,
    skipped:     s.skipped    ?? 0,
    duration_ms: Math.round(s.duration ?? 0),
  };
}

function post(url, body, token) {
  return new Promise((resolve, reject) => {
    const data   = JSON.stringify(body);
    const parsed = new URL(url);
    const lib    = parsed.protocol === 'https:' ? https : http;
    const req = lib.request(
      {
        hostname: parsed.hostname,
        port:     parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
        path:     parsed.pathname + parsed.search,
        method:   'POST',
        headers: {
          'Content-Type':   'application/json',
          'Content-Length': Buffer.byteLength(data),
          'Authorization':  'Bearer ' + token,
        },
      },
      (res) => {
        let buf = '';
        res.on('data', (c) => buf += c);
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(buf));
          else reject(new Error('HTTP ' + res.statusCode + ': ' + buf));
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Request timed out')); });
    req.write(data);
    req.end();
  });
}

function readFailureSnapshots() {
  const snapshotsDir = path.join(__dirname, 'playwright-report', 'html-snapshots');
  if (!fs.existsSync(snapshotsDir)) return [];
  const snapshots = [];
  try {
    for (const file of fs.readdirSync(snapshotsDir)) {
      if (!file.endsWith('.html')) continue;
      try {
        const content = fs.readFileSync(path.join(snapshotsDir, file), 'utf8');
        // Recover original title from embedded comment, fall back to filename
        const match = content.match(/^<!-- test_title: (.+) -->/);
        const title = match ? match[1] : file.slice(0, -5);
        const html = match ? content.slice(content.indexOf('\n') + 1) : content;
        snapshots.push({ test_title: title, html_snippet: html });
      } catch (_) {}
    }
  } catch (_) {}
  return snapshots;
}

async function upload(url, token, summary, fullResults, failureSnapshots) {
  const payload = {
    summary,
    full_results:       fullResults,
    playwright_version: null,
    node_version:       process.version,
    ...(failureSnapshots && failureSnapshots.length > 0 ? { failure_snapshots: failureSnapshots } : {}),
  };
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      console.log('[upload] Uploading results (attempt ' + attempt + '/2)...');
      await post(url, payload, token);
      return;
    } catch (err) {
      if (attempt === 2) throw err;
      console.log('[upload] Attempt failed: ' + err.message + '. Retrying in 2s...');
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

async function main() {
  console.log('');
  console.log('[upload] Uploading test results to Qaily...');

  const env = loadEnv();
  const { AI_TOKEN, UPLOAD_URL } = env;

  if (!AI_TOKEN || !UPLOAD_URL) {
    console.error('[upload] AI_TOKEN or UPLOAD_URL missing from .env — skipping upload.');
    process.exit(0);
  }

  const results = readResults();
  const summary = buildSummary(results);

  console.log(
    '[upload] ' + summary.passed + ' passed, ' +
    summary.failed + ' failed, ' +
    summary.skipped + ' skipped (' + summary.duration_ms + 'ms)'
  );

  const failureSnapshots = readFailureSnapshots();
  if (failureSnapshots.length > 0) {
    console.log('[upload] Found ' + failureSnapshots.length + ' failure snapshot(s) to include.');
  }

  try {
    await upload(UPLOAD_URL, AI_TOKEN, summary, results, failureSnapshots);
    console.log('[upload] Done. View results at https://qaily.ca');
  } catch (err) {
    console.error('[upload] Upload failed: ' + err.message);
    console.error('[upload] Tests ran fine — only the upload failed.');
  }
  console.log('');
}

main();
