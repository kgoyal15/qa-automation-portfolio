@echo off
setlocal enabledelayedexpansion

echo.
echo ==================================================
echo   Playwright Test Runner
echo ==================================================
echo.

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo ERROR: Node.js is not installed.
  echo.
  echo Please install Node.js ^(LTS^) from https://nodejs.org
  echo Then re-run this script.
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('node --version') do echo OK    Node.js %%v

where npm >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo ERROR: npm is not available. Please reinstall Node.js from https://nodejs.org
  pause
  exit /b 1
)
for /f "tokens=*" %%v in ('npm --version') do echo OK    npm %%v

echo.
echo ...   Installing dependencies
call npm install
if %ERRORLEVEL% neq 0 ( echo ERROR: npm install failed. & pause & exit /b 1 )

echo.
echo ...   Installing Playwright browsers
call npx playwright install --with-deps

echo.
echo ...   Setting up browser session
node pre-test.js

echo.
echo ...   Running Playwright tests
call npx playwright test
set PLAYWRIGHT_EXIT=%ERRORLEVEL%

echo.
echo ...   Uploading results to Qaily
node upload-results.js

echo.
echo ...   Opening HTML report (will auto-close after 30 seconds)
start "" /b npx playwright show-report
timeout /t 30 /nobreak >nul

echo.
echo ...   Closing report server
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":9323 " ^| findstr "LISTENING"') do (
  taskkill /PID %%p /F >nul 2>&1
)

echo.
echo DONE  All steps completed.
