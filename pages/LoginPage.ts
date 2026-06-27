import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly navLoginLink: Locator;
  readonly welcomeUser: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navLoginLink = page.locator('#login2');
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.loginButton = page.locator('button[onclick="logIn()"]');
    this.welcomeUser = page.locator('#nameofuser');
  }

  async goto() {
    await this.page.goto('/');
  }

  async openLoginModal() {
    await this.navLoginLink.click();
    await expect(this.usernameInput).toBeVisible({ timeout: 5000 });
  }

  async login(username: string, password: string) {
    await this.openLoginModal();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoggedIn(username: string) {
    await expect(this.welcomeUser).toContainText(`Welcome ${username}`, { timeout: 10000 });
  }
}
