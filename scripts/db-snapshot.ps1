# Han Bridge CRM — сохранить ТЕКУЩЕЕ состояние (код + база) в GitHub с тегом отката.
# Использование:  .\scripts\db-snapshot.ps1 "что изменилось"
param([string]$Message = "snapshot")

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

# 1) свежий дамп БД (через временный файл в контейнере — без проблем с кодировкой)
New-Item -ItemType Directory -Force "$root\db-backup" | Out-Null
docker exec hanbridge_postgres sh -c "pg_dump -U hanbridge --clean --if-exists --no-owner --no-privileges hanbridge > /tmp/snapshot.sql"
docker cp hanbridge_postgres:/tmp/snapshot.sql "$root\db-backup\snapshot.sql"

# 2) коммит + тег + push
$stamp = Get-Date -Format "yyyyMMdd-HHmm"
git add -A
git commit -m "Snapshot ${stamp}: $Message"
git tag "snapshot-$stamp"
git push origin HEAD
git push origin "snapshot-$stamp"

Write-Host "✅ Сохранено. Точка отката: тег  snapshot-$stamp" -ForegroundColor Green
