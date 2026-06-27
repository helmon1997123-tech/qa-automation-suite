import { Page, Locator, expect } from '@playwright/test';

export class SignupPage {
    readonly page: Page;
    readonly navSignupLink: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly signupButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.navSignupLink = page.locator('#signin2');
        this.usernameInput = page.locator('#sign-username');
        this.passwordInput = page.locator('#sign-password');
        this.signupButton = page.locator('button[onclick="register()"]');
    }

    async goto() {
        await this.page.goto('/');
    }

    async openSignupModal() {
        await this.navSignupLink.click();
        await expect(this.usernameInput).toBeVisible({ timeout: 5000 });
    }

    async signup(username: string, password: string) {
        await this.openSignupModal();
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.signupButton.click();
    }
}