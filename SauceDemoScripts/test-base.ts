/**
 * test-base.ts
 * Extended Playwright fixture that captures the page HTML snapshot on test failure.
 * Spec files should import:  import { test, expect } from '../test-base';
 * Page object files keep:    import { type Page, type Locator } from '@playwright/test';
 */
import { test as base, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export { expect };

export const test = base.extend<{ _htmlSnapshot: void }>({
  _htmlSnapshot: [async ({ page }, use, testInfo) => {
    await use();
    if (testInfo.status !== testInfo.expectedStatus) {
      try {
        const html = await page.content();
        const snapshotsDir = path.join('playwright-report', 'html-snapshots');
        fs.mkdirSync(snapshotsDir, { recursive: true });
        const safeTitle = testInfo.title.replace(/[^a-zA-Z0-9 _-]/g, '_').slice(0, 100);
        // Embed original title as first line so upload-results.js can recover it exactly
        const content = '<!-- test_title: ' + testInfo.title + ' -->\n' + html;
        fs.writeFileSync(path.join(snapshotsDir, safeTitle + '.html'), content, 'utf8');
      } catch (_) { /* best-effort — never fail the test run */ }
    }
  }, { auto: true }],
});
