import { test, expect } from '@playwright/test';
import { label, severity, step } from 'allure-js-commons';
import { getProducts, getProductById } from '../../helpers/apiClient';
import { ProductListSchema, ProductSchema } from '../../helpers/schemas';
import { TEST_PRODUCTS } from '../../helpers/testData';

test.describe('Products API', () => {

  test('POST /entries — получение списка товаров', async ({ request }) => {
    await label('layer', 'api');
    await severity('critical');

    const { status, body } = await step('Запрашиваем список товаров', async () => {
      return await getProducts(request);
    });

    await step('Проверяем статус ответа', async () => {
      expect(status).toBe(200);
    });

    await step('Валидируем схему ответа через Zod', async () => {
      const result = ProductListSchema.safeParse(body);
      expect(result.success, `Схема не валидна: ${!result.success ? JSON.stringify(result.error.issues) : ''}`).toBe(true);
    });

    await step('Проверяем что список не пустой', async () => {
      expect(body.Items.length).toBeGreaterThan(0);
    });
  });

  test('POST /entries — каждый товар содержит обязательные поля', async ({ request }) => {
    await label('layer', 'api');
    await severity('normal');

    const { body } = await step('Запрашиваем список товаров', async () => {
      return await getProducts(request);
    });

    await step('Валидируем схему каждого товара через Zod', async () => {
      for (const item of body.Items) {
        const result = ProductSchema.safeParse(item);
        expect(result.success, `Товар id=${item.id} не прошёл валидацию: ${!result.success ? JSON.stringify(result.error.issues) : ''}`).toBe(true);
      }
    });
  });

  test('POST /view — получение товара по id', async ({ request }) => {
    await label('layer', 'api');
    await severity('critical');

    const { status, body } = await step('Запрашиваем товар по id', async () => {
      return await getProductById(request, TEST_PRODUCTS.SAMSUNG_GALAXY_S6);
    });

    await step('Проверяем статус ответа', async () => {
      expect(status).toBe(200);
    });

    await step('Валидируем схему товара через Zod', async () => {
      const result = ProductSchema.safeParse(body);
      expect(result.success, `Схема не валидна: ${!result.success ? JSON.stringify(result.error.issues) : ''}`).toBe(true);
    });
  });

  test('POST /view — товар Samsung Galaxy S6 содержит корректные данные', async ({ request }) => {
    await label('layer', 'api');
    await severity('normal');

    const { body } = await step('Запрашиваем товар Samsung Galaxy S6', async () => {
      return await getProductById(request, TEST_PRODUCTS.SAMSUNG_GALAXY_S6);
    });

    await step('Проверяем данные товара', async () => {
      expect(body.title).toContain('Samsung');
      expect(typeof body.price).toBe('number');
      expect(body.price).toBeGreaterThan(0);
    });
  });

  test('POST /view — несуществующий id возвращает null', async ({ request }) => {
    await label('layer', 'api');
    await severity('minor');

    const { status, body } = await step('Запрашиваем несуществующий товар', async () => {
      return await getProductById(request, 99999);
    });

    await step('Проверяем ответ', async () => {
      expect(status).toBe(200);
      expect(body).toBeNull();
    });
  });
});
