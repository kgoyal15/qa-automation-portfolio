import { test, expect } from '../../fixtures/baseFixtures';
import { loadTestData } from '../../../utils/fileHelpers';
import { TAGS } from '../../../constants/testTags';

interface UserData {
  validUser: { email: string; password: string };
  invalidUsers: Array<{ email: string; password: string; expectedError: string }>;
  lockedUser: { email: string; password: string; expectedError: string };
}

const users = loadTestData<UserData>('users.json');

test.describe('Login — Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test(`${TAGS.SMOKE} ${TAGS.AUTH} successful login with valid credentials`, async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.loginAndWaitForDashboard({
      email: users.validUser.email,
      password: users.validUser.password,
    });
    await dashboardPage.assertDashboardLoaded();
  });

  test(`${TAGS.REGRESSION} login page elements are visible`, async ({ loginPage }) => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await loginPage.assertTitle(/Sign in/i);
  });

  for (const invalidUser of users.invalidUsers) {
    test(`${TAGS.REGRESSION} shows error for invalid credentials: "${invalidUser.email}"`, async ({
      loginPage,
    }) => {
      await loginPage.login({
        email: invalidUser.email,
        password: invalidUser.password,
      });
      await loginPage.assertLoginError(invalidUser.expectedError);
    });
  }

  test(`${TAGS.REGRESSION} locked account shows appropriate error`, async ({ loginPage }) => {
    await loginPage.login({
      email: users.lockedUser.email,
      password: users.lockedUser.password,
    });
    await loginPage.assertLoginError(users.lockedUser.expectedError);
  });

  test(`${TAGS.REGRESSION} forgot password link navigates correctly`, async ({
    loginPage,
    page,
  }) => {
    await loginPage.clickForgotPassword();
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test(`${TAGS.REGRESSION} logout clears session and redirects to login`, async ({
    loginPage,
    dashboardPage,
  }) => {
    await loginPage.loginAndWaitForDashboard({
      email: users.validUser.email,
      password: users.validUser.password,
    });
    await dashboardPage.logout();
    await loginPage.assertOnLoginPage();
  });
});
