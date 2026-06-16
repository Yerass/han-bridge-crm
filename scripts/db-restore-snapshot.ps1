# Han Bridge CRM — восстановить БД из снапшота (откат данных).
# По умолчанию восстанавливает db-backup/snapshot.sql из текущей рабочей копии.
#
# Откат к КОНКРЕТНОЙ точке (тегу):
#   git checkout snapshot-YYYYMMDD-HHmm           # вернуть и код, и файл дампа
#   .\scripts\db-restore-snapshot.ps1             # залить дамп обратно в БД
# Вернуться обратно на ветку:  git checkout main

$root = Split-Path -Parent $PSScriptRoot
$dump = Join-Path $root 'db-backup\snapshot.sql'
if (-not (Test-Path $dump)) { Write-Host "Файл дампа не найден: $dump" -ForegroundColor Red; exit 1 }

Write-Warning 'Это ПЕРЕЗАПИШЕТ данные в базе hanbridge содержимым db-backup/snapshot.sql'
docker cp $dump hanbridge_postgres:/tmp/restore.sql
docker exec hanbridge_postgres psql -U hanbridge -d hanbridge -f /tmp/restore.sql
if ($LASTEXITCODE -ne 0) { Write-Host 'Восстановление завершилось с ошибкой.' -ForegroundColor Red; exit 1 }

Write-Host 'OK. База восстановлена из снапшота.' -ForegroundColor Green
