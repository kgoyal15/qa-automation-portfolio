import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    // Checkout button — uncomment the line that matches your app's DOM:
    // this.checkoutButton = page.getByRole('button', { name: 'Checkout' });  // role (preferred)
    // this.checkoutButton = page.getByTestId('checkout');                     // data-testid
    // this.checkoutButton = page.getByText('Checkout');                       // visible text
    // this.checkoutButton = page.locator('[name="checkout"]');               // name attribute
    // this.checkoutButton = page.locator('.checkout_button');                 // CSS class
    this.checkoutButton = page.locator('[data-test="checkout"]');             // ← active (best guess — verify in DevTools)
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/cart.html');
  }

  async clickCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  // ── Convenience method (REQUIRED) ───────────────────────────────────────────
  async checkout(): Promise<void> {
    await this.clickCheckout();
  }
}
