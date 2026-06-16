# Снимки базы данных (точки отката)

Здесь хранится `snapshot.sql` — полный дамп базы `hanbridge` (схема + данные)
на момент последнего сохранения. Каждое сохранение помечается **git-тегом**
вида `snapshot-YYYYMMDD-HHmm` — это и есть точка отката (код + данные вместе).

> ⚠️ Дамп содержит персональные данные и хэши паролей — репозиторий должен быть **приватным**.

## Сохранить текущее состояние (код + БД) в GitHub
```powershell
./scripts/db-snapshot.ps1 "короткое описание"
```
Снимет дамп, закоммитит код + дамп, поставит тег и запушит.

## Откатиться к сохранённой точке
```powershell
# 1) посмотреть доступные точки
git tag --list "snapshot-*"

# 2) вернуть код и дамп на нужную точку
git checkout snapshot-YYYYMMDD-HHmm

# 3) залить дамп обратно в базу
./scripts/db-restore-snapshot.ps1

# 4) когда закончили — вернуться на основную ветку
git checkout main
```

## Восстановить только данные (без отката кода)
```powershell
git checkout snapshot-YYYYMMDD-HHmm -- db-backup/snapshot.sql
./scripts/db-restore-snapshot.ps1
git checkout HEAD -- db-backup/snapshot.sql
```
