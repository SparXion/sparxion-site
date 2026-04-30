#!/usr/bin/env bash
# Copies portfolio images from iCloud "2026 | Portfolio Images" into public/portfolio/{id}/.
# Re-run when source images change.

set -euo pipefail

SRC="${PORTFOLIO_IMAGES:-$HOME/Library/Mobile Documents/com~apple~CloudDocs/Portfolio/2026 | Portfolio Images}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/public/portfolio"

if [[ ! -d "$SRC" ]]; then
  echo "Source not found: $SRC" >&2
  exit 1
fi

mkdir -p "$DEST"

sync_id() {
  local id="$1"
  local rel="$2"
  mkdir -p "$DEST/$id"
  rsync -a --delete --exclude='.DS_Store' --exclude='.BridgeSort' --exclude='_MACOSX' \
    "$SRC/$rel/" "$DEST/$id/"
}

sync_id custom-motors "2025 CM PNGs"
sync_id twinduction "2025 Twinduction PNGs"
sync_id hw-crashers "2025 HW Crashers PNGs"
sync_id acan0 "2026 0-Series PNGs"
sync_id hw-art "2026 HW Art PNG"
sync_id nike-acg "2026 ACG Sketches PNG"
sync_id eps-glitz "2026 EPS Footwear Concept"
sync_id paw-patrol "2025 Paw Patrol PNGs"
sync_id gi-joe "2025 GIJ PNGs"
sync_id valaverse "2025 Valaverse PNGs"
sync_id power-rangers "2025 Power Rangers PNGs"
sync_id star-wars "2026-MF-Portfolio"
sync_id mwls "2026 MWLS PNG Files"
sync_id naughty-connie "2026 Naughty Connie"
sync_id concept-art "2026 Concept Art"

mkdir -p "$DEST/marmot" "$DEST/mashie"
rsync -a --delete --exclude='.DS_Store' \
  "$SRC/2026 Apparel/Marmot PNG/" "$DEST/marmot/"
rsync -a --delete --exclude='.DS_Store' \
  "$SRC/2026 Apparel/Mashie PNG/" "$DEST/mashie/"

echo "Synced to $DEST"
