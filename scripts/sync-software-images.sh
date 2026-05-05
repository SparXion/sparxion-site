#!/usr/bin/env bash
# Copies masters from Portfolio/02-MASTERS/<project-id>/images/
# into public/software/<project-id>/ (URLs used by softwareImageUrl / software band band.jpg).
#
# Project folder names must match software item `id` in src/data/software.ts
# (e.g. ucid → public/software/ucid/band.jpg).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MASTERS="${SOFTWARE_MASTERS:-$ROOT/Portfolio/02-MASTERS}"
DEST="$ROOT/public/software"

if [[ ! -d "$MASTERS" ]]; then
  echo "Software masters not found: $MASTERS" >&2
  exit 1
fi

mkdir -p "$DEST"

shopt -s nullglob
for proj_dir in "$MASTERS"/*/; do
  img_dir="${proj_dir}images"
  [[ -d "$img_dir" ]] || continue
  id="$(basename "$proj_dir")"
  mkdir -p "$DEST/$id"
  rsync -a --delete --exclude='.DS_Store' --exclude='.BridgeSort' --exclude='_MACOSX' \
    "$img_dir/" "$DEST/$id/"
done

echo "Synced 02-MASTERS ($MASTERS) → $DEST"
