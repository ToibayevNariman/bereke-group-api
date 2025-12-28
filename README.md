# Быстрый старт (Fastify)
Проект создан с помощью [Fastify-CLI](https://www.npmjs.com/package/fastify-cli).

## Первый запуск (локально)

### 1) Подготовить переменные окружения

Скопируйте шаблон env-файла:

`cp .env.example .env`

Проверьте, что в `.env` задан `DATABASE_URL` (пример):

`postgresql://postgres:postgres@localhost:5432/bereke_group_dev?schema=public`

### 2) Поднять PostgreSQL (Docker)

`docker compose up -d`

База будет доступна на `localhost:${POSTGRES_PORT}` (по умолчанию `5432`).

### 3) Prisma: сгенерировать клиент, применить миграции, выполнить seed

`npm run prisma:generate`

`npm run db:migrate`

`npm run db:seed`

### 4) Запустить приложение

`npm run dev`

По умолчанию сервер доступен на [http://localhost:3000](http://localhost:3000).

## Доступные команды

В папке проекта доступны команды:

### `npm run dev`

Запуск приложения в dev-режиме.

### `npm start`

Запуск в production-режиме.

### `npm run test`

Запуск тестов.

## База данных (Postgres через Docker)

`docker compose up -d`

База будет доступна на `localhost:${POSTGRES_PORT}` (по умолчанию `5432`).

## Prisma

- Сгенерировать Prisma Client:

`npm run prisma:generate`

- Создать/применить dev-миграции:

`npm run prisma:migrate`

- Открыть Prisma Studio:

`npm run prisma:studio`

- Применить миграции (dev):

`npm run db:migrate`

- Выполнить seed:

`npm run db:seed`

Убедитесь, что `DATABASE_URL` задан (пример):

`postgresql://postgres:postgres@localhost:5432/bereke_group_dev?schema=public`

## Полезные ссылки

Документация Fastify: [https://fastify.dev/docs/latest/](https://fastify.dev/docs/latest/)

## Локализация ответов API (i18n)

Поддерживаемые языки: `kk`, `ru`, `en`. Язык по умолчанию: `ru`.

Приоритет выбора языка:
1) Заголовок `X-Lang: kk|ru|en`
2) Заголовок `Accept-Language` (например: `en-US,en;q=0.9,ru;q=0.8`)
3) Фолбэк: `ru`

Примеры:

`curl -H "X-Lang: en" http://localhost:3000/does-not-exist`

`curl -H "Accept-Language: kk-KZ,ru;q=0.8" http://localhost:3000/does-not-exist`

## Auth (SMS OTP + System Admin)

Требуется переменная окружения `JWT_SECRET` для выдачи access token.

Примеры (mock OTP = `123456`):

Запросить OTP:

`curl -X POST http://localhost:3000/api/auth/request-otp -H "Content-Type: application/json" -d "{\"login\":\"+77001234567\"}"`

Логин по OTP:

`curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"login\":\"+77001234567\",\"otp\":\"123456\"}"`

System admin логин (только пароль):

`curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"login\":\"+70000000000\",\"password\":\"CHANGE_ME\"}"`
