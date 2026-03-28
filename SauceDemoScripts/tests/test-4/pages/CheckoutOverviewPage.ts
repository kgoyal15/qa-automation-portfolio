import { type Page, type Locator } from '@playwright/test';

export class CheckoutOverviewPage {
  readonly finishButton: Locator;
  readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    // Finish button — uncomment the line that matches your app's DOM:
    // this.finishButton = page.getByRole('button', { name: 'Finish' });    // role (preferred)
    // this.finishButton = page.getByText('Finish');                         // visible text
    // this.finishButton = page.locator('[name="finish"]');                 // name attribute
    // this.finishButton = page.locator('.btn_action');                      // CSS class
    this.finishButton = page.locator('[data-test="finish"]');               // ← active (best guess — verify in DevTools)

    // Page title — uncomment the line that matches your app's DOM:
    // this.pageTitle = page.getByRole('heading', { name: 'Checkout: Overview' }); // role
    // this.pageTitle = page.getByTestId('title');                                  // data-testid
    // this.pageTitle = page.locator('.title');                                      // CSS class
    this.pageTitle = page.locator('.title');                                        // ← active (best guess — verify in DevTools)
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }

  // ── Convenience method (REQUIRED) ───────────────────────────────────────────
  async finishOrder(): Promise<void> {
    await this.clickFinish();
  }
}
