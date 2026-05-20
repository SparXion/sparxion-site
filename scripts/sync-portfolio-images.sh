#!/usr/bin/env bash
# Sync Portfolio/01-MASTERS/<folder>/images/ → public/portfolio/<folder>/ (1:1 ids)
# Re-run after master images change: npm run sync-portfolio

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MASTERS="${PORTFOLIO_MASTERS:-$ROOT/Portfolio/01-MASTERS}"
DEST="$ROOT/public/portfolio"

if [[ ! -d "$MASTERS" ]]; then
  echo "01-MASTERS not found: $MASTERS" >&2
  exit 1
fi

mkdir -p "$DEST"

rsync_images() {
  local src="$1"
  local id="$2"
  if [[ ! -d "$src" ]]; then
    echo "  skip (no images): $src" >&2
    return 0
  fi
  mkdir -p "$DEST/$id"
  rsync -a --delete \
    --exclude='.DS_Store' \
    --exclude='.BridgeSort' \
    --exclude='_MACOSX' \
    --exclude='*.psd' \
    "$src/" "$DEST/$id/"
  echo "  $id"
}

rsync_video_subdir() {
  local master="$1"
  local id="$2"
  local vid="$MASTERS/$master/video"
  [[ -d "$vid" ]] || return 0
  shopt -s nullglob
  local f
  for f in "$vid"/*; do
    [[ -f "$f" ]] || continue
    cp -f "$f" "$DEST/$id/$(basename "$f")"
  done
  shopt -u nullglob
}

echo "Syncing 01-MASTERS → $DEST"

shopt -s nullglob
for proj_dir in "$MASTERS"/*/; do
  id="$(basename "$proj_dir")"
  rsync_images "$proj_dir/images" "$id"
  rsync_video_subdir "$id" "$id"
done
shopt -u nullglob

# Drop public folders with no matching 01-MASTERS/images (old ids: custom-motors, acan0, …)
shopt -s nullglob
for existing in "$DEST"/*/; do
  id="$(basename "$existing")"
  if [[ ! -d "$MASTERS/$id/images" ]]; then
    rm -rf "$existing"
    echo "  removed orphan $id"
  fi
done
shopt -u nullglob

echo "Done → $DEST"
