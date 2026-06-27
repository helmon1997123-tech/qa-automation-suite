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

  test('E2E: логин, выбор товара, корзина, оформление заказа', async ({ page }) => {
    await label('layer', 'e2e');
    await severity('blocker');

    await step('Авторизуемся в системе', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(username, password);
      await loginPage.expectLoggedIn(username);
    });

    await step('Выбираем товар из каталога', async () => {
      const catalogPage = new CatalogPage(page);
      await catalogPage.filterByCategory('phones');
      await catalogPage.openProduct('Samsung galaxy s6');
    });

    await step('Добавляем товар в корзину', async () => {
      const productPage = new ProductPage(page);
      await productPage.expectProductLoaded('Samsung galaxy s6');
      await productPage.addToCart();
    });

    await step('Переходим в корзину', async () => {
      const catalogPage = new CatalogPage(page);
      await catalogPage.goToCart();
    });

    await step('Оформляем заказ', async () => {
      const cartPage = new CartPage(page);
      await cartPage.expectCartNotEmpty();
      await cartPage.placeOrder(ORDER_DATA);
      await cartPage.expectOrderSuccess();
    });
  });
});