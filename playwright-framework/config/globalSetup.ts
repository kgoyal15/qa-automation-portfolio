import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

async function globalSetup(config: FullConfig): Promise<void> {
  logger.info('=== Global Setup Started ===');
  logger.info(`Environment: ${process.env.TEST_ENV || 'qa'}`);

  // Ensure auth state directory exists
  const authDir = path.join('tests', 'fixtures', '.auth');
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
    logger.info(`Created auth directory: ${authDir}`);
  }

  // Ensure reports directory exists
  const reportsDir = path.join('reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  // Optional: warm-up browser / pre-authenticate
  const baseURL = config.projects[0]?.use?.baseURL;
  if (baseURL) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    try {
      await page.goto(baseURL, { waitUntil: 'domcontentloaded', timeout: 30_000 });
      logger.info(`Base URL reachable: ${baseURL}`);
    } catch (err) {
      logger.warn(`Base URL check failed: ${String(err)}`);
    } finally {
      await browser.close();
    }
  }

  logger.info('=== Global Setup Complete ===');
}

export default globalSetup;
