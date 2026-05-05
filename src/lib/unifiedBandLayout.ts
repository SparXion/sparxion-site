/** `portfolio_band_positioning` artboard: full frame height (Illustrator units). */
export const POSITIONING_FRAME_H_U = 1080;

/** Full strip width in the same coordinate system as `BAND_TILE_VIEWBOX_H` (296). */
export const STRIP_ARTBOARD_W_U = 12392.41;

/**
 * Home canvas width when the 1080 u-tall frame is mapped to the viewport height — same aspect as
 * one flat positioning export; a 1920-wide browser window scrolls horizontally over this.
 */
export const UNIFIED_BAND_PAGE_WIDTH_CSS = `calc(100vh * ${STRIP_ARTBOARD_W_U} / ${POSITIONING_FRAME_H_U})`;
