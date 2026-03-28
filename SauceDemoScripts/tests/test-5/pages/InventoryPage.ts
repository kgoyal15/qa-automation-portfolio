import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly inventoryList: Locator;
  readonly cartBadge: Locator;
  readonly addToCartButtons: Locator;

  constructor(private readonly page: Page) {
    // Inventory list container — uncomment the line that matches your app's DOM:
    // this.inventoryList = page.getByTestId('inventory-list');               // data-testid
    // this.inventoryList = page.locator('.inventory_list');                  // CSS class
    // this.inventoryList = page.locator('[id="inventory_container"]');      // id attribute
    this.inventoryList = page.locator('.inventory_list');                     // ← active (best guess — verify in DevTools)

    // Cart badge (shows item count) — uncomment the line that matches your app's DOM:
    // this.cartBadge = page.getByTestId('shopping-cart-badge');              // data-testid
    // this.cartBadge = page.locator('[data-testid="shopping-cart-badge"]');  // data-testid attribute
    // this.cartBadge = page.locator('.shopping_cart_badge');                 // CSS class
    this.cartBadge = page.locator('.shopping_cart_badge');                    // ← active (best guess — verify in DevTools)

    // Add to cart buttons — uncomment the line that matches your app's DOM:
    // this.addToCartButtons = page.getByRole('button', { name: /Add to cart/ }); // role
    // this.addToCartButtons = page.locator('[data-testid*="add-to-cart"]');       // data-testid
    this.addToCartButtons = page.locator('.btn_primary.btn_inventory');            // ← active (best guess — verify in DevTools)
  }

  async goto(): Promise<void> {
    await this.page.goto('/inventory.html');
  }

  async addFirstItemToCart(): Promise<void> {
    await this.addToCartButtons.first().click();
  }

  async clickCartIcon(): Promise<void> {
    await this.page.locator('.shopping_cart_link').click();
  }
}
