import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    // Checkout button — uncomment the line that matches your app's DOM:
    // this.checkoutButton = page.getByRole('button', { name: 'Checkout' }); // role
    // this.checkoutButton = page.getByTestId('checkout-button');             // data-testid
    // this.checkoutButton = page.locator('[id="checkout"]');                // id attribute
    // this.checkoutButton = page.locator('[data-testid="checkout-button"]'); // data attribute
    this.checkoutButton = page.locator('[id="checkout"]');                   // ← active (best guess — verify in DevTools)
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
