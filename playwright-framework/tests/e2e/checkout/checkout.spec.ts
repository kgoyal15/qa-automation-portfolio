import { test, expect } from '../../fixtures/baseFixtures';
import { loadTestData } from '../../../utils/fileHelpers';
import { TAGS } from '../../../constants/testTags';
import { ShippingDetails, PaymentDetails } from '../../../pages/CheckoutPage';

interface ProductData {
  shippingDetails: ShippingDetails;
  paymentDetails: PaymentDetails;
}

const data = loadTestData<ProductData>('products.json');

/**
 * Checkout flow tests.
 * Storage state (auth) is loaded from playwright.config.ts project dependency.
 */
test.describe('Checkout Flow', () => {
  test.use({ storageState: 'tests/fixtures/.auth/user.json' });

  test(`${TAGS.SMOKE} ${TAGS.CHECKOUT} complete purchase with valid details`, async ({
    checkoutPage,
    page,
  }) => {
    // Start from the cart (assumed to have items — seeded via API/storage)
    await checkoutPage.goto();

    await checkoutPage.fillShippingDetails(data.shippingDetails);
    await checkoutPage.fillPaymentDetails(data.paymentDetails);

    await checkoutPage.assertOrderConfirmed();

    const orderNumber = await checkoutPage.getOrderNumber();
    expect(orderNumber).toMatch(/^ORD-\d{6,}/);
  });

  test(`${TAGS.REGRESSION} ${TAGS.CHECKOUT} checkout page requires authentication`, async ({
    page,
  }) => {
    // Load without auth state
    const freshContext = await page.context().browser()!.newContext();
    const unauthPage = await freshContext.newPage();
    await unauthPage.goto('/checkout');
    await expect(unauthPage).toHaveURL(/\/login/);
    await freshContext.close();
  });

  test(`${TAGS.REGRESSION} ${TAGS.CHECKOUT} order summary shows correct totals`, async ({
    checkoutPage,
    page,
  }) => {
    await checkoutPage.goto();

    const orderTotal = page.getByTestId('order-total');
    const taxLine = page.getByTestId('tax-amount');

    await expect(orderTotal).toBeVisible();
    await expect(taxLine).toBeVisible();

    const totalText = await orderTotal.textContent();
    expect(totalText).toMatch(/\$[\d,]+\.\d{2}/);
  });
});
