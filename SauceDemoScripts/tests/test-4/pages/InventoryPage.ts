import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly addToCartButton: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    // Add to cart button (first item) — uncomment the line that matches your app's DOM:
    // this.addToCartButton = page.getByRole('button', { name: /Add to cart/i }).first(); // role
    // this.addToCartButton = page.getByTestId('add-to-cart').first();                    // data-testid
    // this.addToCartButton = page.locator('.btn_inventory').first();                     // CSS class
    this.addToCartButton = page.locator('[data-test^="add-to-cart"]').first();           // ← active (best guess — verify in DevTools)

    // Cart icon/link — uncomment the line that matches your app's DOM:
    // this.cartLink = page.getByRole('link', { name: /cart/i });            // role
    // this.cartLink = page.locator('.shopping_cart_link');                   // CSS class
    // this.cartLink = page.getByTestId('shopping-cart-link');                // data-testid
    this.cartLink = page.locator('.shopping_cart_link');                      // ← active (best guess — verify in DevTools)
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
  }

  async addFirstItemToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  // ── Convenience method (REQUIRED) ───────────────────────────────────────────
  async addToCartAndGoToCart(): Promise<void> {
    await this.addFirstItemToCart();
    await this.goToCart();
  }
}
