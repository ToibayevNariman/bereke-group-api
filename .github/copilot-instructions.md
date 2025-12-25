# Copilot instructions (bereke-group-api)

## Project shape
- Fastify v5 app bootstrapped with Fastify-CLI; entrypoint is `src/app.ts` (exports `app` plugin + `options`).
- Plugins and routes are auto-loaded at runtime via `@fastify/autoload` from `src/plugins` and `src/routes` (see `src/app.ts`).
- Routes are written as encapsulated Fastify plugins (examples: `src/routes/root.ts`, `src/routes/example/index.ts`).
- Cross-cutting concerns live in `src/plugins` as `fastify-plugin` modules (examples: `src/plugins/sensible.ts`, `src/plugins/support.ts`, `src/plugins/prisma.ts`).

## Conventions to follow when adding code
- Prefer the existing plugin-per-module pattern:
  - New routes: add a `FastifyPluginAsync` under `src/routes/<area>.ts` or `src/routes/<area>/index.ts`.
  - New shared behavior/decorators: add a `fastify-plugin` under `src/plugins/<name>.ts`.
- TypeScript module augmentation is used for decorators.
  - Example: `src/plugins/support.ts` augments `FastifyInstance` for `someSupport()`.
- Prisma is injected as a Fastify decorator and may be intentionally disabled.
  - `src/plugins/prisma.ts` sets `fastify.prisma` to `null` when `DATABASE_URL` is missing.
  - When writing route code that uses Prisma, handle the nullable decorator (e.g. return a sensible error when `fastify.prisma` is `null`).

## Dev workflows (commands used in this repo)
- Dev server (TypeScript build + watch + Fastify reload): `npm run dev`
- Production start: `npm start` (builds then runs `dist/app.js` via Fastify CLI)
- Build only: `npm run build:ts`
- Tests: `npm test`
  - This repo uses Node’s built-in test runner (`node:test`) + `fastify-cli/helper.js` (see `test/helper.ts`).
  - Tests run against the TypeScript app entry with `skipOverride: true` to expose decorators.
- Prisma:
  - Generate client: `npm run prisma:generate`
  - Dev migrations: `npm run prisma:migrate`
  - Studio: `npm run prisma:studio`

## Database & env expectations
- Local Postgres is provided via Docker Compose (see `docker-compose.yml`).
- The Prisma datasource uses `DATABASE_URL` (see `prisma/schema.prisma`).
  - If `DATABASE_URL` is absent, the Prisma plugin logs a warning and disables itself.

## Testing patterns (match existing style)
- Prefer `node:test` + `node:assert`.
- For route tests, use `build(t)` from `test/helper.ts` and call `app.inject(...)`.
  - Examples: `test/routes/root.test.ts`, `test/routes/example.test.ts`.
- For plugin unit tests, register the plugin on a standalone Fastify instance.
  - Example: `test/plugins/support.test.ts`.
