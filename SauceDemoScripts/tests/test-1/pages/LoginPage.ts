import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    // Username input — uncomment the line that matches your app's DOM:
    // this.usernameInput = page.getByRole('textbox', { name: 'Username' }); // role (preferred)
    // this.usernameInput = page.getByTestId('user-name');                    // data-testid
    // this.usernameInput = page.getByLabel('Username');                      // label / aria-label
    // this.usernameInput = page.getByPlaceholder('Username');                // placeholder
    // this.usernameInput = page.locator('[name="user-name"]');              // name attribute
    this.usernameInput = page.locator('[id="user-name"]');                   // ← active (best guess — verify in DevTools)

    // Password input — uncomment the line that matches your app's DOM:
    // this.passwordInput = page.getByRole('textbox', { name: 'Password' }); // role
    // this.passwordInput = page.getByTestId('password');                     // data-testid
    // this.passwordInput = page.getByLabel('Password');                      // label / aria-label
    // this.passwordInput = page.getByPlaceholder('Password');                // placeholder
    // this.passwordInput = page.locator('[name="password"]');               // name attribute
    this.passwordInput = page.locator('[id="password"]');                    // ← active (best guess — verify in DevTools)

    // Login button — uncomment the line that matches your app's DOM:
    // this.loginButton = page.getByRole('button', { name: 'Login' });       // role (preferred)
    // this.loginButton = page.getByText('Login');                            // visible text
    // this.loginButton = page.locator('[name="login-button"]');             // name attribute
    // this.loginButton = page.locator('[type="submit"]');                   // type attribute
    this.loginButton = page.locator('[id="login-button"]');                  // ← active (best guess — verify in DevTools)
  }

  async goto(): Promise<void> {
    await this.page.goto('https://www.saucedemo.com/');
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible' });
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.waitFor({ state: 'visible' });
    await this.passwordInput.fill(password);
  }

  async submitLogin(): Promise<void> {
    await this.loginButton.waitFor({ state: 'visible' });
    await this.loginButton.click();
  }

  // ── Convenience method (REQUIRED) ───────────────────────────────────────────
  // Combines granular steps into one call — specs MUST use this, not the individual steps.
  async login(username: string, password: string): Promise<void> {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.submitLogin();
  }
}
