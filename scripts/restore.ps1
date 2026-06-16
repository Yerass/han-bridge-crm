# Han Bridge CRM — restore database from a backup (Windows / PowerShell)
# Usage: .\scripts\restore.ps1 -File .\backups\hanbridge_2026-06-16_120000.sql.gz

param(
    [Parameter(Mandatory = $true)]
    [string]$File
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $File)) { throw "Backup file not found: $File" }

$root    = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env"
$dbUser = "hanbridge"; $dbName = "hanbridge"
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*POSTGRES_USER\s*=\s*(.+)$') { $dbUser = $Matches[1].Trim() }
        if ($_ -match '^\s*POSTGRES_DB\s*=\s*(.+)$')   { $dbName = $Matches[1].Trim() }
    }
}

Write-Warning "This will OVERWRITE the current '$dbName' database."
Write-Host "Restoring from $File ..."
# decompress and pipe into psql inside the container
gzip -dc $File | docker exec -i hanbridge_postgres psql -U $dbUser -d $dbName
Write-Host "Restore complete."
