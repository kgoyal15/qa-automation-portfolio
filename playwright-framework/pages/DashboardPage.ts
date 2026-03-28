import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logStep } from '../utils/logger';

/**
 * DashboardPage — the landing page after a successful login.
 */
export class DashboardPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────
  readonly welcomeHeading: Locator;
  readonly userMenuButton: Locator;
  readonly logoutMenuItem: Locator;
  readonly navigationMenu: Locator;
  readonly notificationBell: Locator;
  readonly statsCard: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = page.getByRole('heading', { name: /welcome/i });
    this.userMenuButton = page.getByTestId('user-menu-button');
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
    this.navigationMenu = page.getByRole('navigation', { name: 'Main' });
    this.notificationBell = page.getByTestId('notification-bell');
    this.statsCard = page.getByTestId('stats-card');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async logout(): Promise<void> {
    logStep('Logout via user menu');
    await this.click(this.userMenuButton, 'User menu');
    await this.click(this.logoutMenuItem, 'Logout');
    await this.waitForUrl(/\/login/);
  }

  async openNotifications(): Promise<void> {
    await this.click(this.notificationBell, 'Notification bell');
  }

  async navigateTo(section: string): Promise<void> {
    logStep(`Navigate to section: ${section}`);
    await this.click(this.navigationMenu.getByRole('link', { name: section }), section);
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertDashboardLoaded(): Promise<void> {
    await this.assertVisible(this.welcomeHeading, 'Welcome heading');
    await this.assertUrl(/\/dashboard/);
  }

  async assertStatsVisible(count: number): Promise<void> {
    await this.assertCount(this.statsCard, count);
  }
}
