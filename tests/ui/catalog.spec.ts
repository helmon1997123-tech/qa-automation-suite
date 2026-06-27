import { test, expect } from '@playwright/test';
import { label, severity, step } from 'allure-js-commons';
import { CatalogPage } from '../../pages/CatalogPage';

test.describe('UI — Каталог товаров', () => {

  test('Главная страница загружается и показывает товары', async ({ page }) => {
    await label('layer', 'ui');
    await severity('critical');

    const catalogPage = new CatalogPage(page);

    await step('Открываем главную страницу', async () => {
      await catalogPage.goto();
    });

    await step('Проверяем что товары отображаются', async () => {
      await catalogPage.expectProductsVisible();
    });
  });

  test('Фильтр по категории Phones', async ({ page }) => {
    await label('layer', 'ui');
    await severity('normal');

    const catalogPage = new CatalogPage(page);

    await step('Открываем главную страницу', async () => {
      await catalogPage.goto();
      await catalogPage.expectProductsVisible();
    });

    await step('Фильтруем по категории Phones', async () => {
      await catalogPage.filterByCategory('phones');
      await catalogPage.expectProductsVisible();
    });
  });

  test('Фильтр по категории Laptops', async ({ page }) => {
    await label('layer', 'ui');
    await severity('normal');

    const catalogPage = new CatalogPage(page);

    await step('Открываем главную страницу', async () => {
      await catalogPage.goto();
      await catalogPage.expectProductsVisible();
    });

    await step('Фильтруем по категории Laptops', async () => {
      await catalogPage.filterByCategory('laptops');
      await catalogPage.expectProductsVisible();
    });
  });

  test('Фильтр по категории Monitors', async ({ page }) => {
    await label('layer', 'ui');
    await severity('normal');

    const catalogPage = new CatalogPage(page);

    await step('Открываем главную страницу', async () => {
      await catalogPage.goto();
      await catalogPage.expectProductsVisible();
    });

    await step('Фильтруем по категории Monitors', async () => {
      await catalogPage.filterByCategory('monitors');
      await catalogPage.expectProductsVisible();
    });
  });

  test('Открытие карточки товара', async ({ page }) => {
    await label('layer', 'ui');
    await severity('normal');

    const catalogPage = new CatalogPage(page);

    await step('Открываем главную страницу и фильтруем по Phones', async () => {
      await catalogPage.goto();
      await catalogPage.expectProductsVisible();
      await catalogPage.filterByCategory('phones');
    });

    await step('Открываем карточку Samsung galaxy s6', async () => {
      await catalogPage.openProduct('Samsung galaxy s6');
      await expect(page.locator('.name')).toBeVisible({ timeout: 10000 });
    });
  });
});
