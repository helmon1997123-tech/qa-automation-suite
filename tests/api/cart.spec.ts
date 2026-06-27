import { test, expect } from '@playwright/test';
import { label, severity, step } from 'allure-js-commons';
import { loginApi, signupApi, addToCart, getCart } from '../../helpers/apiClient';
import { CartSchema } from '../../helpers/schemas';
import { generateUsername, generatePassword, TEST_PRODUCTS } from '../../helpers/testData';

test.describe('Cart API', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const username = generateUsername();
    const password = generatePassword();
    await signupApi(request, username, password);
    const { body } = await loginApi(request, username, password);
    token = body;
  });

  // Happy path
  test('POST /addtocart — добавление товара в корзину', async ({ request }) => {
    await label('layer', 'api');
    await severity('critical');

    const { status } = await step('Добавляем Samsung Galaxy S6 в корзину', async () => {
      return await addToCart(request, token, TEST_PRODUCTS.SAMSUNG_GALAXY_S6);
    });

    await step('Проверяем успешный ответ', async () => {
      expect(status).toBe(200);
    });
  });

  test('POST /viewcart — просмотр корзины', async ({ request }) => {
    await label('layer', 'api');
    await severity('critical');

    await step('Добавляем товар в корзину', async () => {
      await addToCart(request, token, TEST_PRODUCTS.NOKIA_LUMIA);
    });

    const { status, body } = await step('Запрашиваем содержимое корзины', async () => {
      return await getCart(request, token);
    });

    await step('Проверяем статус ответа', async () => {
      expect(status).toBe(200);
    });

    await step('Валидируем схему корзины через Zod', async () => {
      const result = CartSchema.safeParse(body);
      expect(result.success, `Схема не валидна: ${!result.success ? JSON.stringify(result.error.issues) : ''}`).toBe(true);
    });

    await step('Проверяем наличие товаров', async () => {
      expect(body).toHaveProperty('Items');
    });
  });

  test('POST /addtocart — добавление нескольких товаров', async ({ request }) => {
    await label('layer', 'api');
    await severity('normal');

    const { status: s1 } = await step('Добавляем Nexus 6', async () => {
      return await addToCart(request, token, TEST_PRODUCTS.NEXUS_6);
    });

    const { status: s2 } = await step('Добавляем iPhone 6', async () => {
      return await addToCart(request, token, TEST_PRODUCTS.IPHONE_6_32GB);
    });

    await step('Проверяем успешные ответы', async () => {
      expect(s1).toBe(200);
      expect(s2).toBe(200);
    });
  });

  // Negative tests
  test('POST /viewcart — корзина без токена возвращает пустой результат', async ({ request }) => {
    await label('layer', 'api');
    await severity('normal');

    const { status, body } = await step('Запрашиваем корзину без токена', async () => {
      return await getCart(request, '');
    });

    await step('Проверяем пустой ответ', async () => {
      expect(status).toBe(200);
      expect(body.Items).toBeFalsy();
    });
  });

  test('POST /addtocart — добавление несуществующего товара', async ({ request }) => {
    await label('layer', 'api');
    await severity('minor');

    const { status } = await step('Добавляем товар с несуществующим id', async () => {
      return await addToCart(request, token, 99999);
    });

    await step('Проверяем что API принимает запрос', async () => {
      expect(status).toBe(200);
    });
  });

  test('POST /viewcart — невалидный токен возвращает пустую корзину', async ({ request }) => {
    await label('layer', 'api');
    await severity('minor');

    const { status, body } = await step('Запрашиваем корзину с невалидным токеном', async () => {
      return await getCart(request, 'invalid_token_xyz');
    });

    await step('Проверяем пустой ответ', async () => {
      expect(status).toBe(200);
      expect(body.Items).toBeFalsy();
    });
  });
});
