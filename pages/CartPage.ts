import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly placeOrderButton: Locator;
  readonly totalPrice: Locator;
  readonly deleteButtons: Locator;

  // Order modal
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly cardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly purchaseButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('#tbodyid tr');
    this.placeOrderButton = page.locator('button[data-target="#orderModal"]');
    this.totalPrice = page.locator('#totalp');
    this.deleteButtons = page.locator('a[onclick*="deleteItem"]');

    this.nameInput = page.locator('#name');
    this.countryInput = page.locator('#country');
    this.cityInput = page.locator('#city');
    this.cardInput = page.locator('#card');
    this.monthInput = page.locator('#month');
    this.yearInput = page.locator('#year');
    this.purchaseButton = page.locator('button[onclick="purchaseOrder()"]');
    this.successMessage = page.locator('.sweet-alert h2');
  }

  async expectCartNotEmpty() {
    await expect(this.cartItems.first()).toBeVisible({ timeout: 10000 });
  }

  async placeOrder(data: {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
  }) {
    await this.placeOrderButton.click();
    await expect(this.nameInput).toBeVisible({ timeout: 5000 });

    await this.nameInput.fill(data.name);
    await this.countryInput.fill(data.country);
    await this.cityInput.fill(data.city);
    await this.cardInput.fill(data.card);
    await this.monthInput.fill(data.month);
    await this.yearInput.fill(data.year);

    await this.purchaseButton.click();
  }

  async expectOrderSuccess() {
    await expect(this.successMessage).toContainText('Thank you', { timeout: 10000 });
  }
}
