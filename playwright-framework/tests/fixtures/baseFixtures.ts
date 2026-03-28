import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { HeaderComponent } from '../../components/HeaderComponent';
import { FooterComponent } from '../../components/FooterComponent';
import { ModalComponent } from '../../components/ModalComponent';
import { ApiClient } from '../../services/ApiClient';
import { UserService } from '../../services/UserService';
import { AuthService } from '../../services/AuthService';
import { getEnvironmentConfig } from '../../config/environmentConfig';
import { logger } from '../../utils/logger';

type PageObjects = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  checkoutPage: CheckoutPage;
  header: HeaderComponent;
  footer: FooterComponent;
  modal: ModalComponent;
};

type Services = {
  apiClient: ApiClient;
  userService: UserService;
  authService: AuthService;
};

type TestFixtures = PageObjects & Services;

const env = (process.env.TEST_ENV as 'dev' | 'qa' | 'prod') || 'qa';
const envConfig = getEnvironmentConfig(env);

/**
 * Extended test object — import `test` from this file instead of @playwright/test.
 *
 * Usage:
 *   import { test, expect } from '../fixtures/baseFixtures';
 */
export const test = base.extend<TestFixtures>({
  // ─── Page Objects ──────────────────────────────────────────────────────────
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  header: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },

  footer: async ({ page }, use) => {
    await use(new FooterComponent(page));
  },

  modal: async ({ page }, use) => {
    await use(new ModalComponent(page));
  },

  // ─── Services ──────────────────────────────────────────────────────────────
  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request, envConfig.apiBaseURL);
    await use(client);
  },

  userService: async ({ apiClient }, use) => {
    await use(new UserService(apiClient));
  },

  authService: async ({ apiClient }, use) => {
    await use(new AuthService(apiClient));
  },
});

export { expect } from '@playwright/test';

/**
 * Authenticated fixture — restores saved storage state so tests skip login.
 * The auth/user.json is populated by auth.setup.ts.
 */
export const authenticatedTest = test.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'tests/fixtures/.auth/user.json',
    });
    const page = await context.newPage();
    logger.info('Authenticated context loaded from storage state');
    await use(page);
    await context.close();
  },
});
