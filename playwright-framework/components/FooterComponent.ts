import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

/**
 * FooterComponent — site footer with links and legal text.
 */
export class FooterComponent extends BasePage {
  readonly footer: Locator;
  readonly privacyLink: Locator;
  readonly termsLink: Locator;
  readonly cookiesLink: Locator;
  readonly copyrightText: Locator;

  constructor(page: Page) {
    super(page);
    this.footer = page.getByRole('contentinfo');
    this.privacyLink = this.footer.getByRole('link', { name: 'Privacy Policy' });
    this.termsLink = this.footer.getByRole('link', { name: 'Terms of Service' });
    this.cookiesLink = this.footer.getByRole('link', { name: 'Cookie Policy' });
    this.copyrightText = this.footer.getByTestId('copyright');
  }

  async navigateToPrivacyPolicy(): Promise<void> {
    await this.click(this.privacyLink, 'Privacy Policy');
  }

  async assertFooterVisible(): Promise<void> {
    await this.assertVisible(this.footer, 'Footer');
  }

  async assertCopyrightYear(year: number): Promise<void> {
    await this.assertContainsText(this.copyrightText, String(year));
  }
}
