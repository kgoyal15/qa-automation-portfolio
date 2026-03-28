/**
 * cleanReports.js — removes report folders older than RETENTION_DAYS.
 * Run with: node scripts/cleanReports.js
 */
const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '..', 'reports');
const RETENTION_DAYS = parseInt(process.env.REPORT_RETENTION_DAYS || '7', 10);
const CUTOFF_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

if (!fs.existsSync(REPORTS_DIR)) {
  console.log('No reports directory found — nothing to clean.');
  process.exit(0);
}

const now = Date.now();
let removed = 0;

fs.readdirSync(REPORTS_DIR).forEach((entry) => {
  const fullPath = path.join(REPORTS_DIR, entry);
  const stat = fs.statSync(fullPath);

  if (!stat.isDirectory()) return;

  const ageMs = now - stat.mtimeMs;
  if (ageMs > CUTOFF_MS) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`Removed old report: ${entry}`);
    removed++;
  }
});

console.log(`Clean complete. Removed ${removed} report folder(s) older than ${RETENTION_DAYS} days.`);
