import { type Page, type Locator } from '@playwright/test';

export class CartPage {
  readonly cartContainer: Locator;
  readonly cartItems: Locator;

  constructor(private readonly page: Page) {
    // Cart container — uncomment the line that matches your app's DOM:
    // this.cartContainer = page.getByTestId('cart-contents-container');      // data-testid
    // this.cartContainer = page.locator('#cart_contents_container');         // id attribute
    // this.cartContainer = page.locator('.cart_contents_container');         // CSS class
    this.cartContainer = page.locator('#cart_contents_container');            // ← active (best guess — verify in DevTools)

    // Cart item rows — uncomment the line that matches your app's DOM:
    // this.cartItems = page.getByTestId('cart-item');                        // data-testid
    // this.cartItems = page.locator('.cart_item');                           // CSS class
    // this.cartItems = page.locator('[data-test="cart-item"]');             // data-test attribute
    this.cartItems = page.locator('.cart_item');                              // ← active (best guess — verify in DevTools)
  }

  async waitForCartPage(): Promise<void> {
    await this.cartContainer.waitFor({ state: 'visible' });
  }
}
