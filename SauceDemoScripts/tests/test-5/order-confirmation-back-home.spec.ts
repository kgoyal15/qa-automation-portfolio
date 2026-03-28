import { test, expect } from '../../test-base';
import { LoginPage } from './pages/LoginPage';
import { InventoryPage } from './pages/InventoryPage';
import { CartPage } from './pages/CartPage';
import { CheckoutStepOnePage } from './pages/CheckoutStepOnePage';
import { CheckoutStepTwoPage } from './pages/CheckoutStepTwoPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';

test.describe('Back Home Button After Order Completion Returns User to Inventory Page', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let orderConfirmationPage: OrderConfirmationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    orderConfirmationPage = new OrderConfirmationPage(page);

    // Precondition: log in as standard_user and complete a full checkout
    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
    await page.waitForURL('**/inventory.html');

    // Add an item to cart
    await inventoryPage.addFirstItemToCart();

    // Navigate to cart
    await inventoryPage.clickCartIcon();
    await page.waitForURL('**/cart.html');

    // Proceed to checkout
    await cartPage.clickCheckout();
    await page.waitForURL('**/checkout-step-one.html');

    // Fill checkout info
    await checkoutStepOnePage.fillCheckoutInfo('John', 'Doe', '12345');
    await page.waitForURL('**/checkout-step-two.html');

    // Finish the order
    await checkoutStepTwoPage.clickFinish();
    await page.waitForURL('**/checkout-complete.html');
  });

  test('Back Home Button After Order Completion Returns User to Inventory Page', async ({ page }) => {
    // Step 1: Verify the order confirmation page is displayed with 'Thank you for your order!'
    await expect(orderConfirmationPage.confirmationHeader).toBeVisible({
      message: 'Order confirmation header should be visible on the completion page',
    });
    await expect(orderConfirmationPage.confirmationHeader).toHaveText('Thank you for your order!', {
      message: "Confirmation message must read exactly 'Thank you for your order!'",
    });

    // Step 2: Click the 'Back Home' button
    await orderConfirmationPage.clickBackHome();

    // Assert: User is redirected to the Inventory page
    await expect(page).toHaveURL(/\/inventory\.html/, {
      message: 'Clicking Back Home should redirect to the inventory page at /inventory.html',
    });
    await expect(inventoryPage.inventoryList).toBeVisible({
      message: 'Inventory items list should be displayed after returning home',
    });

    // Step 3: Verify the shopping cart badge is empty or not displayed
    await expect(inventoryPage.cartBadge).not.toBeVisible({
      message: 'Cart badge should not be visible (cart should be empty) after order completion',
    });
  });
});
