import { test, expect } from '../../test-base';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';

const USERNAME = 'standard_user';
const PASSWORD = 'secret_sauce';

test.describe('Inventory Page Displays Items After Login and Item Can Be Added to Cart', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    // Log in as standard_user before each test
    await loginPage.goto();
    await loginPage.login(USERNAME, PASSWORD);

    // Ensure we land on the inventory page
    await inventoryPage.goto();
  });

  test('Inventory Page Displays Items After Login and Item Can Be Added to Cart', async ({ page }) => {
    // ── Step 1: Verify Inventory page is displayed with at least one item ──────
    // Arrange — already on inventory page from beforeEach

    // Assert
    await expect(inventoryPage.inventoryItems.first()).toBeVisible({
      message: 'At least one inventory item should be visible on the Inventory page after login',
    });

    // ── Step 2: First item has name, description, price, and Add to cart button ─

    // Assert — first item name is visible
    await expect(inventoryPage.firstItemName).toBeVisible({
      message: 'The first inventory item should display a name',
    });

    // Assert — first item description is visible
    await expect(inventoryPage.firstItemDescription).toBeVisible({
      message: 'The first inventory item should display a description',
    });

    // Assert — first item price is visible
    await expect(inventoryPage.firstItemPrice).toBeVisible({
      message: 'The first inventory item should display a price',
    });

    // Assert — first item Add to cart button is visible
    await expect(inventoryPage.firstItemAddToCartButton).toBeVisible({
      message: 'The first inventory item should have an "Add to cart" button',
    });

    // ── Step 3: Click Add to cart and verify cart badge updates to '1' ─────────

    // Act
    await inventoryPage.clickFirstAddToCart();

    // Assert
    await expect(inventoryPage.cartBadge).toBeVisible({
      message: 'Shopping cart badge should be visible after adding an item',
    });
    await expect(inventoryPage.cartBadge).toHaveText('1', {
      message: 'Shopping cart badge should display "1" after adding one item to the cart',
    });

    // ── Step 4: Click cart badge and verify Cart page shows the added item ──────

    // Act
    await inventoryPage.clickCartIcon();

    // Assert — URL changed to cart page
    await expect(page).toHaveURL(/\/cart\.html/, {
      message: 'Clicking the cart icon should navigate to the Cart page',
    });

    // Assert — cart container is visible
    await cartPage.waitForCartPage();
    await expect(cartPage.cartContainer).toBeVisible({
      message: 'Cart page container should be visible after navigating to cart',
    });

    // Assert — at least one cart item is listed
    await expect(cartPage.cartItems.first()).toBeVisible({
      message: 'The previously added item should appear in the cart list',
    });
  });
});
