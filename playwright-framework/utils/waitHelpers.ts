import { Page, Locator, expect } from '@playwright/test';
import { logger } from './logger';

/**
 * Wait until a network call matching `urlPattern` completes and return the response.
 */
export async function waitForApiResponse(
  page: Page,
  urlPattern: string | RegExp,
  action: () => Promise<void>,
): Promise<import('@playwright/test').Response> {
  const [response] = await Promise.all([
    page.waitForResponse((r) => {
      const url = r.url();
      return typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url);
    }),
    action(),
  ]);
  return response;
}

/**
 * Poll a locator until it has the expected text or until timeout.
 */
export async function waitForText(
  locator: Locator,
  text: string,
  timeout = 10_000,
): Promise<void> {
  logger.info(`Waiting for text: "${text}"`);
  await expect(locator).toContainText(text, { timeout });
}

/**
 * Retry an async action up to `maxAttempts` with exponential back-off.
 */
export async function retryAction<T>(
  action: () => Promise<T>,
  maxAttempts = 3,
  delayMs = 1_000,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action();
    } catch (err) {
      lastError = err;
      logger.warn(`Attempt ${attempt}/${maxAttempts} failed: ${String(err)}`);
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, delayMs * attempt));
      }
    }
  }
  throw lastError;
}

/**
 * Pause execution — use sparingly; prefer web-first assertions.
 */
export async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}
