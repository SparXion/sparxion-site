/**
 * Matches `#hero-clip-band-left` on Sparxion_Landing_Sketch-Scale.svg (viewBox 0 0 1920 × 1080).
 * Percents assume the clipped element is laid out as the illustrator **left half** (960 user units wide)
 * and **only** the wedge vertical band `[HERO_CLIP_TOP_Y, HERO_CLIP_BOTTOM_Y]`.
 */

const VIEWBOX_LEFT_HALF_U = 1920 / 2;
const HERO_CLIP_TOP_Y = 408.8;
const HERO_CLIP_BOTTOM_Y = 704.9;
const HERO_CLIP_H = HERO_CLIP_BOTTOM_Y - HERO_CLIP_TOP_Y;

/** Inner boundary apex / slant aligns with `#x-mark-large` so the overlay does not bleed over the large X */
const VERTICES: readonly [number, number][] = [
  [861.7, 560.1],
  [769.2, 408.8],
  [0, 408.8],
  [0, 704.9],
  [770.5, 704.9],
];

function pct(xSvg: number, ySvg: number): string {
  const x = (xSvg / VIEWBOX_LEFT_HALF_U) * 100;
  const y = ((ySvg - HERO_CLIP_TOP_Y) / HERO_CLIP_H) * 100;
  return `${x}% ${y}%`;
}

/** Use on `DesignBand` root (half-width × wedge-height box): crops band + scroll chrome to illustrator wedge interior */
export const HERO_DESIGN_BAND_CLIP_PATH = `polygon(${VERTICES.map(([x, y]) => pct(x, y)).join(', ')})`;
