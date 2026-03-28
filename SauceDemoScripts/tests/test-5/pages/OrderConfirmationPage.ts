import { type Page, type Locator } from '@playwright/test';

export class OrderConfirmationPage {
  readonly confirmationHeader: Locator;
  readonly backHomeButton: Locator;

  constructor(private readonly page: Page) {
    // Order confirmation header — uncomment the line that matches your app's DOM:
    // this.confirmationHeader = page.getByRole('heading', { name: 'Thank you for your order!' }); // role heading
    // this.confirmationHeader = page.getByTestId('complete-header');                               // data-testid
    // this.confirmationHeader = page.locator('.complete-header');                                  // CSS class
    // this.confirmationHeader = page.getByText('Thank you for your order!');                       // visible text
    this.confirmationHeader = page.locator('.complete-header');                                     // ← active (best guess — verify in DevTools)

    // Back Home button — uncomment the line that matches your app's DOM:
    // this.backHomeButton = page.getByRole('button', { name: 'Back Home' }); // role (preferred)
    // this.backHomeButton = page.getByTestId('back-to-products-button');      // data-testid
    // this.backHomeButton = page.locator('[id="back-to-products"]');          // id attribute
    // this.backHomeButton = page.getByText('Back Home');                      // visible text
    this.backHomeButton = page.locator('[id="back-to-products"]');             // ← active (best guess — verify in DevTools)
  }

  async clickBackHome(): Promise<void> {
    await this.backHomeButton.click();
  }
}
