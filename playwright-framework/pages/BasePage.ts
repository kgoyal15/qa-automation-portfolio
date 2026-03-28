import { Page, Locator, expect } from '@playwright/test';
import { logger, logStep } from '../utils/logger';

/**
 * BasePage — inherited by every Page Object.
 * Provides a consistent, logged API over Playwright primitives.
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ─── Navigation ────────────────────────────────────────────────────────────

  async navigate(path = '/'): Promise<void> {
    logStep(`Navigate to ${path}`);
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // ─── Interactions ──────────────────────────────────────────────────────────

  async click(locator: Locator, description = 'element'): Promise<void> {
    logStep(`Click: ${description}`);
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async doubleClick(locator: Locator, description = 'element'): Promise<void> {
    logStep(`Double-click: ${description}`);
    await locator.waitFor({ state: 'visible' });
    await locator.dblclick();
  }

  async fill(locator: Locator, value: string, description = 'field'): Promise<void> {
    logStep(`Fill "${description}" with "${value}"`);
    await locator.waitFor({ state: 'visible' });
    await locator.clear();
    await locator.fill(value);
  }

  async type(locator: Locator, value: string, description = 'field'): Promise<void> {
    logStep(`Type into "${description}": "${value}"`);
    await locator.waitFor({ state: 'visible' });
    await locator.pressSequentially(value, { delay: 50 });
  }

  async selectOption(locator: Locator, value: string, description = 'dropdown'): Promise<void> {
    logStep(`Select "${value}" in ${description}`);
    await locator.waitFor({ state: 'visible' });
    await locator.selectOption(value);
  }

  async check(locator: Locator, description = 'checkbox'): Promise<void> {
    logStep(`Check: ${description}`);
    await locator.check();
  }

  async uncheck(locator: Locator, description = 'checkbox'): Promise<void> {
    logStep(`Uncheck: ${description}`);
    await locator.uncheck();
  }

  async pressKey(key: string): Promise<void> {
    logStep(`Press key: ${key}`);
    await this.page.keyboard.press(key);
  }

  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async uploadFile(locator: Locator, filePath: string): Promise<void> {
    logStep(`Upload file: ${filePath}`);
    await locator.setInputFiles(filePath);
  }

  async hover(locator: Locator, description = 'element'): Promise<void> {
    logStep(`Hover over: ${description}`);
    await locator.hover();
  }

  // ─── Getters ───────────────────────────────────────────────────────────────

  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent()) ?? '';
  }

  async getValue(locator: Locator): Promise<string> {
    return locator.inputValue();
  }

  async getAttribute(locator: Locator, attr: string): Promise<string | null> {
    return locator.getAttribute(attr);
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async isEnabled(locator: Locator): Promise<boolean> {
    return locator.isEnabled();
  }

  // ─── Assertions ────────────────────────────────────────────────────────────

  async assertVisible(locator: Locator, description = 'element'): Promise<void> {
    logStep(`Assert visible: ${description}`);
    await expect(locator).toBeVisible();
  }

  async assertHidden(locator: Locator, description = 'element'): Promise<void> {
    logStep(`Assert hidden: ${description}`);
    await expect(locator).toBeHidden();
  }

  async assertText(locator: Locator, expected: string): Promise<void> {
    logStep(`Assert text: "${expected}"`);
    await expect(locator).toHaveText(expected);
  }

  async assertContainsText(locator: Locator, expected: string): Promise<void> {
    logStep(`Assert contains text: "${expected}"`);
    await expect(locator).toContainText(expected);
  }

  async assertUrl(expected: string | RegExp): Promise<void> {
    logStep(`Assert URL: ${String(expected)}`);
    await expect(this.page).toHaveURL(expected);
  }

  async assertTitle(expected: string | RegExp): Promise<void> {
    logStep(`Assert title: ${String(expected)}`);
    await expect(this.page).toHaveTitle(expected);
  }

  async assertCount(locator: Locator, count: number): Promise<void> {
    logStep(`Assert count: ${count}`);
    await expect(locator).toHaveCount(count);
  }

  // ─── Waits ─────────────────────────────────────────────────────────────────

  async waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  async waitForHidden(locator: Locator, timeout = 10_000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  async waitForUrl(url: string | RegExp, timeout = 15_000): Promise<void> {
    await this.page.waitForURL(url, { timeout });
  }

  // ─── Screenshots ───────────────────────────────────────────────────────────

  async takeScreenshot(name: string): Promise<Buffer> {
    logger.info(`Screenshot: ${name}`);
    return this.page.screenshot({ path: `reports/screenshots/${name}.png`, fullPage: true });
  }
}
