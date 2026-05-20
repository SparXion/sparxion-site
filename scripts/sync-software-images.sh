#!/usr/bin/env bash
# Copies masters from Portfolio/02-MASTERS/<project-id>/images/
# into src/assets/software-bands/<project-id>/band.jpg (bundled by Vite for production)
# and public/software-assets/<project-id>/ (optional static mirror for dev).
#
# Project folder names must match software item `id` in src/data/software.ts
# (e.g. ucid → src/assets/software-bands/ucid/band.jpg).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MASTERS="${SOFTWARE_MASTERS:-$ROOT/Portfolio/02-MASTERS}"
DEST_ASSETS="$ROOT/src/assets/software-bands"
DEST_PUBLIC="$ROOT/public/software-assets"

if [[ ! -d "$MASTERS" ]]; then
  echo "Software masters not found: $MASTERS" >&2
  exit 1
fi

mkdir -p "$DEST_ASSETS" "$DEST_PUBLIC"

shopt -s nullglob
for proj_dir in "$MASTERS"/*/; do
  img_dir="${proj_dir}images"
  [[ -d "$img_dir" ]] || continue
  id="$(basename "$proj_dir")"
  mkdir -p "$DEST_ASSETS/$id" "$DEST_PUBLIC/$id"
  rsync -a --delete --exclude='.DS_Store' --exclude='.BridgeSort' --exclude='_MACOSX' \
    "$img_dir/" "$DEST_ASSETS/$id/"
  rsync -a --exclude='.DS_Store' --exclude='.BridgeSort' --exclude='_MACOSX' \
    "$img_dir/" "$DEST_PUBLIC/$id/"
done

echo "Synced 02-MASTERS ($MASTERS) → $DEST_ASSETS (+ $DEST_PUBLIC)"
