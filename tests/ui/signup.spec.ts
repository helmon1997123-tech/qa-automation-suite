import { test, expect } from '@playwright/test';
import { label, severity, step } from 'allure-js-commons';
import { SignupPage } from '../../pages/SignupPage';
import { signupApi } from '../../helpers/apiClient';
import { generateUsername, generatePassword } from '../../helpers/testData';

test.describe('UI — Регистрация', () => {

    test('Успешная регистрация нового пользователя', async ({ page }) => {
        await label('layer', 'ui');
        await severity('critical');

        const signupPage = new SignupPage(page);
        const username = generateUsername();
        const password = generatePassword();

        await step('Открываем главную страницу', async () => {
            await signupPage.goto();
        });

        await step('Регистрируем нового пользователя', async () => {
            page.once('dialog', async (dialog) => {
                expect(dialog.message()).toContain('Sign up successful');
                await dialog.accept();
            });
            await signupPage.signup(username, password);
        });
    });

    test('Регистрация с уже существующим username — ошибка', async ({ page, request }) => {
        await label('layer', 'ui');
        await severity('normal');

        const username = generateUsername();
        const password = generatePassword();

        await step('Предварительно регистрируем пользователя через API', async () => {
            await signupApi(request, username, password);
        });

        const signupPage = new SignupPage(page);

        await step('Открываем главную страницу', async () => {
            await signupPage.goto();
        });

        await step('Пытаемся зарегистрировать того же пользователя повторно', async () => {
            page.once('dialog', async (dialog) => {
                expect(dialog.message()).toContain('already exist');
                await dialog.accept();
            });
            await signupPage.signup(username, password);
        });
    });

    test('Регистрация с пустым username — ошибка', async ({ page }) => {
        await label('layer', 'ui');
        await severity('normal');

        const signupPage = new SignupPage(page);

        await step('Открываем главную страницу', async () => {
            await signupPage.goto();
        });

        await step('Пытаемся зарегистрироваться с пустым username', async () => {
            page.once('dialog', async (dialog) => {
                expect(dialog.message()).toBeTruthy();
                await dialog.accept();
            });
            await signupPage.signup('', generatePassword());
        });
    });

    test('Регистрация с пустым паролем — ошибка', async ({ page }) => {
        await label('layer', 'ui');
        await severity('normal');

        const signupPage = new SignupPage(page);

        await step('Открываем главную страницу', async () => {
            await signupPage.goto();
        });

        await step('Пытаемся зарегистрироваться с пустым паролем', async () => {
            page.once('dialog', async (dialog) => {
                expect(dialog.message()).toBeTruthy();
                await dialog.accept();
            });
            await signupPage.signup(generateUsername(), '');
        });
    });
});