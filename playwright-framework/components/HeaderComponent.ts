import { Page, Locator } from '@playwright/test';
import { BasePage } from '../pages/BasePage';

/**
 * HeaderComponent — shared site header present on all authenticated pages.
 */
export class HeaderComponent extends BasePage {
  readonly logo: Locator;
  readonly searchInput: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly userAvatar: Locator;
  readonly mainNav: Locator;

  constructor(page: Page) {
    super(page);
    this.logo = page.getByTestId('site-logo');
    this.searchInput = page.getByRole('searchbox', { name: 'Search' });
    this.cartIcon = page.getByTestId('cart-icon');
    this.cartBadge = page.getByTestId('cart-badge');
    this.userAvatar = page.getByTestId('user-avatar');
    this.mainNav = page.getByRole('navigation', { name: 'Main' });
  }

  async search(query: string): Promise<void> {
    await this.fill(this.searchInput, query, 'Search box');
    await this.pressKey('Enter');
  }

  async openCart(): Promise<void> {
    await this.click(this.cartIcon, 'Cart icon');
  }

  async getCartItemCount(): Promise<number> {
    const text = await this.getText(this.cartBadge);
    return parseInt(text, 10) || 0;
  }

  async clickLogo(): Promise<void> {
    await this.click(this.logo, 'Logo');
  }

  async assertCartCount(expected: number): Promise<void> {
    await this.assertText(this.cartBadge, String(expected));
  }
}
