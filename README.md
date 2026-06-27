# QA Automation Suite — Demoblaze

![CI](https://github.com/helmon1997123-tech/qa-automation-suite/actions/workflows/tests.yml/badge.svg)

Фреймворк автоматизации тестирования для e-commerce приложения [Demoblaze](https://www.demoblaze.com).
Покрывает API, UI и нагрузочное тестирование с CI/CD и Telegram-нотификациями.

## Стек

| Инструмент | Назначение |
|---|---|
| TypeScript | Язык разработки |
| Playwright | UI и API автотесты |
| Zod | Валидация схем API-ответов |
| Allure | Отчёты с шагами, severity, labels |
| k6 | Нагрузочное тестирование |
| GitHub Actions | CI/CD пайплайн |
| Telegram Bot | Нотификации о результатах |

## Структура проекта

qa-automation-suite/

├── tests/

│   ├── api/                  # API тесты

│   │   ├── auth.spec.ts      # Авторизация и регистрация

│   │   ├── products.spec.ts  # Каталог товаров + Zod валидация

│   │   └── cart.spec.ts      # Корзина (happy path + negative)

│   └── ui/                   # UI тесты

│       ├── signup.spec.ts    # Регистрация через UI

│       ├── login.spec.ts     # Авторизация через UI

│       ├── catalog.spec.ts   # Каталог и фильтрация

│       └── purchase.spec.ts  # E2E: логин → покупка → заказ

├── pages/                    # Page Object Model

│   ├── SignupPage.ts

│   ├── LoginPage.ts

│   ├── CatalogPage.ts

│   ├── ProductPage.ts

│   └── CartPage.ts

├── helpers/

│   ├── apiClient.ts          # HTTP-клиент для API тестов

│   ├── schemas.ts            # Zod схемы для валидации ответов

│   └── testData.ts           # Генераторы тестовых данных

├── load-test.k6.ts           # k6 нагрузочный сценарий

├── .github/workflows/        # GitHub Actions CI/CD

├── playwright.config.ts

└── .env.example

## Покрытие тестами

### API тесты (Playwright + Zod)
| Эндпоинт | Тест | Severity |
|---|---|---|
| POST /signup | Успешная регистрация | Critical |
| POST /signup | Дублирующий username | Normal |
| POST /login | Успешный логин | Critical |
| POST /login | Неверный пароль | Normal |
| POST /login | Несуществующий пользователь | Minor |
| GET /entries | Список товаров + Zod валидация схемы | Critical |
| GET /entries | Валидация схемы каждого товара | Normal |
| POST /view | Товар по id + Zod валидация | Critical |
| POST /view | Несуществующий id | Minor |
| POST /addtocart | Добавление товара | Critical |
| POST /addtocart | Несколько товаров | Normal |
| POST /addtocart | Несуществующий товар (negative) | Minor |
| POST /viewcart | Просмотр корзины + Zod валидация | Critical |
| POST /viewcart | Без токена (negative) | Normal |
| POST /viewcart | Невалидный токен (negative) | Minor |

### UI тесты (Page Object Model)
- Регистрация: успех / дублирующий username / пустые поля
- Авторизация: успех / неверный пароль / несуществующий пользователь / пустые поля
- Каталог: фильтрация по категориям (Phones, Laptops, Monitors)
- Карточка товара: открытие и проверка контента
- **E2E сценарий:** логин → фильтрация → выбор товара → добавление в корзину → оформление заказа

### Нагрузочное тестирование (k6)
- Нарастающая нагрузка: 10 → 50 → 100 пользователей
- Метрики: Response Time, RPS, Error Rate
- Пороги: p(95) < 2000ms, error rate < 5%

## Запуск

### Установка

```bash
git clone https://github.com/helmon1997123-tech/qa-automation-suite.git
cd qa-automation-suite
npm install
npx playwright install chromium
```

### Настройка окружения

```bash
cp .env.example .env
```

### Запуск тестов

```bash
# Все тесты
npm test

# Только API
npm run test:api

# Только UI
npm run test:ui

# UI в режиме браузера
npm run test:headed
```

### Нагрузочное тестирование

```bash
# Установи k6: https://k6.io/docs/get-started/installation/
npm run load
```

### Allure отчёт

```bash
npm run report
```

## CI/CD

Тесты запускаются автоматически:
- При каждом `push` в `main` и `develop`
- При создании Pull Request в `main`
- Вручную через GitHub Actions (workflow_dispatch)

После прогона генерируется Allure HTML отчёт и отправляется уведомление в Telegram.

## Secrets для GitHub Actions

| Variable | Описание |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Токен Telegram бота |
| `TELEGRAM_CHAT_ID` | ID чата для нотификаций |