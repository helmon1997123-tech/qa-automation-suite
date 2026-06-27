import { Page, Locator, expect } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator('.name');
    this.productPrice = page.locator('.price-container');
    this.addToCartButton = page.locator('a[onclick="addToCart(1)"], .btn-success');
  }

  async addToCart() {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.addToCartButton.click();
    await this.page.waitForTimeout(1000);
  }

  async expectProductLoaded(name: string) {
    await expect(this.productName).toContainText(name, { timeout: 10000 });
  }
}