import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly inventoryContainer: Locator;
  readonly inventoryItems: Locator;
  readonly firstItemName: Locator;
  readonly firstItemDescription: Locator;
  readonly firstItemPrice: Locator;
  readonly firstItemAddToCartButton: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;

  constructor(private readonly page: Page) {
    // Inventory container — uncomment the line that matches your app's DOM:
    // this.inventoryContainer = page.getByTestId('inventory-container');     // data-testid
    // this.inventoryContainer = page.locator('#inventory_container');        // id attribute
    // this.inventoryContainer = page.locator('.inventory_container');        // CSS class
    this.inventoryContainer = page.locator('#inventory_container');           // ← active (best guess — verify in DevTools)

    // All inventory items — uncomment the line that matches your app's DOM:
    // this.inventoryItems = page.getByTestId('inventory-item');              // data-testid
    // this.inventoryItems = page.locator('.inventory_item');                 // CSS class
    // this.inventoryItems = page.locator('[data-test="inventory-item"]');   // data-test attribute
    this.inventoryItems = page.locator('.inventory_item');                    // ← active (best guess — verify in DevTools)

    // First item name — uncomment the line that matches your app's DOM:
    // this.firstItemName = page.getByTestId('inventory-item-name').first();  // data-testid
    // this.firstItemName = page.locator('.inventory_item_name').first();     // CSS class
    // this.firstItemName = page.locator('[data-test="inventory-item-name"]').first(); // data-test
    this.firstItemName = page.locator('.inventory_item_name').first();        // ← active (best guess — verify in DevTools)

    // First item description — uncomment the line that matches your app's DOM:
    // this.firstItemDescription = page.getByTestId('inventory-item-desc').first();  // data-testid
    // this.firstItemDescription = page.locator('.inventory_item_desc').first();     // CSS class
    // this.firstItemDescription = page.locator('[data-test="inventory-item-desc"]').first(); // data-test
    this.firstItemDescription = page.locator('.inventory_item_desc').first(); // ← active (best guess — verify in DevTools)

    // First item price — uncomment the line that matches your app's DOM:
    // this.firstItemPrice = page.getByTestId('inventory-item-price').first(); // data-testid
    // this.firstItemPrice = page.locator('.inventory_item_price').first();    // CSS class
    // this.firstItemPrice = page.locator('[data-test="inventory-item-price"]').first(); // data-test
    this.firstItemPrice = page.locator('.inventory_item_price').first();       // ← active (best guess — verify in DevTools)

    // First item 'Add to cart' button — uncomment the line that matches your app's DOM:
    // this.firstItemAddToCartButton = page.getByRole('button', { name: 'Add to cart' }).first(); // role
    // this.firstItemAddToCartButton = page.locator('[data-test^="add-to-cart"]').first();        // data-test prefix
    // this.firstItemAddToCartButton = page.locator('button[id^="add-to-cart"]').first();        // id prefix
    // this.firstItemAddToCartButton = page.locator('.btn_inventory').first();                   // CSS class
    this.firstItemAddToCartButton = page.getByRole('button', { name: 'Add to cart' }).first(); // ← active (best guess — verify in DevTools)

    // Shopping cart badge — uncomment the line that matches your app's DOM:
    // this.cartBadge = page.getByTestId('shopping-cart-badge');              // data-testid
    // this.cartBadge = page.locator('.shopping_cart_badge');                 // CSS class
    // this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');   // data-test
    this.cartBadge = page.locator('.shopping_cart_badge');                    // ← active (best guess — verify in DevTools)

    // Shopping cart link/icon — uncomment the line that matches your app's DOM:
    // this.cartLink = page.getByRole('link', { name: /cart/i });             // role (preferred)
    // this.cartLink = page.getByTestId('shopping-cart-link');                // data-testid
    // this.cartLink = page.locator('.shopping_cart_link');                   // CSS class
    // this.cartLink = page.locator('[data-test="shopping-cart-link"]');     // data-test
    this.cartLink = page.locator('.shopping_cart_link');                      // ← active (best guess — verify in DevTools)
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/inventory.html');
    await this.inventoryContainer.waitFor({ state: 'visible' });
  }

  async clickFirstAddToCart(): Promise<void> {
    await this.firstItemAddToCartButton.waitFor({ state: 'visible' });
    await this.firstItemAddToCartButton.click();
  }

  async clickCartIcon(): Promise<void> {
    await this.cartLink.waitFor({ state: 'visible' });
    await this.cartLink.click();
  }

  // ── Convenience method (REQUIRED) ───────────────────────────────────────────
  // Adds the first inventory item to the cart and navigates to the cart page.
  async addFirstItemToCartAndGoToCart(): Promise<void> {
    await this.clickFirstAddToCart();
    await this.clickCartIcon();
  }
}
