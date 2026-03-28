import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logStep } from '../utils/logger';

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * LoginPage — covers the /login route.
 */
export class LoginPage extends BasePage {
  // ─── Locators ─────────────────────────────────────────────────────────────
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly rememberMeCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel('Email address');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.rememberMeCheckbox = page.getByLabel('Remember me');
  }

  // ─── Actions ──────────────────────────────────────────────────────────────

  async goto(): Promise<void> {
    await this.navigate('/login');
    await this.assertUrl(/\/login/);
  }

  async login(credentials: LoginCredentials): Promise<void> {
    logStep(`Login as ${credentials.email}`);
    await this.fill(this.emailInput, credentials.email, 'Email');
    await this.fill(this.passwordInput, credentials.password, 'Password');
    await this.click(this.submitButton, 'Sign in');
  }

  async loginAndWaitForDashboard(credentials: LoginCredentials): Promise<void> {
    await this.login(credentials);
    await this.waitForUrl(/\/dashboard/);
  }

  async clickForgotPassword(): Promise<void> {
    await this.click(this.forgotPasswordLink, 'Forgot password');
  }

  async toggleRememberMe(): Promise<void> {
    await this.check(this.rememberMeCheckbox, 'Remember me');
  }

  // ─── Assertions ───────────────────────────────────────────────────────────

  async assertLoginError(expectedMessage: string): Promise<void> {
    await this.assertVisible(this.errorMessage, 'Error message');
    await this.assertContainsText(this.errorMessage, expectedMessage);
  }

  async assertOnLoginPage(): Promise<void> {
    await this.assertUrl(/\/login/);
    await this.assertVisible(this.submitButton, 'Sign in button');
  }
}
