# Getting Started with [Fastify-CLI](https://www.npmjs.com/package/fastify-cli)
This project was bootstrapped with Fastify-CLI.

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the app in dev mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm start`

For production mode

### `npm run test`

Run the test cases.

## Development Database (Postgres via Docker)

1) Copy env template:

`cp .env.example .env`

2) Start Postgres:

`docker compose up -d`

The database will be available on `localhost:${POSTGRES_PORT}` (default `5432`).

## Prisma

- Generate client:

`npm run prisma:generate`

- Create/apply dev migration:

`npm run prisma:migrate`

- Open Prisma Studio:

`npm run prisma:studio`

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).
