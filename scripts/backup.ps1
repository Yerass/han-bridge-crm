# Han Bridge CRM — manual database backup (Windows / PowerShell)
# Usage: .\scripts\backup.ps1
# Produces a timestamped gzip dump in ./backups

$ErrorActionPreference = "Stop"

$root      = Split-Path -Parent $PSScriptRoot
$backupDir = Join-Path $root "backups"
if (-not (Test-Path $backupDir)) { New-Item -ItemType Directory -Path $backupDir | Out-Null }

$envFile = Join-Path $root ".env"
$dbUser = "hanbridge"; $dbName = "hanbridge"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*POSTGRES_USER\s*=\s*(.+)$') { $dbUser = $Matches[1].Trim() }
        if ($_ -match '^\s*POSTGRES_DB\s*=\s*(.+)$')   { $dbName = $Matches[1].Trim() }
    }
}

$stamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$out   = Join-Path $backupDir "hanbridge_$stamp.sql.gz"

Write-Host "Creating backup -> $out"
docker exec hanbridge_postgres pg_dump -U $dbUser $dbName | gzip > $out
Write-Host "Backup complete."
