import { test, expect } from '../../test-base';
import { LoginPage } from './pages/LoginPage';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('Login Attempt Without Credentials Displays Required Error Message', async ({ page }) => {
    // Arrange — both fields are left empty (no pre-fill needed)

    // Act
    await loginPage.clickLogin();

    // Assert
    await expect(loginPage.errorMessage).toBeVisible({
      message: 'Error message should be displayed after clicking Login with empty credentials',
    });
    await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required', {
      message: 'Error message text must match exactly: "Epic sadface: Username is required"',
    });
    await expect(page).toHaveURL(/saucedemo\.com\/?$/, {
      message: 'User should remain on the SauceDemo login page after failed login attempt',
    });
  });
});
