import { type Page, type Locator } from '@playwright/test';

export class CheckoutStepTwoPage {
  readonly finishButton: Locator;

  constructor(private readonly page: Page) {
    // Finish button — uncomment the line that matches your app's DOM:
    // this.finishButton = page.getByRole('button', { name: 'Finish' });     // role
    // this.finishButton = page.getByTestId('finish-button');                 // data-testid
    // this.finishButton = page.locator('[data-testid="finish-button"]');     // data attribute
    this.finishButton = page.locator('[id="finish"]');                        // ← active (best guess — verify in DevTools)
  }

  async clickFinish(): Promise<void> {
    await this.finishButton.click();
  }
}
