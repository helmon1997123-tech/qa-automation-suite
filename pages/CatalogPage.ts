import { Page, Locator, expect } from '@playwright/test';

export class CatalogPage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly cartLink: Locator;
  readonly categoryPhones: Locator;
  readonly categoryLaptops: Locator;
  readonly categoryMonitors: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator('.card-title a');
    this.cartLink = page.locator('#cartur');
    this.categoryPhones = page.locator('a[onclick="byCat(\'phone\')"]');
    this.categoryLaptops = page.locator('a[onclick="byCat(\'notebook\')"]');
    this.categoryMonitors = page.locator('a[onclick="byCat(\'monitor\')"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async filterByCategory(category: 'phones' | 'laptops' | 'monitors') {
    const map = {
      phones: this.categoryPhones,
      laptops: this.categoryLaptops,
      monitors: this.categoryMonitors,
    };
    await map[category].click();
    await this.page.waitForTimeout(1500);
  }

  async openProduct(name: string) {
    await this.page.locator('.card-title a', { hasText: name }).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async expectProductsVisible() {
    await expect(this.productCards.first()).toBeVisible({ timeout: 10000 });
  }

  async goToCart() {
    await this.cartLink.click();
    await this.page.waitForLoadState('networkidle');
  }
}
