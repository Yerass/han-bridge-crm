# Han Bridge CRM / ERP

Современная система управления языковой школой (китайский / английский), заменяющая Excel-учёт.

**Стек:** Next.js 15 · NestJS · PostgreSQL · Prisma · Redis · Docker · Tailwind + ShadCN-style UI · JWT + RBAC.

---

## 🚀 Быстрый старт

### Вариант A — Docker (одна команда)

```bash
cp .env.example .env        # при необходимости отредактируйте секреты
docker compose up -d --build
```

Контейнеры: `postgres`, `redis`, `backend`, `frontend`, `nginx`.

| Сервис            | URL                          |
| ----------------- | ---------------------------- |
| Приложение (UI)   | http://localhost             |
| API (через nginx) | http://localhost/api         |
| Swagger           | http://localhost/docs        |

После старта backend применяет миграции автоматически. Чтобы заполнить демо-данными
(реальные группы/преподаватели из вашего Excel):

```bash
docker compose exec backend npx prisma db seed
```

### Вариант B — локально (без Docker)

Нужен запущенный PostgreSQL. Создайте `backend/.env`:

```
DATABASE_URL=postgresql://hanbridge:hanbridge_secret@localhost:5432/hanbridge?schema=public
JWT_SECRET=dev_secret
JWT_REFRESH_SECRET=dev_refresh
PORT=4000
```

```bash
# backend
cd backend
npm install
npx prisma migrate dev --name init   # создаёт схему БД
npm run prisma:seed                  # демо-данные
npm run start:dev                    # http://localhost:4000  (docs: /docs)

# frontend (в другом терминале)
cd frontend
cp .env.local.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                          # http://localhost:3000
```

---


---

## 🗂️ Структура проекта

```
.
├── docker-compose.yml        # postgres, redis, backend, frontend, nginx
├── nginx/nginx.conf          # reverse-proxy: / → frontend, /api → backend
├── scripts/                  # backup.ps1 / backup.sh / restore.ps1
├── backend/                  # NestJS + Prisma
│   ├── prisma/schema.prisma  # полная модель данных
│   ├── prisma/seed.ts        # демо-данные из реального Excel
│   └── src/
│       ├── auth/             # JWT + регистрация + /me
│       ├── common/           # RBAC guards, decorators, audit-interceptor
│       ├── students/ teachers/ groups/ payments/
│       ├── finance/          # транзакции + аналитика + owner-dashboard
│       ├── attendance/ leads/ dashboard/ users/ audit/
│       └── prisma/           # PrismaService (global)
└── frontend/                 # Next.js 15 App Router
    └── src/app/(app)/        # защищённые страницы (dashboard, students, ...)
```

---

## ✅ Что реализовано (рабочее, end-to-end)

- **Авторизация:** JWT, глобальный guard, `@Public()`, `@Roles()` RBAC, 8 ролей.
- **Аудит:** перехватчик пишет в `AuditLog` каждое изменение (кто/что/когда) — страница «Аудит».
- **Дашборд:** активные студенты, группы, преподаватели, доход/расход/прибыль за месяц,
  просроченные оплаты, нагрузка преподавателей (график), структура расходов (диаграмма).
- **Студенты:** список с поиском/фильтрами, карточка (оплаты, посещаемость, заметки, документы).
- **Преподаватели · Нагрузка:** автоматический расчёт групп, студентов, часов/неделя и /месяц,
  зарплаты (`часы × ставка`), дохода и прибыли от групп. Заменяет лист «Нагрузка учителя».
- **Группы · Доходность:** авторасчёт `Доход − Зарплата − Расходы = Чистая прибыль` и рентабельность %.
- **Финансы:** транзакции (доход/расход по категориям), аналитика месяца, доход по направлениям
  (китайский/английский), **Owner Dashboard** (день/неделя/месяц/год — только директор).
- **Воронка продаж:** kanban по этапам, конверсия, конвертация лида в студента.
- **Оплаты:** список, просроченные, создание.
- **Посещаемость:** отметка (был/не был/опоздал/уважит.) и отчёт по группе.

## 🧩 Заложено в модель, подключается следующим этапом

Эти модули уже имеют таблицы в Prisma и частично API; UI помечен как «следующий этап»:

- **Расписание** (`ScheduleSlot` + `Lesson`) — календарь, переносы, замены, проверка пересечений аудиторий.
- **Маркетинг / Unit-экономика** (`MarketingCampaign`) — ROI, CPL, CAC, LTV, ROMI.
- **Зарплатная ведомость** (`Payroll`) — бонусы/штрафы/надбавки, статусы.
- **Уведомления** (`Notification`) — Telegram-интеграция.
- **Импорт/экспорт** Excel/PDF/CSV, **AI-аналитик** для собственника.

Подробный план — в [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## 💾 Резервное копирование

```powershell
# Windows
./scripts/backup.ps1                                   # создать дамп в ./backups
./scripts/restore.ps1 -File ./backups/hanbridge_*.sql.gz
```

```bash
# Linux / cron
./scripts/backup.sh        # gzip-дамп + ротация старых (BACKUP_RETENTION_DAYS)
```

Данные PostgreSQL и Redis хранятся в Docker volumes (`postgres_data`, `redis_data`),
поэтому переживают перезапуск сервера.

---

## 📚 API

Полная интерактивная документация — Swagger на `/docs` (или `http://localhost:4000/docs` локально).
Все эндпоинты, кроме `POST /auth/login`, требуют заголовок `Authorization: Bearer <token>`.
