import { test, expect } from '@playwright/test';
import { label, severity, step } from 'allure-js-commons';
import { loginApi, signupApi } from '../../helpers/apiClient';
import { generateUsername, generatePassword } from '../../helpers/testData';

test.describe('Auth API', () => {

  test('POST /signup — успешная регистрация нового пользователя', async ({ request }) => {
    await label('layer', 'api');
    await severity('critical');

    const username = generateUsername();
    const password = generatePassword();

    const { status, body } = await step('Регистрируем нового пользователя', async () => {
      return await signupApi(request, username, password);
    });

    await step('Проверяем успешный ответ', async () => {
      expect(status).toBe(200);
      expect(body).not.toHaveProperty('errorMessage');
    });
  });

  test('POST /signup — регистрация с уже существующим username', async ({ request }) => {
    await label('layer', 'api');
    await severity('normal');

    const username = generateUsername();
    const password = generatePassword();

    await step('Регистрируем пользователя первый раз', async () => {
      await signupApi(request, username, password);
    });

    const { body } = await step('Пытаемся зарегистрировать того же пользователя повторно', async () => {
      return await signupApi(request, username, password);
    });

    await step('Проверяем ошибку дублирования', async () => {
      expect(body).toHaveProperty('errorMessage');
      expect(body.errorMessage).toContain('already exist');
    });
  });

  test('POST /login — успешный логин', async ({ request }) => {
    await label('layer', 'api');
    await severity('critical');

    const username = generateUsername();
    const password = generatePassword();

    await step('Предварительно регистрируем пользователя', async () => {
      await signupApi(request, username, password);
    });

    const { status, body } = await step('Выполняем логин', async () => {
      return await loginApi(request, username, password);
    });

    await step('Проверяем успешный ответ с токеном', async () => {
      expect(status).toBe(200);
      expect(typeof body).toBe('string');
      expect(body.length).toBeGreaterThan(0);
    });
  });

  test('POST /login — неверный пароль', async ({ request }) => {
    await label('layer', 'api');
    await severity('normal');

    const username = generateUsername();
    const password = generatePassword();

    await step('Регистрируем пользователя', async () => {
      await signupApi(request, username, password);
    });

    const { body } = await step('Логинимся с неверным паролем', async () => {
      return await loginApi(request, username, 'wrongpassword');
    });

    await step('Проверяем ошибку авторизации', async () => {
      expect(body).toHaveProperty('errorMessage');
    });
  });

  test('POST /login — несуществующий пользователь', async ({ request }) => {
    await label('layer', 'api');
    await severity('minor');

    const { body } = await step('Логинимся под несуществующим пользователем', async () => {
      return await loginApi(request, 'nonexistent_user_xyz', 'password123');
    });

    await step('Проверяем ошибку', async () => {
      expect(body).toHaveProperty('errorMessage');
    });
  });
});
