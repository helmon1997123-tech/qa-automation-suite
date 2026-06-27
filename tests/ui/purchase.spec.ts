import { test, expect } from '@playwright/test';
import { label, severity, step } from 'allure-js-commons';
import { LoginPage } from '../../pages/LoginPage';
import { CatalogPage } from '../../pages/CatalogPage';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';
import { signupApi } from '../../helpers/apiClient';
import { generateUsername, generatePassword, ORDER_DATA } from '../../helpers/testData';

test.describe('UI — Полный сценарий покупки', () => {
  let username: string;
  let password: string;

  test.beforeAll(async ({ request }) => {
    username = generateUsername();
    password = generatePassword();
    await signupApi(request, username, password);
  });

  test('E2E: логин → выбор товара → корзина → оформление заказа', async ({ page }) => {
    await label('layer', 'e2e');
    await severity('blocker');

    // 1. Логин
    await step('Авторизуемся в системе', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(username, password);
      await loginPage.expectLoggedIn(username);
    });

    // 2. Выбор товара
    await step('Выбираем товар из каталога', async () => {
      const catalogPage = new CatalogPage(page);
      await catalogPage.filterByCategory('phones');
      await catalogPage.openProduct('Samsung galaxy s6');
    });

    // 3. Добавление в корзину
    await step('Добавляем товар в корзину', async () => {
      const productPage = new ProductPage(page);
      await productPage.expectProductLoaded('Samsung galaxy s6');

      page.once('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Product added');
        await dialog.accept();
      });
      await productPage.addToCart();
    });

    // 4. Переход в корзину
    await step('Переходим в корзину', async () => {
      const catalogPage = new CatalogPage(page);
      await catalogPage.goToCart();
    });

    // 5. Оформление заказа
    await step('Оформляем заказ', async () => {
      const cartPage = new CartPage(page);
      await cartPage.expectCartNotEmpty();
      await cartPage.placeOrder(ORDER_DATA);
      await cartPage.expectOrderSuccess();
    });
  });
});
