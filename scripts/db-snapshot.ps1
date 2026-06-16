# Han Bridge CRM — сохранить ТЕКУЩЕЕ состояние (код + база) в GitHub с тегом отката.
# Использование:  .\scripts\db-snapshot.ps1 "что изменилось"
param([string]$Message = "snapshot")

# Внимание: НЕ ставим ErrorActionPreference=Stop — git пишет предупреждения
# (LF->CRLF) в stderr, и в этом режиме PowerShell воспринял бы их как ошибку.
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
$env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')

# 1) свежий дамп БД (через временный файл в контейнере — без проблем с кодировкой)
New-Item -ItemType Directory -Force "$root\db-backup" | Out-Null
docker exec hanbridge_postgres sh -c "pg_dump -U hanbridge --clean --if-exists --no-owner --no-privileges hanbridge > /tmp/snapshot.sql"
docker cp hanbridge_postgres:/tmp/snapshot.sql "$root\db-backup\snapshot.sql"
if (-not (Test-Path "$root\db-backup\snapshot.sql")) { Write-Host 'Не удалось снять дамп БД (запущен ли hanbridge_postgres?)' -ForegroundColor Red; exit 1 }

# 2) коммит + тег + push
$stamp = Get-Date -Format 'yyyyMMdd-HHmm'
git add -A
git commit -m "Snapshot ${stamp}: $Message"
git tag "snapshot-$stamp"
git push origin HEAD
if ($LASTEXITCODE -ne 0) { Write-Host 'Push не прошёл. Возможно, нужно: git pull --rebase origin main' -ForegroundColor Red; exit 1 }
git push origin "snapshot-$stamp"

Write-Host "OK. Точка отката: snapshot-$stamp" -ForegroundColor Green
