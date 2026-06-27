import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  workers: 2,
  fullyParallel: true,

  reporter: [
    ['list'],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: true,
    }],
  ],

  use: {
    baseURL: 'https://www.demoblaze.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/ui/**/*.spec.ts',
    },
    {
      name: 'api',
      use: {},
      testMatch: '**/api/**/*.spec.ts',
    },
  ],
});
