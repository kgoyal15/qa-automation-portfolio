import { test, expect } from '../../test-base';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Successful Login with Standard User Credentials', async ({ page }) => {
    // Arrange
    const username = 'standard_user';
    const password = 'secret_sauce';
    const inventoryPage = new InventoryPage(page);

    // Assert — login page is displayed with all required fields
    await expect(loginPage.usernameInput).toBeVisible({
      message: 'Username field should be visible on the SauceDemo login page',
    });
    await expect(loginPage.passwordInput).toBeVisible({
      message: 'Password field should be visible on the SauceDemo login page',
    });
    await expect(loginPage.loginButton).toBeVisible({
      message: 'Login button should be visible on the SauceDemo login page',
    });

    // Act
    await loginPage.login(username, password);

    // Assert — redirected to inventory page
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html', {
      message: 'User should be redirected to the Inventory page after successful login',
    });
    await expect(inventoryPage.inventoryList).toBeVisible({
      message: 'Inventory list container should be visible on the Inventory page',
    });
    await expect(inventoryPage.inventoryItems.first()).toBeVisible({
      message: 'At least one inventory item should be visible on the Inventory page',
    });
  });
});
