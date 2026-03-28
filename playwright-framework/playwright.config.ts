import { defineConfig, devices } from '@playwright/test';
import { getEnvironmentConfig } from './config/environmentConfig';
import * as path from 'path';

const env = (process.env.TEST_ENV as 'dev' | 'qa' | 'prod') || 'qa';
const envConfig = getEnvironmentConfig(env);

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const reportDir = path.join('reports', timestamp);

export default defineConfig({
  // ─── Test discovery ────────────────────────────────────────────────────────
  testDir: './tests',
  testMatch: ['**/*.spec.ts'],

  // ─── Execution ─────────────────────────────────────────────────────────────
  fullyParallel: true,
  workers: process.env.CI ? 4 : undefined,
  retries: process.env.CI ? 2 : 0,

  // ─── Timeouts ──────────────────────────────────────────────────────────────
  timeout: 60_000,
  expect: { timeout: 10_000 },

  // ─── Global setup / teardown ───────────────────────────────────────────────
  globalSetup: './config/globalSetup.ts',
  globalTeardown: './config/globalTeardown.ts',

  // ─── Reporters ─────────────────────────────────────────────────────────────
  reporter: [
    ['html', { outputFolder: `${reportDir}/html`, open: 'never' }],
    ['json', { outputFile: `${reportDir}/results.json` }],
    ['allure-playwright', { outputFolder: `${reportDir}/allure-results` }],
    ['list'],
  ],

  // ─── Shared browser settings ───────────────────────────────────────────────
  use: {
    baseURL: envConfig.baseURL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    locale: 'en-US',
    timezoneId: 'America/New_York',
    extraHTTPHeaders: {
      'x-test-env': env,
    },
  },

  // ─── Browser projects ──────────────────────────────────────────────────────
  projects: [
    // Setup project — runs auth once, shared across all tests
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'tests/fixtures/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'tests/fixtures/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'tests/fixtures/.auth/user.json',
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
        storageState: 'tests/fixtures/.auth/user.json',
      },
      dependencies: ['setup'],
    },

    // API tests — no browser needed
    {
      name: 'api',
      testDir: './tests/api',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // ─── Output ────────────────────────────────────────────────────────────────
  outputDir: `${reportDir}/test-artifacts`,
});
