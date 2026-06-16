#!/usr/bin/env bash
# Han Bridge CRM — database backup (Linux / macOS / CI).
# Used both manually and by the daily cron job inside docker.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="${BACKUP_DIR:-$ROOT_DIR/backups}"
mkdir -p "$BACKUP_DIR"

# shellcheck disable=SC1090
[ -f "$ROOT_DIR/.env" ] && source "$ROOT_DIR/.env"

DB_USER="${POSTGRES_USER:-hanbridge}"
DB_NAME="${POSTGRES_DB:-hanbridge}"
CONTAINER="${POSTGRES_CONTAINER:-hanbridge_postgres}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"

STAMP="$(date +%Y-%m-%d_%H%M%S)"
OUT="$BACKUP_DIR/hanbridge_${STAMP}.sql.gz"

echo "Creating backup -> $OUT"
docker exec "$CONTAINER" pg_dump -U "$DB_USER" "$DB_NAME" | gzip > "$OUT"

# Prune old backups
find "$BACKUP_DIR" -name 'hanbridge_*.sql.gz' -mtime "+${RETENTION_DAYS}" -delete || true
echo "Backup complete. Retained last ${RETENTION_DAYS} days."
