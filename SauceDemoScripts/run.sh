#!/bin/bash
set -e

echo ""
echo "=================================================="
echo "  Playwright Test Runner"
echo "=================================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "ERROR: Node.js is not installed."
  echo ""
  echo "Please install Node.js (LTS) from https://nodejs.org"
  echo "Then re-run this script."
  exit 1
fi
echo "OK  Node.js $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
  echo "ERROR: npm is not available. Please reinstall Node.js from https://nodejs.org"
  exit 1
fi
echo "OK  npm $(npm --version)"

echo ""
echo "...  Installing dependencies"
npm install

echo ""
echo "...  Installing Playwright browsers"
npx playwright install --with-deps

echo ""
echo "...  Setting up browser session"
node pre-test.js

echo ""
echo "...  Running Playwright tests"
npx playwright test || true

echo ""
echo "...  Uploading results to Qaily"
node upload-results.js

echo ""
echo "...  Opening HTML report (will auto-close after 30 seconds)"
npx playwright show-report &
REPORT_PID=$!

sleep 30

echo ""
echo "...  Closing report server (PID $REPORT_PID)"
kill $REPORT_PID 2>/dev/null || true

echo ""
echo "DONE All steps completed."
