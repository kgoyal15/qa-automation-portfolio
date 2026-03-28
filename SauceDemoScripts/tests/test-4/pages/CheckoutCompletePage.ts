import { type Page, type Locator } from '@playwright/test';

export class CheckoutCompletePage {
  readonly confirmationHeader: Locator;
  readonly pageTitle: Locator;

  constructor(private readonly page: Page) {
    // Confirmation header message — uncomment the line that matches your app's DOM:
    // this.confirmationHeader = page.getByRole('heading', { name: 'Thank you for your order!' }); // role
    // this.confirmationHeader = page.getByTestId('complete-header');                               // data-testid
    // this.confirmationHeader = page.getByText('Thank you for your order!');                       // visible text
    // this.confirmationHeader = page.locator('.complete-header');                                   // CSS class
    this.confirmationHeader = page.locator('.complete-header');                                     // ← active (best guess — verify in DevTools)

    // Page title — uncomment the line that matches your app's DOM:
    // this.pageTitle = page.getByRole('heading', { name: 'Checkout: Complete!' }); // role
    // this.pageTitle = page.getByTestId('title');                                   // data-testid
    // this.pageTitle = page.locator('.title');                                       // CSS class
    this.pageTitle = page.locator('.title');                                         // ← active (best guess — verify in DevTools)
  }
}
