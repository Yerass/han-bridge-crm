# Security Audit — Han Bridge

**Дата:** 2026-06-22 · **Цель:** hanbridge.kz (195.210.47.98)
**Метод:** обзор внешней поверхности, инфраструктуры, Docker, аутентификации, секретов, зависимостей (без разрушающих/DoS-тестов).
**Общая оценка:** 7/10 — грамотная база, несколько брешей в защите от брутфорса и раскрытии информации.

> Контекст: 2026-06-22 контейнер фронтенда был скомпрометирован через Next.js 15.0.3 (майнер XMRig). Устранено: апгрейд до 15.5.19 + пересборка. Подробности — во внутренней истории инцидента.

---

## ✅ Уже хорошо
- Наружу открыты только 22/80/443; Postgres/Redis/backend/frontend снаружи недоступны.
- UFW активен (deny incoming). TLS 1.2/1.3, валидный сертификат, редирект HTTP→HTTPS.
- Security-заголовки: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy — присутствуют.
- Пароли через bcrypt; проверка `isActive` (отключённые аккаунты не входят).
- Секреты сильные (JWT/DB по 48 симв.), `.env` с правами 600.
- OS-автообновления (unattended-upgrades), 0 ожидающих security-патчей.
- Docker-сокет в контейнеры не проброшен.
- Порт 80 отдаёт только ACME-челлендж + редирект (нужен для авто-продления Let's Encrypt; закрывать нельзя).

---

## ✅ Внедрено 2026-06-22
- **Non-root контейнеры:** backend и frontend теперь работают от `node` (uid 1000), не root. Пересобрано, проверено: сайт 200, миграции от node, ISR работает.
- **fail2ban:** установлен и активен (jail `sshd`, 4 попытки → бан 4ч); сразу забанил активных брутфорсеров.
- **lockfile:** `frontend/package-lock.json` синхронизирован на Next 15.5.19.
- **Уточнение:** rate-limit на логине **уже был в проде** (самописный лимитер 20 попыток/IP за 5 мин, корректно читает реальный IP за nginx) — `@nestjs/throttler` не нужен.

## 🔴 Высокий приоритет

| # | Находка | Статус | Фикс |
|---|---------|--------|------|
| 1 | Контейнеры backend/frontend работали от **root** — усугубило инцидент с майнером | ✅ **сделано** | `USER node` (uid 1000) в Dockerfile backend+frontend |
| 2a | SSH: парольный вход + 26k неудачных попыток + не было fail2ban | ✅ **fail2ban**; key-only отложен по решению владельца | при желании — `PasswordAuthentication no` после добавления личного ключа |
| 2b | Брутфорс логина | ✅ **уже защищено** | лимитер 20/IP/5мин за nginx (подтверждено) |
| 3 | Зависимости бэкенда: 12 уязвимостей (3 high, вкл. Lodash prototype pollution) | ⏳ осталось | `npm audit fix` + ручное обновление |
| 4 | `package-lock.json` резолвил Next 15.0.3 | ✅ **сделано** | lockfile обновлён до 15.5.19 |

---

## 🟡 Средний приоритет

| # | Находка | Фикс |
|---|---------|------|
| 5 | Swagger `/docs` и `/api/docs` открыты публично | отключить в проде / закрыть basic-auth или по IP |
| 6 | CORS `origin: true` + `credentials: true` (отражает любой Origin) | whitelist `https://hanbridge.kz` |
| 7 | Нет CSP (Content-Security-Policy) | `add_header Content-Security-Policy ...` в nginx |
| 8 | Docker обходит UFW (published-порты игнорируют firewall) | биндить чувствительные порты на 127.0.0.1 или правила в DOCKER-USER |
| 9 | JWT-фолбэк `'change_me_in_production'` в коде | бросать ошибку, если `JWT_SECRET` не задан (fail closed) |
| 10 | SSH `PermitRootLogin without-password` | `PermitRootLogin no` |

---

## ⚪ Низкий / информационно
- Раскрытие версий: `Server: nginx/1.27.5`, `X-Powered-By: Next.js` → `server_tokens off`, `poweredByHeader: false`.
- Нет `limit_req` в nginx (defense in depth).
- Бэкапы на том же хосте — стоит выгружать офсайт.
- Единый аккаунт `director` — нет персональной подотчётности в аудит-логе.
- Сид-дефолт `password123` для неактивных аккаунтов — менять при активации.

---

## Порядок внедрения
1. fail2ban + SSH key-only — закрыть активный брутфорс.
2. throttler на логин + non-root контейнеры — главный урок инцидента.
3. `npm audit fix` бэкенда + коммит lockfile.
4. Swagger, CORS, CSP.
