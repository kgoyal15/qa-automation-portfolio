import { type Page, type Locator } from '@playwright/test';

export class CheckoutStepOnePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  constructor(private readonly page: Page) {
    // First name input — uncomment the line that matches your app's DOM:
    // this.firstNameInput = page.getByLabel('First Name');                   // label
    // this.firstNameInput = page.getByPlaceholder('First Name');             // placeholder
    // this.firstNameInput = page.getByTestId('firstName');                   // data-testid
    this.firstNameInput = page.locator('[id="first-name"]');                  // ← active (best guess — verify in DevTools)

    // Last name input — uncomment the line that matches your app's DOM:
    // this.lastNameInput = page.getByLabel('Last Name');                     // label
    // this.lastNameInput = page.getByPlaceholder('Last Name');               // placeholder
    // this.lastNameInput = page.getByTestId('lastName');                     // data-testid
    this.lastNameInput = page.locator('[id="last-name"]');                    // ← active (best guess — verify in DevTools)

    // Postal code input — uncomment the line that matches your app's DOM:
    // this.postalCodeInput = page.getByLabel('Zip/Postal Code');             // label
    // this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');       // placeholder
    // this.postalCodeInput = page.getByTestId('postalCode');                 // data-testid
    this.postalCodeInput = page.locator('[id="postal-code"]');                // ← active (best guess — verify in DevTools)

    // Continue button — uncomment the line that matches your app's DOM:
    // this.continueButton = page.getByRole('button', { name: 'Continue' }); // role
    // this.continueButton = page.getByTestId('continue-button');             // data-testid
    // this.continueButton = page.locator('[type="submit"]');                // type attribute
    this.continueButton = page.locator('[id="continue"]');                    // ← active (best guess — verify in DevTools)
  }

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }
}
