#!/usr/bin/env bash
#
# Normalize Portfolio/01-MASTERS/*/images/: web-ready JPEGs only in images/.
# - Converts PNG → JPEG (resized); moves original PNG → ../sources/
# - Resizes JPG larger than MAX_EDGE (overwrites images/ copy; originals go to ../sources/)
# - Moves PDF → ../sources/
#
# Requires: macOS `sips` (no ImageMagick dependency).
#
# Usage:
#   ./scripts/normalize-01-masters-images.sh              # all projects under 01-MASTERS
#   ./scripts/normalize-01-masters-images.sh nike-acg     # single project (…/01-MASTERS/nike-acg/images)
#   ./scripts/normalize-01-masters-images.sh --dry-run
#   ./scripts/normalize-01-masters-images.sh --dry-run nike-acg
#
# After running: update src/data/portfolio.ts image filenames (.png → .jpg) or re-export
# a manifest; then point sync-portfolio-images.sh at 01-MASTERS if desired.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)/Portfolio/01-MASTERS"
MAX_EDGE="${MAX_EDGE:-1920}"
JPEG_QUALITY="${JPEG_QUALITY:-82}"
DRY_RUN=0
LIMIT_ONE=

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run) DRY_RUN=1 ;;
    *) LIMIT_ONE="$1" ;;
  esac
  shift || true
done

if [[ ! -d "$ROOT" ]]; then
  echo "Missing $ROOT" >&2
  exit 1
fi

log() { printf '%s\n' "$*"; }

process_images_dir() {
  local imgs="$1"
  local proj
  proj="$(dirname "$imgs")"
  local sources="$proj/sources"
  local pname
  pname="$(basename "$proj")"

  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "[dry-run] would ensure $sources exists"
  else
    mkdir -p "$sources"
  fi

  shopt -s nullglob nocaseglob

  for f in "$imgs"/*.pdf; do
    [[ -f "$f" ]] || continue
    local base
    base="$(basename "$f")"
    log "[$pname] MOVE pdf → sources: $base"
    if [[ "$DRY_RUN" -eq 0 ]]; then
      mv -f "$f" "$sources/$base"
    fi
  done

  # PNG → JPEG (resize + encode); archive original PNG alongside PDFs/source assets
  for f in "$imgs"/*.png; do
    [[ -f "$f" ]] || continue
    local base="${f%.*}"
    local out="$base.jpg"
    local bn
    bn="$(basename "$f")"
    log "[$pname] CONVERT PNG → JPG (max edge $MAX_EDGE, q $JPEG_QUALITY): $bn"
    if [[ "$DRY_RUN" -eq 0 ]]; then
      sips -Z "$MAX_EDGE" -s format jpeg -s formatOptions "$JPEG_QUALITY" "$f" --out "$out" >/dev/null
      mv -f "$f" "$sources/$bn"
    fi
  done

  # Existing JPEG: if larger than MAX_EDGE, stash full-size copy then resize + recompress
  for f in "$imgs"/*.jpg "$imgs"/*.jpeg; do
    [[ -f "$f" ]] || continue
    local bn
    bn="$(basename "$f")"
    local w
    w="$(sips -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth:/{print $2}')" || true
    local h
    h="$(sips -g pixelHeight "$f" 2>/dev/null | awk '/pixelHeight:/{print $2}')" || true
    if [[ -z "$w" || -z "$h" ]] || ! [[ "$w" =~ ^[0-9]+$ && "$h" =~ ^[0-9]+$ ]]; then
      log "[$pname] SKIP (cannot read dims): $bn"
      continue
    fi
    local m="$w"
    if (( h > w )); then m="$h"; fi
    if (( m > MAX_EDGE )); then
      log "[$pname] RESIZE JPG (long edge ${m}px → ≤${MAX_EDGE}px): $bn"
      if [[ "$DRY_RUN" -eq 0 ]]; then
        cp -f "$f" "$sources/original-$bn"
        sips -Z "$MAX_EDGE" -s format jpeg -s formatOptions "$JPEG_QUALITY" "$f" --out "${f}.norm.jpg" >/dev/null
        mv -f "${f}.norm.jpg" "$f"
      fi
    fi
  done

  shopt -u nullglob nocaseglob
}

log "ROOT=$ROOT  MAX_EDGE=$MAX_EDGE  JPEG_QUALITY=$JPEG_QUALITY"

if [[ -n "$LIMIT_ONE" ]]; then
  imgs="$ROOT/$LIMIT_ONE/images"
  if [[ ! -d "$imgs" ]]; then
    echo "Not found: $imgs (LIMIT_ONE=$LIMIT_ONE)" >&2
    exit 1
  fi
  log "--- $(basename "$(dirname "$imgs")") ---"
  process_images_dir "$imgs"
else
  for imgs in "$ROOT"/*/images; do
    [[ -d "$imgs" ]] || continue
    log "--- $(basename "$(dirname "$imgs")") ---"
    process_images_dir "$imgs"
  done
fi

log "Done."
