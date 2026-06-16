# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Han Bridge CRM/ERP — система управления языковой школой (китайский/английский). Монорепозиторий: NestJS backend + Next.js 15 frontend, PostgreSQL/Prisma, Redis, nginx, Docker.

- **Полный продуктовый спек** (исходные требования): [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)
- **Архитектура, ERD, формулы, дорожная карта**: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Запуск и демо-доступы**: [README.md](README.md)

There is **no root `package.json`** — run all commands inside `backend/` or `frontend/`.

## Commands

```bash
# Backend (cd backend)
npm install
npx prisma generate              # regenerate client after schema.prisma changes
npx prisma migrate dev --name x  # create+apply a new migration (needs a live DB)
npm run prisma:seed              # seed demo data (real school data from the Excel sheet)
npm run start:dev                # watch mode, http://localhost:4000, Swagger at /docs
npm run build                    # nest build -> dist/main.js
npx prisma validate              # needs DATABASE_URL set (even a dummy value)

# Frontend (cd frontend)
npm install
cp .env.local.example .env.local # NEXT_PUBLIC_API_URL=http://localhost:4000 for local dev
npm run dev                      # http://localhost:3000
npm run build                    # next build (also type-checks all pages)

# Whole stack
docker compose up -d --build     # postgres, redis, backend, frontend, nginx (UI at http://localhost)
docker compose exec backend npx prisma db seed

# DB backup / restore (from repo root)
./scripts/backup.ps1                                  # gzip dump -> ./backups
./scripts/restore.ps1 -File ./backups/hanbridge_*.sql.gz
```

There is no test suite yet (`jest` is configured in backend but no specs exist).

## Architecture

**Two apps behind nginx.** nginx routes `/` → frontend, `/api` → backend (strips the `/api` prefix), `/docs` → Swagger. The backend has **no global route prefix**; in local dev the frontend talks to `http://localhost:4000` directly.

**Auth/RBAC is global, enforced by guards (not per-route boilerplate).** `JwtAuthGuard` is registered as `APP_GUARD` in [app.module.ts](backend/src/app.module.ts) — every route requires a valid JWT unless decorated `@Public()` (used only on `POST /auth/login`). Authorization uses `@Roles(...)` + `RolesGuard` (applied per controller via `@UseGuards`). `SUPER_ADMIN` bypasses all role checks. A global `AuditInterceptor` writes an `AuditLog` row for every mutating request (POST/PATCH/DELETE) — derives the entity from the route, never blocks the request on failure.

**Prisma is the single source of truth.** `PrismaModule` is `@Global()`; inject `PrismaService` anywhere. The whole data model lives in [schema.prisma](backend/prisma/schema.prisma). Key modeling decision: **an individual course is a `Group` with one student** (`studyType = INDIVIDUAL`). Everything — hours, salary, schedule, profitability — hangs off `Group` → `ScheduleSlot` (recurring weekly) → `Lesson` (concrete dated instance) → `Attendance`. Money columns are `Decimal` — wrap in `Number()` before arithmetic.

**Business logic lives in services, computed on read (not stored).** These three are the heart of the system and share conventions (`WEEKS_PER_MONTH = 4`, durations parsed from `"HH:MM"` strings):
- [teachers.service.ts](backend/src/teachers/teachers.service.ts) `buildWorkload()` — groups, students, hours/week, hours/month, salary (`hours × rate`), income, profit. Replaces the Excel "Нагрузка учителя" sheet.
- [groups.service.ts](backend/src/groups/groups.service.ts) `buildProfitability()` — `income − teacherCost − otherExpenses = netProfit`, margin %.
- [finance.service.ts](backend/src/finance/finance.service.ts) — **revenue = paid `Payment`s + `INCOME` transactions; expenses = `EXPENSE` transactions.** `ownerOverview()` reports per day/week/month/year (director only); `startOf()` computes period boundaries (monday-based weeks).

[dashboard.service.ts](backend/src/dashboard/dashboard.service.ts) composes KPIs by importing `FinanceService` + `TeachersService` (so those modules `export` their service).

**Nest module convention:** each feature is `module + controller + service` under `src/<feature>/`. Larger features keep DTOs in `dto/*.dto.ts`; smaller ones (payments, finance, leads, attendance, users) **define DTO classes inline at the top of the service or controller file** — follow the existing file's style when extending.

**Frontend is App Router with a protected shell.** The `(app)` route group is a client-side layout ([(app)/layout.tsx](frontend/src/app/(app)/layout.tsx)) that checks the token, calls `/auth/me`, and redirects to `/login` if absent — all pages under `(app)/` are auth-gated (route group adds no URL segment). The shared `api()` client in [lib/api.ts](frontend/src/lib/api.ts) attaches the Bearer token from `localStorage`, throws `ApiError`, and auto-redirects to `/login` on 401. UI primitives in `components/ui/` are hand-rolled ShadCN-style (cva + `cn`); theme via `next-themes` (`class` strategy, tokens in [globals.css](frontend/src/app/globals.css)).

## Gotchas

- `backend/tsconfig.json` **excludes `prisma/`** so the compile root collapses to `src/` and output is `dist/main.js` (not `dist/src/main.js`). The seed runs through `ts-node`, not the build.
- `prisma` and `ts-node` are in **`dependencies`** (not devDependencies) so the `--omit=dev` Docker runtime can run `migrate deploy` at startup and `db seed` on demand.
- The baseline migration `prisma/migrations/0_init` was generated offline via `prisma migrate diff` (no DB was available). For schema changes, prefer `prisma migrate dev` against a real DB to keep history consistent.
- `NEXT_PUBLIC_API_URL` is baked at **build time** (Docker build arg) — rebuild the frontend image to change it.
- Default seed password for every account is `password123`; logins are `*@hanbridge.kz` (see README table).
