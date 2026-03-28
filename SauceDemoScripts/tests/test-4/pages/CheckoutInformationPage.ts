import { type Page, type Locator } from '@playwright/test';

export class CheckoutInformationPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    // First Name input — uncomment the line that matches your app's DOM:
    // this.firstNameInput = page.getByRole('textbox', { name: 'First Name' }); // role
    // this.firstNameInput = page.getByLabel('First Name');                      // label
    // this.firstNameInput = page.getByPlaceholder('First Name');                // placeholder
    // this.firstNameInput = page.locator('[name="firstName"]');                // name attribute
    // this.firstNameInput = page.locator('#first-name');                        // id attribute
    this.firstNameInput = page.locator('[data-test="firstName"]');              // ← active (best guess — verify in DevTools)

    // Last Name input — uncomment the line that matches your app's DOM:
    // this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });   // role
    // this.lastNameInput = page.getByLabel('Last Name');                        // label
    // this.lastNameInput = page.getByPlaceholder('Last Name');                  // placeholder
    // this.lastNameInput = page.locator('[name="lastName"]');                  // name attribute
    // this.lastNameInput = page.locator('#last-name');                          // id attribute
    this.lastNameInput = page.locator('[data-test="lastName"]');                // ← active (best guess — verify in DevTools)

    // Postal Code input — uncomment the line that matches your app's DOM:
    // this.postalCodeInput = page.getByRole('textbox', { name: 'Postal Code' }); // role
    // this.postalCodeInput = page.getByLabel('Postal Code');                      // label
    // this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');            // placeholder
    // this.postalCodeInput = page.locator('[name="postalCode"]');                // name attribute
    // this.postalCodeInput = page.locator('#postal-code');                        // id attribute
    this.postalCodeInput = page.locator('[data-test="postalCode"]');             // ← active (best guess — verify in DevTools)

    // Continue button — uncomment the line that matches your app's DOM:
    // this.continueButton = page.getByRole('button', { name: 'Continue' });   // role (preferred)
    // this.continueButton = page.getByText('Continue');                        // visible text
    // this.continueButton = page.locator('[name="continue"]');                // name attribute
    // this.continueButton = page.locator('[type="submit"]');                  // type attribute
    // this.continueButton = page.locator('.submit-button');                    // CSS class
    this.continueButton = page.locator('[data-test="continue"]');              // ← active (best guess — verify in DevTools)

    // Page title — uncomment the line that matches your app's DOM:
    // this.pageTitle = page.getByRole('heading', { name: 'Checkout: Your Information' }); // role
    // this.pageTitle = page.locator('.title');                                              // CSS class
    // this.pageTitle = page.getByTestId('title');                                           // data-testid
    this.pageTitle = page.locator('.title');                                                // ← active (best guess — verify in DevTools)
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async fillPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }

  // ── Convenience method (REQUIRED) ───────────────────────────────────────────
  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
    await this.clickContinue();
  }
}
