/**
 * Right wedge for `#hero-clip-band-right` / software overlay (viewBox 0 0 1920 × 1080, band 408.8–704.9).
 * Vertices follow the **band-facing (inner) edge** of the large-X right stroke — mirror of the
 * design-band apex at 861.7 — so software tucks into the X the same way design does.
 * `buildHeroSoftwareBandClipPathPx` maps sketch vertices to CSS px on the clipped shell.
 */

export const VIEWBOX_W = 1920;
export const HERO_CLIP_TOP_Y = 408.8;
export const HERO_CLIP_BOTTOM_Y = 704.9;
export const HERO_CLIP_H = HERO_CLIP_BOTTOM_Y - HERO_CLIP_TOP_Y;
/**
 * Band-facing (inner) edge of the large-X right stroke — mirrors design apex 861.7
 * on the left so software tucks to the crotch of the X, not the outer silhouette.
 */
export const ANCHOR_RIGHT_U = 944.6;

export const BASE_VERTS_RIGHT_U: readonly [number, number][] = [
  [1920, 408.8],
  [1014.8, 408.8],
  [944.6, 526.9],
  [1050.6, 704.9],
  [1920, 704.9],
];

export const FULL_HERO_BAND_RIGHT_CLIP_POLYGON_POINTS = BASE_VERTS_RIGHT_U.map(
  ([xu, yu]) => `${String(xu)} ${String(yu)}`,
).join(' ');

const VIEWBOX_RIGHT_HALF_U = VIEWBOX_W / 2;
const VIEWBOX_RIGHT_ORIGIN_X_U = VIEWBOX_RIGHT_HALF_U;

function pct(xSvg: number, ySvg: number): string {
  const x = ((xSvg - VIEWBOX_RIGHT_ORIGIN_X_U) / VIEWBOX_RIGHT_HALF_U) * 100;
  const y = ((ySvg - HERO_CLIP_TOP_Y) / HERO_CLIP_H) * 100;
  return `${x}% ${y}%`;
}

/** Percent polygon on half-width × wedge-height box (fallback when `el` is null). */
export const HERO_SOFTWARE_BAND_CLIP_PATH = `polygon(${BASE_VERTS_RIGHT_U.map(([x, y]) => pct(x, y)).join(', ')})`;

/** Degenerate wedge when seam is full software bleed (hides SVG wedge paint). */
const DEGEN_HERO_BAND_RIGHT_CLIP_POINTS = '1920 408.8 1919.999 408.8 1920 408.801';

const UNIFIED_HALF_SEAM_EPS = 1e-6;
const UNIFIED_SOFT_FULL_BLEED_EPS = 1e-6;

/**
 * CSS `clip-path` polygon in px for the software wedge, using the same vertices as the sketch.
 * `el` should be the element whose width/height match the clip reference box (typically the wedge shell).
 */
export function buildHeroSoftwareBandClipPathPx(
  el: Element | null,
  rightSeamPx: number | undefined,
): string {
  if (!el) return HERO_SOFTWARE_BAND_CLIP_PATH;
  const r = el.getBoundingClientRect();
  const wBox = Math.max(1, r.width);
  const hBox = Math.max(1, r.height);
  const xScale = wBox / VIEWBOX_W;
  const yScale = hBox / HERO_CLIP_H;

  const seamPx =
    typeof rightSeamPx === 'number' && Number.isFinite(rightSeamPx)
      ? rightSeamPx
      : ANCHOR_RIGHT_U * xScale;

  const pts = BASE_VERTS_RIGHT_U.map(([xu, yu]) => {
    const xPx = xu >= VIEWBOX_W - 1e-3 ? wBox : seamPx + (xu - ANCHOR_RIGHT_U) * xScale;
    const yPx = (yu - HERO_CLIP_TOP_Y) * yScale;
    return `${xPx.toFixed(2)}px ${yPx.toFixed(2)}px`;
  }).join(', ');
  return `polygon(${pts})`;
}

/**
 * User-space polygon `points` for `#hero-band-right-dynamic-clip polygon` (unified expanded).
 */
export function buildHeroBandRightDynamicClipPolygonPointsInUserSpace(params: {
  seamPx: number;
  maxRevealPx: number;
  heroWidthPx: number;
  rightSeamPx?: number;
}): string {
  const { seamPx, maxRevealPx, heroWidthPx, rightSeamPx } = params;
  const W = Math.max(1e-6, heroWidthPx);
  const max = Math.max(1e-6, maxRevealPx);

  if (seamPx <= max * 0.5 + UNIFIED_HALF_SEAM_EPS) {
    return FULL_HERO_BAND_RIGHT_CLIP_POLYGON_POINTS;
  }
  if (seamPx >= max - UNIFIED_SOFT_FULL_BLEED_EPS) {
    return DEGEN_HERO_BAND_RIGHT_CLIP_POINTS;
  }

  const seamU =
    typeof rightSeamPx === 'number' && Number.isFinite(rightSeamPx)
      ? (rightSeamPx / W) * VIEWBOX_W
      : ANCHOR_RIGHT_U;

  return BASE_VERTS_RIGHT_U.map(([xu, yu]) => {
    const xOut = xu >= VIEWBOX_W - 1e-6 ? xu : seamU + (xu - ANCHOR_RIGHT_U);
    return `${xOut.toFixed(3)} ${String(yu)}`;
  }).join(' ');
}
