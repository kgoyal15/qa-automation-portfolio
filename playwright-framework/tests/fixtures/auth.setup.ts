/**
 * auth.setup.ts — runs once before the browser projects.
 * Logs in and saves storage state so all tests start already authenticated.
 *
 * Configured as a "setup" project dependency in playwright.config.ts.
 */
import { test as setup, expect } from '@playwright/test';
import { getEnvironmentConfig } from '../../config/environmentConfig';
import * as path from 'path';

const env = (process.env.TEST_ENV as 'dev' | 'qa' | 'prod') || 'qa';
const config = getEnvironmentConfig(env);

const authFile = path.join('tests', 'fixtures', '.auth', 'user.json');

setup('authenticate', async ({ page }) => {
  await page.goto(`${config.baseURL}/login`);

  await page.getByLabel('Email address').fill(config.credentials.email);
  await page.getByLabel('Password').fill(config.credentials.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Wait until we land on the dashboard
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 15_000 });

  // Persist cookies + localStorage so other tests can reuse the session
  await page.context().storageState({ path: authFile });
});
