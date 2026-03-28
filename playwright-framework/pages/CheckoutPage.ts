import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logStep } from '../utils/logger';

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

/**
 * CheckoutPage — multi-step checkout flow.
 */
export class CheckoutPage extends BasePage {
  // ─── Shipping locators ────────────────────────────────────────────────────
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateSelect: Locator;
  readonly zipInput: Locator;
  readonly countrySelect: Locator;
  readonly continueToPaymentButton: Locator;

  // ─── Payment locators ─────────────────────────────────────────────────────
  readonly cardNumberInput: Locator;
  readonly expiryInput: Locator;
  readonly cvvInput: Locator;
  readonly nameOnCardInput: Locator;
  readonly placeOrderButton: Locator;

  // ─── Confirmation locators ────────────────────────────────────────────────
  readonly orderConfirmationHeading: Locator;
  readonly orderNumberText: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByLabel('First name');
    this.lastNameInput = page.getByLabel('Last name');
    this.addressInput = page.getByLabel('Street address');
    this.cityInput = page.getByLabel('City');
    this.stateSelect = page.getByLabel('State');
    this.zipInput = page.getByLabel('ZIP / Postal code');
    this.countrySelect = page.getByLabel('Country');
    this.continueToPaymentButton = page.getByRole('button', { name: 'Continue to payment' });

    this.cardNumberInput = page.getByLabel('Card number');
    this.expiryInput = page.getByLabel('Expiration date');
    this.cvvInput = page.getByLabel('CVV');
    this.nameOnCardInput = page.getByLabel('Name on card');
    this.placeOrderButton = page.getByRole('button', { name: 'Place order' });

    this.orderConfirmationHeading = page.getByRole('heading', { name: /order confirmed/i });
    this.orderNumberText = page.getByTestId('order-number');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/checkout');
  }

  async fillShippingDetails(details: ShippingDetails): Promise<void> {
    logStep('Fill shipping details');
    await this.fill(this.firstNameInput, details.firstName, 'First name');
    await this.fill(this.lastNameInput, details.lastName, 'Last name');
    await this.fill(this.addressInput, details.address, 'Address');
    await this.fill(this.cityInput, details.city, 'City');
    await this.selectOption(this.stateSelect, details.state, 'State');
    await this.fill(this.zipInput, details.zip, 'ZIP');
    await this.selectOption(this.countrySelect, details.country, 'Country');
    await this.click(this.continueToPaymentButton, 'Continue to payment');
  }

  async fillPaymentDetails(payment: PaymentDetails): Promise<void> {
    logStep('Fill payment details');
    await this.fill(this.cardNumberInput, payment.cardNumber, 'Card number');
    await this.fill(this.expiryInput, payment.expiryDate, 'Expiry');
    await this.fill(this.cvvInput, payment.cvv, 'CVV');
    await this.fill(this.nameOnCardInput, payment.nameOnCard, 'Name on card');
    await this.click(this.placeOrderButton, 'Place order');
  }

  async getOrderNumber(): Promise<string> {
    return this.getText(this.orderNumberText);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertOrderConfirmed(): Promise<void> {
    await this.assertVisible(this.orderConfirmationHeading, 'Order confirmed heading');
    await this.assertUrl(/\/order-confirmation/);
  }
}
