import { defineConfig } from '@playwright/test';
import fs from 'fs';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
  ],
  use: {
    trace: 'on-first-retry',
    headless: false,
    // Use saved auth state if pre-test.js has been run
    ...(fs.existsSync('auth.json') ? { storageState: 'auth.json' } : {}),
  },
});
