import { test, expect } from '../../test-base';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutInformationPage } from './pages/CheckoutInformationPage';
import { CheckoutOverviewPage } from './pages/CheckoutOverviewPage';
import { CheckoutCompletePage } from './pages/CheckoutCompletePage';

test.describe('Checkout Form Accepts Required Fields and Completes Order Successfully', () => {
  test.beforeEach(async ({ page }) => {
    // Log in as standard_user and add an item to the cart before each test
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addToCartAndGoToCart();

    // Verify we are on the cart page
    await expect(page).toHaveURL(/\/cart\.html/, {
      message: 'Precondition: user should be on the Cart page before the test starts',
    });
  });

  test('Checkout Form Accepts Required Fields and Completes Order Successfully', async ({ page }) => {
    // ── Step 1: Click Checkout on Cart page ────────────────────────────────────
    const cartPage = new CartPage(page);
    await cartPage.checkout();

    // Assert: Checkout: Your Information page is displayed
    const checkoutInfoPage = new CheckoutInformationPage(page);
    await expect(page).toHaveURL(/\/checkout-step-one\.html/, {
      message: 'Step 1: Should navigate to the Checkout: Your Information page',
    });
    await expect(checkoutInfoPage.pageTitle).toBeVisible({
      message: 'Step 1: Page title should be visible on Checkout: Your Information page',
    });
    await expect(checkoutInfoPage.pageTitle).toHaveText('Checkout: Your Information', {
      message: 'Step 1: Page title should read "Checkout: Your Information"',
    });
    await expect(checkoutInfoPage.firstNameInput).toBeVisible({
      message: 'Step 1: First Name field should be visible',
    });
    await expect(checkoutInfoPage.lastNameInput).toBeVisible({
      message: 'Step 1: Last Name field should be visible',
    });
    await expect(checkoutInfoPage.postalCodeInput).toBeVisible({
      message: 'Step 1: Postal Code field should be visible',
    });

    // ── Step 2: Enter First Name ────────────────────────────────────────────────
    await checkoutInfoPage.fillFirstName('John');

    // Assert: First Name field displays 'John'
    await expect(checkoutInfoPage.firstNameInput).toHaveValue('John', {
      message: 'Step 2: First Name field should display "John"',
    });

    // ── Step 3: Enter Last Name ─────────────────────────────────────────────────
    await checkoutInfoPage.fillLastName('Doe');

    // Assert: Last Name field displays 'Doe'
    await expect(checkoutInfoPage.lastNameInput).toHaveValue('Doe', {
      message: 'Step 3: Last Name field should display "Doe"',
    });

    // ── Step 4: Enter Postal Code ───────────────────────────────────────────────
    await checkoutInfoPage.fillPostalCode('12345');

    // Assert: Postal Code field displays '12345'
    await expect(checkoutInfoPage.postalCodeInput).toHaveValue('12345', {
      message: 'Step 4: Postal Code field should display "12345"',
    });

    // ── Step 5: Click Continue ──────────────────────────────────────────────────
    await checkoutInfoPage.clickContinue();

    // Assert: Checkout: Overview page is displayed
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    await expect(page).toHaveURL(/\/checkout-step-two\.html/, {
      message: 'Step 5: Should navigate to the Checkout: Overview page',
    });
    await expect(checkoutOverviewPage.pageTitle).toBeVisible({
      message: 'Step 5: Page title should be visible on Checkout: Overview page',
    });
    await expect(checkoutOverviewPage.pageTitle).toHaveText('Checkout: Overview', {
      message: 'Step 5: Page title should read "Checkout: Overview"',
    });

    // ── Step 6: Click Finish ────────────────────────────────────────────────────
    await checkoutOverviewPage.finishOrder();

    // Assert: Order completion page with confirmation message
    const checkoutCompletePage = new CheckoutCompletePage(page);
    await expect(page).toHaveURL(/\/checkout-complete\.html/, {
      message: 'Step 6: Should navigate to the order completion page',
    });
    await expect(checkoutCompletePage.confirmationHeader).toBeVisible({
      message: 'Step 6: Confirmation message should be visible on the completion page',
    });
    await expect(checkoutCompletePage.confirmationHeader).toHaveText('Thank you for your order!', {
      message: 'Step 6: Confirmation message must read exactly "Thank you for your order!"',
    });
  });
});
