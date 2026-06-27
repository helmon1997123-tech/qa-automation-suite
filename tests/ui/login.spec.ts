import { test, expect } from '@playwright/test';
import { label, severity, step } from 'allure-js-commons';
import { LoginPage } from '../../pages/LoginPage';
import { signupApi } from '../../helpers/apiClient';
import { generateUsername, generatePassword } from '../../helpers/testData';

test.describe('UI — Авторизация', () => {
  let username: string;
  let password: string;

  test.beforeAll(async ({ request }) => {
    username = generateUsername();
    password = generatePassword();
    await signupApi(request, username, password);
  });

  test('Успешный логин через UI', async ({ page }) => {
    await label('layer', 'ui');
    await severity('critical');

    await step('Открываем главную страницу', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
    });

    await step('Вводим корректные данные и логинимся', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.login(username, password);
    });

    await step('Проверяем успешную авторизацию', async () => {
      const loginPage = new LoginPage(page);
      await loginPage.expectLoggedIn(username);
    });
  });

  test('Логин с неверным паролем — ошибка', async ({ page }) => {
    await label('layer', 'ui');
    await severity('normal');

    const loginPage = new LoginPage(page);

    await step('Открываем главную страницу', async () => {
      await loginPage.goto();
    });

    await step('Логинимся с неверным паролем и проверяем ошибку', async () => {
      page.once('dialog', async (dialog) => {
        expect(dialog.message()).toContain('Wrong password');
        await dialog.accept();
      });
      await loginPage.login(username, 'wrongpassword123');
    });
  });

  test('Логин с несуществующим пользователем — ошибка', async ({ page }) => {
    await label('layer', 'ui');
    await severity('minor');

    const loginPage = new LoginPage(page);

    await step('Открываем главную страницу', async () => {
      await loginPage.goto();
    });

    await step('Логинимся под несуществующим пользователем и проверяем ошибку', async () => {
      page.once('dialog', async (dialog) => {
        expect(dialog.message()).toBeTruthy();
        await dialog.accept();
      });
      await loginPage.login('nonexistent_xyz_123', 'password123');
    });
  });
});
