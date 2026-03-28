import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;

  constructor(private readonly page: Page) {
    // Inventory list container — uncomment the line that matches your app's DOM:
    // this.inventoryList = page.getByTestId('inventory-container');          // data-testid
    // this.inventoryList = page.locator('.inventory_list');                  // CSS class
    // this.inventoryList = page.locator('#inventory_container');             // id attribute
    this.inventoryList = page.locator('.inventory_list');                     // ← active (best guess — verify in DevTools)

    // Inventory items — uncomment the line that matches your app's DOM:
    // this.inventoryItems = page.getByTestId('inventory-item');              // data-testid
    // this.inventoryItems = page.locator('[data-test="inventory-item"]');   // data-test attribute
    // this.inventoryItems = page.locator('.inventory_item');                 // CSS class
    this.inventoryItems = page.locator('.inventory_item');                    // ← active (best guess — verify in DevTools)
  }
}
